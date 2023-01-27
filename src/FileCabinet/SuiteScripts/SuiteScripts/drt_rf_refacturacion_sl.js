/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */
define([
    'N/redirect',
    'N/search',
    'N/record',
    'N/ui/serverWidget'
], function (
    redirect,
    search,
    record,
    serverWidget
) {
    var arrayClr = [
        'custbody_edoc_generated_pdf',
        'custbody_psg_ei_generated_edoc',
        'custbody_psg_ei_certified_edoc',
        'custbody_mx_cfdi_uuid',
        'custbody_drt_crt_verificacion_cancel',
    ];

    function onRequest(context) {
        try {
            log.audit({
                title: 'context: ' + context.request.method,
                details: JSON.stringify(context)
            });
            if (context.request.method === 'GET') {
                var form = serverWidget.createForm({
                    title: 'DRT RF - Refacturacion'
                });
                form.addFieldGroup({
                    id: 'fieldgroup_in',
                    label: 'Transaccion de entrada'
                });
                form.addFieldGroup({
                    id: 'fieldgroup_out',
                    label: 'Transaccion de salida'
                });

                var field_add = form.addField({
                    id: 'custpage_parameters',
                    type: serverWidget.FieldType.TEXTAREA,
                    label: 'Parametros'
                }).updateDisplayType({
                    displayType: "HIDDEN"
                    // displayType: "NORMAL"
                }).defaultValue = JSON.stringify(context.request.parameters);
                var status = '';
                if (
                    context.request.parameters.param_id &&
                    context.request.parameters.param_type &&
                    context.request.parameters.param_type == record.Type.INVOICE
                ) {
                    var columns = [
                        'custbody_mx_cfdi_uuid',
                        'customer.custentity_mx_rfc',
                        'status',
                        'custbody_psg_ei_status',
                        'custbody_mx_cfdi_certify_timestamp',
                        'custbody_psg_ei_certified_edoc',
                        'custbody_psg_ei_generated_edoc',
                        'custbody_crt_sol_cancel',
                        'custbody_edoc_generated_pdf',
                        'custbody_mx_cfdi_usage',
                        'custbody_mx_txn_sat_payment_term',
                        'custbody_mx_txn_sat_payment_method',
                    ];
                    var invoiceData = search.lookupFields({
                        // type: record.Type.INVOICE,
                        type: search.Type.TRANSACTION,
                        id: context.request.parameters.param_id,
                        columns: columns
                    }) || '';
                    log.audit({
                        title: 'invoiceData',
                        details: JSON.stringify(invoiceData)
                    });



                    if (
                        invoiceData.status &&
                        invoiceData.status[0] &&
                        invoiceData.status[0].value
                    ) {
                        status = invoiceData.status[0].value;
                    }
                    switch (context.request.parameters.param_mode) {
                        case "transaction":
                            if (
                                status == 'open'
                            ) {
                                var field_invoice = form.addField({
                                    id: 'custpage_param_id',
                                    type: serverWidget.FieldType.SELECT,
                                    source: record.Type.INVOICE,
                                    label: 'Transaccion Origen',
                                    container: 'fieldgroup_in'
                                }).updateDisplayType({
                                    displayType: "NORMAL"
                                    // displayType: "INLINE"
                                }).defaultValue = context.request.parameters.param_id;
                                var field_creditmemo = form.addField({
                                    id: 'custpage_creditmemo',
                                    type: serverWidget.FieldType.SELECT,
                                    source: record.Type.CREDIT_MEMO,
                                    label: 'Credit Memo',
                                    container: 'fieldgroup_out'
                                }).updateDisplayType({
                                    displayType: "NORMAL"
                                    // displayType: "INLINE"
                                });

                                var field_invoice = form.addField({
                                    id: 'custpage_invoice',
                                    type: serverWidget.FieldType.SELECT,
                                    source: record.Type.INVOICE,
                                    label: 'Invoice',
                                    container: 'fieldgroup_out'
                                }).updateDisplayType({
                                    displayType: "NORMAL"
                                    // displayType: "INLINE"
                                });
                                /* Extraer Lotes Inicio*/
                                var objLote = {};
                                var sublist = 'item';

                                var recordTransaction = record.load({
                                    type: context.request.parameters.param_type,
                                    id: context.request.parameters.param_id,
                                    isDynamic: true,
                                });
                                var lineCount = recordTransaction.getLineCount({
                                    sublistId: sublist
                                }) || 0;
                                for (var linenum = 0; linenum < lineCount; linenum++) {
                                    recordTransaction.selectLine({
                                        sublistId: sublist,
                                        line: linenum
                                    });

                                    var item = recordTransaction.getCurrentSublistValue({
                                        sublistId: sublist,
                                        fieldId: 'item',
                                    });

                                    if (
                                        recordTransaction.getCurrentSublistValue({
                                            sublistId: sublist,
                                            fieldId: 'inventorydetailavail',
                                        }) == 'T'
                                    ) {
                                        objLote[linenum] = [];
                                        var lineSubrecord = 0;
                                        var objSubrecord = recordTransaction.getCurrentSublistSubrecord({
                                            sublistId: sublist,
                                            fieldId: 'inventorydetail'
                                        }) || '';
                                        if (objSubrecord) {
                                            lineSubrecord = objSubrecord.getLineCount({
                                                sublistId: 'inventoryassignment'
                                            }) || 0;
                                        }
                                        log.audit({
                                            title: 'objSubrecord invoice',
                                            details: JSON.stringify(objSubrecord)
                                        });
                                        for (var a = 0; a < lineSubrecord; a++) {
                                            objSubrecord.selectLine({
                                                sublistId: 'inventoryassignment',
                                                line: a
                                            });

                                            var quantity = objSubrecord.getCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity'
                                            }) || '';
                                            var lote = objSubrecord.getCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'numberedrecordid'
                                            }) || '';
                                            var issueinventorynumber = objSubrecord.getCurrentSublistText({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'issueinventorynumber'
                                            }) || '';

                                            objLote[linenum].push({
                                                item: item,
                                                quantity: quantity,
                                                lote: lote,
                                                issueinventorynumber: issueinventorynumber
                                            });
                                        }

                                    }
                                }
                                log.audit({
                                    title: 'objLote',
                                    details: JSON.stringify(objLote)
                                });
                                /* Extraer Lotes Fin*/
                                var objCreditMemo = record.transform({
                                    fromType: record.Type.INVOICE,
                                    fromId: context.request.parameters.param_id,
                                    toType: record.Type.CREDIT_MEMO,
                                    isDynamic: true,
                                });
                                var location = '';
                                var subsidiary = objCreditMemo.getValue({
                                    fieldId: 'subsidiary'
                                });
                                var locationCreditMemo = objCreditMemo.getValue({
                                    fieldId: 'location'
                                });
                                if (subsidiary) {
                                    var custrecord_drt_rf_ubicacion = search.lookupFields({
                                        type: record.Type.SUBSIDIARY,
                                        id: subsidiary,
                                        columns: ['custrecord_drt_rf_ubicacion']
                                    }) || '';
                                    if (
                                        custrecord_drt_rf_ubicacion &&
                                        custrecord_drt_rf_ubicacion.custrecord_drt_rf_ubicacion &&
                                        custrecord_drt_rf_ubicacion.custrecord_drt_rf_ubicacion[0] &&
                                        custrecord_drt_rf_ubicacion.custrecord_drt_rf_ubicacion[0].value
                                    ) {
                                        location = custrecord_drt_rf_ubicacion.custrecord_drt_rf_ubicacion[0].value;
                                    }
                                }

                                if (
                                    location &&
                                    locationCreditMemo &&
                                    location != locationCreditMemo
                                ) {
                                    objCreditMemo.setValue({
                                        fieldId: 'location',
                                        value: location
                                    });
                                    /* 
                                    Aplicar Lotes inicio
                                    */
                                    if (Object.keys(objLote).length > 0) {

                                        for (var line in objLote) {

                                            objCreditMemo.selectLine({
                                                sublistId: sublist,
                                                line: line,
                                            });

                                            var sublistFieldValue = objCreditMemo.getCurrentSublistSubrecord({
                                                sublistId: sublist,
                                                fieldId: 'inventorydetail'
                                            });
                                            log.audit({
                                                title: 'sublistFieldValue',
                                                details: JSON.stringify(sublistFieldValue)
                                            });
                                            for (var lote in objLote[line]) {

                                                sublistFieldValue.selectNewLine({
                                                    sublistId: 'inventoryassignment'
                                                });
                                                log.audit({
                                                    title: 'objLote[line][lote].issueinventorynumber',
                                                    details: JSON.stringify(objLote[line][lote].issueinventorynumber)
                                                });
                                                sublistFieldValue.setCurrentSublistValue({
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'receiptinventorynumber',
                                                    value: objLote[line][lote].issueinventorynumber
                                                });
                                                // binnumber
                                                sublistFieldValue.setCurrentSublistValue({
                                                    sublistId: 'inventoryassignment',
                                                    fieldId: 'quantity',
                                                    value: parseFloat(objLote[line][lote].quantity)
                                                });

                                                sublistFieldValue.commitLine({
                                                    sublistId: 'inventoryassignment'
                                                });
                                            }

                                            objCreditMemo.commitLine({
                                                sublistId: sublist,
                                            });
                                        }
                                    }
                                    /* 
                                    Aplicar Lotes Fin
                                    */
                                }
                                objCreditMemo.setValue({
                                    fieldId: 'custbody_drt_rf_refacturacion',
                                    value: true
                                });

                                objCreditMemo.setValue({
                                    fieldId: 'custbody_drt_rf_transaccion',
                                    value: context.request.parameters.param_id
                                });

                                for (var i in arrayClr) {
                                    objCreditMemo.setValue({
                                        fieldId: arrayClr[i],
                                        value: ''
                                    });
                                }

                                var creditmemoId = objCreditMemo.save({
                                    enableSourcing: true,
                                    ignoreMandatoryFields: true
                                }) || '';

                                if (creditmemoId) {
                                    var objInvoice = record.copy({
                                        type: record.Type.INVOICE,
                                        id: context.request.parameters.param_id,
                                        isDynamic: true
                                    });

                                    var locationInvoice = objInvoice.getValue({
                                        fieldId: 'location'
                                    });

                                    if (
                                        locationInvoice &&
                                        location &&
                                        locationInvoice != location
                                    ) {
                                        objInvoice.setValue({
                                            fieldId: 'location',
                                            value: location
                                        });
                                        /* 
                                        Aplicar Lotes inicio
                                        */
                                        if (Object.keys(objLote).length > 0) {

                                            for (var line in objLote) {

                                                objInvoice.selectLine({
                                                    sublistId: sublist,
                                                    line: line,
                                                });

                                                var sublistFieldValue = objInvoice.getCurrentSublistSubrecord({
                                                    sublistId: sublist,
                                                    fieldId: 'inventorydetail'
                                                });

                                                for (var lote in objLote[line]) {

                                                    sublistFieldValue.selectNewLine({
                                                        sublistId: 'inventoryassignment'
                                                    });

                                                    sublistFieldValue.setCurrentSublistValue({
                                                        sublistId: 'inventoryassignment',
                                                        fieldId: 'issueinventorynumber',
                                                        value: parseInt(objLote[line][lote].lote)
                                                    });

                                                    sublistFieldValue.setCurrentSublistValue({
                                                        sublistId: 'inventoryassignment',
                                                        fieldId: 'quantity',
                                                        value: parseFloat(objLote[line][lote].quantity)
                                                    });

                                                    sublistFieldValue.commitLine({
                                                        sublistId: 'inventoryassignment'
                                                    });
                                                }

                                                objInvoice.commitLine({
                                                    sublistId: sublist,
                                                });
                                            }
                                        }
                                        /* 
                                        Aplicar Lotes fin
                                        */
                                    }
                                    objInvoice.setValue({
                                        fieldId: 'custbody_drt_rf_refacturacion',
                                        value: true
                                    });

                                    objInvoice.setValue({
                                        fieldId: 'custbody_drt_rf_transaccion',
                                        value: context.request.parameters.param_id
                                    });

                                    for (var i in arrayClr) {
                                        objInvoice.setValue({
                                            fieldId: arrayClr[i],
                                            value: ''
                                        });
                                    }

                                    var invoiceId = objInvoice.save({
                                        enableSourcing: true,
                                        ignoreMandatoryFields: true
                                    }) || '';

                                    field_creditmemo.defaultValue = creditmemoId;

                                    if (invoiceId) {
                                        field_invoice.defaultValue = invoiceId;
                                    }
                                }


                            } else {
                                form.addField({
                                    id: 'custpage_invalid',
                                    type: serverWidget.FieldType.TEXT,
                                    label: 'Error'
                                }).updateDisplayType({
                                    displayType: "NORMAL"
                                    // displayType: "INLINE"
                                }).defaultValue = 'La treansaccion ' + context.request.parameters.param_id + ' no es valida';
                            }
                            break;
                        case "customrecord":

                            if (
                                invoiceData["custbody_mx_cfdi_uuid"]
                            ) {
                                form.addField({
                                    id: 'custbody_param_type',
                                    type: serverWidget.FieldType.TEXT,
                                    label: 'Type',
                                }).updateDisplayType({
                                    displayType: "HIDDEN"
                                }).defaultValue = record.Type.INVOICE;

                                form.addField({
                                    id: 'custbody_param_id',
                                    type: serverWidget.FieldType.TEXT,
                                    label: 'ID',
                                }).updateDisplayType({
                                    displayType: "HIDDEN"
                                }).defaultValue = context.request.parameters.param_id;

                                form.addField({
                                    id: 'custbody_mx_cfdi_uuid',
                                    type: serverWidget.FieldType.TEXT,
                                    label: "UUID",
                                    container: 'fieldgroup_in'
                                }).updateDisplayType({
                                    displayType: "INLINE"
                                }).defaultValue = invoiceData["custbody_mx_cfdi_uuid"];

                                {
                                    var usocfdi = form.addField({
                                        id: 'custbody_drt_rf_tipo_relacion',
                                        type: serverWidget.FieldType.SELECT,
                                        label: 'Tipo de Relación',
                                        source: 'customrecord_mx_sat_rel_type',
                                        container: 'fieldgroup_in'

                                    }).defaultValue = 1;
                                    usocfdi.isMandatory = true;
                                }

                                {
                                    var usocfdi = form.addField({
                                        id: 'custbody_mx_cfdi_usage',
                                        type: serverWidget.FieldType.SELECT,
                                        label: 'Uso de CFDI',
                                        source: 'customrecord_mx_sat_cfdi_usage',
                                        container: 'fieldgroup_out'

                                    });
                                    if (
                                        invoiceData["custbody_mx_cfdi_usage"] &&
                                        invoiceData["custbody_mx_cfdi_usage"][0] &&
                                        invoiceData["custbody_mx_cfdi_usage"][0].value
                                    ) {
                                        usocfdi.defaultValue = parseInt(invoiceData["custbody_mx_cfdi_usage"][0].value);
                                    }
                                    usocfdi.isMandatory = true;
                                }

                                {
                                    var data_payment_method = fbusqueda('customrecord_mx_mapper_values', ['name'], ['custrecord_mx_mapper_value_category', search.Operator.IS, 6]);

                                    // 'custbody_mx_cfdi_usage', customrecord_mx_sat_cfdi_usage
                                    var payment_method = form.addField({
                                        id: 'custbody_mx_txn_sat_payment_method',
                                        type: serverWidget.FieldType.SELECT,
                                        label: 'SAT Forma de Pago',
                                        container: 'fieldgroup_out'

                                    }) /* .isMandatory = true */ ;
                                    for (var i = 0; i < data_payment_method.length; i++) {
                                        if (data_payment_method[i].id) {
                                            payment_method.addSelectOption({
                                                value: parseInt(data_payment_method[i].id),
                                                text: data_payment_method[i].getValue('name') || " "
                                            });
                                        }
                                    }
                                    payment_method.isMandatory = true;
                                    if (
                                        invoiceData &&
                                        invoiceData["custbody_mx_txn_sat_payment_method"] &&
                                        invoiceData["custbody_mx_txn_sat_payment_method"][0] &&
                                        invoiceData["custbody_mx_txn_sat_payment_method"][0].value
                                    ) {
                                        payment_method.defaultValue = parseInt(invoiceData["custbody_mx_txn_sat_payment_method"][0].value);
                                    }

                                }



                                {
                                    var usocfdi = form.addField({
                                        id: 'custbody_mx_txn_sat_payment_term',
                                        type: serverWidget.FieldType.SELECT,
                                        label: 'SAT Método de Pago',
                                        source: 'customrecord_mx_sat_payment_term',
                                        container: 'fieldgroup_out'

                                    });
                                    if (
                                        invoiceData &&
                                        invoiceData["custbody_mx_txn_sat_payment_term"] &&
                                        invoiceData["custbody_mx_txn_sat_payment_term"][0] &&
                                        invoiceData["custbody_mx_txn_sat_payment_term"][0].value
                                    ) {
                                        usocfdi.defaultValue = invoiceData["custbody_mx_txn_sat_payment_term"][0].value;
                                    }
                                    usocfdi.isMandatory = true;
                                }
                                /* Campos Respaldo */
                                {
                                    var fieldPDF = form.addField({
                                        id: 'custbody_edoc_generated_pdf',
                                        type: serverWidget.FieldType.TEXT,
                                        label: 'PDF',
                                        container: 'fieldgroup_out'
                                    }).updateDisplayType({
                                        displayType: "HIDDEN"
                                    });;
                                    if (
                                        invoiceData &&
                                        invoiceData["custbody_edoc_generated_pdf"] &&
                                        invoiceData["custbody_edoc_generated_pdf"][0] &&
                                        invoiceData["custbody_edoc_generated_pdf"][0].value
                                    ) {
                                        fieldPDF.defaultValue = invoiceData["custbody_edoc_generated_pdf"][0].value;
                                    }
                                }

                                {
                                    var fieldXML = form.addField({
                                        id: 'custbody_psg_ei_certified_edoc',
                                        type: serverWidget.FieldType.TEXT,
                                        label: 'XML',
                                        container: 'fieldgroup_out'
                                    }).updateDisplayType({
                                        displayType: "HIDDEN"
                                    });
                                    if (
                                        invoiceData &&
                                        invoiceData["custbody_psg_ei_certified_edoc"] &&
                                        invoiceData["custbody_psg_ei_certified_edoc"][0] &&
                                        invoiceData["custbody_psg_ei_certified_edoc"][0].value
                                    ) {
                                        fieldXML.defaultValue = invoiceData["custbody_edoc_generated_pdf"][0].value;
                                    }
                                }

                                {
                                    if (
                                        invoiceData["custbody_mx_cfdi_certify_timestamp"]
                                    ) {
                                        form.addField({
                                            id: 'custbody_mx_cfdi_certify_timestamp',
                                            type: serverWidget.FieldType.TEXT,
                                            label: 'Fecha Timbrado',
                                            container: 'fieldgroup_out'
                                        }).updateDisplayType({
                                            displayType: "HIDDEN"
                                        }).defaultValue = invoiceData["custbody_mx_cfdi_certify_timestamp"];
                                    }

                                    if (
                                        invoiceData["customer.custentity_mx_rfc"]
                                    ) {
                                        form.addField({
                                            id: 'custentity_mx_rfc',
                                            type: serverWidget.FieldType.TEXT,
                                            label: 'RFC',
                                            container: 'fieldgroup_out'
                                        }).updateDisplayType({
                                            displayType: "HIDDEN"
                                        }).defaultValue = invoiceData["customer.custentity_mx_rfc"];
                                    }
                                }
                                form.addSubmitButton({
                                    label: 'Refacturar'
                                });

                            }
                            break;
                        case "finally":
                            form.addField({
                                id: 'custpage_finally',
                                type: serverWidget.FieldType.TEXT,
                                label: ""
                            }).updateDisplayType({
                                displayType: "NORMAL"
                                // displayType: "INLINE"
                            }).defaultValue = "Proceso Finalizado";


                            break;
                        default:
                            form.addField({
                                id: 'custpage_mode',
                                type: serverWidget.FieldType.TEXTAREA,
                                label: 'Modo'
                            }).defaultValue = "Sin Modo";
                            break;
                    }
                }

                context.response.writePage(form);
            } else {
                log.audit({
                    title: 'context.request.parameters',
                    details: JSON.stringify(context.request.parameters)
                });

                if (
                    context.request.parameters.custbody_param_type &&
                    context.request.parameters.custbody_param_id &&
                    context.request.parameters.custbody_mx_cfdi_uuid
                ) {
                    var objBakUp = {
                        "custrecord_drt_rf_uuid_documento": context.request.parameters.custbody_mx_cfdi_uuid,
                        "custrecord_drt_rf_fecha_timbrado": context.request.parameters.custbody_mx_cfdi_certify_timestamp,
                        "custrecord_drt_rf_pdf": context.request.parameters.custbody_edoc_generated_pdf,
                        "custrecord_drt_rf_xml": context.request.parameters.custbody_psg_ei_certified_edoc,
                        "custrecord_drt_rf_refacturacion": context.request.parameters.custbody_param_id,
                        "custrecord_drt_rf_rfc": context.request.parameters.custentity_mx_rfc,
                        "custrecord_drt_rf_uso_cfdi": context.request.parameters.custbody_mx_cfdi_usage,
                        "custrecord_drt_rf_forma_pago": context.request.parameters.custbody_mx_txn_sat_payment_method,
                        "custrecord_drt_rf_metodo_pago": context.request.parameters.custbody_mx_txn_sat_payment_term,
                    };
                    var createBackUp = createRecord("customrecord_drt_rd_refacturacion", objBakUp);
                    if (createBackUp.success) {

                        var record_relacion = fbusqueda('customrecord_mx_related_cfdi_subl', [
                                "custrecord_mx_rcs_orig_trans",
                                "custrecord_mx_rcs_rel_type",
                                "custrecord_mx_rcs_rel_cfdi",
                                "custrecord_mx_rcs_uuid",
                                "custrecord_mx_rcs_orig_trans_id",
                            ],
                            ['custrecord_mx_rcs_orig_trans', search.Operator.IS, context.request.parameters.custbody_param_id],
                            "AND",
                            ['isinactive', search.Operator.IS, 'T']
                        );
                        for (var i = 0; i < record_relacion.length; i++) {
                            if (record_relacion[i].id) {
                                record.submitFields({
                                    type: "customrecord_mx_related_cfdi_subl",
                                    id: record_relacion[i].id,
                                    values: {
                                        'isinactive': true,
                                    },
                                    options: {
                                        enableSourcing: false,
                                        ignoreMandatoryFields: true
                                    }
                                });
                            }
                        }
                        /* 
                        var createRelacion = createRecord(
                            "customrecord_mx_related_cfdi_subl", //
                            {
                                custrecord_mx_rcs_orig_trans: context.request.parameters.custbody_param_id,
                                custrecord_mx_rcs_rel_cfdi: context.request.parameters.custbody_param_id,
                                custrecord_mx_rcs_rel_type: 4
                            }
                        );
                        log.audit({
                            title: 'createRelacion',
                            details: JSON.stringify(createRelacion)
                        }); 
                        */


                        var idSubmit = record.submitFields({
                            type: context.request.parameters.custbody_param_type,
                            id: context.request.parameters.custbody_param_id,
                            values: {
                                'custbody_mx_cfdi_uuid': "",
                                'custbody_psg_ei_status': "",
                                'custbody_mx_cfdi_certify_timestamp': "",
                                'custbody_psg_ei_certified_edoc': "",
                                'custbody_psg_ei_generated_edoc': "",
                                'custbody_crt_sol_cancel': false,
                                'custbody_edoc_generated_pdf': "",
                                'custbody_mx_cfdi_usage': context.request.parameters.custbody_mx_cfdi_usage,
                                'custbody_mx_txn_sat_payment_term': context.request.parameters.custbody_mx_txn_sat_payment_term,
                                'custbody_mx_txn_sat_payment_method': context.request.parameters.custbody_mx_txn_sat_payment_method,
                                'custbody_drt_crt_verificacion_cancel': "",
                                'custbody_drt_rf_refacturacion': true,
                                'custbody_drt_rf_uuid_relacionado': context.request.parameters.custbody_mx_cfdi_uuid,
                                'custbody_drt_rf_tipo_relacion': context.request.parameters.custbody_drt_rf_tipo_relacion,
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    }
                }
                redirect.toRecord({
                    type: context.request.parameters.custbody_param_type,
                    id: context.request.parameters.custbody_param_id,
                    parameters: {
                        'custparam_result': 'Exito'
                    }
                });
                /* redirect.toSuitelet({
                    scriptId: 'customscript_drt_rf_refacturacion_s_2',
                    deploymentId: 'customdeploy_drt_rf_refacturacion_sl',
                    parameters: {
                        param_mode: "finally"
                    }
                }); */
            }
        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
            var form = serverWidget.createForm({
                title: 'DRT RF - Refacturacion'
            });
            var field_add = form.addField({
                id: 'custpage_error',
                type: serverWidget.FieldType.TEXTAREA,
                label: 'ERROR'
            });

            field_add.defaultValue = JSON.stringify(error);

            context.response.writePage(form);
        }
    }

    function fbusqueda(tipobusqueda, columnasbusqueda, filtrosbusqueda) {
        try {

            log.audit({
                title: "fbusqueda",
                details: "tipodebusqueda: " + tipobusqueda + " columnasbusqueda: " + columnasbusqueda + " filtrosbusqueda: " + filtrosbusqueda
            });
            var datos = [];
            var mySearch = search.create({
                type: tipobusqueda,
                columns: columnasbusqueda,
                filters: filtrosbusqueda
            });

            var myResultSet = mySearch.run();
            var inicio = 0;
            do {
                var resultRange = myResultSet.getRange({
                    start: inicio,
                    end: inicio + 1000
                });

                for (var i = 0; i < resultRange.length; i++) {
                    log.debug(resultRange[i]);
                    datos.push(resultRange[i]);

                }
                inicio += 1000;
            } while (resultRange && resultRange == 1000);
        } catch (error) {
            log.error("error: ", error);
        } finally {
            log.audit("Datos" + tipobusqueda, datos);
            return datos;
        }
    }

    function createRecord(param_type, param_field_value) {
        try {
            var respuesta = {
                success: false,
                data: '',
                error: {}
            };

            log.audit({
                title: 'createRecord',
                details: //
                    ' param_type: ' + param_type +
                    ' param_field_value: ' + JSON.stringify(param_field_value)
            });

            var newRecord = record.create({
                type: param_type,
                isDynamic: true
            });

            for (var field in param_field_value) {
                newRecord.setValue({
                    fieldId: field,
                    value: param_field_value[field]
                });
            }

            respuesta.data = newRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            }) || '';

            respuesta.success = respuesta.data != '';
        } catch (error) {
            log.error({
                title: 'error createRecord',
                details: JSON.stringify(error)
            });
            respuesta.error = error;
        } finally {
            log.audit({
                title: 'respuesta createRecord ' + param_type,
                details: respuesta
            });
            return respuesta;
        }
    }
    return {
        onRequest: onRequest
    }
});