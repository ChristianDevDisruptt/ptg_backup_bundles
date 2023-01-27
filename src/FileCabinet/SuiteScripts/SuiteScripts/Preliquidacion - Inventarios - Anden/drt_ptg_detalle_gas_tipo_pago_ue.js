/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Detalle Gas tipo de pago UE
 * Script id: customscript_drt_ptg_det_gas_tip_pag_ue
 * customer Deployment id: customdeploy_drt_ptg_det_gas_tip_pag_ue
 * Applied to: PTG - Detalle Gas tipo de pago
 * File: drt_ptg_detalle_gas_tipo_pago_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", 'N/ui/serverWidget', "N/runtime"], function (record, search, serverWidget, runtime) {

  function afterSubmit(context) {
    
    try {
      if (context.type == "edit") {
      var customRec = context.newRecord;
      var recId = customRec.id;
      var clienteNew = customRec.getValue("custrecord_ptg_clientegas_");
      var clienteOld = context.oldRecord.getValue("custrecord_ptg_clientegas_");
      var articulo = customRec.getValue("custrecord_ptg_tipocil_gas_");
      var cantidad = customRec.getValue("custrecord_ptg_cantidadgas_");
      var precioUnitarioNew = customRec.getValue("custrecord_ptg_preciogas");
      var precioUnitarioOld = context.oldRecord.getValue("custrecord_ptg_preciogas");
      var importeNew = customRec.getValue("custrecord_ptg_importegas_");
      var importeOld = context.oldRecord.getValue("custrecord_ptg_importegas_");
      var impuestoNew = customRec.getValue("custrecord_ptg_impuestogas_");
      var impuestoOld = context.oldRecord.getValue("custrecord_ptg_impuestogas_");
      var totalNew = customRec.getValue("custrecord_ptg_total_gas");
      var totalOld = context.oldRecord.getValue("custrecord_ptg_total_gas");
      
      var preliquidacion = customRec.getValue("custrecord_ptg_detgas_tipo_pago_");
      var preliquidacionObj = record.load({
        type: "customrecord_ptg_preliqestcarburacion_",
        id: preliquidacion,
      });
      var statusPreliquidacion = preliquidacionObj.getValue("custrecord_ptg_liquidacion_status_carb");
      var prepagoForm = customRec.getValue("custpage_prepago");
      var prepagoFormOld = context.oldRecord.getValue("custpage_prepago");
      var tipoPagoNew = customRec.getValue("custrecord_ptg_tipopago_gas");
      var objUpdate = {};
      log.audit("recId", recId);
      log.audit("clienteNew", clienteNew);
      log.audit("clienteOld", clienteOld);

      var prepagoBanorte = 0;      
      var prepagoTransferencia = 0;
      var prepagoBancomer = 0;
      var prepagoHSBC = 0;
      var prepagoBanamex = 0;
      var prepagoSantander = 0;
      var prepagoScotian = 0;
      var estatusFacturacion = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        prepagoBanorte = 2;
        prepagoTransferencia = 8;
        prepagoBancomer = 13;
        prepagoHSBC = 14;
        prepagoBanamex = 15;
        prepagoSantander = 16;
        prepagoScotian = 17;
        estatusFacturacion = 4;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        prepagoBanorte = 2;
        prepagoTransferencia = 8;
        prepagoBancomer = 13;
        prepagoHSBC = 14;
        prepagoBanamex = 15;
        prepagoSantander = 16;
        prepagoScotian = 17;
        estatusFacturacion = 4;
      }

      if(statusPreliquidacion != estatusFacturacion) {
        objUpdate.custrecord_ptg_prepago_detalle_gas = prepagoForm;
      if(clienteNew != clienteOld || totalNew != totalOld){
        var idOportunidad = customRec.getValue("custrecord_ptg_id_oportunidad_gas");
        var preliquidacionId = customRec.getValue("custrecord_ptg_detgas_tipo_pago_");
        var nombreClienteTXT = customRec.getValue("custrecord_ptg_nombre_gas");
        var direccion = customRec.getValue("custrecord_ptg_direccionembgas_");
        log.audit("idOportunidad", idOportunidad);
        log.audit("preliquidacionId", preliquidacionId);
        log.audit("nombreClienteTXT", nombreClienteTXT);
        log.audit("direccion", direccion);
        /*var objUpdateOportunidad = {
          entity: clienteNew
        };
        record.submitFields({
          id: idOportunidad,
          type: record.Type.OPPORTUNITY,
          values: objUpdateOportunidad,
        });*/
        //BÚSQUEDA GUARDADA: PTG - Detalle Gas tipo de pago - Preliq
        var detalleGasTipoPagoObj = search.create({
          type: "customrecord_ptg_det_gas_tipo_pago_",
          filters: [
             ["custrecord_ptg_id_oportunidad_gas","anyof",idOportunidad], "AND", 
             ["custrecord_ptg_detgas_tipo_pago_","anyof",preliquidacionId]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "Internal ID"}),
             search.createColumn({name: "custrecord_ptg_clientegas_", label: "PTG - Cliente gas"}),
             search.createColumn({name: "custrecord_ptg_nombre_gas", label: "PTG - Nombre gas"}),
             search.createColumn({name: "custrecord_ptg_direccionembgas_", label: "PTG - Dirección embarque gas"})
          ]
        });
        var detalleGasTipoPagoObjCount = detalleGasTipoPagoObj.runPaged().count;
        var detalleGasTipoPagoObjResult = detalleGasTipoPagoObj.run().getRange({
          start: 0,
          end: detalleGasTipoPagoObjCount,
        });
        if(detalleGasTipoPagoObjCount > 0){
          for (var i = 0; i < detalleGasTipoPagoObjCount; i++) {
            (idRegistro = detalleGasTipoPagoObjResult[i].getValue({name: "internalid", label: "Internal ID"}));
            var rec = record.load({
              type: customRec.type,
              id: idRegistro,
              isDynamic: true,
            });
  
            rec.setValue("custrecord_ptg_clientegas_", clienteNew);
            rec.setValue("custrecord_ptg_nombre_gas", nombreClienteTXT);
            rec.setValue("custrecord_ptg_direccionembgas_", direccion);
  
            var recSaved = rec.save();
            log.debug({
              title: "Record updated successfully",
              details: "Id: " + recSaved,
            });
          }
        }


        var oportunidadRec = record.load({
          type: record.Type.OPPORTUNITY,
          id: idOportunidad,
        });

        oportunidadRec.setValue("entity", clienteNew);

        var itemCountLine = oportunidadRec.getLineCount('item');
        for(var i = 0; i < itemCountLine; i++){
          articuloOpo = oportunidadRec.getSublistValue("item", "item", i);
          cantidadOpo = oportunidadRec.getSublistValue("item", "quantity", i);
          precioUnitarioOpo = oportunidadRec.getSublistValue("item", "rate", i);
          if(articulo == articuloOpo && cantidad == cantidadOpo){
            oportunidadRec.setSublistValue("item", "rate", i, precioUnitarioNew);
          }
        }

        var oportunidadSaved = oportunidadRec.save();
        log.debug({
          title: "Oportunidad updated successfully",
          details: "Id: " + oportunidadSaved,
        });


        var totalServicio = 0;
        var oportunidadRec = record.load({
          type: record.Type.OPPORTUNITY,
          id: oportunidadSaved,
        });

        var itemCountLine = oportunidadRec.getLineCount('item');
        for(var i = 0; i < itemCountLine; i++){
          precioUnitarioOpo = parseFloat(oportunidadRec.getSublistValue("item", "grossamt", i));
          totalServicio += precioUnitarioOpo;
        }
        log.audit("totalServicio", totalServicio);



        //BÚSQUEDA GUARDADA: PTG - Detalle despachador Preliq
        var detalleGasObj = search.create({
          type: "customrecord_ptg_det_gas_tipo_pago_",
          filters: [
             ["custrecord_ptg_id_oportunidad_gas","anyof",idOportunidad], "AND", 
             ["custrecord_ptg_detgas_tipo_pago_","anyof",preliquidacionId]
          ],
          columns: [
            search.createColumn({name: "internalid", label: "Internal ID"}),
          ]
        });
        var detalleGasObjCount = detalleGasObj.runPaged().count;
        log.debug("detalleDespachadorObjCount", detalleGasObjCount);
        var detalleGasObjResult = detalleGasObj.run().getRange({
          start: 0,
          end: detalleGasObjCount,
        });
        if(detalleGasObjCount > 0){
          for (var i = 0; i < detalleGasObjCount; i++) {
            (idRegistro = detalleGasObjResult[i].getValue({name: "internalid", label: "Internal ID"}));
            var rec = record.load({
              type: customRec.type,
              id: idRegistro,
              isDynamic: true,
            });
  
            rec.setValue("custrecord_ptg_clientegas_", clienteNew);
            rec.setValue("custrecord_ptg_nombre_gas", nombreClienteTXT);
            rec.setValue("custrecord_ptg_direccionembgas_", direccion);
  
            var recSaved = rec.save();
            log.debug({
              title: "Record updated successfully",
              details: "Id: " + recSaved,
            });
          }
        }


        //BÚSQUEDA GUARDADA:PTG - Pagos Modificar Monto SS
        var cambioMontoObj = search.create({
          type: "customrecord_ptg_pagos",
          filters: [["custrecord_ptg_oportunidad_pagos","anyof",idOportunidad]],
          columns: [
            search.createColumn({name: "internalid", label: "ID interno"})
          ]
        });
        var cambioMontoObjCount = cambioMontoObj.runPaged().count;
        var cambioMontoObjResult = cambioMontoObj.run().getRange({
          start: 0,
          end: 2,
        });
        if(cambioMontoObjCount > 0){
          (idRegistroPago = cambioMontoObjResult[0].getValue({name: "internalid", label: "ID interno"}));
          log.audit("idRegistroPago", idRegistroPago);
          var objRegistroPago = record.load({
            type:"customrecord_ptg_pagos",
            id: idRegistroPago
          });
          
          objRegistroPago.setValue("custrecord_ptg_total_servicio", totalServicio);

          objRegistroPago.setSublistValue("recmachcustrecord_ptg_registro_pagos", "custrecord_ptg_total", 0, totalServicio);

          var registroPagoSaved = objRegistroPago.save({
            enableSourcing: true,
            ignoreMandatoryFields: true
          });

          log.audit("Registro de pago actualizado", registroPagoSaved);

          var objRegistroPago = record.load({
            type:"customrecord_ptg_pagos",
            id: registroPagoSaved
          });

          var lineaPagos = "recmachcustrecord_ptg_registro_pagos";
          var conteoLineaPagos = objRegistroPago.getLineCount({ sublistId: lineaPagos})||0;

          for(var i = 0; i < conteoLineaPagos; i++){
            formaPagoTXT = objRegistroPago.getSublistValue({
              sublistId: lineaPagos, 
              fieldId: 'custrecord_ptg_tipo_pago_display',
              line: i
            });
            idTipoPago = objRegistroPago.getSublistValue({
              sublistId: lineaPagos, 
              fieldId: 'custrecord_ptg_tipo_pago',
              line: i
            });
    
            referencia = objRegistroPago.getSublistValue({
              sublistId: lineaPagos, 
              fieldId: 'custrecord_ptg_referenciapago_',
              line: i
            });
    
            montoPago = objRegistroPago.getSublistValue({
              sublistId: lineaPagos, 
              fieldId: 'custrecord_ptg_total',
              line: i
            });
    
            idTipoPagoArray.push(idTipoPago);
            referenciaArray.push(referencia);
    
            objPagos = {metodo_txt: formaPagoTXT, tipo_pago: idTipoPago, folio: referencia, monto: montoPago}
            arrayPagos.push(objPagos);
          }
    
          log.audit("arrayPagos", arrayPagos);
          objPagosOportunidad = {pago: arrayPagos}
          log.audit("objPagosOportunidad", objPagosOportunidad);
    
          var objValue = JSON.stringify(objPagosOportunidad);
          log.audit("objValueM", objValue);

          var IdOportunidadUpd = record.submitFields({
            type: record.Type.OPPORTUNITY,
            id: idOportunidad,
            values: {
              custbody_ptg_opcion_pago_obj: objValue,
            }
          });
          log.debug("Oportunidad Actualizada FN", IdOportunidadUpd);

        }
        
        
        //SS: PTG - Detalle Gas SS
        var detalleGasConcaObj = search.create({
          type: "customrecord_ptg_detallegas_",
          filters: [
            ["custrecord_ptg_tipocil_est_cab_","anyof",articulo], "AND", 
            ["custrecord_ptg_detalle_cil","anyof",preliquidacion], "AND", 
            ["custrecord_ptg_precioxlt_est_carb_","equalto",precioUnitarioOld]
          ],
          columns: [
            search.createColumn({name: "internalid", label: "ID interno"}),
            search.createColumn({name: "custrecord_ptg_precioxlt_est_carb_", label: "PTG - $/Lt est carb"}),
            search.createColumn({name: "custrecord_ptg_importe_cil_est_carb_", label: "PTG - Importe cil est carb"}),
            search.createColumn({name: "custrecord_ptg_impuesto_cil_est_carb_", label: "PTG - Impuesto cil est carb"}),
            search.createColumn({name: "custrecord_ptg_total_cil_est_carb_", label: "PTG - Total cil est carb"})
          ]
        });
        var detalleGasConcaObjCount = detalleGasConcaObj.runPaged().count;
        var detalleGasConcaObjResult = detalleGasConcaObj.run().getRange({
          start: 0,
          end: 2,
        });
        if(cambioMontoObjCount > 0){
          (idRegistroPago = detalleGasConcaObjResult[0].getValue({name: "internalid", label: "ID interno"}));
          (precioDetalle = parseFloat(detalleGasConcaObjResult[0].getValue({name: "custrecord_ptg_precioxlt_est_carb_", label: "PTG - $/Lt est carb"})));
          (importeDetalle = parseFloat(detalleGasConcaObjResult[0].getValue({name: "custrecord_ptg_importe_cil_est_carb_", label: "PTG - Importe cil est carb"})));
          (impuestoDetalle = parseFloat(detalleGasConcaObjResult[0].getValue({name: "custrecord_ptg_impuesto_cil_est_carb_", label: "PTG - Impuesto cil est carb"})));
          (totalDetalle = parseFloat(detalleGasConcaObjResult[0].getValue({name: "custrecord_ptg_total_cil_est_carb_", label: "PTG - Total cil est carb"})));

          var precioMenos = precioDetalle - precioUnitarioOld;
          var importeMenos = importeDetalle - importeOld;
          var impuestoMenos = impuestoDetalle - impuestoOld;
          var totalMenos = totalDetalle - totalOld;

          var precioMas = precioMenos + precioUnitarioNew;
          var importeMas = importeMenos + importeNew;
          var impuestoMas = impuestoMenos + impuestoNew;
          var totalMas = totalMenos + totalNew;

          var detalleGasUpd = record.submitFields({
            type: "customrecord_ptg_detallegas_",
            id: idRegistroPago,
            values: {
              custrecord_ptg_precioxlt_est_carb_: precioMas,
              custrecord_ptg_importe_cil_est_carb_ : importeMas,
              custrecord_ptg_impuesto_cil_est_carb_: impuestoMas,
              custrecord_ptg_total_cil_est_carb_: totalMas,
            }
          });

          log.audit("Detalle Gas Upd", detalleGasUpd);

        }

      } else {
        log.audit("Mismo Cliente");
        if((tipoPagoNew == prepagoBanorte || tipoPagoNew == prepagoTransferencia || tipoPagoNew == prepagoBancomer || tipoPagoNew == prepagoHSBC || tipoPagoNew == prepagoBanamex || tipoPagoNew == prepagoSantander || tipoPagoNew == prepagoScotian) && !prepagoFormOld && prepagoForm){
            log.audit("Entra descuento prepagos");
            objUpdate.custrecord_ptg_prepago_sin_aplic_det_gas = false;
        }
      }
    } else {
      log.audit("Liquidación facturada");
      objUpdate.custrecord_ptg_clientegas_ = clienteOld;
    }
    record.submitFields({
      type: "customrecord_ptg_det_gas_tipo_pago_",
      id: recId,
      values: objUpdate,
    });
    }
    } catch (e) {
      log.error({ title: e.name, details: e.message });
    }
  }

  
  function beforeLoad(context){
    try {
        var customRec = context.newRecord;
        var recId = customRec.id;
        var idCliente = customRec.getValue("custrecord_ptg_clientegas_");
        log.audit("idCliente", idCliente);
        var prepagoValue = customRec.getValue("custrecord_ptg_prepago_detalle_gas");
        var prepagoText = customRec.getText("custrecord_ptg_prepago_detalle_gas");

        //var form = params.form;
        var form = context.form;

        var tipodoc = form.addField({
            id: 'custpage_prepago',
            type: serverWidget.FieldType.SELECT,
            label: 'PTG - Prepago',
            //container: 'group_environment'
        });

        if(prepagoValue){
            tipodoc.addSelectOption({value: prepagoValue, text: prepagoText});
          }
        
        // Cambio NC
        //SS: PTG - Pago Prepago SS
        var search_Transac = search.create({
            type: 'customerpayment',
            filters: [
                ["type","anyof","CustPymt"], "AND", 
                ["custbody_ptg_prepago","is","T"], "AND", 
                [["name","anyof",idCliente],"OR",["custbody_ptg_cliente_prepago","anyof",idCliente]], "AND", 
                ["amountremaining","greaterthan","0.00"]
            ],

            columns: ['internalid', 'transactionname', 'amountremaining', 'memo']
        });
        log.audit("search_Transac", search_Transac);
        
        resultSearch = search_Transac.run().getRange(0,1000);
        log.audit("resultSearch", resultSearch);

        if (resultSearch != null && resultSearch.length > 0) {
            tipodoc.addSelectOption({value: '',text: ''});

            for (i = 0; i < resultSearch.length; i++) {
                row = resultSearch[i].columns;
                var reportID2 = resultSearch[i].getValue(row[0]);
                var reportNM2 = resultSearch[i].getValue(row[1]);
                var reportMO2 = resultSearch[i].getValue(row[2]);
                var reportME2 = resultSearch[i].getValue(row[3]);

                tipodoc.addSelectOption({value: reportID2,text: reportNM2 +" Saldo: $"+reportMO2 +" Referencia: "+reportME2});
            }
        }

    } catch (error) {
        log.error("Error beforeLoad", error);
    }
  }

  return {
    afterSubmit: afterSubmit,
    beforeLoad: beforeLoad,
  };
});
