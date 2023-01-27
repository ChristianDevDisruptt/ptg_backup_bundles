/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description creación de clientes potogas
 */
 define(["N/log", "N/record", "N/search", 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors'], function (log, /** @type {import('N/record')} */ record, search, error) {

    // se crea estructura donde se cargará toda la data
    const responseData = {
        success: false,
        message: "Some errors occured",
        data: null,
        apiErrorPost: []
    }
    var duplicidad = false;
    var contadorContrato = 0;
    const createAddressesOnNS = (addressesRequest, customerRecord) => {

        try {
            var arrayAddress = [];
            addressesRequest.forEach(address => {

                customerRecord.selectNewLine({
                    sublistId: 'addressbook'
                });
                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: "defaultshipping",
                    value: address.principal
                }); // M
                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: "defaultbilling",
                    value: address.domFacturacion
                }); // M

                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: "label",
                    value: address.tag
                }); // M

                let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress'
                });
                addressSubrecord.setValue({
                    fieldId: "city",
                    value: address.city
                });
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_estado",
                    value: address.stateName
                });
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_colonia_ruta",
                    value: address.ruta
                });
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_town_city",
                    value: (address.city || "").toString().trim()
                }); // M
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_street",
                    value: (address.nameStreet || "").toString().trim()
                }); // M

                if (!/^[a-zA-Z0-9]+$/.test((address.numExterno || "").toString()))
                    throw Error('Error en numero externo')
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_exterior_number",
                    value: (address.numExterno || "")
                }); // M

                // if (!/^[a-zA-Z0-9]+$/.test((address.numInterno || "").toString()))
                //     throw Error('Error en numero Interno')
                if (!!address.numInterno || address.numInterno != "") {
                    log.audit('entro no llego vacio numInterno', address.numInterno)
                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_interior_number",
                        value: address.numInterno
                    });
                }

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_town_city",
                    value: (address.city || "").toString().trim()
                }); // 

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_nombre_colonia",
                    value: address.colonia
                }); // colonia
                // addressSubrecord.setValue({
                //     fieldId: "custrecord_ptg_latitude",
                //     value: (address.latitud || "").toString().trim()
                // });
                // addressSubrecord.setValue({
                //     fieldId: "custrecord_ptg_longitude",
                //     value: (address.longitud || "").toString().trim()
                // });
                addressSubrecord.setValue({
                    fieldId: "state",
                    value: address.stateName
                }); // M
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_entrecalle_",
                    value: address.street_aux1
                }); // M
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_y_entre_",
                    value: address.street_aux2
                }); // M
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_obesarvaciones_direccion_",
                    value: address.commentsAddress
                }); // M
                addressSubrecord.setText({
                    fieldId: "custrecord_ptg_ruta_asignada",
                    text: address.idRoute
                }); // M
                addressSubrecord.setText({
                    fieldId: "custrecord_ptg_ruta_asignada2",
                    text: address.idRoute2
                }); // M
                //if (address.typeService == 4) {
                    /*addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_ruta_asignada_3",
                        value: address.idRoute3
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_ruta_asignada_4",
                        value: address.idRoute4
                    }); // M*/
                //}

                if (!/^[0-9]+$/.test((address.zip || "000000").toString()))
                    throw Error('Error en codigo postal')
                addressSubrecord.setValue({
                    fieldId: "zip",
                    value: address.zip || "000000"
                }); // M

                //addressSubrecord.setValue({ fieldId: "custrecord_ptg_invoicing", value: (address.forInvocing == "true" || address.forInvocing == true) })

                //Mi parte Christian , los valores faltantes de la programación por dirección                
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_tipo_contacto",
                    value: address.typeContact
                }); // M

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_capacidad_art",
                    value: address.capacidad
                }); // M

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_articulo_frecuente",
                    value: address.frequencyItem
                }); // M

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_tipo_servicio",
                    value: address.typeService
                }); // M

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_telefono_principal",
                    value: address.telefonoPrinc
                });

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_telefono_alterno",
                    value: address.telefonoSec
                });

                if (address.typeContact != 1) {
                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_lunes",
                        value: address.lunes
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_martes",
                        value: address.martes
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_miercoles",
                        value: address.miercoles
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_jueves",
                        value: address.jueves
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_viernes",
                        value: address.viernes
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_sabado",
                        value: address.sabado
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_domingo",
                        value: address.domingo
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_cada",
                        value: address.cada
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_periodo_contacto",
                        value: address.frecuencia
                    }); // M

                    addressSubrecord.setText({
                        fieldId: "custrecord_ptg_entre_las",
                        text: address.entre_las
                    }); // M

                    addressSubrecord.setText({
                        fieldId: "custrecord_ptg_y_las",
                        text: address.y_las
                    }); // M

                    addressSubrecord.setValue({
                        fieldId: "custrecord_ptg_en_la_semana",
                        value: address.inThatWeek
                    }); // M

                    if(address.frecuencia == 2) {
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio",
                            text: address.date_lunes
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_mar",
                            text: address.date_martes
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_mi",
                            text: address.date_miercoles
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_jue",
                            text: address.date_jueves
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_vi",
                            text: address.date_viernes
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_sab",
                            text: address.date_sabado
                        });
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio_dom",
                            text: address.date_domingo
                        });
                    } else {
                        addressSubrecord.setText({
                            fieldId: "custrecord_ptg_fecha_inicio_servicio",
                            text: address.startDayService
                        }); // M
                    }


                    /*if (address.typeService == 4) {
                        addressSubrecord.setValue({
                            fieldId: "custrecord_ptg_articulo_frecuente2",
                            value: address.frequencyItem2
                        }); // M

                        addressSubrecord.setValue({
                            fieldId: "custrecord_ptg_capacidad_can_articulo_2",
                            value: address.capacidad2
                        }); // M
                    }*/
                    //Termina mi parte
                    log.audit('test', 'test1')
                }

                if (address.isContract) {
                    addressSubrecord.setValue({
                        fieldId: 'custrecord_ptg_direccion_contrato',
                        value: true
                    });

                    addressSubrecord.setValue({
                        fieldId: 'custrecord_ptg_numero_contrato',
                        value: getContractNumber()
                    });

                    addressSubrecord.setText({
                        fieldId: 'custrecord_ptg_fecha_alta_contrato',
                        text: address.contractDate
                    });

                    addressSubrecord.setText({
                        fieldId: 'custrecord_ptg_digito_verificador',
                        text: Math.floor(Math.random() * 10)
                    });
                }

                customerRecord.commitLine({
                    sublistId: "addressbook"
                });
                log.debug("ADDRESS", address);

                var numDuplicidad = customerSearchDuplicado(address);
                log.debug({
                    title: "numDuplicidad",
                    details: numDuplicidad
                })

                if (numDuplicidad > 0) {
                    duplicidad = true
                }
                arrayAddress.push(address)
            });
            return arrayAddress

        } catch (err) {
            log.debug({
                title: "errorAddress",
                details: err
            });
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));

        }
    }

    function getContractNumber() {
        contadorContrato = contadorContrato + 1;
        var customerSearchObj = search.create({
            type: "customer",
            filters:
            [
               ["address.custrecord_ptg_direccion_contrato","is","T"]
            ],
            columns:
            [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "altname", label: "Nombre"}),
               search.createColumn({
                  name: "custrecord_ptg_numero_contrato",
                  join: "Address",
                  sort: search.Sort.DESC,
                  label: "PTG - NUMERO DE CONTRATO"
               })
            ]
         });
        var searchResultCount = customerSearchObj.runPaged().count;
        let auxContract = 0;
        log.debug("customerSearchObj result count",searchResultCount);
        customerSearchObj.run().each(function(result){
            auxContract = result.getValue({name: "custrecord_ptg_numero_contrato",
            join: "Address",
            label: "PTG - NUMERO DE CONTRATO"});
        });

        return parseInt(auxContract) + contadorContrato;
    }

    function customerSearchDuplicado(address) {
        try {
            let customerSearchObj = search.create({
                type: "customer",
                filters: [
                    ["address.custrecord_ptg_colonia_ruta", "is", (address.ruta || "").toString().trim()], "AND",
                    // ["address.city", "is", (address.city || "").toString().trim()], "AND",
                    // ["address.zipcode", "is", address.zip || "000000"], "AND",
                    ["address.custrecord_ptg_street", "is", (address.nameStreet || "").toString().trim()], "AND",
                    ["address.custrecord_ptg_exterior_number", "is", (address.numExterno || "").toString().trim()], "AND",
                    ["address.custrecord_ptg_interior_number", "is", (address.numInterno || "").toString().trim()]//, //"AND",
                    // ["address.custrecord_ptg_latitude", "is", (address.latitud || "").toString().trim()], "AND",
                    // ["address.custrecord_ptg_longitude", "is", (address.longitud || "").toString().trim()], "AND",
                    // ["address.state", "is", address.stateName], "AND",
                    //["email", "is", email], "OR",
                    //["phone", "is", phone]
                ]
            });

            // Resultado de la busqueda personalizada
            let searchResultCount = customerSearchObj.runPaged().count;
            // log.debug("customerSearchObj result count", searchResultCount);

            /*   customerSearchObj.run().each(function (result) {
                  // log.debug("Result", result);
                  return true;
              }); */
            return searchResultCount;
        } catch (err) {
            log.audit('error en la busqueda duplicada', err)
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));
        }

    }



    function postCustomers(request) {

        log.debug({
            title: "Request",
            details: request
        });

        try {
            if (request === null || request === undefined || request.length === 0) {
                responseData.message = "hay un dato undefine"
            }
        } catch (err) {
            return responseData
        }

        let customersList = [];

        try {


            request.customers.forEach((customer) => {
                let customerRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });


                customerRecord.setValue({
                    fieldId: 'customform',
                    //value: '194' sbx
                    value: '180'
                })

                if (customer.nombre) {
                    customerRecord.setValue({
                        fieldId: 'altname',
                        value: customer.nombre + " " + customer.lastName
                    })
                } else {
                    customerRecord.setValue({
                        fieldId: 'altname',
                        value: "Sin Nombre"
                    })
                }

                if (customer.regimeType == "true" || customer.regimeType == true) {
                    customerRecord.setValue({
                        fieldId: 'isperson',
                        value: "T"
                    });
                    customerRecord.setValue({
                        fieldId: 'firstname',
                        value: customer.nombre
                    })
                    customerRecord.setValue({
                        fieldId: 'middlename',
                        value: customer.middleName
                    })
                    customerRecord.setValue({
                        fieldId: 'lastname',
                        value: customer.lastName
                    })

                } else {
                    customerRecord.setValue({
                        fieldId: 'isperson',
                        value: "F"
                    });

                    customerRecord.setValue({
                        fieldId: 'companyname',
                        value: customer.businessName
                    });

                }

                customerRecord.setValue({
                    fieldId: 'custentity_mx_rfc',
                    value: customer.rfc
                })

                customerRecord.setValue({
                    fieldId: 'phone',
                    value: customer.telefono
                })

                customerRecord.setValue({
                    fieldId: 'custentity_disa_uso_de_cfdi_',
                    value: customer.cfdi
                })

                customerRecord.setValue({
                    fieldId: 'custentity_razon_social_para_facturar',
                    value: customer.razonSocialFact
                })

                customerRecord.setValue({
                    fieldId: 'email',
                    value: customer.email
                })
                customerRecord.setValue({
                    fieldId: 'custentity_drt_sed_email_customerpayment',
                    value: customer.emails.principal
                })
                customerRecord.setValue({
                    fieldId: 'custentity_drt_sed_email_invoice',
                    value: customer.emails.adicionales
                })

                //custentity_ptg_planta_
                customerRecord.setValue({
                    fieldId: 'custentity_ptg_plantarelacionada_',
                    value: customer.planta
                })
                customerRecord.setValue({
                    fieldId: 'subsidiary',
                    value: customer.subsidiary
                })
                customerRecord.setValue({
                    fieldId: 'custentity_ptg_tipodecliente_',
                    value: customer.regimenId
                })
                //custentity_ptg_tipodeservicio_
                customerRecord.setValue({
                    fieldId: 'custentity_ptg_giro_negocio',
                    value: customer.businessType
                });

                customerRecord.setValue({
                    fieldId: 'custentity_ptg_notas_cliente_',
                    value: customer.notaCliente
                });

                customerRecord.setValue({
                    fieldId: 'custentity_ptg_requiere_factura',
                    value: customer.requiereFactura
                });

                /*customerRecord.setValue({
                    fieldId: 'receivablesaccount',
                    value: 119
                })*/

                contadorContrato = 0;
                var dataAddress = createAddressesOnNS(customer.address, customerRecord)

                log.debug("ADDRESS 2", dataAddress)

                if (dataAddress[0].colonia) {

                    if (!duplicidad) {
                        var customerId = -1;
                        try {
                            customerId = customerRecord.save({
                                ignoreMandatoryFields: true
                            });
                            customersList.push(customerId)
                        } catch (error) {
                            log.debug('error save customer', error)
                        }

                    } else {
                        responseData.message = "El Cliente ya existe";
                    }
                } else {
                    log.debug("error al crear", error)
                    responseData.apiErrorPost.push(error.errorMissingParameter());
                }

                // si el id del cliente existe se modifica mensaje de successfully
                if (customerId) {
                    let customerLoad = record.load({
                        type: record.Type.CUSTOMER,
                        id: customerId,
                        isDynamic: true
                    });

                    let dataId = customerLoad.getValue({
                        fieldId: "entityid"
                    });

                    if(dataId.length < 10) {
                        let auxCero = "";
                        for (let x = dataId.length; x < 10; x++) {
                            auxCero += "0";
                        }

                        customerLoad.setValue({
                            fieldId: "entityid",
                            value: auxCero+dataId
                        });

                        customerLoad.save();
                    }

                    responseData.success = true;
                    responseData.message = "Customer created successfully";
                    responseData.data = customersList
                }

                log.debug({
                    title: 'customer',
                    details: customer
                })
                log.debug({
                    title: 'responseData',
                    details: responseData
                })

            })




            // se captura el error 
        } catch (err) {
            log.debug({
                title: "Error",
                details: err
            })
            responseData.apiErrorPost.push(error.errorNotParameter(err.message));

        }

        return responseData

    }

    function putCustomers(request) {
        log.debug({
            title: "Request",
            details: request
        });
        let customersList = [];
        try {
            request.customers.forEach((customer) => {
                log.audit('customer', customer);
                let customerLoad = record.load({
                    type: record.Type.CUSTOMER,
                    id: customer.id,
                    isDynamic: true
                });

                log.audit('fields', customer.bodyFields);

                for (var field in customer.bodyFields) {
                    if (field == 'custentity_ptg_ylas_') {
                        customerLoad.setText({
                            fieldId: "custentity_ptg_ylas_",
                            text: customer.bodyFields['custentity_ptg_ylas_']
                        });

                    } else if (field == 'custentity_ptg_entrelas_') {
                        customerLoad.setText({
                            fieldId: "custentity_ptg_entrelas_",
                            text: customer.bodyFields['custentity_ptg_entrelas_']
                        });

                    } else {
                        customerLoad.setValue({
                            fieldId: field,
                            value: customer.bodyFields[field]
                        });
                    }

                }
                log.audit('customer.bodyAdress', customer.bodyAddress.length);
                var idAddress = null;
                if (customer.bodyAddress.length > 0) {

                    var lineNumber = customerLoad.findSublistLineWithValue({
                        sublistId: 'addressbook',
                        fieldId: 'addressbookaddress',
                        value: customer.bodyAddress[0].id
                    });

                    log.audit('line addressbook', lineNumber)

                    if (customer.bodyAddress[0].addresses.defaultbilling) {
                        customerLoad.selectLine({
                            sublistId: 'addressbook',
                            line: lineNumber
                        });
                        customerLoad.setCurrentSublistValue({
                            sublistId: 'addressbook',
                            fieldId: 'defaultbilling',
                            value: true
                        });
                        customerLoad.commitLine({
                            sublistId: 'addressbook'
                        });
                    }
                    log.debug("count", "0");
                    customer.bodyAddress.forEach((adress) => {
                        log.debug("count", "1");
                        let idAdress = adress.id;

                        if (idAdress) {
                            var adressLoad = record.load({
                                type: "Address",
                                id: idAdress,
                                isDynamic: true,
                            });

                            for (var add in adress.addresses) {

                                log.audit('add', add);
                                log.audit('21', adress.addresses[add]);

                                if (add == "custrecord_ptg_entre_las" || add == "custrecord_ptg_y_las" || add == "custrecord_ptg_fecha_inicio_servicio" || add == "custrecord_ptg_fecha_alta_contrato") {
                                    adressLoad.setText({
                                        fieldId: add,
                                        text: adress.addresses[add]
                                    });

                                } else if( add == "custrecord_ptg_ruta_asignada" || add == "custrecord_ptg_ruta_asignada2"){
                                    adressLoad.setText({
                                        fieldId: add,
                                        text: adress.addresses[add]
                                    });
                                } else if(add == "custrecord_ptg_direccion_contrato") {
                                    adressLoad.setValue({
                                        fieldId: add,
                                        value: adress.addresses[add]
                                    });
                                    if(adress.addresses[add]) {                                       

                                        adressLoad.setValue({
                                            fieldId: 'custrecord_ptg_numero_contrato',
                                            value: getContractNumber()
                                        });

                                        adressLoad.setText({
                                            fieldId: 'custrecord_ptg_digito_verificador',
                                            text: Math.floor(Math.random() * 10)
                                        });
                                    } else {
                                        adressLoad.setValue({
                                            fieldId: 'custrecord_ptg_numero_contrato',
                                            value: ''
                                        });

                                        adressLoad.setText({
                                            fieldId: 'custrecord_ptg_digito_verificador',
                                            text: ''
                                        });
                                    }
                                } else {
                                    adressLoad.setValue({
                                        fieldId: add,
                                        value: adress.addresses[add]
                                    });
                                }
                            }

                            idAddress = adressLoad.save();
                        } else {
                            log.audit('error', 'no hay direccion');
                            customerLoad.selectNewLine({
                                sublistId: 'addressbook'
                            });
                            customerLoad.setCurrentSublistValue({
                                sublistId: 'addressbook',
                                fieldId: "defaultshipping",
                                value: adress.principal
                            }); // M
                            customerLoad.setCurrentSublistValue({
                                sublistId: 'addressbook',
                                fieldId: "defaultbilling",
                                value: adress.domFacturacion
                            }); // M

                            customerLoad.setCurrentSublistValue({
                                sublistId: 'addressbook',
                                fieldId: "label",
                                value: adress.tag
                            }); // M

                            let addressSubrecord = customerLoad.getCurrentSublistSubrecord({
                                sublistId: 'addressbook',
                                fieldId: 'addressbookaddress'
                            });
                            addressSubrecord.setValue({
                                fieldId: "city",
                                value: adress.city
                            });
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_estado",
                                value: adress.stateName
                            });
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_colonia_ruta",
                                value: adress.ruta
                            });
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_town_city",
                                value: (adress.city || "").toString().trim()
                            }); // M
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_street",
                                value: (adress.nameStreet || "").toString().trim()
                            }); // M

                            if (!/^[a-zA-Z0-9]+$/.test((adress.numExterno || "").toString()))
                                throw Error('Error en numero externo')
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_exterior_number",
                                value: (adress.numExterno || "").toString().trim()
                            }); // M

                            // if (!/^[a-zA-Z0-9]+$/.test((adress.numInterno || "").toString()))
                            //     throw Error('Error en numero Interno')
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_interior_number",
                                value: (adress.numInterno || "").toString().trim()
                            });
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_town_city",
                                value: (adress.colonia || "").toString().trim()
                            }); // M
                            // addressSubrecord.setValue({
                            //     fieldId: "custrecord_ptg_latitude",
                            //     value: (adress.latitud || "").toString().trim()
                            // });
                            // addressSubrecord.setValue({
                            //     fieldId: "custrecord_ptg_longitude",
                            //     value: (adress.longitud || "").toString().trim()
                            // });

                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_nombre_colonia",
                                value: adress.colonia
                            }); // colonia
                            addressSubrecord.setValue({
                                fieldId: "state",
                                value: adress.stateName
                            }); // M
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_entrecalle_",
                                value: adress.street_aux1
                            }); // M
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_y_entre_",
                                value: adress.street_aux2
                            }); // M
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_obesarvaciones_direccion_",
                                value: adress.commentsAddress
                            }); // M

                            if (!/^[0-9]+$/.test((adress.zip || "000000").toString()))
                                throw Error('Error en codigo postal')
                            addressSubrecord.setValue({
                                fieldId: "zip",
                                value: adress.zip || "000000"
                            }); // M

                            //addressSubrecord.setValue({ fieldId: "custrecord_ptg_invoicing", value: (address.forInvocing == "true" || address.forInvocing == true) })

                            //Mi parte Christian , los valores faltantes de la programación por dirección   
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_tipo_contacto",
                                value: adress.typeContact
                            }); // M     

                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_tipo_servicio",
                                value: adress.typeService
                            }); // M

                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_capacidad_art",
                                value: adress.capacidad
                            }); // M


                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_articulo_frecuente",
                                value: adress.frequencyItem
                            }); // M

                            if (adress.typeContact != 1) {
                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_lunes",
                                    value: adress.lunes
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_martes",
                                    value: adress.martes
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_miercoles",
                                    value: adress.miercoles
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_jueves",
                                    value: adress.jueves
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_viernes",
                                    value: adress.viernes
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_sabado",
                                    value: adress.sabado
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_domingo",
                                    value: adress.domingo
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_cada",
                                    value: adress.cada
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_periodo_contacto",
                                    value: adress.frecuencia
                                }); // M

                                addressSubrecord.setText({
                                    fieldId: "custrecord_ptg_entre_las",
                                    text: adress.entre_las
                                }); // M

                                addressSubrecord.setText({
                                    fieldId: "custrecord_ptg_y_las",
                                    text: adress.y_las
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_en_la_semana",
                                    value: adress.inThatWeek
                                }); // M

                                if(adress.frecuencia == 2) {
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio",
                                        text: adress.date_lunes
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_mar",
                                        text: adress.date_martes
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_mi",
                                        text: adress.date_miercoles
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_jue",
                                        text: adress.date_jueves
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_vi",
                                        text: adress.date_viernes
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_sab",
                                        text: adress.date_sabado
                                    });
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio_dom",
                                        text: adress.date_domingo
                                    });
                                } else {
                                    addressSubrecord.setText({
                                        fieldId: "custrecord_ptg_fecha_inicio_servicio",
                                        text: adress.startDayService
                                    }); // M
                                }
                                

                                

                                //Termina mi parte

                            }

                            /*if (adress.typeService == 4) {
                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_articulo_frecuente2",
                                    value: adress.frequencyItem2
                                }); // M

                                addressSubrecord.setValue({
                                    fieldId: "custrecord_ptg_capacidad_can_articulo_2",
                                    value: adress.capacidad2
                                }); // M
                            }*/

                            if (adress.isContract) {
                                addressSubrecord.setValue({
                                    fieldId: 'custrecord_ptg_direccion_contrato',
                                    value: true
                                });
            
                                addressSubrecord.setValue({
                                    fieldId: 'custrecord_ptg_numero_contrato',
                                    value: getContractNumber()
                                });
            
                                addressSubrecord.setText({
                                    fieldId: 'custrecord_ptg_fecha_alta_contrato',
                                    text: adress.contractDate
                                });

                                addressSubrecord.setText({
                                    fieldId: 'custrecord_ptg_digito_verificador',
                                    text: Math.floor(Math.random() * 10)
                                });
                            }

                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_telefono_principal",
                                value: adress.telefonoPrinc
                            });
            
                            addressSubrecord.setValue({
                                fieldId: "custrecord_ptg_telefono_alterno",
                                value: adress.telefonoSec
                            });

                            log.audit("idRoute", adress.idRoute);
                            addressSubrecord.setText({
                                fieldId: "custrecord_ptg_ruta_asignada",
                                text:  adress.idRoute
                            }); // M
                            log.audit("idRoute2", adress.idRoute2);
                            addressSubrecord.setText({
                                fieldId: "custrecord_ptg_ruta_asignada2",
                                text: adress.idRoute2
                            }); // M

                            customerLoad.commitLine({
                                sublistId: "addressbook"
                            });
                            log.debug("ADDRESS", adress);
                        }

                    });

                }
                var idSaveCustomer = customerLoad.save();
                customersList.push({idSaveCustomer: idSaveCustomer, idAddress : idAddress})
                if (idSaveCustomer) {
                    responseData.success = true;
                    responseData.message = "Customer updated successfully";
                    responseData.data = customersList
                }
                log.audit('idSaveCustomer', idSaveCustomer);
            });
        } catch (error) {
            log.audit('error', error);
        }

        return responseData
    }



    return {
        post: postCustomers,
        put: putCustomers
    }
});