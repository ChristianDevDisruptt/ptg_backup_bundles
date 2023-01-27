/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define([
    'N/record','N/search'
], function (
    record, search
) {
    function afterSubmit(scriptContext) {
        try {
            var currentRecord = scriptContext.newRecord;
            var ordertype = currentRecord.getValue('ordertype') || '';
            if (
                ((scriptContext.type == scriptContext.UserEventType.CREATE) ||
                (scriptContext.type == scriptContext.UserEventType.EDIT) ||
                (scriptContext.type == context.Type == context.UserEventType.XEDIT)) &&
               	ordertype == "TrnfrOrd"
            ) {

                var id = currentRecord.getValue('id') || '';

                //var tranid = currentRecord.getValue('tranid') || '';

                //log.audit("tranid original " + tranid);

                var tpid = parseInt(currentRecord.getValue('createdfrom'));

                log.audit("Traspaso:", tpid);

                var objRecord = record.load({
                    type: record.Type.TRANSFER_ORDER,
                    id: tpid,
                    isDynamic: true,
                });

                var prefix = objRecord.getValue('custbody_disa_prefix_almacen');

                log.audit("Prefijo:", prefix);

                var lookupItemFulfill = search.lookupFields({
                    type: record.Type.ITEM_FULFILLMENT,
                    id: id,
                    columns: ['tranid']
                });
    
                log.audit('lookupItemFulfill', lookupItemFulfill);
    
                var tranid = lookupItemFulfill.tranid;
              
              	if (tranid.substring(0,1)=="T"){
                 	tranid = tranid.substring(1);
                }

                log.audit('tranid', tranid);

                var nvotranid = 'T' + prefix + tranid;

                record.submitFields({
                    type: record.Type.ITEM_FULFILLMENT,
                    id: id,
                    values: {
                        'tranid': nvotranid,
                        'custbody_mx_cfdi_serie': 'T' + prefix,
                        'custbody_mx_cfdi_folio': tranid
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
      
                log.audit("Nuevo tranid: ", "T" + prefix + tranid);
            }
            return true;
        } catch (errorafterSubmit) {
            log.audit({
                title: 'errorafterSubmit',
                details: JSON.stringify(errorafterSubmit)
            });
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});