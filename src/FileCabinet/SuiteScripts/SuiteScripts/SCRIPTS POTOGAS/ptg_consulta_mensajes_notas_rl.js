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

    function _getMensajesNotas(request) {
        try {

            let tipoTransaccion = request.tipo;
            let idOportunidad = request.id;

            var arrayMensajesNotas = [];
            var objMensajesNotas = {};

            var messageSearchObj = search.create({
                type: "note",
                filters: [
                    ["case.internalid", "anyof", request.id]
                ],
                columns: [
                    search.createColumn({
                        name: "title",
                        label: "Título"
                    }),
                    search.createColumn({
                        name: "note",
                        label: "Nota"
                    }),
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    })
                ]
            });
            /*
            if (tipoTransaccion == "oportunidad") {
                var oportunidadT = search.createFilter({
                    name: "internalid",
                    join: "opportunity",
                    operator: "anyof",
                    values: idOportunidad,
                })
                messageSearchObj.filters.push(oportunidadT);
            }
            */


            var searchResultCount = messageSearchObj.run();
            var results = searchResultCount.getRange(0, 999);

            for (var i = 0; i < results.length; i++) {
                let columnas = results[i].columns;
                let id = results[i].getValue(columnas[2]);
                let title = results[i].getValue(columnas[0]);
                let memo = results[i].getValue(columnas[1]);

                objMensajesNotas = {
                    id_interno: id,
                    titulo: title,
                    nota: memo,
                }

                arrayMensajesNotas.push(objMensajesNotas)
            }

            return JSON.stringify(arrayMensajesNotas);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _getMensajesNotas
    }
});