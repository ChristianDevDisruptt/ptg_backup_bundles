/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Liquidación Viaje especial UE
 * Script id: customscript_drt_ptg_liq_venta_esp_ue
 * customer Deployment id: customdeploy_drt_ptg_liq_venta_esp_ue
 * Applied to: PTG - Liquidación viaje especial
 * File: drt_ptg_liq_venta_esp_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
//define(["N/record", "N/search", "N/task"], function (record, search, task) {
define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {
  function afterSubmit(context) {
    try {
      var newRecord = context.newRecord;
      var recId = newRecord.id;
      var nombreSublista = "recmachcustrecord_ptg_vta_esp_";
      var lineCount = newRecord.getLineCount({ sublistId: nombreSublista }) || 0;
      var factura = newRecord.getValue("custrecord_ptg_factura_vta_especial_");
      var planta = newRecord.getValue("custrecord_ptg_planta_vta_especial_");
      var localizacionAlmacen = newRecord.getValue("custrecord_ptg_loc_almacen_");
      var articuloGas = 0;
      var formulario = 0;
      var notaLinea = "";
      var formaPago = 0;
      var referencia = "";
      var cliente = 0;
      var direccion = "";
      var litrosVendidos = [];
      var precioUnitario = [];
      var importe = [];
      var impuesto = [];
      var total = [];
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
      var servicioViajeEspecial = 0;


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
        formulario = 286;
        articuloGas = 4088;
        servicioViajeEspecial = 7;
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
        formulario = 308;
        articuloGas = 4216;
        servicioViajeEspecial = 7;
      }

      if (!factura) {
        for (var i = 0; i < lineCount; i++) {
          notaLinea = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_nota_vta_espc_det_",
            line: 0
          }) || "";

          formaPago = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_formapago_det_vta_esp_",
            line: 0
          }) || "";

          referencia = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_referencia_vta_esp_det_",
            line: 0
          }) || "";

          cliente = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_cliente_vta_esp_",
            line: 0
          }) || "";

          direccion = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_direc_emb_vta_esp_",
            line: 0
          }) || "";

          litrosVendidos[i] = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_lts_vendidos_vta_esp_",
            line: i
          }) || "";

          precioUnitario[i] = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_pu_vta_esp_",
            line: i
          }) || "";

          importe[i] = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_importe_",
            line: i
          }) || "";

          impuesto[i] = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_impuesto_vta_esp_",
            line: i
          }) || "";

          total[i] = newRecord.getSublistValue({
            sublistId: nombreSublista,
            fieldId: "custrecord_ptg_total_vta_esp_",
            line: i
          }) || "";
        }

        var entityObj = record.load({
          type: search.Type.CUSTOMER,
          id: cliente,
        });
        log.audit("entityObj", entityObj);
        
        var cfdiCliente = entityObj.getValue("custentity_disa_uso_de_cfdi_") || 3;
        log.audit("cfdiCliente solicita", cfdiCliente);
        var clienteTXT = entityObj.getValue("altname");
        var clienteAFacturar = entityObj.getValue("custentity_razon_social_para_facturar");
        var nombreClienteAFacturar = "";
        nombreClienteAFacturar = clienteAFacturar;

        var ubicacionObj = record.load({
          type: search.Type.LOCATION,
          id: localizacionAlmacen,
        });
        log.audit("entityObj", entityObj);
        
        var subsidiaria = ubicacionObj.getValue("subsidiary");
        log.audit("subsidiaria", subsidiaria);


        var recordFactura = record.create({
          type: record.Type.INVOICE,
          isDynamic: true,
        });
        recordFactura.setValue("customform", formulario);
        recordFactura.setValue("entity", cliente);
        recordFactura.setValue("location", localizacionAlmacen);
        recordFactura.setValue("memo", notaLinea);
        recordFactura.setValue("custbody_ptg_tipo_servicio", servicioViajeEspecial);
        recordFactura.setValue("custbody_ptg_opcion_pago", formaPago);
        recordFactura.setValue("custbody_ptg_liq_viaje_especial", recId);
        recordFactura.setValue("custbody_psg_ei_status", 3); //ESTADO DEL DOCUMENTO ELECTRÓNICO
        recordFactura.setValue("custbody_mx_cfdi_usage", cfdiCliente);
        recordFactura.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);
        //recordFactura.setValue("custbody_psg_ei_template", 123); //PLANTILLA DEL DOCUMENTO ELECTRÓNICO
        //recordFactura.setValue("custbody_psg_ei_sending_method", 11); //MÉTODO DE ENVÍO DE DOCUMENTOS ELECTRÓNICOS

        var formaPagoSAT = searchFormaPagoSAT(subsidiaria, formaPago);
        log.emergency("formaPagoSAT", formaPagoSAT);
        recordFactura.setValue("custbody_mx_txn_sat_payment_method", formaPagoSAT);

        if(formaPago == efectivoId){ //EFECTIVO
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 1); //01 - Efectivo
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
        } 
        else if(formaPago == prepagoBanorteId || formaPago == prepagoTransferenciaId || formaPago == prepagoBancomerId || formaPago == prepagoHSBCId || formaPago == prepagoBanamexId || formaPago == prepagoSantanderId || formaPago == prepagoScotianId){ //PREPAGO
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }
        else if(formaPago == cortesiaId){ //CORTESIA
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }
        else if(formaPago == tarjetaCreditoId || formaPago == tarjetaCreditoBancomerId || formaPago == tarjetaCreditoHSBCId || formaPago == tarjetaCreditoBanamexId){ //TARJETA CREDITO
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 4); //04 - Tarjeta de Crédito
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
        }
        else if(formaPago == tarjetaDebitoId || formaPago == tarjetaDebitoBanamexId || formaPago == tarjetaDebitoBancomerId || formaPago == tarjetaDebitoHSBCId){ //TARJETA DEBITO
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 23); //28 - Tarjeta de Débito
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola Exhibición
        } 
        else if(formaPago == creditoClienteId){ //CREDITO CLIENTE
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }
        else if(formaPago == reposicionId){ //REPOSICION
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }
        else if(formaPago == bonificacionId){ //BONIFICACION
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }
        else if(formaPago == chequeBancomerId || formaPago == chequeSantanderId || formaPago == chequeScotianId || formaPago == chequeHSBCId || formaPago == chequeBanamexId || formaPago == chequeBanorteId){ //CHEQUE
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 2); //02 - CHEQUE NOMINATIVO
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 3); //PUE - Pago en una Sola ExhibiciónrateArray
        }
        else {
          //recordFactura.setValue("custbody_mx_txn_sat_payment_method", 28); //99 - Por Definir
          recordFactura.setValue("custbody_mx_txn_sat_payment_term", 4); //PPD - Pago en Parcialidades o Diferido
        }

        for (var j = 0; j < lineCount; j++) {
          recordFactura.selectLine("item", j);
          recordFactura.setCurrentSublistValue("item", "item", articuloGas);
          recordFactura.setCurrentSublistValue("item", "location", localizacionAlmacen);
          recordFactura.setCurrentSublistValue("item", "quantity", litrosVendidos[j]);
          recordFactura.setCurrentSublistValue("item", "rate", precioUnitario[j]);
          recordFactura.setCurrentSublistValue("item", "custcol_ptg_cantidad_litros", litrosVendidos[j]);
          recordFactura.setCurrentSublistValue("item", "custcol_ptg_precio_unitario", precioUnitario[j]);
          recordFactura.commitLine("item");
        }

        var idRecordFactura = recordFactura.save({
          ignoreMandatoryFields: true
        });

        log.debug({
          title: "Factura Creada",
          details: "Id Saved: " + idRecordFactura,
        });

        var objUpdate = {
          custrecord_ptg_factura_vta_especial_: idRecordFactura,
        };

        var registroUpd = record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
        });

        log.debug("Registro Actualizado con factura", registroUpd);

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
        log.audit("link", link);

        if(idRecordFactura && (formaPago == efectivoId || formaPago == tarjetaCreditoId || formaPago == tarjetaDebitoId || formaPago == chequeBancomerId || formaPago == chequeSantanderId || formaPago == chequeScotianId || formaPago == chequeHSBCId || formaPago == chequeBanamexId || formaPago == chequeBanorteId || formaPago == tarjetaCreditoBancomerId || formaPago == tarjetaCreditoHSBCId || formaPago == tarjetaCreditoBanamexId || formaPago == tarjetaDebitoBanamexId || formaPago == tarjetaDebitoBancomerId || formaPago == tarjetaDebitoHSBCId)){
          var pagoObj = record.transform({
            fromType: record.Type.INVOICE,
            fromId: idRecordFactura,
            toType: record.Type.CUSTOMER_PAYMENT,
            isDynamic: false
          });

          var pagoObjID = pagoObj.save({
            ignoreMandatoryFields: true
          });
          log.debug("Pago Creado con: "+formaPago, pagoObjID);
        }


      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      if (context.type == "create") {
        var newRecord = context.newRecord;
        var folio = newRecord.getValue("custrecord_ptg_folio_preliq_vtaespecial");
        if (!folio) {
          var numerofolio = search.create({
            type: "customrecord_ptg_liqui_viaje_especial_",
            filters: [],
            columns: [],
          });
          var contadorSearch = numerofolio.runPaged().count;
          log.debug("numero de conteo", contadorSearch);
          var contador = contadorSearch + 1;
          newRecord.setValue("custrecord_ptg_folio_preliq_vtaespecial", contador);
        }
      }
    } catch (error) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
  };
});
