/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define([
        'N/search',
        'N/runtime',
        'N/task'
    ],
    function (
        search,
        runtime,
        task
    ) {


        function execute(context) {
            try {
                var id_search = runtime.getCurrentScript().getParameter({
                    name: 'custscript_drt_tc_csv_import_search'
                }) || '';

                var mappingId = runtime.getCurrentScript().getParameter({
                    name: 'custscript_drt_tc_mappingid_item'
                }) || '';

                var mappingApply = runtime.getCurrentScript().getParameter({
                    name: 'custscript_drt_tc_mappingid_apply'
                }) || '';


                if (
                    id_search &&
                    mappingApply &&
                    mappingId
                ) {




                    var csvApply = "External,Cliente,Apply,Line,Payment";
                    var csvItem = "External ID,Cliente,Fecha,Monto,Moneda,Taxcode,Location";
                    var d = new Date();
                    var dd = (d.getDate() + 100).toString().substr(1, 2);
                    var MM = (d.getMonth() + 101).toString().substr(1, 2);
                    var yy = d.getFullYear();

                    var Fecha = dd + '/' + MM + '/' + yy;
                    var externalId = d.getTime();

                    var mySearch1 = search.load({
                        id: id_search
                    });
                    var resultData = mySearch1.run();
                    var start = 0;
                    var objTotal = {};
                    do {
                        var resultSet = resultData.getRange(start, start + 1000);
                        if (resultSet && resultSet.length > 0) {
                            for (var i = 0; i < resultSet.length; i++) {
                                var entity = resultSet[i].getValue({
                                    name: "entity"
                                }) || '';
                                var id = resultSet[i].id
                                var amountremaining = resultSet[i].getValue({
                                    name: "amountremaining"
                                }) || 0;
                                var currency = resultSet[i].getValue({
                                    name: "currency"
                                }) || '';
                                var subsidiary = resultSet[i].getValue({
                                    name: "subsidiary"
                                }) || '';
                                var location = resultSet[i].getValue({
                                    name: "location"
                                }) || '';
                                var externalLine = 'drt' + externalId + '' + entity + '' + subsidiary;
                                var Monto = amountremaining;
                                if (!objTotal[externalLine]) {
                                    objTotal[externalLine] = {
                                        externalLine: externalLine,
                                        entity: entity,
                                        Fecha: Fecha,
                                        Monto: 0,
                                        id: id,
                                        currency: currency,
                                        subsidiary: subsidiary,
                                        location: location,
                                    };
                                }
                                objTotal[externalLine].Monto += parseFloat(Monto);

                                csvApply += " \n ";
                                csvApply += externalLine;
                                csvApply += ",";
                                csvApply += entity;
                                csvApply += ",";
                                csvApply += id;
                                csvApply += ",";
                                csvApply += 0;
                                csvApply += ",";
                                csvApply += Monto;
                            }
                        }
                        start += 1000;
                    } while (resultSet && resultSet.length == 1000);

                    for (var el in objTotal) {
                        csvItem += " \n ";
                        csvItem += objTotal[el].externalLine;
                        csvItem += ",";
                        csvItem += objTotal[el].entity;
                        csvItem += ",";
                        csvItem += objTotal[el].Fecha;
                        csvItem += ",";
                        csvItem += objTotal[el].Monto;
                        csvItem += ",";
                        csvItem += objTotal[el].currency;
                        csvItem += ",";
                        if (parseFloat(objTotal[el].Monto) > 1) {
                            // 6 IVA 16 %
                            csvItem += 6;
                        } else {
                            // 7 IVA 0 %
                            csvItem += 7;
                        }
                        csvItem += ",";
                        csvItem += objTotal[el].location || "";

                    }
                    log.audit({
                        title: 'csvItem',
                        details: JSON.stringify(csvItem)
                    });

                    log.audit({
                        title: 'csvApply',
                        details: JSON.stringify(csvApply)
                    });


                    var scriptTask = task.create({
                        taskType: task.TaskType.CSV_IMPORT
                    });
                    scriptTask.mappingId = runtime.getCurrentScript().getParameter({
                        name: 'custscript_drt_tc_mappingid_item'
                    }) || '';
                    scriptTask.importFile = csvItem;
                    scriptTask.name = "Transaction Credit Item: " + Fecha;
                    var taskIdItem = scriptTask.submit() || "";
                    log.audit({
                        title: 'taskIdItem',
                        details: JSON.stringify(taskIdItem)
                    });

                    //Apply
                    var scriptTaskApply = task.create({
                        taskType: task.TaskType.CSV_IMPORT
                    });
                    scriptTaskApply.mappingId = runtime.getCurrentScript().getParameter({
                        name: 'custscript_drt_tc_mappingid_apply'
                    }) || '';
                    scriptTaskApply.importFile = csvApply;
                    scriptTaskApply.name = "Transaction Credit Apply: " + Fecha;
                    var taskIdApply = scriptTaskApply.submit() || "";
                    log.audit({
                        title: 'taskIdApply',
                        details: JSON.stringify(taskIdApply)
                    });

                }
            } catch (error) {
                log.audit({
                    title: 'execute',
                    details: JSON.stringify(error)
                });
            }
        }

        return {
            execute: execute
        }
    });