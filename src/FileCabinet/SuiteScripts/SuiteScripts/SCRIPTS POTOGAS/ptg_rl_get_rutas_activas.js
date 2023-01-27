/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search', 'N/query'],
    /**
 * @param{search} search
 */
    (search, query) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {
            let response = {
                success: false,
                data: []
            }
            try {
                let transactionSearchObj = search.create({
                    type: "transaction",
                    filters:
                        [
                            ["mainline", "is", "T"],
                            "AND",
                            ["type", "anyof", "Opprtnty"],
                            "AND",
                            ["custbody_ptg_numero_viaje.custrecord_ptg_ruta", "noneof", "@NONE@"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "custrecord_ptg_ruta",
                                join: "CUSTBODY_PTG_NUMERO_VIAJE",
                                summary: "GROUP",
                                sort: search.Sort.ASC,
                                label: "PTG - Ruta"
                            }),
                            search.createColumn({
                                name: "tranid",
                                summary: "COUNT",
                                label: "Document Number"
                            })
                        ]
                });


                //  let searchResultCount = transactionSearchObj.runPaged().count;
                //  log.debug("transactionSearchObj result count",searchResultCount);
                //  transactionSearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });

                log.audit('transactionSearchObj', transactionSearchObj)
                let contador = transactionSearchObj.runPaged().count;
                log.audit('contador', contador);
                let searchResultCount = transactionSearchObj.run();
                let start = 0;
                let routes = [];
                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let objRoute = {};
                            let idRoute = results[i].getValue(columnas[0]);
                            let routeName = results[i].getText(columnas[0]);
                            let total = results[i].getValue(columnas[1]);
                            objRoute.idRoute = idRoute;
                            objRoute.routeName = routeName;
                            objRoute.total = total;

                            routes.push(objRoute);

                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.data = (routes.length > 0) ? routes : [];
            } catch (error) {
                log.debug('error', error);
                response.message = error;
            }

            return response;
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
                success: false,
                data: []
            }                
            try {
                //     let transactionSearchObj = search.create({
                //         type: "transaction",
                //         filters:
                //             [
                //                 // ["mainline", "is", "T"],
                //                 // "AND",
                //                 // ["type", "anyof", "Opprtnty"],
                //                 // "AND",
                //                 // ["custbody_ptg_numero_viaje.custrecord_ptg_ruta", "noneof", "@NONE@"],
                //                 // "AND",
                //                 // ["custbody_ptg_tipo_servicio", "anyof", requestBody.tipo],
                //                 // "AND",
                //                 // ["custbody_ptg_estado_pedido", "noneof", "@NONE@"]
                //                 ["mainline", "is", "T"],
                //                 "AND",
                //                 ["type", "anyof", "Opprtnty"],
                //                 "AND",
                //                 ["custbody_ptg_tipo_servicio", "anyof", requestBody.tipo],
                //                 "AND",
                //                 ["custbody_ptg_estado_pedido", "noneof", "@NONE@"],
                //                 "AND",
                //                 ["custbody_ptg_numero_viaje.custrecord_ptg_planta_tabladeviajes_", "contains", requestBody.ruta]
                //             ],
                //         columns:
                //             [
                //                 search.createColumn({
                //                     name: "custrecord_ptg_ruta",
                //                     join: "CUSTBODY_PTG_NUMERO_VIAJE",
                //                     summary: "GROUP",
                //                     sort: search.Sort.ASC,
                //                     label: "PTG - Ruta"
                //                 }),
                //                 search.createColumn({
                //                     name: "custbody_ptg_estado_pedido",
                //                     summary: "GROUP",
                //                     label: "PTG - ESTADO DEL PEDIDO"
                //                 }),
                //                 search.createColumn({
                //                     name: "formulanumeric",
                //                     summary: "SUM",
                //                     formula: "1",
                //                     label: "Formula (Numeric)"
                //                 })
                //             ]
                //     });


                //     //  let searchResultCount = transactionSearchObj.runPaged().count;
                //     //  log.debug("transactionSearchObj result count",searchResultCount);
                //     //  transactionSearchObj.run().each(function(result){
                //     //     // .run().each has a limit of 4,000 results
                //     //     return true;
                //     //  });

                //     log.audit('transactionSearchObj', transactionSearchObj)
                //     let contador = transactionSearchObj.runPaged().count;
                //     log.audit('contador', contador);
                //     let searchResultCount = transactionSearchObj.run();
                //     let start = 0;
                //     let routes = [];
                //     do {
                //         var results = searchResultCount.getRange(start, start + 1000);
                //         log.audit('results', results)
                //         if (results && results.length > 0) {
                //             for (let i = 0; i < results.length; i++) {
                //                 let columnas = results[i].columns;
                //                 let objRoute = {};
                //                 let idRoute = results[i].getValue(columnas[0]);
                //                 let routeName = results[i].getText(columnas[0]);
                //                 let statusId = results[i].getValue(columnas[1]);
                //                 let status = results[i].getText(columnas[1]);
                //                 let total = results[i].getValue(columnas[2]);
                //                 objRoute.idRoute = idRoute;
                //                 objRoute.routeName = routeName;
                //                 objRoute.statusId = statusId;
                //                 objRoute.status = status;
                //                 objRoute.total = total;

                //                 routes.push(objRoute);

                //             }
                //         }
                //         start += 1000;
                //     } while (results && results.length == 1000);

                //     response.success = true;
                //     response.data = (routes.length > 0) ? routes : [];
                let sql = ` SELECT 
                                VI.id, 
                                VI.custrecord_ptg_ruta, 
                                LO.name,
                                VI.custrecord_ptg_telefono_chofer, 
                                VI.custrecord_ptg_chofer_tabladeviajes_, 
                                VI.custrecord_ptg_ayudante_tabladeviajes_, 
                                LO.custrecord_ptg_estacionario_, 
                                LO.custrecord_ptg_ruta_cilindro_
                            FROM 
                                CUSTOMRECORD_PTG_TABLADEVIAJE_ENC2_ VI 
                            INNER JOIN
                                Location LO 
                                    ON LO.id = VI.custrecord_ptg_ruta
                            WHERE
                                VI.custrecord_ptg_planta_tabladeviajes_ = '${requestBody.planta}' `;
                                

                if(requestBody.fecha) {
                    sql += ` AND VI.custrecord_ptg_fecha_viaje_en_curso = '${requestBody.fecha}' `
                }
                log.debug("sql", sql)
                let resultIterator = query.runSuiteQLPaged({
                    query: sql,
                    pageSize: 1000
                }).iterator();

                let data = [];
                resultIterator.each(function (page) {
                    let pageIterator = page.value.data.iterator();
                    pageIterator.each(function (row) {
                        let obj = {};
                        log.debug('data', row)
                        if (!!row.value.getValue(0)) {
                            obj.id = row.value.getValue(0);
                            obj.routeId = row.value.getValue(1);
                            obj.route = row.value.getValue(2);
                            obj.telefono = row.value.getValue(3);
                            obj.chofer = row.value.getValue(4);
                            obj.ayudante = row.value.getValue(5);
                            obj.estacionario = row.value.getValue(6);
                            obj.cilindro = row.value.getValue(7);
                            data.push(obj);
                        }

                        return true;
                    });
                    return true;
                });

                log.debug('data', data)
                response.success = true;
                response.data = data;
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
