/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 5;
        var arrayTiposServicio = [];
        var objTipoServicios = {};

        var response = {
            success: false,
            data: []
        };

        try {
            var customrecord_ptg_tipo_servicioSearchObj = search.create({
                type: "customrecord_ptg_tipo_servicio",
                filters:
                    [
                    ],
                columns:
                    [
                        "internalid",
                        "custrecord_ptg_nombre_servicio"
                    ]
            });

            var searchResultCount = customrecord_ptg_tipo_servicioSearchObj.run();
            var results = searchResultCount.getRange(start, end);
            if(results.length > 0){
                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    var idServicio = results[i].getValue(columnas[0]);
                    var NombreServicio = results[i].getValue(columnas[1]);
                    objTipoServicios = {
                        id: idServicio,
                        nombre: NombreServicio
                    }
                    log.audit('objColonis', objTipoServicios)
                    arrayTiposServicio.push(objTipoServicios);
                }

                response.success = true;
                response.data = arrayTiposServicio;
            }
            return response;
                        
        } catch (error) {
            response.message = error;    
            return response;
        }

        
    }

    return {
        get: _get
    }
});