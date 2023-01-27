/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            let response = {
                success: false
            };

            try {
                let transactionSearchObj = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["internalid", "anyof", requestBody.opp],
                            "AND",
                            ["taxline", "is", "F"],
                            "AND",
                            ["mainline", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({ name: "quantity", label: "Quantity" }),
                            search.createColumn({ name: "amount", label: "Amount" }),
                            search.createColumn({ name: "custcol_ptg_capacidad_articulo", label: "PTG - CAPACIDAD DEL ARTÍCULO" }),
                            search.createColumn({ name: "total", label: "Amount (Transaction Total)" }),
                            search.createColumn({ name: "taxamount", label: "Amount (Tax)" }),
                            search.createColumn({
                                name: "custitem_ptg_tipodearticulo_",
                                join: "item",
                                label: "PTG - TIPO DE ARTÍCULO"
                            }),
                            search.createColumn({name: "grossamount", label: "Amount (Gross)"})
                        ]
                });
                //  var searchResultCount = transactionSearchObj.runPaged().count;
                //  log.debug("transactionSearchObj result count",searchResultCount);
                //  transactionSearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                let searchResultCount = transactionSearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results message', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            obj.item = results[i].getText(columnas[0]);
                            obj.itemId = results[i].getValue(columnas[0]);
                            obj.quantity = results[i].getValue(columnas[1]);
                            obj.amount = results[i].getValue(columnas[2]);
                            obj.taxAmount = results[i].getValue(columnas[5]);
                            obj.capacidad = results[i].getValue(columnas[3]);
                            obj.typeId = results[i].getValue(columnas[6]);
                            obj.type = results[i].getText(columnas[6]);
                            obj.total = results[i].getValue(columnas[7]);
                            data.push(obj);
                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.data = (data.length > 0) ? data : [];

            } catch (error) {
                log.debug('error', error);
                response.message = error
            }

            return response;
        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return { get, put, post, delete: doDelete }

    });
