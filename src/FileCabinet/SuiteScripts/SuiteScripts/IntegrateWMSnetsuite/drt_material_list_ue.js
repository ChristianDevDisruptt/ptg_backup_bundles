/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(
    [
        './drt_wep_save_record_lib',
        'N/runtime',
        'N/search',
        'N/record',
        'N/https',
        'N/redirect'
    ],
    function
    (
        lib,
        runtime,
        search,
        record,
        https,
        redirect
    ) {

    function beforeLoad(context) {
        try {
            log.audit({
                title: 'context.type',
                details: JSON.stringify(context.type)
            });
            if (context.type == context.UserEventType.VIEW) {
                if (
                    context.newRecord.type == record.Type.KIT_ITEM
                ) {
                    var msgField = context.form.addField({
                        id: 'custpage_drt_message',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var currentRecord = context.newRecord;

                    var status = currentRecord.getValue({
                        fieldId: 'custitem_drt_respuesta_wms'
                    });

                    var param_message = '';

                    if (
                        status == 200
                    ) {
                        param_message = "Se envio con exito su Kit a wms"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Creacion " + param_message + "', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else {
                        param_message = "No se pudo enviar el kit a wms ya que contiene errores, revice los campos a wms"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'ERROR " + param_message + "', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                }

            }
        } catch (error) {
            log.error({
                title: 'error beforeSubmit',
                details: JSON.stringify(error)
            });
        }
    }

    function afterSubmit(context) {
        try {

            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                var tipoTransaccion = 'material_list';
                var instancia = runtime.envType;
                var url = lib.changeUrl(tipoTransaccion,instancia);
                var currentRecord = context.newRecord;
                var itemType = currentRecord.type;
                var itemId = currentRecord.id;

                var response = {
                    body: {},
                    code: 0,
                };
                var objMaterialListInterface = {};
                var metodoEnvio = '';
                var BuildToOrder = currentRecord.getValue({
                    fieldId: 'custitem_disa_build_order'
                });

                var envioWms = currentRecord.getValue({
                    fieldId: 'custitem_disa_send_interface'
                });

                var skuMaterialList = currentRecord.getValue({
                    fieldId: 'upccode'
                });

                var wareHouseCode = currentRecord.getValue({
                    fieldId: 'custitem_disa_warehose_code'
                });

                var accountName = currentRecord.getValue({
                    fieldId: 'custitem_disa_account_name'
                });

                var skuAsociado = currentRecord.getValue({
                    fieldId: 'itemid'
                });

                var numLines = currentRecord.getLineCount({
                    sublistId: 'member'
                });

                var materialArray = [];
                var materialtObj = {};
                var headerObj = {
                    'Content-Type': 'application/json',
                };

                for (var i = 0; i < numLines; i++) {

                    var item = currentRecord.getSublistValue({
                        sublistId: 'member',
                        fieldId: 'item',
                        line: i
                    });

                    var orderQuantity = currentRecord.getSublistValue({
                        sublistId: 'member',
                        fieldId: 'quantity',
                        line: i
                    });

                    var lookupItem = search.lookupFields({
                        //type: search.Type.LOT_NUMBERED_INVENTORY_ITEM,
                        type: search.Type.INVENTORY_ITEM,
                        id: item,
                        columns: ['upccode']
                    });

                    log.audit('lookupItem', lookupItem);

                    var itemName = lookupItem.upccode;

                    log.audit('itemName', itemName);

                    if (!materialtObj[item]) {
                        materialtObj = {
                            component: {
                                sku: itemName
                            },
                            quantity: orderQuantity,
                            isBuildToOrder: true,
                            progression: {
                                name: 'General'
                            }
                        }
                    }
                    materialArray.push(materialtObj);
                }

                var tEmvio = currentRecord.getValue({
                    fieldId: 'custitem_drt_update_in_wms'
                });
                log.audit('numLines', numLines);
                objMaterialListInterface.sku = skuMaterialList;
                objMaterialListInterface.warehouse = {};
                objMaterialListInterface.warehouse.code = wareHouseCode;
                objMaterialListInterface.account = {};
                objMaterialListInterface.account.name = accountName;
                objMaterialListInterface.components = materialArray;

                log.audit('objMaterialListInterface', objMaterialListInterface)

                if (envioWms) {

                    if (tEmvio) {
                        metodoEnvio = 'put'
                    } else {
                        metodoEnvio = 'post'
                    }
                    try {
                        response = https[metodoEnvio]({
                            url: url,
                            body: JSON.stringify(objMaterialListInterface),
                            headers: headerObj
                        });

                        log.audit('response material lisst', response);
                        log.audit('response code material', response.code);
                        log.audit('response body material', response.body);
                    } catch (error) {
                        log.audit('error envio', error);
                    }
                }

                var salidaRespuesta = '';
                if(response.code == 500){
                    var tranasform = JSON.parse(response.body);
                    salidaRespuesta = tranasform.message
                    log.audit('1',salidaRespuesta);
                } else {
                    salidaRespuesta = 'ok'
                }

                record.submitFields({
                    type: itemType,
                    id: itemId,
                    values: {
                        custitem_drt_respuesta_wms: response.code,
                        custitem_disa_drt_esponse_product: salidaRespuesta
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });


                if (response.code == 200) {
                    record.submitFields({
                        type: itemType,
                        id: itemId,
                        values: {
                            custitem_drt_update_in_wms: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }

                redirect.toRecord({
                    type: itemType,
                    id: itemId,
                    parameters: {
                        'wms': response.code
                    }
                });
            }

        } catch (error) {
            log.audit('error Material List', error)
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});