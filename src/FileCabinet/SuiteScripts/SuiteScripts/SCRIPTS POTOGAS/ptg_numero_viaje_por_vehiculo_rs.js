/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _post(request) {
        try {
            let arrayViajes = [];
            let objViajes = {};
            let idVehiculo = request.id;

            var customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
                type: "customrecord_ptg_tabladeviaje_enc2_",
                filters: [
                    ["custrecord_ptg_vehiculo_tabladeviajes_", "anyof", idVehiculo],
                    "AND",
                    ["custrecord_ptg_estatus_tabladeviajes_", "anyof", "3"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Nombre"
                    })
                ]
            });
            var searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.run();
            var results = searchResultCount.getRange(0, 999);
            for (var i = 0; i < results.length; i++) {
                let columnas = results[i].columns;
                let idInternal = results[i].getValue(columnas[0]);
                let nombreViaje = results[i].getValue(columnas[1]);

                objViajes = {
                    id_interno: idInternal,
                    nombre_viaje: nombreViaje
                }

                arrayViajes.push(objViajes)
            }
            return JSON.stringify(arrayViajes);

        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        post: _post
    }
});