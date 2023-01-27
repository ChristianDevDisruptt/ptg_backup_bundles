/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: DRT - Llenado Pipas CS
 * Script id: customscript_drt_ptg_llenado_pipas_cs
 * customer Deployment id: customdeploy_drt_ptg_llenado_pipas_cs
 * Applied to: PTG - Llenado de Pipas
 * File: drt_ptg_llenado_pipas_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog", "N/runtime"], function (record, search, error, runtime, dialog, runtime) {
  function pageInit(context) {
    try {
      var currentRecord = context.currentRecord;
      var name = currentRecord.getValue("name");
      var nombre = 'Por Asignar';

      if(!name){
        currentRecord.setValue("name", nombre);
      currentRecord.setValue("custrecord_ptg_descarga_llenadopipas_", nombre);
      }
      
      
      
    } catch (error) {
      console.log({
        title: "error pageInit",
        details: JSON.stringify(error),
      });
    }

}
  function fieldChanged(context) {
    try {
    var currentRecord = context.currentRecord;
    var fieldName = context.fieldId;
    var numeroVehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_llenado_pipas_");
    var kmsAntesLlenado = currentRecord.getValue("custrecord_ptg_kms_antesllenado_");
    var litrosTotalizadorAntesLlenado = currentRecord.getValue("custrecord_ptg_lts_tota_antesllenado_");
    log.audit("numeroVehiculo", numeroVehiculo);
    log.audit("kmsAntesLlenado", kmsAntesLlenado);
    log.audit("litrosTotalizadorAntesLlenado", litrosTotalizadorAntesLlenado);
    var estatusEnCurso = 0;
    if (runtime.envType === runtime.EnvType.SANDBOX) {
      estatusEnCurso = 3;
    } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
      estatusEnCurso = 3;
    }

    if (kmsAntesLlenado && fieldName === "custrecord_ptg_kms_antesllenado_") {
      currentRecord.setValue("custrecord_ptg_kms_despuesllenado", kmsAntesLlenado);
    }

    if (numeroVehiculo && fieldName === "custrecord_ptg_vehiculo_llenado_pipas_") {
      
      //BÚSQUEDA GUARDADA: PTG - Llenado Pipas Ult Servicio
      var opportunitySearchObj = search.create({
        type: "opportunity",
        filters: [
          ["custbody_ptg_numero_viaje.custrecord_ptg_servicioestacionario_", "is", "T",],"AND",
          ["custbody_ptg_numero_viaje.custrecord_ptg_vehiculo_tabladeviajes_", "anyof", numeroVehiculo,],"AND",
          ["probability", "equalto", "100"],
        ],
        columns: [
          search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID", }),
          search.createColumn({name: "entitystatus", label: "Opportunity Status", }),
          search.createColumn({name: "custbody_drt_ptg_num_consecutivo", label: "PTG - Numero consecutivo", }),
          search.createColumn({name: "tranid", label: "Document Number"}),
        ],
      });
      var searchResultCount = opportunitySearchObj.runPaged().count;
      log.debug("searchResultCount", searchResultCount);
      var srchResults = opportunitySearchObj.run().getRange({
        start: 0,
        end: 2,
      });

      if (searchResultCount > 0) {
        ultimoFolio = srchResults[0].getValue({name: "tranid", label: "Document Number",});
        log.audit("ultimoFolio", ultimoFolio);
        currentRecord.setValue("custrecord_ptg_ult_serv_antesllenado_", ultimoFolio);
        currentRecord.setValue("custrecord_ptg_ult_serv_despuesllenado", ultimoFolio);
      } else {
        currentRecord.setValue("custrecord_ptg_ult_serv_antesllenado_", 0);
        currentRecord.setValue("custrecord_ptg_ult_serv_despuesllenado", 0);
      }

      //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
      var viajeActivoObj = search.create({
        type: "customrecord_ptg_tabladeviaje_enc2_",
        filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",numeroVehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusEnCurso]],
        columns:[
           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
           search.createColumn({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"})
        ]
    });
    var viajeActivoObjCount = viajeActivoObj.runPaged().count;
    log.audit("viajeActivoObjCount", viajeActivoObjCount);
    if(viajeActivoObjCount > 0){
      var viajeActivoObjResult = viajeActivoObj.run().getRange({
        start: 0,
        end: 2,
      });
      numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
      vendedor = viajeActivoObjResult[0].getValue({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"});
      currentRecord.setValue("custrecord_ptg_num_viaje_llenado_pipas_",numeroViaje);
      currentRecord.setValue("custrecord_ptg_vendedor_despues_llenado_",vendedor);
    } else {
      var options = {
        title: "Viaje",
        message: "No hay viaje activo asignado al vehículo seleccionado",};
        dialog.alert(options);
      }
    

      //return true;
    }

    if (litrosTotalizadorAntesLlenado && fieldName === "custrecord_ptg_lts_tota_antesllenado_") {
      currentRecord.setValue("custrecord_ptg_lts_totalizador_desp_llen", litrosTotalizadorAntesLlenado);
      return true;
    }

    

  } catch (error) {
    console.log({
        title: "error fieldChanged",
        details: JSON.stringify(error),
    });
}
  }

  function saveRecord(context) {
    try {
      var currentRecord = context.currentRecord;
    var numeroVehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_llenado_pipas_");
    var totalizadorAntesLlenado = currentRecord.getValue("custrecord_ptg_lts_tota_antesllenado_");
    var kilometrosNew = currentRecord.getValue("custrecord_ptg_kms_antesllenado_");
    log.audit("kilometrosNew", kilometrosNew);

    if (numeroVehiculo) {
      //BÚSQUEDA GUARDADA: PTG - Llenado de Pipas SS
      var llenadoPipasObj = search.create({
        type: "customrecord_ptg_equipos",
        filters: [
          ["internalid","anyof",numeroVehiculo]
        ],
        columns:[
          search.createColumn({name: "custrecord_ptg_totalizador_", label: "PTG - Totalizador"}),
          search.createColumn({name: "custrecord_ptg_kilometraje_equipo_", label: "PTG - KILOMETRAJE EQUIPO"})
        ]
      });
      var llenadoPipasObjCount = llenadoPipasObj.runPaged().count;
      var llenadoPipasObjResult = llenadoPipasObj.run().getRange({
        start: 0,
        end: 2,
      });
      totalizador = llenadoPipasObjResult[0].getValue({name: "custrecord_ptg_totalizador_", label: "PTG - Totalizador"});
      kilometraje = llenadoPipasObjResult[0].getValue({name: "custrecord_ptg_kilometraje_equipo_", label: "PTG - KILOMETRAJE EQUIPO"});

      if (totalizadorAntesLlenado >= totalizador) {
        log.audit("hay registro")
        if(kilometrosNew >= kilometraje){
          return true;
        } else {
          var options = {
            title: "Kilometros antes de llenado",
            message: "El kilometraje del equipo ("+ kilometraje +") es mayor que el kilometraje antes de llenado ("+ kilometrosNew +").",
          };
          dialog.alert(options);
          return false;
        }
      } else {
        var options = {
          title: "Totalizador antes de llenado",
          message: "El totalizador de litros ("+ totalizadorAntesLlenado +") es menor que el totalizador del equipo ("+ totalizador +").",
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
    pageInit: pageInit,
    fieldChanged: fieldChanged,
    saveRecord: saveRecord,
  };
});
