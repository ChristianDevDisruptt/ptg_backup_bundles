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
        'N/runtime',
        'N/redirect'
    ],
    function (
        drt_wep_save_record_lib,
        record,
        https,
        search,
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

                var currenRecord = record.load({
                    type: recType,
                    id: recId,
                    isDynamic: false
                });

                //cambio de url
                var idInstance = runtime.envType;
                var interfas = 'wep_dev_proveedor';
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('urlEnvio', urlEnvio);

                var clieteId = currenRecord.getValue({
                    fieldId: 'entity'
                });

                var lookupCliente = search.lookupFields({
                    type: search.Type.VENDOR,
                    id: clieteId,
                    columns: ['companyname']
                });

                var customerId = lookupCliente.companyname;
                log.audit('customerId', customerId);

                var locationSales = currenRecord.getValue({
                    fieldId: 'location'
                });
                log.audit('locationSales', locationSales);

                var lookupLocationParent = search.lookupFields({
                    type: record.Type.LOCATION,
                    id: locationSales,
                    columns: ['custrecord_drt_parent']
                });

                log.audit('lookupLocationParent', lookupLocationParent);

                var parentlocation = lookupLocationParent.custrecord_drt_parent;

                var locationTransaccion = search.lookupFields({
                    type: recType,
                    id: recId,
                    columns: ['location']
                });

                var locationDev = locationTransaccion.location[0].text;
                var arrayLocation = locationDev.split(':');
                log.audit('arrayLocation', arrayLocation);

                log.audit('locationTransaccion', locationTransaccion);

                var objShipmentOrder = {};

                objShipmentOrder.folio = currenRecord.getValue({
                    fieldId: 'transactionnumber'
                });

                objShipmentOrder.shipmentOrderStatus = "Created";

                objShipmentOrder.isBackOrder = 0;
                objShipmentOrder.carrier = currenRecord.getValue({
                    fieldId: 'custbody_disa_carrier'
                }) || '';

                var fechaCreacion = currenRecord.getValue({
                    fieldId: 'trandate'
                });

                //cambio de formato de fecha por funcion
                var formatoFecha = drt_wep_save_record_lib.formatoHoraMexico('', '-', 0, 1, 2, '');
                var formatDate = formatoFecha.format;;

                log.audit('formatDate', formatDate);

                objShipmentOrder.creationDate = formatDate;

                objShipmentOrder.route = customerId;

                objShipmentOrder.salesOrder = arrayLocation[0].trim();

                var isTmsPlanning = currenRecord.getValue({
                    fieldId: 'custbody_disa_is_tms_planning'
                }) ? 1 : 0;

                objShipmentOrder.isTmsPlanning = 0;

                objShipmentOrder.shipmentDate = formatDate;

                objShipmentOrder.deliveryDate = formatDate;

                objShipmentOrder.comments = currenRecord.getValue({
                    fieldId: 'custbody_disa_comments'
                });

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
                objShipmentOrder.customer.name = "OPERADORA DISA S.A DE C.V";
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

                var progressionName = currenRecord.getValue({
                    fieldId: 'custbody_disa_progression_name'
                });

                var shipmentOrderDetailArray = [];
                var shipmentObj = {};

                for (var i = 0; i < numLines; i++) {

                    var item = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var orderQuantity = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
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
                    var idLote = currenRecord.getSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'inventorydetail',
                        line: i
                    });
                    log.audit('idLote', idLote);

                    var Lote = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorydetailavail',
                        line: i
                    });
                    log.audit('isLote', Lote);

                    if (Lote == "T") {

                        var lineSubrecord = idLote.getLineCount({
                            sublistId: 'inventoryassignment'
                        }) || 0;

                        log.audit('lineSubrecord', lineSubrecord);

                        for (var a = 0; a < lineSubrecord; a++) {
                            var inventoryNum = idLote.getSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'receiptinventorynumber',
                                line: a
                            }) || '';

                            log.audit('inventoryNum', inventoryNum);
                        }
                    }
                    //

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
                            },
                            lot: Lote == "T" ? inventoryNum : '',
                        }
                    }
                    //validacion de cantidad en la devolucion
                    if (orderQuantity > 0) {
                        shipmentOrderDetailArray.push(shipmentObj);
                    }
                }

                objShipmentOrder.shipmentOrderDetails = shipmentOrderDetailArray;



                var sendWep = currenRecord.getValue({
                    fieldId: 'custbody_drt_send_wep'
                });

                var metodoEnvio = '';
                var nombreInterface = ''
                var codigoSalida = '';

                log.audit('objShipmentOrder', objShipmentOrder);

                var headerObj = {
                    'Content-Type': 'application/json',
                };

                if (sendWep) {
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

                    if (response.code == 200) {
                        codigoSalida = 1;

                    } else {
                        codigoSalida = 2;
                    }

                    record.submitFields({
                        type: recType,
                        id: recId,
                        values: {
                            custbody_drt_response_wms: response.code,
                            custbody_disa_responce_body: response.body

                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }

                var objVendorRA = {
                    custrecord_drt_wep_output_json: JSON.stringify(objShipmentOrder),
                    custrecord_drt_wep_output_metodo: 1,
                    custrecord_drt_wep_output_name: 7,
                    custrecord_drt_disa_transaccion: recId,
                    custrecord1: 8,
                    custrecord_drt_disa_status_code: codigoSalida,
                    custrecord_drt_disa_responser_body: response.body,
                    custrecord_drt_disa_url: urlEnvio
                }

                var saveVendorRA = drt_wep_save_record_lib.saveRequest(objVendorRA);
                log.audit('objSalesOrder', objVendorRA);

                if (saveVendorRA.success) {
                    respuesta.data.push(saveVendorRA);
                    log.audit('OK', 'Se guardo el registro');
                }

                redirect.toRecord({
                    type: recType,
                    id: recId,
                    parameters: {
                        'wms': response.code
                    }
                });


            } catch (error) {
                log.audit('error', error)
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