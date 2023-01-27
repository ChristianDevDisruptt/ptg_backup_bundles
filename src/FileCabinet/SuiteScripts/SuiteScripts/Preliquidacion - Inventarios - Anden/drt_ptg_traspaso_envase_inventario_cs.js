/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Trapaso de Envases Inventario CS
 * Script id: customscript_drt_ptg_trasp_env_inv_cs
 * customer Deployment id: customdeploy_drt_ptg_trasp_env_inv_cs
 * Applied to: PTG - Trapaso de Envases Inventario
 * File: drt_ptg_traspaso_envase_inventario_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog"], function (record, search, error, runtime, dialog) {
  function fieldChanged(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistFieldName = context.fieldId;
      var line = context.line;
      var inventarioCero = 0;
      var ubicacionOrigen = currentRecord.getValue("custrecord_ptg_ubicacionorigen_trasp_env");
      log.audit("ubicacionOrigen", ubicacionOrigen);

      if (sublistName === "recmachcustrecord_ptg_cantidadatraspasar_" && sublistFieldName === "custrecord_ptg_art_traspaso_inv_") {
        var articulo = currentRecord.getCurrentSublistValue({sublistId: "recmachcustrecord_ptg_cantidadatraspasar_", fieldId: "custrecord_ptg_art_traspaso_inv_",});
        log.audit("articulo", articulo);

        if (ubicacionOrigen) {
          //BÚSQUEDA GUARDADA: PTG - Cantidad disponible
          var itemSearchObj = search.create({
            type: "item",
            filters: [["internalid", "anyof", articulo], "AND", ["inventorylocation", "anyof", ubicacionOrigen],],
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

              if (invEnSistema) {
                currentRecord.setCurrentSublistValue({
                  sublistId: "recmachcustrecord_ptg_cantidadatraspasar_", 
                  fieldId: "custrecord_ptg_existencia_", 
                  value: invEnSistema,
                });
              } else {
                currentRecord.setCurrentSublistValue({
                  sublistId: "recmachcustrecord_ptg_cantidadatraspasar_", 
                  fieldId: "custrecord_ptg_existencia_", 
                  value: inventarioCero,
                });
              }
            }
          } else {
            currentRecord.setCurrentSublistValue({
              sublistId: "recmachcustrecord_ptg_cantidadatraspasar_",
              fieldId: "custrecord_ptg_existencia_",
              value: inventarioCero,
            });
          }
        }
      }
    } catch (error) {
      console.log({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }

  function validateLine(context) {
    var currentRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var ubicacion = currentRecord.getValue("custrecord_ptg_ubicacionorigen_trasp_env");
    log.audit("ubicacion VL", ubicacion);

    if (
    currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cant_a_trasp_env_inv_",}) &&
    ubicacion) {
      var articulo = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_art_traspaso_inv_",});
      var cantidadDotacion = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cant_a_trasp_env_inv_",});
      var cantidadDisponible = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_existencia_",});
      log.audit("articulo VL", articulo);
      log.audit("cantidadDotacion VL", cantidadDotacion);
      log.audit("cantidadDisponible VL", cantidadDisponible);

      if (cantidadDotacion > cantidadDisponible) {
        var options = {
          title: "Máximo superado",
          message: "La cantidad ingresada (" + cantidadDotacion + ") supera el stock (" + cantidadDisponible +") del artículo",
        };
        dialog.alert(options);
        log.audit("Cantidad superada");
        //return false;
      } else {
        return true;
      }
    }
  }

  return {
    //pageInit: pageInit,
    fieldChanged: fieldChanged,
    validateLine: validateLine,
  };
});
