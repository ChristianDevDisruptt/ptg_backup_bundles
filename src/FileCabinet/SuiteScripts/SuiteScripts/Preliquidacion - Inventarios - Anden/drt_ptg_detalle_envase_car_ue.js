/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Detalle Envases est carb UE
 * Script id: customscript_drt_ptg_detalle_enva_car_ue
 * customer Deployment id: customdeploy_drt_ptg_detalle_enva_car_ue
 * Applied to: PTG - Detalle Envases est carb
 * File: drt_ptg_detalle_envase_car_ue.js
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
      var clienteNew = customRec.getValue("custrecord_ptg_cliente_env_est_carb_");
      var clienteOld = context.oldRecord.getValue("custrecord_ptg_cliente_env_est_carb_");
      var preliquidacion = customRec.getValue("custrecord_ptg_envdetallecarb_");
      var preliquidacionObj = record.load({
        type: "customrecord_ptg_preliqestcarburacion_",
        id: preliquidacion,
      });
      var statusPreliquidacion = preliquidacionObj.getValue("custrecord_ptg_liquidacion_status_carb");
      var prepagoForm = customRec.getValue("custpage_prepago");
      var prepagoFormOld = context.oldRecord.getValue("custpage_prepago");
      var tipoPagoNew = customRec.getValue("custrecord_ptg_tipodepago_enva_est_carb_");
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
        objUpdate.custrecord_ptg_prepago_env_est_carb_ = prepagoForm;
        
      if(clienteNew != clienteOld){
        var idOportunidad = customRec.getValue("custrecord_ptg_id_oportunidad_envases");
        var preliquidacionId = customRec.getValue("custrecord_ptg_envdetallecarb_");
        var nombreClienteTXT = customRec.getValue("custrecord_ptg_nombre_env_est_carb_");
        var direccion = customRec.getValue("custrecord_ptg_direc_env_est_carb_");
        log.audit("idOportunidad", idOportunidad);
        log.audit("preliquidacionId", preliquidacionId);
        log.audit("nombreClienteTXT", nombreClienteTXT);
        log.audit("direccion", direccion);
        var objUpdateOportunidad = {
          entity: clienteNew
        };
        record.submitFields({
          id: idOportunidad,
          type: record.Type.OPPORTUNITY,
          values: objUpdateOportunidad,
        });
        //BÚSQUEDA GUARDADA: PTG - Detalle Gas tipo de pago - Preliq
        var detalleGasTipoPagoObj = search.create({
          type: "customrecord_ptg_detalleenv_est_carb_",
          filters: [
             ["custrecord_ptg_id_oportunidad_envases","anyof",idOportunidad], 
             "AND", 
             ["custrecord_ptg_envdetallecarb_","anyof",preliquidacionId]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "Internal ID"}),
             search.createColumn({name: "custrecord_ptg_cliente_env_est_carb_", label: "PTG - CLIENTE ENV EST CARB"}),
             search.createColumn({name: "custrecord_ptg_nombre_env_est_carb_", label: "PTG - NOMBRE ENV EST CARB"}),
             search.createColumn({name: "custrecord_ptg_direc_env_est_carb_", label: "PTG - DIRECCIÓN ENVASES ENV EST CARB"})
          ]
        });
        var detalleGasTipoPagoObjCount = detalleGasTipoPagoObj.runPaged().count;
        log.debug("detalleGasTipoPagoObjCount", detalleGasTipoPagoObjCount);
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
  
            rec.setValue("custrecord_ptg_cliente_env_est_carb_", clienteNew);
            rec.setValue("custrecord_ptg_nombre_env_est_carb_", nombreClienteTXT);
            rec.setValue("custrecord_ptg_direc_env_est_carb_", direccion);
  
            var recSaved = rec.save();
            log.debug({
              title: "Record updated successfully",
              details: "Id: " + recSaved,
            });
          }
        }

      } else {
        log.audit("Mismo Cliente");
        if((tipoPagoNew == prepagoBanorte || tipoPagoNew == prepagoTransferencia || tipoPagoNew == prepagoBancomer || tipoPagoNew == prepagoHSBC || tipoPagoNew == prepagoBanamex || tipoPagoNew == prepagoSantander || tipoPagoNew == prepagoScotian) && !prepagoFormOld && prepagoForm){
            log.audit("Entra descuento prepagos");
            objUpdate.custrecord_ptg_prepago_sin_apl_env_e_car = false;
        }
      }
    } else {
      log.audit("Liquidación facturada");
      objUpdate.custrecord_ptg_cliente_env_est_carb_ = clienteOld;
    }
    record.submitFields({
      type: "customrecord_ptg_detalleenv_est_carb_",
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
        var idCliente = customRec.getValue("custrecord_ptg_cliente_env_est_carb_");
        log.audit("idCliente", idCliente);
        var prepagoValue = customRec.getValue("custrecord_ptg_prepago_env_est_carb_");
        var prepagoText = customRec.getText("custrecord_ptg_prepago_env_est_carb_");

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
            //columns: ['internalid', 'transactionname']
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
