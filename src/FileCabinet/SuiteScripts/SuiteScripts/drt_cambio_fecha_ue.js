/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record'], function (record) {

    function afterSubmit(context) {
        try {
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {

                var record_context = context.newRecord;
                var recType = record_context.type; //tipo de transaccion
                var recId = record_context.id; //id interno

                var fecha1 = record_context.getValue({
                    fieldId: 'custbody_drt_fecha_limite'
                }); //obtiendo el valor de la fecha limite

                log.audit('fecha1', fecha1); //log de fecha1

                record.submitFields({
                    type: recType,
                    id: recId,
                    values: {
                        custbody_disa_espejo_fecha_limite: fecha1
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