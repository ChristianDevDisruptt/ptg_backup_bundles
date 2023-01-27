/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Pagos CS
 * Script id: customscript_drt_pagos_cs
 * customer Deployment id: customdeploy_drt_pagos_cs
 * Applied to: PTG - Pagos
 * File: drt_ptg_pagos_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/https", "N/currentRecord", "N/url", "N/ui/message", "N/ui/dialog", "N/search", "N/runtime", "N/record", "N/error", "N/currency",], 
function (https, currentRecord, url, message, dialog, search, runtime, record, error, currenc) {
  function saveRecord(context) {
    try {
      var currentRecord = context.currentRecord;
      var totalServicio = currentRecord.getValue("custrecord_ptg_total_servicio");
      var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_consumo_interno");
      var kilometrajeConsumoInterno = currentRecord.getValue("custrecord_ptg_kilometra_consumo_interno");
      var lineas = currentRecord.getLineCount({sublistId: "recmachcustrecord_ptg_registro_pagos",});
      var total = 0;
      log.audit("currentRecord", currentRecord);
      log.audit("totalServicio", totalServicio);
      log.audit("lineas", lineas);
      for (var i = 0; i < lineas; i++) {
        var totalLinea = parseFloat(currentRecord.getSublistValue({sublistId: "recmachcustrecord_ptg_registro_pagos", fieldId: "custrecord_ptg_total", line: i,}));
        log.audit("totalLinea pf " + i, totalLinea);
        total += totalLinea;
      }
      log.audit("total final", total);
      var totalMenor = total - 0.01;
      log.audit("totalMenor", totalMenor);
      var totalMayor = total + 0.01;
      log.audit("totalMayor", totalMayor);
  
      //if (totalServicio == total) {
      if(vehiculo) {
        var vehiculoObj = record.load({
          type: "customrecord_ptg_equipos",
          id: vehiculo
        });
        var kilometraje = parseFloat(vehiculoObj.getValue("custrecord_ptg_kilometraje_equipo_"));
        var kilometrajeMaximo = kilometraje + 2000;
        if(kilometrajeConsumoInterno > kilometraje && kilometrajeConsumoInterno < kilometrajeMaximo){
          if ((totalServicio > totalMenor) && (totalServicio < totalMayor)) {
            log.audit("totalServicio dentro if");
            return true;
          } else {
            log.audit("totalServicio else");
            var options = {
              title: "Totales no coinciden",
              message: "La suma del total de las líneas " + total + " no coincide con la cantidad total " + totalServicio,
            };
            dialog.alert(options);
          }
        } else {
          log.audit("kilometraje fuera");
          var options = {
            title: "Kilometraje fuera del rango",
            message: "El kilometraje está fuera del rango permitido",
          };
          dialog.alert(options);
        }
      } else {
        if ((totalServicio > totalMenor) && (totalServicio < totalMayor)) {
          log.audit("totalServicio dentro if");
          return true;
        } else {
          log.audit("totalServicio else");
          var options = {
            title: "Totales no coinciden",
            message: "La suma del total de las líneas " + total + " no coincide con la cantidad total " + totalServicio,
          };
          dialog.alert(options);
        }
      }
    } catch (error) {
      log.error({
        title: "error saveRecord",
        details: JSON.stringify(error),
      });
    }
  }

  function validateLine(context) {
    var currentRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var oportunidad = currentRecord.getValue("custrecord_ptg_oportunidad_pagos");
    if (sublistName === "recmachcustrecord_ptg_registro_pagos") {
      if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_total",}) &&
      currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_tipo_pago",})) {
        currentRecord.setCurrentSublistValue({sublistId: sublistName, fieldId: 'custrecord_ptg_oportunidad', value: oportunidad});
         
        return true;
      }
    }
  }

  function fieldChanged(context) {
    try {
      debugger;
      var currentRecord = context.currentRecord;
      var cabeceraFieldName = context.fieldId;
      var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_consumo_interno");
      var estatusViejeEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusViejeEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusViejeEnCurso = 3;
      }

      if(vehiculo && cabeceraFieldName === "custrecord_ptg_vehiculo_consumo_interno"){
        //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
        var viajeActivoObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejeEnCurso]],
          columns:[
            search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
          ]
        });
        var viajeActivoObjCount = viajeActivoObj.runPaged().count;
        log.audit("viajeActivoObjCount", viajeActivoObjCount);
        var viajeActivoObjResult = viajeActivoObj.run().getRange({
          start: 0,
          end: 2,
        });
        log.audit("viajeActivoObjResult", viajeActivoObjResult);
        if(viajeActivoObjCount > 0){
          numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
          currentRecord.setValue("custrecord_ptg_num_viaje_consumo_interno",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_num_viaje_consumo_interno",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",
          };
          dialog.alert(options);
        }  
      }
    } catch (error) {
      log.error({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }

  return {
    saveRecord: saveRecord,
    validateLine: validateLine,
    fieldChanged: fieldChanged,
  };
});