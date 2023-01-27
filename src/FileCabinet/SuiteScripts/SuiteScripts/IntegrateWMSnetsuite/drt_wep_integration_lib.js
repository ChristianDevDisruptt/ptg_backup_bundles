/**
 * drt_wep_integration_lib.js
 * @NApiVersion 2.x
 * @NModuleScope public
 */

define([
        'N/search',
        'N/record'
    ],
    function (
        search,
        record
    ) {
        function searchRecord(param_type, param_filters, param_column) {
            try {
                var respuesta = {
                    success: false,
                    length: 0,
                    data: {},
                    error: {},
                    array: []
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
                                respuesta.array.push(resultSet[i]);
                                if (
                                    resultSet[i].id &&
                                    !respuesta.data[resultSet[i].id]
                                ) {
                                    respuesta.data[resultSet[i].id] = {
                                        id: resultSet[i].id,
                                    };
                                    for (var column in param_column) {
                                        respuesta.data[resultSet[i].id][param_column[column].name] = resultSet[i].getValue(param_column[column]) || '';
                                    }
                                }
                            }
                        }
                        start += 1000;
                    } while (resultSet && resultSet.length == 1000);
                }
                respuesta.length = Object.keys(respuesta.data).length;
                respuesta.success = respuesta.length > 0;
            } catch (error) {
                log.error({
                    title: 'error searchRecord',
                    details: JSON.stringify(error)
                });
                respuesta.error = error;
            } finally {
                log.emergency({
                    title: 'respuesta searchRecord ' + param_type,
                    details: respuesta
                });
                return respuesta;
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
                    details: ' param_type: ' + JSON.stringify(param_type) +
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
                            if (
                                field == 'issueinventorynumber' ||
                                field == 'receiptinventorynumber' &&
                                param_obj_sublist[sublist][element][field] &&
                                parseInt(param_obj_sublist[sublist][element][field]) >= 0
                            ) {
                                var subRecord = newRecord.getCurrentSublistSubrecord({
                                    sublistId: sublist,
                                    fieldId: 'inventorydetail'
                                });

                                subRecord.selectNewLine({
                                    sublistId: 'inventoryassignment'
                                });

                                subRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: field,
                                    value: parseInt(param_obj_sublist[sublist][element][field])
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

        function createRecordDetail(newRecord, param_field_value, param_obj_sublist, param_obj_select) {
            try {
                var respuesta = {
                    success: false,
                    type: newRecord.type,
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
                    title: 'createRecordDetail',
                    details: //
                        ' newRecord: ' + newRecord.type +
                        ' param_field_value: ' + JSON.stringify(param_field_value) +
                        ' param_obj_sublist: ' + JSON.stringify(param_obj_sublist) +
                        ' param_obj_select: ' + JSON.stringify(param_obj_select)
                });


                for (var field in param_field_value) {
                    newRecord.setValue({
                        fieldId: field,
                        value: param_field_value[field]
                    });
                }
                if (
                    param_obj_sublist &&
                    Object.keys(param_obj_sublist).length > 0
                ) {
                    for (var sublist in param_obj_sublist) {
                        for (var element in param_obj_sublist[sublist]) {
                            newRecord.selectNewLine({
                                sublistId: sublist
                            });

                            for (var field in param_obj_sublist[sublist][element]) {
                                /*  */
                                if (
                                    field == 'inventorynumber'
                                ) {
                                    var subRecord = newRecord.getCurrentSublistSubrecord({
                                        sublistId: sublist,
                                        fieldId: 'inventorydetail'
                                    });

                                    var inventoryLine = subRecord.getLineCount({
                                        sublistId: 'inventoryassignment'
                                    }) || 0;

                                    log.audit({
                                        title: 'inventoryLine',
                                        details: inventoryLine
                                    });

                                    for (var l in param_obj_sublist[sublist][element].inventorynumber) {

                                        if (inventoryLine > l) {
                                            subRecord.selectLine({
                                                sublistId: 'inventoryassignment',
                                                line: l
                                            });
                                        } else {
                                            subRecord.selectNewLine({
                                                sublistId: 'inventoryassignment'
                                            }); // The last line will now actually be at lastIndex + 1    
                                        }
                                        log.audit({
                                            title: 'param_obj_sublist[sublist][element][field][l]',
                                            details: JSON.stringify(param_obj_sublist[sublist][element][field][l])
                                        });
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: param_obj_sublist[sublist][element][field][l].type,
                                            value: param_obj_sublist[sublist][element][field][l].value
                                        });

                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'quantity',
                                            value: param_obj_sublist[sublist][element][field][l].quantity
                                        });

                                        subRecord.commitLine({
                                            sublistId: 'inventoryassignment'
                                        });

                                    }
                                } else {
                                    newRecord.setCurrentSublistValue({
                                        sublistId: sublist,
                                        fieldId: field,
                                        value: param_obj_sublist[sublist][element][field]
                                    });
                                }
                            }
                            newRecord.commitLine({
                                sublistId: sublist
                            });
                        }
                    }
                }

                if (
                    param_obj_select &&
                    Object.keys(param_obj_select).length > 0
                ) {
                    for (var sublist in param_obj_select) {
                        var lineas = newRecord.getLineCount({
                            sublistId: sublist
                        });
                        log.audit({
                            title: 'lineas ' + sublist,
                            details: JSON.stringify(lineas)
                        });
                        for (var i = 0; i < lineas; i++) {

                            var item = newRecord.getSublistValue({
                                sublistId: sublist,
                                fieldId: 'item',
                                line: i
                            }) || '';

                            var quantity = newRecord.getSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantity',
                                line: i
                            }) || '';

                            log.audit({
                                title: 'item',
                                details: JSON.stringify(item)
                            });

                            log.audit({
                                title: 'quantity',
                                details: JSON.stringify(quantity)
                            });
                            var itemreceive = false;
                            for (var element in param_obj_select[sublist]) {
                                log.audit({
                                    title: ' param_obj_select[sublist][element]',
                                    details: //
                                        JSON.stringify(param_obj_select[sublist][element])
                                });

                                itemreceive =
                                    param_obj_select[sublist][element].item == item &&
                                    param_obj_select[sublist][element].quantity <= quantity;
                                log.emergency({
                                    title: 'itemreceive: ' + itemreceive,
                                    details:

                                        " line" + i +
                                        " WMS - item " + param_obj_select[sublist][element].item +
                                        " WMS - quantity " + param_obj_select[sublist][element].quantity +
                                        " NS -  item " + item +
                                        " NS -  quantity " + quantity

                                });
                                if (
                                    itemreceive
                                ) {
                                    log.audit({
                                        title: 'param_obj_select[sublist][element].quantity',
                                        details: JSON.stringify(param_obj_select[sublist][element].quantity)
                                    });
                                    if (param_obj_select[sublist][element].location) {
                                        newRecord.setSublistValue({
                                            sublistId: sublist,
                                            fieldId: 'location',
                                            value: param_obj_select[sublist][element].location,
                                            line: i
                                        });
                                    }
                                    newRecord.setSublistValue({
                                        sublistId: sublist,
                                        fieldId: 'quantity',
                                        value: param_obj_select[sublist][element].quantity,
                                        line: i
                                    });

                                    if (
                                        param_obj_select[sublist][element].inventorynumber
                                    ) {
                                        var subRecord = newRecord.getSublistSubrecord({
                                            sublistId: sublist,
                                            fieldId: 'inventorydetail',
                                            line: i
                                        });

                                        var inventoryLine = subRecord.getLineCount({
                                            sublistId: 'inventoryassignment'
                                        }) || 0;
                                        log.audit({
                                            title: 'inventoryLine',
                                            details: inventoryLine
                                        });
                                        for (var l in param_obj_select[sublist][element].inventorynumber) {
                                            if (inventoryLine > l) {
                                                /* subRecord.selectLine({
                                                    sublistId: 'inventoryassignment',
                                                    line: l
                                                }); */ // The last line will now actually be at lastIndex + 1    

                                            } else {
                                                subRecord.insertLine({
                                                    sublistId: 'inventoryassignment',
                                                    line: l
                                                }); // The last line will now actually be at lastIndex + 1    
                                            }

                                            subRecord.setSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: param_obj_select[sublist][element].inventorynumber[l].type,
                                                value: param_obj_select[sublist][element].inventorynumber[l].value,
                                                line: l
                                            });
                                            subRecord.setSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity',
                                                value: param_obj_select[sublist][element].inventorynumber[l].quantity,
                                                line: l
                                            });
                                        }
                                    }

                                    break;
                                }
                            }

                            newRecord.setSublistValue({
                                sublistId: sublist,
                                fieldId: 'itemreceive',
                                value: itemreceive,
                                line: i
                            });
                        }
                    }
                }
                respuesta.data = newRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }) || '';

                respuesta.success = respuesta.data != '';
            } catch (error) {
                log.error({
                    title: 'error createRecordDetail ' + error.message,
                    details: JSON.stringify(error)
                });
                respuesta.error = error;
            } finally {
                log.audit({
                    title: 'respuesta createRecordDetail ' + newRecord.type,
                    details: respuesta
                });
                return respuesta;
            }
        }

        function createRecordDetailReturnSave(newRecord, param_field_value, param_obj_sublist, param_obj_select) {
            try {
                var respuesta = {
                    success: false,
                    type: newRecord.type,
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
                    title: 'createRecordDetailReturnSave',
                    details: //
                        ' newRecord: ' + newRecord.type +
                        ' param_field_value: ' + JSON.stringify(param_field_value) +
                        ' param_obj_sublist: ' + JSON.stringify(param_obj_sublist) +
                        ' param_obj_select: ' + JSON.stringify(param_obj_select)
                });


                for (var field in param_field_value) {
                    newRecord.setValue({
                        fieldId: field,
                        value: param_field_value[field]
                    });
                }
                if (
                    param_obj_sublist &&
                    Object.keys(param_obj_sublist).length > 0
                ) {
                    for (var sublist in param_obj_sublist) {
                        for (var element in param_obj_sublist[sublist]) {
                            newRecord.selectNewLine({
                                sublistId: sublist
                            });

                            for (var field in param_obj_sublist[sublist][element]) {
                                /*  */
                                if (
                                    field == 'inventorynumber'
                                ) {
                                    var subRecord = newRecord.getCurrentSublistSubrecord({
                                        sublistId: sublist,
                                        fieldId: 'inventorydetail'
                                    });

                                    var inventoryLine = subRecord.getLineCount({
                                        sublistId: 'inventoryassignment'
                                    }) || 0;

                                    log.audit({
                                        title: 'inventoryLine',
                                        details: inventoryLine
                                    });

                                    for (var l in param_obj_sublist[sublist][element].inventorynumber) {

                                        if (inventoryLine > l) {
                                            try {
                                                subRecord.selectLine({
                                                    sublistId: 'inventoryassignment',
                                                    line: l
                                                });
                                            } catch (errorl1) {
                                                log.audit({
                                                    title: 'errorl1 ' + errorl1.message,
                                                    details: errorl1
                                                });
                                                subRecord.selectNewLine({
                                                    sublistId: 'inventoryassignment'
                                                });
                                            }
                                        } else {
                                            subRecord.selectNewLine({
                                                sublistId: 'inventoryassignment'
                                            }); // The last line will now actually be at lastIndex + 1    
                                        }
                                        log.audit({
                                            title: 'param_obj_sublist[sublist][element][field][l]',
                                            details: JSON.stringify(param_obj_sublist[sublist][element][field][l])
                                        });
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: param_obj_sublist[sublist][element][field][l].type,
                                            value: param_obj_sublist[sublist][element][field][l].value
                                        });

                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'quantity',
                                            value: param_obj_sublist[sublist][element][field][l].quantity
                                        });

                                        subRecord.commitLine({
                                            sublistId: 'inventoryassignment'
                                        });

                                    }
                                } else {
                                    newRecord.setCurrentSublistValue({
                                        sublistId: sublist,
                                        fieldId: field,
                                        value: param_obj_sublist[sublist][element][field]
                                    });
                                }
                            }
                            newRecord.commitLine({
                                sublistId: sublist
                            });
                        }
                    }
                }

                if (
                    param_obj_select &&
                    Object.keys(param_obj_select).length > 0
                ) {
                    for (var sublist in param_obj_select) {
                        var lineas = newRecord.getLineCount({
                            sublistId: sublist
                        });
                        log.audit({
                            title: 'lineas ' + sublist,
                            details: JSON.stringify(lineas)
                        });
                        for (var i = 0; i < lineas; i++) {

                            var item = newRecord.getSublistValue({
                                sublistId: sublist,
                                fieldId: 'item',
                                line: i
                            }) || '';

                            var quantity = newRecord.getSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantity',
                                line: i
                            }) || '';

                            log.audit({
                                title: 'item',
                                details: JSON.stringify(item)
                            });

                            log.audit({
                                title: 'quantity',
                                details: JSON.stringify(quantity)
                            });
                            var itemreceive = false;
                            for (var element in param_obj_select[sublist]) {
                                log.audit({
                                    title: ' param_obj_select[sublist][element]',
                                    details: //
                                        JSON.stringify(param_obj_select[sublist][element])
                                });

                                itemreceive =
                                    param_obj_select[sublist][element].item == item &&
                                    param_obj_select[sublist][element].quantity <= quantity;
                                log.emergency({
                                    title: 'itemreceive: ' + itemreceive,
                                    details:

                                        " line" + i +
                                        " WMS - item" + param_obj_select[sublist][element].item +
                                        " WMS - quantity" + param_obj_select[sublist][element].quantity +
                                        " NS -  item " + item +
                                        " NS -  quantity " + quantity

                                });
                                if (
                                    itemreceive
                                ) {
                                    log.audit({
                                        title: 'param_obj_select[sublist][element].quantity',
                                        details: JSON.stringify(param_obj_select[sublist][element].quantity)
                                    });
                                    if (param_obj_select[sublist][element].location) {
                                        newRecord.setSublistValue({
                                            sublistId: sublist,
                                            fieldId: 'location',
                                            value: param_obj_select[sublist][element].location,
                                            line: i
                                        });
                                    }
                                    newRecord.setSublistValue({
                                        sublistId: sublist,
                                        fieldId: 'quantity',
                                        value: param_obj_select[sublist][element].quantity,
                                        line: i
                                    });

                                    if (
                                        param_obj_select[sublist][element].inventorynumber
                                    ) {
                                        var subRecord = newRecord.getSublistSubrecord({
                                            sublistId: sublist,
                                            fieldId: 'inventorydetail',
                                            line: i
                                        });

                                        var inventoryLine = subRecord.getLineCount({
                                            sublistId: 'inventoryassignment'
                                        }) || 0;
                                        log.audit({
                                            title: 'inventoryLine',
                                            details: inventoryLine
                                        });
                                        for (var l in param_obj_select[sublist][element].inventorynumber) {
                                            if (inventoryLine > l) {
                                                try {
                                                    subRecord.selectLine({
                                                        sublistId: 'inventoryassignment',
                                                        line: l
                                                    }); // The last line will now actually be at lastIndex + 1    

                                                } catch (errorl) {
                                                    try {
                                                        log.error({
                                                            title: 'param_obj_select[sublist][element]',
                                                            details: JSON.stringify(param_obj_select[sublist][element])
                                                        });
                                                        log.error({
                                                            title: 'errorl ' + errorl.message,
                                                            details: errorl
                                                        });
                                                        subRecord.insertLine({
                                                            sublistId: 'inventoryassignment',
                                                            line: l
                                                        });

                                                    } catch (errorl2) {
                                                        log.error({
                                                            title: 'errorl2 ' + errorl2.message,
                                                            details: errorl2
                                                        });
                                                    }
                                                }
                                            } else {
                                                subRecord.insertLine({
                                                    sublistId: 'inventoryassignment',
                                                    line: l
                                                }); // The last line will now actually be at lastIndex + 1    
                                            }

                                            subRecord.setSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: param_obj_select[sublist][element].inventorynumber[l].type,
                                                value: param_obj_select[sublist][element].inventorynumber[l].value,
                                                line: l
                                            });
                                            subRecord.setSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity',
                                                value: param_obj_select[sublist][element].inventorynumber[l].quantity,
                                                line: l
                                            });
                                        }
                                    }

                                    break;
                                }
                            }

                            newRecord.setSublistValue({
                                sublistId: sublist,
                                fieldId: 'itemreceive',
                                value: itemreceive,
                                line: i
                            });
                        }
                    }
                }
                respuesta.data = newRecord;

                respuesta.success = respuesta.data != '';
            } catch (error) {
                log.error({
                    title: 'error createRecordDetailReturnSave ' + error.message,
                    details: JSON.stringify(error)
                });
                respuesta.error = error;
            } finally {
                log.audit({
                    title: 'respuesta createRecordDetailReturnSave ' + newRecord.type,
                    details: respuesta
                });
                return respuesta;
            }
        }

        function submitRecord(param_type, param_id, param_values) {
            try {
                var respuesta = {
                    success: false,
                    data: "",
                    error: []
                };
                log.audit({
                    title: 'submitRecord',
                    details: //
                        " param_type: " + JSON.stringify(param_type) +
                        " param_id: " + JSON.stringify(param_id) +
                        " param_values: " + JSON.stringify(param_values)
                });

                respuesta.data = record.submitFields({
                    type: param_type,
                    id: param_id,
                    values: param_values,
                    options: {
                        enablesourcing: false,
                        ignoreMandatoryFields: true
                    }
                });

                respuesta.success = respuesta.data != "";
            } catch (error) {
                respuesta.error.push(JSON.stringify(error));
                log.error({
                    title: 'error submitRecord',
                    details: JSON.stringify(error)
                });
            } finally {
                log.emergency({
                    title: 'respuesta submitRecord',
                    details: JSON.stringify(respuesta)
                });
                return respuesta;
            }
        }


        return {
            createRecordDetailReturnSave: createRecordDetailReturnSave,
            submitRecord: submitRecord,
            createRecord: createRecord,
            searchRecord: searchRecord,
            createRecordDetail: createRecordDetail
        }
    });