/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record'], function (record) {

    function beforeLoad(context) {
        try {

            if (
                context.type == context.UserEventType.EDIT ||
                context.type == context.UserEventType.CREATE
            ) {
                var contextR = context.newRecord;
                var recId = context.newRecord.id;
                var recType = context.newRecord.type;

                var lineas = contextR.getLineCount({
                    sublistId: 'expense'
                });

                log.audit('lineas', lineas);

                for (var i = 0; i < lineas; i++) {
                    var categoria = contextR.getSublistValue({
                        sublistId: 'expense',
                        fieldId: 'account',
                        line: i
                    });

                    log.audit('categoria', categoria);

                    if (categoria) {
                        log.audit('ok', 'si existe');

                        record.submitFields({
                            id: recId,
                            type: recType,
                            values: {
                                custbody_disa_aprobaciongastos_: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    }
                }
            }

        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        afterSubmit: beforeLoad
    }
});