/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Traspaso de Gas UE
 * Script id: customscript_drt_ptg_trasp_gas_ue
 * customer Deployment id: customdeploy_drt_ptg_trasp_gas_ue
 * Applied to: PTG-Trasp de Gas a andén a final de día
 * File: drt_ptg_traspaso_gas_ue.js
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
        var ubicacionOrigen = newRecord.getValue("custrecord_ptg_ubiorigen_trasp_gas_");
        var ubicacionDestino = newRecord.getValue("custrecord_ptg_ubidest_trasp_gas_");
        var transaccion = newRecord.getValue("custrecord_ptg_transferencia_inv_tdg");
        var gasLP = 0;
        
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          gasLP = 4088;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          gasLP = 4216;
        }

        
        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: ubicacionOrigen,
        });
        var subsidiaria = localizacionObj.getValue("subsidiary");
        log.audit("subsidiaria", subsidiaria);
        var lineCount = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_traspdet_",});
        log.audit("lineCount", lineCount);
        var cantidadArray = 0;
        var cantidadTotal = 0;

      
        for (var l = 0; l < lineCount; l++) {
          cantidadArray = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_traspdet_",
            fieldId: "custrecord_ptg_ltstraspgas_",
            line: l,
          });
          cantidadTotal += cantidadArray;
        }

        log.audit("cantidadTotal", cantidadTotal);

        if(!transaccion){

        var recTransferenciaInventario = record.create({
          type: "inventorytransfer",
          isDynamic: true,
        });

        recTransferenciaInventario.setValue("subsidiary", subsidiaria);
        recTransferenciaInventario.setValue("location", ubicacionOrigen);
        recTransferenciaInventario.setValue("transferlocation", ubicacionDestino);

        for (var k = 0; k < 1; k++) {
          recTransferenciaInventario.selectLine("inventory", k);
          recTransferenciaInventario.setCurrentSublistValue("inventory", "item", gasLP);
          recTransferenciaInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadTotal);
          recTransferenciaInventario.commitLine("inventory");
        }

        var idTransferenciaInventario = recTransferenciaInventario.save();

        var objUpdate = {
          custrecord_ptg_foliotraspgas_: recId,
          custrecord_ptg_transferencia_inv_tdg: idTransferenciaInventario,
          custrecord_ptg_error_trasp_gas_: "",
        };
        record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
        });

        log.audit("Transferencia de Inventario creado", idTransferenciaInventario);
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
        custrecord_ptg_foliotraspgas_: recId,
        custrecord_ptg_error_trasp_gas_: e.message,
      };
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdateError,
      });
    }
  }

  return {
    afterSubmit: afterSubmit,
  };
});
