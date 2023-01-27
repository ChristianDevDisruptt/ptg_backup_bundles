/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Consumo Interno de Combustible UE
 * Script id: customscript_drt_ptg_cons_int_comb_ue
 * customer Deployment id: customdeploy_drt_ptg_cons_int_comb_ue
 * Applied to: PTG - Consumo Interno de Combustible
 * File: drt_ptg_cons_int_comb_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task"], function (record, search, task) {

  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        log.audit("recId", recId);
        var mrTask = task.create({
          taskType: task.TaskType.MAP_REDUCE,
          scriptId: 'customscript_drt_ptg_cons_int_comb_mr',
          params: {
            custscript_drt_ptg_id_reg_cons_comb: recId,
          }
        });
        var mrTaskId = mrTask.submit();
        var taskStatus = task.checkStatus(mrTaskId);
        log.audit({title: 'taskStatus', details: JSON.stringify(taskStatus)});
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var numViaje = newRecord.getValue("custrecord_ptg_consumo_");
        var numViajeSearchObj = search.create({
          type: "customrecord_ptg_consumo_interno_de_gas_",
          filters: [],
          columns: []
       });
  
       var searchResultCount = numViajeSearchObj.runPaged().count;
       log.audit("searchResultCount", searchResultCount);
  
        if (!numViaje || numViaje == "") {
              var numeroEntero = searchResultCount + 1;
              log.audit("numeroEntero", numeroEntero);
              newRecord.setValue("custrecord_ptg_consumo_", numeroEntero.toFixed(0));
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
