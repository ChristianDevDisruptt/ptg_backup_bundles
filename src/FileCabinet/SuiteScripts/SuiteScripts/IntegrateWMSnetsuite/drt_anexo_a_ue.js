/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['./drt_wep_save_record_lib', 'N/record', 'N/https', 'N/search', 'N/ui/serverWidget', "N/format", "N/runtime", "N/redirect"], function (drt_wep_save_record_lib, record, https, search, ui, format, runtime, redirect) {
    //levantar una orden de traslado no hay validacion de minimo, credito
    //contemplar solo lo comprometido del artculo
    //status = pending full filment
    function before(context) {
        try {
            if (context.type == context.UserEventType.EDIT) {
                if (
                    context.newRecord.type == record.Type.TRANSFER_ORDER
                ) {
                    var msgField = context.form.addField({
                        id: 'custpage_drt_message',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametro = context.request.parameters.wms;
                    log.audit('parametro', parametro);

                    var param_message = '';

                    if (parametro == 1) {
                        param_message = "No olvides guardar tu transaccion para ser enviada a WMS"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Validacion: " + param_message + "', type: message.Type.INFORMATION}).show({duration: 25000})  });</script>";
                    }
                }

            }

            if (context.type == context.UserEventType.VIEW) {
                if (
                    context.newRecord.type == record.Type.TRANSFER_ORDER
                ) {

                    var msgField = context.form.addField({
                        id: 'custpage_drt_message',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuesta = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuesta);

                    var currentRecord = context.newRecord;

                    var status = currentRecord.getValue({
                        fieldId: 'custbody_drt_responce_code'
                    });

                    var respuesta = currentRecord.getValue({
                        fieldId: 'custbody_drt_responce_body'
                    });

                    if (parametroRespuesta == 200) {
                        param_message = "Su registro se envio con éxito a WEP"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuesta + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuesta == 500) {
                        param_message = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + "  " + respuesta + " ', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                }
            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {


                var newRecord = context.newRecord;
                var recordId = newRecord.id;
                var recordType = newRecord.type;

                var recordTransaction = record.load({
                    type: recordType,
                    id: recordId,
                    isDynamic: false
                });

                var old = context.oldRecord;
                log.audit('old', old);


                var respuesta = {
                    success: false,
                    data: {},
                    error: {}
                };

                switch (recordType) {
                    case record.Type.TRANSFER_ORDER:
                        respuesta = anexoA(recordTransaction);
                        break;
                    case record.Type.ITEM_RECEIPT:
                        respuesta = anexoC(recordTransaction);
                        break
                    case record.Type.RETURN_AUTHORIZATION:
                        respuesta = anexok(recordTransaction);
                        break
                    case record.Type.VENDOR_RETURN_AUTHORIZATION:
                        respuesta = anexok(recordTransaction);
                        break
                    default:
                        break;
                }

            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    function anexoA(recordTransaction) {
        try {
            //declaracion de varables globales
            var respuesta = {
                success: false,
                data: [],
                error: []
            };

            var locationArea = recordTransaction.getValue({
                fieldId: 'location'
            });

            var locationTransfer = recordTransaction.getValue({
                fieldId: 'transferlocation'
            });

            var formDisa = recordTransaction.getValue({
                fieldId: 'customform'
            });

            var recorType = recordTransaction.type;
            var recordId = recordTransaction.id;
            /*
            var searLocation = search.lookupFields({
                type: search.Type.LOCATION,
                id: locationArea,
                columns: ['custrecord_disa_tipo_ubicacion']
            });

            log.audit('searLocation', searLocation);

            var disaUbicacion = searLocation.custrecord_disa_tipo_ubicacion[0].value || 0;

            log.audit('disaUbicacion', disaUbicacion);
            */

            var response = {
                body: {},
                code: 0,
            };
            var metodoEnvio = '';
            var nombreInterface = '';

            var envioWms = recordTransaction.getValue({
                fieldId: 'custbody_drt_send_wep'
            });

            var transferOrder = {};
            var shipmentOrderDetailArray = [];
            var shipmentObj = {};
            var trasnferOreder = {};

            var mesFinal = drt_wep_save_record_lib.formatoHoraMexico('', '-', 0, 1, 2, '');
            var formatDate = mesFinal.format;
            log.audit('formatDate', formatDate);

            var orderTypeName = recordTransaction.getText({
                fieldId: 'custbody_disa_order_type'
            });

            var numLines = recordTransaction.getLineCount({
                sublistId: 'item'
            });

            var nameSupplier = recordTransaction.getValue({
                fieldId: 'custbody_disa_customer_name'
            });

            var locationD = search.lookupFields({
                type: recorType,
                id: recordId,
                columns: ['transferlocation']
            });

            log.audit('locationD', locationD);

            var cliente = locationD.transferlocation[0].text;

            log.audit('cliente', cliente);

            var proveedor = search.lookupFields({
                type: recorType,
                id: recordId,
                columns: ['location']
            });

            var objNombreUbicacion = proveedor.location[0].text;
            var arrayUbicacion = cliente.split(':');
            log.audit('arrayUbicacion', arrayUbicacion);

            log.audit('proveedor', proveedor);

            var nameProvedor = proveedor.location[0].text;
            log.audit('nameProvedor', nameProvedor);

            var responseB = {};

            var headerObj = {
                'Content-Type': 'application/json',
            };

            var actualizarWms = recordTransaction.getValue({
                fieldId: 'custbody_disa_actualizar_wms'
            });

            var metodoEnvio = '';
            var metodo = '';
            var nombreinterfas = '';
            var idInstance = runtime.envType;
            var interfas = '';
            var url = '';
            var sumaArticulos = 0;

            if (formDisa == 208) {
                //envio de Ac a cedis
                var searchReason = search.lookupFields({
                    type: recorType,
                    id: recordId,
                    columns: ['custbody_disa_shipment_reason_name']
                });

                log.audit('searchReason', searchReason);
                var reasonName = searchReason.custbody_disa_shipment_reason_name[0].text;

                log.audit('reasonName', reasonName);
                var pruebaJson = {};
                trasnferOreder.folio = recordTransaction.getValue({
                    fieldId: 'transactionnumber'
                });
                trasnferOreder.shipmentOrderStatus = "Created";
                trasnferOreder.isBackOrder = 0;
                trasnferOreder.creationDate = formatDate;
                trasnferOreder.route = "";
                trasnferOreder.salesOrder = arrayUbicacion[0].trim();
                trasnferOreder.isTmsPlanning = 0;
                trasnferOreder.shipmentDate = formatDate;
                trasnferOreder.deliveryDate = formatDate;
                trasnferOreder.shipmentReason = {};
                trasnferOreder.shipmentReason.name = reasonName;
                trasnferOreder.customer = {};
                trasnferOreder.customer.name = cliente;
                trasnferOreder.carrier = {};
                trasnferOreder.carrier.name = recordTransaction.getValue({
                    fieldId: 'custbody_disa_carrier_name'
                });
                trasnferOreder.destinationAddress = {};
                trasnferOreder.destinationAddress.nameAddress = recordTransaction.getValue({
                    fieldId: 'custbody_disa_destination_name_address'
                });
                trasnferOreder.billingAddress = {};
                trasnferOreder.billingAddress.nameAddress = recordTransaction.getValue({
                    fieldId: 'custbody_disa_shipaddress_name'
                });
                trasnferOreder.shippingAddress = {};
                trasnferOreder.shippingAddress.nameAddress = recordTransaction.getValue({
                    fieldId: 'custbody_disa_shipaddress_name'
                });
                trasnferOreder.warehouse = {};
                trasnferOreder.warehouse.code = recordTransaction.getValue({
                    fieldId: 'custbody_disa_warehouse_code'
                });
                trasnferOreder.account = {};
                trasnferOreder.account.name = recordTransaction.getValue({
                    fieldId: 'custbody_disa_account_name'
                });

                for (var i = 0; i < numLines; i++) {
                    var item = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var orderQuantity = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantitycommitted',
                        line: i
                    });

                    var lookupItem = search.lookupFields({
                        type: search.Type.INVENTORY_ITEM,
                        id: item,
                        columns: ['upccode', 'custitem_disa_huella_name']
                    });

                    var itemName = lookupItem.upccode;
                    var footName = lookupItem.custitem_disa_huella_name;

                    //todo obtencion y validacion de lotes al guardar una transaccion

                    var Lote = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorydetailavail',
                        line: i
                    });
                    log.audit('isLote', Lote);

                    if (Lote == "T") {
                        var idLote = recordTransaction.getSublistSubrecord({
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
                                fieldId: 'issueinventorynumber',
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
                    //

                    if (!shipmentObj[item]) {
                        shipmentObj = {
                            orderedQuantity: orderQuantity,
                            isBackorder: 0,
                            sPartial: 1,
                            product: {
                                sku: itemName
                            },
                            footprint: {
                                name: footName
                            },
                            progression: {
                                name: "General"
                            },
                            lot: Lote == "T" ? inventoryNombre : '',
                        }
                    }
                    if (orderQuantity > 0) {
                        shipmentOrderDetailArray.push(shipmentObj);
                    }

                    sumaArticulos += orderQuantity;
                }
                trasnferOreder.shipmentOrderDetails = shipmentOrderDetailArray;
                log.audit('transferOrder', trasnferOreder);
                nombreinterfas = 7;
                interfas = 'traslado_ce_ac';
                url = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('url', url);
                var codigo = 0;
                log.audit('sumaArticulos', sumaArticulos);
                if (envioWms && sumaArticulos > 0) {
                    log.audit('ok', 'entro bien');
                    metodo = 1;

                    try {
                        response = https.post({
                            url: url,
                            body: JSON.stringify(trasnferOreder),
                            headers: headerObj
                        });
                        log.audit('response', response);
                        log.audit('response_body_1', response.body);
                        log.audit('response_code_1', response.code);
                    } catch (error) {
                        log.audit('error anexoA', error);
                    }

                    var respuestas = JSON.parse(response.body);
                    log.audit('respuestas', respuestas);
                    var respuestaC = '';

                    if (response.code == 200) {
                        respuestaC = 'transacción creada con id de wms:' + ' ' + respuestas.id + '  ' + 'y folio de transacción' + ' ' + respuestas.orderNumber;
                        codigo = 1;
                    } else if (response.code == 500) {
                        respuestaC = respuestas.message;
                        codigo = 2;
                        log.audit('respuestaC', respuestaC);
                    } else if (response.code == 404) {
                        respuestaC = respuestas.message
                    }
                } else {
                    log.audit('error', 'No puedes enviar articulos en cantidad en 0');
                }

                var objTraslacoAc = {
                    custrecord_drt_wep_output_json: JSON.stringify(trasnferOreder),
                    custrecord_drt_wep_output_metodo: 1,
                    custrecord_drt_wep_output_name: 7,
                    custrecord_drt_disa_transaccion: recordId,
                    custrecord1: 10,
                    custrecord_drt_disa_status_code: codigo,
                    custrecord_drt_disa_responser_body: response.body,
                    ustrecord_drt_disa_url: url
                }

                log.audit('objTraslacoAc', objTraslacoAc);

                var saveTrasladoAc = drt_wep_save_record_lib.saveRequest(objTraslacoAc);

                if (saveTrasladoAc.success) {
                    log.audit('OK', 'La orden de traslado de Ac a cedis Se guardo en el registro de control');
                }

                record.submitFields({
                    type: recorType,
                    id: recordId,
                    values: {
                        custbody_drt_response_wms: response.code,
                        custbody_disa_responce_body: respuestaC
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
            }


            if (formDisa == 207) {
                //envio de cedis a AC

                var wmsEnvio = recordTransaction.getValue({
                    fieldId: 'custbody_drt_send_wms'
                });

                transferOrder.orderNumber = recordTransaction.getValue({
                    fieldId: 'transactionnumber'
                });
                var date = new Date();
                date.setDate(date.getDate() + 180)

                var formatDate = date.toISOString().slice(0, 10);
                transferOrder.expirationDay = formatDate;
                transferOrder.account = {};
                transferOrder.account.name = recordTransaction.getValue({
                    fieldId: 'custbody_disa_account_name'
                });
                transferOrder.warehouse = {};
                transferOrder.warehouse.code = recordTransaction.getValue({
                    fieldId: 'custbody_disa_warehouse_code'
                });
                transferOrder.orderType = {};
                transferOrder.orderType.name = orderTypeName;
                transferOrder.supplier = {};
                transferOrder.supplier.name = nameProvedor;


                for (var i = 0; i < numLines; i++) {
                    var item = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var orderQuantity = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantityfulfilled',
                        line: i
                    });

                    var lookupItem = search.lookupFields({
                        type: search.Type.INVENTORY_ITEM,
                        id: item,
                        columns: ['upccode', 'custitem_disa_huella_name']
                    });

                    var itemName = lookupItem.upccode;
                    var footName = lookupItem.custitem_disa_huella_name;

                    //todo obtencion y validacion de lotes al guardar una transaccion

                    var Lote = recordTransaction.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorydetailavail',
                        line: i
                    });
                    log.audit('isLote', Lote);

                    if (Lote == "T") {
                        var idLote = recordTransaction.getSublistSubrecord({
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
                                fieldId: 'issueinventorynumber',
                                line: a
                            }) || '';

                            var inventoryQuantity = idLote.getSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
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

                            //if (!shipmentObj[item]) {
                                shipmentObj = {
                                    orderedQuantity: inventoryQuantity,
                                    isBackorder: 0,
                                    sPartial: 1,
                                    product: {
                                        sku: itemName
                                    },
                                    footprint: {
                                        name: footName
                                    },
                                    lot: Lote == "T" ? inventoryNombre : '',
                                }

                                shipmentOrderDetailArray.push(shipmentObj);
                            //}
                        }
                    } else {
                        shipmentObj = {
                            orderedQuantity: orderQuantity,
                            isBackorder: 0,
                            sPartial: 1,
                            product: {
                                sku: itemName
                            },
                            footprint: {
                                name: footName
                            },
                            lot: Lote == "T" ? inventoryNombre : '',
                        }
                        
                        //if (orderQuantity > 0) {
                            shipmentOrderDetailArray.push(shipmentObj);
                        //}
                    }

                    sumaArticulos += orderQuantity;
                }
                log.audit('suma de articulos', sumaArticulos)
                transferOrder.receiptOrderDetails = shipmentOrderDetailArray;
                nombreinterfas = 6;
                interfas = 'traslado_ac_ce';
                var url2 = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('jsonS', transferOrder);
                log.audit('suma', sumaArticulos)

                if (wmsEnvio && sumaArticulos > 0) {
                    log.audit('ok', 'paso la pruebas');
                    try {
                        response = https.post({
                            url: url2,
                            body: JSON.stringify(transferOrder),
                            headers: headerObj
                        });
                        log.audit('response', response);
                        log.audit('response_body', response.body);
                        log.audit('response_code_', response.code);
                    } catch (error) {
                        log.audit('error anexoA', error);
                    }

                    var respuestas = JSON.parse(response.body);
                    var respuestaC = '';

                    if (response.code == 200) {
                        respuestaC = 'transacción creada con id de wms:' + ' ' + respuestas.id + '  ' + 'y folio de transacción' + ' ' + respuestas.orderNumber;

                    } else if (response.code == 500) {
                        respuestaC = respuestas.message
                        log.audit('respuestaC', respuestaC);
                    }

                    record.submitFields({
                        type: recorType,
                        id: recordId,
                        values: {
                            custbody_drt_responce_code: response.code,
                            custbody_disa_responce_body: respuestaC
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                } else {
                    log.audit('Error', 'No es posible enviar tu orden a wms.')
                }

                redirect.toRecord({
                    type: recordTransaction.type,
                    id: recordTransaction.id,
                    parameters: {
                        'wms': response.code
                    }
                });

            }


            if (formDisa == 252) {
                //Traslado de trancito a aduana, crear transform itemfullfilment y iten receipt
                log.audit('origen', locationArea);
                log.audit('destino', locationTransfer);
                var trancito = recordTransaction.getValue({
                    fieldId: 'custbody_disa_de_transito_aduana'
                });
                log.audit('trancito', trancito);
                if (locationArea == 2 && locationTransfer == 523) {
                    if (trancito) {
                        var searchItemFulFillment = search.create({
                            type: record.Type.ITEM_FULFILLMENT,
                            filters: [
                                ["custbody_disa_control_proceso_ci", "equalto", recordId],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "location"
                                })
                            ]
                        });

                        var runSearchItemFulFillment = searchItemFulFillment.run().getRange({
                            start: 0,
                            end: 999
                        });
                        log.audit('salida', runSearchItemFulFillment);

                        if (runSearchItemFulFillment.length > 0) {
                            log.audit('error', 'Ya existe una transaccion con este Id');
                        } else {
                            log.audit('Exito', 'Empieza el proceso....');
                            var transformFulFillment = record.transform({
                                fromType: record.Type.TRANSFER_ORDER,
                                fromId: recordId,
                                toType: record.Type.ITEM_FULFILLMENT,
                                isDynamic: true,
                            });

                            transformFulFillment.setValue({
                                fieldId: 'memo',
                                value: 'Prceso de importancion paso 1'
                            });

                            transformFulFillment.setValue({
                                fieldId: 'shipstatus',
                                value: 'B'
                            });

                            transformFulFillment.setValue({
                                fieldId: 'shipstatus',
                                value: 'C'
                            });

                            transformFulFillment.setValue({
                                fieldId: 'custbody_disa_control_proceso_ci',
                                value: recordId
                            });

                            //hasta que estautus vamos a dejar el fulfillment
                            //se hara validacion para que no se haga el duplicado de estas transacciones

                            var saveTransformFulFillment = transformFulFillment.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });
                            log.audit('transformFulFillment', saveTransformFulFillment);
                        }

                        var searchItemReceipt = search.create({
                            type: record.Type.ITEM_RECEIPT,
                            filters: [
                                ["custbody_disa_control_proceso_ci", "equalto", recordId],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "location"
                                })
                            ]
                        });

                        var runSearchItemReceipt = searchItemReceipt.run().getRange({
                            start: 0,
                            end: 999
                        });
                        log.audit('salida', runSearchItemReceipt);

                        if (runSearchItemReceipt.length > 0) {
                            log.audit('error', 'Ya se tiene una transaccion con este mismo Id');
                        } else {
                            if (saveTransformFulFillment) {
                                var itemReceipt = record.transform({
                                    fromType: record.Type.TRANSFER_ORDER,
                                    fromId: recordId,
                                    toType: record.Type.ITEM_RECEIPT,
                                    isDynamic: true,
                                });


                                itemReceipt.setValue({
                                    fieldId: 'location',
                                    value: locationTransfer
                                });

                                itemReceipt.setValue({
                                    fieldId: 'memo',
                                    value: 'Proceso de importacion paso 2'
                                });

                                itemReceipt.setValue({
                                    fieldId: 'custbody_disa_control_proceso_ci',
                                    value: recordId
                                });

                                var saveItemReceipt = itemReceipt.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });

                                log.audit('saveItemReceipt', saveItemReceipt);
                            }
                        }
                    }
                }
            }

            if (formDisa == 251) {
                //proceso de traslado aduana a almacen central producto para venta
                log.audit('origen', locationArea);
                log.audit('destino', locationTransfer);
                var trancitoAduana = recordTransaction.getValue({
                    fieldId: 'custbody_disa_de_aduana_produc_venta'
                });
                log.audit('trancito', trancitoAduana);
                if (locationArea == 523 && locationTransfer == 211) {
                    if (trancitoAduana) {
                        log.audit('ok', 'nuevo proceso');
                        var wmsEnvio = recordTransaction.getValue({
                            fieldId: 'custbody_drt_send_wms'
                        });

                        transferOrder.orderNumber = recordTransaction.getValue({
                            fieldId: 'transactionnumber'
                        });
                        var date = new Date();
                        date.setDate(date.getDate() + 180)

                        var formatDate = date.toISOString().slice(0, 10);
                        transferOrder.expirationDay = formatDate;
                        transferOrder.account = {};
                        transferOrder.account.name = recordTransaction.getValue({
                            fieldId: 'custbody_disa_account_name'
                        });
                        transferOrder.warehouse = {};
                        transferOrder.warehouse.code = recordTransaction.getValue({
                            fieldId: 'custbody_disa_warehouse_code'
                        });
                        transferOrder.orderType = {};
                        transferOrder.orderType.name = orderTypeName;
                        transferOrder.supplier = {};
                        transferOrder.supplier.name = nameProvedor;


                        for (var i = 0; i < numLines; i++) {
                            var item = recordTransaction.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                line: i
                            });

                            var orderQuantity = recordTransaction.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantitycommitted',
                                line: i
                            });

                            var quantityfulfilled = recordTransaction.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'quantityfulfilled',
                                line: i
                            });

                            var lookupItem = search.lookupFields({
                                type: search.Type.INVENTORY_ITEM,
                                id: item,
                                columns: ['upccode', 'custitem_disa_huella_name']
                            });

                            var itemName = lookupItem.upccode;
                            var footName = lookupItem.custitem_disa_huella_name;

                            //todo obtencion y validacion de lotes al guardar una transaccion

                            var Lote = recordTransaction.getSublistValue({
                                sublistId: 'item',
                                fieldId: 'inventorydetailavail',
                                line: i
                            });
                            log.audit('isLote', Lote);

                            if (Lote == "T") {
                                var idLote = recordTransaction.getSublistSubrecord({
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
                                        fieldId: 'issueinventorynumber',
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
                            //

                            if (!shipmentObj[item]) {
                                shipmentObj = {
                                    orderedQuantity: quantityfulfilled,
                                    isBackorder: 0,
                                    sPartial: 1,
                                    product: {
                                        sku: itemName
                                    },
                                    footprint: {
                                        name: footName
                                    },
                                    lot: Lote == "T" ? inventoryNombre : '',
                                }
                            }
                            //if (orderQuantity > 0) {
                                shipmentOrderDetailArray.push(shipmentObj);
                            //}

                            sumaArticulos += quantityfulfilled;
                        }

                        transferOrder.receiptOrderDetails = shipmentOrderDetailArray;
                        nombreinterfas = 6;
                        interfas = 'traslado_ac_ce';
                        var url2 = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                        log.audit('jsonS', transferOrder);

                        if (wmsEnvio && sumaArticulos > 0) {
                            log.audit('ok', 'paso la pruebas');
                            try {
                                response = https.post({
                                    url: url2,
                                    body: JSON.stringify(transferOrder),
                                    headers: headerObj
                                });
                                log.audit('response', response);
                                log.audit('response_body', response.body);
                                log.audit('response_code_', response.code);
                            } catch (error) {
                                log.audit('error anexoA', error);
                            }

                            var respuestas = JSON.parse(response.body);
                            var respuestaC = '';

                            if (response.code == 200) {
                                respuestaC = 'transacción creada con id de wms:' + ' ' + respuestas.id + '  ' + 'y folio de transacción' + ' ' + respuestas.orderNumber;

                            } else if (response.code == 500) {
                                respuestaC = respuestas.message
                                log.audit('respuestaC', respuestaC);
                            }

                            record.submitFields({
                                type: recorType,
                                id: recordId,
                                values: {
                                    custbody_drt_responce_code: response.code,
                                    custbody_disa_responce_body: respuestaC
                                },
                                options: {
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                }
                            });
                        } else {
                            log.audit('Error', 'No es posible enviar tu orden a wms.')
                        }

                        var searchItemFulFillment2 = search.create({
                            type: record.Type.ITEM_FULFILLMENT,
                            filters: [
                                ["custbody_disa_control_proceso_ci", "equalto", recordId],
                                "AND",
                                ["mainline", "is", "T"]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "location"
                                })
                            ]
                        });

                        var runSearchItemFulFillment = searchItemFulFillment2.run().getRange({
                            start: 0,
                            end: 999
                        });
                        log.audit('salida', runSearchItemFulFillment);

                        if (runSearchItemFulFillment.length > 0) {
                            log.audit('error', 'Ya existe una transaccion con este Id');
                        } else {
                            var itemfullfilment2 = record.transform({
                                fromType: record.Type.TRANSFER_ORDER,
                                fromId: recordId,
                                toType: record.Type.ITEM_FULFILLMENT,
                                isDynamic: true,
                            });

                            itemfullfilment2.setValue({
                                fieldId: 'memo',
                                value: 'Prceso de importancion paso 1'
                            });

                            itemfullfilment2.setValue({
                                fieldId: 'shipstatus',
                                value: 'B'
                            });

                            itemfullfilment2.setValue({
                                fieldId: 'shipstatus',
                                value: 'C'
                            });

                            itemfullfilment2.setValue({
                                fieldId: 'custbody_disa_control_proceso_ci',
                                value: recordId
                            });

                            //hasta que estautus vamos a dejar el fulfillment

                            var saveitemfullfilment2 = itemfullfilment2.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });
                            log.audit('transformFulFillment', saveitemfullfilment2);
                        }
                    }
                }
            }

            var objSalesOrder = {
                custrecord_drt_wep_output_json: JSON.stringify(transferOrder),
                custrecord_drt_wep_output_metodo: 1,
                custrecord_drt_wep_output_name: nombreinterfas,
                custrecord_drt_disa_transaccion: recordId,
                custrecord1: 10,
                custrecord_drt_disa_status_code: codigo,
                custrecord_drt_disa_responser_body: response.body,
                custrecord_drt_disa_url: url
            }
            /*
            var saveProveedor = drt_wep_save_record_lib.saveRequest(objSalesOrder);
            log.audit('dd', objSalesOrder);

            if (saveProveedor.success) {
                respuesta.data.push(saveProveedor);
                log.audit('OK', 'Se guardo el registro');
            }
            */

        } catch (error) {
            log.audit('error Anexoa', error);
        }
    }

    return {
        beforeLoad: before,
        afterSubmit: afterSubmit
    }
});