/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 01/2022
 * Script name: DRT - Salida Camiones Cilindros CS
 * Script id: customscript_drt_salida_camiones_cil_cs
 * customer Deployment id: customdeploy_drt_salida_camiones_cil_cs
 * Applied to: PTG - Salida de camiones cilindros
 * File: drt_ptg_salida_camiones_cil_cs.js
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
            var numViaje = currentRecord.getValue("custrecord_ptg_noviaje_salidacomion_");
            var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_salida_camion_");
            var vehiculoTXT = currentRecord.getText("custrecord_ptg_vehiculo_salida_camion_");
            var estatusViajeEnCurso = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
                estatusViajeEnCurso = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                estatusViajeEnCurso = 3;
            }

            //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
            if(vehiculo && cabeceraFieldName === "custrecord_ptg_vehiculo_salida_camion_"){
                var viajeActivoObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViajeEnCurso]],
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
                    currentRecord.setValue("custrecord_ptg_noviaje_salidacomion_",numeroViaje);
                } else {
                    var options = {
                      title: "El vehículo sin viaje activo",
                      message: "El vehículo " + vehiculoTXT + " no tiene viaje activo.",
                    };
                    dialog.alert(options);
                }
            }

            if (numViaje && cabeceraFieldName === "custrecord_ptg_noviaje_salidacomion_") {
                //BÚSQUEDA GUARDADA: DRT PTG - Salida Camiones Cilindro
                log.debug("entra segunda "+numViaje, vehiculo);
                var customrecord_ptg_registrodedotacion_cil_SearchObj = search.create({
                    type: "customrecord_ptg_registrodedotacion_cil_",
                    filters: [["custrecord_ptg_numviaje_detalledotacion", "anyof", numViaje],"AND",["custrecord_ptg_novehiculo_", "anyof", vehiculo]],
                    columns: [
                        search.createColumn({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación",}),
                        search.createColumn({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación",}),
                        search.createColumn({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros",}),
                    ],
                });
                log.debug("customrecord_ptg_registrodedotacion_cil_SearchObj", customrecord_ptg_registrodedotacion_cil_SearchObj);
                var dotacionSalidaResultCount = customrecord_ptg_registrodedotacion_cil_SearchObj.runPaged().count;
                log.audit("dotacionSalidaResultCount", dotacionSalidaResultCount);
                var dotacionSalidaResult = customrecord_ptg_registrodedotacion_cil_SearchObj.run().getRange({
                    start: 0,
                    end: dotacionSalidaResultCount,
                });
                log.audit("dotacionSalidaResult", dotacionSalidaResult);
                for (var i = 0; i < dotacionSalidaResult.length; i++) {
                    (descripcion = dotacionSalidaResult[i].getValue({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación",})),
                    (cilindro = dotacionSalidaResult[i].getValue({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación",})),
                    (dotacion = dotacionSalidaResult[i].getValue({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros",}));
                    log.audit("descripcion", descripcion);
                    log.audit("cilindro", cilindro);
                    log.audit("dotacion", dotacion);
                
                    currentRecord.selectLine("recmachcustrecord_no_viaje_salida_camion_dot_", i);
                    currentRecord.setCurrentSublistValue({
                        sublistId: "recmachcustrecord_no_viaje_salida_camion_dot_",
                        fieldId: "custrecord_ptg_descripcion_dotacion_",
                        value: dotacionSalidaResult[i].getValue({name: "custrecord_ptg_descripcion_dotacion_", label: "PTG - Descripción dotación",}),
                    });
                    currentRecord.setCurrentSublistValue({
                        sublistId: "recmachcustrecord_no_viaje_salida_camion_dot_",
                        fieldId: "custrecord_ptg_cilindro_dotacion_",
                        value: dotacionSalidaResult[i].getValue({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación",}),
                    });
                    currentRecord.setCurrentSublistValue({
                        sublistId: "recmachcustrecord_no_viaje_salida_camion_dot_",
                        fieldId: "custrecord_ptg_dotacion_cilindros",
                        value: dotacionSalidaResult[i].getValue({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros", }),
                    });
                    currentRecord.commitLine({sublistId: "recmachcustrecord_no_viaje_salida_camion_dot_", });
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
          var vehiculo = currentRecord.getText("custrecord_ptg_vehiculo_salida_camion_");
          var numViaje = currentRecord.getValue("custrecord_ptg_noviaje_salidacomion_");

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
