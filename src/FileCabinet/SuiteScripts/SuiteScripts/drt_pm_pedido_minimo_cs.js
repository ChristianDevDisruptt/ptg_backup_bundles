/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
    'N/ui/message',
    'N/ui/dialog',
    'N/record',
    'N/url'
], function (
    message,
    dialog,
    record,
    url
) {
    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var line = context.line;
            var recordType = record.Type.SALES_ORDER;
            var recordId = currentRecord.getValue({
                fieldId: 'id'
            }) || '';
            var orderstatus = currentRecord.getValue({
                fieldId: 'orderstatus'
            }) || '';
            if (
                !sublistName &&
                sublistFieldName === 'custbody_drt_pm_aprob_pedido_minimo' &&
                orderstatus == 'B'
            ) {
                log.audit({
                    title: 'recordType',
                    details: JSON.stringify(recordType)
                });
                log.audit({
                    title: 'recordId',
                    details: JSON.stringify(recordId)
                });

                var aprob_pedido_minimo = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_aprob_pedido_minimo'
                }) || '';

                var pedidominimo = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_impz_pedidominimo'
                }) || '';

                var cliente_paga_flet = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_impz_cliente_paga_flet'
                }) || '';

                var paqueteria = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_impz_paqueteria'
                });

                var total_pedido_minimo = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_total_pedido_minimo'
                }) || '';

                var total_pedido_minimo_transacction = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_ap_total_pedido_minimo'
                }) || '';

                var montominimo = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_impz_montominimo'
                }) || '';
                var monto_flete = currentRecord.getValue({
                    fieldId: 'custbody_drt_pm_impz_monto_flete'
                }) || '';

                debugger;



                var objSubmit = {};



                /* 
                1	Pedido Minimo
                2	Cliente Paga Flete
                3	Paquetería
                */
                switch (aprob_pedido_minimo) {
                    case '1':
                        if (
                            total_pedido_minimo_transacction &&
                            montominimo &&
                            total_pedido_minimo_transacction >= montominimo
                        ) {
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                            objSubmit.custbody_drt_pm_tipo_pedido_minimo = 1;
                            objSubmit.custbody_drt_pm_aprob_pedido_minimo = 1;
                            objSubmit.orderstatus = 'B';
                        } else {
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                            objSubmit.orderstatus = 'A';
                            objSubmit.custbody_drt_pm_tipo_pedido_minimo = 4;
                            objSubmit.custbody_drt_pm_aprob_pedido_minimo = '';
                            /* 
                            currentRecord.setValue({
                                fieldId: 'custbody_drt_pm_aprob_pedido_minimo',
                                value: ''
                            }); */
                        }
                        objSubmit.custbody_drt_pm_total_pedido_minimo = total_pedido_minimo_transacction;
                        break;
                    case '2':
                        if (
                            total_pedido_minimo_transacction &&
                            monto_flete &&
                            total_pedido_minimo_transacction >= monto_flete
                        ) {
                            objSubmit.custbody_drt_pm_tipo_pedido_minimo = 2;
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                            objSubmit.custbody_drt_pm_aprob_pedido_minimo = 2;
                            objSubmit.orderstatus = 'B';
                        } else {
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                            objSubmit.orderstatus = 'A';
                            objSubmit.custbody_drt_pm_tipo_pedido_minimo = 5;
                            objSubmit.custbody_drt_pm_aprob_pedido_minimo = '';
                        }
                        objSubmit.custbody_drt_pm_total_pedido_minimo = total_pedido_minimo_transacction;
                        break;
                    case '3':
                        if (
                            paqueteria &&
                            total_pedido_minimo
                        ) {
                            objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                            objSubmit.custbody_drt_pm_tipo_pedido_minimo = 3;
                            objSubmit.custbody_drt_pm_aprob_pedido_minimo = 3;
                            objSubmit.custbody_drt_pm_total_pedido_minimo = total_pedido_minimo;
                            objSubmit.orderstatus = 'B';
                        }
                        break;

                    default:
                        break;
                }
                if (
                    Object.keys(objSubmit).length > 0 &&
                    recordType &&
                    recordId
                ) {
                    var id = record.submitFields({
                        type: recordType,
                        id: recordId,
                        values: objSubmit,
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    }) || '';
                    if (id) {
                        var recordURL = url.resolveRecord({
                            recordType: recordType,
                            recordId: recordId,
                            isEditMode: false,
                            params: {}
                        });

                        window.location = recordURL;
                    } else {
                        showmessage({
                                title: "Error",
                                message: "La transaccion no fue aprobada",
                                cause: 'cause',
                                type: message.Type.ERROR
                            },
                            5000,
                            true
                        );

                    }
                }

            }
        } catch (error) {
            log.error({
                title: 'error fieldChanged',
                details: JSON.stringify(error)
            });
        }
    }

    function showmessage(param_message, param_duration, param_show) {
        try {
            if (param_show) {
                var m = {
                    title: "My Title",
                    message: "My Message",
                    cause: 'cause',
                    type: message.Type.CONFIRMATION
                };
                var myMsg = message.create(param_message);

                myMsg.show({
                    duration: param_duration
                });
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options);
            }

        } catch (error) {
            log.error({
                title: 'error showmessage',
                details: JSON.stringify(error)
            });
        }
    }

    function aprobacion_minimo(param_data) {
        try {
            var respuesta = {
                success: false,
                data: {},
                error: []
            };
            log.audit({
                title: 'aprobacion_minimo',
                details: JSON.stringify(param_data)
            });
            var objSubmit = {};
            if (
                param_data.total &&
                param_data.monto &&
                param_data.total >= param_data.monto
            ) {
                objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                objSubmit.custbody_drt_pm_tipo_pedido_minimo = 1;
            } else {
                objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                objSubmit.orderstatus = 'A';
                objSubmit.custbody_drt_pm_tipo_pedido_minimo = 4;

            }

            if (
                Object.keys(objSubmit).length > 0 &&
                param_data.custparam_ed_tranid &&
                param_data.custparam_ed_trantype
            ) {
                var id = record.submitFields({
                    id: param_data.custparam_ed_tranid,
                    type: param_data.custparam_ed_trantype,
                    values: objSubmit,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                }) || '';
                if (id) {
                    var recordURL = url.resolveRecord({
                        recordType: param_data.custparam_ed_trantype,
                        recordId: param_data.custparam_ed_tranid,
                        isEditMode: false,
                        params: {}
                    });

                    window.location = recordURL;
                } else {
                    showmessage({
                            title: "Error",
                            message: "La transaccion no fue aprobada",
                            cause: 'cause',
                            type: message.Type.ERROR
                        },
                        5000,
                        true
                    );

                }
            }
            respuesta.success = Object.keys(respuesta.data).length > 0;
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error aprobacion_minimo',
                details: JSON.stringify(error)
            });

        } finally {
            log.emergency({
                title: 'respuesta aprobacion_minimo',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function aprobacion_flete(param_data) {
        try {
            var respuesta = {
                success: false,
                data: {},
                error: []
            };
            log.audit({
                title: 'aprobacion_flete',
                details: JSON.stringify(param_data)
            });
            var objSubmit = {};
            if (
                param_data.total &&
                param_data.monto &&
                param_data.total >= param_data.monto
            ) {
                objSubmit.custbody_drt_pm_tipo_pedido_minimo = 2;
                objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
            } else {
                objSubmit.custbody_drt_pm_pedido_minimo_valido = false;
                objSubmit.orderstatus = 'A';
                objSubmit.custbody_drt_pm_tipo_pedido_minimo = 5;
                showmessage({
                        title: "Aprobacion Flete",
                        message: "La transaccion no fue aprobada monto de la transaccion: " + param_data.total + " Monto minimo: " + param_data.monto,
                        type: message.Type.ERROR
                    },
                    5000,
                    true
                );
            }

            if (
                Object.keys(objSubmit).length > 0 &&
                param_data.custparam_ed_tranid &&
                param_data.custparam_ed_trantype
            ) {
                var id = record.submitFields({
                    id: param_data.custparam_ed_tranid,
                    type: param_data.custparam_ed_trantype,
                    values: objSubmit,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                }) || '';
                if (id) {
                    var recordURL = url.resolveRecord({
                        recordType: param_data.custparam_ed_trantype,
                        recordId: param_data.custparam_ed_tranid,
                        isEditMode: false,
                        params: {}
                    });

                    window.location = recordURL;
                } else {
                    showmessage({
                            title: "Error",
                            message: "La transaccion no fue aprobada",
                            cause: 'cause',
                            type: message.Type.ERROR
                        },
                        5000,
                        true
                    );

                }
            }
            respuesta.success = Object.keys(respuesta.data).length > 0;
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error aprobacion_flete',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta aprobacion_flete',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function aprobacion_paqueteria(param_data) {
        try {
            var respuesta = {
                success: false,
                data: {},
                error: []
            };
            log.audit({
                title: 'aprobacion_paqueteria',
                details: JSON.stringify(param_data)
            });
            var objSubmit = {};
            if (
                true
            ) {
                objSubmit.custbody_drt_pm_pedido_minimo_valido = true;
                objSubmit.custbody_drt_pm_tipo_pedido_minimo = 3;
                var recordURL = url.resolveRecord({
                    recordType: param_data.custparam_ed_trantype,
                    recordId: param_data.custparam_ed_tranid,
                    isEditMode: false,
                    params: {
                        e: 'T',
                        custbody_drt_pm_total_pedido_minimo: 0
                    }
                });

                window.location = recordURL;
            }

            if (
                Object.keys(objSubmit).length > 0 &&
                param_data.custparam_ed_tranid &&
                param_data.custparam_ed_trantype
            ) {
                var id = record.submitFields({
                    id: param_data.custparam_ed_tranid,
                    type: param_data.custparam_ed_trantype,
                    values: objSubmit,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                }) || '';
                if (id) {
                    var recordURL = url.resolveRecord({
                        recordType: param_data.custparam_ed_trantype,
                        recordId: param_data.custparam_ed_tranid,
                        isEditMode: false,
                        params: {}
                    });

                    window.location = recordURL;
                } else {
                    showmessage({
                            title: "Error",
                            message: "La transaccion no fue aprobada",
                            cause: 'cause',
                            type: message.Type.ERROR
                        },
                        5000,
                        true
                    );

                }
            }
            respuesta.success = Object.keys(respuesta.data).length > 0;
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error aprobacion_paqueteria',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta aprobacion_paqueteria',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function pageInit(context) {

    }

    function postSourcing(context) {
        try {
            debugger
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var line = context.line;
            if (
                sublistName === 'item' &&
                sublistFieldName === 'item'
            ) {
                if (
                    currentRecord.getValue({
                        fieldId: 'location'
                    })
                ) {

                    currentRecord.setCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'inventorylocation',
                        value: currentRecord.getValue({
                            fieldId: 'location'
                        })
                    });
                    currentRecord.setCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'location',
                        value: currentRecord.getValue({
                            fieldId: 'location'
                        })
                    });
                }
            }
        } catch (error) {
            log.audit({
                title: 'postSourcing',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        // fieldChanged: fieldChanged,
        postSourcing: postSourcing,
        aprobacion_minimo: aprobacion_minimo,
        aprobacion_flete: aprobacion_flete,
        aprobacion_paqueteria: aprobacion_paqueteria
    }
});