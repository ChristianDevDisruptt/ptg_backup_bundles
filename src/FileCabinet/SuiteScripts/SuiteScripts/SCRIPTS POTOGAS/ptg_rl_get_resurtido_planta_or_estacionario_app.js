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
                //Primero devuelve los pendientes para recibir de plantas a rutas
                let transferorderPlanta = search.create({
                    type: "transferorder",
                    filters:
                        [
                            // ["type", "anyof", "TrnfrOrd"],
                            // "AND",
                            // ["mainline", "is", "T"],
                            // "AND",
                            // ["taxline", "is", "F"],
                            // "AND",
                            // ["trandate", "within", "today"],
                            // "AND",
                            // ["location.custrecord_ptg_planta_ubi_", "is", "T"],
                            // "AND",
                            // ["custbody_ptg_numero_viaje_destino", "anyof", requestBody.nTravel],
                            // "AND",
                            // ["status", "anyof", "TrnfrOrd:F"]
                            ["type", "anyof", "TrnfrOrd"],
                            "AND",
                            ["mainline", "is", "T"],
                            "AND",
                            ["taxline", "is", "F"],
                            "AND",
                            ["trandate", "within", "today"],
                            "AND",
                            ["custbody_ptg_numero_viaje_destino", "anyof", requestBody.nTravel],
                            "AND",
                            ["status", "anyof", "TrnfrOrd:F"],
                            "AND",
                            ["location.custrecord_ptg_planta_ubi_", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "tranid", label: "Document Number" }),
                            search.createColumn({ name: "transactionnumber", label: "Transaction Number" }),
                            search.createColumn({ name: "custbody_ptg_numero_viaje", label: "Número de Viaje" }),
                            search.createColumn({ name: "custbody_ptg_numero_viaje_destino", label: "NÚMERO DE VIAJE DESTINO" }),
                            search.createColumn({ name: "transferlocation", label: "To Location" }),
                            search.createColumn({ name: "location", label: "Location" }),
                            search.createColumn({ name: "statusref", label: "Status" })
                        ]
                });
                //  let searchResultCount = transferorderPlanta.runPaged().count;
                //  log.debug("transferorderPlanta result count",searchResultCount);
                //  transferorderPlanta.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                let searchResultPlanta = transferorderPlanta.run();
                let startP = 0;
                let planta = [];

                do {
                    var results = searchResultPlanta.getRange(startP, startP + 1000);
                    log.debug('results planta', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.id = results[i].getValue(columnas[0]);
                                obj.transferNumber = results[i].getValue(columnas[1]);
                                obj.fromNViaje = results[i].getText(columnas[3]);
                                obj.fromNViajeId = results[i].getValue(columnas[3]);
                                obj.toNViaje = results[i].getText(columnas[4]);
                                obj.toNViajeId = results[i].getValue(columnas[4]);
                                obj.fromLocation = results[i].getText(columnas[5]);
                                obj.fromLocationId = results[i].getValue(columnas[5]);
                                obj.toLocation = results[i].getText(columnas[6]);
                                obj.toLocationId = results[i].getValue(columnas[6]);
                                planta.push(obj);
                            }

                        }
                    }
                    startP += 1000;
                } while (results && results.length == 1000);

                //Segundo devuelve los pendientes para recibir de estaciones a rutas
                let transferorderEstacionario = search.create({
                    type: "transferorder",
                    filters:
                        [
                            ["type", "anyof", "TrnfrOrd"],
                            "AND",
                            ["mainline", "is", "T"],
                            "AND",
                            ["taxline", "is", "F"],
                            "AND",
                            ["trandate", "within", "today"],
                            "AND",
                            ["location.custrecord_ptg_estacion_carburacion_ubi", "is", "T"],
                            "AND",
                            ["status", "anyof", "TrnfrOrd:F"],
                            "AND",
                            ["custbody_ptg_numero_viaje_destino", "anyof", requestBody.nTravel]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "tranid", label: "Document Number" }),
                            search.createColumn({ name: "transactionnumber", label: "Transaction Number" }),
                            search.createColumn({ name: "custbody_ptg_numero_viaje", label: "Número de Viaje" }),
                            search.createColumn({ name: "custbody_ptg_numero_viaje_destino", label: "NÚMERO DE VIAJE DESTINO" }),
                            search.createColumn({ name: "transferlocation", label: "To Location" }),
                            search.createColumn({ name: "location", label: "Location" }),
                            search.createColumn({ name: "statusref", label: "Status" })
                        ]
                });
                //  let searchResultCount = transferorderSearchObj.runPaged().count;
                //  log.debug("transferorderSearchObj result count",searchResultCount);
                //  transferorderSearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                let searchResultEstacionario = transferorderEstacionario.run();
                let startE = 0;
                let estacionario = [];

                do {
                    var results = searchResultEstacionario.getRange(startE, startE + 1000);
                    log.debug('results estacionario', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.id = results[i].getValue(columnas[0]);
                                obj.transferNumber = results[i].getValue(columnas[1]);
                                obj.fromNViaje = results[i].getText(columnas[3]);
                                obj.fromNViajeId = results[i].getValue(columnas[3]);
                                obj.toNViaje = results[i].getText(columnas[4]);
                                obj.toNViajeId = results[i].getValue(columnas[4]);
                                obj.fromLocation = results[i].getText(columnas[5]);
                                obj.fromLocationId = results[i].getValue(columnas[5]);
                                obj.toLocation = results[i].getText(columnas[6]);
                                obj.toLocationId = results[i].getValue(columnas[6]);
                                estacionario.push(obj);
                            }

                        }
                    }
                    startE += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.planta = (planta.length > 0) ? planta : [];
                response.estacionario = (estacionario.length > 0) ? estacionario : [];

            } catch (error) {
                log.debug('error', error);
                response.messager = error;
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
