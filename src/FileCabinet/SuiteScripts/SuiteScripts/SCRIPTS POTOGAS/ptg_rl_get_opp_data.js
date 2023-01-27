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
                            ["internalid", "anyof", requestBody.idOpp],
                            "AND",
                            ["mainline", "is", "F"],
                            "AND",
                            ["taxline", "is", "F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({ name: "rate", label: "Item Rate" }),
                            search.createColumn({ name: "quantity", label: "Quantity" }),
                            search.createColumn({ name: "amount", label: "Amount" })
                        ]
                });
                // let searchResultCount = transactionSearchObj.runPaged().count;
                // log.debug("transactionSearchObj result count", searchResultCount);
                // transactionSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });

                let oppHeaderData = search.lookupFields({
                    type: search.Type.OPPORTUNITY,
                    id: requestBody.idOpp,
                    columns: ['entity', 'custbody_ptg_opcion_pago_obj', 'memo', 'custbody_ptg_opcion_pago']
                });

                log.debug('oppHeaderData', oppHeaderData)
                let oppData = {
                    customer : oppHeaderData["entity"][0].text || "",
                    customerId : oppHeaderData["entity"][0].value || "",
                    payments : JSON.parse(oppHeaderData["custbody_ptg_opcion_pago_obj"]) || "",
                    memo : oppHeaderData["memo"] || ""
                };
                
                let searchResultCount = transactionSearchObj.run();
                let start = 0;
                let dataItem = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.itemId = results[i].getValue(columnas[0]);
                                obj.item = results[i].getText(columnas[0]);
                                obj.rate = results[i].getValue(columnas[1]);
                                obj.quantity = results[i].getValue(columnas[2]);
                                obj.amount = results[i].getValue(columnas[3]);                                                                
                                dataItem.push(obj);
                            }

                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                oppData.items = (dataItem.length > 0) ? dataItem : [];
                response.success = true;
                response.data = oppData


            } catch (error) {
                log.debug('error', error);
                response.message = error;
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
