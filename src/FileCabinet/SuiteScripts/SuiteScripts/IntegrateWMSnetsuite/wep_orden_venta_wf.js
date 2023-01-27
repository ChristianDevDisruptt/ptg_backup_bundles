/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
 define(
    [
        './drt_wep_save_record_lib',
        'N/record',
        'N/https',
        'N/search',
        'N/redirect',
        'N/runtime',
        'N/redirect'
    ],
    function (
        drt_wep_save_record_lib,
        record,
        https,
        search,
        redirect,
        runtime,
        redirect
    ) {

        function onAction(scriptContext) {
            try {
                var record_context = scriptContext.newRecord;
                var recType = record_context.type;
                var recId = record_context.id;

                var respuesta = {
                    success: false,
                    data: [],
                    error: []
                };

                var response = {
                    body: {},
                    code: 0,
                };
               
                log.audit('Fecha Actual y hora: ', new Date());

                var currenRecord = record.load({
                    type: recType,
                    id: recId,
                    isDynamic: true
                });

                var idSO = currenRecord.getValue({
                    fieldId: 'id'
                });

                var clieteId = currenRecord.getValue({
                    fieldId: 'entity'
                });

                var lookupCliente = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: clieteId,
                    columns: ['entityid']
                });

                var customerId = lookupCliente.entityid;
                log.audit('customerId', customerId);

                var locationSales = currenRecord.getValue({
                    fieldId: 'location'
                });
                log.audit('locationSales', locationSales);

                var lookupLocationParent = search.lookupFields({
                    type: record.Type.LOCATION,
                    id: locationSales,
                    columns: ['custrecord_drt_parent', 'custrecord_disa_tipo_ubicacion']
                });

                log.audit('lookupLocationParent', lookupLocationParent);

                var parentlocation = lookupLocationParent.custrecord_drt_parent;
                var ubicacionValida = lookupLocationParent.custrecord_disa_tipo_ubicacion[0].value;
                log.audit('ubicacionValida', ubicacionValida);
                var objShipmentOrder = {};

                var folioSalida = currenRecord.getValue({
                    fieldId: 'transactionnumber'
                });

                objShipmentOrder.folio = folioSalida;

                objShipmentOrder.shipmentOrderStatus = "Created";

                objShipmentOrder.isBackOrder = 0;
                objShipmentOrder.carrier = currenRecord.getValue({
                    fieldId: 'custbody_disa_carrier'
                }) || '';

                var dateNow = drt_wep_save_record_lib.formatoHoraMexico('', '-', 0, 1, 2, '');
                var formatDate = dateNow.format;

                log.audit('Fecha', formatDate);

                objShipmentOrder.creationDate = formatDate;

                //objShipmentOrder.route = customerId;

                var isTmsPlanning = currenRecord.getValue({
                    fieldId: 'custbody_disa_is_tms_planning'
                }) ? 1 : 0;

                var salesRepId = currenRecord.getValue({
                    fieldId: 'salesrep'
                });

                log.audit('salesRepId', salesRepId);

                var salesRepLookup = search.lookupFields({
                    type: record.Type.EMPLOYEE,
                    id: salesRepId,
                    columns: ['custentity_disa_oficina_ventas']
                });

                var idInstance = runtime.envType;
                var interfas = 'wep_orden_venta';
                log.audit('idInstance', idInstance);
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);

                objShipmentOrder.isTmsPlanning = 0;

                if (
                    salesRepId &&
                    salesRepLookup.custentity_disa_oficina_ventas &&
                    salesRepLookup.custentity_disa_oficina_ventas.length > 0 &&
                    salesRepLookup.custentity_disa_oficina_ventas[0].text
                ) {
                    var objNombreUbicacion = salesRepLookup.custentity_disa_oficina_ventas[0].text;
                    log.audit('objNombreUbicacion', objNombreUbicacion);
                    var arrayUbicacion = objNombreUbicacion.split(':');
                    log.audit('arrayUbicacion', arrayUbicacion);
                    objShipmentOrder.salesOrder = arrayUbicacion[arrayUbicacion.length - 1].trim()
                } else {
                    var locationLookup = search.lookupFields({
                        type: recType,
                        id: recId,
                        columns: ['location']
                    });

                    log.audit('locationLookup', locationLookup);
                    var objUbicacion = locationLookup.location[0].text;
                    log.audit('objUbicacion', objUbicacion);
                    var arrayUbicacion2 = objUbicacion.split(':');
                    log.audit('arrayUbicacion2', arrayUbicacion2);
                    objShipmentOrder.salesOrder = arrayUbicacion2[arrayUbicacion2.length - 1].trim()
                }

                objShipmentOrder.shipmentDate = formatDate;

                objShipmentOrder.deliveryDate = formatDate;

                objShipmentOrder.comments = currenRecord.getValue({
                    fieldId: 'custbody_disa_comments'
                });

                if (recType == 'vendorreturnauthorization') {
                    objShipmentOrder.rma = currenRecord.getValue({
                        fieldId: 'custbody_drt_disa_rma'
                    });
                }

                var searchReason = search.lookupFields({
                    type: recType,
                    id: recId,
                    columns: ['custbody_disa_shipment_reason_name']
                });

                var reasonName = searchReason.custbody_disa_shipment_reason_name[0].text;

                log.audit('reasonName', reasonName);

                objShipmentOrder.shipmentReason = {};
                objShipmentOrder.shipmentReason.name = reasonName

                objShipmentOrder.customer = {};
                objShipmentOrder.customer.name = customerId;
                objShipmentOrder.carrier = {};
                objShipmentOrder.carrier.name = currenRecord.getValue({
                    fieldId: 'custbody_disa_carrier_name'
                });

                objShipmentOrder.destinationAddress = {};
                objShipmentOrder.destinationAddress.nameAddress = currenRecord.getValue({
                    fieldId: 'custbody_disa_destination_name_address'
                });

                objShipmentOrder.billingAddress = {};
                objShipmentOrder.billingAddress.nameAddress = currenRecord.getValue({
                    fieldId: 'custbody_disa_billaddress_name'
                });

                objShipmentOrder.shippingAddress = {};
                objShipmentOrder.shippingAddress.nameAddress = currenRecord.getValue({
                    fieldId: 'custbody_disa_shipaddress_name'
                });

                objShipmentOrder.warehouse = {};
                objShipmentOrder.warehouse.code = currenRecord.getValue({
                    fieldId: 'custbody_disa_warehouse_code'
                });

                objShipmentOrder.account = {};
                objShipmentOrder.account.name = currenRecord.getValue({
                    fieldId: 'custbody_disa_account_name'
                });

                var numLines = currenRecord.getLineCount({
                    sublistId: 'item'
                });

                var itemBackOrder = currenRecord.getValue({
                    fieldId: 'custbody_disa_shipment_is_back_order'
                }) ? 1 : 0;

                var itemIsPatrial = currenRecord.getValue({
                    fieldId: 'custbody_disa_is_partial'
                }) ? 1 : 0;

                var progressionName = '';

                if (recType == "vendorreturnauthorization") {
                    progressionName = "Devolucion"
                } else if (recType == "salesorder") {
                    progressionName = "General"
                }


                var shipmentOrderDetailArray = [];
                var shipmentObj = {};

                for (var i = 0; i < numLines; i++) {

                    var item = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var itemtype = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemtype',
                        line: i
                    });

                    log.audit('Item Type:', itemtype);

                    if(itemtype != 'Discount'){
                        var orderQuantity = currenRecord.getSublistValue({
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


                        if (orderQuantity > 0) {
                            log.audit('Cantidad > 0', item);
                            if (!shipmentObj[item]) {
                                log.audit('shipmentObject', orderQuantity);
                                shipmentObj = {
                                    orderedQuantity: orderQuantity,
                                    isBackorder: 0,
                                    isPartial: 1,
                                    product: {
                                        sku: itemName
                                    },
                                    footprint: {
                                        name: footName
                                    },
                                    progression: {
                                        name: progressionName
                                    }
                                }
                            }
                            shipmentOrderDetailArray.push(shipmentObj);
                        }
                    }
                }

                objShipmentOrder.shipmentOrderDetails = shipmentOrderDetailArray;

                var sendWep = currenRecord.getValue({
                    fieldId: 'custbody_drt_send_wep'
                });

                var segundasVueltas = record.create({
                    type: 'customrecord_disa_drt_segundas_vueltas',
                    isDynamic: true
                });

                log.audit('objShipmentOrder', objShipmentOrder);

                var headerObj = {
                    'Content-Type': 'application/json',
                };

                var responseSalida = '';
                var codigo = 0;

                if (sendWep) {
                    if (ubicacionValida == 4) {
                        try {
                            response = https.post({
                                url: urlEnvio,
                                body: JSON.stringify(objShipmentOrder),
                                headers: headerObj
                            }) || {
                                body: {},
                                code: 0,
                            };

                            log.audit('response', response);
                            log.audit('response', response.code);
                            log.audit('response', response.body);


                        } catch (error) {
                            log.audit('error', error);
                        }

                        var responseBody = JSON.parse(response.body);
                        log.audit('responseBody', responseBody);

                        if (response.code == 200) {
                            responseSalida = responseBody;
                            log.audit('responseSalida', responseSalida);
                            codigo = 1;
                        } else if (response.code != 200) {
                            responseSalida = responseBody.message;
                            log.audit('responseSalida', responseSalida);
                            codigo = 2;
                        }
                    }
                }

                record.submitFields({
                    type: recType,
                    id: recId,
                    values: {
                        custbody_drt_response_wms: response.code,
                        custbody_disa_responce_body: responseSalida
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });


                var objOrdenVenta = {
                    custrecord_drt_wep_output_json: JSON.stringify(objShipmentOrder),
                    custrecord_drt_wep_output_metodo: 1,
                    custrecord_drt_wep_output_name: 7,
                    custrecord_drt_disa_transaccion: recId,
                    custrecord1: 6,
                    custrecord_drt_disa_status_code: codigo,
                    custrecord_drt_disa_responser_body: response.body,
                    ustrecord_drt_disa_url: urlEnvio
                }

                var saveOrdenVenta = drt_wep_save_record_lib.saveRequest(objOrdenVenta);
                log.audit('respuesta OK', objOrdenVenta);

                if (saveOrdenVenta.success) {
                    log.audit('OK', 'Se guardo el registro');
                }


                redirect.toRecord({
                    type: recType,
                    id: recId,
                    parameters: {
                        'wms': response.code
                    }
                });

                if(response.code == 200){
                    segundasVueltas.setValue({
                        fieldId: 'name',
                        value: folioSalida
                    });
    
                    segundasVueltas.setValue({
                        fieldId: 'custrecord_disa_response_code',
                        value: response.code
                    });
    
                    segundasVueltas.setValue({
                        fieldId: 'custrecord_disa_orden_venta',
                        value: idSO
                    });
    
                    segundasVueltas.setValue({
                        fieldId: 'custrecord_disa_json_generado',
                        value: JSON.stringify(objShipmentOrder)
                    });
    
                    segundasVueltas.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                }

            } catch (error) {
                log.audit('error en envio de orden de venta', error);
            } finally {
                log.audit({
                    title: 'response',
                    details: JSON.stringify(response)
                });
                return response.code;
            }
        }

        return {
            onAction: onAction
        }
    });