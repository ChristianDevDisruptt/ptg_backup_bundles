/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    "N/url"
], function (
    url
) {
    function beforeLoad(context) {
        try {
            if (
                context.type == context.UserEventType.VIEW
            ) {
                var verificacion = context.newRecord.getValue({
                    fieldId: 'custbody_drt_crt_verificacion_cancel'
                }) || "";

                var status = context.newRecord.getValue({
                    fieldId: 'status'
                }) || '';

                log.audit({
                    title: 'status',
                    details: JSON.stringify(status)
                });

                if (
                    (
                        status == "Open" || status == "Abrir" ||
                        status == "Pendiente"
                    ) &&
                    verificacion.indexOf('El documento solicitado ya fue marcado como cancelado') >= 0
                ) {
                    var params = '&param_id=' + context.newRecord.id;
                    params += '&param_type=' + context.newRecord.type;
                    params += '&param_mode=' + "customrecord";

                    var urlSuiteScript = url.resolveScript({
                        scriptId: 'customscript_drt_rf_refacturacion_s_2',
                        deploymentId: 'customdeploy_drt_rf_refacturacion_sl',
                        returnExternalUrl: false
                    }) + params;

                    var functionRefacturacion = "require([], function(){window.open('" + urlSuiteScript + "', '_self');});";

                    context.form.addButton({
                        id: 'custpage_drt_refacturacion',
                        label: 'Refacturacion',
                        functionName: functionRefacturacion
                    });
                }
            }
        } catch (error) {
            log.error({
                title: 'error beforeLoad',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        beforeLoad: beforeLoad,
    }
});