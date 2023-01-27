/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Trapaso de Envases Inventario UES
 * Script id: customscript_drt_ptg_trasp_env_inv_ue
 * customer Deployment id: customdeploy_drt_ptg_trasp_env_inv_ue
 * Applied to: PTG - Trapaso de Envases Inventario
 * File: drt_ptg_traspaso_envase_inventario_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var ubicacionOrigen = newRecord.getValue("custrecord_ptg_ubicacionorigen_trasp_env");
        var ubicacionDestino = newRecord.getValue("custrecord_ptg_ubicaciondest_trasp_env_");
        var transaccion = newRecord.getValue("custrecord_ptg_transferencia_invent_env");
        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: ubicacionOrigen,
        });
        var subsidiaria = localizacionObj.getValue("subsidiary");
        var lineCount = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_cantidadatraspasar_",});
        var articuloArray = [];
        var cantidadArray = [];
        var formularioOrdenTraslado = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          formularioOrdenTraslado = 313;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioOrdenTraslado = 266;
        }
        
      if(!transaccion){

        for (var l = 0; l < lineCount; l++) {
          articuloArray[l] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_cantidadatraspasar_",
            fieldId: "custrecord_ptg_art_traspaso_inv_",
            line: l,
          });
          cantidadArray[l] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_cantidadatraspasar_",
            fieldId: "custrecord_ptg_cant_a_trasp_env_inv_",
            line: l,
          });
          log.audit("Tanque: L:" + l, articuloArray[l]);
          log.audit("Cantidad: L:" + l, cantidadArray[l]);
        }

        var recOrdenTraslado = record.create({
          type: record.Type.TRANSFER_ORDER,
          isDynamic: true,
        });
  
        recOrdenTraslado.setValue("customform", formularioOrdenTraslado);
        recOrdenTraslado.setValue("subsidiary", subsidiaria);
        recOrdenTraslado.setValue("location", ubicacionOrigen);
        recOrdenTraslado.setValue("transferlocation", ubicacionDestino);
  
        for (var i = 0; i < lineCount; i++) {
          recOrdenTraslado.selectLine("item", i);
          recOrdenTraslado.setCurrentSublistValue("item", "item", articuloArray[i]);
          recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadArray[i]);
          recOrdenTraslado.commitLine("item");
        }

        var idOrdenTraslado = recOrdenTraslado.save({
          enableSourcing: false,
          ignoreMandatoryFields: true,
        }) || "";

        if (idOrdenTraslado) {
          var newRecordItemFulfillment = record.transform({
            fromType: record.Type.TRANSFER_ORDER,
            fromId: idOrdenTraslado,
            toType: record.Type.ITEM_FULFILLMENT,
            isDynamic: true,
          });
          newRecordItemFulfillment.setValue("shipstatus", "C");
  
          var idItemFulfillment = newRecordItemFulfillment.save({
            enableSourcing: false,
            ignoreMandatoryFields: true,
          }) || "";
  
        }

        var objUpdate = {
          custrecord_ptg_transferencia_invent_env: idOrdenTraslado,
          custrecord_ptg_error_trasp_env_: "",
        };
        record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
        });

        log.audit("Orden de traslado creado", idOrdenTraslado);
        log.audit("Ejecucion del pedido", idItemFulfillment);
        log.debug({
          title: "Record created successfully Inventario Tanques",
          details: "Id: " + recId,
        });

      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
      var objUpdateError = {
        custrecord_ptg_error_trasp_env_: e.message,
      };
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdateError,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
  
        var folio = newRecord.getValue("custrecord_ptg_folio_traspaso_");
  
        if (!folio || folio == ""){
          var folioObj = search.create({
            type: "customrecord_ptg_trasenvasesinventario_",
            filters: [],
            columns: []
          });
    
         var folioObjCount = folioObj.runPaged().count;

          var numeroEntero = folioObjCount + 1;
          newRecord.setValue("custrecord_ptg_folio_traspaso_", numeroEntero.toFixed(0));
          newRecord.setValue("name", numeroEntero.toFixed(0));
        }
        
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }
  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
  };
});
