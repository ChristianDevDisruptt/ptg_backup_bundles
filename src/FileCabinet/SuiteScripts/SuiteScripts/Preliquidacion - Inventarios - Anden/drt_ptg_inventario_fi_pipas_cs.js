/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: PTG - Inventario físico Pipas CS
 * Script id: customscript_drt_ptg_invent_fi_pipas_cs
 * customer Deployment id: customdeploy_drt_ptg_invent_fi_pipas_cs
 * Applied to: PTG - Inventario físico Pipas
 * File: drt_ptg_inventario_fi_pipas_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function fieldChanged(context) {
      try {
        var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistFieldName = context.fieldId;
      var fieldName = context.fieldId;
      var line = context.line;
      var litros = 0;
      var porcentaje = 0;
      var kgsEnInv = 0;
      var kgsEnInventario = 0;
      var plantaInventario = currentRecord.getValue("custrecord_ptg_planta_inv_fisico");
      log.audit("plantaInventario");
      debugger;
      var vehiculoPipa = 0;
      var gasLP = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        vehiculoPipa = 1;
        gasLP = 4088;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        vehiculoPipa = 1;
        gasLP = 4216;
      }


      if (plantaInventario && fieldName === 'custrecord_ptg_planta_inv_fisico'){
        //BÚSQUEDA GUARDADA: PTG - Equipos Inventario Fis Pipas SS
        var customrecord_ptg_equiposSearchObj = search.create({
          type: "customrecord_ptg_equipos",
          filters: [
            ["custrecord_ptg_ubicacion_","anyof",plantaInventario], "AND", 
            ["custrecord_ptg_ubicacionruta_","noneof","@NONE@"],"AND", 
            ["custrecord_ptg_tipo_vehiculo_","anyof",vehiculoPipa]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "Internal ID"}),
             search.createColumn({name: "custrecord_ptg_ubicacionruta_", label: "PTG - Ubicación/Ruta"}),
             search.createColumn({name: "custrecord_ptg_wc_capacity_", label: "PTG - WC CAPACITY"})
          ]
        });
        var searchResultCount = customrecord_ptg_equiposSearchObj.runPaged().count;
        var searchResultCountResults = customrecord_ptg_equiposSearchObj.run().getRange({
          start: 0,
          end: searchResultCount,
        });
        for ( var i = 0; i < 5; i++){
          (idEquipo = searchResultCountResults[i].getValue({name: "internalid", label: "Internal ID"})),
          (ubicacion = searchResultCountResults[i].getValue({name: "custrecord_ptg_ubicacionruta_", label: "PTG - Ubicación/Ruta"})),
          (capacidad = searchResultCountResults[i].getValue({name: "custrecord_ptg_wc_capacity_", label: "PTG - WC CAPACITY"}));
          log.debug("idEquipo", idEquipo);
          log.debug("ubicacion", ubicacion);

          //BÚSQUEDA GUARDADA: PTG - Artículo Inventario
        var itemSearchObj = search.create({
          type: "item",
          filters: [["internalid","anyof",gasLP], "AND", ["inventorylocation","anyof",ubicacion]],
          columns: [
            search.createColumn({name: "locationquantityonhand", label: "Ubicación disponible"})
          ]
        });
        var itemSrchResults = itemSearchObj.run().getRange({
          start: 0,
          end: 1,
        });
        log.audit("itemSrchResults", itemSrchResults);

        if (itemSrchResults.length > 0) {
          (kgsEnSistema = itemSrchResults[0].getValue({name: "locationquantityonhand", label: "Ubicación disponible",}));
          litros = kgsEnSistema / 0.54;
        } else {
          kgsEnSistema = 0;
          litros = 0;
        }

          currentRecord.selectNewLine({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_'
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_', 
            fieldId: 'custrecord_ptg_num_pipa_',
            value: idEquipo
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_', 
            fieldId: 'custrecordptg_descripcion_pipa_',
            value: ubicacion
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_',
            fieldId: 'custrecord_ptg_kgs_ensistema_',
            value: kgsEnSistema
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_',
            fieldId: 'custrecord_ptg_capacidad_pipa_detalle_',
            value: capacidad
          });
          currentRecord.setCurrentSublistValue({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_',
            fieldId: 'custrecord_ptg_litros_detalle_',
            value: litros.toFixed(4)
          });
          currentRecord.commitLine({
            sublistId: 'recmachcustrecord_ptg_pipadetalle_'
          });
        }

      }
      
      if (sublistName === 'recmachcustrecord_ptg_pipadetalle_' && sublistFieldName === 'custrecord_ptg_porcentaje_llenado_pipa_'){
        var pipa = currentRecord.getCurrentSublistValue({sublistId: 'recmachcustrecord_ptg_pipadetalle_', fieldId: 'custrecord_ptg_num_pipa_'});
        log.audit("pipa", pipa);
        var equiposObj = record.load({
          type: "customrecord_ptg_equipos",
          id: pipa,
        });
        var ubicacion = equiposObj.getValue("custrecord_ptg_ubicacionruta_");
        var capacidad = equiposObj.getValue("custrecord_ptg_wc_capacity_");
        log.audit("ubicacion", ubicacion);
        log.audit("capacidad", capacidad);
        var kgsEnSistema = currentRecord.getCurrentSublistValue({
          sublistId: 'recmachcustrecord_ptg_pipadetalle_',
          fieldId: 'custrecord_ptg_kgs_ensistema_',
        });

        var porcentajeLlenado = currentRecord.getCurrentSublistValue({
          sublistId: 'recmachcustrecord_ptg_pipadetalle_',
          fieldId: 'custrecord_ptg_porcentaje_llenado_pipa_'
        });

        porcentaje = porcentajeLlenado / 100;
        log.audit("porcentaje", porcentaje);

        var capacidadPF = parseFloat(capacidad);
        var porcentajePF = parseFloat(porcentaje)
        log.audit("capacidadPF", capacidadPF);
        log.audit("porcentajePF", porcentajePF);

        kgsEnInv = porcentajePF * capacidadPF;
        log.audit("kgsEnInv", kgsEnInv);

        kgsEnInventario = kgsEnInv - kgsEnSistema;
        log.audit("kgsEnInventario", kgsEnInventario);

        currentRecord.setCurrentSublistValue({
          sublistId: 'recmachcustrecord_ptg_pipadetalle_',
          fieldId: 'custrecord_ptg_kgs_inv_detalle_',
          value: kgsEnInventario
        });

        currentRecord.setCurrentSublistValue({
          sublistId: 'recmachcustrecord_ptg_pipadetalle_',
          fieldId: 'custrecord_ptg_ajuste_detalle_',
          value: kgsEnInventario
        });

        
      }
      } catch (error) {
        log.debug("fieldChange Error", error);
      }
    }

    function validateLine(context){
      try {
        var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var planta = currentRecord.getValue("custrecord_ptg_planta_inv_fisico");
      var plantaTXT = currentRecord.getText("custrecord_ptg_planta_inv_fisico");
      log.audit("Planta Cabecera", planta);
      log.audit("plantaTXT", plantaTXT);
      
        if (sublistName === 'recmachcustrecord_ptg_pipadetalle_'){
          log.audit("entra");
            if (currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_num_pipa_'}) &&
            planta){

            var pipa = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_num_pipa_'});
            log.audit("pipa", pipa);
            var equiposObj = record.load({
              type: "customrecord_ptg_equipos",
              id: pipa,
            });
            var plantaEquipo = equiposObj.getValue("custrecord_ptg_ubicacion_");
            log.audit("plantaEquipo", plantaEquipo);
            var plantaEquipoTXT = equiposObj.getText("custrecord_ptg_ubicacion_");
            log.audit("plantaEquipoTXT", plantaEquipoTXT);
  
            if (planta != plantaEquipo) {
              var options = {
                title: "No hay coincidencia",
                message: "No se puede agregar la línea, porque la planta del equipo '" + plantaEquipoTXT + "' no pertenece a la planta de cabecera '" + plantaTXT + "'.",};
              dialog.alert(options);
              log.audit("No coincide");
              return false;
            }
            return true;
          }
        }
      } catch (error) {
        log.error("validateLine Error", error);
      }
      }

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

  
    return {
      pageInit: pageInit,
      fieldChanged: fieldChanged,
      validateLine: validateLine,
      
    };
  });
