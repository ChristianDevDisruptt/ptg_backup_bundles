/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
    'N/ui/message',
    'N/ui/dialog',
    'N/search'
], function (
    message,
    dialog,
    search
) {
    function validateLine(context) {

        try {
            debugger;
            var respuesta = true;
            console.log("validateLine: " + JSON.stringify(context));
            if (
                // context.mode == 'create'
                true
            ) {
                var showlot = false;
                var showquantity = false;
                switch (context.currentRecord.type) {
                    case 'invoice':
                        var createdfrom = context.currentRecord.getValue('createdfrom') || '';
                        if (context.sublistId == 'item' && !createdfrom) {
                            var location = parseInt(context.currentRecord.getValue('location')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'quantity',
                            }) || "";
                            if (
                                location &&
                                item &&
                                quantity
                            ) {
                                var sinbackorder = searchInventory(item, location, quantity, 'invoice');
                                respuesta = sinbackorder.success;
                                showquantity = !respuesta;
                            }

                            var inventorydetailavail = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'inventorydetailavail',
                            });
                            console.log("inventorydetailavail: " + inventorydetailavail);
                            if (
                                inventorydetailavail == "T"
                            ) {
                                quantityLot = 0;
                                var invDetail = context.currentRecord.getCurrentSublistSubrecord({
                                    sublistId: context.sublistId,
                                    fieldId: 'inventorydetail'
                                });
                                var subLineCount = invDetail.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                for (var subLinenum = 0; subLinenum < subLineCount; subLinenum++) {
                                    quantityLot += parseFloat(invDetail.getSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'quantity',
                                        line: subLinenum
                                    }) || 0);
                                }
                                showlot = quantity != quantityLot;
                            }
                        }
                        break;
                    case 'inventoryadjustment':
                        if (context.sublistId == 'inventory') {
                            var location = parseInt(context.currentRecord.getValue('adjlocation')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'adjustqtyby',
                            }) || "";
                            if (
                                location &&
                                item &&
                                quantity &&
                                quantity < 0
                            ) {
                                var sinbackorder = searchInventory(item, location, quantity, 'inventoryadjustment');
                                respuesta = (parseFloat(sinbackorder.data) + parseFloat(quantity)) >= 0;
                                showquantity = !respuesta;
                            }
                            var inventorydetailavail = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'inventorydetailavail',
                            });
                            console.log("inventorydetailavail: " + inventorydetailavail);
                            if (
                                inventorydetailavail == "T"
                            ) {
                                quantityLot = 0;
                                var invDetail = context.currentRecord.getCurrentSublistSubrecord({
                                    sublistId: context.sublistId,
                                    fieldId: 'inventorydetail'
                                });
                                var subLineCount = invDetail.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                for (var subLinenum = 0; subLinenum < subLineCount; subLinenum++) {
                                    quantityLot += parseFloat(invDetail.getSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'quantity',
                                        line: subLinenum
                                    }) || 0);
                                }
                                showlot = quantity != quantityLot;
                            }
                        }
                        break;
                    case 'inventorytransfer':
                        if (context.sublistId == 'inventory') {
                            var location = parseInt(context.currentRecord.getValue('location')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'adjustqtyby',
                            }) || "";
                            var quantityLot = quantity;
                            if (
                                location &&
                                item &&
                                quantity
                            ) {
                                var sinbackorder = searchInventory(item, location, quantity, 'inventorytransfer');
                                respuesta = sinbackorder.success;
                                showquantity = !respuesta;
                            }
                            debugger;
                            var inventorydetailavail = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'inventorydetailavail',
                            });
                            console.log("inventorydetailavail: " + inventorydetailavail);
                            if (
                                inventorydetailavail == "T"
                            ) {
                                quantityLot = 0;
                                var invDetail = context.currentRecord.getCurrentSublistSubrecord({
                                    sublistId: context.sublistId,
                                    fieldId: 'inventorydetail'
                                });
                                var subLineCount = invDetail.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                for (var subLinenum = 0; subLinenum < subLineCount; subLinenum++) {
                                    quantityLot += parseFloat(invDetail.getSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'quantity',
                                        line: subLinenum
                                    }) || 0);
                                }
                                showlot = quantity != quantityLot;
                            }
                        }
                        break;
                    case 'transferorder':
                        if (context.sublistId == 'item') {
                            // customform=207	
                            // 02-02-2-118
                            var customform = parseInt(context.currentRecord.getValue('customform')) || '';
                            var location = parseInt(context.currentRecord.getValue('location')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'quantity',
                            }) || "";
                            var quantityLot = quantity;
                            if (
                                location &&
                                item &&
                                quantity
                            ) {
                                var sinbackorder = searchInventory(item, location, quantity , 'transferorder');
                                // respuesta = sinbackorder.success;
                                // showquantity = !respuesta;
                            }
                            debugger;
                            var inventorydetailavail = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'inventorydetailavail',
                            });
                            console.log("inventorydetailavail: " + inventorydetailavail);
                            if (
                                inventorydetailavail == "T" &&
                                (
                                    customform == 207 ||
                                    customform == 144 ||
                                    customform == 137
                                )
                            ) {
                                quantityLot = 0;
                                var invDetail = context.currentRecord.getCurrentSublistSubrecord({
                                    sublistId: context.sublistId,
                                    fieldId: 'inventorydetail'
                                });
                                var subLineCount = invDetail.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                for (var subLinenum = 0; subLinenum < subLineCount; subLinenum++) {
                                    quantityLot += parseFloat(invDetail.getSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'quantity',
                                        line: subLinenum
                                    }) || 0);
                                }
                                showlot = quantity != quantityLot;

                            }
                        }
                        break;
                    case 'drtsalesorder':
                        if (context.sublistId == 'item') {
                            var location = parseInt(context.currentRecord.getValue('location')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'quantity',
                            }) || "";
                            var quantityLot = quantity;
                            if (
                                location &&
                                item &&
                                quantity
                            ) {
                                var sinbackorder = searchInventory(item, location, quantity, 'drtsalesorder');
                                respuesta = sinbackorder.success;
                                showquantity = !respuesta;
                            }
                        }
                        break;
                    case 'purchaseorder':
                        if (context.sublistId == 'item') {
                            var location = parseInt(context.currentRecord.getValue('location')) || '';
                            var item = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'item',
                            }) || "";
                            var quantity = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'quantity',
                            }) || "";
                            var quantityLot = quantity;
                            var inventorydetailavail = context.currentRecord.getCurrentSublistValue({
                                sublistId: context.sublistId,
                                fieldId: 'inventorydetailavail',
                            });
                            console.log("inventorydetailavail: " + inventorydetailavail);
                            if (
                                inventorydetailavail == "T"
                            ) {
                                quantityLot = 0;
                                var invDetail = context.currentRecord.getCurrentSublistSubrecord({
                                    sublistId: context.sublistId,
                                    fieldId: 'inventorydetail'
                                });
                                var subLineCount = invDetail.getLineCount({
                                    sublistId: 'inventoryassignment'
                                });
                                for (var subLinenum = 0; subLinenum < subLineCount; subLinenum++) {
                                    quantityLot += parseFloat(invDetail.getSublistValue({
                                        sublistId: 'inventoryassignment',
                                        fieldId: 'quantity',
                                        line: subLinenum
                                    }) || 0);
                                }
                                respuesta = quantity == quantityLot;
                                showlot = quantity != quantityLot;
                            }
                        }
                        break;
                    default:
                        break;
                }
                if (showlot) {
                    showmessage({
                            title: "Error",
                            message: "Es necesario colocar la información de Lote.",
                            type: message.Type.ERROR
                        },
                        0,
                        false
                    );
                    respuesta = false;
                }

                if (showquantity) {
                    showmessage({
                            title: "Error",
                            message: "No se tiene cantidad disponible.",
                            type: message.Type.ERROR
                        },
                        0,
                        false
                    );
                }

            }
        } catch (error) {
            log.error({
                title: 'error validateLine',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta validateLine',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function searchInventory(param_item, param_location, param_quantity, param_type) {
        try {
            var respuesta = {
                success: false,
                data: 0,
                error: []
            };

            var itemSearchObj = search.create({
                type: search.Type.ITEM,
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
                    }),
                    search.createColumn({
                    name: "locationquantityavailable"
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
                    name: "locationquantityonhand",
                }) || 0;
                var quantity_available = result.getValue({
                    name: 'locationquantityavailable',
                  }) || 0;
                debugger;
                if (
                    item_search &&
                    location_search &&
                    param_item == item_search &&
                    param_location == location_search
                ) {
                    if(param_type == 'invoice'){
                        respuesta.success = param_quantity <= quantity_available;
                        respuesta.data = quantity_available;
                        return false;
                    } else {
                        respuesta.success = param_quantity <= quantity_search;
                        respuesta.data = quantity_search;
                        return false;
                    }
                } else {
                    return true;
                }
            });

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

    function showmessage(param_message, param_duration, param_show) {
        try {
            if (param_show) {
                var m = {
                    title: "My Title",
                    message: "My Message",
                    cause: 'cause',
                    type: message.Type.CONFIRMATION
                };
                var myMsg = message.create(param_message);

                myMsg.show({
                    duration: param_duration
                });
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options);
            }

        } catch (error) {
            log.error({
                title: 'error showmessage',
                details: JSON.stringify(error)
            });
        }
    }

    /* 
    status  Cantidad  Lote       
    __      V         V      Invoice                                     customdeploy_drt_backorder_in_cs
    __      V         V      Inventory Adjustment                        customdeploy_drt_backorder_ia_cs
    __      V         V      Inventory Transfer                          customdeploy_drt_backorder_it_cs
    OK      V         V      Transfer Order                              customdeploy_drt_backorder_to_cs
    OK      F         V      Purchase Order                              customdeploy_drt_backorder_po_cs
    OK      F         F      Sales Order                                 customdeploy_drt_backorder_so_cs

    */
    return {
        validateLine: validateLine
    }
});