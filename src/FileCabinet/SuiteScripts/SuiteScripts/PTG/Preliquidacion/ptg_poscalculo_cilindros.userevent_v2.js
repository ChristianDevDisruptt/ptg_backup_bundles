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
            log.audit("type", type);
            if(type == "edit"){
            const relRecords = {
                "preliquidacion": {
                    id: "customrecord_ptg_preliquicilndros_",
                    lineaVentasCilindro: "recmachcustrecord_ptg_optpreliq_",


                },
                'ventaCilindros': {
                    id: 'customrecord_ptg_registrooportunidad_',
                    valorZona: "custrecord_ptg_ro_zona_precio",
                    opportunity: "custrecord_ptg_oportunidad_",
                    //  totalItem: "",
                    //precio: "",
                    total: "custrecord_ptg_total_",
                    parent: "custrecord_ptg_optpreliq_"
                    //taxTotal: ""

                },

            }

            //Obtener lineas de preliquidacion

            const sublist = relRecords.preliquidacion.lineaVentasCilindro;
            var context = scriptContext.newRecord;

            var sublistLine = context.getLineCount(sublist);
            log.debug('sublistLine', sublistLine);
            var preliquidacion = {};


            var lineas = search.create({
                type: relRecords.ventaCilindros.id,
                filters: [{
                    name: relRecords.ventaCilindros.parent,
                    operator: 'anyof',
                    values: context.id
                },
                {
                    name: relRecords.ventaCilindros.valorZona,
                    operator: 'noneof',
                    values: ['@NONE@']
                }],
                columns: [
                    {
                        name: relRecords.ventaCilindros.valorZona,
                    }
                ]
            });
            lineas.run().each(function (result) {
                var valorZona = result.getValue(relRecords.ventaCilindros.valorZona);
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


            var searchPreliquidacion = search.create({
                type: relRecords.ventaCilindros.id,
                filters: [{
                    name: 'internalid',
                    operator: 'anyof',
                    values: preliquidacionIds
                }],
                columns: [{
                    name: relRecords.ventaCilindros.opportunity,
                    sort: search.Sort.ASC
                }]
            });

            searchPreliquidacion.run().each(function (result) {
                const opportunityId = result.getValue({
                    name: relRecords.ventaCilindros.opportunity
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
                    name: "custrecord_ptg_precio_kg",
                    sort: search.Sort.ASC
                }
                ]
            });
            searchZona.run().each(function (result) {
                zonaPrecios[result.id] = result.getValue({
                    name: "custrecord_ptg_precio_kg"
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

            var updated = module.evaluarOportunidad({ oportunidades: filteredOpp, recordType: "ventaCilindros" });
            log.audit('updated', updated);


            /*
            
           {"442130":{"valorZona":"194","precio":"200","preliquidacion":"4396","total":"6960.00","taxTotal":960,"totalItem":"6000.00"}}		
            */

            var arrUpdated = Object.keys(updated).map(function (key) {
                var item = updated[key];
                var idRecPreliquida = item.preliquidacion;
                var precio = item.precio;
                var unitario = item.unitario;

                var total = item.total;
                var taxTotal = item.taxTotal;
                var totalItem = item.totalItem;

                log.debug('idRecPreliquida', idRecPreliquida);
                log.debug('precio', precio);
                log.debug('total', total);
                log.debug('taxTotal', taxTotal);

                var relatedFields = {};
                //  relatedFields[relRecords.ventaCilindros.precio] = precio;
                relatedFields[relRecords.ventaCilindros.total] = total;
                //  relatedFields[relRecords.ventaCilindros.taxTotal] = taxTotal;
                //  relatedFields[relRecords.ventaCilindros.totalItem] = totalItem;
                log.debug('relatedFields', relatedFields);



                var recVenta = record.submitFields({
                    type: relRecords.ventaCilindros.id,
                    id: idRecPreliquida,
                    values: relatedFields,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
                log.debug('recVenta', recVenta);

                return updated[key];
            }
            );


            log.audit('arrUpdated', arrUpdated);
            if (arrUpdated.length > 0) {
                var agruparResultadoPorItem = arrUpdated.reduce(function (acc, cur) {

                    var key = cur.item + '-' + cur.valorZona;
                    if (!acc[key]) {
                        acc[key] = {
                            item: cur.item,
                            quantity: cur.quantity,
                            total: cur.total,
                            taxTotal: cur.taxTotal,
                            totalItem: cur.totalItem,
                            precio: cur.precio,
                            unitario: cur.unitario,
                            valorZona: cur.valorZona,

                        };
                    } else {
                        acc[key].quantity += cur.quantity;
                        acc[key].total += cur.total;
                        acc[key].taxTotal += cur.taxTotal;
                        acc[key].totalItem += cur.totalItem;
                    }
                    return acc;
                }
                    , {});
                log.audit('agruparResultadoPorItem', agruparResultadoPorItem);

                var arrAgrupado = Object.keys(agruparResultadoPorItem).map(function (key) {
                    return agruparResultadoPorItem[key];
                }
                );

                var items = arrAgrupado.map(function (item) {
                    return item.item;
                }
                );

                log.audit('arrAgrupado', arrAgrupado);

                var summary = {};
                var allOpportunities = [];
                var oppRelationZona = {};

                var searchOpportunity = search.create({
                    type: "customrecord_ptg_registrooportunidad_",
                    filters: [{
                        name: "custrecord_ptg_optpreliq_",
                        operator: "anyof",
                        values: context.id
                    },
                    ],
                    columns: [{
                        name: "internalid",
                        sort: search.Sort.ASC
                    },
                    {
                        name: "custrecord_ptg_oportunidad_",
                    },
                    {
                        name: "custbody_ptg_zonadeprecioop_",
                        join: "custrecord_ptg_oportunidad_",
                        label: "Zona de precio"
                    },
                    ]
                });
                searchOpportunity.run().each(function (result) {
                    var opportunityId = result.getValue({
                        name: "custrecord_ptg_oportunidad_"
                    });
                    allOpportunities.push(opportunityId);
                    oppRelationZona[opportunityId] = result.getValue({
                        name: "custbody_ptg_zonadeprecioop_",
                        join: "custrecord_ptg_oportunidad_",
                        label: "Zona de precio"
                    });

                    return true;
                }
                );
                log.audit('allOpportunities', allOpportunities);
                log.audit('items', items);
                var searchItemsOnPurchases = search.create({
                    type: "opportunity",
                    filters: [
                        ["internalid", "anyof", allOpportunities],
                        "AND",
                        ["item", "anyof", items],
                        "AND",
                        ["item.type", "anyof", "InvtPart"]


                    ],
                    columns: [
                        {
                            name: "item",
                            sort: search.Sort.ASC
                        },
                        {
                            name: "quantity",
                            sort: search.Sort.ASC
                        },
                        {
                            name: "total",
                            sort: search.Sort.ASC
                        },
                        {
                            name: "rate",
                        }


                    ]
                });
                /*
                ● “PTG - ZONA DE PRECIO” (zona de precio seleccionada
                    ● “PTG - VENTA DETALLE VENTAS” (la suma de todos los cilindros por cada tipo que se vendieron en la zona de precio en específico)
                   “PTG - LLENOS DETALLE VENTAS” (la resta de “PTG - TOTALES DETALLE VENTAS” menos “PTG - VENTA DETALLE VENTAS”)..
                    ● “PTG - REGRESO LLENOS CALCULADOS DETALLE VENTAS” (es el mismo dato que está en el campo “PTG - LLENOS DETALLE VENTAS”)
                   . ● “PTG - LTS DETALLE VENTAS” (la suma de la capacidad del cilindro por todas las ventas realizadas).
                   ● “PTG PRECIO UNITARIO DETALLE VENTAS” (precio unitario de la zona de precio).
                     ● “PTG - IMPORTE DETALLE VENTAS” (precio unitario por la cantidad que se ha vendido). 
                   ● “PTG - TOTAL DETALLE VENTAS” (se considera la suma del importe más los impuestos).
                 */

                searchItemsOnPurchases.run().each(function (result) {
                    var item = result.getValue({
                        name: "item"
                    });
                    var quantity = Number(result.getValue({
                        name: "quantity"
                    }));
                    var rate = Number(result.getValue({
                        name: "rate"
                    }));
                    var total = Number(result.getValue({
                        name: "total"
                    }));
                    var zona = oppRelationZona[result.id];
                    var key = item + '-' + zona;
                    if (!summary[key]) {
                        summary[key] = {
                            item: item,
                            quantity: quantity,
                            total: total,
                            rate: rate,
                            zona: zona
                        };
                    } else {
                        summary[key].quantity += quantity;
                        summary[key].total += total;
                    }
                    return true;
                }
                );
                log.audit('summary', summary);

                var searchSummary = search.create({
                    type: "customrecord_ptg_detalledeventas_",
                    filters: [{
                        name: "custrecord_ptg_numviaje_detalleventas_",
                        operator: "anyof",
                        values: context.id
                    },
                    {
                        name: "custrecord_ptg_tipocilindro_detalleventa",
                        operator: "anyof",
                        values: items
                    }
                    ],

                    columns: [{
                        name: "custrecord_ptg_tipocilindro_detalleventa",
                        sort: search.Sort.ASC,
                        label: "item"

                    },
                    {
                        name: "custrecord_ptg_pu_detalleventas_",
                        label: "Precio de venta"
                    },
                    {
                        name: "custrecord_ptg_importe_detalleventas__2",
                        label: "Importe"
                    },
                    {
                        name: "custrecord_ptg_total_detalleventas__2",
                        label: "Total"

                    },
                    {
                        name: "custrecord_ptg_venta_detalleventas_",
                        label: "Cantidad"
                    },
                    {
                        name: "custrecord_ptg_zonadepreciovents_",
                        label: "Zona de precio"
                    }

                    ],
                });
                var erase = [];
                searchSummary.run().each(function (result) {

                    var item = result.getValue({
                        name: "custrecordptg_tipocilindro_ventaenvases_"
                    });

                    var zona = result.getValue({
                        name: "custrecord_ptg_zonadepreciovents_"
                    });
                    var id = result.id;
                    var key = item + '-' + zona;
                    if (summary[key]) {
                        summary[key].id = id;
                    } else {
                        erase.push(id);
                    }
                    return true;
                }
                );
                log.audit('summaryFiltered', summary);

                var summaryToMap = Object.keys(summary).map(function (key) {
                    return summary[key];
                }
                );

                var itemSummary = summaryToMap.reduce(function (prev, curr) {
                    prev[curr.item] = prev[curr.item] || {
                        item: curr.item,
                        quantity: 0,
                        total: 0,
                        zona: curr.zona
                    };
                    prev[curr.item].quantity += Number(curr.quantity);
                    prev[curr.item].total += curr.total;
                    return prev;
                }
                , {});
                log.audit('itemSummary', itemSummary);

                for (var i in summary) {
                    if (summary[i].key) {
                        var reg = record.submitFields({
                            type: 'customrecord_ptg_detalledeventas_',
                            id: summary[i].id,
                            values: {
                                custrecord_ptg_venta_detalleventas_: summary[i].quantity,
                                custrecord_ptg_total_detalleventas__2: summary[i].total,
                                custrecord_ptg_importe_detalleventas__2: summary[i].total / summary[i].quantity,
                                custrecord_ptg_pu_detalleventas_: summary[i].rate,
                                custrecord_ptg_zonadepreciovents_: summary[i].zona,
                                custrecord_ptg_totales_detalleventas_:itemSummary[ summary[i].item].quantity
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                    }else{
                        var reg = record.create({
                            type: 'customrecord_ptg_detalledeventas_',
                            isDynamic: true,

                        });
                        reg.setValue({
                            fieldId: "name",
                            value: "1.1"
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_numviaje_detalleventas_',
                            value: context.id
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_tipocilindro_detalleventa',
                            value: summary[i].item
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_pu_detalleventas_',
                            value: summary[i].rate
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_venta_detalleventas_',
                            value: summary[i].quantity
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_total_detalleventas__2',
                            value: summary[i].total
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_importe_detalleventas__2',
                            value: summary[i].total / summary[i].quantity
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_zonadepreciovents_',
                            value: summary[i].zona
                        });
                        reg.setValue({
                            fieldId: 'custrecord_ptg_totales_detalleventas_',
                            value: itemSummary[ summary[i].item].quantity
                        });

                        var id = reg.save();
                    }


                }
                for (var i in erase) {
                    var reg = record.delete({
                        type: 'customrecord_ptg_detalledeventas_',
                        id: erase[i]
                    });
                }

            }













            /*
            
                        var customrecord_ptg_detalledeventas_SearchObj = search.create({
                            type: "customrecord_ptg_detalledeventas_",
                            filters:
                                [
                                    ["custrecord_ptg_numviaje_detalleventas_", "anyof", context.id],
                                    "AND",
                                    ["custrecord_ptg_tipocilindro_detalleventa", "anyof", items]
            
                                ],
                            columns:
                                [
                                    search.createColumn({ name: "custrecord_ptg_tipocilindro_detalleventa", label: "PTG - Tipo de cilindro detalle ventas", sort: search.Sort.ASC }),
                                    search.createColumn({ name: "custrecord_ptg_pu_detalleventas_", label: "PTG - Precio Unitario detalle ventas"}),
                                    search.createColumn({ name: "custrecord_ptg_importe_detalleventas__2", label: "PTG - Importe Detalle ventas"}),
                                    search.createColumn({ name: "custrecord_ptg_total_detalleventas__2", label: "PTG - Total detalle ventas"}),
                                    search.createColumn({ name: "custrecord_ptg_zonadepreciovents_", label: "PTG - Zona de Precio"})
                                ]
                        });
                        var searchResultCount = customrecord_ptg_detalledeventas_SearchObj.runPaged().count;
                        log.debug("customrecord_ptg_detalledeventas_SearchObj result count", searchResultCount);
                        customrecord_ptg_detalledeventas_SearchObj.run().each(function (result) {
            
                            var item = result.getValue({ name: "custrecord_ptg_tipocilindro_detalleventa" });
                            var ventaZona = result.getValue({ name: "custrecord_ptg_zonadepreciovents_" });
            
                            var key = item + '-' + ventaZona;
                            var precio = result.getValue({ name: "custrecord_ptg_pu_detalleventas_" });
                            var importe = result.getValue({ name: "custrecord_ptg_importe_detalleventas__2" });
                            var total = result.getValue({ name: "custrecord_ptg_total_detalleventas__2" });
                            var totalZona = 1;
            
            
                            if (agruparResultadoPorItem[key]) {
            
                               // PTG - VENTA DETALLE VENTAS”
                            }
            
            
            
            
                            return true;
                        });
            */

        }
    }

        //METODO PARA EVALUAR OPPORTUNIDAD



        return { afterSubmit }

    });
