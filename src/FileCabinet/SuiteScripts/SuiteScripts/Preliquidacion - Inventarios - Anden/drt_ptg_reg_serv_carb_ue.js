/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Registro de Servicios Carbura UE
 * Script id: customscript_drt_ptg_reg_serv_carb_ue
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_carb_ue
 * Applied to: PTG - Registro de Servicios Carburación
 * File: drt_ptg_reg_serv_carb_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/runtime"], function (record, search, task, runtime) {
  
  function beforeLoad(context) {
    try {
        var newRecord = context.newRecord;
        var type_event = context.type;
        var form = context.form;
        var recId = newRecord.id;
        var objUpdate = {};

        if (type_event == "view") {
          var status = newRecord.getValue("custrecord_ptg_etapa_reg_serv_carb");
          log.debug("status", status);
          var estatusEtapa = 0;
          if (runtime.envType === runtime.EnvType.SANDBOX) {
            estatusEtapa = 1;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            estatusEtapa = 1;
          }
          
          if (status == estatusEtapa) {
              form.addButton({
                  id: "custpage_drt_to_preliq_carb",
                  label: "Preliquidación Carburacion",
                  functionName: "pasarPreliquidacion()",
              });
          }      

        } else if(type_event == "create" || type_event == "edit"){
          form.addButton({
            id: "custpage_drt_to_nuevo_cliente",
            label: "Registrar Nuevo Cliente",
            functionName: "redirectToCreateCustomer()",
          });
        }

        form.clientScriptModulePath = "./drt_ptg_reg_serv_carb_cs.js"; 
    } catch (e) {
      log.error({
        title: "beforeLoad error "+e.name,
        details: e.message,
      });
    }
  }

  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var estacionCarburacion = newRecord.getValue("custrecord_ptg_estacion_reg_serv_carb")
        var etapa = newRecord.getValue("custrecord_ptg_etapa_reg_serv_carb");
        var estatusEtapaProcesado = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusEtapaProcesado = 2;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusEtapaProcesado = 2;
        }
        log.audit("recId", recId);
        log.audit("etapa", etapa);
        if (etapa != estatusEtapaProcesado) {
          log.debug("pasa");
        var mrTask = task.create({
          taskType: task.TaskType.MAP_REDUCE,
          scriptId: 'customscript_drt_ptg_reg_serv_carb_mr',
          params: {
            custscript_drt_ptg_id_estacion_serv_carb: estacionCarburacion,
            custscript_drt_ptg_id_registro_serv_carb: recId,
          }
        });
        var mrTaskId = mrTask.submit();
        var taskStatus = task.checkStatus(mrTaskId);
        log.audit({title: 'taskStatus', details: JSON.stringify(taskStatus)});
      }
    } catch (e) {
      log.error({
        title: "afterSubmit error "+e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var folio = newRecord.getValue("custrecord_ptg_folio_reg_serv_carb");
        var folioObj = search.create({
          type: "customrecord_ptg_registro_servicios_carb",
          filters: [],
          columns: []
       });

       var folioObjCount = folioObj.runPaged().count;
       log.audit("folioObjCount", folioObjCount);
  
        if (!folio || folio == "") {
              var numeroEntero = folioObjCount + 1;
              log.audit("numeroEntero", numeroEntero);
              newRecord.setValue("custrecord_ptg_folio_reg_serv_carb", numeroEntero.toFixed(0));
              newRecord.setValue("name", numeroEntero.toFixed(0));
        }
        
    } catch (e) {
      log.error({
        title: "beforeSubmit error "+e.name,
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
