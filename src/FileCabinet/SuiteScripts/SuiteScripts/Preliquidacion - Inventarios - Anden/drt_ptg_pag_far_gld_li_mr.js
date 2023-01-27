/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Pagos Farmacias Guadalajara Lin MR
 * Script id: customscript_drt_ptg_pag_far_gld_li_mr
 * Deployment id: customdeploy_drt_ptg_pag_far_gld_li_mr
 * Applied to: 
 * File: drt_ptg_pag_far_gld_li_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https', 'N/format'], function (runtime, search, record, email, error, url, https, format) {

    function getInputData() {
        try {

            var estatus = {};

            estatus.custrecord_ptg_procesando_pagos_farm_gld = true;
            estatus.custrecord_ptg_terminado_pagos_farm_gld = false;

            var respuesta = '';

            var idRegistro = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_registro_pag_far'
            }) || '';
            log.debug("idRegistro", idRegistro);
             
            var arrayColumns = [
                search.createColumn({name: "custrecord_ptg_no_contrato_farm_gdl_l", label: "PTG - No Contrato con digito verificador"}),
                search.createColumn({name: "custrecord_ptg_ref_pago_farm_gdl_l", label: "PTG - Referencia de pago"}),
                search.createColumn({name: "custrecord_ptg_fecha_pago_farm_gdl_l", label: "PTG - Fecha del Pago"}),
                search.createColumn({name: "custrecord_ptg_importe_pago_farm_gdl_l", label: "PTG - Importe de Pago"})
            ];

            var arrayFilters = [
                ["custrecord_ptg_pagos_farmacias_gdl_paren","anyof",idRegistro], "AND", 
                [["custrecord_ptg_cliente_farm_gdl_l","anyof","@NONE@"],"OR",
                ["custrecord_ptg_pago_farm_gdl_l","anyof","@NONE@"]]
             ],

            //BÚSQUEDA GUARDADA: PTG - Pagos Farmacias Guadalajara Lineas Pendientes SS
            respuesta = search.create({
                type: 'customrecord_ptg_pagos_farmacias_gdl_lin',
                columns: arrayColumns,
                filters: arrayFilters
            });


        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
            estatus.custrecord_ptg_procesando_pagos_farm_gld = false;
            estatus.custrecord_ptg_terminado_pagos_farm_gld = false;

        } finally {
            var registroCabecera = record.submitFields({
                type: "customrecord_ptg_pagos_farmacias_gdl",
                id: idRegistro,
                values: estatus
            });

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
            var idRegistroCab = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_registro_pag_far'
            }) || '';
            log.debug("idRegistroCab", idRegistroCab);

            var estatus = {};

            var objValue = JSON.parse(context.value);
            var idRegistro = objValue.id;
            var idFacturaArray = [];
            var amountArrayOld = [];
            var amountArrayNew = [];
            var contratoCliente = objValue.values["custrecord_ptg_no_contrato_farm_gdl_l"];
            var referencia = objValue.values["custrecord_ptg_ref_pago_farm_gdl_l"];
            var fecha = objValue.values["custrecord_ptg_fecha_pago_farm_gdl_l"];
            var importe = objValue.values["custrecord_ptg_importe_pago_farm_gdl_l"];
            var nota = ""+referencia+" referencia del pago en Farmacias Guadalajara.";
            var numeroContratoCliente = contratoCliente.slice(0, -1);
            var digitoVerificadorCliente = contratoCliente.slice(-1);
            var facturaAplicada = 0;
            log.debug("contratoCliente", contratoCliente);
            log.debug("numeroContratoCliente", numeroContratoCliente);
            log.debug("digitoVerificadorCliente", digitoVerificadorCliente);
            log.debug("referencia", referencia);
            log.debug("nota", nota);
            log.debug("importe", importe);
            var fechaPSS = fecha.split(" ").join("");
            var clienteNoIdentificado = 0;
            var cuenta = 0;
            var formularioPago = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
                clienteNoIdentificado = 322141;
                cuenta = 2809;
                formularioPago = 70;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                clienteNoIdentificado = 27042;
                cuenta = 2809;
                formularioPago = 296;
            }

            var formatof = fechaPSS.substring(0, 2) + '/' + fechaPSS.substring(3, 4) + '/' + fechaPSS.substring(5, 10);

            var fechaX = format.parse({
                value: fechaPSS.substring(0, 2) + '/' + fechaPSS.substring(3, 4) + '/' + fechaPSS.substring(5, 10),
                type: format.Type.DATE
            });

            var objUpdate = {};

            //Búsqueda Guardada: PTG - Pagos Farmacias GDL SS
            var customerSearchObj = search.create({
                type: "customer",
                filters: [["address.custrecord_ptg_numero_contrato", "is", numeroContratoCliente], "AND", 
                ["address.custrecord_ptg_digito_verificador","equalto", digitoVerificadorCliente]],
                columns: [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "address", label: "Dirección"})
                ]
             });

             var customerSearchObjCount = customerSearchObj.runPaged().count;

              if(customerSearchObjCount > 0){
                var srchResults = customerSearchObj.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (idCliente = srchResults[0].getValue({name: "internalid", label: "ID interno"})),
                  (direccionFacturacion = srchResults[0].getValue({name: "address", label: "Dirección"}));
                  log.audit("idCliente", idCliente);
                  log.audit("direccionFacturacion Contrato", direccionFacturacion);
                  objUpdate.custrecord_ptg_cliente_farm_gdl_l = idCliente;
                  if(idCliente){
                    var recCustomerPayment = record.create({
                        type: record.Type.CUSTOMER_PAYMENT,
                        isDynamic: true,
                    });
    
                    recCustomerPayment.setValue("customform", formularioPago);
                    recCustomerPayment.setValue("customer", idCliente);
                    recCustomerPayment.setValue("account", cuenta);
                    recCustomerPayment.setValue("memo", nota);
                    recCustomerPayment.setValue("custbody_ptg_pago_farmacia_gdl", true);
                    recCustomerPayment.setValue("trandate", format.parse({
                        value: fecha.substring(0, 2) + '/' + fecha.substring(3, 4) + '/' + fecha.substring(5, 10),
                        type: format.Type.DATE
                    }));
                    recCustomerPayment.setValue("payment", importe);

                    var lineCount = recCustomerPayment.getLineCount('apply');

                    //for (var k = 0; k < lineCount; k++){
                    for (var k = lineCount -1; k >= 0; k--){
                        recCustomerPayment.selectLine({
                            sublistId: 'apply',
                            line: k
                        });
                        var factura = recCustomerPayment.getCurrentSublistValue({
                            sublistId: 'apply',
                            fieldId: 'internalid',
                        });
                        log.audit("factura", factura);

                        //SS: PTG - Factura - Direccion
                        var invoiceSearchObj = search.create({
                            type: "invoice",
                            filters: [
                               ["type","anyof","CustInvc"], "AND", 
                               ["mainline","is","T"], "AND", 
                               ["internalid","anyof",factura]
                            ],
                            columns:[
                               search.createColumn({name: "billaddress", label: "Dirección de facturación"}),
                               search.createColumn({name: "shipaddress", label: "Dirección de envío"}),
                               search.createColumn({name: "total", label: "Importe (total de transacción)"})
                            ]
                        });
                        var invoiceSearchObjCount = invoiceSearchObj.runPaged().count;
                        if(invoiceSearchObjCount > 0){
                            var invoiceSearchObjResults = invoiceSearchObj.run().getRange({
                                start: 0,
                                end: 2,
                            });
                            //(direccion = invoiceSearchObjResults[0].getValue({name: "billaddress", label: "Dirección de facturación"}));
                            (direccion = invoiceSearchObjResults[0].getValue({name: "shipaddress", label: "Dirección de envío"}) || "");
                            (totalFactura = invoiceSearchObjResults[0].getValue({name: "total", label: "Importe (total de transacción)"}) || "");
                            log.audit("direccion de la factura", direccion);
                            log.audit("total de Factura", totalFactura);
                        }

                        var addressSearchObj = search.create({
                            type: "address",
                            filters: [["custrecord_ptg_numero_contrato", "is", numeroContratoCliente], "AND", 
                            ["custrecord_ptg_digito_verificador","equalto", digitoVerificadorCliente]],
                            columns: [
                                search.createColumn({name: "internalid", label: "ID interno"}),
                                search.createColumn({name: "address", label: "Address"})
                            ]
                        });

                        var addressSearchObjResults = addressSearchObj.run().getRange({
                            start: 0,
                            end: 2,
                          });
    
                          (idDireccion = addressSearchObjResults[0].getValue({name: "internalid", label: "ID interno"}));
                          (direccionAddress = addressSearchObjResults[0].getValue({name: "address", label: "Address"}));
                          log.audit("direccionAddress", direccionAddress);

                        if (direccionAddress == direccion && totalFactura == importe){
                            log.audit("IIIII"+direccionAddress, direccion);
                            recCustomerPayment.setCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'apply',
                                value: true
                            });
                        }
                        log.audit("direccion ad");
                    }

                    var pagoObjClienteIdentificado = recCustomerPayment.save();
                    log.debug("Pago Creado cliente Identificado: ", pagoObjClienteIdentificado);
                    objUpdate.custrecord_ptg_pago_farm_gdl_l = pagoObjClienteIdentificado;

                    if(pagoObjClienteIdentificado){
                        var pagoCreado = record.load({
                            type: record.Type.CUSTOMER_PAYMENT,
                            id: pagoObjClienteIdentificado,
                            isDynamic: true
                        });
                        var lineCount = pagoCreado.getLineCount('apply');
                        log.audit("lineCount del pago", lineCount);
                        
                        for (var k = 0; k < lineCount; k++){
                            pagoCreado.selectLine({
                                sublistId: 'apply',
                                line: k
                            });
                            aplicacionDePago = pagoCreado.getCurrentSublistValue({
                                sublistId: 'apply',
                                fieldId: 'apply',
                            });
                            log.audit("aplicacion del pago", aplicacionDePago);

                            if(aplicacionDePago){
                                facturaDePago = pagoCreado.getCurrentSublistValue({
                                    sublistId: 'apply',
                                    fieldId: 'internalid',
                                });
                                log.audit("factura del pago", facturaDePago);
                                idFacturaArray.push(facturaDePago);
                            }
                        }
                        objUpdate.custrecord_ptg_fac_farm_gdl_l = idFacturaArray;
                    }
                  }
              } else {
                var recCustomerPayment = record.create({
                    type: record.Type.CUSTOMER_PAYMENT,
                    isDynamic: true,
                });

                recCustomerPayment.setValue("customform", formularioPago);
                recCustomerPayment.setValue("customer", clienteNoIdentificado);
                recCustomerPayment.setValue("account", cuenta);
                recCustomerPayment.setValue("memo", nota);
                recCustomerPayment.setValue("custbody_ptg_pago_farmacia_gdl", true);
                recCustomerPayment.setValue("trandate", format.parse({
                    value: fecha.substring(0, 2) + '/' + fecha.substring(3, 4) + '/' + fecha.substring(5, 10),
                    type: format.Type.DATE
                }));
                recCustomerPayment.setValue("payment", importe);
                
                var pagoObjClienteNoIdentificado = recCustomerPayment.save();

                log.debug("Pago Creado cliente No Identificado: ", pagoObjClienteNoIdentificado);
                objUpdate.custrecord_ptg_cliente_farm_gdl_l = clienteNoIdentificado;
                objUpdate.custrecord_ptg_pago_farm_gdl_l = pagoObjClienteNoIdentificado;
              }

              var actualizar = record.submitFields({
                id: idRegistro,
                type: "customrecord_ptg_pagos_farmacias_gdl_lin",
                values: objUpdate,
            });

            log.debug("Registro actualizado", actualizar);
            

            context.write({
                key: actualizar,
                value: actualizar
            });
               
        } catch (error) {
            estatus.custrecord_ptg_procesando_pagos_farm_gld = false;
            estatus.custrecord_ptg_terminado_pagos_farm_gld = false;
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        } finally {
            estatus.custrecord_ptg_procesando_pagos_farm_gld = false;
            estatus.custrecord_ptg_terminado_pagos_farm_gld = true;
            var registroCabecera = record.submitFields({
                type: "customrecord_ptg_pagos_farmacias_gdl",
                id: idRegistroCab,
                values: estatus
            });
            log.debug("Registro actualizado", registroCabecera);

            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idOportunidad = JSON.parse(context.key);
            var idRegistroCab = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_registro_pag_far'
            }) || '';
            
            var estatus = {};
            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        } finally {
            estatus.custrecord_ptg_procesando_pagos_farm_gld = false;
            estatus.custrecord_ptg_terminado_pagos_farm_gld = true;
            var registroCabecera = record.submitFields({
                type: "customrecord_ptg_pagos_farmacias_gdl",
                id: idRegistroCab,
                values: estatus
            });
            log.debug("Registro actualizado FINAL", registroCabecera);

            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
            
        }
    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});