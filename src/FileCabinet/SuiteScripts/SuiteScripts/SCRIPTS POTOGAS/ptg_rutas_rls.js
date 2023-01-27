/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function post(context) {
        // var start = 0;
        // var end = 10;
        // var arrayRutas = [];
        // var objRutas = {};

        var response = {
            success: false,            
        }

        try {
            // var customrecord_ptg_rutasSearchObj = search.create({
            //     type: "customrecord_ptg_rutas",
            //     filters: [],
            //     columns: [
            //         search.createColumn({
            //             name: "name",
            //             sort: search.Sort.ASC
            //         }),
            //         "internalid"
            //     ]
            // });
            // var searchResultCount = customrecord_ptg_rutasSearchObj.run();
            // var results = searchResultCount.getRange(start, end);
            // if(results.length > 0){
            //     for (var i = 0; i < results.length; i++) {
            //         var columnas = results[i].columns;
            //         var NombreRuta = results[i].getValue(columnas[0]);
            //         var idRutas = results[i].getValue(columnas[1]);
            //         objRutas = {
            //             id: idRutas,
            //             nombre: NombreRuta
            //         }
            //         log.audit('objRutas', objRutas)
            //         arrayRutas.push(objRutas);
            //     }
            //     response.success = true;
            //     response.data = arrayRutas;
            // }

            let locationCilindro = search.create({
                type: "location",
                filters:
                    [
                        ["name", "contains", context.namePlanta],
                        "AND",
                        ["custrecord_ptg_planta_ubi_", "is", "F"],
                        "AND",
                        ["custrecord_ptg_ruta_cilindro_", "is", "T"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });
            //  let searchResultCount = locationSearchObj.runPaged().count;
            //  log.debug("locationSearchObj result count",searchResultCount);
            //  locationSearchObj.run().each(function(result){
            //     // .run().each has a limit of 4,000 results
            //     return true;
            //  });

            log.audit('locationCilindro', locationCilindro)
            //let contador = totalSurtido.runPaged().count;
            //log.audit('contador', contador);
            let startC = 0;
            let searchResultCountCilindro = locationCilindro.run();
            let rutaCilindro = [];

            do {
                var results = searchResultCountCilindro.getRange(startC, startC + 1000);
                log.audit('results recibidos', results)
                if (results && results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        let columnas = results[i].columns;
                        let obj = {};
                        if (!!results[i].getValue(columnas[0])) {
                            obj.name = results[i].getValue(columnas[0]);
                            obj.internalId = results[i].getValue(columnas[1]);
                            rutaCilindro.push(obj)
                        }
                    }
                }
                startC += 1000;
            } while (results && results.length == 1000);

            let locationEstacionario = search.create({
                type: "location",
                filters:
                    [
                        ["name", "contains", context.namePlanta],
                        "AND",
                        ["custrecord_ptg_planta_ubi_", "is", "F"],
                        "AND",
                        ["custrecord_ptg_estacionario_", "is", "T"]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });
            //  let searchResultCount = locationSearchObj.runPaged().count;
            //  log.debug("locationSearchObj result count",searchResultCount);
            //  locationSearchObj.run().each(function(result){
            //     // .run().each has a limit of 4,000 results
            //     return true;
            //  });

            log.audit('locationEstacionario', locationEstacionario)
            //let contador = totalSurtido.runPaged().count;
            //log.audit('contador', contador);
            let startE = 0;
            let searchResultCountEstacionario = locationEstacionario.run();
            let rutaEstacionario = [];

            do {
                var results = searchResultCountEstacionario.getRange(startE, startE + 1000);
                log.audit('results recibidos', results)
                if (results && results.length > 0) {
                    for (let i = 0; i < results.length; i++) {
                        let columnas = results[i].columns;
                        let obj = {};
                        if (!!results[i].getValue(columnas[0])) {
                            obj.name = results[i].getValue(columnas[0]);
                            obj.internalId = results[i].getValue(columnas[1]);
                            rutaEstacionario.push(obj)
                        }
                    }
                }
                startE += 1000;
            } while (results && results.length == 1000);


            response.success = true;
            response.rutaCilindro = (rutaCilindro.length > 0) ? rutaCilindro : [];
            response.rutaEstacionario = (rutaEstacionario.length > 0) ? rutaEstacionario : [];

            return response;

        } catch (error) {
            response.message = error
            return response;
        }
    }

    return {
        post: post
    }
});