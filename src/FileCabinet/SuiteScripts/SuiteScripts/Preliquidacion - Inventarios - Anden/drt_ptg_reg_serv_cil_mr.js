/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Registro de Servicios Cilindros MR
 * Script id: customscript_drt_ptg_reg_serv_cil_mr
 * Deployment id: customdeploy_drt_ptg_reg_serv_cil_mr
 * Applied to: 
 * File: drt_ptg_reg_serv_cil_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';

            var idRegistro = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_registro_serv_cil'
            }) || '';
            log.debug("idRegistro", idRegistro);
             
            var arrayColumns = [
                search.createColumn({name: "custrecord_ptg_cliente_reg_serv_cil_lin", label: "PTG - Cliente"}),
                search.createColumn({name: "custrecord_ptg_articulo_reg_serv_cil_lin", label: "PTG - Artículo"}),
                search.createColumn({name: "custrecord_ptg_cantidad_reg_serv_cil_lin", label: "PTG - Cantidad"}),
                search.createColumn({name: "custrecord_ptg_precio_reg_serv_cil_lin", label: "PTG - Precio"}),
                search.createColumn({name: "custrecord_ptg_subtotal_registro_servs_", label: "PTG - SUBTOTAL"}),
                search.createColumn({name: "custrecord_ptg_impuesto_reg_serv_cil_lin", label: "PTG - Impuesto"}),
                search.createColumn({name: "custrecord_ptg_total_reg_serv_cil_lin", label: "PTG - Total"}),
                search.createColumn({name: "custrecord_ptg_form_pago_reg_serv_cil_li", label: "PTG - Forma de Pago"}),
                search.createColumn({name: "custrecord_ptg_zonadeprecio_", label: "PTG -Zona de precio"}),
                search.createColumn({name: "custrecord_ptg_vehiculo_reg_serv_cil_lin", label: "PTG - No. Vehiculo Destino"}),
                search.createColumn({name: "custrecord_ptg_num_vdes_reg_serv_cil_lin", label: "PTG - Número de Viaje Destino"}),
                search.createColumn({name: "custrecord_ptg_referencia_", label: "PTG - Referencia"}),
                search.createColumn({name: "custrecord_ptg_kilometraje_serv_carb_lin", label: "PTG - Kilometraje"})
            ];

            var arrayFilters = [
                ["custrecord_ptg_id_reg_serv_cil_lin","anyof",idRegistro], "AND", 
                ["custrecord_ptg_oportun_reg_serv_cil_lin","anyof","@NONE@"], "AND", 
                ["custrecord_ptg_transa_reg_serv_cil_lin","anyof","@NONE@"]
             ],

            //BÚSQUEDA GUARDADA: PTG - Registro de Servicios Cilindros SS
            respuesta = search.create({
                type: 'customrecord_ptg_registro_servicios_ci_l',
                columns: arrayColumns,
                filters: arrayFilters
            });


        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            log.audit({
                title: 'context map',
                details: JSON.stringify(context)
            });

            var objValue = JSON.parse(context.value);
            var idRegistroCilindroLinea = objValue.id;
            var objPagos = {};
            var arrayPagos = [];
            var objPagosOportunidad = {};
            var regServCilUpdate = {};
            var oportunidadArray = [];
            var publicoGeneral = 0;
            var cilindro10 = 0;
            var cilindro20 = 0;
            var cilindro30 = 0;
            var cilindro45 = 0;
            var unidad = 0;
            var gasLPUnidades = 0;
            var unidad10 = 0;
            var unidad20 = 0;
            var unidad30 = 0;
            var unidad45 = 0;
            var cliente = objValue.values["custrecord_ptg_cliente_reg_serv_cil_lin"].value;
            var articulo = objValue.values["custrecord_ptg_articulo_reg_serv_cil_lin"].value;
            var cantidad = objValue.values["custrecord_ptg_cantidad_reg_serv_cil_lin"];
            var subTotal = objValue.values["custrecord_ptg_subtotal_registro_servs_"];
            var precio = objValue.values["custrecord_ptg_precio_reg_serv_cil_lin"];
            var impuesto = objValue.values["custrecord_ptg_impuesto_reg_serv_cil_lin"];
            var montoPago = objValue.values["custrecord_ptg_total_reg_serv_cil_lin"];
            var formaPago = objValue.values["custrecord_ptg_form_pago_reg_serv_cil_li"].value;
            var formaPagoTXT = objValue.values["custrecord_ptg_form_pago_reg_serv_cil_li"].text;
            var zonaPrecio = objValue.values["custrecord_ptg_zonadeprecio_"].value;
            var vehiculoDestino = objValue.values["custrecord_ptg_vehiculo_reg_serv_cil_lin"].value;
            var viajeDestino = objValue.values["custrecord_ptg_num_vdes_reg_serv_cil_lin"].value;
            var referencia = objValue.values["custrecord_ptg_referencia_"];
            var kilometraje = objValue.values["custrecord_ptg_kilometraje_serv_carb_lin"];
            log.debug("vehiculoDestino", vehiculoDestino);
            log.debug("viajeDestino", viajeDestino);

            var condretado = 0;
            var entregado = 0;
            var ventaLitro = 0;
            var traspasoId = 0;
            var formularioRecepcion = 0;
            var formularioOportunidad = 0;
            var formularioOrdenTraslado = 0;
            var rfcGenerico = "";
            var rfcPublicoGeneral = "";
            var idArticuloDescuento = 0;
            var subTotalSinDecuento = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                publicoGeneral = 14508;
                cilindro10 = 4094;
                cilindro20 = 4095;
                cilindro30 = 4096;
                cilindro45 = 4602;
                gasLPUnidades = 4693;
                unidad10 = 24;
                unidad20 = 25;
                unidad30 = 26;
                unidad45 = 27;
                condretado = 13;
                entregado = 3;
                ventaLitro = 9;
                traspasoId = 25;
                formularioRecepcion = 258;
                formularioOportunidad = 305;
                formularioOrdenTraslado = 313;
                rfcGenerico = "XAXX010101000";
                rfcPublicoGeneral = "AAA010101AAA";
                idArticuloDescuento = 4217;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                publicoGeneral = 27041;
                cilindro10 = 4210;
                cilindro20 = 4211;
                cilindro30 = 4212;
                cilindro45 = 4213;
                gasLPUnidades = 4216;
                unidad10 = 12;
                unidad20 = 13;
                unidad30 = 14;
                unidad45 = 15;
                condretado = 13;
                entregado = 3;
                ventaLitro = 9;
                traspasoId = 25;
                formularioRecepcion = 270;
                formularioOportunidad = 265;
                formularioOrdenTraslado = 266;
                rfcGenerico = "XAXX010101000";
                rfcPublicoGeneral = "AAA010101AAA";
                idArticuloDescuento = 4217;
            }

            var itemCilObj = record.load({
                type: search.Type.INVENTORY_ITEM,
                id: articulo,
              });
              var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
              log.emergency("capacidadArticulo", capacidadArticulo);
              if(capacidadArticulo == 10){
                unidad = unidad10;
              } else if(capacidadArticulo == 20){
                unidad = unidad20;
              } else if(capacidadArticulo == 30){
                unidad = unidad30;
              }  else if(capacidadArticulo == 45){
                unidad = unidad45;
              }
              log.audit("unidad: ", unidad);

            
            var solicitaFactura = false;
            var clienteObj = record.load({
                type: search.Type.CUSTOMER,
                id: cliente
            });
            var rfc = clienteObj.getValue("custentity_mx_rfc");
            log.audit("Cliente: "+ cliente, "RFC ", rfc);
            var nombreClienteAFacturar = clienteObj.getValue("custentity_razon_social_para_facturar");
            if((rfc != rfcGenerico) || (rfc != rfcPublicoGeneral)){
                log.audit("Solicita factura");
                solicitaFactura = true;
            }
            var zonaPrecioObj = record.load({
                type: "customrecord_ptg_zonasdeprecio_",
                id: zonaPrecio,
            });
            var factorConversion = parseFloat(zonaPrecioObj.getValue("custrecord_ptg_factor_conversion"));
            log.audit("factorConversion", factorConversion);
            var precioPorLitro = parseFloat(zonaPrecioObj.getValue("custrecord_ptg_precio_"));
            log.audit("precioPorLitro", precioPorLitro);
            var precioPorKilo = parseFloat(zonaPrecioObj.getValue("custrecord_ptg_precio_kg"));
            log.audit("precioPorKilo", precioPorKilo);
            subTotalSinDecuento = capacidadArticulo * precioPorKilo;
            log.audit("subTotalSinDecuento", subTotalSinDecuento);
            var clienteDescuento = false;
            var descuentoSinIVA = 0;
            var descuentoUnitario = 0;
            var descuentoPrecioLitro = 0;
            var litrosConversion = 0;
            var descuentoPeso = parseFloat(clienteObj.getValue("custentity_ptg_descuento_asignar"));
            log.audit("descuentoPeso", descuentoPeso);
            if(descuentoPeso > 0){
                clienteDescuento = true;
                descuentoSinIVA = descuentoPeso / 1.16;
                log.audit("descuentoSinIVA", descuentoSinIVA);
                litrosConversion = capacidadArticulo / factorConversion;
                log.audit("litrosConversion", litrosConversion);
                /*descuentoPrecioLitro = precioPorLitro - descuentoSinIVA;
                log.audit("descuentoPrecioLitro", descuentoPrecioLitro);
                litrosConversion = capacidadArticulo / factorConversion;
                log.audit("litrosConversion", litrosConversion);*/
                descuentoUnitario = (litrosConversion * descuentoSinIVA) * -1;
                log.audit("descuentoUnitario", descuentoUnitario);
            }
            
            var numeroViaje = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_num_viaje_serv_cil'
            }) || '';
            var vehiculo = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_vehiculo_serv_cil'
            }) || '';

            if (formaPago != traspasoId) {
                log.audit("entra oportunidad");

                if(cliente == publicoGeneral && ((articulo == cilindro10)||(articulo == cilindro20)||(articulo == cilindro30)||(articulo == cilindro45))){
                    var montoPagoIndividual = montoPago/cantidad;
                    objPagos = {
                        metodo_txt: formaPagoTXT,
                        tipo_pago: formaPago,
                        monto: montoPagoIndividual,
                        folio: referencia,
                    };
                    var montoPF = parseFloat(montoPagoIndividual);
                    var rate = montoPF / 1.16;
                    arrayPagos.push(objPagos);
                    objPagosOportunidad = { pago: arrayPagos };
                    var objValue = JSON.stringify(objPagosOportunidad);

                    for(var j = 0; j < cantidad; j++){
                        var recOportunidad = record.create({
                            type: record.Type.OPPORTUNITY,
                            isDynamic: true,
                        });
                        recOportunidad.setValue("customform", formularioOportunidad);
                        recOportunidad.setValue("entity", cliente);
                        recOportunidad.setValue("entitystatus", condretado);
                        recOportunidad.setValue("probability", 100);
                        recOportunidad.setValue("custbody_ptg_numero_viaje", numeroViaje);
                        recOportunidad.setValue("custbody_ptg_estado_pedido", entregado);
                        recOportunidad.setValue("custbody_ptg_opcion_pago_obj", objValue);
                        recOportunidad.setValue("custbody_ptg_codigo_movimiento",ventaLitro);
                        recOportunidad.setValue("custbody_ptg_zonadeprecioop_", zonaPrecio);
                        recOportunidad.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);
                        for (var i = 0; i < 1; i++) {
                            recOportunidad.selectLine("item", i);
                            recOportunidad.setCurrentSublistValue("item", "item", articulo);
                            recOportunidad.setCurrentSublistValue("item", "quantity", 1);
                            recOportunidad.setCurrentSublistValue("item", "rate", rate);
                            recOportunidad.commitLine("item");
                        }
                        var recOportunidadIdSaved = recOportunidad.save();
                        log.debug({
                            title: "Oportunidad Creada",
                            details: "Id Saved: " + recOportunidadIdSaved,
                        });

                        oportunidadArray.push(recOportunidadIdSaved);


                        var objRecordLoad = record.load({
                            type: record.Type.OPPORTUNITY,
                            id: recOportunidadIdSaved,
                        });

                        var idObjRecordLoad = objRecordLoad.save();

                        log.debug({
                            title: "Oportunidad Cargada",
                            details: "Id Saved: " + idObjRecordLoad,
                        });
                    }
                    regServCilUpdate.custrecord_ptg_oportun_reg_serv_cil_lin = oportunidadArray;

                    record.submitFields({
                        id: idRegistroCilindroLinea,
                        type: "customrecord_ptg_registro_servicios_ci_l",
                        values: regServCilUpdate,
                    });
                 } else{
                    objPagos = {
                        metodo_txt: formaPagoTXT,
                        tipo_pago: formaPago,
                        monto: montoPago,
                        folio: referencia,
                    };
                    arrayPagos.push(objPagos);
                    objPagosOportunidad = { pago: arrayPagos };
                    var objValue = JSON.stringify(objPagosOportunidad);

                    var recOportunidad = record.create({
                        type: record.Type.OPPORTUNITY,
                        isDynamic: true,
                    });
                    recOportunidad.setValue("customform", formularioOportunidad);
                    recOportunidad.setValue("entity", cliente);
                    recOportunidad.setValue("entitystatus", condretado);
                    recOportunidad.setValue("probability", 100);
                    recOportunidad.setValue("custbody_ptg_numero_viaje", numeroViaje);
                    recOportunidad.setValue("custbody_ptg_estado_pedido", entregado);
                    recOportunidad.setValue("custbody_ptg_opcion_pago_obj", objValue);
                    recOportunidad.setValue("custbody_ptg_codigo_movimiento",ventaLitro);
                    recOportunidad.setValue("custbody_ptg_zonadeprecioop_", zonaPrecio);
                    recOportunidad.setValue("custbody_ptg_cliente_solicita_factura", solicitaFactura);
                    recOportunidad.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);
                    for (var i = 0; i < 1; i++) {
                        recOportunidad.selectLine("item", i);
                        recOportunidad.setCurrentSublistValue("item", "item", articulo);
                        recOportunidad.setCurrentSublistValue("item", "quantity", cantidad);
                        recOportunidad.setCurrentSublistValue("item", "rate", subTotalSinDecuento);
                        recOportunidad.commitLine("item");
                    }
                    if((articulo == cilindro10)||(articulo == cilindro20)||(articulo == cilindro30)||(articulo == cilindro45)){
                        //Se agrega la línea de descuento en caso que el cliente tenga descuento
                        if(clienteDescuento){
                            for (var i = 1; i < 2; i++) {
                                recOportunidad.selectLine("item", i);
                                recOportunidad.setCurrentSublistValue("item", "item", idArticuloDescuento);
                                recOportunidad.setCurrentSublistValue("item", "price", -1);
                                recOportunidad.setCurrentSublistValue("item", "rate", descuentoUnitario);
                                recOportunidad.commitLine("item");
                            }
                        }
                    }
                    var recOportunidadIdSaved = recOportunidad.save();
                    regServCilUpdate.custrecord_ptg_oportun_reg_serv_cil_lin = recOportunidadIdSaved;
                    log.debug({
                        title: "Oportunidad Creada",
                        details: "Id Saved: " + recOportunidadIdSaved,
                    });

                    record.submitFields({
                        id: idRegistroCilindroLinea,
                        type: "customrecord_ptg_registro_servicios_ci_l",
                        values: regServCilUpdate,
                    });

                    var objRecordLoad = record.load({
                        type: record.Type.OPPORTUNITY,
                        id: recOportunidadIdSaved,
                    });

                    var idObjRecordLoad = objRecordLoad.save();

                    log.debug({
                        title: "Oportunidad Cargada",
                        details: "Id Saved: " + idObjRecordLoad,
                    });
                 }
                 
            } else {

                var vehiculoObj = record.load({
                    type: "customrecord_ptg_equipos",
                    id: vehiculo,
                });

                var subsidiary = vehiculoObj.getValue("custrecord_ptg_subsidiaria_1");
                var parent = vehiculoObj.getValue("custrecord_ptg_ubicacionruta_");

                var vehiculoDestinoObj = record.load({
                    type: "customrecord_ptg_equipos",
                    id: vehiculoDestino,
                });

                var ruta = vehiculoDestinoObj.getValue("custrecord_ptg_ubicacionruta_");

                var recOrdenTraslado = record.create({
                    type: "transferorder",
                    isDynamic: true,
                });
        
                recOrdenTraslado.setValue("customform", formularioOrdenTraslado);
                recOrdenTraslado.setValue("subsidiary", subsidiary);
                recOrdenTraslado.setValue("location", parent);
                recOrdenTraslado.setValue("transferlocation", ruta);
                recOrdenTraslado.setValue("custbody_ptg_numero_viaje", numeroViaje)
                recOrdenTraslado.setValue("custbody_ptg_numero_viaje_destino", viajeDestino);
        
                for (var i = 0; i < 1; i++) {
                  recOrdenTraslado.selectLine("item", i);
                  recOrdenTraslado.setCurrentSublistValue("item", "item", gasLPUnidades);
                  recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidad);
                  recOrdenTraslado.setCurrentSublistValue("item", "units", unidad);
                  recOrdenTraslado.commitLine("item");
                }
        
                var idOrdenTraslado = recOrdenTraslado.save();
                log.debug("idOrdenTraslado", idOrdenTraslado);

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

                    var objRecordOrdenTrasladoLoad = record.load({
                        type: record.Type.TRANSFER_ORDER,
                        id: idOrdenTraslado,
                    });

                    var idObjRecordOrdenTrasladoLoad = objRecordOrdenTrasladoLoad.save();

                    log.debug({
                        title: "Orden de Traslado Cargada",
                        details: "Id Saved: " + idObjRecordOrdenTrasladoLoad,
                    });
        
                }
        
                if (idItemFulfillment) {
                    var newRecordItemReceipt = record.transform({
                      fromType: record.Type.TRANSFER_ORDER,
                      fromId: idOrdenTraslado,
                      toType: record.Type.ITEM_RECEIPT,
                      isDynamic: true,
                      ignoreMandatoryFields: true,
                    });
                    newRecordItemReceipt.setValue("customform", formularioRecepcion);//PTG- Recepción Orden de Traslado
        
                    newRecordItemReceipt.setValue("location", ruta);
        
                    var idItemReceipt = newRecordItemReceipt.save({
                      enableSourcing: false,
                      ignoreMandatoryFields: true,
                    }) || "";
        
                    log.debug("idItemReceipt", idItemReceipt);
    
                    regServCilUpdate.custrecord_ptg_transa_reg_serv_cil_lin = idOrdenTraslado;

                    record.submitFields({
                        id: idRegistroCilindroLinea,
                        type: "customrecord_ptg_registro_servicios_ci_l",
                        values: regServCilUpdate,
                    });

                    var objUpdateVehiculo = {
                        custrecord_ptg_totalizador_: kilometraje,
                    }

                    var updateVehiculo = record.submitFields({
                        type: "customrecord_ptg_equipos",
                        id: vehiculo,
                        values: objUpdateVehiculo,
                    });
                    log.debug("Vehiculo actualizado", updateVehiculo);
                }

                if (idItemReceipt) {
                    var objRecordRecepcionLoad = record.load({
                        type: record.Type.ITEM_RECEIPT,
                        id: idItemReceipt,
                    });

                    var idObjRecordRecepcionLoad = objRecordRecepcionLoad.save({
                        enableSourcing: false,
                        ignoreMandatoryFields: true,
                      }) || "";

                    log.debug({
                        title: "Recepcion Cargada",
                        details: "Id Saved: " + idObjRecordRecepcionLoad,
                    });

                }
            }
            

            context.write({
                key: recOportunidadIdSaved,
                value: recOportunidadIdSaved
            });
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idOportunidad = JSON.parse(context.key);
            log.audit("idOportunidad", idOportunidad);
            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(context) {
        try {
            log.audit({
                title: 'context summarize',
                details: JSON.stringify(context)
            });            
			
        } catch (error) {
            log.error({
                title: 'error summarize',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});