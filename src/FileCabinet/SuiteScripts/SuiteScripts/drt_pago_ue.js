/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/runtime'], function (record, runtime) {

    function beforeLoad(context) {
        try {
            var type_interface = runtime.executionContext;
            var type_event = context.type;
            var recObj = context.newRecord;

            var recObj = context.newRecord;
            log.audit(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id"].join(' - '),
                [type_interface, type_event, recObj.type, recObj.id].join(' - '));

            if (type_event == 'view') {
                var plantilla = recObj.getValue({
                    fieldId: 'custbody_psg_ei_template'
                });
                // Valida que la plantilla sea DISA - Pagos de más
                if (plantilla == 116) {
                    log.audit('ejecuta script', '100%');
                    // Lee el numero de lineas de la sublista de Créditos Aplicados
                    var lineas = recObj.getLineCount({
                        sublistId: 'credit'
                    });

                    log.audit('lineas', lineas);
                    // Lee el numero de lineas de la sublista de Aplicaciones
                    var lineaAplicacion = recObj.getLineCount({
                        sublistId: 'apply'
                    });

                    var amount = '';
                    var paymentAmount = '';
                    var iva = '';
                    var monto=0;
                    var amountC = 0;
                    // Lee el numero de lineas de la sublista de Créditos Aplicados
                    for (var i = 0; i < lineas; i++) {
                        //Obtienes valores
                        amount = recObj.getSublistValue({
                            sublistId: 'credit',
                            fieldId: 'amount',
                            line: i
                        });
                        // Calcula un monto total con el importe de todas las líneas
                        monto= (parseFloat(monto) + parseFloat(amount));
                        log.audit('monto', monto);
                        // Obtiene el ID de la transacción
                        var id = recObj.getSublistValue({
                            sublistId: 'credit',
                            fieldId: 'internalid',
                            line: i
                        });
                        log.audit('id', id);
                        // Obtiene el Tipo  de la transacción
                        var trantype = recObj.getSublistValue({
                            sublistId: 'credit',
                            fieldId: 'trantype',
                            line: i
                        });
                        log.audit('trantype', trantype);
                        // Valida si la transacción es nota de crédito
                        if(trantype=='CustCred'){
                            trantype=record.Type.CREDIT_MEMO;
                            var paymentRecord = record.load({
                                type: trantype,
                                id: id,
                                isDynamic: false,
                            });
                            paymentAmount = paymentRecord.getValue({fieldId: 'amountpaid'});
                            /*var lineaCredit = paymentRecord.getLineCount({
                                sublistId: 'apply'
                            });
                            log.audit('lineaCredit', lineaCredit);
                            // Recorre líneas de la aplicación de la Nota de Crédito
                            for (var j = 0; j < lineaCredit; j++) {
                                var idInv = paymentRecord.getSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'internalid',
                                    line: j
                                });
                                var idPymt = paymentRecord.getSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'pymt',
                                    line: j
                                });
                                var amountInv = paymentRecord.getSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'amount',
                                    line: j
                                });
                                if(recObj.id == idPymt){
                                    paymentAmount = amount;
                                }
                            }*/
                        }else{
                            trantype=record.Type.CUSTOMER_PAYMENT;
                            paymentField = 'payment';

                            var paymentRecord = record.load({
                                //type: record.Type.CUSTOMER_PAYMENT,
                                type: trantype,
                                id: id,
                                isDynamic: true,
                            });
                            paymentAmount = paymentRecord.getValue({
                                fieldId: paymentField
                            });

                            amountC += amount


                        }                        
                    }

                    log.audit('amount', amount);
                    log.audit('monto', monto);
                    log.audit('paymentAmount', paymentAmount);
                    log.audit('amountC', amountC);

                    //for(var a = 0; a < lineaAplicacion; a++){
                    var idFactura = recObj.getSublistValue({
                        sublistId: 'apply',
                        fieldId: 'doc',
                        line: 0
                    });
                    log.audit('idFactura', idFactura)

					if(idFactura){
                        var invoiceLoad = record.load({
                            type: record.Type.INVOICE,
                            id: idFactura,
                            isDynamic: true,
                        });

                        var lineaInvoice = invoiceLoad.getLineCount({
                            sublistId: 'item'
                        })
                                            
                        for(var a = 0; a < lineaInvoice; a ++){
                            iva = invoiceLoad.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'taxrate1',
                                line: a
                            })
                        }
                        log.audit('iva', iva);
                    }

                    log.audit('amount2:', amount);
                    log.audit('paymentAmount2:', paymentAmount);

                    var amount_base=0;
                    log.audit('IVA',iva);
                    if(iva=='16') {
                        amount_base=monto/1.16
                    } else {
                        amount_base=monto/1.08
                    }

                    var recordActual = record.load({
                        type: record.Type.CUSTOMER_PAYMENT,
                        id: recObj.id,
                        isDynamic: true,
                    });

                    recordActual.setValue({
                        fieldId: 'custbody_drt_total_credito_aplicado',
                        //value: amount_base
                        value: monto
                    }) || '';

                    recordActual.setValue({
                        fieldId: 'custbody_drt_total_relacionado',
                        value: paymentAmount
                    }) || '';

                    recordActual.setValue({
                        fieldId: 'custbody_drt_iva_relacionado',
                        value: iva ? iva : ''
                    });

                    recordActual.setValue({
                        fieldId: 'custbody_drt_tptal_apply',
                        value: amountC
                    });

                    recordActual.save();
                }
            }
        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        beforeLoad: beforeLoad
    }
}); 