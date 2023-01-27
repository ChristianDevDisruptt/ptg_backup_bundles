/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Ventas Estacionario UE
 * Script id: customscript_drt_ptg_ventas_estacion_ue
 * customer Deployment id: customdeploy_drt_ptg_ventas_estacion_ue
 * Applied to: PTG - Ventas Estacionario
 * File: drt_ptg_ventas_estacionarios_ue.js
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
      var tipoRegistro = customRec.type;
      var clienteNew = customRec.getValue("custrecord_ptg_cliente_est_vts");
      var clienteOld = context.oldRecord.getValue("custrecord_ptg_cliente_est_vts");
      var rfcClienteNew = customRec.getValue("custrecord_ptg_rfc_cliente_est_vts");
      var rfcClienteOld = context.oldRecord.getValue("custrecord_ptg_rfc_cliente_est_vts");
      var preliquidacionEstacionario = customRec.getValue("custrecord_ptg_preliqui_rel_vts_");
      var prepagoForm = customRec.getValue("custpage_prepago");
      var prepagoFormOld = context.oldRecord.getValue("custpage_prepago");
      var prepago = customRec.getValue("custrecord_ptg_prepago_est_vts_");
      var tipoPagoNew = customRec.getValue("custrecord_ptg_tipodepago_estacionarios_");
      var objUpdate = {};
      var prepagoBanorteId = 0;
      var prepagoTransferenciaId = 0;
      var prepagoBancomerId = 0;
      var prepagoHSBCId = 0;
      var prepagoBanamexId = 0;
      var prepagoSantanderId = 0;
      var prepagoScotianId = 0;
      var estatusServicioFacturado = 0;
      
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        prepagoBanorteId = 2;
        prepagoTransferenciaId = 8;
        prepagoBancomerId = 13;
        prepagoHSBCId = 14;
        prepagoBanamexId = 15;
        prepagoSantanderId = 16;
        prepagoScotianId = 17;
        estatusServicioFacturado = 4;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        prepagoBanorteId = 2;
        prepagoTransferenciaId = 8;
        prepagoBancomerId = 13;
        prepagoHSBCId = 14;
        prepagoBanamexId = 15;
        prepagoSantanderId = 16;
        prepagoScotianId = 17;
        estatusServicioFacturado = 4;
      }


      var preliquidacionObj = record.load({
        type: "customrecord_ptg_preliq_estacionario_",
        id: preliquidacionEstacionario,
    });
    var statusPreliquidacion = preliquidacionObj.getValue("custrecord_ptg_liquidacion_status_est");

    if(statusPreliquidacion != estatusServicioFacturado){
      if((clienteNew != clienteOld) || (rfcClienteNew != rfcClienteOld)){
        var idOportunidad = customRec.getValue("custrecord_ptg_oportunidad_estacionario");
        var preliquidacionId = customRec.getValue("custrecord_ptg_preliqui_rel_vts_");
        var nombreClienteTXT = customRec.getValue("custrecord_ptg_nombre_cli_est_vts");
        var direccion = customRec.getValue("custrecord_ptg_direccion_cli_est_");
        log.audit("idOportunidad", idOportunidad);
        log.audit("preliquidacionId", preliquidacionId);
        log.audit("nombreClienteTXT", nombreClienteTXT);
        log.audit("direccion", direccion);
        var objUpdateOportunidad = {
          entity: clienteNew,
          custentity_mx_rfc: rfcClienteNew
        };
        record.submitFields({
          id: idOportunidad,
          type: record.Type.OPPORTUNITY,
          values: objUpdateOportunidad,
        });

        //BÚSUQEDA GUARDADA: PTG - Ventas Estacionario Preliq
        var ventasEstacionariosObj = search.create({
          type: "customrecord_ptg_ventas_estacionario",
          filters: [
            ["custrecord_ptg_oportunidad_estacionario","anyof", idOportunidad], "AND", 
             [["custrecord_ptg_preliqui_rel_vts_","anyof",preliquidacionId],"OR",["custrecord_ptg_registro_oportunidad","is","T"]], "AND", 
             ["internalid","noneof",recId]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "Internal ID"}),
             search.createColumn({name: "custrecord_ptg_cliente_est_vts", label: "PTG - Cliente est ventas"}),
             search.createColumn({name: "custrecord_ptg_nombre_cli_est_vts", label: "PTG - Nombre cli est vts"}),
             search.createColumn({name: "custrecord_ptg_direccion_cli_est_", label: "PTG - Direccion clie est"})
          ]
        });
        var ventasEstacionariosObjCount = ventasEstacionariosObj.runPaged().count;
        log.debug("ventasEstacionariosObjCount",ventasEstacionariosObjCount);
        var ventasEstacionariosObjResult = ventasEstacionariosObj.run().getRange({
          start: 0,
          end: ventasEstacionariosObjCount,
        });
        for (var i = 0; i < ventasEstacionariosObjCount; i++) {
          (idRegistro = ventasEstacionariosObjResult[i].getValue({name: "internalid", label: "Internal ID"}));
          var rec = record.load({
            type: customRec.type,
            id: idRegistro,
            isDynamic: true,
          });

          rec.setValue("custrecord_ptg_cliente_est_vts", clienteNew);
          rec.setValue("custrecord_ptg_nombre_cli_est_vts", nombreClienteTXT);
          rec.setValue("custrecord_ptg_direccion_cli_est_", direccion);

          var recSaved = rec.save();
          log.debug({
            title: "Record updated successfully",
            details: "Id: " + recSaved,
          });
        }
      } else {
        log.audit("Mismo Cliente");
        if((tipoPagoNew == prepagoBanorteId || tipoPagoNew == prepagoTransferenciaId || tipoPagoNew == prepagoBancomerId || tipoPagoNew == prepagoHSBCId || tipoPagoNew == prepagoBanamexId || tipoPagoNew == prepagoSantanderId || tipoPagoNew == prepagoScotianId) && !prepagoFormOld && prepagoForm){
            log.audit("Entra descuento prepagos");
            objUpdate.custrecord_ptg_prepago_aplicado_est_vts_ = false;
        }
      }
    }

      

      objUpdate.custrecord_ptg_prepago_est_vts_ = prepagoForm;

      var registroActualizado = record.submitFields({
        type: tipoRegistro,
        id: recId,
        values: objUpdate,
      });
      log.audit("Registro actualizado ", registroActualizado);
    }
    } catch (e) {
      log.error({ title: e.name, details: e.message });
    }
  }

  function beforeLoad(context){
    try {
        var customRec = context.newRecord;
        var recId = customRec.id;
        var idCliente = customRec.getValue("custrecord_ptg_cliente_est_vts");
        var prepagoValue = customRec.getValue("custrecord_ptg_prepago_est_vts_");
        var prepagoText = customRec.getText("custrecord_ptg_prepago_est_vts_");

        
        var form = context.form;
        var tipodoc = form.addField({
            id: 'custpage_prepago',
            type: serverWidget.FieldType.SELECT,
            label: 'PTG - Prepago',
        });
        
        if(prepagoValue){
          tipodoc.addSelectOption({value: prepagoValue, text: prepagoText});
        }

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
