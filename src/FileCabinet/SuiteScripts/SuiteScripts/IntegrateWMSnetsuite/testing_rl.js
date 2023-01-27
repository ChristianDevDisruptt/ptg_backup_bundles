/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *Confirmación de órdenes de venta - shipment-interface - [Salida de embarque]
 *Confirmación Traspasos a Cedis - shipment-interface - [Salida de embarque]
 */
define([
    './drt_wep_integration_lib',
    'N/record',
    'N/search',
    'N/runtime',
    './drt_wep_save_record_lib'
], function (
    drt_wep_lib,
    record,
    search,
    runtime,
    drt_wep_save
) {
    var idInternoNetsuiteSubcidiaria = {
        'SANDBOX': 8,
        'PRODUCTION': 2
    };
    var idInternoNetsuiteLocation = {
        'SANDBOX': 218,
        'PRODUCTION': 211
    };

    function _post(context) {
        try {
            log.audit({
                title: '_post',
                details: JSON.stringify(context)
            });

            var respuesta = {
                success: false,
                length: 0,
                data: {
                    saleso: [],
                    trnfro: [],
                },
                error: []
            };

            var objRequest = context;

            var inventoryTrsnsferSalesOrder = {};
            var itemSkuObj = {};
            var skuLot = {};
            var skuObj = {};
            var loteObj = {};
            var loteItemObj = {};
            var objTransaction = {};
            /* custbody_disa_control_transaccion */

            /* 
                Lote & Sku WMS
            */
            for (var i_1 in context) {
                for (var i_2 in context[i_1].shippings) {
                    log.emergency({
                        title: 'context[i_1].shippings[i_2]',
                        details: JSON.stringify(context[i_1].shippings[i_2])
                    });
                    for (var i_3 in context[i_1].shippings[i_2].shippingDetails) {
                        var typeTransaction = '';
                        var folioTransaccion = context[i_1].shippings[i_2].shippingDetails[i_3].shipmentOrder.folio;
                        if (folioTransaccion) {
                            folioTransaccion = folioTransaccion.toLocaleLowerCase();
                            typeTransaction = folioTransaccion.substring(0, 6);

                            if (!objTransaction[typeTransaction]) {
                                objTransaction[typeTransaction] = {};
                            }
                            if (!objTransaction[typeTransaction][folioTransaccion]) {
                                objTransaction[typeTransaction][folioTransaccion] = {
                                    id_netsuite: '',
                                    id_wms: '',
                                    custentity_disa_oficina_ventas: '',
                                    custbody_disa_control_transaccion: '',
                                    line: {}
                                };
                            }

                            for (var i_4 in context[i_1].shippings[i_2].shippingDetails[i_3].inventoryHeader.inventoryDetails) {
                                var dl = context[i_1].shippings[i_2].shippingDetails[i_3].inventoryHeader.inventoryDetails[i_4];
                                var sku_context = dl.product.sku;
                                var lot_context = dl.lot;
                                var quantity_context = dl.quantity;

                                if (
                                    lot_context &&
                                    !loteObj[lot_context]
                                ) {
                                    loteObj[lot_context] = {};
                                    loteItemObj[lot_context] = {};
                                }

                                if (
                                    lot_context &&
                                    sku_context &&
                                    loteObj[lot_context] &&
                                    !loteObj[lot_context][sku_context]
                                ) {
                                    loteObj[lot_context][sku_context] = "";
                                    loteItemObj[lot_context][sku_context] = "";
                                }
                                if (
                                    sku_context &&
                                    !skuObj[sku_context]
                                ) {
                                    skuObj[sku_context] = '';
                                    itemSkuObj[sku_context] = ''
                                }
                                if (
                                    lot_context &&
                                    !itemSkuObj[sku_context]
                                ) {
                                    itemSkuObj[sku_context] = lot_context;
                                }

                                if (
                                    sku_context &&
                                    lot_context &&
                                    skuLot[sku_context] &&
                                    !skuLot[sku_context][lot_context]
                                ) {
                                    skuLot[sku_context][lot_context] = lot_context;
                                }
                                if (!objTransaction[typeTransaction][folioTransaccion].line[sku_context]) {
                                    objTransaction[typeTransaction][folioTransaccion].line[sku_context] = {
                                        sku: sku_context,
                                        lot: {},
                                        quantity: 0,
                                    };
                                }
                                if (
                                    objTransaction[typeTransaction][folioTransaccion].line[sku_context]
                                ) {
                                    if (
                                        lot_context
                                    ) {
                                        if (!objTransaction[typeTransaction][folioTransaccion].line[sku_context].lot[lot_context]) {
                                            objTransaction[typeTransaction][folioTransaccion].line[sku_context].lot[lot_context] = {
                                                type: 'receiptinventorynumber',
                                                value: lot_context,
                                                quantity: 0,
                                            };
                                        }
                                        if (
                                            quantity_context &&
                                            objTransaction[typeTransaction][folioTransaccion].line[sku_context].lot[lot_context]
                                        ) {
                                            objTransaction[typeTransaction][folioTransaccion].line[sku_context].lot[lot_context].quantity += parseFloat(quantity_context);
                                        }
                                    }
                                    if (
                                        quantity_context
                                    ) {
                                        objTransaction[typeTransaction][folioTransaccion].line[sku_context].quantity += parseFloat(quantity_context);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            /* 
                Busqueda Articulos
            */

            var skuFilter = [];
            var skuColumns = [
                search.createColumn({
                    name: "upccode"
                })
            ];

            for (var ss in skuObj) {
                skuFilter.push(["upccode", search.Operator.IS, ss]);
                skuFilter.push("OR");
            }
            skuFilter.pop();
            var skuSearch = drt_wep_lib.searchRecord(search.Type.ITEM, skuFilter, skuColumns);
            if (skuSearch.success) {
                for (var sku in skuSearch.data) {
                    if (
                        skuSearch.data[sku].upccode
                    ) {
                        skuObj[skuSearch.data[sku].upccode] = skuSearch.data[sku].id;
                        itemSkuObj[skuSearch.data[sku].id] = skuSearch.data[sku].upccode;
                    }

                }
            }
            /* 
            var skuLotInventory = drt_wep_lib.searchRecord(search.Type.LOT_NUMBERED_INVENTORY_ITEM, skuFilter, skuColumns);
            if (skuLotInventory.success) {
                for (var sku in skuLotInventory.data) {
                    if (
                        skuLotInventory.data[sku].upccode
                    ) {
                        if (!skuObj[skuLotInventory.data[sku].upccode]) {
                            skuObj[skuLotInventory.data[sku].upccode] = skuLotInventory.data[sku].id;
                        }
                        if (!itemSkuObj[skuLotInventory.data[sku].id]) {
                            itemSkuObj[skuLotInventory.data[sku].id] = skuLotInventory.data[sku].upccode;
                        }
                    }

                }
            }
            */
            /* 
                Busqueda Lote
            */
            var loteFilter = [];
            var loteColumns = [
                search.createColumn({
                    name: "inventorynumber"
                }),
                search.createColumn({
                    name: "item"
                }),
            ];

            for (var id_lote in loteItemObj) {
                for (var sku_item in loteItemObj[id_lote]) {
                    if (skuObj[sku_item]) {
                        loteItemObj[id_lote][sku_item] = skuObj[sku_item];
                    }
                }
            }

            for (var id_lote in loteItemObj) {
                for (var sku_item in loteItemObj[id_lote]) {
                    if (loteItemObj[id_lote][sku_item]) {
                        loteFilter.push([
                            ["inventorynumber", search.Operator.IS, id_lote],
                            "AND",
                            ["item", search.Operator.IS, loteItemObj[id_lote][sku_item]]
                        ]);
                        loteFilter.push("OR");
                    }
                }
            }
            if (loteFilter.length > 0) {
                loteFilter.pop();
            }

            var loteSearch = drt_wep_lib.searchRecord(search.Type.INVENTORY_NUMBER, loteFilter, loteColumns);

            if (loteSearch.success) {
                for (var lote in loteSearch.data) {
                    var loteText = loteSearch.data[lote].inventorynumber || '';
                    var loteId = loteSearch.data[lote].id || '';
                    var itemId = loteSearch.data[lote].item || '';
                    var itemText = itemSkuObj[itemId] || '';

                    if (
                        loteText &&
                        itemId &&
                        itemText &&
                        loteObj[loteText] &&
                        !loteObj[loteText][itemText]
                    ) {
                        loteObj[loteText][itemText] = loteId;
                    }
                }
            }

            /* 
            for (var a in objRequest) {
                var ShippingS = objRequest[a].shippings;
                for (var s in ShippingS) {
                    var detalles = ShippingS[s].shippingDetails
                    for (var d in detalles) {
                        var folioTransaccion = detalles[d].shipmentOrder.folio;
                        // var shipmentOr = detalles[d].shipmentOrder.shipmentOrderDetails;
                        var shipmentOr = detalles[d].inventoryHeader.inventoryDetails;

                        if (!objTransaction[folioTransaccion.substring(0, 6)]) {
                            objTransaction[folioTransaccion.substring(0, 6)] = {};
                        }
                        if (!objTransaction[folioTransaccion.substring(0, 6)][folioTransaccion.toLocaleLowerCase()]) {
                            objTransaction[folioTransaccion.substring(0, 6)][folioTransaccion.toLocaleLowerCase()] = {
                                id_netsuite: '',
                                id_wms: '',
                                custentity_disa_oficina_ventas: '',
                                custbody_disa_control_transaccion: '',
                                line: {}
                            };
                        }

                        if (!objTransaction[folioTransaccion.substring(0, 6)][folioTransaccion.toLocaleLowerCase()].line[ShippingS[s].folio]) {
                            objTransaction[folioTransaccion.substring(0, 6)][folioTransaccion.toLocaleLowerCase()].line[ShippingS[s].folio] = [];
                        }

                        for (var ar in shipmentOr) {
                            var objItmMap = {};
                            objTransaction[folioTransaccion.substring(0, 6)][folioTransaccion.toLocaleLowerCase()].line[ShippingS[s].folio].push({
                                orderedQuantity: shipmentOr[ar].orderedQuantity || shipmentOr[ar].quantity,
                                lot: shipmentOr[ar].lot,
                                sku: shipmentOr[ar].product.sku,
                            });
                        }
                    }
                }
            } */



            var idColumns = [
                search.createColumn({
                    name: "custbody_drt_wms_location_before"
                }),
                search.createColumn({
                    name: "location"
                }),
                search.createColumn({
                    name: "custbody_disa_control_transaccion"
                }),
                search.createColumn({
                    name: "custbody_disa_wms_id"
                }),
                search.createColumn({
                    name: "transactionnumber"
                }),
                search.createColumn({
                    name: "custentity_disa_oficina_ventas",
                    join: "salesrep"
                })
            ];

            var salesOrderFilter = [];
            var itemFullFilter = [];

            for (var sos in objTransaction.saleso) {
                itemFullFilter.push(["custbody_disa_wms_id", search.Operator.IS, sos]);
                itemFullFilter.push("OR");
                salesOrderFilter.push(["transactionnumber", search.Operator.IS, sos.substring(0, sos.indexOf("_") > 0 ? sos.indexOf("_") : sos.length)]);
                salesOrderFilter.push("OR");
            }
            if (salesOrderFilter.length > 1) {
                salesOrderFilter.pop();
                salesOrderFilter = [
                    ["mainline", search.Operator.IS, "T"],
                    "AND",
                    salesOrderFilter
                ]
                itemFullFilter.pop();
                itemFullFilter = [
                    ["mainline", search.Operator.IS, "T"],
                    "AND",
                    itemFullFilter
                ]
            }


            var transferOrderFilter = [];
            for (var tto in objTransaction.trnfro) {
                transferOrderFilter.push(["transactionnumber", search.Operator.IS, tto]);
                transferOrderFilter.push("OR");
            }
            if (transferOrderFilter.length > 1) {
                transferOrderFilter.pop();
                transferOrderFilter = [
                    ["mainline", search.Operator.IS, "T"],
                    "AND",
                    transferOrderFilter
                ]
            }


            var idSearchITSO = drt_wep_lib.searchRecord(search.Type.INVENTORY_TRANSFER, itemFullFilter, idColumns);
            var idSearchSO = drt_wep_lib.searchRecord(search.Type.SALES_ORDER, salesOrderFilter, idColumns);
            var idSearchIT = drt_wep_lib.searchRecord(search.Type.TRANSFER_ORDER, transferOrderFilter, idColumns);

            if (idSearchITSO.success) {
                for (var id in idSearchITSO.data) {
                    if (!inventoryTrsnsferSalesOrder[idSearchITSO.data[id].custbody_disa_wms_id]) {
                        inventoryTrsnsferSalesOrder[idSearchITSO.data[id].custbody_disa_wms_id] = idSearchITSO.data[id].id;
                    }
                }
            }
            if (idSearchSO.success) {
                for (var id in idSearchSO.data) {
                    for (var sos in objTransaction.saleso) {
                        var sosVuelta = sos.substring(0, sos.indexOf("_") > 0 ? sos.indexOf("_") : sos.length);
                        if (
                            idSearchSO.data[id].transactionnumber &&
                            sos &&
                            idSearchSO.data[id].transactionnumber.toLocaleLowerCase() == sosVuelta.toLocaleLowerCase()
                        ) {
                            objTransaction.saleso[sos].id_wms = idSearchSO.data[id].custbody_disa_wms_id;
                            objTransaction.saleso[sos].id_netsuite = idSearchSO.data[id].id;
                            objTransaction.saleso[sos].custentity_disa_oficina_ventas = "";
                            if (
                                idSearchSO.data[id].custentity_disa_oficina_ventas
                            ) {
                                objTransaction.saleso[sos].custentity_disa_oficina_ventas = idSearchSO.data[id].custentity_disa_oficina_ventas;
                            }
                            objTransaction.saleso[sos].custbody_disa_control_transaccion = idSearchSO.data[id].custbody_disa_control_transaccion;
                            objTransaction.saleso[sos].location = idSearchSO.data[id].custbody_drt_wms_location_before || idSearchSO.data[id].location;
                            objTransaction.saleso[sos].custbody_drt_wms_location_before = idSearchSO.data[id].custbody_drt_wms_location_before;
                        }
                    }

                }
            }
            if (idSearchIT.success && transferOrderFilter.length > 0) {
                for (var idTo in idSearchIT.data) {
                    for (var to in objTransaction.trnfro) {
                        if (
                            idSearchIT.data[idTo].transactionnumber &&
                            to &&
                            idSearchIT.data[idTo].transactionnumber.toLocaleLowerCase() == to.toLocaleLowerCase()
                        ) {
                            objTransaction.trnfro[to].id_wms = idSearchIT.data[idTo].custbody_disa_wms_id;
                            objTransaction.trnfro[to].id_netsuite = idSearchIT.data[idTo].id;
                            objTransaction.trnfro[to].custbody_disa_control_transaccion = idSearchIT.data[idTo].custbody_disa_control_transaccion;
                        }
                    }

                }
            }


            log.audit({
                title: ' objTransaction.saleso',
                details: JSON.stringify(objTransaction.saleso)
            });

            if (
                objTransaction.saleso
            ) {
                var pso = procesSalesOrder(objTransaction.saleso, skuObj, loteObj, inventoryTrsnsferSalesOrder, context)
                respuesta.data.saleso.push(pso);
            }

            log.audit({
                title: ' objTransaction.trnfro',
                details: JSON.stringify(objTransaction.trnfro)
            });

            if (
                objTransaction.trnfro
            ) {
                var pto = procesTransferOrder(objTransaction.trnfro, skuObj, loteObj, context)
                respuesta.data.trnfro.push(pto);
            }

            // respuesta.data.loteItemObj = loteItemObj;
            // respuesta.data.itemSkuObj = itemSkuObj;
            // respuesta.data.loteObj = loteObj;
            // respuesta.data.skuObj = skuObj;
            // respuesta.data.objTransaction = objTransaction;

            return respuesta;
        } catch (error) {
            log.error({
                title: 'error _post',
                details: error
            });

            /* drt_wep_lib.createRecordDetail(
                record.create({
                    type: 'customrecord_drt_wep_error',
                    isDynamic: true
                }), //Registro de error
                {
                    name: error.name || '',
                    custrecord_drt_wep_e_json: JSON.stringify(context),
                    custrecord_drt_wep_e_mensaje_error: error.message,
                    custrecord_drt_wep_e_url: '',
                    custrecord_drt_wep_e_nombre_interfaz: "shipment-interface",
                    custrecord_drt_wep_e_id_script: runtime.getCurrentScript().id,
                    custrecord_drt_wep_e_deployment_script: runtime.getCurrentScript().deploymentId,
                    custrecord_drt_wep_e_codigo: "",
                }, //Campos de error
                {}
            ); */
            respuesta.error.push(error.message);
        } finally {
            log.audit({
                title: 'respuesta',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function procesSalesOrder(param_transaction, param_map_item, param_map_lote, itso, context) {
        try {
            var respuesta = {
                success: false,
                data: [],
                error: [],
                wms: {}
            };
            respuesta.wms = JSON.stringify(param_transaction);
            log.emergency({
                title: 'procesSalesOrder',
                details: //
                    " param_transaction: " + JSON.stringify(param_transaction) +
                    " param_map_item: " + JSON.stringify(param_map_item) +
                    " param_map_lote: " + JSON.stringify(param_map_lote) +
                    " itso: " + JSON.stringify(itso)
            });
            var orderFilter = [];

            log.emergency({
                title: 'param_transaction sin repetir',
                details: JSON.stringify(param_transaction)
            });

            for (var transaction in param_transaction) {
                if (!param_transaction[transaction].id_netsuite) {
                    respuesta.error.push("No se encontro id Orden de venta");
                    delete param_transaction[transaction];

                    /* drt_wep_lib.createRecordDetail(
                        record.create({
                            type: 'customrecord_drt_wep_error',
                            isDynamic: true
                        }), //Registro de error
                        {
                            name: "Orden de venta sin ID de Netsuite" || '',
                            custrecord_drt_wep_e_json: JSON.stringify(param_transaction[transaction]),
                            custrecord_drt_wep_e_mensaje_error: transaction + ' no se encontro ID de Netsuite',
                            custrecord_drt_wep_e_url: '',
                            custrecord_drt_wep_e_nombre_interfaz: "shipment-interface",
                            custrecord_drt_wep_e_id_script: runtime.getCurrentScript().id,
                            custrecord_drt_wep_e_deployment_script: runtime.getCurrentScript().deploymentId,
                            custrecord_drt_wep_e_codigo: "procesSalesOrder",
                        }, //Campos de error
                        {}
                    ); */
                } else {

                    orderFilter.push([
                        ["custbody_disa_control_transaccion", search.Operator.IS, transaction],
                        "AND",
                        ["createdfrom", search.Operator.IS, param_transaction[transaction].id_netsuite]
                    ]);
                    orderFilter.push("OR");

                }
            }

            if (orderFilter.length > 1) {
                orderFilter.pop();
            }
            if (orderFilter.length == 1) {
                orderFilter = orderFilter.pop();
            }

            var idColumns = [
                search.createColumn({
                    name: "custbody_disa_control_transaccion"
                }),
                search.createColumn({
                    name: "transactionnumber",
                    join: "createdfrom"
                })
            ];

            var transactionExist = drt_wep_lib.searchRecord(search.Type.ITEM_FULFILLMENT, orderFilter, idColumns);
            if (transactionExist.success) {
                for (var tr in transactionExist.data) {
                    var custbody_disa_control_transaccion = transactionExist.data[tr].custbody_disa_control_transaccion;
                    if (
                        custbody_disa_control_transaccion &&
                        param_transaction[custbody_disa_control_transaccion]
                    ) {
                        delete param_transaction[custbody_disa_control_transaccion];
                    }
                }
            }

            log.emergency({
                title: 'param_transaction sin repetir',
                details: JSON.stringify(param_transaction)
            });

            for (var nt in param_transaction) {
                var idInventoryTransfer = '';
                var idItemFulfillment = '';
                var ntVuelta = nt.substring(0, nt.indexOf("_") > 0 ? nt.indexOf("_") : nt.length);
                var objLine = {
                    item: []
                };
                var objBody = {
                    custbody_disa_control_transaccion: nt
                };

                for (var item in param_transaction[nt].line) {
                    if (
                        param_map_item[param_transaction[nt].line[item].sku]
                    ) {
                        var objTemp = {
                            itemreceive: true,
                            item: param_map_item[param_transaction[nt].line[item].sku],
                            quantity: param_transaction[nt].line[item].quantity
                        };
                        if (param_transaction[nt].custentity_disa_oficina_ventas) {
                            objTemp.location = param_transaction[nt].custentity_disa_oficina_ventas;
                        }
                        if (
                            param_transaction[nt].line[item].lot &&
                            Object.keys(param_transaction[nt].line[item].lot).length > 0
                        ) {
                            objTemp.inventorynumber = [];
                            var inventorynumber = param_transaction[nt].line[item].lot;
                            for (var i_n in inventorynumber) {
                                if (
                                    inventorynumber[i_n].value &&
                                    inventorynumber[i_n].type &&
                                    inventorynumber[i_n].quantity &&
                                    parseFloat(inventorynumber[i_n].quantity) > 0
                                ) {
                                    objTemp.inventorynumber.push({
                                        value: inventorynumber[i_n].value,
                                        type: inventorynumber[i_n].type,
                                        quantity: inventorynumber[i_n].quantity
                                    });
                                }
                            }
                        }
                        /* 
                        if (
                            param_transaction[nt].line[item].lot
                        ) {
                            objTemp.receiptinventorynumber = param_transaction[nt].line[item].lot;
                        } 
                        */
                        objLine.item.push(objTemp);
                    } else {

                        log.audit({
                            title: 'No se encontro SKU ' + param_transaction[nt].line[item].sku,
                            details: JSON.stringify(param_transaction[nt].line[item])
                        });
                    }
                }

                if (
                    Object.keys(objBody).length > 0 &&
                    objLine.item.length > 0
                ) {
                    var nweit = {
                        success: true
                    };
                    var updateSo = {
                        success: true
                    };
                    var inventorylocation = param_transaction[nt].location;

                    if (
                        param_transaction[nt].custentity_disa_oficina_ventas &&
                        param_transaction[nt].location &&
                        param_transaction[nt].custentity_disa_oficina_ventas != param_transaction[nt].location
                    ) {
                        var objLineInventory = {
                            inventory: []
                        };
                        for (var li in objLine.item) {
                            var objT = {
                                item: objLine.item[li].item,
                                adjustqtyby: objLine.item[li].quantity,
                            };

                            if (
                                objLine.item[li].inventorynumber &&
                                Object.keys(objLine.item[li].inventorynumber).length > 0
                            ) {
                                objT.inventorynumber = [];
                                var inventorynumber = objLine.item[li].inventorynumber;
                                for (var i_n in inventorynumber) {
                                    if (
                                        inventorynumber[i_n].value &&
                                        inventorynumber[i_n].type &&
                                        inventorynumber[i_n].quantity &&
                                        parseFloat(inventorynumber[i_n].quantity) > 0
                                    ) {
                                        objT.inventorynumber.push({
                                            value: inventorynumber[i_n].value,
                                            type: inventorynumber[i_n].type,
                                            quantity: inventorynumber[i_n].quantity
                                        });
                                    }
                                }
                            }
                            objLineInventory.inventory.push(objT);

                        }


                        if (
                            itso[nt]
                        ) {
                            log.audit({
                                title: 'itso[param_transaction[nt].id_netsuite] ' + itso[nt],
                                details: JSON.stringify(itso)
                            });
                            log.error({
                                title: 'Existe una orden de transferencia',
                                details: JSON.stringify(itso[nt])
                            });
                        } else {
                            nweit = drt_wep_lib.createRecordDetailReturnSave(
                                record.create({
                                    type: record.Type.INVENTORY_TRANSFER,
                                    isDynamic: true
                                }), {
                                    subsidiary: idInternoNetsuiteSubcidiaria[runtime.envType],
                                    location: idInternoNetsuiteLocation[runtime.envType],
                                    custbody_disa_json_wep_shipment: JSON.stringify(param_transaction[nt]),
                                    transferlocation: param_transaction[nt].custentity_disa_oficina_ventas,
                                    memo: "Transferencia de invenrtario creada desde WMS con el folio " + nt,
                                    custbody_disa_wms_id: nt,
                                    custbody_disa_control_transaccion: nt
                                }, //
                                objLineInventory, {}
                            );
                            idInventoryTransfer = nweit.data.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }) || '';
                            // respuesta.data.push(nweit);
                        }

                        if (nweit.success) {
                            inventorylocation = param_transaction[nt].custentity_disa_oficina_ventas;

                        }

                    }

                    if (
                        updateSo.success
                    ) {
                        objBody.shipstatus = "C";
                        objBody.custbody_disa_json_wep_shipment = JSON.stringify(param_transaction[nt]);
                        // if (inventorylocation) {
                        //     objBody.inventorylocation;
                        // }
                        var soif = drt_wep_lib.createRecordDetailReturnSave(
                            record.transform({
                                fromType: record.Type.SALES_ORDER, //Sales Order
                                fromId: param_transaction[nt].id_netsuite,
                                toType: record.Type.ITEM_FULFILLMENT, //Item fulfillment
                                isDynamic: false,
                                defaultValues: {
                                    inventorylocation: param_transaction[nt].location
                                }
                            }),
                            objBody, //
                            {},
                            objLine
                        );
                        idItemFulfillment = soif.data.save({
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }) || '';


                        {

                            try {
                                if (idInventoryTransfer) {
                                    respuesta.data.push({
                                        INVENTORY_TRANSFER: idInventoryTransfer
                                    });
                                }

                                var objShipmentconfirmsucces = {
                                    custrecord_drt_wep_output_json: JSON.stringify(param_transaction[nt]),
                                    custrecord_drt_wep_output_metodo: 4,
                                    custrecord_drt_wep_output_name: 9,
                                    custrecord_drt_disa_url: param_transaction[nt]
                                }
                                log.audit('objShipmentconfirmsucces', objShipmentconfirmsucces);
                                var saveSuccesShipment = drt_wep_save.saveRequest(objShipmentconfirmsucces);
                                if (saveSuccesShipment.success) {
                                    log.audit('Ok', 'guardado de registro con exito');
                                }

                            } catch (error) {
                                var objShipmentconfirmError = {
                                    custrecord_drt_wep_output_json: JSON.stringify(param_transaction[nt]),
                                    custrecord_drt_wep_output_metodo: 4,
                                    custrecord_drt_wep_output_name: 9,
                                    custrecord_drt_disa_responser_body: param_transaction,
                                    custrecord_disa_error: error,
                                    custrecord_drt_disa_folio_netsuite: param_transaction[nt]
                                }
                                log.audit('objShipmentconfirmError', objShipmentconfirmError);

                                var ErrorShipment = drt_wep_save.saveRequest(objShipmentconfirmError);
                                if (ErrorShipment.success) {
                                    log.audit('Ok', 'guardado de registro con exito');
                                }
                            }
                        }



                        if (idItemFulfillment) {
                            respuesta.data.push({
                                ITEM_FULFILLMENT: idItemFulfillment
                            });
                            var vueltaExist = drt_wep_lib.searchRecord(
                                'customrecord_disa_drt_segundas_vueltas',
                                [
                                    ["name", search.Operator.IS, nt.toUpperCase()],
                                    "AND",
                                    ["custrecord_disa_orden_venta", search.Operator.IS, param_transaction[nt].id_netsuite],
                                    "AND",
                                    ["custrecord_disa_item_fulfillment", search.Operator.ANYOF, "@NONE@"]

                                ],
                                [
                                    search.createColumn({
                                        name: "custrecord_disa_orden_venta"
                                    }),
                                    search.createColumn({
                                        name: "custrecord_disa_item_fulfillment"
                                    })
                                ]
                            );
                            if (vueltaExist.success) {
                                drt_wep_lib.submitRecord('customrecord_disa_drt_segundas_vueltas', vueltaExist.array[0].id, {
                                    custrecord_disa_item_fulfillment: idItemFulfillment
                                });
                            }
                        }
                    }
                } else {
                    log.error({
                        title: 'No se puede crear ITEM_RECEIPT',
                        details: //
                            " objBody: " + JSON.stringify(objBody) +
                            " objLine: " + JSON.stringify(objLine) +
                            " param_transaction[nt]: " + JSON.stringify(param_transaction[nt])
                    });
                }

            }

            respuesta.success = respuesta.data.length > 0;
        } catch (error) {
            log.error({
                title: 'error procesSalesOrder',
                details: error
            });
            respuesta.error.push(error.message);
            log.error({
                title: 'error lineNumber',
                details: error.lineNumber
            });
            /* drt_wep_lib.createRecordDetail(
                record.create({
                    type: 'customrecord_drt_wep_error',
                    isDynamic: true
                }), //Registro de error
                {
                    name: error.name || '',
                    custrecord_drt_wep_e_json: JSON.stringify(context),
                    custrecord_drt_wep_e_mensaje_error: error.message,
                    custrecord_drt_wep_e_url: '',
                    custrecord_drt_wep_e_nombre_interfaz: "shipment-interface",
                    custrecord_drt_wep_e_id_script: runtime.getCurrentScript().id,
                    custrecord_drt_wep_e_deployment_script: runtime.getCurrentScript().deploymentId,
                    custrecord_drt_wep_e_codigo: "procesSalesOrder",
                }, //Campos de error
                {}
            ); */
        } finally {
            log.emergency({
                title: 'respuesta procesSalesOrder',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function procesTransferOrder(param_transaction, param_map_item, param_map_lote, context) {
        try {
            var respuesta = {
                success: false,
                data: [],
                error: [],
                wms: {}
            };
            respuesta.wms = JSON.stringify(param_transaction);
            log.audit({
                title: 'procesTransferOrder',
                details: //
                    " param_transaction: " + JSON.stringify(param_transaction) +
                    " param_map_item: " + JSON.stringify(param_map_item) +
                    " param_map_lote: " + JSON.stringify(param_map_lote)
            });

            var orderFilter = [];
            for (var transaction in param_transaction) {
                if (!param_transaction[transaction].id_netsuite) {
                    respuesta.error.push(error.message);
                    /* drt_wep_lib.createRecordDetail(
                        record.create({
                            type: 'customrecord_drt_wep_error',
                            isDynamic: true
                        }), //Registro de error
                        {
                            name: "Orden de transferencia sin ID de Netsuite" || '',
                            custrecord_drt_wep_e_json: JSON.stringify(param_transaction[transaction]),
                            custrecord_drt_wep_e_mensaje_error: transaction + ' no se encontro ID de Netsuite',
                            custrecord_drt_wep_e_url: '',
                            custrecord_drt_wep_e_nombre_interfaz: "shipment-interface",
                            custrecord_drt_wep_e_id_script: runtime.getCurrentScript().id,
                            custrecord_drt_wep_e_deployment_script: runtime.getCurrentScript().deploymentId,
                            custrecord_drt_wep_e_codigo: "procesTransferOrder",
                        }, //Campos de error
                        {}
                    ); */
                } else {
                    orderFilter.push([
                        ["custbody_disa_control_transaccion", search.Operator.IS, param_transaction[transaction].id_netsuite],
                        "AND",
                        ["createdfrom", search.Operator.IS, param_transaction[transaction].id_netsuite]
                    ]);
                    orderFilter.push("OR");

                }
            }

            if (orderFilter.length > 1) {
                orderFilter.pop();
                // orderFilter = [
                //     ["mainline", search.Operator.IS, "T"],
                //     "AND",
                //     orderFilter
                // ]
            }
            if (orderFilter.length == 1) {
                orderFilter = orderFilter.pop();
            }

            var idColumns = [
                search.createColumn({
                    name: "custbody_disa_control_transaccion"
                }),
                search.createColumn({
                    name: "custbody_disa_wms_id"
                }),
                search.createColumn({
                    name: "transactionnumber",
                    join: "createdfrom"
                })
            ];

            var transactionExist = drt_wep_lib.searchRecord(search.Type.ITEM_FULFILLMENT, orderFilter, idColumns);
            if (transactionExist.success) {
                for (var tr in transactionExist.data) {
                    var transactionnumber = transactionExist.data[tr].transactionnumber.toLocaleLowerCase();
                    log.audit({
                        title: 'transactionnumber',
                        details: JSON.stringify(transactionnumber)
                    });
                    var custbody_disa_control_transaccion = transactionExist.data[tr].custbody_disa_control_transaccion;
                    log.audit({
                        title: 'custbody_disa_control_transaccion',
                        details: JSON.stringify(custbody_disa_control_transaccion)
                    });
                    if (
                        transactionnumber &&
                        custbody_disa_control_transaccion &&
                        param_transaction[transactionnumber]
                    ) {
                        delete param_transaction[transactionnumber];
                    }
                }
            }
            log.audit({
                title: 'param_transaction sin lineas repetidas',
                details: JSON.stringify(param_transaction)
            });


            for (var nt in param_transaction) {

                var objLine = {
                    item: []
                };
                var objBody = {
                    custbody_disa_control_transaccion: param_transaction[nt].id_netsuite
                };

                for (var item in param_transaction[nt].line) {
                    log.audit({
                        title: 'param_transaction[nt].line[item]',
                        details: JSON.stringify(param_transaction[nt].line[item])
                    });
                    if (
                        param_map_item[param_transaction[nt].line[item].sku]
                    ) {
                        var objTemp = {
                            itemreceive: true,
                            item: param_map_item[param_transaction[nt].line[item].sku],
                            quantity: param_transaction[nt].line[item].quantity,
                        };
                        if (
                            param_transaction[nt].line[item].lot &&
                            Object.keys(param_transaction[nt].line[item].lot).length > 0
                        ) {
                            // objTemp.issueinventorynumber = param_map_lote[param_transaction[nt].line[item].lot][param_transaction[nt].line[item].sku];
                            objTemp.inventorynumber = [];
                            var inventorynumber = param_transaction[nt].line[item].lot;
                            for (var i_n in inventorynumber) {
                                if (
                                    inventorynumber[i_n].value &&
                                    inventorynumber[i_n].type &&
                                    inventorynumber[i_n].quantity &&
                                    parseFloat(inventorynumber[i_n].quantity) > 0
                                ) {
                                    objTemp.inventorynumber.push({
                                        value: inventorynumber[i_n].value,
                                        type: inventorynumber[i_n].type,
                                        quantity: inventorynumber[i_n].quantity
                                    });
                                }
                            }
                        }
                        // objTemp.receiptinventorynumber = param_transaction[nt].line[item].lot;
                        objLine.item.push(objTemp);
                    } else {

                        log.audit({
                            title: 'No se encontro SKU ' + param_transaction[nt].line[item].sku,
                            details: JSON.stringify(param_transaction[nt].line[item])
                        });
                    }
                }
                if (
                    Object.keys(objBody).length > 0 &&
                    objLine.item.length > 0
                ) {
                    log.audit({
                        title: 'objBody',
                        details: JSON.stringify(objBody)
                    });
                    log.audit({
                        title: 'objLine',
                        details: JSON.stringify(objLine)
                    });
                    objBody.shipstatus = "C";

                    var toif = drt_wep_lib.createRecordDetail(
                        record.transform({
                            fromType: record.Type.TRANSFER_ORDER, //Transfer Order
                            fromId: param_transaction[nt].id_netsuite,
                            toType: record.Type.ITEM_FULFILLMENT, //Item Receipt
                            isDynamic: false
                        }),
                        objBody, //
                        {},
                        objLine
                    );
                    respuesta.data.push({
                        ITEM_FULFILLMENT: toif
                    });

                    var objTransferOrderSucces = {
                        custrecord_drt_wep_output_json: JSON.stringify(param_transaction[nt]),
                        custrecord_drt_wep_output_metodo: 4,
                        custrecord_drt_wep_output_name: 9,
                        custrecord_drt_disa_url: param_transaction[nt]
                    }
                    log.audit('objTransferOrderSucces', objTransferOrderSucces);
                    var saveSuccesTransferOrder = drt_wep_save.saveRequest(objTransferOrderSucces);
                    if (saveSuccesTransferOrder.success) {
                        log.audit('Ok', 'guardado de registro con exito');
                    }
                }
            }
            respuesta.success = respuesta.data.length > 0;
        } catch (error) {
            log.error({
                title: 'error procesTransferOrder',
                details: error
            });
            respuesta.error.push(error.message);

            var objError = {
                custrecord_drt_wep_output_json: JSON.stringify(param_transaction[nt]),
                custrecord_drt_wep_output_metodo: 4,
                custrecord_drt_wep_output_name: 9,
                custrecord_drt_disa_url: param_transaction[nt]
            }
            log.audit('objError', objError);
            var saveErrorTransferOrder = drt_wep_save.saveRequest(objError);
            if (saveErrorTransferOrder.success) {
                log.audit('Error', 'Se guardo el error en el custom record para su validacion.');
            }
            /* drt_wep_lib.createRecordDetail(
                record.create({
                    type: 'customrecord_drt_wep_error',
                    isDynamic: true
                }), //Registro de error
                {
                    name: error.name || '',
                    custrecord_drt_wep_e_json: JSON.stringify(context),
                    custrecord_drt_wep_e_mensaje_error: error.message,
                    custrecord_drt_wep_e_url: '',
                    custrecord_drt_wep_e_nombre_interfaz: "shipment-interface",
                    custrecord_drt_wep_e_id_script: runtime.getCurrentScript().id,
                    custrecord_drt_wep_e_deployment_script: runtime.getCurrentScript().deploymentId,
                    custrecord_drt_wep_e_codigo: "procesSalesOrder",
                }, //Campos de error
                {}
            ); */
        } finally {
            log.emergency({
                title: 'respuesta procesTransferOrder',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    return {
        post: _post
    }
});