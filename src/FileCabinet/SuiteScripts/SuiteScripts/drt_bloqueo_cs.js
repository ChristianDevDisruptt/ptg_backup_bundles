/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/ui/message', 'N/ui/dialog', 'N/format'], function (message, dialog, format) {
    function saveRecord(context) {
        try {
            var returnTransaction = true;
            var trandate = context.currentRecord.getValue({
                fieldId: 'trandate'
            }) || "";

            if (trandate) {
                var forrmat_trandate = formatDate(trandate, '/', 2, 1, 0, '')
                var forrmat_now = formatDate('', '/', 2, 1, 0, '')
                if (
                    forrmat_trandate.mes &&
                    forrmat_now.mes &&
                    (((forrmat_trandate.mes < forrmat_now.mes) && (forrmat_trandate.año == forrmat_now.año)) ||
                    (forrmat_trandate.año < forrmat_now.año))
                ) {
                    showmessage({
                            title: "Error",
                            message: "La fecha actual es " + forrmat_now.format + ", la fecha de la transaccion  " + forrmat_trandate.format + ' no es valida.',
                            type: message.Type.ERROR
                        },
                        0,
                        true
                    );

                    returnTransaction = false;
                } else {
                    returnTransaction = true;
                }
            }
        } catch (error) {
            log.error({
                title: 'error saveRecord',
                details: JSON.stringify(error)
            });
        } finally {
            return returnTransaction;
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
        saveRecord: saveRecord
    }
});