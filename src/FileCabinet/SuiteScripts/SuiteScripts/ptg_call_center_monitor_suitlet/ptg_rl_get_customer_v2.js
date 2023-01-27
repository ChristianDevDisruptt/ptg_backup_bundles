/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/log', "N/search", "N/record", 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors'], function (log, search, record, error) {

    // se crea la estructura donde se cargará toda la data

    const responseData = {
        success: false,
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
                    name: "custrecord_ptg_ruta_asignada2",
                    join: "Address"
                }),
                search.createColumn({
                    name: "custrecord_ptg_ruta_asignada_3",
                    join: "Address"
                }),
                search.createColumn({
                    name: "custrecord_ptg_ruta_asignada_4",
                    join: "Address"
                }),
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
                }),
                search.createColumn({
                    name: "custrecord_ptg_entrecalle_",
                    join: "Address",
                    label: "PTG - ENTRE"
                }),
                search.createColumn({
                    name: "custrecord_ptg_y_entre_",
                    join: "Address",
                    label: "PTG - Y ENTRE"
                }),
                search.createColumn({
                    name: "custrecord_ptg_cada",
                    join: "Address",
                    label: "PTG - CADA"
                }),
                search.createColumn({
                    name: "custrecord_ptg_periodo_contacto",
                    join: "Address",
                    label: "PTG - PERIODO DE CONTACTO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_lunes",
                    join: "Address",
                    label: "PTG - LUNES"
                }),
                search.createColumn({
                    name: "custrecord_ptg_martes",
                    join: "Address",
                    label: "PTG - MARTES"
                }),
                search.createColumn({
                    name: "custrecord_ptg_miercoles",
                    join: "Address",
                    label: "PTG - MIERCOLES"
                }),
                search.createColumn({
                    name: "custrecord_ptg_jueves",
                    join: "Address",
                    label: "PTG - JUEVES"
                }),
                search.createColumn({
                    name: "custrecord_ptg_viernes",
                    join: "Address",
                    label: "PTG - VIERNES"
                }),
                search.createColumn({
                    name: "custrecord_ptg_sabado",
                    join: "Address",
                    label: "PTG - SABADO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_domingo",
                    join: "Address",
                    label: "PTG - DOMINGO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_en_la_semana",
                    join: "Address",
                    label: "PTG - EN LA SEMANA"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_mar",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO MAR"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_mi",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO MI"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_jue",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO JUE"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_vi",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO VI"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_sab",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO SAB"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_inicio_servicio_dom",
                    join: "Address",
                    label: "PTG -FECHA DE INICIO DE SERVICIO DOM"
                }),
                search.createColumn({
                    name: "addresslabel",
                    join: "Address",
                    label: "Address Label"
                }), // envio predeterminado
                search.createColumn({
                    name: "custrecord_ptg_numero_contrato",
                    join: "Address",
                    label: "PTG - NUMERO DE CONTRATO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_fecha_alta_contrato",
                    join: "Address",
                    label: "PTG - FECHA DE ALTA (CONTRATO)"
                }),
                search.createColumn({
                    name: "custrecord_ptg_direccion_contrato",
                    join: "Address",
                    label: "PTG - DIRECCION CON CONTRATO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_digito_verificador",
                    join: "Address",
                    label: "PTG - DIGITO VERIFICADOR"
                }),
                search.createColumn({
                    name: "custrecord_ptg_telefono_principal",
                    join: "Address",
                    label: "PTG - TELEFONO PRINCIPAL"
                }),
                search.createColumn({
                    name: "custrecord_ptg_telefono_alterno",
                    join: "Address",
                    label: "PTG - TELEFONO ALTERNO"
                }),
                search.createColumn({
                    name: "custrecord_ptg_posee_precio_especial",
                    join: "Address",
                    label: "PTG - POSEE PRECIO ESPECIAL"
                }),
                search.createColumn({
                    name: "custrecord_ptg_zona_precio_especial",
                    join: "Address",
                    label: "PTG - ZONA DE PRECIO ESPECIAL"
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
                log.audit('result address customer', result);

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
                    tipoServicio = 'Montacarga'
                } else if (idTipoServicio == 4) {
                    tipoServicio = 'Otros'
                }

                let idColandRoute = result.getValue({
                    name: "custrecord_ptg_colonia_ruta",
                    join: "Address",
                    label: "PTG - COLONIA Y RUTA"
                });

                let dataRoute = search.lookupFields({
                    type: "customrecord_ptg_coloniasrutas_",
                    id: idColandRoute,
                    //columns: ['name', 'custrecord_ptg_nombrecolonia_', 'custrecord_ptg_rutamunicipio_', 'custrecord_ptg_rutacil_', 'custrecord_ptg_rutaest_', 'custrecord_ptg_estado_', 'custrecord_ptg_zona_de_precio_', 'custrecord_ptg_cp_', 'custrecord_ptg_pbservaciones_']
                    columns: ['custrecord_ptg_nombrecolonia_', 'custrecord_ptg_rutamunicipio_', 'custrecord_ptg_rutacil_', 'custrecord_ptg_rutaest_', 'custrecord_ptg_estado_', 'custrecord_ptg_zona_de_precio_', 'custrecord_ptg_cp_', 'custrecord_ptg_pbservaciones_']
                });

                log.audit('dataRoute', dataRoute)

                let dataZone = search.lookupFields({
                    type: "customrecord_ptg_zonasdeprecio_",
                    id: dataRoute['custrecord_ptg_zona_de_precio_'][0].value,
                    columns: ['internalid', 'name', 'custrecord_ptg_territorio_', 'custrecord_ptg_precio_', 'custrecord_ptg_precio_kg', 'custrecord_ptg_factor_conversion']
                });

                log.audit('dataZone', dataZone)

                let dataZoneRoute = {
                    id: idColandRoute || "",
                    //nombre: dataRoute['name'] || "",
                    municipio: dataRoute['custrecord_ptg_rutamunicipio_'] || "",
                    // nameUbicacionCil: dataRoute['custrecord_ptg_rutacil_'][0].text || "",
                    // ubicacionCil: dataRoute['custrecord_ptg_rutacil_'][0].value || "",
                    // nameUbicacionEst: dataRoute['custrecord_ptg_rutaest_'][0].text || "",
                    // ubicacionEst: dataRoute['custrecord_ptg_rutaest_'][0].value || "",
                    cp: dataRoute['custrecord_ptg_cp_'] || "",
                    zona_venta: dataZone['name'] || "",
                    precioLt: dataZone['custrecord_ptg_precio_'] || "",
                    precioKg: dataZone['custrecord_ptg_precio_kg'] || "",
                    factor: dataZone['custrecord_ptg_factor_conversion'] || "",
                    territorio: dataZone['custrecord_ptg_territorio_'] || "",
                  	territorio_id: dataZone['internalid'][0].value || ""
                }

                dataZoneRoute.nameUbicacionCil = (dataRoute['custrecord_ptg_rutacil_'].length > 0) ? dataRoute['custrecord_ptg_rutacil_'][0].text : "";
                dataZoneRoute.ubicacionCil = (dataRoute['custrecord_ptg_rutacil_'].length > 0) ? dataRoute['custrecord_ptg_rutacil_'][0].value : "";
                dataZoneRoute.nameUbicacionEst = (dataRoute['custrecord_ptg_rutaest_'].length > 0) ? dataRoute['custrecord_ptg_rutaest_'][0].text : "";
                dataZoneRoute.ubicacionEst = (dataRoute['custrecord_ptg_rutaest_'].length > 0) ?dataRoute['custrecord_ptg_rutaest_'][0].value  : "";

                let isZonaExp = result.getValue({
                    name: "custrecord_ptg_posee_precio_especial",
                    join: "Address",
                    label: "PTG - POSEE PRECIO ESPECIAL"
                });

                let zonaExp = null;

                if(isZonaExp) {
                    let idExpZona = result.getValue({
                        name: "custrecord_ptg_zona_precio_especial",
                        join: "Address",
                        label: "PTG - ZONA DE PRECIO ESPECIAL"
                    });

                    let dataZoneExp = search.lookupFields({
                        type: "customrecord_ptg_zonasdeprecio_",
                        id: idExpZona,
                        columns: ['internalid', 'name', 'custrecord_ptg_territorio_', 'custrecord_ptg_precio_', 'custrecord_ptg_precio_kg', 'custrecord_ptg_factor_conversion']
                    });

                    zonaExp = {
                        id: idExpZona || "",
                        zona_venta: dataZoneExp['name'] || "",
                        precioLt: dataZoneExp['custrecord_ptg_precio_'] || "",
                        precioKg: dataZoneExp['custrecord_ptg_precio_kg'] || "",
                        factor: dataZoneExp['custrecord_ptg_factor_conversion'] || "",
                        territorio: dataZoneExp['custrecord_ptg_territorio_'] || ""
                    }
                }

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
                    route: result.getText({
                        name: "custrecord_ptg_ruta_asignada",
                        join: "Address"
                    }),
                    route2: result.getText({
                        name: "custrecord_ptg_ruta_asignada2",
                        join: "Address"
                    }),
                    route3: result.getText({
                        name: "custrecord_ptg_ruta_asignada_3",
                        join: "Address"
                    }),
                    route4: result.getText({
                        name: "custrecord_ptg_ruta_asignada_4",
                        join: "Address"
                    }),
                    routeId: result.getValue({
                        name: "custrecord_ptg_ruta_asignada",
                        join: "Address"
                    }),
                    routeId2: result.getValue({
                        name: "custrecord_ptg_ruta_asignada2",
                        join: "Address"
                    }),
                    routeId3: result.getValue({
                        name: "custrecord_ptg_ruta_asignada_3",
                        join: "Address"
                    }),
                    routeId4: result.getValue({
                        name: "custrecord_ptg_ruta_asignada_4",
                        join: "Address"
                    }),
                    idRoute: result.getText({
                        name: "custrecord_ptg_ruta_asignada",
                        join: "Address"
                    }),
                    idRoute2: result.getText({
                        name: "custrecord_ptg_ruta_asignada2",
                        join: "Address"
                    }),
                    idRoute3: result.getValue({
                        name: "custrecord_ptg_ruta_asignada_3",
                        join: "Address"
                    }),
                    idRoute4: result.getValue({
                        name: "custrecord_ptg_ruta_asignada_4",
                        join: "Address"
                    }),
                    typeService: tipoServicio,
                    typeServiceId: result.getValue({
                        name: "custrecord_ptg_tipo_servicio",
                        join: "Address"
                    }),
                    commentsAddr: result.getValue({
                        name: "custrecord_ptg_obesarvaciones_direccion_",
                        join: "Address"
                    }),
                    dataZoneRoute: dataZoneRoute,
                    zonaExp: zonaExp,
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
                    entreCalle: result.getValue({
                        name: "custrecord_ptg_entrecalle_",
                        join: "Address",
                        label: "PTG - ENTRE"
                    }),
                    entreYCalle: result.getValue({
                        name: "custrecord_ptg_y_entre_",
                        join: "Address",
                        label: "PTG - Y ENTRE"
                    }),
                    frecuencia: result.getValue({
                        name: "custrecord_ptg_cada",
                        join: "Address",
                        label: "PTG - CADA"
                    }),
                    periodo: result.getText({
                        name: "custrecord_ptg_periodo_contacto",
                        join: "Address",
                        label: "PTG - PERIODO DE CONTACTO"
                    }),
                    periodoId: result.getValue({
                        name: "custrecord_ptg_periodo_contacto",
                        join: "Address",
                        label: "PTG - PERIODO DE CONTACTO"
                    }),
                    isLunes: result.getValue({
                        name: "custrecord_ptg_lunes",
                        join: "Address",
                        label: "PTG - LUNES"
                    }),
                    isMartes: result.getValue({
                        name: "custrecord_ptg_martes",
                        join: "Address",
                        label: "PTG - MARTES"
                    }),
                    isMiercoles: result.getValue({
                        name: "custrecord_ptg_miercoles",
                        join: "Address",
                        label: "PTG - MIERCOLES"
                    }),
                    isJueves: result.getValue({
                        name: "custrecord_ptg_jueves",
                        join: "Address",
                        label: "PTG - JUEVES"
                    }),
                    isViernes: result.getValue({
                        name: "custrecord_ptg_viernes",
                        join: "Address",
                        label: "PTG - VIERNES"
                    }),
                    isSabado: result.getValue({
                        name: "custrecord_ptg_sabado",
                        join: "Address",
                        label: "PTG - SABADO"
                    }),
                    isDomingo: result.getValue({
                        name: "custrecord_ptg_domingo",
                        join: "Address",
                        label: "PTG - DOMINGO"
                    }),
                    inThatWeek: result.getValue({
                        name: "custrecord_ptg_en_la_semana",
                        join: "Address",
                        label: "PTG - EN LA SEMANA"
                    }),
                    startDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO"
                    }),
                    martesDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_mar",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO MAR"
                    }),
                    miercolesDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_mi",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO MI"
                    }),
                    juevesDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_jue",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO JUE"
                    }),
                    viernesDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_vi",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO VI"
                    }),
                    sabadoDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_sab",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO SAB"
                    }),
                    domingoDayService: result.getValue({
                        name: "custrecord_ptg_fecha_inicio_servicio_dom",
                        join: "Address",
                        label: "PTG -FECHA DE INICIO DE SERVICIO DOM"
                    }),
                    label: result.getValue({
                        name: "addresslabel",
                        join: "Address",
                        label: "Address Label"
                    }),
                    requiereContrato: result.getValue({
                        name: "custrecord_ptg_direccion_contrato",
                        join: "Address",
                        label: "PTG - DIRECCION CON CONTRATO"
                    }),
                    numeroContrato: result.getValue({
                        name: "custrecord_ptg_numero_contrato",
                        join: "Address",
                        label: "PTG - NUMERO DE CONTRATO"
                    }),
                    fechaContrato: result.getValue({
                        name: "custrecord_ptg_fecha_alta_contrato",
                        join: "Address",
                        label: "PTG - FECHA DE ALTA (CONTRATO)"
                    }),
                    digitoVerificador: result.getValue({
                        name: "custrecord_ptg_digito_verificador",
                        join: "Address",
                        label: "PTG - DIGITO VERIFICADOR"
                    }),
                    telefonoPrincipal: result.getValue({
                        name: "custrecord_ptg_telefono_principal",
                        join: "Address",
                        label: "PTG - TELEFONO PRINCIPAL"
                    }),
                    telefonoAdicionales: result.getValue({
                        name: "custrecord_ptg_telefono_alterno",
                        join: "Address",
                        label: "PTG - TELEFONO ALTERNO"
                    })
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
        log.audit('request', request);
        try {
            filter.push(["internalid", "anyof", request.internalId]);
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
                id: 'customsearch_ptg_busqueda_cliente',
                filters: filter,
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
                    "custentity_ptg_giro_negocio",
                    "custentity_ptg_notas_cliente_",
                    "custentity_ptg_tipodecliente_",
                    // "custentity_ptg_entrelas_",
                    // "custentity_ptg_ylas_",
                    // "custentity_ptg_tipodeservicio_",
                    "isinactive",
                    "creditlimit",
                    "balance",
                    "overduebalance",
                    "custentity_ptg_saldo_disponible",
                    "daysoverdue",
                    "custentity_ptg_alianza_comercial_cliente",
                    "terms",
                    "custentity_ptg_tipo_descuento",
                    "custentity_ptg_descuento_asignar",
                    "custentity_mx_rfc",
                    "firstname",
                    "lastname",
                    "custentity_drt_sed_email_invoice",
                    "custentity_disa_uso_de_cfdi_",
                    "custentity_ptg_requiere_factura",
                    "custentity_razon_social_para_facturar",
                    "custentity_ptg_condicion_credito"
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
                    log.debug('result data customer', result)
                    //convertir "result object" a objeto deseado

                    let id = result.id;

                    let entityId = result.getValue({
                        name: "entityid"
                    });

                    //let nombre = result.getValue({ name: "custentity_ptg_nombre" });
                    //let apellido = result.getValue({ name: "custentity_ptg_apellido" });
                    let nombreCompleto = result.getValue({
                        name: 'altname'
                    })
                    let email = result.getValue({
                        name: "email"
                    });

                    let emailAlt = result.getValue({
                        name: "custentity_drt_sed_email_invoice"
                    });

                    let telefono = result.getValue({
                        name: "phone"
                    });
                    let telefonoAlt = result.getValue({
                        name: "altphone"
                    });
                    let addr = loadAddresses(id)

                    let giroCustomer = result.getText({
                        name: 'custentity_ptg_giro_negocio'
                    });

                    let giroCustomerId = result.getValue({
                        name: 'custentity_ptg_giro_negocio'
                    })

                    let notasCustomer = result.getValue({
                        name: 'custentity_ptg_notas_cliente_'
                    });

                    let idtypeCustomer = result.getValue({
                        name: 'custentity_ptg_tipodecliente_'
                    });

                    let typeCustomer = result.getText({
                        name: 'custentity_ptg_tipodecliente_'
                    });;

                    let razonSocialFact = result.getValue({
                        name: 'custentity_razon_social_para_facturar'
                    });;

                    // if (idtypeCustomer == 1) {
                    //     typeCustomer = "Industrial"
                    // } else if (idtypeCustomer == 2) {
                    //     typeCustomer = "Intercompañía"
                    // } else if (idtypeCustomer == 3) {
                    //     typeCustomer = "Doméstico"
                    // } else if (idtypeCustomer == 4) {
                    //     typeCustomer = "Otras Compañias"
                    // } else if (idtypeCustomer == 5) {
                    //     typeCustomer = "Comercial"
                    // }

                    // let desde = result.getValue({
                    //     name: 'custentity_ptg_entrelas_'
                    // });

                    // let hasta = result.getValue({
                    //     name: 'custentity_ptg_ylas_'
                    // });

                    let entityValue = result.getValue({
                        name: 'isinactive'
                    });

                    let statusCostumer = '';

                    if (entityValue == false) {
                        statusCostumer = 'Activo'
                    } else {
                        statusCostumer = 'Inactivo'
                    }

                    // let tipoServicio = '';

                    // let idTipoServicio = result.getValue({
                    //     name: 'custentity_ptg_tipodeservicio_'
                    // });

                    // if(idTipoServicio == 1){
                    //     tipoServicio = 'Cilindro'
                    // } else if(idTipoServicio == 2){
                    //     tipoServicio = 'Estacionario'
                    // } else if(idTipoServicio == 3){
                    //     tipoServicio = 'Carburación'
                    // } else if(idTipoServicio == 4){
                    //     tipoServicio = 'Otros'
                    // }

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

                    let alianzaComercial = result.getText({
                        name: 'custentity_ptg_alianza_comercial_cliente'
                    });;
                    let idAlianzaComercial = result.getValue({
                        name: 'custentity_ptg_alianza_comercial_cliente'
                    });

                    let terminos = result.getText({
                        name: 'terms'
                    });

                    let tipoDescuento = result.getValue({
                        name: 'custentity_ptg_tipo_descuento'
                    });

                    let descuento = result.getValue({
                        name: 'custentity_ptg_descuento_asignar'
                    });

                    // if (idAlianzaComercial == 1) {
                    //     alianzaComercial = 'Comercial'
                    // } else if (idAlianzaComercial == 2) {
                    //     alianzaComercial = 'Credito'
                    // }

                    let rfc = result.getValue({
                        name: "custentity_mx_rfc"
                    });

                    let primerNombre = result.getValue({
                        name: "firstname"
                    });

                    let apellidos = result.getValue({
                        name: "lastname"
                    })

                    let cdfiName = result.getText({
                        name: "custentity_disa_uso_de_cfdi_"
                    })

                    let cdfiId = result.getValue({
                        name: "custentity_disa_uso_de_cfdi_"
                    })

                    let requiereFactura = result.getValue({
                        name: "custentity_ptg_requiere_factura"
                    })

                    let condicionCredito = result.getValue({
                        name: "custentity_ptg_condicion_credito"
                    })

                    let objInfoComercial = {};
                    if (idAlianzaComercial == 1) {
                        objInfoComercial.terms = terminos;
                        objInfoComercial.limiteCredito = limiteCredito;
                        objInfoComercial.creditoUtilizado = creditoUtilizado;
                        objInfoComercial.saldoVencido = saldoVencido;
                        objInfoComercial.saldoDisponible = saldoDisponible;
                        objInfoComercial.diasAtraso = diasAtraso;
                        // objInfoComercial.tipoDescuento = result.getValue({
                        //     name: 'custentity_ptg_tipo_descuento'
                        // });
                        // objInfoComercial.descuento = result.getValue({
                        //     name: 'custentity_ptg_descuento_asignar'
                        // });  

                    } else if (idAlianzaComercial == 2) {
                        objInfoComercial.terms = terminos;
                        objInfoComercial.limiteCredito = limiteCredito;
                        objInfoComercial.creditoUtilizado = creditoUtilizado;
                        objInfoComercial.saldoVencido = saldoVencido;
                        objInfoComercial.saldoDisponible = saldoDisponible;
                        objInfoComercial.diasAtraso = diasAtraso;
                        // objInfoComercial.tipoDescuento = result.getValue({
                        //     name: 'custentity_ptg_tipo_descuento'
                        // });
                        // objInfoComercial.descuento = result.getValue({
                        //     name: 'custentity_ptg_descuento_asignar'
                        // });                                               
                    };

                    const customerObj = {
                        id,
                        entityId,
                        nombreCompleto,
                        email,
                        emailAlt,
                        telefono,
                        telefonoAlt,
                        giroCustomer,
                        giroCustomerId,
                        notasCustomer,
                        typeCustomer,
                        //desde,
                        //hasta,
                        statusCostumer,
                        //tipoServicio,
                        creditoUtilizado,
                        saldoVencido,
                        limiteCredito,
                        diasAtraso,
                        saldoDisponible,
                        alianzaComercial,
                        objInfoComercial,
                        tipoDescuento,
                        descuento,
                        terminos,
                        rfc,
                        primerNombre,
                        apellidos,
                        addr,
                        cdfiName,
                        cdfiId,
                        requiereFactura,
                        razonSocialFact,
                        condicionCredito
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
                responseData.success = true
                responseData.message = 'busqueda de clientes exitosa';
                responseData.apiErrorGet = null;
            } else {
                responseData.success = false
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

//filtro por colonia
//correo
//nombre