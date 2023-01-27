/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/redirect', 'N/search'], function (record, redirect, search) {
    
    function afterSubmit(context) {
        try {
            var contextR = context.newRecord;
            log.audit('contextR', contextR);

            var creadoDesde = contextR.getValue({
                fieldId: 'createdfrom'
            });
            log.audit('creadoDesde', creadoDesde);

            var recordTransferOrder = record.load({
                type: record.Type.TRANSFER_ORDER,
                id: creadoDesde,
                isDynamic: true,
            });
            log.audit('recordTransferOrder', recordTransferOrder);
          
          	var formulario = recordTransferOrder.getValue({
                fieldId: 'customform'
            });
            log.audit('formulario', formulario);
            if (recordTransferOrder && formulario == 207) {
                log.audit('OK', 'si existe');

                redirect.toRecord({
                    type: record.Type.TRANSFER_ORDER,
                    id: creadoDesde,
                    isEditMode: true,
                    parameters: {
                        'wms': 1
                    }
                });

                record.submitFields({
                    type: record.Type.TRANSFER_ORDER,
                    id: creadoDesde,
                    values: {
                        custbody_drt_send_wms: true

                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }

                });
            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});