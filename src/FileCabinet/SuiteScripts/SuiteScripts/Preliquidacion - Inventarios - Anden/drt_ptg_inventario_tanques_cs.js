/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: PTG - Inventario Tanques CS
 * Script id: customscript_drt_ptg_invent_tanques_cs
 * customer Deployment id: customdeploy_drt_ptg_invent_tanques_cs
 * Applied to: PTG - Inventario Tanques
 * File: drt_ptg_inventario_tanques_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    
  function pageInit(context){
    try {
      var currentRecord = context.currentRecord;
      var nombre = "Por Asignar";
      var name = currentRecord.getText("name");
      if(!name || name == ""){
        currentRecord.setValue("name", nombre);
      }
    } catch (error) {
      log.error("pageInit Error", error);
    }
  }

    function fieldChanged(context) {
      try {
        var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistFieldName = context.fieldId;
      var fieldName = context.fieldId;
      var plantaTanques = currentRecord.getValue("custrecord_ptg_planta_inv_tanques_");
      var line = context.line;
      var litros = 0;
      var porcentaje = 0;
      var kgsEnInv = 0;
      var kgsEnInventario = 0;
      var gasLP = 0;
      var porcentajeCabecera = currentRecord.getValue("custrecord_ptg_inv_ajustado_alm");
      var capacidadMaxima = currentRecord.getValue("custrecord_ptg_capmaxim_");
      var tanquesObjCount = 0;
      var capacidadTotal = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        gasLP = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        gasLP = 4216;
      }

      if (plantaTanques && fieldName === 'custrecord_ptg_planta_inv_tanques_'){
        //BÚSQUEDA GUARDADA: PTG - Tanques Inv Tanques SS
        var tanquesObj = search.create({
          type: "customrecord_ptg_tanques_",
          filters: [
            ["custrecord_ptg_planta_tanque","anyof", plantaTanques], "AND", 
            ["custrecord_ptg_localizacion_tanque_1","noneof","@NONE@"],"AND", 
            ["isinactive","is","F"]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "Internal ID"}),
             search.createColumn({name: "custrecord_ptg_descripcion_tanque_1_", label: "PTG - Descripción tanque 1"}),
             search.createColumn({name: "custrecord_ptg_capacidadtanque1_", label: "PTG - Capacidad Tanque 1"})
          ]
        });
        tanquesObjCount = tanquesObj.runPaged().count;
        var tanquesObjResults = tanquesObj.run().getRange({
          start: 0,
          end: tanquesObjCount,
        });
        log.debug("tanquesObjResults",tanquesObjResults);
        for( var i = 0; i < tanquesObjCount; i++){
          (idTanque = tanquesObjResults[i].getValue({name: "internalid", label: "Internal ID"})),
          (descripcion = tanquesObjResults[i].getValue({name: "custrecord_ptg_descripcion_tanque_1_", label: "PTG - Descripción tanque 1"})),
          (capacidad = parseFloat(tanquesObjResults[i].getValue({name: "custrecord_ptg_capacidadtanque1_", label: "PTG - Capacidad Tanque 1"})));

          capacidadTotal = capacidadTotal + capacidad;
          

          currentRecord.selectNewLine({
            sublistId: 'recmachcustrecord_ptg_invtanque_'
          });

          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_invtanque_',
            fieldId: 'custrecord_ptg_num_tanque_',
            value: idTanque
          });

          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_invtanque_',
            fieldId: 'custrecord_ptg_descripcion_tanque_',
            value: descripcion
          });


             currentRecord.setCurrentSublistValue({
               sublistId: 'recmachcustrecord_ptg_invtanque_',
               fieldId: 'custrecord_ptg_capacidad_tanque_',
               value: capacidad
             });

            currentRecord.commitLine({
              sublistId: 'recmachcustrecord_ptg_invtanque_'
            });

        }

        

        log.audit("capacidadTotal", capacidadTotal);
        currentRecord.setValue("custrecord_ptg_capmaxim_", capacidadTotal);

        //BÚSQUEDA GUARDADA: PTG - Cantidad disponible
        var itemSearchObj = search.create({
          type: "item",
          filters: [["internalid", "anyof", gasLP], "AND", ["inventorylocation", "anyof", plantaTanques],],
          columns: [
            search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Nombre", }),
            search.createColumn({name: "inventorylocation", label: "Ubicación del inventario", }),
            search.createColumn({name: "locationquantityonhand", label: "Ubicación disponible", }),
          ],
        });
        var searchResultCount = itemSearchObj.runPaged().count;
        log.debug("itemSearchObj result count", searchResultCount);

        if (searchResultCount > 0) {
          var itemSrchResults = itemSearchObj.run().getRange({
            start: 0,
            end: 2,
          });
          log.audit("itemSrchResults", itemSrchResults);

          if (itemSrchResults.length > 0) {
            invEnSistema = itemSrchResults[0].getValue({name: "locationquantityonhand", label: "Ubicación disponible",});
            log.audit("invEnSistema", invEnSistema);
            currentRecord.setValue("custrecord_ptg_inv_almacengrl_", invEnSistema);
          }
        }
      }
      
     
      if (sublistName === 'recmachcustrecord_ptg_invtanque_' && sublistFieldName === 'custrecord_ptg_porcentaje_llenado_tanque'){
        var lineCount = currentRecord.getLineCount({ sublistId:'recmachcustrecord_ptg_invtanque_' })||0;
        log.debug("lineCount", lineCount);

        var porcentajeLlenado = currentRecord.getCurrentSublistValue({
          sublistId: 'recmachcustrecord_ptg_invtanque_',
          fieldId: 'custrecord_ptg_porcentaje_llenado_tanque'
        });
        log.debug("porcentajeLlenado", porcentajeLlenado);

        var porcentaje = porcentajeLlenado / lineCount;
        log.debug("porcentaje", porcentaje);

        var porcentajeCab = porcentajeCabecera + porcentaje;

        currentRecord.setValue("custrecord_ptg_inv_ajustado_alm", porcentajeCab);
        

    
      }

      if (porcentajeCabecera && fieldName === 'custrecord_ptg_inv_ajustado_alm'){
        var porcenta = porcentajeCabecera / 100;
        var cantidadAjuste = porcenta * capacidadMaxima;
        currentRecord.setValue("custrecord_ptg_cantidadajuste_", cantidadAjuste);
      }
      } catch (error) {
        log.error("error fieldChange", error);
      }


    }

    function validateLine(context){
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var planta = currentRecord.getValue("custrecord_ptg_planta_inv_tanques_");
      var plantaTXT = currentRecord.getText("custrecord_ptg_planta_inv_tanques_");
      log.audit("Planta Cabecera", planta);
      log.audit("plantaTXT", plantaTXT);
      
        if (sublistName === 'recmachcustrecord_ptg_invtanque_'){
          log.audit("entra");
            if (currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_num_tanque_'}) &&
            planta){

            var tanque = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_num_tanque_'});
            log.audit("tanque", tanque);
            var equiposObj = record.load({
              type: "customrecord_ptg_tanques_",
              id: tanque,
            });
            var plantaEquipo = equiposObj.getValue("custrecord_ptg_localizacion_tanque_1");
            log.audit("plantaEquipo", plantaEquipo);
            var plantaEquipoTXT = equiposObj.getText("custrecord_ptg_localizacion_tanque_1");
            log.audit("plantaEquipoTXT", plantaEquipoTXT);
            var ubicacionObj = record.load({
                type: record.Type.LOCATION,
                id: plantaEquipo
            });
            var plantaTanque = ubicacionObj.getValue("parent");
            log.audit("plantaTanque", plantaTanque);
            var plantaTanqueTXT = ubicacionObj.getText("parent");
            log.audit("plantaTanqueTXT", plantaTanqueTXT);
  
            if (planta != plantaTanque) {
              var options = {
                title: "No hay coincidencia",
                message: "No se puede agregar la línea, porque la planta del tanque '" + plantaTanqueTXT + "' no pertenece a la planta de cabecera '" + plantaTXT + "'.",};
              dialog.alert(options);
              log.audit("No coincide");
              return false;
            }
            return true;
          }
        }
      }

  
    return {
      pageInit: pageInit,
      fieldChanged: fieldChanged,
      //validateLine: validateLine,
      
    };
  });
