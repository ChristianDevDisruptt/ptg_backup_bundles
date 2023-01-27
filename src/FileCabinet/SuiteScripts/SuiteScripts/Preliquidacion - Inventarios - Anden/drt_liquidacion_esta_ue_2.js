/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Liquidacion Estacionarios 2 UE COPY
 * Script id: customscript_drt_liquidacion_esta_ue_2_c
 * customer Deployment id: customdeploy_drt_liquidacion_esta_ue_2_c
 * Applied to: PTG - PreLiquidacion Estacionarios
 * File: drt_liquidacion_esta_ue_2_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/task', "N/redirect"], function (record, search, runtime, https, url, task, redirect) {

    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit('Remaining Usage init afterSubmit start', runtime.getCurrentScript().getRemainingUsage());
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_nodeviaje_preliq_est_");
                var urlPago = "";
                var total = 0;
                var publicoGeneral = 0;
                var excedeLimite = false;
                var restriccion = false;

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
                }


                //LINEAS
                //BÚSQUEDA GUARDADA: PTG - Pagos Oportunidad DV Estacionarios
                var pagosOportunidadDVObj = search.create({
                    type: "customrecord_ptg_pagos_oportunidad",
                    filters: [
                        ["custrecord_ptg_num_viaje","anyof",numViaje]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_oportunidad", label: "PTG - Oportunidad"}),
                        search.createColumn({name: "custrecord_ptg_num_viaje", label: "PTG - Numero de viaje"}),
                        search.createColumn({name: "custrecord_ptg_tipo_pago", label: "PTG - Tipo de Pago"}),
                        search.createColumn({name: "custrecord_ptg_total", label: "PTG - Total"}),
                        search.createColumn({name: "custrecord_ptg_referenciapago_", label: "PTG - Referencia pago"})
                    ]
                });
                var pagosOportunidadDVObjResultCount = pagosOportunidadDVObj.runPaged().count;
                log.debug("pagosOportunidadDVObjResultCount", pagosOportunidadDVObjResultCount);
                /*var pagosOportunidadDVObjResult = pagosOportunidadDVObj.run().getRange({
                    start: 0,
                    end: pagosOportunidadDVObjResultCount,
                });
                var totalLitrosBG = 0;
                for(var p = 0; p < pagosOportunidadDVObjResultCount; p++){
                    (idOportunidad = pagosOportunidadDVObjResult[p].getValue({name: "custrecord_ptg_oportunidad", label: "PTG - Oportunidad"})),
                    (idTipoPago = pagosOportunidadDVObjResult[p].getValue({name: "custrecord_ptg_tipo_pago", label: "PTG - Tipo de Pago"})),
                    (totalPago = parseFloat(pagosOportunidadDVObjResult[p].getValue({name: "custrecord_ptg_total", label: "PTG - Total"}))),
                    (referenciaPago = pagosOportunidadDVObjResult[p].getValue({name: "custrecord_ptg_referenciapago_", label: "PTG - Referencia pago"}));
                    var totalPagoTF = totalPago.toFixed(2);
                    log.audit("totalPagoTF", totalPagoTF);

                    var detalleVentasObj = search.create({
                        type: "customrecord_ptg_ventas_estacionario",
                        filters: [
                            ["custrecord_ptg_preliqui_rel_vts_","anyof","@NONE@"], 
                            "AND", 
                            ["custrecord_ptg_registro_oportunidad","is","T"], 
                            "AND", 
                            ["custrecord_ptg_oportunidad_estacionario","anyof",idOportunidad]
                        ],
                        columns: [
                           search.createColumn({name: "custrecord_ptg_nota_estacionarios_", label: "PTG - Nota"}),
                           search.createColumn({name: "custrecord_ptg_foliosgc_", label: "PTG - Folio SGC"}),
                           search.createColumn({name: "custrecord_ptg_tipodepago_estacionarios_", label: "PTG - Tipo de Pago est ventas"}),
                           search.createColumn({name: "custrecord_ptg_cliente_est_vts", label: "PTG - Cliente est ventas"}),
                           search.createColumn({name: "custrecord_ptg_nombre_cli_est_vts", label: "PTG - Nombre cli est vts"}),
                           search.createColumn({name: "custrecord_ptg_direccion_cli_est_", label: "PTG - Direccion clie est"}),
                           search.createColumn({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"}),
                           search.createColumn({name: "custrecord_ptg_precio_est_vts_", label: "PTG - Precio est vts"}),
                           search.createColumn({name: "custrecord_ptg_importe_est_vts_", label: "PTG - Importe est vts"}),
                           search.createColumn({name: "custrecord_ptg_referencia_est_vts_", label: "PTG - Referencia est vts"}),
                           search.createColumn({name: "custrecord_ptg_impuesto_est_vts_", label: "PTG - Impuesto est vts"}),
                           search.createColumn({name: "custrecord_ptg_total_est_vts_", label: "PTG - Total est vts"}),
                           search.createColumn({name: "custrecord_ptg_num_viaje_est_vts_", label: "PTG - Num Viaje"}),
                           search.createColumn({name: "custrecord_ptg_litros_teor_est_vts_", label: "PTG - Litros Teorico est vts"}),
                           search.createColumn({name: "custrecord_ptg_precio_teor_est_vts_", label: "PTG - Precio Teorico est vts"}),
                           search.createColumn({name: "custrecord_ptg_importe_teor_est_vts_", label: "PTG - Importe Teorico est vts"}),
                           search.createColumn({name: "custrecord_ptg_total_teor_est_vts_", label: "PTG - Total Teorico est vts"}),
                           search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"}),
                           search.createColumn({name: "custrecord_ptg_rfc_cliente_est_vts", label: "PTG - RFC Cliente"})
                        ]
                     });
                     log.audit("detalleVentasObj", detalleVentasObj);
                     var detalleVentasObjResultCount = detalleVentasObj.runPaged().count;
                     log.debug("detalleVentasObjResultCount",detalleVentasObjResultCount);
                     var detalleVentasObjResult = detalleVentasObj.run().getRange({
                        start: 0,
                        end: detalleVentasObjResultCount,
                    });
                    log.audit("detalleVentasObjResult", detalleVentasObjResult);
                    var totalLitrosBG = 0;
                    for(var j = 0; j < detalleVentasObjResultCount; j++){
                        (nota = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_nota_estacionarios_", label: "PTG - Nota"})),
                        (folioSGC = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_foliosgc_", label: "PTG - Folio SGC"})),
                        (cliente = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_cliente_est_vts", label: "PTG - Cliente est ventas"})),
                        (clienteTXT = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_nombre_cli_est_vts", label: "PTG - Nombre cli est vts"})),
                        (direccion = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_direccion_cli_est_", label: "PTG - Direccion clie est"})),
                        (litros = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"})),
                        (precio = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_precio_est_vts_", label: "PTG - Precio est vts"})),
                        (importe = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_importe_est_vts_", label: "PTG - Importe est vts"})),
                        (referencia = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_referencia_est_vts_", label: "PTG - Referencia est vts"})),
                        (impuesto = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_impuesto_est_vts_", label: "PTG - Impuesto est vts"})),
                        (total = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_total_est_vts_", label: "PTG - Total est vts"})),
                        (numeroViaje = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_num_viaje_est_vts_", label: "PTG - Num Viaje"})),
                        (litrosTeorico = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_litros_teor_est_vts_", label: "PTG - Litros Teorico est vts"})),
                        (precioTeorico = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_precio_teor_est_vts_", label: "PTG - Precio Teorico est vts"})),
                        (importeTeorico = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_importe_teor_est_vts_", label: "PTG - Importe Teorico est vts"})),
                        (totalTeorico = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_total_teor_est_vts_", label: "PTG - Total Teorico est vts"})),
                        (rfcCliente = detalleVentasObjResult[j].getValue({name: "custrecord_ptg_rfc_cliente_est_vts", label: "PTG - RFC Cliente"}));;
                        var notaFin = j+""+nota;
    
                        var litrosPF = parseFloat(litros);
                        totalLitrosBG = totalLitrosBG + litrosPF;
                        log.audit("totalLitrosBG", totalLitrosBG);

                        var entityLookup = search.lookupFields({
                            type: search.Type.CUSTOMER,
                            id: cliente,
                            columns: [
                                'overduebalance',
                                'creditlimit',
                                'balance'
                            ]
                        }) || '';
                        saldoVencido = parseFloat(entityLookup.overduebalance);
                        limiteCredito = parseFloat(entityLookup.creditlimit);
                        saldo = parseFloat(entityLookup.balance);
    
                        if(cliente != publicoGeneral && idTipoPago == creditoCliente){
                            log.audit("Preliquidacion con credito cliente "+idOportunidad, idOportunidad);
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
                        
    
                        if(idTipoPago == creditoCliente && cliente == publicoGeneral){
                            restriccion = true;
                            conteoRestriccion += 1;
                        } else {
                            restriccion = false;
                            conteoRestriccion += 0;
                        }                    
    
    
                        //BÚSQUEDA GUARDADA: PTG - Pagos Modificar Metodo
                        var pagoModificarMetodoObj = search.create({
                            type: "customrecord_ptg_pagos",
                            filters: [["custrecord_ptg_oportunidad_pagos", "anyof", idOportunidad], "AND", 
                            ["custrecord_ptg_num_viaje_pagos", "anyof", numeroViaje], "AND", 
                            ["custrecord_registro_desde_oportunidad_p","is","T"]],
                            columns: [
                                search.createColumn({name: "id", label: "ID"})
                            ]
                         });
                         log.audit("pagoModificarMetodoObj", pagoModificarMetodoObj);
                         var pagoModificarMetodoObjResultCount = pagoModificarMetodoObj.runPaged().count;
                         log.debug("pagoModificarMetodoObjResultCount", pagoModificarMetodoObjResultCount);
                         var pagoModificarMetodoObjResult = pagoModificarMetodoObj.run().getRange({
                            start: 0,
                            end: pagoModificarMetodoObjResultCount,
                        });
                        log.audit("pagoModificarMetodoObjResult", pagoModificarMetodoObjResult);
                        for (var k = 0; k < pagoModificarMetodoObjResultCount; k++){
                            (idRegistro = pagoModificarMetodoObjResult[k].getValue({name: "id", label: "ID"}));
                            log.audit("idRegistro", idRegistro);
                        }
                        var urlModificarPago = urlPago + idRegistro + "&e=T";
                        log.audit("urlModificarPago", urlModificarPago);
    

                        if(idTipoPago != consumoInterno){
                        var recDetalleVenta = record.create({
                            type: "customrecord_ptg_ventas_estacionario",
                            isDynamic: true,
                        });
                        recDetalleVenta.setValue("custrecord_ptg_preliqui_rel_vts_", recId);
                        recDetalleVenta.setValue("custrecord_ptg_modificar_met_pago", urlModificarPago);
                        recDetalleVenta.setValue("custrecord_ptg_nota_estacionarios_", notaFin);
                        recDetalleVenta.setValue("custrecord_ptg_foliosgc_", folioSGC);
                        recDetalleVenta.setValue("custrecord_ptg_tipodepago_estacionarios_", idTipoPago);
                        if(idTipoPago == prepagoBanorte || idTipoPago == prepagoTransferencia || idTipoPago == prepagoBancomer || idTipoPago == prepagoHSBC || idTipoPago == prepagoBanamex || idTipoPago == prepagoSantander || idTipoPago == prepagoScotian){
                            recDetalleVenta.setValue("custrecord_ptg_prepago_aplicado_est_vts_", true);
                        }
                        recDetalleVenta.setValue("custrecord_ptg_pago_vts_", totalPagoTF);
                        recDetalleVenta.setValue("custrecord_ptg_cliente_est_vts", cliente);
                        recDetalleVenta.setValue("custrecord_ptg_nombre_cli_est_vts", clienteTXT);
                        recDetalleVenta.setValue("custrecord_ptg_direccion_cli_est_", direccion);
                        recDetalleVenta.setValue("custrecord_ptg_litros_est_vts_", litros);
                        recDetalleVenta.setValue("custrecord_ptg_precio_est_vts_", precio);
                        recDetalleVenta.setValue("custrecord_ptg_importe_est_vts_", importe);
                        recDetalleVenta.setValue("custrecord_ptg_referencia_est_vts_", referenciaPago);
                        recDetalleVenta.setValue("custrecord_ptg_impuesto_est_vts_", impuesto);
                        recDetalleVenta.setValue("custrecord_ptg_total_est_vts_", total);
                        recDetalleVenta.setValue("custrecord_ptg_num_viaje_est_vts_", numeroViaje);
                        recDetalleVenta.setValue("custrecord_ptg_litros_teor_est_vts_", litrosTeorico);
                        recDetalleVenta.setValue("custrecord_ptg_precio_teor_est_vts_", precioTeorico);
                        recDetalleVenta.setValue("custrecord_ptg_importe_teor_est_vts_", importeTeorico);
                        recDetalleVenta.setValue("custrecord_ptg_total_teor_est_vts_", totalTeorico);
                        recDetalleVenta.setValue("custrecord_ptg_rfc_cliente_est_vts", rfcCliente);
                        recDetalleVenta.setValue("custrecord_ptg_oportunidad_estacionario", idOportunidad);
                        recDetalleVenta.setValue("custrecord_ptg_saldo_vencido_est_vts", saldoVencido);
                        recDetalleVenta.setValue("custrecord_ptg_limite_credito_est_vts", limiteCredito);
                        recDetalleVenta.setValue("custrecord_ptg_saldo_est_vts", saldo);
                        recDetalleVenta.setValue("custrecord_ptg_excede_limite_est_vts", excedeLimite);
                        recDetalleVenta.setValue("custrecord_ptg_restriccion_est_vts", restriccion);
                        var recDetalleVentaIdSaved = recDetalleVenta.save();
                        log.debug({
                            title: "DETALLE DE VENTAS",
                            details: "Id Saved: " + recDetalleVentaIdSaved,
                        });
                    } else if (idTipoPago == consumoInterno){
                        var recDetalleConI = record.create({
                            type: "customrecord_ptg_consumo_interno_registr",
                            isDynamic: true,
                        });
                        recDetalleConI.setValue("custrecord_ptg_preliquidacion_coni", recId);
                        recDetalleConI.setValue("custrecord_ptg_oportunidad_coni", idOportunidad);
                        recDetalleConI.setValue("custrecord_ptg_tipo_pago_coni", idTipoPago);
                        recDetalleConI.setValue("custrecord_ptg_litros_coni", litros);
                        var recDetalleConIIdSaved = recDetalleConI.save();
                        log.debug({
                            title: "DETALLE CONSUMO INTERNO",
                            details: "Id Saved: " + recDetalleConIIdSaved,
                        });
                    }
                    log.audit('Remaining Usage init end', runtime.getCurrentScript().getRemainingUsage());
                    }
                } */              
                


                //Crear los registros para facturar
                var totalFacturasObj = search.create({
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

                var busquedaMayor = 0;
                if(pagosOportunidadDVObjResultCount >= totalFacturasCount){
                    busquedaMayor = pagosOportunidadDVObjResultCount;
                } else {
                    busquedaMayor = totalFacturasCount;
                }
                log.debug("Se van a mandar: ", busquedaMayor);

                if(busquedaMayor > 0){
                    for(var i = 0; i < busquedaMayor; i++){
                        log.audit("*****Entra implementacion "+i+"*****", "*****Entra implementacion "+i+"*****");
                        var parametros = {
                            'recId': recId,
                            'numViaje': numViaje,
                            'incremento_inicio': i,
                        };
                        log.audit("parametros", parametros);
        
                        var redirectToStl = redirect.toSuitelet({
                            scriptId: "customscript_drt_liquidacion_esta_sl",
                            deploymentId: "customdeploy_drt_liquidacion_esta_sl",
                            parameters: parametros
                        });
                        log.audit("redirectToStl", redirectToStl);
                    }            
                }

                log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());
            }
        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }

    
    return {
        afterSubmit: afterSubmit,
    };
});