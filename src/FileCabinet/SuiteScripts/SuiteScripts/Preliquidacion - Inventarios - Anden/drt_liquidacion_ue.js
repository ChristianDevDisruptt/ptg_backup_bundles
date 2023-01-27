/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - Liquidacion UE COPY
 * Script id: customscript_drt_liquidacion_ue_c
 * customer Deployment id: customdeploy_drt_liquidacion_ue_c
 * Applied to: PTG - PreLiquidación de Cilindros
 * File: drt_liquidacion_ue_copy.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
//define(["N/record", "N/search", "N/runtime", 'N/task'], function (record, search, runtime, task) {
define(["N/record", "N/search", "N/runtime", 'N/task', 'N/url', 'N/https', "N/redirect", "N/log", 'N/currentRecord'], 
    function (record, search, runtime, task, url, https, redirect, log, currentRecord) {
    function beforeLoad(scriptContext) {
        try {
            log.audit('Remaining Usage init beforeLoad start', runtime.getCurrentScript().getRemainingUsage());
            var customRec = scriptContext.newRecord;
            var recId = customRec.id;
            var recType = customRec.type;
            var folio = customRec.getValue("custrecord_ptg_folio_preliqui_cil_");
            var type_interface = runtime.executionContext;
            var type_event = scriptContext.type;
            var recObj = scriptContext.newRecord;
            var form = scriptContext.form;
            var userRoleId = runtime.getCurrentUser().role;
            log.debug(["beforeLoad", "type_interface", "type_event", "recType", "recObj.id", "userRoleId",].join(" - "),
            [type_interface, type_event, recObj.type, recObj.id, userRoleId].join(" - "));
            var efectivo = 0;
            var debito = 0;
            var credito = 0;
            var creditoCliente = 0;
            var cortesia = 0;
            var prepago = 0;
            var reposicion = 0;
            var bonificacion = 0;
            var cheque = 0;
            var transferencia = 0;
            var total = 0;
            var status = recObj.getValue("custrecord_ptg_liquidacion_status");
            var conteoExceso = parseInt(recObj.getValue("custrecord_ptg_conteo_exceso"));
            var conteoRestriccion = parseInt(recObj.getValue("custrecord_ptg_conteo_restriccion"));
            var prepagosSinAplicar = parseInt(recObj.getValue("custrecord_ptg_prepago_sin_aplicar_cil"));
            var montoDesgloseEfec = recObj.getValue("custrecord_ptg_monto_totalizador");

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
            var gasLP = 0;
            var estatusPreliquidacion = 0;
            var estatusLiquidacion = 0;
            var estatusEjecutado = 0;
            var estatusFacturacion = 0;


            if (runtime.envType === runtime.EnvType.SANDBOX) {
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
                gasLP = 4088;
                estatusPreliquidacion = 1;
                estatusLiquidacion = 2;
                estatusEjecutado = 3;
                estatusFacturacion = 4;

            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
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
                gasLP = 4216;
                estatusPreliquidacion = 1;
                estatusLiquidacion = 2;
                estatusEjecutado = 3;
                estatusFacturacion = 4;
            }
                                   

              //SS: PTG - Registro de Prepagos
            var prepagosObj = search.create({
                type: "customrecord_ptg_registrooportunidad_",
                filters:[
                   ["custrecord_ptg_optpreliq_","anyof",recId], "AND", 
                   ["custrecord_ptg_prepago_aplicar_oport","is","T"]
                ],
                columns: [
                    search.createColumn({name: "custrecord_ptg_prepago_aplicar_oport", label: "PTG - Prepago Aplicado"})
                ]
            });
            var prepagosObjCount = prepagosObj.runPaged().count;

              //Búsqueda Guardada: PTG - Oportunidades a Facturar Count
              var facturasAGenerar = search.create({
                type: "customrecord_ptg_oportunidad_facturar",
                filters: [["custrecord_ptg_preliq_cilindros","anyof",recId],"AND", ["isinactive","is","F"]],
                columns: [
                   search.createColumn({name: "scriptid", label: "Script ID"})
                ]
             });
             var facturasAGenerarCount = facturasAGenerar.runPaged().count;
             log.debug("facturasAGenerarCount", facturasAGenerarCount);


               //BÚSQUEDA GUARDADA: PTG - Registro Facturación Generadas Cil
            var facturasGeneradas = search.create({
                type: "customrecord_drt_ptg_registro_factura",
                filters: [["custrecord_ptg_num_viaje_fac_","anyof", recId]],
                columns: [
                   search.createColumn({name: "scriptid", sort: search.Sort.ASC, label: "ID de script"})
                ]
             });
             log.audit("facturasGeneradas", facturasGeneradas);
             var facturasGeneradasResultCount = facturasGeneradas.runPaged().count;
             log.audit("facturasGeneradasResultCount result count",facturasGeneradasResultCount);
             

             //BÚSQUEDA GUARDADA: PTG - Registro Facturación Generadas Cil Error
             var facturasGeneradasError = search.create({
                type: "customrecord_drt_ptg_registro_factura",
                filters: [["custrecord_ptg_num_viaje_fac_","anyof",recId], "AND", ["custrecord_ptg_status","doesnotstartwith","Success"]],
                columns: [
                   search.createColumn({name: "scriptid", sort: search.Sort.ASC, label: "ID de script"})
                ]
             });
             log.audit("facturasGeneradasError", facturasGeneradasError);
             var facturasGeneradasErrorResultCount = facturasGeneradasError.runPaged().count;
             log.debug("facturasGeneradasError result count",facturasGeneradasErrorResultCount);

             if (status == estatusFacturacion){

                var objUpdate = {
                    custrecord_ptg_total_a_facturar: facturasAGenerarCount,
                    custrecord_ptg_facturas_generadas: facturasGeneradasResultCount,
                    custrecord_ptg_facturas_errores: facturasGeneradasErrorResultCount,
                };
                log.audit("objUpdate", objUpdate);
    
                
             }
            
            
            if (type_event == "view") {
                log.debug("status", status);
                if(conteoRestriccion == 0 || conteoRestriccion == ""){
                if (status == estatusPreliquidacion && prepagosSinAplicar == 0) {
                    form.title = "Preliquidación";
                } else if (status == estatusPreliquidacion && prepagosSinAplicar > 0) {
                    form.title = "Preliquidación | Hay Prepagos Sin Aplicar";
                } else if (status == estatusLiquidacion && montoDesgloseEfec == "") {
                    form.title = "Liquidación | Ingresar Desglose de Efectivo";
                } else if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.title = "Liquidación";
                } else if (status == estatusEjecutado) {
                    form.title = "Facturación";
                } else if (status == estatusFacturacion) {
                    form.title = "Liquidación Facturada";
                }
                
                if (status == estatusPreliquidacion && conteoExceso > 0) {
                    form.addButton({
                        id: "custpage_drt_aprobar_preliqui",
                        label: "Aprobar Preliquidación",
                        functionName: "redirectToAprobar()",
                    });
                } else if (status == estatusPreliquidacion && conteoExceso == 0 && prepagosSinAplicar == 0) {
                    form.addButton({
                        id: "custpage_drt_to_preliqui",
                        label: "Liquidación",
                        functionName: "redirectTo()",
                    });
                } else if (status == estatusLiquidacion && (montoDesgloseEfec != "" || montoDesgloseEfec > 0)) {
                    form.addButton({
                        id: "custpage_drt_to_nuevo_viaje",
                        label: "Nuevo Viaje y Facturar",
                        functionName: "redirectToNuevoViajeYFacturacion()",
                    });
                } else if (status == estatusFacturacion) {
                    form.addButton({
                        id: "custpage_drt_to_nuevo_viaje_solo",
                        label: "Nuevo Viaje",
                        functionName: "redirectToNuevoViaje()",
                    });
                }
             

                if (status == estatusFacturacion) {
                    record.submitFields({
                        id: customRec.id,
                        type: customRec.type,
                        values: objUpdate,
                      });
                }

                var recordObj = record.load({
                    type: recType,
                    id: recId,
                });
                var lineasTipoPago = recordObj.getLineCount({sublistId: "recmachcustrecord_ptg_optpreliq_"});
                log.audit("lineasTipoPago", lineasTipoPago);
    
                for (var t = 0; t < lineasTipoPago; t++){
                    tipoPagoArray = recordObj.getSublistValue({
                        sublistId: "recmachcustrecord_ptg_optpreliq_",
                        fieldId: "custrecord_ptg_tipopago_oportunidad_",
                        line: t,
                    });
                    log.audit("tipoPagoArray "+t, tipoPagoArray);
    
                    montoPagoArray = recordObj.getSublistValue({
                        sublistId: "recmachcustrecord_ptg_optpreliq_",
                        fieldId: "custrecord_ptg_total_",
                        line: t,
                    });
                    log.audit("montoPagoArray "+t, montoPagoArray);
    
                    if(tipoPagoArray == efectivoId){
                        efectivo += montoPagoArray
                    }
                    if(tipoPagoArray == prepagoBanorteId || tipoPagoArray == prepagoTransferenciaId || tipoPagoArray == prepagoBancomerId || tipoPagoArray == prepagoHSBCId || tipoPagoArray == prepagoBanamexId || tipoPagoArray == prepagoSantanderId || tipoPagoArray == prepagoScotianId){
                        prepago += montoPagoArray
                    }
                    if(tipoPagoArray == creditoClienteId){
                        creditoCliente += montoPagoArray
                    }
                    if(tipoPagoArray == cortesiaId){
                        cortesia += montoPagoArray
                    }
                    if(tipoPagoArray == tarjetaCreditoId || tipoPagoArray == tarjetaCreditoBancomerId || tipoPagoArray == tarjetaCreditoHSBCId || tipoPagoArray == tarjetaCreditoBanamexId){
                        credito += montoPagoArray
                    }
                    if(tipoPagoArray == tarjetaDebitoId || tipoPagoArray == tarjetaDebitoBanamexId || tipoPagoArray == tarjetaDebitoBancomerId || tipoPagoArray == tarjetaDebitoHSBCId){
                        debito += montoPagoArray
                    }
                    if(tipoPagoArray == reposicionId){
                        reposicion += montoPagoArray
                    }
                    if(tipoPagoArray == bonificacionId){
                        bonificacion += montoPagoArray
                    }
                    if(tipoPagoArray == chequeBancomerId || tipoPagoArray == chequeSantanderId || tipoPagoArray == chequeScotianId || tipoPagoArray == chequeHSBCId || tipoPagoArray == chequeBanamexId || tipoPagoArray == chequeBanorteId){
                        cheque += montoPagoArray
                    }
                    if(tipoPagoArray == transferenciaId){
                        transferencia += montoPagoArray
                    }
                    total += montoPagoArray
                }

                var objTipoPagoUpdate = {
                    custrecord_ptg_prepago_sin_aplicar_cil: prepagosObjCount,
                    custrecord_ptg_efectivo_: efectivo,
                    custrecord_ptg_efectivo_desglosar: efectivo,
                    custrecord_ptg_prepago_: prepago,
                    custrecord_ptg_vale_: creditoCliente,
                    custrecord_ptg_cortesia_: cortesia,
                    custrecord_ptg_venta_tarjetacredito_: credito,
                    custrecord_ptg_tarjetadebito_: debito,
                    custrecord_ptg_reposicion_: reposicion,
                    custrecord_ptg_bonificacion_: bonificacion,
                    custrecord_ptg_cheque_: cheque,
                    custrecord_ptg_transferencia_: transferencia,
                    custrecord_ptg_total_total_: total
                };

                log.audit("objTipoPagoUpdate", objTipoPagoUpdate);

                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objTipoPagoUpdate,
                    options: {
                      enableSourcing: false,
                      ignoreMandatoryFields: true,
                    },
                });

            } else {
                form.title = "Preliquidación con Crédito a Público General";
            }
    
            log.audit('Remaining Usage init beforeLoad end', runtime.getCurrentScript().getRemainingUsage());

            } else if (type_event == "edit"){
                if(status == estatusLiquidacion){
                    form.addButton({
                        id: "custpage_drt_borrar_montos",
                        label: "Borrar Desglose",
                        functionName: "borrarDesglose()",
                    });
                }
            }
            form.clientScriptModulePath = "./drt_preliq_liquidacion_cs.js";
            //form.clientScriptModulePath = "../SuiteBundles/Bundle 426938/drt_preliq_liquidacion_cs.js";

        } catch (error) {
            log.error("ERROR", error);
        }
    }
    
    function afterSubmit(context) {
        try {
            if (context.type == "create") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var numViaje = customRec.getValue("custrecord_ptg_numdeviaje_");
                var itemCount = customRec.getLineCount({sublistId: "recmachcustrecord_ptg_preliqrelacionada_",});
                var vehiculo = customRec.getValue("custrecord_ptg_nodevehiculo_prelicil_");
                log.audit("recId", recId);
                log.audit("Viaje", numViaje);
                log.audit("Numero lineas: ", itemCount);


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
                var estadoOpNegociacion = 0;
                var estadoOpCompra = 0;
                var estadoOpConcretado = 0;
                var estadoOpClienteConcretado = 0;

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
                    estadoOpNegociacion = 11;
                    estadoOpCompra = 12;
                    estadoOpConcretado = 13;
                    estadoOpClienteConcretado = 18;
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
                    estadoOpNegociacion = 11;
                    estadoOpCompra = 12;
                    estadoOpConcretado = 13;
                    estadoOpClienteConcretado = 18;
                }

                //DETALLE DE DOTACION
                //BÚSQUEDA GUARDADA: DRT - PTG - Registro de dot cilind
                //var idRegistroDotacionPreliquidacionArray = [];
                log.audit('Remaining Usage for start', runtime.getCurrentScript().getRemainingUsage());

                var dotacionSearch = search.create({
                    type: "customrecord_ptg_registrodedotacion_cil_",
                    filters: [["custrecord_ptg_numviaje_dot_", "anyof", numViaje], "AND", ["custrecord_ptg_subsidiaria_","isnotempty",""], "AND", ["custrecord_ptg_registro_dotacion","is","T"]],
                    columns: [
                        search.createColumn({name: "internalid", label: "Internal ID"}),
                        search.createColumn({name: "custrecord_ptg_preliqrelacionada_", label: "PTG - Preliquidacion Relacionada"}),
                        search.createColumn({name: "custrecord_ptg_novehiculo_", label: "PTG - No de Vehículo "}),
                        search.createColumn({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación"}),
                        search.createColumn({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación"}),
                        search.createColumn({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros"}),
                        search.createColumn({name: "custrecord_ptg_numviaje_dot_", label: "PTG -Numero de viaje"}),
                        search.createColumn({name: "custrecord_ptg_ruta_", label: "PTG - Ruta"}),
                        search.createColumn({name: "custrecord_ptg_subsidiaria_", label: "PTG - Subsidiaria"}),
                        search.createColumn({name: "custrecord_drt_ptg_transferencia", label: "Transferencia creada"}),
                        search.createColumn({name: "custrecord_ptg_tipo_articulo", label: "PTG - Tipo articulo"})
                    ]
                });
                var dotacionResultCount = dotacionSearch.runPaged().count;
                log.audit("dotacionResultCount", dotacionResultCount);
                var dotacionResult = dotacionSearch.run().getRange({
                    start: 0,
                    end: dotacionResultCount,
                });
                for (var i = 0; i < dotacionResultCount; i++) {
                    (idRegistroDotacion = dotacionResult[i].getValue({name: "internalid", label: "Internal ID"})),
                    (idPreliquidacionDotacion = dotacionResult[i].getValue({name: "custrecord_ptg_preliqrelacionada_", label: "PTG - Preliquidacion Relacionada"}));
                    (numeroVehiculo = dotacionResult[i].getValue({ name: "custrecord_ptg_novehiculo_", label: "PTG - No de Vehículo", })),
                    (descripcion = dotacionResult[i].getValue({ name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación", })),
                    (cilindro = dotacionResult[i].getValue({ name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación", })),
                    (dotacion = dotacionResult[i].getValue({ name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros", })),
                    (numeroViaje = dotacionResult[i].getValue({name: "custrecord_ptg_numviaje_dot_", label: "PTG -Numero de viaje",})),
                    (ruta = dotacionResult[i].getValue({name: "custrecord_ptg_ruta_", label: "PTG - Ruta",})),
                    (subsidiaria = dotacionResult[i].getValue({name: "custrecord_ptg_subsidiaria_", label: "PTG - Subsidiaria",})),
                    (transferenciaCreada = dotacionResult[i].getValue({name: "custrecord_drt_ptg_transferencia", label: "Transferencia creada",})),
                    (tipoArticulo = dotacionResult[i].getValue({name: "custrecord_ptg_tipo_articulo", label: "PTG - Tipo articulo",}));
                    var recDotacion = record.create({
                        type: "customrecord_ptg_registrodedotacion_cil_",
                        isDynamic: true,
                    });
                    recDotacion.setValue("custrecord_ptg_novehiculo_", numeroVehiculo);
                    recDotacion.setValue("custrecord_ptg_descripcion_dotacion_", descripcion);
                    recDotacion.setValue("custrecord_ptg_cilindro_dotacion_", cilindro);
                    recDotacion.setValue("custrecord_ptg_dotacion_cilindros", dotacion);
                    recDotacion.setValue("custrecord_ptg_numviaje_dot_", numeroViaje);
                    recDotacion.setValue("custrecord_ptg_ruta_", ruta);
                    recDotacion.setValue("custrecord_ptg_subsidiaria_", subsidiaria);
                    recDotacion.setValue("custrecord_drt_ptg_transferencia", transferenciaCreada);
                    recDotacion.setValue("custrecord_ptg_tipo_articulo", tipoArticulo);
                    recDotacion.setValue("custrecord_ptg_preliqrelacionada_", recId);
                    recDotacion.setValue("custrecord_ptg_numviaje_detalledotacion", numeroViaje);
                    var recDotacionIdSaved = recDotacion.save();
                    log.debug({
                        title: "DETALLE DE DOTACION",
                        details: "Id Saved: " + recDotacionIdSaved,
                    });

                }

                log.audit('Remaining Usage for end', runtime.getCurrentScript().getRemainingUsage());
                
                
                //DETALLE TIPO DE PAGO
                //CABECERA
                var totalEfectivo = 0;
                    var totalPrepago = 0;
                    var totalCreditoCliente = 0;
                    var totalCortesia = 0;
                    var totalTarjetaCredito = 0;
                    var totalTarjetaDebito = 0;
                    var totalReposicionPorQueja = 0;
                    var totalBonificacion = 0;
                    var totalCheque = 0;
                    var totalTransferencia = 0;
                    var sumaPagoPF = 0;
                    var totalTotal = 0;
                for (var j = 1; j <= 36; j++) {
                    //BÚSQUEDA GUARDADA: Custom PTG - Pagos Oportunidad Search
                    var tipoPagoSearch = search.create({
                        type: "customrecord_ptg_pagos_oportunidad",
                        filters: [
                            ["custrecord_ptg_num_viaje","anyof",numViaje], "AND", 
                            ["custrecord_ptg_tipo_pago","anyof", j],"AND", 
                            ["custrecord_ptg_oportunidad","noneof","@NONE@"], "AND", 
                            ["custrecord_ptg_total","isnotempty",""], "AND", 
                            ["custrecord_ptg_estacion_carburacion_","anyof","@NONE@"]
                         ],
                        columns: [
                            search.createColumn({name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago"}),
                            search.createColumn({name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total"})
                        ]
                    });
                    log.audit("tipoPagoSearch", tipoPagoSearch);
                    var tipoPagoResultCount = tipoPagoSearch.runPaged().count;
                    log.audit("Tipo Pago Result Count", tipoPagoResultCount);
                    var searchResultTipoPago = tipoPagoSearch.run().getRange({
                        start: 0,
                        end: tipoPagoResultCount,
                    });
                    log.audit("searchResultTipoPago", searchResultTipoPago);
                    
                    for (var k = 0; k < searchResultTipoPago.length; k++) {
                        (tipoPago = searchResultTipoPago[k].getValue({ name: "custrecord_ptg_tipo_pago", summary: "GROUP", label: "PTG - Tipo de Pago", })),
                        (sumaPago = searchResultTipoPago[k].getValue({ name: "custrecord_ptg_total", summary: "SUM", label: "PTG - Total", }));
                        log.emergency("Tipo Pago", tipoPago);
                        log.emergency("Suma Pago", sumaPago);
                        sumaPagoPF = parseFloat(sumaPago);
                        
                        
                        if (tipoPago == efectivo) {
                            log.emergency("Efectivo", sumaPago);
                            totalEfectivo += sumaPagoPF;
                            log.emergency("totalEfectivo", totalEfectivo);
                        }
                        if(tipoPago == prepagoBanorte || tipoPago == prepagoTransferencia || tipoPago == prepagoBancomer || tipoPago == prepagoHSBC || tipoPago == prepagoBanamex || tipoPago == prepagoSantander || tipoPago == prepagoScotian){
                            log.emergency("Prepago", sumaPago);
                            totalPrepago += sumaPagoPF;
                            log.emergency("totalPrepago", totalPrepago);
                        }
                        if (tipoPago == creditoCliente) {
                            log.emergency("CreditoCliente", sumaPago);
                            totalCreditoCliente += sumaPagoPF;
                            log.emergency("totalCreditoCliente", totalCreditoCliente);
                        }
                        if (tipoPago == cortesia) {
                            log.emergency("Cortesia", sumaPago);
                            totalCortesia += sumaPagoPF;
                            log.emergency("totalCortesia", totalCortesia);
                        }
                        if (tipoPago == tarjetaCredito || tipoPago == tarjetaCreditoBancomer || tipoPago == tarjetaCreditoHSBC || tipoPago == tarjetaCreditoBanamex) {
                            log.emergency("TarjetaCredito", sumaPago);
                            totalTarjetaCredito += sumaPagoPF;
                            log.emergency("totalTarjetaCredito", totalTarjetaCredito);
                        }
                        if (tipoPago == tarjetaDebito || tipoPago == tarjetaDebitoBanamex || tipoPago == tarjetaDebitoBancomer || tipoPago == tarjetaDebitoHSBC) {
                            log.emergency("TarjetaDebito", sumaPago);
                            totalTarjetaDebito += sumaPagoPF;
                            log.emergency("totalTarjetaDebito", totalTarjetaDebito);
                        } 
                        if (tipoPago == reposicion) {
                            log.emergency("ReposicionPorQueja", sumaPago);
                            totalReposicionPorQueja += sumaPagoPF;
                            log.emergency("totalReposicionPorQueja", totalReposicionPorQueja);
                        }
                        if (tipoPago == bonificacion) {
                            log.emergency("Bonificacion", sumaPago);
                            totalBonificacion += sumaPagoPF;
                            log.emergency("totalBonificacion", totalBonificacion);
                        }
                        if (tipoPago == chequeBancomer || tipoPago == chequeSantander || tipoPago == chequeScotian || tipoPago == chequeHSBC || tipoPago == chequeBanamex || tipoPago == chequeBanorte) {
                            log.emergency("Cheque", sumaPago);
                            totalCheque += sumaPagoPF;
                            log.emergency("totalCheque", totalCheque);
                        }
                        if (tipoPago == transferencia) {
                            log.emergency("Transferencia", sumaPago);
                            totalTransferencia += sumaPagoPF;
                            log.emergency("totalTransferencia", totalTransferencia);
                        }
                        totalTotal += sumaPagoPF;
                        
                    }
                }
                var objTipoPagoUpdate = {
                    custrecord_ptg_efectivo_: totalEfectivo,
                    custrecord_ptg_efectivo_desglosar: totalEfectivo,
                    custrecord_ptg_prepago_: totalPrepago,
                    custrecord_ptg_vale_: totalCreditoCliente,
                    custrecord_ptg_cortesia_: totalCortesia,
                    custrecord_ptg_venta_tarjetacredito_: totalTarjetaCredito,
                    custrecord_ptg_tarjetadebito_: totalTarjetaDebito,
                    custrecord_ptg_reposicion_: totalReposicionPorQueja,
                    custrecord_ptg_bonificacion_: totalBonificacion,
                    custrecord_ptg_cheque_: totalCheque,
                    custrecord_ptg_transferencia_: totalTransferencia,
                    custrecord_ptg_total_total_: totalTotal,
                };
                log.emergency("objTipoPagoUpdate", objTipoPagoUpdate);

                record.submitFields({
                    id: customRec.id,
                    type: customRec.type,
                    values: objTipoPagoUpdate
                });
                
                var totalLitrosVendidos = 0;


                
                //BÚSQUEDA GUARDADA: DRT - PTG - Total Litros Vendidos
                var opportunitySearch = search.create({
                    type: "opportunity",
                    filters: [["custbody_ptg_numero_viaje","anyof", numViaje], "AND", ["entitystatus","anyof",estadoOpClienteConcretado,estadoOpCompra,estadoOpNegociacion,estadoOpConcretado]],
                    columns: [
                        search.createColumn({name: "internalid", label: "ID interno",}),
                        search.createColumn({name: "internalid", join: "item", label: "ID interno",}),
                        search.createColumn({name: "quantity", label: "Cantidad de partida",}),
                    ],
                });
                log.audit("opportunitySearch", opportunitySearch);
                var opportunityResultCount = opportunitySearch.runPaged().count;
                log.audit("Oportunity Result Count", opportunityResultCount);
                var opportunityResult = opportunitySearch.run().getRange({
                    start: 0,
                    end: opportunityResultCount,
                });
                for (var l = 0; l < opportunityResult.length; l++) {
                    (idItem = opportunityResult[l].getValue({name: "internalid", join: "item", label: "ID interno",})),
                    (cantidadOportunidad = opportunityResult[l].getValue({name: "quantity", label: "Cantidad de partida",}));
                    log.audit("Id Item", idItem);
                    log.audit("Cantidad Oportunidad", cantidadOportunidad);
                    if ((idItem) && (idItem == cilindro10 || idItem == cilindro20 || idItem == cilindro30 || idItem == cilindro45)) {
                        var lookupItem = search.lookupFields({
                            type: search.Type.INVENTORY_ITEM,
                            id: idItem,
                            columns: ["custitem_ptg_capacidadcilindro_"],
                        });
                        var cantidadCapacidad = lookupItem.custitem_ptg_capacidadcilindro_ || 0;
                        if (cantidadCapacidad > 0) {
                            var resultCapXCant = cantidadCapacidad * cantidadOportunidad;
                            totalLitrosVendidos = totalLitrosVendidos + resultCapXCant;
                        }
                    }
                    var conversionLitrosVendidos = (totalLitrosVendidos / 0.54).toFixed(2);
                    var objLitrosVendidosUpdate = {
                        custrecord_ptg_totalltsvendidos_: conversionLitrosVendidos,
                    };
                    record.submitFields({
                        id: customRec.id,
                        type: customRec.type,
                        values: objLitrosVendidosUpdate,
                    });
                }
                log.audit("Total litros vendidos", conversionLitrosVendidos);

                //BÚSQUEDA GUARDADA: PTG - Oportunidades a Facturar Cil
                /*var opportunitySearchObj = search.create({
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
                /*for (var s = 0; s < opportunityObjResult.length; s++) {
                    log.audit("*****Entra implementacion "+s+"*****", "*****Entra implementacion "+s+"*****");
                    var parametros = {
                        'recId': recId,
                        'numViaje': numViaje,
                        'incremento_inicio': s,
                    };
                    log.audit("parametros", parametros);
    
                    var redirectToStl = redirect.toSuitelet({
                        scriptId: "customscript_drt_liquidacion_sl",
                        deploymentId: "customdeploy_drt_liquidacion_sl",
                        parameters: parametros
                    });
                    log.audit("redirectToStl", redirectToStl);


                    (idInternoOportunidad = opportunityObjResult[s].getValue({name: "internalid", label: "Internal ID"}));
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
                }*/

                var objUpdateVehiculo = {};
                objUpdateVehiculo.custrecord_ptg_equipo_viaje_activo = false;

                var vehiculoUpdate = record.submitFields({
                    id: vehiculo,
                    type: "customrecord_ptg_equipos",
                    values: objUpdateVehiculo,
                });
                log.debug("Equipo actualizado ", vehiculoUpdate);

                log.audit('Remaining Usage end proceso', runtime.getCurrentScript().getRemainingUsage());

            }


            if (context.type == "edit") {
                log.audit("afterSubmit");
                var customRec = context.newRecord;
                var recId = customRec.id;
                var status = customRec.getValue("custrecord_ptg_liquidacion_status");
                log.audit("recId", recId);
                log.audit("status", status);
                if(status != 4){
                    var params = {
                        custscript_ptg_tipo_servicio_facturas: 1,
                        custscript_ptg_registro_preliquidacion: recId,
                    }
                    log.audit("params", params);

                    var scriptTask = task.create({
						taskType: task.TaskType.MAP_REDUCE
					});
					scriptTask.scriptId = "customscript_ptg_filtro_facturas";
					scriptTask.params = params;
					var scriptTaskId = scriptTask.submit();
                    log.audit("scriptTaskId", scriptTaskId);
                }
            }

        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }

    function beforeSubmit(scriptContext) {
        try {
            if (scriptContext.type == "create") {
                var customRec = scriptContext.newRecord;
                var recId = customRec.id;
                var numLiquidacion = customRec.getValue("custrecord_ptg_folio_preliqui_cil_");
                log.audit("numLiquidacion", numLiquidacion);

                if(!numLiquidacion){
                    log.audit("recId", recId);
                    var cilindrosObj = search.create({
                        type: "customrecord_ptg_preliquicilndros_",
                        filters:[],
                        columns:[]
                    });
                    var cilindrosCount = cilindrosObj.runPaged().count;
                    log.debug("cilindrosCount", cilindrosCount);

                    if(cilindrosCount > 0){
                        cilindrosResultCountPI = parseInt(cilindrosCount);
                        numeroEntero = cilindrosResultCountPI + 1;
                        log.audit("numeroEntero else", numeroEntero);
                        customRec.setValue("custrecord_ptg_folio_preliqui_cil_", numeroEntero.toFixed(0));
                        //customRec.setValue("name", numeroEntero.toFixed(0));
                    } else {
                        customRec.setValue("custrecord_ptg_folio_preliqui_cil_", "1");
                        //customRec.setValue("name", "1");
                    }
                }
            }
        } catch (error) {
            log.error("ERROR", error);
        }
    }
    
    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit,
    };
});