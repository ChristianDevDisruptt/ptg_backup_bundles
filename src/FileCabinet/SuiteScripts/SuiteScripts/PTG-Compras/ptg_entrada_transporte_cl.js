/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search", "N/record"], function (search, record) {

    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            /*
            if (sublistFieldName === 'custrecord_ptg_numviajecompra_') {
                debugger;
                var po = currentRecord.getValue({
                    fieldId: 'custrecord_ptg_numviajecompra_'
                }) || '';

                //var temp = 418223;
                
                var ordenLoad = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: temp,
                    isDynamic: true,
                });
                var centroEnbarcadorPo = ordenLoad.getValue({
                    fieldId: 'custbody_ptg_centroembarcador_'
                });
                var centroEnbarcadorPoText = ordenLoad.getText({
                    fieldId: 'custbody_ptg_centroembarcador_'
                });
                var centroEnbarcadorDestino = ordenLoad.getValue({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                })
                var centroEnbarcadorDestinoText = ordenLoad.getText({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                });
                

                var purchaseorderSearchObj = search.create({
                    type: "purchaseorder",
                    filters: [
                        ["type", "anyof", "PurchOrd"],
                        "AND",
                        ["custbody_ptg_no_consecutivo_", "anyof", po],
                        "AND",
                        ["mainline", "is", "T"]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custbody_ptg_centroembarcadordestino_",
                            label: "PTG - Centro Embarcador Destino"
                        }),
                        search.createColumn({
                            name: "custbody_ptg_centroembarcador_",
                            label: "PTG - Centro Embarcador"
                        }),
                        search.createColumn({
                            name: "internalid",
                            label: "ID interno"
                        })
                    ]
                });
                var resultadoBusqueda = purchaseorderSearchObj.run().getRange(0, 1);
                if (resultadoBusqueda.length > 0) {

                    var idTransaccion = resultadoBusqueda[0].getValue({
                        name: 'internalid'
                    });

                }

                var ordenLoad = record.load({
                    type: record.Type.PURCHASE_ORDER,
                    id: idTransaccion,
                    isDynamic: true,
                });

                var centroEnbarcadorPo = ordenLoad.getValue({
                    fieldId: 'custbody_ptg_centroembarcador_'
                });
                var centroEnbarcadorPoText = ordenLoad.getText({
                    fieldId: 'custbody_ptg_centroembarcador_'
                });
                var centroEnbarcadorDestino = ordenLoad.getValue({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                })
                var centroEnbarcadorDestinoText = ordenLoad.getText({
                    fieldId: 'custbody_ptg_centroembarcadordestino_'
                });


                if (centroEnbarcadorPo) {
                    var customrecord_mant_centroembarcador_SearchObj = search.create({
                        type: "customrecord_mant_centroembarcador_",
                        filters: [
                            ["custrecord_ptg_centroembarce_", "is", centroEnbarcadorPoText]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_ptg_proveedorce_",
                                label: "PTG - Proveedor Centro Embarcador"
                            })
                        ]
                    });
                    var searchResultCount = customrecord_mant_centroembarcador_SearchObj.run().getRange(0, 1);
                    if (searchResultCount.length > 0) {
                        var provedor = searchResultCount[0].getValue({
                            name: 'custrecord_ptg_proveedorce_'
                        });

                        log.audit('provedor', provedor)
                        currentRecord.setValue({
                            fieldId: 'custrecord_ptg_provtransportista_',
                            value: provedor
                        })
                    }
                }

                if (centroEnbarcadorDestino) {
                    var customrecord_ptg_centro_embar_destino_SearchObj = search.create({
                        type: "customrecord_ptg_centro_embar_destino_",
                        filters: [
                            ["custrecord_ptg_centro_embarcador_2", "anyof", centroEnbarcadorPo],
                            "AND",
                            ["name", "is", centroEnbarcadorDestinoText]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_ptg_planta_centro_embar_",
                                label: "PTG -Planta"
                            })
                        ]
                    });
                    var searchResult = customrecord_ptg_centro_embar_destino_SearchObj.run().getRange(0, 1);
                    if (searchResult.length > 0) {
                        var planta = searchResult[0].getValue({
                            name: "custrecord_ptg_planta_centro_embar_"
                        })
                        currentRecord.setValue({
                            fieldId: 'custrecord_ptg_plantacompras_',
                            value: planta
                        })
                    }

                }


                debugger

                currentRecord.setValue({
                    fieldId: 'custrecord_ptg_centroembartrans_',
                    value: centroEnbarcadorPo
                })

                //reccorrido y creacion de objeto 

                var objItems = {};
                var arrayItems = [];
                var lineas = ordenLoad.getLineCount({
                    sublistId: 'item'
                });

                for (var i = 0; i < lineas; i++) {
                    //embarque programdos, numero de embarque programado
                    // planta original,
                    // Identificador de unidad => PTG - PG
                    var embaque_programado = ordenLoad.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_drt_noembarque_programdo_',
                        line: i
                    });

                    var ptg_pg = ordenLoad.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol2',
                        line: i
                    });

                    objItems = {
                        embarque: embaque_programado,
                        ptg_pg: ptg_pg
                    }
                    log.audit('objItems', objItems);
                    arrayItems.push(objItems);
                }
                log.audit('arrayItems', arrayItems)
                log.audit('cantidad', arrayItems.length)
                
                for(var i = 0; i < arrayItems.length; i++){
                    log.audit('asas', arrayItems[i]['ptg_pg'])
                    //recmachcustrecord_ptg_det_entradatranspo_
                    currentRecord.selectNewLine({ 
                        sublistId: 'recmachcustrecord_ptg_det_entradatranspo_'      
                    }); 

                    currentRecord.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_ptg_det_entradatranspo_',
                        fieldId: 'custrecord_ptg_plantaoriginal_',
                        value: planta
                    });
                    
                    currentRecord.setCurrentSublistValue({
                        sublistId: 'recmachcustrecord_ptg_det_entradatranspo_',
                        fieldId: 'custrecord_ptg_embarque_',
                        value: arrayItems[i]['embarque']
                    });
                    


                    currentRecord.commitLine({
                        sublistId: 'recmachcustrecord_ptg_det_entradatranspo_'
                    });
                }
                
            }
            */

            if (sublistName === 'recmachcustrecord_ptg_det_entradatranspo_' && sublistFieldName === 'custrecord_ptg_numembarqueprogram_') {

                var pgLinea = currentRecord.getCurrentSublistText('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_numembarqueprogram_') || '';
                log.audit('resultCampana', pgLinea)
                debugger
                if (pgLinea) {

                    var purchaseorderSearchObj = search.create({
                        type: "purchaseorder",
                        filters: [
                            ["type", "anyof", "PurchOrd"],
                            "AND",
                            ["custcol2", "is", pgLinea],
                            "AND",
                            ["mainline", "is", "F"],
                            "AND",
                            ["custcol_ptg_pg_en_uso_", "is", "T"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "ordertype",
                                sort: search.Sort.ASC
                            }),
                            "tranid",
                            "internalid",
                            "location",
                            "custcol_ptg_plantadesvio_",
                            "item",
                            "quantity",
                            "custcol_ptg_centro_e_destino_",
                            "custcol_ptg_centroembarcador_"
                        ]
                    });
                    var searchResultCount = purchaseorderSearchObj.run().getRange(0, 1);

                    if (searchResultCount.length > 0) {
                        var ubicacion = searchResultCount[0].getValue({
                            name: "location"
                        });

                        var planta_destino = searchResultCount[0].getValue({
                            name: "custcol_ptg_plantadesvio_"
                        });

                        var centroEmbarcador = searchResultCount[0].getValue({
                            name: "custcol_ptg_centroembarcador_"
                        });

                        var centroEmbarcadorDestino = searchResultCount[0].getValue({
                            name: "custcol_ptg_centro_e_destino_"
                        });


                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_plantaoriginal_', ubicacion);
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_plantadestino_', planta_destino);
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_centroembarcador_enttrans', centroEmbarcador)
                    }

                    /*
                    var customrecord_ptg_embarprogramcons_SearchObj = search.create({
                        type: "customrecord_ptg_embarprogramcons_",
                        filters: [
                            ["internalid", "anyof", resultCampana]
                        ],
                        columns: [
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Nombre"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_identificadordeunidad_",
                                label: "PTG - Identificador de unidad"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_planta_",
                                label: "PTG - Planta"
                            })
                        ]
                    });
                    var searchResultCount = customrecord_ptg_embarprogramcons_SearchObj.run().getRange(0, 1);

                    if (searchResultCount.length > 0) {
                        var identificador = searchResultCount[0].getValue({
                            name: "custrecord_ptg_identificadordeunidad_"
                        });

                        var nombre = searchResultCount[0].getValue({
                            name: "name"
                        });

                        var ubicacion = searchResultCount[0].getValue({
                            name: "custrecord_ptg_planta_"
                        });

                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_identificadordeunidadpg_', identificador);
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_plantaoriginal_', ubicacion)

                    }
                    */
                }
            }

            if (sublistName === 'recmachcustrecord_ptg_det_entradatranspo_' && sublistFieldName === 'custrecord_ptg_kgspemex_') {
                //custrecord_ptg_kgspemex_
                var kgsPemex = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_kgspemex_') || '';

                var total = kgsPemex / .505;
                total = total.toFixed(3)

                currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_litros_', total);

            }

            if (sublistName === 'recmachcustrecord_ptg_det_entradatranspo_' && sublistFieldName === 'custrecord_ptg_densidad') {
                var centroEmbarcador1 = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_centroembarcador_enttrans') || '';
    
                if(centroEmbarcador1){
                    var customrecord_ptg_precioporcentroembarcadSearchObj = search.create({
                        type: "customrecord_ptg_precioporcentroembarcad",
                        filters:
                        [
                           ["custrecord_ptg_centroembarcador_precio_","anyof",centroEmbarcador1]
                        ],
                        columns:
                        [
                           search.createColumn({
                              name: "name",
                              sort: search.Sort.ASC,
                              label: "Nombre"
                           }),
                           search.createColumn({name: "custrecord_ptg_precio_centroembarcador_", label: "PTG - Precio"})
                        ]
                     });
                     var searchResultCount = customrecord_ptg_precioporcentroembarcadSearchObj.run().getRange(0, 1);
                     log.audit('searchResultCount.length', searchResultCount.length);
    
                     if (searchResultCount.length > 0) {
    
                        var precio = searchResultCount[0].getValue({
                            name: "custrecord_ptg_precio_centroembarcador_"
                        })
                        //custcol_ptg_densidad_
                        var dencidad = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_densidad') || 0;
    
                        log.audit('dencidad', dencidad);
                        var calculoDencidad = precio * dencidad;
                        log.audit('calculoDencidad', calculoDencidad);
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_precio_articulo', calculoDencidad);
                    
                    }
                }
            }

            
        } catch (error) {
            log.audit('error', error)
        }
    }

    function validateLine(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var returnTransaction = true;
            debugger
            if (sublistName === 'recmachcustrecord_ptg_det_entradatranspo_') {
                //custrecord_ptg_kgspemex_
                var centroEmbarcador1 = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_centroembarcador_enttrans') || '';
    
                if(centroEmbarcador1){
                    var customrecord_ptg_precioporcentroembarcadSearchObj = search.create({
                        type: "customrecord_ptg_precioporcentroembarcad",
                        filters:
                        [
                           ["custrecord_ptg_centroembarcador_precio_","anyof",centroEmbarcador1]
                        ],
                        columns:
                        [
                           search.createColumn({
                              name: "name",
                              sort: search.Sort.ASC,
                              label: "Nombre"
                           }),
                           search.createColumn({name: "custrecord_ptg_precio_centroembarcador_", label: "PTG - Precio"})
                        ]
                     });
                     var searchResultCount = customrecord_ptg_precioporcentroembarcadSearchObj.run().getRange(0, 1);
                     log.audit('searchResultCount.length', searchResultCount.length);
    
                     if (searchResultCount.length > 0) {
    
                        var precio = searchResultCount[0].getValue({
                            name: "custrecord_ptg_precio_centroembarcador_"
                        })
                        //custcol_ptg_densidad_
                        var dencidad = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_densidad') || 0;
    
                        log.audit('dencidad', dencidad);
                        var calculoDencidad = precio * dencidad;
                        log.audit('calculoDencidad', calculoDencidad);
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_det_entradatranspo_', 'custrecord_ptg_precio_articulo', calculoDencidad);
                        returnTransaction = true;
                    }
                }
            } 
        } catch (error_validateLine) {
            log.audit('error_validateLine', error_validateLine)
        }

        return returnTransaction;
    }

    return {
        fieldChanged: fieldChanged,
        //validateLine: validateLine
    }
});