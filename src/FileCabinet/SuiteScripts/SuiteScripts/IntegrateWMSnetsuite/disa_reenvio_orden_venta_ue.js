/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define([
    'N/search',
    'N/runtime',
    'N/url'
], function (
    search,
    runtime,
    url
) {

    const CONST_SCRIPT_S = 'customscript_disa_reenvio_so_sl';
    const CONST_DEPLOY_S = 'customdeploy_disa_reenvio_so_sl';

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {
                var context_record = context.newRecord;

                var envioWms = context_record.getValue({
                    fieldId: 'custbody_drt_send_wep'
                });

                var responseWms = context_record.getValue({
                    fieldId: 'custbody_drt_response_wms'
                });

                var formulario = context.form;

                if (envioWms && responseWms == 500) {
                    var params = '&custpage_id=' + context.newRecord.id;
                    params += '&custpage_type=' + context.newRecord.type;

                    var urlSuiteScript = url.resolveScript({
                        scriptId: CONST_SCRIPT_S,
                        deploymentId: CONST_DEPLOY_S,
                        returnExternalUrl: false
                    });
                    urlSuiteScript += params;

                    var funcionReenviarOrden = "require([], function(){window.open('" + urlSuiteScript + "', '_self');});";
                    formulario.addButton({
                        id: "custpage_btn_reenviar_orden_venta",
                        label: "DISA - Reenviar Orden de Venta",
                        functionName: funcionReenviarOrden
                    });
                }
            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});