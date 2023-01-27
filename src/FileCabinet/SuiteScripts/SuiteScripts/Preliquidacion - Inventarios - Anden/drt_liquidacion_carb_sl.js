/*******************************************************************************
 * * DisrupTT * DisrupTT Developers *
 * **************************************************************************
 * Date: 01/2022
 * Script name: DRT - Liquidacion Carburacion SL
 * Script id: customscript_drt_liquidacion_carb_sl
 * customer Deployment id: customdeploy_drt_liquidacion_carb_sl
 * Applied to: 
 * File: drt_liquidacion_carb_sl.js
 ******************************************************************************/
/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NModuleScope public
 */
 define(['N/search', 'N/record', 'N/ui/message', 'N/ui/dialog', 'N/task', 'N/runtime', "N/redirect", "N/log", "N/url"], function (search, record, message, dialog, task, runtime, redirect, log, url) {
    function onRequest(context) {
        try {
            var req_param = context.request.parameters;
            log.audit("req_param", req_param);

            log.audit("afterSubmit");
            var recId = req_param.recId;
            log.audit("recId", recId);
            var estacionCarburacion = req_param.estacionCarburacion;
            log.audit("estacionCarburacion", estacionCarburacion);
            var fechaI = req_param.fechaI;
            log.audit("fechaI", fechaI);
            var fechaF = req_param.fechaF;
            log.audit("fechaF", fechaF);
            
            log.audit('Remaining Usage start proceso', runtime.getCurrentScript().getRemainingUsage());

            var urlPago = "";
            var conteoExceso = 0;
            var conteoRestriccion = 0;
            var sumaEfectivo = 0;
            var sumaCredito = 0;
            var sumaOtros = 0;
            var suma = 0;
            var total = 0;

            var publicoGeneral = 0;
            var conteoExceso = 0;
            var conteoRestriccion = 0;
            var efectivo = 0;
            var prepagoBanorte = 0;
            var vale = 0;
            var cortesia = 0;
            var tarjetaCredito = 0;
            var tarjetaDebito = 0;
            var multiple = 0;
            var prepagoTransferencia = 0;
            var creditoCliente = 0;
            var reposicion = 0;
            var saldoAFavor = 0;
            var consumoInterno = 0;
            var prepagoBancomer = 0;
            var prepagoHSBC = 0;
            var prepagoBanamex = 0;
            var prepagoSantander = 0;
            var prepagoScotian = 0;
            var bonificacion = 0;
            var ticketCard = 0;
            var chequeBancomer = 0;
            var recirculacion = 0;
            var cancelado = 0;
            var relleno = 0;
            var transferencia = 0;
            var traspaso = 0;
            var chequeSantander = 0;
            var chequeScotian = 0;
            var chequeHSBC = 0;
            var chequeBanamex = 0;
            var chequeBanorte = 0;
            var tarjetaCreditoBancomer = 0;
            var tarjetaCreditoHSBC = 0;
            var tarjetaCreditoBanamex = 0;
            var tarjetaDebitoBanamex = 0;
            var tarjetaDebitoBancomer = 0;
            var tarjetaDebitoHSBC = 0;
            var estatusRecibido = 0;
            var cilindro10 = 0;
            var cilindro20 = 0;
            var cilindro30 = 0;
            var cilindro45 = 0;
            var envase10 = 0;
            var envase20 = 0;
            var envase30 = 0;
            var envase45 = 0;
            var gasLP = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                efectivo = 1;
                prepagoBanorte = 2;
                vale = 3;
                cortesia = 4;
                tarjetaCredito = 5;
                tarjetaDebito = 6;
                multiple = 7;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                reposicion = 10;
                saldoAFavor = 11;
                consumoInterno = 12;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                bonificacion = 18;
                ticketCard = 19;
                chequeBancomer = 20;
                recirculacion = 21;
                cancelado = 22;
                relleno = 23;
                transferencia = 24;
                traspaso = 25;
                chequeSantander = 26;
                chequeScotian = 27;
                chequeHSBC = 28;
                chequeBanamex = 29;
                chequeBanorte = 30;
                publicoGeneral = 14508;
                urlPago = "https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=503&id=";
                estatusRecibido = 2;
                cilindro10 = 4094;
                cilindro20 = 4095;
                cilindro30 = 4096;
                cilindro45 = 4602;
                envase10 = 4097;
                envase20 = 4099;
                envase30 = 4098;
                envase45 = 4604;
                gasLP = 4088;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                efectivo = 1;
                prepagoBanorte = 2;
                vale = 3;
                cortesia = 4;
                tarjetaCredito = 5;
                tarjetaDebito = 6;
                multiple = 7;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                reposicion = 10;
                saldoAFavor = 11;
                consumoInterno = 12;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                bonificacion = 18;
                ticketCard = 19;
                chequeBancomer = 20;
                recirculacion = 21;
                cancelado = 22;
                relleno = 23;
                transferencia = 24;
                traspaso = 25;
                chequeSantander = 26;
                chequeScotian = 27;
                chequeHSBC = 28;
                chequeBanamex = 29;
                chequeBanorte = 30;
                tarjetaCreditoBancomer = 31;
                tarjetaCreditoHSBC = 32;
                tarjetaCreditoBanamex = 33;
                tarjetaDebitoBanamex = 34;
                tarjetaDebitoBancomer = 35;
                tarjetaDebitoHSBC = 36;
                publicoGeneral = 27041;
                urlPago = "https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=587&id=";
                estatusRecibido = 2;
                cilindro10 = 4210;
                cilindro20 = 4211;
                cilindro30 = 4212;
                cilindro45 = 4213;
                envase10 = 4206;
                envase20 = 4207;
                envase30 = 4208;
                envase45 = 4209;
                gasLP = 4216;
            }                


            //LIQUIDACION: CILINDROS - PTG DETALLE GAS
            //BÚSQUEDA GUARDADA: PTG - Artículos Cilindros
            var cilindrosObj = search.create({
                type: "item",
                filters: [["internalid","anyof",cilindro10,cilindro20,cilindro30,cilindro45]],
                columns: [
                   search.createColumn({name: "internalid", label: "ID interno"})
                ]
            });
            var cilindrosCount = cilindrosObj.runPaged().count;
            log.debug("cilindrosCount", cilindrosCount);
            var cilindrosResult = cilindrosObj.run().getRange({
                start: 0,
                end: cilindrosCount,
            });
            if(incremento_inicio < cilindrosCount){
                (idArticuloCilindro = cilindrosResult[incremento_inicio].getValue({name: "internalid", label: "ID interno"})),
                (txtArticuloCilindro = cilindrosResult[incremento_inicio].getText({name: "internalid", label: "ID interno"}));
                
                var itemSearchObj = search.create({
                    type: "item",
                    filters: [
                        ["internalid","anyof", idArticuloCilindro], "AND", 
                        ["inventorylocation","anyof", estacionCarburacion]
                    ],
                    columns: [
                       search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Nombre"}),
                       search.createColumn({name: "locationquantityonhand", label: "Ubicación disponible"})
                    ]
                });
                var searchResultCount = itemSearchObj.runPaged().count;
                log.debug("searchResultCount", searchResultCount);
                var itemSearchResult = itemSearchObj.run().getRange({
                    start: 0,
                    end: searchResultCount,
                });

                if(searchResultCount > 0){
                    (cantidadDotacion = itemSearchResult[0].getValue({name: "locationquantityonhand", label: "Ubicación disponible"}));
                    log.emergency("cantidadDotacion if", cantidadDotacion);
                } else {
                    (cantidadDotacion = 0);
                    log.emergency("cantidadDotacion else", cantidadDotacion);
                }
                
                //BÚSQUEDA GUARDADA: PTG - Liq Carburacion - Cilindros-DetalleGas
                var detalleGasVentasObj = search.create({
                    type: "transaction",
                    filters: [
                        ["type","anyof","Opprtnty"], "AND", 
                        ["probability","equalto","100"], "AND", 
                        ["custbody_ptg_estacion_carburacion","anyof",estacionCarburacion], "AND", 
                        ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                        ["mainline","is","F"], "AND",
                        ["taxline","is","F"], "AND",
                        ["item","anyof", idArticuloCilindro], "AND",
                        ["custbody_ptg_liquidado","is","F"]
                    ],
                    columns: [
                        search.createColumn({name: "item",summary: "GROUP",label: "Artículo"}),
                        search.createColumn({name: "quantity",summary: "SUM",label: "Cantidad"}),
                        search.createColumn({name: "custitem_ptg_capacidadcilindro_",join: "item",summary: "GROUP",label: "PTG - Capacidad cilindro"}),
                        search.createColumn({name: "rate",summary: "AVG",label: "Tasa de artículo"}),
                        search.createColumn({name: "amount",summary: "SUM",label: "Importe"}),
                        search.createColumn({name: "taxamount",summary: "SUM",label: "Importe (impuestos)"}),
                        search.createColumn({name: "total",summary: "SUM",label: "Importe (total de transacción)"})
                    ]
                });
                
                var detalleGasVentasCount = detalleGasVentasObj.runPaged().count;
                log.debug("detalleGasVentasCount", detalleGasVentasCount);
                var detalleGasVentasResult = detalleGasVentasObj.run().getRange({
                    start: 0,
                    end: detalleGasVentasCount,
                });
                log.audit("detalleGasVentasResult", detalleGasVentasResult);

                if(detalleGasVentasCount > 0){
                    (idArticulo = detalleGasVentasResult[0].getValue({name: "item",summary: "GROUP",label: "Artículo"})),
                    (nombreArticulo = detalleGasVentasResult[0].getText({name: "item",summary: "GROUP",label: "Artículo"})),
                    (cantidad = detalleGasVentasResult[0].getValue({name: "quantity",summary: "SUM",label: "Cantidad"})),
                    (capacidad = detalleGasVentasResult[0].getValue({name: "custitem_ptg_capacidadcilindro_",join: "item",summary: "GROUP",label: "PTG - Capacidad cilindro"})),
                    (tasa = detalleGasVentasResult[0].getValue({name: "rate",summary: "AVG",label: "Tasa de artículo"})),
                    (importe = detalleGasVentasResult[0].getValue({name: "amount",summary: "SUM",label: "Importe"})),
                    (impuesto = detalleGasVentasResult[0].getValue({name: "taxamount",summary: "SUM",label: "Importe (impuestos)"})),
                    (total = detalleGasVentasResult[0].getValue({name: "total",summary: "SUM",label: "Importe (total de transacción)"}));
                } else {
                    (idArticulo = 0);
                    (nombreArticulo = 0);
                    (cantidad = 0);
                    (capacidad = 0);
                    (tasa = 0);
                    (importe = 0);
                    (impuesto = 0);
                    (total = 0);
                    log.audit("entra en numero 0");
                }
                
                //BÚSQUEDA GUARDADA: PTG - Detalle Aportación a Estacion Entrada //
                var movimientosMasObj = search.create({
                    type: "customrecord_ptg_detalle_aportacion_rec_",
                    filters: [
                        ["custrecord_ptg_detalle_aportacion_.custrecord_ptg_estcarb_rec_aportacion_","anyof", estacionCarburacion], "AND", 
                        //["custrecord_ptg_detalle_aportacion_.created","within", fechaI, fechaF], "AND", 
                        ["custrecord_ptg_detalle_aportacion_.custrecord_ptg_fecha_hora_servicio_aport","within", fechaI, fechaF], "AND", 
                        ["custrecord_ptg_tipoenv_rec_est_carb_","anyof",idArticuloCilindro], "AND", 
                        ["custrecord_ptg_detalle_aportacion_.custrecord_ptg_orden_traslado","noneof","@NONE@"], "AND", 
                        ["custrecord_ptg_detalle_aportacion_.custrecord_ptg_status_recepcion","anyof",estatusRecibido], "AND", 
                        ["custrecord_ptg_detalle_aportacion_.custrecord_ptg_liquidado","is","F"]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_tipoenv_rec_est_carb_",summary: "GROUP",label: "PTG - Tipo de envase rec est carb"}),
                        search.createColumn({name: "custrecord_ptg_cantidad_aport_cil_",summary: "SUM",label: "PTG - Cantidad aport cil"})
                    ]
                });
                var movimientoMasResultCount = movimientosMasObj.runPaged().count;
                log.emergency("movimientosMasObj",movimientoMasResultCount);
                var itemMasSrchResults = movimientosMasObj.run().getRange({
                    start: 0,
                    end: 2,
                });
                log.emergency("itemMasSrchResults", itemMasSrchResults);
                if(movimientoMasResultCount > 0){
                    (movimientoMas = itemMasSrchResults[0].getValue({name: "custrecord_ptg_cantidad_aport_cil_",summary: "SUM",label: "PTG - Cantidad aport cil",}));
                } else {
                    movimientoMas = 0;
                }

                //BÚSQUEDA GUARDADA: PTG - Recibir aportación
                var recibirAportacionObj = search.create({
                    type: "customrecord_ptg_rec_aporcil_est_carb_",
                    filters: [
                        ["custrecord_ptg_liquidado","is","F"], "AND", 
                        ["custrecord_ptg_estcarb_rec_aportacion_","anyof",estacionCarburacion], "AND", 
                        ["custrecord_ptg_fecha_hora_servicio_aport","within",fechaI,fechaF], "AND", 
                        ["custrecord_ptg_status_recepcion","anyof",estatusRecibido], "AND", 
                        ["custrecord_ptg_recepcion_articulo","noneof","@NONE@"]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_recepcion_articulo", label: "PTG - Recepción del Artículo"})
                    ]
                });
                var recibirAportacionObjCount = recibirAportacionObj.runPaged().count;
                log.debug("recibirAportacionObjCount", recibirAportacionObjCount);
                if(recibirAportacionObjCount > 0){
                    var recibirAportacionObjResults = recibirAportacionObj.run().getRange({
                        start: 0,
                        end: recibirAportacionObjCount,
                    });
                    //AQUI
                    for(var w = 0; w < recibirAportacionObjCount; w++){
                        (idRecepcion = recibirAportacionObjResults[w].getValue({name: "custrecord_ptg_recepcion_articulo", label: "PTG - Recepción del Artículo"}));
                        var recRecepcion = record.create({
                            type: "customrecord_ptg_oportunidades_",
                            isDynamic: true,
                        });
                        recRecepcion.setValue("custrecord_ptg_idtransaccion_carburacion", idRecepcion);
                        recRecepcion.setValue("custrecord_ptg_rel_op_preliq_", recId);
                        var recRecepcionIdSaved = recRecepcion.save();
                        log.debug({
                            title: "RECEPCION",
                            details: "Id Saved: " + recRecepcionIdSaved,
                        });
                    }
                }                

                //BÚSQUEDA GUARDADA: PTG - Detalle aportación a camión Salida
                var movimientosMenosObj = search.create({
                    type: "customrecord_ptg_det_aport_a_camion_",
                    filters: [
                        ["custrecord_ptg_detalle_aportacion_a_cam_.custrecord_ptg_estacion_aportacionacamio","anyof", estacionCarburacion], "AND", 
                        ["custrecord_ptg_tipoenvase_aportacionacam","anyof",idArticuloCilindro], "AND", 
                        ["custrecord_ptg_detalle_aportacion_a_cam_.custrecord_ptg_fecha_hora_aportacion", "within", fechaI, fechaF], "AND", 
                        ["custrecord_ptg_detalle_aportacion_a_cam_.custrecord_ptg_liquidado_aportacion","is","F"]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_tipoenvase_aportacionacam",summary: "GROUP",label: "PTG - Tipo de envase aportación a camión"}),
                        search.createColumn({name: "custrecord_ptg_cantidad_a_",summary: "SUM",label: "PTG - Cantidad aportar a camión"})
                    ]
                });
                var searchResultCount = movimientosMenosObj.runPaged().count;
                log.emergency("movimientosMenosObj",searchResultCount);
                var itemSrchResults = movimientosMenosObj.run().getRange({
                    start: 0,
                    end: 2,
                });
                log.emergency("itemSrchResults", itemSrchResults);
                  
                if(searchResultCount > 0){
                    (movimientoMenos = itemSrchResults[0].getValue({name: "custrecord_ptg_cantidad_a_",summary: "SUM",label: "PTG - Cantidad aportar a camión",}));
                    log.emergency("paso uno", movimientoMenos);
                } else {
                    movimientoMenos = 0;
                }

                //BÚSQUEDA GUARDADA: PTG - Aportar cilindros Liquidado
                var otorgarAportacionObj = search.create({
                    type: "customrecord_ptg_aportarcil_a_camion_",
                    filters: [
                        ["custrecord_ptg_transaccion_traslado_carb","noneof","@NONE@"], "AND", 
                        ["custrecord_ptg_liquidado_aportacion","is","F"], "AND", 
                        ["custrecord_ptg_estacion_aportacionacamio","anyof", estacionCarburacion], "AND", 
                        //["created","within",fechaI,fechaF]
                        ["custrecord_ptg_fecha_hora_aportacion","within",fechaI,fechaF]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_transaccion_traslado_carb", label: "PTG - Orden de Traslado"})
                    ]
                });
                var otorgarAportacionObjCount = otorgarAportacionObj.runPaged().count;
                log.debug("otorgarAportacionObjCount", otorgarAportacionObjCount);
                if(otorgarAportacionObjCount > 0){
                    var otorgarAportacionObjResults = otorgarAportacionObj.run().getRange({
                        start: 0,
                        end: otorgarAportacionObjCount,
                    });
                    //AQUI
                    for(var x = 0; x < otorgarAportacionObjCount; x++){
                        (idOrdenTraslado = otorgarAportacionObjResults[x].getValue({name: "custrecord_ptg_transaccion_traslado_carb", label: "PTG - Orden de Traslado"}));
                        var recOrdenTraslado = record.create({
                            type: "customrecord_ptg_oportunidades_",
                            isDynamic: true,
                        });
                        recOrdenTraslado.setValue("custrecord_ptg_idtransaccion_carburacion", idOrdenTraslado);
                        recOrdenTraslado.setValue("custrecord_ptg_rel_op_preliq_", recId);
                        var recOrdenTrasladoIdSaved = recOrdenTraslado.save();
                        log.debug({
                            title: "ORDEN TRASLADO",
                            details: "Id Saved: " + recOrdenTrasladoIdSaved,
                        });
                    }
                }

                var cantidadDotacionPF = parseFloat(cantidadDotacion);
                var movimientoMasPF = parseFloat(movimientoMas);
                var movimientoMenosPF = parseFloat(movimientoMenos);
                var totalCilindro = cantidadDotacionPF + (movimientoMasPF - movimientoMenosPF);
                log.emergency("totalCilindro", totalCilindro);
                
                var recDetalleGas = record.create({
                    type: "customrecord_ptg_detallegas_",
                    isDynamic: true,
                });
                recDetalleGas.setValue("custrecord_ptg_tipocil_est_cab_", idArticuloCilindro);
                recDetalleGas.setValue("custrecord_ptg_descripcion_cil_est_carb_", txtArticuloCilindro);
                recDetalleGas.setValue("custrecord_ptg_dotacioncil_est_carb_", cantidadDotacion);
                recDetalleGas.setValue("custrecord_ptg_movmas_est_carb_", movimientoMas);
                recDetalleGas.setValue("custrecord_ptg_movmenos_est_carb_", movimientoMenos);
                recDetalleGas.setValue("custrecord_ptg_totales_cil_est_carb_", totalCilindro);
                recDetalleGas.setValue("custrecord_ptg_llenos_cil_est_carb_", totalCilindro);
                recDetalleGas.setValue("custrecord_ptg_ventas_est_carb_", cantidad);
                recDetalleGas.setValue("custrecord_ptg_lts_cil_est_carb_", capacidad);
                recDetalleGas.setValue("custrecord_ptg_precioxlt_est_carb_", tasa);
                recDetalleGas.setValue("custrecord_ptg_importe_cil_est_carb_", importe);
                recDetalleGas.setValue("custrecord_ptg_impuesto_cil_est_carb_", impuesto);
                recDetalleGas.setValue("custrecord_ptg_total_cil_est_carb_", total);
                recDetalleGas.setValue("custrecord_ptg_detalle_cil", recId);
                var recDetalleGasIdSaved = recDetalleGas.save();
                log.emergency({
                    title: "DETALLE DE GAS",
                    details: "Id Saved: " + recDetalleGasIdSaved,
                });
            }
            
            
            //LIQUIDACION: CILINDROS - PTG DETALLE GAS TIPO DE PAGO
            //BÚSQUEDA GUARDADA: PTG - Liq Carburacion - Cilindros-DetalleGasTipoPago
            var detalleGasTipoPagoObj = search.create({
                type: "transaction",
                filters: [
                   ["type","anyof","Opprtnty"], "AND", 
                   ["probability","equalto","100"], "AND", 
                   ["custbody_ptg_estacion_carburacion","anyof",estacionCarburacion], "AND", 
                   ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                   ["mainline","is","F"], "AND", 
                   ["taxline","is","F"], "AND", 
                   ["item","anyof",cilindro10,cilindro20,cilindro30,cilindro45], "AND", 
                   ["custbody_ptg_liquidado","is","F"]
                ],
                columns: [
                   search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"}),
                   search.createColumn({name: "entity", label: "Nombre"}),
                   search.createColumn({name: "item", label: "Artículo"}),
                   search.createColumn({name: "quantity", label: "Cantidad"}),
                   search.createColumn({name: "custitem_ptg_capacidadcilindro_", join: "item", label: "PTG - Capacidad cilindro"}),
                   search.createColumn({name: "rate", label: "Tasa de artículo"}),
                   search.createColumn({name: "amount", label: "Importe"}),
                   search.createColumn({name: "taxamount", label: "Importe (impuestos)"}),
                   search.createColumn({name: "total", label: "Importe (total de transacción)"}),
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({name: "tranid", label: "Número de documento"}),
                   search.createColumn({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"})
                ]
             });
             var detalleGasTipoPagoCount = detalleGasTipoPagoObj.runPaged().count;
             var detalleGasTipoPagoResult = detalleGasTipoPagoObj.run().getRange({
                start: 0,
                end: detalleGasTipoPagoCount,
            });
            if(incremento_inicio < detalleGasTipoPagoCount){
                (tipoPago = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})),
                (idCliente = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "entity", label: "Nombre"})),
                (idArticulo = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "item", label: "Artículo"})),
                (cantidad = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "quantity", label: "Cantidad"})),
                (capacidad = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "custitem_ptg_capacidadcilindro_", join: "item", label: "PTG - Capacidad cilindro"})),
                (tasa = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "rate", label: "Tasa de artículo"})),
                (importe = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "amount", label: "Importe"})),
                (impuesto = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "taxamount", label: "Importe (impuestos)"})),
                (total = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "total", label: "Importe (total de transacción)"})),
                (idOportunidad = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "internalid", label: "ID interno"})),
                (nota = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "tranid", label: "Número de documento"})),
                (registroPago = detalleGasTipoPagoResult[incremento_inicio].getValue({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"}));

                var urlModificarPago = urlPago + registroPago + "&e=T";
                log.emergency("urlModificarPago", urlModificarPago);

                var objValue = JSON.parse(tipoPago);
                var objValue2 = objValue;
                var objValue3 = objValue2.pago;
                log.debug("objValue3", objValue3);
                var objPos = objValue3[0];
                var objTipoPago = objPos.tipo_pago;
                log.debug("objTipoPago", objTipoPago);

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: idCliente,
                });
                var direccionCliente = clienteObj.getValue("defaultaddress");
                var nombreCliente = clienteObj.getValue("altname");
                var saldoVencido = clienteObj.getValue("overduebalance");
                var limiteCredito = clienteObj.getValue("creditlimit");
                var saldo = clienteObj.getValue("balance");
                log.audit("direccionCliente", direccionCliente);
                log.audit("nombreCliente", nombreCliente);
                log.audit("saldoVencido", saldoVencido);
                log.audit("limiteCredito", limiteCredito);
                log.audit("saldo", saldo);

                var pagoObj = record.load({
                    id: registroPago,
                    type: "customrecord_ptg_pagos"
                });
                var referenciaPago = pagoObj.getSublistValue({
                    sublistId: "recmachcustrecord_ptg_registro_pagos",
                    fieldId: "custrecord_ptg_referenciapago_",
                    line: 0,
                });
                log.debug("referenciaPago", referenciaPago);

                if(idCliente != publicoGeneral && objTipoPago == creditoCliente){
                    if((saldoVencido > 0) || (limiteCredito < saldo)){
                        excedeLimite = true;
                        conteoExceso += 1;
                    } else {
                        excedeLimite = false;
                        conteoExceso += 0;
                    }
                } else {
                    excedeLimite = false;
                    conteoExceso += 0;
                }
                

                if(objTipoPago == creditoCliente && idCliente == publicoGeneral){
                    restriccion = true;
                    conteoRestriccion += 1;
                } else {
                    restriccion = false;
                    conteoRestriccion += 0;
                } 



                var recDetalleGasTipoPago = record.create({
                    type: "customrecord_ptg_det_gas_tipo_pago_",
                    isDynamic: true,
                });
                recDetalleGasTipoPago.setValue("custrecord_ptg_tipopago_gas", objTipoPago);
                recDetalleGasTipoPago.setValue("custrecord_ptg_referenciagas_", referenciaPago);
                recDetalleGasTipoPago.setValue("custrecord_ptg_notasgas_", nota);
                recDetalleGasTipoPago.setValue("custrecord_ptg_modificar_met_pago_cil", urlModificarPago);
                recDetalleGasTipoPago.setValue("custrecord_ptg_clientegas_", idCliente);
                recDetalleGasTipoPago.setValue("custrecord_ptg_direccionembgas_", direccionCliente);
                recDetalleGasTipoPago.setValue("custrecord_ptg_nombre_gas", nombreCliente);
                recDetalleGasTipoPago.setValue("custrecord_ptg_foliofiscalgas_", referenciaPago);
                recDetalleGasTipoPago.setValue("custrecord_ptg_tipocil_gas_", idArticulo);
                recDetalleGasTipoPago.setValue("custrecord_ptg_cantidadgas_", cantidad);
                recDetalleGasTipoPago.setValue("custrecord_ptg_preciogas", tasa);
                recDetalleGasTipoPago.setValue("custrecord_ptg_preciogas_old", tasa);
                recDetalleGasTipoPago.setValue("custrecord_ptg_importegas_", importe);
                recDetalleGasTipoPago.setValue("custrecord_ptg_impuestogas_", impuesto);
                recDetalleGasTipoPago.setValue("custrecord_ptg_total_gas", total);
                recDetalleGasTipoPago.setValue("custrecord_ptg_saldo_vencido_detalle_gas", saldoVencido);
                recDetalleGasTipoPago.setValue("custrecord_ptg_limite_credit_detalle_gas", limiteCredito);
                recDetalleGasTipoPago.setValue("custrecord_ptg_saldo_detalle_gas", saldo);
                recDetalleGasTipoPago.setValue("custrecord_ptg_excede_limite_detalle_gas", excedeLimite);
                recDetalleGasTipoPago.setValue("custrecord_ptg_restriccion_detalle_gas", restriccion);
                if(objTipoPago == prepagoBanorte || objTipoPago == prepagoTransferencia || objTipoPago == prepagoBancomer || objTipoPago == prepagoHSBC || objTipoPago == prepagoBanamex || objTipoPago == prepagoSantander || objTipoPago == prepagoScotian){
                    recDetalleGasTipoPago.setValue("custrecord_ptg_prepago_sin_aplic_det_gas", true);
                }
                recDetalleGasTipoPago.setValue("custrecord_ptg_id_oportunidad_gas", idOportunidad);
                recDetalleGasTipoPago.setValue("custrecord_ptg_detgas_tipo_pago_", recId);
                var recDetalleGasTipoPagoIdSaved = recDetalleGasTipoPago.save();
                log.debug({
                    title: "DETALLE DE GAS TIPO PAGO",
                    details: "Id Saved: " + recDetalleGasTipoPagoIdSaved,
                });

                var recOportunidadCilindro = record.create({
                    type: "customrecord_ptg_oportunidades_",
                    isDynamic: true,
                });
                recOportunidadCilindro.setValue("custrecord_ptg_idoportunidad_", idOportunidad);
                recOportunidadCilindro.setValue("custrecord_ptg_rel_op_preliq_", recId);
                if(objTipoPago == saldoAFavor && objTipoPago == consumoInterno && objTipoPago == recirculacion && objTipoPago == cancelado){
                    recOportunidadCilindro.setValue("custrecord_ptg_facturar_servicio", false);
                }
                var recOportunidadCilindroIdSaved = recOportunidadCilindro.save();
                log.debug({
                    title: "OPORTUNIDAD CILINDRO",
                    details: "Id Saved: " + recOportunidadCilindroIdSaved,
                });
            //}

            }



            //LIQUIDACION: CILINDROS - PTG ENVASE DETALLE
            //BÚSQUEDA GUARDADA: PTG - Liq Carburacion - Cilindros-EnvaseDetalle
            var envaseDetalleObj = search.create({
                type: "transaction",
                filters: [
                   ["type","anyof","Opprtnty"], "AND", 
                   ["probability","equalto","100"], "AND", 
                   ["custbody_ptg_estacion_carburacion","anyof", estacionCarburacion], "AND", 
                   ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                   ["mainline","is","F"], "AND", 
                   ["taxline","is","F"], "AND", 
                   ["item","anyof",envase10,envase20,envase30,envase45], "AND", 
                   ["custbody_ptg_liquidado","is","F"]
                ],
                columns: [
                   search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"}),
                   search.createColumn({name: "entity", label: "Nombre"}),
                   search.createColumn({name: "item", label: "Artículo"}),
                   search.createColumn({name: "quantity", label: "Cantidad"}),
                   search.createColumn({name: "custitem_ptg_capacidadcilindro_", join: "item", label: "PTG - Capacidad cilindro" }),
                   search.createColumn({name: "rate", label: "Tasa de artículo"}),
                   search.createColumn({name: "amount", label: "Importe"}),
                   search.createColumn({name: "taxamount", label: "Importe (impuestos)"}),
                   search.createColumn({name: "total", label: "Importe (total de transacción)"}),
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({name: "tranid", label: "Número de documento"}),
                   search.createColumn({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"})
                ]
             });
             var envaseDetalleCount = envaseDetalleObj.runPaged().count;
             log.debug("envaseDetalleCount", envaseDetalleCount);
             var envaseDetalleResult = envaseDetalleObj.run().getRange({
                 start: 0,
                 end: envaseDetalleCount,
            });
            log.audit("envaseDetalleResult", envaseDetalleResult);
            if(incremento_inicio < envaseDetalleCount){
                (tipoPago = envaseDetalleResult[incremento_inicio].getValue({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})),
                (idCliente = envaseDetalleResult[incremento_inicio].getValue({name: "entity", label: "Nombre"})),
                (idArticulo = envaseDetalleResult[incremento_inicio].getValue({name: "item", label: "Artículo"})),
                (cantidad = envaseDetalleResult[incremento_inicio].getValue({name: "quantity", label: "Cantidad"})),
                (capacidad = envaseDetalleResult[incremento_inicio].getValue({name: "custitem_ptg_capacidadcilindro_", join: "item", label: "PTG - Capacidad cilindro"})),
                (tasa = envaseDetalleResult[incremento_inicio].getValue({name: "rate", label: "Tasa de artículo"})),
                (importe = envaseDetalleResult[incremento_inicio].getValue({name: "amount", label: "Importe"})),
                (impuesto = envaseDetalleResult[incremento_inicio].getValue({name: "taxamount", label: "Importe (impuestos)"})),
                (total = envaseDetalleResult[incremento_inicio].getValue({name: "total", label: "Importe (total de transacción)"})),
                (idOportunidad = envaseDetalleResult[incremento_inicio].getValue({name: "internalid", label: "ID interno"})),
                (nota = envaseDetalleResult[incremento_inicio].getValue({name: "tranid", label: "Número de documento"})),
                (registroPago = envaseDetalleResult[incremento_inicio].getValue({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"}));

                var urlModificarPago = urlPago + registroPago + "&e=T";
                log.emergency("urlModificarPagDos", urlModificarPago);

                var objValue = JSON.parse(tipoPago);
                var objValue2 = objValue;
                var objValue3 = objValue2.pago;
                log.debug("objValue3", objValue3);
                var objPos = objValue3[0];
                var objTipoPago = objPos.tipo_pago;
                log.debug("objTipoPago", objTipoPago);

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: idCliente,
                });
                var direccionCliente = clienteObj.getValue("defaultaddress");
                var nombreCliente = clienteObj.getValue("altname");
                var saldoVencido = clienteObj.getValue("overduebalance");
                var limiteCredito = clienteObj.getValue("creditlimit");
                var saldo = clienteObj.getValue("balance");

                var pagoObj = record.load({
                    id: registroPago,
                    type: "customrecord_ptg_pagos"
                });
                var referenciaPago = pagoObj.getSublistValue({
                    sublistId: "recmachcustrecord_ptg_registro_pagos",
                    fieldId: "custrecord_ptg_referenciapago_",
                    line: 0,
                });
                log.debug("referenciaPago", referenciaPago);

                if(idCliente != publicoGeneral && objTipoPago == creditoCliente){
                    if((saldoVencido > 0) || (limiteCredito < saldo)){
                        excedeLimite = true;
                        conteoExceso += 1;
                    } else {
                        excedeLimite = false;
                        conteoExceso += 0;
                    }
                } else {
                    excedeLimite = false;
                    conteoExceso += 0;
                }
                

                if(objTipoPago == creditoCliente && idCliente == publicoGeneral){
                    restriccion = true;
                    conteoRestriccion += 1;
                } else {
                    restriccion = false;
                    conteoRestriccion += 0;
                }

                var recEnvaseDetalle = record.create({
                    type: "customrecord_ptg_detalleenv_est_carb_",
                    isDynamic: true,
                });
                recEnvaseDetalle.setValue("custrecord_ptg_tipodepago_enva_est_carb_", objTipoPago);
                recEnvaseDetalle.setValue("custrecord_ptg_referencia_env_est_carb_", referenciaPago);
                recEnvaseDetalle.setValue("custrecord_ptg_nota_env_est_carb_", nota);
                recEnvaseDetalle.setValue("custrecord_ptg_modificar_met_pago_env", urlModificarPago);
                recEnvaseDetalle.setValue("custrecord_ptg_cliente_env_est_carb_", idCliente);
                recEnvaseDetalle.setValue("custrecord_ptg_direc_env_est_carb_", direccionCliente);
                recEnvaseDetalle.setValue("custrecord_ptg_nombre_env_est_carb_", nombreCliente);
                recEnvaseDetalle.setValue("custrecord_ptg_tipocil_env_est_carb_", idArticulo);
                recEnvaseDetalle.setValue("custrecord_ptg_cantidad_env_est_carb_", cantidad);
                recEnvaseDetalle.setValue("custrecord_ptg_precio_env_est_carb_", tasa);
                recEnvaseDetalle.setValue("custrecord_ptg_importe_env_est_carb_", importe);
                recEnvaseDetalle.setValue("custrecord_ptg_imp_env_est_carb_", impuesto);
                recEnvaseDetalle.setValue("custrecord_ptg_total_env_est_carb_", total);
                recEnvaseDetalle.setValue("custrecord_ptg_saldo_venci_env_est_carb_", saldoVencido);
                recEnvaseDetalle.setValue("custrecord_ptg_limite_cred_env_est_carb_", limiteCredito);
                recEnvaseDetalle.setValue("custrecord_ptg_saldo_env_est_carb_", saldo);
                recEnvaseDetalle.setValue("custrecord_ptg_excede_limi_env_est_carb_", excedeLimite);
                recEnvaseDetalle.setValue("custrecord_ptg_restriccion_env_est_carb_", restriccion);
                if(objTipoPago == prepagoBanorte || objTipoPago == prepagoTransferencia || objTipoPago == prepagoBancomer || objTipoPago == prepagoHSBC || objTipoPago == prepagoBanamex || objTipoPago == prepagoSantander || objTipoPago == prepagoScotian){
                    recEnvaseDetalle.setValue("custrecord_ptg_prepago_sin_apl_env_e_car", true);
                }
                recEnvaseDetalle.setValue("custrecord_ptg_id_oportunidad_envases", idOportunidad);
                recEnvaseDetalle.setValue("custrecord_ptg_envdetallecarb_", recId);
                var recEnvaseDetalleIdSaved = recEnvaseDetalle.save();
                log.debug({
                    title: "ENVASE DETALLE",
                    details: "Id Saved: " + recEnvaseDetalleIdSaved,
                });


                    var recOportunidadEnvase = record.create({
                        type: "customrecord_ptg_oportunidades_",
                        isDynamic: true,
                    });
                    recOportunidadEnvase.setValue("custrecord_ptg_idoportunidad_", idOportunidad);
                    recOportunidadEnvase.setValue("custrecord_ptg_rel_op_preliq_", recId);
                    if(objTipoPago == saldoAFavor && objTipoPago == consumoInterno && objTipoPago == recirculacion && objTipoPago == cancelado){
                        recOportunidadEnvase.setValue("custrecord_ptg_facturar_servicio", false);
                    }
                    var recOportunidadEnvaseIdSaved = recOportunidadEnvase.save();
                    log.debug({
                        title: "OPORTUNIDAD ENVASE",
                        details: "Id Saved: " + recOportunidadEnvaseIdSaved,
                    });
                //}
            }

            if(incremento_inicio < 1){
                var oportunidadEnvaseArray = [];
                //BÚSQUEDA GUARDADA: PTG - Envases por Tipo de Pago
                var oppEnvasesObj = search.create({
                    type: "transaction",
                    filters: [
                       ["type","anyof","Opprtnty"], "AND", 
                       ["probability","equalto","100"], "AND", 
                       ["custbody_ptg_estacion_carburacion","anyof",estacionCarburacion], "AND", 
                       ["custbody_ptg_fecha_hora_servicio_carb","within",fechaI,fechaF], "AND", 
                       ["mainline","is","F"], "AND", 
                       ["taxline","is","F"], "AND", 
                       ["item","anyof",envase10,envase20,envase30,envase45], "AND", 
                       ["custbody_ptg_liquidado","is","F"]
                    ],
                    columns:
                    [
                        search.createColumn({name: "internalid", summary: "GROUP", label: "ID interno"})
                    ]
                });
                var oppEnvasesObjCount = oppEnvasesObj.runPaged().count;
                var oppEnvasesObjResult = oppEnvasesObj.run().getRange({
                    start: 0,
                    end: oppEnvasesObjCount,
                });
                for(var i = 0; i < oppEnvasesObjCount; i++){
                    var idOportunidad = oppEnvasesObjResult[i].getValue({name: "internalid", summary: "GROUP", label: "ID interno"});
                    log.debug("oportunidades Envasea"+i, idOportunidad);
                    oportunidadEnvaseArray.push(idOportunidad);
                }
                log.debug("oportunidadEnvaseArray", oportunidadEnvaseArray);

                var sumaTotal = 0;
                for(j = 1; j < 37; j++){
                    if (j != multiple){
                        //SS: PTG - Pagos Oportunidad Lineas SS
                        var tipoPagoEnvaseObj = search.create({
                            type: "customrecord_ptg_pagos_oportunidad",
                            filters: [
                               ["custrecord_ptg_oportunidad","anyof",oportunidadEnvaseArray], "AND", 
                               ["custrecord_ptg_tipo_pago","anyof",j]
                            ],
                            columns:[
                               search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                               search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                            ]
                        });
                        var tipoPagoEnvaseObjCount = tipoPagoEnvaseObj.runPaged().count;
                        var tipoPago = 0;
                        var montoPago = 0;
                         
                        if(tipoPagoEnvaseObjCount > 0){
                            var tipoPagoEnvaseObjResult = tipoPagoEnvaseObj.run().getRange({
                                start: 0,
                                end: 2,
                            });
                            tipoPago = tipoPagoEnvaseObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                            montoPago = parseFloat(tipoPagoEnvaseObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                             
                            console.log("tipo Pago" +j, tipoPago);
                            console.log("monto Pago" +j, montoPago);
                            sumaTotal += montoPago;
                        } else {
                            tipoPago = j;
                            montoPago = 0;
                        }
                        var recEnvasesTipoPago = record.create({
                            type: "customrecord_ptg_totalesxtipopago_est_ca",
                            isDynamic: true,
                        });
                        recEnvasesTipoPago.setValue("custrecord_ptg_tipodepago_est_carb_", j.toFixed(0));
                        recEnvasesTipoPago.setValue("custrecord_ptg_descripcion_tipopago_", tipoPago);
                        recEnvasesTipoPago.setValue("custrecord_ptg_totaltipopago_", montoPago);
                        recEnvasesTipoPago.setValue("custrecord_ptg_envases_por_tipopago_", recId);
                        var recEnvasesTipoPagoIdSaved = recEnvasesTipoPago.save();
                        log.debug({
                            title: "ENVASES TIPO DE PAGO",
                            details: "Id Saved: " + recEnvasesTipoPagoIdSaved,
                        });
                    }
                }
            }




            if(incremento_inicio < 1){
                var oportunidadTodosArray = [];
                //LIQUIDACION: TOTALES - LINEA
                //BÚSQUEDA GUARDADA: PTG - Totales por tipo de pago detalle
                var totalesTipoPagoObj = search.create({
                    type: "transaction",
                    filters: [
                       ["type","anyof","Opprtnty"], "AND", 
                       ["probability","equalto","100"], "AND", 
                       ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion], "AND", 
                       ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                       ["mainline","is","F"], "AND", 
                       ["taxline","is","F"], "AND", 
                       ["custbody_ptg_liquidado","is","F"]
                    ],
                    columns:
                    [
                       search.createColumn({name: "internalid", summary: "GROUP", label: "ID interno"})
                    ]
                 });
                 var totalesTipoPagoCount = totalesTipoPagoObj.runPaged().count;
                 var totalesTipoPagoResult = totalesTipoPagoObj.run().getRange({
                    start: 0,
                    end: totalesTipoPagoCount,
                });
                for(var i = 0; i < totalesTipoPagoCount; i++){
                    var idOportunidad = totalesTipoPagoResult[i].getValue({name: "internalid", summary: "GROUP", label: "ID interno"});
                    log.debug("oportunidades "+i, idOportunidad);
                    oportunidadTodosArray.push(idOportunidad);
                }
                log.debug("oportunidadTodosArray", oportunidadTodosArray);

                var sumaTotal = 0;
                for(j = 1; j < 37; j++){
                    if (j != multiple){
                        //SS: PTG - Pagos Oportunidad Lineas SS
                        var tipoPagoObj = search.create({
                            type: "customrecord_ptg_pagos_oportunidad",
                            filters: [
                               ["custrecord_ptg_oportunidad","anyof",oportunidadTodosArray], "AND", 
                               ["custrecord_ptg_tipo_pago","anyof",j]
                            ],
                            columns:[
                               search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                               search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                            ]
                        });
                        var tipoPagoObjCount = tipoPagoObj.runPaged().count;
                        var tipoPago = 0;
                        var montoPago = 0;
                         
                        if(tipoPagoObjCount > 0){
                            var tipoPagoObjResult = tipoPagoObj.run().getRange({
                                start: 0,
                                end: 2,
                            });
                            tipoPago = tipoPagoObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                            montoPago = parseFloat(tipoPagoObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                             
                            console.log("tipo Pago" +j, tipoPago);
                            console.log("monto Pago" +j, montoPago);
                            sumaTotal += montoPago;
                        } else {
                            tipoPago = j;
                            montoPago = 0;
                        }
                        var recTotalesTipoPago = record.create({
                            type: "customrecord_ptg_totalestipopago_detalle",
                            isDynamic: true,
                        });
                        recTotalesTipoPago.setValue("custrecord_ptg_tipodepagodetalle_", j.toFixed(0));
                        recTotalesTipoPago.setValue("custrecord_ptg_descripcion_tipopago_det", tipoPago);
                        recTotalesTipoPago.setValue("custrecord_ptg_totaldetalle_", montoPago);
                        recTotalesTipoPago.setValue("custrecord_ptg_tipopagoresumen_", recId);
                        var recTipoPagoIdSaved = recTotalesTipoPago.save();
                        log.debug({
                            title: "ENVASES TIPO DE PAGO",
                            details: "Id Saved: " + recTipoPagoIdSaved,
                        });
                    }
                }
            }


            //PRELIQUIDACION: DETALLE
            //LIQUIDACION: CARBURACION - PTG DETALLE CARBURACION
            //BÚSQUEDA GUARDADA: PTG - Preliq Detalle Despachador
            var detalleDespachadorObj = search.create({
                type: "transaction",
                filters: [
                   ["type","anyof","Opprtnty"], "AND", 
                   ["probability","equalto","100"], "AND", 
                   ["custbody_ptg_estacion_carburacion","anyof", estacionCarburacion], "AND", 
                   ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                   ["mainline","is","F"], "AND",
                   ["taxline","is","F"], "AND", 
                   ["item","anyof",gasLP], "AND", 
                   ["custbody_ptg_liquidado","is","F"]
                ],
                columns:
                [
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({name: "transactionname", label: "Nombre de la transacción"}),
                   search.createColumn({name: "entity", label: "Nombre"}),
                   search.createColumn({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"}),
                   search.createColumn({name: "quantity", label: "Cantidad"}),
                   search.createColumn({name: "rate", label: "Tasa de artículo"}),
                   search.createColumn({name: "amount", label: "Importe"}),
                   search.createColumn({name: "taxamount", label: "Importe (impuestos)"}),
                   search.createColumn({name: "total", label: "Importe (total de transacción)"}),
                   search.createColumn({name: "custbody_ptg_dispensador_", label: "PTG - DISPENSADOR"}),
                   search.createColumn({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"}),
                   search.createColumn({name: "tranid", label: "Número de documento"}),
                   search.createColumn({name: "custbody_ptg_bomba_despachadora", label: "PTG - Bomba Despachadora"}),
                   search.createColumn({name: "custbody_ptg_num_viaje_destino", label: "PTG - Número de Viaje Destino"})
                ]
             });
             var detalleDespachadorResultCount = detalleDespachadorObj.runPaged().count;
             log.debug("detalleDespachadorResultCount", detalleDespachadorResultCount);
             var detalleDespachadorResult = detalleDespachadorObj.run().getRange({
                start: 0,
                end: detalleDespachadorResultCount,
            });
            log.audit("detalleDespachadorResult", detalleDespachadorResult);
            if(incremento_inicio < totalesTipoPagoCount){
                (idOportunidad = detalleDespachadorResult[incremento_inicio].getValue({name: "internalid", label: "ID interno"})),
                (nombreOportunidad = detalleDespachadorResult[incremento_inicio].getValue({name: "transactionname", label: "Nombre de la transacción"})),
                (cliente = detalleDespachadorResult[incremento_inicio].getValue({name: "entity", label: "Nombre"})),
                (opcionPago = detalleDespachadorResult[incremento_inicio].getValue({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"})),
                (cantidad = detalleDespachadorResult[incremento_inicio].getValue({name: "quantity", label: "Cantidad"})),
                (tasa = detalleDespachadorResult[incremento_inicio].getValue({name: "rate", label: "Tasa de artículo"})),
                (importe = detalleDespachadorResult[incremento_inicio].getValue({name: "amount", label: "Importe"})),
                (importeImpuesto = detalleDespachadorResult[incremento_inicio].getValue({name: "taxamount", label: "Importe (impuestos)"})),
                (total = detalleDespachadorResult[incremento_inicio].getValue({name: "total", label: "Importe (total de transacción)"})),
                (despachador = detalleDespachadorResult[incremento_inicio].getValue({name: "custbody_ptg_bomba_despachadora", label: "PTG - Bomba Despachadora"})),
                (registroPago = detalleDespachadorResult[incremento_inicio].getValue({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"})),
                (numeroViajeDestino = detalleDespachadorResult[incremento_inicio].getValue({name: "custbody_ptg_num_viaje_destino", label: "PTG - Número de Viaje Destino"})),
                (numeroDocumento = detalleDespachadorResult[incremento_inicio].getValue({name: "tranid", label: "Número de documento"}));
                log.debug("idOportunidad", idOportunidad);

                var urlModificarPago = urlPago + registroPago + "&e=T";                

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: cliente,
                });
                var direccionCliente = clienteObj.getValue("defaultaddress");
                var nombreCliente = clienteObj.getValue("altname");
                var saldoVencido = clienteObj.getValue("overduebalance");
                var limiteCredito = clienteObj.getValue("creditlimit");
                var saldo = clienteObj.getValue("balance");


                var pagoObj = record.load({
                    id: registroPago,
                    type: "customrecord_ptg_pagos"
                });
                var referenciaPago = pagoObj.getSublistValue({
                    sublistId: "recmachcustrecord_ptg_registro_pagos",
                    fieldId: "custrecord_ptg_referenciapago_",
                    line: 0,
                });
                log.debug("referenciaPago", referenciaPago);

                if(cliente != publicoGeneral && opcionPago == creditoCliente){
                    if((saldoVencido > 0) || (limiteCredito < saldo)){
                        excedeLimite = true;
                        conteoExceso += 1;
                    } else {
                        excedeLimite = false;
                        conteoExceso += 0;
                    }
                } else {
                    excedeLimite = false;
                    conteoExceso += 0;
                }
                

                if(opcionPago == creditoCliente && cliente == publicoGeneral){
                    restriccion = true;
                    conteoRestriccion += 1;
                } else {
                    restriccion = false;
                    conteoRestriccion += 0;
                } 


                var recDetalleDespachador = record.create({
                    type: "customrecord_ptg_detalle_despachador_",
                    isDynamic: true,
                });
                recDetalleDespachador.setValue("custrecord_ptg_numdespachador", despachador);
                recDetalleDespachador.setValue("custrecord_ptg_oportunidad_carburacion", idOportunidad);
                recDetalleDespachador.setValue("custrecord_ptg_notadespachador_", numeroDocumento);
                recDetalleDespachador.setValue("custrecord_ptg_modificar_met_pago_gas", urlModificarPago);
                recDetalleDespachador.setValue("custrecord_ptg_tipopagoespachador_", opcionPago);
                recDetalleDespachador.setValue("custrecord_ptg_ref_pago_", referenciaPago);
                recDetalleDespachador.setValue("custrecord_ptg_clientedespachador_", cliente);
                recDetalleDespachador.setValue("custrecord_ptg_dir_embarque_despachador_", direccionCliente);
                recDetalleDespachador.setValue("custrecord_ptg_num_cli_desp_", nombreCliente);
                recDetalleDespachador.setValue("custrecord_ptg_lts_vendidos_despachador_", cantidad);
                recDetalleDespachador.setValue("custrecord_ptg_preciounidespachador_", tasa);
                recDetalleDespachador.setValue("custrecord_ptg_preciounidespachador_old", tasa);
                recDetalleDespachador.setValue("custrecord_ptg_importe_despachador_", importe);
                recDetalleDespachador.setValue("custrecord_ptg_impuestodespachador_", importeImpuesto);
                recDetalleDespachador.setValue("custrecord_ptg_total_despachador_", total);
                recDetalleDespachador.setValue("custrecord_ptg_saldo_vencido_despachador", saldoVencido);
                recDetalleDespachador.setValue("custrecord_ptg_limite_credit_despachador", limiteCredito);
                recDetalleDespachador.setValue("custrecord_ptg_saldo_despachador", saldo);
                recDetalleDespachador.setValue("custrecord_ptg_excede_limite_despachador", excedeLimite);
                recDetalleDespachador.setValue("custrecord_ptg_restriccion_despachador", restriccion);
                if(opcionPago == prepagoBanorte || opcionPago == prepagoTransferencia || opcionPago == prepagoBancomer || opcionPago == prepagoHSBC || opcionPago == prepagoBanamex || opcionPago == prepagoSantander || opcionPago == prepagoScotian){
                    recDetalleDespachador.setValue("custrecord_ptg_prepago_sin_aplicar_despa", true);
                }
                recDetalleDespachador.setValue("custrecord_ptg_numero_viaje_destino", numeroViajeDestino);
                recDetalleDespachador.setValue("custrecord_ptg_despdetalle_", recId);
                recDetalleDespachador.setValue("custrecord_ptg_detallecrburacion_", recId);
                var recDetalleDespachadorIdSaved = recDetalleDespachador.save();
                log.debug({
                    title: "DETALLE DE DESPACHADOR",
                    details: "Id Saved: " + recDetalleDespachadorIdSaved,
                });

                    var recOportunidadGas = record.create({
                        type: "customrecord_ptg_oportunidades_",
                        isDynamic: true,
                    });
                    recOportunidadGas.setValue("custrecord_ptg_idoportunidad_", idOportunidad);
                    recOportunidadGas.setValue("custrecord_ptg_rel_op_preliq_", recId);
                    if(opcionPago == saldoAFavor && opcionPago == consumoInterno && opcionPago == recirculacion && opcionPago == cancelado){
                        recOportunidadGas.setValue("custrecord_ptg_facturar_servicio", false);
                    }
                    var recOportunidadGasIdSaved = recOportunidadGas.save();
                    log.debug({
                        title: "OPORTUNIDAD GAS",
                        details: "Id Saved: " + recOportunidadGasIdSaved,
                    });
                }



            log.audit('Remaining Usage end proceso', runtime.getCurrentScript().getRemainingUsage());



            if(incremento_inicio != 0){
                var nuevoIncremento = incremento_inicio - 1;
                log.audit("nuevoIncremento", nuevoIncremento);
                var parametros2 = {
                    'recId': recId,
                    'estacionCarburacion': estacionCarburacion,
                    'fechaI': fechaI,
                    'fechaF': fechaF,
                    'incremento_inicio': nuevoIncremento,
                };
                log.audit("parametros2", parametros2);
    
                var redirectToStl2 = redirect.toSuitelet({
                    scriptId: "customscript_drt_liquidacion_carb_sl",
                    deploymentId: "customdeploy_drt_liquidacion_carb_sl",
                    parameters: parametros2
                });
                log.audit("redirectToStl2", redirectToStl2);
            } else {
                log.audit("el incremento es ", incremento_inicio);

                redirect.toRecord({
                    type: 'customrecord_ptg_preliqestcarburacion_',
                    id: recId,
                    parameters: {}
                });
            }

           
        } catch (error) {
            log.error("error onRequest", error);
            redirect.toRecord({
                type: 'customrecord_ptg_preliqestcarburacion_',
                id: recId,
                parameters: {}
            });
        }
    }

    return {
        onRequest: onRequest
    }
});