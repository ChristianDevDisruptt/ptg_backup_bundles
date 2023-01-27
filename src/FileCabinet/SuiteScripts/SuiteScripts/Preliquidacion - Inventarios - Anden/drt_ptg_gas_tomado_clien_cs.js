/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Gas tomado de cliente CS
 * Script id: customscript_drt_ptg_gas_tomado_clien_cs
 * customer Deployment id: customdeploy_drt_ptg_gas_tomado_clien_cs
 * Applied to: PTG - Gas tomado de cliente
 * File: drt_ptg_gas_tomado_clien_cs.js
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
      var sublistFieldName = context.fieldId;

      if ((sublistName === "recmachcustrecord_ptg_gascliente_" && sublistFieldName === "custrecord_ptg_cant_a_traspasar_gasclie_") ||
      (sublistName === "recmachcustrecord_ptg_gascliente_" && sublistFieldName === "custrecord_ptg_art_gascliente_")) {
        var articulo = currentRecord.getCurrentSublistValue({sublistId: "recmachcustrecord_ptg_gascliente_", fieldId: "custrecord_ptg_art_gascliente_",});
        log.audit("articulo", articulo);
        var cantidad = currentRecord.getCurrentSublistValue({sublistId: "recmachcustrecord_ptg_gascliente_", fieldId: "custrecord_ptg_cant_a_traspasar_gasclie_",});
        log.audit("articulo", cantidad);

        var itemLookUp = search.lookupFields({
          type: record.Type.INVENTORY_ITEM,
          id: articulo,
          columns: ['custitem_ptg_capacidadcilindro_']
        });

        var capacidad = itemLookUp.custitem_ptg_capacidadcilindro_ || 0;
        log.audit("capacidad", capacidad);

        var resultado = capacidad * cantidad;
        log.audit("resultado", resultado);

        currentRecord.setCurrentSublistValue({
          sublistId: "recmachcustrecord_ptg_gascliente_", 
          fieldId: "custrecord_ptg_kgsrecibidos_", 
          value: resultado,
        });
      }

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
      var totalCabeceraPF = 0;
      var idRegistroDeServicios = "recmachcustrecord_ptg_gascliente_";
      var gasLP = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        gasLP = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        gasLP = 4216;
      }
    

    if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_art_gascliente_",}) && 
    currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cant_a_traspasar_gasclie_",})) {
      var articulo = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_art_gascliente_",});
      var cantidadServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cant_a_traspasar_gasclie_",});
      var cantidadServCilindrosOld = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_kgsrecibidos_",});
      var totalCabecera = currentRecord.getValue("custrecord_ptg_traspasokil_") || 0;
      log.emergency("totalCabecera", totalCabecera);

      if(articulo == gasLP){

      totalCabeceraPF = parseFloat(totalCabecera);
      log.emergency("totalCabeceraPF", totalCabeceraPF);
      total = totalCabeceraPF + cantidadServCilindros;
      log.emergency("total", total);
      log.emergency("OK pasa", total);
      currentRecord.setValue("custrecord_ptg_traspasokil_", total);
      
      if(!cantidadServCilindrosOld){
        totalCabeceraPF = parseFloat(totalCabecera);
        total = totalCabeceraPF + cantidadServCilindros;
        currentRecord.setValue("custrecord_ptg_traspasokil_", total);
        currentRecord.setCurrentSublistValue({
          sublistId: idRegistroDeServicios,
          fieldId: 'custrecord_ptg_kgsrecibidos_',
          value: cantidadServCilindros
        });
      } else {
        totalCabeceraPF = parseFloat(totalCabecera);
        total = totalCabeceraPF - cantidadServCilindrosOld;
        totalFinal = total + cantidadServCilindros;
        currentRecord.setValue("custrecord_ptg_traspasokil_", totalFinal);
        currentRecord.setCurrentSublistValue({
          sublistId: idRegistroDeServicios,
          fieldId: 'custrecord_ptg_kgsrecibidos_',
          value: cantidadServCilindros
        });
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
      if (sublistName === "recmachcustrecord_ptg_gascliente_"){
        if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_kgsrecibidos_",}) > 0){
          var kilogramos = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_kgsrecibidos_",});
          var kilogramosPF = parseFloat(kilogramos);

          if (kilogramos) {
            var totalCabeceraKilogramos = currentRecord.getValue("custrecord_ptg_traspasokil_");
            if(totalCabeceraKilogramos){
              var totalCabeceraKilogramosPF = parseFloat(totalCabeceraKilogramos);
              total = totalCabeceraKilogramosPF - kilogramosPF;
              currentRecord.setValue("custrecord_ptg_traspasokil_", total);
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
  };
});
