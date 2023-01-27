/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Liquidacion Carburacion UE 2 COPY
 * Script id: customscript_drt_liquidacion_carb_ue_2_c
 * customer Deployment id: customdeploy_drt_liquidacion_carb_ue_2_c
 * Applied to: PTG - Preliquidación EstaciónCarburación
 * File: drt_liquidacion_carb_ue2_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/format', "N/redirect"], function (record, search, runtime, https, url, format, redirect) {
   
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var estacionCarburacion = customRec.getValue("custrecord_ptg_est_carb_registro_");
                var fechaInicio = customRec.getValue("custrecord_ptg_fecha_iniciof");
                var fechaFin = customRec.getValue("custrecord_ptg_fecha_finf");
                var countBusquedas = [];
                var urlPago = "";
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
                }

                var fechaI = fechaInicio;
                var fechaF = fechaFin;

                var sumaEfectivoTS = 0;
                var sumaCreditoTS = 0;
                var sumaOtrosTS = 0;
                var sumaTS = 0;

                //CABECERA
                //BÚSQUEDA GUARDADA: PTG - Pago Oportunidades Carburacion
                var oportunidadPagoObj = search.create({
                    type: "transaction",
                    filters: [
                       ["type", "anyof", "Opprtnty"], "AND", 
                       ["probability", "equalto", "100"], "AND", 
                       ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion], "AND", 
                       ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                       ["mainline", "is", "F"], "AND", 
                       ["taxline", "is", "F"], "AND", 
                       ["item","anyof",gasLP], "AND", 
                       ["custbody_ptg_liquidado","is","F"]
                    ],
                    columns: [
                       search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})
                    ]
                });
                var oportunidadPagoResultCount = oportunidadPagoObj.runPaged().count;

                countBusquedas.push(oportunidadPagoResultCount);


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
            countBusquedas.push(cilindrosCount);


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
             log.debug("detalleGasTipoPagoObj",detalleGasTipoPagoCount);
             countBusquedas.push(detalleGasTipoPagoCount);


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
             countBusquedas.push(envaseDetalleCount);


            //LIQUIDACION: CILINDROS - PTG ENVASES POR TIPO DE PAGO
            //BÚSQUEDA GUARDADA: PTG - Envases por Tipo de Pago
            var envaseTipoPagoObj = search.create({
                type: "transaction",
                filters: [
                   ["type","anyof","Opprtnty"], "AND", 
                   ["probability","equalto","100"], "AND", 
                   ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion], "AND", 
                   ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                   ["mainline","is","F"], "AND", 
                   ["taxline","is","F"], "AND", 
                   ["item","anyof",envase10,envase20,envase30,envase45], "AND", 
                   ["custbody_ptg_liquidado","is","F"]
                ],
                columns: [
                   search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})
                ]
             });
             var envaseTipoPagoCount = envaseTipoPagoObj.runPaged().count;
             log.debug("envaseTipoPagoCount",envaseTipoPagoCount);
             countBusquedas.push(envaseTipoPagoCount)
            log.audit('Remaining Usage init for totales cabecera start', runtime.getCurrentScript().getRemainingUsage());

            
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
                           search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"}),
                           search.createColumn({name: "amount", label: "Importe"}),
                           search.createColumn({name: "total", label: "Importe (total de transacción)"})
                        ]
                     });
                     var totalesTipoPagoCount = totalesTipoPagoObj.runPaged().count;
                     log.debug("totalesTipoPagoCount", totalesTipoPagoCount);
                     countBusquedas.push(totalesTipoPagoCount);

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
             countBusquedas.push(detalleDespachadorResultCount);

             log.audit("countBusquedas", countBusquedas);

                    

                  var objUpdateVentas = {
                    custrecord_ptg_efectivo_est_carb_: sumaEfectivoTS,
                    custrecord_ptg_credito_est_carb_: sumaCreditoTS,
                    custrecord_ptg_otros_est_carb_: sumaOtrosTS,
                    custrecord_ptg_totalestcarb_: sumaTS,
                    custrecord_ptg_total_efectivo_desglose: sumaEfectivoTS

                };
                log.audit("objUpdateVentas", objUpdateVentas);
                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateVentas,
                });

                log.audit('Remaining Usage init afterSubmit 1', runtime.getCurrentScript().getRemainingUsage());

                var busquedaMayor = maximo(countBusquedas);
                log.audit("busquedaMayor", busquedaMayor);


                if(busquedaMayor > 0){
                    for(var i = 0; i < busquedaMayor; i++){
                        log.audit("*****Entra implementacion "+i+"*****", "*****Entra implementacion "+i+"*****");
                        var parametros = {
                            'recId': recId,
                            'estacionCarburacion': estacionCarburacion,
                            'fechaI': fechaI,
                            'fechaF': fechaF,
                            'incremento_inicio': i,
                        };
                        log.audit("parametros", parametros);
        
                        var redirectToStl = redirect.toSuitelet({
                            scriptId: "customscript_drt_liquidacion_carb_sl",
                            deploymentId: "customdeploy_drt_liquidacion_carb_sl",
                            parameters: parametros
                        });
                        log.audit("redirectToStl", redirectToStl);
                    }            
                }
                log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());
                
            }
            else if (context.type == "edit") {
                log.audit("afterSubmit edit");
                var customRec = context.newRecord;
                var recId = customRec.id;

                var fechaHoraInicio = customRec.getValue("custrecord_ptg_fecha_iniciof");
                log.audit("fechaHoraInicio edit", fechaHoraInicio);
                var fechaHoraFin = customRec.getValue("custrecord_ptg_fecha_finf");
                log.audit("fechaHoraFin edit", fechaHoraFin);

   
            }
        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }

    function maximo(arrayCountBusquedas){
        try {
            return Math.max.apply(null, arrayCountBusquedas);
        } catch (error) {
            log.error("error", error);
        }
    }
    
    return {
        afterSubmit: afterSubmit,
    };
});