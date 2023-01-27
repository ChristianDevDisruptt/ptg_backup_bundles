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

    function _getOportunidades(request) {

        log.audit({
            title: 'request',
            details: request.id
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
                   ["customer.internalidnumber","equalto", request.id]
                ],
                columns:
                [
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
                var numberCase = results[i].getValue(columnas[0]);
                var caseAsunto = results[i].getValue(columnas[1]);
                var casePriority = results[i].getValue(columnas[2]);
                var caseStatus = results[i].getValue(columnas[3]);
                var caseAssigned = results[i].getValue(columnas[4]);
                var caseDate = results[i].getValue(columnas[5]);

                objCaso = {
                    numero: numberCase,
                    asunto: caseAsunto,
                    prioridad: casePriority,
                    estatus: caseStatus,
                    asiganado: caseAssigned,
                    fecha: caseDate
                }

                arrayCaso.push(objCaso);
            }

            return JSON.stringify(arrayCaso);

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        post: _getOportunidades
    }
});