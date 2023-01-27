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
                data: null,
            }

            log.debug({
                title: "Request",
                details: requestBody
            });
            // se valida que no venga ningun dato por requestBody vacio
            try {
                if (requestBody === null || requestBody === undefined || Object.keys(requestBody).length === 0) {
                    responseData.apiErrorPost.push(error.errorRequestEmpty())
                }
            } catch (error) {
                return responseData
            }


            try {
                // se recorreo la oportunidad ingresada por request para setear información

                let opportunityRecord = record.create({
                    type: record.Type.OPPORTUNITY,
                    isDynamic: true
                });

                opportunityRecord.setValue({ // Estados de oportunidad cancelado. reprogramado o modificado
                    fieldId: 'customform',
                    //value: '305' sbx
                    value: '265'
                });

                opportunityRecord.setValue({ // Estados de oportunidad cancelado. reprogramado o modificado
                    fieldId: 'entitystatus',
                    value: 13
                });
                
                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_numero_viaje',
                    value: requestBody.numero_viaje
                });


                opportunityRecord.setValue({ // id del cliente
                    fieldId: 'entity',
                    value: requestBody.customer
                });

                opportunityRecord.setValue({ // representante de venta o empleado
                    fieldId: 'salesrep',
                    value: requestBody.operario
                });

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_opcion_pago_obj',
                    value: JSON.stringify(requestBody.pago)
                });

                //var time = format.parse({ value: opport.horaMilitar(), type: format.Type.TIMEOFDAY })

                opportunityRecord.setText({ // hora de la opotunidad
                    fieldId: 'custbody_ptg_hora_trans',
                    text: requestBody.time
                });

                opportunityRecord.setText({ // hora de la opotunidad
                    fieldId: 'custbody_ptg_hora_cierre',
                    text: requestBody.time
                });


                //Prueba para setear la fecha
                // opportunityRecord.setText({ // fecha de cierre del servicio
                //     fieldId: 'expectedclosedate',
                //     text: requestBody.closeDate
                // });

                // opportunityRecord.setText({ // fecha de cierre del servicio
                //     fieldId: 'closedate',
                //     text: requestBody.closeDate
                // });


                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_tipo_servicio',
                    value: 1
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_estado_pedido',
                    value: 3
                })

                opportunityRecord.setValue({
                    fieldId: 'custbody_ptg_oportunidad_antojado',
                    value: true
                })

                for (let key in requestBody.items) {
                    let itemData = requestBody.items[key];

                    opportunityRecord.selectNewLine({
                        //selecciona una nueva linea para cada iteración
                        sublistId: "item",
                    });

                    log.debug('item', Number(itemData.item))
                    opportunityRecord.setCurrentSublistValue({
                        // Articulo a vender
                        sublistId: "item",
                        fieldId: "item",
                        value: Number(itemData.item),
                    });

                    opportunityRecord.setCurrentSublistValue({
                        // cantidad del producto de la oportunidad
                        sublistId: "item",
                        fieldId: "quantity",
                        value: itemData.quantity,
                    });

                    
                    //log.audit('total', total);

                    if(itemData.type == 1){
                        let total = 12 * itemData.price;
                        opportunityRecord.setCurrentSublistValue({
                            // importe del producto de la oportunidad
                            sublistId: "item",
                            fieldId: "rate",
                            value: total,
                        });
                    }else{
                        opportunityRecord.setCurrentSublistValue({
                            // importe del producto de la oportunidad
                            sublistId: "item",
                            fieldId: "rate",
                            value: itemData.price,
                        });
                    }
                    

                    opportunityRecord.commitLine({
                        sublistId: "item",
                    });
                }

                // se guarda el registro en la base de datos
                let opportunityId = opportunityRecord.save();
                // pusheamos el id de oportunidad creada

                // si el id de oportunidad existe se modifica mensaje de successfully
                if (opportunityId) {
                    responseData.success = true;
                    responseData.message = "Opportunity created successfully";
                    responseData.opportunity = opportunityId
                }

                // se captura el error 
            } catch (err) {
                log.debug('err', err)
                responseData.message = err
            }
            // regresamos el response creado
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
