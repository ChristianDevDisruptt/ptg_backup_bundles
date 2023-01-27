/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Creacion de servicio de antojados
 */
define(['N/log', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos', 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors', 'N/record', 'N/format'], function (log, opport, error, record, format) {

    // se crea estructura donde se cargarà toda la data
    const responseData = {
        success: false,
        message: "Some errors occured",
        data: null,
        apiErrorGet: [],
        apiErrorPost: []
    }



    // funcion que crea oportunidades  
    function postOpportunity(request) {
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

                opportunityRecord.setValue({
                    fieldId: 'customform',
                    value: '124'
                }); // Estados de oportunidad cancelado. reprogramado o modificado
                opportunityRecord.setValue({
                    fieldId: 'entitystatus',
                    value: opportunity.status
                }); // Estados de oportunidad cancelado. reprogramado o modificado
                opportunityRecord.setValue({
                    fieldId: 'entity',
                    value: opportunity.customer
                }); // id del cliente
                opportunityRecord.setValue({
                    fieldId: 'subsidiary',
                    value: opportunity.subsiduary
                }); // Estados de oportunidad cancelado. reprogramado o modificado
                opportunityRecord.setValue({
                    fieldId: 'probability',
                    value: '100'
                });
                var newDate = new Date();
                var date = opport.formatDate(newDate);

                var dateCreate = format.parse({
                    value: date,
                    type: format.Type.DATE
                })

                opportunityRecord.setValue({
                    fieldId: 'trandate',
                    value: dateCreate
                }); // fecha de creación de la oportunidad

                //seteo de tipo de servicio
                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_type_service',
                    value: opportunity.tipo
                });

                opportunityRecord.setValue({
                    fieldId: 'salesrep',
                    value: opportunity.operario
                }); // representante de venta o empleado

                var time = format.parse({
                    value: opport.horaMilitar(),
                    type: format.Type.TIMEOFDAY
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_hour',
                    value: time
                }); // hora de la opotunidad
                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_hora_cierre',
                    value: time
                }); // hora de la opotunidad
                opportunityRecord.setValue({
                    fieldId: 'custbody_route',
                    value: opportunity.route
                }); // Ruta del servicio

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_origen_servicio',
                    value: opportunity.origen
                });// origen del servicio

                var closeDate = format.parse({
                    value: date,
                    type: format.Type.DATE
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_zonadeprecioop_',
                    value: opportunity.zona_precio
                });
                //solo si viene el nuemero de viaje
                if (opportunity.numero_viaje) {
                    opportunityRecord.setValue({
                        fieldId: 'custbody_ptg_numero_viaje',
                        value: opportunity.numero_viaje
                    });
                }

                //todo validar que estos campos vengan en la creacion de la oportunidad

                //campo entre las
                opportunityRecord.setText({
                    fieldId: "custbody_ptg_entre_las",
                    text: opportunity.custbody_ptg_entre_las
                });

                //campo y las
                opportunityRecord.setText({
                    fieldId: "custbody_ptg_y_las",
                    text: opportunity.custbody_ptg_y_las
                });
                //validar
                opportunityRecord.setValue({
                    fieldId: 'expectedclosedate',
                    value: closeDate
                }); // fecha de cierre del servicio
                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_turn',
                    value: opportunity.turn
                }); // turno de la oportunidad
                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_opcion_pago',
                    value: opportunity.paymentMethod
                }); // forma de pago
                var tipoArticulo = opportunity.tipo;
                log.debug({
                    title: 'opportunity.items',
                    details: opportunity.items
                });
                log.debug({
                    title: 'opportunityRecord',
                    details: opportunityRecord
                });


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
            log.debug({
                title: "Error",
                details: err
            })
        }
        // regresamos el response creado
        return responseData

    }

    function putOpportunity(request) {
        let opportunityListUpdate = [];
        try {
            request.opportunitiesUpdate.forEach((opportunityUpdate) => {
                log.audit('opportunityUpdate', opportunityUpdate);
                let idOpportuniti = opportunityUpdate.id;
                let opportunityRecord = record.load({
                    type: record.Type.OPPORTUNITY,
                    id: idOpportuniti,
                    isDynamic: true
                });

                for (var field in opportunityUpdate.bodyFields) {

                    if (field == 'custbody_ptg_entre_las') {
                        log.audit('ebtro', 'fecha1');
                        opportunityRecord.setText({
                            fieldId: "custbody_ptg_entre_las",
                            text: opportunityUpdate.bodyFields['custbody_ptg_entre_las']
                        });
                    } else if (field == 'custbody_ptg_y_las') {
                        log.audit('ebtro', 'fecha2');
                        opportunityRecord.setText({
                            fieldId: "custbody_ptg_y_las",
                            text: opportunityUpdate.bodyFields['custbody_ptg_y_las']
                        });
                    } else if (field == 'expectedclosedate') {
                        opportunityRecord.setText({
                            fieldId: "expectedclosedate",
                            text: opportunityUpdate.bodyFields['expectedclosedate']
                        });
                    } else if (field == 'custbody_ptg_fecha_notificacion') {
                        opportunityRecord.setText({
                            fieldId: "custbody_ptg_fecha_notificacion",
                            text: opportunityUpdate.bodyFields['custbody_ptg_fecha_notificacion']
                        });
                    } else if (field == 'custbody_ptg_hora_notificacion') {
                        opportunityRecord.setText({
                            fieldId: "custbody_ptg_hora_notificacion",
                            text: opportunityUpdate.bodyFields['custbody_ptg_hora_notificacion']
                        });
                    } else {
                        log.audit('ebtro', 'todos los campos');
                        opportunityRecord.setValue({
                            fieldId: field,
                            value: opportunityUpdate.bodyFields[field]
                        });
                    }
                }

                let lineas = opportunityUpdate.lines.length;
                log.audit('lineas', lineas);
                if (opportunityUpdate.lines.length > 0) {
                    log.audit('si hay lineas', 'ok');
                    opportunityUpdate.lines.forEach((item, index) => {
                        log.audit('index', index)

                        if (item.nuevo == true) {
                            opportunityRecord.selectNewLine({
                                //selecciona una nueva linea para cada iteración
                                sublistId: "item",
                            });
                            //var precioZona = item.zoneprice;
                            //var capacidad = item.capacity;
                            //var total = precioZona * capacidad;

                            opportunityRecord.setCurrentSublistValue({
                                // Articulo a vender
                                sublistId: "item",
                                fieldId: "item",
                                value: item.article,
                            });

                            if (item.isDiscount == false) {
                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "quantity",
                                    value: item.quantity,
                                });
                            }

                            opportunityRecord.setCurrentSublistValue({
                                // importe del producto de la oportunidad
                                sublistId: "item",
                                fieldId: "rate",
                                value: item.rate,
                            });

                            let idArticle = opportunityRecord.commitLine({
                                sublistId: "item",
                            });

                            log.debug({
                                title: "idArticle",
                                details: idArticle,
                            });
                        } else {

                            if (item.isDiscount == false) {
                                opportunityRecord.selectLine({
                                    sublistId: 'item',
                                    line: index
                                });
                            } else {
                                let lineItem = opportunityRecord.findSublistLineWithValue({
                                    sublistId: 'item',
                                    fieldId: 'item',
                                    value: item.article
                                });

                                opportunityRecord.selectLine({
                                    sublistId: 'item',
                                    line: lineItem
                                });
                            }

                            if (item.isDiscount == false) {
                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "quantity",
                                    value: item.quantity,
                                });
                            }

                            if (item.isDiscount == false) {
                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "amount",
                                    value: item.amount,
                                });
                            } else {
                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "rate",
                                    value: item.rate,
                                });
                            }


                            opportunityRecord.commitLine({
                                sublistId: "item",
                            });
                            /*
                                opportunityRecord.setCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'quantity',
                                    line: index,
                                    value: item.quantity
                                  }); */

                        }
                    });
                }

                //Funciona para poder editar, crear o eliminar lineas desde monitor
                //let lineasMonitor = opportunityUpdate.linesMonitor.length;
                //log.audit('lineasMonitor', lineasMonitor);
                if (opportunityUpdate.hasOwnProperty('linesMonitor') && opportunityUpdate.linesMonitor.length > 0) {
                    log.audit('si hay lineas monitor', 'ok');
                    opportunityUpdate.linesMonitor.forEach((item, index) => {
                        log.audit('index', index)

                        if (item.nuevo == true) {
                            opportunityRecord.selectNewLine({
                                //selecciona una nueva linea para cada iteración
                                sublistId: "item",
                            });
                            //var precioZona = item.zoneprice;
                            //var capacidad = item.capacity;
                            //var total = precioZona * capacidad;

                            opportunityRecord.setCurrentSublistValue({
                                // Articulo a vender
                                sublistId: "item",
                                fieldId: "item",
                                value: item.article,
                            });

                            opportunityRecord.setCurrentSublistValue({
                                // cantidad del producto de la oportunidad
                                sublistId: "item",
                                fieldId: "quantity",
                                value: item.quantity,
                            });

                            opportunityRecord.setCurrentSublistValue({
                                // importe del producto de la oportunidad
                                sublistId: "item",
                                fieldId: "rate",
                                value: item.rate,
                            });

                            let idArticleMonitor = opportunityRecord.commitLine({
                                sublistId: "item",
                            });

                            log.debug({
                                title: "idArticle Monitor",
                                details: idArticleMonitor,
                            });
                        } else if (item.nuevo == false) {
                            if (item.delete == true) {
                                let lineItem = opportunityRecord.findSublistLineWithValue({
                                    sublistId: 'item',
                                    fieldId: 'item',
                                    value: item.article
                                });

                                opportunityRecord.removeLine({
                                    sublistId: 'item',
                                    line: lineItem
                                });
                            } else if (item.update == true) {

                                let lineItem = opportunityRecord.findSublistLineWithValue({
                                    sublistId: 'item',
                                    fieldId: 'item',
                                    value: item.article
                                });

                                opportunityRecord.selectLine({
                                    sublistId: 'item',
                                    line: lineItem
                                });


                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "quantity",
                                    value: item.quantity,
                                });


                                opportunityRecord.setCurrentSublistValue({
                                    // cantidad del producto de la oportunidad
                                    sublistId: "item",
                                    fieldId: "rate",
                                    value: item.rate,
                                });

                                opportunityRecord.commitLine({
                                    sublistId: "item",
                                });

                            }

                        }
                    });
                }
                /*
                for(var i =0; i < lineas; i++){
                    opportunityRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i,
                        value: context.request[i].lines[j].quantity
                      });
                }
                */

                let idOpportSave = opportunityRecord.save();
                log.audit('idOpportSave', idOpportSave);
                opportunityListUpdate.push(idOpportSave)
                if (idOpportSave) {
                    responseData.success = true;
                    responseData.message = "Opportunity update successfully";

                    //Trycat por si las dudas
                    try {
                        if (!!opportunityUpdate.case) {
                            log.debug('va actualizar el caso respuesto',)
                            record.submitFields({
                                type: record.Type.SUPPORT_CASE,
                                id: opportunityUpdate.case,
                                values: {
                                    'custevent_ptg_repuse_cilindro_danado': true,
                                    'status': 5
                                }
                            });
                        }

                    } catch (error) {
                        log.debug('error al actualizar el caso', error)
                        responseData.success = false;
                        responseData.message = error;

                    }
                    responseData.data = opportunityListUpdate
                }

            });

        } catch (error) {
            log.audit('error', error)
        }
        return responseData
    }



    return {
        post: postOpportunity,
        put: putOpportunity
    }

});