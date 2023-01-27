/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */


define(['N/ui/message', 'N/search'], function (message, search) {
    function validateLine(context) {
        try {
            debugger;
            var estado = '';
            var itemText = '';
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;

            if (sublistName == 'item') {
                var customForm = parseInt(currentRecord.getValue('customform')) || '';
                var item = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'item',
                });
                itemText = currentRecord.getCurrentSublistText({
                    sublistId: sublistName,
                    fieldId: 'item',
                });
                if (item) {
                    var searchdisplay =
                        search.lookupFields({
                            type: search.Type.ITEM,
                            id: item,
                            columns: ['custitem_disa_estatus']
                        }) || '';
                    if (searchdisplay) {
                        estado = searchdisplay.custitem_disa_estatus[0].value;
                        estadoText = searchdisplay.custitem_disa_estatus[0].text;
                    }

                }

            }
            debugger;
        } catch (error) {
            console.log({
                title: 'validateLine',
                details: JSON.stringify(error)
            });
        } finally {
            console.log('estado: ' + estado);
            if (estado != 3) {
                return true;
            } else {
                showmessage({
                        title: "Error",
                        message: ' El artículo ' + itemText + ' está tiene un estado ' + estadoText,
                        type: message.Type.ERROR
                    },
                    7000
                );
                return false;

            }
        }
    }

    function showmessage(param_message, param_duration) {
        try {
            var m = {
                title: "My Title",
                message: "My Message",
                cause: 'cause',
                type: message.Type.CONFIRMATION
            };
            var myMsg = message.create(param_message);

            myMsg.show({
                duration: param_duration
            });

        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        }
    }


    return {

        validateLine: validateLine
    }
});