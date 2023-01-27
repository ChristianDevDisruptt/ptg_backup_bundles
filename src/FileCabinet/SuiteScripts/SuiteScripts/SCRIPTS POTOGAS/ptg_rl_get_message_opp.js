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
                let opportunitySearchObj = search.create({
                    type: requestBody.tipo === 'cliente' ? 'customer' : "opportunity",
                    filters:
                        [
                            ["internalid", "anyof", requestBody.opp]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "internalid",
                                join: "userNotes",
                                sort: search.Sort.DESC,
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "title",
                                join: "userNotes",
                                label: "Title"
                            }),
                            search.createColumn({
                                name: "author",
                                join: "userNotes",
                                label: "Author"
                            }),
                            search.createColumn({
                                name: "note",
                                join: "userNotes",
                                label: "Memo"
                            }),
                            search.createColumn({
                                name: "notedate",
                                join: "userNotes",
                                label: "Date"
                            }),
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({
                                name: "custrecord_ptg_solicitud_notificacion",
                                join: "userNotes",
                                label: "PTG - SOLICITUD DE NOTIFICACIÓN"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_solicitud_cancelacion",
                                join: "userNotes",
                                label: "PTG - SOLICITUD DE CANCELACION"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_solici_cambio_fech_prome",
                                join: "userNotes",
                                label: "PTG - SOLICITUD DE CAMBIO DE FECHA PROMETIDA"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_nueva_fecha_prometida",
                                join: "userNotes",
                                label: "PTG - NUEVA FECHA PROMETIDA"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_mostrar_alerta",
                                join: "userNotes",
                                label: "PTG - MOSTRAR ALERTA"
                            })
                        ]
                });

                if(requestBody.tipo === 'cliente') {
                    log.audit("entre", "1");
                    var clientFilt = search.createFilter({
                        name: "notetype",
                        join: "userNotes",
                        operator: "anyof",
                        values: 13
                    })
                    opportunitySearchObj.filters.push(clientFilt);
                }
                // let searchResultCount = opportunitySearchObj.runPaged().count;
                // log.debug("opportunitySearchObj result count", searchResultCount);
                // opportunitySearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });
                let searchResultCount = opportunitySearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results message', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.noteId = results[i].getValue(columnas[0]);
                                obj.title = results[i].getValue(columnas[1]);
                                obj.author = results[i].getText(columnas[2]);
                                obj.note = results[i].getValue(columnas[3]);
                                obj.date = results[i].getValue(columnas[4]);
                                obj.solicitud_notificacion = results[i].getValue(columnas[6]);
                                obj.solicitud_cancelacion = results[i].getValue(columnas[7]);
                                obj.solicitud_cambio_fecha = results[i].getValue(columnas[8]);
                                obj.solicitud_nueva_fecha = results[i].getValue(columnas[9]);
                                obj.mostrar_alerta = results[i].getValue(columnas[10]);
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
