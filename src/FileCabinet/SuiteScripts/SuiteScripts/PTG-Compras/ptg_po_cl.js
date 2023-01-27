/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search"], function (search) {

    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;

            if (sublistFieldName === 'custbody_ptg_centroembarcadordestino_') {
                var ubicacion1 = currentRecord.getValue({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                });

                var centroEnbarcadorDestinoText = currentRecord.getText({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                });

                log.audit('ubicacion1', ubicacion1);
                log.audit('centroEnbarcadorDestinoText', centroEnbarcadorDestinoText);

                if (ubicacion1) {
                    var customrecord_ptg_centro_embar_destino_SearchObj = search.create({
                        type: "customrecord_ptg_centro_embar_destino_",
                        filters: [
                            ["internalid", "anyof", ubicacion1]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_ptg_planta_centro_embar_",
                                label: "PTG -Planta"
                            })
                        ]
                    });
                    var searchResult = customrecord_ptg_centro_embar_destino_SearchObj.run().getRange(0, 1);
                    log.audit('searchResult.length', searchResult.length)
                    if (searchResult.length > 0) {

                        var planta = searchResult[0].getValue({
                            name: "custrecord_ptg_planta_centro_embar_"
                        })
                        currentRecord.setValue({
                            fieldId: 'location',
                            value: planta
                        })
                    }

                }
            }

            if (sublistName === 'item' && sublistFieldName === 'custcol_ptg_plantadesvio_') {
                debugger
                var plantaDesvio = currentRecord.getCurrentSublistValue('item', 'custcol_ptg_plantadesvio_') || '';
                log.audit('plantaDesvio', plantaDesvio)

                if (plantaDesvio) {
                    var subsidiaria = search.lookupFields({
                        type: 'location',
                        id: plantaDesvio,
                        columns: ['subsidiary']
                    });

                    log.audit('subsidiaria', subsidiaria);

                    currentRecord.setCurrentSublistText('item', 'custcol_ptg_subsidiaria_', subsidiaria.subsidiary);
                }
            }
        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        fieldChanged: fieldChanged
    }
});