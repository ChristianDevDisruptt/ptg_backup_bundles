/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Registro de Servicios Estaciona UE
 * Script id: customscript_drt_ptg_reg_serv_est_ue
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_est_ue
 * Applied to: PTG - Registro de Servicios Estacionario
 * File: drt_ptg_reg_serv_est_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/runtime", 'N/config', "N/format", 'N/https', 'N/url', "N/redirect"], function (record, search, task, runtime, config, format, https, url, redirect) {
  
  function beforeLoad(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var type_interface = runtime.executionContext;
        log.audit("type_interface", type_interface);
        var type_event = context.type;
        log.audit("type_event", type_event);
        var recObj = context.newRecord;
        log.audit("recObj", recObj);
        var form = context.form;
        log.audit("form", form);
        var userRoleId = runtime.getCurrentUser().role;
        log.audit("userRoleId", userRoleId);
        log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "), [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
        var objUpdate = {};
        var estatusEtapa = 0;
        var estatusProcesado = 0;
        var servicioCilindros = 0;
        var servicioEstacionarios = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusEtapa = 1;
          estatusProcesado = 2;
          servicioCilindros = 1;
          servicioEstacionarios = 2;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusEtapa = 1;
          estatusProcesado = 2;
          servicioCilindros = 1;
          servicioEstacionarios = 2;
        }

        if (type_event == "view") {
          var status = newRecord.getValue("custrecord_ptg_etapa_reg_serv_est");
          log.debug("status", status);
          var tipoServicio = newRecord.getValue("custrecord_ptg_tipo_servici_reg_serv_est");
          log.debug("tipoServicio", tipoServicio);
          if (status == estatusEtapa && tipoServicio == servicioCilindros) {
              form.title = "Carga de Servicios de Cilindros";
          } else if (status == estatusEtapa && tipoServicio == servicioEstacionarios) {
            form.title = "Carga de Servicios de Estacionarios";
          } else if (status == estatusProcesado) {
            form.title = "Servicios Procesados";
          }
          
          if (status == estatusEtapa && tipoServicio == servicioCilindros) {
              form.addButton({
                  id: "custpage_drt_to_preliq_est",
                  label: "Preliquidación Cilindros",
                  functionName: "pasarPreliquidacion()",
              });
          }
          if (status == estatusEtapa && tipoServicio == servicioEstacionarios) {
            form.addButton({
                id: "custpage_drt_to_preliq_est",
                label: "Preliquidación Estacionarios",
                functionName: "pasarPreliquidacion()",
            });
        }

          form.clientScriptModulePath = "./drt_ptg_reg_serv_est_cs.js";       

        }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var vehiculo = newRecord.getValue("custrecord_ptg_no_vehiculo_reg_serv_est");
        var numViaje = newRecord.getValue("custrecord_ptg_num_viaje_reg_serv_est");
        var etapa = newRecord.getValue("custrecord_ptg_etapa_reg_serv_est");
        var fechaInicio = newRecord.getValue("custrecord_ptg_fecha_inicio_reg_serv_est");
        log.audit("fechaInicio", fechaInicio);
        var fechaFin = newRecord.getValue("custrecord_ptg_fecha_fin_reg_serv_est");
        log.audit("fechaFin", fechaFin);
        var type_interface = runtime.executionContext;
        log.audit("type_interface", type_interface);
        var type_event = context.type;
        log.audit("type_event", type_event);
        var recObj = context.newRecord;
        log.audit("recObj", recObj);
        var form = context.form;
        log.audit("form", form);
        var userRoleId = runtime.getCurrentUser().role;
        log.audit("userRoleId", userRoleId);
        log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "), [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
        log.debug(["afterSubmit", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "), [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
        var estatusEtapaCarga = 0;
        var estatusEtapaProcesado = 0;
        var estatusEtapaConciliado = 0;
        var busquedaMayor = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusEtapaCarga = 1;
          estatusEtapaProcesado = 2;
          estatusEtapaConciliado = 3;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusEtapaCarga = 1;
          estatusEtapaProcesado = 2;
          estatusEtapaConciliado = 3;
        }

        if(fechaInicio && fechaFin){
          var d = fechaInicio;
          var conf = config.load({
            type: config.Type.USER_PREFERENCES,
          });
          var tz = conf.getValue("DATEFORMAT");
  
          var tmInicio = format.format({
            value: d,
            type: format.Type.DATE,
            timezone: tz,
          });
          log.debug("tmInicio", tmInicio);
  
  
          var e = fechaFin;
  
          var tmFin = format.format({
            value: e,
            type: format.Type.DATE,
            timezone: tz,
          });
          log.debug("tmFin", tmFin);
        }

        


        if(etapa == estatusEtapaConciliado){

          //SS: PTG - Registro Conciliacion Esta
          var recConciliarEstaObj = search.create({
            type: "customrecord_ptg_registro_servicios_es_l",
            filters: [
              ["custrecord_ptg_ruta_sin_conciliar_2","anyof",vehiculo],  "AND", 
              ["custrecord_ptg_sgcloc_fecha_2_","within",tmInicio, tmFin], "AND", 
              ["custrecord_ptg_oportun_reg_serv_est_lin","anyof","@NONE@"], "AND", 
              ["custrecord_ptg_transa_reg_serv_est_lin","anyof","@NONE@"]
              //["custrecord_ptg_sgcloc_fecha_2_","within","1/9/2022","1/9/2022"]
            ],
            columns: [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "custrecord_ptg_ruta_sin_conciliar_2", label: "PTG - Ruta"}),
               search.createColumn({name: "custrecord_ptg_sgcloc_fecha_2_", label: "PTG - Fecha sin conciliar"})
            ]
          });
          log.audit("recConciliarEstaObj", recConciliarEstaObj);
          var busquedaMayor = recConciliarEstaObj.runPaged().count;
          log.debug("busquedaMayor", busquedaMayor);

          //SS: PTG - Registro Conciliacion Esta Sumas
          var conciliacionSumaObj = search.create({
            type: "customrecord_ptg_registro_servicios_es_l",
            filters: [
               ["custrecord_ptg_ruta_sin_conciliar_2","anyof",vehiculo], "AND", 
               ["custrecord_ptg_sgcloc_fecha_2_","within",tmInicio,tmFin], "AND", 
               ["custrecord_ptg_oportun_reg_serv_est_lin","anyof","@NONE@"], "AND", 
               ["custrecord_ptg_transa_reg_serv_est_lin","anyof","@NONE@"]
            ],
            columns: [
               search.createColumn({name: "custrecord_ptg_cantidad_reg_serv_est_lin", summary: "SUM", label: "PTG - Cantidad"}),
               search.createColumn({name: "custrecord_ptg_total_reg_serv_est_lin", summary: "SUM", label: "PTG - Total"})
            ]
          });
          var conciliacionSumaObjResult = conciliacionSumaObj.run().getRange({
            start: 0,
            end: 3,
          });
          log.emergency("conciliacionSumaObjResult", conciliacionSumaObjResult);
          (sumaLitros = conciliacionSumaObjResult[0].getValue({name: "custrecord_ptg_cantidad_reg_serv_est_lin", summary: "SUM", label: "PTG - Cantidad"}));
          (sumaTotal = conciliacionSumaObjResult[0].getValue({name: "custrecord_ptg_total_reg_serv_est_lin", summary: "SUM", label: "PTG - Total"}));

          var registroUpd = record.submitFields({
            type: recObj.type,
            id: recObj.id,
            values: {
              custrecord_ptg_litros_acumu_reg_serv_est: sumaLitros,
              custrecord_ptg_est_cant_servicios: busquedaMayor,
              custrecord_ptg_est_total_servicios : sumaTotal,
            }
          });

          log.audit("registroUpd", registroUpd);

  
          if(busquedaMayor > 0){
            log.audit("af");
            for(var i = 0; i < busquedaMayor; i++){
                log.audit("*****Entra implementacion "+i+"*****", "*****Entra implementacion "+i+"*****");
                var parametros = {
                    'recId': recId,
                    'vehiculo': vehiculo,
                    'fechaInicio': tmInicio,
                    'fechaFin': tmFin,
                    'incremento_inicio': i,
                };
                log.audit("parametros", parametros);
  
                var redirectToStl = redirect.toSuitelet({
                    scriptId: "customscript_drt_ptg_reg_serv_est_sl",
                    deploymentId: "customdeploy_drt_ptg_reg_serv_est_sl",
                    parameters: parametros
                });
                log.audit("redirectToStl", redirectToStl);
            }            
          }
        }

        
        else if (etapa == estatusEtapaCarga) {
          log.debug("pasa");
        var mrTask = task.create({
          taskType: task.TaskType.MAP_REDUCE,
          scriptId: 'customscript_drt_ptg_reg_serv_est_mr',
          params: {
            custscript_drt_ptg_vehiculo_serv_est: vehiculo,
            custscript_drt_ptg_num_viaje_serv_est: numViaje,
            custscript_drt_ptg_id_registro_serv_est: recId,
          }
        });
        var mrTaskId = mrTask.submit();
        var taskStatus = task.checkStatus(mrTaskId);
        log.audit({title: 'taskStatus', details: JSON.stringify(taskStatus)});
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
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var numViaje = newRecord.getValue("custrecord_ptg_folio_reg_serv_est");
        var numViajeSearchObj = search.create({
          type: "customrecord_ptg_registro_servicios_esta",
          filters:[],
          columns:[]
       });
  
       var searchResultCount = numViajeSearchObj.runPaged().count;
       log.audit("searchResultCount", searchResultCount);
  
        if (!numViaje || numViaje == "") {
              var numeroEntero = searchResultCount + 1;
              log.audit("numeroEntero", numeroEntero);
              newRecord.setValue("custrecord_ptg_folio_reg_serv_est", numeroEntero.toFixed(0));
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
    beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
  };
});
