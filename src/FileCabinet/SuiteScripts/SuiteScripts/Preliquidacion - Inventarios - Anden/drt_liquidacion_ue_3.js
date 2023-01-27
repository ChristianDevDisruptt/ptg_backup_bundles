/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - Liquidacion 3 UE COPY
 * Script id: customscript_drt_liquidacion_ue_3_c
 * customer Deployment id: customdeploy_drt_liquidacion_ue_3_c
 * Applied to: PTG - PreLiquidación de Cilindros
 * File: drt_liquidacion_ue_3_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
   
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_numdeviaje_");
                var itemCount = customRec.getLineCount({sublistId: "recmachcustrecord_ptg_preliqrelacionada_",});
                //var opcionPago = 10;
                
                log.audit("recId", recId);
                log.audit("Viaje", numViaje);
                log.audit("Numero lineas: ", itemCount);
                log.audit('Remaining Usage start proceso', runtime.getCurrentScript().getRemainingUsage());

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
                var publicoGeneral = 0;
                var urlPago = "";
                var articuloCilindro = 0;
                var articuloEnvase = 0;
                var ventaServicioGas = 0;
                var ventaServicioCilindro = 0;
                var ventaServicio = 0;

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
                    articuloCilindro = 1;
                    articuloEnvase = 5;
                    ventaServicioGas = 1;
                    ventaServicioCilindro = 2;
                    ventaServicio = 3;
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
                    articuloCilindro = 1;
                    articuloEnvase = 5;
                    ventaServicioGas = 1;
                    ventaServicioCilindro = 2;
                    ventaServicio = 3;
                }


                //DETALLE DE MOVIMIENTOS
                //BÚSQUEDA GUARDADA: DRT - PTG - Detalle Movimientos
/*                var idRegistroMovimientosArray = [];
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
                log.audit('Remaining Usage start for', runtime.getCurrentScript().getRemainingUsage());
                for (var n = 0; n < detalleMovimientoResult.length; n++) {
                    (idRegistroMovimientos = detalleMovimientoResult[n].getValue({name: "internalid", label: "Internal ID"})),
                    (ventaGas = detalleMovimientoResult[n].getValue({ name: "custrecord_ptg_ventagas_", label: "PTG - Venta Gas", })),
                    (cilindro = detalleMovimientoResult[n].getValue({ name: "custrecord_ptg_cilindro", label: "PTG - Cilindro", }));
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
                 log.audit('Remaining Usage end for', runtime.getCurrentScript().getRemainingUsage());                   

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
                        for (var q = 0; q < movimientosDetalleVentasResult.length; q++) {
                            (idArticuloVentas = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_cilindro", summary: "GROUP", label: "PTG - Cilindro"}) || 0);
                            (movimientoMasVentas = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_movmas_", summary: "SUM", label: "PTG - Mov +"}) || 0);
                            (movimientoMenosVentas = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_movmenos_", summary: "SUM", label: "PTG - Mov -"}) || 0);
                            (ventasVentas = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_ventagas_", summary: "SUM", label: "PTG - Venta Gas"}) || 0);
                            (zonaPrecio = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_zonadeprecio_registromovs", summary: "GROUP", label: "PTG -Zona de precio"}) || 0);
                            (tasaVentas = movimientosDetalleVentasResult[q].getValue({name: "custrecord_ptg_tasa", summary: "MAX", label: "PTG - TASA"}) || 0);
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
                            
                        //}


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
                
                //DETALLE VENTA DE ENVASES
                //BÚSQUEDA GUARDADA: DRT PTG - Detalle venta de envases
                var detalleVentaEnvaseSearch = search.create({
                    type: "customrecord_ptg_regitrodemovs_",
                    filters: [
                        ["custrecord_ptg_num_viaje_oportunidad","anyof", numViaje], "AND", 
                        ["custrecord_ptg_cilindro","anyof",envase10,envase20,envase30,envase45], "AND", 
                        ["custrecord_ptg_origen","is","T"]
                    ],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_cilindro", summary: "GROUP", label: "PTG - Cilindro"}),
                        search.createColumn({name: "custrecord_ptg_envasesvendidos_", summary: "SUM", label: "PTG - Envases vendidos",}),
                        search.createColumn({name: "custrecord_ptg_tasa", summary: "SUM", label: "PTG - TASA"})
                    ],
                });
                log.audit("detalleVentaEnvaseSearch", detalleVentaEnvaseSearch);
                var detalleVentaEnvaseResultCount = detalleVentaEnvaseSearch.runPaged().count;
                log.audit("detalleVentaEnvaseResultCount", detalleVentaEnvaseResultCount);
                var detalleVentaEnvaseResult = detalleVentaEnvaseSearch.run().getRange({
                    start: 0,
                    end: detalleVentaEnvaseResultCount,
                });
                log.audit("detalleVentaEnvaseResult", detalleVentaEnvaseResult);
                log.audit('Remaining Usage start for', runtime.getCurrentScript().getRemainingUsage());
                for (var q = 0; q < detalleVentaEnvaseResult.length; q++) {
                    (cilindro = detalleVentaEnvaseResult[q].getValue({name: "custrecord_ptg_cilindro", summary: "GROUP", label: "PTG - Cilindro",})),
                    (envaseVendido = detalleVentaEnvaseResult[q].getValue({name: "custrecord_ptg_envasesvendidos_", summary: "SUM", label: "PTG - Envases vendidos",})),
                    (tasa = detalleVentaEnvaseResult[q].getValue({name: "custrecord_ptg_tasa", summary: "SUM", label: "PTG - TASA",}));

                    var recVentasEnvases = record.create({
                        type: "customrecord_ptg_ventadeenvases",
                        isDynamic: true,
                    });
                    recVentasEnvases.setValue("custrecordptg_tipocilindro_ventaenvases_", cilindro);
                    recVentasEnvases.setValue("custrecord_ptg_cantidad_ventaenvases_", envaseVendido);
                    recVentasEnvases.setValue("custrecord_ptg_precioventaenvases_", tasa);
                    recVentasEnvases.setValue("custrecord_ptg_importe_ventaenvases_", (envaseVendido * tasa));
                    recVentasEnvases.setValue("custrecord_ptg_totalventaenvases_", ((envaseVendido * tasa)*1.16));
                    recVentasEnvases.setValue("custrecord_ptg_noviajeventaenvases_", recId);
                    var recVentasEnvasesIdSaved = recVentasEnvases.save();
                    log.debug({
                        title: "DETALLE DE VENTAS ENVASES",
                        details: "Id Saved: " + recVentasEnvasesIdSaved,
                    });
                    log.audit('Remaining Usage end for', runtime.getCurrentScript().getRemainingUsage());
                }*/
                
                //DETALLE RESUMEN
                //BÚSQUEDA GUARDADA: DRT PTG - Detalle Resumen
/*                 var detalleResumenSearch = search.create({
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
                log.audit('Remaining Usage start for', runtime.getCurrentScript().getRemainingUsage());
                for (var r = 0; r < detalleResumenResult.length; r++) {
                    (idOportunidad = detalleResumenResult[r].getValue({name: "internalid", label: "ID interno"})),
                    (opcionPago = detalleResumenResult[r].getValue({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"})),
                    (referencia = detalleResumenResult[r].getValue({name: "custbody_drt_ptg_num_consecutivo", label: "PTG - Numero consecutivo"})),
                    (tipoArticulo = detalleResumenResult[r].getValue({name: "custitem_ptg_tipodearticulo_", join: "item", label: "PTG - TIPO DE ARTÍCULO"})),
                    (cliente = detalleResumenResult[r].getValue({name: "entity", label: "Name"})),
                    (cantidad = detalleResumenResult[r].getValue({name: "quantity", label: "Quantity"})),
                    (unidad = detalleResumenResult[r].getValue({name: "stockunit", join: "item", label: "Primary Stock Unit"})),
                    (tasa = detalleResumenResult[r].getValue({name: "rate", label: "Item Rate"})),
                    (impuesto = detalleResumenResult[r].getValue({name: "taxamount", label: "Amount (Tax)"})),
                    (nombreDocumento = detalleResumenResult[r].getValue({name: "tranid", label: "Document Number"}));

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
                    log.audit('Remaining Usage end for', runtime.getCurrentScript().getRemainingUsage());
                }*/
                log.audit('Remaining Usage end proceso', runtime.getCurrentScript().getRemainingUsage());
            }


            if (context.type == "edit") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_numdeviaje_");
                var status = customRec.getValue("custrecord_ptg_liquidacion_status");
                
                var detalleTipoPago = customRec.getLineCount({sublistId: "recmachcustrecord_ptg_optpreliq_"});
                
            }

        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }
    
    return {
        afterSubmit: afterSubmit,
    };
});