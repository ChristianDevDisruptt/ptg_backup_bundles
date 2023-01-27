/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Creacion de una busqueda guardada de oportunidades
 */
define(['N/log', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos', 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors', 'N/record', 'N/format', 'N/search'], function (log, opport, error, record, format, search) {

    // se crea estructura donde se cargarà toda la data
    const responseData = {
        success: false,
        message: "",
        data: null,
        apiErrorGet: [],
        apiErrorPost: []
    }
    // funcion que crea oportunidades  
    function postOpportCallcenter(request) {
        log.debug({
            title: "Request",
            details: request
        });
        // se valida que no venga ningun dato por request vacio
        try {
            if (request === null || request === undefined || request.length === 0) {
                responseData.apiErrorPost.push(error.errorRequestEmpty())
            }
        } catch (error) {
            return responseData
        }
        // se declara un array vacio donde se cargará la data de oportunidades
        let opportunityList = [];
        log.audit('request', request.opportunities);
        try {
            // se recorreo la oportunidad ingresada por request para setear información
            request.opportunities.forEach((opportunity) => {
                let opportunityRecord = record.create({
                    type: record.Type.OPPORTUNITY,
                    isDynamic: true
                });

                opportunityRecord.setValue({ // Estados de oportunidad cancelado. reprogramado o modificado
                    fieldId: 'customform',
                    //value: '305' sbx
                    value : '265'
                });

                // opportunityRecord.setValue({ // Estados de oportunidad cancelado. reprogramado o modificado
                //     fieldId: 'entitystatus',
                //     value: opportunity.status
                // });

                var newDate = new Date();
                var date = opport.formatDate(newDate);

                var dateCreate = format.parse({ value: date, type: format.Type.DATE })

                opportunityRecord.setValue({ // fecha de creación de la oportunidad
                    fieldId: 'trandate',
                    value: dateCreate
                });

                // opportunityRecord.setValue({
                //     fieldId: 'custbody_ptg_numero_viaje',
                //     value: opportunity.numero_viaje
                // });

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_zonadeprecioop_',
                    value: opportunity.zona_precio
                });

                opportunityRecord.setValue({
                    fieldId: 'probability',
                    value: '75'
                });

                opportunityRecord.setValue({ // id del cliente
                    fieldId: 'entity',
                    value: opportunity.customer
                });

                opportunityRecord.setValue({ // representante de venta o empleado
                    fieldId: 'salesrep',
                    value: opportunity.operario
                });

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_opcion_pago_obj',
                    value: JSON.stringify(opportunity.pago)
                });

                //var time = format.parse({ value: opport.horaMilitar(), type: format.Type.TIMEOFDAY })

                opportunityRecord.setText({ // hora de la opotunidad
                    fieldId: 'custbody_ptg_hora_trans',
                    text: opportunity.time
                });

                // opportunityRecord.setValue({ // Ruta del servicio
                //     fieldId : 'custbody_route',
                //     value : opportunity.route
                // });

                // var closeDate = format.parse({ value: date, type: format.Type.DATE })

                // opportunityRecord.setValue({ // fecha de cierre del servicio
                //     fieldId : 'expectedclosedate',
                //     value : closeDate
                // });

                //Prueba para setear la fecha
                opportunityRecord.setText({ // fecha de cierre del servicio
                    fieldId: 'expectedclosedate',
                    text: opportunity.closeDate
                });

                opportunityRecord.setValue({ // turno de la oportunidad
                    fieldId: 'custbody_ptg_turn',
                    value: opportunity.turn
                });

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_origen_servicio',
                    value: opportunity.origen
                })

                opportunityRecord.setValue({
                    fieldId: 'memo',
                    value: opportunity.comentary
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_tipo_servicio',
                    value: opportunity.typeservice
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_estado_pedido',
                    value: opportunity.statusOpp
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_precio_articulo_zona',
                    value: opportunity.items[0].zoneprice
                })

                // opportunityRecord.setValue({
                //     fieldId: 'custbody_ptg_dia_semana',
                //     value: opportunity.weekDay
                // });
                //validaar esta parte
                if (!!opportunity.rangeHour1) {
                    var rangeHour1 = format.parse({ value: opportunity.rangeHour1, type: format.Type.TIMEOFDAY })

                    opportunityRecord.setValue({
                        fieldId: 'custbody_ptg_entre_las',
                        value: rangeHour1
                    });
                }

				if (!!opportunity.rangeHour2) {
                    var rangeHour2 = format.parse({ value: opportunity.rangeHour2, type: format.Type.TIMEOFDAY })

                    opportunityRecord.setValue({
                        fieldId: 'custbody_ptg_y_las',
                        value: rangeHour2
                    });
                }

                opportunityRecord.setValue({
                    fieldId: 'shipaddresslist',
                    value: opportunity.idAddressShip
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_planta_relacionada',
                    value: opportunity.plantaRelated
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_id_direccion_envio',
                    value: opportunity.idAddress
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_etiqueta_direccion_envio',
                    value: opportunity.labelAddress
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_cliente_solicita_factura',
                    value: opportunity.requiereFactura
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_razon_social_para_facturar',
                    value: opportunity.razonSocialFactura
                })

                // opportunityRecord.setValue({
                //     fieldId: 'custbody_ptg_reference',
                //     value: opportunity.reference
                // });

                var zonaPrecio = opportunity.zona_precio;
                log.audit('zonaPrecio', zonaPrecio);

                if (opportunity.cases.length > 0) {
                    opportunityRecord.setValue({
                        fieldId: 'custbody_ptg_nota_credito_relacionada',
                        value: opportunity.cases
                    })
                }
                
                let assginRoute = validRouteandTravel(opportunityRecord, opportunity);

                if(!assginRoute.isSuccess){
                    responseData.message = assginRoute.message
                    return responseData;
                }

                log.debug({
                    title: 'opportunity.items',
                    details: opportunity.items
                });

                log.debug({
                    title: 'opportunityRecord',
                    details: opportunityRecord
                });
                var tipoArticulo = opportunity.tipo;
                log.audit('tipoArticulo', tipoArticulo)
                // se ejecuta función para crear los articulos de venta
                // para mayor informacion ver el modulo : ptg_module_oportunidades.js
                opport.createItem(opportunityRecord, opportunity.items, tipoArticulo)
                // se guarda el registro en la base de datos
                let opportunityId = opportunityRecord.save();
                // pusheamos el id de oportunidad creada
                opportunityList.push(opportunityId)

                // si el id de oportunidad existe se modifica mensaje de successfully
                if (opportunityId) {
                    responseData.success = true;
                    responseData.message = "Opportunity created successfully";

                    try {
                        let methodPayment = opportunity.pago
                        if (methodPayment.pago[0].tipo_pago == 10 || methodPayment.pago[0].tipo_pago == "10") {
                            record.submitFields({
                                type: record.Type.SUPPORT_CASE,
                                id: opportunity.case,
                                values: {
                                    'custevent_ptg_reposicion_camino': true,
                                }
                            });

                            record.attach({
                                record: {
                                    type: record.Type.SUPPORT_CASE,
                                    id: opportunity.case
                                },
                                to: {
                                    type: 'transaction',
                                    id: opportunityId
                                }
                            });

                        }

                    } catch (error) {
                        log.debug('error vincular caso', error)
                        responseData.success = false;
                        responseData.message = error;
                    }
                    responseData.data = opportunityList
                }

                log.debug({
                    title: 'opportunityList',
                    details: opportunityList
                })
            })
            // se captura el error 
        } catch (err) {
            responseData.apiErrorPost.push(error.errorNotParameter(err.message)) //errorNotParameter
            log.audit({
                title: "Error",
                details: err
            })
        }
        // regresamos el response creado
        return responseData

    }

    //Validamos la hora y fecha para ponerle un numero de viaje en automatico si existe el dia de hoy, para mañana 
    //Solo se pone la ruta y el turno
    const validRouteandTravel = (opportunityRecord, opportunity) => {
        let result = {
            isSuccess: false
        };
        const turn = [1, 2];
        //Validamos que la fecha de exceptedclose sea la de hoy         
        let dateOpp = format.parse({
            value: opportunity.closeDate,
            type: format.Type.DATE,
            timezone: format.Timezone.AMERICA_MEXICO_CITY
        });

        //Obtemos la fecha de hoy
        let date = new Date();
        let nowDate = format.parse({
            value: date,
            type: format.Type.DATE,
            timezone: format.Timezone.AMERICA_MEXICO_CITY
        });

        let hourConvert = getTimeInt(opportunity.rangeHour1);
        if(opportunity.typeservice  == opportunity.typeserviceAddr) {
            log.audit("dateOpp", dateOpp.getDate());
            log.audit("nowDate", nowDate.getDate());
            if (dateOpp.getDate() == nowDate.getDate()) {
                //Validamos en que turno va a ser el servicio y que es cilindro o estacionario
                if (opportunity.typeservice == 1) {
                    //Validamos el turno dependiendo la hora y que tenga datos si no retornar que fallo :v por que no tiene ruta               
                    let routeMoornig = (!!opportunity.routes[0].id) ? Number(opportunity.routes[0].id) : 0;
                    let routeEvenig = (!!opportunity.routes[1].id) ? Number(opportunity.routes[1].id) : 0;
                    if (hourConvert < 14 && routeMoornig > 0) {
                        let idTravel = getTravel(routeMoornig);
                        if (!!idTravel) {
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_numero_viaje',
                                value: idTravel
                            });
                            result.isSuccess = true;
                        }else{
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_ruta_asignada',
                                value: opportunity.routes[0].name
                            });
        
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_turno_equipo',
                                value: turn[0]
                            });
                            result.isSuccess = true;
                            //result.message = "No hay un viaje para la ruta seleccionada";
                        }
                    } else if (hourConvert >= 14) {
                        if(routeEvenig > 0) {
                            let idTravel = getTravel(routeEvenig);
                            if (!!idTravel) {
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_numero_viaje',
                                    value: idTravel
                                });
                                result.isSuccess = true;
                            }else{
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_ruta_asignada',
                                    value: opportunity.routes[1].name
                                });
            
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_turno_equipo',
                                    value: turn[1]
                                });
                                result.isSuccess = true;
                                //result.message = "No hay un viaje para la ruta seleccionada";
                            }
                        } else {
                            result.isSuccess = true;
                        }
                    } else {
                        result.message = "Favor de configurar una ruta para está dirección, ya sea matutina o vespertina.";
                    }
    
                } else if (opportunity.typeservice == 2 || opportunity.typeservice == 6) {
                    //Validamos el turno dependiendo la hora y que tenga datos si no retornar que fallo :v por que no tiene ruta               
                    let routeMoornig = (!!opportunity.routes[0].id) ? Number(opportunity.routes[0].id) : 0;                
                    let routeEvenig = (!!opportunity.routes[1].id) ? Number(opportunity.routes[1].id) : 0;
                    log.debug("hourConvert", hourConvert);
                    log.debug("routeMoornig", routeMoornig);
                    log.debug("routeEvenig", routeEvenig);
                    if (hourConvert < 14 && routeMoornig > 0) {
                        let idTravel = getTravel(routeMoornig);
                        if (!!idTravel) {
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_numero_viaje',
                                value: idTravel
                            });
                            result.isSuccess = true;
                        } else{
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_ruta_asignada',
                                value: opportunity.routes[0].name
                            });
        
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_turno_equipo',
                                value: turn[0]
                            });
                            result.isSuccess = true;
                            //result.message = "No hay un viaje para la ruta seleccionada";
                        }
                    } else if (hourConvert >= 14) {
                        if(routeEvenig > 0) {
                            let idTravel = getTravel(routeEvenig);
                            if (!!idTravel) {
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_numero_viaje',
                                    value: idTravel
                                });
                                result.isSuccess = true;
                            }else{
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_ruta_asignada',
                                    value: opportunity.routes[1].name
                                });
            
                                opportunityRecord.setValue({
                                    fieldId: 'custbody_ptg_turno_equipo',
                                    value: turn[1]
                                });
                                result.isSuccess = true;
                                //result.message = "No hay un viaje para la ruta seleccionada";
                            }
                        } else {
                            result.isSuccess = true;
                        }
                    } else {
                        result.message = "Favor de configurar una ruta para está dirección, ya sea matutina o vespertina.";
                    }
    
                }
            } else if (dateOpp.getDate() > nowDate.getDate()) {
                //Validamos en que turno va a ser el servicio y que es cilindro o estacionario
                if (opportunity.typeservice == 1) {
                    //Validamos el turno dependiendo la hora y que tenga datos si no retornar que fallo :v por que no tiene ruta               
                    let routeMoornig = (!!opportunity.routes[0].name) ? opportunity.routes[0].name : "";
                    let routeEvenig = (!!opportunity.routes[1].name) ? opportunity.routes[1].name : "";
                    if (hourConvert < 14 && routeMoornig) {
                        opportunityRecord.setValue({
                            fieldId: 'custbody_ptg_ruta_asignada',
                            value: routeMoornig
                        });
    
                        opportunityRecord.setValue({
                            fieldId: 'custbody_ptg_turno_equipo',
                            value: turn[0]
                        });
                        result.isSuccess = true;
                    } else if (hourConvert >= 14) {
                        if(routeEvenig) {
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_ruta_asignada',
                                value: routeEvenig
                            });
        
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_turno_equipo',
                                value: turn[1]
                            });
                            result.isSuccess = true;
                        } else {
                            result.isSuccess = true;
                        }
                    } else {
                        result.message = "Favor de configurar una ruta para está dirección, ya sea matutina o vespertina.";
                    }
    
                } else if (opportunity.typeservice == 2 || opportunity.typeservice == 6) {
                    //Validamos el turno dependiendo la hora y que tenga datos si no retornar que fallo :v por que no tiene ruta               
                    let routeMoornig = (!!opportunity.routes[0].name) ? opportunity.routes[0].name : "";
                    let routeEvenig = (!!opportunity.routes[1].name) ? opportunity.routes[1].name : "";
                    if (hourConvert < 14 && routeMoornig) {
                        opportunityRecord.setValue({
                            fieldId: 'custbody_ptg_ruta_asignada',
                            value: routeMoornig
                        });
    
                        opportunityRecord.setValue({
                            fieldId: 'custbody_ptg_turno_equipo',
                            value: turn[0]
                        });
                        result.isSuccess = true;
                    } else if (hourConvert >= 14) {
                        if(routeEvenig) {
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_ruta_asignada',
                                value: routeEvenig
                            });
        
                            opportunityRecord.setValue({
                                fieldId: 'custbody_ptg_turno_equipo',
                                value: turn[1]
                            });
                            result.isSuccess = true;
                        } else {
                            result.isSuccess = true;
                        }
                    } else {
                        result.message = "Favor de configurar una ruta para está dirección, ya sea matutina o vespertina.";
                    }
    
                }
            }
        } else {
            result.isSuccess = true;
        }

        return result;
    }

    const getTimeInt = (time) => {
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

    const getTravel = (route) => {
        let customrecord_ptg_tabladeviaje_enc2_SearchObj = search.create({
            type: "customrecord_ptg_tabladeviaje_enc2_",
            filters:
                [
                    ["custrecord_ptg_fecha_viaje_en_curso", "within", "today"],
                    "AND",
                    ["custrecord_ptg_estatus_tabladeviajes_", "anyof", "3"],
                    "AND",
                    ["custrecord_ptg_ruta", "anyof", route]
                ],
            columns:
                [
                    search.createColumn({ name: "internalid", label: "Internal ID" }),
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                    })
                ]
        });
        let searchResultCount = customrecord_ptg_tabladeviaje_enc2_SearchObj.runPaged().count;
        log.debug("customrecord_ptg_tabladeviaje_enc2_SearchObj result count", searchResultCount);
        let routeId;
        customrecord_ptg_tabladeviaje_enc2_SearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            routeId = result.getValue({ name: "internalid", label: "Internal ID" });
            //return true;
        });
        return routeId;
    }

    return {
        post: postOpportCallcenter,
    }
});
