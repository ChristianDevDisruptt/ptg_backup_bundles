/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        try {
            var start = 0;
            var end = 100;
            var arrayTotalServicio = [];
            var objTotalServicio = {};

            var transactionSearchObj = search.create({
                type: "transaction",
                filters: [
                    ["type", "anyof", "Opprtnty"],
                    "AND",
                    ["subsidiary", "anyof", "16", "13", "20"],
                    "AND",
                    ["mainline", "is", "T"]
                ],
                columns: [
                    search.createColumn({
                        name: "entitystatus",
                        label: "Estado de cotización/oportunidad"
                    }),
                    search.createColumn({
                        name: "custbody_ptg_type_service",
                        label: "Tipo de Servicio"
                    }),
                    search.createColumn({
                        name: "custbody_route",
                        label: "Código Ruta"
                    })
                ]
            });
            var searchResultCount = transactionSearchObj.run();
            var results = searchResultCount.getRange(start, end);
            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var status = results[i].getValue(columnas[0]);
                var idTipoServicio = results[i].getValue(columnas[1]);
                var idCodigoRuta = results[i].getValue(columnas[2]);
                objTotalServicio = {
                    estado: status,
                    tipo_servicio: idTipoServicio,
                    ruta: idCodigoRuta
                }
                arrayTotalServicio.push(objTotalServicio);
            }

            return JSON.stringify(arrayTotalServicio)


        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        get: _get
    }
});