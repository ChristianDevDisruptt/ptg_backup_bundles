/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Inventario Físico Est Carb UE
 * Script id: customscript_drt_ptg_invent_fi_carb_ue
 * customer Deployment id: customdeploy_drt_ptg_invent_fi_carb_ue
 * Applied to: PTG - Inventario Físico Est Carb
 * File: drt_ptg_inventario_fi_carb_ue.js
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
        var realizarAjuste = 0;
        log.audit("realizarAjuste 0", realizarAjuste);
        var totalesAjustarCampo = parseFloat(newRecord.getValue("custrecord_ptg_totaltanques_est_carb_"));
        if(totalesAjustarCampo != 0){
          realizarAjuste = 1;
        }
        var transaccion = newRecord.getValue("custrecord_ptg_ajuste_inventario_carb");
        var localizacion = newRecord.getValue("custrecord_ptg_est_carb_inv_fisico_");
        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: localizacion,
        });
        var subsidiaria = localizacionObj.getValue("subsidiary");
        log.audit("subsidiaria", subsidiaria);
        var lineCountCilindros = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_cilindros_inv_fis_estcarb",});
        var lineaTotal = realizarAjuste + lineCountCilindros;
        var cilindroArray = [];
        var cantidadArray = [];
        var unidadArray = [];
        var gasLPUnidades = 0;
        var gasLP = 0;
        log.audit("lineaTotal", lineaTotal);

        var unidad10 = 0;
        var unidad20 = 0;
        var unidad30 = 0;
        var unidad45 = 0;
        var cuentaAjuste = 0;
          
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          unidad10 = 24;
          unidad20 = 25;
          unidad30 = 26;
          unidad45 = 27;
          cuentaAjuste = 218;
          gasLPUnidades = 4693;
          gasLP = 4088;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          unidad10 = 12;
          unidad20 = 13;
          unidad30 = 14;
          unidad45 = 15;
          cuentaAjuste = 218;
          gasLPUnidades = 4216;
          gasLP = 4216;
        }


      if(!transaccion && (lineaTotal > 0)){
        for (var i = 0; i < lineCountCilindros; i++) {
          cilindroArray[i] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_cilindros_inv_fis_estcarb",
            fieldId: "custrecord_ptg_tipocil_invfis_estcarb_",
            line: i,
          });
          cantidadArray[i] = parseFloat(newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_cilindros_inv_fis_estcarb",
            fieldId: "custrecord_ptg_kilos_invfis_estcarb_",
            line: i,
          }));


          var itemCilObj = record.load({
            type: search.Type.INVENTORY_ITEM,
            id: cilindroArray[i],
          });
          var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
          if(capacidadArticulo == 10){
            unidadArray[i] = unidad10;
          } else if(capacidadArticulo == 20){
            unidadArray[i] = unidad20;
          } else if(capacidadArticulo == 30){
            unidadArray[i] = unidad30;
          }  else if(capacidadArticulo == 45){
            unidadArray[i] = unidad45;
          }
          log.audit("unidad: L:" + i, unidadArray[i]);

        }

        var recAjusteInventario = record.create({
          type: "inventoryadjustment",
          isDynamic: true,
        });

        recAjusteInventario.setValue("subsidiary", subsidiaria);
        recAjusteInventario.setValue("adjlocation", localizacion);
        recAjusteInventario.setValue("memo", "Ajuste por Inventario Fisico");
        recAjusteInventario.setValue("account", cuentaAjuste);

        for (var k = 0; k < lineCountCilindros; k++) {
          recAjusteInventario.selectLine("inventory", k);
          recAjusteInventario.setCurrentSublistValue("inventory", "item", gasLPUnidades);
          recAjusteInventario.setCurrentSublistValue("inventory", "location", localizacion);
          recAjusteInventario.setCurrentSublistValue("inventory", "units", unidadArray[k]);
          recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArray[k]);
          recAjusteInventario.commitLine("inventory");
        }

        if(realizarAjuste > 0){
          for (var j = lineCountCilindros; j < lineaTotal; j++) {
            recAjusteInventario.selectLine("inventory", j);
            recAjusteInventario.setCurrentSublistValue("inventory", "item", gasLP);
            recAjusteInventario.setCurrentSublistValue("inventory", "location", localizacion);
            recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", totalesAjustarCampo);
            recAjusteInventario.commitLine("inventory");
          }
        }

        var idAjusteInventario = recAjusteInventario.save();
        log.audit("Ajuste de Inventario creado Tanques", idAjusteInventario);


        var objUpdate = {
          custrecord_ptg_ajuste_inventario_carb: idAjusteInventario,
          custrecord_ptg_error_inv_fis_est_carb_: "",
        };
        record.submitFields({
          id: newRecord.id,
          type: newRecord.type,
          values: objUpdate,
        });

        log.audit("Ajuste de Inventario creado", idAjusteInventario);
        log.debug({
          title: "Record created successfully",
          details: "Id: " + recId,
        });
      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
      var objUpdateError = {
        custrecord_ptg_error_inv_fis_est_carb_: e.message,
      };
      record.submitFields({
        id: newRecord.id,
        type: newRecord.type,
        values: objUpdateError,
      });

    }
  }

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
      var lineasCarburacion = "recmachcustrecord_ptg_carburacion_";
      var lineCountCarburacion = newRecord.getLineCount({sublistId: lineasCarburacion});
      var porcentajeLinea = 0;
      var sumaPorcentaje = 0;
      var porcentaje = 0;
      var totalPorcentaje = 0;
      var cantidadAjuste = 0;
      log.audit("cantidadAjuste", cantidadAjuste);
      var inventarioAlmacen = newRecord.getValue("custrecord_ptg_inv_est_carb_");
      log.audit("inventarioAlmacen", inventarioAlmacen);
      var capacidadMaxima = newRecord.getValue("custrecord_ptg_cap_max_est_carb_");
      var cantidadFinalAjuste = 0;



        for (var l = 0; l < lineCountCarburacion; l++) {
          porcentajeLinea = newRecord.getSublistValue({
            sublistId: lineasCarburacion,
            fieldId: "custrecord_ptg_porc_inv_fis_tanque_",
            line: l,
          });
          sumaPorcentaje += porcentajeLinea;
        }
        totalPorcentaje = sumaPorcentaje / lineCountCarburacion;
        porcentaje = totalPorcentaje / 100;
        newRecord.setValue("custrecord_ptg_porcen_prom_", totalPorcentaje);
        cantidadAjuste = capacidadMaxima * porcentaje;
        newRecord.setValue("custrecord_ptg_cantidad_ajuste_est_", cantidadAjuste);

        if(cantidadAjuste){
          if(cantidadAjuste > inventarioAlmacen){
            cantidadFinalAjuste = cantidadAjuste - inventarioAlmacen;
          } else {
            cantidadFinalAjuste = (inventarioAlmacen - cantidadAjuste) * -1;
          }
        } else {
          cantidadFinalAjuste = 0;
        }

        newRecord.setValue("custrecord_ptg_totaltanques_est_carb_", cantidadFinalAjuste);
        
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
