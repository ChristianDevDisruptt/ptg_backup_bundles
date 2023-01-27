/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Liquidacion Estacionarios UE COPY
 * Script id: customscript_drt_liquidacion_esta_ue_c
 * customer Deployment id: customdeploy_drt_liquidacion_esta_ue_c
 * Applied to: PTG - PreLiquidacion Estacionarios
 * File: drt_liquidacion_esta_ue_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/task'], function (record, search, runtime, https, url, task) {
    function beforeLoad(scriptContext) {
        try {
            var customRec = scriptContext.newRecord;
            var recId = customRec.id;
            var folio = customRec.getValue("custrecord_ptg_folio_preliq_est_");
            log.audit("folio", folio);
            var type_interface = runtime.executionContext;
            var type_event = scriptContext.type;
            var recObj = scriptContext.newRecord;
            var form = scriptContext.form;
            var userRoleId = runtime.getCurrentUser().role;
            log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "),
            [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
            var numViaje = recObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
            var conteoExceso = parseInt(recObj.getValue("custrecord_ptg_conteo_exceso_preliq_est"));
            var conteoRestriccion = parseInt(recObj.getValue("custrecord_ptg_conteo_restric_preliq_est"));
            var prepagosSinAplicar = parseInt(recObj.getValue("custrecord_ptg_prepago_sin_ap_preliq_est"));
            var montoDesgloseEfec = recObj.getValue("custrecord_ptg_total_efectivo_esta");
            var efectivo = 0;
            var tdebito = 0;
            var tcredito = 0;
            var credito = 0;
            var cortesia = 0;
            var prepagos = 0;
            var reposicion = 0;
            var bonificacion = 0;
            var cheque = 0;
            var transferencia = 0;
            var otros = 0;
            var total = 0;
            var objUpdate = {};
            log.emergency("prepagosSinAplicar", prepagosSinAplicar);

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
                

            //BÚSQUEDA GUARDADA: PTG - PreLiquidacion Estacionarios Folio
            //Aqui va lo del folio consecutivo, lo pasé arriba

            //BÚSQUEDA GUARDADA: PTG - Conteo Prepagos Sin Aplicar - Estacionarios
            var prepagosObj = search.create({
                type: "customrecord_ptg_ventas_estacionario",
                filters: [
                   ["custrecord_ptg_preliqui_rel_vts_","anyof",recId], "AND", 
                   ["custrecord_ptg_prepago_aplicado_est_vts_","is","T"]
                ],
                columns:[
                   search.createColumn({name: "custrecord_ptg_prepago_aplicado_est_vts_", label: "PTG - Prepago Sin Aplicar"})
                ]
            });
            var prepagosObjCount = prepagosObj.runPaged().count;


            //BÚSQUEDA GUARDADA: DRT - PTG - Oportunidades a Facturar Estacionarios
            var facturasAGenerarObj = search.create({
                type: "customrecord_ptg_ventas_estacionario",
                filters: [
                   ["custrecord_ptg_num_viaje_est_vts_","anyof",numViaje], "AND", 
                   ["custrecord_ptg_registro_oportunidad","is","F"], "AND", 
                   ["custrecord_ptg_modificar_met_pago","isnotempty",""], "AND", 
                   ["custrecord_ptg_tipodepago_estacionarios_","noneof",saldoAFavor,consumoInterno,cancelado,recirculacion], "AND", 
                   ["custrecord_ptg_preliqui_rel_vts_","anyof",recId], "AND", 
                   ["custrecord_ptg_invalidar_est_vts_","is","F"]
                ],
                columns: [
                   search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", summary: "GROUP", label: "PTG - Oportunidad Estacionario"})
                ]
             });
             var facturasAGenerarObjCount = facturasAGenerarObj.runPaged().count;
             log.audit("facturasAGenerarObjCount", facturasAGenerarObjCount);
             //BÚSQUEDA GUARDADA: PTG - Facturas Generadas
             var facturasGeneradasObj = search.create({
                type: "customrecord_drt_ptg_registro_factura",
                filters: [["custrecord_ptg_num_viaje_fac_estac","anyof", recId]],
                columns: []
             });
             var facturasGeneradasCount = facturasGeneradasObj.runPaged().count;
             log.debug("facturasGeneradasObj result count",facturasGeneradasCount);
            
            //BÚSQUEDA GUARDADA: PTG - Facturas Generadas Con Errores
            var facturasGeneradasErroresObj = search.create({
                type: "customrecord_drt_ptg_registro_factura",
                filters: [["custrecord_ptg_num_viaje_fac_estac","anyof", recId], "AND", ["custrecord_ptg_status","doesnotstartwith","Success"]],
                columns: []
             });
             var facturasGeneradasErroresCount = facturasGeneradasErroresObj.runPaged().count;
             log.debug("facturasGeneradasErroresObj result count",facturasGeneradasErroresCount);

             if (facturasGeneradasCount > 0){
                log.debug("entra if facturasGeneradasCount");

               objUpdate = {
                custrecord_ptg_total_a_facturar_estac: facturasAGenerarObjCount,
                custrecord_ptg_facturas_generadas_estac: facturasGeneradasCount,
                custrecord_ptg_facturas_errores_estac: facturasGeneradasErroresCount,
               };
               log.audit("objUpdate", objUpdate);
   
            }


            var status = recObj.getValue("custrecord_ptg_liquidacion_status_est");
            log.debug("status", status);
            if (type_event == "view") {
                if(conteoRestriccion == 0 || conteoRestriccion == ""){
                var totalFactura = recObj.getValue("custrecord_ptg_total_a_facturar_estac");
                log.debug("totalFactura", totalFactura);
                var facturasGeneradas = recObj.getValue("custrecord_ptg_facturas_generadas_estac");
                log.debug("facturasGeneradas", facturasGeneradas);
                if (status == estatusPreliquidacion && prepagosSinAplicar == 0) {
                    form.title = "Preliquidación Estacionarios";
                } else if (status == estatusPreliquidacion && prepagosSinAplicar > 0) {
                    form.title = "Preliquidación Estacionarios | Hay Prepagos Sin Aplicar";
                } else if (status == estatusLiquidacion && montoDesgloseEfec == "") {
                    form.title = "Liquidación Estacionarios | Ingresar Desglose de Efectivo";
                } else if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.title = "Liquidación Estacionarios";
                } else if (status == estatusEjecutado) {
                    form.title = "Facturación Estacionarios";
                } else if (status == estatusFacturacion) {
                    form.title = "Liquidación Estacionarios Facturada";
                }

                if (status == estatusPreliquidacion && conteoExceso != 0) {
                    log.audit("entra boton");
                    form.addButton({
                        id: "custpage_drt_aprobar_preliqui",
                        label: "Aprobar Preliquidación",
                        functionName: "redirectToAprobar()",
                    });
                } else if (status == estatusPreliquidacion && conteoExceso == 0 && (prepagosSinAplicar == 0 || !prepagosSinAplicar)) {
                    form.addButton({
                        id: "custpage_drt_to_preliqui",
                        label: "Liquidación Estacionarios",
                        functionName: "redirectTo()",
                    });
                }
                if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.addButton({
                        id: "custpage_drt_to_nuevo_viaje",
                        label: "Nuevo Viaje y Facturar",
                        functionName: "redirectToNuevoViajeYFacturacion()",
                    });
                }
                
                if (status == estatusFacturacion) {
                    record.submitFields({
                        id: customRec.id,
                        type: customRec.type,
                        values: objUpdate,
                      });
                }

                var sumaEfectivo = 0;
                var sumaTarjetaDebito = 0;
                var sumaTarjetaCredito = 0;
                var sumaCredito = 0;
                var sumaCortesia = 0;
                var sumaPrepagos = 0;
                var sumaReposicion = 0;
                var sumaBonificacion = 0;
                var sumaCheque = 0;
                var sumaTransferencia = 0;
                var sumaOtros = 0;
                var suma = 0;

                //BÚSQUEDA GUARDADA: PTG - Pagos Oportunidad Estacionarios SS
                var tipoPagosObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_num_viaje","anyof",numViaje]/*, "AND", 
                       ["custrecord_registro_desde_oportunidad_po","is","T"]*/
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                 });
                 var tipoPagosObjCount = tipoPagosObj.runPaged().count;
                 var tipoPagosObjResult = tipoPagosObj.run().getRange({
                    start: 0,
                    end: tipoPagosObjCount,
                });
                
                var totalLitrosBG = 0;
                for(var m = 0; m < tipoPagosObjCount; m++){
                    (tipoPago = tipoPagosObjResult[m].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"})),
                    (totalPago = tipoPagosObjResult[m].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"}));
                    if(tipoPago == efectivo){ //EFECTIVO
                        sumaEfectivo = parseFloat(totalPago);
                    } else if (tipoPago == tarjetaDebito || tipoPago == tarjetaDebitoBanamex || tipoPago == tarjetaDebitoBancomer || tipoPago == tarjetaDebitoHSBC){ //TARJETA DEBITO
                        sumaTarjetaDebito = parseFloat(totalPago);
                    } else if (tipoPago == tarjetaCredito || tipoPago == tarjetaCreditoBancomer || tipoPago == tarjetaCreditoHSBC || tipoPago == tarjetaCreditoBanamex){ //TARJETA CREDITO
                        sumaTarjetaCredito = parseFloat(totalPago);
                    } else if (tipoPago == creditoCliente){ //CREDITO CLIENTE
                        sumaCredito = parseFloat(totalPago);
                    } else if (tipoPago == cortesia){ //CORTESIA
                        sumaCortesia = parseFloat(totalPago);
                    } else if (tipoPago == prepagoBanorte || tipoPago == prepagoTransferencia || tipoPago == prepagoBancomer || tipoPago == prepagoHSBC || tipoPago == prepagoBanamex || tipoPago == prepagoSantander || tipoPago == prepagoScotian){ //PREPAGOS
                        sumaPrepagos = parseFloat(totalPago);
                    } else if (tipoPago == reposicion){ //REPOSICION
                        sumaReposicion = parseFloat(totalPago);
                    } else if (tipoPago == bonificacion){ //BONIFICACION
                        sumaBonificacion = parseFloat(totalPago);
                    } else if (tipoPago == chequeBancomer || tipoPago == chequeSantander || tipoPago == chequeScotian || tipoPago == chequeHSBC || tipoPago == chequeBanamex || tipoPago == chequeBanorte){ //CHEQUE
                        sumaCheque = parseFloat(totalPago);
                    } else if (tipoPago == transferencia){ //TRANSFERENCIA
                        sumaTransferencia = parseFloat(totalPago);
                    } else if(tipoPago == vale || tipoPago == saldoAFavor || tipoPago == relleno){
                        sumaOtros += parseFloat(totalPago);
                    }
                }

                suma = sumaEfectivo + sumaTarjetaDebito + sumaTarjetaCredito + sumaCredito + sumaCortesia + sumaPrepagos + sumaReposicion + sumaBonificacion + sumaCheque + sumaTransferencia + sumaOtros;

                  var objUpdateVentas = {
                    custrecord_ptg_efectivo_preliq_est_: sumaEfectivo,
                    custrecord_ptg_total_efectivo_est_: sumaEfectivo,
                    custrecord_ptg_credito_preliq_est_: sumaCredito,
                    custrecord_ptg_t_debito_preliq_est_: sumaTarjetaDebito,
                    custrecord_ptg_t_credito_preliq_est_: sumaTarjetaCredito,
                    custrecord_ptg_cortesia_preliq_est_: sumaCortesia,
                    custrecord_ptg_prepagos_preliq_est_: sumaPrepagos,
                    custrecord_ptg_reposicion_preliq_est_: sumaReposicion,
                    custrecord_ptg_bonificacion_preliq_est_: sumaBonificacion,
                    custrecord_ptg_cheque_preliq_est_: sumaCheque,
                    custrecord_ptg_transferencia_preliq_est_: sumaTransferencia,
                    custrecord_ptg_otros_preliq_est_: sumaOtros,
                    custrecord_ptg_total_preliq_est_: suma,
                    custrecord_ptg_conteo_exceso_preliq_est: conteoExceso,
                    custrecord_ptg_conteo_restric_preliq_est: conteoRestriccion,
                };
                log.audit("objUpdateVentas", objUpdateVentas);
                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateVentas,
/*                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true,
                    },*/
                });
                

                /*var recordObj = record.load({
                    type: customRec.type,
                    id: customRec.id,
                });
                var lineasTipoPago = recordObj.getLineCount({sublistId: "recmachcustrecord_ptg_preliqui_rel_vts_"});
                log.audit("lineasTipoPago", lineasTipoPago);
                var efectivoPF = 0;
                var tdebitoPF = 0;
                var tcreditoPF = 0;
                var creditoPF = 0;
                var cortesiaPF = 0;
                var prepagosPF = 0;
                var reposicionPF = 0;
                var bonificacionPF = 0;
                var chequePF = 0;
                var transferenciaPF = 0;
                var otrosPF = 0;
    
                for (var t = 0; t < lineasTipoPago; t++){
                    tipoPagoArray = recordObj.getSublistValue({
                        sublistId: "recmachcustrecord_ptg_preliqui_rel_vts_",
                        fieldId: "custrecord_ptg_tipodepago_estacionarios_",
                        line: t,
                    });
                    log.audit("tipoPagoArray "+t, tipoPagoArray);
    
                    montoPagoArray = recordObj.getSublistValue({
                        sublistId: "recmachcustrecord_ptg_preliqui_rel_vts_",
                        fieldId: "custrecord_ptg_total_est_vts_",
                        line: t,
                    });
                    log.audit("montoPagoArray "+t, montoPagoArray);
    
                    if(tipoPagoArray == efectivo){ //EFECTIVO
                        efectivo += montoPagoArray
                        efectivoPF = parseFloat(efectivo);
                    }
                    else if(tipoPagoArray == tarjetaDebito || tipoPagoArray == tarjetaDebitoBanamex || tipoPagoArray == tarjetaDebitoBancomer || tipoPagoArray == tarjetaDebitoHSBC){ //TARJETA DEBITO
                        tdebito += montoPagoArray
                        tdebitoPF = parseFloat(tdebito);
                    }
                    else if(tipoPagoArray == tarjetaCredito || tipoPagoArray == tarjetaCreditoBancomer || tipoPagoArray == tarjetaCreditoHSBC || tipoPagoArray == tarjetaCreditoBanamex){ //TARJETA CREDITO
                        tcredito += montoPagoArray
                        tcreditoPF = parseFloat(tcredito);
                    }
                    else if(tipoPagoArray == creditoCliente){ //CREDITO
                        credito += montoPagoArray
                        creditoPF = parseFloat(credito);
                    }
                    else if(tipoPagoArray == cortesia){ //CORTESIA
                        cortesia += montoPagoArray
                        cortesiaPF = parseFloat(cortesia);
                    }
                    else if(tipoPagoArray == prepagoBanorte || tipoPagoArray == prepagoTransferencia || tipoPagoArray == prepagoBancomer || tipoPagoArray == prepagoHSBC || tipoPagoArray == prepagoBanamex || tipoPagoArray == prepagoSantander || tipoPagoArray == prepagoScotian){ //PREPAGOS
                        prepagos += montoPagoArray
                        prepagosPF = parseFloat(prepagos);
                    }
                    else if(tipoPagoArray == reposicion){ //REPOSICION
                        reposicion += montoPagoArray
                        reposicionPF = parseFloat(reposicion);
                    }
                    else if(tipoPagoArray == bonificacion){ //bonificacion
                        bonificacion += montoPagoArray
                        bonificacionPF = parseFloat(bonificacion);
                    }
                    else if(tipoPagoArray == chequeBancomer || tipoPagoArray == chequeSantander || tipoPagoArray == chequeScotian || tipoPagoArray == chequeHSBC || tipoPagoArray == chequeBanamex || tipoPagoArray == chequeBanorte){ //cheque
                        cheque += montoPagoArray
                        chequePF = parseFloat(cheque);
                    }
                    else if(tipoPagoArray == transferencia){ //TRANSFERENCIA
                        transferencia += montoPagoArray
                        transferenciaPF = parseFloat(transferencia);
                    }
                    else if(tipoPagoArray == vale || tipoPagoArray == saldoAFavor || tipoPagoArray == relleno){
                        otros += montoPagoArray
                        otrosPF = parseFloat(otros);
                        log.audit("otrosPF", montoPagoArray);
                    }

                    total = efectivoPF + creditoPF + tdebitoPF + tcreditoPF + cortesiaPF + prepagosPF + reposicionPF + bonificacionPF + chequePF + transferenciaPF + otrosPF;

                }

                var objTipoPagoUpdate = {
                    custrecord_ptg_prepago_sin_ap_preliq_est: prepagosObjCount,
                    custrecord_ptg_efectivo_preliq_est_: efectivoPF,
                    custrecord_ptg_total_efectivo_est_: efectivoPF,
                    custrecord_ptg_credito_preliq_est_: creditoPF,
                    custrecord_ptg_t_debito_preliq_est_: tdebitoPF,
                    custrecord_ptg_t_credito_preliq_est_: tcreditoPF,
                    custrecord_ptg_cortesia_preliq_est_: cortesiaPF,
                    custrecord_ptg_prepagos_preliq_est_: prepagosPF,
                    custrecord_ptg_reposicion_preliq_est_: reposicionPF,
                    custrecord_ptg_bonificacion_preliq_est_: bonificacionPF,
                    custrecord_ptg_cheque_preliq_est_: chequePF,
                    custrecord_ptg_transferencia_preliq_est_: transferenciaPF,
                    custrecord_ptg_otros_preliq_est_: otrosPF,
                    custrecord_ptg_total_preliq_est_: total,
                };

                log.audit("objTipoPagoUpdate", objTipoPagoUpdate);

                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objTipoPagoUpdate,
                });*/
            } else {
                form.title = "Preliquidación con Crédito a Público General";
            }

            } else if (type_event == "edit"){
                if(status == estatusLiquidacion){
                    form.addButton({
                        id: "custpage_drt_borrar_montos_esta",
                        label: "Borrar Desglose",
                        functionName: "borrarDesglose()",
                    });
                }
            }
            form.clientScriptModulePath = "./drt_preliq_liquidacion_esta_cs.js";

            log.audit('Remaining Usage init beforeLoad end', runtime.getCurrentScript().getRemainingUsage());
        } catch (error) {
            log.error("ERROR", error);
        }
    }
    
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit('Remaining Usage init afterSubmit start', runtime.getCurrentScript().getRemainingUsage());
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_nodeviaje_preliq_est_");
                var kilometraje = customRec.getValue("custrecord_ptg_kilometraje_preliq_");
                var conteoExceso = 0;
                var conteoRestriccion = 0;
                var vehiculoPreliquidado = customRec.getValue("custrecord_ptg_vehiculo_preliqest_");
                var sumaEfectivo = 0;
                var sumaTarjetaDebito = 0;
                var sumaTarjetaCredito = 0;
                var sumaCredito = 0;
                var sumaCortesia = 0;
                var sumaPrepagos = 0;
                var sumaReposicion = 0;
                var sumaBonificacion = 0;
                var sumaCheque = 0;
                var sumaTransferencia = 0;
                var sumaOtros = 0;
                var suma = 0;

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

                var equipoObjUpdate = {
                    custrecord_ptg_kilometraje_equipo_: kilometraje,
                };

                var viajesObj = record.load({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    id: numViaje,
                });
                  
                var vehiculo = viajesObj.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
                log.audit("vehiculo AFS", vehiculo);

                record.submitFields({
                    type: "customrecord_ptg_equipos",
                    id: vehiculo,
                    values: equipoObjUpdate,
                });


                //BÚSQUEDA GUARDADA: DRT - PTG - Oportunidades a Facturar Estacionarios SS
                /*var totalFacturasObj = search.create({
                    type: "customrecord_ptg_ventas_estacionario",
                    filters: [["custrecord_ptg_num_viaje_est_vts_","anyof", numViaje], 
                    "AND", ["custrecord_ptg_registro_oportunidad","is","T"], 
                    "AND", ["custrecord_ptg_modificar_met_pago","isempty",""]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"})
                    ]
                 });
                 var totalFacturasCount = totalFacturasObj.runPaged().count;
                 log.debug("totalFacturasCount", totalFacturasCount);
                 var opportunityObjResult = totalFacturasObj.run().getRange({
                    start: 0,
                    end: totalFacturasCount,
                });
                for (var s = 0; s < opportunityObjResult.length; s++) {
                    (idInternoOportunidad = opportunityObjResult[s].getValue({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"}));
                    var recOportunidadAFacturar = record.create({
                        type: "customrecord_ptg_oportunidad_facturar",
                        isDynamic: true,
                    });
                    recOportunidadAFacturar.setValue("custrecord_ptg_id_oportunidad_fact", idInternoOportunidad);
                    recOportunidadAFacturar.setValue("custrecord_ptg_preliq_estacionarios", recId);
                    var recOportunidadAFacturarIdSaved = recOportunidadAFacturar.save();
                    log.debug({
                        title: "OPORTUNIDADES A FACTURAR ESTACIONARIOS",
                        details: "Id Saved: " + recOportunidadAFacturarIdSaved,
                    });
                }*/

             
                //DETALLE DE TRASPASOS
                //BÚSQUEDA GUARDADA: PTG - Trapasos Estacionarios
                var detalleTraspasoSearchResult = search.create({
                    type: "customrecord_ptg_traspaso_estacionarios_",
                    filters: [["custrecord_ptg_traspasorelacionado_","anyof","@NONE@"], "AND", ["custrecord_ptg_num_viaje_est","anyof", numViaje], "AND", ["custrecord_ptg_referencia_traspaso_","noneof","@NONE@"]],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_vehiculo_traspaso_", label: "PTG - Vehículo Traspaso"}),
                       search.createColumn({name: "custrecord_ptg_traspasodescrip_vehiculo_", label: "PTG - Descripción Vehículo"}),
                       search.createColumn({name: "custrecord_ptg_ruta_traspaso_", label: "PTG - Ruta traspaso"}),
                       search.createColumn({name: "custrecord_ptg_litros_traspaso_", label: "PTG - Litros traspaso"}),
                       search.createColumn({name: "custrecord_ptg_referencia_traspaso_", label: "PTG - Referencia traspaso"}),
                       search.createColumn({name: "custrecord_ptg_num_viaje_est", label: "PTG - Numero Viaje"})
                    ]
                });
                log.audit("detalleTraspasoSearchResult", detalleTraspasoSearchResult);
                var detalleTraspasoResultCount = detalleTraspasoSearchResult.runPaged().count;
                log.debug("detalleTraspasoResultCount", detalleTraspasoResultCount);
                var detalleTraspasoResult = detalleTraspasoSearchResult.run().getRange({
                    start: 0,
                    end: detalleTraspasoResultCount,
                });
                log.audit("detalleTraspasoResult", detalleTraspasoResult);
                for(var i = 0; i < detalleTraspasoResultCount; i++){
                    (vehiculoTraspaso = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_vehiculo_traspaso_", label: "PTG - Vehículo Traspaso"})),
                    (descripcion = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_traspasodescrip_vehiculo_", label: "PTG - Descripción Vehículo"})),
                    (ruta = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_ruta_traspaso_", label: "PTG - Ruta traspaso"})),
                    (litros = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_litros_traspaso_", label: "PTG - Litros traspaso"})),
                    (referencia = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_referencia_traspaso_", label: "PTG - Referencia traspaso"})),
                    (numeroViaje = detalleTraspasoResult[i].getValue({name: "custrecord_ptg_num_viaje_est", label: "PTG - Numero Viaje"}));

                    var recDetalleTraspaso = record.create({
                        type: "customrecord_ptg_traspaso_estacionarios_",
                        isDynamic: true,
                    });
                    recDetalleTraspaso.setValue("custrecord_ptg_vehiculo_traspaso_", vehiculoTraspaso);
                    recDetalleTraspaso.setValue("custrecord_ptg_traspasodescrip_vehiculo_", descripcion);
                    recDetalleTraspaso.setValue("custrecord_ptg_ruta_traspaso_", ruta);
                    recDetalleTraspaso.setValue("custrecord_ptg_litros_traspaso_", litros);
                    recDetalleTraspaso.setValue("custrecord_ptg_referencia_traspaso_", referencia);
                    recDetalleTraspaso.setValue("custrecord_ptg_traspasorelacionado_", recId);
                    recDetalleTraspaso.setValue("custrecord_ptg_num_viaje_est", numViaje);
                    var recDetalleTraspasoIdSaved = recDetalleTraspaso.save();
                    log.debug({
                        title: "DETALLE DE TRASPASO",
                        details: "Id Saved: " + recDetalleTraspasoIdSaved,
                    });
                }


                //DETALLE DE VENTAS
                //CABECERA
                //BÚSQUEDA GUARDADA: PTG - Pagos Liquidacion Estacionarios
                var sumaOtros = 0;
                var tipoPagosObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                       ["custrecord_ptg_num_viaje","anyof",numViaje], "AND", 
                       ["custrecord_registro_desde_oportunidad_po","is","T"]
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                    ]
                 });
                 var tipoPagosObjCount = tipoPagosObj.runPaged().count;
                 var tipoPagosObjResult = tipoPagosObj.run().getRange({
                    start: 0,
                    end: tipoPagosObjCount,
                });
                
                var totalLitrosBG = 0;
                for(var m = 0; m < tipoPagosObjCount; m++){
                    (tipoPago = tipoPagosObjResult[m].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"})),
                    (totalPago = tipoPagosObjResult[m].getValue({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"}));
                    if(tipoPago == efectivo){ //EFECTIVO
                        sumaEfectivo = parseFloat(totalPago);
                    } else if (tipoPago == tarjetaDebito || tipoPago == tarjetaDebitoBanamex || tipoPago == tarjetaDebitoBancomer || tipoPago == tarjetaDebitoHSBC){ //TARJETA DEBITO
                        sumaTarjetaDebito = parseFloat(totalPago);
                    } else if (tipoPago == tarjetaCredito || tipoPago == tarjetaCreditoBancomer || tipoPago == tarjetaCreditoHSBC || tipoPago == tarjetaCreditoBanamex){ //TARJETA CREDITO
                        sumaTarjetaCredito = parseFloat(totalPago);
                    } else if (tipoPago == creditoCliente){ //CREDITO CLIENTE
                        sumaCredito = parseFloat(totalPago);
                    } else if (tipoPago == cortesia){ //CORTESIA
                        sumaCortesia = parseFloat(totalPago);
                    } else if (tipoPago == prepagoBanorte || tipoPago == prepagoTransferencia || tipoPago == prepagoBancomer || tipoPago == prepagoHSBC || tipoPago == prepagoBanamex || tipoPago == prepagoSantander || tipoPago == prepagoScotian){ //PREPAGOS
                        sumaPrepagos = parseFloat(totalPago);
                    } else if (tipoPago == reposicion){ //REPOSICION
                        sumaReposicion = parseFloat(totalPago);
                    } else if (tipoPago == bonificacion){ //BONIFICACION
                        sumaBonificacion = parseFloat(totalPago);
                    } else if (tipoPago == chequeBancomer || tipoPago == chequeSantander || tipoPago == chequeScotian || tipoPago == chequeHSBC || tipoPago == chequeBanamex || tipoPago == chequeBanorte){ //CHEQUE
                        sumaCheque = parseFloat(totalPago);
                    } else if (tipoPago == transferencia){ //TRANSFERENCIA
                        sumaTransferencia = parseFloat(totalPago);
                    } else if(tipoPago == vale || tipoPago == saldoAFavor || tipoPago == relleno){
                        sumaOtros += parseFloat(totalPago);
                    }
                }

                suma = sumaEfectivo + sumaTarjetaDebito + sumaTarjetaCredito + sumaCredito + sumaCortesia + sumaPrepagos + sumaReposicion + sumaBonificacion + sumaCheque + sumaTransferencia + sumaOtros;

                  var objUpdateVentas = {
                    custrecord_ptg_efectivo_preliq_est_: sumaEfectivo,
                    custrecord_ptg_total_efectivo_est_: sumaEfectivo,
                    custrecord_ptg_credito_preliq_est_: sumaCredito,
                    custrecord_ptg_t_debito_preliq_est_: sumaTarjetaDebito,
                    custrecord_ptg_t_credito_preliq_est_: sumaTarjetaCredito,
                    custrecord_ptg_cortesia_preliq_est_: sumaCortesia,
                    custrecord_ptg_prepagos_preliq_est_: sumaPrepagos,
                    custrecord_ptg_reposicion_preliq_est_: sumaReposicion,
                    custrecord_ptg_bonificacion_preliq_est_: sumaBonificacion,
                    custrecord_ptg_cheque_preliq_est_: sumaCheque,
                    custrecord_ptg_transferencia_preliq_est_: sumaTransferencia,
                    custrecord_ptg_otros_preliq_est_: sumaOtros,
                    custrecord_ptg_total_preliq_est_: suma,
                    custrecord_ptg_conteo_exceso_preliq_est: conteoExceso,
                    custrecord_ptg_conteo_restric_preliq_est: conteoRestriccion,
                };
                log.audit("objUpdateVentas", objUpdateVentas);
                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdateVentas,
/*                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true,
                    },*/
                });

                var objUpdateVehiculo = {};
                objUpdateVehiculo.custrecord_ptg_equipo_viaje_activo = false;

                var vehiculoUpdate = record.submitFields({
                    id: vehiculoPreliquidado,
                    type: "customrecord_ptg_equipos",
                    values: objUpdateVehiculo,
                });
                log.debug("Equipo actualizado ", vehiculoUpdate);

                
                log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());
            }
            else if (context.type == "edit") {
                log.audit("else if edit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_nodeviaje_preliq_est_");
                var status = customRec.getValue("custrecord_ptg_liquidacion_status_est");
                log.audit("recId_edit", recId);
                log.audit("status_edit", status);

                if(status != cortesia){
                    var params = {
                        custscript_ptg_tipo_servicio_facturas: 2,
                        custscript_ptg_registro_preliquidacion: recId,
                    }
                    log.audit("params", params);

                    var scriptTask = task.create({
						taskType: task.TaskType.MAP_REDUCE
					});
					scriptTask.scriptId = "customscript_ptg_filtro_facturas";
					scriptTask.params = params;
					var scriptTaskId = scriptTask.submit();
                    log.audit("scriptTaskId", scriptTaskId);
                }

            }
        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }

    function beforeSubmit(context){
        try {
            if (context.type == "create") {
            var newRecord = context.newRecord;
            var recId = newRecord.id;
      
            var numViaje = newRecord.getValue("custrecord_ptg_folio_preliq_est_");
            var numViajeSearchObj = search.create({
              type: "customrecord_ptg_preliq_estacionario_",
              filters: [],
              columns: []
           });
      
           var searchResultCount = numViajeSearchObj.runPaged().count;
           log.audit("searchResultCount", searchResultCount);
      
            if (!numViaje) {
                  var numeroEntero = searchResultCount + 1;
                  newRecord.setValue("custrecord_ptg_folio_preliq_est_", numeroEntero.toFixed(0));
                  //newRecord.setValue("name", numeroEntero.toFixed(0));
            }
        }
        } catch (error) {
            log.audit("error", error);
        }
    }
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit,
    };
});