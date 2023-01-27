/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/format'], function (format) {

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {
                var c = context.newRecord;
                log.audit('c', c);
                var dates = '2021-09-08T18:17:04.000Z';
                var t = format.parse({
                    value: new Date(dates),
                    type: format.Type.DATE
                });

                log.audit('t', t);

                var formattedDateString = format.format({
                    value: t,
                    type: format.Type.DATE
                });

                log.audit('formattedDateString', formattedDateString);
            }

        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});