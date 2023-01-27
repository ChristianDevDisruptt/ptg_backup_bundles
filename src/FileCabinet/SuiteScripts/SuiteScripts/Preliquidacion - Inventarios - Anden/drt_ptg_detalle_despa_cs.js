/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - Detalle despachador CS
 * Script id: customscript_drt_ptg_detalle_despa_cs
 * customer Deployment id: customdeploy_drt_ptg_detalle_despa_cs
 * Applied to: PTG - Detalle despachador
 * File: drt_ptg_detalle_despa_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
     function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var cliente = currentRecord.getValue("custrecord_ptg_clientedespachador_");
      var precio = parseFloat(currentRecord.getValue("custrecord_ptg_preciounidespachador_old"));
      log.audit("precio", precio);
      

      if (cliente && fieldName === "custrecord_ptg_clientedespachador_") {
        var clienteObj = record.load({
          type: search.Type.CUSTOMER,
          id: cliente,
        });
        var tipoDescuento = clienteObj.getValue("custentity_ptg_tipo_descuento");
        var cantidadDescuento = parseFloat(clienteObj.getValue("custentity_ptg_descuento_asignar"));
        log.audit("cantidadDescuento", cantidadDescuento);
        var litrosVendidos = parseFloat(currentRecord.getValue("custrecord_ptg_lts_vendidos_despachador_"));
        log.audit("litrosVendidos", litrosVendidos);
        if(tipoDescuento == 1){//Descuento porcentaje
          log.audit("Descuento Porcentaje");
          var porcentaje = cantidadDescuento / 100;
          var porcentajeSinIVA = porcentaje / 1.16;
          descuento = precio - (precio * porcentajeSinIVA);
          log.audit("descuento pz", descuento);
        } else if (tipoDescuento == 2){//Descuento pesos
          log.audit("Descuento Pesos");
          var porcentajeSinIVA = cantidadDescuento / 1.16;
          descuento = precio - porcentajeSinIVA;
          log.audit("descuento pz", descuento);
        } else if (!tipoDescuento){
          descuento = precio;
          log.audit("NO descuento", descuento);
        }

        var importeDespachador = litrosVendidos * descuento;
        var impuesto = importeDespachador * .16;
        var total = importeDespachador + impuesto;

        currentRecord.setValue("custrecord_ptg_preciounidespachador_", descuento.toFixed(6));
        currentRecord.setValue("custrecord_ptg_importe_despachador_", importeDespachador.toFixed(6));
        currentRecord.setValue("custrecord_ptg_impuestodespachador_", impuesto.toFixed(6));
        currentRecord.setValue("custrecord_ptg_total_despachador_", total.toFixed(6));



        //return true;
      }

    }

  
    return {
      fieldChanged: fieldChanged
    };
  });
