/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Traspaso de entrada en Est Carb UE
 * Script id: customscript_drt_traspaso_entrad_carb_ue
 * customer Deployment id: customdeploy_drt_traspaso_entrad_carb_ue
 * Applied to: PTG - Traspaso de entrada en Est Carb
 * File: drt_ptg_traspaso_entrada_carb_ue.js
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
        var estacion = newRecord.getValue("custrecord_ptg_est_dot_est_carb_");
        var pipa = newRecord.getValue("custrecord_ptg_pipa_dot_est_carb_");
        var litros = newRecord.getValue("custrecord_ptg_litros_recibidos_");
        var transaccion = newRecord.getValue("custrecord_ptg_transferencia_inv");
        var notaConsumo = newRecord.getValue("custrecord_ptg_nota_de_consumo_");
        var articulo = 0;
        var formularioTransferenciaInventario = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          articulo = 4088;
          formularioTransferenciaInventario = 306;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          articulo = 4216;
          formularioTransferenciaInventario = 57;
        }

      if(!transaccion){
        var pipaObj = record.load({
          type: "customrecord_ptg_equipos",
          id: pipa,
        });
        var ubicacionOrigen = pipaObj.getValue("custrecord_ptg_ubicacionruta_");
        var subsidiariaOrigen = pipaObj.getValue("custrecord_ptg_subsidiaria_1");
        log.audit("ubicacionOrigen", ubicacionOrigen);
        log.audit("subsidiariaOrigen", subsidiariaOrigen);

        var recInvent = record.create({
          type: "inventorytransfer",
          isDynamic: true,
        });
        recInvent.setValue("customform", formularioTransferenciaInventario);
        recInvent.setValue("subsidiary", subsidiariaOrigen);
        recInvent.setValue("location", ubicacionOrigen);
        recInvent.setValue("transferlocation", estacion);
        recInvent.setValue("memo", notaConsumo);

        for (var k = 0; k < 1; k++) {
          recInvent.selectLine("inventory", k);
          recInvent.setCurrentSublistValue("inventory", "item", articulo);
          recInvent.setCurrentSublistValue("inventory", "adjustqtyby", litros);
          recInvent.commitLine("inventory");
        }
        var idInventoryTransfer = recInvent.save();
        var objUpdate = {
          custrecord_ptg_transferencia_inv: idInventoryTransfer,
          custrecord_error_dot_est_carb_: "",
        };
        record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
        });
        log.audit("Inventory creado", idInventoryTransfer);
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
      var objUpdateError = {
        custrecord_error_dot_est_carb_: e.message,
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
