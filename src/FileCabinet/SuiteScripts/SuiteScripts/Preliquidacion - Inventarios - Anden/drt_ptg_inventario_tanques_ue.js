/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: PTG - Inventario Tanques UE
 * Script id: customscript_drt_ptg_invent_tanques_ue
 * customer Deployment id: customdeploy_drt_ptg_invent_tanques_ue
 * Applied to: PTG - Inventario Tanques
 * File: drt_ptg_inventario_tanques_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
  function afterSubmit(context) {
    try {
     // if (context.type == "create") {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var totalesAjustarCampo = parseFloat(newRecord.getValue("custrecord_ptg_total_tanques"));
        var transaccion = newRecord.getValue("custrecord_ptg_ajuste_inventario_tanques");
        var ubicacionSalchicha = newRecord.getValue("custrecord_ptg_planta_inv_tanques_");
        var cierreInventarios = newRecord.getValue("custrecord_ptg_cierre_inv_tanques_");
        var inicioInventarios = newRecord.getValue("custrecord_ptg_cierre_inv_tanques_");
        var totalesAjustar = 0;
        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: ubicacionSalchicha,
        });
        var cuentaDefault = 0;
        var gasLP = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          cuentaDefault = 218;
          gasLP = 4088;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          cuentaDefault = 218;
          gasLP = 4216;
        }


        var subsidiaria = localizacionObj.getValue("subsidiary");
      

      if(!transaccion && cierreInventarios){

        var recAjusteInventario = record.create({
          type: "inventoryadjustment",
          isDynamic: true,
        });

        recAjusteInventario.setValue("subsidiary", subsidiaria);
        recAjusteInventario.setValue("adjlocation", ubicacionSalchicha);
        recAjusteInventario.setValue("memo", "Ajuste Inventario Fisico de Tanques");
        recAjusteInventario.setValue("account", cuentaDefault);

        for (var k = 0; k < 1; k++) {
          recAjusteInventario.selectLine("inventory", k);
          recAjusteInventario.setCurrentSublistValue("inventory", "item", gasLP);
          recAjusteInventario.setCurrentSublistValue("inventory", "location", ubicacionSalchicha);
          recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", totalesAjustarCampo);
          recAjusteInventario.commitLine("inventory");
        }

        var idAjusteInventario = recAjusteInventario.save();
        log.audit("Ajuste de Inventario creado Tanques", idAjusteInventario);

        var objUpdate = {
          custrecord_ptg_ajuste_inventario_tanques: idAjusteInventario,
          custrecord_ptg_error_inv_tanques_: "",
        };
        
      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
      objUpdate = {
        custrecord_ptg_error_inv_tanques_: e.message,
      };
    } finally {
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdate,
      });

      log.debug({
        title: "Record created successfully Inventario Tanques",
        details: "Id: " + recId,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
        var cantidadAjuste = newRecord.getValue("custrecord_ptg_cantidadajuste_");
        var inventarioAlmacen = newRecord.getValue("custrecord_ptg_inv_almacengrl_");
        var cantidadFinalAjuste = 0;
  
        var folio = newRecord.getValue("name");
        if(!folio || folio == "" || folio == "Por Asignar"){
          var folioObj = search.create({
            type: "customrecord_ptg_inventariotanques_",
            filters: [],
            columns: []
         });
    
         var searchResultCount = folioObj.runPaged().count;
  
         var numeroEntero = searchResultCount + 1;
         newRecord.setValue("name", numeroEntero.toFixed(0));

        }

        if(cantidadAjuste > inventarioAlmacen){
          cantidadFinalAjuste = cantidadAjuste - inventarioAlmacen;
        } else {
          cantidadFinalAjuste = (inventarioAlmacen - cantidadAjuste) * -1;
        }
       

        newRecord.setValue("custrecord_ptg_total_tanques", cantidadFinalAjuste);
        
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
