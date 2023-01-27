/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define([
    'N/search'
], function (
    search
) {

    const beforeSubmit = (context) => {
        try {
            log.debug('beforeSubmit', `${context.type} ${context.newRecord.type} ${context.newRecord.id}`);
            const currentRecord = context.newRecord;
            if (
                context.type == context.UserEventType.CREATE ||
                context.type == context.UserEventType.EDIT
            ) {
                const objItem = {};
                const sublistId = 'item';
                const lineas = currentRecord.getLineCount({
                    sublistId: sublistId
                }) || "";

                for (let line = 0; line < lineas; line++) {
                    const item = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: sublistId,
                        line: line
                    });
                    const taxcode = currentRecord.getSublistValue({
                        sublistId: sublistId,
                        fieldId: "taxcode",
                        line: line
                    });
                    if (
                        !objItem[item]
                    ) {
                        objItem[item] = {
                            item: item,
                            taxcode: [],
                            line: [],
                        };
                    }
                    objItem[item].taxcode.push(taxcode);
                    objItem[item].line.push(line);
                }
                log.debug(`objItem`, objItem);
                const taxcode_item = searchRecord(
                    search.Type.ITEM,
                    [
                        ["internalid", search.Operator.ANYOF, Object.keys(objItem)],
                        "AND",
                        ["isinactive", search.Operator.IS, "F"],
                        "AND",
                        ["custitem_drt_impuesto_diot", search.Operator.NONEOF, "@NONE@"]
                    ],
                    [{
                        name: "custitem_drt_impuesto_diot"
                    }]
                );
                for (let item in taxcode_item) {
                    const element = taxcode_item[item];
                    if (
                        !!element.id &&
                        !!objItem[element.id]
                    ) {
                        objItem[element.id].line.forEach(line => {
                            if (
                                !!element.id &&
                                !!objItem[element.id]
                            ) {
                                currentRecord.setSublistValue({
                                    sublistId: sublistId,
                                    fieldId: 'taxcode',
                                    value: element.custitem_drt_impuesto_diot,
                                    line: line,
                                });
                            }
                        });
                    }
                };
            }
        } catch (e) {
            log.error(`error beforeSubmit`, e);
        }
    }

    const searchRecord = (param_type, param_filters, param_column) => {
        log.debug(`searchRecord param_type:${param_type} param_filters:`, param_filters);
        log.debug(`searchRecord param_type:${param_type} param_column:`, param_column);
        const respuesta = [];
        try {
            if (
                !!param_type &&
                !!param_filters &&
                !!param_column
            ) {
                const result = search.create({
                    type: param_type,
                    filters: param_filters,
                    columns: param_column
                });
                const resultData = result.run();
                let start = 0;
                let resultSet = "";
                do {
                    resultSet = resultData.getRange(start, start + 1000);
                    if (resultSet && resultSet.length > 0) {
                        for (let i = 0; i < resultSet.length; i++) {
                            const result = resultSet[i];
                            const objResult = {
                                id: result.id
                            };
                            param_column.forEach(element => {
                                objResult[`${element.name}${element.join||""}`] = result.getValue(element) || '';
                            });
                            respuesta.push(objResult);
                        }
                    }
                    start += 1000;
                } while (resultSet && resultSet.length == 1000);
            }
        } catch (error) {
            log.error(`error searchRecord ${param_type}`, searchRecord);
        } finally {
            log.debug(`searchRecord ${param_type} ${respuesta.length}`, respuesta);
            return respuesta;
        }
    }
    return {
        beforeSubmit
    }
});