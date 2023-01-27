/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - VENTA ANDEN UE
 * Script id: customscript_drt_ptg_venta_anden_ue
 * customer Deployment id: customdeploy_drt_ptg_venta_anden_ue
 * Applied to: PTG - VENTA ANDEN
 * File: drt_ptg_venta_anden_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/format", 'N/config', "N/runtime"], function (record, search, task, format, config, runtime) {

  function beforeLoad(context){
    try {
      var newRecord = context.newRecord;
      var type_event = context.type;
      var form = context.form;
      log.audit("type_event", type_event);

      if(type_event == "create" || type_event == "edit"){
        form.addButton({
          id: "custpage_drt_to_nuevo_cliente",
          label: "Registrar Nuevo Cliente",
          functionName: "redirectToCreateCustomer()",
        });
      }

      form.clientScriptModulePath = "./drt_ptg_venta_anden_cs.js";


    } catch (error) {
      log.error("error", error);
    }
  }
  
  function beforeSubmit(context){
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
      var folio = newRecord.getValue("custrecord_ptg_folio_anden");

      if(!folio){
        var liqVentaAndenObj = search.create({
          type: "customrecord_ptg_venta_anden",
          filters: [],
          columns: []
        });
        var liqVentaAndenObjCount = liqVentaAndenObj.runPaged().count;

        if(liqVentaAndenObjCount > 0){
          var folioValor = liqVentaAndenObjCount + 1;
          newRecord.setValue("custrecord_ptg_folio_anden", folioValor.toFixed(0));
          newRecord.setValue("name", folioValor.toFixed(0));
        } else {
          newRecord.setValue("custrecord_ptg_folio_anden", 1);
          newRecord.setValue("name", 1);
        }
      }
    }
        
    } catch (error) {
      log.error("Error beforeSubmit", error);
    }
  }

  function afterSubmit(context){
    try {
      if (context.type == "create") {
      log.audit('Remaining Usage init afterSubmit start', runtime.getCurrentScript().getRemainingUsage());
      var newRecord = context.newRecord;
      var recId = newRecord.id;
      var lineaPagos = "recmachcustrecord_ptg_detallepago_";
      var conteoLineaPagos = newRecord.getLineCount({ sublistId: lineaPagos})||0;
      var lineaVentas = "recmachcustrecord_ptg_linea_venta_anden";
      var conteoLineaVentas = newRecord.getLineCount({ sublistId: lineaVentas})||0;
      var cliente = newRecord.getValue("custrecord_ptg_cliente");
      var planta = newRecord.getValue("custrecord_ptg_planta_anden");
      var almacenGas = newRecord.getValue("custrecord_ptg_almacen_gas_anden");
      var almacenEnvase = newRecord.getValue("custrecord_ptg_almacen_envases_anden");
      var facturar = newRecord.getValue("custrecord_ptg_requiere_factura_anden");
      var folioNota = newRecord.getValue("custrecord_ptg_folio_nota_anden");
      var folio = newRecord.getValue("custrecord_ptg_folio_anden");
      var formaPago = newRecord.getValue("custrecord_ptg_tipo_pagos_venta_anden");
      var referenciaVenta = newRecord.getValue("custrecord_ptg_referencia_pago_venta_and");
      var totalVenta = newRecord.getValue("custrecord_ptg_totalizador_venta_anden");
      var idTipoPagoArray = [];
      var referenciaArray = [];
      var objPagos = {};
      var arrayPagos = [];
      var objPagosOportunidad = {};
      var articuloArray = [];
      var cantidadArray = [];
      var precioUnArray = [];
      var importeArray = [];
      var impuestoArray = [];
      var totalArray = [];
      var recIdVentaAndenArray = [];
      var formularioOportunidad = 0;
      var estadoConcretado = 0;
      var efectivoAnden = 0;
      var tarjetaDebitoAnden = 0;
      var tarjetaCreditoAnden = 0;
      var chequeAnden = 0;
      var cortesiaAnden = 0;
      var valesTraspAnden = 0;
      var creditoClienteAnden = 0;
      var recirculacionAnden = 0;
      var efectivoId = 0;
      var recirculacionId = 0;
      var chequeBanamexId = 0;
      var estadoEntregado = 0;
      var valeId = 0;
      var cortesiaId = 0;
      var tarjetaCreditoId = 0;
      var tarjetaDebitoId = 0;
      var multipleId = 0;
      var creditoClienteId = 0;
      var servicioVentanAnden = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        efectivoAnden = 1;
        tarjetaDebitoAnden = 2;
        tarjetaCreditoAnden = 3;
        chequeAnden = 4;
        cortesiaAnden = 5;
        valesTraspAnden = 6;
        creditoClienteAnden = 7;
        recirculacionAnden = 8;
        formularioOportunidad = 305;
        estadoConcretado = 13;
        servicioVentanAnden = 5;
        efectivoId = 1;
        valeId = 3;
        cortesiaId = 4;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        multipleId = 7;
        creditoClienteId = 9;
        recirculacionId = 21;
        chequeBanamexId = 29;
        estadoEntregado = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        efectivoAnden = 1;
        tarjetaDebitoAnden = 2;
        tarjetaCreditoAnden = 3;
        chequeAnden = 4;
        cortesiaAnden = 5;
        valesTraspAnden = 6;
        creditoClienteAnden = 7;
        recirculacionAnden = 8;
        formularioOportunidad = 265;
        estadoConcretado = 13;
        servicioVentanAnden = 5;
        efectivoId = 1;
        valeId = 3;
        cortesiaId = 4;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        multipleId = 7;
        creditoClienteId = 9;
        recirculacionId = 21;
        chequeBanamexId = 29;
        estadoEntregado = 3;
      }


      for(var i = 0; i < conteoLineaPagos; i++){
        log.audit("Linea", i);
        idTipoPago = newRecord.getSublistValue({
          sublistId: lineaPagos, 
          fieldId: 'custrecord_ptg_tipo_pago_anden',
          line: i
        });

        referencia = newRecord.getSublistValue({
          sublistId: lineaPagos, 
          fieldId: 'custrecord_ptg_folio_autorizacion_anden',
          line: i
        });

        montoPago = newRecord.getSublistValue({
          sublistId: lineaPagos, 
          fieldId: 'custrecord_ptg_total_detalle',
          line: i
        });

        idTipoPagoArray.push(idTipoPago);
        referenciaArray.push(referencia);

        objPagos = {tipo_pago: idTipoPago, folio: referencia, monto: montoPago}
        arrayPagos.push(objPagos);
      }

      log.audit("arrayPagos", arrayPagos);
      objPagosOportunidad = {pago: arrayPagos}
      log.audit("objPagosOportunidad", objPagosOportunidad);

      var objValue = JSON.stringify(objPagosOportunidad);
      log.audit("objValueM", objValue);


      for(j = 0; j < conteoLineaVentas; j++){
        articuloArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_articulo_anden',
          line      : j
        });

        cantidadArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_cantidad_anden',
          line      : j
        });

        precioUnArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_precio_unitario_anden',
          line      : j
        });

        importeArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_importe_anden',
          line      : j
        });

        impuestoArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_impuesto_anden',
          line      : j
        });

        totalArray[j] = newRecord.getSublistValue({
          sublistId : lineaVentas,
          fieldId   : 'custrecord_ptg_total_anden',
          line      : j
        });
      }

      var clienteObj = record.load({
        type: search.Type.CUSTOMER,
        id: cliente
      });
      var nombreClienteAFacturar = clienteObj.getValue("custentity_razon_social_para_facturar");

      var recOportunidad = record.create({
        type: record.Type.OPPORTUNITY,
        isDynamic: true,
      });

      recOportunidad.setValue("customform", formularioOportunidad);
      recOportunidad.setValue("entity", cliente);
      recOportunidad.setValue("entitystatus", estadoConcretado);
      recOportunidad.setValue("probability", 100);
      recOportunidad.setValue("custbody_ptg_tipo_servicio", servicioVentanAnden);
      recOportunidad.setValue("custbody_ptg_cliente_solicita_factura", facturar);
      recOportunidad.setValue("custbody_ptg_estado_pedido", estadoEntregado);
      recOportunidad.setValue("custbody_ptg_opcion_pago_obj", objValue);
      recOportunidad.setValue("memo", folioNota);
      recOportunidad.setValue("custbody_ptg_registro_venta_anden", recId);
      recOportunidad.setValue("custbody_razon_social_para_facturar", nombreClienteAFacturar);

      for (var k = 0; k < conteoLineaVentas; k++) {
        recOportunidad.selectLine("item", k);
        recOportunidad.setCurrentSublistValue("item", "item", articuloArray[k]);
        recOportunidad.setCurrentSublistValue("item", "quantity", cantidadArray[k]);
        recOportunidad.setCurrentSublistValue("item", "rate", precioUnArray[k]);
        recOportunidad.commitLine("item");
      }
      var recOportunidadIdSaved = recOportunidad.save();
      log.debug({
        title: "Oportunidad Creada",
        details: "Id Saved: " + recOportunidadIdSaved,
      });

      for (var l = 0; l < conteoLineaVentas; l++) {
        var ventaAnden = record.create({
          type: "customrecord_ptg_total_ventas_anden_liq",
          isDynamic: true,
        });
        ventaAnden.setValue("custrecord_ptg_id_venta", recId);
        ventaAnden.setValue("custrecord_ptg_folio_venta_liq_anden", folio);
        ventaAnden.setValue("custrecord_ptg_forma_pago_liq_anden", formaPago);
        ventaAnden.setValue("custrecord_ptg_referencia_liq_anden", referenciaVenta);
        ventaAnden.setValue("custrecord_ptg_cliente_liq_anden", cliente);
        ventaAnden.setValue("custrecord_ptg_articulo_liq_anden", articuloArray[l]);
        ventaAnden.setValue("custrecord_ptg_litros_cantidad_liq_anden", cantidadArray[l]);
        ventaAnden.setValue("custrecord_ptg_precio_unitario_liq_anden", precioUnArray[l]);
        ventaAnden.setValue("custrecord_ptg_importe_liq_anden", importeArray[l]);
        ventaAnden.setValue("custrecord_ptg_impuesto_liq_anden", impuestoArray[l]);
        ventaAnden.setValue("custrecord_ptg_total_venta_liq_anden", totalArray[l]);
        ventaAnden.setValue("custrecord_ptg_objeto_venta_liq_anden", objValue);
        ventaAnden.setValue("custrecord_ptg_oportunidad_liq_anden", recOportunidadIdSaved);
        ventaAnden.setValue("custrecord_ptg_fro_oportunidad_liq_anden", true);
        recIdVentaAndenArray[l] = ventaAnden.save();
        log.debug("Registro creado", recIdVentaAndenArray[l]);
      }

      var recPagos = record.create({
        type: "customrecord_ptg_pagos",
        isDynamic: true,
      });

      recPagos.setValue("custrecord_ptg_oportunidad_pagos", recOportunidadIdSaved);
      recPagos.setValue("custrecord_ptg_total_servicio", totalVenta);
      recPagos.setValue("custrecord_registro_desde_oportunidad_p", true);

      var recIdSavedAndenPagos = recPagos.save();

      log.debug("Registro de pago", recIdSavedAndenPagos);

      var objValue1 = JSON.parse(objValue);
      var objValue2 = objValue1;
      var objValue3 = objValue2.pago;
      var objCount = objValue3.length;
      var opcionPago = 0;

      if(objCount > 1){
        opcionPago = multipleId;
        log.audit("varias opciones de pago", opcionPago);
      } else {
        if(objValue3[0].tipo_pago == efectivoAnden){
          opcionPago = efectivoId;
        } else if(objValue3[0].tipo_pago == tarjetaDebitoAnden){
          opcionPago = tarjetaDebitoId;
        } else if(objValue3[0].tipo_pago == tarjetaCreditoAnden){
          opcionPago = tarjetaCreditoId;
        } else if(objValue3[0].tipo_pago == chequeAnden){
          opcionPago = chequeBanamexId;
        } else if(objValue3[0].tipo_pago == cortesiaAnden){
          opcionPago = cortesiaId;
        } else if(objValue3[0].tipo_pago == valesTraspAnden){
          opcionPago = valeId;
        } else if(objValue3[0].tipo_pago == creditoClienteAnden){
          opcionPago = creditoClienteId;
        } else if(objValue3[0].tipo_pago == recirculacionAnden){
          opcionPago = recirculacionId;
        }
        
        log.audit("Una opcion de pago", opcionPago);
      }

      for (var tipoPago = 0; tipoPago < objCount; tipoPago++) {
        var objPos = objValue3[tipoPago];
        if(objPos.tipo_pago == efectivoAnden){
          objTipoPago = efectivoId;
        } else if(objPos.tipo_pago == tarjetaDebitoAnden){
          objTipoPago = tarjetaDebitoId;
        } else if(objPos.tipo_pago == tarjetaCreditoAnden){
          objTipoPago = tarjetaCreditoId;
        } else if(objPos.tipo_pago == chequeAnden){
          objTipoPago = chequeBanamexId;
        } else if(objPos.tipo_pago == cortesiaAnden){
          objTipoPago = cortesiaId;
        } else if(objPos.tipo_pago == valesTraspAnden){
          objTipoPago = valeId;
        } else if(objPos.tipo_pago == creditoClienteAnden){
          objTipoPago = creditoClienteId;
        } else if(objPos.tipo_pago == recirculacionAnden){
          objTipoPago = recirculacionId;
        }
        var objMonto = objPos.monto;
        var objFolio = objPos.folio;
        log.audit("objPos", objPos);
        log.audit("objTipoPago", objTipoPago);
        log.audit("objMonto", objMonto);

        var recPagosOportunidad = record.create({
          type: "customrecord_ptg_pagos_oportunidad",
          isDynamic: true,
        });

        recPagosOportunidad.setValue("custrecord_ptg_oportunidad", recOportunidadIdSaved);
        recPagosOportunidad.setValue("custrecord_ptg_tipo_pago", objTipoPago);
        recPagosOportunidad.setValue("custrecord_ptg_total", objMonto);
        recPagosOportunidad.setValue("custrecord_ptg_referenciapago_", objFolio);
        recPagosOportunidad.setValue("custrecord_ptg_registro_pagos", recIdSavedAndenPagos);
        recPagosOportunidad.setValue("custrecord_registro_desde_oportunidad_po", true);

        var recIdSavedAndenPagosLinea = recPagosOportunidad.save();

        log.debug({
          title: "Record created successfully pagos oportunidad",
          details: "Id Saved: " + recIdSavedAndenPagosLinea,
        });
      }

      //SS: PTG - DETALLE PAGO EN ANDEN - A Facturar
      var pagoOrdenObj = search.create({
        type: "customrecord_ptg_detalle_pago_anden",
        filters: [["custrecord_ptg_detallepago_","anyof",recId]],
        columns: [
           search.createColumn({name: "custrecord_ptg_tipo_pago_anden", summary: "GROUP", label: "PTG - TIPO DE PAGO"}),
           search.createColumn({name: "custrecord_ptg_total_detalle", summary: "SUM", sort: search.Sort.DESC, label: "PTG - TOTAL"})
        ]
      });
      var pagoOrdenObjResult = pagoOrdenObj.run().getRange({
        start: 0,
        end: 2,
      });
      (tipoPago = pagoOrdenObjResult[0].getValue({name: "custrecord_ptg_tipo_pago_anden", summary: "GROUP", label: "PTG - TIPO DE PAGO"}));
      log.audit("tipoPago", tipoPago);

      var objUpdate = {
        custrecord_ptg_oportunidad_anden: recOportunidadIdSaved,
        custrecord_ptg_tipo_pagos_venta_anden: idTipoPagoArray,
        custrecord_ptg_referencia_pago_venta_and: referenciaArray,
        custrecord_ptg_objeto_venta_anden: objValue,
        custrecord_ptg_pago_facturar_venta_anden: tipoPago,
      };
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdate,
      });
      log.debug({
        title: "Record created successfully",
        details: "Id: " + recId,
      });

      var upOportunidad = record.load({
        type: record.Type.OPPORTUNITY,
        id: recOportunidadIdSaved,
        isDynamic: true
      });
      upOportunidad.setValue('custbody_ptg_forma_pago_facturar_anden', tipoPago);
      upOportunidad.setValue('custbody_drt_ptg_registro_creado_mov', true);
      upOportunidad.setValue("custbody_ptg_registro_pagos", recIdSavedAndenPagos);
      upOportunidad.setValue("custbody_ptg_opcion_pago", opcionPago);

      for (var m = 0; m < conteoLineaVentas; m++) {
        upOportunidad.selectLine('item', m);
        upOportunidad.setCurrentSublistValue('item', 'custcol_ptg_venta_anden', recIdVentaAndenArray[m]);
        upOportunidad.commitLine('item');
      }

      var oportunidadActualizada = upOportunidad.save();

      log.debug({
        title: "Oportunidad updated successfully",
        details: "Id Saved: " + oportunidadActualizada,
      });

      log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());
    }
        
    } catch (error) {
      log.error("Error afterSubmit", error);
    }
  }


  return {
    beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit,
    beforeLoad: beforeLoad,
  };
});