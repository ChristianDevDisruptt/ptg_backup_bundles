/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/runtime', 'N/search', 'N/record'],
    /**
 * @param{runtime} runtime
 * @param{search} search
 */
    (runtime, search, record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            try {
                log.debug('scriptContext', scriptContext);
                log.debug('runtime', runtime.executionContext);
                log.debug('scriptContext type', scriptContext.type);
                let id = scriptContext.newRecord.id;
                log.debug('id customer', id);
                let customer = record.load({
                    type: record.Type.CUSTOMER,
                    id: id
                })

                let isContract = customer.getValue({fieldId : 'custentity_ptg_alianza_comercial_cliente'});
                log.debug('isContract', isContract)
                if (runtime.executionContext == 'RESTLET' && isContract == 1 && (scriptContext.type == 'create' || scriptContext.type == scriptContext.UserEventType.CREATE)) {
                    

                    let customerSearchObj = search.create({
                        type: "customer",
                        filters:
                            [
                                ["custentity_ptg_numero_contrato", "isnotempty", ""]
                            ],
                        columns:
                            [
                                search.createColumn({ name: "datecreated", label: "Date Created" }),
                                search.createColumn({
                                    name: "custentity_ptg_numero_contrato",
                                    sort: search.Sort.DESC,
                                    label: "PTG - NUMERO DE CONTRATO"
                                })
                            ]
                    });
                    let searchResultCount = customerSearchObj.runPaged().count;
                    log.debug("customerSearchObj result count", searchResultCount);
                    let lastNumber;
                    customerSearchObj.run().each(function (result) {
                        // .run().each has a limit of 4,000 results
                        lastNumber = Number(result.getValue({
                            name: "custentity_ptg_numero_contrato",
                            sort: search.Sort.DESC,
                            label: "PTG - NUMERO DE CONTRATO"
                        }))                        
                        return false;
                    });

                    log.debug('lastNumber', lastNumber);                    

                    if (!!lastNumber) {
                        let lastNumberNew = lastNumber + 1;
                        customer.setValue({
                            fieldId: 'custentity_ptg_numero_contrato',
                            value: lastNumberNew
                        });

                        customer.save();
                        log.debug('se agrego contrato consecutivo', lastNumberNew);
                    } else {
                        customer.setValue({
                            fieldId: 'custentity_ptg_numero_contrato',
                            value: 1
                        });

                        customer.save();
                        log.debug('se agrego contrato', 'numero 1');
                    }
                }

            } catch (error) {
                log.debug('error', error)
            }
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    });
