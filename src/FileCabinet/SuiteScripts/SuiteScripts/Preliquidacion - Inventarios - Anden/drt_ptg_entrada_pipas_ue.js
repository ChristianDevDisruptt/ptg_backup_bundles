/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: PTG - Entrada Pipas UE
 * Script id: customscript_drt_ptg_entrada_pipas_ue
 * customer Deployment id: customdeploy_drt_ptg_entrada_pipas_ue
 * Applied to: PTG - Entrada Pipas
 * File: drt_ptg_entrada_pipas_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url'], function (record, search, runtime, https, url) {    
    function afterSubmit(context) {
        try {
          if(context.type == "create"){
          var newRecord = context.newRecord;
          var litrosTotalizadorEntrada = newRecord.getValue("custrecord_ptg_lts_totali_entrada_pipa_");
          var kilometrosEntrada = newRecord.getValue("custrecord_ptg_kilometros_entrada_pipa_");
          var equipo = newRecord.getValue("custrecord_ptg_vehiculoentrada_");
          var objUpdate = {
            custrecord_ptg_kilometraje_equipo_: kilometrosEntrada,
            custrecord_ptg_totalizador_: litrosTotalizadorEntrada,
          };
          log.audit("equipo", equipo);
          log.audit("objUpdate", objUpdate);

          record.submitFields({
            id: equipo,
            type: "customrecord_ptg_equipos",
            values: objUpdate,
          });
        }

        } catch (e) {
            log.error({ title: e.name, details: e.message });
        }
    }

    function beforeSubmit(context) {
        try {
          var newRecord = context.newRecord;
            var recId = newRecord.id;
      
            var numViaje = newRecord.getValue("custrecord_ptg_folio_entradapipas_");
            var numViajeSearchObj = search.create({
              type: "customrecord_ptg_entrada_pipas_",
              filters:
              [
              ],
              columns:
              [
              ]
           });
      
           var searchResultCount = numViajeSearchObj.runPaged().count;
           log.audit("searchResultCount", searchResultCount);
      
            if (!numViaje || numViaje == "Por Asignar") {
                  var numeroEntero = searchResultCount + 1;
                  newRecord.setValue("custrecord_ptg_folio_entradapipas_", numeroEntero.toFixed(0));
                  newRecord.setValue("name", numeroEntero.toFixed(0));
            }
            
        } catch (e) {
          log.error({
            title: e.name,
            details: e.message,
          });
        }
      }
    
    return {
        afterSubmit: afterSubmit,
        beforeSubmit: beforeSubmit,
    };
});