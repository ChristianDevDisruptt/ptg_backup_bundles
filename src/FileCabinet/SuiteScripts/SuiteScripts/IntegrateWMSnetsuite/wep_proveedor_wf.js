/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript
 */
define(['./drt_wep_save_record_lib', 'N/search', 'N/record', 'N/https','N/runtime', 'N/redirect'], function (drt_wep_save_record_lib, search, record, https, runtime, redirect) {
    function onAction(scriptContext) {
        try {
            var record_context = scriptContext.newRecord;
            var recType = record_context.type;
            var recId = record_context.id;

            var customerRecord = record.load({
                type: recType,
                id: recId,
                isDynamic: true
            });

            var response = {
                body: {},
                code: 0,
            };

            var objFiles = {};

            log.audit('customerRecord', customerRecord);

            var idVendor = customerRecord.getValue({
                fieldId: 'id'
            });

            var lookupVendor = search.lookupFields({
                type: record.Type.VENDOR,
                id: idVendor,
                columns: ['entityId']
            });

            log.audit('lookupVendor', lookupVendor);

            var idProveedor = lookupVendor.entityId;
            log.audit('idProveedor', idProveedor);

            //todo falta revisar y ver que nos devuelve

            var companyName = customerRecord.getValue({
                fieldId: 'companyname'
            });

            var name = customerRecord.getValue({
                fieldId: 'firstname'
            }) + ' ' + customerRecord.getValue({
                fieldId: 'lastname'
            });

            var isPerson = customerRecord.getValue({
                fieldId: 'isperson'
            });

            var mostrarNombre = '';

            if (isPerson == 'T') {
                mostrarNombre = companyName;
            } else {
                mostrarNombre = companyName;
            }

            var accountName = customerRecord.getValue({
                fieldId: 'custentity_disa_account_name'
            });

            var disaNameAddress = customerRecord.getValue({
                fieldId: 'custentity_disa_name_address'
            });

            var tipoProveedor = customerRecord.getValue({
                fieldId: 'custentity_disa_categoria_proveedor'
            });
            log.audit('tipoProveedor', tipoProveedor);

            var objVendor = {};

            objVendor.code = idProveedor;
            objVendor.name = mostrarNombre;
            objVendor.address = {};
            objVendor.address.nameAddress = disaNameAddress;
            objVendor.account = {};
            objVendor.account.name = accountName;
            var metodoEnvio = '';

            var envioWms = customerRecord.getValue({
                fieldId: 'custentity_drt_send_wep'
            });

            var updateWms = customerRecord.getValue({
                fieldId: 'custentity_drt_update_wms'
            });

            var headerObj = {
                'Content-Type': 'application/json',
            };

            log.audit('envioWms', envioWms);
            log.audit('objVendor', objVendor);

            var metodo = '';
            var codigo = '';
            var idInstance = runtime.envType;
            var interfas = 'wep_proveedor';
            log.audit('idInstance', idInstance);
            var urlEnvio = drt_wep_save_record_lib.changeUrl(interfas, idInstance);

            if (envioWms) {

                if (updateWms) {
                    metodoEnvio = 'put';
                    metodo = 2
                } else {
                    metodoEnvio = 'post';
                    metodo = 1;
                }

                log.audit('metodoEnvio', metodoEnvio);
                if (tipoProveedor == 12 || tipoProveedor == 14 || tipoProveedor == 1) {

                    try {
                        response = https[metodoEnvio]({
                            url: urlEnvio,
                            body: JSON.stringify(objVendor),
                            headers: headerObj
                        });

                        log.audit('response', response);
                        log.audit('response body', response.body);
                        log.audit('response code', response.code);

                    } catch (error) {
                        log.audit('error response', error);
                    }
                }

                

                if (response.code == 200) {
                    codigo = 1;
                    objFiles.custentity_drt_update_wms = true
                    
                } else if (response.code == 500) {
                    codigo = 2;
                }

                var objetoProveedor = {
                    custrecord_drt_wep_output_json: JSON.stringify(objVendor),
                    custrecord_drt_wep_output_metodo: metodo,
                    custrecord_drt_wep_output_name: 5,
                    custrecord_drt_vendor_id: recId,
                    custrecord1: 2,
                    custrecord_drt_disa_status_code: codigo,
                    custrecord_drt_disa_responser_body: response.body,
                    custrecord_drt_disa_url: urlEnvio
                }
				
                var saveProveedor = drt_wep_save_record_lib.saveRequest(objetoProveedor);
                log.audit('dd', objetoProveedor );
                if (saveProveedor.success) {
                    log.audit('OK', 'Se guardo el registro');
                }

                objFiles.custentity_drt_response_wms = response.code;
                objFiles.custentity_disa_response_body = response.body;
              	
              	record.submitFields({
                    type: recType,
                    id: recId,
                    values: objFiles,
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
            }
        } catch (error) {
            log.audit('error', error);
        } finally {
            log.audit('exito', 'uno');
            return 1;
        }
    }
    return {
        onAction: onAction
    }
});