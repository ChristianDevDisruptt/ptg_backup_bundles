/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define([
    './drt_wep_save_record_lib',
    'N/search',
    'N/record',
    'N/https',
    'N/redirect',
    'N/runtime'
], function (
    drt_wep_save_record_lib,
    search,
    record,
    https,
    redirect,
    runtime
) {

    function onRequest(context) {
        if (context.request.method == 'GET') {
            try {
                log.audit({
                    title: 'context.request.parameters',
                    details: context.request.parameters
                });
                var id = context.request.parameters.custpage_id;
                var tipo = context.request.parameters.custpage_type;

                var loadSalesOrder = record.load({
                    type: tipo,
                    id: id,
                    isDynamic: true,
                });

                var respuesta = {
                    success: false,
                    data: {},
                    error: []
                };

                var response = {
                    body: {},
                    code: 0,
                };

                var objShipmentOrder = {};

                var idOrdenVenta = loadSalesOrder.getValue({
                    fieldId: 'id'
                });

                var clieteId = loadSalesOrder.getValue({
                    fieldId: 'entity'
                });

                var lookupCliente = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: clieteId,
                    columns: ['entityid']
                });

                var folioTransaccion = loadSalesOrder.getValue({
                    fieldId: 'transactionnumber'
                });

                var customerId = lookupCliente.entityid;
                log.audit('customerId', customerId);

                var locationSales = loadSalesOrder.getValue({
                    fieldId: 'location'
                });
                log.audit('locationSales', locationSales);

                var lookupLocationParent = search.lookupFields({
                    type: record.Type.LOCATION,
                    id: locationSales,
                    columns: ['custrecord_drt_parent', 'custrecord_disa_tipo_ubicacion']
                });

                log.audit('lookupLocationParent', lookupLocationParent);

                var ubicacionValida = lookupLocationParent.custrecord_disa_tipo_ubicacion[0].value;
                log.audit('ubicacionValida', ubicacionValida);

                var salesRepId = loadSalesOrder.getValue({
                    fieldId: 'salesrep'
                });

                log.audit('salesRepId', salesRepId);

                var salesRepLookup = search.lookupFields({
                    type: record.Type.EMPLOYEE,
                    id: salesRepId,
                    columns: ['custentity_disa_oficina_ventas']
                });

                objShipmentOrder.folio = folioTransaccion;

                objShipmentOrder.shipmentOrderStatus = "Created";

                objShipmentOrder.isBackOrder = 0;
                objShipmentOrder.carrier = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_carrier'
                }) || '';

                var formatoFecha = drt_wep_save_record_lib.formatoHoraMexico('', '-', 0, 1, 2, '');
                var formatDate = formatoFecha.format;
                log.audit('formatDate', formatDate);

                objShipmentOrder.creationDate = formatDate;

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
                        type: tipo,
                        id: id,
                        columns: ['location']
                    });

                    log.audit('locationLookup', locationLookup);
                    var objUbicacion = locationLookup.location[0].text;
                    log.audit('objUbicacion', objUbicacion);
                    var arrayUbicacion2 = objUbicacion.split(':');
                    log.audit('arrayUbicacion2', arrayUbicacion2);
                    objShipmentOrder.salesOrder = arrayUbicacion2[arrayUbicacion2.length - 1].trim()
                }

                objShipmentOrder.isTmsPlanning = 0;

                objShipmentOrder.shipmentDate = formatDate;

                objShipmentOrder.deliveryDate = formatDate;

                objShipmentOrder.comments = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_comments'
                });

                var searchReason = search.lookupFields({
                    type: tipo,
                    id: id,
                    columns: ['custbody_disa_shipment_reason_name']
                });

                var reasonName = searchReason.custbody_disa_shipment_reason_name[0].text;

                objShipmentOrder.shipmentReason = {};
                objShipmentOrder.shipmentReason.name = reasonName

                objShipmentOrder.customer = {};
                objShipmentOrder.customer.name = customerId;
                objShipmentOrder.carrier = {};
                objShipmentOrder.carrier.name = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_carrier_name'
                });

                objShipmentOrder.destinationAddress = {};
                objShipmentOrder.destinationAddress.nameAddress = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_destination_name_address'
                });

                objShipmentOrder.billingAddress = {};
                objShipmentOrder.billingAddress.nameAddress = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_billaddress_name'
                });

                objShipmentOrder.shippingAddress = {};
                objShipmentOrder.shippingAddress.nameAddress = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_shipaddress_name'
                });

                objShipmentOrder.warehouse = {};
                objShipmentOrder.warehouse.code = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_warehouse_code'
                });

                objShipmentOrder.account = {};
                objShipmentOrder.account.name = loadSalesOrder.getValue({
                    fieldId: 'custbody_disa_account_name'
                });

                var numLines = loadSalesOrder.getLineCount({
                    sublistId: 'item'
                });

                var progressionName = 'General';

                var shipmentOrderDetailArray = [];
                var shipmentObj = {};

                for (var i = 0; i < numLines; i++) {

                    var item = loadSalesOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var orderQuantity = loadSalesOrder.getSublistValue({
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

                    if (!shipmentObj[item]) {
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
                    if (orderQuantity > 0) {
                        shipmentOrderDetailArray.push(shipmentObj);
                    }
                }

                objShipmentOrder.shipmentOrderDetails = shipmentOrderDetailArray;

                log.audit('objShipmentOrder', objShipmentOrder);

                var sendWep = loadSalesOrder.getValue({
                    fieldId: 'custbody_drt_send_wep'
                });

                var segundasVueltas = record.create({
                    type: 'customrecord_disa_drt_segundas_vueltas',
                    isDynamic: true
                });

                var headerObj = {
                    'Content-Type': 'application/json',
                };

                var idInstance = runtime.envType;
                var interfas = 'wep_orden_venta';
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                var responseSalida = '';

                if (sendWep) {
                    if (ubicacionValida == 4) {
                        //cambiar por 4
                        try {
                            response = https.post({
                                url: urlEnvio,
                                body: JSON.stringify(objShipmentOrder),
                                headers: headerObj
                            });
                            log.audit('response-code', response.code);
                            log.audit('response-body', response.body);

                        } catch (error) {
                            log.audit('error', error);
                        }

                        var responseBody = JSON.parse(response.body);
                        log.audit('responseBody', responseBody);

                        if (response.code == 200) {
                            responseSalida = responseBody;
                            log.audit('responseSalida', responseSalida);
                        } else if (response.code != 200) {
                            responseSalida = responseBody.message;
                            log.audit('responseSalida', responseSalida);
                        }
                    }
                }

                record.submitFields({
                    type: tipo,
                    id: id,
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
                    custrecord_drt_disa_transaccion: id,
                    custrecord1: 6,
                    custrecord_drt_disa_status_code: response.code,
                    custrecord_drt_disa_responser_body: response.body,
                    ustrecord_drt_disa_url: urlEnvio
                }

                var saveOrdenVenta = drt_wep_save_record_lib.saveRequest(objOrdenVenta);
                log.audit('respuesta OK', objOrdenVenta);

                if (saveOrdenVenta.success) {
                    log.audit('OK', 'Se guardo el registro');
                }

                redirect.toRecord({
                    type: tipo,
                    id: id,
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
                log.audit('error', error)
            }
        }
    }

    return {
        onRequest: onRequest
    }
});