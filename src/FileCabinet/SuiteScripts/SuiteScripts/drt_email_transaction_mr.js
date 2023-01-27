/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define([
    'N/render',
    'N/email',
    'N/record',
    'N/search',
    'N/runtime'
], function (
    render,
    email,
    record,
    search,
    runtime
) {

    var templateId = '';
    var author = '';

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_email_search'
            }) || '';
            templateId = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_email_template'
            }) || '';
            author = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_email_author'
            }) || '';

            if (
                id_search &&
                templateId &&
                author
            ) {
                respuesta = search.load({
                    id: id_search
                });
            }
        } catch (error) {
            log.error({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'getInputData',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            var objvalue = JSON.parse(context.value)

            context.write({
                key: objvalue.id,
                value: objvalue
            });
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'reduce',
                details: JSON.stringify(context)
            });
            templateId = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_email_template'
            }) || '';
            author = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_email_author'
            }) || '';
            var data = JSON.parse(context.values[0]);
            log.audit({
                title: 'data',
                details: JSON.stringify(data)
            });
            if (
                templateId &&
                author &&
                data.recordType &&
                data.id
            ) {

                var recipientId = '';
                var entityId = '';
                var search1 = search.lookupFields({
                    type: data.recordType,
                    id: data.id,
                    columns: ['entity']
                }) || '';
                log.audit({
                    title: 'search1',
                    details: JSON.stringify(search1)
                });
                if (
                    search1 &&
                    (
                        search1["entity"] &&
                        search1["entity"][0] &&
                        search1["entity"][0].value
                    )
                ) {
                    entityId = search1["entity"][0].value;
                }
                log.audit({
                    title: 'entityId',
                    details: JSON.stringify(entityId)
                });

                if (entityId) {
                    var search2 = search.lookupFields({
                        type: search.Type.ENTITY,
                        id: entityId,
                        columns: ['email']
                    }) || '';
                    log.audit({
                        title: 'search2',
                        details: JSON.stringify(search2)
                    });
                    if (
                        search2 &&
                        (
                            search2["email"]
                        )
                    ) {
                        recipientId = search2["email"];
                    }
                }
                log.audit({
                    title: 'recipientId',
                    details: JSON.stringify(recipientId)
                });
                if (recipientId) {
                    var mergeResult = render.mergeEmail({
                        templateId: templateId,
                        transactionId: parseInt(data.id)
                    });

                    email.send({
                        author: author,
                        recipients: recipientId,
                        subject: mergeResult.subject,
                        body: mergeResult.body,
                        // attachments: [fileObj],
                        relatedRecords: {
                            transactionId: parseInt(data.id)
                        }
                    });

                    var idSubmit = record.submitFields({
                        type: data.recordType,
                        id: data.id,
                        values: {
                            custbody_drt_email_enviado: true
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    log.audit({
                        title: 'idSubmit',
                        details: JSON.stringify(idSubmit)
                    });
                }

            }

        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(summary) {
        try {
            log.audit({
                title: 'summarize',
                details: JSON.stringify(summary)
            });
        } catch (error) {
            log.error({
                title: 'error summarize',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});