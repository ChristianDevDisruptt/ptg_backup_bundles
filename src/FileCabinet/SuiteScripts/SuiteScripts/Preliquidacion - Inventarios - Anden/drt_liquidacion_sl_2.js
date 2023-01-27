/*******************************************************************************
 * * DisrupTT * DisrupTT Developers *
 * **************************************************************************
 * Date: 01/2022
 * Script name: DRT - Liquidacion SL 2
 * Script id: customscript_drt_liquidacion_sl_2
 * customer Deployment id: customdeploy_drt_liquidacion_sl_2
 * Applied to:
 * File: drt_liquidacion_sl_2.js
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
            var prepagoBancomer = 0;
            var prepagoHSBC = 0;
            var prepagoBanamex = 0;
            var prepagoSantander = 0;
            var prepagoScotian = 0;
            var publicoGeneral = 0;
            var urlPago = "";

            var estadoOpNegociacion = 0;
            var estadoOpCompra = 0;
            var estadoOpConcretado = 0;
            var estadoOpClienteConcretado = 0;

            var articuloCilindro = 0;
            var articuloEnvase = 0;
            var ventaServicioGas = 0;
            var ventaServicioCilindro = 0;
            var ventaServicio = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                prepagoBanorte = 2;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                publicoGeneral = 14508;
                urlPago = "https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=503&id=";

                estadoOpNegociacion = 11;
                estadoOpCompra = 12;
                estadoOpConcretado = 13;
                estadoOpClienteConcretado = 18;

                articuloCilindro = 1;
                articuloEnvase = 5;
                ventaServicioGas = 1;
                ventaServicioCilindro = 2;
                ventaServicio = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                prepagoBanorte = 2;
                prepagoTransferencia = 8;
                creditoCliente = 9;
                prepagoBancomer = 13;
                prepagoHSBC = 14;
                prepagoBanamex = 15;
                prepagoSantander = 16;
                prepagoScotian = 17;
                publicoGeneral = 27041;
                urlPago = "https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=587&id=";

                estadoOpNegociacion = 11;
                estadoOpCompra = 12;
                estadoOpConcretado = 13;
                estadoOpClienteConcretado = 18;

                articuloCilindro = 1;
                articuloEnvase = 5;
                ventaServicioGas = 1;
                ventaServicioCilindro = 2;
                ventaServicio = 3;
            }

            //LINEA
            //BÚSQUEDA GUARDADA: PTG - Pagos Oportunidad Tipo Pago
            var registroOportunidad = search.create({
                type: "customrecord_ptg_pagos_oportunidad",
                filters: [["custrecord_ptg_num_viaje","anyof",numViaje], "AND", ["custrecord_ptg_oportunidad","noneof","@NONE@"]],
                columns: [
                    search.createColumn({name: "custrecord_ptg_oportunidad", label: "PTG - Oportunidad"}),
                    search.createColumn({name: "custrecord_ptg_num_viaje", label: "PTG - Numero de viaje"}),
                    search.createColumn({name: "custrecord_ptg_tipo_pago", label: "PTG - Tipo de Pago"}),
                    search.createColumn({name: "custrecord_ptg_total", label: "PTG - Total"}),
                    search.createColumn({name: "custrecord_ptg_registro_pagos", label: "PTG - Pagos"}),
                    search.createColumn({name: "entity", join: "CUSTRECORD_PTG_OPORTUNIDAD", label: "Customer"}),
                    search.createColumn({name: "custrecord_ptg_referenciapago_", label: "PTG - Referencia pago"})
                 ]
            });
            log.debug("registroOportunidad", registroOportunidad);
            var registroOportunidadResultCount = registroOportunidad.runPaged().count;
            log.audit("Registro Oportunidad Result Count", registroOportunidadResultCount);
            var registroOportunidadResult = registroOportunidad.run().getRange({
                start: 0,
                end: registroOportunidadResultCount,
            });
            log.debug("registroOportunidadResult", registroOportunidadResult);
            var conteoExceso = 0;
            var conteoRestriccion = 0;
            log.audit('Remaining Usage start for pagos oportunidad', runtime.getCurrentScript().getRemainingUsage());
            if(incremento_inicio < registroOportunidadResultCount){
                log.audit("incremento_inicio", incremento_inicio);
                (oportunidad = registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_oportunidad", label: "PTG - Oportunidad", })),
                (viaje = registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_num_viaje", label: "PTG - Numero de viaje", })),
                (pago = registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_tipo_pago", label: "PTG - Tipo de Pago", })),
                (total = parseFloat(registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_total", label: "PTG - Total", })).toFixed(6)),
                (idRegistroPagos = registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_registro_pagos", label: "PTG - Pagos", })),
                (idCliente = registroOportunidadResult[incremento_inicio].getValue({ name: "entity", join: "CUSTRECORD_PTG_OPORTUNIDAD", label: "Customer"})),
                (referencia = registroOportunidadResult[incremento_inicio].getValue({ name: "custrecord_ptg_referenciapago_", label: "PTG - Referencia pago"}));;

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: idCliente,
                });
                var direccionCliente = clienteObj.getValue("defaultaddress");
                var saldoVencido = clienteObj.getValue("overduebalance");
                var limiteCredito = clienteObj.getValue("creditlimit");
                var saldo = clienteObj.getValue("balance");

                if(idCliente != publicoGeneral && pago == creditoCliente){
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
                

                if(pago == creditoCliente && idCliente == publicoGeneral){
                    restriccion = true;
                    conteoRestriccion += 1;
                } else {
                    restriccion = false;
                    conteoRestriccion += 0;
                }

                var urlModificarPago = urlPago + idRegistroPagos + "&e=T";

                var recTipoPago = record.create({
                    type: "customrecord_ptg_registrooportunidad_",
                    isDynamic: true,
                });
                recTipoPago.setValue("custrecord_ptg_oportunidad_", oportunidad);
                recTipoPago.setValue("custrecordptg_numviajeoportunidad_", viaje);
                recTipoPago.setValue("custrecord_ptg_tipopago_oportunidad_", pago);
                if(pago == prepagoBanorte || pago == prepagoTransferencia || pago == prepagoBancomer || pago == prepagoHSBC || pago == prepagoBanamex || pago == prepagoSantander || pago == prepagoScotian){
                    recTipoPago.setValue("custrecord_ptg_prepago_aplicar_oport", true);    
                }
                recTipoPago.setValue("custrecord_ptg_total_", total);
                recTipoPago.setValue("custrecord_ptg_modificar_met_pago_cilind", urlModificarPago);
                recTipoPago.setValue("custrecord_ptg_cliente_reg_oport", idCliente);
                recTipoPago.setValue("custrecord_ptg_direccion_registroop_", direccionCliente);
                recTipoPago.setValue("custrecord_ptg_saldo_vencido_reg_oport", saldoVencido);
                recTipoPago.setValue("custrecord_ptg_limite_credito_reg_oport", limiteCredito);
                recTipoPago.setValue("custrecord_ptg_saldo_reg_oport", saldo);
                recTipoPago.setValue("custrecord_ptg_excede_limite_reg_oport", excedeLimite);
                recTipoPago.setValue("custrecord_ptg_restriccion_reg_oport", restriccion);
                recTipoPago.setValue("custrecord_ptg_referencia_reg_oport", referencia);
                recTipoPago.setValue("custrecord_ptg_optpreliq_", recId);
                var recTipoPagoIdSaved = recTipoPago.save();
                log.debug({
                    title: "DETALLE DE TIPO DE PAGO",
                    details: "Id Saved: " + recTipoPagoIdSaved,
                });
            log.audit('Remaining Usage end for pagos oportunidad', runtime.getCurrentScript().getRemainingUsage());

            var objUpdate = {
                custrecord_ptg_conteo_exceso: conteoExceso,
                custrecord_ptg_conteo_restriccion: conteoRestriccion,
            };

            record.submitFields({
                id: recId,
                type: "customrecord_ptg_preliquicilndros_",
                values: objUpdate,
            });

        }


            //BÚSQUEDA GUARDADA: PTG - Oportunidades a Facturar Cil
            var opportunitySearchObj = search.create({
                type: "opportunity",
                filters: [
                   ["custbody_ptg_numero_viaje","anyof",numViaje], 
                   "AND", 
                   ["entitystatus","anyof",estadoOpClienteConcretado,estadoOpCompra,estadoOpNegociacion,estadoOpConcretado]
                ],
                columns: [
                   search.createColumn({name: "internalid", label: "Internal ID"})
                ]
            });
            var searchResultCount = opportunitySearchObj.runPaged().count;
            log.debug("searchResultCount",searchResultCount);
            var opportunityObjResult = opportunitySearchObj.run().getRange({
                start: 0,
                end: searchResultCount,
            });
            log.audit('Remaining Usage start for servicios facturar', runtime.getCurrentScript().getRemainingUsage());
            log.audit("incremento_inicio", incremento_inicio);
            if(incremento_inicio < searchResultCount){
                (idInternoOportunidad = opportunityObjResult[incremento_inicio].getValue({name: "internalid", label: "Internal ID"}));
                var recOportunidadAFacturar = record.create({
                    type: "customrecord_ptg_oportunidad_facturar",
                    isDynamic: true,
                });
                recOportunidadAFacturar.setValue("custrecord_ptg_id_oportunidad_fact", idInternoOportunidad);
                recOportunidadAFacturar.setValue("custrecord_ptg_preliq_cilindros", recId);
                var recOportunidadAFacturarIdSaved = recOportunidadAFacturar.save();
                log.debug({
                    title: "OPORTUNIDADES A FACTURAR",
                    details: "Id Saved: " + recOportunidadAFacturarIdSaved,
                });
            }
            log.audit('Remaining Usage end for servicios facturar', runtime.getCurrentScript().getRemainingUsage());





            //DETALLE RESUMEN
            //BÚSQUEDA GUARDADA: DRT PTG - Detalle Resumen
            var detalleResumenSearch = search.create({
                type: "transaction",
                filters: [
                    ["type","anyof","Opprtnty"], "AND", 
                    ["custbody_ptg_numero_viaje","anyof",numViaje], "AND", 
                    ["status","anyof","Opprtnty:C"], "AND", 
                    ["mainline","is","F"], "AND", 
                    ["taxline","is","F"]
                ],
                columns: [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"}),
                    search.createColumn({name: "custbody_drt_ptg_num_consecutivo", label: "PTG - Numero consecutivo"}),
                    search.createColumn({name: "custitem_ptg_tipodearticulo_", join: "item", label: "PTG - TIPO DE ARTÍCULO"}),
                    search.createColumn({name: "entity", label: "Name"}),
                    search.createColumn({name: "internalid", join: "item", label: "Internal ID"}),
                    search.createColumn({name: "quantity", label: "Quantity"}),
                    search.createColumn({name: "stockunit", join: "item", label: "Primary Stock Unit"}),
                    search.createColumn({name: "rate", label: "Item Rate"}),
                    search.createColumn({name: "taxamount", label: "Amount (Tax)"}),
                    search.createColumn({name: "tranid", label: "Document Number"})
                ],
            });
            var detalleResumenResultCount = detalleResumenSearch.runPaged().count;
            log.debug("detalleResumenResultCount", detalleResumenResultCount);
            var detalleResumenResult = detalleResumenSearch.run().getRange({
                start: 0,
                end: detalleResumenResultCount,
            });
            log.audit("detalleResumenResult", detalleResumenResult);
            log.audit('Remaining Usage start for linea de articulos', runtime.getCurrentScript().getRemainingUsage());
            if(incremento_inicio < detalleResumenResultCount){
                (idOportunidad = detalleResumenResult[incremento_inicio].getValue({name: "internalid", label: "ID interno"})),
                (opcionPago = detalleResumenResult[incremento_inicio].getValue({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"})),
                (referencia = detalleResumenResult[incremento_inicio].getValue({name: "custbody_drt_ptg_num_consecutivo", label: "PTG - Numero consecutivo"})),
                (tipoArticulo = detalleResumenResult[incremento_inicio].getValue({name: "custitem_ptg_tipodearticulo_", join: "item", label: "PTG - TIPO DE ARTÍCULO"})),
                (cliente = detalleResumenResult[incremento_inicio].getValue({name: "entity", label: "Name"})),
                (cantidad = detalleResumenResult[incremento_inicio].getValue({name: "quantity", label: "Quantity"})),
                (unidad = detalleResumenResult[incremento_inicio].getValue({name: "stockunit", join: "item", label: "Primary Stock Unit"})),
                (tasa = detalleResumenResult[incremento_inicio].getValue({name: "rate", label: "Item Rate"})),
                (impuesto = detalleResumenResult[incremento_inicio].getValue({name: "taxamount", label: "Amount (Tax)"})),
                (nombreDocumento = detalleResumenResult[incremento_inicio].getValue({name: "tranid", label: "Document Number"}));

                var recResumen = record.create({
                    type: "customrecord_ptg_detalle_resumen_",
                    isDynamic: true,
                });
                recResumen.setValue("custrecord_ptg_tipodepago_detalleresumen", opcionPago);
                recResumen.setValue("custrecord_ptg_nota_detalleresumen_", nombreDocumento);
                if(tipoArticulo == articuloCilindro || tipoArticulo == articuloEnvase){
                    recResumen.setValue("custrecord_ptg_tipodeventa_detalleresume", ventaServicioGas);
                } else {
                    recResumen.setValue("custrecord_ptg_tipodeventa_detalleresume", ventaServicioCilindro);
                }
                recResumen.setValue("custrecord_ptg_oportuni_detalle_resumen_", idOportunidad);
                recResumen.setValue("custrecord_ptg_cliente_detalleresumen_", cliente);
                recResumen.setValue("custrecord_ptg_nombre_detalleresumen_", cliente);
                recResumen.setValue("custrecord_ptg_cantidad_detalleresumen_", cantidad);
                recResumen.setValue("custrecord_ptg_unidaddetalleresumen_", unidad);
                recResumen.setValue("custrecord_ptg_preciodetalleresumen_", tasa);
                recResumen.setValue("custrecord_ptg_importe_detalleresumen_", (cantidad * tasa));
                recResumen.setValue("custrecord_ptg_impuesto_detalleresumen_", impuesto);
                recResumen.setValue("custrecord_ptg_total_detalle_resumen_", ((cantidad * tasa) * 1.16));
                recResumen.setValue("custrecord_ptg_detalleresumen_", recId);
                var recResumenIdSaved = recResumen.save();
                log.debug({
                    title: "DETALLE RESUMEN",
                    details: "Id Saved: " + recResumenIdSaved,
                });
                log.audit('Remaining Usage end for linea de articulos', runtime.getCurrentScript().getRemainingUsage());
            }


            //DETALLE DE MOVIMIENTOS
            //BÚSQUEDA GUARDADA: DRT - PTG - Detalle Movimientos
            var detalleMovimientoSearch = search.create({
                type: "customrecord_ptg_regitrodemovs_",
                filters: [["custrecord_ptg_num_viaje_oportunidad","anyof",numViaje], "AND", ["custrecord_ptg_origen","is","T"]],
                columns: [
                    search.createColumn({name: "internalid", label: "Internal ID"}),
                    search.createColumn({name: "custrecord_ptg_ventagas_", label: "PTG - Venta Gas"}),
                    search.createColumn({name: "custrecord_ptg_cilindro", label: "PTG - Cilindro"})
                ]
            });
            var detalleMovimientoResultCount = detalleMovimientoSearch.runPaged().count;
            log.emergency("detalleMovimientoResultCount", detalleMovimientoResultCount);
            var detalleMovimientoResult = detalleMovimientoSearch.run().getRange({
                start: 0,
                end: detalleMovimientoResultCount,
            });
            log.emergency("detalleMovimientoResult", detalleMovimientoResult);
            if(incremento_inicio < detalleMovimientoResultCount){
                (idRegistroMovimientos = detalleMovimientoResult[incremento_inicio].getValue({name: "internalid", label: "Internal ID"})),
                (ventaGas = detalleMovimientoResult[incremento_inicio].getValue({ name: "custrecord_ptg_ventagas_", label: "PTG - Venta Gas", })),
                (cilindro = detalleMovimientoResult[incremento_inicio].getValue({ name: "custrecord_ptg_cilindro", label: "PTG - Cilindro", }));
                var itemObjDM = record.load({
                    type: search.Type.INVENTORY_ITEM,
                    id: cilindro,
                });
                log.debug("lookupItem", itemObjDM);
                var litrosCapacidad = itemObjDM.getValue("custitem_ptg_capacidadcilindro_");
                log.debug("litrosCapacidad", litrosCapacidad);
                var litrosCapacidadInt = parseInt(litrosCapacidad);
                log.debug("litrosCapacidadInt", litrosCapacidadInt);
                var ventaGasInt = parseInt(ventaGas);
                log.debug("ventaGasInt", ventaGasInt);
                var ptgLTS = ventaGasInt * litrosCapacidadInt;
                log.debug("ptgLTS", ptgLTS);

                var objUpdateRegistroMovimiento = {
                    custrecord_ptg_lts_: ptgLTS,
                    custrecord_ptg_rutavehiculo_: recId,
                };
                var idRegMov = record.submitFields({
                    id: idRegistroMovimientos,
                    type: "customrecord_ptg_regitrodemovs_",
                    values: objUpdateRegistroMovimiento,
                });
                log.emergency("idRegMov", idRegMov);
            }
            log.audit('Remaining Usage end for detalle de movimientos', runtime.getCurrentScript().getRemainingUsage());




            //BUSQUEDA GUARDADA: PTG - Detalle de ventas Ventas SS
            var movimientosDetalleVentasObj = search.create({
                type: "customrecord_ptg_regitrodemovs_",
                filters: [
                   ["custrecord_ptg_num_viaje_oportunidad","anyof", numViaje]
                ],
                columns: [
                   search.createColumn({ name: "custrecord_ptg_cilindro", summary: "GROUP", label: "PTG - Cilindro"}),
                   search.createColumn({ name: "custrecord_ptg_movmas_", summary: "SUM", label: "PTG - Mov +"}),
                   search.createColumn({ name: "custrecord_ptg_movmenos_", summary: "SUM", label: "PTG - Mov -"}),
                   search.createColumn({ name: "custrecord_ptg_ventagas_", summary: "SUM", label: "PTG - Venta Gas"}),
                   search.createColumn({ name: "custrecord_ptg_zonadeprecio_registromovs", summary: "GROUP", label: "PTG -Zona de precio"}),
                   search.createColumn({ name: "custrecord_ptg_tasa", summary: "MAX", label: "PTG - TASA"})
                ]
            });
            var movimientosDetalleVentasObjCount = movimientosDetalleVentasObj.runPaged().count;
            log.debug("movimientosDetalleVentasObjCount", movimientosDetalleVentasObjCount);

            if(movimientosDetalleVentasObjCount > 0){
                var movimientosDetalleVentasResult = movimientosDetalleVentasObj.run().getRange({
                    start: 0,
                    end: movimientosDetalleVentasObjCount,
                });
                log.audit("movimientosDetalleVentasResult", movimientosDetalleVentasResult);
                log.audit('Remaining Usage start for', runtime.getCurrentScript().getRemainingUsage());
                //for (var q = 0; q < movimientosDetalleVentasResult.length; q++) {
                if(incremento_inicio < movimientosDetalleVentasObjCount){
                    (idArticuloVentas = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_cilindro", summary: "GROUP", label: "PTG - Cilindro"}) || 0);
                    (movimientoMasVentas = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_movmas_", summary: "SUM", label: "PTG - Mov +"}) || 0);
                    (movimientoMenosVentas = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_movmenos_", summary: "SUM", label: "PTG - Mov -"}) || 0);
                    (ventasVentas = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_ventagas_", summary: "SUM", label: "PTG - Venta Gas"}) || 0);
                    (zonaPrecio = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_zonadeprecio_registromovs", summary: "GROUP", label: "PTG -Zona de precio"}) || 0);
                    (tasaVentas = movimientosDetalleVentasResult[incremento_inicio].getValue({name: "custrecord_ptg_tasa", summary: "MAX", label: "PTG - TASA"}) || 0);
                    var movimientoMas = parseInt(movimientoMasVentas);
                    var movimientoMenos = parseInt(movimientoMenosVentas);
                    var movimientoVentaGas = parseInt(ventasVentas);
                    var movimientoTasa = parseFloat(tasaVentas);
                    
                    var idInternoArticulo = parseInt(idArticuloVentas);
                    log.audit("idInternoArticulo", idInternoArticulo);
                    var itemObj = record.load({
                        type: search.Type.INVENTORY_ITEM,
                        id: idInternoArticulo,
                    });
                    var litros = itemObj.getValue("custitem_ptg_capacidadcilindro_");
                    log.audit("litros", litros);
                    
                    
                    log.audit("movimientoMas", movimientoMas);
                    log.audit("movimientoMenos", movimientoMenos);
                    log.audit("movimientoVentaGas", movimientoVentaGas);
                    log.audit("movimientoTasa", movimientoTasa);
                    log.audit("zonaPrecio", zonaPrecio);
                    if(!zonaPrecio){
                        zonaPrecio = '';
                    }
                    
                    
                    //BUSQUEDA GUARDADA: PTG - Detalle de ventas Dotacion
                    var dotacionDetalleVentasObj = search.create({
                        type: "customrecord_ptg_registrodedotacion_cil_",
                        filters: [
                           ["custrecord_ptg_numviaje_detalledotacion","anyof", numViaje], "AND", 
                           ["custrecord_ptg_registro_dotacion","is","T"], "AND", 
                           ["custrecord_ptg_cilindro_dotacion_","anyof", idArticuloVentas]
                        ],
                        columns:
                        [
                           search.createColumn({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación"}),
                           search.createColumn({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros"})
                        ]
                    });
                    log.audit("dotacionDetalleVentasObj", dotacionDetalleVentasObj);
                    var dotacionDetalleVentasObjCount = dotacionDetalleVentasObj.runPaged().count;
                    log.debug("dotacionDetalleVentasObjCount", dotacionDetalleVentasObjCount);
        
                    if(dotacionDetalleVentasObjCount > 0){
                        var dotacionDetalleVentasObjResult = dotacionDetalleVentasObj.run().getRange({
                            start: 0,
                            end: dotacionDetalleVentasObjCount,
                        });
                        log.audit("dotacionDetalleVentasObjResult", dotacionDetalleVentasObjResult);
                        for (var p = 0; p < dotacionDetalleVentasObjResult.length; p++) {
                            (descripcionArticuloDotacion = dotacionDetalleVentasObjResult[p].getValue({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación"}));
                            (cantidadArticuloDot = dotacionDetalleVentasObjResult[p].getValue({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros"}));
                            var cantidadArticuloDotacion = parseInt(cantidadArticuloDot);
                            log.audit("descripcionArticuloDotacion", descripcionArticuloDotacion);
                            log.audit("cantidadArticuloDotacion", cantidadArticuloDotacion);
                        }
                    } else {
                        cantidadArticuloDotacion = 0;
                    }
        
                    var movimientoLlenos = (((cantidadArticuloDotacion + movimientoMas) - movimientoMenos) - movimientoVentaGas);
                    var movimientoRegresoLlenos = (((cantidadArticuloDotacion + movimientoMas) - movimientoMenos) - movimientoVentaGas);
                    var movimientoImporte = (movimientoTasa * movimientoVentaGas);
                    var movimientoTotal = ((movimientoTasa * movimientoVentaGas) * 1.16);
                    log.audit("movimientoLlenos", movimientoLlenos);
                    log.audit("movimientoRegresoLlenos", movimientoRegresoLlenos);
                    log.audit("movimientoImporte", movimientoImporte);
                    log.audit("movimientoTotal", movimientoTotal);
       
                   
                    var recVentas = record.create({
                        type: "customrecord_ptg_detalledeventas_",
                        isDynamic: true,
                    });
                    recVentas.setValue("name", 1);
                    recVentas.setValue("custrecord_ptg_tipocilindro_detalleventa", idArticuloVentas);//BUSQUEDA 1      OK                     //PTG - TIPO DE CILINDRO DETALLE VENTAS 
                    recVentas.setValue("custrecord_ptg_dotacion_detalleventas_", cantidadArticuloDotacion);//BUSQUEDA 1        OK                     //PTG - DOTACIÓN DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_movmas_detalleventas_", movimientoMas);//BUSQUEDA 2     OK                     //PTG - MOV MAS DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_movmenos_detaventas_", movimientoMenos);//BUSQUEDA 2    OK                     //PTG - MOV MENOS DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_netodotacion_detvent", (movimientoMas - movimientoMenos));//------OK--------   //PTG - NETO DOTACIÓN DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_totales_detalleventas_", (cantidadArticuloDotacion + movimientoMas - movimientoMenos));//-----OK-------- //PTG - TOTALES DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_llenos_detalleventas_", movimientoLlenos);//BUSQUEDA 2              OK         //PTG - LLENOS DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_venta_detalleventas_", movimientoVentaGas);//BUSQUEDA 2             OK        //PTG - VENTA DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_regresllenoscalc_detvent", movimientoRegresoLlenos);//BUSQUEDA 2    OK         //PTG - REGRESO LLENOS CALCULADOS DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_kgs_detallesventas_", (movimientoVentaGas * litros));//BUSQUEDA 2 * //BUSQUEDA 1  OK   //PTG - KGS DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_pu_detalleventas_", movimientoTasa);//BUSQUEDA 2                             //PTG - PRECIO UNITARIO DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_importe_detalleventas__2", movimientoImporte);//BUSQUEDA 2                     //PTG - IMPORTE DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_total_detalleventas__2", movimientoTotal);//BUSQUEDA 2                         //PTG - TOTAL DETALLE VENTAS
                    recVentas.setValue("custrecord_ptg_zonadepreciovents_", zonaPrecio);//BUSQUEDA 2                         //PTG -Zona de precio
                    recVentas.setValue("custrecord_ptg_numviaje_detalleventas_", recId);
                    var recVentasIdSaved = recVentas.save();
                    log.debug({
                        title: "DETALLE DE VENTAS",
                        details: "Id Saved: " + recVentasIdSaved,
                    });
       
                    log.audit('Remaining Usage end for', runtime.getCurrentScript().getRemainingUsage());
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
                    scriptId: "customscript_drt_liquidacion_sl_2",
                    deploymentId: "customdeploy_drt_liquidacion_sl_2",
                    parameters: parametros2
                });
                log.audit("redirectToStl2", redirectToStl2);
            } else {
                log.audit("el incremento es ", incremento_inicio);

                redirect.toRecord({
                    type: 'customrecord_ptg_preliquicilndros_',
                    id: recId,
                    parameters: {}
                });
            }
           
        } catch (error) {
            log.error("error onRequest", error);
            redirect.toRecord({
                type: 'customrecord_ptg_preliquicilndros_',
                id: recId,
                parameters: {}
            });
        }
    }

    return {
        onRequest: onRequest
    }
});