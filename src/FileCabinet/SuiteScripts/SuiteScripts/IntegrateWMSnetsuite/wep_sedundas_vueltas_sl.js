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
        log.audit({
            title: 'context.request.method',
            details: JSON.stringify(context.request.method)
        });
        if (context.request.method == 'GET') {
            try {
                log.audit({
                    title: 'context.request.parameters',
                    details: context.request.parameters
                });
                var id = context.request.parameters.custpage_id;
                var tipo = context.request.parameters.custpage_type;
                var numero_Vuelta = context.request.parameters.n_Vuelta;
                log.audit('tipo', tipo);
                log.audit('id', id);
                log.audit('numero_vuelta', numero_Vuelta);
                switch (context.request.parameters.param_mode) {
                    case "send":
                        var envioWms = sendWms(id, tipo, numero_Vuelta);
                        log.audit('envioWms', envioWms);
                        if (envioWms == 200) {
                            log.audit('Ok', 200);
                        }

                        break;
                    case "update":
                        updateTransaction(id, tipo);
                        break;

                    default:
                        break;
                }
            } catch (error) {
                log.audit('error', error)
            }
        }
    }

    function updateTransaction(param_id, param_tipe) {
        try {
            var respuesta = {
                success: false,
                data: "",
                error: []
            };

            respuesta.data = record.submitFields({
                type: param_tipe,
                id: param_id,
                values: {
                    'custbody_disa_segunda_vuelta': true,
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
            redirect.toRecord({
                type: param_tipe,
                id: param_id,
                // parameters: {
                //     'wms': 200
                // }
            });
            respuesta.success = Object.keys(respuesta.data).length > 0;
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error updateTransaction',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta updateTransaction',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function sendWms(param_id, param_tipe, param_vuelta) {
        try {
            log.audit('prueba', param_id + param_tipe + param_vuelta);
            var loadSalesOrder = record.load({
                type: param_tipe,
                id: param_id,
                isDynamic: true,
            });

            var respuesta = {
                success: false,
                data: {},
                error: []
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

            var folioCon = folioTransaccion + '_' + param_vuelta
            log.audit('folioCon', folioCon);

            var customerId = lookupCliente.entityid;
            log.audit('customerId', customerId);

            var salesRepId = loadSalesOrder.getValue({
                fieldId: 'salesrep'
            });

            log.audit('salesRepId', salesRepId);

            var salesRepLookup = search.lookupFields({
                type: record.Type.EMPLOYEE,
                id: salesRepId,
                columns: ['custentity_disa_oficina_ventas']
            });

            objShipmentOrder.folio = folioCon;

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
                    type: param_tipe,
                    id: param_id,
                    columns: ['location']
                });

                log.audit('locationLookup', locationLookup);
                var objUbicacion = locationLookup.location[0].text;
                log.auidt('objUbicacion', objUbicacion);
                var arrayUbicacion2 = objUbicacion.split(':');
                log.auidt('arrayUbicacion2', arrayUbicacion2);
                objShipmentOrder.salesOrder = arrayUbicacion2[arrayUbicacion2.length - 1].trim()
            }

            objShipmentOrder.route = customerId;

            objShipmentOrder.isTmsPlanning = 0;

            objShipmentOrder.shipmentDate = formatDate;

            objShipmentOrder.deliveryDate = formatDate;

            objShipmentOrder.comments = loadSalesOrder.getValue({
                fieldId: 'custbody_disa_comments'
            });

            if (param_tipe == 'vendorreturnauthorization') {
                objShipmentOrder.rma = loadSalesOrder.getValue({
                    fieldId: 'custbody_drt_disa_rma'
                });
            }

            var searchReason = search.lookupFields({
                type: param_tipe,
                id: param_id,
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
            var response = '';

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

            var almacenamiento = record.create({
                type: 'customrecord_disa_drt_segundas_vueltas',
                isDynamic: true
            });

            var headerObj = {
                'Content-Type': 'application/json',
            };

            var idInstance = runtime.envType;
            var interfas = 'wep_orden_venta';
            var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);

            if (sendWep) {
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
            }

            redirect.toRecord({
                type: param_tipe,
                id: param_id,
                parameters: {
                    'wms': response.code
                }
            });

            var body = JSON.parse(response.body);

            almacenamiento.setValue({
                fieldId: 'name',
                value: folioCon
            });

            almacenamiento.setValue({
                fieldId: 'custrecord_disa_response_code',
                value: response.code
            });

            almacenamiento.setValue({
                fieldId: 'custrecord_disa_orden_venta',
                value: idOrdenVenta
            });

            almacenamiento.setValue({
                fieldId: 'custrecord_disa_json_generado',
                value: JSON.stringify(objShipmentOrder)
            });

            var idRecord = almacenamiento.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });

            var objUpdate = {
                custbody_disa_segunda_vuelta: false
            };
            if (response.code != 200) {
                var updateRecord = record.submitFields({
                    type: "customrecord_disa_drt_segundas_vueltas",
                    id: idRecord,
                    values: {
                        custrecord_disa_item_fulfillment: param_id
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                log.audit({
                    title: 'updateRecord',
                    details: JSON.stringify(updateRecord)
                });
            }

            var updateSalesOrder = record.submitFields({
                type: param_tipe,
                id: param_id,
                values: objUpdate,
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
            log.audit('updateSalesOrder', updateSalesOrder);

        } catch (error) {
            log.audit('error', error);
        } finally {
            return response.code;
        }
    }

    return {
        onRequest: onRequest
    }
});