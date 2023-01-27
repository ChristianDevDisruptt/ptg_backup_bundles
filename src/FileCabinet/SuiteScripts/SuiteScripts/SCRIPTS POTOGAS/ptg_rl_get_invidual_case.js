/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
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
            let response = {
                success: false
            };
            log.debug('requestBody', requestBody)

            try {
                let supportcaseSearchObj = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["internalid", "anyof", requestBody.idCase]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "custevent_ptg_conceptos_casos", label: "PTG - CONCEPTOS PARA CASOS" }),
                            search.createColumn({ name: "priority", label: "Priority" }),
                            search.createColumn({ name: "custevent_ptg_fecha_visita", label: "PTG - FECHA DE VISITA" }),
                            search.createColumn({ name: "custevent_ptg_horario_preferido", label: "PTG - HORARIO PREFERIDO" }),
                            search.createColumn({ name: "status", label: "Status" }),
                            search.createColumn({ name: "custevent_ptg_prueba_hermet_realizada", label: "PTG - PRUEBA HERMETICA REALIZADA" }),
                            search.createColumn({ name: "custevent_ptg_hay_fuga", label: "PTG - ¿HAY FUGA?" }),
                            search.createColumn({ name: "custevent_ptg_prueba_hermetica", label: "PTG - PRUEBA HERMETICA COMENTARIO" }),
                            search.createColumn({ name: "custevent_ptg_se_realizo_cob_adicional", label: "PTG - ¿SE REALIZO COBRO ADICIONAL?" }),
                            search.createColumn({ name: "custevent_ptg_cantidad_cobrada", label: "PTG - CANTIDAD COBRADA" }),
                            search.createColumn({ name: "custevent_ptg_problema_localizado_en", label: "PTG - PROBLEMA" }),
                            search.createColumn({ name: "custevent_ptg_motivo_reemplazo_cil", label: "PTG - MOTIVO DE REMPLAZO DE CIL" }),
                            search.createColumn({ name: "custevent_ptg_solucion", label: "PTG - SOLUCION" }),
                            search.createColumn({ name: "custevent_ptg_cantidad_evidenciada", label: "PTG - PORCENTAJE INICIAL EVIDENCIADO" }),
                            search.createColumn({ name: "custevent_ptg_ano_producto", label: "PTG - AÑO DEL PRODUCTO" }),
                            search.createColumn({ name: "custevent_ptg_capacidad_tanq_est", label: "PTG - CAPACIDAD DEL TANQUE ESTACIONARIO" }),
                            search.createColumn({ name: "custevent_ptg_recogi_cilindro_danado", label: "PTG - Recogí Cilindro Dañado" }),
                            search.createColumn({ name: "custevent_ptg_repuse_cilindro_danado", label: "PTG - Repuse Cilindro Dañado" }),
                            search.createColumn({ name: "assigned", label: "Assigned To" }),
                            search.createColumn({ name: "custevent_ptg_porcentaje_final_eviden", label: "PTG - PORCENTAJE FINAL EVIDENCIADO" })
                        ]
                });
                let searchResultCount = supportcaseSearchObj.runPaged().count;
                log.debug("supportcaseSearchObj result count", searchResultCount);
                let objCase = {};
                supportcaseSearchObj.run().each(function (result) {
                    // .run().each has a limit of 4,000 results
                    log.debug('result', result)
                    objCase.id = result.getValue({ name: "internalid", label: "Internal ID" });
                    objCase.conceptCase = result.getText({ name: "custevent_ptg_conceptos_casos", label: "PTG - CONCEPTOS PARA CASOS" });
                    objCase.conceptCaseId = result.getValue({ name: "custevent_ptg_conceptos_casos", label: "PTG - CONCEPTOS PARA CASOS" });
                    objCase.priorityId = result.getValue({ name: "priority", label: "Priority" });
                    objCase.priority = result.getText({ name: "priority", label: "Priority" });
                    objCase.visitDate = result.getValue({ name: "custevent_ptg_fecha_visita", label: "PTG - FECHA DE VISITA" });
                    objCase.preferTime = result.getValue({ name: "custevent_ptg_horario_preferido", label: "PTG - HORARIO PREFERIDO" });
                    objCase.statusId = result.getValue({ name: "status", label: "Status" });
                    objCase.status = result.getText({ name: "status", label: "Status" });
                    objCase.makeTestHermetic = result.getValue({ name: "custevent_ptg_prueba_hermet_realizada", label: "PTG - PRUEBA HERMETICA REALIZADA" });
                    objCase.existFuga = result.getValue({ name: "custevent_ptg_hay_fuga", label: "PTG - ¿HAY FUGA?" });
                    objCase.commentTestHermetic = result.getValue({ name: "custevent_ptg_prueba_hermetica", label: "PTG - PRUEBA HERMETICA COMENTARIO"});
                    objCase.extraPayment = result.getValue({name: "custevent_ptg_se_realizo_cob_adicional", label: "PTG - ¿SE REALIZO COBRO ADICIONAL?" });
                    objCase.payment = result.getValue({name: "custevent_ptg_cantidad_cobrada", label: "PTG - CANTIDAD COBRADA"});
                    objCase.issueId = result.getValue({name: "custevent_ptg_problema_localizado_en", label: "PTG - PROBLEMA" });
                    objCase.issue = result.getText({name: "custevent_ptg_problema_localizado_en", label: "PTG - PROBLEMA" });
                    objCase.reasonReplaceCilId = result.getValue({name: "custevent_ptg_motivo_reemplazo_cil", label: "PTG - MOTIVO DE REMPLAZO DE CIL"  });
                    objCase.reasonReplaceCil = result.getText({name: "custevent_ptg_motivo_reemplazo_cil", label: "PTG - MOTIVO DE REMPLAZO DE CIL"  });
                    objCase.solution = result.getValue({name: "custevent_ptg_solucion", label: "PTG - SOLUCION"});
                    objCase.percentInitialEvidence = result.getValue({ name: "custevent_ptg_cantidad_evidenciada", label: "PTG - PORCENTAJE INICIAL EVIDENCIADO"});                    
                    objCase.productYear = result.getValue({ name: "custevent_ptg_ano_producto", label: "PTG - AÑO DEL PRODUCTO"});
                    objCase.tankEstacionarioCapacity = result.getValue({name: "custevent_ptg_capacidad_tanq_est", label: "PTG - CAPACIDAD DEL TANQUE ESTACIONARIO" });
                    objCase.pickUpCilindro = result.getValue({name: "custevent_ptg_recogi_cilindro_danado", label: "PTG - Recogí Cilindro Dañado" });
                    objCase.replaceCilindro = result.getValue({name: "custevent_ptg_repuse_cilindro_danado", label: "PTG - Repuse Cilindro Dañado" });
                    objCase.assignedId = result.getValue({name: "assigned", label: "Assigned To" });
                    objCase.assigned = result.getText({name: "assigned", label: "Assigned To" });
                    objCase.evidencePercent = result.getValue({name: "custevent_ptg_porcentaje_final_eviden", label: "PTG - PORCENTAJE FINAL EVIDENCIADO"});

                    return true;
                });

                if (searchResultCount > 0) {                    
                    response.success = true;
                    response.data = objCase;
                    log.debug('response', response)
                }

            } catch (error) {
                log.debug('error', error);
                response.message = error;
            }

            return response;
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
