/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/search', 'N/ui/message', 'N/record'], function (search, message, record) {

    function saveRecord(context) {
        try {
            var createItem = true;
            var ct = context.currentRecord;
            var item = ct.getValue({
                fieldId: 'itemid'
            }) || "";

            var inventoryitemSearchObj = search.create({
                type: record.Type.INVENTORY_ITEM,
                filters: [
                    ["type", "anyof", "InvtPart"],
                    "AND",
                    ["name", "haskeywords", item]
                ],
                columns: [
                    search.createColumn({
                        name: "itemid",
                        sort: search.Sort.ASC,
                        label: "Nombre"
                    })
                ]
            });
            var srchResults = inventoryitemSearchObj.run().getRange({
                start: 0,
                end: 999
            });

            console.log('srchResults', srchResults);

            if (srchResults.length > 0) {
                debugger;
                createItem = false;
                var msgError = message.create({
                    title: 'My Title',
                    message: 'El articulo ya existe',
                    type: message.Type.ERROR
                });
                msgError.show({
                    duration: 15000 // will disappear after 5s
                });
            } else {
                createItem = true;
                var msgCreate = message.create({
                    title: 'My Title',
                    message: 'El articulo se guardo con exito',
                    type: message.Type.CONFIRMATION
                });
                msgCreate.show({
                    duration: 15000 // will disappear after 5s
                });
            }
        } catch (error) {
            log.audit('error', error);
        } finally {
            return createItem;
        }
    }

    return {
        saveRecord: saveRecord
    }
});