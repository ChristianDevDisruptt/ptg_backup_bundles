/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: PTG - Inventario físico Pipas UE
 * Script id: customscript_drt_ptg_invent_fi_pipas_ue
 * customer Deployment id: customdeploy_drt_ptg_invent_fi_pipas_ue
 * Applied to: PTG - Inventario físico Pipas
 * File: drt_ptg_inventario_fi_pipas_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
  function afterSubmit(context) {
    try {
      //if (context.type == "create") {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var localizacion = newRecord.getValue("custrecord_ptg_loca_inv_fisico_");
        var transaccion = newRecord.getValue("custrecord_ptg_ajuste_inventario");
        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: localizacion,
        });
        var subsidiaria = localizacionObj.getValue("subsidiary");
        var lineCount = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_pipadetalle_",});
        var pipaArray = [];
        var cantidadArray = [];
        var equiposObj = [];
        var ubicacionArray = [];
        var cuentaInventario = 0;
        var gasLP = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          cuentaInventario = 218;
          gasLP = 4088;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          cuentaInventario = 218;
          gasLP = 4216;
        }

      if(!transaccion){

        for (var l = 0; l < lineCount; l++) {
          pipaArray[l] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_pipadetalle_",
            fieldId: "custrecord_ptg_num_pipa_",
            line: l,
          });
          cantidadArray[l] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_pipadetalle_",
            fieldId: "custrecord_ptg_ajuste_detalle_",
            line: l,
          });
          equiposObj[l] = record.load({
            type: "customrecord_ptg_equipos",
            id: pipaArray[l],
          });

          ubicacionArray[l] = equiposObj[l].getValue("custrecord_ptg_ubicacionruta_");
        }

        var recAjusteInventario = record.create({
          type: "inventoryadjustment",
          isDynamic: true,
        });

        recAjusteInventario.setValue("subsidiary", subsidiaria);
        recAjusteInventario.setValue("adjlocation", localizacion);
        recAjusteInventario.setValue("account", cuentaInventario);

        for (var k = 0; k < lineCount; k++) {
          recAjusteInventario.selectLine("inventory", k);
          recAjusteInventario.setCurrentSublistValue("inventory", "item", gasLP);
          recAjusteInventario.setCurrentSublistValue("inventory", "location", ubicacionArray[k]);
          recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArray[k]);
          recAjusteInventario.commitLine("inventory");
        }

        var idAjusteInventario = recAjusteInventario.save();
        log.audit("Ajuste de Inventario creado", idAjusteInventario);

        var objUpdate = {
          custrecord_ptg_ajuste_inventario: idAjusteInventario,
          custrecord_ptg_error_inv_fisico_: "",
        };
        

        
        
      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
      var objUpdate = {
        custrecord_ptg_error_inv_fisico_: e.message,
      };
    } finally {
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdate,
      });
      log.debug({
        title: "Record created successfully",
        details: "Id: " + recId,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var folio = newRecord.getValue("custrecord_ptg_num_inv_fisico_");
        if(!folio){
          var folioObj = search.create({
            type: "customrecord_ptg_inv_fisico_pipas_",
            filters: [],
            columns: []
         });
    
         var searchResultCount = folioObj.runPaged().count;
  
         var numeroEntero = searchResultCount + 1;
         newRecord.setValue("custrecord_ptg_num_inv_fisico_", numeroEntero.toFixed(0));
         newRecord.setValue("name", numeroEntero.toFixed(0));

        }
        
        
    } catch (e) {
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
