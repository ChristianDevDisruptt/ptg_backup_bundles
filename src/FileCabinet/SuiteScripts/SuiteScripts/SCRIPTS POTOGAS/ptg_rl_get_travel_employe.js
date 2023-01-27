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
                success : false,
                data : []                
            };

            try {
                let customSearch = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters: [
                        ["created", "within", "today"], "AND",
                        ["custrecord_ptg_chofer_tabladeviajes_", "is", requestBody.employee], "AND",
                        ["custrecord_ptg_estatus_tabladeviajes_", "anyof", 3], "AND",
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({ name: "name" }),
                        search.createColumn({ name: "custrecord_ptg_viaje_tabladeviajes_", label: "PTG - #Viaje (Tabla de viajes)" }),
                        search.createColumn({ name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)" }),
                        search.createColumn({ name: "internalid", label: "ID interno" }),
                        search.createColumn({ name: "custrecord_ptg_planta_tabladeviajes_", label: "Planta" }),
                        search.createColumn({ name: "custrecord_ptg_vehiculo_tabladeviajes_", label: "Vehiculo" }),
                        search.createColumn({ name: "custrecord_ptg_turno", label: "Turno" }),
                      search.createColumn({name: "custrecord_ptg_ruta", label: "PTG - Ruta"})
                    ]
                });
    
                /** @type {{id: string, name: string, driverId: string, driver: string}[]: object[]} */
                let viajes = [];
    
                //let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 });
                let customSearchPagedData = customSearch.run();
                var results = customSearchPagedData.getRange(0, 1000);
                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    var viaje = {
                        name : results[i].getValue(columnas[0]),
                        vehicleId: results[i].getValue(columnas[5]),
                        vehicle: results[i].getText(columnas[5]),
                        plantId: results[i].getValue(columnas[4]),
                        plant: results[i].getText(columnas[4]),
                        turnId: results[i].getValue(columnas[6]),
                        turn: results[i].getText(columnas[6]),
                        ruta: results[i].getValue(columnas[7])
                    }
                    viajes.push(viaje)

                }
                //customSearchPagedData.pageRanges.forEach(pageRange => {
                    //let currentPage = customSearchPagedData.fetch({ index: pageRange.index });
                    //currentPage.data.forEach((result, indx, origingArray) => {
                        /// Do something
                        //viajes.push({
                        //    id: result.getValue({ name: "internalid" }),
                        //    name: result.getValue({ name: "custrecord_ptg_viaje_tabladeviajes_" }),
                        //    //driverId: result.getValue({ name: "custrecord_ptg_chofer_tabladeviajes_" }),
                        //    //driver: result.getText({ name: "custrecord_ptg_chofer_tabladeviajes_" }),
                        //    vehicleId: result.getValue({ name: "custrecord_ptg_vehiculo_tabladeviajes_" }),
                        //    vehicle: result.getText({ name: "custrecord_ptg_vehiculo_tabladeviajes_" }),
                        //    plantId: result.getValue({ name: "custrecord_ptg_planta_tabladeviajes_" }),
                        //    plant: result.getText({ name: "custrecord_ptg_planta_tabladeviajes_" }),
                        //    turnId: result.getValue({ name: "custrecord_ptg_turno" }),
                        //    turn: result.getText({ name: "custrecord_ptg_turno" })
                        //});
                    //});
                //});
                log.audit('viajes', viajes)

                response.success = true;
                response.data = (viajes.length > 0 ) ? viajes : [];

                return response;

            } catch (error) {
                log.debug("searchEmployee ERROR", error);
                response.message = error
                return response;

            }
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

        return {get, put, post, delete: doDelete}

    });
