/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 01/2022
 * Script name: DRT - Facturacion Oportunidad MR
 * Script id: customscript_drt_ptg_facturacion_opor_mr
 * Deployment id: customdeploy_drt_ptg_facturacion_opor_mr
 * Applied to: 
 * File: drt_ptg_facturacion_oportunidad_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_oportunidad_a_factura'
            }) || '';
            log.audit("id_search 1", id_search);
             
             var arrayColumns = [
                 search.createColumn({ name: "custrecord_ptg_id_oportunidad_fact", label: "PTG - Id Oportunidad a Facturar" }),
                 search.createColumn({name: "custrecord_ptg_preliq_cilindros", label: "PTG - Preliq Cilindros"})
                ];

            var arrayFilters = [
                ["custrecord_ptg_preliq_cilindros","anyof",id_search],"AND", 
                ["isinactive","is","F"]
             ];
            
                respuesta = search.create({
                    type: 'customrecord_ptg_oportunidad_facturar',
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

            var objValue1 = objValue.values["custrecord_ptg_preliq_cilindros"];

            var objValue3 = objValue1.value;

            var objValue2 = objValue.values["custrecord_ptg_id_oportunidad_fact"];

            var idOportunidad = objValue2.value;
            log.audit("idOportunidadM", idOportunidad);

            var objUpdate = {
                custrecord_ptg_terminado_cilindros: false,
                custrecord_ptg_error_cilindro: '',
            };

            var publicoGeneral = 0;
            var cuentaAjusteInventario = 0;
            var unidad10 = 0;
            var unidad20 = 0;
            var unidad30 = 0;
            var unidad45 = 0; 
            var formularioFacturaPTG = 0;
            var servicioCilindro = 0;
            var gasLPUnidades = 0;
            var idArticuloServicio = 0;
            var envaseCilindro = 0;
            var efectivoId = 0;
            var prepagoBanorteId = 0;
            var valeId = 0;
            var cortesiaId = 0;
            var tarjetaCreditoId = 0;
            var tarjetaDebitoId = 0;
            var multipleId = 0;
            var prepagoTransferenciaId = 0;
            var creditoClienteId = 0;
            var reposicionId = 0;
            var saldoAFavorId = 0;
            var consumoInternoId = 0;
            var prepagoBancomerId = 0;
            var prepagoHSBCId = 0;
            var prepagoBanamexId = 0;
            var prepagoSantanderId = 0;
            var prepagoScotianId = 0;
            var bonificacionId = 0;
            var ticketCardId = 0;
            var chequeBancomerId = 0;
            var recirculacionId = 0;
            var canceladoId = 0;
            var rellenoId = 0;
            var transferenciaId = 0;
            var traspasoId = 0;
            var chequeSantanderId = 0;
            var chequeScotianId = 0;
            var chequeHSBCId = 0;
            var chequeBanamexId = 0;
            var chequeBanorteId = 0;
            var tarjetaCreditoBancomerId = 0;
            var tarjetaCreditoHSBCId = 0;
            var tarjetaCreditoBanamexId = 0;
            var tarjetaDebitoBanamexId = 0;
            var tarjetaDebitoBancomerId = 0;
            var tarjetaDebitoHSBCId = 0;
            var publicoGeneralTXT = "";
            


            if (runtime.envType === runtime.EnvType.SANDBOX) {
                publicoGeneral = 14508;
                cuentaAjusteInventario = 218;
                unidad10 = 24;
                unidad20 = 25;
                unidad30 = 26;
                unidad45 = 27; 
                formularioFacturaPTG = 286;
                servicioCilindro = 1;
                gasLPUnidades = 4693;
                idArticuloServicio = 4528;
                envaseCilindro = 5;
                publicoGeneralTXT = "Publico General";
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                publicoGeneral = 27041;
                cuentaAjusteInventario = 218;
                unidad10 = 12;
                unidad20 = 13;
                unidad30 = 14;
                unidad45 = 15;
                formularioFacturaPTG = 308;
                servicioCilindro = 1;
                gasLPUnidades = 4216;
                idArticuloServicio = 4217;
                envaseCilindro = 5;
                publicoGeneralTXT = "Publico General";
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
                tarjetaCreditoBancomerId = 31;
                tarjetaCreditoHSBCId = 32;
                tarjetaCreditoBanamexId = 33;
                tarjetaDebitoBanamexId = 34;
                tarjetaDebitoBancomerId = 35;
                tarjetaDebitoHSBCId = 36;
            }

            var tipoPagoAFacturar = 0;
            var updOportunidad = {};
            var oporObj = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOportunidad
            });

            var registroPagos = oporObj.getValue("custbody_ptg_registro_pagos");
            var pagoOrdenObj = search.create({
                type: "customrecord_ptg_pagos_oportunidad",
                filters: [["custrecord_ptg_registro_pagos","anyof",registroPagos]],
                columns: [
                    search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                    search.createColumn({name: "custrecord_ptg_total", summary: "SUM", sort: search.Sort.DESC, label: "PTG - Total"})
                ]
            });
            var pagoOrdenObjResult = pagoOrdenObj.run().getRange({
                start: 0,
                end: 2,
            });
            (tipoPagoAFacturar = pagoOrdenObjResult[0].getValue({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}));
            log.audit("tipoPagoAFacturar", tipoPagoAFacturar);
            updOportunidad = {
                custbody_forma_pago_facturar: tipoPagoAFacturar
            }
            var updtOportunidad = record.submitFields({
                id: idOportunidad,
                type: record.Type.OPPORTUNITY,
                values: updOportunidad
            });
            log.audit("updtOportunidad", updtOportunidad);


            var oportunidadObj = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOportunidad
            });
            var solicitaFactura = oportunidadObj.getValue("custbody_ptg_cliente_solicita_factura");
            var numViaje = oportunidadObj.getValue('custbody_ptg_numero_viaje');
            var opcionPagoObj = oportunidadObj.getValue("custbody_ptg_opcion_pago_obj");
            var tipoPago = oportunidadObj.getValue("custbody_forma_pago_facturar");
            var idRegistroPagos = oportunidadObj.getValue("custbody_ptg_registro_pagos");
            var subsidiariaOportunidad = oportunidadObj.getValue("subsidiary");
            var cliente = oportunidadObj.getValue("entity");
            var razonSocial = oportunidadObj.getValue("custbody_razon_social_para_facturar");
            var nombreClienteAFacturar = "";
            var zonaPrecioID = oportunidadObj.getValue("custbody_ptg_zonadeprecioop_");
            var zonaPrecioObj = record.load({
                type: "customrecord_ptg_zonasdeprecio_",
                id: zonaPrecioID,
            });
            var precioPorLitro = zonaPrecioObj.getValue("custrecord_ptg_precio_");
            var clienteObj = record.load({
                type: search.Type.CUSTOMER,
                id: cliente
            });
            var clienteAFacturar = clienteObj.getValue("custentity_razon_social_para_facturar");
            nombreClienteAFacturar = clienteAFacturar;
            

            var rutaObj = record.load({
                type: "customrecord_ptg_tabladeviaje_enc2_",
                id: numViaje
            });
            var ruta = rutaObj.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
  
            var ubicacionObj = record.load({
                type: "customrecord_ptg_equipos",
                id: ruta
            });
            var ubicacion = ubicacionObj.getValue("custrecord_ptg_ubicacionruta_");

            var articuloArray = [];
            var cantidadArray = [];
            var cantidadArrayPF = [];
            var cantidadArrayFin = [];
            var unidadArray = [];
            var rateArray = [];
            var cantidadEnLitros = [];
            var amountArray = [];
            var totalKilos = 0;
            var lineasSinArticulos = 0;
            var cfdiCliente = 0;
            var lineasArticulos = oportunidadObj.getLineCount({sublistId: "item"});
            for (var t = 0; t < lineasArticulos; t++){
                articuloArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "item",
                    line: t,
                });
    
                cantidadArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: t,
                });

                cantidadArrayPF[t] = parseFloat(cantidadArray[t]);

                cantidadArrayFin[t] = cantidadArrayPF[t] * -1;

                rateArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "rate",
                    line: t,
                });
                
                

                if(articuloArray[t] != idArticuloServicio){
                    var itemCilObj = record.load({
                        type: search.Type.INVENTORY_ITEM,
                        id: articuloArray[t],
                    });
                    var tipoArticulo = itemCilObj.getValue("custitem_ptg_tipodearticulo_");
                    log.audit("tipoArticulo", tipoArticulo);

                    if(tipoArticulo != envaseCilindro){
                        lineasSinArticulos += 1;
                        var itemCilObj = record.load({
                            type: search.Type.INVENTORY_ITEM,
                            id: articuloArray[t],
                        });
                        var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
                        log.emergency("capacidadArticulo", capacidadArticulo);
                        if(capacidadArticulo == 10){
                            unidadArray[t] = unidad10;
                        } else if(capacidadArticulo == 20){
                            unidadArray[t] = unidad20;
                        } else if(capacidadArticulo == 30){
                            unidadArray[t] = unidad30;
                        }  else if(capacidadArticulo == 45){
                            unidadArray[t] = unidad45;
                        }
                        articuloArray[t] = gasLPUnidades;
                        log.audit("unidad: L:" + t, unidadArray[t]);
                        totalKilos = capacidadArticulo * cantidadArray[t];
                        log.audit("totalKilos", totalKilos);
                        cantidadEnLitros[t] = totalKilos / 0.54;
    
                        amountArray[t] = oportunidadObj.getSublistValue({
                            sublistId: "item",
                            fieldId: "amount",
                            line: t,
                        });
                        log.audit("amountArray[t]", amountArray[t]);
                    }                    
                }
            }

            if(tipoPago == consumoInternoId){

                var inventoryAdjustment = record.create({
                    type: record.Type.INVENTORY_ADJUSTMENT,
                    isDynamic: true,
                });
                inventoryAdjustment.setValue("subsidiary", subsidiariaOportunidad);
                inventoryAdjustment.setValue("account", cuentaAjusteInventario);
                for(var u = 0; u < lineasArticulos; u++){
                    inventoryAdjustment.selectLine("inventory", u);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "item", gasLPUnidades);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "location", ubicacion);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "units", unidadArray[u]);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArrayFin[u]);
                    inventoryAdjustment.commitLine("inventory");
                }
                var idInventoryAdjustment = inventoryAdjustment.save();
                log.debug({
                    title: "Ajuste de Inventario",
                    details: "Id Saved: " + idInventoryAdjustment,
                });


            } else{

            var facturaObj = record.transform({
                fromType: record.Type.OPPORTUNITY,
                fromId: idOportunidad,
                toType: record.Type.INVOICE,
                isDynamic: false
            });

            facturaObj.setValue("customform", formularioFacturaPTG);
            if(!solicitaFactura){
                facturaObj.setValue("entity", publicoGeneral);
                cfdiCliente = 3;
                log.audit("cfdiCliente NO solicita", cfdiCliente);
                nombreClienteAFacturar = publicoGeneralTXT;
            } else {
                var entityObj = record.load({
                    type: search.Type.CUSTOMER,
                    id: cliente,
                });
                log.audit("entityObj", entityObj);

                cfdiCliente = entityObj.getValue("custentity_disa_uso_de_cfdi_") || 3;
                log.audit("cfdiCliente solicita", cfdiCliente);
            }

            facturaObj.setValue("custbody_ptg_registro_pre_liq", objValue3);
            facturaObj.setValue("location", ubicacion);
            facturaObj.setValue("custbody_ptg_tipo_servicio", servicioCilindro);
            facturaObj.setValue("custbody_ptg_opcion_pago_obj", opcionPagoObj);
            facturaObj.setValue("custbody_ptg_nombre_cliente", cliente);
            facturaObj.setValue("custbody_psg_ei_status", 3); //ESTADO DEL DOCUMENTO ELECTRÓNICO
            //facturaObj.setValue("custbody_psg_ei_template", 123); //PLANTILLA DEL DOCUMENTO ELECTRÓNICO
            //facturaObj.setValue("custbody_psg_ei_sending_method", 11); //MÉTODO DE ENVÍO DE DOCUMENTOS ELECTRÓNICOS
            facturaObj.setValue("custbody_mx_cfdi_usage", cfdiCliente);
            facturaObj.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);

            var formaPagoSAT = searchFormaPagoSAT(subsidiariaOportunidad, tipoPago);
            log.emergency("formaPagoSAT", formaPagoSAT);

            facturaObj.setValue("custbody_mx_txn_sat_payment_method", formaPagoSAT);

            if(tipoPago == efectivoId){ //EFECTIVO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 1); //01 - Efectivo
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            } 
            else if(tipoPago == prepagoBanorteId || tipoPago == prepagoTransferenciaId || tipoPago == prepagoBancomerId || tipoPago == prepagoHSBCId || tipoPago == prepagoBanamexId || tipoPago == prepagoSantanderId || tipoPago == prepagoScotianId){ //PREPAGO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == cortesiaId){ //CORTESIA
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == tarjetaCreditoId || tipoPago == tarjetaCreditoBancomerId || tipoPago == tarjetaCreditoHSBCId || tipoPago == tarjetaCreditoBanamexId){ //TARJETA CREDITO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 4); //04 - Tarjeta de Crédito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == tarjetaDebitoId || tipoPago == tarjetaDebitoBanamexId || tipoPago == tarjetaDebitoBancomerId || tipoPago == tarjetaDebitoHSBCId){ //TARJETA DEBITO
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            } 
            else if(tipoPago == creditoClienteId){ //CREDITO CLIENTE
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }
            else if(tipoPago == reposicionId){ //REPOSICION
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == bonificacionId){ //BONIFICACION
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
            }
            else if(tipoPago == chequeBancomerId || tipoPago == chequeSantanderId || tipoPago == chequeScotianId || tipoPago == chequeHSBCId || tipoPago == chequeBanamexId || tipoPago == chequeBanorteId){ //CHEQUE
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 2); //02 - CHEQUE NOMINATIVO
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
                }
            else {
                //facturaObj.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                facturaObj.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
            }

            var itemCount = facturaObj.getLineCount('item');
            log.audit("itemCount", itemCount);

            /*for (var i = 0; i < itemCount; i++) {               
                facturaObj.setSublistValue('item', 'item', i, articuloArray[i]);  
                facturaObj.setSublistValue('item', 'price', i, -1);
                facturaObj.setSublistValue('item', 'units', i, unidadArray[i]);
                facturaObj.setSublistValue('item', 'rate', i, rateArray[i]);
                facturaObj.setSublistValue('item', 'location', i, ubicacion);
            }*/

            for (var i = 0; i < itemCount; i++) {
                if(articuloArray[i] == gasLPUnidades){
                    facturaObj.setSublistValue('item', 'item', i, articuloArray[i]);  
                    facturaObj.setSublistValue('item', 'price', i, -1);
                    facturaObj.setSublistValue('item', 'units', i, unidadArray[i]);
                    facturaObj.setSublistValue('item', 'rate', i, rateArray[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_cantidad_litros", i, cantidadEnLitros[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_precio_unitario", i, precioPorLitro);
                } else {
                    facturaObj.setSublistValue("item", "item", i, articuloArray[i]);
                    facturaObj.setSublistValue("item", "rate", i, rateArray[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_cantidad_litros", i, cantidadArray[i]);
                    facturaObj.setSublistValue("item", "custcol_ptg_precio_unitario", i, rateArray[i]);
                }
                facturaObj.setSublistValue("item", "location", i, ubicacion);
            }

            var recObjID = facturaObj.save({
                ignoreMandatoryFields: true
            });
            log.debug("Factura Creada", recObjID);

            var objPagosUpdate = {
                custrecord_ptg_factura_pagos: recObjID,
            }

            record.submitFields({
                id: idRegistroPagos,
                type: "customrecord_ptg_pagos",
                values: objPagosUpdate,
            });


            //SE HACE EL PROCESO DE GENERAR DOCUMENTO Y TIMBRADO
            var urlStlt = url.resolveScript({
                scriptId: "customscript_drt_ei_auto_stlt",
                deploymentId: "customdeploy_drt_global_invoice_suitelet",
                returnExternalUrl: true,
                params: {
                    id_factura: recObjID
                }
            });
            log.audit("urlStlt", urlStlt);

            var link = https.get({
                url: urlStlt
            });

        }

            context.write({
                key: recObjID,
                value: recObjID
            });
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
            objUpdate.custrecord_ptg_error_cilindro = error.message || '';
        } finally {
        submitField("customrecord_ptg_preliquicilndros_", objValue3, objUpdate);
    }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idFactura = JSON.parse(context.key);

            var idFacturaPI = parseInt(idFactura);
            log.debug("idFacturaPI", idFacturaPI);

            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_oportunidad_a_factura'
            }) || '';

            var objUpdate = {
                custrecord_ptg_terminado_cilindros: false,
                custrecord_ptg_error_cilindro: '',
            };

            var articuloServicio = 0;
            var efectivoId = 0;
            var prepagoBanorteId = 0;
            var valeId = 0;
            var cortesiaId = 0;
            var tarjetaCreditoId = 0;
            var tarjetaDebitoId = 0;
            var multipleId = 0;
            var prepagoTransferenciaId = 0;
            var creditoClienteId = 0;
            var reposicionId = 0;
            var saldoAFavorId = 0;
            var consumoInternoId = 0;
            var prepagoBancomerId = 0;
            var prepagoHSBCId = 0;
            var prepagoBanamexId = 0;
            var prepagoSantanderId = 0;
            var prepagoScotianId = 0;
            var bonificacionId = 0;
            var ticketCardId = 0;
            var chequeBancomerId = 0;
            var recirculacionId = 0;
            var canceladoId = 0;
            var rellenoId = 0;
            var transferenciaId = 0;
            var traspasoId = 0;
            var chequeSantanderId = 0;
            var chequeScotianId = 0;
            var chequeHSBCId = 0;
            var chequeBanamexId = 0;
            var chequeBanorteId = 0;
            var tarjetaCreditoBancomerId = 0;
            var tarjetaCreditoHSBCId = 0;
            var tarjetaCreditoBanamexId = 0;
            var tarjetaDebitoBanamexId = 0;
            var tarjetaDebitoBancomerId = 0;
            var tarjetaDebitoHSBCId = 0;
            

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                articuloServicio = 4832;
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                articuloServicio = 4218;
                efectivoId = 1;
                prepagoBanorteId = 2;
                valeId = 3;
                cortesiaId = 4;
                tarjetaCreditoId = 5;
                tarjetaDebitoId = 6;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                creditoClienteId = 9;
                reposicionId = 10;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                bonificacionId = 18;
                ticketCardId = 19;
                chequeBancomerId = 20;
                recirculacionId = 21;
                canceladoId = 22;
                rellenoId = 23;
                transferenciaId = 24;
                traspasoId = 25;
                chequeSantanderId = 26;
                chequeScotianId = 27;
                chequeHSBCId = 28;
                chequeBanamexId = 29;
                chequeBanorteId = 30;
                tarjetaCreditoBancomerId = 31;
                tarjetaCreditoHSBCId = 32;
                tarjetaCreditoBanamexId = 33;
                tarjetaDebitoBanamexId = 34;
                tarjetaDebitoBancomerId = 35;
                tarjetaDebitoHSBCId = 36;
            }

            if(idFacturaPI){

            var invoiceObj = record.load({
                type: record.Type.INVOICE,
                id: idFactura,
            });

            var tipoPagoObj = invoiceObj.getValue("custbody_ptg_opcion_pago_obj");
            var cliente = invoiceObj.getValue("entity");
            var subsidiaria = invoiceObj.getValue("subsidiary");
            var ubicacion = invoiceObj.getValue("location");
            var clientePrepago = invoiceObj.getValue("custbody_ptg_nombre_cliente");
            var importeAdeudadoFactura = invoiceObj.getValue("amountremainingtotalbox");
            var idOportunidadFactura = invoiceObj.getValue("opportunity");
            var objValue = JSON.parse(tipoPagoObj);
            var objValue2 = objValue;
            var objValue3 = objValue2.pago;
            var objCount = objValue3.length;
            var objValueTipoPago = invoiceObj.getValue("custbody_forma_pago_facturar");

            //if (objValueTipoPago != prepagoBanorteId && objValueTipoPago != cortesiaId && objValueTipoPago != prepagoTransferenciaId && objValueTipoPago != creditoClienteId && objValueTipoPago != reposicionId && objValueTipoPago != consumoInternoId && objValueTipoPago != prepagoBancomerId && objValueTipoPago != prepagoHSBCId && objValueTipoPago != prepagoBanamexId && objValueTipoPago != prepagoSantanderId && objValueTipoPago != prepagoScotianId && objValueTipoPago != bonificacionId){
            if(objValueTipoPago == efectivoId || objValueTipoPago == tarjetaCreditoId || objValueTipoPago == tarjetaDebitoId || objValueTipoPago == chequeBancomerId || objValueTipoPago == chequeSantanderId || objValueTipoPago == chequeScotianId || objValueTipoPago == chequeHSBCId || objValueTipoPago == chequeBanamexId || objValueTipoPago == chequeBanorteId || objValueTipoPago == tarjetaCreditoBancomerId || objValueTipoPago == tarjetaCreditoHSBCId || objValueTipoPago == tarjetaCreditoBanamexId || objValueTipoPago == tarjetaDebitoBanamexId || objValueTipoPago == tarjetaDebitoBancomerId || objValueTipoPago == tarjetaDebitoHSBCId){
                log.audit("UN PAGO, EFECTIVO ó TARJETA DE CREDITO ó TARJETA DE DEBITO ó CHEQUE");
                //log.audit("UN PAGO diferente de credito, cortesia, prepago");
                var pagoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: false
                });

                var cuenta = searchCuenta(subsidiaria, objValueTipoPago);
                log.emergency("cuenta 420", cuenta);

                pagoObj.setValue("account", cuenta);
    
                var pagoObjID = pagoObj.save({
                    ignoreMandatoryFields: true
                });
                log.emergency("Pago Creado con: "+objValueTipoPago, pagoObjID);
            }

            else if (objValueTipoPago == prepagoBanorteId || objValueTipoPago == prepagoTransferenciaId || objValueTipoPago == prepagoBancomerId || objValueTipoPago == prepagoHSBCId || objValueTipoPago == prepagoBanamexId || objValueTipoPago == prepagoSantanderId || objValueTipoPago == prepagoScotianId){
                log.emergency("UN PAGO Prepago");
                //SS: PTG - Registro de Oportunidad Prepago SS
                var recOportunidadPrepago= search.create({
                    type: "customrecord_ptg_registrooportunidad_",
                    filters: [
                       ["custrecord_ptg_oportunidad_","anyof",idOportunidadFactura], "AND", 
                       ["custrecord_ptg_optpreliq_","anyof",id_search], "AND", 
                       ["custrecord_ptg_cliente_reg_oport","anyof",clientePrepago]
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_prepago_reg_oport", label: "PTG - Prepago"}),
                       search.createColumn({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_REG_OPORT", label: "Cuenta (principal)"})
                    ]
                });
                var prepagoObjResult = recOportunidadPrepago.run().getRange({
                    start: 0,
                    end: 3,
                });
                log.emergency("recOportunidadPrepago", recOportunidadPrepago);
                log.emergency("prepagoObjResult", prepagoObjResult);

                idPagoPrepago = prepagoObjResult[0].getValue({name: "custrecord_ptg_prepago_reg_oport", label: "PTG - Prepago"});
                log.emergency("idPagoPrepago", idPagoPrepago);
                idCuenta = prepagoObjResult[0].getValue({name: "accountmain", join: "CUSTRECORD_PTG_PREPAGO_REG_OPORT", label: "Cuenta (principal)"});
                log.emergency("idCuenta", idCuenta);
                if(idPagoPrepago){
                    var rec = record.load({
                        type: record.Type.CUSTOMER_PAYMENT,
                        id: idPagoPrepago,
                        isDynamic: true,
                    });
                    rec.setValue("customer", cliente);
                    rec.setValue("account", idCuenta);


                    var lineCount = rec.getLineCount('apply');
                    log.emergency("lineCount apply prepago", lineCount);

                    for (var k = 0; k < lineCount; k++){
                        rec.selectLine({
                            sublistId: 'apply',
                            line: k
                        });
                        var factura = rec.getCurrentSublistValue({
                            sublistId: 'apply',
                            fieldId: 'internalid',
                        });
                        if (factura == idFactura){
                            rec.setCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'apply',
                                value: true
                            });
                        }
                    }
                    var recIdPago = rec.save();
                    log.emergency({
                        title: "Record updated successfully",
                        details: "Id: " + recIdPago,
                    });
                }

            }
            
            else if (objValueTipoPago == cortesiaId || objValueTipoPago == reposicionId || objValueTipoPago == bonificacionId){
                //Pago con cortesia, reposicion, bonificacion
                var creditMemoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CREDIT_MEMO,
                    isDynamic: false
                });

                if(objValueTipoPago == cortesiaId || objValueTipoPago == bonificacionId){
                    var amountArray = [];
                    var itemCountLine = creditMemoObj.getLineCount('item');
                    log.audit("itemCountLine", itemCountLine);
                    for (var i = 0; i < itemCountLine; i++) {
                        amountArray[i] = creditMemoObj.getSublistValue({
                            sublistId: "item",
                            fieldId: "amount",
                            line: i,
                        });
                        log.audit("amountArray[i]", amountArray[i]);
                    }
                        
                    for (var j = 0; j < itemCountLine; j++) {
                        creditMemoObj.setSublistValue('item', 'item', j, articuloServicio);  
                        creditMemoObj.setSublistValue('item', 'quantity', j, 1);
                        creditMemoObj.setSublistValue('item', 'amount', j, amountArray[j]);
                    }
                }

                var creditMemoID = creditMemoObj.save({
                    ignoreMandatoryFields: true
                });
                log.emergency("Nota de credito Creado con: "+objValueTipoPago, creditMemoID);
            }
        }

            objUpdate.custrecord_ptg_terminado_cilindros = true;
            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
            objUpdate.custrecord_ptg_error_cilindro = error.message || '';
        } finally {
            submitField("customrecord_ptg_preliquicilndros_", id_search, objUpdate);
        }
    }

    function summarize(summary) {

    }

   /* function searchCuenta(idSubsidiaria, idTipoPago) {
      try {
        var cuentaDefault = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
            cuentaDefault = 2786;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            cuentaDefault = 2786;
        }
        //SS: PTG - Mapeo Formas de pago y cuentas SS
        var mapeoCuentaObj = search.create({
          type: "customrecord_mapeo_formasdepago_cuentas",
          filters: [
            ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria],
            "AND",
            ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
          ],
          columns: [
            search.createColumn({
              name: "custrecord_ptg_formadepago_cuenta",
              label: "PTG - Cuenta de banco",
            }),
          ],
        });

        var mapeoCuentaObjCount = mapeoCuentaObj.runPaged().count;
        var mapeoCuentaObjResult = mapeoCuentaObj.run().getRange({
          start: 0,
          end: mapeoCuentaObjCount,
        });
        if (mapeoCuentaObjCount > 0) {
          idCuenta = mapeoCuentaObjResult[0].getValue({
            name: "custrecord_ptg_formadepago_cuenta",
            label: "PTG - Cuenta de banco",
          });
          log.debug("idCuenta", idCuenta);
        } else {
            idCuenta = cuentaDefault;
            log.debug("cuenta no encontrada", idCuenta);
        }

        return idCuenta;
      } catch (error) {
        log.error({
          title: "error searchCuenta",
          details: JSON.stringify(error),
        });
      }
    }*/

    function searchCuenta(idSubsidiaria, idTipoPago) {
        try {
            var cuentaDefault = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                cuentaDefault = 2786;
                subsidiariaCorpoGas = 22;
                subsidiariaDistribuidora = 26;
                subsidiariaSanLuis = 23;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                cuentaDefault = 2786;
                subsidiariaCorpoGas = 22;
                subsidiariaDistribuidora = 26;
                subsidiariaSanLuis = 23;
            }

          //SS: PTG - Mapeo Formas de pago y cuentas SS
          var mapeoCuentaObj = search.create({
            type: "customrecord_mapeo_formasdepago_cuentas",
            filters: [
              ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria], "AND",
              ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
            ],
            columns: [
              search.createColumn({
                name: "custrecord_ptg_formadepago_cuenta",
                label: "PTG - Cuenta de banco",
              }),
            ],
          });
  
          var mapeoCuentaObjCount = mapeoCuentaObj.runPaged().count;
          var mapeoCuentaObjResult = mapeoCuentaObj.run().getRange({
            start: 0,
            end: mapeoCuentaObjCount,
          });
          if (mapeoCuentaObjCount > 0) {
            idCuenta = mapeoCuentaObjResult[0].getValue({
              name: "custrecord_ptg_formadepago_cuenta",
              label: "PTG - Cuenta de banco",
            });
            log.debug("idCuenta", idCuenta);
          } else {
            if(idSubsidiaria == subsidiariaCorpoGas){
                idCuenta = 3153;
            } else if(idSubsidiaria == subsidiariaDistribuidora){
                idCuenta = 2849;
            } else if(idSubsidiaria == subsidiariaSanLuis){
                idCuenta = 3151;
            }
              log.debug("cuenta no encontrada", idCuenta);
          }
  
          return idCuenta;
        } catch (error) {
          log.error({
            title: "error searchCuenta",
            details: JSON.stringify(error),
          });
        }
    }

    function searchFormaPagoSAT(idSubsidiaria, idTipoPago) {
        try {
            var formaDePagoDefault = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                formaDePagoDefault = 28;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                formaDePagoDefault = 28;
            }

            //SS: PTG - Mapeo Formas de pago y cuentas SS
            var mapeoCuentaObj = search.create({
                type: "customrecord_mapeo_formasdepago_cuentas",
                filters: [
                    ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria], "AND",
                    ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
                ],
                columns: [
                    search.createColumn({
                        name: "custrecord_ptg_forma_pago_sat",
                        label: "PTG - FORMA DE PAGO SAT",
                    }),
                ],
            });
  
            var mapeoCuentaObjCount = mapeoCuentaObj.runPaged().count;
            var mapeoCuentaObjResult = mapeoCuentaObj.run().getRange({
                start: 0,
                end: mapeoCuentaObjCount,
            });
            if (mapeoCuentaObjCount > 0) {
                idFormaPago = mapeoCuentaObjResult[0].getValue({
                    name: "custrecord_ptg_forma_pago_sat",
                    label: "PTG - FORMA DE PAGO SAT",
                });
                log.debug("idFormaPago", idFormaPago);
            } else {
                idFormaPago = formaDePagoDefault;
                log.debug("forma de pago no encontrada", idFormaPago);
            }
  
            return idFormaPago;
        } catch (error) {
            log.error({
                title: "error searchFormaPagoSAT",
                details: JSON.stringify(error),
            });
        }
    }


    function submitField(param_type, param_id, param_values) {
        try {
            log.audit({
                title: 'submitField',
                details: " param_type: " + param_type +
                    " param_id: " + param_id +
                    " param_values: " + JSON.stringify(param_values)
            });
            var respuesta = {
                success: false,
                data: '',
                error: []
            };
            if (
                param_type &&
                param_id &&
                Object.keys(param_values).length > 0
            ) {
                respuesta.data = record.submitFields({
                    type: param_type,
                    id: param_id,
                    values: param_values,
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }
                });
            }
            respuesta.success = respuesta.data != '';
        } catch (error) {
            respuesta.error.push(JSON.stringify(error));
            log.error({
                title: 'error submitField',
                details: JSON.stringify(error)
            });
        } finally {
            log.debug({
                title: 'respuesta submitField',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});