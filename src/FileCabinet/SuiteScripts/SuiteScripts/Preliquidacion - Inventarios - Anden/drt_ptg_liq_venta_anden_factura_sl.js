/*******************************************************************************
 * * DisrupTT * DisrupTT Developers *
 * **************************************************************************
 * Date: 05/2022
 * Script name: DRT - Facturacion Venta Anden SL
 * Script id: customscript_drt_ptg_factur_ven_ande_sl
 * customer Deployment id: customdeploy_drt_ptg_factur_ven_ande_sl
 * Applied to: 
 * File: drt_ptg_liq_venta_anden_factura_sl.js
 ******************************************************************************/
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
 define(['N/search', 'N/record', 'N/ui/message', 'N/ui/dialog', 'N/task', 'N/runtime'], function (search, record, message, dialog, task, runtime) {
    function onRequest(context) {
        var parameters = context.request.parameters;
        log.debug("parameters", parameters);
        

        try {
            if (context.request.method == 'GET') {
                var recID = parameters.id;
                log.audit("recID", recID);
                

                if (isValidField(recID)) {
                    var invoiceTask = task.create({
                        taskType: task.TaskType.MAP_REDUCE,
                        scriptId: 'customscript_drt_ptg_factur_ven_ande_mr',
                        //deploymentId: 'customdeploy_drt_ptg_factur_ven_ande_mr',
                        params: {custscript_drt_venta_anden_a_facturar: recID}
                    });
                    invoiceTask.submit();
                }
                return context.response;
            }
        } catch (e) {
            log.debug("Error", e)
        }
    }

    function isValidField(field) {
        return field !== '' && field != null;
    }

    return {
        onRequest: onRequest
    }
});