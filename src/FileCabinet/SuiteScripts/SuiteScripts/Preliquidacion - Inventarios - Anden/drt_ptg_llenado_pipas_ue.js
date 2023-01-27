/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Llenado Pipas UE
 * Script id: customscript_drt_ptg_llenado_pipas_ue
 * customer Deployment id: customdeploy_drt_ptg_llenado_pipas_ue
 * Applied to: PTG - Llenado de Pipas
 * File: drt_ptg_llenado_pipas_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {

function beforeSubmit(context) {
  try {
    var newRecord = context.newRecord;
      var recId = newRecord.id;

      var numViaje = newRecord.getValue("custrecord_ptg_descarga_llenadopipas_");
      var numViajeSearchObj = search.create({
        type: "customrecord_ptg_llenadodepipas_",
        filters: [],
        columns: []
     });

     var searchResultCount = numViajeSearchObj.runPaged().count;
     log.audit("searchResultCount", searchResultCount);

      if (!numViaje || numViaje == "Por Asignar") {
            var numeroEntero = searchResultCount + 1;
            newRecord.setValue("custrecord_ptg_descarga_llenadopipas_", numeroEntero.toFixed(0));
            newRecord.setValue("name", numeroEntero.toFixed(0));
      }
      
  } catch (e) {
    log.error({
      title: e.name,
      details: e.message,
    });
  }
}


  function afterSubmit(context) {
    
    try {
      var customRec = context.newRecord;
      var recId = customRec.id;
      var vehiculo = customRec.getValue("custrecord_ptg_vehiculo_llenado_pipas_");
      var cantidadLitros = 0;
      var porcentajeDespuesLlenado = customRec.getValue("custrecordptg_porcen_despues_llenado");
      var porcentajeDespues = porcentajeDespuesLlenado / 100;
      var porcentajeAntesLlenado = customRec.getValue("custrecord_ptg_porcentaje_antesllenado_");
      var porcentajeAntes = porcentajeAntesLlenado / 100;
      var porcentaje = porcentajeDespues - porcentajeAntes;
      var numeroViajeLlenadoPipas = customRec.getValue("custrecord_ptg_num_viaje_llenado_pipas_");
      var transaccion = customRec.getValue("custrecord_drt_ptg_transferencia_lp");
      var transacciones = transaccion[0];
      var idTransaccionArray = [];
      var paqueteMySuite = 0;
      var plantillaDocumentoElectronico = 0;
      var metodoDeEnvio = 0;
      var formularioOrdenTraslado = 0;
      var gasLP = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        paqueteMySuite = 2;
        plantillaDocumentoElectronico = 135;
        metodoDeEnvio = 11;
        formularioOrdenTraslado = 313;
        gasLP = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        paqueteMySuite = 2;
        plantillaDocumentoElectronico = 119;
        metodoDeEnvio = 10;
        formularioOrdenTraslado = 266;
        gasLP = 4216;   
      }

      if(!transacciones || transacciones == ""){

      var equipoObj = record.load({
        type: "customrecord_ptg_equipos",
        id: vehiculo,
      });
      var capacidad = equipoObj.getValue("custrecord_ptg_wc_capacity_");
      var ubicacion = equipoObj.getValue("custrecord_ptg_ubicacionruta_");
      var capacidadPF = parseFloat(capacidad);

      var ubicacionObj = record.load({
        type: record.Type.LOCATION,
        id: ubicacion,
      });
      var parent = ubicacionObj.getValue("parent");
      var subsidiary = ubicacionObj.getValue("subsidiary");

      var tablaViajesObj = record.load({
        type: "customrecord_ptg_tabladeviaje_enc2_",
        id: numeroViajeLlenadoPipas,
      });
      var ruta = tablaViajesObj.getValue("custrecord_ptg_ruta");

      cantidadLitros = capacidadPF * porcentaje;

      var recOrdenTraslado = record.create({
        type: record.Type.TRANSFER_ORDER,
        isDynamic: true,
      });

      recOrdenTraslado.setValue("customform", formularioOrdenTraslado);
      recOrdenTraslado.setValue("subsidiary", subsidiary);
      recOrdenTraslado.setValue("location", parent);
      recOrdenTraslado.setValue("transferlocation", ruta);
      recOrdenTraslado.setValue("custbody_ptg_numero_viaje_destino", numeroViajeLlenadoPipas);
      recOrdenTraslado.setValue("custbody_psg_ei_trans_edoc_standard", paqueteMySuite);

      for (var i = 0; i < 1; i++) {
        recOrdenTraslado.selectLine("item", i);
        recOrdenTraslado.setCurrentSublistValue("item", "item", gasLP);
        recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadLitros);
        recOrdenTraslado.commitLine("item");
      }

      var idOrdenTraslado = recOrdenTraslado.save();

      idTransaccionArray.push(idOrdenTraslado);

      if (idOrdenTraslado) {
        var newRecordItemFulfillment = record.transform({
          fromType: record.Type.TRANSFER_ORDER,
          fromId: idOrdenTraslado,
          toType: record.Type.ITEM_FULFILLMENT,
          isDynamic: true,
        });

        newRecordItemFulfillment.setValue("custbody_ptg_numero_viaje_destino", numeroViajeLlenadoPipas);
        newRecordItemFulfillment.setValue("shipstatus", "C");
        newRecordItemFulfillment.setValue("custbody_psg_ei_template", plantillaDocumentoElectronico);
        newRecordItemFulfillment.setValue("custbody_psg_ei_sending_method", metodoDeEnvio);

        var idItemFulfillment = newRecordItemFulfillment.save({
          enableSourcing: false,
          ignoreMandatoryFields: true,
        }) || "";

        idTransaccionArray.push(idItemFulfillment);
      }

      if (idItemFulfillment) {
        var newRecordItemReceipt = record.transform({
          fromType: record.Type.TRANSFER_ORDER,
          fromId: idOrdenTraslado,
          toType: record.Type.ITEM_RECEIPT,
          isDynamic: true,
        });

        var idItemReceipt = newRecordItemReceipt.save({
          enableSourcing: false,
          ignoreMandatoryFields: true,
        }) || "";

        idTransaccionArray.push(idItemReceipt);
      }

      log.audit({
        title: "idTransaccionArray",
        details: JSON.stringify(idTransaccionArray),
      });

      var objUpdate = {
        custrecord_drt_ptg_transferencia_lp: idTransaccionArray,
      };
      record.submitFields({
        id: customRec.id,
        type: customRec.type,
        values: objUpdate,
        options: {
          enableSourcing: false,
          ignoreMandatoryFields: true,
        },
      });
      log.debug({
        title: "Record created successfully",
        details: "Id: " + recId,
      });

      
    }
    } catch (e) {
      log.error({ title: e.name, details: e.message });
    }
  }
  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
  };
});
