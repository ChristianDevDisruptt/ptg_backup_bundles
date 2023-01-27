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
            // let response = {
            //     success: false
            // };

            // try {

            //     let accountSearchObj = search.create({
            //         type: "account",
            //         filters:
            //             [
            //                 ["custrecord_ptg_terminal_bancaria", "is", "T"]
            //             ],
            //         columns:
            //             [
            //                 search.createColumn({ name: "internalid", label: "Internal ID" }),
            //                 search.createColumn({ name: "custrecord_ptg_desc_terminal_cuenta", label: "PTG - DESCRIPCION DE LA TERMINAL Y CUENTA" })
            //             ]
            //     });
            //     //  let searchResultCount = accountSearchObj.runPaged().count;
            //     //  log.debug("accountSearchObj result count",searchResultCount);
            //     //  accountSearchObj.run().each(function(result){
            //     //     // .run().each has a limit of 4,000 results
            //     //     return true;
            //     //  });

            //     let searchResultCount = accountSearchObj.run();
            //     let start = 0;
            //     let data = [];

            //     do {
            //         var results = searchResultCount.getRange(start, start + 1000);
            //         log.audit('results', results)
            //         if (results && results.length > 0) {
            //             for (let i = 0; i < results.length; i++) {
            //                 let columnas = results[i].columns;
            //                 let obj = {};
            //                 if (!!results[i].getValue(columnas[0])) {
            //                     obj.idAccount = results[i].getValue(columnas[0]);
            //                     obj.terminalName = results[i].getValue(columnas[1]);
            //                     data.push(obj);
            //                 }
            //             }
            //         }
            //         start += 1000;
            //     } while (results && results.length == 1000);

            //     response.success = true;
            //     response.data = (data.length > 0) ? data : [];



            // } catch (error) {
            //     log.debug('error', error);
            //     response.message = error;
            // }

            // return response;

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
                let customrecord_mapeo_formasdepago_cuentasSearchObj = search.create({
                    type: "customrecord_mapeo_formasdepago_cuentas",
                    filters:
                        [
                            ["custrecord_ptg_formadepago_subsidiaria", "anyof", requestBody.subsidiary],
                            "AND",
                            ["custrecord_ptg_forma_pago", "anyof", requestBody.methodPayment]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Name"
                            }),
                            search.createColumn({ name: "custrecord_ptg_forma_pago", label: "PTG - Forma de pago" }),
                            search.createColumn({ name: "custrecord_ptg_formadepago_subsidiaria", label: "PTG - Subsidiaria" }),
                            search.createColumn({ name: "custrecord_ptg_formadepago_cuenta", label: "PTG - Cuenta de banco" })
                        ]
                });
                // let searchResultCount = customrecord_mapeo_formasdepago_cuentasSearchObj.runPaged().count;
                // log.debug("customrecord_mapeo_formasdepago_cuentasSearchObj result count", searchResultCount);
                // customrecord_mapeo_formasdepago_cuentasSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });

                let searchResultCount = customrecord_mapeo_formasdepago_cuentasSearchObj.run();
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
                                obj.name= results[i].getValue(columnas[0]);
                                obj.methodPaymentId = results[i].getValue(columnas[1]);
                                obj.methodPayment = results[i].getText(columnas[1]);
                                obj.subsidiaryId = results[i].getValue(columnas[2]);
                                obj.subsidiary = results[i].getText(columnas[2]);
                                obj.accountId = results[i].getValue(columnas[3]);
                                obj.account  = results[i].getText(columnas[3]);
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
