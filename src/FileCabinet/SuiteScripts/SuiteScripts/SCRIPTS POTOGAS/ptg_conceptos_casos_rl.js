/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 20;
        var arrayConceptos = [];
        var objConceptos = {};
        var customrecord_ptg_conceptos_casosSearchObj = search.create({
            type: "customrecord_ptg_conceptos_casos",
            filters:
            [
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "custrecord_ptg_identificador_concepto", label: "PTG - Identificador del Concepto"}),
               search.createColumn({name: "custrecord_ptg_descripcion_concepto", label: "PTG - Descripción del Concepto"})
            ]
         });

        var searchResultCount = customrecord_ptg_conceptos_casosSearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var idInterno = results[i].getValue(columnas[0]);
            var identificador = results[i].getValue(columnas[1]);
            var descripcion = results[i].getValue(columnas[2]);
            objConceptos = {
                id_interno: idInterno,
                id_externo: identificador,
                nombre: descripcion
            }
            log.audit('objConceptos', objConceptos)
            arrayConceptos.push(objConceptos);
        }

        return JSON.stringify(arrayConceptos);
    }

    return {
        get: _get
    }
});