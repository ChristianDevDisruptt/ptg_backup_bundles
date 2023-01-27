/**
 * @NApiVersion 2.1
 */
define([
    'N/record',
    'N/format',
    'N/search'
], (
    record,
    format,
    search
) => {

    const lotesFaltantes = (inputContext) => {
        let respuesta = [];
        try {
            // const objConexionWep = {
            //     custrecord_drt_wep_id_solicitud: 44301
            // };
            const objConexionWep = ultimaConexionWep();
            if (
                Object.keys(objConexionWep).length > 0
            ) {
                const colums_wep_detalle = [{
                        name: "custrecord_drt_wep_id_solicitud"
                    },
                    {
                        name: "custrecord_drt_wep_id_linea"
                    },
                    {
                        name: "custrecord_drt_wep_id_fecha_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_sku_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_cantidad_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_lote_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_ubicacion_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_ubicacion_tx_wms"
                    },
                    {
                        name: "custrecord_drt_wep_id_warehouse"
                    },
                    {
                        name: "custrecord_drt_wep_id_sku_netsuite"
                    },
                    {
                        name: "custrecord_drt_wep_id_cantidad_netsuite"
                    },
                    {
                        name: "custrecord_drt_wep_id_lote_netsuite"
                    },
                    {
                        name: "custrecord_drt_wep_id_ubicacion_netsuite"
                    },
                    {
                        name: "custrecord_drt_wep_json"
                    },
                ];

                respuesta = arraySearchRecord(
                    "customrecord_wep_inventory_details",
                    [
                        ["isinactive", search.Operator.IS, "F"],
                        "AND",
                        // ["custrecord_drt_wep_id_netsuite", search.Operator.IS, "F"],
                        // "AND",
                        ["custrecord_drt_wep_id_solicitud", search.Operator.IS, objConexionWep["custrecord_drt_wep_id_solicitud"]],
                        "AND",
                        ["custrecord_drt_wep_id_ubicacion_netsuite", search.Operator.ISNOTEMPTY, ''],
                        "AND",
                        ["custrecord_drt_wep_id_lote_netsuite", search.Operator.ISNOTEMPTY, '']
                    ],
                    colums_wep_detalle
                );
            }
        } catch (error) {
            log.error(`error lotesFaltantes`, error);
        } finally {
            log.debug(`respuesta lotesFaltantes ${respuesta.length}`, respuesta);
            return respuesta;
        }
    }

    const nuevosRegistros = (param_item, param_lote, param_location, param_solicitud) => {
        log.debug(`nuevosRegistros param_item`, param_item);
        log.debug(`nuevosRegistros param_lote`, param_lote);
        log.debug(`nuevosRegistros param_location`, param_location);
        log.debug(`nuevosRegistros param_solicitud`, param_solicitud);
        const respuesta = {
            success: false,
            solicitud: param_solicitud[0] || "",
            data: [],
            error: [],
        };
        try {
            if (
                !!param_item &&
                !!respuesta.solicitud
            ) {
                respuesta.success = true;
                const arrayFilters = [
                    ["quantityonhand", search.Operator.GREATERTHAN, "0"],
                    "AND",
                    ["item", search.Operator.ANYOF, param_item],
                ];

                const colums_netsuite_detalle = [{
                        name: "inventorynumber"
                    },
                    {
                        name: "item"
                    },
                    {
                        name: "quantityonhand"
                    },
                    {
                        name: "location"
                    },
                ];
                if (
                    !!param_lote &&
                    param_lote.length > 0
                ) {
                    arrayFilters.push("AND");
                    arrayFilters.push(["internalid", search.Operator.NONEOF, param_lote]);
                }
                if (
                    !!param_location &&
                    param_location.length > 0
                ) {
                    arrayFilters.push("AND");
                    arrayFilters.push(["location", search.Operator.ANYOF, param_location]);
                }
                arraySearchRecord(
                    search.Type.INVENTORY_NUMBER,
                    arrayFilters,
                    colums_netsuite_detalle
                ).map(element => {
                    const objCreate = {
                        custrecord_drt_wep_id_solicitud: respuesta.solicitud || "",
                        custrecord_drt_wep_id_sku_netsuite: element["item"] || "",
                        custrecord_drt_wep_id_cantidad_netsuite: element["quantityonhand"] || 0,
                        custrecord_drt_wep_id_lote_netsuite: element["id"] || "",
                        custrecord_drt_wep_id_ubicacion_netsuite: element["location"] || "",
                        custrecord_drt_wep_id_netsuite: true,
                    };
                    const newRecord = createRecord("customrecord_wep_inventory_details", objCreate);
                    if (
                        newRecord.success
                    ) {
                        respuesta.data.push(newRecord.data);
                    } else if (
                        !!newRecord.error
                    ) {
                        respuesta.data.push(newRecord.error);
                    } else {
                        respuesta.error.push(`Error con JSON ${JSON.stringify(objCreate)}`);
                    }
                });
            }
        } catch (error) {
            log.error(`error nuevosRegistros`, error);
        } finally {
            log.debug(`respuesta nuevosRegistros `, respuesta);
            return respuesta;
        }
    }

    const ultimaConexionWep = () => {
        let respuesta = {};
        try {
            const colums_conexion_wep = [{
                    name: "custrecord_wms_inventory_procesando"
                },
                {
                    name: "custrecord_wms_inventory_terminado"
                },
                {
                    name: "custrecord_wms_inventory_type"
                },
                {
                    name: "custrecord_wms_inventory_numero_registro"
                },
                {
                    name: "custrecord_wms_inventory_fecha_consulta"
                },
                {
                    name: "custrecord_wms_inventory_fecha_hora"
                },
                {
                    name: "custrecord_wms_inventory_summary_json"
                },
                {
                    name: "custrecord_wms_inventory_netsuite"
                },
            ];

            const array_conexion_wep = arraySearchRecord(
                "customrecord_wep_inventory_wms",
                [
                    ["isinactive", search.Operator.IS, "F"],
                    "AND",
                    ["custrecord_wms_inventory_procesando", search.Operator.IS, "F"],
                    "AND",
                    ["custrecord_wms_inventory_terminado", search.Operator.IS, "T"],
                    "AND",
                    ["custrecord_wms_inventory_netsuite", search.Operator.IS, "F"]
                ],
                colums_conexion_wep
            );

            if (
                array_conexion_wep.length > 0
            ) {
                const element = array_conexion_wep.pop();
                respuesta["custrecord_drt_wep_id_solicitud"] = element["id"] || "";
                // respuesta["custrecord_drt_wep_id_fecha_wms"] = format.format({
                //     value: format.parse({
                //         value: element["custrecord_wms_inventory_fecha_consulta"],
                //         type: format.Type.DATE
                //     }),
                //     type: format.Type.DATE
                // });
            }
        } catch (error) {
            log.error(`error ultimaConexionWep`, error);
        } finally {
            log.debug(`respuesta ultimaConexionWep`, respuesta);
            return respuesta;
        }
    }

    const arraySearchRecord = (param_type, param_filters, param_columns) => {
        const respuesta = [];
        try {

            log.debug(`arraySearchRecord ${param_type}`, param_filters);
            log.debug(`arraySearchRecord ${param_type}`, param_columns);
            const objSearch = search.create({
                type: param_type,
                filters: param_filters,
                columns: param_columns,
            });

            log.debug(`objSearch count`, objSearch.runPaged().count);
            let start = 0;
            let resultSet = "";
            do {
                resultSet = objSearch.run().getRange(start, start + 1000);
                if (
                    resultSet &&
                    resultSet.length > 0
                ) {
                    for (let i = 0; i < resultSet.length; i++) {
                        const result = resultSet[i];
                        const objRessult = {
                            id: result.id,
                            recordType: result.recordType,
                        };
                        param_columns.map(element => {
                            objRessult[`${element.name || ""}${element.join || ""}`] = result.getValue(element);
                            objRessult[`${element.name || ""}${element.join || ""}_text`] = result.getText(element);
                        });
                        respuesta.push(objRessult);
                    }
                }
                start += 1000;
            } while (resultSet && resultSet.length == 1000);
        } catch (error) {
            log.error(`error arraySearchRecord`, error);
        } finally {
            log.debug(`arraySearchRecord ${param_type} ${respuesta.length}`, respuesta);
            if (
                respuesta.length > 0
            ) {
                log.audit(`resultado de busqueda ${param_type} ${respuesta.length}`, param_columns);
                log.audit(`resultado de busqueda ${param_type} ${respuesta.length}`, param_filters);
                log.audit(`resultado de busqueda ${param_type} ${respuesta.length}`, respuesta);
            }
            return respuesta;
        }
    }

    const createRecord = (param_type, objField) => {
        const respuesta = {
            success: false,
            data: "",
            error: ""
        };
        try {
            log.debug(`createRecord ${param_type}`, objField);
            const objRecord = record.create({
                type: param_type,
                isDynamic: true
            });

            for (const field in objField) {
                try {
                    objRecord.setValue(field, objField[field]);
                } catch (errorSetValue) {
                    log.error(`error errorSetValue ${field} ${objField[field]}`, errorSetValue);
                    return respuesta;
                }
            }

            respuesta.data = objRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: false
            }) || "";
            respuesta.success = !!respuesta.data;
        } catch (error) {
            log.error(`error createRecord`, error);
            respuesta.error = error.message;
        } finally {
            log.debug(`respuesta createRecord`, respuesta);
            if (
                respuesta.success
            ) {
                log.audit(`resultado de createRecord ${param_type} ${JSON.stringify(respuesta)}`, objField);
            }
            return respuesta;
        }
    }

    const updateRecord = (param_type, param_id, param_values) => {
        const respuesta = {
            success: false,
            data: ""
        };
        try {
            log.debug(`updateRecord param_type: ${param_type} param_id: ${param_id} `, param_values);
            if (
                !!param_type &&
                !!param_id &&
                !!param_values &&
                Object.keys(param_values).length > 0
            ) {
                respuesta.data = record.submitFields({
                    type: param_type,
                    id: param_id,
                    values: param_values,
                });
            }
            respuesta.success = !!respuesta.data;
        } catch (error) {
            log.error(`error updateRecord param_type: ${param_type} param_id: ${param_id}`, error);
        } finally {
            log.debug(`respuesta updateRecord param_type: ${param_type} param_id: ${param_id}`, respuesta);
            return respuesta;
        }
    }

    return {
        nuevosRegistros,
        lotesFaltantes,
        updateRecord,
        createRecord,
        arraySearchRecord,
    }

});