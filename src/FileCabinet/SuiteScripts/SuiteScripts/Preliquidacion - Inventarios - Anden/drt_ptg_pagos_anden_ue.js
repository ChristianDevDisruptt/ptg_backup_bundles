/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - PAGOS EN ANDEN UE
 * Script id: customscript_drt_ptg_pagos_anden_ue
 * customer Deployment id: customdeploy_drt_ptg_pagos_anden_ue
 * Applied to: PTG - PAGOS EN ANDEN
 * File: drt_ptg_pagos_anden_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search"], function (record, search) {
  function afterSubmit(context) {
    try {
      //if (context.type == "create") {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var sublistaTiposDePagos = "recmachcustrecord_ptg_pago_anden_detalle";
        var lineCountCilindros = newRecord.getLineCount({sublistId: sublistaTiposDePagos});
        var idTipoPagoArray = [];
        
        for (var i = 0; i < lineCountCilindros; i++) {
          tipoPago = newRecord.getSublistValue({
            sublistId: sublistaTiposDePagos,
            fieldId: "custrecord_ptg_tipo_pago_anden",
            line: i,
          });
          idTipoPagoArray.push(tipoPago);
        }

        var objUpdate = {
          custrecord_ptg_tipos_de_pago: idTipoPagoArray,
        };
        record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        });

        log.debug({
          title: "Record created successfully",
          details: "Id: " + recId,
        });
      //}
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }
  return {
    afterSubmit: afterSubmit,
  };
});
