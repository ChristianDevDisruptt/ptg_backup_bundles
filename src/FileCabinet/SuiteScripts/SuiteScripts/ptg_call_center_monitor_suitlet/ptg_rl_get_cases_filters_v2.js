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
            log.debug('request', requestBody)
            const responseData = {
                success: false,
                message: "",
                data: null,
                apiErrorPost: []
            }
            try {
                var jsonPrincipal = {};
                var arrayCaso = [];
                var objCaso = {};

                var supportcaseSearchObj = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["stage", "anyof", "OPEN", "ESCALATED", "CLOSED"],
                            "AND",
                            ["customer.internalidnumber", "equalto", requestBody.id],
                            // "AND",
                            // ["internalid","anyof","241"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "casenumber",
                                sort: search.Sort.ASC,
                                label: "Número"
                            }),
                            search.createColumn({ name: "entityid", join: "employee", label: "Nombre" }),
                            search.createColumn({ name: "title", label: "Asunto" }),
                            search.createColumn({ name: "company", label: "Nombre empresa" }),
                            search.createColumn({ name: "assigned", label: "Asignado a" }),
                            search.createColumn({ name: "status", label: "Estado" }),
                            search.createColumn({ name: "priority", label: "Prioridad" }),
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({ name: "custevent_ptg_fecha_visita", label: "PTG - FECHA DE VISITA" }),
                            search.createColumn({ name: "custevent_ptg_horario_preferido", label: "Horario" }),
                            search.createColumn({ name: "quicknote", label: "Nota rápida" }),
                            search.createColumn({ name: "startdate", label: "Fecha del incidente" }),
                            search.createColumn({ name: "internalid", label: "id transaccion" }),
                            search.createColumn({
                                name: "custentity_ptg_tipodeservicio_",
                                join: "customer",
                                label: "tipo de servicio"
                            }),
                            search.createColumn({ name: "email", label: "EMAIL(S)" }),
                            search.createColumn({ name: "custevent_ptg_relacionar_caso_existente", label: "PTG - RELACIONAR A CASO EXISTENTE" }),
                            search.createColumn({
                                name: "transactionname",
                                join: "transaction",
                                label: "Transaction Name"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "transaction",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "tranid",
                                join: "transaction",
                                label: "Document Number"
                            }),
                            search.createColumn({ name: "custevent_ptg_conceptos_casos", label: "PTG - CONCEPTOS PARA CASOS" }),
                            search.createColumn({ name: "startdate", label: "INCIDENT DATE" }),
                            search.createColumn({ name: "createddate", label: "CREATED DATE" }),
                            search.createColumn({ name: "message", label: "Message Text" }),
                            search.createColumn({ name: "enddate", label: "DATE CLOSED" }),
                            search.createColumn({ name: "custevent_ptg_nombre_calle", label: "PTG - NOMBRE DE CALLE" }),
                            search.createColumn({ name: "custevent_ptg_numero_exterior", label: "PTG - NUMERO EXTERIOR" }),
                            search.createColumn({ name: "custevent_ptg_numero_interior", label: "PTG - NUMERO INTERIOR" }),
                            search.createColumn({ name: "custevent_ptg_municipio", label: "PTG - MUNICIPIO" }),
                            search.createColumn({ name: "custevent_ptg_estado", label: "PTG - ESTADO" }),
                            search.createColumn({ name: "custevent_ptg_colonia", label: "PTG - COLONIA" }),
                            search.createColumn({ name: "custevent_ptg_codigo_postal", label: "PTG - CODIGO POSTAL" }),
                            //search.createColumn({ name: "incomingmessage", label : "MESSAGE"}),
                        ]
                });

                if(requestBody.idAddress) {
                    var addressFilter2 = search.createFilter({
                        name: "custevent_ptg_id_direccion",
                        operator: "is",
                        values: requestBody.idAddress
                    })
                    supportcaseSearchObj.filters.push(addressFilter2);
                }

                var arrayFechaPrometida = [];
                let rangoPrometido1 = requestBody.fechaPrometida1 || "";
                arrayFechaPrometida.push(rangoPrometido1);
                let rangoPrometido2 = requestBody.fechaPrometida2 || "";
                arrayFechaPrometida.push(rangoPrometido2);
                if (rangoPrometido1 || rangoPrometido2) {
                    var fechaPrometida = search.createFilter({
                        name: "startdate",
                        operator: "within",
                        values: arrayFechaPrometida
                    })
                    supportcaseSearchObj.filters.push(fechaPrometida);
                }

                //Queda pendiente convertir el campo a tipo fecha, ya que es tipo texto
                var arrayFechaVisita = [];
                let rangoVisita1 = requestBody.fechaVisita1 || "";
                arrayFechaVisita.push(rangoVisita1);
                let rangoVisita2 = requestBody.fechaVisita2 || "";
                arrayFechaVisita.push(rangoVisita2);
                if (rangoVisita1 || rangoVisita2) {
                    var fechaVisita = search.createFilter({
                        name: "custevent_ptg_fecha_visita",
                        operator: "within",
                        values: arrayFechaVisita
                    })
                    supportcaseSearchObj.filters.push(fechaVisita);
                }


                let idTipo = requestBody.tipo_servicio || "";
                if (idTipo) {
                    var tipoServicio = search.createFilter({
                        name: "category",
                        operator: "anyof",
                        values: idTipo
                    })
                    supportcaseSearchObj.filters.push(tipoServicio);
                }

                let estadoId = requestBody.estado || "";
                if (estadoId) {
                    var estadoServicio = search.createFilter({
                        name: "status",
                        operator: "anyof",
                        values: estadoId
                    })
                    supportcaseSearchObj.filters.push(estadoServicio);
                }

                let item = requestBody.itemId || "";
                if (item) {
                    var itemFilter = search.createFilter({
                        name: "item",
                        operator: "anyof",
                        values: item
                    })
                    supportcaseSearchObj.filters.push(itemFilter);
                }

                var searchResultCount = supportcaseSearchObj.run();
                var results = searchResultCount.getRange(0, 999);
                log.audit('results case', results)

                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    var numberCase = results[i].getValue(columnas[0]);
                    var caseAsunto = results[i].getValue(columnas[2]);
                    var idCustomer = results[i].getValue(columnas[3]);
                    var idAssigned = results[i].getValue(columnas[4]);
                    var caseStatus = results[i].getValue(columnas[5]);
                    var idPriority = results[i].getValue(columnas[6]);
                    var idIten = results[i].getValue(columnas[7]);
                    var fechavisita = results[i].getValue(columnas[8]);
                    var horaVisita = results[i].getValue(columnas[9]);
                    var nota = results[i].getValue(columnas[10]);
                    var idTr = results[i].getValue(columnas[12]);
                    var category = results[i].getValue(columnas[13]);
                    var email = results[i].getValue(columnas[14]);
                    var casoAsociadoId = results[i].getValue(columnas[15]);
                    var casoAsociado = results[i].getText(columnas[15]);
                    var oppName = results[i].getValue(columnas[18]);
                    var oppId = results[i].getValue(columnas[17]);
                    var conceptoCaso = results[i].getText(columnas[19]);
                    var dateIncident = results[i].getValue(columnas[20]);
                    var fechaCreacion = results[i].getValue(columnas[21]);
                    var descripcion = results[i].getValue(columnas[22]);
                    var dateClose = results[i].getValue(columnas[23]);
                    var calle = results[i].getValue(columnas[24]);
                    var nExterior = results[i].getValue(columnas[25]);
                    var nInterior = results[i].getValue(columnas[26]);
                    var municipio = results[i].getValue(columnas[27]);
                    var estado = results[i].getValue(columnas[28]);
                    var coloniaDireccion = results[i].getValue(columnas[29]);
                    var codigoPostal = results[i].getValue(columnas[30]);
                    //var notas = results[i].getValue(columnas[20]);

                    var caseDate = results[i].getValue(columnas[5]);
                    log.debug('idCustomer', idCustomer)
                    var fieldCustomerLookUp = search.lookupFields({
                        type: search.Type.CUSTOMER,
                        id: idCustomer,
                        columns: ['entityid', 'altname', 'phone']
                    });

                    var caseCliente = fieldCustomerLookUp.entityid + ' ' + fieldCustomerLookUp.altname
                    var casetelefono = fieldCustomerLookUp.phone;
                    var fieldEmployeeLookUp = '';
                    var nombreEstado = results[i].getText(columnas[5]);;
                    var nombrePrioridad = results[i].getText(columnas[6]);;
                    log.debug('idAssigned', idAssigned)
                    if (idAssigned) {
                        var EmployeeLookUp = search.lookupFields({
                            type: search.Type.EMPLOYEE,
                            id: idAssigned,
                            columns: ['entityid']
                        });
                        var nombreEmpleado = EmployeeLookUp.entityid
                        fieldEmployeeLookUp = nombreEmpleado
                    } else {
                        fieldEmployeeLookUp = ""
                    }

                    var caseAsignado = fieldEmployeeLookUp

                    // if (caseStatus == 1) {
                    //     nombreEstado = 'No iniciado'
                    // } else if (caseStatus == 2) {
                    //     nombreEstado = 'En curso'
                    // } else if (caseStatus == 3) {
                    //     nombreEstado = 'Escalado'
                    // } else if (caseStatus == 4) {
                    //     nombreEstado = 'Reabierto'
                    // } else if (caseStatus == 5) {
                    //     nombreEstado = 'Cerrado'
                    // }


                    // if (idPriority == 1) {
                    //     nombrePrioridad = 'Alto'
                    // } else if (idPriority == 2) {
                    //     nombrePrioridad = 'Medio'
                    // } else if (idPriority == 3) {
                    //     nombrePrioridad = 'Bajo'
                    // }
                    let nombreTipoServicio = '';
                    if (category == 1) {
                        nombreTipoServicio = 'Cilindro'
                    } else if (category == 2) {
                        nombreTipoServicio = 'Estacionario'
                    } else if (category == 3) {
                        nombreTipoServicio = 'Carburación'
                    } else if (category == 4) {
                        nombreTipoServicio = 'Otros'
                    }

                    log.debug('idIten', idIten)
                    var nombreArticulo = "";
                    if (idIten) {
                        var itemLookUp = search.lookupFields({
                            type: search.Type.ITEM,
                            id: idIten,
                            columns: ['itemid']
                        });
                        nombreArticulo = itemLookUp.itemid
                    }



                    objCaso = {
                        id_Transaccion: idTr,
                        numeroCaso: numberCase,
                        asunto: caseAsunto,
                        cliente: caseCliente,
                        asiganado: caseAsignado,
                        telefono: casetelefono,
                        estatus: nombreEstado,
                        prioridad: nombrePrioridad,
                        articulo: nombreArticulo,
                        fecha_visita: fechavisita,
                        hora_visita: horaVisita,
                        //nota_rapida: notas,
                        tipo_servicio: nombreTipoServicio,
                        email: email,
                        casoAsociadoId: casoAsociadoId,
                        casoAsociado: ((!!casoAsociado && !!fechavisita && !!horaVisita) ? `${casoAsociado} - Fechas ${fechavisita} ${horaVisita}` : ""),
                        oppId: oppId,
                        oppName: `Nº Documento ${oppName}`,
                        conceptoCaso: conceptoCaso,
                        dateIncident: dateIncident,
                        fechaCreacion: fechaCreacion,
                        descripcion: descripcion,
                        dateClose: dateClose,
                        calle: calle,
                        nExterior: nExterior,
                        nInterior: nInterior,
                        municipio: municipio,
                        estado: estado,
                        colonia: coloniaDireccion,
                        codigoPostal: codigoPostal
                        //nota : nota
                        /*,
    
                        fecha: caseDate
                        */
                    }

                    arrayCaso.push(objCaso);
                }



                // if(arrayOportunidades.length > 0 || arrayCaso.length > 0){
                log.debug('arrayCaso', arrayCaso)
                responseData.success = true;
                responseData.data = (arrayCaso.length > 0) ? arrayCaso : []
                // }


                return responseData;

            } catch (error) {
                log.audit('error', error);
                responseData.message = error;
                return responseData
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
