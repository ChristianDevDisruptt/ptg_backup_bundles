/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - Aportar cilindros a camión CS
 * Script id: customscript_drt_ptg_aport_cil_cam_cs
 * customer Deployment id: customdeploy_drt_ptg_aport_cil_cam_cs
 * Applied to: PTG-Aportar cil desde est carb a camión
 * File: drt_ptg_aport_cil_cam_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
     function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var numViaje = currentRecord.getValue("custrecord_ptg_numviaje_aportaracamion_");
      var vehiculo = currentRecord.getValue("custrecord_ptg_aport_a_camion_");
      log.audit("numViaje", numViaje);
      log.audit("vehiculo", vehiculo);

      var estatusEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusEnCurso = 3;
      }

      if (vehiculo && fieldName === "custrecord_ptg_aport_a_camion_") {
        //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
        var viajeActivoObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusEnCurso]],
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
          currentRecord.setValue("custrecord_ptg_numviaje_aportaracamion_",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_numviaje_aportaracamion_",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",};
            dialog.alert(options);
        }

        return true;
      }

    }

    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var name = currentRecord.getValue("name");
        var nombre = 'Por Asignar';
  
        if(!name){
          currentRecord.setValue("name", nombre);
        currentRecord.setValue("custrecord_ptg_numderecarga_", nombre);
        }
        
        
      } catch (error) {
        console.log({
          title: "error pageInit",
          details: JSON.stringify(error),
        });
      }

  }


  
    return {
      fieldChanged: fieldChanged,
      pageInit: pageInit,
    };
  });
