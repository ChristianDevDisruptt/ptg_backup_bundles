/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/record'], function (record) {

    function afterSubmit(context) {
        try {
            var newRec = context.newRecord;
            var recId = newRec.id;
            var recType = newRec.type;
            if (context.type == context.UserEventType.CREATE  || context.type == context.UserEventType.EDIT) {
                var lineas = newRec.getLineCount({
                    sublistId: 'item'
                }) || 0;
                log.audit('lineas', lineas);
				var flag = false;
                for (var i = 0; i < lineas; i++) {
                    var precio1 = newRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_disa_precio_lista',
                        line: i
                    });

                    var precio2 = newRec.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_disa_precio_unitario',
                        line: i
                    });
                    //log.audit('precio1', precio1);
                    //log.audit('precio2', precio2);
                    if (precio2 < precio1) {
                        flag=true;
                    } /*else if(precio1 < precio2){
                        flag
                    }*/
                }
                var tranid = record.submitFields({
                    id: recId,
                    type: recType,
                    values: {
                        'custbody_drt_disa_price_level_custom': flag
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                log.audit({
                    title: 'tranid',
                    details: JSON.stringify(tranid)
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