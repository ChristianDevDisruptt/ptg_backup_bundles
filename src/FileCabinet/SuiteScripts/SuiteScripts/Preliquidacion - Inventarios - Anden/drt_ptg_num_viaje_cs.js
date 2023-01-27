/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: DRT - CS numero de viaje
 * Script id: customscript_drt_cs_numero_viaje
 * customer Deployment id: customdeploy_drt_cs_numero_viaje
 * Applied to: Recepción de artículo
 * File: drt_ptg_num_viaje_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime"], function (record, search, error, runtime) {
    function pageInit(context) {
        try {
          var currentRecord = context.currentRecord;
          var numeroViaje = currentRecord.getValue("custbodyptg_numerodeviaje");
          log.audit("Numero de viaje", numeroViaje);

          var itemreceiptSearchObj = search.create({
            type: "itemreceipt",
            filters:
            [
               ["type","anyof","ItemRcpt"], "AND", 
               ["custbodyptg_numerodeviaje","isnotempty",""], "AND", 
               ["mainline","is","T"]
            ],
            columns:
            [
               search.createColumn({
                  name: "ordertype",
                  sort: search.Sort.ASC,
                  label: "Tipo de orden de compra"
               }),
               search.createColumn({name: "trandate", label: "Fecha"}),
               search.createColumn({name: "custbody_ptg_numero_viaje", label: "Número de Viaje"}),
               search.createColumn({name: "custbodyptg_numerodeviaje", label: "PTG - Número de Viaje (Importación)"}),
               search.createColumn({name: "internalid", label: "ID interno"})
            ]
         });
         var srchResults = itemreceiptSearchObj.run().getRange({
            start: 0,
            end: 2,
          });
          

          numeroViajeBusqueda = srchResults[0].getValue({name: 'custbodyptg_numerodeviaje'});
          console.log("Numero Viaje", numeroViajeBusqueda);
          var numeroEntero = parseInt(numeroViajeBusqueda);

          if (!numeroViaje) {
             
                numeroEntero = numeroEntero + 1;
                currentRecord.setValue("custbodyptg_numerodeviaje", numeroEntero);
                 
          }
          
        } catch (error) {
          console.log({
            title: "error fieldChanged",
            details: JSON.stringify(error),
          });
        }
  
    }
  
    return {
      pageInit: pageInit
      
    };
  });