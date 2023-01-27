/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search'], function (search) {

    const responseData = {
        success: false,
        message: "",
        data: null,
        apiErrorPost: []
    }

    function _get(request) {

        try {
            var transactionSearchObj = search.create({
                type: "transaction",
                filters:
                [
                    ["type","anyof","Opprtnty"], 
                    "AND", 
                    ["mainline","is","F"], 
                    "AND", 
                    ["taxline","is","F"], 
                    "AND", 
                    ["name","anyof",request.cliente],
                    "AND", 
                    ["custbody_ptg_estado_pedido","anyof","3"],
                    "AND", 
                    ["shippingaddress.internalid","anyof",request.idAddress]
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "closedate", label: "Fecha cerrada"}),
                    search.createColumn({name: "item", label: "Artículo"}),
                   /*search.createColumn({
                      name: "internalid",
                      join: "item",
                      label: "ID interno"
                   }),*/
                    search.createColumn({name: "quantity", label: "Cantidad"}),
                    search.createColumn({name: "total", label: "Importe (total de transacción)"})
                ]
            });
            var contador = transactionSearchObj.runPaged().count;
            var start = 0;
            var searchResultCount = transactionSearchObj.run();
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
                            fecha_cierre: results[i].getValue(columnas[1]),
                            articulo_id: results[i].getValue(columnas[2]),
                            articulo: results[i].getText(columnas[2]),                   
                            cantidad: results[i].getValue(columnas[3]),
                            total: results[i].getValue(columnas[4]),
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

    return {
        post: _get
    }
});