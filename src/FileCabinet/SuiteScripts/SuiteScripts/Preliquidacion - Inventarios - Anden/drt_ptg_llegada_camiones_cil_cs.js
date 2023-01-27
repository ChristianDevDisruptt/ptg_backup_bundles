/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Llegada de camiones CS
 * Script id: customscript_drt_ptg_llegada_cam_cil_cs
 * customer Deployment id: customdeploy_drt_ptg_llegada_cam_cil_cs
 * Applied to: PTG - Llegada de camiones
 * File: drt_ptg_llegada_camiones_cil_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/currentRecord", 'N/ui/dialog', "N/runtime"], function (record, search, error, currentRecord, dialog, runtime) {
    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_transpor_");
            var vehiculoTXT = currentRecord.getText("custrecord_ptg_vehiculo_transpor_");
            var numViaje = currentRecord.getValue("custrecord_ptg_numviaje_entrada_transpor");
            var estatusEnCurso = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
              estatusEnCurso = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              estatusEnCurso = 3;
            }
            
            if(vehiculo && cabeceraFieldName === "custrecord_ptg_vehiculo_transpor_"){
                //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
                var viajeActivoObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusEnCurso]],
                    columns:[
                       search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})
                    ]
                });
                var viajeActivoObjResult = viajeActivoObj.run().getRange({
                    start: 0,
                    end: 2,
                });
                log.audit("viajeActivoObjResult", viajeActivoObjResult);
                var numViajeConteo = viajeActivoObjResult.length;
                if(numViajeConteo > 0){
                    numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
                    currentRecord.setValue("custrecord_ptg_numviaje_entrada_transpor",numeroViaje);
                } else {
                    var options = {
                      title: "El vehículo sin viaje activo",
                      message: "El vehículo " + vehiculoTXT + " no tiene viaje activo.",
                    };
                    dialog.alert(options);
                  }
                
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
          var vehiculo = currentRecord.getText("custrecord_ptg_vehiculo_transpor_");
          var numViaje = currentRecord.getValue("custrecord_ptg_numviaje_entrada_transpor");

          if(numViaje){
            return true;
          } else {
            var options = {
              title: "Vehículo sin número de viaje.",
              message: "No hay viaje activo para el vehículo "+vehiculo,
            };
            dialog.alert(options);
          }
          
  
        } catch (error) {
          console.log({
            title: "error saveRecord",
            details: JSON.stringify(error),
          });
        }
      }
    
    return {
        fieldChanged: fieldChanged,
        saveRecord: saveRecord,
    };
});
