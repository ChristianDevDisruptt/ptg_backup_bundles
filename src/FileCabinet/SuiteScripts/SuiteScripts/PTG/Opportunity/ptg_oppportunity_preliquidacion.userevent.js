/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

            //Si detecta cambio en el campo de custbody_ptg_zonadeprecioop_
            try{
                const rlRecords= {
                   pagos: {
                    "id":"customrecord_ptg_pagos"
                   ,"total":"custrecord_ptg_total_servicio"
                   ,"sublistPagos":"recmachcustrecord_ptg_registro_pagos",
                   "lineaTotal":"custrecord_ptg_total"
                },
                   zonaPrecio:{
                    id:"customrecord_ptg_zonasdeprecio_",
                    precio:"custrecord_ptg_precio_"
                
                },

                };

                

                const newRecord = scriptContext.newRecord;
               
                const newZonaPrecio = newRecord.getValue({ fieldId: 'custbody_ptg_zonadeprecioop_' });
                const oldRecord = scriptContext.oldRecord;
                const oldZonaPrecio = oldRecord.getValue({ fieldId: 'custbody_ptg_zonadeprecioop_' });
                log.debug('oldZonaPrecio', oldZonaPrecio);
                log.debug('newZonaPrecio', newZonaPrecio);


                if (newZonaPrecio && oldZonaPrecio != newZonaPrecio) {

                    //Obtiene el precio de la zona de precio
                    const zonaPrecio = search.lookupFields({
                        type: rlRecords.zonaPrecio.id,
                        id: newZonaPrecio,
                        columns: [rlRecords.zonaPrecio.precio]
                    });
                    const precio = zonaPrecio[rlRecords.zonaPrecio.precio];
                    //Actualiza el precio a nivel item
                    if (precio) {

                        const items = newRecord.getLineCount({ sublistId: 'item' });
                        for (let i = 0; i < items; i++) {
                            newRecord.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                line: i,
                                value: precio,
                                ignoreFieldChange: false
                            });

                        
                        }

                        //el total de la transaccion se guarda en el campo de json pagos
                        var total = newRecord.getValue({ fieldId: 'total' });
                        log.debug("total",total);
                        newRecord.setValue({ fieldId: 'custbody_ptg_opcion_pago_obj', value: JSON.stringify({"pago":[{"metodo_txt":"Efectivo","tipo_pago":"1","monto":total,"folio":""}]} ) });
 
                        var idPagos= newRecord.getValue({ fieldId: 'custbody_ptg_registro_pagos' });

                        var recCustPayments= record.load({ type: 'customrecord_ptg_pagos', isDynamic: true,id:idPagos });
                        recCustPayments.setValue({ fieldId: rlRecords.pagos.total, value: total });

                        var sublist = "recmachcustrecord_ptg_registro_pagos";
                        var totalLines = recCustPayments.getLineCount(sublist);
                        //Obtenemos la primera linea
                        recCustPayments.selectLine({ sublistId: sublist, line: 0 });
                        //Actualizamos el monto
                        recCustPayments.setCurrentSublistValue({ sublistId: sublist, fieldId: rlRecords.pagos.lineaTotal, value: total });
                        for(var i = totalLines; i > 1; i++){
                            //borrar la linea
                            recCustPayments.removeLine({ sublistId: sublist, line: i });
                        }

                        recCustPayments.save();
                    }
                }
            }catch(e){
                log.debug('Error', e);
            }
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
            log.debug("afterSubmit", "afterSubmit");


        }

        return {  beforeSubmit, afterSubmit }

    });
