/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - PAGOS EN ANDEN CS
 * Script id: customscript_drt_ptg_pagos_anden_cs
 * customer Deployment id: customdeploy_drt_ptg_pagos_anden_cs
 * Applied to: PTG - PAGOS EN ANDEN
 * File: drt_ptg_pagos_anden_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function pageInit(context) {
        try {
          var currentRecord = context.currentRecord;
          var idPagoAnden = currentRecord.getValue("custrecord_ptg_pago_anden_relacion");
          var vendedor = currentRecord.getValue("custrecord_ptg_vendedor_anden_para_pagos");
          var folio = currentRecord.getValue("custrecord_ptg_folio_venta_anden");
          //if((!vendedor) && (!folio)){
          if(!folio){
            var ventaAndenObj = record.load({
              type: "customrecord_ptg_venta_anden",
              id: idPagoAnden,
            });
            var folioVA = ventaAndenObj.getValue("custrecord_ptg_folio_anden");
            var vendedorVA = ventaAndenObj.getValue("custrecord_ptg_vendedor_anden");
            var fechaVA = ventaAndenObj.getValue("custrecord_ptg_fecha_venta_anden");
            var clienteVA = ventaAndenObj.getValue("custrecord_ptg_cliente");
            var totalVA = ventaAndenObj.getValue("custrecord_ptg_totalizador_venta_anden");
  
            currentRecord.setValue("custrecord_ptg_vendedor_anden_para_pagos", vendedorVA);
            currentRecord.setValue("custrecord7", fechaVA);
            currentRecord.setValue("custrecordptg_cliente_venta_anden", clienteVA);
            currentRecord.setValue("custrecord_ptg_total_venta_anden", totalVA);
            currentRecord.setValue("custrecord_ptg_folio_venta_anden", folioVA);
          }

        } catch (error) {
          console.log({
            title: "error pageInit",
            details: JSON.stringify(error),
          });
        }
    }


    function saveRecord(context) {
      try {
        var currentRecord = context.currentRecord;
        var totalServicio = currentRecord.getValue("custrecord_ptg_total_venta_anden");
        var cobroEfectivo = currentRecord.getValue("custrecord_ptg_cobro_efectivo_anden");
        var totalizador = currentRecord.getValue("custrecord_ptg_totalizador_anden");
        var sublistaTiposDePagos = "recmachcustrecord_ptg_pago_anden_detalle";
        var lineas = currentRecord.getLineCount({sublistId: sublistaTiposDePagos,});
        var total = 0;
        var totalEfectivo = 0;
        var efectivo = false;
        var pagoEfectivo = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          pagoEfectivo = 1;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          pagoEfectivo = 1;
        }
        log.audit("totalServicio", totalServicio);
        log.audit("cobroEfectivo", cobroEfectivo);
        log.audit("totalizador", totalizador);
        for (var i = 0; i < lineas; i++) {
          var tipoPago = currentRecord.getSublistValue({
            sublistId: sublistaTiposDePagos,
            fieldId: "custrecord_ptg_tipo_pago_anden",
            line: i,
          });

          var totalLinea = currentRecord.getSublistValue({
            sublistId: sublistaTiposDePagos,
            fieldId: "custrecord_ptg_total_detalle",
            line: i,
          });

          if(tipoPago == pagoEfectivo){
            totalEfectivo += totalLinea;
            efectivo = true;
          }
          total = total + totalLinea;
        }

        if (totalServicio == total) {
          if(efectivo){
            if(cobroEfectivo){
              if (totalEfectivo == totalizador) {
                return true;
              } else {
                var options = {
                  title: "Totizador no coincide",
                  message: "El campo PTG - TOTALIZADOR (" + totalizador + ") no coincide con el total de venta en efectivo (" + totalEfectivo + ").",
                };
                dialog.alert(options);
              }
            } else {
              var options = {
                title: "Ingresar cantidad de efectivo",
                message: "Dentro de las líneas hay efectivo que debe ser registrado",
              };
              dialog.alert(options);
            }
          }
        } else {
          var options = {
            title: "Totales no coinciden",
            message: "La suma del total de las líneas " + total + " no coincide con la cantidad total " + totalServicio,
          };
          dialog.alert(options);
        }

        

      } catch (error) {
        console.log({
          title: "error saveRecord",
          details: JSON.stringify(error),
        });
      }
    }
  
    function validateLine(context) {
      try {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistaTiposDePagos = "recmachcustrecord_ptg_pago_anden_detalle";
        if (sublistName === sublistaTiposDePagos) {
          if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_total_detalle",}) && 
          currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_tipo_pago_anden",})) {
            return true;
          }
        }
      } catch (error) {
        console.log({
          title: "error validateLine",
          details: JSON.stringify(error),
        });
      }
    }

    function fieldChanged(context) {
      try {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var cabeceraFieldName = context.fieldId;
        var cobroEfectivo = currentRecord.getValue("custrecord_ptg_cobro_efectivo_anden");
        var milPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_1000");
        var quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_500");
        var doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_200");
        var cienPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_100");
        var cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_50");
        var veintePesos = currentRecord.getValue("custrecord_ptg_billetes_anden_20");
        var diezPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_10");
        var cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_5");
        var dosPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_2");
        var unPeso = currentRecord.getValue("custrecord_ptg_monedas_anden_1");
        var cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_50_centavos");
        var veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_20_centavos");
        var diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_10_centavos");
        var unCentavo = currentRecord.getValue("custrecord_ptg_monedas_anden_1_centavo");
        var suma = 0;

        if(cobroEfectivo){
          if ((milPesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_1000") || (quinientosPesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_500") ||
          (doscientosPesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_200") || (cienPesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_100") ||
          (cincuentaPesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_50") || (veintePesos && cabeceraFieldName === "custrecord_ptg_billetes_anden_20") ||
          (diezPesos && cabeceraFieldName === "custrecord_ptg_monedas_anden_10") || (cincoPesos && cabeceraFieldName === "custrecord_ptg_monedas_anden_5") ||
          (dosPesos && cabeceraFieldName === "custrecord_ptg_monedas_anden_2") || (unPeso && cabeceraFieldName === "custrecord_ptg_monedas_anden_1") ||
          (cincuentaCentavos && cabeceraFieldName === "custrecord_ptg_monedas_anden_50_centavos") || (veinteCentavos && cabeceraFieldName === "custrecord_ptg_monedas_anden_20_centavos") ||
          (diezCentavos && cabeceraFieldName === "custrecord_ptg_monedas_anden_10_centavos") || (unCentavo && cabeceraFieldName === "custrecord_ptg_monedas_anden_1_centavo")
        ) {
          milPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_1000");
          quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_500");
          doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_200");
          cienPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_100");
          cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_anden_50");
          veintePesos = currentRecord.getValue("custrecord_ptg_billetes_anden_20");
          diezPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_10");
          cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_5");
          dosPesos = currentRecord.getValue("custrecord_ptg_monedas_anden_2");
          unPeso = currentRecord.getValue("custrecord_ptg_monedas_anden_1");
          cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_50_centavos");
          veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_20_centavos");
          diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_anden_10_centavos");
          unCentavo = currentRecord.getValue("custrecord_ptg_monedas_anden_1_centavo");
          multiplicacionMil = milPesos * 1000;
          multiplicacionQuinientos = quinientosPesos * 500;
          multiplicacionDoscientos = doscientosPesos * 200;
          multiplicacionCien = cienPesos * 100;
          multiplicacionCincuenta = cincuentaPesos * 50;
          multiplicacionVeinte = veintePesos * 20;
          multiplicacionDiez = diezPesos * 10;
          multiplicacionCinco = cincoPesos * 5;
          multiplicacionDos = dosPesos * 2;
          multiplicacionUno = unPeso * 1;
          multiplicacionCinCen = cincuentaCentavos * 0.5;
          multiplicacionVeiCen = veinteCentavos * 0.2;
          multiplicacionDieCen = diezCentavos * 0.1;
          multiplicacionUnCen = unCentavo * 0.01;
          suma = multiplicacionMil + multiplicacionQuinientos + multiplicacionDoscientos + multiplicacionCien + multiplicacionCincuenta + 
          multiplicacionVeinte + multiplicacionDiez + multiplicacionCinco + multiplicacionDos + multiplicacionUno + multiplicacionCinCen + 
          multiplicacionVeiCen + multiplicacionDieCen + multiplicacionUnCen;
          currentRecord.setValue("custrecord_ptg_totalizador_anden", suma);
        }
        } else if(!cobroEfectivo && cabeceraFieldName === "custrecord_ptg_cobro_efectivo_anden"){
        currentRecord.setValue("custrecord_ptg_billetes_anden_1000","");
        currentRecord.setValue("custrecord_ptg_billetes_anden_500","");
        currentRecord.setValue("custrecord_ptg_billetes_anden_200","");
        currentRecord.setValue("custrecord_ptg_billetes_anden_100","");
        currentRecord.setValue("custrecord_ptg_billetes_anden_50","");
        currentRecord.setValue("custrecord_ptg_billetes_anden_20","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_10","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_5","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_2","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_1","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_50_centavos","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_20_centavos","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_10_centavos","");
        currentRecord.setValue("custrecord_ptg_monedas_anden_1_centavo","");
        currentRecord.setValue("custrecord_ptg_totalizador_anden","");
        }
      } catch (error) {
        console.log({
          title: "error fieldChanged",
          details: JSON.stringify(error),
        });
      }
    }

  
    return {
      pageInit: pageInit,
      fieldChanged: fieldChanged,
      validateLine: validateLine,
      saveRecord: saveRecord,
      
    };
  });
