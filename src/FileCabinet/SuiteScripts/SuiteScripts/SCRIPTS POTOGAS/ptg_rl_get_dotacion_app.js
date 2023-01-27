/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
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

                let customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:
                        [
                            ["internalid","anyof", requestBody.nameId],
                            "AND",
                            ["custrecord_ptg_vehiculo_tabladeviajes_", "anyof", requestBody.vehiculoId]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ptg_descripcion_dotacion_",
                                join: "CUSTRECORD_PTG_NUMVIAJE_DOT_",
                                label: "PTG - Descripción dotación"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_cilindro_dotacion_",
                                join: "CUSTRECORD_PTG_NUMVIAJE_DOT_",
                                label: "PTG - Cilindro dotación"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_dotacion_cilindros",
                                join: "CUSTRECORD_PTG_NUMVIAJE_DOT_",
                                label: "PTG - Dotación cilndros"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_ruta_",
                                join: "CUSTRECORD_PTG_NUMVIAJE_DOT_",
                                label: "PTG - Ruta"
                            }),
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Name"
                            }),
                            search.createColumn({ name: "custrecord_ptg_vehiculo_tabladeviajes_", label: "PTG - Vehiculo (Tabla de Viajes)" })
                        ]
                });
                //  let searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.runPaged().count;
                //  log.debug("customrecord_ptg_tabladeviaje_enc2_SearchObj result count",searchResultCount);
                //  customrecord_ptg_tabladeviaje_enc2_SearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                let searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results message', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[1])) {
                                obj.description = results[i].getValue(columnas[0]);
                                obj.itemId = results[i].getValue(columnas[1]);
                                obj.item = results[i].getText(columnas[1]);
                                obj.quantity = results[i].getValue(columnas[2]);
                                obj.routeId = results[i].getValue(columnas[3]);
                                obj.route = results[i].getText(columnas[3]);
                                obj.name = results[i].getValue(columnas[4]);
                                obj.vehiculoId = results[i].getValue(columnas[5]);
                                obj.vehiculo = results[i].getText(columnas[5]);
                                data.push(obj);
                            }

                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                log.debug('data', data)
                response.success = true;
                response.data = (data.length > 0) ? data : [];

            } catch (error) {
                log.debug('err', error);
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
