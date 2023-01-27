/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript

 */
define(['./drt_wep_save_record_lib', 'N/search', 'N/record', 'N/https', 'N/runtime', 'N/redirect'], function (drt_wep_save_record_lib, search, record, https, runtime, redirect) {

    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                var currentRecord = context.newRecord;
                var recType = context.type;
                var recId = currentRecord.id;
                var respuesta = {
                    success: false,
                    data: [],
                    error: []
                };
                var response = {
                    body: {},
                    code: 0,
                };

                var idCustomer = currentRecord.getValue({
                    fieldId: 'id'
                });

                var lookupCustomer = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: idCustomer,
                    columns: ['entityid']
                });

                log.audit('lookupCustomer', lookupCustomer);

                var idCliente = lookupCustomer.entityid;

                var companyName = currentRecord.getValue({
                    fieldId: 'companyname'
                });

                var name = currentRecord.getValue({
                    fieldId: 'firstname'
                }) + ' ' + currentRecord.getValue({
                    fieldId: 'middlename'
                }) + ' ' + currentRecord.getValue({
                    fieldId: 'lastname'
                });

                var isPerson = currentRecord.getValue({
                    fieldId: 'isperson'
                });

                var des = '';

                if (isPerson == 'T') {
                    des = name;
                } else {
                    des = companyName;
                }
                var idInstance = runtime.envType;
                var interfas = 'wep_cliente';
                var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);
                log.audit('urlEnvio', urlEnvio);

                var objtcustomerIntraface = {};

                objtcustomerIntraface.reservationPriority = currentRecord.getValue({
                    fieldId: 'custentity_disa_reservation_priority'
                }) || '';

                objtcustomerIntraface.isPartial = currentRecord.getValue({
                    fieldId: 'custentity_disa_is_partial'
                }) ? 1 : 0;

                objtcustomerIntraface.name = idCliente;

                objtcustomerIntraface.description = des;

                objtcustomerIntraface.inventoryRotation = {};

                objtcustomerIntraface.inventoryRotation.name = currentRecord.getValue({
                    fieldId: 'custentity_disa_inventory_rotation_name'
                });

                objtcustomerIntraface.warehouse = {};

                objtcustomerIntraface.warehouse.code = currentRecord.getValue({
                    fieldId: 'custentity_disa_warehose'
                });

                objtcustomerIntraface.account = {};

                objtcustomerIntraface.account.name = currentRecord.getValue({
                    fieldId: 'custentity_disa_account_name'
                });

                objtcustomerIntraface.shippingType = {};

                objtcustomerIntraface.shippingType.name = currentRecord.getValue({
                    fieldId: 'custentity_disa_shipping_type'
                });

                objtcustomerIntraface.address = {};

                objtcustomerIntraface.address.nameAddress = 'CG000';

                objtcustomerIntraface.customerGroup = {};
                objtcustomerIntraface.customerGroup.name = "Grupo principal";
                objtcustomerIntraface.customerGroup.name = "Grupo default";

                var sendWms = currentRecord.getValue({
                    fieldId: 'custentity_drt_disa_send_wep'
                });

                var updateWms = currentRecord.getValue({
                    fieldId: 'custentity_drt_disa_apdate_wep'
                });

                var metodoEnvio = '';
                var nombreInterface = 'Customer-Interface';
                var metodo = '';
                var codigo = '';


                log.audit('objtcustomerIntraface', objtcustomerIntraface);

                var loadRecord = record.create({
                    type: 'customrecord_drt_web_otutput_netsuite',
                    isDynamic: true
                });

                var headerObj = {
                    'Content-Type': 'application/json',
                };

                if (sendWms) {

                    if (updateWms) {
                        metodoEnvio = 'put';
                        metodo = 2;
                    } else {
                        metodoEnvio = 'post';
                        metodo = 1;
                    }

                    log.audit('metodoEnvio', metodoEnvio);

                    try {
                        response = https[metodoEnvio]({
                            url: urlEnvio,
                            body: JSON.stringify(objtcustomerIntraface),
                            headers: headerObj
                        }) || {
                            body: {},
                            code: 0,
                        };

                        log.audit('response', response);
                        log.audit('response code', response.code);
                        log.audit('response body', response.body);

                    } catch (error) {
                        log.audit('error responce', error);
                    }

                    var respuestaWms = JSON.parse(response.body);
                    log.audit('respuestaWms', respuestaWms);
                    var salidaProcesada = '';

                    if (response.code == 200) {
                        salidaProcesada = 'OK'
                    } else if (response.code == 500) {
                        salidaProcesada = respuestaWms.message
                    }

                    record.submitFields({
                        type: recType,
                        id: recId,
                        values: {
                            custentity_drt_response_wms: response.code,
                            custentity_drt_disa_response_wep: salidaProcesada
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });

                    if (response.code == 200) {
                        codigo = 1;
                        record.submitFields({
                            type: recType,
                            id: recId,
                            values: {
                                custentity_drt_disa_apdate_wep: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    } else if (response.code == 500) {
                        codigo = 2;
                    }
                }
				if(response.code == 200 || response.code == 500){
                   
                   
                var objSalesOrder = {
                    custrecord_drt_wep_output_json: JSON.stringify(objtcustomerIntraface),
                    custrecord_drt_wep_output_metodo: metodo,
                    custrecord_drt_wep_output_name: 4,
                    custrecorddrt_customer_id: recId,
                    custrecord1: 1,
                    custrecord_drt_disa_status_code: codigo,
                    custrecord_drt_disa_responser_body: response.body,
                    custrecord_drt_disa_url: urlEnvio
                }

                var saveProveedor = drt_wep_save_record_lib.saveRequest(objSalesOrder);
                log.audit('dd', objSalesOrder);

                if (saveProveedor.success) {
                    respuesta.data.push(saveProveedor);
                    log.audit('OK', 'Se guardo el registro');
                }

                redirect.toRecord({
                    type: recType,
                    id: recId,
                    parameters: {
                        'wms': response.code
                    }
                });
            }

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
        afterSubmit: afterSubmit
    }
});