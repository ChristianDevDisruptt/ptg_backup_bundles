/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _post(request) {
        try {
            let arrayRutas = [];
            let objRutas = {};
            let idSubcidiaria = request.id;

            log.audit('request', request)
            var customrecord_ptg_equiposSearchObj = search.create({
                type: "customrecord_ptg_equipos",
                filters: [
                    ["custrecord_ptg_subsidiaria_1", "anyof", idSubcidiaria],
                    "AND",
                    ["custrecord_ptg_tipo_vehiculo_", "is", "Camión Cilindros"]
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_ptg_idequipo_",
                        label: "PTG - ID EQUIPO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_ubicacionruta_",
                        label: "PTG - Ubicación/Ruta"
                    }),
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: 'custrecord_ptg_nombredelcontacto_',
                        label: "Empleado"
                    }),
                    search.createColumn({
                        name: 'custrecord_ptg_choferequipo_',
                        label: "PTG - CHOFER EQUIPO"
                    }),
                ]
            });
            var searchResultCount = customrecord_ptg_equiposSearchObj.run();
            var results = searchResultCount.getRange(0, 999);
            log.audit('results', results)
            for (var i = 0; i < results.length; i++) {
                let columnas = results[i].columns;
                let idRuta = results[i].getValue(columnas[1]);
                let nombreRuta = results[i].getText(columnas[1]);
                let nombreEquipo = results[i].getValue(columnas[0]);
                let idInternoEquipo = results[i].getValue(columnas[2]);
                let idEmpleado = results[i].getValue(columnas[3]);
                let nombreEmpleado = results[i].getText(columnas[3]);
                let driverName = results[i].getText(columnas[4]);
                let driverNameId = results[i].getValue(columnas[4]);

                objRutas = {
                    id_ruta: idRuta,
                    nombre_ruta: nombreRuta,
                    nombre_equipo: nombreEquipo,
                    id_interno_equipo: idInternoEquipo,
                    id_empleado: idEmpleado,
                    nombre_empleado: nombreEmpleado,
                    driverName : driverName,
                    driverNameId : driverNameId
                }

                arrayRutas.push(objRutas)
            }
            return JSON.stringify(arrayRutas);

        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        post: _post
    }
});