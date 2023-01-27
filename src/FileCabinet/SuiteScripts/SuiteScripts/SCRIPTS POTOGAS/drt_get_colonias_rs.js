/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 1000;
        var arrayColonias = [];
        var objColonias = {};
        var customrecord_ptg_coloniasrutas_SearchObj = search.create({
            type: "customrecord_ptg_coloniasrutas_",
            filters: [],
            columns: [
                "internalid",
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC
                }),
                "custrecordptg_zona_de_precio",
                "custrecordptg_cp_"
            ]
        });
        var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var idColonia = results[i].getValue(columnas[0]);
            var NombreColonia = results[i].getValue(columnas[1]);
            var zonaPrecio = results[i].getValue(columnas[2]);
            var codigoPostal = results[i].getValue(columnas[3]);
            objColonias = {
                id: idColonia,
                nombre: NombreColonia,
                zona_venta: zonaPrecio,
                cp: codigoPostal
            }
            log.audit('objColonis', objColonias)
            arrayColonias.push(objColonias);
        }

        return JSON.stringify(arrayColonias);
    }

    return {
        get: _get
    }
});