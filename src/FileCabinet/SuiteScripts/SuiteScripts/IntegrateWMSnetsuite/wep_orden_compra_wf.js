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
    function 
    (
        drt_wep_save_record_lib,
        record,
        https,
        search,
        runtime,
        redirect
    ) {

        function onAction(scriptContext) {
            try {
                log.emergency('context', scriptContext.type)
                var recType = scriptContext.newRecord.type;
                var recId = scriptContext.newRecord.id;
                var response = {
                    body: {},
                    code: 0,
                };

                var respuesta = {
                    success: false,
                    data: [],
                    error: []
                };

              	log.audit('Fecha Actual y hora: ', new Date());
              
                var currenRecord = record.load({
                    type: recType,
                    id: recId,
                    isDynamic: false,
                });
                //se crean variables para el cambio de url
                var idInstance = runtime.envType;
                var interfas = 'wep_orden_compra';
                log.audit('idInstance', idInstance);
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('urlEnvio', urlEnvio);
                var headerObj = {
                    'Content-Type': 'application/json',
                };

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
                    columns: ['custrecord_drt_parent']
                });

                log.audit('lookupLocation', lookupLocation);

                var parentLocation = lookupLocation.custrecord_drt_parent;

                log.audit({
                    title: 'parentLocation',
                    details: parentLocation
                });

                var nameSupplier = currenRecord.getValue({
                    fieldId: 'entity'
                });

				var lookupField = search.lookupFields({
                    type: record.Type.VENDOR,
                    id: nameSupplier,
                    columns: ['companyname','firstname', 'middlename', 'lastname']
                });

                log.audit('lookupField', lookupField);

                log.audit('lookupField',lookupField);

                var provedor = lookupField.companyname;
                /*
                var nombre2 = lookupField.firstname + ' ' + lookupField.middlename + ' ' + lookupField.lastname;

                var isPerson = currenRecord.getValue({
                    fieldId: 'isperson'
                });

                var provedor = '';
                
                if(isPerson == 'T'){
                    provedor = lookupField.firstname + ' ' + lookupField.middlename + ' ' + lookupField.lastname;;
                    log.audit('provedor2',provedor);
                } else {
                    provedor = nombr1;
                    log.audit('provedor3',provedor);
                }
                */
              
                var expirationDate = currenRecord.getValue({
                    fieldId: 'custbody_drt_date_expiration'
                });

                expirationDate.setDate(expirationDate.getDate() + 180);

                log.audit('expirationDate', expirationDate);

                var date = new Date();
                
                log.audit('Fecha Actual y hora Original: ', date);
               
                date.setDate(date.getDate() + 180);
              
                log.audit('Fecha Actual y hora +180: ', date);

                var formatDate = date.toISOString().slice(0, 10);

                var lines = currenRecord.getLineCount({
                    sublistId: 'item'
                });
                var receiptOrderDetailsArray = [];
                var orderDetails = {};

                objreceiptOreder.orderNumber = referenceOrder;
                objreceiptOreder.expirationDay = formatDate;
                objreceiptOreder.account = {};
                objreceiptOreder.account.name = accountName;
                objreceiptOreder.warehouse = {};
                objreceiptOreder.warehouse.code = wareHouseCode;
                objreceiptOreder.orderType = {};
                objreceiptOreder.orderType.name = orderTypeName;
                objreceiptOreder.supplier = {};
                objreceiptOreder.supplier.name = provedor;

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
                        columns: ['upccode', 'custitem_disa_lote']
                    });
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

                    var itemName = lookupItem.upccode;

                    if (!orderDetails[idItem]) {
                        orderDetails = {
                            orderedQuantity: quantityItem,
                            lot: Lote == "T" ? inventoryNum : '',
                            product: {
                                sku: itemName
                            }
                        }
                    }
                    if (quantityItem > 0) {
                        receiptOrderDetailsArray.push(orderDetails);
                    }
                }

                var metodoEnvio = '';

                objreceiptOreder.receiptOrderDetails = receiptOrderDetailsArray;
                log.audit('objreceiptOreder', objreceiptOreder);

                var respuesta = '';
                var metodo = '';
                var codigo = '';
                var nombreinterfas = 7;
                
                log.audit('envWms', envWms);

                if (envWms) {
                    response = https.post({
                        url: urlEnvio,
                        body: JSON.stringify(objreceiptOreder),
                        headers: headerObj
                    });

                    log.audit('response', response);
                    log.audit('response body', response.body);
                    log.audit('response code', response.code);

                    var responseBody = JSON.parse(response.body);
                    log.audit('responseBody', responseBody);

                    if (response.code == 200) {
                        respuesta = responseBody.orderNumber;
                        log.audit('responseSalida', respuesta);
                        codigo = 1;
                    } else if (response.code != 200) {
                        respuesta = responseBody.message;
                        log.audit('responseSalida', respuesta);
                        codigo = 2;
                    }
                }

                //Guardado de transaccion en custom record

                var objOrdenCompra = {
                    custrecord_drt_wep_output_json: JSON.stringify(objreceiptOreder),
                    custrecord_drt_wep_output_metodo: 1,
                    custrecord_drt_wep_output_name: 6,
                    custrecord_drt_disa_transaccion: recId,
                    custrecord1: 7,
                    custrecord_drt_disa_status_code: codigo,
                    custrecord_drt_disa_responser_body: response.body,
                    custrecord_drt_disa_url: urlEnvio
                }

                var saveOrdenCompra = drt_wep_save_record_lib.saveRequest(objOrdenCompra);
                log.audit('respuesta creacion', objOrdenCompra);

                if (saveOrdenCompra.success) {
                    log.audit('OK', 'Se guardo el registro');
                }
              	
              	record.submitFields({
                        type: record.Type.PURCHASE_ORDER,
                        id: idPo,
                        values: {
                            custbody_drt_response_wms: response.code,
                            custbody_disa_responce_body: respuesta
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                redirect.toRecord({
                    type: recType,
                    id: recId,
                    parameters: {
                        'wms': response.code
                    }
                });

            } catch (error) {
                log.audit('error PO', error);
            } finally {
                log.audit({
                    title: 'response salida',
                    details: JSON.stringify(response)
                });
                return response.code;
            }
        }

        return {
            onAction: onAction
        }
    });