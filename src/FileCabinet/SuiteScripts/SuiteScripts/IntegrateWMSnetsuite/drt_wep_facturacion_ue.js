/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/search'
], function (
    search
) {
    function beforeLoad(context) {
        try {
            log.audit({
                title: 'context.type',
                details: JSON.stringify(context.type)
            });
            if (
                context.type == context.UserEventType.CREATE
            ) {

                var salesrep = context.newRecord.getValue({
                    fieldId: 'salesrep'
                }) || '';

                log.audit({
                    title: 'salesrep',
                    details: JSON.stringify(salesrep)
                });
                if (
                    salesrep
                ) {
                    var search1 = search.lookupFields({
                        type: search.Type.EMPLOYEE,
                        id: salesrep,
                        columns: ['custentity_disa_oficina_ventas']
                    }) || '';
                    log.audit({
                        title: 'search1',
                        details: JSON.stringify(search1)
                    });
                    if (
                        search1 &&
                        (
                            search1["custentity_disa_oficina_ventas"] &&
                            search1["custentity_disa_oficina_ventas"][0] &&
                            search1["custentity_disa_oficina_ventas"][0].value
                        )
                    ) {
                        context.newRecord.setValue({
                            fieldId: 'location',
                            value: search1["custentity_disa_oficina_ventas"][0].value
                        });
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

    return {
        beforeLoad: beforeLoad
    }
});