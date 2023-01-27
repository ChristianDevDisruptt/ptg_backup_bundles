/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 * Confirmación de devoluciones de compra - picking-simple-confirm-interface - [Surtido simple]
 */
define(['N/record', 'N/search'], function (record, search) {
    var ubicacionesIndexadas = {};

    function _post(pickingD) {
        try {
            //var requestBody = context;
            log.audit('response', pickingD.length);
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
            pickingD.forEach(pk => {
                var folio = pk.folio;
                log.audit({
                    title: 'folio',
                    details: folio
                });

                var wareHouse = pk.warehouse;
                log.audit('wareHouse', wareHouse);

                var vendorreturnauthorizationSearchObj = search.create({
                    type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                    filters: [
                        ["mainline", "is", "T"],
                        "AND",
                        ["transactionnumber", "startswith", folio]
                    ],
                    columns: [
                        search.createColumn({
                            name: "tranid",
                            label: "Número de documento"
                        }),
                        search.createColumn({
                            name: 'custbody_disa_control_transaccion',
                            label: "Control de transacciones",
                        }),
                        search.createColumn({
                            name: "entity",
                            label: "Nombre"
                        })
                    ]
                });

                var srchResults = vendorreturnauthorizationSearchObj.run().getRange({
                    start: 0,
                    end: 999
                });

                var idT = srchResults[0].id;

                var controlId = srchResults[0].getValue({
                    name: 'custbody_disa_control_transaccion'
                }) || '[]';

                controlId = JSON.parse(controlId);
                log.audit('controlId', controlId);

                var movimientos = pk.pickingDetails.filter(move => !controlId.includes(move.id))
                log.audit('movimientos', movimientos);
                var idMovimientos = pk.pickingDetails.map(art => art.id);
                log.audit('idMovimientos', idMovimientos);

                if (movimientos.length < 1) {
                    log.audit('no creacion', 'Ya se procesaron todos los surtidos simples para esta transaccion');
                    return;
                }
                pk.pickingDetails.forEach(picking => {
                    //if (idMovimientos.includes(picking.pickingDetails.id)) {
                    var newItemFull = record.transform({
                        fromType: record.Type.VENDOR_RETURN_AUTHORIZATION,
                        fromId: idT,
                        toType: record.Type.ITEM_FULFILLMENT,
                        isDynamic: true
                    });

                    newItemFull.setValue({
                        fieldId: 'memo',
                        value: 'Ejecucion de pedido creada desde respuesta de wms' + controlId
                    });

                    var pickingDetailses = idMovimientos;

                    var lineas = newItemFull.getLineCount({
                        sublistId: 'item'
                    });

                    log.audit('lineas', lineas);

                    for (var i = 0; i < lineas; i++) {
                        newItemFull.selectLine({
                            sublistId: 'item',
                            line: i
                        });
                        var lineSku = newItemFull.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'itemname'
                        });
                        log.audit('SKU de linea', lineSku);

                        var idSku = newItemFull.getCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item'
                        });
                        log.audit('idSku', idSku);

                        var lookupItem = search.lookupFields({
                            type: record.Type.INVENTORY_ITEM,
                            id: idSku,
                            columns: ['upccode']
                        });

                        log.audit('lookupItem', lookupItem);

                        var item = lookupItem.upccode;
                        log.audit('item', item);
                        log.audit('sku wms', picking.sku);
                        var artRecibido = item == picking.sku;
                        log.audit('artRecibido', artRecibido);
                        if (artRecibido) {
                            var area = picking.area.substring(0, 2);
                            var locationId = ubicacionesIndexadas[wareHouse][area];
                            log.audit('locationId', locationId);

                            newItemFull.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantity',
                                value: picking.quantity,
                            });

                            newItemFull.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'location',
                                value: locationId
                            });

                            if (picking.lot) {
                                var subRecord = newItemFull.getCurrentSublistSubrecord({
                                    sublistId: 'item',
                                    fieldId: 'inventorydetail'
                                });


                                var lineasLote = subRecord.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                log.audit("lineasLote",lineasLote);

                                if (lineasLote < 0) {
                                    subRecord.selectNewLine({
                                        sublistId: 'inventoryassignment'
                                    });
                                } else {
                                    subRecord.selectLine({
                                        sublistId: 'inventoryassignment',
                                        line: 0
                                    });
                                }

                                log.audit('subRecord', subRecord);

                                var ltns = subRecord.getCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'receiptinventorynumber',
                                }) || '';

                                log.audit("ltns",ltns);
                                subRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'issueinventorynumber',
                                        value: 603
                                });

                                subRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'quantity',
                                    value: picking.quantity
                                });
                                subRecord.commitLine({
                                    sublistId: 'inventoryassignment'
                                });
                            }
                        } else {
                            newItemFull.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'itemreceive',
                                value: false,
                            });
                        }
                        newItemFull.commitLine({
                            sublistId: 'item'
                        });
                    }

                    log.audit('newItemFull', newItemFull);

                    var idVra = newItemFull.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    });

                    if (idVra) {
                        controlId.push(picking.id);

                        log.audit('Exito', 'La transaccion se creo con exito OK ' + picking.id);
                    } else {
                        log.audit('Error', 'La transaccion no se creo' + picking.id);
                    }

                    record.submitFields({
                        type: record.Type.VENDOR_RETURN_AUTHORIZATION,
                        id: idT,
                        values: {
                            custbody_disa_control_transaccion: JSON.stringify(controlId)
                        },
                        options: {
                            enablesourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    //}
                });

            });
        } catch (error) {
            log.audit('error', error);
        }

    }

    return {
        post: _post,
    }
});