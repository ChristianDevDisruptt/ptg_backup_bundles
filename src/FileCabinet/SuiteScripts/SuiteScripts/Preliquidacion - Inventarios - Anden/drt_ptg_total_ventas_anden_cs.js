/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - TOTAL DE VENTAS EN ANDEN CS
 * Script id: customscript_ptg_total_ventas_anden_cs
 * customer Deployment id: customdeploy_ptg_total_ventas_anden_cs
 * Applied to: PTG - TOTAL DE VENTAS EN ANDEN
 * File: drt_ptg_total_ventas_anden_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var cliente = currentRecord.getValue("custrecord_ptg_cliente_liq_anden");
      log.audit("cliente", cliente);

      if (cliente && fieldName === "custrecord_ptg_cliente_liq_anden") {
            var entityObj = record.load({
              type: record.Type.CUSTOMER,
              id: cliente,
            });
            var direccion = entityObj.getValue("defaultaddress");
            currentRecord.setValue("custrecord_ptg_direccion_embar_liq_anden", direccion);
      }

    }

  return {
    fieldChanged: fieldChanged,
  };
});