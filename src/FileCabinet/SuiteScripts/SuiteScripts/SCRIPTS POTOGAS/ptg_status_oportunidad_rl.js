/**
*@NApiVersion 2.x
*@NScriptType Restlet
*/
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 10;
        var arrayEstatus = [];
        var objEstatus = {};

        var response = {
            success: false,
            data: []
        }

        try {
            var customrecord_ptg_status_oportunidadSearchObj = search.create({
                type: "customlist_ptg_estado_pedido",
                filters:
                    [
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

            var searchResultCount = customrecord_ptg_status_oportunidadSearchObj.run();
            var results = searchResultCount.getRange(start, end);
            if (results.length > 0) {
                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    var idEstatus = results[i].getValue(columnas[1]);
                    var nombreEstatus = results[i].getValue(columnas[0]);

                    objEstatus = {
                        id: idEstatus,
                        nombre: nombreEstatus
                    }
                    log.audit('objEstatus', objEstatus)
                    arrayEstatus.push(objEstatus);
                }
                response.success = true;
                response.data = arrayEstatus;
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