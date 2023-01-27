/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Articulos Por Zona CS
 * Script id: customscript_drt_articulos_zona_cs
 * customer Deployment id: customdeploy_drt_articulos_zona_cs
 * Applied to: PTG - Artículos por zona
 * File: drt_articulos_por_zona_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function validateLine(context) {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var precioVenta = currentRecord.getValue("custrecordptg_precio_venta_");
      log.audit("precioVenta", precioVenta);

      if (sublistName === "recmachcustrecord_ptg_art_desc_")
        if (currentRecord.getCurrentSublistValue({
            sublistId: sublistName,
            fieldId: "custrecord_ptg_cantidad_descuento_",
          })
        )
        var cantidadDescuento = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_descuento_",});
        log.audit("cantidadDescuento", cantidadDescuento);
        var descuento = precioVenta - cantidadDescuento;
        log.audit("descuento", descuento);

          currentRecord.setCurrentSublistValue({
            sublistId: sublistName,
            fieldId: "custrecordptg_precio_descuento",
            value: descuento,
          });
      return true;
    }
    return {
      validateLine: validateLine,
    };
  });
