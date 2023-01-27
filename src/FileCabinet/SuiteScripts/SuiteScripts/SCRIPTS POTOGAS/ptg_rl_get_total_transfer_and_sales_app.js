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

                let nViaje = requestBody.nTravel;
                //Primero obtenemos el total de los cilindros que surtio a otro numero de viaje
                let totalSurtido = search.create({
                    type: "customrecord_ptg_regitrodemovs_",
                    filters:
                        [
                            ["custrecord_ptg_num_viaje_oportunidad", "anyof", nViaje],
                            "AND",
                            ["created", "on", "today"],
                            "AND",
                            ["custrecord_drt_ptg_reg_transaccion.type", "anyof", "TrnfrOrd"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ptg_movmenos_",
                                summary: "GROUP",
                                label: "PTG - Mov -"
                            }),
                            search.createColumn({
                                name: "internalid",
                                summary: "GROUP",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_cilindro",
                                summary: "GROUP",
                                label: "PTG - Cilindro"
                             })
                        ]
                });
                //  let searchResultCount = customrecord_ptg_regitrodemovs_SearchObj.runPaged().count;
                //  log.debug("customrecord_ptg_regitrodemovs_SearchObj result count",searchResultCount);
                //  customrecord_ptg_regitrodemovs_SearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                log.audit('totalSurtido', totalSurtido)
                //let contador = totalSurtido.runPaged().count;
                //log.audit('contador', contador);
                let searchResultCountSurtido = totalSurtido.run();
                let startS = 0;
                let sumSurtidos = 0;
                let surtidos = [];

                do {
                    var results = searchResultCountSurtido.getRange(startS, startS + 1000);
                    log.audit('results resurtidos', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.total = Number(results[i].getValue(columnas[0]));
                                obj.idRecord = results[i].getValue(columnas[1]);
                                obj.itemId = results[i].getValue(columnas[2]);
                                obj.item = results[i].getText(columnas[2]);
                                surtidos.push(obj)
                            }
                        }
                    }
                    startS += 1000;
                } while (results && results.length == 1000);


                //Segundo obtenemos el total de los cilindros que obtuvo por otro vehiculo
                let totalRecibidos = search.create({
                    type: "customrecord_ptg_regitrodemovs_",
                    filters:
                        [
                            ["custrecord_ptg_num_viaje_oportunidad", "anyof", nViaje],
                            "AND",
                            ["created", "on", "today"],
                            "AND",
                            ["custrecord_drt_ptg_reg_transaccion.type", "anyof", "ItemRcpt"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ptg_movmas_",
                                summary: "GROUP",
                                label: "PTG - Mov +"
                            }),                            
                            search.createColumn({
                                name: "internalid",
                                summary: "GROUP",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_cilindro",
                                summary: "GROUP",
                                label: "PTG - Cilindro"
                             })
                        ]
                });
                //  let searchResultCount = customrecord_ptg_regitrodemovs_SearchObj.runPaged().count;
                //  log.debug("customrecord_ptg_regitrodemovs_SearchObj result count",searchResultCount);
                //  customrecord_ptg_regitrodemovs_SearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                log.audit('totalRecibidos', totalRecibidos)
                //let contador = totalSurtido.runPaged().count;
                //log.audit('contador', contador);
                let startR = 0;
                let searchResultCountRecibidos = totalRecibidos.run();                
                let recibidos = [];

                do {
                    var results = searchResultCountRecibidos.getRange(startR, startR + 1000);
                    log.audit('results recibidos', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.total = Number(results[i].getValue(columnas[0]));
                                obj.idRecord = results[i].getValue(columnas[1]);
                                obj.itemId = results[i].getValue(columnas[2]);
                                obj.item = results[i].getText(columnas[2]);
                                recibidos.push(obj)
                            }
                        }
                    }
                    startR += 1000;
                } while (results && results.length == 1000);

                //Tercero ventas de cilindros que ha concluido el viaje
                let totalSales = search.create({
                    type: "customrecord_ptg_regitrodemovs_",
                    filters:
                    [
                       ["custrecord_ptg_num_viaje_oportunidad","anyof",nViaje], 
                       "AND", 
                       ["custrecord_drt_ptg_reg_oportunidad.internalid","noneof","@NONE@"]
                    ],
                    columns:
                    [
                       search.createColumn({name: "custrecord_ptg_ventagas_", label: "PTG - Venta Gas"}),
                       search.createColumn({name: "custrecord_ptg_cilindro", label: "PTG - Cilindro"}),
                       search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                 });
                //  let searchResultCount = customrecord_ptg_regitrodemovs_SearchObj.runPaged().count;
                //  log.debug("customrecord_ptg_regitrodemovs_SearchObj result count",searchResultCount);
                //  customrecord_ptg_regitrodemovs_SearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });
                log.audit('totalSales', totalSales)
                //let contador = totalSurtido.runPaged().count;
                //log.audit('contador', contador);
                let searchResultCountVendidos = totalSales.run(); 
                let startV = 0;               
                let vendidos = [];

                do {
                    var results = searchResultCountVendidos.getRange(startV, startV + 1000);
                    log.audit('results totalSales', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.total = Number(results[i].getValue(columnas[0]));
                                obj.idRecord = results[i].getValue(columnas[2]);
                                obj.itemId = results[i].getValue(columnas[1]);
                                obj.item = results[i].getText(columnas[1]);
                                vendidos.push(obj)
                            }
                        }
                    }
                    startV += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.surtidos = (surtidos.length > 0) ? surtidos : [];
                response.recibidos = (recibidos.length > 0) ? recibidos : [];
                response.vendidos = (vendidos.length > 0) ? vendidos : [];

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
