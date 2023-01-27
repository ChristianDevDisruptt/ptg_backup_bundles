/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Traspaso de entrada en Est Carb CS
 * Script id: customscript_drt_traspaso_entrad_carb_cs
 * customer Deployment id: customdeploy_drt_traspaso_entrad_carb_cs
 * Applied to: PTG - Traspaso de entrada en Est Carb
 * File: drt_ptg_traspaso_entrada_carb_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var numViaje = currentRecord.getValue("custrecord_ptg_numvijae_dot_est_carb_");
      var vehiculo = currentRecord.getValue("custrecord_ptg_pipa_dot_est_carb_");
      var estatusViajeEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusViajeEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusViajeEnCurso = 3;
      }
      log.audit("numViaje", numViaje);
      log.audit("vehiculo", vehiculo);

      if (vehiculo && fieldName === "custrecord_ptg_pipa_dot_est_carb_") {
        //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
        var viajeActivoObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViajeEnCurso]],
          columns:[
             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})
          ]
        });
        var viajeActivoObjCount = viajeActivoObj.runPaged().count;
        if(viajeActivoObjCount > 0){
          var viajeActivoObjResult = viajeActivoObj.run().getRange({
            start: 0,
            end: 2,
          });
          numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
          currentRecord.setValue("custrecord_ptg_numvijae_dot_est_carb_",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_numvijae_dot_est_carb_",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",};
            dialog.alert(options);
        }
      }

    }

  function saveRecord(context) {
    try {
      debugger;
      var currentRecord = context.currentRecord;
      var pipa = currentRecord.getValue("custrecord_ptg_pipa_dot_est_carb_");
      var articulo = 0;
      var cantidadDotacion = currentRecord.getValue("custrecord_ptg_litros_recibidos_");
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        articulo = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        articulo = 4216;
      }

      if (pipa) {
        var pipaObj = record.load({
          type: "customrecord_ptg_equipos",
          id: pipa,
        });
        var ubicacionOrigen = pipaObj.getValue("custrecord_ptg_ubicacionruta_");
        log.audit("ubicacionOrigen", ubicacionOrigen);
        var itemSearchObj = search.create({
          type: "item",
          filters: [["internalid", "anyof", articulo], "AND", ["inventorylocation", "anyof", ubicacionOrigen],],
          columns: [
            search.createColumn({name: "itemid",sort: search.Sort.ASC,label: "Nombre",}),
            search.createColumn({name: "inventorylocation",label: "Ubicación del inventario",}),
            search.createColumn({name: "locationquantityonhand",label: "Location On Hand",}),
          ],
        });
        var srchResults = itemSearchObj.run().getRange({
          start: 0,
          end: 2,
        });
        log.audit("srchResults", srchResults);
        if (srchResults.length > 0) {
          (nombre = srchResults[0].getValue({name: "itemid",sort: search.Sort.ASC,label: "Nombre",})),
          (ubicacionInventario = srchResults[0].getValue({name: "inventorylocation",label: "Ubicación del inventario",})),
          (disponible = srchResults[0].getValue({name: "locationquantityonhand",label: "Location On Hand",}));
          log.audit("Nombre Srch", nombre);
          log.audit("Ubicacion Inventario Srch", ubicacionInventario);
          log.audit("Disponible Srch", disponible);
        }
      }

      if (pipa && cantidadDotacion) {
        debugger;
        if (cantidadDotacion > disponible) {
          var options = {
            title: "Máximo superado",
            message: "La cantidad ingresada (" + cantidadDotacion + ") supera el stock (" + disponible + ") del artículo",
          };
          dialog.alert(options);
          log.audit("Cantidad superada");
          return false;
        }
        return true;
      }
    } catch (error) {
      console.log({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }

  return {
    saveRecord: saveRecord,
    fieldChanged: fieldChanged,
  };
});