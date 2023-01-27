 /**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 55;
        var arrayNumeroViajes = [];
        var objNumeroViaje = {};

        var customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
            type: "customrecord_ptg_tabladeviaje_enc2_",
            filters:
            [
            ],
            columns:
            [
               "internalid",
               search.createColumn({
                name: "name",
                sort: search.Sort.ASC,
                label: "Nombre"
             }),
            ]
         });

        var searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var idTurno = results[i].getValue(columnas[0]);
            var NombreTurno = results[i].getValue(columnas[1]);
            
            objNumeroViaje = {
                id: idTurno,
                nombre: NombreTurno
            }
            log.audit('objRutas', objNumeroViaje)
            arrayNumeroViajes.push(objNumeroViaje);
        }

        return JSON.stringify(arrayNumeroViajes);
    }

    return {
        get: _get
    }
});