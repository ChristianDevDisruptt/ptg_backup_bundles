/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Registro de salida de Pipas UE
 * Script id: customscript_drt_ptg_salida_pipas_ue
 * customer Deployment id: customdeploy_drt_ptg_salida_pipas_ue
 * Applied to: PTG - Registro de salida de Pipas
 * File: drt_ptg_salida_pipas_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/config', 'N/format'], function (record, search, runtime, https, url, config, format) {
    function beforeSubmit(context) {
        try {
          var newRecord = context.newRecord;
            var recId = newRecord.id;
      
            var numViaje = newRecord.getValue("custrecord_ptg_foliosalidapipas_");
            var numViajeSearchObj = search.create({
              type: "customrecord_ptg_registro_salida_pipas_",
              filters:[],
              columns:[]
           });
      
           var searchResultCount = numViajeSearchObj.runPaged().count;
           log.audit("searchResultCount", searchResultCount);
      
            if (!numViaje || numViaje == "Por Asignar") {
                  var numeroEntero = searchResultCount + 1;
                  newRecord.setValue("custrecord_ptg_foliosalidapipas_", numeroEntero.toFixed(0));
                  newRecord.setValue("name", numeroEntero.toFixed(0));
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
            if (context.type == "create") {
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numeroViaje = customRec.getValue("custrecord_ptg_numviaje_salida_pipa");
                var objField = {};
                log.audit("numeroViaje", numeroViaje);
                log.audit("horaSalida", horaSalida);
                var turnoMatutino = 0;
                var turnoVespertino = 0;
                if (runtime.envType === runtime.EnvType.SANDBOX) {
                    turnoMatutino = 1;
                    turnoVespertino = 2;
                } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                    turnoMatutino = 1;
                    turnoVespertino = 2;
                }

                var d = new Date();

                var tme = format.format({
                    value: d,
                    type: format.Type.DATETIME,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY,
                });
                log.debug("tme", tme);

                var horaSalida = tme.slice(-2);

                if(horaSalida == "am"){
                    log.audit("horario am", horaSalida);
                    objField.custrecord_ptg_turno = turnoMatutino;
                }
                if(horaSalida == "pm"){
                    log.audit("horario pm", horaSalida);
                    objField.custrecord_ptg_turno = turnoVespertino;
                }

                record.submitFields({
                    id: numeroViaje,
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    values: objField,
                });

                
            }
        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }
    
    return {
        //beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit,
    };
});