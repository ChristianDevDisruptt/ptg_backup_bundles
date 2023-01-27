/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/format', 'N/record', 'N/search'],
    /**
   * @param{format} format
   * @param{record} record
   * @param{search} search
   */
    (format, record, search) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            try {
                //Obtener los clientes que tienen aviso o programado para generar su oportunidad
                //test prueba nueva laptop
                let customerSearchObj = search.create({
                    type: "customer",
                    filters:
                        [
                            // ["stage", "anyof", "CUSTOMER"],
                            // "AND",
                            // ["custentityptg_tipodecontacto_", "anyof", "2", "4"]
                            ["stage", "anyof", "CUSTOMER"],
                            "AND",
                            ["shippingaddress.custrecord_ptg_tipo_contacto", "anyof", "2", "4"],
                            "AND",
                            //["internalid", "anyof", "323002"]
                            //["internalid", "anyof", "16061"]
                            //["internalid", "anyof", "323003"]
                            //["internalid", "anyof", "322143"]                            
                            //["internalid", "anyof", "15594"]
                            //["internalid", "anyof", "323018"]
                            //["internalid", "anyof", "323019"]
                            //["internalid", "anyof", "323020"]                            
                            ["internalid", "anyof", "323732"]
                            //["internalid", "anyof", "323002", "16061", "323003", "322143", "15594", "323018", "323019", "323020"]

                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            //Primera versión
                            // search.createColumn({ name: "custentity_ptg_periododecontacto_", label: "PTG - Periodo de contacto:" }),
                            // search.createColumn({ name: "custentity_ptg_entrelas_", label: "PTG - Entre las:" }),
                            // search.createColumn({ name: "custentity_ptg_ylas_", label: "PTG - Y las_" }),
                            // search.createColumn({ name: "custentityptg_tipodecontacto_", label: "PTG - Tipo de Contacto:" }),
                            // search.createColumn({ name: "custentity_ptg_lunes_", label: "PTG - Lunes" }),
                            // search.createColumn({ name: "custentity_ptg_martes_", label: "PTG - Martes" }),
                            // search.createColumn({ name: "custentity_ptg_miercoles_", label: "PTG - Miercoles" }),
                            // search.createColumn({ name: "custentity_ptg_jueves_", label: "PTG - Jueves" }),
                            // search.createColumn({ name: "custentity_ptg_viernes_", label: "PTG - Viernes" }),
                            // search.createColumn({ name: "custentity_ptg_sabado_", label: "PTG - Sabado" }),
                            // search.createColumn({ name: "custentity_ptg_domingo_", label: "PTG - Domingo" }),
                            // search.createColumn({ name: "custentity_ptg_tipodeservicio_", label: "PTG - Tipo de Servicio" }),
                            // search.createColumn({ name: "subsidiary", label: "Primary Subsidiary" }),
                            // search.createColumn({ name: "custentity_ptg_articulo_frecuente", label: "PTG - ARTÍCULO FRECUENTE" }),
                            // search.createColumn({ name: "custentity_ptg_cantidad_frecuente_lt_cil", label: "PTG - CANTIDAD FRECUENTE LT / CIL" }),
                            // search.createColumn({ name: "custentity_ptg_tipodecliente_", label: "PTG - Tipo de cliente" }),
                            // search.createColumn({ name: "custentity_ptg_alianza_comercial_cliente", label: "PTG - ALIANZA COMERCIAL DEL CLIENTE" }),
                            // search.createColumn({ name: "address", label: "Address" }),
                            //Primera versión

                            //Segunda versión
                            // search.createColumn({
                            //     name: "custrecord_ptg_colonia_ruta",
                            //     join: "Address",
                            //     label: "PTG - COLONIA Y RUTA"
                            // }),
                            // // search.createColumn({ name: "datecreated", label: "Date Created" }),
                            // // search.createColumn({ name: "custentity_ptg_cada_", label: "PTG - Cada:" })
                            // search.createColumn({
                            //     name: "custrecord_ptg_lunes",
                            //     join: "Address",
                            //     label: "PTG - LUNES"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_martes",
                            //     join: "Address",
                            //     label: "PTG - MARTES"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_miercoles",
                            //     join: "Address",
                            //     label: "PTG - MIERCOLES"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_jueves",
                            //     join: "Address",
                            //     label: "PTG - JUEVES"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_viernes",
                            //     join: "Address",
                            //     label: "PTG - VIERNES"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_sabado",
                            //     join: "Address",
                            //     label: "PTG - SABADO"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_domingo",
                            //     join: "Address",
                            //     label: "PTG - DOMINGO"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_cada",
                            //     join: "Address",
                            //     label: "PTG - CADA"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_periodo_contacto",
                            //     join: "Address",
                            //     label: "PTG - PERIODO DE CONTACTO"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_entre_las",
                            //     join: "Address",
                            //     label: "PTG - ENTRE LAS"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_y_las",
                            //     join: "Address",
                            //     label: "PTG - Y LAS"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_tipo_contacto",
                            //     join: "Address",
                            //     label: "PTG - TIPO DE CONTACTO"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_tipo_servicio",
                            //     join: "Address",
                            //     label: "PTG - TIPO DE SERVICIO"
                            //  }),
                            //  search.createColumn({
                            //     name: "custrecord_ptg_capacidad_art",
                            //     join: "Address",
                            //     label: "PTG - CAPACIDAD DE ARTICULO"
                            //  }),
                            //  search.createColumn({name: "subsidiary", label: "Primary Subsidiary"}),
                            //  search.createColumn({name: "datecreated", label: "Date Created"}),
                            //  search.createColumn({name: "custentity_ptg_articulo_frecuente", label: "PTG - ARTÍCULO FRECUENTE"}),
                            //  search.createColumn({name: "custentity_ptg_tipodecliente_", label: "PTG - Tipo de cliente"}),
                            //  search.createColumn({name: "custentity_ptg_alianza_comercial_cliente", label: "PTG - ALIANZA COMERCIAL DEL CLIENTE"})
                            //Segunda versión
                            //Tercera Versión
                            search.createColumn({
                                name: "custrecord_ptg_colonia_ruta",
                                join: "Address",
                                label: "PTG - COLONIA Y RUTA"
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
                                name: "custrecord_ptg_entre_las",
                                join: "Address",
                                label: "PTG - ENTRE LAS"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_y_las",
                                join: "Address",
                                label: "PTG - Y LAS"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_tipo_servicio",
                                join: "Address",
                                label: "PTG - TIPO DE SERVICIO"
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
                            search.createColumn({ name: "subsidiary", label: "Primary Subsidiary" }),
                            search.createColumn({ name: "datecreated", label: "Date Created" }),
                            search.createColumn({ name: "custentity_ptg_tipodecliente_", label: "PTG - Tipo de cliente" }),
                            search.createColumn({ name: "custentity_ptg_alianza_comercial_cliente", label: "PTG - ALIANZA COMERCIAL DEL CLIENTE" }),
                            search.createColumn({
                                name: "custrecord_ptg_tipo_contacto",
                                join: "Address",
                                label: "PTG - TIPO DE CONTACTO"
                            }),
                            search.createColumn({
                                name: "addressinternalid",
                                join: "Address",
                                label: "Address Internal ID"
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
                                name: "internalid",
                                join: "Address",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_ruta_asignada",
                                join: "Address",
                                label: "PTG - RUTA ASIGNADA"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_ruta_asignada2",
                                join: "Address",
                                label: "PTG - RUTA ASIGNADA 2"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_ruta_asignada_3",
                                join: "Address",
                                label: "PTG - RUTA ASIGNADA 3"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_ruta_asignada_4",
                                join: "Address",
                                label: "PTG - RUTA ASIGNADA 4"
                            }),
                            search.createColumn({ name: "custentity_ptg_plantarelacionada_", label: "PTG - Planta relacionada: " }),
                            search.createColumn({
                                name: "custrecord_ptg_rango_dias",
                                join: "CUSTENTITY_PTG_PLANTARELACIONADA_",
                                label: "PTG - RANGO DE DIAS"
                            }),
                            // search.createColumn({
                            //     name: "custrecord_ptg_entrega_pedidos_domingo",
                            //     join: "CUSTENTITY_PTG_PLANTARELACIONADA_",
                            //     label: "PTG - ENTREGA PEDIDOS EN DOMINGO"
                            // }),
                            search.createColumn({ name: "custentity_ptg_condicion_credito", label: "PTG - CONDICION DE CREDITO" }),
                            search.createColumn({ name: "creditlimit", label: "CREDIT LIMIT" }),
                            search.createColumn({ name: "balance", label: "BALANCE" }),
                            search.createColumn({ name: "overduebalance", label: "OVERDUE BALANCE" }),
                            search.createColumn({
                                name: "custrecord_ptg_direccion_contrato",
                                join: "Address",
                                label: "PTG - DIRECCION CON CONTRATO"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_numero_contrato",
                                join: "Address",
                                label: "PTG - NUMERO DE CONTRATO"
                            })

                        ]
                });

                let searchResultCount = customerSearchObj.runPaged().count;
                if (searchResultCount > 0) {
                    return customerSearchObj
                }
                //log.debug("customerSearchObj result count", searchResultCount);
                // customerSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     log.debug('result', result)
                //     return true;
                // });    
            } catch (error) {
                log.debug('err', error)
            }


        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            try {
                //log.debug('mapContext', mapContext)
                let infoCustomer = JSON.parse(mapContext.value)
                log.debug('infoCustomer', infoCustomer)

                let week = []
                let sunday = (infoCustomer.values["custrecord_ptg_domingo.Address"] == 'T') ? week.push(0) : null
                let monday = (infoCustomer.values["custrecord_ptg_lunes.Address"] == 'T') ? week.push(1) : null
                let tuesday = (infoCustomer.values["custrecord_ptg_martes.Address"] == 'T') ? week.push(2) : null
                let wednesday = (infoCustomer.values["custrecord_ptg_miercoles.Address"] == 'T') ? week.push(3) : null
                let thursday = (infoCustomer.values["custrecord_ptg_jueves.Address"] == 'T') ? week.push(4) : null
                let friday = (infoCustomer.values["custrecord_ptg_viernes.Address"] == 'T') ? week.push(5) : null
                let saturday = (infoCustomer.values["custrecord_ptg_sabado.Address"] == 'T') ? week.push(6) : null

                let dates = []
                let sundayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_dom.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_dom.Address"]) : dates.push(0)
                let mondayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio.Address"]) : dates.push(0)
                let tuesdayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_mar.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_mar.Address"]) : dates.push(0)
                let wednesdayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_mi.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_mi.Address"]) : dates.push(0)
                let thursdayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_jue.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_jue.Address"]) : dates.push(0)
                let fridayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_vi.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_vi.Address"]) : dates.push(0)
                let saturdayDay = (!!infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_sab.Address"]) ? dates.push(infoCustomer.values["custrecord_ptg_fecha_inicio_servicio_sab.Address"]) : dates.push(0)

                let inThatWeek = infoCustomer.values["custrecord_ptg_en_la_semana.Address"];
                //week.push(monday, tuesday, wednesday, thursday, friday, saturday, sunday);
                log.debug('week of program services', week)
                log.debug('dates of program services', dates)
                log.debug('en la semana...', inThatWeek)
                //log.debug('week of program services', week.length)

                //Validamos si es de tipo programado o aviso
                let contactType = infoCustomer.values["custrecord_ptg_tipo_contacto.Address"].value;
                let clientType = (!!infoCustomer.values.custentity_ptg_tipodecliente_) ? infoCustomer.values.custentity_ptg_tipodecliente_.value : -1;
                let clienAlliance = (!!infoCustomer.values.custentity_ptg_alianza_comercial_cliente) ? infoCustomer.values.custentity_ptg_alianza_comercial_cliente.value : -1;
                infoCustomer.values.inThatWeek = inThatWeek
                infoCustomer.values.week = week
                infoCustomer.values.dates = dates
                //log.debug('contactType', contactType)

                //Validamos que sea el tipo programado o aviso
                if (Number(contactType) == 4 && (clienAlliance == 1 || clienAlliance == 2 || clientType == 3 || clientType == 2 || clientType == 1)) {
                    log.debug('progromado', infoCustomer)
                    //Validar si es día, semana o mensual
                    let typeService = infoCustomer.values["custrecord_ptg_tipo_servicio.Address"];
                    let typeFrequency = infoCustomer.values["custrecord_ptg_periodo_contacto.Address"].value;
                    let customer = infoCustomer.values.internalid.value;
                    let lessDates = Number(infoCustomer.values["custrecord_ptg_rango_dias.CUSTENTITY_PTG_PLANTARELACIONADA_"]) || '';
                    let existOP = validExistOp(Number(customer), Number(contactType), infoCustomer.values["addressinternalid.Address"], typeFrequency, lessDates);
                    log.debug('existOP antes del switch', existOP)

                    //está validacion sirve por si ha tenido un servicio anterior con respecto al de meses y mensual
                    //por si tuvo un servicio antes de la fecha programada
                    if (existOP.exist && existOP.isBefore) {
                        let serviceBeforeDate = validServiceAll(infoCustomer, typeFrequency, week, dates);
                        log.debug('serviceBeforeDate', serviceBeforeDate)
                        log.debug('customer updated beforeDate', infoCustomer)

                        log.debug('actualizar fecha direccion', 'fecha por servicio anterior');
                        if (serviceBeforeDate) {
                            let customerRecord = record.load({
                                type: record.Type.CUSTOMER,
                                id: infoCustomer.values.internalid.value,
                                isDynamic: true
                            });

                            let lineAddress = customerRecord.findSublistLineWithValue({
                                sublistId: 'addressbook',
                                fieldId: 'addressbookaddress',
                                value: infoCustomer.values["internalid.Address"].value
                            });

                            log.debug('id lineAddress', lineAddress)
                            customerRecord.selectLine({
                                sublistId: 'addressbook',
                                line: lineAddress
                            });

                            let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                                sublistId: 'addressbook',
                                fieldId: 'addressbookaddress'
                            });

                            if (infoCustomer.values['idFieldDate']) {
                                addressSubrecord.setText({
                                    fieldId: infoCustomer.values['idFieldDate'],
                                    text: existOP.dateLastService
                                });
                            }

                            customerRecord.commitLine({
                                sublistId: "addressbook"
                            });
                            let idUpdateDate = customerRecord.save();
                            log.debug('se actualizo la fecha de la direcion', idUpdateDate)
                        }
                    }

                    switch (typeFrequency) {
                        //Dias : Solo se le suman la cantidad de dìas a la fecha de ultimo día de servicio
                        case "1":
                            log.debug('dia', typeFrequency)
                            //Validar si le toca hoy el servicio 
                            // let makeServiceDay = validServiceAll(typeFrequency, week, infoCustomer.values.datecreated);
                            // log.debug('makeServiceDay', makeServiceDay)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceDay = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceDay', makeServiceDay)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto
                            log.debug('existOP día programado', existOP)
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Semanal, se le suman las semanas dependiendo la frecuencia que pongan es decir por cada * multiplicar por 7
                        case "2":
                            log.debug('semanas', typeFrequency)
                            // //Validar si le toca hoy el servicio                             
                            // //let makeServiceWeek = validService(typeFrequency, week, infoCustomer.values.datecreated, Number(infoCustomer.values["custrecord_ptg_cada.Address"]));

                            //nueva validacion si es la fecha en que le toca servicio
                            let makeserviceweeks = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeserviceweeks', makeserviceweeks)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto y que no tenga creada una oportunidad                                                                                    
                            log.debug('existOP', existOP)
                            if (!!typeService && Number(typeService.value) == 1 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Semana, los días de la semana que le tocan servicio
                        case "3":
                            log.debug('week', typeFrequency)
                            // //Validar si le toca hoy el servicio 
                            // // let makeServiceMounth = validService(typeFrequency, week, infoCustomer.values.datecreated);
                            // // log.debug('makeServiceMounth', makeServiceMounth)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceWeek = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceWeek', makeServiceWeek);
                            log.debug('customer updated', infoCustomer);

                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;

                        case "5":
                            log.debug('mensual por fecha', typeFrequency)
                            // //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceMounthDay = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceMounthDay', makeServiceMounthDay)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Meses, se le suma 30 días a la ultima fecha de servicio dependiendo la frecuencia
                        case "4":
                            log.debug('mensual por suma', typeFrequency)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceAtMonthly = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceAtMonthly', makeServiceAtMonthly)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                            
                        //Diario
                        case "6":
                            log.debug('diario', typeFrequency)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceAllDays = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceAllDays', makeServiceAllDays)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                    }

                }
                else if (Number(contactType) == 2) {
                    log.debug('aviso', infoCustomer)
                    let typeService = infoCustomer.values["custrecord_ptg_tipo_servicio.Address"];
                    let typeFrequency = infoCustomer.values["custrecord_ptg_periodo_contacto.Address"].value;
                    let customer = infoCustomer.values.internalid.value;
                    let existOP = validExistOp(Number(customer), Number(contactType), infoCustomer.values["addressinternalid.Address"]);
                    switch (typeFrequency) {
                        //Dias : Solo se le suman la cantidad de dìas a la fecha de ultimo día de servicio
                        case "1":
                            log.debug('dia', typeFrequency)
                            //Validar si le toca hoy el servicio 
                            // let makeServiceDay = validServiceAll(typeFrequency, week, infoCustomer.values.datecreated);
                            // log.debug('makeServiceDay', makeServiceDay)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceDay = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceDay', makeServiceDay)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto
                            log.debug('existOP día programado', existOP)
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceDay && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Semanal, se le suman las semanas dependiendo la frecuencia que pongan es decir por cada * multiplicar por 7
                        case "2":
                            log.debug('semanas', typeFrequency)
                            // //Validar si le toca hoy el servicio                             
                            // //let makeServiceWeek = validService(typeFrequency, week, infoCustomer.values.datecreated, Number(infoCustomer.values["custrecord_ptg_cada.Address"]));

                            //nueva validacion si es la fecha en que le toca servicio
                            let makeserviceweeks = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeserviceweeks', makeserviceweeks)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto y que no tenga creada una oportunidad                                                                                    
                            log.debug('existOP', existOP)
                            if (!!typeService && Number(typeService.value) == 1 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeserviceweeks && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Semana, los días de la semana que le tocan servicio
                        case "3":
                            log.debug('week', typeFrequency)
                            // //Validar si le toca hoy el servicio 
                            // // let makeServiceMounth = validService(typeFrequency, week, infoCustomer.values.datecreated);
                            // // log.debug('makeServiceMounth', makeServiceMounth)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceWeek = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceWeek', makeServiceWeek);
                            log.debug('customer updated', infoCustomer);

                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceWeek && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;

                        case "5":
                            log.debug('mensual por fecha', typeFrequency)
                            // //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceMounthDay = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceMounthDay', makeServiceMounthDay)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceMounthDay && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                        //Meses, se le suma 30 días a la ultima fecha de servicio dependiendo la frecuencia
                        case "4":
                            log.debug('mensual por suma', typeFrequency)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceAtMonthly = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceAtMonthly', makeServiceAtMonthly)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceAtMonthly && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                            
                        //Diario
                        case "6":
                            log.debug('diario', typeFrequency)
                            //nueva validacion si es la fecha en que le toca servicio
                            let makeServiceAllDays = validServiceAll(infoCustomer, typeFrequency, week, dates);
                            log.debug('makeServiceAllDays', makeServiceAllDays)
                            log.debug('customer updated', infoCustomer)
                            //Validamos el tipo de servicio si es cilindro , estacionario o mixto                         
                            if (!!typeService && Number(typeService.value) == 1 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'clindro')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 2 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'estacionario')
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            } else if (!!typeService && Number(typeService.value) == 4 && makeServiceAllDays && !existOP.exist) {
                                log.debug('typeService', 'ambos')
                                makeOPCilindro(typeService.value, infoCustomer, Number(contactType));
                                makeOPEstacionario(typeService.value, infoCustomer, Number(contactType));
                            }

                            break;
                    }
                }

            } catch (error) {
                log.debug('err map', error)
            }

        }

        //Validar el tipo de servicio y frecuencia
        const validService = (type, weeks, date, frequency) => {
            log.debug('validService type', type)
            log.debug('frequency type', frequency)
            let day = new Date();

            switch (type) {
                //Dias
                case "1":
                    let days = (day.getDay() == 0) ? 7 : day.getDay();
                    if (weeks.includes(days)) {
                        return true;
                    }
                    break;
                //Semanal
                case "2":
                    let week = (day.getDay() == 0) ? 7 : day.getDay();
                    let initWeek = getWeek(date);
                    let today = getWeek(day);
                    log.debug('initWeek', initWeek);
                    log.debug('today', today);
                    let resultMultiple = isMultiple(initWeek, today, frequency);
                    log.debug('resultMultiple', resultMultiple)
                    if (weeks.includes(week) && resultMultiple) {
                        return true;
                    }
                    break;
                //Mensual
                case "3":
                    let initialFormattedDateString = date;
                    //log.debug('initialFormattedDateString', initialFormattedDateString)
                    let parsedDateStringAsRawDateObject = format.parse({
                        value: initialFormattedDateString,
                        type: format.Type.DATE,
                        timezone: format.Timezone.AMERICA_MEXICO_CITY
                    });

                    let initDate = parsedDateStringAsRawDateObject.getDate();
                    let todayMounth = day.getDate();
                    log.debug('initDate mounth', initDate)
                    log.debug('todayMounth mounth', todayMounth)
                    if (initDate == todayMounth) {
                        return true;
                    }
                    break;
                // case "5":
                //     let initialFormattedDateString = date;
                //     //log.debug('initialFormattedDateString', initialFormattedDateString)
                //     let parsedDateStringAsRawDateObject = format.parse({
                //         value: initialFormattedDateString,
                //         type: format.Type.DATE,
                //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                //     });

                //     let initDate = parsedDateStringAsRawDateObject.getDate();
                //     let todayMounth = day.getDate();
                //     log.debug('initDate mounth', initDate)
                //     log.debug('todayMounth mounth', todayMounth)
                //     if (initDate == todayMounth) {
                //         return true;
                //     }
                //     break;
            }

        }

        //Este tiene la especial de ser para aviso semanal, ya que si la semana no se encuentra hoy pero mañana si, se tiene que crear
        const validServiceAviso = (type, weeks, date, frequency) => {
            let day = new Date();

            switch (type) {
                //Dias
                case "1":
                    let days = (day.getDay() == 0) ? 7 : day.getDay();
                    if (weeks.includes(days)) {
                        return true;
                    }
                    break;
                //Semanal
                case "2":
                    let week = (day.getDay() == 0) ? 7 : day.getDay();
                    let nextWeek = (week == 7) ? 1 : week + 1;
                    let initWeek = getWeek(date);
                    let today = getWeek(day);
                    log.debug('initWeek', initWeek);
                    log.debug('today', today);
                    let resultMultiple = isMultiple(initWeek, today, frequency);
                    log.debug('resultMultiple', resultMultiple)
                    if ((weeks.includes(week) || weeks.includes(nextWeek)) && resultMultiple) {
                        return true;
                    }
                    break;
                //Mensual
                case "3":
                    let initialFormattedDateString = date;
                    //log.debug('initialFormattedDateString', initialFormattedDateString)
                    let parsedDateStringAsRawDateObject = format.parse({
                        value: initialFormattedDateString,
                        type: format.Type.DATE,
                        timezone: format.Timezone.AMERICA_MEXICO_CITY
                    });

                    let initDate = parsedDateStringAsRawDateObject.getDate();
                    let todayMounth = day.getDate();
                    log.debug('initDate mounth', initDate)
                    log.debug('todayMounth mounth', todayMounth)
                    if (initDate == todayMounth) {
                        return true;
                    }
                    break;
            }

        }


        //Nueva validacion para el caso de diario, semanal y mensual        
        const validServiceAll = (customer, type, weeks, dates) => {
            let date = new Date();
            log.debug('data customer', customer);
            log.debug('date actual', date);
            let weeksConfigureCustomer = customer.values.week;
            log.debug('weeksConfigureCustomer', weeksConfigureCustomer)
            let dayOfToday = date.getDate();
            let weekOfToday = date.getDay();
            log.debug('dayOfToday', dayOfToday);
            log.debug('weekOfToday', weekOfToday);
            let makeService = false;
            let lastServiceDate = format.parse({
                value: customer.values["custrecord_ptg_fecha_inicio_servicio.Address"],
                type: format.Type.DATE,
                timezone: format.Timezone.AMERICA_MEXICO_CITY
            });
            log.debug('lastServiceDate', lastServiceDate)
            // let lastServiceDay = lastServiceDate.getDate();
            // log.debug('lastServiceDay', lastServiceDay)
            //let netDateTest = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + 1));
            //log.debug('netDateTest', netDateTest)

            switch (type) {
                //Dias
                case "4":
                    //Primero obtenemos la frecuencia
                    let frecuenciOfMounth = Number(customer.values['custrecord_ptg_cada.Address']) * 30;
                    let addMonthsAtDate = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + frecuenciOfMounth));
                    log.debug('addMonthsAtDate', addMonthsAtDate);

                    if (dayOfToday == addMonthsAtDate.getDate()) {
                        log.debug('entro', 'ya pasaron los meses');

                        //Toca validar que toca trabajar en esta semana y que no es día festivo
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';

                    }


                    // if (weeks.includes(day)) {
                    //     let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //     log.debug('initialhour turn', initialHour);
                    //     let hour = getTimeInt(initialHour);
                    //     log.debug('hour', hour);
                    //     (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;
                    //     //let isSunday = validSunday(new Date(), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //     //log.debug('isSunday Semanal', isSunday)
                    //     let isSunday = validSundayandHolidays(new Date(), customer);
                    //     log.debug('validSundayandHolidays', isSunday);
                    //     makeService.success = true;
                    //     customer.values.exceptDate = isSunday;
                    //     customer.values.dateToUpdate = format.format({
                    //         value: new Date(),
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });;
                    //     customer.values.idFieldDate = false
                    //     //return true;
                    // } else if (weeks.includes(day + 1)) {
                    //     let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //     log.debug('initialhour turn', initialHour);
                    //     let hour = getTimeInt(initialHour);
                    //     log.debug('hour', hour);
                    //     (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;
                    //     //let isSunday = validSunday(new Date(new Date().setDate(new Date().getDate() + 1)), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //     //log.debug('isSunday Semanal', isSunday)
                    //     let isSunday = validSundayandHolidays(new Date(new Date().setDate(new Date().getDate() + 1)), customer);
                    //     log.debug('validSundayandHolidays', isSunday);
                    //     makeService.success = true;
                    //     customer.values.exceptDate = isSunday;
                    //     customer.values.dateToUpdate = format.format({
                    //         value: new Date(new Date().setDate(new Date().getDate() + 1)),
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });;
                    //     customer.values.idFieldDate = false
                    // }
                    break;

                case "1":
                    //Solo se le suman días a la ultima de fecha de servicio
                    let addDaysFrecuenci = Number(customer.values['custrecord_ptg_cada.Address']);
                    let addDaysAtDate = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + addDaysFrecuenci));

                    log.debug('addDaysAtDate', addDaysAtDate);
                    //Validamos que ya paso la frecuencia del ultimo servicio con respecto a la fecha actual
                    if (dayOfToday == addDaysAtDate.getDate()) {
                        log.debug('entro', 'ya pasaron los días');

                        //Toca validar que toca trabajar en esta semana y que no es día festivo
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';

                    }
                    break;
                //Semanal
                case "2":
                    //El caso del semanal, es solo agregar las semanas a la ultima fecha del servico 
                    let frecuenciOfWeek = Number(customer.values['custrecord_ptg_cada.Address']) * 7;
                    let addWeeksAtDate = new Date(lastServiceDate.setDate(lastServiceDate.getDate() + frecuenciOfWeek));

                    log.debug('addWeeksAtDate', addWeeksAtDate);

                    if (dayOfToday == addWeeksAtDate.getDate()) {
                        log.debug('entro', 'ya pasaron las semanas');

                        //Toca validar que toca trabajar en esta semana y que no es día festivo
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';

                    }
                    // //let weeks = JSON.parse(customer.week);
                    // if (weeks.includes(day)) {
                    //     //Obtenemos la fecha del ultimo servicio por el numero de semana
                    //     log.debug('estamos en la semana', day);
                    //     log.debug('ultima fecha del servicio', dates[day]);

                    //     let converLastDate = format.parse({
                    //         value: dates[day],
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });

                    //     //Validamos cuantas veces por semana tenemos que hacer el servicio
                    //     let frecuencyWeek = Number(customer.values['custrecord_ptg_cada.Address']) * 7;
                    //     log.debug('frecuencyWeek', frecuencyWeek)
                    //     let lastDate = converLastDate.getDate();
                    //     log.debug('lastDate', lastDate);
                    //     //let compareDate = nowDate.setDate(nowDate.getDate() - frecuencyWeek).getDate()
                    //     //log.debug('plus frecuency week at date now', new Date(nowDate.setDate(nowDate.getDate() - frecuencyWeek)));
                    //     let lessDate = new Date(nowDate.setDate(nowDate.getDate() - frecuencyWeek));
                    //     log.debug('lessDate', lessDate);
                    //     log.debug('lessDate date', lessDate.getDate());
                    //     //Validamos que la diferencia de la fecha de hoy, sea igual a la fecha del ultimo servicio
                    //     if (lessDate.getDate() == lastDate) {
                    //         //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //         let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //         log.debug('initialhour turn', initialHour);
                    //         let hour = getTimeInt(initialHour);
                    //         log.debug('hour', hour);
                    //         (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //         let fieldId = arrayIds[day]
                    //         log.debug('fieldId', fieldId)
                    //         //let isSunday = validSunday(new Date(), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //         //log.debug('isSunday Semanal', isSunday)
                    //         let isSunday = validSundayandHolidays(new Date(), customer);
                    //         log.debug('validSundayandHolidays Semanal', isSunday);
                    //         makeService.success = true;
                    //         customer.values.exceptDate = isSunday;
                    //         customer.values.dateToUpdate = format.format({
                    //             value: new Date(),
                    //             type: format.Type.DATE,
                    //             timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //         });;
                    //         customer.values.idFieldDate = fieldId

                    //     }

                    // } else if (weeks.includes(day + 1) || weeks.includes(day - 6)) {
                    //     //Esta validacion se hizo pensando en el dia siguiente , ya que tiene que verifcar que mañana igual pasa la semana
                    //     //Si no puede generar el servicio, sin importar que paso la semana, ya que validar que si es 6. restarle -6
                    //     //Para ver si el siguiente dia es domingo, si no es 6, se le aumenta 1                         
                    //     let finalDay;
                    //     if (day == 6) {
                    //         finalDay = day - 6;
                    //     } else {
                    //         finalDay = day + 1;
                    //     }

                    //     log.debug('finalDay', finalDay);
                    //     log.debug('ultima fecha del servicio un dia despues', dates[finalDay]);

                    //     let converLastDate = format.parse({
                    //         value: dates[finalDay],
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });

                    //     //Validamos cuantas veces por semana tenemos que hacer el servicio
                    //     let frecuencyWeek = Number(customer.values['custrecord_ptg_cada.Address']) * 7;
                    //     log.debug('frecuencyWeek', frecuencyWeek)
                    //     let lastDate = converLastDate.getDate();
                    //     log.debug('lastDate', lastDate);
                    //     //let compareDate = nowDate.setDate(nowDate.getDate() - frecuencyWeek).getDate()
                    //     //log.debug('plus frecuency week at date now', new Date(nowDate.setDate(nowDate.getDate() - frecuencyWeek)));
                    //     //Hay que aumentarle una fecha a la de hoy, por que es validar contra el dia siguiente
                    //     let nextDate = new Date(nowDate.setDate(nowDate.getDate() + 1));
                    //     log.debug('next Date', nextDate)
                    //     // //Ahorra si le quitamos los 7 dìas
                    //     let nextLessDate = new Date(nextDate.setDate(nextDate.getDate() - frecuencyWeek));
                    //     log.debug('nextLessDate', nextLessDate);
                    //     log.debug('nextLessDate', nextLessDate.getDate());

                    //     if (nextLessDate.getDate() == lastDate) {
                    //         //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //         let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //         log.debug('initialhour turn nextDate', initialHour);
                    //         let hour = getTimeInt(initialHour);
                    //         log.debug('hour nexDate', hour);
                    //         (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //         //let values = {};
                    //         let fieldId = arrayIds[finalDay]
                    //         //values[fieldId] = nextDate;

                    //         //log.debug('values update nextDate', values);
                    //         //log.debug('customer edited nextDate', customer)
                    //         log.debug('fieldId', fieldId)
                    //         //let isSunday = validSunday(new Date(new Date().setDate(new Date().getDate() + 1)), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //         //log.debug('isSunday Semanal', isSunday)
                    //         let isSunday = validSundayandHolidays(new Date(new Date().setDate(new Date().getDate() + 1)), customer);
                    //         log.debug('validSundayandHolidays Semanal', isSunday);
                    //         makeService.success = true;
                    //         customer.values.exceptDate = isSunday;
                    //         customer.values.dateToUpdate = format.format({
                    //             value: new Date(new Date().setDate(new Date().getDate() + 1)),
                    //             type: format.Type.DATE,
                    //             timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //         });;
                    //         customer.values.idFieldDate = fieldId

                    //     }

                    // }

                    break;
                //Semana
                case "3":
                    //Validamos que toque servicio en la semana con respecto a la fecha y lo que tenga configurado el cliente
                    if (weeksConfigureCustomer.includes(weekOfToday)) {
                        //Toca validar que toca trabajar en esta semana y que no es día festivo
                        log.debug('entro en la semana', weekOfToday);
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';
                    } else if (weeksConfigureCustomer.includes(weekOfToday + 1) || weeksConfigureCustomer.includes(weekOfToday - 6)) {
                        log.debug('entro en la semana siguiente', weekOfToday);
                        let isSunday = validSundayandHolidays(new Date(date.setDate(date.getDate() + 1)), customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';
                    }

                    // log.debug('toca mensual', type)
                    // //Primero validamos en que semana del mes estamos, con respecto a la fecha de hoy                    
                    // let dateActual = date.getDate();
                    // let dayActual = date.getDay();

                    // let weekOfMonth = Math.ceil((dateActual - 1 - dayActual) / 7) + 1;
                    // log.debug('weekOfMonth', weekOfMonth)

                    // let weekOfCustomer = customer.values.inThatWeek.value;
                    // log.debug('weekOfCustomer', weekOfCustomer)
                    // //De igual manera validar en que semana estamos y si estamos en la correcta con respecto al cliente
                    // if (weeks.includes(dayActual)) {
                    //     log.debug('toca hoy', dayActual);

                    //     //Validamos que ya pasara la cantidad de meses a esperar
                    //     let monthActual = date.getMonth() + 1;
                    //     log.debug('monthActual', monthActual)

                    //     let lastMounthCustomer = format.parse({
                    //         value: dates[dayActual],
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });

                    //     log.debug('mes del ultimo servicio', lastMounthCustomer.getMonth() + 1)

                    //     //Validamos que al sumarle la frecuencia al ultimo mes sea al actual
                    //     if ((lastMounthCustomer.getMonth() + (1 + Number(customer.values['custrecord_ptg_cada.Address']))) == monthActual) {
                    //         //Validamos que estemos entre la semana 1 y 4                            
                    //         if (weekOfMonth <= 5 && weekOfMonth == weekOfCustomer) {

                    //             //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //             let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //             log.debug('initialhour turn nextDate', initialHour);
                    //             let hour = getTimeInt(initialHour);
                    //             log.debug('hour nexDate', hour);
                    //             (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //             let fieldId = arrayIds[dayActual]
                    //             log.debug('fieldId', fieldId)

                    //             //let isSunday = validSunday(new Date(), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //             //log.debug('isSunday Semanal', isSunday)
                    //             let isSunday = validSundayandHolidays(new Date(), customer);
                    //             log.debug('validSundayandHolidays semanal', isSunday);
                    //             makeService.success = true;
                    //             customer.values.exceptDate = isSunday;
                    //             customer.values.dateToUpdate = format.format({
                    //                 value: new Date(),
                    //                 type: format.Type.DATE,
                    //                 timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //             });;
                    //             customer.values.idFieldDate = fieldId;
                    //         }

                    //         if (weekOfMonth > 5 && weekOfCustomer == 5) {

                    //             //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //             let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //             log.debug('initialhour turn nextDate', initialHour);
                    //             let hour = getTimeInt(initialHour);
                    //             log.debug('hour nexDate', hour);
                    //             (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //             let fieldId = arrayIds[dayActual]
                    //             log.debug('fieldId', fieldId)

                    //             //let isSunday = validSunday(new Date(), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //             //log.debug('isSunday Semanal', isSunday)
                    //             let isSunday = validSundayandHolidays(new Date(), customer);
                    //             log.debug('validSundayandHolidays semanal', isSunday);
                    //             makeService.success = true;
                    //             customer.values.exceptDate = isSunday;
                    //             customer.values.dateToUpdate = format.format({
                    //                 value: new Date(),
                    //                 type: format.Type.DATE,
                    //                 timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //             });;
                    //             customer.values.idFieldDate = fieldId;
                    //         }
                    //     }


                    // } else if (weeks.includes(dayActual + 1) || weeks.includes(dayActual - 6)) {
                    //     let finalDay;
                    //     if (dayActual == 6) {
                    //         finalDay = day - 6;
                    //     } else {
                    //         finalDay = day + 1;
                    //     }
                    //     log.debug('toca mañana', finalDay);
                    //     //Para el caso del dia siguiente hay que validar igual si el dia de mañana entra en la semana
                    //     //Validamos que ya pasara la cantidad de meses a esperar
                    //     let monthActual = date.getMonth() + 1;
                    //     log.debug('monthActual', monthActual)

                    //     let lastMounthCustomer = format.parse({
                    //         value: dates[finalDay],
                    //         type: format.Type.DATE,
                    //         timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //     });

                    //     log.debug('mes del ultimo servicio', lastMounthCustomer.getMonth() + 1)

                    //     //Validamos que al sumarle la frecuencia al ultimo mes sea al actual
                    //     if ((lastMounthCustomer.getMonth() + (1 + Number(customer.values['custrecord_ptg_cada.Address']))) == monthActual) {
                    //         //Validamos que estemos entre la semana 1 y 4                            
                    //         if (weekOfMonth <= 5 && weekOfMonth == weekOfCustomer) {

                    //             //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //             let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //             log.debug('initialhour turn nextDate', initialHour);
                    //             let hour = getTimeInt(initialHour);
                    //             log.debug('hour nexDate', hour);
                    //             (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //             let fieldId = arrayIds[finalDay]
                    //             log.debug('fieldId', fieldId)

                    //             //let isSunday = validSunday(new Date(new Date().setDate(new Date().getDate() + 1)), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //             //log.debug('isSunday Semanal', isSunday)
                    //             let isSunday = validSundayandHolidays(new Date(new Date().setDate(new Date().getDate() + 1)), customer);
                    //             log.debug('validSundayandHolidays semanal', isSunday);
                    //             makeService.success = true;
                    //             customer.values.exceptDate = isSunday;
                    //             customer.values.dateToUpdate = format.format({
                    //                 value: new Date(new Date().setDate(new Date().getDate() + 1)),
                    //                 type: format.Type.DATE,
                    //                 timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //             });;
                    //             customer.values.idFieldDate = fieldId;
                    //         }

                    //         if (weekOfMonth > 5 && weekOfCustomer == 5) {
                    //             //try {
                    //             //Tienen la misma fecha y ahora toca definir la hora para saber que turno sera
                    //             let initialHour = customer.values['custrecord_ptg_entre_las.Address'];
                    //             log.debug('initialhour turn nextDate', initialHour);
                    //             let hour = getTimeInt(initialHour);
                    //             log.debug('hour nexDate', hour);
                    //             (hour >= 14) ? customer.values.isMoorning = false : customer.values.isMoorning = true;

                    //             let fieldId = arrayIds[finalDay]
                    //             log.debug('fieldId', fieldId)

                    //             //let isSunday = validSunday(new Date(new Date().setDate(new Date().getDate() + 1)), customer.values['custrecord_ptg_entrega_pedidos_domingo.CUSTENTITY_PTG_PLANTARELACIONADA_']);
                    //             //log.debug('isSunday Semanal', isSunday)
                    //             let isSunday = validSundayandHolidays(new Date(new Date().setDate(new Date().getDate() + 1)), customer);
                    //             log.debug('validSundayandHolidays semanal', isSunday);
                    //             makeService.success = true;
                    //             customer.values.exceptDate = isSunday;
                    //             customer.values.dateToUpdate = format.format({
                    //                 value: new Date(new Date().setDate(new Date().getDate() + 1)),
                    //                 type: format.Type.DATE,
                    //                 timezone: format.Timezone.AMERICA_MEXICO_CITY
                    //             });;
                    //             customer.values.idFieldDate = fieldId;
                    //         }
                    //     }
                    // }
                    break;

                case "5":
                    //Validar primero si le toca domingo y que si es la fecha de hoy para devolver la fecha del
                    //servicio        

                    if (dayOfToday == lastServiceDate.getDate()) {
                        log.debug('entro en el mensual', 'un día en especial del mes');
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';
                    }
                    break;

                case "6":
                    //Servicios para todos los dias de la semana   
                    if (weeksConfigureCustomer.includes(weekOfToday)) {
                        //Toca validar que toca trabajar en esta semana y que no es día festivo
                        log.debug('entro en la semana', weekOfToday);
                        let isSunday = validSundayandHolidays(date, customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';
                    } 
                    /*else if (weeksConfigureCustomer.includes(weekOfToday + 1) || weeksConfigureCustomer.includes(weekOfToday - 6)) {
                        log.debug('entro en la semana siguiente', weekOfToday);
                        let isSunday = validSundayandHolidays(new Date(date.setDate(date.getDate() + 1)), customer);
                        log.debug('validSundayandHolidays', isSunday);
                        makeService = true;
                        customer.values.exceptDate = isSunday;
                        customer.values.dateToUpdate = format.format({
                            value: date,
                            type: format.Type.DATE,
                            timezone: format.Timezone.AMERICA_MEXICO_CITY
                        });;
                        customer.values.idFieldDate = 'custrecord_ptg_fecha_inicio_servicio';
                    }*/
                    break;


            }

            return makeService;
        }

        const validSundayandHolidays = (date, customer) => {
            log.debug('dayService validSunday', date);
            log.debug('dayService validSunday Customer', customer);
            let idLocation = customer.values['custentity_ptg_plantarelacionada_'].value;
            log.debug('idLocation days to work', idLocation);
            let week = date.getDay();
            let day = date.getDate();
            log.debug('week sunday', week);

            //Ahora buscamos los días de la semana que no trabajan
            let locationSearchObj = search.create({
                type: "location",
                filters:
                    [
                        ["internalid", "anyof", idLocation]
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_ptg_no_labora_domingo", label: "PTG - NO LABORA EL DOMINGO" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_lunes", label: "PTG - NO LABORA EL LUNES" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_martes", label: "PTG - NO LABORA EL MARTES" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_miercoles", label: "PTG - NO LABORA EL MIERCOLES" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_jueves", label: "PTG - NO LABORA EL JUEVES" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_viernes", label: "PTG - NO LABORA EL VIERNES" }),
                        search.createColumn({ name: "custrecord_ptg_no_labora_sabado", label: "PTG - NO LABORA EL SABADO" })
                    ]
            });
            let arrayWeek = [];
            locationSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                let sunday = result.getValue({ name: "custrecord_ptg_no_labora_domingo", label: "PTG - NO LABORA EL DOMINGO" });
                let monday = result.getValue({ name: "custrecord_ptg_no_labora_lunes", label: "PTG - NO LABORA EL LUNES" });
                let tuesday = result.getValue({ name: "custrecord_ptg_no_labora_martes", label: "PTG - NO LABORA EL MARTES" });
                let wednesday = result.getValue({ name: "custrecord_ptg_no_labora_miercoles", label: "PTG - NO LABORA EL MIERCOLES" });
                let thursday = result.getValue({ name: "custrecord_ptg_no_labora_jueves", label: "PTG - NO LABORA EL JUEVES" });
                let friday = result.getValue({ name: "custrecord_ptg_no_labora_viernes", label: "PTG - NO LABORA EL VIERNES" });
                let saturday = result.getValue({ name: "custrecord_ptg_no_labora_sabado", label: "PTG - NO LABORA EL SABADO" });

                arrayWeek.push(sunday, monday, tuesday, wednesday, thursday, friday, saturday)
                return true;
            });

            log.debug('arrayWeek', arrayWeek)

            //obtenemos las fechas que no trabajan
            let customrecord_ptg_dias_feriados_no_laboraSearchObj = search.create({
                type: "customrecord_ptg_dias_feriados_no_labora",
                filters:
                    [
                    ],
                columns:
                    [
                        search.createColumn({ name: "custrecord_ptg_dia_feriado_no_laboral", label: "PTG - DIA FERIADO NO LABORAL" })
                    ]
            });

            let daysNotWork = [];
            customrecord_ptg_dias_feriados_no_laboraSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                let days = result.getValue({ name: "custrecord_ptg_dia_feriado_no_laboral", label: "PTG - DIA FERIADO NO LABORAL" });
                daysNotWork.push(days);
                return true;
            });

            log.debug('daysNotWork', daysNotWork)
            let todayWork = true;
            for (let key in daysNotWork) {
                let day = format.parse({
                    value: daysNotWork[key],
                    type: format.Type.DATE,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY
                });

                let dayNotWork = day.getDate();
                let mounthNotWork = day.getMonth() + 1;

                if (dayNotWork == date.getDate() && mounthNotWork == (date.getMonth() + 1)) {
                    log.debug('hoy no se trabaja', date)
                    todayWork = false;
                }
            }

            log.debug('todayWork', todayWork);


            let thisWeekWork = arrayWeek[week];
            log.debug('thisWeekWork', thisWeekWork)



            //let date = new Date();            
            //log.debug('day sunday', day);
            //log.debug('makeService sunday', makeService);
            let dayToInsert;
            if (thisWeekWork || !todayWork) {
                //if(makeService == 'F'){     
                dayToInsert = format.parse({
                    value: new Date(date.setDate(date.getDate() + 1)),
                    type: format.Type.DATE,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY
                });

                log.debug('antes del if', dayToInsert)

                let nextDayWork = true;
                log.debug('getWeekOfnextDay', dayToInsert.getDay())
                let thisNextWeekWork = arrayWeek[dayToInsert.getDay()];
                log.debug('thisNextWeekWork', thisNextWeekWork)
                for (let key in daysNotWork) {
                    let day = format.parse({
                        value: daysNotWork[key],
                        type: format.Type.DATE,
                        timezone: format.Timezone.AMERICA_MEXICO_CITY
                    });
                    let dayNotWork = day.getDate();
                    let mounthNotWork = day.getMonth() + 1;

                    if (dayNotWork == dayToInsert.getDate() && mounthNotWork == (dayToInsert.getMonth() + 1)) {
                        log.debug('el dia siguiente tampoco se trabaja', dayToInsert)
                        nextDayWork = false;
                    }
                }

                if (thisNextWeekWork || !nextDayWork) {
                    dayToInsert = format.format({
                        value: new Date(dayToInsert.setDate(dayToInsert.getDate() + 1)),
                        type: format.Type.DATE,
                        timezone: format.Timezone.AMERICA_MEXICO_CITY
                    });

                    log.debug('despues del if', dayToInsert)
                }

            } else {
                dayToInsert = format.format({
                    value: date,
                    type: format.Type.DATE,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY
                });
            }

            return dayToInsert;
        }

        //Validar si va a tener ruta matutina o vespertina
        function getTimeInt(time) {
            let timeAux = time.split(" "),
                hour = timeAux[0].split(":")[0];

            if (timeAux[1].toLowerCase() == "pm" || timeAux[1].toLowerCase() == "p.m") {
                if (hour != "12") {
                    hour = parseInt(hour) + 12;
                }
            } else if (timeAux[1].toLowerCase() == "am" || timeAux[1].toLowerCase() == "a.m") {
                if (hour == "12") {
                    hour = 0;
                }
            }
            return parseInt(hour);
        }

        const getWeek = (date) => {
            let initialFormattedDateString = date;
            log.debug('initialFormattedDateString', initialFormattedDateString)
            let parsedDateStringAsRawDateObject = format.parse({
                value: initialFormattedDateString,
                type: format.Type.DATE,
                timezone: format.Timezone.AMERICA_MEXICO_CITY
            });
            //log.debug('date created transform', parsedDateStringAsRawDateObject)
            // log.debug('date created get year', parsedDateStringAsRawDateObject.getFullYear())
            let oneJan = new Date(parsedDateStringAsRawDateObject.getFullYear(), 0, 1);
            let numberOfDays = Math.floor((parsedDateStringAsRawDateObject - oneJan) / (24 * 60 * 60 * 1000));
            let resultWeek = Math.ceil((parsedDateStringAsRawDateObject.getDay() + 1 + numberOfDays) / 7);
            log.debug('result week of year', resultWeek)
            return resultWeek;
        }

        const isMultiple = (initWeek, today, frequency) => {
            let result = false;
            if ((today - initWeek) % frequency == 0) {
                result = true;
            }
            return result;
        }

        //Funciones para crear clindros
        const makeOPCilindro = (typeService, infoCustomer, contactType) => {
            log.debug('makeOPCilindro', 'entro')
            log.debug('makeOPCilindro', infoCustomer)
            log.debug('typeService', typeService)
            log.debug('contactType', contactType)
            let getWeek = new Date().getDay();
            if (getWeek == 0) {
                getWeek = 7;
            }

            if ((contactType == 4 || contactType == 2) && Number(typeService) == 1) {
                //Validamos que tenga configurado un articulo
                //Nota: Se va a cambiar al final el tipo de articulo a nivel de dirección
                if (!!infoCustomer.values['custrecord_ptg_articulo_frecuente.Address']) {
                    //Obtenemos el precio por zona
                    let priceZoneValue = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getPriceZone(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let territory = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getTerritory(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    log.debug('priceZoneValue Cilindro', priceZoneValue)
                    //Obtenemos la cantidad que tiene el articulo de cilindro
                    let itemContent = search.lookupFields({
                        type: 'item',
                        id: Number(infoCustomer.values['custrecord_ptg_articulo_frecuente.Address'].value),
                        columns: ['custitem_ptg_capacidadcilindro_']
                    });
                    log.debug('itemcontent', itemContent)
                    //Creamos la oportunidad
                    let opportunityCilindro = record.create({
                        type: record.Type.OPPORTUNITY,
                        isDynamic: true
                    });

                    opportunityCilindro.setValue('customform', 265);
                    //prd 265
                    opportunityCilindro.setValue('entity', infoCustomer.values.internalid.value);
                    opportunityCilindro.setValue('custbody_ptg_estado_pedido', (contactType == 4) ? 1 : 6);
                    if (contactType == 2) {
                        opportunityCilindro.setValue('custbody_ptg_estado_aviso_llamadas', 3);
                    }
                    //opportunityCilindro.setValue('probability', 75);
                    opportunityCilindro.setValue('custbody_ptg_tipo_servicio', 1);
                    opportunityCilindro.setValue('custbody_ptg_id_direccion_envio', infoCustomer.values['addressinternalid.Address']);
                    opportunityCilindro.setValue('custbody_ptg_precio_articulo_zona', priceZoneValue);
                    opportunityCilindro.setText('custbody_ptg_entre_las', infoCustomer.values['custrecord_ptg_entre_las.Address']);
                    opportunityCilindro.setText('custbody_ptg_y_las', infoCustomer.values['custrecord_ptg_y_las.Address']);
                    opportunityCilindro.setValue('custbody_ptg_zonadeprecioop_', territory);
                    opportunityCilindro.setValue('custbody_ptg_planta_relacionada', infoCustomer.values['custentity_ptg_plantarelacionada_'].value);
                    if (contactType == 4) {
                        opportunityCilindro.setValue('custbody_ptg_oportunidad_programado', true);
                    }
                    if (infoCustomer.values.isMoorning) {
                        opportunityCilindro.setValue('custbody_ptg_ruta_asignada', infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text);
                        opportunityCilindro.setValue('custbody_ptg_turno_equipo', 1);
                    } else {
                        opportunityCilindro.setValue('custbody_ptg_ruta_asignada', (infoCustomer.values['custrecord_ptg_ruta_asignada2.Address'].text || infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text));
                        opportunityCilindro.setValue('custbody_ptg_turno_equipo', 2);
                    }
                    //Agregar la direccion de envio
                    opportunityCilindro.setValue('shipaddresslist', Number(infoCustomer.values['addressinternalid.Address']));
                    (getWeek == 0) ? getWeek = 7 : getWeek = getWeek;
                    let day = [getWeek];
                    //log.debug('day of week', day);
                    // opportunityCilindro.setValue('custbody_ptg_dia_semana', day);
                    //opportunityCilindro.setValue('subsidiary', infoCustomer.values.subsidiary.value);
                    let today = new Date();
                    //today = today.setDate(today.getDate()+1);
                    today.setDate(today.getDate() + 1);
                    //og.debug('today add', today)
                    opportunityCilindro.setText('expectedclosedate', infoCustomer.values['exceptDate']);

                    //Validamos que tenga una capacidad del cilindro y que tenga configurado un precio de zona
                    if (!!itemContent['custitem_ptg_capacidadcilindro_'] && Number(priceZoneValue) > 0) {
                        //opportunityCilindro.insertLine({ sublistId: 'item', line: 0 });
                        opportunityCilindro.selectNewLine({ sublistId: 'item' });
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: Number(infoCustomer.values["custrecord_ptg_articulo_frecuente.Address"].value) });
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: Number(infoCustomer.values["custrecord_ptg_capacidad_art.Address"]) });
                        let finalRate = Number(itemContent['custitem_ptg_capacidadcilindro_']) * Number(priceZoneValue);
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: finalRate });
                        // let finalAmount = (Number(infoCustomer.values.custentity_ptg_cantidad_frecuente_lt_cil) * Number(itemContent['custitem_ptg_capacidadcilindro_'])) * Number(priceZoneValue);
                        // opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: finalAmount });
                        opportunityCilindro.commitLine({ sublistId: 'item' });
                        let creditOk = validCredit(infoCustomer, (finalRate * 1.16));
                        if ((contactType == 4 && creditOk) || contactType == 2) {
                            let objPayment = {
                                pago: []
                            };
                            if (!!infoCustomer.values['custentity_ptg_alianza_comercial_cliente'].value || infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') {
                                let objCreditContract = {};
                                objCreditContract.metodo_txt = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? 'Contrato del cliente' : 'Crédito del cliente';
                                objCreditContract.tipo_pago = 9;
                                objCreditContract.tipo_cuenta = null;
                                objCreditContract.tipo_tarjeta = null;
                                objCreditContract.monto = (finalRate * 1.16).toFixed(6);
                                objCreditContract.folio = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? infoCustomer.value['custrecord_ptg_numero_contrato.Address'] : '';
                                objPayment.pago.push(objCreditContract);
                                opportunityCilindro.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            } else {
                                let objEfectivo = {};
                                objEfectivo.metodo_txt = "Efectivo";
                                objEfectivo.tipo_pago = 1;
                                objEfectivo.tipo_cuenta = null;
                                objEfectivo.tipo_tarjeta = null;
                                objEfectivo.monto =  (finalRate * 1.16).toFixed(6);
                                objEfectivo.folio = '';
                                objPayment.pago.push(objEfectivo);
                                opportunityCilindro.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            }


                            let id = opportunityCilindro.save();
                            log.debug('se creo cilindro programada', id)

                        } else {
                            log.debug('no creo', 'no creo por que el limite se paso o no es de tipo aviso')
                        }
                        //if (!!id) {
                        log.debug('actualizar fecha direccion', 'fecha');
                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: infoCustomer.values.internalid.value,
                            isDynamic: true
                        });

                        let lineAddress = customerRecord.findSublistLineWithValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            value: infoCustomer.values["internalid.Address"].value
                        });

                        log.debug('id lineAddress', lineAddress)
                        customerRecord.selectLine({
                            sublistId: 'addressbook',
                            line: lineAddress
                        });

                        let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress'
                        });

                        if (infoCustomer.values['idFieldDate']) {
                            addressSubrecord.setText({
                                fieldId: infoCustomer.values['idFieldDate'],
                                text: infoCustomer.values['dateToUpdate']
                            });
                        }

                        customerRecord.commitLine({
                            sublistId: "addressbook"
                        });
                        let idUpdateDate = customerRecord.save();
                        log.debug('se actualizo la fecha de la direcion', idUpdateDate)

                        //}
                    }
                }


            } else if ((contactType == 4 || contactType == 2) && Number(typeService) == 4) {
                //Para el caso de ambos, se tiene que generar una op de clindro que se tiene del primer articulo frecuente
                if (!!infoCustomer.values['custrecord_ptg_articulo_frecuente.Address']) {
                    //Obtenemos el precio por zona
                    let priceZoneValue = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getPriceZone(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let territory = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getTerritory(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    log.debug('priceZoneValue Cilindro', priceZoneValue)
                    //Obtenemos la cantidad que tiene el articulo de cilindro
                    let itemContent = search.lookupFields({
                        type: 'item',
                        id: Number(infoCustomer.values['custrecord_ptg_articulo_frecuente.Address'].value),
                        columns: ['custitem_ptg_capacidadcilindro_']
                    });
                    log.debug('itemcontent', itemContent)
                    //Creamos la oportunidad
                    let opportunityCilindro = record.create({
                        type: record.Type.OPPORTUNITY,
                        isDynamic: true
                    });

                    opportunityCilindro.setValue('customform', 265);
                    opportunityCilindro.setValue('entity', infoCustomer.values.internalid.value);
                    opportunityCilindro.setValue('custbody_ptg_estado_pedido', (contactType == 4) ? 1 : 6);
                    if (contactType == 2) {
                        opportunityCilindro.setValue('custbody_ptg_estado_aviso_llamadas', 3);
                    }
                    //opportunityCilindro.setValue('probability', 75);
                    opportunityCilindro.setValue('custbody_ptg_tipo_servicio', 1);
                    opportunityCilindro.setValue('custbody_ptg_id_direccion_envio', infoCustomer.values['addressinternalid.Address']);
                    opportunityCilindro.setValue('custbody_ptg_precio_articulo_zona', priceZoneValue);
                    opportunityCilindro.setText('custbody_ptg_entre_las', infoCustomer.values['custrecord_ptg_entre_las.Address']);
                    opportunityCilindro.setText('custbody_ptg_y_las', infoCustomer.values['custrecord_ptg_y_las.Address']);
                    opportunityCilindro.setValue('custbody_ptg_zonadeprecioop_', territory);
                    opportunityCilindro.setValue('custbody_ptg_planta_relacionada', infoCustomer.values['custentity_ptg_plantarelacionada_'].value);
                    if (infoCustomer.values.isMoorning) {
                        opportunityCilindro.setValue('custbody_ptg_ruta_asignada', infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text);
                        opportunityCilindro.setValue('custbody_ptg_turno_equipo', 1);
                    } else {
                        opportunityCilindro.setValue('custbody_ptg_ruta_asignada', (infoCustomer.values['custrecord_ptg_ruta_asignada2.Address'].text || infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text));
                        opportunityCilindro.setValue('custbody_ptg_turno_equipo', 2);
                    }
                    //Agregar la direccion de envio
                    opportunityCilindro.setValue('shipaddresslist', Number(infoCustomer.values['addressinternalid.Address']));
                    (getWeek == 0) ? getWeek = 7 : getWeek = getWeek;
                    let day = [getWeek];
                    //log.debug('day of week', day);
                    // opportunityCilindro.setValue('custbody_ptg_dia_semana', day);
                    //opportunityCilindro.setValue('subsidiary', infoCustomer.values.subsidiary.value);
                    let today = new Date();
                    //today = today.setDate(today.getDate()+1);
                    today.setDate(today.getDate() + 1);
                    //og.debug('today add', today)
                    opportunityCilindro.setText('expectedclosedate', infoCustomer.values['exceptDate']);

                    //Validamos que tenga una capacidad del cilindro y que tenga configurado un precio de zona
                    if (!!itemContent['custitem_ptg_capacidadcilindro_'] && Number(priceZoneValue) > 0) {
                        //opportunityCilindro.insertLine({ sublistId: 'item', line: 0 });
                        opportunityCilindro.selectNewLine({ sublistId: 'item' });
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: Number(infoCustomer.values["custrecord_ptg_articulo_frecuente.Address"].value) });
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: Number(infoCustomer.values["custrecord_ptg_capacidad_art.Address"]) });
                        let finalRate = Number(itemContent['custitem_ptg_capacidadcilindro_']) * Number(priceZoneValue);
                        opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: finalRate });
                        // let finalAmount = (Number(infoCustomer.values.custentity_ptg_cantidad_frecuente_lt_cil) * Number(itemContent['custitem_ptg_capacidadcilindro_'])) * Number(priceZoneValue);
                        // opportunityCilindro.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: finalAmount });
                        opportunityCilindro.commitLine({ sublistId: 'item' });
                        let creditOk = validCredit(infoCustomer, (finalRate * 1.16));
                        if ((contactType == 4 && creditOk) || contactType == 2) {
                            let objPayment = {
                                pago: []
                            };
                            if (!!infoCustomer.values['custentity_ptg_alianza_comercial_cliente'].value || infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') {
                                let objCreditContract = {};
                                objCreditContract.metodo_txt = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? 'Contrato del cliente' : 'Crédito del cliente';
                                objCreditContract.tipo_pago = 9;
                                objCreditContract.tipo_cuenta = null;
                                objCreditContract.tipo_tarjeta = null;
                                objCreditContract.monto = (finalRate * 1.16).toFixed(6);
                                objCreditContract.folio = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? infoCustomer.value['custrecord_ptg_numero_contrato.Address'] : '';
                                objPayment.pago.push(objCreditContract);
                                opportunityCilindro.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            } else {
                                let objEfectivo = {};
                                objEfectivo.metodo_txt = "Efectivo";
                                objEfectivo.tipo_pago = 1;
                                objEfectivo.tipo_cuenta = null;
                                objEfectivo.tipo_tarjeta = null;
                                objEfectivo.monto = (finalRate * 1.16).toFixed(6);
                                objEfectivo.folio = '';
                                objPayment.pago.push(objEfectivo);
                                opportunityCilindro.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            }

                            let id = opportunityCilindro.save();
                            log.debug('se creo cilindro programada ambos', id)
                        }

                        //if (!!id) {
                        log.debug('actualizar fecha direccion', 'fecha');
                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: infoCustomer.values.internalid.value,
                            isDynamic: true
                        });

                        let lineAddress = customerRecord.findSublistLineWithValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            value: infoCustomer.values["internalid.Address"].value
                        });

                        log.debug('id lineAddress', lineAddress)
                        customerRecord.selectLine({
                            sublistId: 'addressbook',
                            line: lineAddress
                        });

                        let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress'
                        });

                        if (infoCustomer.values['idFieldDate']) {
                            addressSubrecord.setText({
                                fieldId: infoCustomer.values['idFieldDate'],
                                text: infoCustomer.values['dateToUpdate']
                            });
                        }

                        customerRecord.commitLine({
                            sublistId: "addressbook"
                        });
                        let idUpdateDate = customerRecord.save();
                        log.debug('se actualizo la fecha de la direcion', idUpdateDate)

                        //}
                    }
                }

            }
        }

        //Funcion especial para los de tipo Programado, validarlos creditos
        const validCredit = (customer, total) => {
            log.debug('valid credit', total)
            let status = true;
            let typeCredit = customer.values['custentity_ptg_condicion_credito'].value;

            if (typeCredit == 1) {
                status = false;
            } else if (typeCredit == 2) {
                let balance = customer.values['balance'];
                let creditlimit = customer.values['creditlimit'];
                let finalTotal = (total * 1.16) + Number(balance);

                log.debug('final total', finalTotal);
                if (finalTotal > Number(creditlimit)) {
                    status = false;
                }
            } else if (typeCredit == 3) {
                let balance = customer.values['balance'];
                let creditlimit = customer.values['creditlimit'];
                let balanceOver = customer.values['overduebalance']
                let finalTotal = (total * 1.16) + Number(balance);
                log.debug('final total', finalTotal);
                if (finalTotal > Number(creditlimit) || balanceOver > 0) {
                    status = false;
                }
            }

            log.debug('status valid credit', status)
            return status;
        }

        //Funcion para crear estacionario
        const makeOPEstacionario = (typeService, infoCustomer, contactType) => {
            log.debug('makeOPEstacionario', 'entro')
            let getWeek = new Date().getDay();
            if (getWeek == 0) {
                getWeek = 7;
            }

            if ((contactType == 4 || contactType == 2) && Number(typeService) == 2) {
                //Mismo proceso que cilindro pero ahora con estacionario y la diferencia de momento es que no tiene configurado una capacidad por el tipo de articulo
                if (!!infoCustomer.values['custrecord_ptg_articulo_frecuente.Address']) {
                    let priceZoneValue = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getPriceZone(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let territory = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getTerritory(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let opportunityEstacionaria = record.create({
                        type: record.Type.OPPORTUNITY,
                        isDynamic: true
                    });

                    opportunityEstacionaria.setValue('customform', 265);
                    opportunityEstacionaria.setValue('entity', infoCustomer.values.internalid.value);
                    opportunityEstacionaria.setValue('custbody_ptg_estado_pedido', (contactType == 4) ? 1 : 6);
                    if (contactType == 2) {
                        opportunityEstacionaria.setValue('custbody_ptg_estado_aviso_llamadas', 3);
                    }
                    //opportunityEstacionaria.setValue('probability', 75);
                    opportunityEstacionaria.setValue('custbody_ptg_tipo_servicio', 2);
                    opportunityEstacionaria.setValue('custbody_ptg_precio_articulo_zona', priceZoneValue);
                    log.debug('address id estacionario', infoCustomer.values['addressinternalid.Address'])
                    opportunityEstacionaria.setValue('custbody_ptg_id_direccion_envio', infoCustomer.values['addressinternalid.Address']);
                    opportunityEstacionaria.setText('custbody_ptg_entre_las', infoCustomer.values['custrecord_ptg_entre_las.Address']);
                    opportunityEstacionaria.setText('custbody_ptg_y_las', infoCustomer.values['custrecord_ptg_y_las.Address']);
                    opportunityEstacionaria.setValue('custbody_ptg_zonadeprecioop_', territory);
                    if (contactType == 4) {
                        opportunityEstacionaria.setValue('custbody_ptg_oportunidad_programado', true);
                    }
                    opportunityEstacionaria.setValue('custbody_ptg_planta_relacionada', infoCustomer.values['custentity_ptg_plantarelacionada_'].value);
                    if (infoCustomer.values.isMoorning) {
                        opportunityEstacionaria.setValue('custbody_ptg_ruta_asignada', infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text);
                        opportunityEstacionaria.setValue('custbody_ptg_turno_equipo', 1);
                    } else {
                        opportunityEstacionaria.setValue('custbody_ptg_ruta_asignada', (infoCustomer.values['custrecord_ptg_ruta_asignada2.Address'].text || infoCustomer.values['custrecord_ptg_ruta_asignada.Address'].text));
                        opportunityEstacionaria.setValue('custbody_ptg_turno_equipo', 2);
                    }
                    //Agregar la direccion de envio
                    opportunityEstacionaria.setValue('shipaddresslist', Number(infoCustomer.values['addressinternalid.Address']));
                    (getWeek == 0) ? getWeek = 7 : getWeek = getWeek;
                    let day = [getWeek];
                    //log.debug('day of week', day);
                    //opportunityEstacionaria.setValue('custbody_ptg_dia_semana', day);
                    //opportunityEstacionaria.setValue('subsidiary', infoCustomer.values.subsidiary.value);
                    let today = new Date();
                    //today = today.setDate(today.getDate()+1);
                    today.setDate(today.getDate() + 1);
                    //log.debug('today add', today)
                    opportunityEstacionaria.setText('expectedclosedate', infoCustomer.values['exceptDate']);

                    if (Number(priceZoneValue) > 0) {
                        //opportunityEstacionaria.insertLine({ sublistId: 'item', line: 0 });
                        opportunityEstacionaria.selectNewLine({ sublistId: 'item' });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: Number(infoCustomer.values["custrecord_ptg_articulo_frecuente.Address"].value) });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: Number(infoCustomer.values["custrecord_ptg_capacidad_art.Address"]) });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: Number(priceZoneValue) });
                        // let finalAmount = Number(priceZoneValue) * Number(infoCustomer.values.custentity_ptg_cantidad_frecuente_lt_cil);
                        // opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: finalAmount });    
                        let finalRate = Number(infoCustomer.values["custrecord_ptg_capacidad_art.Address"]) * Number(priceZoneValue)
                        opportunityEstacionaria.commitLine({ sublistId: 'item' });
                        let creditOk = validCredit(infoCustomer, (finalRate * 1.16));
                        if ((contactType == 4 && creditOk) || contactType == 2) {
                            let objPayment = {
                                pago: []
                            };
                            if (!!infoCustomer.values['custentity_ptg_alianza_comercial_cliente'].value || infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') {
                                let objCreditContract = {};
                                objCreditContract.metodo_txt = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? 'Contrato del cliente' : 'Crédito del cliente';
                                objCreditContract.tipo_pago = 9;
                                objCreditContract.tipo_cuenta = null;
                                objCreditContract.tipo_tarjeta = null;
                                objCreditContract.monto = (finalRate * 1.16).toFixed(6);
                                objCreditContract.folio = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? infoCustomer.value['custrecord_ptg_numero_contrato.Address'] : '';
                                objPayment.pago.push(objCreditContract);
                                opportunityEstacionaria.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            } else {
                                let objEfectivo = {};
                                objEfectivo.metodo_txt = "Efectivo";
                                objEfectivo.tipo_pago = 1;
                                objEfectivo.tipo_cuenta = null;
                                objEfectivo.tipo_tarjeta = null;
                                objEfectivo.monto = (finalRate * 1.16).toFixed(6);
                                objEfectivo.folio = '';
                                objPayment.pago.push(objEfectivo);
                                opportunityEstacionaria.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            }

                            let id = opportunityEstacionaria.save();
                            log.debug('se creo programado estacionaria', id)

                        } else {
                            log.debug('no creo', 'no creo por que el limite se paso o no es de tipo aviso')
                        }

                        //if (!!id) {
                        log.debug('actualizar fecha direccion', 'fecha');
                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: infoCustomer.values.internalid.value,
                            isDynamic: true
                        });

                        let lineAddress = customerRecord.findSublistLineWithValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            value: infoCustomer.values["internalid.Address"].value
                        });

                        log.debug('id lineAddress', lineAddress)
                        customerRecord.selectLine({
                            sublistId: 'addressbook',
                            line: lineAddress
                        });

                        let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress'
                        });

                        if (infoCustomer.values['idFieldDate']) {
                            addressSubrecord.setText({
                                fieldId: infoCustomer.values['idFieldDate'],
                                text: infoCustomer.values['dateToUpdate']
                            });
                        }

                        customerRecord.commitLine({
                            sublistId: "addressbook"
                        });
                        let idUpdateDate = customerRecord.save();
                        log.debug('se actualizo la fecha de la direcion', idUpdateDate)

                        // }
                    }
                }

            }
            else if ((contactType == 4 || contactType == 2) && Number(typeService) == 4) {
                //Mismo proceso que cilindro pero ahora con estacionario y la diferencia de momento es que no tiene configurado una capacidad por el tipo de articulo
                //Y en este caso se utiliza el campo de segundo articulo frecuente
                if (!!infoCustomer.values['custrecord_ptg_articulo_frecuente2.Address']) {
                    let priceZoneValue = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getPriceZone(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let territory = (!!infoCustomer.values['custrecord_ptg_colonia_ruta.Address']) ? getTerritory(infoCustomer.values['custrecord_ptg_colonia_ruta.Address'].value) : 0;
                    let opportunityEstacionaria = record.create({
                        type: record.Type.OPPORTUNITY,
                        isDynamic: true
                    });

                    opportunityEstacionaria.setValue('customform', 265);
                    opportunityEstacionaria.setValue('entity', infoCustomer.values.internalid.value);
                    opportunityEstacionaria.setValue('custbody_ptg_estado_pedido', (contactType == 4) ? 1 : 6);
                    if (contactType == 2) {
                        opportunityEstacionaria.setValue('custbody_ptg_estado_aviso_llamadas', 3);
                    }
                    //opportunityEstacionaria.setValue('probability', 75);
                    opportunityEstacionaria.setValue('custbody_ptg_tipo_servicio', 2);
                    opportunityEstacionaria.setValue('custbody_ptg_precio_articulo_zona', priceZoneValue);
                    log.debug('address id estacionario', infoCustomer.values['addressinternalid.Address'])
                    opportunityEstacionaria.setValue('custbody_ptg_id_direccion_envio', infoCustomer.values['addressinternalid.Address']);
                    opportunityEstacionaria.setText('custbody_ptg_entre_las', infoCustomer.values['custrecord_ptg_entre_las.Address']);
                    opportunityEstacionaria.setText('custbody_ptg_y_las', infoCustomer.values['custrecord_ptg_y_las.Address']);
                    opportunityEstacionaria.setText('custbody_ptg_y_las', infoCustomer.values['custrecord_ptg_y_las.Address']);
                    opportunityEstacionaria.setValue('custbody_ptg_zonadeprecioop_', territory);
                    opportunityEstacionaria.setValue('custbody_ptg_planta_relacionada', infoCustomer.values['custentity_ptg_plantarelacionada_'].value);
                    if (infoCustomer.values.isMoorning) {
                        opportunityEstacionaria.setValue('custbody_ptg_ruta_asignada', infoCustomer.values['custrecord_ptg_ruta_asignada_3.Address'].text);
                        opportunityEstacionaria.setValue('custbody_ptg_turno_equipo', 1);
                    } else {
                        opportunityEstacionaria.setValue('custbody_ptg_ruta_asignada', (infoCustomer.values['custrecord_ptg_ruta_asignada_4.Address'].text || infoCustomer.values['custrecord_ptg_ruta_asignada_3.Address'].text));
                        opportunityEstacionaria.setValue('custbody_ptg_turno_equipo', 2);
                    }
                    //Agregar la direccion de envio
                    opportunityEstacionaria.setValue('shipaddresslist', Number(infoCustomer.values['addressinternalid.Address']));
                    (getWeek == 0) ? getWeek = 7 : getWeek = getWeek;
                    let day = [getWeek];
                    //log.debug('day of week', day);
                    //opportunityEstacionaria.setValue('custbody_ptg_dia_semana', day);
                    //opportunityEstacionaria.setValue('subsidiary', infoCustomer.values.subsidiary.value);
                    let today = new Date();
                    //today = today.setDate(today.getDate()+1);
                    today.setDate(today.getDate() + 1);
                    //log.debug('today add', today)
                    opportunityEstacionaria.setText('expectedclosedate', infoCustomer.values['exceptDate']);

                    if (Number(priceZoneValue) > 0) {
                        //opportunityEstacionaria.insertLine({ sublistId: 'item', line: 0 });
                        opportunityEstacionaria.selectNewLine({ sublistId: 'item' });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: Number(infoCustomer.values["custrecord_ptg_articulo_frecuente2.Address"].value) });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: Number(infoCustomer.values["custrecord_ptg_capacidad_can_articulo_2.Address"]) });
                        opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: Number(priceZoneValue) });
                        // let finalAmount = Number(priceZoneValue) * Number(infoCustomer.values.custentity_ptg_cantidad_frecuente_lt_cil);
                        // opportunityEstacionaria.setCurrentSublistValue({ sublistId: 'item', fieldId: 'amount', value: finalAmount });                                        
                        opportunityEstacionaria.commitLine({ sublistId: 'item' });
                        let finalRate = Number(infoCustomer.values["custrecord_ptg_capacidad_can_articulo_2.Address"]) * Number(priceZoneValue);
                        let creditOk = validCredit(infoCustomer, (finalRate * 1.16));
                        if ((contactType == 4 && creditOk) || contactType == 2) {
                            let objPayment = {
                                pago: []
                            };
                            if (!!infoCustomer.values['custentity_ptg_alianza_comercial_cliente'].value || infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') {
                                let objCreditContract = {};
                                objCreditContract.metodo_txt = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? 'Contrato del cliente' : 'Crédito del cliente';
                                objCreditContract.tipo_pago = 9;
                                objCreditContract.tipo_cuenta = null;
                                objCreditContract.tipo_tarjeta = null;
                                objCreditContract.monto = (finalRate * 1.16).toFixed(6);
                                objCreditContract.folio = (infoCustomer.values['custrecord_ptg_direccion_contrato.Address'] == 'T') ? infoCustomer.value['custrecord_ptg_numero_contrato.Address'] : '';
                                objPayment.pago.push(objCreditContract);
                                opportunityEstacionaria.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            } else {
                                let objEfectivo = {};
                                objEfectivo.metodo_txt = "Efectivo";
                                objEfectivo.tipo_pago = 1;
                                objEfectivo.tipo_cuenta = null;
                                objEfectivo.tipo_tarjeta = null;
                                objEfectivo.monto = (finalRate * 1.16).toFixed(6);
                                objEfectivo.folio = '';
                                objPayment.pago.push(objEfectivo);
                                opportunityEstacionaria.setValue('custbody_ptg_opcion_pago_obj', JSON.stringify(objPayment));
                            }
                            let id = opportunityEstacionaria.save();
                            log.debug('se creo programado estacionaria ambos', id)

                        } else {
                            log.debug('no creo', 'no creo por que el limite se paso o no es de tipo aviso')
                        }

                        //if (!!id) {
                        log.debug('actualizar fecha direccion', 'fecha');
                        let customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: infoCustomer.values.internalid.value,
                            isDynamic: true
                        });

                        let lineAddress = customerRecord.findSublistLineWithValue({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress',
                            value: infoCustomer.values["internalid.Address"].value
                        });

                        log.debug('id lineAddress', lineAddress)
                        customerRecord.selectLine({
                            sublistId: 'addressbook',
                            line: lineAddress
                        });

                        let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                            sublistId: 'addressbook',
                            fieldId: 'addressbookaddress'
                        });

                        if (infoCustomer.values['idFieldDate']) {
                            addressSubrecord.setText({
                                fieldId: infoCustomer.values['idFieldDate'],
                                text: infoCustomer.values['dateToUpdate']
                            });
                        }

                        customerRecord.commitLine({
                            sublistId: "addressbook"
                        });
                        let idUpdateDate = customerRecord.save();
                        log.debug('se actualizo la fecha de la direcion', idUpdateDate)

                        //}
                    }
                }
            }



        }



        const validExistOp = (customer, type, address, frecuency, lessDate) => {
            log.debug('validExistOp', address)
            log.debug('test de mac')
            log.debug('type validExistOp', type)
            log.debug('frecuency', frecuency)
            log.debug('lessDate', lessDate)

            let isExiste = {
                exist: false,
                isBefore: false
            };
            let filters;
            if (type == 2) {
                filters = [
                    ["entity", "anyof", customer],
                    "AND",
                    ["custbody_ptg_id_direccion_envio", "is", address],
                    //"AND",
                    //["custbody_ptg_estado_pedido", "noneof", "5", "3"]
                    // "AND",
                    // ["date", "within", "today"],
                    // "OR",
                    // ["date", "within", "tomorrow"],
                    // "AND",
                    // ["custbody_ptg_estado_pedido", "noneof", "5", "3"],

                ]
            } else if (type == 4) {
                filters = [
                    ["entity", "anyof", customer],
                    //"AND",
                    //["custbody_ptg_estado_pedido", "noneof", "5", "3"],
                    "AND",
                    ["custbody_ptg_id_direccion_envio", "is", address],
                    // "AND",
                    // // ["date", "within", "today"],
                    // // "AND",
                    // ["custbody_ptg_estado_pedido", "noneof", "5", "3"],
                    // "AND",
                    // ["custbody_ptg_id_direccion_envio", "is", address]
                ]
            }

            if ((Number(frecuency) != 3 || Number(frecuency) != 6) && type == 4  && !!lessDate) {
                let today = new Date();
                let lessDates = new Date(today.setDate(today.getDate() - Number(lessDate)));
                let todayFilter = format.format({
                    value: new Date(),
                    type: format.Type.DATE,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY
                });

                let lessDatesFilter = format.format({
                    value: lessDates,
                    type: format.Type.DATE,
                    timezone: format.Timezone.AMERICA_MEXICO_CITY
                });

                log.debug('todayFilter', todayFilter);
                log.debug('lessDatesFilter', lessDatesFilter);

                //Cambiar el filtro del status a noneof Cancelado
                filters.push("AND", ["expectedclosedate", "within", lessDatesFilter, todayFilter], "AND",
                    ["custbody_ptg_estado_pedido", "noneof", "5"])
                isExiste.isBefore = true;
            } else {
                filters.push("AND", ["custbody_ptg_estado_pedido", "noneof", "5", "3"])
            }

            log.debug('filtros validaciónExistop', filters)

            let opportunitySearchObj = search.create({
                type: "opportunity",
                filters: filters,
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" }),
                        search.createColumn({
                            name: "expectedclosedate",
                            sort: search.Sort.DESC,
                            label: "Expected Close"
                        })
                    ]
            });
            let searchResultCount = opportunitySearchObj.runPaged().count;
            log.debug('searchResultCount exist op', searchResultCount)

            if (searchResultCount > 0) {
                isExiste.exist = true;
                opportunitySearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    isExiste.dateLastService = result.getValue({ name: "expectedclosedate", sort: search.Sort.DESC, label: "Expected Close" });
                    return false;
                });
            }
            return isExiste
        }

        const getGenericItem = (type, subsidiary) => {
            let filters;
            switch (type) {
                case '1':
                    filters = [["type", "anyof", "InvtPart"],
                        "AND",
                    ["custitem_ptg_tipodearticulo_", "anyof", "1"],
                        "AND",
                    ["subsidiary", "anyof", subsidiary]]
                    break;
                case '2':
                    filters = [["type", "anyof", "InvtPart"],
                        "AND",
                    ["custitem_ptg_tipodearticulo_", "anyof", "2"],
                        "AND",
                    ["subsidiary", "anyof", subsidiary]]
                    break;

                //Este queda pendiente del global de momento se dejara 4 , hasta que se cambie el nombre
                case '4':
                    filters = [["type", "anyof", "InvtPart"],
                        "AND",
                    ["custitem_ptg_tipodearticulo_", "anyof", "1"],
                        "AND",
                    ["subsidiary", "anyof", subsidiary]]
                    break;

            }

            //log.debug('filtros articulos genericos', filters)

            let inventoryitemSearchObj = search.create({
                type: "inventoryitem",
                filters: filters,
                columns:
                    [
                        search.createColumn({
                            name: "itemid",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({ name: "displayname", label: "Display Name" }),
                        search.createColumn({ name: "salesdescription", label: "Description" }),
                        search.createColumn({ name: "type", label: "Type" }),
                        search.createColumn({ name: "baseprice", label: "Base Price" }),
                        search.createColumn({ name: "custitem_4601_defaultwitaxcode", label: "Default WT Code" })
                    ]
            });
            let searchResultCount = inventoryitemSearchObj.runPaged().count;
            if (searchResultCount > 0) {
                let item;
                inventoryitemSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    item = result.id
                    log.debug('result', result)

                    return false;
                });

                return item;
            }

        }

        const getPriceZone = (zone) => {
            log.debug('zone', zone);
            let customrecord_ptg_coloniasrutas_SearchObj = search.create({
                type: "customrecord_ptg_coloniasrutas_",
                filters:
                    [
                        ["internalid", "anyof", zone]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_ptg_precio_",
                            join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                            label: "PTG - PRECIO"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_territorio_",
                            join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                            label: "PTG - Territorio"
                        }),
                        search.createColumn({ name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio" }),
                    ]
            });
            let searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.runPaged().count;
            if (searchResultCount > 0) {
                let price;
                customrecord_ptg_coloniasrutas_SearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    log.debug('result zone', result)
                    price = result.getValue({
                        name: "custrecord_ptg_precio_",
                        join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                        label: "PTG - PRECIO"
                    })
                    return true;
                });

                return price;
            }


        }

        const getTerritory = (zone) => {
            //log.debug('zone', zone);
            let customrecord_ptg_coloniasrutas_SearchObj = search.create({
                type: "customrecord_ptg_coloniasrutas_",
                filters:
                    [
                        ["internalid", "anyof", zone]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "custrecord_ptg_precio_",
                            join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                            label: "PTG - PRECIO"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_territorio_",
                            join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                            label: "PTG - Territorio"
                        }),
                        search.createColumn({ name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio" }),
                    ]
            });
            let searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.runPaged().count;
            if (searchResultCount > 0) {
                let territory;
                customrecord_ptg_coloniasrutas_SearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    //log.debug('result zone', result)
                    territory = result.getValue({
                        name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio"
                    })
                    return true;
                });

                return territory;
            }


        }


        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            const thereAreAnyError = (summaryContext) => {
                const inputSummary = summaryContext.inputSummary;
                const mapSummary = summaryContext.mapSummary;
                const reduceSummary = summaryContext.reduceSummary;
                //si no hay errores entonces se sale del la función y se retorna false incando que no hubo errores            if (!inputSummary.error) return false;
                //se hay errores entonces se imprimen los errores en el log para poder visualizarlos            if (inputSummary.error) log.debug("ERROR_INPPUT_STAGE", `Erro: ${inputSummary.error}`);
                handleErrorInStage('map', mapSummary);
                handleErrorInStage('reduce', reduceSummary);

                function handleErrorInStage(currentStage, summary) {
                    summary.errors.iterator().each((key, value) => {
                        log.debug(`ERROR_${currentStage}`, `Error( ${currentStage} ) with key: ${key}.Detail: ${JSON.parse(value).message}`);
                        return true;
                    });
                }
                return true;
            };

            thereAreAnyError(summaryContext)
            log.audit('Summary', [
                { title: 'Usage units consumed', details: summaryContext.usage },
                { title: 'Concurrency', details: summaryContext.concurrency },
                { title: 'Number of yields', details: summaryContext.yields }
            ]);

        }

        return { getInputData, map, reduce, summarize }

    });
