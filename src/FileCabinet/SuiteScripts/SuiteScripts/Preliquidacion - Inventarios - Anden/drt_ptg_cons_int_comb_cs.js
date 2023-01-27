/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Consumo Interno de Combustible CS
 * Script id: customscript_drt_ptg_cons_int_comb_cs
 * customer Deployment id: customdeploy_drt_ptg_cons_int_comb_cs
 * Applied to: PTG - Consumo Interno de Combustible
 * File: drt_ptg_cons_int_comb_cs.js
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
      var fieldName = context.fieldId;
      var sublistFieldName = context.fieldId;
      var precioOmision = currentRecord.getValue("custrecord_ptg_precio_por_omision_");
      var plantaConsumo = currentRecord.getValue("custrecord_ptg_planta_consumo_");

      log.audit("precioOmision", precioOmision);

      if (//(sublistName === "recmachcustrecord_ptg_consum_intern_" && sublistFieldName === "custrecord_ptg_numvehiculo_consumintern_") ||
      (sublistName === "recmachcustrecord_ptg_consum_intern_" && sublistFieldName === "custrecord_ptg_litroscargados")) {
        var precioOmisionPF = parseFloat(precioOmision);
        log.audit("precioOmisionPF", precioOmisionPF);
        var litrosCargados = currentRecord.getCurrentSublistValue({sublistId: "recmachcustrecord_ptg_consum_intern_", fieldId: "custrecord_ptg_litroscargados",});
        log.audit("litrosCargados", litrosCargados);

        if(litrosCargados){
          var litrosCargadosPF = parseFloat(litrosCargados);
          log.audit("litrosCargadosPF", litrosCargadosPF);

          var resultado = precioOmisionPF * litrosCargadosPF;
          log.audit("resultado", resultado);

          currentRecord.setCurrentSublistValue({
            sublistId: "recmachcustrecord_ptg_consum_intern_", 
            fieldId: "custrecord_ptg_importecon", 
            value: resultado,
          });
        }
        
      }

     else if ((fieldName === "custrecord_ptg_planta_consumo_" && plantaConsumo)) {        
          currentRecord.setCurrentSublistValue({
            sublistId: "recmachcustrecord_ptg_consum_intern_", 
            fieldId: "custrecord_ptg_planta_detconsumo_", 
            value: plantaConsumo,
          });
        }
        
      return true;

    } catch (error) {
      console.log({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }


  function validateLine(context) {
    try {

      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var total = 0;
    

    if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_litroscargados",}) && 
    currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_importecon",})) {
      var kilometraje = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_kms_consumintern_",});
      var kilometrajePF = parseFloat(kilometraje);

      var litros = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_litroscargados",});
      var litrosPF = parseFloat(litros);

      var vehiculo = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_numvehiculo_consumintern_",});
      var equipoObj = record.load({
        type: "customrecord_ptg_equipos",
        id: vehiculo,
      });
      var kilometrajeGuardado = parseFloat(equipoObj.getValue("custrecord_ptg_kilometraje_equipo_"));
      log.audit("kilometrajeGuardado", kilometrajeGuardado);
      var maximoKilometros = kilometrajeGuardado + 2000;
      log.audit("maximoKilometros", maximoKilometros);

      

      if (kilometrajeGuardado >= kilometraje){
        var options = {
          title: "Kilometraje Menor o Igual",
          message: "El Kilometraje registrado (" + kilometraje + ") es menor o igual que el Kilimetraje en Sistema (" + kilometrajeGuardado + ")",
        };
        dialog.alert(options);
        return false;
      } else if (kilometraje > maximoKilometros){
        var options = {
          title: "Kilometraje Excedido",
          message: "El Kilometraje registrado (" + kilometraje + ") ha superado el máximo de kilometraje recorrido",
        };
        dialog.alert(options);
        return false;
      } else {
        if (kilometraje) {
          var totalCabeceraKilometraje = currentRecord.getValue("custrecord_ptg_kilometros_");
          if(totalCabeceraKilometraje){
            var totalCabeceraKilometrajePF = parseFloat(totalCabeceraKilometraje);
            total = totalCabeceraKilometrajePF + kilometrajePF;
            currentRecord.setValue("custrecord_ptg_kilometros_", total);
          } else {
          currentRecord.setValue("custrecord_ptg_kilometros_", kilometrajePF);
          }
        }
  
        if (litros) {
          var totalCabeceraLitros = currentRecord.getValue("custrecord_ptg_litros");
          if(totalCabeceraLitros){
            var totalCabeceraLitrosPF = parseFloat(totalCabeceraLitros);
            total = totalCabeceraLitrosPF + litrosPF;
            currentRecord.setValue("custrecord_ptg_litros", total);
          } else {
          currentRecord.setValue("custrecord_ptg_litros", litrosPF);
          }
        }
        return true;
      }

     // return true;

    }

    } catch (error) {
      console.log({
        title: "error validateLine",
        details: JSON.stringify(error),
      });
    }
    
  }

  function validateDelete(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      if (sublistName === "recmachcustrecord_ptg_consum_intern_"){
        if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_kms_consumintern_",}) > 0){
          var kilometraje = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_kms_consumintern_",});
          var kilometrajePF = parseFloat(kilometraje);

          var litros = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_litroscargados",});
          var litrosPF = parseFloat(litros);

          if (kilometraje) {
            var totalCabeceraKilometraje = currentRecord.getValue("custrecord_ptg_kilometros_");
            if(totalCabeceraKilometraje){
              var totalCabeceraKilometrajePF = parseFloat(totalCabeceraKilometraje);
              total = totalCabeceraKilometrajePF - kilometrajePF;
              currentRecord.setValue("custrecord_ptg_kilometros_", total);
            }
          }

          if (litros) {
            var totalCabeceraLitros = currentRecord.getValue("custrecord_ptg_litros");
            if(totalCabeceraLitros){
              var totalCabeceraLitrosPF = parseFloat(totalCabeceraLitros);
              total = totalCabeceraLitrosPF - litrosPF;
              currentRecord.setValue("custrecord_ptg_litros", total);
            }
            
          }

        }
          
      }
        
      return true;
    } catch (error) {
      console.log({
        title: "error validateLine",
        details: JSON.stringify(error),
      });
    }
  }

  function lineInit(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var plantaConsumo = currentRecord.getValue("custrecord_ptg_planta_consumo_");
      if (sublistName === 'recmachcustrecord_ptg_consum_intern_') {
            currentRecord.setCurrentSublistValue({
              sublistId: "recmachcustrecord_ptg_consum_intern_", 
              fieldId: "custrecord_ptg_planta_detconsumo_", 
              value: plantaConsumo,
            });

          }
    } catch (error) {
      
    }
    
    }
   
   
   


  return {
    fieldChanged: fieldChanged,
    validateLine: validateLine,
    validateDelete: validateDelete,
    lineInit: lineInit,
  };
});
