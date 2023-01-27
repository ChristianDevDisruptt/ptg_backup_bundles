/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 09/2022
 * Script name: PTG - Registro de Servicios Estaciona SL
 * Script id: customscript_drt_ptg_reg_serv_est_sl
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_est_sl
 * Applied to:
 * File: drt_ptg_reg_serv_est_sl.js
 ******************************************************************/
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
 define(['N/search', 'N/record', 'N/ui/message', 'N/ui/dialog', 'N/task', 'N/runtime', "N/redirect", "N/log", "N/url"], function (search, record, message, dialog, task, runtime, redirect, log, url) {
    function onRequest(context) {
        try {
            var req_param = context.request.parameters;
            log.audit("req_param", req_param);

            log.audit("afterSubmit");
            var recId = req_param.recId;
            log.audit("recId", recId);
            var vehiculo = req_param.vehiculo;
            log.audit("vehiculo", vehiculo);
            var fechaInicio = req_param.fechaInicio;
            log.audit("fechaInicio", fechaInicio);
            var fechaFin = req_param.fechaFin;
            log.audit("fechaFin", fechaFin);
            var incremento_inicio = req_param.incremento_inicio;
            log.audit("incremento_inicio", incremento_inicio);
            
            log.audit('Remaining Usage start proceso', runtime.getCurrentScript().getRemainingUsage());

            if (runtime.envType === runtime.EnvType.SANDBOX) {
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            }

            //BÚSQUEDA GUARDADA: PTG - Registro Conciliacion Esta
            var conciliarServSearch = search.create({
                type: "customrecord_ptg_registro_servicios_es_l",
                filters: [
                    ["custrecord_ptg_ruta_sin_conciliar_2","anyof",vehiculo], "AND", 
                    ["custrecord_ptg_sgcloc_fecha_2_","within",fechaInicio,fechaFin], "AND", 
                    ["custrecord_ptg_oportun_reg_serv_est_lin","anyof","@NONE@"], "AND", 
                    ["custrecord_ptg_transa_reg_serv_est_lin","anyof","@NONE@"]
                ],
                columns: [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "custrecord_ptg_ruta_sin_conciliar_2", label: "PTG - Ruta"}),
                    search.createColumn({name: "custrecord_ptg_sgcloc_fecha_2_", label: "PTG - Fecha sin conciliar"})
                ]
            });
            var conciliarServSearchCount = conciliarServSearch.runPaged().count;
            log.emergency("conciliarServSearchCount", conciliarServSearchCount);
            var conciliarServSearchResult = conciliarServSearch.run().getRange({
                start: 0,
                end: conciliarServSearchCount,
            });
            log.emergency("conciliarServSearchResult", conciliarServSearchResult);
            if(incremento_inicio < conciliarServSearchCount){
                (idRegistroServConcil = conciliarServSearchResult[incremento_inicio].getValue({name: "internalid", label: "Internal ID"}));
                var recLineaUpd = record.submitFields({
                    type: "customrecord_ptg_registro_servicios_es_l",
                    id: idRegistroServConcil,
                    values: {
                        custrecord_ptg_id_reg_serv_est_lin: recId,
                    }
                });
                log.debug("Registro Linea Actualizado: ", recLineaUpd);
            }
            log.audit('Remaining Usage end proceso', runtime.getCurrentScript().getRemainingUsage());

            if(incremento_inicio != 0){
                var nuevoIncremento = incremento_inicio - 1;
                log.audit("nuevoIncremento", nuevoIncremento);
                var parametros2 = {
                    'recId': recId,
                    'vehiculo': vehiculo,
                    'fechaInicio': fechaInicio,
                    'fechaFin': fechaFin,
                    'incremento_inicio': nuevoIncremento
                };
                log.audit("parametros2", parametros2);
    
                var redirectToStl2 = redirect.toSuitelet({
                    scriptId: "customscript_drt_ptg_reg_serv_est_sl",
                    deploymentId: "customdeploy_drt_ptg_reg_serv_est_sl",
                    parameters: parametros2
                });
                log.audit("redirectToStl2", redirectToStl2);
            } else {
                log.audit("el incremento es ", incremento_inicio);
                redirect.toRecord({
                    type: 'customrecord_ptg_registro_servicios_esta',
                    id: recId,
                    isEditMode: true,
                    parameters: {}
                });
            }
           
        } catch (error) {
            log.error("error onRequest", error);
            redirect.toRecord({
                type: 'customrecord_ptg_registro_servicios_esta',
                id: recId,
                isEditMode: true,
                parameters: {}
            });
        }
    }

    return {
        onRequest: onRequest
    }
});