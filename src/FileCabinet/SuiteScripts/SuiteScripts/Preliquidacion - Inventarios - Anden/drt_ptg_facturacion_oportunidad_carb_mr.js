/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Facturacion Oport Carburacion MR
 * Script id: customscript_drt_ptg_factur_opor_carb_mr
 * Deployment id: customdeploy_drt_ptg_factur_opor_carb_mr
 * Applied to: 
 * File: drt_ptg_facturacion_oportunidad_carb_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_oportunidad_a_factura_car'
            }) || '';
            log.audit("id_search 1", id_search);

            var arrayColumns = [
                search.createColumn({name: "custrecord_ptg_idoportunidad_", join: "custrecord_ptg_rel_op_preliq_", label: "PTG - Oportunidad" }),
                search.createColumn({name: "custrecord_ptg_idtransaccion_carburacion", join: "CUSTRECORD_PTG_REL_OP_PRELIQ_", label: "PTG - Id Transaccion"}),
            ];
            log.audit("arrayColumns", arrayColumns);

            var arrayFilters = [
                ['internalid', search.Operator.ANYOF, id_search]
             ];
             log.audit("arrayFilters", arrayFilters);
            
                respuesta = search.create({
                    type: 'customrecord_ptg_preliqestcarburacion_',
                    columns: arrayColumns,
                    filters: arrayFilters
                });

                var respuestaResultCount = respuesta.runPaged().count;
                log.debug("respuestaResultCount", respuestaResultCount);

        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            log.audit({
                title: 'context map',
                details: JSON.stringify(context)
            });
            var objValue = JSON.parse(context.value);
            log.audit("objValueM", objValue);

            var objValue3 = objValue.id;
            log.audit("objValue3M", objValue3);

            var objValue20 = objValue.values;
            log.audit("objValue20M", objValue20);

            var objValueTransaccion = objValue.values["custrecord_ptg_idtransaccion_carburacion.CUSTRECORD_PTG_REL_OP_PRELIQ_"];
            log.audit("objValueTransaccion", objValueTransaccion);
            var idTransaccion = objValueTransaccion.value;
            log.audit("idTransaccion", idTransaccion);

            var tipoArticuloCilindro = 0;
            var publicoGeneral = 0;
            var cuentaAjusteInventario = 0;
            var unidad10 = 0;
            var unidad20 = 0;
            var unidad30 = 0;
            var unidad45 = 0; 
            var formularioFacturaPTG = 0;
            var clienteTicketCar = 0;
            var servicioCarburacion = 0;
            var gasLPUnidades = 0;
            var efectivoId = 0;
            var prepagoBanorteId = 0;
            var valeId = 0;
            var cortesiaId = 0;
            var tarjetaCreditoId = 0;
            var tarjetaDebitoId = 0;
            var multipleId = 0;
            var prepagoTransferenciaId = 0;
            var creditoClienteId = 0;
            var reposicionId = 0;
            var saldoAFavorId = 0;
            var consumoInternoId = 0;
            var prepagoBancomerId = 0;
            var prepagoHSBCId = 0;
            var prepagoBanamexId = 0;
            var prepagoSantanderId = 0;
            var prepagoScotianId = 0;
            var bonificacionId = 0;
            var ticketCardId = 0;
            var chequeBancomerId = 0;
            var recirculacionId = 0;
            var canceladoId = 0;
            var rellenoId = 0;
            var transferenciaId = 0;
            var traspasoId = 0;
            var chequeSantanderId = 0;
            var chequeScotianId = 0;
            var chequeHSBCId = 0;
            var chequeBanamexId = 0;
            var chequeBanorteId = 0;
            var tarjetaCreditoBancomerId = 0;
            var tarjetaCreditoHSBCId = 0;
            var tarjetaCreditoBanamexId = 0;
            var tarjetaDebitoBanamexId = 0;
            var tarjetaDebitoBancomerId = 0;
            var tarjetaDebitoHSBCId = 0;
            var publicoGeneralTXT = "";
            var clienteTicketCarTXT = "";
            


            if (runtime.envType === runtime.EnvType.SANDBOX) {
                tipoArticuloCilindro = 1;
                publicoGeneral = 14508;
                cuentaAjusteInventario = 218;
                unidad10 = 24;
                unidad20 = 25;
                unidad30 = 26;
                unidad45 = 27; 
                formularioFacturaPTG = 286;
                clienteTicketCar = 322997;
                servicioCarburacion = 3;
                gasLPUnidades = 4693;
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                tipoArticuloCilindro = 1;
                publicoGeneral = 27041;
                cuentaAjusteInventario = 218;
                unidad10 = 12;
                unidad20 = 13;
                unidad30 = 14;
                unidad45 = 15;
                formularioFacturaPTG = 308;
                clienteTicketCar = 322997;
                servicioCarburacion = 3;
                gasLPUnidades = 4216;
                publicoGeneralTXT = "Publico General";
                clienteTicketCarTXT = "Ticket Card";
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
                tarjetaCreditoBancomerId = 31;
                tarjetaCreditoHSBCId = 32;
                tarjetaCreditoBanamexId = 33;
                tarjetaDebitoBanamexId = 34;
                tarjetaDebitoBancomerId = 35;
                tarjetaDebitoHSBCId = 36;
            }

            if(idTransaccion){
                //BÚSQUEDA GUARDADA: PTG - Tipo transaccion
                var ordenTransladoObj = search.create({
                    type: "transferorder",
                    filters: [
                       ["internalid","anyof",idTransaccion], 
                       "AND", 
                       ["mainline","is","T"], 
                       "AND", 
                       ["type","anyof","TrnfrOrd"]
                    ],
                    columns: [
                       search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                });
                var ordenTransladoObjCount = ordenTransladoObj.runPaged().count;
                if(ordenTransladoObjCount > 0){
                    var ordenTransladoObjResult = ordenTransladoObj.run().getRange({
                        start: 0,
                        end: ordenTransladoObjCount,
                    });
                    (idOrdenTraslado = ordenTransladoObjResult[0].getValue({name: "internalid", label: "Internal ID"}));
                    
                    //BÚSQUEDA GUARDADA: PTG - Aportar cilindros a camión
                    var aportacionObj = search.create({
                        type: "customrecord_ptg_aportarcil_a_camion_",
                        filters: [ ["custrecord_ptg_transaccion_traslado_carb","anyof", idOrdenTraslado] ],
                        columns: [search.createColumn({name: "internalid", label: "Internal ID"})]
                    });
                    var aportacionObjCount = aportacionObj.runPaged().count;
                    var aportacionObjResult = aportacionObj.run().getRange({
                        start: 0,
                        end: aportacionObjCount,
                    });
                    (idRegistroAportacion = aportacionObjResult[0].getValue({name: "internalid", label: "Internal ID"}));
                    var objUpdateAportacion = {
                        custrecord_ptg_liquidado_aportacion: true,
                    }
                    record.submitFields({
                        type: "customrecord_ptg_aportarcil_a_camion_",
                        id: idRegistroAportacion,
                        values: objUpdateAportacion,
                    });



                } else {
                    var recepcionObj = search.create({
                        type: "itemreceipt",
                        filters: [
                           ["internalid","anyof",idTransaccion], 
                           "AND", 
                           ["mainline","is","T"], 
                           "AND", 
                           ["type","anyof","ItemRcpt"]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", label: "Internal ID"})
                        ]
                     });
                     var recepcionObjCount = recepcionObj.runPaged().count;
                     if(recepcionObjCount > 0){
                        var recepcionObjResult = recepcionObj.run().getRange({
                            start: 0,
                            end: recepcionObjCount,
                        });
                        (idRecepcion = recepcionObjResult[0].getValue({name: "internalid", label: "Internal ID"}));
                        //BÚSQUEDA GUARDADA: PTG - Recibir Cilindros
                        var recibirObj = search.create({
                            type: "customrecord_ptg_rec_aporcil_est_carb_",
                            filters: [["custrecord_ptg_recepcion_articulo","anyof",idRecepcion]],
                            columns: [search.createColumn({name: "internalid", label: "Internal ID"})]
                        });
                        var recibirObjCount = recibirObj.runPaged().count;
                        var recibirObjResult = recibirObj.run().getRange({
                            start: 0,
                            end: recibirObjCount,
                        });
                        (idRegistroRecepcion = recibirObjResult[0].getValue({name: "internalid", label: "Internal ID"}));
                        var objUpdateRecepcion = {
                            custrecord_ptg_liquidado: true,
                        }
                        record.submitFields({
                            type: "customrecord_ptg_rec_aporcil_est_carb_",
                            id: idRegistroRecepcion,
                            values: objUpdateRecepcion,
                        });
                     }
                }
            }


            var objValue2 = objValue.values["custrecord_ptg_idoportunidad_.custrecord_ptg_rel_op_preliq_"];
            log.audit("objValue2M", objValue2);

            var idOportunidad = objValue2.value;
            log.audit("idOportunidadM", idOportunidad);


            var tipoPagoAFacturar = 0;
            var updOportunidad = {};
            var oporObj = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOportunidad
            });

            var registroPagos = oporObj.getValue("custbody_ptg_registro_pagos");
            var pagoOrdenObj = search.create({
                type: "customrecord_ptg_pagos_oportunidad",
                filters: [["custrecord_ptg_registro_pagos","anyof",registroPagos]],
                columns: [
                    search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                    search.createColumn({name: "custrecord_ptg_total", summary: "SUM", sort: search.Sort.DESC, label: "PTG - Total"})
                ]
            });
            var pagoOrdenObjResult = pagoOrdenObj.run().getRange({
                start: 0,
                end: 2,
            });
            (tipoPagoAFacturar = pagoOrdenObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}));
            log.audit("tipoPagoAFacturar", tipoPagoAFacturar);
            updOportunidad = {
                custbody_forma_pago_facturar: tipoPagoAFacturar
            }
            var updtOportunidad = record.submitFields({
                id: idOportunidad,
                type: record.Type.OPPORTUNITY,
                values: updOportunidad
            });
            log.audit("updtOportunidad", updtOportunidad);


            var oportunidadObj = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOportunidad
            });
            log.audit("oportunidadObj", oportunidadObj);
            var solicitaFactura = oportunidadObj.getValue("custbody_ptg_cliente_solicita_factura");
            log.audit("solicitaFactura", solicitaFactura);
            var numViaje = oportunidadObj.getValue('custbody_ptg_numero_viaje');
            var opcionPagoObj = oportunidadObj.getValue("custbody_ptg_opcion_pago_obj");
            log.audit("opcionPagoObj", opcionPagoObj);
            var ubicacion = oportunidadObj.getValue("custbody_ptg_estacion_carburacion");
            log.audit("ubicacion", ubicacion);
            var cliente = oportunidadObj.getValue("entity");
            var opcionDePago = oportunidadObj.getValue("custbody_ptg_opcion_pago");
            log.audit("opcionDePago", opcionDePago);
            var subsidiariaOportunidad = oportunidadObj.getValue("subsidiary");
            //var tipoPago = oportunidadObj.getValue("custbody_ptg_opcion_pago");
            var tipoPago = oportunidadObj.getValue("custbody_forma_pago_facturar");
            var zonaPrecioID = oportunidadObj.getValue("custbody_ptg_zonadeprecioop_");
            var zonaPrecioObj = record.load({
                type: "customrecord_ptg_zonasdeprecio_",
                id: zonaPrecioID,
            });
            var precioPorLitro = zonaPrecioObj.getValue("custrecord_ptg_precio_");
            var nombreClienteAFacturar = "";
            var clienteObj = record.load({
                type: search.Type.CUSTOMER,
                id: cliente
            });
            var clienteAFacturar = clienteObj.getValue("custentity_razon_social_para_facturar");
            nombreClienteAFacturar = clienteAFacturar;

            var articuloArray = [];
            var cantidadArray = [];
            var cantidadArrayPF = [];
            var cantidadArrayFin = [];
            var unidadArray = [];
            var rateArray = [];
            var amountArray = [];
            var costoPromedio = [];
            var cantidadEnLitros = [];
            var totalKilos = 0;
            var cilindrosTransform = false;
            var cfdiCliente = 0;
            var lineasArticulos = oportunidadObj.getLineCount({sublistId: "item"});
            
            for (var t = 0; t < lineasArticulos; t++){
                articuloArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "item",
                    line: t,
                });
                log.audit("articuloArray[t]", articuloArray[t]);
    
                cantidadArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: t,
                });
                log.audit("cantidadArray[t]", cantidadArray[t]);

                cantidadArrayPF[t] = parseFloat(cantidadArray[t]);
                log.audit("cantidadArrayPF[t]", cantidadArrayPF[t]);

                cantidadArrayFin[t] = cantidadArrayPF[t] * -1;
                log.audit("cantidadArrayFin[t]", cantidadArrayFin[t]);

                rateArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "rate",
                    line: t,
                });
                log.audit("rateArray[t]", rateArray[t]);

                var itemCilObj = record.load({
                    type: search.Type.INVENTORY_ITEM,
                    id: articuloArray[t],
                });
                var tipoArticulo = itemCilObj.getValue("custitem_ptg_tipodearticulo_");
                log.audit("tipoArticulo", tipoArticulo);
                costoPromedio[t] = itemCilObj.getValue("averagecost");
                log.audit("costoPromedio[t]", costoPromedio[t]);
                if(tipoArticulo == tipoArticuloCilindro){
                    cilindrosTransform = true;
                    var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
                    log.emergency("capacidadArticulo", capacidadArticulo);
                    if(capacidadArticulo == 10){
                        unidadArray[t] = unidad10;
                    } else if(capacidadArticulo == 20){
                        unidadArray[t] = unidad20;
                    } else if(capacidadArticulo == 30){
                        unidadArray[t] = unidad30;
                    }  else if(capacidadArticulo == 45){
                        unidadArray[t] = unidad45;
                    }
                    log.audit("unidad: L:" + t, unidadArray[t]);
                    totalKilos = capacidadArticulo * cantidadArray[t];
                    log.audit("totalKilos", totalKilos);
                    cantidadEnLitros[t] = totalKilos / 0.54;

                    amountArray[t] = oportunidadObj.getSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        line: t,
                    });
                    log.audit("amountArray[t]", amountArray[t]);
                }
                log.emergency("articuloArray[t]", articuloArray[t]);
            }


            if(tipoPago == consumoInternoId || tipoPago == canceladoId){
                //SS: PTG - Gas - Consumo Interno
                log.audit("Consumo interno o cancelado")
                var detalleGasObj = search.create({
                    type: "customrecord_ptg_detalle_despachador_",
                    filters: [
                       ["custrecord_ptg_oportunidad_carburacion","anyof",idOportunidad], "AND", 
                       ["custrecord_ptg_numero_viaje_destino","noneof","@NONE@"]
                    ],
                    columns: [
                        search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                        search.createColumn({name: "custrecord_ptg_numero_viaje_destino", label: "PTG - Numero de viaje destino"})
                    ]
                 });
                 var detalleGasObjCount = detalleGasObj.runPaged().count;
                 log.audit("detalleGasObjCount", detalleGasObjCount);
                 if(detalleGasObjCount > 0){
                    var detalleGasObjResult = detalleGasObj.run().getRange({
                        start: 0,
                        end: 3,
                    });
                    numeroViajeDestino = detalleGasObjResult[0].getValue({name: "custrecord_ptg_numero_viaje_destino", label: "PTG - Numero de viaje destino"});

                    var tablaViajeObj = record.load({
                        id: numeroViajeDestino,
                        type: "customrecord_ptg_tabladeviaje_enc2_",
                    });
                    var ruta = tablaViajeObj.getValue("custrecord_ptg_ruta");

                    var oportunidadUpd = {
                        custbody_ptg_num_viaje_destino: numeroViajeDestino,
                    }

                    record.submitFields({
                        type: record.Type.OPPORTUNITY,
                        id: idOportunidad,
                        values: oportunidadUpd,
                    });


                    var inventoryTransfer = record.create({
                        type: record.Type.INVENTORY_ADJUSTMENT,
                        isDynamic: true,
                    });
                    inventoryTransfer.setValue("subsidiary", subsidiariaOportunidad);
                    inventoryTransfer.setValue("account", cuentaAjusteInventario);
                    inventoryTransfer.setValue("adjlocation", ubicacion);
                    for(var u = 0; u < lineasArticulos; u++){
                        inventoryTransfer.selectLine("inventory", u);
                        if(cilindrosTransform){
                            inventoryTransfer.setCurrentSublistValue("inventory", "item", gasLPUnidades);
                            inventoryTransfer.setCurrentSublistValue("inventory", "units", unidadArray[u]);
                        } else {
                            inventoryTransfer.setCurrentSublistValue("inventory", "item", articuloArray[u]);
                        }
                        inventoryTransfer.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArrayFin[u]);
                        if(tipoPago == consumoInternoId){
                            inventoryTransfer.setCurrentSublistValue("inventory", "location", ruta);
                            inventoryTransfer.setCurrentSublistValue("inventory", "unitcost", costoPromedio[u]);
                        } else {
                            inventoryTransfer.setCurrentSublistValue("inventory", "location", ubicacion);
                        }
                        inventoryTransfer.commitLine("inventory");
                    }
                    var idInventoryTransfer = inventoryTransfer.save();
                    log.debug({
                        title: "TRANSACCION CREADA Ajuste de Inventario OP "+ idOportunidad,
                        details: "Id Saved: " + idInventoryTransfer,
                    });
                 }


                

            } else if(tipoPago != recirculacionId && tipoPago != canceladoId){
            var facturaObj = record.transform({
                fromType: record.Type.OPPORTUNITY,
                fromId: idOportunidad,
                toType: record.Type.INVOICE,
                isDynamic: false
            });

            facturaObj.setValue("customform", formularioFacturaPTG);
           
            if(!solicitaFactura){
                facturaObj.setValue("entity", publicoGeneral);
                cfdiCliente = 3;
                log.audit("cfdiCliente NO solicita", cfdiCliente);
                nombreClienteAFacturar = publicoGeneralTXT;
            } else {
                var entityObj = record.load({
                    type: search.Type.CUSTOMER,
                    id: cliente,
                });
                log.audit("entityObj", entityObj);

                cfdiCliente = entityObj.getValue("custentity_disa_uso_de_cfdi_") || 3;
                log.audit("cfdiCliente solicita", cfdiCliente);
            }

            if(tipoPago == ticketCardId){
                facturaObj.setValue("entity", clienteTicketCar);
                cliente = clienteTicketCar;

                var entityObj = record.load({
                    type: search.Type.CUSTOMER,
                    id: cliente,
                });
                log.audit("entityObj", entityObj);

                cfdiCliente = entityObj.getValue("custentity_disa_uso_de_cfdi_") || 3;
                log.audit("cfdiCliente solicita ticket car", cfdiCliente);
                nombreClienteAFacturar = clienteTicketCarTXT;
            }
            log.audit("cliente", cliente);
            facturaObj.setValue("custbody_ptg_registro_pre_liq_carb", objValue3);
            facturaObj.setValue("location", ubicacion);
            facturaObj.setValue("custbody_ptg_tipo_servicio", servicioCarburacion);
            facturaObj.setValue("custbody_ptg_opcion_pago_obj", opcionPagoObj);
            facturaObj.setValue("custbody_ptg_nombre_cliente", cliente);
            facturaObj.setValue("custbody_mx_cfdi_usage", cfdiCliente);
            facturaObj.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);
            // facturaObj.setValue("custbody_psg_ei_status", 3); //ESTADO DEL DOCUMENTO ELECTRÓNICO
            // facturaObj.setValue("custbody_psg_ei_template", 132); //PLANTILLA DEL DOCUMENTO ELECTRÓNICO
            // facturaObj.setValue("custbody_psg_ei_sending_method", 11); //MÉTODO DE ENVÍO DE DOCUMENTOS ELECTRÓNICOS

            var formaPagoSAT = searchFormaPagoSAT(subsidiariaOportunidad, tipoPago);
            log.emergency("formaPagoSAT", formaPagoSAT);

            facturaObj.setValue("custbody_mx_txn_sat_payment_method", formaPagoSAT);

            if(tipoPago == efectivoId){ //EFECTIVO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 1); //01 - Efectivo
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            } 
            else if(tipoPago == prepagoBanorteId || tipoPago == prepagoTransferenciaId || tipoPago == prepagoBancomerId || tipoPago == prepagoHSBCId || tipoPago == prepagoBanamexId || tipoPago == prepagoSantanderId || tipoPago == prepagoScotianId){ //PREPAGO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == cortesiaId){ //CORTESIA
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == tarjetaCreditoId || tipoPago == tarjetaCreditoBancomerId || tipoPago == tarjetaCreditoHSBCId || tipoPago == tarjetaCreditoBanamexId){ //TARJETA CREDITO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 4); //04 - Tarjeta de Crédito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == tarjetaDebitoId || tipoPago == tarjetaDebitoBanamexId || tipoPago == tarjetaDebitoBancomerId || tipoPago == tarjetaDebitoHSBCId){ //TARJETA DEBITO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            } 
            else if(tipoPago == creditoClienteId){ //CREDITO CLIENTE
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == reposicionId){ //REPOSICION
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == bonificacionId){ //BONIFICACION
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == chequeBancomerId || tipoPago == chequeSantanderId || tipoPago == chequeScotianId || tipoPago == chequeHSBCId || tipoPago == chequeBanamexId || tipoPago == chequeBanorteId){ //CHEQUE    
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 2); //02 - CHEQUE NOMINATIVO
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == ticketCardId){ //TICKET CARD
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 24); //29 - Tarjeta de Servicios
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == transferenciaId){ //TRANSFERENCIA
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 3); //03 - Transferencia Electrónica de Fondos
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else {
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }

            var itemCount = facturaObj.getLineCount('item');
            //log.audit("itemCount", itemCount);
            log.audit("cilindrosTransform", cilindrosTransform);

            for (var i = 0; i < itemCount; i++) {
                if(cilindrosTransform){
                    facturaObj.setSublistValue("item", "item", i, gasLPUnidades);
                    facturaObj.setSublistValue("item", "units", i, unidadArray[i]);
                    facturaObj.setSublistValue("item", "rate", i, amountArray[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_cantidad_litros", i, cantidadEnLitros[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_precio_unitario", i, precioPorLitro);
                } else {
                    facturaObj.setSublistValue("item", "item", i, articuloArray[i]);
                    facturaObj.setSublistValue("item", "rate", i, rateArray[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_cantidad_litros", i, cantidadArray[i]);
                    if(articuloArray[i] == gasLPUnidades){
                        //facturaObj.setSublistValue("item", "custcol_ptg_cantidad_litros", i, cantidadArray[i]);
                        facturaObj.setSublistValue("item", "custcol_ptg_precio_unitario", i, precioPorLitro);
                    } else {
                        facturaObj.setSublistValue("item", "custcol_ptg_precio_unitario", i, rateArray[i]);
                    }
                }
                facturaObj.setSublistValue("item", "location", i, ubicacion);
            }

            var recObjID = facturaObj.save({
                ignoreMandatoryFields: true
            });
            log.debug("TRANSACCION CREADA Factura Creada OP "+ idOportunidad, recObjID);

            //SE HACE EL PROCESO DE GENERAR DOCUMENTO Y TIMBRADO
            var urlStlt = url.resolveScript({
                scriptId: "customscript_drt_ei_auto_stlt",
                deploymentId: "customdeploy_drt_global_invoice_suitelet",
                returnExternalUrl: true,
                params: {
                    id_factura: recObjID
                }
            });
            log.audit("urlStlt", urlStlt);

            var link = https.get({
                url: urlStlt
            });
            log.audit("link", link);

        }

        var objOportunidadUpdate = {
            custbody_ptg_registro_pre_liq_carb: objValue3,
            custbody_ptg_liquidado: true,
        };

        var updateFacturada = record.submitFields({
            type: record.Type.OPPORTUNITY,
            id: idOportunidad,
            values: objOportunidadUpdate,
        });

        log.audit("TRANSACCION ACTUALIZADA " +idOportunidad, updateFacturada);


            context.write({
                key: recObjID,
                value: recObjID
            });
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idFactura = JSON.parse(context.key);
            log.audit("idFactura", idFactura);

            var liquidacion = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_oportunidad_a_factura_car'
            }) || '';
            log.audit("liquidacion", liquidacion);

            var efectivoId = 0;
            var prepagoBanorteId = 0;
            var valeId = 0;
            var cortesiaId = 0;
            var tarjetaCreditoId = 0;
            var tarjetaDebitoId = 0;
            var multipleId = 0;
            var prepagoTransferenciaId = 0;
            var creditoClienteId = 0;
            var reposicionId = 0;
            var saldoAFavorId = 0;
            var consumoInternoId = 0;
            var prepagoBancomerId = 0;
            var prepagoHSBCId = 0;
            var prepagoBanamexId = 0;
            var prepagoSantanderId = 0;
            var prepagoScotianId = 0;
            var bonificacionId = 0;
            var ticketCardId = 0;
            var chequeBancomerId = 0;
            var recirculacionId = 0;
            var canceladoId = 0;
            var rellenoId = 0;
            var transferenciaId = 0;
            var traspasoId = 0;
            var chequeSantanderId = 0;
            var chequeScotianId = 0;
            var chequeHSBCId = 0;
            var chequeBanamexId = 0;
            var chequeBanorteId = 0;
            var tarjetaCreditoBancomerId = 0;
            var tarjetaCreditoHSBCId = 0;
            var tarjetaCreditoBanamexId = 0;
            var tarjetaDebitoBanamexId = 0;
            var tarjetaDebitoBancomerId = 0;
            var tarjetaDebitoHSBCId = 0;
            var articuloServicio = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
                articuloServicio = 4832;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
                tarjetaCreditoBancomerId = 31;
                tarjetaCreditoHSBCId = 32;
                tarjetaCreditoBanamexId = 33;
                tarjetaDebitoBanamexId = 34;
                tarjetaDebitoBancomerId = 35;
                tarjetaDebitoHSBCId = 36;
                articuloServicio = 4218;
            }



            var invoiceObj = record.load({
                type: record.Type.INVOICE,
                id: idFactura,
            });
            //log.audit("invoiceObj", invoiceObj);

            var tipoPagoObj = invoiceObj.getValue("custbody_ptg_opcion_pago_obj");
            var clienteFactura = invoiceObj.getValue("entity");
            var subsidiaria = invoiceObj.getValue("subsidiary");
            var ubicacion = invoiceObj.getValue("location");
            var clientePrepago = invoiceObj.getValue("custbody_ptg_nombre_cliente");
            var importeAdeudadoFactura = invoiceObj.getValue("amountremainingtotalbox");
            var oportunidadFactura = invoiceObj.getValue("opportunity");
            var objValueTipoPago = invoiceObj.getValue("custbody_forma_pago_facturar");
            var objValue = JSON.parse(tipoPagoObj);
            var objValue2 = objValue;
            var objValue3 = objValue2.pago;
            var objCount = objValue3.length;
            var objValueMonto = objValue3[0].monto;
            log.audit("objValue3", objValue3);
            log.audit("objCount", objCount);
            log.audit("objValueTipoPago", objValueTipoPago);
            log.audit("objValueMonto", objValueMonto);

            
            if(objValueTipoPago == efectivoId || objValueTipoPago == tarjetaCreditoId || objValueTipoPago == tarjetaDebitoId || objValueTipoPago == chequeBancomerId || objValueTipoPago == chequeSantanderId || objValueTipoPago == chequeScotianId || objValueTipoPago == chequeHSBCId || objValueTipoPago == chequeBanamexId || objValueTipoPago == chequeBanorteId || objValueTipoPago == tarjetaCreditoBancomerId || objValueTipoPago == tarjetaCreditoHSBCId || objValueTipoPago == tarjetaCreditoBanamexId || objValueTipoPago == tarjetaDebitoBanamexId || objValueTipoPago == tarjetaDebitoBancomerId || objValueTipoPago == tarjetaDebitoHSBCId){
                log.audit("UN PAGO, EFECTIVO ó TARJETA DE CREDITO ó TARJETA DE DEBITO ó CHEQUE");
                var pagoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: false
                });

                var cuenta = searchCuenta(subsidiaria, objValueTipoPago);
                log.emergency("cuenta 543", cuenta);

                pagoObj.setValue("account", cuenta);
    
                var pagoObjID = pagoObj.save({
                    ignoreMandatoryFields: true
                });
                log.debug("Pago Creado con: "+objValueTipoPago, pagoObjID);
            }

            
            else if (objValueTipoPago == prepagoBanorteId || objValueTipoPago == prepagoTransferenciaId || objValueTipoPago == prepagoBancomerId || objValueTipoPago == prepagoHSBCId || objValueTipoPago == prepagoBanamexId || objValueTipoPago == prepagoSantanderId || objValueTipoPago == prepagoScotianId){
                log.audit("UN PAGO Prepago");

                //Búsqueda Guardada: PTG - Detalle despachador - Prepago Gas
                var prepagoGasObj = search.create({
                    type: "customrecord_ptg_detalle_despachador_",
                    filters: [
                       ["custrecord_ptg_detallecrburacion_","anyof",liquidacion], "AND", 
                       ["custrecord_ptg_oportunidad_carburacion","anyof",oportunidadFactura]
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_prepago_despachador", label: "PTG - Prepago"}),
                       search.createColumn({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_DESPACHADOR", label: "Cuenta (principal)"})
                    ]
                });
                var prepagoGasObjCount = prepagoGasObj.runPaged().count;
                if(prepagoGasObjCount > 0){
                    log.audit("Búsqueda Gas");
                    var prepagoGasObjResult = prepagoGasObj.run().getRange({
                        start: 0,
                        end: 3,
                    });
                    idPagoPrepago = prepagoGasObjResult[0].getValue({name: "custrecord_ptg_prepago_despachador", label: "PTG - Prepago"});
                    log.emergency("idPagoPrepago Gas", idPagoPrepago);
                    idCuenta = prepagoGasObjResult[0].getValue({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_DESPACHADOR", label: "Cuenta (principal)"});
                    log.emergency("idCuenta Gas", idCuenta);
                } else {
                    //Búsqueda Guardada: PTG - Detalle Gas - Prepago Cilindros
                    var prepagoCilindroObj = search.create({
                        type: "customrecord_ptg_det_gas_tipo_pago_",
                        filters: [
                           ["custrecord_ptg_id_oportunidad_gas","anyof", oportunidadFactura], "AND", 
                           ["custrecord_ptg_detgas_tipo_pago_","anyof", liquidacion]
                        ],
                        columns: [
                           search.createColumn({name: "custrecord_ptg_prepago_detalle_gas", label: "PTG - Prepago"}),
                           search.createColumn({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_DETALLE_GAS", label: "Cuenta (principal)"})
                        ]
                     });
                     var prepagoCilindroObjCount = prepagoCilindroObj.runPaged().count;
                     if(prepagoCilindroObjCount > 0){
                        log.audit("Búsqueda Cilindro");
                        var prepagoCilindroObjResult = prepagoCilindroObj.run().getRange({
                            start: 0,
                            end: 3,
                        });
                        idPagoPrepago = prepagoCilindroObjResult[0].getValue({name: "custrecord_ptg_prepago_detalle_gas", label: "PTG - Prepago"});
                        log.emergency("idPagoPrepago Cilindro", idPagoPrepago);
                        idCuenta = prepagoCilindroObjResult[0].getValue({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_DETALLE_GAS", label: "Cuenta (principal)"});
                        log.emergency("idCuenta Cilindro", idCuenta);
                     } else {
                        //Búsqueda Guardada: PTG - Detalle Envases - Prepago Envase
                        var prepagoEnvaseObj = search.create({
                            type: "customrecord_ptg_detalleenv_est_carb_",
                            filters: [
                               ["custrecord_ptg_id_oportunidad_envases","anyof",oportunidadFactura], "AND", 
                               ["custrecord_ptg_envdetallecarb_","anyof",liquidacion]
                            ],
                            columns: [
                               search.createColumn({name: "custrecord_ptg_prepago_env_est_carb_", label: "PTG - Prepago"}),
                               search.createColumn({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_ENV_EST_CARB_", label: "Cuenta (principal)"})
                            ]
                         });
                         var prepagoEnvaseObjCount = prepagoEnvaseObj.runPaged().count;
                         if(prepagoEnvaseObjCount > 0){
                            log.audit("Búsqueda Envase");
                            var prepagoEnvaseObjResult = prepagoEnvaseObj.run().getRange({
                                start: 0,
                                end: 3,
                            });
                            idPagoPrepago = prepagoEnvaseObjResult[0].getValue({name: "custrecord_ptg_prepago_env_est_carb_", label: "PTG - Prepago"});
                            log.emergency("idPagoPrepago Envase", idPagoPrepago);
                            idCuenta = prepagoEnvaseObjResult[0].getValue({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_ENV_EST_CARB_", label: "Cuenta (principal)"});
                            log.emergency("idCuenta Envase", idCuenta);
                         }
                     }
                }

                if(idPagoPrepago){
                    var rec = record.load({
                        type: record.Type.CUSTOMER_PAYMENT,
                        id: idPagoPrepago,
                        isDynamic: true,
                    });
                    rec.setValue("customer", clienteFactura);
                    rec.setValue("account", idCuenta);


                    var lineCount = rec.getLineCount('apply');

                    for (var k = 0; k < lineCount; k++){
                        rec.selectLine({
                            sublistId: 'apply',
                            line: k
                        });
                        var factura = rec.getCurrentSublistValue({
                            sublistId: 'apply',
                            fieldId: 'internalid',
                        });
                        if (factura == idFactura){
                            rec.setCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'apply',
                                value: true
                            });
                        }
                    }
                    var recIdPago = rec.save();
                    log.emergency({
                        title: "Record saved successfully Prepago",
                        details: "Id: " + recIdPago,
                    });
                }

            }

            else if (objValueTipoPago == cortesiaId || objValueTipoPago == reposicionId || objValueTipoPago == bonificacionId || objValueTipoPago == rellenoId){
                log.audit("CORTESIA, REPOSICION, BONIFICACION Ó RELLENO DE MANGUERA")
                var creditMemoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CREDIT_MEMO,
                    isDynamic: false
                });


                if(objValueTipoPago == cortesiaId || objValueTipoPago == bonificacionId){
                    var amountArray = [];
                    var itemCountLine = creditMemoObj.getLineCount('item');
                    for (var i = 0; i < itemCountLine; i++) {
                        amountArray[i] = creditMemoObj.getSublistValue({
                            sublistId: "item",
                            fieldId: "amount",
                            line: i,
                        });
                    }
                        
                    for (var j = 0; j < itemCountLine; j++) {
                        creditMemoObj.setSublistValue('item', 'item', j, articuloServicio);  
                        creditMemoObj.setSublistValue('item', 'quantity', j, 1);
                        creditMemoObj.setSublistValue('item', 'amount', j, amountArray[j]);
                    }
                }

                var creditMemoID = creditMemoObj.save({
                    ignoreMandatoryFields: true
                });
                log.debug("Nota de credito Creado con: "+objValueTipoPago, creditMemoID);
            }

            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(summary) {

    }

    function searchCuenta(idSubsidiaria, idTipoPago) {
        try {
            var cuentaDefault = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                cuentaDefault = 2786;
                subsidiariaCorpoGas = 22;
                subsidiariaDistribuidora = 26;
                subsidiariaSanLuis = 23;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                cuentaDefault = 2786;
                subsidiariaCorpoGas = 22;
                subsidiariaDistribuidora = 26;
                subsidiariaSanLuis = 23;
            }

          //SS: PTG - Mapeo Formas de pago y cuentas SS
          var mapeoCuentaObj = search.create({
            type: "customrecord_mapeo_formasdepago_cuentas",
            filters: [
              ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria], "AND",
              ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
            ],
            columns: [
              search.createColumn({
                name: "custrecord_ptg_formadepago_cuenta",
                label: "PTG - Cuenta de banco",
              }),
            ],
          });
  
          var mapeoCuentaObjCount = mapeoCuentaObj.runPaged().count;
          var mapeoCuentaObjResult = mapeoCuentaObj.run().getRange({
            start: 0,
            end: mapeoCuentaObjCount,
          });
          if (mapeoCuentaObjCount > 0) {
            idCuenta = mapeoCuentaObjResult[0].getValue({
              name: "custrecord_ptg_formadepago_cuenta",
              label: "PTG - Cuenta de banco",
            });
            log.debug("idCuenta", idCuenta);
          } else {
            if(idSubsidiaria == subsidiariaCorpoGas){
                idCuenta = 3153;
            } else if(idSubsidiaria == subsidiariaDistribuidora){
                idCuenta = 2849;
            } else if(idSubsidiaria == subsidiariaSanLuis){
                idCuenta = 3151;
            }
              log.debug("cuenta no encontrada", idCuenta);
          }
  
          return idCuenta;
        } catch (error) {
          log.error({
            title: "error searchCuenta",
            details: JSON.stringify(error),
          });
        }
    }

    function searchFormaPagoSAT(idSubsidiaria, idTipoPago) {
        try {
            var formaDePagoDefault = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                formaDePagoDefault = 28;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                formaDePagoDefault = 28;
            }

            //SS: PTG - Mapeo Formas de pago y cuentas SS
            var mapeoCuentaObj = search.create({
                type: "customrecord_mapeo_formasdepago_cuentas",
                filters: [
                    ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria], "AND",
                    ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_ptg_forma_pago_sat",
                        label: "PTG - FORMA DE PAGO SAT",
                    }),
                ],
            });
  
            var mapeoCuentaObjCount = mapeoCuentaObj.runPaged().count;
            var mapeoCuentaObjResult = mapeoCuentaObj.run().getRange({
                start: 0,
                end: mapeoCuentaObjCount,
            });
            if (mapeoCuentaObjCount > 0) {
                idFormaPago = mapeoCuentaObjResult[0].getValue({
                    name: "custrecord_ptg_forma_pago_sat",
                    label: "PTG - FORMA DE PAGO SAT",
                });
                log.debug("idFormaPago", idFormaPago);
            } else {
                idFormaPago = formaDePagoDefault;
                log.debug("forma de pago no encontrada", idFormaPago);
            }
  
            return idFormaPago;
        } catch (error) {
            log.error({
                title: "error searchFormaPagoSAT",
                details: JSON.stringify(error),
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});