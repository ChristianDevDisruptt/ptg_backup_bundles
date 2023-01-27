/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/search',
    'N/runtime',
    'N/url'
], function (
    search,
    runtime,
    url
) {

    const CONST_SCRIPT_S = 'customscript_wep_sedundas_vueltas_sl';
    const CONST_DEPLOY_S = 'customdeploy_drt_disa_segundas_vueltassl';

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {

                log.audit({
                    title: 'context.type',
                    details: JSON.stringify(context.type)
                });

                var userRol = runtime.getCurrentUser().role;
                log.audit({
                    title: 'userRol',
                    details: JSON.stringify(userRol)
                });
              	var arrayRolSend = [3, 1121, 1228];
                var arrayRolAprob = [3, 1025, 1108, 1123, 1154, 1155, 1156, 1150, 1128, 1151, 1107, 1152, 1130, 1136, 1135, 1137];
                var context_record = context.newRecord;

                var envioWms = context_record.getValue({
                    fieldId: 'custbody_drt_send_wep'
                });

                var responseWms = context_record.getValue({
                    fieldId: 'custbody_drt_response_wms'
                });

                var idTransaccion = context_record.getValue({
                    fieldId: 'id'
                });

                var status = context_record.getValue({
                    fieldId: 'orderstatus'
                })

                log.audit('status', status);


                /*  */
                var numLines = context_record.getLineCount({
                    sublistId: 'item'
                });
                var quantitycommitted = 0;
                for (var i = 0; i < numLines; i++) {
                    quantitycommitted += parseFloat(context_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantitycommitted',
                        line: i
                    }) || 0);
                }
                log.audit({
                    title: 'quantitycommitted',
                    details: JSON.stringify(quantitycommitted)
                });
                /*  */

                if (envioWms && responseWms == 200) {
                    //if (results.length > 0) {
                    var customrecord_disa_drt_segundas_vueltasSearchObj = search.create({
                        type: "customrecord_disa_drt_segundas_vueltas",
                        filters: [
                            ["custrecord_disa_orden_venta", "anyof", idTransaccion]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_disa_orden_venta",
                                label: "Disa - orden de venta"
                            }),
                            search.createColumn({
                                name: "custrecord_disa_item_fulfillment",
                                label: "Disa -  item fulfillment"
                            })
                        ]
                    });

                    var results = customrecord_disa_drt_segundas_vueltasSearchObj.run().getRange({
                        start: 0,
                        end: 999
                    });
                    log.audit('ok', results);

                    var formulario = context.form;

                    log.audit('formulario', formulario);

                    var numeroItemFullFill = 1;
                    var numeroSales = 1;

                    if (results.length > 0) {
                        for (var t = 0; t < results.length; t++) {

                            if (results[t].getValue({
                                    name: 'custrecord_disa_item_fulfillment'
                                }) != "") {
                                numeroItemFullFill++;
                            }

                            if (results[t].getValue({
                                    name: 'custrecord_disa_orden_venta'
                                }) == idTransaccion) {
                                numeroSales++;
                            }
                        }
                        log.audit('numeroItemFullFill', numeroItemFullFill);
                        log.audit('numeroSales', numeroSales);


                        if (
                            (numeroSales == numeroItemFullFill) &&
                            (status == 'E' || status == 'D') &&
                            (numeroItemFullFill <= 10)
                        ) {
                            var params = '&custpage_id=' + context.newRecord.id;
                            params += '&custpage_type=' + context.newRecord.type;
                            params += '&n_Vuelta=' + numeroSales;

                            var urlSuiteScript = url.resolveScript({
                                scriptId: CONST_SCRIPT_S,
                                deploymentId: CONST_DEPLOY_S,
                                returnExternalUrl: false
                            });
                            urlSuiteScript += params;
                            log.audit('itemF', 'si existen itemFulfillment ligados a esta orden de venta');
                            log.audit({
                                title: 'custbody_disa_segunda_vuelta',
                                details: JSON.stringify(context_record.getValue({
                                    fieldId: 'custbody_disa_segunda_vuelta'
                                }))
                            });
                            if (
                                context_record.getValue({
                                    fieldId: 'custbody_disa_segunda_vuelta'
                                }) &&
                                arrayRolSend.indexOf(userRol) >= 0
                            ) {
                                urlSuiteScript += "&param_mode=send";
                                var funcionSegundasVueltas = "require([], function(){window.open('" + urlSuiteScript + "', '_self');});";
                                formulario.addButton({
                                    id: "custpage_btn_segundas_vueltas",
                                    label: "DISA - Enviar Segundas Vueltas" + ' ' + numeroSales,
                                    functionName: funcionSegundasVueltas
                                });
                            } else if (
                                arrayRolAprob.indexOf(userRol) >= 0
                            ) {
                                urlSuiteScript += "&param_mode=update";
                                var funcionSegundasVueltas = "require([], function(){window.open('" + urlSuiteScript + "', '_self');});";
                                formulario.addButton({
                                    id: "custpage_aprobar_segundas_vueltas",
                                    label: "DISA - Solicitar Segundas Vueltas" + ' ' + numeroSales,
                                    functionName: funcionSegundasVueltas
                                });
                            }
                            log.audit({
                                title: 'urlSuiteScript',
                                details: JSON.stringify(urlSuiteScript)
                            });
                        }
                    }
                }

            }

        } catch (error) {
            log.error({
                title: 'error beforeSubmit',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});