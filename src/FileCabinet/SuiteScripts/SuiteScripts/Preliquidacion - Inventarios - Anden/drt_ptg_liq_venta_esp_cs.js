/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Liquidación Viaje especial CS
 * Script id: customscript_drt_ptg_liq_venta_esp_cs
 * customer Deployment id: customdeploy_drt_ptg_liq_venta_esp_cs
 * Applied to: PTG - Liquidación Viaje especial
 * File: drt_ptg_liq_venta_esp_cs.js
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
          log.audit("nombre33", nombre);
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
    var currentRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var sublistFieldName = context.fieldId;
    var fieldName = context.fieldId;
    var line = context.line;
    var cliente = currentRecord.getValue("custrecord_ptg_cliente");
    var sublistaArticuloAVender = "recmachcustrecord_ptg_vta_esp_";
    var importe = 0;
    var total = 0;
    
    if ((sublistName === sublistaArticuloAVender && sublistFieldName === 'custrecord_ptg_lts_vendidos_vta_esp_') || 
    (sublistName === sublistaArticuloAVender && sublistFieldName === 'custrecord_ptg_pu_vta_esp_')){

      var cantidad = currentRecord.getCurrentSublistValue({
        sublistId: sublistaArticuloAVender,
        fieldId: 'custrecord_ptg_lts_vendidos_vta_esp_',
      });

      var precioUnitario = currentRecord.getCurrentSublistValue({
        sublistId: sublistaArticuloAVender,
        fieldId: 'custrecord_ptg_pu_vta_esp_'
      });

      if((cantidad)&&(precioUnitario)){
        var cantidadPF = parseFloat(cantidad);
        var precioUnitarioPF = parseFloat(precioUnitario);

        importe = cantidadPF * precioUnitarioPF;
        log.audit("importe", importe);

        var importePF = parseFloat(importe);
        total = importePF * 0.16;
        totalFinal = importe + total;

        currentRecord.setCurrentSublistValue({
          sublistId: sublistaArticuloAVender,
          fieldId: 'custrecord_ptg_importe_',
          value: importe
        });

        currentRecord.setCurrentSublistValue({
          sublistId: sublistaArticuloAVender,
          fieldId: 'custrecord_ptg_impuesto_vta_esp_',
          value: total
        });

        currentRecord.setCurrentSublistValue({
          sublistId: sublistaArticuloAVender,
          fieldId: 'custrecord_ptg_total_vta_esp_',
          value: totalFinal
        });
      }
      
    }
  }

  function validateLine(context) {
    try{
    var currentRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var idRegistroDeServicios = "recmachcustrecord_ptg_vta_esp_";
    var tarjetaCreditoId = 0;
    var tarjetaDebitoId = 0;
    var tarjetaCreditoBancomerId = 0;
    var tarjetaCreditoHSBCId = 0;
    var tarjetaCreditoBanamexId = 0;
    var tarjetaDebitoBanamexId = 0;
    var tarjetaDebitoBancomerId = 0;
    var tarjetaDebitoHSBCId = 0;

    if (runtime.envType === runtime.EnvType.SANDBOX) {
      tarjetaCreditoId = 5;
      tarjetaDebitoId = 6;
    } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
      tarjetaCreditoId = 5;
      tarjetaDebitoId = 6;
      tarjetaCreditoBancomerId = 31;
      tarjetaCreditoHSBCId = 32;
      tarjetaCreditoBanamexId = 33;
      tarjetaDebitoBanamexId = 34;
      tarjetaDebitoBancomerId = 35;
      tarjetaDebitoHSBCId = 36;
    }

    if (sublistName === idRegistroDeServicios) {
       var clienteServ = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cliente_vta_esp_",});
       var cantidadServ = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_lts_vendidos_vta_esp_",});
       var precioUnitarioServ = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_pu_vta_esp_",});
       var referenciaServ = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_referencia_vta_esp_det_",});
       var formaPagoServ = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_formapago_det_vta_esp_",});
      
      log.debug("clienteServ", clienteServ);
      log.debug("cantidadServ", cantidadServ);
      log.debug("precioUnitarioServ", precioUnitarioServ);
      log.debug("formaPagoServ", formaPagoServ);

      if (!clienteServ ||  !cantidadServ || !precioUnitarioServ || !formaPagoServ){
        var options = {
          title: "Faltan datos",
          message: "Faltan datos en la línea",
        };
        dialog.alert(options);
        return false;
      } else {
        log.audit("DATOS OK");
        if((formaPagoServ == tarjetaCreditoId || formaPagoServ == tarjetaDebitoId || formaPagoServ == tarjetaCreditoBancomerId || formaPagoServ == tarjetaCreditoHSBCId || formaPagoServ == tarjetaCreditoBanamexId || formaPagoServ == tarjetaDebitoBanamexId || formaPagoServ == tarjetaDebitoBancomerId || formaPagoServ == tarjetaDebitoHSBCId) && !referenciaServ){
          var options = {
            title: "Faltan datos",
            message: "Falta agregar referencia al pago",
          };
          dialog.alert(options);
          return false;
        } else {
          return true;
        }
        
      }
    }
  } catch (error) {
    log.error({
        title: "error validateLine",
        details: JSON.stringify(error),
    });
}
  }


  function lineInit(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var idRegistroDeServicios = 'recmachcustrecord_ptg_vta_esp_';
      var planta = currentRecord.getValue("custrecord_ptg_planta_vta_especial_");
      log.audit("planta", planta);
    } catch (error) {
      log.error("Error lineInit", error);
    }
  }


    return {
        lineInit: lineInit,
        fieldChanged: fieldChanged,
        validateLine: validateLine,
        

    };
});