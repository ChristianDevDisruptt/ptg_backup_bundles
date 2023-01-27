/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Colonias y rutas CS
 * Script id: customscript_drt_ptg_colonias_rutas_cs
 * customer Deployment id: customdeploy_drt_ptg_colonias_rutas_cs
 * Applied to: PTG - Asignación de colonias a rutas
 * File: drt_ptg_colonias_rutas_cs.js
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
      var colonia = currentRecord.getText("custrecord_ptg_nombrecolonia_");
      if (colonia && sublistFieldName == "custrecord_ptg_nombrecolonia_") {
        currentRecord.setText("name", colonia);
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
