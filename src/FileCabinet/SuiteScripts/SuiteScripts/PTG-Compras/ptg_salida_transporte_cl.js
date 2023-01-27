/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/search", 'N/ui/message', 'N/ui/dialog', 'N/error'], function (search, message, dialog, error) {
    function fieldChanged(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var objLineas = {};
            var arrayLineas = [];
            var ordenCompra = currentRecord.getValue({
                fieldId: 'custrecord_ptg_numvijae_sa_'
            }) || '';
            /*
            if (sublistFieldName === 'custrecord_ptg_numvijae_sa_') {
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
                        fieldId: 'custrecord_ptg_nombredelchofer_',
                        value: chofer
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_planta_sa_',
                        value: planta
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_proveedortransportista_sa',
                        value: proveedor
                    })

                    currentRecord.setValue({
                        fieldId: 'custrecord_ptg_centroembarcador_salida_',
                        value: centroEmbarcador
                    })
                }

            }
            */

            if (sublistName === 'recmachcustrecord_ptg_detallesalida_' && sublistFieldName === 'custrecord_ptg_embarqueprog_salida_') {
                debugger
                var embarqueP = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_embarqueprog_salida_') || '';
                log.audit('embarqueP', embarqueP)
                var customrecord_ptg_detalleentradatranspo_SearchObj = search.create({
                    type: "customrecord_ptg_detalleentradatranspo_",
                    filters: [
                        ["custrecord_ptg_numembarqueprogram_", "is", embarqueP]
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
                        //search.createColumn({
                        //    name: "custrecord_ptg_identificadordeunidadpg_",
                        //    label: "PTG - Identificador de Unidad(PG)"
                        //}),
                        search.createColumn({
                            name: "custrecord_ptg_nombrechofer_",
                            label: "PTG - Nombre del Chofer"
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
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_centroembarcador_enttrans",
                            label: "PTG - Centro Embarcador"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_transportista_entrada_",
                            label: "PTG - transportista"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_embarque_",
                            label: "PTG - Embarque"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_litros_",
                            label: "PTG - Litros"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_precio_articulo",
                            label: "PTG - Precio"
                        })

                        //custrecord_ptg_embarque_
                    ]
                });
                var searchResultCount = customrecord_ptg_detalleentradatranspo_SearchObj.run().getRange(0, 1);
                log.audit('searchResultCount', searchResultCount)
                if (searchResultCount.length > 0) {
                    var plantaO = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_plantaoriginal_'
                    });
                    var nEntrega = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_numentrega_'
                    })

                    var plantaDestino = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_plantadestino_'
                    })

                    var eembarque = searchResultCount[0].getText({
                        name: 'custrecord_ptg_numembarqueprogram_'
                    });
                    /*
                    var salida =  searchResultCount[0].getValue({
                        name: 'custrecord_ptg_identificadordeunidadpg_'
                    });
                    */

                    var sello1 = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_sello1_'
                    });

                    var sello2 = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_sello2_'
                    });

                    var presion = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_presionkgcm_'
                    });

                    var temperatura = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_temcentigrados_'
                    });

                    var pEntrada = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_pesoentrada_'
                    });

                    var chofer = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_nombrechofer_'
                    });

                    var centroEmbarcador = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_centroembarcador_enttrans'
                    });

                    var transportista = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_transportista_entrada_'
                    });

                    var ptg_embarque = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_embarque_'
                    })

                    //custrecord_ptg_litros_

                    var pemex = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_kgspemex_'
                    });

                    var litros = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_litros_'
                    });

                    var precio = searchResultCount[0].getValue({
                        name: 'custrecord_ptg_precio_articulo'
                    });
                    var dif = 0;
                    if (pEntrada) {
                        dif = pEntrada - pemex;
                    }


                    //
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_plantaoriginal_salida_', plantaO);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_planta_destino_salida_', plantaDestino);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_num_entrega_salida_', nEntrega);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_embarque_salida_', eembarque);
                    //currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pg_salida_', salida);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_sello1_salida_', sello1);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_sello2_salida_', sello2);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_presion_saida_', presion);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecordptg_temp_salida_', temperatura);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pesoentrada_salida_', pEntrada);
                    //currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_kgs_pemex_salida_', pemex);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_kgs_pemex_salida_', pemex);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_litros_2', litros);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_dif_peso_pemex_salida_', dif);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_nombre_chofer_salida_', chofer);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_centroembarcador_salida', centroEmbarcador);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_prov_trans_salida_', transportista);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_embarque_salida_', ptg_embarque);
                    currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_precio_salida_', precio);
                }
            }

            if (sublistName === 'recmachcustrecord_ptg_detallesalida_' && sublistFieldName === 'custrecord_ptg_peso_salida_salida') {
                debugger
                var pesoSalida = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_peso_salida_salida') || '';
                log.audit('pesoSalida', pesoSalida)

                if (pesoSalida) {
                    var pesoEntrada = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pesoentrada_salida_') || '';
                    log.audit('pesoEntrada', pesoEntrada)

                    var precioUnificado = pesoEntrada - pesoSalida
                    log.audit('precioUnificado', precioUnificado)

                    //custrecord_ptg_pesofinal_confirmacion_
                    //currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pesoincial_', precioUnificado);
                }
            }

        } catch (error) {
            log.audit('error', error);
        }
    }

    function validateLine(context) {
        try {
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var sublistFieldName = context.fieldId;
            var returnTransaction = true;
            debugger
            if (sublistName === 'recmachcustrecord_ptg_detallesalida_') {
                //custrecord_ptg_kgspemex_
                var pesoEntrada1 = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pesoentrada_salida_');

                var pesoSalidada1 = currentRecord.getCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_peso_salida_salida');

                if (pesoEntrada1 && pesoSalidada1) {
                    if (pesoSalidada1 > pesoEntrada1) {
                        showmessage({
                                title: "Error",
                                message: "EL peso de Salida es mayor al peso de Entrada " + "  " + pesoSalidada1,
                                type: message.Type.ERROR
                            },
                            5000
                        );

                        returnTransaction = true;
                    } else {
                        var precioUnificado = pesoEntrada1 - pesoSalidada1;
                        currentRecord.setCurrentSublistValue('recmachcustrecord_ptg_detallesalida_', 'custrecord_ptg_pesoincial_', precioUnificado);
                    }
                }
            }
        } catch (error_validateLine) {
            log.audit('error_validateLine', error_validateLine)
        }

        return returnTransaction;
    }

    function showmessage(param_message, param_duration) {
        try {
            if (false) {
                var m = {
                    title: "My Title",
                    message: "My Message",
                    cause: 'cause',
                    type: message.Type.CONFIRMATION
                };
                var myMsg = message.create(param_message);

                myMsg.show({
                    duration: param_duration
                });
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options)
            }

        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        fieldChanged: fieldChanged,
        validateLine: validateLine
    }
});