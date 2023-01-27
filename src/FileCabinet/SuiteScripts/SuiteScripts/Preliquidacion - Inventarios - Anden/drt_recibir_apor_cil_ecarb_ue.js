/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Recibir Aporta Cil a Est Carb UE
 * Script id: customscript_drt_reci_apor_cil_ecarb_ue
 * customer Deployment id: customdeploy_drt_reci_apor_cil_ecarb_ue
 * Applied to: PTG - Crear/Recibir aportación Est-carb
 * File: drt_recibir_apor_cil_ecarb_ue.js
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
            log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "),
            [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
            var estatusPendiente = 0;
            var estatusRecibido = 0;
            var formularioCustomRecord = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                estatusPendiente = 1;
                estatusRecibido = 2;
                formularioCustomRecord = 324;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                estatusPendiente = 1;
                estatusRecibido = 2;
                formularioCustomRecord = 189;
            }


            if (type_event == "view") {
                
                var status = recObj.getValue("custrecord_ptg_status_recepcion");
                var ordenTraslado = recObj.getValue("custrecord_ptg_orden_traslado");
                log.debug("status", status);
                log.debug("ordenTraslado", ordenTraslado);
            
                if (status == estatusPendiente) {
                    form.title = "Órden de Traslado Pendiente de Recibir";
                } else if (status == estatusRecibido) {
                    form.title = "Órden de Traslado Recibida";
                    recObj.setValue("customform", formularioCustomRecord);
                }
                
                if (status == estatusPendiente && ordenTraslado) {
                    form.addButton({
                        id: "custpage_drt_recibir",
                        label: "Recibir Cilindros",
                        functionName: "redirectTo()",
                    });
                }
                
                form.clientScriptModulePath = "./drt_recepcion_aportacion_cs.js";
            }

        } catch (error) {
            log.error("ERROR", error);
        }
    }
    
    function afterSubmit(context) {
        try {
            var customRec = context.newRecord;
            var recId = customRec.id;
            var nombreSublista = "recmachcustrecord_ptg_detalle_aportacion_";
            var vehiculo = customRec.getValue("custrecord_ptg_vehiculo_estcarb_rec_apor");
            var numViaje = customRec.getValue("custrecord_ptg_rec_apor_est_carb_");
            var estacionCarburacion = customRec.getValue("custrecord_ptg_estcarb_rec_aportacion_");
            var ordenTraslado = customRec.getValue("custrecord_ptg_orden_traslado");
            var lineCount = customRec.getLineCount({sublistId: nombreSublista});
            var articuloArray = [];
            var objUpdate = {};
            var cantidadArray = [];
            var unidadArray = [];
            var gasLPUnidades = 0;
            var zonaPrecio = 0;
            var estatusPendiente = 0;
            var unidad10 = 0;
            var unidad20 = 0;
            var unidad30 = 0;
            var unidad45 = 0;
            var formularioOrdenTraslado = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                estatusPendiente = 1;
                zonaPrecio = 274;
                unidad10 = 24;
                unidad20 = 25;
                unidad30 = 26;
                unidad45 = 27;
                formularioOrdenTraslado = 313;
                gasLPUnidades = 4693;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                estatusPendiente = 1;
                zonaPrecio = 101;
                unidad10 = 12;
                unidad20 = 13;
                unidad30 = 14;
                unidad45 = 15;
                formularioOrdenTraslado = 266;
                gasLPUnidades = 4216;
            }

            if(!ordenTraslado){
                var locationObj = record.load({
                    type: "customrecord_ptg_equipos",
                    id: vehiculo,
                });
                var parent = locationObj.getValue("custrecord_ptg_ubicacion_");
                var subsidiary = locationObj.getValue("custrecord_ptg_subsidiaria_1");
                var ruta = locationObj.getValue("custrecord_ptg_ubicacionruta_");
    
                for (var l = 0; l < lineCount; l++) {
                    articuloArray[l] = customRec.getSublistValue({sublistId: nombreSublista, fieldId: "custrecord_ptg_tipoenv_rec_est_carb_", line: l,});
                    cantidadArray[l] = customRec.getSublistValue({sublistId: nombreSublista, fieldId: "custrecord_ptg_cantidad_aport_cil_", line: l,});

                    var itemCilObj = record.load({
                        type: search.Type.INVENTORY_ITEM,
                        id: articuloArray[l],
                    });
                    var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
                    log.emergency("capacidadArticulo", capacidadArticulo);
                    if(capacidadArticulo == 10){
                        unidadArray[l] = unidad10;
                    } else if(capacidadArticulo == 20){
                        unidadArray[l] = unidad20;
                    } else if(capacidadArticulo == 30){
                        unidadArray[l] = unidad30;
                    } else if(capacidadArticulo == 45){
                        unidadArray[l] = unidad45;
                    }
                    log.audit("unidad: L:" + l, unidadArray[l]);
                }
    
                var recOrdenTraslado = record.create({
                    type: "transferorder",
                    isDynamic: true,
                });
            
                recOrdenTraslado.setValue("customform", formularioOrdenTraslado);
                recOrdenTraslado.setValue("subsidiary", subsidiary);
                recOrdenTraslado.setValue("location", ruta);
                recOrdenTraslado.setValue("transferlocation", estacionCarburacion);
                recOrdenTraslado.setValue("custbody_ptg_zonadeprecio_traslado_", zonaPrecio);
                recOrdenTraslado.setValue("custbody_ptg_numero_viaje", numViaje);
            
                for (var i = 0; i < lineCount; i++) {
                    recOrdenTraslado.selectLine("item", i);
                    recOrdenTraslado.setCurrentSublistValue("item", "item", gasLPUnidades);
                    recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadArray[i]);
                    recOrdenTraslado.setCurrentSublistValue("item", "units", unidadArray[i]);
                    recOrdenTraslado.commitLine("item");
                }
            
                var idOrdenTraslado = recOrdenTraslado.save();
                log.debug("idOrdenTraslado", idOrdenTraslado);
                objUpdate.custrecord_ptg_orden_traslado = idOrdenTraslado;

                var reloadOrden = record.load({
                    type: search.Type.TRANSFER_ORDER,
                    id: idOrdenTraslado,
                    isDynamic: true
                });

                for(var i = 0; i < lineCount; i++){
                    var rec = record.create({
                        type: "customrecord_ptg_regitrodemovs_",
                        isDynamic: true,
                    });
            
                    rec.setValue("name", idOrdenTraslado);
                    rec.setValue("custrecord_ptg_movmas_", 0);
                    rec.setValue("custrecord_ptg_movmenos_", cantidadArray[i]);
                    rec.setValue("custrecord_ptg_cilindro", articuloArray[i]);
                    rec.setValue("custrecord_ptg_ventagas_", 0);
                    rec.setValue("custrecord_ptg_envasesvendidos_", 0);
                    rec.setValue("custrecord_ptg_lts_", 0);
                    rec.setValue("custrecord_ptg_tasa", 0);
                    rec.setValue("custrecord_ptg_num_viaje_oportunidad", numViaje);
                    rec.setValue("custrecord_ptg_origen", true);
                    rec.setValue("custrecord_ptg_zonadeprecio_registromovs", zonaPrecio);
                    rec.setValue("custrecord_ptg_unidad_", unidadArray[i])
                    rec.setValue("custrecord_drt_ptg_reg_transaccion", idOrdenTraslado);
              
                    var recIdSaved = rec.save();

                    reloadOrden.selectLine('item', i);
                    reloadOrden.setCurrentSublistValue('item', 'custcol_drt_ptg_registro_mov_creado', recIdSaved);
                    reloadOrden.commitLine('item');
            
                }

                var reloadOrdenSaved = reloadOrden.save();
                log.debug("Orden reloaded", reloadOrdenSaved);
    
                if (idOrdenTraslado) {
                    var newRecordItemFulfillment = record.transform({
                        fromType: record.Type.TRANSFER_ORDER,
                        fromId: idOrdenTraslado,
                        toType: record.Type.ITEM_FULFILLMENT,
                        isDynamic: true,
                        ignoreMandatoryFields: true,
                    });
                    newRecordItemFulfillment.setValue("shipstatus", "C");
            
                    var idItemFulfillment = newRecordItemFulfillment.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true,
                    }) || "";
            
                    log.debug("idItemFulfillment", idItemFulfillment);
                    objUpdate.custrecord_ptg_status_recepcion = estatusPendiente;
                }
    
                var registro = record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objUpdate,
                });
    
                log.debug("Registro actualizado ", registro);
            } else {
                var reloadOrden = record.load({
                    type: search.Type.TRANSFER_ORDER,
                    id: ordenTraslado,
                });

                var numPedido = reloadOrden.getValue("tranid");
                var fecha = reloadOrden.getValue("trandate");
                var numViajeOrigen = reloadOrden.getValue("custbody_ptg_numero_viaje");
                var numViajeDestino = reloadOrden.getValue("custbody_ptg_numero_viaje_destino");

                log.audit("qefw");
                log.audit("numPedido", numPedido);
                log.audit("fecha", fecha);
                log.audit("numViajeOrigen", numViajeOrigen);
                log.audit("numViajeDestino", numViajeDestino);
                log.audit("num_Pedido");
                reloadOrden.setValue("memo", "Traslado a Estación de Carburación");

                var reloadOrdenSaved = reloadOrden.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug("Orden reloaded edit", reloadOrdenSaved);
            }

        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
    };
});