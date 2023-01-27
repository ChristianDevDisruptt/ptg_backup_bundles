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
                success: false,
                data: []
            };

            try {
                if (requestBody.hasOwnProperty('filtro') && requestBody.filtro != "") {
                    let customerSearchObj = search.create({
                        type: "customer",
                        filters:
                            [
                                // ["custentity_ptg_plantarelacionada_", "anyof", requestBody.idPlanta],
                                // "AND",
                                //["subsidiary", "anyof", "23", "20", "25"], sbx
                                ["subsidiary", "anyof", "23", "20", "26"],
                                "AND",
                                ["internalid", "anyof", requestBody.filtro],
                                "OR",
                                ["entityid", "contains", requestBody.filtro],
                                "OR",
                                ["phone", "startswith", requestBody.filtro],
                                "OR",
                                ["email", "contains", requestBody.filtro],
                                "OR",
                                ["address.custrecord_ptg_nombre_colonia", "contains", requestBody.filtro],
                                "OR",
                                ["address.custrecord_ptg_street", "contains", requestBody.filtro],
                                "OR",
                                ["address.custrecord_ptg_exterior_number", "contains", requestBody.filtro]
                            ],
                        columns:
                            [
                                search.createColumn({
                                    name: "internalid",
                                    summary: "GROUP",
                                    label: "Internal ID"
                                }),
                                search.createColumn({
                                    name: "altname",
                                    summary: "GROUP",
                                    label: "Name"
                                }),
                                search.createColumn({
                                    name: "phone",
                                    summary: "GROUP",
                                    label: "Phone"
                                }),
                                search.createColumn({
                                    name: "email",
                                    summary: "GROUP",
                                    label: "Email"
                                })
                            ]
                    });

                    log.audit('customerSearchObj', customerSearchObj)
                    //let contador = customerSearchObj.runPaged().count;
                    //log.audit('contador', contador);
                    let searchResultCount = customerSearchObj.run();
                    let start = 0;
                    let data = [];

                    do {
                        var results = searchResultCount.getRange(start, start + 1000);
                        log.audit('results', results)
                        if (results && results.length > 0) {
                            for (let i = 0; i < results.length; i++) {
                                let columnas = results[i].columns;
                                let obj = {};
                                obj.id = results[i].getValue(columnas[0]);
                                //obj.text = `${results[i].getValue(columnas[1])} - ${results[i].getValue(columnas[2])} - ${results[i].getValue(columnas[3])}`;
                                log.debug("id customer", results[i].getValue(columnas[0]))
                                if (!!results[i].getValue(columnas[0])) {
                                    let customerData = search.lookupFields({
                                        type: search.Type.CUSTOMER,
                                        id: results[i].getValue(columnas[0]),
                                        columns: ['altname', 'phone', 'email',]
                                    });
                                    log.debug('customerData', customerData)
                                    obj.name = customerData['altname'] || ""
                                    obj.phone = customerData['phone'] || ""
                                    obj.email = customerData['email'] || ""
                                    obj.address = loadAddresses(results[i].getValue(columnas[0]))
                                    data.push(obj);
                                }                                
                            }
                        }
                        start += 1000;
                    } while (results && results.length == 1000);

                    response.success = true;
                    response.data = (data.length > 0) ? data : [];
                }

            } catch (error) {
                log.debug('error', error);
                response.message = error;
            }

            return response;

        }

        function loadAddresses(customerId) {
            let addresses = [];

            let customSearch = search.create({
                type: search.Type.CUSTOMER,
                filters: ["internalid", "anyof", customerId],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        join: "Address"
                    }),
                    // search.createColumn({
                    //     name: "custrecord_ptg_latitude",
                    //     join: "Address"
                    // }),
                    // search.createColumn({
                    //     name: "custrecord_ptg_longitude",
                    //     join: "Address"
                    // }),
                    search.createColumn({
                        name: "custrecord_ptg_street",
                        join: "Address"
                    }), // numero/nombre de la calle
                    search.createColumn({
                        name: "custrecord_ptg_exterior_number",
                        join: "Address"
                    }), // numero exterior
                    search.createColumn({
                        name: "custrecord_ptg_interior_number",
                        join: "Address"
                    }), // número interior
                    search.createColumn({
                        name: "custrecord_ptg_nombre_colonia",
                        join: "Address"
                    }), // colonia
                    search.createColumn({
                        name: "custrecord_ptg_estado",
                        join: "Address"
                    }), //estado
                    search.createColumn({
                        name: "statedisplayname",
                        join: "Address"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_codigo_postal",
                        join: "Address"
                    }), // código postal
                    search.createColumn({
                        name: "custrecord_ptg_entre_las",
                        join: "Address"
                    }), //entre calle ...
                    search.createColumn({
                        name: "custrecord_ptg_y_las",
                        join: "Address"
                    }), // y calle ...
                    search.createColumn({
                        name: "city",
                        join: "Address"
                    }), // ciudad
                    search.createColumn({
                        name: "isdefaultshipping",
                        join: "Address"
                    }), // envio predeterminado
                    search.createColumn({
                        name: "isdefaultbilling",
                        join: "Address"
                    }), // envio facturación
                    search.createColumn({
                        name: "custrecord_ptg_ruta_asignada",
                        join: "Address"
                    }), // envio idRuta
                    search.createColumn({
                        name: "custrecord_ptg_tipo_servicio",
                        join: "Address",
                        label: "PTG - TIPO DE SERVICIO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_obesarvaciones_direccion_",
                        join: "Address",
                        label: "PTG - Observaciones Dirección"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_colonia_ruta",
                        join: "Address",
                        label: "PTG - COLONIA Y RUTA"
                    }),
                    search.createColumn({
                        name: "addressinternalid",
                        join: "Address",
                        label: "Address Internal ID"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_tipo_contacto",
                        join: "Address",
                        label: "PTG - TIPO DE CONTACTO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_articulo_frecuente",
                        join: "Address",
                        label: "PTG - ARTICULO FRECUENTE"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_capacidad_art",
                        join: "Address",
                        label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_articulo_frecuente2",
                        join: "Address",
                        label: "PTG - ARTICULO FRECUENTE 2"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_capacidad_can_articulo_2",
                        join: "Address",
                        label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO 2"
                    })

                ]
            });

            let customSearchPagedData = customSearch.runPaged({
                pageSize: 1000
            })
            customSearchPagedData.pageRanges.forEach(pageRange => {
                let currentPage = customSearchPagedData.fetch({
                    index: pageRange.index
                })
                currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    log.audit('result', result);

                    let idTipoServicio = result.getValue({
                        name: "custrecord_ptg_tipo_servicio",
                        join: "Address"
                    })
                    let tipoServicio = '';
                    if (idTipoServicio == 1) {
                        tipoServicio = 'Cilindro'
                    } else if (idTipoServicio == 2) {
                        tipoServicio = 'Estacionario'
                    } else if (idTipoServicio == 3) {
                        tipoServicio = 'Carburación'
                    } else if (idTipoServicio == 4) {
                        tipoServicio = 'Otros'
                    }

                    let idColandRoute = result.getValue({
                        name: "custrecord_ptg_colonia_ruta",
                        join: "Address",
                        label: "PTG - COLONIA Y RUTA"
                    });

                    // let dataRoute = search.lookupFields({
                    //     type: "customrecord_ptg_coloniasrutas_",
                    //     id: idColandRoute,
                    //     columns: ['name', 'custrecord_ptg_nombrecolonia_', 'custrecord_ptg_rutamunicipio_', 'custrecord_ptg_rutacil_', 'custrecord_ptg_rutaest_', 'custrecord_ptg_estado_', 'custrecord_ptg_zona_de_precio_', 'custrecord_ptg_cp_', 'custrecord_ptg_pbservaciones_']
                    // });

                    // log.audit('dataRoute', dataRoute)

                    // let dataZone = search.lookupFields({
                    //     type: "customrecord_ptg_zonasdeprecio_",
                    //     id: dataRoute['custrecord_ptg_zona_de_precio_'][0].value,
                    //     columns: ['name', 'custrecord_ptg_territorio_', 'custrecord_ptg_precio_']
                    // });

                    // log.audit('dataZone', dataZone)

                    // let dataZoneRoute = {
                    //     id: idColandRoute || "",
                    //     nombre: dataRoute['name'] || "",
                    //     municipio: dataRoute['custrecord_ptg_rutamunicipio_'] || "",
                    //     nameUbicacionCil: dataRoute['custrecord_ptg_rutacil_'][0].text || "",
                    //     ubicacionCil: dataRoute['custrecord_ptg_rutacil_'][0].value || "",
                    //     nameUbicacionEst: dataRoute['custrecord_ptg_rutaest_'][0].text || "",
                    //     ubicacionEst: dataRoute['custrecord_ptg_rutaest_'][0].value || "",
                    //     cp: dataRoute['custrecord_ptg_cp_'] || "",
                    //     zona_venta: dataZone['name'] || "",
                    //     precio: dataZone['custrecord_ptg_precio_'] || "",
                    //     territorio: dataZone['custrecord_ptg_territorio_'] || "",
                    // }

                    addresses.push({
                        idAdress: result.getValue({
                            name: "internalid",
                            join: "Address"
                        }),
                        nameStreet: result.getValue({
                            name: "custrecord_ptg_street",
                            join: "Address"
                        }),
                        numExterno: result.getValue({
                            name: "custrecord_ptg_exterior_number",
                            join: "Address"
                        }),
                        numInterno: result.getValue({
                            name: "custrecord_ptg_interior_number",
                            join: "Address"
                        }),
                        colonia: result.getValue({
                            name: "custrecord_ptg_nombre_colonia",
                            join: "Address"
                        }),
                        stateName: result.getValue({
                            name: "custrecord_ptg_estado",
                            join: "Address"
                        }),
                        city: result.getValue({
                            name: "city",
                            join: "Address"
                        }),
                        zip: result.getValue({
                            name: "custrecord_ptg_codigo_postal",
                            join: "Address"
                        }),
                        ptg_entre_addr: result.getValue({
                            name: "custrecord_ptg_entre_las",
                            join: "Address"
                        }),
                        ptg_y_addr: result.getValue({
                            name: "custrecord_ptg_y_las",
                            join: "Address"
                        }),
                        // latitud: result.getValue({
                        //     name: "custrecord_ptg_latitud_addr",
                        //     join: "Address"
                        // }),
                        // longitud: result.getValue({
                        //     name: "custrecord_ptg_longitud_addr",
                        //     join: "Address"
                        // }),
                        defaultShipping: result.getValue({
                            name: "isdefaultshipping",
                            join: "Address"
                        }),
                        defaultBilling: result.getValue({
                            name: "isdefaultbilling",
                            join: "Address"
                        }),
                        idRoute: result.getValue({
                            name: "custrecord_ptg_ruta_asignada",
                            join: "Address"
                        }),
                        typeService: result.getText({
                            name: "custrecord_ptg_tipo_servicio",
                            join: "Address"
                        }),
                        typeServiceId: result.getValue({
                            name: "custrecord_ptg_tipo_servicio",
                            join: "Address"
                        }),
                        commentsAddr: result.getValue({
                            name: "custrecord_ptg_obesarvaciones_direccion_",
                            join: "Address"
                        }),
                        //dataZoneRoute: dataZoneRoute,
                        idAddressLine: result.getValue({
                            name: "addressinternalid",
                            join: "Address",
                            label: "Address Internal ID"
                        }),
                        typeContact: result.getValue({
                            name: "custrecord_ptg_tipo_contacto",
                            join: "Address",
                            label: "PTG - TIPO DE CONTACTO"
                        }),
                        item1Id: result.getValue({
                            name: "custrecord_ptg_articulo_frecuente",
                            join: "Address",
                            label: "PTG - ARTICULO FRECUENTE"
                        }),
                        item1: result.getText({
                            name: "custrecord_ptg_articulo_frecuente",
                            join: "Address",
                            label: "PTG - ARTICULO FRECUENTE"
                        }),
                        item1Capacidad: result.getValue({
                            name: "custrecord_ptg_capacidad_art",
                            join: "Address",
                            label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO"
                        }),
                        item2Id: result.getValue({
                            name: "custrecord_ptg_articulo_frecuente2",
                            join: "Address",
                            label: "PTG - ARTICULO FRECUENTE 2"
                        }),
                        item2: result.getText({
                            name: "custrecord_ptg_articulo_frecuente2",
                            join: "Address",
                            label: "PTG - ARTICULO FRECUENTE 2"
                        }),
                        item2Capacidad: result.getValue({
                            name: "custrecord_ptg_capacidad_can_articulo_2",
                            join: "Address",
                            label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO 2"
                        }),
                        //city: result.getValue({ name: "city", join: "Address" }),
                    });
                });
            });

            log.debug({
                title: 'address',
                details: addresses
            });

            return addresses;
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
