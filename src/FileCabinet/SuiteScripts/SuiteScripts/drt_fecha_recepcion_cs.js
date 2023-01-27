/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
    'N/ui/message',
    'N/ui/dialog',
    'N/format',
    'N/search',
    'N/record'
], function (
    message,
    dialog,
    format,
    search,
    record
) {
    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            debugger;
            if (
                !sublistName &&
                (
                    sublistFieldName === 'custbody_drt_fecha_recepcion' ||
                    sublistFieldName === 'terms'
                )
            ) {

                var resepcion = currentRecord.getValue('custbody_drt_fecha_recepcion');
                var idCustomer = currentRecord.getValue('entity');

                var termsCustomer = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: idCustomer,
                    columns: ['terms']
                }) || '';

                if (
                    termsCustomer &&
                    resepcion
                ) {
                    var valueTermsCustomer = currentRecord.getValue('terms') || termsCustomer.terms[0].value;
                    var finalTermsCustomer = search.lookupFields({
                        type: record.Type.TERM,
                        id: valueTermsCustomer,
                        columns: ['daysuntilnetdue']
                    }) || '';

                    if (finalTermsCustomer) {
                        var Numerodias = finalTermsCustomer.daysuntilnetdue;
                        var diaSeleccionado = new Date(resepcion);
                        var formatoDiasN = parseInt(Numerodias);
                        diaSeleccionado.setDate(diaSeleccionado.getDate() + formatoDiasN);

                        if (resepcion) {
                            currentRecord.setValue({
                                fieldId: 'duedate',
                                value: diaSeleccionado,
                                ignoreFieldChange: true
                            });
                        }
                    }
                }
            }
        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        }
    }

    function validateField(context) {
        try {
            var respuesta = true;
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var line = context.line;
            if (
                !sublistName &&
                sublistFieldName == 'custbody_drt_fecha_recepcion'
            ) {
              	log.audit({
                        title: 'Se modificó Cambio Fecha',
                        details: 'Cambio Fecha'
                    });
                debugger;
                var fecha_recepcion = currentRecord.getValue({
                    fieldId: 'custbody_drt_fecha_recepcion'
                }) || '';
              	var fecha_trandate = currentRecord.getValue({
                    fieldId: 'trandate'
                }) || '';
                if (fecha_recepcion) {
                  	log.audit({
                        title: 'Inicia Valida Fecha Recep',
                        details: JSON.stringify(fecha_recepcion)
                    });
                  	var fechaact = formatDate('', '-', 2, 1, 0, '');
                  	var fecharep = formatDate(fecha_recepcion, '-', 2, 1, 0, '');
                    var fechafac = formatDate(fecha_trandate, '-', 2, 1, 0, '');
                  	var valid_date = false;
                	var frep = new Date(fecharep.año,(fecharep.mes-1),fecharep.dia);
                	var ffac = new Date(fechafac.año,(fechafac.mes-1),fechafac.dia);
                	var fact = new Date(fechaact.año,(fechaact.mes-1),fechaact.dia);
                    if( frep.valueOf() > ffac.valueOf() && frep.valueOf() <= fact.valueOf() ){
                    	valid_date = true;
                    }
                    if (!valid_date) {
                      	log.audit({
                            title: 'Fecha Incorrecta',
                            details: 'Fecha Incorrecta'
                        });
                        showmessage({
                                title: "Error",
                                message: "La fecha actual es " + fechaact.format + ", la fecha de la transaccion  " + fechafac.format + ' no es valida.',
                                type: message.Type.ERROR
                            },
                            15000,
                            true
                        );
                        respuesta = false;
                      	
                    } else {
                        respuesta = true;
                      	log.audit({
                            title: 'Fecha Correcta',
                            details: 'Fecha Correcta'
                        });
                    }
                }
            }
        } catch (error) {
            log.error({
                title: 'error validateField',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta validateField',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
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

            /*log.audit({
                title: 'fecha1',
                details: ' objDate ' + objDate +
                    ' año ' + año +
                    ' mes ' + mes +
                    ' dia ' + dia
            });*/
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
            /*log.audit({
                title: 'respuesta fechaSplit',
                details: JSON.stringify(respuesta)
            });*/
            return respuesta;
        }
    }

    return {
        validateField: validateField,
        fieldChanged: fieldChanged
    }
});