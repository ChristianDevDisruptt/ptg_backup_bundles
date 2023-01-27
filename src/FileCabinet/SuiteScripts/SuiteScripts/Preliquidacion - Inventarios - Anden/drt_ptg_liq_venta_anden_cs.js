/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - LIQUIDACION VENTA ANDEN CS
 * Script id: customscript_drt_ptg_liq_venta_anden_cs
 * customer Deployment id: customdeploy_drt_ptg_liq_venta_anden_cs
 * Applied to: PTG - LIQUIDACION VENTA ANDEN
 * File: drt_ptg_liq_venta_anden_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/https', 'N/currentRecord', 'N/url', 'N/ui/message', 'N/ui/dialog', 'N/search', 'N/runtime', 'N/record', 'N/error', 'N/currency', 'N/format'], 
 function (https, currentRecord, url, message, dialog, search, runtime, record, error, currency, format) {
  function pageInit(context) {
    try {
        debugger;
        var currentRecord = context.currentRecord;
        var nombre = "Por Asignar";
        log.audit("nombre", nombre);
        var registroNombre = currentRecord.getValue("name");
        if(!registroNombre){
          log.audit("nombre2", nombre);
          currentRecord.setValue("name", nombre);
        }

    } catch (error) {
        console.log({
            title: "error pageInit",
            details: JSON.stringify(error),
        });
    }
}

    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var milPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_1000");
            var quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_500");
            var doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_200");
            var cienPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_100");
            var cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_50");
            var veintePesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_20");
            var diezPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_10");
            var cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_5");
            var dosPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_2");
            var unPeso = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_1");
            var cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_50_cent");
            var veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_20_cent");
            var diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_10_cent");
            var unCentavo = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_1_cent");
            var suma = 0;
            var fechaInicio = currentRecord.getValue("custrecord_ptg_fecha_liq_anden");
            var fechaFin = currentRecord.getValue("custrecord_ptg_fecha_fin_liq_anden");

            if(((milPesos || !milPesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_1000") || ((quinientosPesos || !quinientosPesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_500") || 
            ((doscientosPesos || !doscientosPesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_200") || ((cienPesos || !cienPesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_100") ||
            ((cincuentaPesos || !cincuentaPesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_50") || ((veintePesos || !veintePesos) && cabeceraFieldName === "custrecord_ptg_billetes_anden_liq_20") ||
            ((diezPesos || !diezPesos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_10") || ((cincoPesos || !cincoPesos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_5") ||
            ((dosPesos || !dosPesos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_2") || ((unPeso || !unPeso) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_1") ||
            ((cincuentaCentavos || !cincuentaCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_50_cent") || ((veinteCentavos || !veinteCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_20_cent") ||
            ((diezCentavos || !diezCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_10_cent") || ((unCentavo || !unCentavo) && cabeceraFieldName === "custrecord_ptg_monedas_anden_liq_1_cent")){
              milPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_1000");
              quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_500");
              doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_200");
              cienPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_100");
              cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_50");
              veintePesos = currentRecord.getValue("custrecord_ptg_billetes_anden_liq_20");
              diezPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_10");
              cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_5");
              dosPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_2");
              unPeso = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_1");
              cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_50_cent");
              veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_20_cent");
              diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_10_cent");
              unCentavo = currentRecord.getValue("custrecord_ptg_monedas_anden_liq_1_cent");
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
              currentRecord.setValue("custrecord_ptg_total_anden_liq", suma);
            }

            if(fechaInicio && cabeceraFieldName === "custrecord_ptg_fecha_liq_anden"){
              log.audit("fechaInicio", fechaInicio);
              var fechaInicioTXT = currentRecord.getText("custrecord_ptg_fecha_liq_anden");
              log.audit("fechaInicioTXT", fechaInicioTXT);
            }

            if(fechaFin && cabeceraFieldName === "custrecord_ptg_fecha_fin_liq_anden"){
              log.audit("fechaFin", fechaFin);
              var fechaFinTXT = currentRecord.getText("custrecord_ptg_fecha_fin_liq_anden");
              log.audit("fechaFinTXT", fechaFinTXT);
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
        var totalDesgloseEfectivo = currentRecord.getValue("custrecord_ptg_total_anden_liq");
        var efectivoTotales = currentRecord.getValue("custrecord_ptg_total_efectivo_liq_anden");
        log.debug("totalDesgloseEfectivo", totalDesgloseEfectivo);
        log.debug("efectivoTotales", efectivoTotales);
if(efectivoTotales){
        if (totalDesgloseEfectivo) {
        //if (totalDesgloseEfectivo == efectivoTotales) {
          log.audit("total dentro if");
          return true;
        } else {
          log.audit("total else");
          var options = {
            title: "Totales no coinciden",
            //message: "La suma de PTG - TOTAL " + totalDesgloseEfectivo + " no coincide con la cantidad de PTG - TOTAL EN EFECTIVO " + efectivoTotales,
            message: "Se debe ingresar el desglose de efectivo",
          };
          dialog.alert(options);
        }
      } else {
        return true;
      }
      } catch (error) {
        console.log({
          title: "error saveRecord",
          details: JSON.stringify(error),
        });
      }
    }


  function facturarVentaAnden(){
    try {
      log.audit("facturar ventas anden cs");

      var button = document.getElementById('custpage_drt_to_facturar');
      console.log("button", button);
      log.audit("button", button);

      log.audit("facturar Oportunidad cs PT1");

      var urlStlt = url.resolveScript({
          scriptId: "customscript_drt_ptg_factur_ven_ande_sl",
          deploymentId: "customdeploy_drt_ptg_factur_ven_ande_sl",
          returnExternalUrl: false
      });
      https.get({
          url: urlStlt+'&id='+currentRecord.get().id
      })

      recObj = currentRecord.get();
          console.log("recObj", recObj);
      var recordObj = record.load({
        type: recObj.type,
        id: recObj.id
      });
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
      var estatusFacturacionAnden = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusFacturacionAnden = 4;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusFacturacionAnden = 4;
      }

            recObj = currentRecord.get();
            console.log("recObj", recObj);
            log.debug("recObj", recObj);

            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_status_liq_anden : estatusFacturacionAnden}
            })

            recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {}
            })
            recObj.save()

            var url = location.href;
            log.debug('url_3', url);
            location.replace(url);
  
  } catch (e) {
      log.error("Error", "[ invoice ] " + e);
  }
  };

  function borrarDesglose(){
    log.audit("Borrar desglose");
    recObj = currentRecord.get();
    log.audit("Borrar desglose recObj", recObj);

    var vacio = "";

    recObj.setValue("custrecord_ptg_total_anden_liq", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_1000", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_500", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_200", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_100", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_50", vacio);
    recObj.setValue("custrecord_ptg_billetes_anden_liq_20", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_10", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_5", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_2", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_1", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_50_cent", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_20_cent", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_10_cent", vacio);
    recObj.setValue("custrecord_ptg_monedas_anden_liq_1_cent", vacio);

  }

    return {
        fieldChanged: fieldChanged,
        pageInit: pageInit,
        //redirectTo: redirectTo,
        //redirectToFacturacion: redirectToFacturacion,
        facturarVentaAnden: facturarVentaAnden,
        saveRecord: saveRecord,
        borrarDesglose: borrarDesglose,

    };
});