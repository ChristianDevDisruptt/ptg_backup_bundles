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

    function searchZone(request, arrayResult, responseData) {
        /*
        var customrecord_ptg_coloniasrutas_SearchObj = search.create({
            type: "customrecord_ptg_coloniasrutas_",
            filters:
            [
               ["custrecord_ptg_nombrecolonia_","is", ]
            ],
            columns:
            [
               search.createColumn({
                  name: "name",
                  sort: search.Sort.ASC
               }),
               "custrecordptg_zona_de_precio",
               search.createColumn({
                  name: "custrecord_ptg_precio_",
                  join: "CUSTRECORDPTG_ZONA_DE_PRECIO"
               })
            ]
         });
         var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.runPaged().count;
         log.debug("customrecord_ptg_coloniasrutas_SearchObj result count",searchResultCount);
         customrecord_ptg_coloniasrutas_SearchObj.run().each(function(result){
            // .run().each has a limit of 4,000 results
            return true;
         });
         */
    }

    function _getZona(request) {

        log.audit({
            title: 'request',
            details: request.colonia
        });

        try {
            var arrayZonaPrecio = [];
            var objZonaPrecio = {};
            var customrecord_ptg_coloniasrutas_SearchObj = search.create({
                type: "customrecord_ptg_coloniasrutas_",
                filters: [
                    ["custrecord_ptg_nombrecolonia_", "is", request.colonia]
                ],
                columns: [
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC
                    }),
                    "custrecordptg_zona_de_precio",
                    search.createColumn({
                        name: "custrecord_ptg_precio_",
                        join: "CUSTRECORDPTG_ZONA_DE_PRECIO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_rutacil_",
                        label: "PTG - CIL"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_rutaest_",
                        label: "PTG - EST"
                    }),
                    "internalid",

                ]
            });

            var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.run();
            var results = searchResultCount.getRange(0, 999);

            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var zonaPrecio = results[i].getValue(columnas[1]);
                var precioZona = results[i].getValue(columnas[2]);
                var cil = results[i].getValue(columnas[3]);
                var est = results[i].getValue(columnas[4]);
                var id = results[i].getValue(columnas[5]);

                var lookupLocationCil = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: cil,
                    columns: ['name']
                });

                var nameCil = lookupLocationCil.name;

                var lookupLocationEst = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: est,
                    columns: ['name']
                });

                var nameEst = lookupLocationEst.name;


                objZonaPrecio = {
                    idInterno: id,
                    zona: zonaPrecio,
                    precio: precioZona,
                    ubicacionCil: cil,
                    nameUbicacionCil: nameCil,
                    ubicacionEst: est,
                    nameUbicacionEst: nameEst,
                }

                arrayZonaPrecio.push(objZonaPrecio);
            }

            return JSON.stringify(arrayZonaPrecio);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _getZona
    }
});