/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/redirect',
    'N/record',
    'N/ui/serverWidget',
    'N/search'
], function (
    redirect,
    record,
    ui,
    search
) {
    function afterSubmit(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.EDIT ||
                context.type == context.UserEventType.XEDIT
            ) {

                var entity = context.newRecord.getValue({
                    fieldId: 'entity'
                }) || "";

                var shipaddresslist = context.newRecord.getValue({
                    fieldId: 'shipaddresslist'
                }) || "";

                var orderstatus = context.newRecord.getValue({
                    fieldId: 'orderstatus'
                }) || "";

                log.audit({
                    title: 'shipaddresslist',
                    details: JSON.stringify(shipaddresslist)
                });
                if (
                    orderstatus == 'B'
                ) {
                    var pedidominimo = '';
                    var paqueteria = '';
                    var montominimo = '';
                    var monto_flete = '';
                    var objSubmit = {
                        // orderstatus: "A"
                    };
                    var newRecord = record.load({
                        type: context.newRecord.type,
                        id: context.newRecord.id,
                        isDynamic: true
                    });

                    var entityRecord = record.load({
                        type: record.Type.CUSTOMER,
                        id: entity,
                        isDynamic: true
                    });
                    if (
                        shipaddresslist &&
                        entity
                    ) {
                        var estado = '';
                        var ciudad = '';
                        var idAddres = '';
                        var sublistEntityId = 'addressbook';
                        var line_addres = entityRecord.getLineCount({
                            sublistId: sublistEntityId
                        });
                        for (var add = 0; add < line_addres; add++) {
                            entityRecord.selectLine({
                                sublistId: sublistEntityId,
                                line: add
                            });
                            idAddres = entityRecord.getCurrentSublistValue({
                                sublistId: sublistEntityId,
                                fieldId: 'id'
                            });
                            if (
                                shipaddresslist == idAddres
                            ) {
                                var subrec = entityRecord.getCurrentSublistSubrecord({
                                    sublistId: sublistEntityId,
                                    fieldId: 'addressbookaddress'
                                });

                                estado = subrec.getValue({
                                    fieldId: 'custrecord_drt_pm_estado'
                                });

                                ciudad = subrec.getValue({
                                    fieldId: 'custrecord_drt_pm_ciudad'
                                });
                            }
                        }

                    }
                    var sublistId = 'item';
                    var line_count = newRecord.getLineCount({
                        sublistId: sublistId
                    });

                    objSubmit.custbody_drt_pm_total_pedido_minimo = 0;
                    var priceCustom = 0;
                    for (var i = 0; i < line_count; i++) {
                        newRecord.selectLine({
                            sublistId: sublistId,
                            line: i
                        });

                        var rate = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'rate'
                        }) || 0;
                        if (
                            newRecord.getCurrentSublistValue({
                                sublistId: sublistId,
                                fieldId: 'price'
                            }) == '-1'
                        ) {
                            priceCustom++;
                        }


                        var quantity = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'quantity'
                        }) || 0;

                        var quantitybackordered = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'quantitybackordered'
                        }) || 0;

                        var quantitycommitted = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'quantitycommitted'
                        }) || 0;
                        // quantitycommitted = 1;
                        var taxrate1 = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'taxrate1'
                        }) || 0;

                        var todobackorder = newRecord.getCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custcoldisa_es_item_mto'
                        });
                        if (
                            todobackorder
                        ) {
                            quantitycommitted += quantitybackordered;
                        }

                        newRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custcol_drt_pm_backordered',
                            value: quantitybackordered
                        }) || '';

                        newRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custcol_drt_pm_committed',
                            value: quantitycommitted
                        }) || '';
                        log.audit({
                            title: 'Line: ' + i,
                            details: ' todobackorder: ' + todobackorder + '-' + quantitycommitted + '*' + rate + '*' + 'parseFloat(1 ' + taxrate1 + '* 1 / 100)= ' + (quantitycommitted * rate * parseFloat(1 + taxrate1 * 1 / 100))
                        });
                        var monto = quantitycommitted * rate * parseFloat(1 + taxrate1 * 1 / 100);
                        objSubmit.custbody_drt_pm_total_pedido_minimo += monto;

                        newRecord.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: 'custcol_drt_pm_monto',
                            value: monto
                        }) || '';


                        newRecord.commitLine({
                            sublistId: sublistId
                        });

                        log.audit({
                            title: 'Line: ' + i,
                            details: ' todobackorder: ' + todobackorder + '-' +
                                ' rate: ' + rate +
                                ' quantity: ' + quantity +
                                ' quantitybackordered: ' + quantitybackordered +
                                ' quantitycommitted: ' + quantitycommitted +
                                ' taxrate1: ' + taxrate1
                        });


                    }
                    objSubmit.custbody_drt_disa_price_level_custom = priceCustom > 0;
                    objSubmit.custbody_drt_pm_ap_total_pedido_minimo = objSubmit.custbody_drt_pm_total_pedido_minimo;
                    var tipo_pedido_minimo = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_tipo_pedido_minimo'
                    }) || "";
                    log.audit({
                        title: 'tipo_pedido_minimo',
                        details: JSON.stringify(tipo_pedido_minimo)
                    });
                    /*  
                    if (
                        tipo_pedido_minimo &&
                        tipo_pedido_minimo == 3
                    ) {
                        delete objSubmit.custbody_drt_pm_total_pedido_minimo;
                    }
                    */

                    if (
                        estado &&
                        ciudad
                    ) {
                        var existRecord = searchRecord('customrecord_drt_pm_importes_minimo_zona', [
                            ["isinactive", search.Operator.IS, "F"],
                            "AND",
                            ["custrecord_drt_pm_imz_estado", search.Operator.IS, estado],
                            "AND",
                            ["custrecord_drt_pm_imz_ciudad", search.Operator.IS, ciudad]
                        ], [{
                                "name": "custrecord_drt_pm_imz_estado"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_ciudad"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_pedidominimo"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_montominimo"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_cliente_paga_flete"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_monto_flete"
                            },
                            {
                                "name": "custrecord_drt_pm_imz_paqueteria"
                            }
                        ]);
                        if (existRecord.success) {
                            objSubmit.custbody_drt_pm_impz_importe_minimo = existRecord.array[0].id;
                            pedidominimo = existRecord.array[0].custrecord_drt_pm_imz_pedidominimo;
                            paqueteria = existRecord.array[0].custrecord_drt_pm_imz_paqueteria;
                            montominimo = existRecord.array[0].custrecord_drt_pm_imz_montominimo;
                            monto_flete = existRecord.array[0].custrecord_drt_pm_imz_monto_flete;
                        }
                    }
                    var cumple = true;


                    log.audit({
                        title: 'objSubmit',
                        details: JSON.stringify(objSubmit)
                    });

                    {



                        var aprob_pedido_minimo = context.newRecord.getValue({
                            fieldId: 'custbody_drt_pm_aprob_pedido_minimo'
                        }) || '';
                        log.audit({
                            title: 'context.newRecord aprob_pedido_minimo',
                            details: JSON.stringify(aprob_pedido_minimo)
                        });

                        if (
                            pedidominimo &&
                            !aprob_pedido_minimo
                        ) {
                            aprob_pedido_minimo = '1';
                        }




                        log.audit({
                            title: 'context.newRecord aprob_pedido_minimo',
                            details: JSON.stringify(aprob_pedido_minimo)
                        });
                        log.audit({
                            title: 'context.newRecord pedidominimo',
                            details: JSON.stringify(pedidominimo)
                        });
                        log.audit({
                            title: 'paqueteria',
                            details: JSON.stringify(paqueteria)
                        });
                        log.audit({
                            title: 'montominimo',
                            details: JSON.stringify(montominimo)
                        });
                        log.audit({
                            title: 'monto_flete',
                            details: JSON.stringify(monto_flete)
                        });

                        /* 
                        1	Pedido Minimo
                        2	Cliente Paga Flete
                        3	Paquetería
                        */
                        switch (aprob_pedido_minimo) {
                            case '1':
                                if (
                                    objSubmit.custbody_drt_pm_ap_total_pedido_minimo &&
                                    montominimo &&
                                    objSubmit.custbody_drt_pm_ap_total_pedido_minimo >= montominimo
                                ) {
                                    objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                                    objSubmit.custbody_drt_pm_tipo_pedido_minimo = 1;
                                    objSubmit.custbody_drt_pm_aprob_pedido_minimo = 1;
                                    objSubmit.orderstatus = 'B';
                                } else {
                                    objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                                    objSubmit.orderstatus = 'A';
                                    objSubmit.custbody_drt_pm_tipo_pedido_minimo = 4;
                                    objSubmit.custbody_drt_pm_aprob_pedido_minimo = '';

                                }
                                objSubmit.custbody_drt_pm_total_pedido_minimo = objSubmit.custbody_drt_pm_ap_total_pedido_minimo;
                                break;
                            case '2':
                                if (
                                    objSubmit.custbody_drt_pm_ap_total_pedido_minimo &&
                                    monto_flete &&
                                    objSubmit.custbody_drt_pm_ap_total_pedido_minimo >= monto_flete
                                ) {
                                    objSubmit.custbody_drt_pm_tipo_pedido_minimo = 2;
                                    objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                                    objSubmit.custbody_drt_pm_aprob_pedido_minimo = 2;
                                    objSubmit.orderstatus = 'B';
                                } else {
                                    objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                                    objSubmit.orderstatus = 'A';
                                    objSubmit.custbody_drt_pm_tipo_pedido_minimo = 5;
                                    objSubmit.custbody_drt_pm_aprob_pedido_minimo = '';
                                }
                                objSubmit.custbody_drt_pm_total_pedido_minimo = objSubmit.custbody_drt_pm_ap_total_pedido_minimo;
                                break;
                            case '3':
                                var tpm = newRecord.getValue({
                                    fieldId: 'custbody_drt_pm_aprob_pedido_minimo'
                                }) || '';
                                if (
                                    paqueteria &&
                                    tpm &&
                                    parseFloat(tpm) > 0
                                ) {
                                    objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                                    objSubmit.custbody_drt_pm_tipo_pedido_minimo = 3;
                                    objSubmit.custbody_drt_pm_aprob_pedido_minimo = 3;
                                    // objSubmit.custbody_drt_pm_total_pedido_minimo = objSubmit.custbody_drt_pm_total_pedido_minimo;
                                    objSubmit.orderstatus = 'B';
                                    delete objSubmit.custbody_drt_pm_total_pedido_minimo;
                                }
                                break;

                            default:
                                break;
                        }

                    }

                    var folio = entityRecord.getValue({
                        fieldId: 'custentity_drt_folio'
                    }) || '';

                    log.audit({
                        title: 'folio',
                        details: JSON.stringify(folio)
                    });
                    if (folio) {
                        var folioText = newRecord.getText({
                            fieldId: 'custbody_drt_pm_folio'
                        }) || '';

                        if (folioText == 'M' || folioText == 'E' || folioText == 'EF') {
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                        }

                        log.audit({
                            title: 'folioText',
                            details: JSON.stringify(folioText)
                        });

                    }
                    log.audit({
                        title: 'cumple',
                        details: JSON.stringify(cumple)
                    });
                    log.audit({
                        title: 'objSubmit',
                        details: JSON.stringify(objSubmit)
                    });
                    delete objSubmit.orderstatus;


                    for (var fieldId in objSubmit) {
                        newRecord.setValue({
                            fieldId: fieldId,
                            value: objSubmit[fieldId]
                        });
                    }
                    var id = newRecord.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }) || '';
                    /*  var id = record.submitFields({
                         type: context.newRecord.type,
                         id: context.newRecord.id,
                         values: objSubmit,
                         options: {
                             enableSourcing: false,
                             ignoreMandatoryFields: true
                         }
                     });
                     */
                    log.audit({
                        title: 'id',
                        details: JSON.stringify(id)
                    });
                    redirect.toRecord({
                        type: context.newRecord.type,
                        id: context.newRecord.id,
                        parameters: {
                            'tpm': 200
                        }
                    });

                }
            }
        } catch (errorafterSubmit) {
            log.audit({
                title: 'errorafterSubmit',
                details: JSON.stringify(errorafterSubmit)
            });
        }
    }

    function beforeLoad(context) {
        try {
            log.audit({
                title: 'context.type',
                details: JSON.stringify(context.type)
            });
            if (context.type == context.UserEventType.VIEW) {

                var form = context.form;

                form.clientScriptModulePath = "./drt_pm_pedido_minimo_cs.js";

                var orderstatus = context.newRecord.getValue({
                    fieldId: 'orderstatus'
                }) || '';
                var tipo_pedido_minimo = context.newRecord.getValue({
                    fieldId: 'custbody_drt_pm_tipo_pedido_minimo'
                }) || '';
                var custbody_drt_pm_pedido_minimo_valido = context.newRecord.getValue({
                    fieldId: 'custbody_drt_pm_pedido_minimo_valido'
                }) || '';
                log.audit({
                    title: 'tipo_pedido_minimo',
                    details: JSON.stringify(tipo_pedido_minimo)
                });
                if (
                    context.newRecord.type == record.Type.SALES_ORDER &&
                    orderstatus == 'B'
                ) {
                    var objParam = {
                        custparam_ed_tranid: context.newRecord.id,
                        custparam_ed_trantype: context.newRecord.type
                    };
                    log.audit({
                        title: 'objParam',
                        details: JSON.stringify(objParam)
                    });
                    var pedidominimo = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_impz_pedidominimo'
                    }) || '';

                    var cliente_paga_flet = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_impz_cliente_paga_flet'
                    }) || '';

                    var paqueteria = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_impz_paqueteria'
                    }) || '';

                    var total_pedido_minimo = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_total_pedido_minimo'
                    }) || '';

                    var montominimo = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_impz_montominimo'
                    }) || '';
                    var monto_flete = context.newRecord.getValue({
                        fieldId: 'custbody_drt_pm_impz_monto_flete'
                    }) || '';




                    if (
                        !tipo_pedido_minimo
                    ) {
                        if (
                            total_pedido_minimo &&
                            !tipo_pedido_minimo
                        ) {
                            if (
                                pedidominimo
                            ) {
                                objParam.total = total_pedido_minimo;
                                objParam.monto = montominimo;

                                form.addButton({
                                    id: "custpage_btn_aprobacion_minimo",
                                    label: "Aprobacion Minimo",
                                    functionName: "aprobacion_minimo(" + JSON.stringify(objParam) + ")"
                                });
                            }

                            if (
                                cliente_paga_flet
                            ) {
                                objParam.total = total_pedido_minimo;
                                objParam.monto = monto_flete;

                                form.addButton({
                                    id: "custpage_btn_aprobacion_flete",
                                    label: "Aprobacion Flete",
                                    functionName: "aprobacion_flete(" + JSON.stringify(objParam) + ")"
                                });
                            }
                            if (
                                paqueteria
                            ) {
                                form.addButton({
                                    id: "custpage_btn_aprobacion_paqueteria",
                                    label: "Aprobacion Paqueteria",
                                    functionName: "aprobacion_paqueteria(" + JSON.stringify(objParam) + ")"
                                });
                            }

                        }
                    }
                }

                var parametroRespuesta = context.request.parameters.tpm;
                log.audit('parametro', parametroRespuesta);

                if (parametroRespuesta) {
                    var param_message = context.newRecord.getText({
                        fieldId: 'custbody_drt_pm_tipo_pedido_minimo'
                    }) || '';
                    var msgField = context.form.addField({
                        id: 'custpage_drt_message',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    if (
                        tipo_pedido_minimo >= 1 &&
                        tipo_pedido_minimo <= 3 &&
                        custbody_drt_pm_pedido_minimo_valido
                    ) {
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Aprobacion " + param_message + "', type: message.Type.CONFIRMATION}).show({duration: 15000})  });</script>";
                    }
                    if (
                        tipo_pedido_minimo >= 4 &&
                        tipo_pedido_minimo <= 5 &&
                        !custbody_drt_pm_pedido_minimo_valido
                    ) {
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Error " + param_message + "', type: message.Type.WARNING}).show({duration: 15000})  });</script>";

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

    function beforeSubmit(context) {
        try {
            var respuesta = {
                success: false,
                data: {},
                error: []
            };
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.EDIT ||
                context.type == context.UserEventType.XEDIT
            ) {

                var newRecord = context.newRecord;
                var sublistId = 'item';
                var line_count = newRecord.getLineCount({
                    sublistId: sublistId
                });
                var location = newRecord.getValue({
                    fieldId: 'location'
                }) || '';
                log.audit({
                    title: 'location',
                    details: JSON.stringify(location)
                });
                if (location) {
                    for (var i = 0; i < line_count; i++) {
                        if (
                            !newRecord.getSublistValue({
                                sublistId: sublistId,
                                fieldId: 'inventorylocation',
                                line: i,
                            })
                        ) {
                            newRecord.setSublistValue({
                                sublistId: sublistId,
                                fieldId: 'inventorylocation',
                                value: location,
                                line: i,
                            }) || 0;
                        }
                        if (
                            !newRecord.getSublistValue({
                                sublistId: sublistId,
                                fieldId: 'location',
                                line: i,
                            })
                        ) {
                            newRecord.setSublistValue({
                                sublistId: sublistId,
                                fieldId: 'location',
                                value: location,
                                line: i,
                            }) || 0;
                        }
                        respuesta.data[i] = location;
                    }
                    respuesta.success = Object.keys(respuesta.data).length > 0;
                }
            }
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error beforeSubmit',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta beforeSubmit',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function searchRecord(param_type, param_filters, param_column) {
        try {
            var respuesta = {
                success: false,
                data: {},
                array: [],
                error: {}
            };
            /*
             param_filters=[
                ['isinactive', search.Operator.IS, 'F']
            ];
            param_column=[
                    { name: 'name' }
            ]
             */
            log.audit({
                title: 'searchRecord',
                details: ' param_type: ' + param_type +
                    ' param_filters: ' + JSON.stringify(param_filters) +
                    ' param_column: ' + JSON.stringify(param_column)
            });
            if (param_type &&
                param_filters &&
                param_column
            ) {

                var result = search.create({
                    type: param_type,
                    filters: param_filters,
                    columns: param_column
                });
                var resultData = result.run();
                var start = 0;
                do {
                    var resultSet = resultData.getRange(start, start + 1000);
                    if (resultSet && resultSet.length > 0) {
                        for (var i = 0; i < resultSet.length; i++) {
                            //                            log.audit({ title: 'resultSet[' + i + ']', details: JSON.stringify(resultSet[i]) });
                            if (!respuesta.data[resultSet[i].id]) {
                                respuesta.data[resultSet[i].id] = {
                                    id: resultSet[i].id,
                                };
                                for (var column in param_column) {
                                    respuesta.data[resultSet[i].id][param_column[column].name] = resultSet[i].getValue(param_column[column]) || '';
                                    respuesta.data[resultSet[i].id][param_column[column].name + '_text'] = resultSet[i].getText(param_column[column]) || '';
                                }
                            }
                        }
                    }
                    start += 1000;
                } while (resultSet && resultSet.length == 1000);
            }
            for (var r in respuesta.data) {
                respuesta.array.push(respuesta.data[r]);
            }
            respuesta.success = Object.keys(respuesta.data).length > 0;
        } catch (error) {
            log.error({
                title: 'error searchRecord',
                details: JSON.stringify(error)
            });
            respuesta.error = error;
        } finally {
            log.audit({
                title: 'respuesta searchRecord',
                details: respuesta
            });
            return respuesta;
        }
    }


    return {
        afterSubmit: afterSubmit,
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    }
});