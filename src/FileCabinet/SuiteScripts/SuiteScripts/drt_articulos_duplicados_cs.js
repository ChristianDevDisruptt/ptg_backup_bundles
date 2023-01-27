/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
    'N/ui/message',
    'N/ui/dialog'
], function (
    message,
    dialog
) {
    function saveRecord(context) {
        try {
            var returnTransaction = true;

            var sublist = 'item';
            var LineCount = context.currentRecord.getLineCount({
                sublistId: sublist
            });
            log.audit({
                title: 'LineCount',
                details: JSON.stringify(LineCount)
            });
            var objItem = {};
            var messageItem = '';
            for (var line = 0; line < LineCount; line++) {
                var item = context.currentRecord.getSublistValue({
                    sublistId: sublist,
                    fieldId: 'item',
                    line: line
                });
                var itemText = context.currentRecord.getSublistText({
                    sublistId: sublist,
                    fieldId: 'item',
                    line: line
                });
                var itemtype = context.currentRecord.getSublistValue({
                    sublistId: sublist,
                    fieldId: 'itemtype',
                    line: line
                });
                if( itemtype != 'Discount' ) {
                    if (!objItem[item]) {
                        objItem[item] = {
                            item: itemText,
                            line: []
                        }
                    }
                    objItem[item].line.push((line + 1));
                }
            }
            log.audit({
                title: 'objItem',
                details: JSON.stringify(objItem)
            });
            for (var o in objItem) {
                if (objItem[o].line.length > 1) {
                    messageItem += ' El articulo: ' + objItem[o].item + ' se encuentra duplicado en la linea: ' + objItem[o].line.join() + ' .\n';
                }
            }

            log.audit({
                title: 'messageItem',
                details: JSON.stringify(messageItem)
            });
            if (
                messageItem != ''
            ) {
                /* 
                showmessage({
                        title: "Articulo Duplicado",
                        message: messageItem,
                        type: message.Type.ERROR
                    },
                    0,
                    false
                ); 
                */
                alert(messageItem);
                returnTransaction = false;
            } else {
                returnTransaction = true;
            }

        } catch (error) {
            log.error({
                title: 'error saveRecord',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'returnTransaction',
                details: JSON.stringify(returnTransaction)
            });
            return returnTransaction;
        }
    }

    function validateLine(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            if (sublistName === 'item') {
                var returnTransaction = true;

                var sublist = 'item';
                var LineCount = context.currentRecord.getLineCount({
                    sublistId: sublist
                });
                log.audit({
                    title: 'LineCount',
                    details: JSON.stringify(LineCount)
                });
                var objItem = {};
                var messageItem = '';
                for (var line = 0; line < LineCount; line++) {
                    var item = context.currentRecord.getSublistValue({
                        sublistId: sublist,
                        fieldId: 'item',
                        line: line
                    });
                    var itemText = context.currentRecord.getSublistText({
                        sublistId: sublist,
                        fieldId: 'item',
                        line: line
                    });

                    var itemtype = context.currentRecord.getSublistValue({
                        sublistId: sublist,
                        fieldId: 'itemtype',
                        line: line
                    });

                    if( itemtype != 'Discount' ) {
                        if (!objItem[item]) {
                            objItem[item] = {
                                item: itemText,
                                line: []
                            }
                        }
                        objItem[item].line.push((line + 1));
                    }
                }
                log.audit({
                    title: 'objItem',
                    details: JSON.stringify(objItem)
                });
                for (var o in objItem) {
                    if (objItem[o].line.length > 1) {
                        messageItem += ' El articulo: ' + objItem[o].item + ' se encuentra duplicado en la linea: ' + objItem[o].line.join() + ' .\n';
                    }
                }

                log.audit({
                    title: 'messageItem',
                    details: JSON.stringify(messageItem)
                });
                if (
                    messageItem != ''
                ) {
                    showmessage({
                            title: "Articulo Duplicado",
                            message: messageItem,
                            type: message.Type.ERROR
                        },
                        0,
                        false
                    );

                    returnTransaction = false;
                } else {
                    returnTransaction = true;
                }
            }
        } catch (error) {
            log.error({
                title: 'validateLine',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'returnTransaction',
                details: JSON.stringify(returnTransaction)
            });
            return returnTransaction;
        }
    }

    function showmessage(param_message, param_duration, param_show) {
        try {
            if (param_show) {
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
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options);
            }

        } catch (error) {
            log.error({
                title: 'error showmessage',
                details: JSON.stringify(error)
            });
        }
    }



    return {
        // validateLine: validateLine,
        saveRecord: saveRecord
    }
});