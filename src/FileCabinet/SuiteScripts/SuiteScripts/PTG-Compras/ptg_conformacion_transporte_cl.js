/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search"], function (search) {

    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var ordenCompra = currentRecord.getValue({
                fieldId: 'custrecord_ptg_noviaje_csa_'
            }) || '';

            var Temp = 131;

            if (sublistFieldName === 'custrecord_ptg_noviaje_csa_') {
                debugger;

                var customrecord_ptg_entradatransporte_SearchObj = search.create({
                    type: "customrecord_ptg_entradatransporte_",
                    filters: [
                        ["custrecord_ptg_numviajecompra_", "anyof", ordenCompra]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_ptg_nombrechofer_",
                            label: "PTG - Nombre chofer"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_plantacompras_",
                            label: "PTG - Planta (compras)"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_provtransportista_",
                            label: "PTG - Proveedor Transportista"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_centroembartrans_",
                            label: "PTG -Centro embarcador entrada transporte"
                        }),
                        search.createColumn({
                            name: "internalid",
                            label: "ID interno"
                        })
                    ]
                });
                var resultCountCustom = customrecord_ptg_entradatransporte_SearchObj.run().getRange(0, 1);
                if (resultCountCustom.length > 0) {
                    var chofer = resultCountCustom[0].getValue({
                        name: 'custrecord_ptg_nombrechofer_'
                    });

                    var planta = resultCountCustom[0].getValue({
                        name: 'custrecord_ptg_plantacompras_'
                    });

                    var proveedor = resultCountCustom[0].getValue({
                        name: 'custrecord_ptg_provtransportista_'
                    });

                    var centroEmbarcador = resultCountCustom[0].getValue({
                        name: 'custrecord_ptg_centroembartrans_'
                    });

                    var id = resultCountCustom[0].getValue({
                        name: 'internalid'
                    });

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_nombredechofer_csa_',
                        value: chofer
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_plantdest_csa',
                        value: planta
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_proveedor_auto_csa_',
                        value: proveedor
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_centroembarcador_csa_',
                        value: centroEmbarcador
                    })

                    
                }

                var purchaseorderSearchObj = search.create({
                    type: "purchaseorder",
                    filters: [
                        ["type", "anyof", "PurchOrd"],
                        "AND",
                        ["custbody_ptg_no_consecutivo_", "anyof", ordenCompra],
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

                    var ceDestino = resultadoBusqueda[0].getValue({
                        name: 'custbody_ptg_centroembarcadordestino_'
                    });
                    var ce = resultadoBusqueda[0].getValue({
                        name: 'custbody_ptg_centroembarcador_'
                    });
                    log.audit('ceDestino', ceDestino);
                    log.audit('ce', ce);

                }

                var customrecord_ptg_precioporcentroembarcadSearchObj = search.create({
                    type: "customrecord_ptg_precioporcentroembarcad",
                    filters: [
                        ["custrecord_ptg_centroembarcador_precio_", "anyof", ce]
                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Nombre"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_precio_centroembarcador_",
                            label: "PTG - Precio"
                        })
                    ]
                });
                var ResultPrecio = customrecord_ptg_precioporcentroembarcadSearchObj.run().getRange(0, 1);
                if (ResultPrecio.length > 0) {
                    var precio = ResultPrecio[0].getValue({
                        name: 'custrecord_ptg_precio_centroembarcador_'
                    });

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_tarifporkilogramo_csa_',
                        value: precio
                    })

                }

                var customrecord_pt_tarifa_centro_emb_dest_SearchObj = search.create({
                    type: "customrecord_pt_tarifa_centro_emb_dest_",
                    filters: [
                        ["custrecord_ptg_centroembar_dest_tarifa_", "anyof", ceDestino],
                        "AND",
                        ["custrecord_ptg_tarifa_vigente_", "is", "T"]

                    ],
                    columns: [
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Nombre"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_tarifa_litros_",
                            label: "PTG - Tarifa $/Lts"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_tarifa_vigente_",
                            label: "PTG - Tarifa Vigente"
                        })
                    ]
                });
                var ResultTarifa = customrecord_pt_tarifa_centro_emb_dest_SearchObj.run().getRange(0, 1);
                if (ResultTarifa.length > 0) {
                    var tarifa = ResultTarifa[0].getValue({
                        name: 'custrecord_ptg_tarifa_litros_'
                    });
                    log.audit('tarida', tarifa)

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_tarifaxviajesencillo_csa_',
                        value: tarifa
                    })
                }

            }

            if (sublistName === 'recmachcustrecord_ptg_confirmacion_salida_' && sublistFieldName === 'custrecord_ptg_numembarqueprogra_confirm') {

                var embarqueP = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_numembarqueprogra_confirm') || '';
                log.audit('embarqueP', embarqueP)
              	var embarqueP1 = currentRecord.getCurrentSublistText('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_numembarqueprogra_confirm') || '';
                log.audit('embarqueP1', embarqueP1)
                debugger
                var customrecord_ptg_detallesalida_SearchObj = search.create({
                    type: "customrecord_ptg_detallesalida_",
                    filters: [
                        ["custrecord_ptg_embarqueprog_salida_", "is", embarqueP]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_ptg_embarqueprog_salida_",
                            label: "PTG - Embarque Programado"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_plantaoriginal_salida_",
                            label: "PTG - Planta Original"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_planta_destino_salida_",
                            label: "PTG - Planta Destino"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_num_entrega_salida_",
                            label: "PTG - #Entrega"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_embarque_salida_",
                            label: "PTG - Embarque"
                        }),
                        /*
                        search.createColumn({
                            name: "custrecord_ptg_pg_salida_",
                            label: "PTG - PG "
                        }),
                        */
                        search.createColumn({
                            name: "custrecord_ptg_sello1_salida_",
                            label: "PTG - Sello Colocado 1"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_sello2_salida_",
                            label: "PTG - Sello Colocado 2"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_presion_saida_",
                            label: "PTG - Presión"
                        }),
                        search.createColumn({
                            name: "custrecordptg_temp_salida_",
                            label: "PTG - Temp ºC"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesoentrada_salida_",
                            label: "PTG - Peso Entrada"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_peso_salida_salida",
                            label: "PTG - Peso Salida"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_kgs_pemex_salida_",
                            label: "PTG - Kgs Pemex"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesoincial_",
                            label: "PTG - Peso Inicial"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesofinal_salida_",
                            label: "PTG - Peso Final"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_dif_peso_pemex_salida_",
                            label: "PTG - Diferencia Peso Vs Pemex"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_detallesalida_",
                            label: "PTG - Detallesalida"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_nombre_chofer_salida_",
                            label: "PTG - Nombre Chofer"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_centroembarcador_salida",
                            label: "PTG - Nombre Centrro Embarcador"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_prov_trans_salida_",
                            label: "PTG - Proveedor Transportista"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_num_entrega_salida_",
                            label: "PTG - #PG Entrega"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesoincial_",
                            label: "PTG - Peso Inicial"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesofinal_salida_",
                            label: "PTG - Peso Final"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_peso_salida_salida",
                            label: "PTG - Peso Salida"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_precio_salida_",
                            label: "PTG - Precio"
                        }),
                        //
                    ]
                });
                /*
                var customrecord_ptg_detalleentradatranspo_SearchObj = search.create({
                    type: "customrecord_ptg_detalleentradatranspo_",
                    filters: [
                        ["custrecord_ptg_numembarqueprogram_", "anyof", embarqueP]
                    ],
                    columns: [
                        search.createColumn({
                            name: "custrecord_ptg_numembarqueprogram_",
                            label: "PTG - #Embarque Programado"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_plantaoriginal_",
                            label: "PTG - Planta Original"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_plantadestino_",
                            label: "PTG - Planta Destino"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_numentrega_",
                            label: "PTG - #Entrega"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_embarque_",
                            label: "PTG - Embarque"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_identificadordeunidadpg_",
                            label: "PTG - Identificador de Unidad(PG)"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_captanque90_",
                            label: "PTG - Cap Tanque 90%"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_kgspemex_",
                            label: "PTG - Kgs Pemex "
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_litros_",
                            label: "PTG - Litros"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_porcentajellenado_",
                            label: "PTG - % Llenado"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_presionkgcm_",
                            label: "PTG - Press Kg/Cm2"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_temcentigrados_",
                            label: "PTG - Temp Cº"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_pesoentrada_",
                            label: "PTG - Peso Entrada"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_sello1_",
                            label: "PTG - Sello 1 "
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_sello1violado_",
                            label: "PTG - Sello 1 violado"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_sello2_",
                            label: "PTG - Sello 2"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_sello2violado_",
                            label: "PTG - Sello 2 violado"
                        })
                    ]
                });
                */
                var searchResultCount = customrecord_ptg_detallesalida_SearchObj.run().getRange(0, 1);
                log.audit('searchResultCount', searchResultCount)
                if (searchResultCount.length > 0) {
                    var plantaO = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_plantaoriginal_salida_'
                    });

                    var planDestino = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_planta_destino_salida_'
                    });

                    var nEntrega = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_num_entrega_salida_'
                    })

                    var eembarque = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_embarque_salida_'
                    });
                    /*
                    var salida = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_pg_salida_'
                    });
                    */

                    var sello1 = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_sello1_salida_'
                    });

                    var sello2 = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_sello2_salida_'
                    });

                    var presion = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_presion_saida_'
                    });

                    var temperatura = searchResultCount[0].getValue({
                        name: 'custrecordptg_temp_salida_'
                    });

                    var pEntrada = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_pesoentrada_salida_'
                    });

                    var nombreChofer = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_nombre_chofer_salida_'
                    });

                    var centroEnbarcador = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_centroembarcador_salida'
                    });

                    var centroEmbarcadorText = searchResultCount[0].getText({
                        name: 'custrecord_ptg_centroembarcador_salida'
                    });

                    var Transportista = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_prov_trans_salida_'
                    });

                    var pgEntrega = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_num_entrega_salida_'
                    });

                    var pesoEntrada = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_pesoincial_'
                    });

                    var pesoSalida = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_pesofinal_salida_'
                    });

                    var pesoSalidaF = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_peso_salida_salida'
                    });

                    var pemex = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_kgs_pemex_salida_'
                    });

                    var dif = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_dif_peso_pemex_salida_'
                    });

                    var precioSalida = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_precio_salida_'
                    })

                    log.audit('centroEmbarcadorText', centroEmbarcadorText);


                    if (centroEnbarcador) {
                        var customrecord_ptg_precioporcentroembarcadSearchObj = search.create({
                            type: "customrecord_ptg_precioporcentroembarcad",
                            filters: [
                                ["custrecord_ptg_centroembarcador_precio_", "anyof", centroEnbarcador]
                            ],
                            columns: [
                                "custrecord_ptg_precio_centroembarcador_"
                            ]
                        });
                        var searchPrecioCe = customrecord_ptg_precioporcentroembarcadSearchObj.run().getRange(0, 1);
                        log.audit('searchPrecioCe', searchPrecioCe)
                        if (searchPrecioCe.length > 0) {
                            var precioKilogramo = searchPrecioCe[0].getValue({
                                name: 'custrecord_ptg_precio_centroembarcador_'
                            });

                            var formato = parseFloat(precioKilogramo)
                            log.audit('precioKilogramo', precioKilogramo)
                            log.audit('formato', formato)
                        }

                    }

                    var purchaseorderSearchObj = search.create({
                        type: "purchaseorder",
                        filters: [
                            ["type", "anyof", "PurchOrd"],
                            "AND",
                            ["custcol2", "is", embarqueP1],
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
                        var centroEnbarcadorDestino = searchResultCount[0].getValue({
                            name: "custcol_ptg_centro_e_destino_"
                        });
                    }

                    if(centroEnbarcadorDestino){
                        var customrecord_pt_tarifa_centro_emb_dest_SearchObj = search.create({
                            type: "customrecord_pt_tarifa_centro_emb_dest_",
                            filters:
                            [
                               ["custrecord_ptg_centroembar_dest_tarifa_","anyof",centroEnbarcadorDestino]
                            ],
                            columns:
                            [
                               "custrecord_ptg_tarifa_litros_"
                            ]
                         });
                         var resultCountCD = customrecord_pt_tarifa_centro_emb_dest_SearchObj.run().getRange(0, 1);

                         if(resultCountCD.length > 0){
                            var tarifaKg = resultCountCD[0].getValue({
                                name: "custrecord_ptg_tarifa_litros_"
                            });
                         }
                        
                    }


                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_plantaorigi_confirmacion_', plantaO);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_plantadestino_confirmacion_', planDestino);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_numentrega_confirmacion_', pgEntrega);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_embarque_confirmacion_', eembarque);
                    //currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pg_salida_', salida);
                    //currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pg_confirmacion_', salida);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_nom_chofer_confirm_', nombreChofer);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_centroembarcador_confirm_', centroEnbarcador);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_prov_transportista_confir', Transportista);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_sello1_confirmacion_', sello1);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_sello2_confirmacion_', sello2);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_presion_confirmacion_', presion);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_temp_confirmacion_', temperatura);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pesoentrada_confirmacion_', pEntrada);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pesosalida_confirmacion_', pesoSalidaF);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_kgs_pemex_confirmacion_', pemex);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_dif_peso_pemex_confirmaci', dif);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_tarifa_x_kgm_confirm_', formato);
                    //
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_tarifa_viaje_sencillo_con', tarifaKg);

                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pesofinal_confirmacion_', pesoSalida);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_pesoinicial_confirmacion_', pesoEntrada);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_confirmacion_salida_', 'custrecord_ptg_precion_confirmacion', precioSalida)
                }
            }
        } catch (error) {
            log.audit('error', error)
        }

    }

    return {
        fieldChanged: fieldChanged
    }
});