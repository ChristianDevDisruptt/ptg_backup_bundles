/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record", "N/search", "N/format"], function (record, search, format) {

    const responseData = {
        success: false,
        message: "Some errors occured",
        data: null,
        apiErrorPost: []
    }

    function _post(request) {

        let customersList = [];
        log.audit({
            title: "Request create",
            details: request
        });
        try {
            request.casos.forEach((fugas) => {
                let fugaRecord = record.create({
                    type: 'supportcase',
                    isDynamic: true
                });

                // fugaRecord.setValue({

                // });

                fugaRecord.setValue({
                    fieldId: 'title',//listo
                    value: fugas.title
                });

                //profile
                // fugaRecord.setValue({
                //     fieldId: 'profile',//listo
                //     value: 1
                // });

                fugaRecord.setValue({
                    fieldId: 'company',//listo
                    value: fugas.company
                });

                fugaRecord.setValue({
                    fieldId: 'subsidiary',//listo
                    value: fugas.subsidiary
                });
                /*
                fugaRecord.setValue({
                    fieldId: 'startdate',
                    value: fugas.startdate
                });
                
                fugaRecord.setText({
                    fieldId: 'starttime',
                    value: fugas.starttime
                });
                */

                fugaRecord.setValue({
                    fieldId: 'item',//item
                    value: fugas.item
                });

                if(fugas.email) {
                  log.debug("entre", "jeje")
                    fugaRecord.setValue({
                        fieldId: 'email',//listo
                        value: fugas.email
                    });
                }               

                fugaRecord.setValue({
                    fieldId: 'category',//listo
                    value: fugas.category
                });

                fugaRecord.setValue({
                    fieldId: 'phone',//listo
                    value: fugas.phone
                });

                fugaRecord.setValue({
                    fieldId: 'status',//listo
                    value: fugas.status
                });

                fugaRecord.setValue({
                    fieldId: 'priority',//listo
                    value: fugas.priority
                });

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_conceptos_casos',//listo
                    value: fugas.concepto
                });

                fugaRecord.setValue({
                    fieldId: 'quicknote',//listo
                    value: fugas.quicknote
                });
                fugaRecord.setText({
                    fieldId: 'custevent_ptg_fecha_visita',//listo
                    text: fugas.custevent_ptg_fecha_visita
                });

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_horario_preferido',//listo
                    value: fugas.custevent_ptg_horario_preferido
                });
                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_ano_producto',//listo
                    value: fugas.anio
                });

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_relacionar_caso_existente',//listo
                    value: fugas.custevent_ptg_relacionar_caso_existente
                });
                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_direccion_para_casos',//listo
                    value: fugas.custevent_ptg_direccion_para_casos
                });
                fugaRecord.setValue({
                    fieldId: 'incomingmessage',//listo
                    value: fugas.description
                });

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_precio_venta',
                    value: fugas.priceZone
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_nombre_calle',
                    value: fugas.nameStreet
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_numero_exterior',
                    value: fugas.nExterior
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_numero_interior',
                    value: fugas.nInterior
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_colonia',
                    value: fugas.colonia
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_codigo_postal',
                    value: fugas.cp
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_municipio',
                    value: fugas.municipio
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_estado',
                    value: fugas.state
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_etiqueta',
                    value: fugas.label
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_agente_call_center',
                    value: fugas.agenteCallCenter
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_id_direccion',
                    value: fugas.idAddress
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_entre_calle',
                    value: fugas.entreCalle
                })

                fugaRecord.setValue({
                    fieldId: 'custevent_ptg_y_calle',
                    value: fugas.entreYCalle
                })

                var idFugaCreate = fugaRecord.save();
                log.audit('caso creado con id', idFugaCreate);
                customersList.push(idFugaCreate)
                if (idFugaCreate) {
                    responseData.success = true;
                    responseData.message = "Supportcase created successfully";
                    responseData.data = customersList
                    if (!!fugas.id_oportuniti) {
                        var relacionarRegistro = record.attach({
                            record: {
                                type: record.Type.SUPPORT_CASE,
                                id: idFugaCreate
                            },
                            to: {
                                type: 'transaction',
                                id: fugas.id_oportuniti
                            }
                        });

                        log.audit('registro relacionado', relacionarRegistro);
                    }

                }
            });
        } catch (error) {
            log.audit('error', error);
        }

        return responseData
    }

    function _put(request) {
        let response = {
            success: false
        };
        try {
            log.audit('request edit', request);

            request.casosUpdate.forEach((fugas) => {
                if (!fugas.notAllEdit) {
                    fugas.notAllEdit = false;
                }
                let caseLoad = record.load({
                    type: 'supportcase',
                    id: fugas.id,
                    isDynamic: true
                });

                if (fugas.notAllEdit) {
                    if (!!fugas.status) {
                        caseLoad.setValue({
                            fieldId: 'status',
                            value: fugas.status
                        });
                    }
                    if (!!fugas.secondCall) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_segunda_llamada_casos',
                            value: fugas.secondCall
                        });
                    }

                    if (fugas.custevent_ptg_ultima_modificacion) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_ultima_modificacion',
                            value: fugas.custevent_ptg_ultima_modificacion
                        });
                    }
                } else {
                    if (!!fugas.assigned) {
                        caseLoad.setValue({
                            fieldId: 'assigned',
                            value: fugas.assigned
                        });
                    } else {
                        caseLoad.setText({
                            fieldId: 'assigned',
                            text: ""
                        });
                    }


                    if (!!fugas.status) {
                        caseLoad.setValue({
                            fieldId: 'status',
                            value: fugas.status
                        });
                    }

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_conceptos_casos',
                        value: fugas.custevent_ptg_conceptos_casos
                    });

                    caseLoad.setText({
                        fieldId: 'custevent_ptg_fecha_visita',
                        text: fugas.custevent_ptg_fecha_visita
                    });

                    caseLoad.setText({
                        fieldId: 'custevent_ptg_horario_preferido',
                        text: fugas.custevent_ptg_horario_preferido
                    });

                    caseLoad.setValue({
                        fieldId: 'priority',
                        value: fugas.priority
                    });

                    if (!!fugas.item) {
                        caseLoad.setValue({
                            fieldId: 'item',
                            value: fugas.item
                        });
                    };

                    if (!!fugas.yearProduct) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_ano_producto',
                            value: fugas.yearProduct
                        });
                    } else {
                        caseLoad.setText({
                            fieldId: 'custevent_ptg_ano_producto',
                            text: ""
                        });
                    }

                    if (!!fugas.capEstacionario) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_capacidad_tanq_est',
                            value: fugas.capEstacionario
                        });
                    } else {
                        caseLoad.setText({
                            fieldId: 'custevent_ptg_capacidad_tanq_est',
                            text: ""
                        });
                    }

                    if (!!fugas.case_id) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_relacionar_caso_existente',
                            value: fugas.case_id
                        });
                    } else if (fugas.case_id == 0) {
                        caseLoad.setText({
                            fieldId: 'custevent_ptg_relacionar_caso_existente',
                            text: ""
                        });
                    }

                    if (!!fugas.reprogramService) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_motivo_reprogramacion',
                            value: fugas.reprogramService
                        });
                    }

                    if (fugas.isReturn && !!fugas.isReturn) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_recogi_cilindro_danado',
                            value: true
                        });
                    }

                    if (fugas.isReplacement && !!fugas.isReplacement) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_repuse_cilindro_danado',
                            value: true
                        });
                    }

                    if (fugas.isTrasiego && !!fugas.isTrasiego) {
                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_realice_trasiego',
                            value: true
                        });

                        caseLoad.setValue({
                            fieldId: 'custevent_ptg_cantidad_recolectada_tras',
                            value: fugas.quantityTrasiego
                        });
                    }

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_prueba_hermetica',
                        value: fugas.testHermetica
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_problema_localizado_en',
                        value: fugas.problemTarget
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_solucion',
                        value: fugas.solution
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_cantidad_evidenciada',
                        value: fugas.quantityEvidence
                    });
                  
                  	caseLoad.setValue({
                        fieldId: 'custevent_ptg_motivo_reemplazo_cil',
                        value: fugas.custevent_ptg_motivo_reemplazo_cil
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_prueba_hermet_realizada',
                        value: fugas.custevent_ptg_prueba_hermet_realizada ? fugas.custevent_ptg_prueba_hermet_realizada: false
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_motivo_reprogramacion',
                        value: fugas.custevent_ptg_motivo_reprogramacion ? fugas.custevent_ptg_motivo_reprogramacion: ''
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_hay_fuga',
                        value: fugas.custevent_ptg_hay_fuga ? fugas.custevent_ptg_hay_fuga : false
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_se_realizo_cob_adicional',
                        value: fugas.custevent_ptg_se_realizo_cob_adicional ? fugas.custevent_ptg_se_realizo_cob_adicional : false
                    });

                    caseLoad.setValue({
                        fieldId: 'custevent_ptg_cantidad_cobrada',
                        value: fugas.custevent_ptg_cantidad_cobrada ? fugas.custevent_ptg_cantidad_cobrada : 0
                    });

                    if (fugas.related_record == true) {

                        //log.debug('entro para relacionar', related_record)
                        let supportcaseSearchObj = search.create({
                            type: "supportcase",
                            filters:
                                [
                                    ["internalid", "anyof", fugas.id],
                                    "AND",
                                    ["transaction.type", "anyof", "Opprtnty"]
                                ],
                            columns:
                                [
                                    search.createColumn({
                                        name: "type",
                                        join: "transaction",
                                        label: "Type"
                                    }),
                                    search.createColumn({
                                        name: "tranid",
                                        join: "transaction",
                                        label: "Document Number"
                                    }),
                                    search.createColumn({
                                        name: "transactionnumber",
                                        join: "transaction",
                                        label: "Transaction Number"
                                    }),
                                    search.createColumn({
                                        name: "transactionname",
                                        join: "transaction",
                                        label: "Transaction Name"
                                    }),
                                    search.createColumn({
                                        name: "internalid",
                                        join: "transaction",
                                        label: "Internal ID"
                                    })
                                ]
                        });
                        let searchResultCount = supportcaseSearchObj.runPaged().count;
                        log.audit('count opp in case', searchResultCount)
                        if (searchResultCount > 0) {
                            supportcaseSearchObj.run().each(function (result) {
                                log.audit('results case opp', result)
                                // .run().each has a limit of 4,000 results
                                let idOpp = result.getValue({
                                    name: "internalid",
                                    join: "transaction",
                                    label: "Internal ID"
                                });
                                try {
                                    record.detach({
                                        record: {
                                            type: record.Type.SUPPORT_CASE,
                                            id: fugas.id
                                        },
                                        from: {
                                            type: 'transaction',
                                            id: idOpp
                                        }
                                    });
                                } catch (error) {
                                    log.audit('error al desligar opp in case', error)
                                }

                                return true;
                            });
                        }



                        var relacionarRegistro = record.attach({
                            record: {
                                type: record.Type.SUPPORT_CASE,
                                id: fugas.id
                            },
                            to: {
                                type: 'transaction',
                                id: fugas.id_oportuniti
                            }
                        });

                        log.audit('registro relacionado', relacionarRegistro);
                    } else {
                        // log.debug('entro para no relacionar', related_record)
                        let supportcaseSearchObj = search.create({
                            type: "supportcase",
                            filters:
                                [
                                    ["internalid", "anyof", fugas.id],
                                    "AND",
                                    ["transaction.type", "anyof", "Opprtnty"]
                                ],
                            columns:
                                [
                                    search.createColumn({
                                        name: "type",
                                        join: "transaction",
                                        label: "Type"
                                    }),
                                    search.createColumn({
                                        name: "tranid",
                                        join: "transaction",
                                        label: "Document Number"
                                    }),
                                    search.createColumn({
                                        name: "transactionnumber",
                                        join: "transaction",
                                        label: "Transaction Number"
                                    }),
                                    search.createColumn({
                                        name: "transactionname",
                                        join: "transaction",
                                        label: "Transaction Name"
                                    }),
                                    search.createColumn({
                                        name: "internalid",
                                        join: "transaction",
                                        label: "Internal ID"
                                    })
                                ]
                        });
                        let searchResultCount = supportcaseSearchObj.runPaged().count;
                        log.debug('count opp in case sin mandar a relacionar', searchResultCount)
                        if (searchResultCount > 0) {
                            supportcaseSearchObj.run().each(function (result) {
                                log.audit('results case opp sin mandar a relacionar', result)
                                // .run().each has a limit of 4,000 results
                                let idOpp = result.getValue({
                                    name: "internalid",
                                    join: "transaction",
                                    label: "Internal ID"
                                });
                                try {
                                    record.detach({
                                        record: {
                                            type: record.Type.SUPPORT_CASE,
                                            id: fugas.id
                                        },
                                        from: {
                                            type: 'transaction',
                                            id: idOpp
                                        }
                                    });
                                } catch (error) {
                                    log.audit('error al desligar opp in case si no manda una relacion', error)
                                }

                                return true;
                            });
                        }
                    }


                    if (fugas.isHadImage && fugas.images.length > 0) {
                        for (let i = 0; i < fugas.images.length; i++) {
                            let info = fugas.images[i];

                            let fileObj = file.create({
                                name: `${info.name}.jpg`,
                                fileType: file.Type.JPGIMAGE,
                                contents: info.img64,
                                encoding: file.Encoding.UTF8,
                                folder: 14055,
                            });

                            let id = fileObj.save();
                            log.debug('id img', id)

                            let addImg = record.attach({
                                record: {
                                    type: 'file',
                                    id: id
                                },
                                to: {
                                    type: record.Type.SUPPORT_CASE,
                                    id: fugas.id
                                }
                            });

                            log.debug('relacion attach img to case', addImg)

                        }

                    }
                }

                let price = caseLoad.getValue({
                    fieldId: 'custevent_ptg_precio_venta'
                });

                let objCaseData = {};
                let obj = {};
                objCaseData.customer = caseLoad.getValue({
                    fieldId: 'company'
                });

                objCaseData.items = [];

                obj.item = caseLoad.getValue({
                    fieldId: 'item'
                });

                obj.quantity = caseLoad.getValue({
                    fieldId: 'custevent_ptg_cantidad_recolectada_tras'
                });

                objCaseData.items.push(obj);

                let idCase = caseLoad.save();
                log.audit('idCase', idCase);
                if (idCase) {
                    response.success = true;
                    response.data = idCase
                    if (fugas.isTrasiego) {
                        let rma = createRMA(price, objCaseData);
                        if (!rma.created) {
                            response.success = false;
                            response.messageRMA = rma.message;
                        }
                    }
                }
            });
        } catch (error) {
            log.audit('error case', error);
            response.message = error;
        }

        return response;
    }

    const createRMA = (priceZone, objCase) => {
        log.audit('data rma', objCase)
        let statusRMA = {
            created: false
        }
        try {
            let rma = record.create({
                type: 'returnauthorization',
                isDynamic: true,
            });

            rma.setValue({
                fieldId: 'entity',
                value: objCase.customer
            });

            rma.setValue({
                fieldId: 'orderstatus',
                value: "B"
            });

            rma.setValue({
                fieldId: 'location',
                value: 1142
            });

            for (const key in objCase.items) {
                let data = objCase.items[key];
                log.audit('data for', data)

                rma.selectNewLine({
                    sublistId: 'item'
                });

                rma.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    value: data.item
                });

                rma.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    value: data.quantity
                });

                //let rate = data.quantity * priceZone;
                rma.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    value: priceZone
                });

                rma.commitLine({
                    sublistId: 'item'
                });

            }

            let id = rma.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
            });
            log.audit('rma created', id)
            // let recieve = record.transform({
            //     fromType: 'returnauthorization',
            //     fromId: id,
            //     toType: record.Type.ITEM_RECEIPT,
            //     isDynamic: true,
            // });
            // let idRecieve = recieve.save({
            //     enableSourcing: true,
            //     ignoreMandatoryFields: true
            // });

            if (!!id) {
                statusRMA.created = true;
            }

        } catch (error) {
            log.audit('error rma', error)
            statusRMA.message = error
        }

        return statusRMA;

    }

    return {
        post: _post,
        put: _put
    }
});