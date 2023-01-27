/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Aportar cilindros a camión UE
 * Script id: customscript_drt_ptg_aport_cil_cam_ue
 * customer Deployment id: customdeploy_drt_ptg_aport_cil_cam_ue
 * Applied to: PTG-Aportar cil desde est carb a camión
 * File: drt_ptg_aport_cil_cam_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
  function beforeLoad(scriptContext) {
    try {
        var customRec = scriptContext.newRecord;
        var recId = customRec.id;
        var type_event = scriptContext.type;
        var recObj = scriptContext.newRecord;
        var form = scriptContext.form;
        var numRecarga = customRec.getValue("custrecord_ptg_numderecarga_");

        //BÚSQUEDA GUARDADA: PTG - Aportar cilindros a camión Num Consec
        var aportarCilindrosObj = search.create({
          type: "customrecord_ptg_aportarcil_a_camion_",
          filters: [
            ["custrecord_ptg_numderecarga_","isnotempty",""]
          ],
          columns: [
             search.createColumn({name: "custrecord_ptg_numderecarga_",sort: search.Sort.ASC,label: "PTG - Número de recarga"})
          ]
       });
       var searchResultCount = aportarCilindrosObj.runPaged().count;
       log.debug("aportarCilindrosObj result count",searchResultCount);
       var srchResults = aportarCilindrosObj.run().getRange({
         start: 0,
         end: 2,
        });
        log.audit("srchResults", srchResults);
        if(searchResultCount > 0){
          numeroBusqueda = srchResults[0].getValue({
            name: "custrecord_ptg_numderecarga_",sort: search.Sort.ASC,label: "PTG - Número de recarga"
          });
            log.audit("Numero Viaje Obtenido", numeroBusqueda);
            numeroEntero = parseInt(numeroBusqueda);
            log.audit("numeroEntero", numeroEntero);
            if (!numRecarga) {
              if (numeroEntero) {
                  numeroEntero = searchResultCount + 1;
                  log.audit("numeroEntero else", numeroEntero);
                  customRec.setValue("custrecord_ptg_numderecarga_", numeroEntero.toString());
              } else {
                  log.audit("no hay registros");
                  customRec.setValue("custrecord_ptg_numderecarga_", "1");
              }
            }
       } else {
          customRec.setValue("custrecord_ptg_numderecarga_", "1");
       }

    } catch (error) {
        log.error("ERROR", error);
    }
}


  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var estacion = newRecord.getValue("custrecord_ptg_estacion_aportacionacamio");
        var vehiculo = newRecord.getValue("custrecord_ptg_aport_a_camion_");
        var numViaje = newRecord.getValue("custrecord_ptg_numviaje_aportaracamion_");
        var transferenciaCreada = newRecord.getValue("custrecord_ptg_transaccion_traslado_carb");
        var articuloArray = [];
        var cantidadArray = [];
        var idTransaccionArray = [];
        log.audit("estacion", estacion);
        log.audit("vehiculo", vehiculo);
        log.audit("numViaje", numViaje);
        log.audit("transferenciaCreada", transferenciaCreada);
        var transferenciaCreadaCero = transferenciaCreada[0];
        log.audit("transferenciaCreadaCero", transferenciaCreadaCero);

        var formularioCarburacion = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          formularioCarburacion = 313;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioCarburacion = 266;
        }

        if(!transferenciaCreadaCero){
          var localizacionObj = record.load({
            type: record.Type.LOCATION,
            id: estacion,
          });
          var subsidiaria = localizacionObj.getValue("subsidiary");
          log.audit("subsidiaria", subsidiaria);
  
          var equipoObj = record.load({
            type: 'customrecord_ptg_equipos',
            id: vehiculo,
          });
          var ubicacionDestino = equipoObj.getValue("custrecord_ptg_ubicacionruta_");
          log.audit("ubicacionDestino", ubicacionDestino);
  
          var lineDetalleAportacion = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_detalle_aportacion_a_cam_",});
  
          for (var i = 0; i < lineDetalleAportacion; i++) {
            articuloArray[i] = newRecord.getSublistValue({
              sublistId: "recmachcustrecord_ptg_detalle_aportacion_a_cam_",
              fieldId: "custrecord_ptg_tipoenvase_aportacionacam",
              line: i,
            });
            log.audit("articuloArray "+i, articuloArray[i]);
  
            cantidadArray[i] = newRecord.getSublistValue({
              sublistId: "recmachcustrecord_ptg_detalle_aportacion_a_cam_",
              fieldId: "custrecord_ptg_cantidad_a_",
              line: i,
            });
            log.audit("cantidadArray "+i, cantidadArray[i]);
          }
  
          var recOrdenTraslado = record.create({
            type: record.Type.TRANSFER_ORDER,
            isDynamic: true,
          });
  
          recOrdenTraslado.setValue("customform", formularioCarburacion);
          recOrdenTraslado.setValue("subsidiary", subsidiaria);
          recOrdenTraslado.setValue("location", estacion);
          recOrdenTraslado.setValue("transferlocation", ubicacionDestino);
          recOrdenTraslado.setValue("custbody_ptg_numero_viaje_destino", numViaje);
  
          for (var j = 0; j <lineDetalleAportacion; j++){
            recOrdenTraslado.selectLine("item", j);
            recOrdenTraslado.setCurrentSublistValue("item", "item", articuloArray[j]);
            recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadArray[j]);
            recOrdenTraslado.commitLine("item");
          }
  
          var idOrdenTraslado = recOrdenTraslado.save();
          log.audit("Orden de Traslado Creada", idOrdenTraslado);
          idTransaccionArray.push(idOrdenTraslado);
  
            if(idOrdenTraslado){
              var ejecucionPedidoObj = record.transform({
                fromType: record.Type.TRANSFER_ORDER,
                fromId: idOrdenTraslado,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true
              });
  
              ejecucionPedidoObj.setValue("shipstatus", "C");
      
              var ejecucionPedidoObjID = ejecucionPedidoObj.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
              }) || "";
              log.debug("Ejecucion del pedido creada", ejecucionPedidoObjID);
  
              idTransaccionArray.push(ejecucionPedidoObjID);
            }
  
            if (ejecucionPedidoObjID) {
              var newRecordItemReceipt = record.transform({
                fromType: record.Type.TRANSFER_ORDER,
                fromId: idOrdenTraslado,
                toType: record.Type.ITEM_RECEIPT,
                isDynamic: true,
                ignoreMandatoryFields: true,
              });
  
              newRecordItemReceipt.setValue("location", ubicacionDestino);
  
              var idItemReceipt = newRecordItemReceipt.save({
                enableSourcing: false,
                ignoreMandatoryFields: true,
              }) || "";
  
              log.debug("idItemReceipt", idItemReceipt);
  
              idTransaccionArray.push(idItemReceipt);
            }
  
            log.audit({
              title: "idTransaccionArray",
              details: JSON.stringify(idTransaccionArray),
            });
  
            var objUpdate = {
              custrecord_ptg_transaccion_traslado_carb: idTransaccionArray,
            };
            record.submitFields({
              id: newRecord.id,
              type: newRecord.type,
              values: objUpdate,
            });
            log.debug({
              title: "Record created successfully",
              details: "Id: " + recId,
            });
        }
        
  

    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
        var numeroRecarga = newRecord.getValue("custrecord_ptg_numderecarga_");

        var numViajeSearchObj = search.create({
          type: "customrecord_ptg_aportarcil_a_camion_",
          filters: [],
          columns: []
       });

       var searchResultCount = numViajeSearchObj.runPaged().count;
       log.audit("searchResultCount", searchResultCount);

        if (!numeroRecarga || numeroRecarga != "Por Asignar") {
              var numeroEntero = searchResultCount + 1;
              newRecord.setValue("custrecord_ptg_numderecarga_", numeroEntero);
              newRecord.setValue("name", numeroEntero.toFixed(0));
        }
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
    beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
  };
});
