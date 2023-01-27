/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 * Ajustes - adjust-confirm-interface
 */
 define([
    './drt_wep_save_record_lib',
    'N/record',
    'N/search',
    'N/runtime'
], function (
    drt_wep_save_record_lib,
    record,
    search,
    runtime
) {

    var ubicacionesIndexadas = {};
    var idInternoNetsuiteSubcidiaria = {
        'SANDBOX': 8,
        'PRODUCTION': 2
    };
    var idInternoCuentaContable = {
        'SANDBOX': 213,
        'PRODUCTION': 214
    };

    function _post(context) {
        try {
            log.audit({
                title: 'context',
                details: JSON.stringify(context)
            });
            var respuesta = {
                success: false,
                data: [],
                error: []
            };
            var locationSearchObj = search.create({
                type: record.Type.LOCATION,
                filters: [
                    ["custrecord_5826_loc_branch_id", "isnotempty", ""],
                    "AND",
                    ["custrecord_drt_parent", "isnotempty", ""]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_5826_loc_branch_id",
                        sort: search.Sort.ASC,
                        label: "ID Externo"
                    }), search.createColumn({
                        name: "custrecord_drt_parent",
                        label: "Parent"
                    })
                ]
            });

            locationSearchObj.run().each(function (loc) {
                var extId = loc.getValue({
                    name: 'custrecord_5826_loc_branch_id'
                });
                var parent = loc.getValue({
                    name: 'custrecord_drt_parent'
                });
                if (!ubicacionesIndexadas[parent]) {
                    ubicacionesIndexadas[parent] = {};
                }
                ubicacionesIndexadas[parent][extId] = loc.id;
                return true;
            });
            context.forEach(receipt => {
                log.audit({
                    title: 'receipt',
                    details: JSON.stringify(receipt)
                });

                var motivoAjuste = '';
                if (
                    receipt.adjustmentReason &&
                    receipt.adjustmentReason.name
                ) {
                    motivoAjuste = receipt.adjustmentReason.name;

                }
                if (motivoAjuste != "Ajuste WMS Sin Interfaz") {
                    switch (receipt.adjustmentType) {
                        case 'InventoryAdjustment':
                            var newJournal = processInventoryAdjustment(receipt, motivoAjuste, receipt.warehouse.code);
                            if (newJournal.success) {
                                respuesta.data = respuesta.data.concat(newJournal.data);
                            }
                            if (newJournal.error.length > 0) {
                                respuesta.error = respuesta.error.concat(newJournal.error);
                            }
                            break;
                        case 'QuantityAdjustment':
                            var newJournal = processInventoryAdjustment(receipt, motivoAjuste, receipt.warehouse.code);
                            if (newJournal.success) {
                                respuesta.data = respuesta.data.concat(newJournal.data);
                            }
                            if (newJournal.error.length > 0) {
                                respuesta.error = respuesta.error.concat(newJournal.error);
                            }
                            break;
                        default:
                            break;
                    }
                } else {
                    log.audit({
                        title: "Ajuste WMS Sin Interfaz",
                        details: JSON.stringify(receipt)
                    });
                }
            });
        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta _post',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function processInventoryAdjustment(param_inventory, param_motivo, warehouse) {
        try {
            var respuesta = {
                success: false,
                data: [],
                error: []
            };
            var arrayHistoryId = param_inventory.adjustmentDetails.map(obj => obj.movementHistoryId);
            var arraySku = param_inventory.adjustmentDetails.map(obj => obj.sku);
            var arrayFilter = [];
            arrayHistoryId.forEach(id_wms => {
                arrayFilter.push(["custbody_disa_wms_id", search.Operator.IS, id_wms.toString()]);
                arrayFilter.push('OR');
            });
            arrayFilter.pop();
            var objInventory = searchRecord( //
                search.Type.INVENTORY_ADJUSTMENT,
                [
                    ["mainline", "is", "T"],
                    "AND",
                    arrayFilter,
                ],
                [{
                    name: "custbody_disa_wms_id"
                }]
            );

            var nuevosMovimientos = [];
            if (objInventory.success) {
                var arrayTransactionExist = [];
                for (var ie in objInventory.data) {
                    if (
                        objInventory.data[ie] &&
                        objInventory.data[ie].custbody_disa_wms_id
                    ) {
                        arrayTransactionExist.push(parseInt(objInventory.data[ie].custbody_disa_wms_id));
                    }
                };
                nuevosMovimientos = arrayHistoryId.filter(move => !arrayTransactionExist.includes(move));
            } else {
                nuevosMovimientos = arrayHistoryId;
            }
            log.audit({
                title: 'nuevosMovimientos',
                details: JSON.stringify(nuevosMovimientos)
            });

            var filterItem = [];
            arraySku.forEach(sku => {
                filterItem.push([
                    // "name", search.Operator.IS, sku
                    "upccode", search.Operator.IS, sku
                ]);
                filterItem.push('OR');
            });
            filterItem.pop();
            var objItem = searchRecord( //
                search.Type.ITEM,
                filterItem,
                [{
                    name: "upccode"
                }]
            );
            if (objItem.success) {
                var objSku = {};
                for (var itemn in objItem.data) {
                    if (
                        objItem.data[itemn].id &&
                        objItem.data[itemn].upccode
                    ) {
                        objSku[objItem.data[itemn].upccode] = objItem.data[itemn].id;
                    }
                }

                param_inventory.adjustmentDetails.forEach(receipt => {

                    // "movementCode": "Decrease",
                    // "movementCode": "Increase",

                    var adjustqtyby = parseFloat(receipt.quantityAdjusted);
                    var lote = "";
                    if (receipt.lot) {
                        lote = receipt.lot
                    };
                    var area = receipt.area.code;
                    if (area) {
                        area = area.substring(0, 2);
                    }
                    if (receipt.movementCode == "Decrease") {
                        adjustqtyby *= -1;
                    }
                    log.audit('Cantidad a actualizar original:', receipt.quantityAdjusted);
                    log.audit('Cantidad a actualizar de acuerdo al tipo:', adjustqtyby);
                    if (
                        nuevosMovimientos.includes(parseInt(receipt.movementHistoryId))
                    ) {
                        if (
                            adjustqtyby != 0 &&
                            receipt.quantityAdjusted &&
                            parseFloat(receipt.quantityAdjusted) > 0 &&
                            area &&
                            ubicacionesIndexadas[warehouse] &&
                            ubicacionesIndexadas[warehouse][area] &&
                            receipt.sku &&
                            objSku[receipt.sku] &&
                            warehouse
                        ) {
                            var objField = {
                                'subsidiary': idInternoNetsuiteSubcidiaria[runtime.envType],
                                'adjlocation': ubicacionesIndexadas[warehouse][area],
                                'memo': 'Integracion WMS', // JSON.stringify(receipt),
                                'custbody_disa_wms_id': receipt.movementHistoryId,
                                'account': idInternoCuentaContable[runtime.envType],
                                'custbody_disa_motivos': param_motivo,
                            };
                            log.audit('adjustqtyby searchInventory', adjustqtyby);
                            var validQuantity = searchInventory(objSku[receipt.sku], ubicacionesIndexadas[warehouse][area], adjustqtyby);
                            log.audit('validQuantity searchInventory', validQuantity)

                            if (
                                validQuantity.success
                            ) {
                                if (
                                    adjustqtyby != validQuantity.data
                                ) {
                                    objField.memo = objField.memo + " con diferencia Netsuite: " + adjustqtyby + " WMS: " + validQuantity.data;
                                    adjustqtyby = validQuantity.data;
                                }
                                var objLine = {
                                    'inventory': [{
                                        item: objSku[receipt.sku],
                                        location: ubicacionesIndexadas[warehouse][area],
                                        adjustqtyby: adjustqtyby,
                                        lot: lote
                                    }],
                                };
                                var newJournal = createRecord(record.Type.INVENTORY_ADJUSTMENT, objField, objLine);
                                if (newJournal.success) {
                                    respuesta.data.push(newJournal);

                                    var recordLog = {
                                        custrecord_drt_wep_output_json: JSON.stringify({
                                            recordType: record.Type.INVENTORY_ADJUSTMENT,
                                            body: objField,
                                            line: objLine
                                        }),
                                        custrecord_drt_wep_output_metodo: 3,
                                        custrecord_drt_wep_output_name: 11,
                                        custrecord_drt_disa_responser_body: JSON.stringify(receipt)
                                    }

                                    var saveVendorRA = drt_wep_save_record_lib.saveRequest(recordLog);

                                    if (saveVendorRA) {
                                        log.audit('Success', 'Se creo con  exito el ajuste de inventario.');
                                    }
                                }
                            } else {
                                log.error({
                                    title: 'Inventario Negativo',
                                    details: JSON.stringify(receipt)
                                });

                                var errorAdjustInventory = {
                                    custrecord_drt_wep_output_json: JSON.stringify({
                                        recordType: record.Type.INVENTORY_ADJUSTMENT,
                                        body: objField,
                                        line: objLine
                                    }),
                                    custrecord_drt_wep_output_name: 11,
                                    custrecord_drt_wep_output_metodo: 3,
                                    custrecord_disa_error: JSON.stringify(receipt)
                                }
                                var saveErrorRA = drt_wep_save_record_lib.saveRequest(errorAdjustInventory);
                                log.audit('saveErrorRA', saveErrorRA);

                                if (saveVendorRA.success) {
                                    log.audit('Error', 'El ajuste no se pudo realizar por que contiene errores');
                                }

                            }
                        } else {
                            log.audit({
                                title: 'No es valido el ajuste',
                                details: JSON.stringify({
                                    item: objSku[receipt.sku],
                                    location: ubicacionesIndexadas[warehouse][area],
                                    adjustqtyby: adjustqtyby,
                                    lot: lote
                                })
                            });
                            log.audit({
                                title: 'datos no validos',
                                details: JSON.stringify({
                                    area: area,
                                    adjustqtyby: adjustqtyby,
                                    receipt_quantityAdjusted: receipt.quantityAdjusted,
                                    receipt_area: receipt.area,
                                    receipt_area_code: area,
                                    ubicacionesIndexadas_warehouse: ubicacionesIndexadas[warehouse],
                                    ubicacionesIndexadas_warehouse_area_code: ubicacionesIndexadas[warehouse][area],
                                    receipt_sku: receipt.sku,
                                    objSku_sku: objSku[receipt.sku],
                                    movementHistoryId: receipt.movementHistoryId,
                                    nuevosMovimientos: nuevosMovimientos,
                                    nuevosMovimientos_nuevosMovimientos: nuevosMovimientos.includes(parseInt(receipt.movementHistoryId)),
                                    warehouse_: warehouse,
                                })
                            });
                        }
                    } else {
                        log.audit({
                            title: 'Transaccion Existente',
                            details: receipt.movementHistoryId
                        });
                    }
                });
            }
            respuesta.success = respuesta.data.length > 0;
        } catch (error) {
            log.error({
                title: 'error processInventoryAdjustment',
                details: JSON.stringify(error)
            });
            respuesta.error.push(JSON.stringify(error));
        } finally {
            log.emergency({
                title: 'respuesta processInventoryAdjustment',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function searchInventory(param_item, param_location, param_quantity) {
        try {
            var respuesta = {
                success: false,
                data: -1,
                error: []
            };
            var quantityNs = -1;
            log.audit({
                title: 'searchInventory',
                details: //
                    " param_item " + param_item +
                    " param_location " + param_location +
                    " param_quantity " + param_quantity
            });

            var itemSearchObj = search.create({
                type: "item",
                filters: [
                    ["internalid", search.Operator.IS, param_item],
                    "AND",
                    ["inventorylocation", search.Operator.IS, param_location]
                ],
                columns: [
                    search.createColumn({
                        name: "inventorylocation",
                    }),
                    search.createColumn({
                        name: "locationquantityonhand"
                    })
                ]
            });
            var searchResultCount = itemSearchObj.runPaged().count;
            log.audit({
                title: 'searchResultCount',
                details: searchResultCount
            });
            itemSearchObj.run().each(function (result) {
                var item_search = result.id;
                var location_search = result.getValue({
                    name: "inventorylocation",
                }) || "";
                var quantity_search = parseFloat(result.getValue({
                    name: "locationquantityonhand",
                }) || 0);
                log.audit({
                    title: 'result ' + searchResultCount +
                        " item_search: " + item_search +
                        " location_search: " + location_search +
                        " quantity_search: " + quantity_search,
                    details: JSON.stringify(result)
                });

                if (
                    item_search &&
                    location_search &&
                    param_item == item_search &&
                    param_location == location_search
                ) {
                    var diferencia = parseFloat(quantity_search) + parseFloat(param_quantity);
                    quantityNs = parseFloat(quantity_search);
                    if (
                        diferencia < 0
                    ) {
                        respuesta.data = -1 * diferencia + param_quantity;
                    } else {
                        respuesta.data = param_quantity;
                        respuesta.success = true;
                    }
                    return false;
                } else {
                    return true;
                }
            });
            quantityNs += parseFloat(respuesta.data);
            respuesta.success = respuesta.data != 0 && quantityNs >= 0;

        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error searchInventory',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta searchInventory',
                details: JSON.stringify(respuesta)
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

                        if (
                            field == 'lot' &&
                            param_obj_sublist[sublist][element][field]
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
                title: 'respuesta createRecord ' + param_type,
                details: respuesta
            });
            return respuesta;
        }
    }

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
            log.audit({
                title: 'respuesta searchRecord ' + param_type,
                details: respuesta
            });
            return respuesta;
        }
    }

    return {
        post: _post
    }
});