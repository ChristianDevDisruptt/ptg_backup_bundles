/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define([
    'N/search',
    'N/runtime',
    'N/url',
    'N/format',
    'N/ui/message',
    'N/ui/serverWidget'
], function (
    search,
    runtime,
    url,
    format,
    message,
    ui
) {

    const CONST_SCRIPT_S = 'customscript_disa_fecharecepcion_inv_sl';
    const CONST_DEPLOY_S = 'customdeploy_disa_fecharecepcion_sl_imp';

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {

                var invsuccess = context.request.parameters.invsuccess;
                var respuesta = context.request.parameters.message;
                var type = context.request.parameters.type;

                var msgField = context.form.addField({
                    id: 'custpage_drt_customer',
                    label: 'Message',
                    type: ui.FieldType.INLINEHTML
                });

                log.audit({
                    title: 'type',
                    details: JSON.stringify(type)
                });

                if (invsuccess == "true") {
                    msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Actualización Fecha: " + respuesta + " ', type: message.Type.CONFIRMATION}).show({duration: 100000})  });</script>";
                } else if (invsuccess == "false") {
                    msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Actualización Fecha: " + respuesta + " ', type: message.Type.ERROR}).show({duration: 100000})  });</script>";
                } 


                log.audit({
                    title: 'context.type',
                    details: JSON.stringify(context.type)
                });
                
                var context_record = context.newRecord;

                var trandate = context_record.getValue({
                    fieldId: 'trandate'
                });

                var fecha = context_record.getValue({
                    fieldId: 'custbody_drt_fecha_recepcion'
                });

                var terms = context_record.getValue({
                    fieldId: 'terms'
                });

                var memo = context_record.getValue({
                    fieldId: 'custbody_disa_comments'
                });

                log.audit({
                    title: 'Fecha Factura',
                    details: JSON.stringify(trandate)
                });

                var formulario = context.form;
                log.audit('formulario', formulario);

                if (trandate) {
                    var forrmat_trandate = formatDate(trandate, '/', 2, 1, 0, '')
                    var forrmat_now = formatDate('', '/', 2, 1, 0, '')
                    if (
                        forrmat_trandate.mes &&
                        forrmat_now.mes &&
                        (((forrmat_trandate.mes < forrmat_now.mes) && (forrmat_trandate.año == forrmat_now.año)) ||
                        (forrmat_trandate.año < forrmat_now.año))
                    ) {
                        var params = '&custpage_id=' + context.newRecord.id;
                        params += '&custpage_type=' + context.newRecord.type;
                        params += '&custpage_fecha=' + fecha;
                        params += '&custpage_terms=' + terms;
                        params += '&custpage_memo=' + memo;

                        var urlSuiteScript = url.resolveScript({
                            scriptId: CONST_SCRIPT_S,
                            deploymentId: CONST_DEPLOY_S,
                            returnExternalUrl: false
                        });
                        log.audit('SuiteleURL1', urlSuiteScript);
                        urlSuiteScript += params;
                        log.audit('SuiteleURL2', urlSuiteScript);
                        //var funcionFechaRecepcion = "require([], function(){ window.open('" + urlSuiteScript + "', 'width=420,height=230,resizable,scrollbars=yes');});";
                        var funcionFechaRecepcion = "require([], function(){window.open('" + urlSuiteScript + "', '_self');});";
                        formulario.addButton({
                            id: "custpage_btn_fecha_recepcion",
                            label: "DISA - Registrar Fecha Recepción",
                            functionName: funcionFechaRecepcion
                        });
                    } else {
                        returnTransaction = false;
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

    function showmessage(param_message, param_duration, param_show) {
        try {
            if (param_show) {
                var m = {
                    title: "My Title",
                    message: "My Message",
                    cause: 'cause',
                    type: message.Type.CONFIRMATION
                };
                var myMsg = message.create(param_message);

                myMsg.show({
                    duration: param_duration
                });
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options);
            }

        } catch (error) {
            log.error({
                title: 'error showmessage',
                details: JSON.stringify(error)
            });
        }
    }

    function formatDate(param_fecha, separador_destino, lugar_año, luigar_mes, lugar_dia, hora) {
        var respuesta = {
            format: '',
            año: '',
            mes: '',
            dia: '',
        };
        try {
            var objDate = '';
            if (param_fecha) {
                objDate = format.parse({
                    value: param_fecha,
                    type: format.Type.DATE
                });
            } else {
                objDate = new Date();
            }
            var año = objDate.getFullYear() || '';
            var mes = objDate.getMonth() || '';
            var dia = objDate.getDate() || '';
            var arrayFecha = ['', '', '', ];
            arrayFecha[lugar_año] = año;
            arrayFecha[luigar_mes] = mes * 1 + 1 < 10 ? '0' + (mes * 1 + 1) : mes * 1 + 1;
            arrayFecha[lugar_dia] = dia < 10 ? '0' + dia : dia;

            log.audit({
                title: 'fecha1',
                details: ' objDate ' + objDate +
                    ' año ' + año +
                    ' mes ' + mes +
                    ' dia ' + dia
            });
            respuesta.format = arrayFecha[0] + separador_destino + arrayFecha[1] + separador_destino + arrayFecha[2] + hora;
            respuesta.año = año;
            respuesta.mes = mes * 1 + 1;
            respuesta.dia = dia;

        } catch (error) {
            log.error({
                title: 'error fechaSplit',
                details: JSON.stringify(error)
            });
            respuesta = '';
        } finally {
            log.audit({
                title: 'respuesta fechaSplit',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});