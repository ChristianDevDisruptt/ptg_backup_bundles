/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

 define([
    'N/search',
    'N/record',
    'N/https',
    'N/redirect',
    'N/runtime',
    'N/format',
    'N/ui/serverWidget',
    'N/ui/message',
], function (
    search,
    record,
    https,
    redirect,
    runtime,
    format,
    serverWidget,
    message
) {

    function onRequest(context) {
        log.audit({
            title: 'context.request.method',
            details: JSON.stringify(context.request.method)
        });
        if (context.request.method == 'GET') {
            try {
                log.audit({
                    title: 'context.request.parameters',
                    details: context.request.parameters
                });
                var id = context.request.parameters.custpage_id;
                var tipo = context.request.parameters.custpage_type;
                var Memo = context.request.parameters.custpage_memo;
                log.audit('tipo', tipo);
                log.audit('id', id);
                //updateTransaction(id, tipo);

                var loadInvoice = record.load({
                    type: tipo,
                    id: id,
                    isDynamic: true,
                });
    
                var respuesta = {
                    success: false,
                    data: {},
                    error: []
                };
    
                var idFactura = loadInvoice.getValue({
                    fieldId: 'tranid'
                });

                var idmoneda = loadInvoice.getValue({
                    fieldId: 'currency'
                });

                var Fecha = loadInvoice.getValue({
                    fieldId: 'custbody_drt_fecha_recepcion'
                });
    
                var Terms = loadInvoice.getValue({
                    fieldId: 'terms'
                });

                var Memo = loadInvoice.getValue({
                    fieldId: 'memo'
                });

                var trandate = loadInvoice.getValue({
                    fieldId: 'trandate'
                });

                var idcliente = loadInvoice.getValue({
                    fieldId: 'entity'
                });

                var importe = loadInvoice.getValue({
                    fieldId: 'total'
                });

                var finalTermsCustomer = search.lookupFields({
                    type: record.Type.TERM,
                    id: Terms,
                    columns: ['name']
                }) || '';

                var finalcliente = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: idcliente,
                    columns: ['altname']
                }) || '';

                var moneda = search.lookupFields({
                    type: record.Type.CURRENCY,
                    id: idmoneda,
                    columns: ['name']
                }) || '';

                // Section One - Forms - See 'Steps for Creating a Custom Form' in topic 'Sample Custom Form Script'
                var form = serverWidget.createForm({
                    title: 'Registro Fecha Recepción'
                });

                var button = form.addButton({
                    id : 'buttonid',
                    label : 'Cancelar',
                    functionName:  'history.back()'
                });

                var usergroup = form.addFieldGroup({
                    id: 'usergroup',
                    label: 'Información de la factura'
                });

                var usergroup2 = form.addFieldGroup({
                    id: 'usergroup2',
                    label: 'Actualización de Fecha'
                });

                usergroup.isSingleColumn = false;

                usergroup2.isSingleColumn = false;

                // Fecha Recepción
                
                var invoice = form.addField({
                    id: 'invoiceid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'No. DE FACTURA',
                    container: 'usergroup'
                });

                invoice.defaultValue = idFactura;

                invoice.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                var invoiceid = form.addField({
                    id: 'myinvoiceid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Invoice ID',
                    container: 'usergroup'
                });

                invoiceid.defaultValue = id;

                invoiceid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var trandateid = form.addField({
                    id: 'trandateid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Trandate ID',
                    container: 'usergroup'
                });

                trandateid.defaultValue = trandate;

                trandateid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var termsid = form.addField({
                    id: 'termsid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Terms ID',
                    container: 'usergroup'
                });

                termsid.defaultValue = Terms;

                termsid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var tipoid = form.addField({
                    id: 'tipoid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'TIPO ID',
                    container: 'usergroup'
                });

                tipoid.defaultValue = tipo;

                tipoid.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

                var cliente = form.addField({
                    id: 'clienteid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'CLIENTE',
                    container: 'usergroup'
                });

                cliente.defaultValue = finalcliente.altname;

                cliente.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });

                var total = form.addField({
                    id: 'totalid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Importe',
                    container: 'usergroup'
                });

                total.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });
                
                total.defaultValue = '$ ' + importe + ' ' + moneda.name;

                var terminos = form.addField({
                    id: 'terminosid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Términos',
                    container: 'usergroup'
                });

                terminos.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.INLINE
                });
                
                terminos.defaultValue = finalTermsCustomer.name;
                
                var repdate = form.addField({
                    id: 'repdateid',
                    type: serverWidget.FieldType.DATE,
                    label: 'Fecha Recepción',
                    container: 'usergroup2'
                });

                repdate.defaultValue = Fecha;       

                var notas = form.addField({
                    id: 'memoid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Notas',
                    container: 'usergroup2'
                });

                notas.defaultValue = Memo;

                form.addSubmitButton({
                    label: 'Enviar'
                });

                context.response.writePage(form);

                } catch (error) {
                    log.audit('error', error)
                }
        }else{
            var id = context.request.parameters.myinvoiceid;
            var tipo = context.request.parameters.tipoid;
            var fecharep = formatDate(context.request.parameters.repdateid, '-', 2, 1, 0, '');
            var fechafac = formatDate(context.request.parameters.trandateid, '-', 2, 1, 0, '');
            var fechaact = formatDate('', '-', 2, 1, 0, '');
            var fechaven = formatDate('', '-', 2, 1, 0, '');
            var memo = context.request.parameters.memoid;
            var termsid = context.request.parameters.termsid;
            var terms = search.lookupFields({
                type: record.Type.TERM,
                id: termsid,
                columns: ['daysuntilnetdue']
            }) || '';

            if (fecharep) {
                //var fecha_actual =     
                var valid_date = false;

                var frep = new Date(fecharep.año,(fecharep.mes-1),fecharep.dia);
                var ffac = new Date(fechafac.año,(fechafac.mes-1),fechafac.dia);
                var fact = new Date(fechaact.año,(fechaact.mes-1),fechaact.dia);
                var fven = new Date(fechaven.año,(fechaven.mes-1),fechaven.dia);
                
                if(frep.valueOf() > ffac.valueOf() && frep.valueOf() <= fact.valueOf() ){
                    valid_date = true;
                }
                if (!valid_date) {
                    redirect.toRecord({
                        type: tipo,
                        id: id,
                        parameters: {
                        'invsuccess': false,
                        'message': 'La fecha de Entrega no es válida, debe se mayor a la fecha de facturación y menor o igual al día de hoy.',
                        'type': message.Type.ERROR
                        }
                    });
                     respuesta = false;
                } else {
                    if (
                        terms &&
                        fecharep
                    ) {
                        var Numerodias = terms.daysuntilnetdue;
                        var formatoDiasN = parseInt(Numerodias);
                        fven.setDate(frep.getDate() + formatoDiasN);
        
                    }
                    var updateRecord = record.submitFields({
                        type: tipo,
                        id: id,
                        values: {
                            'custbody_drt_fecha_recepcion': frep,
                            'memo': memo,
                            'duedate': fven
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
        
                    redirect.toRecord({
                        type: tipo,
                        id: id,
                        parameters: {
                        'invsuccess': true,
                        'message': 'Se registro fecha de recepción correctamente.',
                        'type': message.Type.CONFIRM
                        }
                    });
                    respuesta = true;
                }
            }
            return true;
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
            //respuesta.format = arrayFecha[0] + separador_destino + arrayFecha[1] + separador_destino + arrayFecha[2] + hora;
            respuesta.format = arrayFecha[2] + separador_destino + arrayFecha[1] + separador_destino + arrayFecha[0] ;
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
        onRequest: onRequest
    }
});