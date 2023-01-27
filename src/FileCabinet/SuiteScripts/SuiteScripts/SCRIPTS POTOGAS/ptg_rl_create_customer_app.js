/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/format', 'N/record', 'N/search'],
    /**
 * @param{format} format
 * @param{record} record
 * @param{search} search
 */
    (format, record, search) => {
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
            log.debug({
                title: "Request",
                details: requestBody
            });

            const responseData = {
                success: false,
                data: null,
            }

            try {
                if (requestBody === null || requestBody === undefined || Object.keys(requestBody).length === 0) {
                    responseData.message = "hay un dato undefine"
                }
            } catch (err) {
                return responseData
            }

            try {



                let customerRecord = record.create({
                    type: record.Type.CUSTOMER,
                    isDynamic: true
                });


                customerRecord.setValue({
                    fieldId: 'customform',
                    //value: '194' sbx
                    value: '180' 
                })

                customerRecord.setValue({
                    fieldId: 'altname',
                    value: requestBody.firstName + " " + requestBody.lastName
                })


                // if (customer.regimeType == "true" || customer.regimeType == true) {
                customerRecord.setValue({
                    fieldId: 'isperson',
                    value: "T"
                });
                customerRecord.setValue({
                    fieldId: 'firstname',
                    value: requestBody.firstName
                })
                // customerRecord.setValue({
                //     fieldId: 'middlename',
                //     value: customer.middleName
                // })
                customerRecord.setValue({
                    fieldId: 'lastname',
                    value: requestBody.lastName
                })

                // } else {
                //     customerRecord.setValue({
                //         fieldId: 'isperson',
                //         value: "F"
                //     });

                //     customerRecord.setValue({
                //         fieldId: 'companyname',
                //         value: customer.businessName
                //     });

                //     customerRecord.setValue({
                //         fieldId: 'custentity_mx_rfc',
                //         value: customer.rfc
                //     })

                //     customerRecord.setValue({
                //         fieldId: 'custentity_disa_uso_de_cfdi_',
                //         value: customer.cfdi
                //     })
                // }

                customerRecord.setValue({
                    fieldId: 'email',
                    value: requestBody.email
                })
                // customerRecord.setValue({
                //     fieldId: 'custentity_drt_sed_email_customerpayment',
                //     value: customer.emails.principal
                // })
                // customerRecord.setValue({
                //     fieldId: 'custentity_drt_sed_email_invoice',
                //     value: customer.emails.adicionales
                // })

                //custentity_ptg_planta_
                // customerRecord.setValue({
                //     fieldId: 'custentity_ptg_plantarelacionada_',
                //     value: customer.planta
                // })
                /** @type {string} */
                let phoneStr = (requestBody.phone ? requestBody.phone.toString() : "");
                if (!/^[0-9]+$/.test((phoneStr).toString()))
                    throw Error('Error en phone')
                customerRecord.setValue({
                    fieldId: 'phone',
                    value: requestBody.phone
                })
                // customerRecord.setValue({
                //     fieldId: 'altphone',
                //     value: customer.telefonoAlt
                // })
                customerRecord.setValue({
                    fieldId: 'subsidiary',
                    //value: 25 sbx
                    value: 26
                })

                customerRecord.selectNewLine({
                    sublistId: 'addressbook'
                });

                customerRecord.setCurrentSublistValue({
                    sublistId: 'addressbook',
                    fieldId: "label",
                    value: 00
                }); 

                let addressSubrecord = customerRecord.getCurrentSublistSubrecord({
                    sublistId: 'addressbook',
                    fieldId: 'addressbookaddress'
                });

                addressSubrecord.setValue({
                    fieldId: "city",
                    value: requestBody.city
                });
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_estado",
                    value: requestBody.stateName
                });
                
                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_nombre_colonia",
                    value: requestBody.colony
                });

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_colonia_ruta",
                    value: 14
                });

                addressSubrecord.setValue({
                    fieldId: "custrecord_ptg_street",
                    value: (requestBody.nameStreet || "").toString().trim()
                }); // M

                if (!/^[0-9]+$/.test((requestBody.zip || "000000").toString()))
                    throw Error('Error en codigo postal')
                addressSubrecord.setValue({
                    fieldId: "zip",
                    value: requestBody.zip || "000000"
                }); // M

                customerRecord.commitLine({
                    sublistId: "addressbook"
                });

                // customerRecord.setValue({
                //     fieldId: 'custentity_ptg_tipodecliente_',
                //     value: customer.regimenId
                // })
                // //custentity_ptg_tipodeservicio_
                // customerRecord.setValue({
                //     fieldId: 'custentity_ptg_giro_negocio',
                //     value: customer.businessType
                // });

                // customerRecord.setValue({
                //     fieldId: 'custentity_ptg_notas_cliente_',
                //     value: customer.notaCliente
                // });

                // var dataAddress = createAddressesOnNS(customer.address, customerRecord, customer.email, customer.telefono)

                let customerId = customerRecord.save({ ignoreMandatoryFields: true });

                // si el id del cliente existe se modifica mensaje de successfully
                if (customerId) {
                    responseData.success = true;
                    responseData.message = "Customer created successfully";
                    responseData.customer = customerId
                }

                log.debug({
                    title: 'responseData',
                    details: responseData
                })



                // se captura el error 
            } catch (err) {
                log.debug({
                    title: "Error",
                    details: err
                })
                responseData.message = err;

            }

            return responseData

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
