/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    "N/record",
    'N/ui/serverWidget'
], function (
    record,
    serverWidget
) {
    function beforeLoad(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.COPY ||
                context.type == context.UserEventType.EDIT
            ) {
                log.audit({
                    title: 'context.newRecord.type',
                    details: JSON.stringify(context.newRecord.type)
                });
                var shipstatus = context.newRecord.getValue({
                    fieldId: 'shipstatus'
                }) || '';
                log.audit({
                    title: 'shipstatus',
                    details: JSON.stringify(shipstatus)
                });
                if (
                    shipstatus == 'C' &&
                    context.newRecord.type == record.Type.ITEM_FULFILLMENT
                ) {
                    var form = context.form;
                    hidenField(form, 'item', 'quantity', 'DISABLED');
                }
                if (
                    context.newRecord.type == record.Type.SALES_ORDER
                ) {
                    //hidenField(context.form, 'item', 'item', 'DISABLED');
                   // hidenField(context.form, 'item', 'inventorydetail', 'HIDDEN');
                    hidenField(context.form, 'item', 'taxcode', 'DISABLED');
                    hidenField(context.form, 'item', 'tax1amt', 'DISABLED');
                    hidenField(context.form, 'item', 'grossamt', 'DISABLED');
                }
            }
        } catch (error) {
            log.error({
                title: 'error beforeLoad',
                details: JSON.stringify(error)
            });
        }
    }

    function hidenField(param_form, param_sublist, param_field, param_display) {
        try {
            // DISABLED
            // ENTRY
            // HIDDEN
            // INLINE
            // NORMAL
            // READONLY





            if (param_form) {
                log.audit({
                    title: 'hidenField',
                    details: ' param_form: ' + JSON.stringify(param_form) +
                        ' param_sublist: ' + JSON.stringify(param_sublist) +
                        ' param_field: ' + JSON.stringify(param_field) +
                        ' param_display: ' + JSON.stringify(param_display)
                });
                if (param_sublist && param_field) {
                    param_form.getSublist({
                        id: param_sublist
                    }).getField({
                        id: param_field
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType[param_display]
                    });
                }
                if (!param_sublist && param_field) {
                    param_form.getField({
                        id: param_field
                    }).updateDisplayType({
                        displayType: serverWidget.FieldDisplayType[param_display]
                    });
                }
            }
        } catch (error) {
            log.error({
                title: 'error hidenField',
                details: JSON.stringify(error)
            });
        }
    }



    return {
        beforeLoad: beforeLoad
    }
});