/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Detalle despachador UE
 * Script id: customscript_drt_ptg_detalle_despa_ue
 * customer Deployment id: customdeploy_drt_ptg_detalle_despa_ue
 * Applied to: PTG - Detalle despachador
 * File: drt_ptg_detalle_despa_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", 'N/ui/serverWidget', 'N/runtime'], function (record, search, serverWidget, runtime) {

  function afterSubmit(context) {
    
    try {
      if (context.type == "edit") {
      var customRec = context.newRecord;
      var recId = customRec.id;
      var clienteNew = customRec.getValue("custrecord_ptg_clientedespachador_");
      var clienteOld = context.oldRecord.getValue("custrecord_ptg_clientedespachador_");
      var montoNew = customRec.getValue("custrecord_ptg_total_despachador_");
      var montoOld = context.oldRecord.getValue("custrecord_ptg_total_despachador_");
      var preliquidacion = customRec.getValue("custrecord_ptg_detallecrburacion_");
      var litrosVendidos = customRec.getValue("custrecord_ptg_lts_vendidos_despachador_");
      var precioUnitario = customRec.getValue("custrecord_ptg_preciounidespachador_");
      var preliquidacionObj = record.load({
        type: "customrecord_ptg_preliqestcarburacion_",
        id: preliquidacion,
      });
      var statusPreliquidacion = preliquidacionObj.getValue("custrecord_ptg_liquidacion_status_carb");
      var prepagoForm = customRec.getValue("custpage_prepago");
      var prepagoFormOld = context.oldRecord.getValue("custpage_prepago");
      var tipoPagoNew = customRec.getValue("custrecord_ptg_tipopagoespachador_");
      var objUpdate = {};


      var prepagoBanorte = 0;      
      var prepagoTransferencia = 0;
      var prepagoBancomer = 0;
      var prepagoHSBC = 0;
      var prepagoBanamex = 0;
      var prepagoSantander = 0;
      var prepagoScotian = 0;
      var estatusFacturacion = 0;
      var idArticuloDescuento = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        prepagoBanorte = 2;
        prepagoTransferencia = 8;
        prepagoBancomer = 13;
        prepagoHSBC = 14;
        prepagoBanamex = 15;
        prepagoSantander = 16;
        prepagoScotian = 17;
        estatusFacturacion = 4;
        idArticuloDescuento = 4217;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        prepagoBanorte = 2;
        prepagoTransferencia = 8;
        prepagoBancomer = 13;
        prepagoHSBC = 14;
        prepagoBanamex = 15;
        prepagoSantander = 16;
        prepagoScotian = 17;
        estatusFacturacion = 4;
        idArticuloDescuento = 4217;
      }

      if(statusPreliquidacion != estatusFacturacion) {
        objUpdate.custrecord_ptg_prepago_despachador = prepagoForm;
        if(clienteNew != clienteOld || montoOld != montoNew){
          var idOportunidad = customRec.getValue("custrecord_ptg_oportunidad_carburacion");
          var preliquidacionId = customRec.getValue("custrecord_ptg_detallecrburacion_");
          var nombreClienteTXT = customRec.getValue("custrecord_ptg_num_cli_desp_");
          var direccion = customRec.getValue("custrecord_ptg_dir_embarque_despachador_");
          /*var objUpdateOportunidad = {
            entity: clienteNew
          };
          record.submitFields({
            id: idOportunidad,
            type: record.Type.OPPORTUNITY,
            values: objUpdateOportunidad,
          });*/

          var clienteObj = record.load({
            type: search.Type.CUSTOMER,
            id: clienteNew
          });
          var clienteDescuento = false;
          var descuentoPeso = parseFloat(clienteObj.getValue("custentity_ptg_descuento_asignar"));
          if(descuentoPeso > 0){
              clienteDescuento = true;
          }
          var descuentoSinIVA = descuentoPeso / 1.16;
          var descuentoUnitario = (litrosVendidos * descuentoSinIVA) * -1;


          var idRegistroPago = 0;
          var totalPago = 0;
          //SS: PTG - Detalle tipo de pago estación carb SS
          var tipoPagoObj = search.create({
            type: "customrecord_ptg_det_tipo_pago_est_car_",
            filters: [
               ["custrecord_ptg_descripcion_","anyof",tipoPagoNew], "AND", 
               ["custrecord_ptg_detalle_pago_carb_","anyof",preliquidacion]
            ],
            columns: [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "custrecord_ptg_tipo_pago_est_carb_", label: "PTG - Tipo de pago est carb"}),
               search.createColumn({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"})
            ]
          });
          var tipoPagoObjResult = tipoPagoObj.run().getRange({
            start: 0,
            end: 2,
          });
          idRegistroPago = tipoPagoObjResult[0].getValue({name: "internalid", label: "Internal ID"});
          totalPago = parseFloat(tipoPagoObjResult[0].getValue({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"}));

          var totalPagoResta = totalPago - montoOld;
          var totalPagoMas = totalPagoResta + montoNew;

          var tipoPagoNew = record.submitFields({
            type: "customrecord_ptg_det_tipo_pago_est_car_",
            id: idRegistroPago,
            values: {
              custrecord_ptg_total_est_carb_: totalPagoMas,
            }
          });

          log.debug({
            title: "Tipo Pago updated successfully",
            details: "Id: " + tipoPagoNew,
          });

          var oportunidadRec = record.load({
            type: record.Type.OPPORTUNITY,
            id: idOportunidad,
          });

          oportunidadRec.setValue("entity", clienteNew);

          var itemCountLine = oportunidadRec.getLineCount('item');
          var itemDescuentoLine = itemCountLine + 1;
          for(var i = 0; i < itemCountLine; i++){
            cantidad = oportunidadRec.getSublistValue("item", "quantity", i);
            precioUnitarioOpo = oportunidadRec.getSublistValue("item", "rate", i);
            log.audit("cantidad L:"+i, cantidad);
            if(cantidad == litrosVendidos && precioUnitario != precioUnitarioOpo){
              oportunidadRec.setSublistValue("item", "rate", i, precioUnitario);
            }
          }

          //Se agrega la línea de descuento en caso que el cliente tenga descuento
          if(clienteDescuento){
            for (var i = itemCountLine; i < itemDescuentoLine; i++) {
                recOportunidad.selectLine("item", i);
                recOportunidad.setCurrentSublistValue("item", "item", idArticuloDescuento);
                recOportunidad.setCurrentSublistValue("item", "rate", descuentoUnitario);
                recOportunidad.commitLine("item");
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
          var detalleDespachadorObj = search.create({
            type: "customrecord_ptg_detalle_despachador_",
            filters: [
               ["custrecord_ptg_oportunidad_carburacion","anyof",idOportunidad], 
               "AND", 
               ["custrecord_ptg_detallecrburacion_","anyof",preliquidacionId]/*, 
               "AND", 
               ["internalid","noneof",recId]*/
            ],
            columns: [
              search.createColumn({name: "internalid", label: "Internal ID"}),
              search.createColumn({name: "custrecord_ptg_clientedespachador_", label: "PTG - Cliente Despachador"}),
              search.createColumn({name: "custrecord_ptg_dir_embarque_despachador_", label: "PTG - Dirección embarque despachador"}),
              search.createColumn({name: "custrecord_ptg_num_cli_desp_", label: "PTG - Nombre cliente despachador"})
            ]
          });
          var detalleDespachadorObjCount = detalleDespachadorObj.runPaged().count;
          log.debug("detalleDespachadorObjCount", detalleDespachadorObjCount);
          var detalleDespachadorObjResult = detalleDespachadorObj.run().getRange({
            start: 0,
            end: detalleDespachadorObjCount,
          });
          if(detalleDespachadorObjCount > 0){
            for (var i = 0; i < detalleDespachadorObjCount; i++) {
              (idRegistro = detalleDespachadorObjResult[i].getValue({name: "internalid", label: "Internal ID"}));
              var rec = record.load({
                type: customRec.type,
                id: idRegistro,
                isDynamic: true,
              });
    
              rec.setValue("custrecord_ptg_clientedespachador_", clienteNew);
              rec.setValue("custrecord_ptg_num_cli_desp_", nombreClienteTXT);
              rec.setValue("custrecord_ptg_dir_embarque_despachador_", direccion);
    
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
  
        } else {
          if((tipoPagoNew == prepagoBanorte || tipoPagoNew == prepagoTransferencia || tipoPagoNew == prepagoBancomer || tipoPagoNew == prepagoHSBC || tipoPagoNew == prepagoBanamex || tipoPagoNew == prepagoSantander || tipoPagoNew == prepagoScotian) && !prepagoFormOld && prepagoForm){
              log.audit("Entra descuento prepagos");
              objUpdate.custrecord_ptg_prepago_sin_aplicar_despa = false;
          }
        }
      } else {
      log.audit("Liquidación facturada");
      objUpdate.custrecord_ptg_clientedespachador_ = clienteOld;
    }
    record.submitFields({
      type: "customrecord_ptg_detalle_despachador_",
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
        var idCliente = customRec.getValue("custrecord_ptg_clientedespachador_");
        log.audit("idCliente", idCliente);
        var prepagoValue = customRec.getValue("custrecord_ptg_prepago_despachador");
        var prepagoText = customRec.getText("custrecord_ptg_prepago_despachador");

        var form = context.form;

        var tipodoc = form.addField({
            id: 'custpage_prepago',
            type: serverWidget.FieldType.SELECT,
            label: 'PTG - Prepago',
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

    } catch (e) {
      log.error({ title: e.name, details: e.message });
    }
  }


  return {
    afterSubmit: afterSubmit,
    beforeLoad: beforeLoad,
  };
});
