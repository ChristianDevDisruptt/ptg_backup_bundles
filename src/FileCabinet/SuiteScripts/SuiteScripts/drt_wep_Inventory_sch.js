/**
 *@NApiVersion 2.1
 *@NScriptType ScheduledScript
 */
define([
    'N/task',
    'N/runtime',
    'N/format',
    'N/search',
    'N/record',
    'N/file'
], function (
    task,
    runtime,
    format,
    search,
    record,
    file
) {

    function execute(context) {
        try {
            var busqueda = "";
            var idRecord = '';
            var idImportCSV = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_wep_inventory_id_csv'
            }) || ''
            if (idImportCSV) {
                var customrecord_wep_inventory_wmsSearchObj = search.create({
                    type: "customrecord_wep_inventory_wms",
                    filters: [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["custrecord_wms_inventory_terminado", "is", "F"],
                        "AND",
                        ["custrecord_wms_inventory_procesando", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "custrecord_wms_inventory_summary_json",
                        })
                    ]
                });
                var searchResultCount = customrecord_wep_inventory_wmsSearchObj.runPaged().count;
                log.debug("customrecord_wep_inventory_wmsSearchObj result count", searchResultCount);
                customrecord_wep_inventory_wmsSearchObj.run().each(function (result) {
                    var summary_json = result.getValue({
                        name: "custrecord_wms_inventory_summary_json",
                    }) || '';
                    log.audit({
                        title: 'summary_json',
                        details: JSON.stringify(summary_json)
                    });
                    if (
                        summary_json
                    ) {
                        idRecord = result.id;
                        record.submitFields({
                            type: "customrecord_wep_inventory_wms",
                            id: idRecord,
                            values: {
                                custrecord_wms_inventory_procesando: true
                            },
                            options: {
                                enablesourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                        var fileObj = file.load({
                            id: summary_json
                        });
                        var contents = fileObj.getContents();
                        busqueda = JSON.parse(contents);
                        for (var b in busqueda) {
                            busqueda[b].id = result.id;
                        }
                        return false;
                    } else {
                        return true;

                    }
                });

                log.audit({
                    title: 'busqueda',
                    details: JSON.stringify(busqueda)
                });
                if (
                    busqueda &&
                    busqueda.length > 0
                ) {
                    var csvDetalle = "custrecord_drt_wep_id_linea,custrecord_drt_wep_id_solicitud,custrecord_drt_wep_id_sku_wms,custrecord_drt_wep_id_ubicacion_wms,custrecord_drt_wep_id_ubicacion_tx_wms,custrecord_drt_wep_id_warehouse,custrecord_drt_wep_id_cantidad_wms,custrecord_drt_wep_id_lote_wms,custrecord_drt_wep_id_fecha_wms,custrecord_drt_wep_json";
                    var line = 0;
                    for (line; line < busqueda.length; line++) {
                        var objCreate = {
                            custrecord_drt_wep_json: JSON.stringify(busqueda[line])
                        };
                        var objData = busqueda[line];
                        if (objData.id) {
                            objCreate.custrecord_drt_wep_id_solicitud = objData.id;
                        }
                        if (
                            objData.product &&
                            objData.product.sku
                        ) {
                            objCreate.custrecord_drt_wep_id_sku_wms = objData.product.sku;
                        }
                        if (
                            objData.area &&
                            objData.area.code
                        ) {
                            objCreate.custrecord_drt_wep_id_ubicacion_wms = objData.area.code;
                        }
                        if (
                            objData.area &&
                            objData.area.description
                        ) {
                            objCreate.custrecord_drt_wep_id_ubicacion_tx_wms = objData.area.description;
                        }
                        if (
                            objData.warehouse &&
                            objData.warehouse.code
                        ) {
                            objCreate.custrecord_drt_wep_id_warehouse = objData.warehouse.code;
                        }
                        if (objData.quantity) {
                            objCreate.custrecord_drt_wep_id_cantidad_wms = objData.quantity;
                        }
                        if (objData.lot) {
                            objCreate.custrecord_drt_wep_id_lote_wms = objData.lot;
                        }
                        objCreate.custrecord_drt_wep_id_linea = (line + 1);
                        if (objData.dateConsulted) {
                            objCreate.custrecord_drt_wep_id_fecha_wms = format.parse({
                                value: new Date(objData.dateConsulted),
                                type: format.Type.DATE
                            });
                        }

                        csvDetalle += " \n ";

                        if (objCreate.custrecord_drt_wep_id_linea) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_linea;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_solicitud) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_solicitud;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_sku_wms) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_sku_wms;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_ubicacion_wms) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_ubicacion_wms;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_ubicacion_tx_wms) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_ubicacion_tx_wms;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_warehouse) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_warehouse;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_cantidad_wms) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_cantidad_wms;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_lote_wms) {
                            csvDetalle += objCreate.custrecord_drt_wep_id_lote_wms;
                        }
                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_id_fecha_wms) {
                            var d = new Date(objData.dateConsulted);
                            var dd = (d.getDate() + 100).toString().substr(1, 2);
                            var MM = (d.getMonth() + 101).toString().substr(1, 2);
                            var yy = d.getFullYear();

                            var Fecha = dd + '/' + MM + '/' + yy;
                            csvDetalle += Fecha;
                        }

                        csvDetalle += ",";

                        if (objCreate.custrecord_drt_wep_json) {
                            csvDetalle += objCreate.custrecord_drt_wep_json.replace(/,/g, '\t');
                        }
                    }


                    log.audit({
                        title: 'csvDetalle',
                        details: JSON.stringify(csvDetalle)
                    });

                    if (csvDetalle != "custrecord_drt_wep_id_linea,custrecord_drt_wep_id_solicitud,custrecord_drt_wep_id_sku_wms,custrecord_drt_wep_id_ubicacion_wms,custrecord_drt_wep_id_ubicacion_tx_wms,custrecord_drt_wep_id_warehouse,custrecord_drt_wep_id_cantidad_wms,custrecord_drt_wep_id_lote_wms,custrecord_drt_wep_id_fecha_wms,custrecord_drt_wep_json") {
                        var scriptTask = task.create({
                            taskType: task.TaskType.CSV_IMPORT
                        });
                        scriptTask.mappingId = idImportCSV;
                        scriptTask.importFile = csvDetalle;
                        scriptTask.name = 'DISA - WEP Inventory WMS: ' + idRecord;
                        var taskIdItem = scriptTask.submit() || "";
                        log.audit({
                            title: 'taskIdItem',
                            details: JSON.stringify(taskIdItem)
                        });
                    }
                    record.submitFields({
                        type: "customrecord_wep_inventory_wms",
                        id: idRecord,
                        values: {
                            custrecord_wms_inventory_terminado: true,
                            custrecord_wms_inventory_procesando: false
                        },
                        options: {
                            enablesourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                }
            }
        } catch (error) {
            log.error({
                title: 'error execute',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        execute: execute
    }
});