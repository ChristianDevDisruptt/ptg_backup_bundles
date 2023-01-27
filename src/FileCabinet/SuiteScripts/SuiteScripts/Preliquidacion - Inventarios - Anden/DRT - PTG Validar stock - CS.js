/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - PTG - Validar Stock CS
 * Script id: customscript_drt_ptg_validar_stock_cs
 * Deployment id: customdeploy_drt_ptg_validar_stock_cs
 * Applied to: PTG - Registro de dotación cil
 * File: DRT - PTG Validar stock - CS.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/search", "N/record", "N/ui/dialog"], function (search, record, dialog) {
  
  function validateField(context) {
    var currentRecord = context.currentRecord;
    var recId = currentRecord.id;
    var cantidadDotacion = currentRecord.getValue("custrecord_ptg_dotacion_cilindros");
    var ubicacion = currentRecord.getValue("custrecord_ptg_ruta_");
    var articulo = currentRecord.getValue("custrecord_ptg_cilindro_dotacion_");
    var disponible = "";
    log.audit("ID CR", recId);
    log.audit("Cantidad Dotacion Selec", cantidadDotacion);
    log.audit("Ubicacion Selec", ubicacion);
    log.audit("Articulo Selec", articulo);

    if (ubicacion) {
      var locationObj = record.load({
        type: search.Type.LOCATION,
        id: ubicacion,
      });
      log.audit("lookupLocation", locationObj);
      var parent = locationObj.getValue("parent");
      log.audit("Parent", parent);
      var subsidiary = locationObj.getValue("subsidiary");
      log.audit("Subsidiary", subsidiary);
    }

    if (articulo && cantidadDotacion && ubicacion) {
      var itemSearchObj = search.create({
        type: "item",
        filters: [["internalid", "anyof", articulo], "AND", ["inventorylocation", "anyof", parent],],
        columns: [
          search.createColumn({name: "itemid", sort: search.Sort.ASC, label: "Nombre",}),
          search.createColumn({name: "inventorylocation", label: "Ubicación del inventario",}),
          search.createColumn({name: "locationquantityavailable", label: "Ubicación disponible",}),
        ],
      });
      var srchResults = itemSearchObj.run().getRange({
        start: 0,
        end: 2,
      });
      log.audit("srchResults", srchResults);
      if (srchResults.length > 0) {
        (nombre = srchResults[0].getValue({name: "itemid", sort: search.Sort.ASC, label: "Nombre",})),
        (ubicacionInventario = srchResults[0].getValue({name: "inventorylocation", label: "Ubicación del inventario",})),
        (disponible = srchResults[0].getValue({name: "locationquantityavailable", label: "Ubicación disponible",}));
        log.audit("Nombre Srch", nombre);
        log.audit("Ubicacion Inventario Srch", ubicacionInventario);
        log.audit("Disponible Srch", disponible);
      }

      if (cantidadDotacion > disponible) {
        var options = {
          title: "Máximo superado",
          message: "La cantidad ingresada (" + cantidadDotacion + ") supera el stock (" + disponible + ") del artículo",};
        dialog.alert(options);
        log.audit("Cantidad superada");
      } 
    }
    return true;
    
  }
  

  return {
    validateField: validateField,
  };
});
