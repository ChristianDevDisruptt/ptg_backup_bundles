/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Gas tomado a cuenta UE
 * Script id: customscript_drt_ptg_gas_tomado_cuent_ue
 * customer Deployment id: customdeploy_drt_ptg_gas_tomado_cuent_ue
 * Applied to: PTG - Gas tomado a cuenta
 * File: drt_ptg_gas_tomado_cuenta_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {

  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var folio = newRecord.getValue("custrecord_ptg_num_toma_a_cuenta_");
        var idOportunidad = newRecord.getValue("custrecord_ptg_ord_venta_gas_cuenta_");

        var recordOportunidad = record.load({
          type: record.Type.OPPORTUNITY,
          id: idOportunidad,
          isDynamic: true,
        });

        var numeroViaje = recordOportunidad.getValue("custbody_ptg_numero_viaje");

        if(numeroViaje){
          var recordTablaViajes = record.load({
            type: "customrecord_ptg_tabladeviaje_enc2_",
            id: numeroViaje,
            isDynamic: true,
          });
          var ruta = recordTablaViajes.getValue("custrecord_ptg_ruta");
          var recordUbicacion = record.load({
            type: record.Type.LOCATION,
            id: ruta,
            isDynamic: true,
          });
          var planta = recordUbicacion.getValue("parent");
  
          newRecord.setValue("custrecord_ptg_planta_gas_tomcuenta_", planta);
        }
  
        if (!folio || folio == "") {
          var numViajeSearchObj = search.create({
            type: "customrecord_ptg_gas_tomado_a_cuenta_",
            filters: [],
            columns: []
          });
    
         var searchResultCount = numViajeSearchObj.runPaged().count;
              var numeroEntero = searchResultCount + 1;
              newRecord.setValue("custrecord_ptg_num_toma_a_cuenta_", numeroEntero.toFixed(0));
              newRecord.setValue("name", numeroEntero.toFixed(0));
        }
        
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }


  function afterSubmit(context) {
    try {
      //if (context.type == "create") {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var tipo = newRecord.type;
        var planta = newRecord.getValue("custrecord_ptg_planta_gas_tomcuenta_");
        var plantaTXT = newRecord.getValue("custrecord_ptg_planta_gas_txt");
        var cliente = newRecord.getValue("custrecord_ptg_cliente_gas_cuenta_");
        var kilogramos = newRecord.getValue("custrecord_ptg_lts_recibi_gas_cuenta_");
        var transaccionAjuste = newRecord.getValue("custrecord_ptg_ajuste_inventario_gtc");
        var transaccionNota = newRecord.getValue("custrecord_ptg_nota_credito_gtc");
        var idOportunidad = newRecord.getValue("custrecord_ptg_ord_venta_gas_cuenta_");
        var idGasLP = 0;
        var cuentaAjuste = 0;
        var formularioNotaCredito = 0;
        var objUpdate = {};
        var rate = 0;
        var idAlmacenCentral = 0;
        var subsidiaria = 0;
        log.audit("plantaTXT", plantaTXT);
        log.audit("transaccionAjuste", transaccionAjuste);
        log.audit("transaccionNota", transaccionNota);

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          cuentaAjuste = 218;
          idGasLP = 4088;
          formularioNotaCredito = 435;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          cuentaAjuste = 218;
          idGasLP = 4216;
          formularioNotaCredito = 307;
        }

        //SS: PTG - Almacén Central por Planta
        var locationSearchObj = search.create({
          type: "location",
          filters: [
            ["custrecord_ptg_almacencentral_","is","T"], "AND",
            ["name","startswith",plantaTXT]
          ],
          columns: [
            search.createColumn({name: "internalid", sort: search.Sort.ASC, label: "Internal ID"}),
            search.createColumn({name: "name", label: "Nombre"})
          ]
        });
        log.audit("locationSearchObj", locationSearchObj);
        var searchResultCount = locationSearchObj.runPaged().count;
        if(searchResultCount > 0){
          var locationSearchObjResult = locationSearchObj.run().getRange({
            start: 0,
            end: 2,
          });
          (idAlmacenCentral = locationSearchObjResult[0].getValue({name: "internalid", label: "ID interno"}));
          log.audit("idAlmacenCentral", idAlmacenCentral);
          var localizacionObj = record.load({
            type: record.Type.LOCATION,
            id: planta,
          });
          subsidiaria = localizacionObj.getValue("subsidiary");
          log.audit("subsidiaria", subsidiaria);
        }
        
      if(!transaccionAjuste || !transaccionNota){
        log.audit("Entra");

        var oportunidadObj = record.load({
          type: record.Type.OPPORTUNITY,
          id: idOportunidad,
        });

        for (var t = 0; t < 1; t++){
          rate = oportunidadObj.getSublistValue({
              sublistId: "item",
              fieldId: "rate",
              line: t,
          });
          log.audit("rate", rate);
        }

        
        if(!transaccionAjuste){
          var recAjusteInventario = record.create({
            type: "inventoryadjustment",
            isDynamic: true,
          });
          
          recAjusteInventario.setValue("subsidiary", subsidiaria);
          recAjusteInventario.setValue("adjlocation", idAlmacenCentral);
          recAjusteInventario.setValue("account", cuentaAjuste);
          
          for (var k = 0; k < 1; k++) {
            recAjusteInventario.selectLine("inventory", k);
            recAjusteInventario.setCurrentSublistValue("inventory", "item", idGasLP);
            recAjusteInventario.setCurrentSublistValue("inventory", "location", idAlmacenCentral);
            recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", kilogramos);
            recAjusteInventario.commitLine("inventory");
          }
          
          var idAjusteInventario = recAjusteInventario.save();
          log.debug("Ajuste de inventario creado", "ID: "+idAjusteInventario);

          objUpdate.custrecord_ptg_ajuste_inventario_gtc = idAjusteInventario;
        } else {
          objUpdate.custrecord_ptg_ajuste_inventario_gtc = transaccionAjuste;
        }
        
        if(!transaccionNota){
          var recNotaCredito = record.create({
            type: "creditmemo",
            isDynamic: true,
          });
          
          recNotaCredito.setValue("customform", formularioNotaCredito);
          recNotaCredito.setValue("entity", cliente);
          recNotaCredito.setValue("location", idAlmacenCentral);
          
          for (var k = 0; k < 1; k++) {
            recNotaCredito.selectLine("item", k);
            recNotaCredito.setCurrentSublistValue("item", "item", idGasLP);
            recNotaCredito.setCurrentSublistValue("item", "quantity", kilogramos);
            recNotaCredito.setCurrentSublistValue("item", "rate", rate);
            recNotaCredito.commitLine("item");
          }
          
          var idNotaCredito = recNotaCredito.save({
            ignoreMandatoryFields: true
          });
          log.debug("Nota de credito creada", "ID: "+idNotaCredito);
          objUpdate.custrecord_ptg_nota_credito_gtc = idNotaCredito;
        } else {
          objUpdate.custrecord_ptg_nota_credito_gtc = transaccionNota;
        }
        
        if(objUpdate.custrecord_ptg_ajuste_inventario_gtc && objUpdate.custrecord_ptg_nota_credito_gtc){
          objUpdate.custrecord_ptg_error_gas_cuenta_ = "";
        }
      
      } else {
        if(transaccionAjuste && transaccionNota){
          log.audit("entra else");
          objUpdate.custrecord_ptg_error_gas_cuenta_ = "";
        }
      }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
      objUpdate.custrecord_ptg_error_gas_cuenta_ = e.message;
    } finally {
      var registroOportunidad = record.submitFields({
        id: recId,
        type: tipo,
        values: objUpdate,
      });

      log.debug({
        title: "Record created successfully: "+recId,
        details: "Registro actualizado: " +registroOportunidad ,
      });
    }
  }
  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
  };
});
