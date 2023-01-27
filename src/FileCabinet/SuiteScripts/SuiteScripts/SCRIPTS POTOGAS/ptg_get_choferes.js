/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/record'], function (search, record) {

    const responseData = {
        success: false,
        message: "",
        data: null,
        apiErrorPost: []
    }

    function _get(request) {

        try {
            var employeeSearchObj = search.create({
                type: "employee",
                filters:
                [
                   ["custentity_ptg_conductor","is","T"], 
                   "AND", 
                   ["subsidiary","anyof",request.subsidiaria]
                ],
                columns:
                [
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({
                      name: "entityid",
                      sort: search.Sort.ASC,
                      label: "Nombre"
                   })
                ]
             });
            var start = 0;
            var searchResultCount = employeeSearchObj.run();
            var arrayData = []
            /*
            transactionSearchObj.id="customsearch1657813103609";
            transactionSearchObj.title="Custom Transacción Búsqueda 2 (copy)";
            var newSearchId = transactionSearchObj.save();
            */
            do {
                var results = searchResultCount.getRange(start, start + 1000);
                log.audit('results', results);
                if (results && results.length > 0) {
                    for (var i = 0; i < results.length; i++) {                       
                        var columnas = results[i].columns;  
                        let data = {
                            id: results[i].getValue(columnas[0]),
                            nombre: results[i].getValue(columnas[1]),
                        }
                        arrayData.push(data);
                   }
                }
                start += 1000;
            } while (results && results.length == 1000);

            responseData.success = true;
            responseData.data = arrayData
            return responseData;

        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
            return responseData;
        }
    }

    function _put(request) {
        try {
            let itemLoad = record.load({
                type: 'CUSTOMRECORD_PTG_TABLADEVIAJE_ENC2_',
                id: request.id,
                isDynamic: true
            });

            itemLoad.setValue({
                fieldId: 'custrecord_ptg_chofer_tabladeviajes_',
                value: request.chofer
            });

            itemLoad.setValue({
                fieldId: 'custrecord_ptg_ayudante_tabladeviajes_',
                value: request.ayudante
            });

            itemLoad.setValue({
                fieldId: 'custrecord_ptg_telefono_chofer',
                value: request.telefono
            });
            
            itemLoad.save();

            responseData.success = true;
            return responseData;
        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
            return responseData;
        }
    }
    return {
        post: _get,
        put: _put
    }
});