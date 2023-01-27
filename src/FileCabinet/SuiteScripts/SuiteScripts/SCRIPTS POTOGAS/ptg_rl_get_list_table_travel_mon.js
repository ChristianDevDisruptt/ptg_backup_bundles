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

            log.debug('requestBody', requestBody)
            try {
                let customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:
                        [
                            ["created", "within", "today"],
                            "AND",
                            ["custrecord_ptg_estatus_tabladeviajes_", "anyof", "3"],
                            "AND",
                            ["custrecord_ptg_planta_tabladeviajes_", "contains", requestBody.namePlanta]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Name"
                            }),
                            search.createColumn({ name: "custrecord_ptg_ruta", label: "PTG - Ruta" }),
                            search.createColumn({
                                name: "internalid",
                                join: "CUSTRECORD_PTG_RUTA",
                                label: "Internal ID"
                            }),
                            search.createColumn({ name: "custrecord_ptg_turno", label: "PTG - Turno" }),
                            search.createColumn({ name: "custrecord_ptg_estatus_tabladeviajes_", label: "PTG - Estatus (Tabla de viajes)" }),
                            search.createColumn({ name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)" }),
                            search.createColumn({ name: "custrecord_ptg_telefono_chofer", label: "PTG - Telefono chofer" }),
                            search.createColumn({ name: "custrecord_ptg_serviciocilindro_", label: "PTG - SERVICIO CILINDROS" }),
                            search.createColumn({ name: "custrecord_ptg_servicioestacionario_", label: "PTG - SERVICIO ESTACIONARIOS" }),
                        ]
                });
                // let searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.runPaged().count;
                // log.debug("customrecord_ptg_tabladeviaje_enc2_SearchObj result count", searchResultCount);
                // customrecord_ptg_tabladeviaje_enc2_SearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });
                let searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.debug('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.nViajeId = results[i].getValue(columnas[0]);
                                obj.nViaje = results[i].getValue(columnas[1]);
                                obj.rutaId = results[i].getValue(columnas[2]);
                                obj.ruta = results[i].getText(columnas[2]);
                                obj.turno = results[i].getText(columnas[4]);
                                obj.turnoId = results[i].getValue(columnas[4]);
                                obj.estado = results[i].getText(columnas[5]);
                                obj.estadoId = results[i].getValue(columnas[5]);
                                obj.choferId = results[i].getValue(columnas[6]);
                                obj.choferName = results[i].getText(columnas[6]);
                                obj.choferPhone = results[i].getValue(columnas[7]);
                                obj.esCilindro = results[i].getValue(columnas[8]);
                                obj.esEstacionario = results[i].getValue(columnas[9]);
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
