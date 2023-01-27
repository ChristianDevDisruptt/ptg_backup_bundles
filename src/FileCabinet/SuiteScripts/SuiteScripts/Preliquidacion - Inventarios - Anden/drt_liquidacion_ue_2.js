/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - Liquidacion UE 2 COPY
 * Script id: customscript_drt_liquidacion_ue_2_c
 * customer Deployment id: customdeploy_drt_liquidacion_ue_2_c
 * Applied to: PTG - PreLiquidación de Cilindros
 * File: drt_liquidacion_ue_2_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/task', 'N/url', 'N/https', "N/redirect", "N/log", 'N/currentRecord'], 
function (record, search, runtime, task, url, https, redirect, log, currentRecord) {
    
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                log.audit('Remaining Usage start proceso', runtime.getCurrentScript().getRemainingUsage());
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_numdeviaje_");
                var itemCount = customRec.getLineCount({sublistId: "recmachcustrecord_ptg_preliqrelacionada_",});
                var vehiculo = customRec.getValue("custrecord_ptg_nodevehiculo_prelicil_");
                log.audit("recId", recId);
                log.audit("Viaje", numViaje);
                log.audit("Numero lineas: ", itemCount);

                var estadoOpNegociacion = 0;
                var estadoOpCompra = 0;
                var estadoOpConcretado = 0;
                var estadoOpClienteConcretado = 0;
                var envase10 = 0;
                var envase20 = 0;
                var envase30 = 0;
                var envase45 = 0;

                if (runtime.envType === runtime.EnvType.SANDBOX) {
                    estadoOpNegociacion = 11;
                    estadoOpCompra = 12;
                    estadoOpConcretado = 13;
                    estadoOpClienteConcretado = 18;
                    envase10 = 4097;
                    envase20 = 4099;
                    envase30 = 4098;
                    envase45 = 4604;
                } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                    estadoOpNegociacion = 11;
                    estadoOpCompra = 12;
                    estadoOpConcretado = 13;
                    estadoOpClienteConcretado = 18;
                    envase10 = 4206;
                    envase20 = 4207;
                    envase30 = 4208;
                    envase45 = 4209;
                }

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
                var registroOportunidadResultCount = parseInt(registroOportunidad.runPaged().count);
                log.audit("registroOportunidadResultCount", registroOportunidadResultCount);



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
                var searchOportunidadesFacturarResultCount = opportunitySearchObj.runPaged().count;
                log.audit("searchOportunidadesFacturarResultCount", searchOportunidadesFacturarResultCount);


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
                log.audit("detalleResumenResultCount", detalleResumenResultCount);

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



                var busquedaMayor = 0;
                if(registroOportunidadResultCount >= searchOportunidadesFacturarResultCount && registroOportunidadResultCount >= detalleResumenResultCount && registroOportunidadResultCount >= detalleMovimientoResultCount && registroOportunidadResultCount >= movimientosDetalleVentasObjCount && registroOportunidadResultCount >= detalleVentaEnvaseResultCount){
                    busquedaMayor = registroOportunidadResultCount;
                } else if(searchOportunidadesFacturarResultCount >= registroOportunidadResultCount && searchOportunidadesFacturarResultCount >= detalleResumenResultCount && searchOportunidadesFacturarResultCount >= detalleMovimientoResultCount && searchOportunidadesFacturarResultCount >= movimientosDetalleVentasObjCount && searchOportunidadesFacturarResultCount >= detalleVentaEnvaseResultCount){
                    busquedaMayor = searchOportunidadesFacturarResultCount;
                } else if(detalleResumenResultCount >= registroOportunidadResultCount && detalleResumenResultCount >= searchOportunidadesFacturarResultCount && detalleResumenResultCount >= detalleMovimientoResultCount && detalleResumenResultCount >= movimientosDetalleVentasObjCount && detalleResumenResultCount >= detalleVentaEnvaseResultCount){
                    busquedaMayor = detalleResumenResultCount;
                } else if(detalleMovimientoResultCount >= registroOportunidadResultCount && detalleMovimientoResultCount >= searchOportunidadesFacturarResultCount && detalleMovimientoResultCount >= detalleResumenResultCount && detalleMovimientoResultCount >= movimientosDetalleVentasObjCount && detalleMovimientoResultCount >= detalleVentaEnvaseResultCount){
                    busquedaMayor = detalleMovimientoResultCount;
                } else if(movimientosDetalleVentasObjCount >= registroOportunidadResultCount && movimientosDetalleVentasObjCount >= searchOportunidadesFacturarResultCount && movimientosDetalleVentasObjCount >= detalleResumenResultCount && movimientosDetalleVentasObjCount >= detalleMovimientoResultCount && movimientosDetalleVentasObjCount >= detalleVentaEnvaseResultCount){
                    busquedaMayor = movimientosDetalleVentasObjCount;
                } else if(detalleVentaEnvaseResultCount >= registroOportunidadResultCount && detalleVentaEnvaseResultCount >= searchOportunidadesFacturarResultCount && detalleVentaEnvaseResultCount >= detalleResumenResultCount && detalleVentaEnvaseResultCount >= detalleMovimientoResultCount && detalleVentaEnvaseResultCount >= movimientosDetalleVentasObjCount){
                    busquedaMayor = detalleVentaEnvaseResultCount;
                }
                log.audit("busquedaMayor", busquedaMayor);


                if(busquedaMayor > 0){
                    log.audit("af");
                    for(var i = 0; i < busquedaMayor; i++){
                        log.audit("*****Entra implementacion "+i+"*****", "*****Entra implementacion "+i+"*****");
                        var parametros = {
                            'recId': recId,
                            'numViaje': numViaje,
                            'incremento_inicio': i,
                        };
                        log.audit("parametros", parametros);
        
                        var redirectToStl = redirect.toSuitelet({
                            scriptId: "customscript_drt_liquidacion_sl_2",
                            deploymentId: "customdeploy_drt_liquidacion_sl_2",
                            parameters: parametros
                        });
                        log.audit("redirectToStl", redirectToStl);
                    }            
                }

                log.audit('Remaining Usage fin proceso', runtime.getCurrentScript().getRemainingUsage());
               
            }


        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }
    
    return {
        afterSubmit: afterSubmit,
    };
});