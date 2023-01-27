/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search',
    "SuiteScripts/PTG/Utilities/ptg_core_preliquidacion.module"],
    /**
   * @param{record} record
   * @param{search} search
   */
    (record, search, module) => {


        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

            /*
            Registros a afectar :
            Registro custom de linea = preliquidacion 
            Registro de oportunidad = opportunity
            Linea de oportunidad = item
            Registro inicial custom de linea = preliquidacion
            */
            //Contexto registro personalizado

            const type = scriptContext.type;
            const relRecords = {
                "preliquidacion": {
                    id: "customrecord_ptg_detalle_despachador_",
                    detalleCarburacion: "recmachcustrecord_ptg_preliqui_rel_vts",
                    lineaVentasEstacionario: "recmachcustrecord_ptg_despdetalle_",


                },
                'detalleCarburacion': {
                    id: 'customrecord_ptg_detalle_despachador_',
                    valorZona: "custrecord_ptg_dd_zona_precios",
                    opportunity: "custrecord_ptg_oportunidad_carburacion",
                    totalItem: "custrecord_ptg_importe_despachador_",
                    precio: "custrecord_ptg_preciounidespachador_",
                    total: "custrecord_ptg_total_despachador_",
                    taxTotal: "custrecord_ptg_impuestodespachador_"

                },

            }

            //Obtener lineas de preliquidacion

            const sublist = relRecords.preliquidacion.lineaVentasEstacionario;
            log.debug("type", type);
            var context = scriptContext.newRecord;

            var sublistLine = context.getLineCount(sublist);
            log.debug('sublistLine', sublistLine);
            var preliquidacion = {};


            var lineas = search.create({
                type: relRecords.detalleCarburacion.id,
                filters: [{
                    name: 'custrecord_ptg_detallecrburacion_',
                    operator: 'anyof',
                    values: context.id
                },
                {
                    name: "custrecord_ptg_dd_zona_precios",
                    operator: 'noneof',
                    values: ['@NONE@']
                }],
                columns: [
                    {
                        name: "custrecord_ptg_dd_zona_precios",
                    }
                ]
            });
            lineas.run().each(function (result) {
                var valorZona = result.getValue(relRecords.detalleCarburacion.valorZona);
                var preliquidacionLine = result.id;
                preliquidacion[preliquidacionLine] = {
                    valorZona: valorZona,
                    id: preliquidacionLine
                };

                return true;
            });



            //Obterner ids de preliquidacion

            log.debug('preliquidacion', preliquidacion);

            var preliquidacionIds = Object.keys(preliquidacion);
            log.debug('preliquidacionIds', preliquidacionIds);

            if (preliquidacionIds.length > 0) {
                var searchPreliquidacion = search.create({
                    type: relRecords.detalleCarburacion.id,
                    filters: [{
                        name: 'internalid',
                        operator: 'anyof',
                        values: preliquidacionIds
                    }],
                    columns: [{
                        name: relRecords.detalleCarburacion.opportunity,
                        sort: search.Sort.ASC
                    }]
                });

                searchPreliquidacion.run().each(function (result) {
                    const opportunityId = result.getValue({
                        name: relRecords.detalleCarburacion.opportunity
                    });
                    preliquidacion[result.id].opportunity = opportunityId;
                    return true;
                }
                );
                log.debug('preliquidacion', preliquidacion);

                var arrPreliquidacion = Object.keys(preliquidacion).map(function (key) {
                    return preliquidacion[key];
                }
                );
                var opportunityList = arrPreliquidacion.map(function (item) {
                    return item.opportunity;
                }
                );
                log.debug('opportunityList', opportunityList);
                var valorZonaList = arrPreliquidacion.map(function (item) {
                    return item.valorZona;
                }
                );

                log.debug('valorZonaList', valorZonaList);

                //Busqueda donde el nuevo valor zona no es igual al de el registro de oportunidad
                var searchOportunidad = search.create({
                    type: "opportunity",
                    filters: [{
                        name: "internalid",
                        operator: "anyof",
                        values: opportunityList
                    }],
                    columns: [{
                        name: "internalid",
                        sort: search.Sort.ASC
                    },
                    {
                        name: "CUSTBODY_PTG_ZONADEPRECIOOP_",
                    },
                    search.createColumn({
                        name: "custrecord_ptg_precio_",
                        join: "CUSTBODY_PTG_ZONADEPRECIOOP_",
                        label: "PTG - PRECIO"
                    })
                    ]
                });

                var zonaPrecios = {};
                var searchZona = search.create({
                    type: "customrecord_ptg_zonasdeprecio_",
                    filters: [{
                        name: "internalid",
                        operator: "anyof",
                        values: valorZonaList
                    }],
                    columns: [{
                        name: "internalid",
                        sort: search.Sort.ASC
                    },
                    {
                        name: "custrecord_ptg_precio_",
                        sort: search.Sort.ASC
                    }
                    ]
                });
                searchZona.run().each(function (result) {
                    zonaPrecios[result.id] = result.getValue({
                        name: "custrecord_ptg_precio_"
                    });
                    return true;
                }
                );
                log.debug('zonaPrecios', zonaPrecios);

                var filteredOpp = {}
                searchOportunidad.run().each(function (result) {

                    var opportunityId = result.id;
                    var valorZona = result.getValue({
                        name: "CUSTBODY_PTG_ZONADEPRECIOOP_"
                    });

                    var index = opportunityList.indexOf(opportunityId);

                    log.debug('valorZona' + opportunityId, valorZona);
                    log.debug('valorZonaList[index]' + opportunityId, valorZonaList[index]);

                    if (valorZona != valorZonaList[index]) {

                        filteredOpp[opportunityId] = {
                            valorZona: valorZonaList[index],
                            precio: zonaPrecios[valorZonaList[index]],
                            preliquidacion: arrPreliquidacion[index].id
                        }
                    }
                    return true;
                }
                );
                log.audit('filteredOpp1', filteredOpp);

                var updated = module.evaluarOportunidad({ oportunidades: filteredOpp, recordType: "detalleCarburacion" });
                log.audit('updated', updated);


                /*
                
                {"414629":{"valorZona":"214","precio":"800","preliquidacion":349,"total":"27840.00","taxTotal":3840,"totalItem":"24000.00"}}	
                */
                for (var i in updated) {
                    var item = updated[i];
                    var idRecPreliquida = item.preliquidacion;
                    var precio = item.precio;
                    var total = item.total;
                    var taxTotal = item.taxTotal;
                    var totalItem = item.totalItem;

                    log.debug('idRecPreliquida', idRecPreliquida);
                    log.debug('precio', precio);
                    log.debug('total', total);
                    log.debug('taxTotal', taxTotal);

                    var relatedFields = {};
                    relatedFields[relRecords.detalleCarburacion.precio] = precio;
                    relatedFields[relRecords.detalleCarburacion.total] = total;
                    relatedFields[relRecords.detalleCarburacion.taxTotal] = taxTotal;
                    relatedFields[relRecords.detalleCarburacion.totalItem] = totalItem;
                    log.debug('relatedFields', relatedFields);



                    var recVenta = record.submitFields({
                        type: relRecords.detalleCarburacion.id,
                        id: idRecPreliquida,
                        values: relatedFields,
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });
                    log.debug('recVenta', recVenta);

                }
            }

        }
        //METODO PARA EVALUAR OPPORTUNIDAD



        return { afterSubmit }

    });
