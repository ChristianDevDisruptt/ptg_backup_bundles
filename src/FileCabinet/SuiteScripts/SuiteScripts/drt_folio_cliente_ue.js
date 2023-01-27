/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define([
    'N/record',
    'N/search'
], function (
    record,
    search
) {
    function afterSubmit(context) {
        try {
            if (
                context.type == context.UserEventType.CREATE ||
                context.UserEventType.EDIT ||
                context.Type == context.UserEventType.XEDIT
            ) {
                var folio = context.newRecord.getValue({
                    fieldId: 'custentity_drt_folio'
                }) || "";

                var folioText = '';

                log.audit({
                    title: 'folio',
                    details: JSON.stringify(folio)
                });
                if (
                    folio
                ) {

                    folioText = search.lookupFields({
                        type: 'customrecord_drt_folio',
                        id: folio,
                        columns: ['name']
                    }).name || '';

                    var result = search.create({
                        type: 'customrecord_drt_cliente_folio',
                        filters: [
                            ["isinactive", search.Operator.IS, "F"],
                            "AND",
                            ["custrecord_drt_cf_folio", search.Operator.IS, folio],
                            "AND",
                            ["custrecord_drt_cf_cliente", search.Operator.IS, context.newRecord.id]
                        ],
                        columns: ['custrecord_drt_cf_folio']
                    });
                    var resultData = result.run();
                    var start = 0;
                    var arrayFolioCliente = [];
                    do {
                        var resultSet = resultData.getRange(start, start + 1000);
                        if (resultSet && resultSet.length > 0) {
                            for (var i = 0; i < resultSet.length; i++) {
                                arrayFolioCliente.push(resultSet[i].id);
                            }
                        }
                        start += 1000;
                    } while (resultSet && resultSet.length == 1000);

                    log.audit({
                        title: 'arrayFolioCliente',
                        details: JSON.stringify(arrayFolioCliente)
                    });

                    for (var fc = 1; fc < arrayFolioCliente.length; fc++) {
                        var id = record.submitFields({
                            type: 'customrecord_drt_cliente_folio',
                            id: arrayFolioCliente[fc],
                            values: {
                                isinactive: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    }
                    var idFolioCliente = '';
                    if (arrayFolioCliente[0]) {
                        idFolioCliente = arrayFolioCliente[0];
                    } else {
                        var objRecord = record.create({
                            type: 'customrecord_drt_cliente_folio',
                            isDynamic: true
                        });

                        objRecord.setValue({
                            fieldId: 'custrecord_drt_cf_cliente',
                            value: context.newRecord.id
                        });
                        objRecord.setValue({
                            fieldId: 'custrecord_drt_cf_folio',
                            value: folio
                        });

                        idFolioCliente = objRecord.save({
                            enableSourcing: false,
                            ignoreMandatoryFields: false
                        });
                    }

                    var objSubmit = {
                        custentity_drt_consecutivo: 0
                    };
                    if (idFolioCliente) {
                        var result = search.create({
                            type: 'customrecord_drt_cliente_folio',
                            filters: [
                                ['isinactive', search.Operator.IS, 'F'],
                                'AND',
                                ['custrecord_drt_cf_folio', search.Operator.IS, folio]
                            ],
                            columns: //
                                [
                                    search.createColumn({
                                        name: "custrecord_drt_cf_cliente"
                                    }),
                                    search.createColumn({
                                        name: "internalid",
                                        sort: search.Sort.ASC,
                                        label: "Internal ID"
                                    })
                                ]
                        });
                        var resultData = result.run();
                        var start = 0;
                        var arrayFolioCliente = [];
                        do {
                            var resultSet = resultData.getRange(start, start + 1000);
                            if (resultSet && resultSet.length > 0) {
                                for (var i = 0; i < resultSet.length; i++) {
                                    objSubmit.custentity_drt_consecutivo++;
                                    if (resultSet[i].id == idFolioCliente) {
                                        break;
                                    }
                                }
                            }
                            start += 1000;
                        } while (resultSet && resultSet.length == 1000);
                        if (objSubmit.custentity_drt_consecutivo > 0) {
                            objSubmit.entityid = folioText + ' - ' + objSubmit.custentity_drt_consecutivo;
                        }
                    }
                    log.audit({
                        title: 'objSubmit',
                        details: JSON.stringify(objSubmit)
                    });
                    if (
                        Object.keys(objSubmit).length > 0
                    ) {

                        var id = record.submitFields({
                            type: context.newRecord.type,
                            id: context.newRecord.id,
                            values: objSubmit,
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                        log.audit({
                            title: 'id',
                            details: JSON.stringify(id)
                        });
                    } else {
                        log.audit({
                            title: 'noSeCumple',
                            details: JSON.stringify("noSeCumple")
                        });
                    }
                }
            }
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