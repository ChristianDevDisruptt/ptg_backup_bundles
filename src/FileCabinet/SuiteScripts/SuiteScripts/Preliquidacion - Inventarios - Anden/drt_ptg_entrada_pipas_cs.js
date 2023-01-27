/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Entrada Pipas CS
 * Script id: customscript_drt_ptg_entrada_pipas_cs
 * customer Deployment id: customdeploy_drt_ptg_entrada_pipas_cs
 * Applied to: PTG - Entrada Pipas
 * File: drt_ptg_entrada_pipas_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
     function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var numViaje = currentRecord.getValue("custrecord_ptg_numviaje_entradapipa_");
      var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculoentrada_");
      var ultimoServicioEntradaPipa = currentRecord.getValue("custrecord_ptg_num_ultimoser_entra_pipa");
      log.audit("numViaje", numViaje);
      log.audit("vehiculo", vehiculo);
      log.audit("ultimoServicioEntradaPipa", ultimoServicioEntradaPipa);
      var estatusEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusEnCurso = 3;
      }


      if (vehiculo && fieldName === "custrecord_ptg_vehiculoentrada_") {
        //BÚSQUEDA GUARDADA: PTG - Llenado Pipas Ult Servicio
        var opportunitySearchObj = search.create({
          type: "opportunity",
          filters: [
            ["custbody_ptg_numero_viaje.custrecord_ptg_servicioestacionario_", "is", "T",],
            "AND",
            ["custbody_ptg_numero_viaje.custrecord_ptg_vehiculo_tabladeviajes_", "anyof", vehiculo,],
            "AND",
            ["probability", "equalto", "100"],
          ],
          columns: [
            search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID", }),
            search.createColumn({name: "entitystatus", label: "Opportunity Status", }),
            search.createColumn({name: "custbody_drt_ptg_num_consecutivo", label: "PTG - Numero consecutivo", }),
            search.createColumn({name: "tranid", label: "Document Number"}),
          ],
        });
        var srchResults = opportunitySearchObj.run().getRange({
          start: 0,
          end: 2,
        });
  
        if (srchResults.length > 0) {
          ultimoFolio = srchResults[0].getValue({name: "tranid", label: "Document Number",});
          log.audit("ultimoFolio", ultimoFolio);
          currentRecord.setValue("custrecord_ptg_num_ultimoser_entra_pipa", ultimoFolio);
        } else {
          currentRecord.setValue("custrecord_ptg_num_ultimoser_entra_pipa", 0);
        }
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
          currentRecord.setValue("custrecord_ptg_numviaje_entradapipa_",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_numviaje_entradapipa_",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",};
            dialog.alert(options);
        }

        return true;
      }

    }

    function saveRecord(context) {
      var currentRecord = context.currentRecord;
      var recId = currentRecord.id;
      var numeroVehiculo = currentRecord.getValue("custrecord_ptg_vehiculoentrada_");
      var numeroViaje = currentRecord.getValue("custrecord_ptg_numviaje_entradapipa_");
      var litrosTotalizadorEntrada = currentRecord.getValue("custrecord_ptg_lts_totali_entrada_pipa_");
      var kilimetrosEntrada = currentRecord.getValue("custrecord_ptg_kilometros_entrada_pipa_");
      log.audit("recId", recId);
      log.audit("numeroVehiculo", numeroVehiculo);
      log.audit("numeroViaje", numeroViaje);
      log.audit("litrosTotalizadorEntrada", litrosTotalizadorEntrada);
      if (numeroVehiculo && numeroViaje && litrosTotalizadorEntrada) {
        //BÚSQUEDA GUARDADA: PTG - Registro de salida de Pipas - Entrada Pipas
        var salidaPipasObj = search.create({
          type: "customrecord_ptg_registro_salida_pipas_",
          filters: [
             ["custrecord_ptg_salida_pipa_","anyof",numeroVehiculo], 
             "AND", 
             ["custrecord_ptg_numviaje_salida_pipa","anyof",numeroViaje]
          ],
          columns: [
            search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
            search.createColumn({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida"}),
            search.createColumn({name: "custrecord_ptg_kilometros_salida_", label: "PTG - Kilometros salida"})
          ]
        });
        var salidaPipasObjCount = salidaPipasObj.runPaged().count;
        log.audit("salidaPipasObjCount0", salidaPipasObjCount);
        var salidaPipasObjResults = salidaPipasObj.run().getRange({
          start: 0,
          end: 2,
        });
        log.audit("salidaPipasObjResults", salidaPipasObjResults);
        if (salidaPipasObjCount > 0) {
          log.audit("salidaPipasObjCount1", salidaPipasObjCount);
          (litrosTotalizadorSalida = salidaPipasObjResults[0].getValue({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida",}));
          (kilometrosSalida = salidaPipasObjResults[0].getValue({name: "custrecord_ptg_kilometros_salida_", label: "PTG - Kilometros salida",}));
          log.audit("litrosTotalizadorSalida", litrosTotalizadorSalida);
          var kilometrosSalida = parseFloat(kilometrosSalida);
          var maximoKilometros = kilometrosSalida + 2000;
          log.audit("maximoKilometros", maximoKilometros);

          if (litrosTotalizadorSalida > litrosTotalizadorEntrada) {
            var options = {
              title: "Totalizador Menor",
              message: "El Totalizador de Salida (" + litrosTotalizadorSalida + ") es mayor que el Totalizador de Entrada (" + litrosTotalizadorEntrada + ")",
            };
            dialog.alert(options);
            return false;
          } else if (kilimetrosEntrada <= kilometrosSalida){
            var options = {
              title: "Kilometraje Menor o Igual",
              message: "El Kilometraje de Salida (" + kilometrosSalida + ") es mayor o igual que el Kilimetraje de Entrada (" + kilimetrosEntrada + ")",
            };
            dialog.alert(options);
            return false;
          } else if (kilimetrosEntrada > maximoKilometros){
            var options = {
              title: "Kilometraje Excedido",
              message: "El Kilometraje de Entrada (" + kilimetrosEntrada + ") ha superado el máximo de kilometraje recorrido",
            };
            dialog.alert(options);
            return false;
          }

        } else {
          log.audit("salidaPipasObjCount2", salidaPipasObjCount);
          var options = {
            title: "Registro de Salida",
            message: "No hay registro de salida de pipas",
          };
          dialog.alert(options);
          log.audit("Totalizador superado");
          return false;
        }
      }
      else {
        log.audit("salidaPipasObjCount2", salidaPipasObjCount);
        var options = {
          title: "Faltan datos",
          message: "Faltan datos por registrar",
        };
        dialog.alert(options);
        log.audit("Totalizador superado");
        return false;
      }
      return true;
      
    }

    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var name = currentRecord.getValue("name");
        var nombre = 'Por Asignar';
  
        if(!name){
          currentRecord.setValue("name", nombre);
        currentRecord.setValue("custrecord_ptg_folio_entradapipas_", nombre);
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
      saveRecord: saveRecord,
      pageInit: pageInit,
    };
  });
