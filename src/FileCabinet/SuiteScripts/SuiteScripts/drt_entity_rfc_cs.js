/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([
    'N/ui/message',
    'N/ui/dialog',
    'N/search'
], function (
    message,
    dialog,
    search
) {


    function saveRecord(context) {
        try {
            debugger;
            var rfcValid = ['AAA010101AAA', 'XEXX010101XXX', 'XAXX010101000'];
            var returnTransaction = true;
            var rfc = context.currentRecord.getValue({
                fieldId: 'custentity_mx_rfc'
            }) || "";
            var subsidiary = context.currentRecord.getValue({
                fieldId: 'subsidiary'
            }) || "";
            console.log(context.currentRecord);

            if (
                rfc &&
                rfcValid.indexOf(rfc) < 0
            ) {
                var filtersSearch = [
                    ["custentity_mx_rfc", "is", rfc]
                ];
                filtersSearch.push("AND");
                filtersSearch.push(["subsidiary", "anyof", subsidiary]);
                if (
                    context &&
                    context.currentRecord &&
                    context.currentRecord.id
                ) {
                    filtersSearch.push("AND");
                    filtersSearch.push(["internalid", "noneof", context.currentRecord.id]);
                }
                var arryId = [];
                var entitySearchObj = search.create({
                    type: context.currentRecord.type,
                    filters: filtersSearch,
                    columns: [
                        search.createColumn({
                            name: "custentity_mx_rfc",
                            label: "RFC"
                        }),
                        search.createColumn({
                            name: "entityid"
                        })
                    ]
                });
                console.log('entitySearchObj',entitySearchObj);
                var searchResultCount = entitySearchObj.runPaged().count;
                console.log("entitySearchObj result count " + searchResultCount);
                log.audit("entitySearchObj result count " + searchResultCount);
                entitySearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    arryId.push(result.getValue({
                        name: "entityid",
                    }) || result.id);
                    return true;
                });
                log.audit('arryId',arryId);
                if (arryId.length > 0) {
                    returnTransaction = false;
                    alert("El RFC: " + rfc + ' no es valido, ya que se dio de alta antes en: ' + arryId.join());
                    // showmessage({
                    //         title: "Error",
                    //         message: "El RFC: " + rfc + ' no es valido, ya que se dio de alta antes en: ' + arryId.join(),
                    //         type: message.Type.ERROR
                    //     },
                    //     0,
                    //     true
                    // );
                }
            }
        } catch (error) {
            console.log('error ' + JSON.stringify(error));
        } finally {
            console.log("returnTransaction " + returnTransaction)
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
        saveRecord: saveRecord
    }
});