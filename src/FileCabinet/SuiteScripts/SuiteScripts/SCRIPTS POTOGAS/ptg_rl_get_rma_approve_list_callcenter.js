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
                var returnauthorizationSearchObj = search.create({
                    type: "returnauthorization",
                    filters:
                        [
                            ["type", "anyof", "RtnAuth"],
                            "AND",
                            ["name", "anyof", requestBody.customer],
                            "AND",
                            ["taxline", "is", "F"],
                            "AND",
                            //["item.internalid", "anyof", "4088"], sbx
                            ["item.internalid", "anyof", "4216"],
                            "AND",
                            ["status","anyof","RtnAuth:B","RtnAuth:F"]
                            //["status", "anyof", "RtnAuth:F"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "transactionnumber", sort: search.Sort.DESC, label: "Transaction Number" }),
                            search.createColumn({ name: "entity", label: "Name" }),
                            search.createColumn({ name: "statusref", label: "Status" }),
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({ name: "total", label: "Amount (Transaction Total)" }),
                            search.createColumn({ name: "tranid", label: "Transaction ID" }),
                            search.createColumn({name: "quantity", label: "Cantidad"})
                        ]
                });
                //  var searchResultCount = returnauthorizationSearchObj.runPaged().count;
                //  log.debug("returnauthorizationSearchObj result count",searchResultCount);
                //  returnauthorizationSearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });
                let searchResultCount = returnauthorizationSearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.rmaId = results[i].getValue(columnas[0]);
                                obj.numberRMA = results[i].getValue(columnas[1]);
                                obj.customer = results[i].getText(columnas[2]);
                                obj.statusId = results[i].getValue(columnas[3]);
                                obj.status = results[i].getText(columnas[3]);
                                obj.item = results[i].getValue(columnas[4]);
                                obj.total = results[i].getValue(columnas[5]);
                                obj.tranId = results[i].getValue(columnas[6]);
                                obj.cantidad = results[i].getValue(columnas[7]);
                                
                                data.push(obj);
                            }
                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.data = (data.length > 0) ? data : [];

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
