/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - TOTAL DE VENTAS EN ANDEN UE
 * Script id: customscript_ptg_total_ventas_anden_ue
 * customer Deployment id: customdeploy_ptg_total_ventas_anden_ue
 * Applied to: PTG - TOTAL DE VENTAS EN ANDEN
 * File: drt_ptg_total_ventas_anden_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/format", 'N/config'], function (record, search, task, format, config) {
  
  function afterSubmit(context){
    try {
      if (context.type == "edit") {
      var newRecord = context.newRecord;
      var idVenta = newRecord.getValue("custrecord_ptg_id_venta");
      var clienteNew = newRecord.getValue("custrecord_ptg_cliente_liq_anden")
      var clienteOld = context.oldRecord.getValue("custrecord_ptg_cliente_liq_anden");

      if(clienteNew != clienteOld){
        var objUpdate = {
          custrecord_ptg_cliente: cliente,
        };
  
        var registroVentaAnden = record.submitFields({
          id: idVenta,
          type: "customrecord_ptg_venta_anden",
          values: objUpdate,
        });
  
        log.debug({
          title: "Record updated successfully",
          details: "Id: " + registroVentaAnden,
        });
      }
    }
        
    } catch (error) {
      log.error("Error afterSubmit", error);
    }
  }
  return {
    afterSubmit: afterSubmit,
  };
});