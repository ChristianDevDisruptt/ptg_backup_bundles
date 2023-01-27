/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Inventario Físico Est Carb CS
 * Script id: customscript_drt_ptg_invent_fi_carb_cs
 * Deployment id: customdeploy_drt_ptg_invent_fi_carb_cs
 * Applied to: PTG - Inventario Físico Est Carb
 * File: drt_ptg_inventario_fi_carb_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {

    function fieldChanged(context) {
      try {
        debugger;
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistFieldName = context.fieldId;
      var fieldName = context.fieldId;
      var planta = currentRecord.getValue("custrecord_planta_inv_fis_est_carb_");
      var estacionCarburacion = currentRecord.getValue("custrecord_ptg_est_carb_inv_fisico_");
      var porcentaje = 0;
      var capacidadTotal = 0;
      var gasLP = 0;
      var porcentajeCabecera = currentRecord.getValue("custrecord_ptg_porcen_prom_");
      var capacidadMaxima = currentRecord.getValue("custrecord_ptg_cap_max_est_carb_");
      var cantidadAjusteCabecera = currentRecord.getValue("custrecord_ptg_cantidad_ajuste_est_");
      var sublistaCarburacion = "recmachcustrecord_ptg_carburacion_";
      var porcentajeLinea = 0;
      var porcentaje = 0;
      var porcentajeCab = 0;
      
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        gasLP = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        gasLP = 4216;
      }



      if (fieldName === 'custrecord_ptg_est_carb_inv_fisico_' && estacionCarburacion){
      //BÚSQUEDA GUARDADA: PTG - Tanques
      var tanquesObj = search.create({
        type: "customrecord_ptg_tanques_",
        filters: [["custrecord_ptg_planta_tanque","anyof", planta], "AND", ["isinactive","is","F"]],
        columns: [
           search.createColumn({name: "internalid",sort: search.Sort.ASC,label: "ID interno"})
        ]
      });
     var searchResultCount = tanquesObj.runPaged().count;
     log.debug("tanquesObj result count",searchResultCount);
     var tanquesObjResult = tanquesObj.run().getRange({
       start: 0,
       end: searchResultCount,
      });
      log.audit("detalleDespachadorResult", tanquesObjResult);
       for(var i = 0; i < searchResultCount; i++){
         (idTanque = tanquesObjResult[i].getValue({name: "internalid",sort: search.Sort.ASC,label: "ID interno"}));
         log.audit("idTanque", idTanque);
         currentRecord.selectNewLine({
          sublistId: sublistaCarburacion
        });
        currentRecord.setCurrentSublistValue({
          sublistId: sublistaCarburacion,
          fieldId: 'custrecord_ptg_tanque_est_carb_',
          value: idTanque
        });

        var tanqueObj = record.load({
          type: "customrecord_ptg_tanques_",
          id: idTanque,
        });
        var capacidad = tanqueObj.getValue("custrecord_ptg_capacidadtanque1_");

        capacidadTotal = capacidadTotal + capacidad;

          currentRecord.setCurrentSublistValue({
            sublistId: sublistaCarburacion,
            fieldId: 'custrecord_ptg_cap_tanq_est_carb_',
            value: capacidad
          });

        currentRecord.commitLine({
          sublistId: sublistaCarburacion
        });
      }
      currentRecord.setValue("custrecord_ptg_cap_max_est_carb_", capacidadTotal);
    }

    if (fieldName === 'custrecord_ptg_cantidad_ajuste_est_' && cantidadAjusteCabecera){
      var inventarioAlmacen = currentRecord.getValue("custrecord_ptg_inv_est_carb_");
      var cantidadFinalAjuste = 0;
      if(cantidadAjusteCabecera > inventarioAlmacen){
        cantidadFinalAjuste = cantidadAjusteCabecera - inventarioAlmacen;
      } else {
        cantidadFinalAjuste = (inventarioAlmacen - cantidadAjusteCabecera) * -1;
      }
      currentRecord.setValue("custrecord_ptg_totaltanques_est_carb_", cantidadFinalAjuste);
    }





      if (sublistName === sublistaCarburacion && sublistFieldName === 'custrecord_ptg_tanque_est_carb_'){
        var tanque = currentRecord.getCurrentSublistValue({sublistId: sublistaCarburacion, fieldId: 'custrecord_ptg_tanque_est_carb_'});
        log.audit("tanque", tanque);


      //BÚSQUEDA GUARDADA: PTG - Cantidad disponible
      var itemSearchObj = search.create({
        type: "item",
        filters: [["internalid", "anyof", gasLP], "AND", ["inventorylocation", "anyof", estacionCarburacion],],
        columns: [
          search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Nombre", }),
          search.createColumn({name: "inventorylocation", label: "Ubicación del inventario", }),
          search.createColumn({name: "locationquantityonhand", label: "Ubicación disponible", }),
        ],
      });
      var searchResultCount = itemSearchObj.runPaged().count;
      log.debug("itemSearchObj result count", searchResultCount);

      if (searchResultCount > 0) {
        var itemSrchResults = itemSearchObj.run().getRange({
          start: 0,
          end: 2,
        });
        log.audit("itemSrchResults", itemSrchResults);

        if (itemSrchResults.length > 0) {
          invEnSistema = itemSrchResults[0].getValue({name: "locationquantityonhand", label: "Ubicación disponible",});
          log.audit("invEnSistema", invEnSistema);
          currentRecord.setValue("custrecord_ptg_inv_est_carb_", invEnSistema);
        }
      }

    }

    if (sublistName === sublistaCarburacion && sublistFieldName === 'custrecord_ptg_porc_inv_fis_tanque_'){
      var lineCount = currentRecord.getLineCount({ sublistId:sublistaCarburacion })||0;
      log.debug("lineCount", lineCount);

      
      
       var porcentajeLlenado = currentRecord.getCurrentSublistValue({
         sublistId: sublistaCarburacion,
         fieldId: 'custrecord_ptg_porc_inv_fis_tanque_'
       });
       log.debug("porcentajeLlenado", porcentajeLlenado);

       var porcentaje = porcentajeLlenado / lineCount;
       log.debug("porcentaje", porcentaje);

       var porcentajeCab = porcentajeCabecera + porcentaje;

       currentRecord.setValue("custrecord_ptg_porcen_prom_", porcentajeCab);
    }

    if (porcentajeCabecera && fieldName === 'custrecord_ptg_porcen_prom_'){
      var porcenta = porcentajeCabecera / 100;
      var cantidadAjuste = porcenta * capacidadMaxima;
      currentRecord.setValue("custrecord_ptg_cantidad_ajuste_est_", cantidadAjuste);
    }

    if (sublistName === 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb' && sublistFieldName === 'custrecord_ptg_tipocil_invfis_estcarb_'){

      var articuloCilindro = currentRecord.getCurrentSublistValue({
        sublistId: 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb',
        fieldId: 'custrecord_ptg_tipocil_invfis_estcarb_'
      });

      //BÚSQUEDA GUARDADA: PTG - Cantidad disponible
      var itemSearchCilObj = search.create({
        type: "item",
        filters: [["internalid", "anyof", articuloCilindro], "AND", ["inventorylocation", "anyof", estacionCarburacion],],
        columns: [
          search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Nombre", }),
          search.createColumn({name: "inventorylocation", label: "Ubicación del inventario", }),
          search.createColumn({name: "locationquantityonhand", label: "Ubicación disponible", }),
        ],
      });
      var searchResultCilCount = itemSearchCilObj.runPaged().count;
      log.debug("itemSearchCilObj result count", searchResultCilCount);

      if (searchResultCilCount > 0) {
        var itemSrchCilResults = itemSearchCilObj.run().getRange({
          start: 0,
          end: 2,
        });
        log.audit("itemSrchCilResults", itemSrchCilResults);

        if (itemSrchCilResults.length > 0) {
          invEnSistemaCil = itemSrchCilResults[0].getValue({name: "locationquantityonhand", label: "Ubicación disponible",});
          log.audit("invEnSistemaCil", invEnSistemaCil);
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb',
            fieldId: 'custrecord_ptg_capcil_invfis_estcarb_',
            value: invEnSistemaCil
          });
        }
      }

    }

    if (sublistName === 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb' && sublistFieldName === 'custrecord_ptg_cap_invfis_estcarb_'){

      var cantidadEnSistema = parseFloat(currentRecord.getCurrentSublistValue({
        sublistId: 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb',
        fieldId: 'custrecord_ptg_capcil_invfis_estcarb_'
      }));

      var cantidadAAjustar = parseFloat(currentRecord.getCurrentSublistValue({
        sublistId: 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb',
        fieldId: 'custrecord_ptg_cap_invfis_estcarb_'
      }));

      var diferencia = (cantidadEnSistema - cantidadAAjustar) * -1;

      currentRecord.setCurrentSublistValue({
        sublistId: 'recmachcustrecord_ptg_cilindros_inv_fis_estcarb',
        fieldId: 'custrecord_ptg_kilos_invfis_estcarb_',
        value: diferencia
      });

    }
      } catch (error) {
        log.error("error fieldChange", error);
      }

    }

    function validateLine(context){
      try {
        log.audit("validateLine");
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var lineasCilindros = "recmachcustrecord_ptg_cilindros_inv_fis_estcarb";
        var sublistaCarburacion = "recmachcustrecord_ptg_carburacion_";
        var porcentaje = 0;
        var porcentajeCab = 0;

        if (sublistName === lineasCilindros){
          log.audit("validateLine", "+++ cilindros +++");
          var articulo = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_tipocil_invfis_estcarb_'});
          var cantidadAjustar = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_cap_invfis_estcarb_'});

          if (!articulo || !cantidadAjustar) {
            var options = {
              title: "Falta de datos",
              message: "Faltan datos requeridos en la línea."
            };
            dialog.alert(options);
            log.audit("No coincide");
            return false;
          } else {
            return true;
          }
        } else {
          
          log.audit("validateLine", "*** carburacion ***");
          return true;
        }
      } catch (error) {
        log.error("error validateLine", error);
      }
    }


      function saveRecord(context) {
        try {
          var currentRecord = context.currentRecord;
          var sublistaCarburacion = "recmachcustrecord_ptg_carburacion_";
          var sublistaCilindros = "recmachcustrecord_ptg_cilindros_inv_fis_estcarb";
          var lineasCarburacion = currentRecord.getLineCount({sublistId: sublistaCarburacion,});
          var lineasCilindros = currentRecord.getLineCount({sublistId: sublistaCilindros,});
          var sumaCarburacion = 0;
          var sumaCilindros = 0;
          for (var i = 0; i < lineasCarburacion; i++) {
            var tanqueLinea = currentRecord.getSublistValue({sublistId: sublistaCarburacion, fieldId: "custrecord_ptg_tanque_est_carb_", line: i,});
            var capacidadLinea = currentRecord.getSublistValue({sublistId: sublistaCarburacion, fieldId: "custrecord_ptg_cap_tanq_est_carb_", line: i,});
            var porcentajeLinea = currentRecord.getSublistValue({sublistId: sublistaCarburacion, fieldId: "custrecord_ptg_porc_inv_fis_tanque_", line: i,});
            log.audit("tanqueLinea " + i, tanqueLinea);
            log.audit("capacidadLinea " + i, capacidadLinea);
            log.audit("porcentajeLinea " + i, porcentajeLinea);
            if(!tanqueLinea || !capacidadLinea || !porcentajeLinea){
              sumaCarburacion += 1;
            }
          }

          if(lineasCarburacion > 0 && lineasCilindros > 0){

            if(sumaCarburacion == 0){
              return true;
            } else {
              var options = {
                title: "Faltan datos",
                message: "Faltan datos a nivel línea en Carburación.",
              };
              dialog.alert(options);
              return false;
            }

          } else {
            if(lineasCarburacion == 0){
              var options = {
                title: "Faltan datos",
                message: "No hay datos para registrar en Carburación.",
              };
              dialog.alert(options);
              return false;
            } else if(lineasCilindros == 0){
              var options = {
                title: "Faltan datos",
                message: "No hay datos para registrar en Cilindros.",
              };
              dialog.alert(options);
              return false;
            }
          }

        } catch (error) {
          log.error("Error saveRecord", error);
        }

      }

    return {
      fieldChanged: fieldChanged,
      saveRecord: saveRecord,
      validateLine: validateLine,

    };
  });
