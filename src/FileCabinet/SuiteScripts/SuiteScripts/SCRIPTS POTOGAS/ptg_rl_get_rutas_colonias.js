/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', "N/search", "N/record", 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors'], function (log, search, record, error) {

    // se crea la estructura donde se cargará toda la data

    const responseData = {
        success: true,
        message: "some errors occured",
        data: [],
        apiErrorPost: []
    }

    function getRutasColonias(request) {

        var customrecord_ptg_coloniasrutas_SearchObj = search.create({
            type: "customrecord_ptg_coloniasrutas_",
            filters:
                [
                    ["custrecord_ptg_rutacil_.name","startswith",request.planta]
                ],
            columns:
            [
                search.createColumn({name: "internalid", label: "ID interno"}),
                search.createColumn({
                    name: "name",
                    sort: search.Sort.ASC,
                    label: "Nombre"
                }),
                search.createColumn({name: "custrecord_ptg_nombrecolonia_", label: "PTG - NOMBRE DE COLONIA"}),
                search.createColumn({name: "custrecord_ptg_rutamunicipio_", label: "PTG - MUNICIPIO"}),
                search.createColumn({name: "custrecord_ptg_cp_", label: "PTG - CP"}),
                search.createColumn({name: "custrecord_ptg_estado_", label: "PTG - Estado "}),
                search.createColumn({name: "custrecord_ptg_rutacil_", label: "PTG - CIL"}),
                search.createColumn({name: "custrecord_ptg_rutaest_", label: "PTG - EST"}),
                search.createColumn({name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio"})

            ]
        });
        //var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.runPaged().count;
        //log.debug("customrecord_ptg_coloniasrutas_SearchObj result count",searchResultCount);
        var pagedData = customrecord_ptg_coloniasrutas_SearchObj.runPaged({pageSize : 1000});
        for( var i=0; i < pagedData.pageRanges.length; i++ ) {

            // fetch the current page data
            var currentPage = pagedData.fetch(i);
    
            // and forEach() thru all results
            currentPage.data.forEach( function(result) {
    
                // you have the result row. use it like this....
                let obj = {};
                obj.id = result.getValue({name: "internalid", label: "ID interno"})
                obj.coloniaId = result.getValue({name: "custrecord_ptg_nombrecolonia_", label: "PTG - NOMBRE DE COLONIA"});
                obj.colonia = result.getText({name: "custrecord_ptg_nombrecolonia_", label: "PTG - NOMBRE DE COLONIA"});
                obj.municipioId = result.getValue({name: "custrecord_ptg_rutamunicipio_", label: "PTG - MUNICIPIO"});
                obj.municipio = result.getText({name: "custrecord_ptg_rutamunicipio_", label: "PTG - MUNICIPIO"});
                obj.cpId = result.getValue({name: "custrecord_ptg_cp_", label: "PTG - CP"});
                obj.cp = result.getText({name: "custrecord_ptg_cp_", label: "PTG - CP"});
                obj.estadoId = result.getValue({name: "custrecord_ptg_estado_", label: "PTG - Estado "});
                obj.estado = result.getText({name: "custrecord_ptg_estado_", label: "PTG - Estado "});
                obj.cilindroId = result.getValue({name: "custrecord_ptg_rutacil_", label: "PTG - CIL"});
                obj.cilindro = result.getText({name: "custrecord_ptg_rutacil_", label: "PTG - CIL"});
                obj.estacionarioId = result.getValue({name: "custrecord_ptg_rutaest_", label: "PTG - CIL"});
                obj.estacionario = result.getText({name: "custrecord_ptg_rutaest_", label: "PTG - CIL"});
                obj.zonaPrecioId = result.getValue({name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio"});
                obj.zonaPrecio = result.getText({name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio"});
                responseData.data.push(obj);
            });
    
        }
        responseData.count = responseData.data.length;
        return responseData;
    }


    return {
        post: getRutasColonias,
    }
});

//filtro por colonia
//correo
//nombre