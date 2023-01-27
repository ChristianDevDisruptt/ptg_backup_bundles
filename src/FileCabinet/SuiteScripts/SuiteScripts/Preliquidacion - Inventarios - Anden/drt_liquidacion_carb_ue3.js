/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Liquidacion Carburacion UE 3
 * Script id: customscript_drt_liquidacion_carb_ue_3
 * customer Deployment id: customdeploy_drt_liquidacion_carb_ue_3
 * Applied to: PTG - Preliquidación EstaciónCarburación
 * File: drt_liquidacion_carb_ue3.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/format'], function (record, search, runtime, https, url, format) {
  
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var estacionCarburacion = customRec.getValue("custrecord_ptg_est_carb_registro_");
                var fechaInicio = customRec.getValue("custrecord_ptg_fecha_iniciof");
                var fechaFin = customRec.getValue("custrecord_ptg_fecha_finf");
                var urlPago = "";
                var conteoExceso = 0;
                var conteoRestriccion = 0;
                var fechaI = fechaInicio;
                var fechaF = fechaFin;
                var sumaEfectivo = 0;
                var sumaCredito = 0;
                var sumaOtros = 0;
                var suma = 0;
                var total = 0;

                var totalUltimoCorteB1 = customRec.getValue("custrecord_ptg_tot_ult_corte_1");
                var totalEstaCorteB1 = customRec.getValue("custrecord_ptg_control_en_lts_1");
                var nuevoTotalB1 = totalUltimoCorteB1 + totalEstaCorteB1;
                var totalUltimoCorteB2 = customRec.getValue("custrecord_ptg_total_ult_corte_2");
                var totalEstaCorteB2 = customRec.getValue("custrecord_ptg_control_en_lts_2");
                var nuevoTotalB2 = totalUltimoCorteB2 + totalEstaCorteB2;
                
                var publicoGeneral = 0;
                var conteoExceso = 0;
                var conteoRestriccion = 0;
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
                var tarjetaCreditoBancomer = 0;
                var tarjetaCreditoHSBC = 0;
                var tarjetaCreditoBanamex = 0;
                var tarjetaDebitoBanamex = 0;
                var tarjetaDebitoBancomer = 0;
                var tarjetaDebitoHSBC = 0;
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
                    tarjetaCreditoBancomer = 31;
                    tarjetaCreditoHSBC = 32;
                    tarjetaCreditoBanamex = 33;
                    tarjetaDebitoBanamex = 34;
                    tarjetaDebitoBancomer = 35;
                    tarjetaDebitoHSBC = 36;
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
                }

                    

                

            //PRELIQUIDACION: DETALLE
            //LIQUIDACION: CARBURACION - PTG DETALLE CARBURACION
            //BÚSQUEDA GUARDADA: PTG - Preliq Detalle Despachador
            var detalleDespachadorObj = search.create({
                type: "transaction",
                filters: [
                   ["type","anyof","Opprtnty"], "AND", 
                   ["probability","equalto","100"], "AND", 
                   ["custbody_ptg_estacion_carburacion","anyof", estacionCarburacion], "AND", 
                   //["datecreated", "within", fechaI, fechaF], "AND",
                   ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaI, fechaF], "AND",
                   ["mainline","is","F"], "AND",
                   ["taxline","is","F"], "AND", 
                   ["item","anyof",gasLP], "AND", 
                   ["custbody_ptg_liquidado","is","F"]
                ],
                columns:
                [
                   search.createColumn({name: "internalid", label: "ID interno"}),
                   search.createColumn({name: "transactionname", label: "Nombre de la transacción"}),
                   search.createColumn({name: "entity", label: "Nombre"}),
                   search.createColumn({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"}),
                   search.createColumn({name: "quantity", label: "Cantidad"}),
                   search.createColumn({name: "rate", label: "Tasa de artículo"}),
                   search.createColumn({name: "amount", label: "Importe"}),
                   search.createColumn({name: "taxamount", label: "Importe (impuestos)"}),
                   search.createColumn({name: "total", label: "Importe (total de transacción)"}),
                   search.createColumn({name: "custbody_ptg_dispensador_", label: "PTG - DISPENSADOR"}),
                   search.createColumn({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"}),
                   search.createColumn({name: "tranid", label: "Número de documento"}),
                   search.createColumn({name: "custbody_ptg_bomba_despachadora", label: "PTG - Bomba Despachadora"}),
                   search.createColumn({name: "custbody_ptg_num_viaje_destino", label: "PTG - Número de Viaje Destino"})
                ]
             });
             var detalleDespachadorResultCount = detalleDespachadorObj.runPaged().count;
             log.debug("detalleDespachadorResultCount", detalleDespachadorResultCount);
             var detalleDespachadorResult = detalleDespachadorObj.run().getRange({
                start: 0,
                end: detalleDespachadorResultCount,
            });
            log.audit("detalleDespachadorResult", detalleDespachadorResult);
            for(var i = 0; i < detalleDespachadorResultCount; i++){
                (idOportunidad = detalleDespachadorResult[i].getValue({name: "internalid", label: "ID interno"})),
                (nombreOportunidad = detalleDespachadorResult[i].getValue({name: "transactionname", label: "Nombre de la transacción"})),
                (cliente = detalleDespachadorResult[i].getValue({name: "entity", label: "Nombre"})),
                (opcionPago = detalleDespachadorResult[i].getValue({name: "custbody_ptg_opcion_pago", label: "Opción de Pago"})),
                (cantidad = detalleDespachadorResult[i].getValue({name: "quantity", label: "Cantidad"})),
                (tasa = detalleDespachadorResult[i].getValue({name: "rate", label: "Tasa de artículo"})),
                (importe = detalleDespachadorResult[i].getValue({name: "amount", label: "Importe"})),
                (importeImpuesto = detalleDespachadorResult[i].getValue({name: "taxamount", label: "Importe (impuestos)"})),
                (total = detalleDespachadorResult[i].getValue({name: "total", label: "Importe (total de transacción)"})),
                (despachador = detalleDespachadorResult[i].getValue({name: "custbody_ptg_bomba_despachadora", label: "PTG - Bomba Despachadora"})),
                (registroPago = detalleDespachadorResult[i].getValue({name: "custbody_ptg_registro_pagos", label: "PTG - Registro Pagos"})),
                (numeroViajeDestino = detalleDespachadorResult[i].getValue({name: "custbody_ptg_num_viaje_destino", label: "PTG - Número de Viaje Destino"})),
                (numeroDocumento = detalleDespachadorResult[i].getValue({name: "tranid", label: "Número de documento"}));
                log.debug("idOportunidad", idOportunidad);

                var urlModificarPago = urlPago + registroPago + "&e=T";                

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: cliente,
                });
                var direccionCliente = clienteObj.getValue("defaultaddress");
                var nombreCliente = clienteObj.getValue("altname");
                var saldoVencido = clienteObj.getValue("overduebalance");
                var limiteCredito = clienteObj.getValue("creditlimit");
                var saldo = clienteObj.getValue("balance");


                var pagoObj = record.load({
                    id: registroPago,
                    type: "customrecord_ptg_pagos"
                });
                var referenciaPago = pagoObj.getSublistValue({
                    sublistId: "recmachcustrecord_ptg_registro_pagos",
                    fieldId: "custrecord_ptg_referenciapago_",
                    line: 0,
                });
                log.debug("referenciaPago", referenciaPago);

                if(cliente != publicoGeneral && opcionPago == creditoCliente){
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
                

                if(opcionPago == creditoCliente && cliente == publicoGeneral){
                    restriccion = true;
                    conteoRestriccion += 1;
                } else {
                    restriccion = false;
                    conteoRestriccion += 0;
                } 


                var recDetalleDespachador = record.create({
                    type: "customrecord_ptg_detalle_despachador_",
                    isDynamic: true,
                });
                recDetalleDespachador.setValue("custrecord_ptg_numdespachador", despachador);
                recDetalleDespachador.setValue("custrecord_ptg_oportunidad_carburacion", idOportunidad);
                recDetalleDespachador.setValue("custrecord_ptg_notadespachador_", numeroDocumento);
                recDetalleDespachador.setValue("custrecord_ptg_modificar_met_pago_gas", urlModificarPago);
                recDetalleDespachador.setValue("custrecord_ptg_tipopagoespachador_", opcionPago);
                recDetalleDespachador.setValue("custrecord_ptg_ref_pago_", referenciaPago);
                recDetalleDespachador.setValue("custrecord_ptg_clientedespachador_", cliente);
                recDetalleDespachador.setValue("custrecord_ptg_dir_embarque_despachador_", direccionCliente);
                recDetalleDespachador.setValue("custrecord_ptg_num_cli_desp_", nombreCliente);
                recDetalleDespachador.setValue("custrecord_ptg_lts_vendidos_despachador_", cantidad);
                recDetalleDespachador.setValue("custrecord_ptg_preciounidespachador_", tasa);
                recDetalleDespachador.setValue("custrecord_ptg_preciounidespachador_old", tasa);
                recDetalleDespachador.setValue("custrecord_ptg_importe_despachador_", importe);
                recDetalleDespachador.setValue("custrecord_ptg_impuestodespachador_", importeImpuesto);
                recDetalleDespachador.setValue("custrecord_ptg_total_despachador_", total);
                recDetalleDespachador.setValue("custrecord_ptg_saldo_vencido_despachador", saldoVencido);
                recDetalleDespachador.setValue("custrecord_ptg_limite_credit_despachador", limiteCredito);
                recDetalleDespachador.setValue("custrecord_ptg_saldo_despachador", saldo);
                recDetalleDespachador.setValue("custrecord_ptg_excede_limite_despachador", excedeLimite);
                recDetalleDespachador.setValue("custrecord_ptg_restriccion_despachador", restriccion);
                if(opcionPago == prepagoBanorte || opcionPago == prepagoTransferencia || opcionPago == prepagoBancomer || opcionPago == prepagoHSBC || opcionPago == prepagoBanamex || opcionPago == prepagoSantander || opcionPago == prepagoScotian){
                    recDetalleDespachador.setValue("custrecord_ptg_prepago_sin_aplicar_despa", true);
                }
                recDetalleDespachador.setValue("custrecord_ptg_numero_viaje_destino", numeroViajeDestino);
                recDetalleDespachador.setValue("custrecord_ptg_despdetalle_", recId);
                recDetalleDespachador.setValue("custrecord_ptg_detallecrburacion_", recId);
                var recDetalleDespachadorIdSaved = recDetalleDespachador.save();
                log.debug({
                    title: "DETALLE DE DESPACHADOR",
                    details: "Id Saved: " + recDetalleDespachadorIdSaved,
                });

                    var recOportunidadGas = record.create({
                        type: "customrecord_ptg_oportunidades_",
                        isDynamic: true,
                    });
                    recOportunidadGas.setValue("custrecord_ptg_idoportunidad_", idOportunidad);
                    recOportunidadGas.setValue("custrecord_ptg_rel_op_preliq_", recId);
                    if(opcionPago == saldoAFavor && opcionPago == consumoInterno && opcionPago == recirculacion && opcionPago == cancelado){
                        recOportunidadGas.setValue("custrecord_ptg_facturar_servicio", false);
                    }
                    var recOportunidadGasIdSaved = recOportunidadGas.save();
                    log.debug({
                        title: "OPORTUNIDAD GAS",
                        details: "Id Saved: " + recOportunidadGasIdSaved,
                    });
                }
           

                  var objUpdateVentas = {
                    custrecord_ptg_efec_preliqestacion_: sumaEfectivo,
                    custrecord_ptg_credito_estacioncarb_: sumaCredito,
                    custrecord_ptg_otros_preliqestacion_: sumaOtros,
                    custrecord_ptg_total_serv_est_carb_: suma,
                    custrecord_ptg_tot_ult_liqu_bomba1_: totalUltimoCorteB1,
                    custrecord_ptg_lts_reportados_bomba1_: totalEstaCorteB1,
                    custrecord_ptg_nuevo_tot_bomba1_: nuevoTotalB1,
                    custrecord_ptg_tot_ult_liqu_bomba2_: totalUltimoCorteB2,
                    custrecord_ptg_lts_reportados_bomba2_: totalEstaCorteB2,
                    custrecord_ptg_nuevo_tot_bomba2_: nuevoTotalB2,
                    custrecord_ptg_conteo_exceso_preliq_carb: conteoExceso,
                    custrecord_ptg_conteo_restri_preliq_carb: conteoRestriccion,
                };
                log.audit("objUpdateVentas", objUpdateVentas);

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