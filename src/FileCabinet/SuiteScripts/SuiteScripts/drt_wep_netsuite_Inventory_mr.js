/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define([
    'SuiteScripts/drt_custom_module/drt_wep_Inventory_cm'
], (
    drt_wep_inventory_cm
) => {

    const getInputData = () => {
        return drt_wep_inventory_cm.lotesFaltantes();
    }

    const map = (mapContext) => {
        // log.debug(`map`, mapContext);
        const objRecord = JSON.parse(mapContext.value);
        if (
            !!objRecord.custrecord_drt_wep_id_sku_netsuite
        ) {
            mapContext.write({
                key: objRecord.custrecord_drt_wep_id_sku_netsuite,
                value: {
                    ubicacion: objRecord.custrecord_drt_wep_id_ubicacion_netsuite || "",
                    lote: objRecord.custrecord_drt_wep_id_lote_netsuite || "",
                    solicitud: objRecord.custrecord_drt_wep_id_solicitud || "",
                }
            });
        }
    }

    const reduce = (reduceContext) => {
        try {
            log.debug(`reduceContext`, reduceContext.values);
            const arrayLocation = [];
            const arrayLote = [];
            const arraySolicitud = [];
            reduceContext.values.forEach(objRecord => {
                objRecord = JSON.parse(objRecord);
                if (
                    !!objRecord.ubicacion &&
                    arrayLocation.indexOf(objRecord.ubicacion) === -1
                ) {
                    arrayLocation.push(objRecord.ubicacion);
                }
                if (
                    !!objRecord.lote &&
                    arrayLote.indexOf(objRecord.lote) === -1
                ) {
                    arrayLote.push(objRecord.lote);
                }
                if (
                    !!objRecord.solicitud &&
                    arraySolicitud.indexOf(objRecord.solicitud) === -1
                ) {
                    arraySolicitud.push(objRecord.solicitud);
                }

            });
            const conciliacion = drt_wep_inventory_cm.nuevosRegistros(reduceContext.key, arrayLote, arrayLocation, arraySolicitud);
            if (
                conciliacion.success
            ) {
                reduceContext.write({
                    key: conciliacion.solicitud,
                    value: conciliacion.data.join(", "),
                });
            } else if (
                !!conciliacion.error &&
                conciliacion.error.length > 0
            ) {
                reduceContext.write({
                    key: `error_a`,
                    value: conciliacion.error.join(", "),
                });
            } else {
                reduceContext.write({
                    key: `error_b`,
                    value: `Item: ${reduceContext.key}, Solicitud: ${JSON.stringify(arraySolicitud)}, Lotes: ${JSON.stringify(arrayLote)}, Location: ${JSON.stringify(arrayLocation)}`,
                });
            }

        } catch (error) {
            log.error(`error reduce`, error);
            reduceContext.write({
                key: `error_c`,
                value: error.message,
            });
        }
    }

    const summarize = (summaryContext) => {
        try {
            log.debug(`summarize`, summaryContext);
            const arrayConexion = [];
            summaryContext.output.iterator().each(function (key, value) {
                if (
                    key.includes("error")
                ) {
                    log.error(`Resultado summarize ${key}`, value);
                } else if (arrayConexion.indexOf(key) === -1) {
                    log.audit(`Resultado summarize ${key}`, value);
                    arrayConexion.push(key);
                }
                return true;
            });
            arrayConexion.forEach(element => {
                drt_wep_inventory_cm.updateRecord(
                    "customrecord_wep_inventory_wms",
                    element, {
                        custrecord_wms_inventory_netsuite: true
                    }
                );
            });
        } catch (error) {
            log.error(`Error summarize`, error);
        }
    }

    return {
        getInputData,
        map,
        reduce,
        summarize
    }

});