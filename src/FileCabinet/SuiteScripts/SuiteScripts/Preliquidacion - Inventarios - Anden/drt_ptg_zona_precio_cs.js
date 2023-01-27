/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Zonas de Precio CS
 * Script id: customscript_drt_ptg_zona_precio_cs
 * customer Deployment id: customdeploy_drt_ptg_zona_precio_cs
 * Applied to: PTG - Zonas de Precio
 * File: drt_ptg_zona_precio_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog",], function (record, search, error, runtime, dialog) {
  function fieldChanged(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistFieldName = context.fieldId;
      var nombre = currentRecord.getText("name");
      if (nombre && sublistFieldName == "name") {
        currentRecord.setText("custrecord_ptg_territorio_", nombre);
      }
    } catch (error) {
      log.audit({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }

  return {
    fieldChanged: fieldChanged,
  };
});
