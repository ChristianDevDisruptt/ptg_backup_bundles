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

    function _getAssignCase(request) {

        log.audit({
            title: 'request',
            details: request.id_customer
        });

        try {
            var arrayCaso = [];
            var objCaso = {};

            var supportcaseSearchObj = search.create({
                type: "supportcase",
                filters:
                [
                   ["stage","anyof","OPEN","ESCALATED","CLOSED"], 
                   "AND", 
                   ["customer.internalidnumber","equalto", request.id_customer]
                ],
                columns:
                [
                   search.createColumn({
                      name: "internalid",
                      join: "employee",
                      label: "ID interno"
                   }),
                   search.createColumn({
                      name: "entityid",
                      join: "employee",
                      label: "Nombre"
                   }),
                   search.createColumn({
                      name: "casenumber",
                      sort: search.Sort.ASC,
                      label: "Número"
                   }),
                   search.createColumn({name: "title", label: "Asunto"}),
                   search.createColumn({name: "priority", label: "Prioridad"}),
                   search.createColumn({name: "status", label: "Estado"}),
                   search.createColumn({name: "assigned", label: "Asignado a"}),
                   search.createColumn({name: "startdate", label: "Fecha del incidente"})
                ]
             });

            var searchResultCount = supportcaseSearchObj.run();
            var results = searchResultCount.getRange(0, 999);

            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var idAssigned = results[i].getValue(columnas[0]);
                var nameassigned = results[i].getValue(columnas[1]);

                objCaso = {
                    id: idAssigned,
                    nombre: nameassigned
                }

                arrayCaso.push(objCaso);
            }

            return JSON.stringify(arrayCaso);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _getAssignCase
    }
});