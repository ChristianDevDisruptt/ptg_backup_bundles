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
                let customrecord_ptg_pagosSearchObj = search.create({
                    type: "customrecord_ptg_pagos",
                    filters:
                        [
                            ["custrecord_ptg_num_viaje_pagos", "anyof", requestBody.nTravel]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ptg_num_viaje_pagos",
                                summary: "GROUP",
                                label: "PTG - Numero de viaje"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_tipo_pago",
                                join: "CUSTRECORD_PTG_REGISTRO_PAGOS",
                                summary: "GROUP",
                                label: "PTG - Tipo de Pago"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_total",
                                join: "CUSTRECORD_PTG_REGISTRO_PAGOS",
                                summary: "SUM",
                                label: "PTG - Total"
                            })
                        ]
                });
                // let searchResultCount = customrecord_ptg_pagosSearchObj.runPaged().count;
                // log.debug("customrecord_ptg_pagosSearchObj result count", searchResultCount);
                // customrecord_ptg_pagosSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });
                let searchResultCount = customrecord_ptg_pagosSearchObj.run();
                let start = 0;
                let data = [];
                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let info = {};
                            if(!!results[i].getValue(columnas[0])){
                                info.nViaje = results[i].getText(columnas[0]);
                                info.nViajeId = results[i].getValue(columnas[0]);
                                info.methodPaymentId = results[i].getValue(columnas[1]);
                                info.methodPayment = results[i].getText(columnas[1]);
                                info.total =Number(results[i].getValue(columnas[2]));
                                data.push(info);
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
