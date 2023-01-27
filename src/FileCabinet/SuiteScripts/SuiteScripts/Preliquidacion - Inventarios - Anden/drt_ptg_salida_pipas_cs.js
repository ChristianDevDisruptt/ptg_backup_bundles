/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: PTG - Registro de salida de Pipas CS
 * Script id: customscript_drt_ptg_salida_pipas_cs
 * customer Deployment id: customdeploy_drt_ptg_salida_pipas_cs
 * Applied to: PTG - Registro de salida de Pipas
 * File: drt_ptg_salida_pipas_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
     function fieldChanged(context) {
       try{
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var fieldName = context.fieldId;
      var fieldName2 = context.fieldId;
      var numViaje = currentRecord.getValue("custrecord_ptg_numviaje_salida_pipa");
      var vehiculo = currentRecord.getValue("custrecord_ptg_salida_pipa_");
      var totalizadorSalida = currentRecord.getValue("custrecord_ptg_lts_totalizador_salida_");
      var total = 0;
      var cantidad;
      var estatusViajeEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusViajeEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusViajeEnCurso = 3;
      }

      if(vehiculo && fieldName === "custrecord_ptg_salida_pipa_"){
        var equipoObj = record.load({
          type: "customrecord_ptg_equipos",
          id: vehiculo,
        });
        var totalizador = equipoObj.getValue("custrecord_ptg_totalizador_");
        currentRecord.setValue("custrecord_ptg_lts_totalizador_salida_", totalizador);

        //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
        var viajeActivoObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViajeEnCurso]],
          columns:[
             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})
          ]
        });
        var viajeActivoObjCount = viajeActivoObj.runPaged().count;
        log.audit("viajeActivoObjCount", viajeActivoObjCount);
        if(viajeActivoObjCount > 0){
          var viajeActivoObjResult = viajeActivoObj.run().getRange({
            start: 0,
            end: 2,
          });
          log.audit("viajeActivoObjResult", viajeActivoObjResult);
          numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
          currentRecord.setValue("custrecord_ptg_numviaje_salida_pipa",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_numviaje_salida_pipa",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",};
            dialog.alert(options);
        }
        

        var opportunitySearchObj = search.create({
          type: "opportunity",
          filters: [
            ["custbody_ptg_numero_viaje.custrecord_ptg_servicioestacionario_", "is", "T",], "AND",
            ["custbody_ptg_numero_viaje.custrecord_ptg_vehiculo_tabladeviajes_", "anyof", vehiculo,], "AND",
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
          currentRecord.setValue("custrecord_ptg_num_ultimoserv_", ultimoFolio);
        } else {
          currentRecord.setValue("custrecord_ptg_num_ultimoserv_", 0);
        }

      }

      if (numViaje && vehiculo && !totalizadorSalida){
        log.audit("entra");

      }
    } catch (error) {
      console.log({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
    }

    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var name = currentRecord.getValue("name");
        var nombre = 'Por Asignar';
  
        if(!name){
          currentRecord.setValue("name", nombre);
        currentRecord.setValue("custrecord_ptg_foliosalidapipas_", nombre);
        }
        
        
      } catch (error) {
        console.log({
          title: "error pageInit",
          details: JSON.stringify(error),
        });
      }

  }

  function saveRecord(context) {
    var currentRecord = context.currentRecord;
    var recId = currentRecord.id;
    var numeroVehiculo = currentRecord.getValue("custrecord_ptg_salida_pipa_");
    var numeroViaje = currentRecord.getValue("custrecord_ptg_numviaje_salida_pipa");
    var llenadoSalida = currentRecord.getValue("custrecord_ptg_porcentaje_salida");
    var pesoSalida = currentRecord.getValue("custrecord_ptg_peso_salida_");
    var plantaSalida = currentRecord.getValue("custrecord_ptg_planta_salida_pipa_");
    var ubicacionObj = record.load({
      id: plantaSalida,
      type: search.Type.LOCATION,
    });
    var bascula = ubicacionObj.getValue("custrecord_ptg_bascula_");
    log.audit("bascula", bascula);
    log.emergency("llenadoSalida", llenadoSalida);
    log.audit("recId", recId);
    log.audit("numeroVehiculo", numeroVehiculo);
    log.audit("numeroViaje", numeroViaje);
    if (numeroVehiculo && numeroViaje) {
      //BÚSQUEDA GUARDADA: PTG - Llenado de Pipas SS
      var llenadoPipasObj = search.create({
        type: "customrecord_ptg_llenadodepipas_",
        filters: [
          ["custrecord_ptg_vehiculo_llenado_pipas_","anyof",numeroVehiculo], "AND", 
          ["custrecord_ptg_num_viaje_llenado_pipas_","anyof",numeroViaje]
        ],
        columns:[
          search.createColumn({name: "custrecordptg_porcen_despues_llenado", label: "PTG - % Después llenado"}),
          search.createColumn({name: "custrecord_ptg_peso_despuesllenado", label: "PTG - Peso después llenado"})
        ]
      });
      var llenadoPipasObjCount = llenadoPipasObj.runPaged().count;

      if (llenadoPipasObjCount > 0) {
        var llenadoPipasObjResult = llenadoPipasObj.run().getRange({
          start: 0,
          end: 2,
        });
        porcentajeDespues = llenadoPipasObjResult[0].getValue({name: "custrecordptg_porcen_despues_llenado", label: "PTG - % Después llenado"});
        pesoDespues = parseFloat(llenadoPipasObjResult[0].getValue({name: "custrecord_ptg_peso_despuesllenado", label: "PTG - Peso después llenado"})||0);
        log.audit("pesoDespues", pesoDespues);
        var porcentajeDespuesPF = parseFloat(porcentajeDespues);
        log.emergency("porcentajeDespuesPF", porcentajeDespuesPF);
        if(llenadoSalida == porcentajeDespuesPF){
          log.audit("Porcentajes OK");
          if(bascula){
            log.audit("la planta tiene bascula");
          if(pesoSalida >= pesoDespues){
            log.audit("Peso OK");
            return true;
          } else {
            var options = {
              title: "Peso de Llenado",
              message: "El peso registrado en el llenado mayor al peso registrado",
            };
            dialog.alert(options);
            log.audit("Porcentajes NO OK");
            return false;
          }
        } else {
          log.audit("la planta NO tiene bascula");
          return true;
        }
          
          
        } else {
          var options = {
            title: "Registro de Llenado",
            message: "El porcentaje registrado en el llenado no es igual al porcentaje ingresado",
          };
          dialog.alert(options);
          log.audit("Porcentajes NO OK");
          return false;
        }
        
      }else {
        var options = {
          title: "Registro de Llenado",
          message: "No hay registro de llenado para este vehículo con este número de viaje",
        };
        dialog.alert(options);
        log.audit("No hay llenado");
        return false;
      }
      

    }
    
    
  }


  
    return {
      fieldChanged: fieldChanged,
      pageInit: pageInit,
      saveRecord: saveRecord,
    };
  });
