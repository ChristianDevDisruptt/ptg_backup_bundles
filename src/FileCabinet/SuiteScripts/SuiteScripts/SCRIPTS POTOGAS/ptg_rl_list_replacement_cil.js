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

                let supportcaseSearchObj = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["custevent_ptg_recogi_cilindro_danado", "is", "T"],
                            "AND",
                            ["custevent_ptg_repuse_cilindro_danado", "is", "F"],
                            "AND",
                            ["customer.internalid", "anyof", requestBody.customer]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({ name: "company", label: "Company" }),
                            search.createColumn({
                                name: "casenumber",
                                sort: search.Sort.ASC,
                                label: "Number"
                            }),
                            search.createColumn({ name: "custevent_ptg_reposicion_camino", label: "PTG - Reposición en Camino" }),
                            search.createColumn({ name: "custevent_ptg_precio_venta", label: "PTG - PRECIO DE VENTA" }),
                            search.createColumn({
                                name: "custitem_ptg_capacidadcilindro_",
                                join: "item",
                                label: "PTG - Capacidad cilindro"
                            })
                        ]
                });
                // let searchResultCount = supportcaseSearchObj.runPaged().count;
                // log.debug("supportcaseSearchObj result count", searchResultCount);
                // supportcaseSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });

                let searchResult = supportcaseSearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResult.getRange(start, start + 1000);
                    log.debug('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.id = results[i].getValue(columnas[0]);
                                obj.itemId = results[i].getValue(columnas[1]);
                                obj.item = results[i].getText(columnas[1]);
                                obj.nCase = results[i].getValue(columnas[3]);
                                obj.isComming = results[i].getValue(columnas[4]);
                                obj.priceZone = results[i].getValue(columnas[5]);
                                obj.capacity = results[i].getValue(columnas[6]);
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
