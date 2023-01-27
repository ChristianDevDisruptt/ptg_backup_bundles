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
            try {
                let response = {
                    success: false,
                    data: []
                };
                let arrayOportunidadesApp = [];
                let objOportunidadesApp = {};                

                let id = requestBody.idOpp;

                log.audit('id', id);
                //segunda busqueda 
                let transactionSearchObj = search.create({
                    type: "transaction",
                    filters: [
                        ["type", "anyof", "Opprtnty"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["taxline", "is", "F"],
                        "AND",
                        ["internalid", "anyof", id]
                    ],
                    columns: [
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "transactionnumber", label: "Transaction Number" }),
                        search.createColumn({ name: "salesrep", label: "Sales Rep" }),
                        search.createColumn({ name: "custbody_ptg_estado_pedido", label: "PTG - ESTADO DEL PEDIDO" }),
                        search.createColumn({
                            name: "custrecord_ptg_estatus_tabladeviajes_",
                            join: "CUSTBODY_PTG_NUMERO_VIAJE",
                            label: "PTG - Estatus (Tabla de viajes)"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "shippingAddress",
                            label: "Id Shipping Address"
                        }),
                        search.createColumn({
                            name: "altname",
                            join: "customer",
                            label: "Name"
                        }),
                        search.createColumn({ name: "custbody_ptg_opcion_pago", label: "Opción de Pago" }),
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({
                            name: "custrecord_streetname",
                            join: "shippingAddress",
                            label: "Street Name"
                        }),
                        search.createColumn({
                            name: "custrecord_streetnum",
                            join: "shippingAddress",
                            label: "Street Number"
                        }),
                        search.createColumn({
                            name: "custrecord_colonia",
                            join: "shippingAddress",
                            label: "Colonia"
                        }),
                        search.createColumn({ name: "custbody_ptg_entre_las", label: "Entre las" }),
                        search.createColumn({ name: "custbody_ptg_y_las", label: "Y las" }),
                        search.createColumn({ name: "custbody_ptg_opcion_pago_obj", label: "PTG - OPCIÓN DE PAGO OBJ" }),
                        search.createColumn({ name: "custbody_ptg_precio_articulo_zona", label: "PTG - PRECIO DEL ARICULO EN LA ZONA" }),
                    ]
                });
                //fin
                let searchResultCount = transactionSearchObj.run();
                let start = 0;
                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('result', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            //             log.audit('columnas', columnas)
                            let idDocumento = results[i].getValue(columnas[0]);
                            let idCliente = results[i].getValue(columnas[1]);
                            let nombreCliente = results[i].getText(columnas[1]);
                            let idRepresentante = results[i].getValue(columnas[3]);
                            let nombreRepresentante = results[i].getText(columnas[3]);
                            let statusOportunidad = results[i].getText(columnas[4]);
                            let idstatusNumeroViaje = results[i].getValue(columnas[5]);
                            let nombreStatusNumeroViaje = results[i].getText(columnas[5]);
                            let cDireccion = results[i].getValue(columnas[6]);
                            let sNombre = results[i].getValue(columnas[7]);
                            //             let cIndicaciones = results[i].getValue(columnas[8]);
                            let mPago = results[i].getText(columnas[8]);
                            let idPago = results[i].getValue(columnas[8]);
                            let idInterno_tramnsaccion = results[i].getValue(columnas[9]);
                            //let calle = results[i].getValue(columnas[16]);
                            //let nInterior = results[i].getValue(columnas[17]);
                            //let colonia = results[i].getValue(columnas[18]);
                            //let ref = results[i].getValue(columnas[19]);
                            let entre_las = results[i].getValue(columnas[13]);
                            let y_las = results[i].getValue(columnas[14]);
                            let objPagos = results[i].getValue(columnas[15]);
                            let priceZone = results[i].getValue(columnas[16]);
                            log.audit('direccion id', cDireccion);
                            let searchDireccion = search.lookupFields({
                                type: 'address',
                                id: cDireccion,
                                columns: ['custrecord_ptg_street', 'custrecord_ptg_exterior_number', 'custrecord_ptg_obesarvaciones_direccion_', 'custrecord_ptg_nombre_colonia', 'custrecord_ptg_y_entre_', 'custrecord_ptg_entrecalle_', 'custrecord_ptg_interior_number']
                            });
                            log.audit('searchDireccion', searchDireccion);
                            objOportunidadesApp = {
                                numero_documento: idDocumento,
                                id_cliente: idCliente,
                                nombre_cliente: nombreCliente,
                                id_representante: idRepresentante,
                                nombre_representante: nombreRepresentante,
                                estado_oportunidad: statusOportunidad,
                                id_estado_numero_viaje: idstatusNumeroViaje,
                                estado_numero_viaje: nombreStatusNumeroViaje,
                                entre_las: entre_las,
                                y_las: y_las,
                                calle: searchDireccion['custrecord_ptg_street'],
                                numExterior: searchDireccion['custrecord_ptg_exterior_number'],
                                numInterior: searchDireccion['custrecord_ptg_interior_number'],
                                colonia: searchDireccion['custrecord_ptg_nombre_colonia'],
                                entreCalle: searchDireccion['custrecord_ptg_entrecalle_'],
                                yEntreCalle: searchDireccion['custrecord_ptg_y_entre_'],
                                nombre: sNombre,
                                observaciones: searchDireccion['custrecord_ptg_obesarvaciones_direccion_'],
                                forma_pago: mPago,
                                objMetodosPagos: objPagos,
                                id_forma_pago: idPago,
                                id_interno_oportunidad: idInterno_tramnsaccion,
                                priceZone: priceZone
                                // articulos: [{
                                //     id_item: results[i].getValue(columnas[10]),
                                //     nomnbre: results[i].getValue(columnas[12]),
                                //     cantidad: results[i].getValue(columnas[13]),
                                //     //unidad_medida: results[i].getValue(columnas[14])
                                //     precio_unitario: results[i].getValue(columnas[15]),
                                // }]
                            }


                            arrayOportunidadesApp.push(objOportunidadesApp);
                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);
                log.audit('arrayOportunidadesApp', arrayOportunidadesApp)

                if (arrayOportunidadesApp.length > 0) {
                    response.data = arrayOportunidadesApp;
                    response.success = true;

                }

                return response;

                // return JSON.stringify(arrayOportunidadesApp);

            } catch (error) {
                log.audit('error', error);
                response.message = error;
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

        return { get, put, post, delete: doDelete }

    });
