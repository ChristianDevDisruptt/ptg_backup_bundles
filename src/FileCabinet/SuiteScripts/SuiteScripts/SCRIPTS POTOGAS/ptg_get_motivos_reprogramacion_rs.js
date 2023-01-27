/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function(search) {

    function _get(context) {
        try {

            var arrayMotivosR = [];
            var objMotivosR = {};

            var customrecord_ptg_motivos_reprogramacionSearchObj = search.create({
                type: "customrecord_ptg_motivos_reprogramacion",
                filters:
                [
                ],
                columns:
                [
                   search.createColumn({name: "custrecord_ptg_nombre_motivo", label: "PTG - Nombre Motivo"}),
                   search.createColumn({name: "custrecord_ptg_id_motivo", label: "PTG - Id Motivo"})
                ]
             });
             var searchResultCount = customrecord_ptg_motivos_reprogramacionSearchObj.run(); 
             var results = searchResultCount.getRange(0, 10);
             for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var idInternoMotivo = results[i].getValue(columnas[1]);
                var nombreMotivo = results[i].getValue(columnas[0]);
                objMotivosR = {
                    id_motivo: idInternoMotivo,
                    nombre_motivo: nombreMotivo
                }
                log.audit('objItem', objMotivosR)
                arrayMotivosR.push(objMotivosR);
            }

            return JSON.stringify(arrayMotivosR);
        } catch (error) {
           log.audit('error', error) 
        }
    }

    return {
        get: _get
    }
});
