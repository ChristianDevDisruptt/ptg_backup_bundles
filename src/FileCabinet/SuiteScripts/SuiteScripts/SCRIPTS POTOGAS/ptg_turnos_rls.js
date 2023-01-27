/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 10;
        var arrayTurnos = [];
        var objTurnos = {};

        var customrecord_ptg_turnosSearchObj = search.create({
            type: "customrecord_ptg_turnos",
            filters: [],
            columns: [
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC
                }),
                "internalid"
            ]
        });

        var searchResultCount = customrecord_ptg_turnosSearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var NombreTurno = results[i].getValue(columnas[0]);
            var idTurno = results[i].getValue(columnas[1]);
            objTurnos = {
                id: idTurno,
                nombre: NombreTurno
            }
            log.audit('objRutas', objTurnos)
            arrayTurnos.push(objTurnos);
        }

        return JSON.stringify(arrayTurnos);
    }

    return {
        get: _get
    }
});