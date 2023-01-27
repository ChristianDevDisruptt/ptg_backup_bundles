/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 * Cambios de ubicaciones - áreas - movement-between-area-interface
 */
 define(
    [
        './drt_wep_save_record_lib',
        'N/record',
        'N/search',
        'N/runtime',
        'N/format'
    ],
    function (
        drt_wep_save,
        record,
        search,
        runtime,
        format
    ) {
        var ubicacionesIndexadas = {};
        var idInternoNetsuiteSubcidiaria = {
            'SANDBOX': 8,
            'PRODUCTION': 2
        };

        function _post(context) {
            try {
              	log.emergency('entrada',context);
                var respuesta = {
                    success: false,
                    data: [],
                    error: [],
                    sinInventario: []
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
                //log.audit('ubicaciones indexadas', ubicacionesIndexadas);
                var entrada = context;


                for (var u in entrada) {
                    var codOrigen = entrada[u].originArea.code.substring(0, 2);
                    var codDestino = entrada[u].destinationArea.code.substring(0, 2);
                    var id = entrada[u].putMovementHistoryId;
                    var cantidad = '';
                    var item = [];
                    var producto = '';
                    var putMovementIdHistory = entrada[u].putMovementHistoryId;
                    log.audit('codOrigen', codOrigen);
                    log.audit('codDestino', codDestino);
                  	var consultedDate = entrada[u].movementDate;
                    log.audit('consultedDate', consultedDate);
                    var formato1 = format.format({
                        value: new Date(consultedDate),
                        type: format.Type.DATE
                    });
                    log.audit('formato1', formato1);
                    var formattedDateString = format.parse({
                        value: formato1,
                        type: format.Type.DATE
                    });
                    log.audit('formattedDateString', formattedDateString);
                    var inventory = entrada[u].inventoryDetails.map(articulo => {
                        item.push(articulo.product.sku);
                        return {
                            cantidad: articulo.quantity,
                            sku: articulo.product.sku,
                            lote: articulo.lot
                        }
                    });

                    var inventoryitemSearchObj = search.create({
                        type: record.Type.INVENTORY_ITEM,
                        filters: [
                            ["type", "anyof", "InvtPart"],
                            "AND",
                            ["upccode", "haskeywords", item]
                        ],
                        columns: [
                            search.createColumn({
                                name: "itemid",
                                sort: search.Sort.ASC,
                                label: "Nombre"
                            }),
                            search.createColumn({
                                name: "upccode",
                                sort: search.Sort.ASC,
                                label: "codigo sin guiones"
                            })
                        ]
                    });
                    /*
                        {
                            100014:118
                        }
                    */
                    var articulosIndexxados = {};
                    var srcInhResults0 = inventoryitemSearchObj.run().each(algo => {
                        var upcCode = algo.getValue({
                            name: 'upccode'
                        });
                        articulosIndexxados[upcCode] = algo.id
                        return true;
                    });

                    log.audit({
                        title: 'articulosIndexxados',
                        details: articulosIndexxados
                    });

                    var wareHouse = entrada[u].warehouse.code;

                    var ubicacionDestino = ubicacionesIndexadas[wareHouse][codDestino];
                    var ubicacionOrigen = ubicacionesIndexadas[wareHouse][codOrigen];
                    log.audit('ubicacionDestino', ubicacionDestino);
                    log.audit('ubicacionOrigen', ubicacionOrigen);

                    var objField = {
                        'subsidiary': idInternoNetsuiteSubcidiaria[runtime.envType],
                        'location': ubicacionOrigen,
                        'transferlocation': ubicacionDestino,
                        'memo': 'Transferencia de inventario creada desde interfaz GET de Movivimientos entre areas'
                    };

                    var inventoryTransferId = search.create({
                        type: record.Type.INVENTORY_TRANSFER,
                        filters: [
                            ["custbody_disa_wms_id", "is", putMovementIdHistory]
                        ],
                        columns: [
                            'custbody_disa_wms_id'
                        ]
                    });

                    var inventoryTransferResults = inventoryTransferId.run().getRange({
                        start: 0,
                        end: 999
                    });

                    if (inventoryTransferResults.length > 0) {
                        log.audit('validacion', 'Ya se tiene una transaccion con este mismo identificador');
                    } else {
                        inventory.forEach(art => {
                            try {
                                if (
                                    (ubicacionOrigen != ubicacionDestino) &&
                                    (ubicacionDestino != 03)
                                ) {
                                    var quantity_wms = art.cantidad;
                                    var quantity_ns = 0;
                                    var validQuantity = searchInventory(articulosIndexxados[art.sku], ubicacionOrigen, art.cantidad);
                                    if (
                                        validQuantity.success
                                    ) {
                                        if (
                                            art.cantidad != validQuantity.data
                                        ) {
                                            quantity_ns = validQuantity.data;
                                            objField.memo = objField.memo + " con diferencia Netsuite: " + validQuantity.data + " WMS: " + art.cantidad;
                                            art.cantidad = validQuantity.data;
                                        }

                                        var newRecord = record.create({
                                            type: record.Type.INVENTORY_TRANSFER,
                                            isDynamic: true
                                        });


                                        newRecord.setValue({
                                            fieldId: 'custbody_disa_wms_id',
                                            value: putMovementIdHistory
                                        });

                                      	newRecord.setValue({
                                            fieldId: 'trandate',
                                            value: formattedDateString
                                        });
                                      	
                                        for (var field in objField) {
                                            newRecord.setValue({
                                                fieldId: field,
                                                value: objField[field]
                                            });
                                        }

                                        newRecord.selectNewLine({
                                            sublistId: 'inventory'
                                        });
                                        newRecord.setCurrentSublistValue({
                                            sublistId: 'inventory',
                                            fieldId: 'item',
                                            value: articulosIndexxados[art.sku]
                                        });

                                        newRecord.setCurrentSublistValue({
                                            sublistId: 'inventory',
                                            fieldId: 'adjustqtyby',
                                            value: art.cantidad
                                        });

                                        if (art.lote) {
                                            log.audit('ok', art.lote);
                                            var subRecord = newRecord.getCurrentSublistSubrecord({
                                                sublistId: 'inventory',
                                                fieldId: 'inventorydetail'
                                            });

                                            log.audit('subRecord', subRecord);


                                            subRecord.selectNewLine({
                                                sublistId: 'inventoryassignment'
                                            });

                                            subRecord.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'receiptinventorynumber',
                                                value: art.lote
                                            });

                                            log.audit('total', art.cantidad);

                                            subRecord.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity',
                                                value: art.cantidad
                                            });

                                            subRecord.commitLine({
                                                sublistId: 'inventoryassignment'
                                            });
                                        }

                                        newRecord.commitLine({
                                            sublistId: 'inventory'
                                        });

                                        var newMove = newRecord.save({
                                            enableSourcing: false,
                                            ignoreMandatoryFields: true
                                        }) || '';

                                        if (newMove) {
                                            respuesta.data.push({
                                                id: newMove,
                                                location: objField.location,
                                                transferlocation: objField.transferlocation,
                                                memo: objField.memo,
                                                wms: quantity_wms,
                                                ns: quantity_ns,
                                            });

                                            var objMovementAreas = {
                                                custrecord_drt_wep_output_json: JSON.stringify(art),
                                                custrecord_drt_wep_output_metodo: 3,
                                                custrecord_drt_wep_output_name: 10,
                                                custrecord_disa_folio_netsuite: putMovementIdHistory
                                            }
                                            log.audit('objMovementAreas', objMovementAreas);

                                            var saveMovementAreas = drt_wep_save.saveRequest(objMovementAreas);
                                            if (saveMovementAreas.success) {
                                                log.audit('Ok', 'Se ha credo con exito el movimiento entre area.');
                                            }
                                        }

                                        log.audit({
                                            title: 'Creado con exito',
                                            details: 'OK'
                                        })
                                    } else {
                                        log.error({
                                            title: 'Inventario Negativo',
                                            details: JSON.stringify(art)
                                        });
                                        respuesta.sinInventario.push({
                                            location: objField.location,
                                            transferlocation: objField.transferlocation,
                                            wms: quantity_wms,
                                            ns: quantity_ns,
                                            putMovementHistoryId: putMovementIdHistory,
                                            originArea: entrada[u].originArea.description,
                                            destinationArea: entrada[u].destinationArea.description,
                                        });

                                        log.error({
                                            title: 'Inventario Negativo',
                                            details: JSON.stringify({
                                                location: objField.location,
                                                transferlocation: objField.transferlocation,
                                                wms: quantity_wms,
                                                ns: quantity_ns,
                                                putMovementHistoryId: putMovementIdHistory,
                                                originArea: entrada[u].originArea.description,
                                                destinationArea: entrada[u].destinationArea.description,
                                            })
                                        });
                                    }
                                } else {
                                    log.audit({
                                        title: 'error ubicaciones',
                                        details: //
                                            " ubicacionOrigen: " + ubicacionOrigen +
                                            " ubicacionDestino: " + ubicacionDestino
                                    });
                                }
                            } catch (errorart) {
                                log.error({
                                    title: 'errorart',
                                    details: errorart
                                });
                                log.error({
                                    title: 'errorart WMS',
                                    details: JSON.stringify(art)
                                });
                                log.error({
                                    title: 'errorart NS',
                                    details: JSON.stringify(objField)
                                });
                                respuesta.error.push({
                                    wms: art,
                                    putMovementHistoryId: putMovementIdHistory,
                                    originArea: entrada[u].originArea.description,
                                    destinationArea: entrada[u].destinationArea.description,
                                    errorart: errorart.message
                                });

                                
                                var errorObjMovementAreas = {
                                    custrecord_drt_wep_output_json: JSON.stringify(art),
                                    custrecord_drt_wep_output_metodo: 3,
                                    custrecord_drt_wep_output_name: 10,
                                    custrecorddrt_id_wms: putMovementIdHistory,
                                    custrecord_disa_error:JSON.stringify(errorart) 
                                }

                                log.audit('errorObjMovementAreas', errorObjMovementAreas);

                                var errorMovementAreas = drt_wep_save.saveRequest(errorObjMovementAreas);
                                if (errorMovementAreas.success) {
                                    log.audit('error Movimientos', 'Se ha identificado un error en la interfas de movimientos entre areas 1.');
                                }
                            }
                        });
                    }
                }
                log.emergency({
                    title: 'sinInventario: ' + respuesta.sinInventario.length,
                    details: JSON.stringify(respuesta.sinInventario)
                });
            } catch (error) {
                log.error({
                    title: 'error',
                    details: JSON.stringify(error)
                });
            } finally {
                log.emergency({
                    title: 'respuesta',
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
                        var diferencia = parseFloat(quantity_search) - parseFloat(param_quantity);
                        if (
                            diferencia < 0
                        ) {
                            respuesta.data = quantity_search;

                        } else {
                            respuesta.data = param_quantity;
                        }
                        return false;
                    } else {
                        return true;
                    }
                });
                respuesta.success = respuesta.data > 0;

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
            post: _post
        }
    });