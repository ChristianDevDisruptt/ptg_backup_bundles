/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define([
    "N/search",
    "N/runtime",
    "N/record"
], function (
    search,
    runtime,
    record
) {

    function beforeLoad(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE
            ) {
                context.newRecord.setValue({
                    fieldId: 'name',
                    value: "Por generar"
                });
            }
        } catch (error) {
            log.error({
                title: 'error beforeLoad',
                details: error
            });
        }
    }

    function beforeSubmit(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE
            ) {
                var d = new Date();
                var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
                var objDate = new Date(utc + (3600000 * '-5'));

                context.newRecord.setValue({
                    fieldId: 'name',
                    value: objDate.toISOString()
                });
            }
        } catch (error) {
            log.error({
                title: 'error beforeSubmit',
                details: error
            });
        }
    }

    function afterSubmit(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.XEDIT ||
                context.type == context.UserEventType.EDIT
            ) {
                var objSubmit = {};

                var sku_wms = context.newRecord.getValue({
                    fieldId: 'custrecord_drt_wep_id_sku_wms',
                });
                var ubicacion_wms = context.newRecord.getValue({
                    fieldId: 'custrecord_drt_wep_id_ubicacion_wms',
                });
                var warehouse = context.newRecord.getValue({
                    fieldId: 'custrecord_drt_wep_id_warehouse',
                });
                var cantidad_wms = context.newRecord.getValue({
                    fieldId: 'custrecord_drt_wep_id_cantidad_wms',
                });
                var lote_wms = context.newRecord.getValue({
                    fieldId: 'custrecord_drt_wep_id_lote_wms',
                });

                if (sku_wms) {
                    var objItem = searchRecord( //
                        search.Type.ITEM,
                        [
                            "upccode", search.Operator.IS, sku_wms
                        ],
                        [{
                            name: "upccode"
                        }]
                    );
                    if (objItem.success) {
                        for (var itemn in objItem.data) {
                            if (
                                objItem.data[itemn].id &&
                                objItem.data[itemn].upccode &&
                                objItem.data[itemn].upccode == sku_wms
                            ) {
                                objSubmit.custrecord_drt_wep_id_sku_netsuite = objItem.data[itemn].id;
                                break;
                            }
                        }
                    }
                }
                if (ubicacion_wms) {
                    var ubicacionesIndexadas = {}
                    ubicacion_wms = ubicacion_wms.substring(0, 2)
                    var locationSearchObj = search.create({
                        type: record.Type.LOCATION,
                        filters: [
                            ["custrecord_5826_loc_branch_id", search.Operator.IS, ubicacion_wms],
                            "AND",
                            ["custrecord_drt_parent", search.Operator.IS, warehouse]
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
                    log.audit({
                        title: 'locationSearchObj',
                        details: JSON.stringify(locationSearchObj)
                    });
                    if (
                        ubicacionesIndexadas &&
                        ubicacionesIndexadas[warehouse] &&
                        ubicacionesIndexadas[warehouse][ubicacion_wms]
                    ) {
                        objSubmit.custrecord_drt_wep_id_ubicacion_netsuite = ubicacionesIndexadas[warehouse][ubicacion_wms];
                    }
                }

                if (
                    lote_wms &&
                    objSubmit.custrecord_drt_wep_id_sku_netsuite
                ) {
                    var loteColumns = [
                        search.createColumn({
                            name: "inventorynumber"
                        }),
                        search.createColumn({
                            name: "item"
                        }),
                        search.createColumn({
                            name: "quantityonhand"
                        })
                    ];
                    var loteFilter = [
                        ["inventorynumber", search.Operator.IS, lote_wms],
                        "AND",
                        ["item", search.Operator.IS, objSubmit.custrecord_drt_wep_id_sku_netsuite],
                        "AND",
                        ["location","anyof",ubicacionesIndexadas[warehouse][ubicacion_wms]]
                    ]
                    var loteSearch = searchRecord(search.Type.INVENTORY_NUMBER, loteFilter, loteColumns);
                    if (loteSearch.success) {
                        for (var lote in loteSearch.data) {
                            log.debug('test', loteSearch.data[lote])
                            var loteText = loteSearch.data[lote].inventorynumber || '';
                            var loteId = loteSearch.data[lote].id || '';
                            var itemId = loteSearch.data[lote].item || '';
                            var cantidadLote = loteSearch.data[lote].quantityonhand || '';
                            if (
                                loteId &&
                                loteText &&
                                loteText == lote_wms &&
                                itemId &&
                                itemId == objSubmit.custrecord_drt_wep_id_sku_netsuite
                            ) {
                                objSubmit.custrecord_drt_wep_id_lote_netsuite = loteId;
                                objSubmit.custrecord_drt_wep_id_cantidad_netsuite = cantidadLote
                            }
                        }
                    }
                }
                var quantity_netsuite = searchInventory(
                    objSubmit.custrecord_drt_wep_id_sku_netsuite,
                    objSubmit.custrecord_drt_wep_id_ubicacion_netsuite
                );

                if (!lote_wms && quantity_netsuite.success) {
                    objSubmit.custrecord_drt_wep_id_cantidad_netsuite = quantity_netsuite.data
                }

                log.audit({
                    title: 'objSubmit',
                    details: JSON.stringify(objSubmit)
                });

                if (Object.keys(objSubmit).length > 0) {
                    record.submitFields({
                        type: context.newRecord.type,
                        id: context.newRecord.id,
                        values: objSubmit,
                        options: {
                            enablesourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        } catch (error) {
            log.error({
                title: 'error afterSubmit',
                details: error
            });
        }
    }

    function afterSubmit2(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.EDIT
            ) {
                var objSubmit = {};
                if (
                    runtime.getCurrentScript().getParameter({
                        name: '	custscript_disa_inventory_folder'
                    })
                ) {
                    var fdata = createFile(
                        runtime.getCurrentScript().getParameter({
                            name: '	custscript_disa_inventory_folder'
                        })
                    );
                    if (fdata.success) {
                        if (fdata.data.detail_csv) {
                            objSubmit.custrecord_wms_inventory_detail_csv = fdata.data.detail_csv;
                        }
                        if (fdata.data.detail_json) {
                            objSubmit.custrecord_wms_inventory_detail_json = fdata.data.detail_json;
                        }
                        if (fdata.data.summary_csv) {
                            objSubmit.custrecord_wms_inventory_summary_csv = fdata.data.summary_csv;
                        }
                        if (fdata.data.summary_json) {
                            objSubmit.custrecord_wms_inventory_summary_json = fdata.data.summary_json;
                        }
                    }
                }
                if (Object.keys(objSubmit).length > 0) {
                    record.submitFields({
                        type: context.newRecord.type,
                        id: context.newRecord.id,
                        values: objSubmit,
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        } catch (error) {
            log.error({
                title: 'error afterSubmit',
                details: error
            });
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
            log.emergency({
                title: 'respuesta searchRecord ' + param_type,
                details: respuesta
            });
            return respuesta;
        }
    }

    function searchInventory(param_item, param_location) {
        try {
            var respuesta = {
                success: false,
                data: 0,
                error: []
            };
            var field_quantity = "quantityonhand";
            var arrayFilter = [
                ["internalid", search.Operator.IS, param_item]
            ]
            if (
                param_location
            ) {
                arrayFilter.push("AND");
                arrayFilter.push(["inventorylocation", search.Operator.IS, param_location]);
                field_quantity = "locationquantityonhand";
            }
            if (param_item) {
                var itemSearchObj = search.create({
                    type: search.Type.ITEM,
                    filters: arrayFilter,
                    columns: [
                        search.createColumn({
                            name: "inventorylocation",
                        }),
                        search.createColumn({
                            name: field_quantity
                        })
                    ]
                });
                var searchResultCount = itemSearchObj.runPaged().count;
                log.debug("itemSearchObj result count", searchResultCount);
                itemSearchObj.run().each(function (result) {
                    var item_search = result.id;
                    var location_search = result.getValue({
                        name: "inventorylocation",
                    }) || "";
                    var quantity_search = result.getValue({
                        name: field_quantity,
                    }) || 0;
                    if (
                        item_search &&
                        param_item == item_search
                    ) {
                        respuesta.data = quantity_search;
                        respuesta.success = true;
                        return false;
                    } else {
                        return true;
                    }
                });
            }
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

    return {
        // beforeLoad: beforeLoad,
        // beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit,
    }
});