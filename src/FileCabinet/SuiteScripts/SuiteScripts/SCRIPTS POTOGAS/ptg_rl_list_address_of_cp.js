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
                let customrecord_ptg_coloniasrutas_SearchObj = search.create({
                    type: "customrecord_ptg_coloniasrutas_",
                    filters:
                        [
                            ["custrecord_ptg_cp_", "is", requestBody.zip]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "custrecord_ptg_nombrecolonia_", label: "PTG - NOMBRE DE COLONIA" }),
                            search.createColumn({ name: "custrecord_ptg_rutamunicipio_", label: "PTG - MUNICIPIO" }),
                            search.createColumn({ name: "custrecord_ptg_rutacil_", label: "PTG - CIL" }),
                            search.createColumn({ name: "custrecord_ptg_rutaest_", label: "PTG - EST" }),
                            search.createColumn({ name: "custrecord_ptg_estado_", label: "PTG - Estado " }),
                            search.createColumn({ name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio" }),
                            search.createColumn({ name: "custrecord_ptg_cp_", label: "PTG - CP" }),
                            search.createColumn({name: "internalid", label: "Internal ID"}),
                            search.createColumn({name: "custrecord_ptg_rutacil_tarde", label: "PTG - CIL TARDE"}),
                            search.createColumn({name: "custrecord_ptg_rutaest_tarde", label: "PTG - EST TARDE"})
                        ]
                });
                // let searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.runPaged().count;
                // log.debug("customrecord_ptg_coloniasrutas_SearchObj result count", searchResultCount);
                // customrecord_ptg_coloniasrutas_SearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });

                let searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.run();
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
                                obj.colonia = results[i].getValue(columnas[0]);
                                obj.country = results[i].getValue(columnas[1]);
                                obj.rutaCilId = results[i].getValue(columnas[2]) || "";
                                obj.rutaCil = results[i].getText(columnas[2]) || "";
                                obj.rutaEstaId = results[i].getValue(columnas[3] || "");
                                obj.rutaEsta = results[i].getText(columnas[3]) || "";
                                obj.state = results[i].getValue(columnas[4]);
                                obj.zonePriceId = results[i].getValue(columnas[5]);
                                obj.zonePrice = results[i].getText(columnas[5]);
                                obj.zip = results[i].getValue(columnas[6]);    
                                obj.id = results[i].getValue(columnas[7]);
                                obj.rutaCilVespId = results[i].getValue(columnas[8]) || "";
                                obj.rutaCilVesp = results[i].getText(columnas[8]) || "";
                                obj.rutaEstVespId = results[i].getValue(columnas[9]) || "";
                                obj.rutaEstVesp = results[i].getText(columnas[9]) || "";
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
