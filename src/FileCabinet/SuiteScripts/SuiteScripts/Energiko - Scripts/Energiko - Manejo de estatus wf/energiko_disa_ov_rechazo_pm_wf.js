/******************************************************************
 * *Energiko * Energiko IT Developer *
 * ****************************************************************
 * Date: 08/2022
 * Script name: ENERGIKO - Rechazo pedido minimo WF
 * Script id: customscript_energiko_disa_ov_rechazo_pm_wf
 * customer Deployment id: customdeploy_energiko_disa_ov_rechazo_pm_wf
 * Applied to: Sales Order
 * File: energiko_disa_ov_rechazo_pm_wf.js
 ******************************************************************/


/**
 *@NApiVersion 2.x
 *@NScriptType WorkflowActionScript

 */
define(['N/search', 'N/record', 'N/https','N/runtime', 'N/redirect'], function (search, record, https, runtime, redirect) {
    function onAction(scriptContext) {
        try {
            
            var record_context = scriptContext.newRecord;
            var recType = record_context.type;
            var recId = record_context.id;
                    
           

            var currenRecord = record.load({
                type: recType,
                id: recId
            });            
               
            currenRecord.setValue({                
                fieldId: 'custbody_disa_estatus_ov',                
                value: '11',
                ignoreFieldChange: true,
                forceSyncSourcing: true
            });                         
          
            var index=currenRecord.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });


        } catch (error) {
            log.audit('error', error);
        } finally {
            log.audit('exito', 'uno');
            return 1;
        }
    }
    return {
        onAction: onAction
    }
});