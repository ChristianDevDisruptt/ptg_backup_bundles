/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define([
    'N/format',
    'N/search',
    'N/record',
    'N/file'
], function (
    format,
    search,
    record,
    file
) {
    function getInputData() {
        try {
            var busqueda = "";

            var customrecord_wep_inventory_wmsSearchObj = search.create({
                type: "customrecord_wep_inventory_wms",
                filters: [
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custrecord_wms_inventory_terminado", "is", "F"],
                    "AND",
                    ["custrecord_wms_inventory_procesando", "is", "F"]
                ],
                columns: [
                    search.createColumn({
                        name: "name",
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "custrecord_wms_inventory_summary_json",
                    })
                ]
            });
            var searchResultCount = customrecord_wep_inventory_wmsSearchObj.runPaged().count;
            log.debug("customrecord_wep_inventory_wmsSearchObj result count", searchResultCount);
            customrecord_wep_inventory_wmsSearchObj.run().each(function (result) {
                var summary_json = result.getValue({
                    name: "custrecord_wms_inventory_summary_json",
                }) || '';
                log.audit({
                    title: 'summary_json',
                    details: JSON.stringify(summary_json)
                });
                if (
                    summary_json
                ) {
                    record.submitFields({
                        type: "customrecord_wep_inventory_wms",
                        id: result.id,
                        values: {
                            custrecord_wms_inventory_procesando: true
                        },
                        options: {
                            enablesourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                    var fileObj = file.load({
                        id: summary_json
                    });
                    var contents = fileObj.getContents();
                    busqueda = JSON.parse(contents);
                    for (var b in busqueda) {
                        busqueda[b].id = result.id;
                    }
                    return false;
                } else {
                    return true;

                }
            });

        } catch (error) {
            log.error('errorInputData', error)
        } finally {
            log.audit('busqueda', busqueda)
            return busqueda;
        }
    }

    function map(context) {
        try {
            // log.audit('map ', context);
            var searchResult = JSON.parse(context.value);
            // log.audit('searchResult', searchResult);
            context.write({
                key: searchResult.id,
                value: searchResult
            });

        } catch (error) {
            log.error('error map', error);
        }
    }

    function reduce(context) {
        try {
            log.audit('reduce', context);
            /* 
            customrecord_wep_inventory_details
            
            custrecord_drt_wep_id_solicitud
            custrecord_drt_wep_id_sku_wms
            custrecord_drt_wep_id_cantidad_wms
            custrecord_drt_wep_id_ubicacion_wms
            custrecord_drt_wep_id_lote_wms
            custrecord_drt_wep_id_lote_netsuite
            custrecord_drt_wep_id_cantidad_netsuite
            custrecord_drt_wep_id_ubicacion_netsuite
            custrecord_drt_wep_id_sku_netsuite
            custrecord_drt_wep_id_linea
            */

            /* 
            {
                "dateConsulted": "2021-09-01T14:53:22.000Z",
                "product": {
                    "sku": "01010062",
                    "description": "CALENTADOR INSTANTANEO 6 L/MIN DE RESPALDO CIR-6"
                },
                "warehouse": {
                    "code": "28002",
                    "description": "DISA A.C."
                },
                "quantity": 12,
                "committedQuantity": 0,
                "quantityAvailable": 0,
                "inventoryStatus": {},
                "area": {},
                "pendingQuantity": 0,
                "lot": "LT-210821",
                "id": "2"
            } 
            */
          	log.audit('prueba',context.values.length);
            var line = 0;
            for (line; line < context.values.length; line++) {
                var objCreate = {
                    custrecord_drt_wep_json: context.values[line]
                };
              	log.audit('objCreate', objCreate);
                var objData = JSON.parse(context.values[line]);
                if (objData.id) {
                    objCreate.custrecord_drt_wep_id_solicitud = objData.id;
                }
                if (objData.product.sku) {
                    objCreate.custrecord_drt_wep_id_sku_wms = objData.product.sku;
                }
                if (
                    objData.area &&
                    objData.area.code
                ) {
                    objCreate.custrecord_drt_wep_id_ubicacion_wms = objData.area.code;
                }
                if (
                    objData.area &&
                    objData.area.description
                ) {
                    objCreate.custrecord_drt_wep_id_ubicacion_tx_wms = objData.area.description;
                }
                if (
                    objData.warehouse &&
                    objData.warehouse.code
                ) {
                    objCreate.custrecord_drt_wep_id_warehouse = objData.warehouse.code;
                }
                if (objData.quantity) {
                    objCreate.custrecord_drt_wep_id_cantidad_wms = objData.quantity;
                }
                if (objData.lot) {
                    objCreate.custrecord_drt_wep_id_lote_wms = objData.lot;
                }
                objCreate.custrecord_drt_wep_id_linea = (line + 1);
                if (objData.dateConsulted) {
                    objCreate.custrecord_drt_wep_id_fecha_wms = format.parse({
                        value: new Date(objData.dateConsulted),
                        type: format.Type.DATE
                    });
                }
                createRecord("customrecord_wep_inventory_details", objCreate, {});

            }
            var objData0 = JSON.parse(context.values[0]);
            record.submitFields({
                type: "customrecord_wep_inventory_wms",
                id: objData0.id,
                values: {
                    custrecord_wms_inventory_terminado: true,
                    custrecord_wms_inventory_procesando: false
                },
                options: {
                    enablesourcing: false,
                    ignoreMandatoryFields: true
                }
            });
        } catch (error) {
            log.error('error reduce', error)
        }
    }

    function summarize(summary) {
        log.audit('summary', summary);
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

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});