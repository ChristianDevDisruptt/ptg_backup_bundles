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

                var currenRecord = record.load({
                    type: recType,
                    id: recId,
                    isDynamic: false
                });

                var response = {
                    body: {},
                    code: 0,
                };

                var headerObj = {
                    'Content-Type': 'application/json',
                };

                var idInstance = runtime.envType;
                var interfas = 'wep_dev_cliente';
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('urlEnvio', urlEnvio);

                var idPo = currenRecord.getValue({
                    fieldId: 'id'
                });

                var envWms = currenRecord.getValue({
                    fieldId: 'custbody_drt_send_wms'
                });

                var objreceiptOreder = {};

                var referenceOrder = currenRecord.getValue({
                    fieldId: 'transactionnumber'
                });

                var accountName = currenRecord.getValue({
                    fieldId: 'custbody_disa_account_name'
                });

                var wareHouseCode = currenRecord.getValue({
                    fieldId: 'custbody_disa_warehouse_code'
                });

                var lookupOrderType = search.lookupFields({
                    type: recType,
                    id: recId,
                    columns: ['custbody_disa_order_type']
                });

                log.audit('lookupOrderType', lookupOrderType.custbody_disa_order_type[0].text);

                var orderTypeName = lookupOrderType.custbody_disa_order_type[0].text;

                var statusOrder = currenRecord.getValue({
                    fieldId: 'orderstatus'
                });

                log.audit('statusOrder', statusOrder);

                var locationOrder = currenRecord.getValue({
                    fieldId: 'location'
                });

                log.audit('locationOrder', locationOrder);

                var lookupLocation = search.lookupFields({
                    type: record.Type.LOCATION,
                    id: locationOrder,
                    columns: ['custrecord_drt_parent', 'custrecord_disa_tipo_ubicacion']
                });

                log.audit('lookupLocation', lookupLocation);

                var parentLocation = lookupLocation.custrecord_drt_parent;
                var ubicacionValida = lookupLocation.custrecord_disa_tipo_ubicacion[0].value;

                log.audit({
                    title: 'ubicacionValida',
                    details: ubicacionValida
                });

                var locationTransaccion = search.lookupFields({
                    type: recType,
                    id: recId,
                    columns: ['location']
                });

                var locationDev = locationTransaccion.location[0].text;
                var arrayLocation = locationDev.split(':');
                log.audit('arrayLocation', arrayLocation);
                log.audit('locationTransaccion', locationTransaccion);

                var nameSupplier = currenRecord.getValue({
                    fieldId: 'entity'
                });

                var lookupField = search.lookupFields({
                    type: record.Type.CUSTOMER,
                    id: nameSupplier,
                    columns: ['altname']
                })

                log.audit('lookupField', lookupField);

                var provedor = lookupField.altname;

                log.audit({
                    title: 'provedor',
                    details: provedor
                });

                var tipoNC = currenRecord.getValue({
                    fieldId: 'custbody_disa_tipo_nc'
                });

                log.audit('tipoNC', tipoNC);

                var date = new Date();
                date.setDate(date.getDate() + 180)

                var formatDate = date.toISOString().slice(0, 10);

                var lines = currenRecord.getLineCount({
                    sublistId: 'item'
                });
                var receiptOrderDetailsArray = [];
                var orderDetails = {};

                var form = currenRecord.getValue({
                    fieldId: 'customform'
                });

                objreceiptOreder.orderNumber = referenceOrder;
                objreceiptOreder.salesOrder = arrayLocation[arrayLocation.length - 1].trim();
                objreceiptOreder.expirationDay = formatDate;
                objreceiptOreder.account = {};
                objreceiptOreder.account.name = accountName;
                objreceiptOreder.warehouse = {};
                objreceiptOreder.warehouse.code = wareHouseCode;
                objreceiptOreder.orderType = {};
                objreceiptOreder.orderType.name = orderTypeName;
                objreceiptOreder.supplier = {};
                objreceiptOreder.supplier.name = "OPERADORA DISA S.A DE C.V";

                for (var i = 0; i < lines; i++) {

                    var idItem = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });
                    var quantityItem = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    });

                    var skuItem = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'item',
                        line: i
                    });

                    var lookupItem = search.lookupFields({
                        type: search.Type.INVENTORY_ITEM,
                        id: skuItem,
                        columns: ['upccode']
                    });
                    log.audit('lookupItem', lookupItem);

                    var lookupKit = search.lookupFields({
                        type: search.Type.KIT_ITEM,
                        id: skuItem,
                        columns: ['upccode']
                    });
                    log.audit('lookupKit', lookupKit);

                    var kitName = lookupKit.upccode;

                    //todo obtencion y validacion de lotes al guardar una transaccion
                    var Lote = currenRecord.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'inventorydetailavail',
                        line: i
                    });
                    log.audit('isLote', Lote);

                    if (Lote == "T") {

                        var idLote = currenRecord.getSublistSubrecord({
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
                                fieldId: 'receiptinventorynumber',
                                line: a
                            }) || '';

                            log.audit('inventoryNum', inventoryNum);
                        }
                    }
                    //

                    var itemName = lookupItem.upccode;
                    if (!orderDetails[idItem]) {
                        orderDetails = {
                            orderedQuantity: quantityItem,
                            lot: Lote == "T" ? inventoryNum : '',
                            product: {
                                sku: itemName ? itemName : kitName
                            }
                        }
                    }
                    if (quantityItem > 0) {
                        receiptOrderDetailsArray.push(orderDetails);
                    }
                }

                var tEnvio = currenRecord.getValue({
                    fieldId: 'custbody_drt_accion_envia_wms'
                });

                var metodoEnvio = '';
                var codigoSalida = '';
                var respuestaSalida = '';

                log.audit('tEnvio', tEnvio);

                objreceiptOreder.receiptOrderDetails = receiptOrderDetailsArray;
                log.audit('objreceiptOreder', objreceiptOreder);

                if (tEnvio == 2) {
                    metodoEnvio = 'put'
                } else {
                    metodoEnvio = 'post'
                }

                if (
                    envWms &&
                    (
                        ubicacionValida == 4 ||
                        ubicacionValida == 1
                    ) &&
                    (
                        tipoNC == 1 ||
                        tipoNC == 10 ||
                        tipoNC == 9 ||
                        tipoNC == 13
                    )
                ) {
                    response = https.post({
                        url: urlEnvio,
                        body: JSON.stringify(objreceiptOreder),
                        headers: headerObj
                    }) || {
                        body: {},
                        code: 0,
                    };

                    log.audit('response', response);
                    log.audit('response body', response.body);
                    log.audit('response code', response.code);

                    if (response.code == 500) {
                        var respuesta1 = JSON.parse(response.body);
                    }

                    if (response.code == 200) {
                        codigoSalida = 1;
                        respuestaSalida = response.body;
                        log.audit('0', respuestaSalida);
                    } else {
                        codigoSalida = 2
                        respuestaSalida = respuesta1.message;
                        log.audit('1', respuestaSalida);
                    }

                    record.submitFields({
                        type: recType,
                        id: recId,
                        values: {
                            custbody_drt_response_wms: response.code,
                            custbody_disa_responce_body: respuestaSalida
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                    var objReturnA = {
                        custrecord_drt_wep_output_json: JSON.stringify(objreceiptOreder),
                        custrecord_drt_wep_output_metodo: 1,
                        custrecord_drt_wep_output_name: 6,
                        custrecord_drt_disa_transaccion: recId,
                        custrecord1: 9,
                        custrecord_drt_disa_status_code: codigoSalida,
                        custrecord_drt_disa_responser_body: response.body,
                        custrecord_drt_disa_url: urlEnvio
                    }

                    var saveRetrurnA = drt_wep_save_record_lib.saveRequest(objReturnA);
                    log.audit('objReturnA', objReturnA);

                    if (saveRetrurnA.success) {
                        respuesta.data.push(saveRetrurnA);
                        log.audit('OK', 'Se guardo el registro');
                    }

                    redirect.toRecord({
                        type: recType,
                        id: recId,
                        parameters: {
                            'wms': response.code
                        }
                    });

                } else {
                    log.audit('Error', 'no tienes permiso para enviar esta transaccion a wms y el tipo de nota de credito no corresponde.');
                }

            } catch (error) {
                log.audit('error', error);
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