 /**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 100;
        var response = {
            success : false,
            data : []
        }
        var arrayPlantas = [];
        var objPlanta = {};

        var locationSearchObj = search.create({
            type: "location",
            filters:
            [
               ["custrecord_ptg_planta_ubi_","is","T"]
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({
                  name: "name",
                  sort: search.Sort.ASC,
                  label: "Nombre"
               }),
               search.createColumn({name: "subsidiary", label: "Subsidiaria"}),
               search.createColumn({name: "custrecord_ptg_monto_min_ped_est", label: "PTG - MONTO MÍNIMO PEDIDO ESTACIONARIO"})
               
            ]
         });

        var searchResultCount = locationSearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var idPlanta = results[i].getValue(columnas[0]);
            var plantaNombre = results[i].getValue(columnas[1]);
            var min = results[i].getValue(columnas[3]);
            objPlanta = {
                id: idPlanta,
                nombre: plantaNombre,
                min : min
            }
            log.audit('objPlanta', objPlanta)
            arrayPlantas.push(objPlanta);
        }

        if(arrayPlantas.length > 0){
            response.success = true;
            response.data = arrayPlantas;
        }

        return response;
    }

    return {
        get: _get
    }
});