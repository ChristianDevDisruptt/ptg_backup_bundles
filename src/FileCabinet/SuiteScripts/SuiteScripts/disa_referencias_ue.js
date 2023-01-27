/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record'], function (record) {

    function afterSubmit(context) {
        try {
            if(context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {
                var contextRecord = context.newRecord;
                var param_type = contextRecord.type;
                var param_id = contextRecord.id;
                log.audit('contextRecord', contextRecord);
                var lineas = contextRecord.getLineCount({
                    sublistId: 'apply'
                });

                log.audit('lineas', lineas);
                var referencia = "";
                for (var i = 0; i < lineas; i++) {
                    if (
                        contextRecord.getSublistValue({
                            sublistId: 'apply',
                            fieldId: 'apply',
                            line: i
                        })
                    ) {
                        referencia += " " + contextRecord.getSublistValue({
                            sublistId: 'apply',
                            fieldId: 'refnum',
                            line: i
                        });
                    }
                }
                log.audit('referencia', referencia);

                record.submitFields({
                    type: param_type,
                    id: param_id,
                    values: {
                        custbody_drt_reference_payment: referencia + " "
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