/*******************************************************************************
 * * DisrupTT * DisrupTT Developers *
 * **************************************************************************
 * Date: 01/2022
 * Script name: DRT - Liquidacion Estacionarios SL
 * Script id: customscript_drt_liquidacion_esta_sl
 * customer Deployment id: customdeploy_drt_liquidacion_esta_sl
 * Applied to: 
 * File: drt_liquidacion_esta_sl.js
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
            var numViaje = req_param.numViaje;
            log.audit("numViaje", numViaje);
            var incremento_inicio = req_param.incremento_inicio;
            log.audit("incremento_inicio", incremento_inicio);
            
            log.audit('Remaining Usage start proceso', runtime.getCurrentScript().getRemainingUsage());

            var prepagoBanorte = 0;
            var prepagoTransferencia = 0;
            var creditoCliente = 0;
            var consumoInterno = 0;
            var prepagoBancomer = 0;
            var prepagoHSBC = 0;
            var prepagoBanamex = 0;
            var prepagoSantander = 0;
            var prepagoScotian = 0;
            var publicoGeneral = 0;
            var urlPago = "";
            var excedeLimite = false;
            var conteoExceso = 0;
            var restriccion = false;
            var conteoRestriccion = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                prepagoBanorte = 2;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                consumoInterno = 12;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                publicoGeneral = 14508;
                urlPago = "https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=503&id=";

            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                prepagoBanorte = 2;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                consumoInterno = 12;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                publicoGeneral = 27041;
                urlPago = "https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=587&id=";

            }

            //BÚSQUEDA GUARDADA: DRT - PTG - Oportunidades a Facturar Estacionarios SS
            var totalFacturasObj = search.create({
                type: "customrecord_ptg_ventas_estacionario",
                filters: [["custrecord_ptg_num_viaje_est_vts_","anyof", numViaje], "AND", 
                ["custrecord_ptg_registro_oportunidad","is","T"], "AND", 
                ["custrecord_ptg_modificar_met_pago","isempty",""]
                ],
                columns: [
                    search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"})
                ]
             });
             var totalFacturasCount = totalFacturasObj.runPaged().count;
             var opportunityObjResult = totalFacturasObj.run().getRange({
                start: 0,
                end: totalFacturasCount,
            });
            if(incremento_inicio < totalFacturasCount){
                (idInternoOportunidad = opportunityObjResult[incremento_inicio].getValue({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"}));
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
            }
            log.audit('Remaining Usage end for servicios facturar', runtime.getCurrentScript().getRemainingUsage());


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
            var pagosOportunidadDVObjResult = pagosOportunidadDVObj.run().getRange({
                start: 0,
                end: pagosOportunidadDVObjResultCount,
            });
            var totalLitrosBG = 0;
            if(incremento_inicio < pagosOportunidadDVObjResultCount){
                (idOportunidad = pagosOportunidadDVObjResult[incremento_inicio].getValue({name: "custrecord_ptg_oportunidad", label: "PTG - Oportunidad"})),
                (idTipoPago = pagosOportunidadDVObjResult[incremento_inicio].getValue({name: "custrecord_ptg_tipo_pago", label: "PTG - Tipo de Pago"})),
                (totalPago = parseFloat(pagosOportunidadDVObjResult[incremento_inicio].getValue({name: "custrecord_ptg_total", label: "PTG - Total"}))),
                (referenciaPago = pagosOportunidadDVObjResult[incremento_inicio].getValue({name: "custrecord_ptg_referenciapago_", label: "PTG - Referencia pago"}));
                var totalPagoTF = totalPago.toFixed(2);
                log.audit("totalPagoTF", totalPagoTF);

                var detalleVentasObj = search.create({
                    type: "customrecord_ptg_ventas_estacionario",
                    filters: [
                        ["custrecord_ptg_preliqui_rel_vts_","anyof","@NONE@"], "AND", 
                        ["custrecord_ptg_registro_oportunidad","is","T"], "AND", 
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
                var detalleVentasObjResultCount = detalleVentasObj.runPaged().count;
                var detalleVentasObjResult = detalleVentasObj.run().getRange({
                    start: 0,
                    end: detalleVentasObjResultCount,
                });
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
            }  
            log.audit('Remaining Usage end proceso', runtime.getCurrentScript().getRemainingUsage());



            if(incremento_inicio != 0){
                var nuevoIncremento = incremento_inicio - 1;
                log.audit("nuevoIncremento", nuevoIncremento);
                var parametros2 = {
                    'recId': recId,
                    'numViaje': numViaje,
                    'incremento_inicio': nuevoIncremento
                };
                log.audit("parametros2", parametros2);
    
                var redirectToStl2 = redirect.toSuitelet({
                    scriptId: "customscript_drt_liquidacion_esta_sl",
                    deploymentId: "customdeploy_drt_liquidacion_esta_sl",
                    parameters: parametros2
                });
                log.audit("redirectToStl2", redirectToStl2);
            } else {
                log.audit("el incremento es ", incremento_inicio);

                redirect.toRecord({
                    type: 'customrecord_ptg_preliq_estacionario_',
                    id: recId,
                    parameters: {}
                });
            }

           
        } catch (error) {
            log.error("error onRequest", error);
            redirect.toRecord({
                type: 'customrecord_ptg_preliq_estacionario_',
                id: recId,
                parameters: {}
            });
        }
    }

    return {
        onRequest: onRequest
    }
});