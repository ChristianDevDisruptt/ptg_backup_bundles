/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 09/2022
 * Script name: PTG - Detalle Gas tipo de pago CS
 * Script id: customscript_drt_ptg_det_gas_tip_pag_cs
 * customer Deployment id: customdeploy_drt_ptg_det_gas_tip_pag_cs
 * Applied to: PTG - Detalle Gas tipo de pago
 * File: drt_ptg_detalle_gas_tipo_pago_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function fieldChanged(context) {
      var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var cliente = currentRecord.getValue("custrecord_ptg_clientegas_");
      var precio = parseFloat(currentRecord.getValue("custrecord_ptg_preciogas_old"));
      var cilindro = currentRecord.getValue("custrecord_ptg_tipocil_gas_");
      log.audit("precio", precio);
      var articuloID = record.load({
        type: search.Type.INVENTORY_ITEM,
        id: cilindro,
      });
      var capacidad = parseFloat(articuloID.getValue("custitem_ptg_capacidadcilindro_"));
      var litrosVendidos = capacidad / 0.54;
      

      if (cliente && fieldName === "custrecord_ptg_clientegas_") {
        var clienteObj = record.load({
          type: search.Type.CUSTOMER,
          id: cliente,
        });
        var tipoDescuento = clienteObj.getValue("custentity_ptg_tipo_descuento");
        var cantidadDescuento = parseFloat(clienteObj.getValue("custentity_ptg_descuento_asignar"));
        log.audit("cantidadDescuento", cantidadDescuento);
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

        currentRecord.setValue("custrecord_ptg_preciogas", descuento.toFixed(6));
        currentRecord.setValue("custrecord_ptg_importegas_", importeDespachador.toFixed(6));
        currentRecord.setValue("custrecord_ptg_impuestogas_", impuesto.toFixed(6));
        currentRecord.setValue("custrecord_ptg_total_gas", total.toFixed(6));
      }

    }
  
    return {
      fieldChanged: fieldChanged
    };
  });
