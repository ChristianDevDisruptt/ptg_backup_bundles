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
            const responseData = {
                success: false,
                message: "",
                data: null,
                apiErrorPost: []
            }
            try {
                var jsonPrincipal = {};
                var arrayOportunidades = [];
                var objOportunidades = {};
                var transactionSearchObj = search.create({
                    type: "transaction",
                    filters: [
                        ["type", "anyof", "Opprtnty"],
                        "AND",
                        ["customer.internalid", "anyof", requestBody.id],
                        "AND",
                        ["mainline", "is", "T"],
                        //  "AND",
                        //  ["internalid","anyof","397688"]
                    ],
                    columns: [
                        //    search.createColumn({name: "internalid", label: "ID interno"}),
                        //    search.createColumn({name: "trandate", label: "Fecha"}),
                        //    search.createColumn({name: "tranid", label: "Número de documento"}),
                        //    search.createColumn({name: "entity", label: "Nombre"}),
                        //    search.createColumn({name: "type", label: "Tipo"}),
                        //    search.createColumn({name: "salesrep", label: "Representante de ventas"}),
                        //    search.createColumn({name: "statusref", label: "Estado"}),
                        //    search.createColumn({name: "expectedclosedate", label: "Cierre previsto"}),
                        //    search.createColumn({name: "custbody_ptg_hora_cierre", label: "Hora Cierre"}),
                        //    search.createColumn({name: "custbody_ptg_origen_servicio", label: "Origen de servicio"}),
                        //    search.createColumn({name: "custbody_ptg_tipo_servicio", label: "Tipo de Servicio"}),
                        //    search.createColumn({name: "custbody_ptg_fecha_notificacion", label: "PTG - Fecha de Notificación"}),
                        //    search.createColumn({name: "custbody_ptg_tecnico_conductor_asig", label: "PTG - CONDUCTOR ASIGNADO"}),
                        //    search.createColumn({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"}),
                        //    search.createColumn({name: "custbody_ptg_motivo_cancelation", label: "Motivo Cancelación"}),
                        //    search.createColumn({name: "memo", label: "Nota"}),
                        //    search.createColumn({name: "custbody_ptg_monitor", label: "Vendedor"}),
                        //    search.createColumn({
                        //         name: "custrecord_ptg_ruta_asignada",
                        //         join: "shippingAddress",
                        //         label: "PTG - RUTA ASIGNADA"
                        //     }),
                        //     search.createColumn({
                        //         name: "custentity_ptg_plantarelacionada_",
                        //         join: "customerMain",
                        //         label: "PTG - Planta relacionada: "
                        //     }),
                        // search.createColumn({
                        //    name: "custentity_ptg_entrelas_",
                        //    join: "customerMain",
                        //    label: "PTG - Entre las:"
                        // }),
                        // search.createColumn({
                        //    name: "custentity_ptg_ylas_",
                        //    join: "customerMain",
                        //    label: "PTG - Y las_"
                        // }),
                        // search.createColumn({
                        //    name: "custentity_ptg_lunes_",
                        //    join: "customerMain",
                        //    label: "PTG - Lunes"
                        // }),
                        // search.createColumn({
                        //     name: "custentity_ptg_martes_",
                        //     join: "customerMain",
                        //     label: "PTG - Martes"
                        //  }),
                        //  search.createColumn({
                        //     name: "custentity_ptg_miercoles_",
                        //     join: "customerMain",
                        //     label: "PTG - Miercoles"
                        //  }),
                        //  search.createColumn({
                        //     name: "custentity_ptg_jueves_",
                        //     join: "customerMain",
                        //     label: "PTG - Jueves"
                        //  }),
                        //  search.createColumn({
                        //     name: "custentity_ptg_viernes_",
                        //     join: "customerMain",
                        //     label: "PTG - Jueves"
                        //  }),
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "trandate",
                            label: "Date"
                        }),
                        search.createColumn({
                            name: "tranid",
                            label: "Document Number"
                        }),
                        search.createColumn({
                            name: "entity",
                            label: "Name"
                        }),
                        search.createColumn({
                            name: "type",
                            label: "Type"
                        }),
                        search.createColumn({
                            name: "salesrep",
                            label: "Sales Rep"
                        }),
                        search.createColumn({
                            name: "statusref",
                            label: "Status"
                        }),
                        search.createColumn({
                            name: "expectedclosedate",
                            label: "Expected Close"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_hora_cierre",
                            label: "PTG - HORA DE CIERRE"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_origen_servicio",
                            label: "PTG - ORIGEN DEL SERVICIO"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_tipo_servicio",
                            label: "Tipo de Servicio"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_fecha_notificacion",
                            label: "PTG - Fecha de Notificación"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_tecnico_conductor_asig",
                            label: "PTG - CONDUCTOR ASIGNADO"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_opcion_pago",
                            label: "Opción de Pago"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_motivo_cancelation",
                            label: "PTG - MOTIVO DE CANCELACION"
                        }),
                        search.createColumn({
                            name: "memo",
                            label: "Memo"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_vendedor_",
                            label: "PTG - VENDEDOR"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_ruta_asignada",
                            join: "shippingAddress",
                            label: "PTG - RUTA ASIGNADA"
                        }),
                        search.createColumn({
                            name: "custentity_ptg_plantarelacionada_",
                            join: "customer",
                            label: "PTG - Planta relacionada: "
                        }),
                        search.createColumn({ name: "custbody_ptg_monitor", label: "PTG - Monitor" }),
                        search.createColumn({
                            name: "custrecord_ptg_vehiculo_tabladeviajes_",
                            join: "CUSTBODY_PTG_NUMERO_VIAJE",
                            label: "PTG - Vehiculo (Tabla de Viajes)"
                        }),
                        search.createColumn({ name: "custbody_ptg_zonadeprecioop_", label: "PTG - Zona de precio Oportuidad" }),
                        search.createColumn({
                            name: "custrecord_ptg_ruta_asignada",
                            join: "shippingAddress",
                            label: "PTG - RUTA ASIGNADA"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_ruta_asignada2",
                            join: "shippingAddress",
                            label: "PTG - RUTA ASIGNADA 2"
                        }),
                        search.createColumn({ name: "custbody_ptg_entre_las", label: "Entre las" }),
                        search.createColumn({ name: "custbody_ptg_y_las", label: "Y las" }),
                        search.createColumn({ name: "custbody_ptg_hora_notificacion", label: "PTG - HORA DE NOTIFICACION" }),
                        search.createColumn({ name: "custbody_ptg_estado_pedido", label: "PTG - ESTADO DEL PEDIDO" }),
                        search.createColumn({ name: "custbody_ptg_ruta_asignada", label: "PTG - RUTA ASIGNADA" }),
                        search.createColumn({
                            name: "custrecord_ptg_street",
                            join: "shippingAddress",
                            label: "PTG -  CALLE"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_exterior_number",
                            join: "shippingAddress",
                            label: "PTG - NUMERO EXTERIOR"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_interior_number",
                            join: "shippingAddress",
                            label: "PTG - NUMERO INTERIOR"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_nombre_colonia",
                            join: "shippingAddress",
                            label: "PTG - NOMBRE COLONIA"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_codigo_postal",
                            join: "shippingAddress",
                            label: "PTG - CODIGO POSTAL"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_articulo_frecuente",
                            join: "shippingAddress",
                            label: "PTG - ARTICULO FRECUENTE"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_capacidad_art",
                            join: "shippingAddress",
                            label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_articulo_frecuente2",
                            join: "shippingAddress",
                            label: "PTG - ARTICULO FRECUENTE 2"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_capacidad_can_articulo_2",
                            join: "shippingAddress",
                            label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO 2"
                        }),
                        search.createColumn({
                            name: "closedate",
                            label: "ACTUAL CLOSE"
                        }),
                        search.createColumn({ name: "custbody_ptg_segundas_llamadas", label: "PTG - SEGUNDAS LLAMADAS" }),    
                        search.createColumn({ name: "custbody_ptg_opcion_pago_obj", label: "PTG - OPCIÓN DE PAGO OBJ" }),
                        search.createColumn({
                            name: "custrecord_ptg_estado",
                            join: "shippingAddress",
                            label: "PTG - ESTADO"
                        }),
                        search.createColumn({
                            name: "city",
                            join: "shippingAddress",
                            label: "CITY"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_solicitud_cancelacion",
                            label: "PTG - SOLICITUD DE CANCELACION"
                        }),
                          search.createColumn({
                            name: "custbody_ptg_solici_cambio_fech_prome",
                            label: "PTG - SOLICITUD DE CAMBIO DE FECHA PROMETIDA"
                        }),
                        // search.createColumn({
                        //     name: "custrecord_ptg_desc_terminal_cuenta",
                        //     join: "CUSTBODY_PTG_TERMINAL_UTILIZADA",
                        //     label: "PTG - DESCRIPCION DE LA TERMINAL Y CUENTA"
                        // })      
                        search.createColumn({
                            name: "custbody_ptg_etiqueta_direccion_envio",
                            label: "PTG - ETIQUETA DIRECCION DE ENVIO"
                        })  
                    ]
                });

                if(requestBody.idAddress) {
                    var addressFilter = search.createFilter({
                        name: "custbody_ptg_id_direccion_envio",
                        operator: "is",
                        values: requestBody.idAddress
                    })
                    transactionSearchObj.filters.push(addressFilter);
                }

                var arrayFechaPrometida = [];
                let rangoPrometido1 = requestBody.fechaPrometida1 || "";
                arrayFechaPrometida.push(rangoPrometido1);
                let rangoPrometido2 = requestBody.fechaPrometida2 || "";
                arrayFechaPrometida.push(rangoPrometido2);
                if (rangoPrometido1 || rangoPrometido2) {
                    var fechaPrometida = search.createFilter({
                        name: "expectedclosedate",
                        operator: "within",
                        values: arrayFechaPrometida
                    })
                    transactionSearchObj.filters.push(fechaPrometida);
                }

                var arrayFechaCierre = [];
                let rangoCierre1 = requestBody.fechaCierre1 || "";
                arrayFechaCierre.push(rangoCierre1);
                let rangoCierre2 = requestBody.fechaCierre2 || "";
                arrayFechaCierre.push(rangoCierre2);
                if (rangoCierre1 || rangoCierre2) {
                    var fechaCierre = search.createFilter({
                        name: "closedate",
                        operator: "within",
                        values: arrayFechaCierre
                    })
                    transactionSearchObj.filters.push(fechaCierre);
                }

                var status = requestBody.status_oportunidad || "";
                if (status) {
                    var statusOportunidad = search.createFilter({
                        name: "custbody_ptg_estado_pedido",
                        operator: "anyof",
                        values: status
                    })
                    transactionSearchObj.filters.push(statusOportunidad);
                }

                // var service = requestBody.tipoServicio || "";
                // if (service) {
                //     var scheduled_customer = search.createFilter({
                //         name: "custrecord_ptg_tipo_contacto",
                //         operator: "anyof",
                //         join: "shippingaddress",
                //         values: service
                //     })
                //     transactionSearchObj.filters.push(scheduled_customer);
                // }

                var productType = requestBody.tipo_producto || "";
                if (productType) {
                    var productTypeCustomer = search.createFilter({
                        name: "custbody_ptg_tipo_servicio",
                        operator: "anyof",
                        values: productType
                    })
                    transactionSearchObj.filters.push(productTypeCustomer);
                }


                var searchResultCount = transactionSearchObj.run();
                var results = searchResultCount.getRange(0, 999);
                log.audit('results', results)
                var nombreRepresentante = '';
                var nombreOrigen = '';
                var nombreMetodoPago = '';
                var nombreVendedor = '';

                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    var trandate = results[i].getValue(columnas[1]);
                    var number = results[i].getValue(columnas[2]);
                    var customerName = results[i].getValue(columnas[3]);
                    var typeTransaccion = results[i].getValue(columnas[4]);
                    var idRep = results[i].getValue(columnas[5]);
                    //var idStatus = results[i].getValue(columnas[6]);
                    var cierreP = results[i].getValue(columnas[7]);
                    var horaP = results[i].getValue(columnas[8]);
                    var idOrigen = results[i].getText(columnas[9]);
                    var idTipoServicio = results[i].getValue(columnas[10]);
                    var TipoServicio = results[i].getText(columnas[10]);
                    var fechaNot = results[i].getValue(columnas[11]);
                    var idConductor = results[i].getValue(columnas[12]);
                    var metodoPagos = results[i].getText(columnas[13]);
                    var idMotivo = results[i].getText(columnas[14]);
                    var notaP = results[i].getValue(columnas[15]);
                    var idVendedor = results[i].getValue(columnas[16]);
                    var idPlanta = results[i].getValue(columnas[18]);
                    var monitorId = results[i].getValue(columnas[19]);
                    var monitor = results[i].getText(columnas[19]);
                    var vehiculoId = results[i].getValue(columnas[20]);
                    var vehiculo = results[i].getText(columnas[20]);
                    var zoneId = results[i].getValue(columnas[21]);
                    var zone = results[i].getText(columnas[21]);
                    // var ruta1 = results[i].getText(columnas[22]);
                    // var ruta1Id = results[i].getValue(columnas[22]);
                    // var ruta2 = results[i].getText(columnas[23]);
                    // var ruta2Id = results[i].getValue(columnas[23]);                
                    var hora_entre_las = results[i].getValue(columnas[24]);
                    var hora_y_las = results[i].getValue(columnas[25]);
                    var horaNoti = results[i].getValue(columnas[26]);
                    var Status = results[i].getText(columnas[27]);
                    var idStatus = results[i].getValue(columnas[27]);
                    var rutaAsignada = results[i].getValue(columnas[28]);
                    var street = results[i].getValue(columnas[29]);
                    var numExterno = results[i].getValue(columnas[30]);
                    var numInterno = results[i].getValue(columnas[31]);
                    var colonia = results[i].getValue(columnas[32]);
                    var cp = results[i].getValue(columnas[33]);
                    var idItem1 = results[i].getValue(columnas[34]);
                    var item1 = results[i].getText(columnas[34]);
                    var item1Capacidad = results[i].getValue(columnas[35]);
                    var idItem2 = results[i].getValue(columnas[36]);
                    var item2 = results[i].getText(columnas[36]);
                    var item2Capacidad = results[i].getText(columnas[37]);
                    var cierreF = results[i].getValue(columnas[38]);
                    var isSecondCall = results[i].getValue(columnas[39]);
                    var objMetodosPago = results[i].getValue(columnas[40]);
                    var estadoDireccion = results[i].getValue(columnas[41]);
                    var ciudadDireccion = results[i].getValue(columnas[42]);
                    var solicitudCancelacion = results[i].getValue(columnas[43]);
              	    var solicitudCambioFecha = results[i].getValue(columnas[44]);
                    var label = results[i].getValue(columnas[45]);

                    
                    //var terminalName = results[i].getValue(columnas[41]);

                    // var P_lunes = results[i].getValue(columnas[21]);
                    // var P_martes = results[i].getValue(columnas[22]);
                    // var P_miercoles = results[i].getValue(columnas[23]);
                    // var P_jueves = results[i].getValue(columnas[24]);
                    // var P_viernes = results[i].getValue(columnas[25]);
                    var idT = results[i].getValue(columnas[0]);
                    var ultimaNota = getLastNote(idT);

                    if (!idRep) {
                        nombreRepresentante = " "
                    } else {
                        var EmployeeCarga = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: idRep,
                            columns: ['entityid']
                        });
                        var nombreEmpleado = EmployeeCarga.entityid
                        nombreRepresentante = nombreEmpleado
                    }

                    if (!idVendedor) {
                        nombreVendedor = " "
                    } else {
                        var vendedorCarga = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: idVendedor,
                            columns: ['entityid']
                        });
                        nombreVendedor = vendedorCarga.entityid
                    }


                    // if (idOrigen == 1) {
                    //     nombreOrigen = "WhatsApp"
                    // } else if (idOrigen == 2) {
                    //     nombreOrigen = "PotoApp"
                    // } else if (idOrigen == 3) {
                    //     nombreOrigen = "FaceBook"
                    // } else if (idOrigen == 4) {
                    //     nombreOrigen = "Call Center"
                    // } else if (idOrigen == 5) {
                    //     nombreOrigen = "Página Web"
                    // } else if (idOrigen == 6) {
                    //     nombreOrigen = "Chat"
                    // } else if (idOrigen == 7) {
                    //     nombreOrigen = "Buzón"
                    // }

                    // var nombremotivoCancelacion = "";

                    // if (idMotivo == 1) {
                    //     nombremotivoCancelacion = "El cliente no tiene dinero"
                    // } else if (idMotivo == 2) {
                    //     nombremotivoCancelacion = "No hay nadie en casa"
                    // } else if (idMotivo == 2) {
                    //     nombremotivoCancelacion = "El cliente ya no quiere el servicio"
                    // }

                    // if (idStatus == "closedLost") {
                    //     nombremotivoCancelacion
                    // } else {
                    //     nombremotivoCancelacion = " ";
                    // }

                    // if (metodoPagos == 1) {
                    //     nombreMetodoPago = "Efectivo"
                    // } else if (metodoPagos == 2) {
                    //     nombreMetodoPago = "Prepago"
                    // } else if (metodoPagos == 3) {
                    //     nombreMetodoPago = "Vale"
                    // } else if (metodoPagos == 4) {
                    //     nombreMetodoPago = "Cortesia"
                    // } else if (metodoPagos == 5) {
                    //     nombreMetodoPago = "Tarjeta de crédito"
                    // } else if (metodoPagos == 6) {
                    //     nombreMetodoPago = "Tarjeta de Debito"
                    // }

                    var plantaLookUp = search.lookupFields({
                        type: search.Type.LOCATION,
                        id: idPlanta,
                        columns: ['name']
                    });

                    objOportunidades = {
                        fecha: trandate,
                        id_Transaccion: idT,
                        numeroDocumento: number,
                        nombreCliente: customerName,
                        representanteVentas: nombreRepresentante,
                        estado: Status,
                        estadoId: idStatus,
                        motivoCancelacion: idMotivo,
                        cierrePrevisto: cierreP,
                        cierreFecha: cierreF,
                        horaCierre: horaP,
                        origenServicio: idOrigen,
                        tipoServicioId: idTipoServicio,
                        tipoServicio: TipoServicio,
                        fechaNotificacion: fechaNot,
                        tipoTransaccion: "Pedido",
                        nota: notaP,
                        conductorAsignado: idConductor,
                        metodoPago: metodoPagos,
                        vendedor: nombreVendedor,
                        rutaAsignada: rutaAsignada,
                        plantaRelacionada: plantaLookUp.name,
                        monitor: monitor,
                        monitorId: monitorId,
                        vehiculo: vehiculo,
                        vehiculoId: vehiculoId,
                        zone: zone,
                        zoneId: zoneId,
                        // ruta1 : ruta1,
                        // ruta1Id : ruta1Id,
                        // ruta2 : ruta2,
                        // ruta2Id : ruta2Id,
                        entre_las: hora_entre_las,
                        y_las: hora_y_las,
                        horaNoti: horaNoti,
                        street: street,
                        numExterno: numExterno,
                        numInterno: numInterno,
                        colonia: colonia,
                        cp: cp,
                        idItem1: idItem1,
                        item1: item1,
                        item1Capacidad: item1Capacidad,
                        idItem2: idItem2,
                        item2: item2,
                        item2Capacidad: item2Capacidad,
                        isSecondCall : isSecondCall,
                        objMetodosPago : objMetodosPago,
                        estadoDireccion : estadoDireccion,
                        ciudadDireccion : ciudadDireccion,
                        solicitudCancelacion: solicitudCancelacion,
                        solicitudCambioFecha: solicitudCambioFecha,
                        ultimaNota: ultimaNota,
                        label: label
                        //terminalName : terminalName

                        // lunes: P_lunes,
                        // martes: P_martes,
                        // miercoles: P_miercoles,
                        // jueves: P_jueves,
                        // viernes: P_viernes,

                    }

                    arrayOportunidades.push(objOportunidades);
                }

                log.audit('json principal', jsonPrincipal);
                // if(arrayOportunidades.length > 0 || arrayCaso.length > 0){
                responseData.success = true;
                responseData.data = (arrayOportunidades.length > 0) ? arrayOportunidades : [];
                // }


                return responseData;

            } catch (error) {
                log.audit('error', error);
                responseData.message = error;
                return responseData
            }

        }

        function getLastNote(id, tipo = "opportunity") {
            let nota = "";
            let opportunitySearchObj = search.create({
                type: tipo,
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "internalid",
                            join: "userNotes",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "title",
                            join: "userNotes",
                            label: "Title"
                        }),
                        search.createColumn({
                            name: "author",
                            join: "userNotes",
                            label: "Author"
                        }),
                        search.createColumn({
                            name: "note",
                            join: "userNotes",
                            label: "Memo"
                        }),
                        search.createColumn({
                            name: "notedate",
                            join: "userNotes",
                            sort: search.Sort.DESC,
                            label: "Date"
                        }),
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({
                            name: "custrecord_ptg_solicitud_notificacion",
                            join: "userNotes",
                            label: "PTG - SOLICITUD DE NOTIFICACIÓN"
                        })
                    ]
            });
            let searchResultCount = opportunitySearchObj.runPaged().count;
            log.debug("opportunitySearchObj result count", searchResultCount);
            opportunitySearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                nota = result.getValue({name: "note",
                join: "userNotes",
                label: "Memo"});
            
            });
    
            return nota;
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
