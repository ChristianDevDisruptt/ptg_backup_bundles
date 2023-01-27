/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Liquidacion Carburacion UE COPY
 * Script id: customscript_drt_liquidacion_carb_ue_c
 * customer Deployment id: customdeploy_drt_liquidacion_carb_ue_c
 * Applied to: PTG - Preliquidación EstaciónCarburación
 * File: drt_liquidacion_carb_ue_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/format'], function (record, search, runtime, https, url, format) {
    function beforeLoad(scriptContext) {
        try {
            var customRec = scriptContext.newRecord;
            var recId = customRec.id;
            var type_interface = runtime.executionContext;
            var type_event = scriptContext.type;
            var recObj = scriptContext.newRecord;
            var form = scriptContext.form;
            var userRoleId = runtime.getCurrentUser().role;
            var numLiquidacion = customRec.getValue("custrecord_ptg_numliquidacionestcarb_");
            log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "),
            [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
            var estatus = customRec.getValue("custrecord_ptg_liquidacion_status_carb");
            var facturasAGenerar = customRec.getValue("custrecord_ptg_facturas_a_generar_carb");
            var conteoExceso = parseInt(recObj.getValue("custrecord_ptg_conteo_exceso_preliq_carb"));
            var conteoRestriccion = parseInt(recObj.getValue("custrecord_ptg_conteo_restri_preliq_carb"));
            var montoDesgloseEfec = recObj.getValue("custrecord_ptg_total_car");
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
            var gasLP = 0;
            var estatusPreliquidacion = 0;
            var estatusLiquidacion = 0;
            var estatusEjecutado = 0;
            var estatusFacturacion = 0;


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
                gasLP = 4088;
                estatusPreliquidacion = 1;
                estatusLiquidacion = 2;
                estatusEjecutado = 3;
                estatusFacturacion = 4;

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
                gasLP = 4216;
                estatusPreliquidacion = 1;
                estatusLiquidacion = 2;
                estatusEjecutado = 3;
                estatusFacturacion = 4;
            }

            //SS: PTG - Detalle Gas - Prepagos
            var prepagosGasObj = search.create({
                type: "customrecord_ptg_detalle_despachador_",
                filters: [
                   ["custrecord_ptg_detallecrburacion_","anyof",recId], "AND", 
                   ["custrecord_ptg_prepago_sin_aplicar_despa","is","T"]
                ],
                columns:[]
            });
            var prepagosGasObjCount = prepagosGasObj.runPaged().count;

            //SS: PTG - Detalle Cilindros - Prepagos
            var prepagoCilindrosObj = search.create({
                type: "customrecord_ptg_det_gas_tipo_pago_",
                filters: [
                   ["custrecord_ptg_detgas_tipo_pago_","anyof",recId], "AND",
                   ["custrecord_ptg_prepago_sin_aplic_det_gas","is","T"]
                ],
                columns:[]
            });
            var prepagoCilindrosObjCount = prepagoCilindrosObj.runPaged().count;

            //SS: PTG - Detalle Envases - Prepagos
            var prepagoEnvasesObj = search.create({
                type: "customrecord_ptg_detalleenv_est_carb_",
                filters:[
                   ["custrecord_ptg_envdetallecarb_","anyof",recId], "AND", 
                   ["custrecord_ptg_prepago_sin_apl_env_e_car","is","T"]
                ],
                columns:[]
            });
            var prepagoEnvasesObjCount = prepagoEnvasesObj.runPaged().count;

            var prepagosSinAplicar = prepagosGasObjCount + prepagoCilindrosObjCount + prepagoEnvasesObjCount;



            var status = recObj.getValue("custrecord_ptg_liquidacion_status_carb");
            log.debug("status", status);
            if (type_event == "view") {
                if(conteoRestriccion == 0 || conteoRestriccion == ""){
                  
                // Asignando titulo al formulario
                if (status == estatusPreliquidacion && prepagosSinAplicar == 0) {
                    form.title = "Preliquidación Estaciones de Carburación";
                } else if (status == estatusPreliquidacion && prepagosSinAplicar > 0) {
                    form.title = "Preliquidación Estaciones de Carburación | Hay Prepagos Sin Aplicar";
                } else if (status == estatusLiquidacion && montoDesgloseEfec == "") {
                    form.title = "Ingresar Desglose de Efectivo";
                } else if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.title = "Liquidación Estaciones de Carburación";
                } else if (status == estatusEjecutado) {
                    form.title = "Facturación Estaciones de Carburación";
                } else if (status == estatusFacturacion) {
                    form.title = "Liquidación Estaciones de Carburación Facturada";
                }
                
                if (status == estatusPreliquidacion && conteoExceso > 0) {
                    form.addButton({
                        id: "custpage_drt_to_preliqui",
                        label: "Aprobar Preliquidación",
                        functionName: "redirectToAprobar()",
                    });
                } else if (status == estatusPreliquidacion && conteoExceso == 0 && prepagosSinAplicar == 0) {
                    form.addButton({
                        id: "custpage_drt_to_preliqui",
                        label: "Liquidación Estaciones de Carburación",
                        functionName: "redirectTo()",
                    });
                }
                if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.addButton({
                        id: "custpage_drt_to_facturacion",
                        label: "Facturar Estaciones de Carburación",
                        functionName: "facturarOportunidad()",
                    });
                }
                
                var estacionCarburacion = customRec.getValue("custrecord_ptg_est_carb_registro_");
                var fechaInicio = customRec.getValue("custrecord_ptg_fecha_iniciof");
                var fechaFin = customRec.getValue("custrecord_ptg_fecha_finf");
                var fechaI = fechaInicio;
                var fechaF = fechaFin;
                var sumaEfectivo = 0;
                var sumaCredito = 0;
                var sumaOtros = 0;
                var suma = 0;

                var sumaEfectivoTS = 0;
                var sumaCreditoTS = 0;
                var sumaOtrosTS = 0;
                var sumaTS = 0;

                var sumaImporteTotalesEfectivo = 0;
                var sumaImporteTotalesPrepago = 0;
                var sumaImporteTotalesVale = 0;
                var sumaImporteTotalesCortesia = 0;
                var sumaImporteTotalesCredito = 0;
                var sumaImporteTotalesDebito = 0;
                var sumaImporteTotalesTransferencia = 0;
                var sumaImporteTotalesCreditoCliente = 0;
                var sumaImporteTotalesReposicion = 0;
                var sumaImporteTotalesSaldoAFavor = 0;
                var sumaImporteTotalesConsumoInterno = 0;
                var sumaImporteTotalesPrepagoBancomer = 0;
                var sumaImporteTotalesPrepagoHSBC = 0;
                var sumaImporteTotalesPrepagoBanamex = 0;
                var sumaImporteTotalesPrepagoSantander = 0;
                var sumaImporteTotalesPrepagoScotian = 0;
                var sumaImporteTotalesBonificacion = 0;
                var sumaImporteTotalesTicketCard = 0;
                var sumaImporteTotalesCheque = 0;
                var sumaImporteTotalesRecirculacion = 0;
                var sumaImporteTotalesCancelado = 0;
                var sumaImporteTotalesRelleno = 0;
                var sumaImporteTotalesTransfer = 0;
                var sumaImporteTotalesChequeSantander = 0;
                var sumaImporteTotalesChequeScotia = 0;
                var sumaImporteTotalesChequeHSBC = 0;
                var sumaImporteTotalesChequeBanamex = 0;
                var sumaImporteTotalesChequeBanorte = 0;
                var sumaImporteTotalesTarjetaCreditoBancomer = 0;
                var sumaImporteTotalesTarjetaCreditoHSBC = 0;
                var sumaImporteTotalesTarjetaCreditoBanamex = 0;
                var sumaImporteTotalesTarjetaDebitoBanamex = 0;
                var sumaImporteTotalesTarjetaDebitoBancomer = 0;
                var sumaImporteTotalesTarjetaDebitoHSBC = 0;

                var sumaTotalTotalesEfectivo = 0;
                var sumaTotalTotalesPrepago = 0;
                var sumaTotalTotalesVale = 0;
                var sumaTotalTotalesCortesia = 0;
                var sumaTotalTotalesCredito = 0;
                var sumaTotalTotalesDebito = 0;
                var sumaTotalTotalesTransferencia = 0;
                var sumaTotalTotalesCreditoCliente = 0;
                var sumaTotalTotalesReposicion = 0;
                var sumaTotalTotalesSaldoAFavor = 0;
                var sumaTotalTotalesConsumoInterno = 0;
                var sumaTotalTotalesPrepagoBancomer = 0;
                var sumaTotalTotalesPrepagoHSBC = 0;
                var sumaTotalTotalesPrepagoBanamex = 0;
                var sumaTotalTotalesPrepagoSantander = 0;
                var sumaTotalTotalesPrepagoScotian = 0;
                var sumaTotalTotalesBonificacion = 0;
                var sumaTotalTotalesTicketCard = 0;
                var sumaTotalTotalesCheque = 0;
                var sumaTotalTotalesRecirculacion = 0;
                var sumaTotalTotalesCancelado = 0;
                var sumaTotalTotalesRelleno = 0;
                var sumaTotalTotalesTransfer = 0;
                var sumaTotalTotalesChequeSantander = 0;
                var sumaTotalTotalesChequeScotia = 0;
                var sumaTotalTotalesChequeHSBC = 0;
                var sumaTotalTotalesChequeBanamex = 0;
                var sumaTotalTotalesChequeBanorte = 0;
                var sumaTotalTotalesTarjetaCreditoBancomer = 0;
                var sumaTotalTotalesTarjetaCreditoHSBC = 0;
                var sumaTotalTotalesTarjetaCreditoBanamex = 0;
                var sumaTotalTotalesTarjetaDebitoBanamex = 0;
                var sumaTotalTotalesTarjetaDebitoBancomer = 0;
                var sumaTotalTotalesTarjetaDebitoHSBC = 0;

                var oportunidadGasServicios = [];

                //BÚSQUEDA GUARDADA: PTG - Pago Oportunidades Carburacion
                var oportunidadPagoGasObj = search.create({
                    type: "transaction",
                    filters: [
                       ["type", "anyof", "Opprtnty"], "AND", 
                       ["probability", "equalto", "100"], "AND", 
                       ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion], "AND", 
                       ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                       ["mainline", "is", "F"], "AND", 
                       ["taxline", "is", "F"], "AND", 
                       ["item","anyof",gasLP], "AND", 
                       [["custbody_ptg_liquidado","is","F"],"OR",["custbody_ptg_registro_pre_liq_carb","anyof",recId]]
                    ],
                    columns: [
                       search.createColumn({name: "internalid", summary: "GROUP", label: "ID interno"})
                    ]
                });
                 
                var oportunidadPagoGasResultCount = oportunidadPagoGasObj.runPaged().count;
                var oportunidadPagoGasResult = oportunidadPagoGasObj.run().getRange({
                    start: 0,
                    end: oportunidadPagoGasResultCount,
                });
                for(var l = 0; l < oportunidadPagoGasResultCount; l++){
                    var idOportunidadGas = oportunidadPagoGasResult[l].getValue({name: "internalid", summary: "GROUP", label: "ID interno"});
                    log.debug("oportunidades Gas"+l, idOportunidadGas);
                    oportunidadGasServicios.push(idOportunidadGas);
                }

                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoEfectivoGasServObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","anyof", efectivo]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoEfectivoGasServObjCount = tipoPagoEfectivoGasServObj.runPaged().count;
                var tipoPago = 0;

                if(tipoPagoEfectivoGasServObjCount > 0){
                    var tipoPagoEfectivoServGasObjResult = tipoPagoEfectivoGasServObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoEfectivoServGasObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaEfectivo = parseFloat(tipoPagoEfectivoServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoCreditoServGasObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","anyof", creditoCliente]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoCreditoServGasObjCount = tipoPagoCreditoServGasObj.runPaged().count;

                if(tipoPagoCreditoServGasObjCount > 0){
                    var tipoPagoCreditoServGasObjResult = tipoPagoCreditoServGasObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoCreditoServGasObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaCredito = parseFloat(tipoPagoCreditoServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoOtrosServGasObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","noneof", efectivo, creditoCliente]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoOtrosServGasObjCount = tipoPagoOtrosServGasObj.runPaged().count;

                if(tipoPagoOtrosServGasObjCount > 0){
                    var tipoPagoOtrosServGasObjResult = tipoPagoOtrosServGasObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    sumaOtros = parseFloat(tipoPagoOtrosServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }

                suma = sumaEfectivo + sumaCredito + sumaOtros;


                //LIQUIDACION: TOTALES CABECERA
                //BÚSQUEDA GUARDADA: PTG - Pago Oportunidades Carburacion Todos Servicios
                var oportunidadTodosServicios = [];
                var oportunidadPagoTodosServiciosObj = search.create({
                    type: "transaction",
                    filters: [
                       ["type", "anyof", "Opprtnty"], "AND", 
                       ["probability", "equalto", "100"], "AND", 
                       ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion], "AND", 
                       ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                       ["mainline", "is", "F"], "AND",
                       ["taxline", "is", "F"], "AND",
                       [["custbody_ptg_liquidado","is","F"],"OR",["custbody_ptg_registro_pre_liq_carb","anyof",recId]]

                    ],
                    columns: [
                       search.createColumn({name: "internalid", summary: "GROUP", label: "ID interno"})
                    ]
                });
                 
                var oportunidadPagoTodosServiciosResultCount = oportunidadPagoTodosServiciosObj.runPaged().count;

                var oportunidadPagoTodosServiciosResult = oportunidadPagoTodosServiciosObj.run().getRange({
                    start: 0,
                    end: oportunidadPagoTodosServiciosResultCount,
                });
                for(var r = 0; r < oportunidadPagoTodosServiciosResultCount; r++){
                    var idOportunidad = oportunidadPagoTodosServiciosResult[r].getValue({name: "internalid", summary: "GROUP", label: "ID interno"});
                    log.debug("oportunidades Envasea"+r, idOportunidad);
                    oportunidadTodosServicios.push(idOportunidad);
                }

                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoEfectivoServObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                        ["custrecord_ptg_oportunidad","anyof",oportunidadTodosServicios], "AND", 
                        ["custrecord_ptg_tipo_pago","anyof", efectivo]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoEfectivoServObjCount = tipoPagoEfectivoServObj.runPaged().count;
                var tipoPago = 0;

                if(tipoPagoEfectivoServObjCount > 0){
                    var tipoPagoEfectivoServObjResult = tipoPagoEfectivoServObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoEfectivoServObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaEfectivoTS = parseFloat(tipoPagoEfectivoServObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoCreditoServObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                        ["custrecord_ptg_oportunidad","anyof",oportunidadTodosServicios], "AND", 
                        ["custrecord_ptg_tipo_pago","anyof", creditoCliente]
                    ],
                    columns:[
                        search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                        search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoCreditoServObjCount = tipoPagoCreditoServObj.runPaged().count;

                if(tipoPagoCreditoServObjCount > 0){
                    var tipoPagoCreditoServObjResult = tipoPagoCreditoServObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoCreditoServObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaCreditoTS = parseFloat(tipoPagoCreditoServObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoOtrosServObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                        ["custrecord_ptg_oportunidad","anyof",oportunidadTodosServicios], "AND", 
                        ["custrecord_ptg_tipo_pago","noneof", efectivo, creditoCliente]
                    ],
                    columns:[
                        search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoOtrosServObjCount = tipoPagoOtrosServObj.runPaged().count;

                if(tipoPagoOtrosServObjCount > 0){
                    var tipoPagoOtrosServObjResult = tipoPagoOtrosServObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    sumaOtrosTS = parseFloat(tipoPagoOtrosServObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }

                sumaTS = sumaEfectivoTS + sumaCreditoTS + sumaOtrosTS;
                    


                //Búsqueda Guardada: PTG - Oportunidades a Facturar Carburacion
                var facturasAGenerarObj = search.create({
                    type: "customrecord_ptg_oportunidades_",
                    filters: [["custrecord_ptg_rel_op_preliq_", "anyof", recId], "AND", 
                    ["custrecord_ptg_facturar_servicio","is","T"], "AND", 
                    ["custrecord_ptg_idoportunidad_.custbody_ptg_opcion_pago","noneof",saldoAFavor,consumoInterno,recirculacion,cancelado]],
                    columns: []
                });
                var facturasAGenerarObjCount = facturasAGenerarObj.runPaged().count;
    
                if (facturasAGenerarObjCount > 0){
                    //BÚSQUEDA GUARDADA: PTG - Facturas Generadas
                    var facturasGeneradasObj = search.create({
                        type: "customrecord_drt_ptg_registro_factura",
                        filters: [["custrecord_ptg_registro_fac_carburacion","anyof", recId]],
                        columns: []
                    });
                    var facturasGeneradasCount = facturasGeneradasObj.runPaged().count;                    
                     
                    //BÚSQUEDA GUARDADA: PTG - Facturas Generadas Con Errores
                    var facturasGeneradasErroresObj = search.create({
                        type: "customrecord_drt_ptg_registro_factura",
                        filters: [["custrecord_ptg_registro_fac_carburacion","anyof", recId], "AND", ["custrecord_ptg_status","doesnotstartwith","Success"]],
                        columns: []
                    });
                    var facturasGeneradasErroresCount = facturasGeneradasErroresObj.runPaged().count;            
                }

                var objUpdateVentas = {
                    custrecord_ptg_efec_preliqestacion_: sumaEfectivo,
                    custrecord_ptg_credito_estacioncarb_: sumaCredito,
                    custrecord_ptg_otros_preliqestacion_: sumaOtros,
                    custrecord_ptg_total_serv_est_carb_: suma,

                    custrecord_ptg_efectivo_est_carb_: sumaEfectivoTS,
                    custrecord_ptg_credito_est_carb_: sumaCreditoTS,
                    custrecord_ptg_otros_est_carb_: sumaOtrosTS,
                    custrecord_ptg_totalestcarb_: sumaTS,
                    custrecord_ptg_total_efectivo_desglose: sumaEfectivoTS,

                    custrecord_ptg_facturas_a_generar_carb : facturasAGenerarObjCount,
                    custrecord_ptg_facturas_generadas_carb: facturasGeneradasCount,
                    custrecord_ptg_facturas_errores_carb: facturasGeneradasErroresCount,
                };

                log.audit("objUpdateVentas", objUpdateVentas);
                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateVentas,
                });

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
                       [["custbody_ptg_liquidado","is","F"],"OR",
                       ["custbody_ptg_registro_pre_liq_carb","anyof",recId]]
                    ],
                    columns: [
                       search.createColumn({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})
                    ]
                });
                var totalesTipoPagoCount = totalesTipoPagoObj.runPaged().count;
                log.debug("totalesTipoPagoCount", totalesTipoPagoCount);
                var totalesTipoPagoResult = totalesTipoPagoObj.run().getRange({
                    start: 0,
                    end: totalesTipoPagoCount,
                });
                for(var t = 0; t < totalesTipoPagoCount; t++){
                    (tipoPagoTotalesObjOportunidad = totalesTipoPagoResult[t].getValue({name: "custbody_ptg_opcion_pago_obj", label: "PTG - Opción de Pago Obj"})||0);
                    var objValue = JSON.parse(tipoPagoTotalesObjOportunidad);
                    var objValue2 = objValue;
                    var objValue3 = objValue2.pago;
                    var objCount = objValue3.length;

                    for (var u = 0; u < objCount; u++){
                        var objPos = objValue3[u];
                        var objTipoPagoDTP = objPos.tipo_pago;
                        var objMontoPagoDTP = objPos.monto;
                        var totalTotalesPF = parseFloat(objMontoPagoDTP);
                        var importeTotalesPF = parseFloat(totalTotalesPF / 1.16);
                        log.emergency("totalTotalesPF", totalTotalesPF);
                        log.emergency("importeTotalesPF", importeTotalesPF);

                        if(objTipoPagoDTP == efectivo){
                            sumaImporteTotalesEfectivo = sumaImporteTotalesEfectivo + importeTotalesPF;
                            sumaTotalTotalesEfectivo = sumaTotalTotalesEfectivo + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoBanorte){
                            sumaImporteTotalesPrepago = sumaImporteTotalesPrepago + importeTotalesPF;
                            sumaTotalTotalesPrepago = sumaTotalTotalesPrepago + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == vale){
                            sumaImporteTotalesVale = sumaImporteTotalesVale + importeTotalesPF;
                            sumaTotalTotalesVale = sumaTotalTotalesVale + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == cortesia){
                            sumaImporteTotalesCortesia = sumaImporteTotalesCortesia + importeTotalesPF;
                            sumaTotalTotalesCortesia = sumaTotalTotalesCortesia + totalTotalesPF;
                        }                            
                        if(objTipoPagoDTP == tarjetaCredito){
                            sumaImporteTotalesCredito = sumaImporteTotalesCredito + importeTotalesPF;
                            sumaTotalTotalesCredito = sumaTotalTotalesCredito + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaDebito){
                            sumaImporteTotalesDebito = sumaImporteTotalesDebito + importeTotalesPF;
                            sumaTotalTotalesDebito = sumaTotalTotalesDebito + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoTransferencia){
                            sumaImporteTotalesTransferencia = sumaImporteTotalesTransferencia + importeTotalesPF;
                            sumaTotalTotalesTransferencia = sumaTotalTotalesTransferencia + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == creditoCliente){
                            sumaImporteTotalesCreditoCliente = sumaImporteTotalesCreditoCliente + importeTotalesPF;
                            sumaTotalTotalesCreditoCliente = sumaTotalTotalesCreditoCliente + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == reposicion){
                            sumaImporteTotalesReposicion = sumaImporteTotalesReposicion + importeTotalesPF;
                            sumaTotalTotalesReposicion = sumaTotalTotalesReposicion + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == saldoAFavor){
                            sumaImporteTotalesSaldoAFavor = sumaImporteTotalesSaldoAFavor + importeTotalesPF;
                            sumaTotalTotalesSaldoAFavor = sumaTotalTotalesSaldoAFavor + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == consumoInterno){
                            sumaImporteTotalesConsumoInterno = sumaImporteTotalesConsumoInterno + importeTotalesPF;
                            sumaTotalTotalesConsumoInterno = sumaTotalTotalesConsumoInterno + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoBancomer){
                            sumaImporteTotalesPrepagoBancomer = sumaImporteTotalesPrepagoBancomer + importeTotalesPF;
                            sumaTotalTotalesPrepagoBancomer = sumaTotalTotalesPrepagoBancomer + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoHSBC){
                            sumaImporteTotalesPrepagoHSBC = sumaImporteTotalesPrepagoHSBC + importeTotalesPF;
                            sumaTotalTotalesPrepagoHSBC = sumaTotalTotalesPrepagoHSBC + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoBanamex){
                            sumaImporteTotalesPrepagoBanamex = sumaImporteTotalesPrepagoBanamex + importeTotalesPF;
                            sumaTotalTotalesPrepagoBanamex = sumaTotalTotalesPrepagoBanamex + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoSantander){
                            sumaImporteTotalesPrepagoSantander = sumaImporteTotalesPrepagoSantander + importeTotalesPF;
                            sumaTotalTotalesPrepagoSantander = sumaTotalTotalesPrepagoSantander + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == prepagoScotian){
                            sumaImporteTotalesPrepagoScotian = sumaImporteTotalesPrepagoScotian + importeTotalesPF;
                            sumaTotalTotalesPrepagoScotian = sumaTotalTotalesPrepagoScotian + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == bonificacion){
                            sumaImporteTotalesBonificacion = sumaImporteTotalesBonificacion + importeTotalesPF;
                            sumaTotalTotalesBonificacion = sumaTotalTotalesBonificacion + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == ticketCard){
                            sumaImporteTotalesTicketCard = sumaImporteTotalesTicketCard + importeTotalesPF;
                            sumaTotalTotalesTicketCard = sumaTotalTotalesTicketCard + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeBancomer){
                            sumaImporteTotalesCheque = sumaImporteTotalesCheque + importeTotalesPF;
                            sumaTotalTotalesCheque = sumaTotalTotalesCheque + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == recirculacion){
                            sumaImporteTotalesRecirculacion = sumaImporteTotalesRecirculacion + importeTotalesPF;
                            sumaTotalTotalesRecirculacion = sumaTotalTotalesRecirculacion + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == cancelado){
                            sumaImporteTotalesCancelado = sumaImporteTotalesCancelado + importeTotalesPF;
                            sumaTotalTotalesCancelado = sumaTotalTotalesCancelado + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == relleno){
                            sumaImporteTotalesRelleno = sumaImporteTotalesRelleno + importeTotalesPF;
                            sumaTotalTotalesRelleno = sumaTotalTotalesRelleno + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == transferencia){
                            sumaImporteTotalesTransfer = sumaImporteTotalesTransfer + importeTotalesPF;
                            sumaTotalTotalesTransfer = sumaTotalTotalesTransfer + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeSantander){
                            sumaImporteTotalesChequeSantander = sumaImporteTotalesChequeSantander + importeTotalesPF;
                            sumaTotalTotalesChequeSantander = sumaTotalTotalesChequeSantander + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeScotian){
                            sumaImporteTotalesChequeScotia = sumaImporteTotalesChequeScotia + importeTotalesPF;
                            sumaTotalTotalesChequeScotia = sumaTotalTotalesChequeScotia + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeHSBC){
                            sumaImporteTotalesChequeHSBC = sumaImporteTotalesChequeHSBC + importeTotalesPF;
                            sumaTotalTotalesChequeHSBC = sumaTotalTotalesChequeHSBC + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeBanamex){
                            sumaImporteTotalesChequeBanamex = sumaImporteTotalesChequeBanamex + importeTotalesPF;
                            sumaTotalTotalesChequeBanamex = sumaTotalTotalesChequeBanamex + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == chequeBanorte){
                            sumaImporteTotalesChequeBanorte = sumaImporteTotalesChequeBanorte + importeTotalesPF;
                            sumaTotalTotalesChequeBanorte = sumaTotalTotalesChequeBanorte + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaCreditoBancomer){
                            sumaImporteTotalesTarjetaCreditoBancomer = sumaImporteTotalesTarjetaCreditoBancomer + importeTotalesPF;
                            sumaTotalTotalesTarjetaCreditoBancomer = sumaTotalTotalesTarjetaCreditoBancomer + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaCreditoHSBC){
                            sumaImporteTotalesTarjetaCreditoHSBC = sumaImporteTotalesTarjetaCreditoHSBC + importeTotalesPF;
                            sumaTotalTotalesTarjetaCreditoHSBC = sumaTotalTotalesTarjetaCreditoHSBC + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaCreditoBanamex){
                            sumaImporteTotalesTarjetaCreditoBanamex = sumaImporteTotalesTarjetaCreditoBanamex + importeTotalesPF;
                            sumaTotalTotalesTarjetaCreditoBanamex = sumaTotalTotalesTarjetaCreditoBanamex + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaDebitoBanamex){
                            sumaImporteTotalesTarjetaDebitoBanamex = sumaImporteTotalesTarjetaDebitoBanamex + importeTotalesPF;
                            sumaTotalTotalesTarjetaDebitoBanamex = sumaTotalTotalesTarjetaDebitoBanamex + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaDebitoBancomer){
                            sumaImporteTotalesTarjetaDebitoBancomer = sumaImporteTotalesTarjetaDebitoBancomer + importeTotalesPF;
                            sumaTotalTotalesTarjetaDebitoBancomer = sumaTotalTotalesTarjetaDebitoBancomer + totalTotalesPF;
                        }
                        if(objTipoPagoDTP == tarjetaDebitoHSBC){
                            sumaImporteTotalesTarjetaDebitoHSBC = sumaImporteTotalesTarjetaDebitoHSBC + importeTotalesPF;
                            sumaTotalTotalesTarjetaDebitoHSBC = sumaTotalTotalesTarjetaDebitoHSBC + totalTotalesPF;
                        }
                    }                      
                }

                //BÚSUQEDA GUARDADA: PTG - Totales por tipo de pago Actualizar SS
                var totalesPagosObj = search.create({
                    type: "customrecord_ptg_totalestipopago_detalle",
                    filters: [["custrecord_ptg_tipopagoresumen_","anyof",recId]],
                    columns: [
                        search.createColumn({name: "internalid", label: "ID interno"}),
                        search.createColumn({name: "custrecord_ptg_descripcion_tipopago_det", label: "PTG - Descripción tipo de pago detalle"})
                     ]
                });
                var totalesPagosObjCount = totalesPagosObj.runPaged().count;
                var totalesPagosObjResult = totalesPagosObj.run().getRange({
                    start: 0,
                    end: totalesPagosObjCount,
                });
                var objUpdateTipoPagoDetalle = {};
                for(var t = 0; t < totalesPagosObjCount; t++){
                    (idInterno = totalesPagosObjResult[t].getValue({name: "internalid", label: "ID interno"})||0),
                    (tipoPagoDetalle = totalesPagosObjResult[t].getValue({name: "custrecord_ptg_descripcion_tipopago_det", label: "PTG - Descripción tipo de pago detalle"})||0);
                    

                    for (var v = 1; v < 37; v++){                            
                        if (v != multiple){
                            //LIQUIDACION: TOTALES - LINEA
                            if(tipoPagoDetalle == efectivo){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_ = sumaImporteTotalesEfectivo.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesEfectivo.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoBanorte){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepago.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepago.toFixed(2);
                            } else if(tipoPagoDetalle == vale){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesVale.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesVale.toFixed(2);
                            } else if(tipoPagoDetalle == cortesia){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesCortesia.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesCortesia.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaCredito){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesCredito.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesCredito.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaDebito){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesDebito.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesDebito.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoTransferencia){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTransferencia.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTransferencia.toFixed(2);
                            } else if(tipoPagoDetalle == creditoCliente){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesCreditoCliente.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesCreditoCliente.toFixed(2);
                            } else if(tipoPagoDetalle == reposicion){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesReposicion.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesReposicion.toFixed(2);
                            } else if(tipoPagoDetalle == saldoAFavor){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesSaldoAFavor.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesSaldoAFavor.toFixed(2);
                            } else if(tipoPagoDetalle == consumoInterno){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesConsumoInterno.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesConsumoInterno.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoBancomer){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepagoBancomer.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepagoBancomer.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoHSBC){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepagoHSBC.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepagoHSBC.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoBanamex){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepagoBanamex.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepagoBanamex.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoSantander){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepagoSantander.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepagoSantander.toFixed(2);
                            } else if(tipoPagoDetalle == prepagoScotian){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesPrepagoScotian.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesPrepagoScotian.toFixed(2);
                            } else if(tipoPagoDetalle == bonificacion){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesBonificacion.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesBonificacion.toFixed(2);
                            } else if(tipoPagoDetalle == ticketCard){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTicketCard.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTicketCard.toFixed(2);
                            } else if(tipoPagoDetalle == chequeBancomer){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesCheque.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesCheque.toFixed(2);
                            } else if(tipoPagoDetalle == recirculacion){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesRecirculacion.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesRecirculacion.toFixed(2);
                            } else if(tipoPagoDetalle == cancelado){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesCancelado.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesCancelado.toFixed(2);
                            } else if(tipoPagoDetalle == relleno){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesRelleno.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesRelleno.toFixed(2);
                            } else if(tipoPagoDetalle == transferencia){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTransfer.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTransfer.toFixed(2);
                            } else if(tipoPagoDetalle == chequeSantander){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesChequeSantander.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesChequeSantander.toFixed(2);
                            } else if(tipoPagoDetalle == chequeScotian){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesChequeScotia.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesChequeScotia.toFixed(2);
                            } else if(tipoPagoDetalle == chequeHSBC){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesChequeHSBC.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesChequeHSBC.toFixed(2);
                            } else if(tipoPagoDetalle == chequeBanamex){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesChequeBanamex.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesChequeBanamex.toFixed(2);
                            } else if(tipoPagoDetalle == chequeBanorte){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesChequeBanorte.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesChequeBanorte.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaCreditoBancomer){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaCreditoBancomer.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaCreditoBancomer.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaCreditoHSBC){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaCreditoHSBC.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaCreditoHSBC.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaCreditoBanamex){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaCreditoBanamex.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaCreditoBanamex.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaDebitoBanamex){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaDebitoBanamex.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaDebitoBanamex.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaDebitoBancomer){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaDebitoBancomer.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaDebitoBancomer.toFixed(2);
                            } else if(tipoPagoDetalle == tarjetaDebitoHSBC){
                                objUpdateTipoPagoDetalle.custrecord_ptg_importedetalle_= sumaImporteTotalesTarjetaDebitoHSBC.toFixed(2);
                                objUpdateTipoPagoDetalle.custrecord_ptg_totaldetalle_= sumaTotalTotalesTarjetaDebitoHSBC.toFixed(2);
                            }                            
                        }
                    }
                    var recTotalesTipoPagoIdSaved = record.submitFields({
                        id: idInterno,
                        type: "customrecord_ptg_totalestipopago_detalle",
                        values: objUpdateTipoPagoDetalle
                    })
                    log.debug({
                        title: "ACTUALIZAR PAGOS",
                        details: "Id Saved: " + recTotalesTipoPagoIdSaved,
                    });
                }

                var totalOtros = sumaTotalTotalesPrepago + sumaTotalTotalesVale + sumaTotalTotalesCortesia + sumaTotalTotalesCredito + sumaTotalTotalesDebito + sumaTotalTotalesTransferencia + sumaTotalTotalesReposicion + sumaTotalTotalesSaldoAFavor + sumaTotalTotalesConsumoInterno + sumaTotalTotalesPrepagoBancomer + sumaTotalTotalesPrepagoHSBC + sumaTotalTotalesPrepagoBanamex + sumaTotalTotalesPrepagoSantander + sumaTotalTotalesPrepagoScotian + sumaTotalTotalesBonificacion + sumaTotalTotalesTicketCard + sumaTotalTotalesCheque + sumaTotalTotalesRecirculacion + sumaTotalTotalesCancelado + sumaTotalTotalesRelleno + sumaTotalTotalesTransfer + sumaTotalTotalesChequeSantander + sumaTotalTotalesChequeScotia + sumaTotalTotalesChequeHSBC + sumaTotalTotalesChequeBanamex + sumaTotalTotalesChequeBanorte;
                var totalEstCarb = totalOtros + sumaTotalTotalesEfectivo + sumaTotalTotalesCreditoCliente;


                var objUpdateTotalesCabecera = {
                    custrecord_ptg_efectivo_est_carb_: sumaTotalTotalesEfectivo,
                    custrecord_ptg_credito_est_carb_: sumaTotalTotalesCreditoCliente,
                    custrecord_ptg_otros_est_carb_: totalOtros,
                    custrecord_ptg_totalestcarb_: totalEstCarb,
                    custrecord_ptg_prepago_sin_aplicar_carb: prepagosSinAplicar,
                }


                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateTotalesCabecera,
                });


            } else {
                form.title = "Preliquidación con Crédito a Público General";
            }

            } else if (type_event == "edit"){
                if(status == estatusLiquidacion){
                    form.addButton({
                        id: "custpage_drt_borrar_montos_carb",
                        label: "Borrar Desglose",
                        functionName: "borrarDesglose()",
                    });
                }
            }
            form.clientScriptModulePath = "./drt_preliq_liquidacion_carb_cs.js";

            log.audit('Remaining Usage init beforeLoad end', runtime.getCurrentScript().getRemainingUsage());
        } catch (error) {
            log.error("ERROR beforeLoad", error);
        }
    }
    
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var estacionCarburacion = customRec.getValue("custrecord_ptg_est_carb_registro_");
                var fechaInicio = customRec.getValue("custrecord_ptg_fecha_iniciof");
                var fechaFin = customRec.getValue("custrecord_ptg_fecha_finf");
                var conteoExceso = 0;
                var conteoRestriccion = 0;
                var fechaI = fechaInicio;
                var fechaF = fechaFin;
                var sumaEfectivo = 0;
                var sumaCredito = 0;
                var sumaOtros = 0;
                var suma = 0;
                var totalUltimoCorteB1 = customRec.getValue("custrecord_ptg_tot_ult_corte_1");
                var totalEstaCorteB1 = customRec.getValue("custrecord_ptg_control_en_lts_1");
                var nuevoTotalB1 = totalUltimoCorteB1 + totalEstaCorteB1;
                var totalUltimoCorteB2 = customRec.getValue("custrecord_ptg_total_ult_corte_2");
                var totalEstaCorteB2 = customRec.getValue("custrecord_ptg_control_en_lts_2");
                var nuevoTotalB2 = totalUltimoCorteB2 + totalEstaCorteB2;
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
                    gasLP = 4216;
                }



                //CABECERA
                //BÚSQUEDA GUARDADA: PTG - Pago Oportunidades Carburacion
                var oportunidadGasServicios = [];
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
                        search.createColumn({name: "internalid", summary: "GROUP", label: "ID interno"})
                    ]
                });
                var oportunidadPagoResultCount = oportunidadPagoObj.runPaged().count;
                var oportunidadPagoResult = oportunidadPagoObj.run().getRange({
                    start: 0,
                    end: oportunidadPagoResultCount,
                });
                for(var l = 0; l < oportunidadPagoResultCount; l++){
                    var idOportunidadGas = oportunidadPagoResult[l].getValue({name: "internalid", summary: "GROUP", label: "ID interno"});
                    log.debug("oportunidades Gas"+l, idOportunidadGas);
                    oportunidadGasServicios.push(idOportunidadGas);
                }

                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoEfectivoGasServObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","anyof", efectivo]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoEfectivoGasServObjCount = tipoPagoEfectivoGasServObj.runPaged().count;
                var tipoPago = 0;

                if(tipoPagoEfectivoGasServObjCount > 0){
                    var tipoPagoEfectivoServGasObjResult = tipoPagoEfectivoGasServObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoEfectivoServGasObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaEfectivo = parseFloat(tipoPagoEfectivoServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoCreditoServGasObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","anyof", creditoCliente]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoCreditoServGasObjCount = tipoPagoCreditoServGasObj.runPaged().count;

                if(tipoPagoCreditoServGasObjCount > 0){
                    var tipoPagoCreditoServGasObjResult = tipoPagoCreditoServGasObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    tipoPago = tipoPagoCreditoServGasObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"});
                    sumaCredito = parseFloat(tipoPagoCreditoServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }


                //SS: PTG - Pagos Oportunidad Lineas SS
                var tipoPagoOtrosServGasObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_oportunidad","anyof",oportunidadGasServicios], "AND", 
                       ["custrecord_ptg_tipo_pago","noneof", efectivo, creditoCliente]
                    ],
                    columns:[
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                });
                var tipoPagoOtrosServGasObjCount = tipoPagoOtrosServGasObj.runPaged().count;

                if(tipoPagoOtrosServGasObjCount > 0){
                    var tipoPagoOtrosServGasObjResult = tipoPagoOtrosServGasObj.run().getRange({
                        start: 0,
                        end: 2,
                    });
                    sumaOtros = parseFloat(tipoPagoOtrosServGasObjResult[0].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})).toFixed(6);
                }

                suma = sumaEfectivo + sumaCredito + sumaOtros;



                  var objUpdateVentas = {
                    custrecord_ptg_efec_preliqestacion_: sumaEfectivo,
                    custrecord_ptg_credito_estacioncarb_: sumaCredito,
                    custrecord_ptg_otros_preliqestacion_: sumaOtros,
                    custrecord_ptg_total_serv_est_carb_: suma,
                    custrecord_ptg_tot_ult_liqu_bomba1_: totalUltimoCorteB1,
                    custrecord_ptg_lts_reportados_bomba1_: totalEstaCorteB1,
                    custrecord_ptg_nuevo_tot_bomba1_: nuevoTotalB1,
                    custrecord_ptg_tot_ult_liqu_bomba2_: totalUltimoCorteB2,
                    custrecord_ptg_lts_reportados_bomba2_: totalEstaCorteB2,
                    custrecord_ptg_nuevo_tot_bomba2_: nuevoTotalB2,
                    custrecord_ptg_conteo_exceso_preliq_carb: conteoExceso,
                    custrecord_ptg_conteo_restri_preliq_carb: conteoRestriccion,
                };
                log.audit("objUpdateVentas", objUpdateVentas);
                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateVentas,
                });

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

    function beforeSubmit(scriptContext) {
        try {
            if (scriptContext.type == "create") {
            var customRec = scriptContext.newRecord;
            var recId = customRec.id;
            var numLiquidacion = customRec.getValue("custrecord_ptg_numliquidacionestcarb_");
            log.audit("numLiquidacion", numLiquidacion);

            if(!numLiquidacion || numLiquidacion == "Por Asignar"){
                log.audit("recId", recId);
                //BÚSQUEDA GUARDADA: PTG - Carburación Num Liq
            var carburacionObj = search.create({
                type: "customrecord_ptg_preliqestcarburacion_",
                filters:[],
                columns:[]
            });
             var carburacionResultCount = carburacionObj.runPaged().count;
                log.debug("folioResultCount", carburacionResultCount);

             if(carburacionResultCount > 0){
                carburacionResultCountPI = parseInt(carburacionResultCount);
                        numeroEntero = carburacionResultCountPI + 1;
                        log.audit("numeroEntero else", numeroEntero);
                        customRec.setValue("custrecord_ptg_numliquidacionestcarb_", numeroEntero.toFixed(0));
                        customRec.setValue("name", numeroEntero.toFixed(0));
             } else {
                customRec.setValue("custrecord_ptg_numliquidacionestcarb_", "1");
                customRec.setValue("name", "1");
             }
            }
        }


        } catch (error) {
            log.error("ERROR", error);
        }
    }
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit,
    };
});