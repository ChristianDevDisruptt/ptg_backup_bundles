/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], function(search) {

    function _post(request) {
        try {
           log.audit('request', request);
           let empleado = request.id_empleado;
           let objOrder = {};
           let arrayOrder = [];
           
           var transferorderSearchObj = search.create({
            type: "transferorder",
            filters:
            [
               ["type","anyof","TrnfrOrd"], 
               "AND", 
               ["custbody_ptg_empleado_a_transferir_rs","anyof", empleado], 
               "AND", 
               ["mainline","is","T"], 
               "AND", 
               ["status","anyof","TrnfrOrd:F"]
            ],
            columns:
            [
               search.createColumn({name: "tranid", label: "Número de documento"}),
               search.createColumn({name: "trandate", label: "Fecha"}),
               search.createColumn({name: "entity", label: "Nombre"}),
               search.createColumn({name: "location", label: "Ubicación"}),
               search.createColumn({name: "transferlocation", label: "Ubicación de destino"}),
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "statusref", label: "Estado"})
            ]
         });
         var searchResultCount = transferorderSearchObj.run();
         var results = searchResultCount.getRange(0, 999);
             for (var i = 0; i < results.length; i++) {
                 var columnas = results[i].columns;
                 var idDocumuento = results[i].getValue(columnas[0]);
                 var fecha = results[i].getValue(columnas[1]);
                 var idUbicacion = results[i].getValue(columnas[3]);
                 var nombreUbicacion = results[i].getText(columnas[3]);
                 var ubicacionD = results[i].getValue(columnas[4]);
                 var nombreUbicacionD = results[i].getText(columnas[4]);
                 var idInterno = results[i].getValue(columnas[5]);
                 var idStatus = results[i].getValue(columnas[6]);
                 var nombreStatus = results[i].getText(columnas[6]);
                 objOrder = {
                     id_interno: idInterno,
                     documento: idDocumuento,
                     fecha: fecha,
                     id_ubicacion: idUbicacion,
                     nombre_ubicacion: nombreUbicacion,
                     ubicacion_destino: ubicacionD,
                     nombre_ubicacion_destino: nombreUbicacionD,
                     is_status: idStatus,
                     nombre_status: nombreStatus

                 }

                 log.audit('objOrder', objOrder)
                 arrayOrder.push(objOrder);
             }
             return JSON.stringify(arrayOrder);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _post
    }
});