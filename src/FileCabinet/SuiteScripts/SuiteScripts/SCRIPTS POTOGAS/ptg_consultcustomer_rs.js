/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description consulta de clientes por medio de filtros
 */
define(['N/log', "N/search", "N/record", 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors'], function (log, search, record, error) {

    // se crea la estructura donde se cargará toda la data

    const responseData = {
        isSuccessful: false,
        message: "some errors occured",
        data: null,
        apiErrorPost: []
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
                search.createColumn({
                    name: "custrecord_ptg_latitude",
                    join: "Address"
                }),
                search.createColumn({
                    name: "custrecord_ptg_longitude",
                    join: "Address"
                }),
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
                    name: "custrecord_ptg_between",
                    join: "Address"
                }), //entre calle ...
                search.createColumn({
                    name: "custrecord_ptg_and",
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
                }) // envio idRuta
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
                        name: "custrecord_ptg_between",
                        join: "Address"
                    }),
                    ptg_y_addr: result.getValue({
                        name: "custrecord_ptg_and",
                        join: "Address"
                    }),
                    latitud: result.getValue({
                        name: "custrecord_ptg_latitud_addr",
                        join: "Address"
                    }),
                    longitud: result.getValue({
                        name: "custrecord_ptg_longitud_addr",
                        join: "Address"
                    }),
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

    function customSearch(request, arrayResult, responseData) {


        var filter = [];
        try {
            if ((request.planta && request.phone)) {
                filter.push(
                    ['custentity_ptg_plantarelacionada_', 'is', request.planta], 'and',
                    ['phone', 'is', request.phone]
                );
            }

            if (request.planta && request.colonia) {
                filter.push(
                    ['custentity_ptg_plantarelacionada_', 'is', request.planta], 'and',
                    ['address.custrecord_colonia', 'is', request.colonia]
                );
            }

            if (request.planta && request.email) {
                filter.push(
                    ['custentity_ptg_plantarelacionada_', 'is', request.planta], 'and',
                    ['email', 'is', request.email]
                );
            }

            if (request.planta && request.name) {
                filter.push(
                    ['custentity_ptg_plantarelacionada_', 'is', request.planta], 'and',
                    ['companyname', 'is', request.name]
                );
            }
            /*
            if(request.planta){
                filter.push(['custentity_ptg_plantarelacionada_', 'is', request.planta]);
            }else if (request.phone) {
                filter.push(['phone', 'is', request.phone]);
                log.audit('filtro 1', 'telefono');
            } 
            else if (request.colonia) {
                filter.push(['address.custrecord_colonia', 'is', request.colonia]);
                log.audit('filtro 2', 'colonia');
            } else if(request.email){
                filter.push(['email', 'is', request.email]);
                log.audit('filtro 3', 'email');
            } else if(request.name){
                filter.push(['companyname', 'is', request.name]);
                log.audit('filtro 4', request.name);
            }
            */

            /*else if (request.colonia || request.numExterno || request.nameStreet || request.zip || request.city || request.stateName) {
                filter.push(
                    ["address.custrecord_colonia", "is", request.colonia], 'and',
                    ["address.custrecord_streetnum", "is", request.numExterno], 'and',
                    ['address.custrecord_streetname', 'is', request.nameStreet], 'and',
                    ["address.zipcode", "is", request.zip], 'and',
                    ['address.city', 'is', request.city], 'and',
                    ["address.state", "is", request.stateName]
                )
            
            }*/


        } catch (err) {
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));
        }


        try {
            //let addresses = [];
            log.audit('filtros', filter);
            var customSearchObj = search.create({
                type: search.Type.CUSTOMER,
                filters: [
                    ["custentity_ptg_plantarelacionada_", "anyof", request.planta],
                    "AND",
                    ["phone", "startswith", request.util],
                    "OR",
                    ["email", "startswith", request.util],
                    "OR",
                    ["address.custrecord_ptg_street", "startswith", request.util],
                    "OR",
                    ["address.custrecord_ptg_exterior_number", "startswith", request.util],
                    "OR",
                    ["entityid", "startswith", request.util]
                ],
                columns: [
                    search.createColumn({
                        name: "entityid",
                        sort: search.Sort.ASC
                    }),
                    "altname",
                    "email",
                    "phone",
                    "altphone",
                    "companyname",
                    "mobilephone",
                    "custentity_disa_cliente_giro",
                    "custentity_ptg_notas_cliente_",
                    "custentity_ptg_tipodecliente_",
                    "custentity_ptg_entrelas_",
                    "custentity_ptg_ylas_",
                    "custentity_ptg_tipodeservicio_",
                    "isinactive",
                    "creditlimit",
                    "balance",
                    "overduebalance",
                    "custentity_ptg_saldo_disponible",
                    "daysoverdue",
                    "custentity_ptg_alianza_comercial_cliente",
                    "terms",
                    "custentity_ptg_numero_contrato"
                ]
            })
            /*
            if ((!request.phone || !request.phone.toString().trim())
                && !(request.colonia && request.numExterno && request.nameStreet && request.zip && request.city && request.stateName))
                throw 'Telefono vacío'

            log.debug("FILTROS", filter)
            if (filter.length < 1)
                throw 'Filtros vacios!'
                */

            let customSearchPagedData = customSearchObj.runPaged({
                pageSize: 1000
            });
            customSearchPagedData.pageRanges.forEach(pageRange => {
                // Carga la info
                let currentPage = customSearchPagedData.fetch({
                    index: pageRange.index
                })
                // Itera sobre cada resultado, es como el "each",
                currentPage.data.forEach((result, indx, origingArray) => {
                    //convertir "result object" a objeto deseado

                    let id = result.id
                    //let nombre = result.getValue({ name: "custentity_ptg_nombre" });
                    //let apellido = result.getValue({ name: "custentity_ptg_apellido" });
                    let nombreCompleto = result.getValue({
                        name: 'altname'
                    })
                    let email = result.getValue({
                        name: "email"
                    });
                    let telefono = result.getValue({
                        name: "phone"
                    });
                    let telefonoAlt = result.getValue({
                        name: "altphone"
                    });
                    let addr = loadAddresses(id)

                    let giroCustomer = result.getValue({
                        name: 'custentity_disa_cliente_giro'
                    });

                    let notasCustomer = result.getValue({
                        name: 'custentity_ptg_notas_cliente_'
                    });

                    let idtypeCustomer = result.getValue({
                        name: 'custentity_ptg_tipodecliente_'
                    });

                    let typeCustomer = '';

                    if (idtypeCustomer == 1) {
                        typeCustomer = "Industrial"
                    } else if (idtypeCustomer == 2) {
                        typeCustomer = "Intercompañía"
                    } else if (idtypeCustomer == 3) {
                        typeCustomer = "Doméstico"
                    } else if (idtypeCustomer == 4) {
                        typeCustomer = "Otras Compañias"
                    } else if (idtypeCustomer == 5) {
                        typeCustomer = "Comercial"
                    }

                    let desde = result.getValue({
                        name: 'custentity_ptg_entrelas_'
                    });

                    let hasta = result.getValue({
                        name: 'custentity_ptg_ylas_'
                    });

                    let entityValue = result.getValue({
                        name: 'isinactive'
                    });

                    let statusCostumer = '';

                    if (entityValue == false) {
                        statusCostumer = 'Activo'
                    } else {
                        statusCostumer = 'Inactivo'
                    }

                    let tipoServicio = '';

                    let idTipoServicio = result.getValue({
                        name: 'custentity_ptg_tipodeservicio_'
                    });

                    if (idTipoServicio == 1) {
                        tipoServicio = 'Cilindro'
                    } else if (idTipoServicio == 2) {
                        tipoServicio = 'Estacionario'
                    } else if (idTipoServicio == 3) {
                        tipoServicio = 'Carburación'
                    } else if (idTipoServicio == 4) {
                        tipoServicio = 'Otros'
                    }

                    let limiteCredito = result.getValue({
                        name: 'creditlimit'
                    });

                    let creditoUtilizado = result.getValue({
                        name: 'balance'
                    });

                    let saldoVencido = result.getValue({
                        name: 'overduebalance'
                    });

                    let diasAtraso = result.getValue({
                        name: 'daysoverdue'
                    });

                    let saldoDisponible = result.getValue({
                        name: 'custentity_ptg_saldo_disponible'
                    });
                    let alianzaComercial = '';
                    let idAlianzaComercial = result.getValue({
                        name: 'custentity_ptg_alianza_comercial_cliente'
                    });

                    let terminos = result.getText({
                        name: 'terms'
                    });

                    let contrato = result.getValue({
                        name: 'custentity_ptg_numero_contrato'
                    });

                    if (idAlianzaComercial == 1) {
                        alianzaComercial = 'Comercial'
                    } else if (idAlianzaComercial == 2) {
                        alianzaComercial = 'Credito'
                    }

                    const customerObj = {
                        id,
                        nombreCompleto,
                        email,
                        telefono,
                        telefonoAlt,
                        giroCustomer,
                        notasCustomer,
                        typeCustomer,
                        desde,
                        hasta,
                        statusCostumer,
                        tipoServicio,
                        creditoUtilizado,
                        saldoVencido,
                        limiteCredito,
                        diasAtraso,
                        saldoDisponible,
                        alianzaComercial,
                        terminos,
                        contrato,
                        addr
                    }

                    arrayResult.push(customerObj)
                    responseData.data = arrayResult

                    log.debug({
                        title: "arrayResult",
                        details: arrayResult
                    })
                    log.debug({
                        title: "customerObj",
                        details: customerObj
                    })

                })
            })



            if (arrayResult.length > 0) {
                responseData.isSuccessful = true
                responseData.message = 'busqueda de clientes exitosa';
                responseData.apiErrorGet = null;
            } else {
                responseData.isSuccessful = false
                responseData.message = 'Cliente no encontrado';
                responseData.apiErrorGet = null;
            }



        } catch (err) {
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));
            log.debug({
                title: "Error",
                details: err
            })
        }

    }


    function postConsultCustomers(request) {

        log.debug({
            title: 'request',
            details: request
        })

        try {
            var arrayResult = [];

            customSearch(request, arrayResult, responseData);


        } catch (err) {
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));
            log.debug({
                title: 'Errores',
                details: err
            })
        }

        return responseData
    }


    return {
        post: postConsultCustomers,
    }
});