/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
 define(['N/search'], function (search) {

    const responseData = {
        isSuccessful: false,
        message: "some errors occured",
        data: null,
        apiErrorPost: []
    }

    function _getZona(request) {

        try {
            var arrayOportunidadesM = [];
            var objOportunidadesM = {};

            log.audit('request data', request)

            let nombreConductor = request.nombre;
            let idVehiculo = request.id;

            var customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
                type: "customrecord_ptg_tabladeviaje_enc2_",
                filters:
                [
                   ["custrecord_ptg_chofer_tabladeviajes_","is", nombreConductor], 
                   "AND", 
                   ["custrecord_ptg_vehiculo_tabladeviajes_","is", idVehiculo],
                   "AND",
                   ["custrecord_ptg_estatus_tabladeviajes_","anyof","3"],
                  	"AND",
                  	["custrecord_ptg_estatusdeviaje_","anyof","1"],
                ],
                columns:
                [
                   search.createColumn({name: "id", label: "ID"}),
                   search.createColumn({name: "custrecord_ptg_viaje_tabladeviajes_", label: "PTG - #Viaje (Tabla de viajes)"}),
                   search.createColumn({name: "custrecord_ptg_turno", label: "PTG - Turno"})
                ]
             });

            var searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.run();
            var start = 0;
            do {
                var results = searchResultCount.getRange(start, start + 1000);
                if (results && results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var columnas = results[i].columns;
                        var idInterno = results[i].getValue(columnas[0]);
                        var idNumeroViaje = results[i].getValue(columnas[1]);
                        var idTurno = results[i].getValue(columnas[2]);
                        var nombreTurno = results[i].getText(columnas[2]);
                        

                        objOportunidadesM = {
                            id_interno: idInterno,
                            numero_viaje: idNumeroViaje,
                            turno: idTurno,
                            nombre_turno: nombreTurno
                        }

                        arrayOportunidadesM.push(objOportunidadesM);
                    }
                }
                start += 1000;
            } while (results && results.length == 1000);

            return JSON.stringify(arrayOportunidadesM);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _getZona
    }
})