/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
 define([
    'N/runtime',
    'N/record',
    'N/search'
],

function (
    runtime,
    record,
    search
) {
    function getInputData() {
        try {
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_search'
            }) || '';

            var daysago = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_daysago'
            }) || '';

            var subsidiary = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_subsidiary'
            }) || '';

            var respuesta = '';
            if (
                id_search
            ) {
                respuesta = search.load({
                    id: id_search
                });
            } else if (
                daysago &&
                subsidiary
            ) {
                respuesta = search.create({
                    type: search.Type.SALES_ORDER,
                    filters: [
                        ["subsidiary","anyof","2"], 
                        "AND", 
                        ["type","anyof","SalesOrd"], 
                        "AND", 
                        ["mainline","is","T"], 
                        //"AND", 
                        //["custbody_drt_response_wms","isempty",""], 
                        "AND", 
                        ["status","anyof","SalesOrd:A","SalesOrd:B","SalesOrd:D"],
                        "AND", 
                        ["custbody_disa_cierre_ov_aut","is","T"]
                    ],
                    columns: [
                        search.createColumn({name: "type", label: "Tipo"}),
                        search.createColumn({name: "trandate", label: "Fecha"}),
                        search.createColumn({name: "salesrep", label: "Representante de ventas"}),
                        search.createColumn({name: "location", label: "Ubicación"}),
                        search.createColumn({name: "entity", label: "Nombre"}),
                        search.createColumn({name: "statusref", label: "Estado"}),
                        search.createColumn({name: "amount", label: "Importe"}),
                        search.createColumn({name: "custbody_disa_cierre_ov_aut", label: "DISA - Cierre OV automatico"}),
                        search.createColumn({name: "custbodycustbody_disa_motivo_canc_ov", label: "DISA - Motivo de cancelación OV"})
                    ]
                }) || '';
            }
        } catch (error) {
            log.error({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'getInputData',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            var objvalue = JSON.parse(context.value) || {};
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });

        } finally {
            if (objvalue.id) {
                context.write({
                    key: objvalue.id,
                    value: objvalue
                });
            }
        }

    }

    function reduce(context) {
        try {
            log.audit({
                title: 'reduce',
                details: JSON.stringify(context)
            });
            var recordData = context.values || [];
            if (recordData.length > 0) {
                try {
                    var data = JSON.parse(recordData[0]);
                    log.debug({
                        title: 'data Type: ' + data.recordType + ' ID: ' + data.id,
                        details: JSON.stringify(data)
                    });
                    var cierre = data.values.custbody_disa_cierre_ov_aut;
                    log.debug('Entro al cierre?:', cierre);
                    log.debug('recordType', data.recordType);
                    if (
                        data.recordType &&
                        data.id && cierre == "T"
                    ) {
                        var saveRecord = false;
                        log.debug('Entro al if:', 'Si');

                        var objRecord = record.load({
                            type: data.recordType,
                            id: data.id,
                            isDynamic: true,
                        });

                        var sublist = 'item';

                        var numLines = objRecord.getLineCount({
                            sublistId: sublist
                        }) || 0;

                        log.debug('numLines', numLines); 

                        for (var line = 0; line < numLines; line++) {
                            objRecord.selectLine({
                                sublistId: sublist,
                                line: line
                            });

                            var quantity = objRecord.getCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantity',
                            }) || 0;
                            log.debug('quantity', quantity); 

                            var quantitybilled = objRecord.getCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantitybilled',
                            }) || 0;
                            log.debug('quantitybilled', quantitybilled); 

                            var isclosed = objRecord.getCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: 'isclosed',
                            });
                            log.debug('isclosed',isclosed ); 

                            var quantityfulfilled = objRecord.getCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantityfulfilled',
                            }) || objRecord.getCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: 'quantityreceived',
                            }) || 0;
                            log.debug('quantityfulfilled', quantityfulfilled); 

                            log.audit({
                                title: 'line: ' + line,
                                details:

                                    ' quantity: ' + quantity +
                                    ' quantitybilled: ' + quantitybilled +
                                    ' isclosed: ' + isclosed +
                                    ' quantityfulfilled: ' + quantityfulfilled
                            });
                            if (
                                // !isclosed &&
                                // quantitybilled == 0 &&
                                // quantityfulfilled == 0
                                !isclosed &&
                                quantity>quantitybilled &&
                                quantity>quantityfulfilled
                            ) {

                                objRecord.setCurrentSublistValue({
                                    sublistId: sublist,
                                    fieldId: 'isclosed',
                                    value: true
                                }) || '';

                                objRecord.commitLine({
                                    sublistId: sublist
                                });
                                saveRecord = true;
                            }
                        }
                        if (saveRecord) {
                            var recordId = objRecord.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }) || "";
                            log.audit({
                                title: 'recordId',
                                details: JSON.stringify(recordId)
                            });
                        }
                    }

                } catch (error) {
                    log.error({
                        title: 'error reduce',
                        details: JSON.stringify(error)
                    });

                } finally {}
            }
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }


    function summarize(context) {
        try {
            log.audit({
                title: 'summarize',
                details: JSON.stringify(context)
            });

        } catch (error) {
            log.error({
                title: 'error summarize',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize,
    }
}
);