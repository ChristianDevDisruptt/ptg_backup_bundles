/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Traspaso de Gas CS
 * Script id: customscript_drt_ptg_trasp_gas_cs
 * customer Deployment id: customdeploy_drt_ptg_trasp_gas_cs
 * Applied to: PTG-Trasp de Gas a andén a final de día
 * File: drt_ptg_traspaso_gas_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog"], function (record, search, error, runtime, dialog) {
  function fieldChanged(context) {
    var currentRecord = context.currentRecord;
    var sublistName = context.sublistId;
    var sublistFieldName = context.fieldId;
    var sublistaTraspasoGas = "recmachcustrecord_ptg_traspdet_";
    var importe = 0;
    var total = 0;
    
    if ((sublistName === sublistaTraspasoGas && sublistFieldName === 'custrecord_ptg_art_trasp_gas_') || 
    (sublistName === sublistaTraspasoGas && sublistFieldName === 'custrecord_ptg_cantidad_trasp_det_')){

      var articulo = currentRecord.getCurrentSublistValue({
        sublistId: sublistaTraspasoGas,
        fieldId: 'custrecord_ptg_art_trasp_gas_',
      });
      log.audit("articulo", articulo);

      var itemObj = record.load({
        id: articulo,
        type: search.Type.INVENTORY_ITEM,
      });

      var capacidad = itemObj.getValue("custitem_ptg_capacidadcilindro_");
      log.audit("capacidad", capacidad);

      var cantidad = currentRecord.getCurrentSublistValue({
        sublistId: sublistaTraspasoGas,
        fieldId: 'custrecord_ptg_cantidad_trasp_det_'
      });

      if((cantidad)&&(capacidad)){
        var cantidadPF = parseFloat(cantidad);
        var capacidadPF = parseFloat(capacidad);

        var litros = cantidadPF * capacidadPF;
        log.audit("litros", litros);
        var total = litros / 0.54;  
        log.audit("total", total);

        currentRecord.setCurrentSublistValue({
          sublistId: sublistaTraspasoGas,
          fieldId: 'custrecord_ptg_ltstraspgas_',
          value: total
        });
      }
      
    }
  }

  function validateLine(context) {
    try {

      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var total = 0;
    

    if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_art_trasp_gas_",}) && 
    currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_ltstraspgas_",})) {
      var kilogramos = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_ltstraspgas_",});
      var kilogramosPF = parseFloat(kilogramos);
     

      if (kilogramos) {

        var totalCabecera = currentRecord.getValue("custrecord_ptg_total_trasp_gas_");
        if(totalCabecera){
          var totalCabeceraPF = parseFloat(totalCabecera);
          total = totalCabeceraPF + kilogramosPF;
          currentRecord.setValue("custrecord_ptg_total_trasp_gas_", total);
        } else {
        currentRecord.setValue("custrecord_ptg_total_trasp_gas_", kilogramosPF);
        }
        
      }
      return true;

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

      if (sublistName === "recmachcustrecord_ptg_traspdet_"){
        if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_ltstraspgas_",}) > 0){
          var kilogramos = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_ltstraspgas_",});
          var kilogramosPF = parseFloat(kilogramos);

          if (kilogramos) {

            var totalCabecera = currentRecord.getValue("custrecord_ptg_total_trasp_gas_");
            if(totalCabecera){
              var totalCabeceraPF = parseFloat(totalCabecera);
              total = totalCabeceraPF - kilogramosPF;
              currentRecord.setValue("custrecord_ptg_total_trasp_gas_", total);
            } else {
            currentRecord.setValue("custrecord_ptg_total_trasp_gas_", kilogramosPF);
            }
            
          }
          
          
        }
      }
    
      return true;
    } catch (error) {
      console.log({
        title: "error validateDelete",
        details: JSON.stringify(error),
      });
    }
    
  }


  return {
    validateLine: validateLine,
    validateDelete: validateDelete,
    fieldChanged: fieldChanged,
  };
});
