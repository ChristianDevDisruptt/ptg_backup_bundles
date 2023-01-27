/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: DRT - Facturacion Venta Anden MR
 * Script id: customscript_drt_ptg_factur_ven_ande_mr
 * Deployment id: customdeploy_drt_ptg_factur_ven_ande_mr
 * Applied to: 
 * File: drt_ptg_liq_venta_anden_factura_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({name: 'custscript_drt_venta_anden_a_facturar'}) || '';
            log.audit("id_search 1", id_search);

            var arrayColumns = [
                search.createColumn({ name: "custrecord_ptg_oportunidad_liq_anden", summary: "GROUP", label: "PTG - Oportunidad"})
            ];

            var arrayFilters = [["custrecord_ptg_relacion_liq_anden","anyof", id_search]];
            
            //BÚSQUEDA GUARDADA: PTG - TOTAL DE VENTAS EN ANDEN A FACTURAR SS
            respuesta = search.create({
                type: 'customrecord_ptg_total_ventas_anden_liq',
                columns: arrayColumns,
                filters: arrayFilters
            });

            var respuestaResultCount = respuesta.runPaged().count;
            log.debug("respuestaResultCount", respuestaResultCount);

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
            var objValues = objValue.values;
            var idOportunidad = objValues["GROUP(custrecord_ptg_oportunidad_liq_anden)"].value;
            log.audit("idOportunidad", idOportunidad);
            var idRgistro = runtime.getCurrentScript().getParameter({name: 'custscript_drt_venta_anden_a_facturar'}) || '';

            var oportunidadObj = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOportunidad
            });
            var solicitaFactura = oportunidadObj.getValue("custbody_ptg_cliente_solicita_factura");
            var opcionPagoObj = oportunidadObj.getValue("custbody_ptg_opcion_pago_obj");
            var registroVentaAnden = oportunidadObj.getValue("custbody_ptg_registro_venta_anden");
            var cliente = oportunidadObj.getValue("entity");
            var subsidiariaOportunidad = oportunidadObj.getValue("subsidiary");
            var tipoPago = oportunidadObj.getValue("custbody_ptg_opcion_pago");
            var tipoPagoAFacturar = oportunidadObj.getValue("custbody_ptg_forma_pago_facturar_anden");
            var razonSocial = oportunidadObj.getValue("custbody_razon_social_para_facturar");
            var nombreClienteAFacturar = "";
            var clienteObj = record.load({
                type: search.Type.CUSTOMER,
                id: cliente
            });
            var clienteAFacturar = clienteObj.getValue("custentity_razon_social_para_facturar");
            nombreClienteAFacturar = clienteAFacturar;

            var articuloArray = [];
            var cantidadArray = [];
            var cantidadArrayPF = [];
            var cantidadArrayFin = [];
            var unidadArray = [];
            var rateArray = [];
            var amountArray = [];
            var costoPromedio = [];
            var gasLPUnidades = 0;
            var cuentaAjusteInventario = 0;
            var ubicacionAnden = 0;
            var cilindrosTransform = false;
            var articuloChatarra = 0;
            var idUbicacionChatarra = 0;
            var idSubsidiariaChatarra = 0;
            var lineasChatarra = 0;
            var publicoGeneral = 0;
            var planta = "";
            var chatarra = false;
            var updtRegistroVenta = {};
            var cfdiCliente = 0;
            var articuloCilindro = 0;
            var efectivoAnden = 0;
            var tarjetaDebitoAnden = 0;
            var tarjetaCreditoAnden = 0;
            var chequeAnden = 0;
            var cortesiaAnden = 0;
            var valesTraspAnden = 0;
            var creditoClienteAnden = 0;
            var recirculacionAnden = 0;
            var unidad10 = 0;
            var unidad20 = 0;
            var unidad30 = 0;
            var unidad45 = 0;
            var publicoGeneralTXT = "";
            var lineasArticulos = oportunidadObj.getLineCount({sublistId: "item"});
            var recVentaAnden = record.load({
                type: "customrecord_ptg_venta_anden",
                id: registroVentaAnden,
            });
            var planta = recVentaAnden.getText("custrecord_ptg_planta_anden");

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                ubicacionAnden = 1142;
                publicoGeneral = 14508;
                articuloCilindro = 1;
                cuentaAjusteInventario = 218;
                gasLPUnidades = 4693;
                articuloChatarra = 4831;
                efectivoAnden = 1;
                tarjetaDebitoAnden = 2;
                tarjetaCreditoAnden = 3;
                chequeAnden = 4;
                cortesiaAnden = 5;
                valesTraspAnden = 6;
                creditoClienteAnden = 7;
                recirculacionAnden = 8;
                unidad10 = 24;
                unidad20 = 25;
                unidad30 = 26;
                unidad45 = 27;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                ubicacionAnden = 1502; //Este es temporal solo es para Rio Verde.
                publicoGeneral = 27041;
                articuloCilindro = 1;
                cuentaAjusteInventario = 218;
                gasLPUnidades = 4216;
                articuloChatarra = 4831;
                efectivoAnden = 1;
                tarjetaDebitoAnden = 2;
                tarjetaCreditoAnden = 3;
                chequeAnden = 4;
                cortesiaAnden = 5;
                valesTraspAnden = 6;
                creditoClienteAnden = 7;
                recirculacionAnden = 8;
                unidad10 = 12;
                unidad20 = 13;
                unidad30 = 14;
                unidad45 = 15;
                publicoGeneralTXT = "Publico General";
            }
            
            for (var t = 0; t < lineasArticulos; t++){
                articuloArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "item",
                    line: t,
                });
                log.audit("articuloArray[t]", articuloArray[t]);
    
                cantidadArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: t,
                });
                log.audit("cantidadArray[t]", cantidadArray[t]);

                cantidadArrayPF[t] = parseFloat(cantidadArray[t]);
                log.audit("cantidadArrayPF[t]", cantidadArrayPF[t]);

                cantidadArrayFin[t] = cantidadArrayPF[t] * -1;
                log.audit("cantidadArrayFin[t]", cantidadArrayFin[t]);

                rateArray[t] = oportunidadObj.getSublistValue({
                    sublistId: "item",
                    fieldId: "rate",
                    line: t,
                });
                log.audit("rateArray[t]", rateArray[t]);

                var itemCilObj = record.load({
                    type: search.Type.INVENTORY_ITEM,
                    id: articuloArray[t],
                });
                var tipoArticulo = itemCilObj.getValue("custitem_ptg_tipodearticulo_");
                log.audit("tipoArticulo", tipoArticulo);
                costoPromedio[t] = itemCilObj.getValue("averagecost");
                log.audit("costoPromedio[t]", costoPromedio[t]);
                if(tipoArticulo == articuloCilindro && articuloArray[t] != articuloChatarra){
                    cilindrosTransform = true;
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
                    log.audit("unidad: L:" + t, unidadArray[t]);

                    amountArray[t] = oportunidadObj.getSublistValue({
                        sublistId: "item",
                        fieldId: "amount",
                        line: t,
                    });
                    log.audit("amountArray[t]", amountArray[t]);
                }
                if(articuloArray[t] == articuloChatarra){
                    lineasChatarra += 1;
                    chatarra = true;
                }
                log.emergency("articuloArray[t]", articuloArray[t]);
            }

            //Búsqueda Guardada: PTG - Ubicación Chatarra
            var locationObj = search.create({
                type: "location",
                filters: [
                   ["custrecord_ptg_chatarra","is","T"], "AND", 
                   ["name","contains", planta]
                ],
                columns: [
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({name: "subsidiary", label: "Subsidiaria"})
                ]
            });
            var locationObjResult = locationObj.run().getRange({
                start: 0,
                end: 2,
            });
            (idUbicacionChatarra = locationObjResult[0].getValue({name: "internalid", label: "ID interno"}));

            var ubicacionObj = record.load({
                type: search.Type.LOCATION,
                id: idUbicacionChatarra,
            });
            var idSubsidiariaChatarra = ubicacionObj.getValue("subsidiary");

            if(chatarra){
                var inventoryAdjustment = record.create({
                    type: record.Type.INVENTORY_ADJUSTMENT,
                    isDynamic: true,
                });
                inventoryAdjustment.setValue("subsidiary", idSubsidiariaChatarra);
                inventoryAdjustment.setValue("account", cuentaAjusteInventario);
                for(var u = 0; u < lineasChatarra; u++){
                    inventoryAdjustment.selectLine("inventory", u);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "item", articuloChatarra);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "location", idUbicacionChatarra);
                    inventoryAdjustment.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArray[u]);
                    inventoryAdjustment.commitLine("inventory");
                }
                var idinventoryAdjustment = inventoryAdjustment.save();
                log.debug({
                    title: "TRANSACCION CREADA Ajuste de Inventario",
                    details: "Id Saved: " + idinventoryAdjustment,
                });

                var recTransaccion = record.create({
                    type: "customrecord_ptg_registro_transaccion",
                    isDynamic: true,
                });

                recTransaccion.setValue("custrecord_ptg_transaccion_rec_tran", idinventoryAdjustment);
                recTransaccion.setValue("custrecord_ptg_venta_anden_rec_tran", idRgistro);

                var idRecTransaccion = recTransaccion.save();
                log.debug({
                    title: "REGISTRO TRANSACCION CREADO",
                    details: "Id Saved: " + idRecTransaccion,
                });

                if(recTransaccion){
                    updtRegistroVenta.custrecord_ptg_venta_liquidada_venta_and = true;
                }

            }

            if(tipoPagoAFacturar != recirculacionAnden){

                var recordFactura = record.transform({
                    fromType: record.Type.OPPORTUNITY,
                    fromId: idOportunidad,
                    toType: record.Type.INVOICE,
                    isDynamic: true,
                });

                if(!solicitaFactura){
                    recordFactura.setValue("entity", publicoGeneral);
                    cfdiCliente = 3;
                    log.audit("cfdiCliente NO solicita", cfdiCliente);
                    nombreClienteAFacturar = publicoGeneralTXT;
                }  else {
                    var entityObj = record.load({
                        type: search.Type.CUSTOMER,
                        id: cliente,
                    });
                    log.audit("entityObj", entityObj);
    
                    cfdiCliente = entityObj.getValue("custentity_disa_uso_de_cfdi_") || 3;
                    log.audit("cfdiCliente solicita", cfdiCliente);
                }
    
                recordFactura.setValue("location", ubicacionAnden);
                recordFactura.setValue("custbody_ptg_registro_liq_venta_anden", idRgistro);
                recordFactura.setValue("custbody_mx_cfdi_usage", cfdiCliente);
                recordFactura.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);

                var formaPagoSAT = searchFormaPagoSAT(idSubsidiariaChatarra, tipoPagoAFacturar);
                log.emergency("formaPagoSAT", formaPagoSAT);

                recordFactura.setValue("custbody_mx_txn_sat_payment_method", formaPagoSAT);

                if(tipoPagoAFacturar == efectivoAnden){ //EFECTIVO
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 1); //01 - Efectivo
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
                }
                else if(tipoPagoAFacturar == tarjetaDebitoAnden){ //DEBITO
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
                } 
                else if(tipoPagoAFacturar == tarjetaCreditoAnden){ //TARJETA CREDITO
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 4); //04 - Tarjeta de Crédito
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
                }
                else if(tipoPagoAFacturar == chequeAnden){ //CHEQUE
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 2); //02 - CHEQUE NOMINATIVO
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
                }
                else if(tipoPagoAFacturar == cortesiaAnden){ //CORTESIA
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
                }
                else if(tipoPagoAFacturar == valesTraspAnden){ //VALES TRASP
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
                }
                else if(tipoPagoAFacturar == creditoClienteAnden){ //CREDITO
                    //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
                    recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
                }

                for(var d = 0; d < lineasArticulos; d++){
                    recordFactura.removeLine({
                        sublistId: 'item',
                        line: 0,
                        ignoreRecalc: true
                    });
                }
    
                var x = 0;
    
                for (var j = 0; j < lineasArticulos; j++) {
                    if(articuloArray[j] != articuloChatarra){
                        recordFactura.selectLine("item", x);
                        if(cilindrosTransform){
                            recordFactura.setCurrentSublistValue("item", "item", gasLPUnidades);
                            recordFactura.setCurrentSublistValue("item", "units", unidadArray[j]);
                            recordFactura.setCurrentSublistValue("item", "rate", amountArray[j]);
                        } else {
                            recordFactura.setCurrentSublistValue("item", "item", articuloArray[j]);
                            recordFactura.setCurrentSublistValue("item", "quantity", cantidadArray[j]);
                            recordFactura.setCurrentSublistValue("item", "rate", rateArray[j]);
                        }
                        recordFactura.setCurrentSublistValue("item", "custcol_ptg_cantidad_litros", cantidadArray[j]);
                        recordFactura.setCurrentSublistValue("item", "custcol_ptg_precio_unitario", rateArray[j]);
                        recordFactura.setCurrentSublistValue("item", "location", ubicacionAnden);
                        recordFactura.commitLine("item");
                        x += 1;
                    }
                }

          
                var idRecordFactura = recordFactura.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }) || '';
    
                log.debug({
                    title: "Factura Creada",
                    details: "Id Saved: " + idRecordFactura,
                });

                if(idRecordFactura){
                    updtRegistroVenta.custrecord_ptg_venta_liquidada_venta_and = true;
                }
    
                //SE HACE EL PROCESO DE GENERAR DOCUMENTO Y TIMBRADO
                var urlStlt = url.resolveScript({
                    scriptId: "customscript_drt_ei_auto_stlt",
                    deploymentId: "customdeploy_drt_global_invoice_suitelet",
                    returnExternalUrl: true,
                    params: {
                        id_factura: idRecordFactura
                    }
                });
                log.audit("urlStlt", urlStlt);
    
                var link = https.get({
                    url: urlStlt
                });
    
            } else {
                updtRegistroVenta.custrecord_ptg_venta_liquidada_venta_and = true;
            }

            var registro = record.submitFields({
                type: "customrecord_ptg_venta_anden",
                id: registroVentaAnden,
                values: updtRegistroVenta
            });

            log.audit("Actualiza venta", registro);
    
            context.write({
                key: idRecordFactura,
                value: idRecordFactura
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
            var idFactura = JSON.parse(context.key);
            log.audit("idFactura", idFactura);

            var facturaObj = record.load({
                type: search.Type.INVOICE,
                id: idFactura,
            });
            var objTipoPago = 0;
            var cantidadCMArray = [];
            var rateCMArray = [];
            var articuloBonificacion = 0;
            var efectivoAnden = 0;
            var tarjetaDebitoAnden = 0;
            var tarjetaCreditoAnden = 0;
            var chequeAnden = 0;
            var cortesiaAnden = 0;
            var valesTraspAnden = 0;
            var creditoClienteAnden = 0;
            var recirculacionAnden = 0;
            var efectivoPago = 0;
            var valePago = 0;
            var cortesiaPago = 0;
            var tarjetaCreditoPago = 0;
            var tarjetaDebitoPago = 0;
            var creditoClientePago = 0;
            var recirculacionPago = 0;
            var chequeBanamexPago = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                efectivoAnden = 1;
                tarjetaDebitoAnden = 2;
                tarjetaCreditoAnden = 3;
                chequeAnden = 4;
                cortesiaAnden = 5;
                valesTraspAnden = 6;
                creditoClienteAnden = 7;
                recirculacionAnden = 8;
                efectivoPago = 1;
                valePago = 3;
                cortesiaPago = 4;
                tarjetaCreditoPago = 5;
                tarjetaDebitoPago = 6;
                creditoClientePago = 9;
                recirculacionPago = 21;
                chequeBanamexPago = 29;
                articuloBonificacion = 4832;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                efectivoAnden = 1;
                tarjetaDebitoAnden = 2;
                tarjetaCreditoAnden = 3;
                chequeAnden = 4;
                cortesiaAnden = 5;
                valesTraspAnden = 6;
                creditoClienteAnden = 7;
                recirculacionAnden = 8;
                efectivoPago = 1;
                valePago = 3;
                cortesiaPago = 4;
                tarjetaCreditoPago = 5;
                tarjetaDebitoPago = 6;
                creditoClientePago = 9;
                recirculacionPago = 21;
                chequeBanamexPago = 29;
                articuloBonificacion = 4218;
            }

            var formaPagoFacturar = facturaObj.getValue("custbody_ptg_forma_pago_facturar_anden");
            var subsidiaria = facturaObj.getValue("subsidiary");
            if(formaPagoFacturar == efectivoAnden){
                objTipoPago = efectivoPago;
            } else if(formaPagoFacturar == tarjetaDebitoAnden){
                objTipoPago = tarjetaDebitoPago;
            } else if(formaPagoFacturar == tarjetaCreditoAnden){
                objTipoPago = tarjetaCreditoPago;
            } else if(formaPagoFacturar == chequeAnden){
                objTipoPago = chequeBanamexPago;
            } else if(formaPagoFacturar == cortesiaAnden){
                objTipoPago = cortesiaPago;
            } else if(formaPagoFacturar == valesTraspAnden){
                objTipoPago = valePago;
            } else if(formaPagoFacturar == creditoClienteAnden){
                objTipoPago = creditoClientePago;
            } else if(formaPagoFacturar == recirculacionAnden){
                objTipoPago = recirculacionPago;
            }

            if (formaPagoFacturar == efectivoAnden || formaPagoFacturar == tarjetaDebitoAnden || formaPagoFacturar == tarjetaCreditoAnden || formaPagoFacturar == chequeAnden){
                var pagoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: false
                });

                var cuenta = searchCuenta(subsidiaria, objTipoPago);
                log.emergency("cuenta 631", cuenta);
    
                var pagoObjID = pagoObj.save({
                    ignoreMandatoryFields: true
                });
                log.debug("Pago Creado con: "+formaPagoFacturar, pagoObjID);
            }
            else if (formaPagoFacturar == cortesiaAnden){
                var creditMemoObj = record.transform({
                    fromType: record.Type.INVOICE,
                    fromId: idFactura,
                    toType: record.Type.CREDIT_MEMO,
                    isDynamic: false
                });

                var cuenta = searchCuenta(subsidiaria, objTipoPago);
                log.emergency("cuenta 631", cuenta);

                var lineasArticulos = creditMemoObj.getLineCount({sublistId: "item"});

                for (var t = 0; t < lineasArticulos; t++){
                    cantidadCMArray[t] = creditMemoObj.getSublistValue({
                        sublistId: "item",
                        fieldId: "quantity",
                        line: t,
                    });
                    log.audit("cantidadCMArray[t]", cantidadCMArray[t]);
    
                    rateCMArray[t] = creditMemoObj.getSublistValue({
                        sublistId: "item",
                        fieldId: "rate",
                        line: t,
                    });
                    log.audit("rateCMArray[t]", rateCMArray[t]);
                }

                for (var i = 0; i < lineasArticulos; i++) {
                    creditMemoObj.setSublistValue("item", "item", i, articuloBonificacion);
                    creditMemoObj.setSublistValue("item", "quantity", i, cantidadCMArray[i]);
                    creditMemoObj.setSublistValue("item", "rate", i, rateCMArray[i]);
                }

                var creditMemoID = creditMemoObj.save({
                    ignoreMandatoryFields: true
                });
                log.debug("Nota de credito Creado con: "+formaPagoFacturar, creditMemoID);
            }            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
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
                    ["custrecord_ptg_formadepago_subsidiaria", "anyof", idSubsidiaria], "AND",
                    ["custrecord_ptg_forma_pago", "anyof", idTipoPago],
                ],
                columns: [
                    search.createColumn({name: "custrecord_ptg_formadepago_cuenta", label: "PTG - Cuenta de banco",}),
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



    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});