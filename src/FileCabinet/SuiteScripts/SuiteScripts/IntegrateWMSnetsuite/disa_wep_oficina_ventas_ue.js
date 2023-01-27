/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/search', './drt_wep_integration_lib'], function (record, search, drt_wep_lib) {

    function beforeLoad(context) {
        try {

        } catch (error) {
            log.audit('error Credit Memo', error);
        }
    }

    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT ) {
                var currenRecord = record.load({
                    type: context.newRecord.type,
                    id: context.newRecord.id,
                    isDynamic: false
                });
                log.audit('currenRecord', currenRecord);

                var idT = search.lookupFields({
                    type: context.newRecord.type,
                    id: context.newRecord.id,
                    columns: ['tranid']
                });

                log.audit('idT', idT);
                var tNumber = idT.tranid;

                var numeroLineas = currenRecord.getLineCount({
                    sublistId: 'item'
                });

                log.audit('nl', numeroLineas);

                var objItem = {
                    inventory: []
                };

                var items = {};


                var nota = "Transferencia de invenrtario para oficina de venta creada a partir de una nota de credito" + ' ' + tNumber;

                var customrecord_drt_web_otutput_netsuiteSearchObj = search.create({
                    type: record.Type.CREDIT_MEMO,
                    filters: [
                        ["type", "anyof", "CustCred"],
                        "AND",
                        ["internalidnumber", "equalto", currenRecord.id],
                        "AND",
                        ["mainline", "is", "T"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "location"
                        }),
                        search.createColumn({
                            name: "salesrep"
                        }),
                        search.createColumn({
                            name: "custentity_disa_oficina_ventas",
                            join: "salesrep",
                            label: "Oficina de ventas"
                        })
                    ]
                });

                var salida = customrecord_drt_web_otutput_netsuiteSearchObj.run().getRange({
                    start: 0,
                    end: 999
                });

                log.audit('salida', salida);

                var oficinaVentas = salida[0].getValue({
                    name: "custentity_disa_oficina_ventas",
                    join: "salesrep"
                });

                log.audit('oficinaVentas', oficinaVentas);

                var subcidiaria = 2;
                var ubicacionOrigen = oficinaVentas;
                //oficinaVentas; // pendiente
                var ubicacionDestino = 207;
                var fechaRma = currenRecord.getValue({
                    fieldId: 'trandate'
                });
                log.audit('fechaRma', fechaRma);


                for (var i = 0; i < numeroLineas; i++) {

                    var cantidad = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });

                    log.audit('cantidad', cantidad);

                    var idItem = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    log.audit('idItem', idItem);

                    var isInventory = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorydetailavail',
                        line: i
                    });

                    log.audit('isInventory', isInventory);


                    if (isInventory == "T") {
                        var idLote = currenRecord.getSublistSubrecord({
                            sublistId: 'item',
                            fieldId: 'inventorydetail',
                            line: i
                        });
                        log.audit('idLote', idLote);

                        var lineSubrecord = idLote.getLineCount({
                            sublistId: 'inventoryassignment'
                        }) || 0;

                        log.audit('lineSubrecord', lineSubrecord);

                        for (var a = 0; a < lineSubrecord; a++) {
                            var inventoryNum = idLote.getSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'numberedrecordid',
                                line: a
                            }) || '';

                            log.audit('inventoryNum', inventoryNum);

                            var lookupInventoryItem = search.lookupFields({
                                type: search.Type.INVENTORY_NUMBER,
                                id: inventoryNum,
                                columns: ['inventorynumber']
                            });

                            log.audit('lookupInventoryItem', lookupInventoryItem.inventorynumber);

                            var inventoryNombre = lookupInventoryItem.inventorynumber;

                            log.audit('inventoryNombre', inventoryNombre);
                        }
                    }

                    if (!items[idItem]) {
                        items = {
                            adjustqtyby: cantidad,
                            item: idItem,
                            lot: isInventory == "T" ? inventoryNombre : '',
                        }
                    }

                    objItem.inventory.push(items);
                    log.audit('objItem', objItem);
                }
              	
              	var lookupNumberTransaccion = search.lookupFields({
                    type: context.newRecord.type,
                    id: context.newRecord.id,
                    columns: ['transactionnumber']
                });
                log.audit('lookupNumberTransaccion', lookupNumberTransaccion);

                var number = lookupNumberTransaccion.transactionnumber;
                log.audit('number', number);

                var objField = {
                    subsidiary: subcidiaria,
                    location: ubicacionOrigen,
                    transferlocation: ubicacionDestino,
                    memo: nota,
                  	custbody_disa_control_devoluciones: number,
                    trandate: fechaRma
                };
              
              	var inventoryTransferId = search.create({
                    type: record.Type.INVENTORY_TRANSFER,
                    filters: [
                        ["custbody_disa_control_devoluciones", "is",number]
                    ],
                    columns: [
                        'custbody_disa_control_devoluciones'
                    ]
                });

                var inventoryTransferResults = inventoryTransferId.run().getRange({
                    start: 0,
                    end: 999
                });

                if(inventoryTransferResults.length > 0){
                    log.audit('error', 'Ya se tiene una transferencia de inventario con este numero');
                } else {
                if (oficinaVentas) {
                    log.audit('log', 'inicia proceso');

                    var newJournal = createRecord(record.Type.INVENTORY_TRANSFER, objField, objItem);

                    if (newJournal.success) {
                        log.audit('OK', newJournal);
                    }
                }
               }
            }
        } catch (error) {
            log.audit('error Credit Memo', error);
        }
    }

    function createRecord(param_type, param_field_value, param_obj_sublist) {
        try {
            var respuesta = {
                success: false,
                data: '',
                error: {}
            };
            // var param_obj_sublist= {
            //     item:[
            //         {
            //             item:5,
            //             price:3,
            //         }
            //     ]
            // }
            // }
            log.audit({
                title: 'createRecord',
                details: ' param_type: ' + param_type +
                    ' param_field_value: ' + JSON.stringify(param_field_value) +
                    ' param_obj_sublist: ' + JSON.stringify(param_obj_sublist)
            });

            var newRecord = record.create({
                type: param_type,
                isDynamic: true
            });

            for (var field in param_field_value) {
                newRecord.setValue({
                    fieldId: field,
                    value: param_field_value[field]
                });
            }

            for (var sublist in param_obj_sublist) {
                for (var element in param_obj_sublist[sublist]) {
                    newRecord.selectNewLine({
                        sublistId: sublist
                    });

                    for (var field in param_obj_sublist[sublist][element]) {

                        if (field == 'lot' && param_obj_sublist[sublist][element][field] != '') {
                            log.audit('lote', param_obj_sublist[sublist][element][field]);
                            var subRecord = newRecord.getCurrentSublistSubrecord({
                                sublistId: sublist,
                                fieldId: 'inventorydetail'
                            });

                            subRecord.selectNewLine({
                                sublistId: 'inventoryassignment',
                                line: 0
                            });

                            subRecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'receiptinventorynumber',
                                value: param_obj_sublist[sublist][element][field]
                            });

                            subRecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: param_obj_sublist[sublist][element].adjustqtyby
                            });

                            subRecord.commitLine({
                                sublistId: 'inventoryassignment'
                            });
                        } else {
                            newRecord.setCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: field,
                                value: param_obj_sublist[sublist][element][field]
                            });
                        }

                        log.audit('item', param_obj_sublist[sublist][element]['item']);
                        log.audit('sublist', sublist)

                    }
                    newRecord.commitLine({
                        sublistId: sublist
                    });


                }
            }

            respuesta.data = newRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            }) || '';

            respuesta.success = respuesta.data != '';
        } catch (error) {
            log.error({
                title: 'error createRecord',
                details: JSON.stringify(error)
            });
            respuesta.error = error;
        } finally {
            log.audit({
                title: 'respuesta createRecord',
                details: respuesta
            });
            return respuesta;
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});