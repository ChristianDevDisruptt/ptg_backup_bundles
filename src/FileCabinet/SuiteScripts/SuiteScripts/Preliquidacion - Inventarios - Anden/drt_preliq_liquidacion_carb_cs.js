/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Preliq liquidacion Carburación CS
 * Script id: customscript_drt_preliq_liq_carb_cs
 * customer Deployment id: customdeploy_drt_preliq_liq_carb_cs
 * Applied to: PTG - Preliquidación EstaciónCarburación
 * File: drt_preliq_liquidacion_carb_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/https', 'N/currentRecord', 'N/url', 'N/ui/message', 'N/ui/dialog', 'N/search', 'N/runtime', 'N/record', 'N/error', 'N/currency', 'N/format'], 
 function (https, currentRecord, url, message, dialog, search, runtime, record, error, currency, format) {
    function pageInit(context){
      try {
        var currentRecord = context.currentRecord;
        var parametroRespuesta = window.location.search;
        log.audit("parametroRespuesta", parametroRespuesta);
        var urlParametro = new URLSearchParams(parametroRespuesta);
        log.audit("urlParametro", urlParametro);
        var parametroEstacion = urlParametro.get('estacion');

        if(parametroEstacion){
          currentRecord.setValue("custrecord_ptg_est_carb_registro_", parametroEstacion);
        }

        var folio = currentRecord.getValue("custrecord_ptg_numliquidacionestcarb_");
        if(!folio){
          var nombre = "Por Asignar";
          currentRecord.setValue("name", nombre);
          currentRecord.setValue("custrecord_ptg_numliquidacionestcarb_", nombre);
        }
        
      } catch (error) {
        
      }
    }
     

    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var cabeceraFieldNam = context.fieldId;
            var cabeceraFieldNa = context.fieldId;
            var fieldId = context.fieldId;
            
            var estacionCarburacion = currentRecord.getValue("custrecord_ptg_est_carb_registro_");
            var totalUltimoCorte1 = currentRecord.getValue("custrecord_ptg_tot_ult_corte_1");
            var totalUltimoCorte2 = currentRecord.getValue("custrecord_ptg_total_ult_corte_2");
            var controlLitros1 = currentRecord.getValue("custrecord_ptg_control_en_lts_1");
            var totalEstaCorte1 = currentRecord.getValue("custrecord_ptg_total_este_corte1_");
            var totalEstaCorte2 = currentRecord.getValue("custrecord_ptg_totalestecorte_2");
            var controlLitros2 = currentRecord.getValue("custrecord_ptg_control_en_lts_2");
            var fechaInicio = currentRecord.getValue("custrecord_ptg_fecha_estcarb_finicio");
            var fechaHoraInicioTXT = currentRecord.getText("custrecord_ptg_fecha_estcarb_finicio");
            var fechaFin = currentRecord.getValue("custrecord_ptg_fecha_estcarb_ffin");
            var fechaHoraFinTXT = currentRecord.getText("custrecord_ptg_fecha_estcarb_ffin");
            var largo = fechaHoraInicioTXT.length;
            var resta = largo - 6;
            var fechaParte1 = fechaHoraInicioTXT.substr(0, resta);
            var fechaParte2 = fechaHoraInicioTXT.substr(-3);
            var fechaInicial = fechaParte1 + fechaParte2;

            if(totalEstaCorte1 && cabeceraFieldName === "custrecord_ptg_total_este_corte1_"){
              totalUltimoCorte1 = parseFloat(currentRecord.getValue("custrecord_ptg_tot_ult_corte_1"));
              var controlLitros = totalEstaCorte1 - totalUltimoCorte1;
              log.audit("controlLitros", controlLitros);
              var litrosTotal = totalUltimoCorte1 - totalEstaCorte1;
              log.audit("litrosTotal", litrosTotal);
              currentRecord.setValue("custrecord_ptg_control_en_lts_1", controlLitros);
              currentRecord.setValue("custrecord_ptg_lts_total_1", litrosTotal);
            }

            if(totalEstaCorte2 && cabeceraFieldName === "custrecord_ptg_totalestecorte_2"){
              totalUltimoCorte2 = parseFloat(currentRecord.getValue("custrecord_ptg_total_ult_corte_2"));
              var controlLitros = totalEstaCorte2 - totalUltimoCorte2;
              log.audit("controlLitros", controlLitros);
              var litrosTotal = totalUltimoCorte2 - totalEstaCorte2;
              log.audit("litrosTotal", litrosTotal);
              currentRecord.setValue("custrecord_ptg_control_en_lts_2", controlLitros);
              currentRecord.setValue("custrecord_ptg_lts_total_2", litrosTotal);
            }

        
            log.audit("PTG - HORA FIN TXT", fechaHoraFinTXT);
            var largoF = fechaHoraFinTXT.length;
            var restaF = largoF - 6;
            var fechaParte1F = fechaHoraFinTXT.substr(0, restaF);
            var fechaParte2F = fechaHoraFinTXT.substr(-3);
            log.debug("fechaParte1F", fechaParte1F);
            log.audit("fechaParte2F", fechaParte2F);
            var fechaFinal = fechaParte1F + fechaParte2F;
            log.audit("fechaFinal", fechaFinal);

            if (estacionCarburacion && !totalUltimoCorte1) {
              var ubicacionObj = record.load({
                id: estacionCarburacion,
                type: search.Type.LOCATION,
              });

              var despachador1 = ubicacionObj.getValue("custrecord_ptg_despachador_");
              var despachador2 = ubicacionObj.getValue("custrecord_ptg_despachador_2_");

              currentRecord.setValue("custrecord_ptg_tot_ult_corte_1", despachador1);
              currentRecord.setValue("custrecord_ptg_total_ult_corte_2", despachador2);

            }
           
            var fechaI = fechaInicial;
            var fechaF = fechaFinal;
            var xx = false;
            var totalEstaCorte;
            log.emergency("xx", xx);
            log.audit("fechaI", fechaI);
            log.audit("fechaF", fechaF);



            var cabeceraFieldName = context.fieldId;
            var milPesos = currentRecord.getValue("custrecord_ptg_billetes1000");
            var quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes500");
            var doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes200");
            var cienPesos = currentRecord.getValue("custrecord_ptg_billetes100");
            var cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes50");
            var veintePesos = currentRecord.getValue("custrecord_ptg_billetes20");
            var diezPesos = currentRecord.getValue("custrecord_ptg_monedas_10_car");
            var cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_5_car");
            var dosPesos = currentRecord.getValue("custrecord_ptg_monedas_2_car");
            var unPeso = currentRecord.getValue("custrecord_ptg_monedas_1_car");
            var cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_50_c_car");
            var veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_20_c_car");
            var diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_10_c_car");
            var unCentavo = currentRecord.getValue("custrecord_ptg_monedas_1_c_car");
            var suma = 0;

            if(((milPesos || !milPesos) && cabeceraFieldName === "custrecord_ptg_billetes1000") || ((quinientosPesos || !quinientosPesos) && cabeceraFieldName === "custrecord_ptg_billetes500") || 
            ((doscientosPesos || !doscientosPesos) && cabeceraFieldName === "custrecord_ptg_billetes200") || ((cienPesos || !cienPesos) && cabeceraFieldName === "custrecord_ptg_billetes100") ||
            ((cincuentaPesos || !cincuentaPesos) && cabeceraFieldName === "custrecord_ptg_billetes50") || ((veintePesos || !veintePesos) && cabeceraFieldName === "custrecord_ptg_billetes20") ||
            ((diezPesos || !diezPesos) && cabeceraFieldName === "custrecord_ptg_monedas_10_car") || ((cincoPesos || !cincoPesos) && cabeceraFieldName === "custrecord_ptg_monedas_5_car") ||
            ((dosPesos || !dosPesos) && cabeceraFieldName === "custrecord_ptg_monedas_2_car") || ((unPeso || !unPeso) && cabeceraFieldName === "custrecord_ptg_monedas_1_car") ||
            ((cincuentaCentavos || !cincuentaCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_50_c_car") || ((veinteCentavos || !veinteCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_20_c_car") ||
            ((diezCentavos || !diezCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_10_c_car") || ((unCentavo || !unCentavo) && cabeceraFieldName === "custrecord_ptg_monedas_1_c_car")){
              milPesos = currentRecord.getValue("custrecord_ptg_billetes1000");
              quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes500");
              doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes200");
              cienPesos = currentRecord.getValue("custrecord_ptg_billetes100");
              cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes50");
              veintePesos = currentRecord.getValue("custrecord_ptg_billetes20");
              diezPesos = currentRecord.getValue("custrecord_ptg_monedas_10_car");
              cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_5_car");
              dosPesos = currentRecord.getValue("custrecord_ptg_monedas_2_car");
              unPeso = currentRecord.getValue("custrecord_ptg_monedas_1_car");
              cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_50_c_car");
              veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_20_c_car");
              diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_10_c_car");
              unCentavo = currentRecord.getValue("custrecord_ptg_monedas_1_c_car");
              multiplicacionMil = milPesos * 1000;
              multiplicacionQuinientos = quinientosPesos * 500;
              multiplicacionDoscientos = doscientosPesos * 200;
              multiplicacionCien = cienPesos * 100;
              multiplicacionCincuenta = cincuentaPesos * 50
              multiplicacionVeinte = veintePesos * 20
              multiplicacionDiez = diezPesos * 10
              multiplicacionCinco = cincoPesos * 5
              multiplicacionDos = dosPesos * 2
              multiplicacionUno = unPeso * 1
              multiplicacionCinCen = cincuentaCentavos * 0.5;
              multiplicacionVeiCen = veinteCentavos * 0.2;
              multiplicacionDieCen = diezCentavos * 0.1;
              multiplicacionUnCen = unCentavo * 0.01;
              suma = multiplicacionMil + multiplicacionQuinientos + multiplicacionDoscientos + multiplicacionCien + multiplicacionCincuenta + multiplicacionVeinte + multiplicacionDiez + multiplicacionCinco + multiplicacionDos + multiplicacionUno + multiplicacionCinCen + multiplicacionVeiCen + multiplicacionDieCen + multiplicacionUnCen;
              currentRecord.setValue("custrecord_ptg_total_car", suma);
            }





        } catch (error) {
            console.log({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }


    function saveRecord(context) {
      try {
        var currentRecord = context.currentRecord;
        var estacionCarburacion = currentRecord.getValue("custrecord_ptg_est_carb_registro_");
        var montoTotalizador = currentRecord.getValue("custrecord_ptg_total_car");
        var efectivoDetalle = currentRecord.getValue("custrecord_ptg_efectivo_est_carb_");
        var estatus = currentRecord.getValue("custrecord_ptg_liquidacion_status_carb");
        var montoTotalizador = currentRecord.getValue("custrecord_ptg_total_car");
        var fechaHoraInicioTXT = currentRecord.getText("custrecord_ptg_fecha_estcarb_finicio");
        var fechaHoraFinTXT = currentRecord.getText("custrecord_ptg_fecha_estcarb_ffin");
        var largo = fechaHoraInicioTXT.length;
        var resta = largo - 6;
        var fechaParte1 = fechaHoraInicioTXT.substr(0, resta);
        log.audit("fechaParte1", fechaParte1);
        var fechaParte2 = fechaHoraInicioTXT.substr(-3);
        log.audit("fechaParte2", fechaParte2);
        var fechaInicial = fechaParte1 + fechaParte2;
        log.audit("fechaInicial", fechaInicial);
        var largoF = fechaHoraFinTXT.length;
        var restaF = largoF - 6;
        var fechaParte1F = fechaHoraFinTXT.substr(0, restaF);
        log.audit("fechaParte1F", fechaParte1F);
        var fechaParte2F = fechaHoraFinTXT.substr(-3);
        var fechaFinal = fechaParte1F + fechaParte2F;
        var estatusPreliquidacion = 0;
        var estatusLiquidacion = 0;
        var estatusEjecutado = 0;
        var estatusFacturacion = 0;
        var gasLP = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusPreliquidacion = 1;
          estatusLiquidacion = 2;
          estatusEjecutado = 3;
          estatusFacturacion = 4;
          gasLP = 4088;

        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusPreliquidacion = 1;
          estatusLiquidacion = 2;
          estatusEjecutado = 3;
          estatusFacturacion = 4;
          gasLP = 4216;
        }

        if(estatus == estatusLiquidacion){
          if (montoTotalizador > 0 || montoTotalizador != "") {
            return true;
          } else {
            var options = {
              title: "Desglose de efectivo",
              message: "Debe ingresar una cantidad para el desglose de efectivo ",
            };
            dialog.alert(options);
          }
        } else if(estatus == estatusPreliquidacion){
          var corteVentas = 0;
          var corteTraspaso = 0;
          var bomba1 = 0;
          var bomba2 = 0;
          var controlLitros1 = currentRecord.getValue("custrecord_ptg_control_en_lts_1") || 0;
          var controlLitros2 = currentRecord.getValue("custrecord_ptg_control_en_lts_2") || 0;
          for (var i = 1; i < 3; i++) {
            //SS: PTG - Oportunidad Carburacion
            var cortesObj = search.create({
              type: "transaction",
              filters: [
                ["type", "anyof", "Opprtnty"], "AND",
                ["probability", "equalto", "100"], "AND",
                ["custbody_ptg_estacion_carburacion", "anyof", estacionCarburacion,], "AND",
                //["datecreated", "within", fechaInicial, fechaFinal], "AND",
                ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaInicial, fechaFinal], "AND",
                ["mainline", "is", "F"], "AND",
                ["taxline", "is", "F"], "AND",
                ["custbody_ptg_bomba_despachadora", "anyof", i], "AND", 
                ["custbody_ptg_liquidado","is","F"], "AND", 
                ["item","anyof",gasLP]
              ],
              columns: [
                search.createColumn({name: "quantity",summary: "SUM",label: "Cantidad",}),
              ],
            });
            var cortesObjResultCount = cortesObj.runPaged().count;
            if(cortesObjResultCount > 0){
              var cortesObjResult = cortesObj.run().getRange({
                start: 0,
                end: 2,
              });
              corteVentas = parseFloat(cortesObjResult[0].getValue({name: "quantity",summary: "SUM",label: "Cantidad",})) || 0;
            }
            log.audit("cortesObjResult", cortesObjResult);
            log.audit("corteVentas "+i, corteVentas);
            
            var corteOrdenObj = search.create({
              type: "transferorder",
              filters: [
                 ["type","anyof","TrnfrOrd"], "AND", 
                 ["custbody_ptg_bomba_despachadora","anyof",i], "AND", 
                 ["mainline","is","F"], "AND", 
                 ["custbody_ptg_liquidado","is","F"], "AND", 
                 ["location","anyof",estacionCarburacion], "AND", 
                 //["datecreated","within",fechaInicial,fechaFinal]
                 ["custbody_ptg_fecha_hora_servicio_carb", "within", fechaInicial, fechaFinal]
              ],
              columns: [
                 search.createColumn({name: "transferorderquantityreceived", summary: "SUM", label: "Cantidad recibida de la orden de traslado"})
              ]
            });
            var corteOrdenObjCount = corteOrdenObj.runPaged().count;
            if(corteOrdenObjCount > 0){
              var corteOrdenObjResult = corteOrdenObj.run().getRange({
                start: 0,
                end: 2,
              });
              corteTraspaso = parseFloat(corteOrdenObjResult[0].getValue({name: "transferorderquantityreceived", summary: "SUM", label: "Cantidad recibida de la orden de traslado",}))||0;
            }
            log.audit("corteTraspaso "+i, corteTraspaso);

            if (i == 1) {
              bomba1 = corteVentas + corteTraspaso;
            } else if (i == 2) {
              bomba2 = corteVentas + corteTraspaso;
            }
          }

          log.audit("bomba1", bomba1);
          log.audit("controlLitros1", controlLitros1);
          log.audit("bomba2", bomba2);
          log.audit("controlLitros2", controlLitros2);
          if(bomba1 === controlLitros1 && bomba2 === controlLitros2){
            currentRecord.setValue("custrecord_ptg_fecha_iniciof",fechaInicial);
            currentRecord.setValue("custrecord_ptg_fecha_finf",fechaFinal);
            return true;
          } else {
            var options = {
              title: "Control de litros",
              message: "El control de litros no coincide",
            };
            dialog.alert(options);
            return false;
          }

        } else {
          return true;
        }


      } catch (error) {
        console.log({
          title: "error fieldChanged",
          details: JSON.stringify(error),
        });
      }
    }
     

    function redirectTo() {
        try {
          log.audit("redirectTo cs");

          var formularioLiquidacion = 0;
          var estatusLiquidacion = 0;
          
          if (runtime.envType === runtime.EnvType.SANDBOX) {
            formularioLiquidacion = 205;
            estatusLiquidacion = 2;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            formularioLiquidacion = 201;
            estatusLiquidacion = 2;
          }

            const newForm = formularioLiquidacion;

            recObj = currentRecord.get();
            console.log("recObj", recObj);
            log.debug("recObj", recObj);
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status_carb : estatusLiquidacion}
            })

            recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {customform : newForm}
            })
            recObj.save()

            var urll = location;
            log.debug("urll", urll);

            var urlll = location.href;
            log.audit("urlll", urlll);

            var url = location.href + "&cf=" + newForm;
            log.debug('url_1', url);
            location.replace(url);

        } catch (e) {
            log.error("Error", "[ redirectTo ] " + e);
        }

    };

    function redirectToFacturacion() {
      try {
        log.audit("redirectToFacturacion cs");
        var formularioLiquidacion = 0;
        var estatusEjecutado = 0;
          
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          formularioLiquidacion = 205;
          estatusEjecutado = 3;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioLiquidacion = 201;
          estatusEjecutado = 3;
        }

          const newForm = formularioLiquidacion;
          
          recObj = currentRecord.get();
          console.log("recObj", recObj);
          log.debug("recObj", recObj);
         

          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_liquidacion_status_carb : estatusEjecutado}
          })

          recObj = record.load({
              type: recObj.type,
              id: recObj.id,
              defaultValues: {customform : newForm}
          })
          recObj.save()

          var urll = location;
            log.debug("urll_2", urll);

            var urlll = location.href;
            log.audit("urlll_2", urlll);

          var url = location.href + "&cf=" + newForm;
          log.debug('url_2', url);
          location.replace(url);
      } catch (e) {
          log.error("Error", "[ redirectTo ] " + e);
      }

  };


  function facturarOportunidad(){
    try {
      log.audit("facturar Oportunidad cs");

      var button = document.getElementById('custpage_drt_to_facturacion');
      console.log("button", button);
      log.audit("button", button);

      log.audit("facturar Oportunidad cs PT1");
      recObj = currentRecord.get();
          console.log("recObj", recObj);
      var recordObj = record.load({
        type: recObj.type,
        id: recObj.id
      });

      var responsable = recordObj.getValue("custrecord_ptg_responsable_estcarb_");
      log.emergency("responsable", responsable);
      var totalEsteCorte1 = recordObj.getValue("custrecord_ptg_total_este_corte1_");
      log.emergency("totalEsteCorte1", totalEsteCorte1);
      var totalEsteCorte2 = recordObj.getValue("custrecord_ptg_totalestecorte_2");
      log.emergency("totalEsteCorte2", totalEsteCorte2);
      var estacionCarburacion = recordObj.getValue("custrecord_ptg_est_carb_registro_");
      log.emergency("estacionCarburacion", estacionCarburacion);

      var objUpdLocation = {
        custrecord_ptg_despachador_: totalEsteCorte1,
        custrecord_ptg_despachador_2_: totalEsteCorte2,
      };
      log.emergency("objUpdLocation", objUpdLocation);

      var updLocation = record.submitFields({
        id: estacionCarburacion,
        type: record.Type.LOCATION,
        values: objUpdLocation
      });
      log.emergency("updLocation", updLocation);
      

      var urlStlt = url.resolveScript({
          scriptId: "customscript_drt_ptg_factur_opor_carb_sl",
          deploymentId: "customdeploy_drt_ptg_factur_opor_carb_sl",
          returnExternalUrl: false
      });

    log.emergency("urlStlt", urlStlt);
      https.get({
          url: urlStlt+'&id='+currentRecord.get().id
      })

      log.audit("lookupRecord", recordObj);

      log.audit("facturar Oportunidad cs PT2");

      resultadoFactura();

  } catch (e) {
      log.error("Error", "[ invoice ] " + e);
  }
  };



  function resultadoFactura(){
    try {
      log.audit("facturar cambio pestana facturar");

      var formularioLiquidacion = 0;
      var estatusFacturacion = 0;
      var limiteURL = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioLiquidacion = 205;
        estatusFacturacion = 4;
        limiteURL = 100;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioLiquidacion = 201;
        estatusFacturacion = 4;
        limiteURL = 100;
      }
      

            const newFormF = formularioLiquidacion;

            recObj = currentRecord.get();
            console.log("recObj", recObj);
            log.debug("recObj", recObj);
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status_carb : estatusFacturacion}
            })

            recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {customform : newFormF}
            })
            recObj.save()

            var str = location.href;
            log.debug("ssttrr", str);

            var newStr = str.substr(0, limiteURL);
            log.debug("newStr", newStr);

            var url = location.href + "&cf=" + newFormF;
            log.debug('url_3', url);
            location.replace(url);


            log.audit("facturar Oportunidad cs PT3");


  } catch (e) {
      log.error("Error", "[ invoice ] " + e);
  }
  }

  function borrarDesglose(){
    try {
      log.audit("Borrar desglose");
      recObj = currentRecord.get();
      log.audit("Borrar desglose recObj", recObj);
      
      var vacio = "";

      recObj.setValue("custrecord_ptg_total_car", vacio);
      recObj.setValue("custrecord_ptg_billetes1000", vacio);
      recObj.setValue("custrecord_ptg_billetes500", vacio);
      recObj.setValue("custrecord_ptg_billetes200", vacio);
      recObj.setValue("custrecord_ptg_billetes100", vacio);
      recObj.setValue("custrecord_ptg_billetes50", vacio);
      recObj.setValue("custrecord_ptg_billetes20", vacio);
      recObj.setValue("custrecord_ptg_monedas_10_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_5_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_2_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_1_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_50_c_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_20_c_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_10_c_car", vacio);
      recObj.setValue("custrecord_ptg_monedas_1_c_car", vacio);

    } catch (error) {
      log.error("error borrarDesglose", error);
    }
  }

  function redirectToAprobar() {
    try {
      log.audit("redirectToAprobar cs");

        recObj = currentRecord.get();
        log.debug("recObj", recObj);

        
        record.submitFields({
            type: recObj.type,
            id: recObj.id,
            values: {custrecord_ptg_conteo_exceso_preliq_carb : 0}
        });

        var urll = location;
        log.debug("urll", urll);

        var urlll = location.href;
        log.audit("urlll", urlll);

        var url = location.href;
        log.debug('url_1', url);
        location.replace(url);

    } catch (e) {
        log.error("Error", "[ redirectToAprobar ] " + e);
    }

};

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        redirectTo: redirectTo,
        redirectToFacturacion: redirectToFacturacion,
        facturarOportunidad: facturarOportunidad,
        saveRecord: saveRecord,
        borrarDesglose: borrarDesglose,
        redirectToAprobar: redirectToAprobar,
    };
});