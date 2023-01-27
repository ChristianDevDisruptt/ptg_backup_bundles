/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 04/2022
 * Script name: PTG - Gas tomado de cliente UE
 * Script id: customscript_drt_ptg_gas_tomado_clien_ue
 * customer Deployment id: customdeploy_drt_ptg_gas_tomado_clien_ue
 * Applied to: PTG - Gas tomado de cliente
 * File: drt_ptg_gas_tomado_clien_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
  function beforeSubmit(context) {
    try {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
  
        var folio = newRecord.getValue("custrecord_ptg_num_tomadoacuenta_cliete_");

        if(!folio){
          var folioObj = search.create({
            type: "customrecord_ptg_gas_tomadocliente_",
            filters: [],
            columns: []
          });
          var folioObjCount = folioObj.runPaged().count;
          log.audit("folioObjCount", folioObjCount);
          var numeroEntero = folioObjCount + 1;
          newRecord.setValue("custrecord_ptg_num_tomadoacuenta_cliete_", numeroEntero.toFixed(0));
          newRecord.setValue("name", numeroEntero.toFixed(0));
        }
        
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  
  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var tipo = newRecord.type;
        var planta = 0;
        var cliente = newRecord.getValue("custrecord_ptg_clie_gasclie_");
        var cantidadGas = newRecord.getValue("custrecord_ptg_traspasokil_");
        var idAjusteInventario = newRecord.getValue("custrecord_ptg_ajuste_inventario_gtcl");
        var idNotaCredito = newRecord.getValue("custrecord_ptg_nota_credito_gtcl");
        var idGasLP = 0;
        var unidadLitros = 0;
        var lineCountTransaccion = newRecord.getLineCount({ sublistId:'recmachcustrecord_ptg_gascliente_' })||0;
        var cuentaAjuste = 0;
        var gasLPUnidades = 0;
        var objUpdate = {};
        var itemArray = [];
        var cantidadArray = [];
        var precioEnvaseArray = [];
        var unidadArray = [];
        log.audit("planta", planta);
        var envaseCilindro = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          planta = 1142;
          unidadLitros = 23;
          cuentaAjuste = 218;
          idGasLP = 4088;
          gasLPUnidades = 4693;
          envaseCilindro = 5;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          planta = 1505; //Temporal esto es de Rio Verde
          unidadLitros = 11;
          cuentaAjuste = 218;
          idGasLP = 4216;
          gasLPUnidades = 4216;
          envaseCilindro = 5;
        }

        var localizacionObj = record.load({
          type: record.Type.LOCATION,
          id: planta,
        });
        var subsidiaria = localizacionObj.getValue("subsidiary");
        log.audit("subsidiaria", subsidiaria);


        var clienteObj = record.load({
          type: record.Type.CUSTOMER,
          id: cliente,
        });
        var idArray = [];
        var defaultBillingArray = [];
        var lineCount = clienteObj.getLineCount({ sublistId:'addressbook' })||0;
        for ( var i = 0; i < lineCount; i++){
          idArray[i] = clienteObj.getSublistValue({
            sublistId: "addressbook",
            fieldId: "id",
            line: i,
          }) || "";

          defaultBillingArray[i] = clienteObj.getSublistValue({
            sublistId: "addressbook",
            fieldId: "defaultbilling",
            line: i,
          }) || "";

          if(defaultBillingArray[i]){
            var sublistFieldValue = clienteObj.getSublistSubrecord({
              sublistId: "addressbook",
              fieldId: 'addressbookaddress',
              line: i,
            });
    
            var idColoniaRuta = sublistFieldValue.getValue("custrecord_ptg_colonia_ruta");
    
            var coloniasRutasObj = record.load({
              type: "customrecord_ptg_coloniasrutas_",
              id: idColoniaRuta,
            });
    
            var idZonaPrecio = coloniasRutasObj.getValue("custrecord_ptg_zona_de_precio_");
    
            var zonaPrecioObj = record.load({
              type: "customrecord_ptg_zonasdeprecio_",
              id: idZonaPrecio,
            });
    
            var precio = zonaPrecioObj.getValue("custrecord_ptg_precio_");
            log.audit("precio", precio);
          }
  
        }
        var cilindro = 0;
        for ( var i = 0; i < lineCountTransaccion; i++){
          itemArray[i] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_gascliente_",
            fieldId: "custrecord_ptg_art_gascliente_",
            line: i,
          }) || "";
          log.audit("itemArray:", itemArray[i]);
  
          cantidadArray[i] = newRecord.getSublistValue({
            sublistId: "recmachcustrecord_ptg_gascliente_",
            fieldId: "custrecord_ptg_cant_a_traspasar_gasclie_",
            line: i,
          }) || "";
          log.audit("cantidadArray:", cantidadArray[i]);

          var itemObj = record.load({
            id: itemArray[i],
            type: search.Type.INVENTORY_ITEM,
          });
          var tipoArticulo = itemObj.getValue("custitem_ptg_tipodearticulo_");
          if(tipoArticulo == envaseCilindro){
            precioEnvaseArray[i] = itemObj.getSublistValue({
              sublistId: "price1",
              fieldId: "price_1_",
              line: 0,
            });
            log.audit("price", precioEnvaseArray[i]);
          }

  
        }
        log.audit("cilindro", cilindro);
        if(cilindro > 0){
          lineCountTransaccion = lineCountTransaccion +1;
        }
        
        if(!idAjusteInventario){

        var recAjusteInventario = record.create({
          type: "inventoryadjustment",
          isDynamic: true,
        });

        recAjusteInventario.setValue("subsidiary", subsidiaria);
        recAjusteInventario.setValue("adjlocation", planta);
        recAjusteInventario.setValue("account", cuentaAjuste);
        recAjusteInventario.setValue("memo", "Ajuste Generado Automáticamente Por Toma De Cliente");


        for (var l = 0; l < lineCountTransaccion; l++) {
          recAjusteInventario.selectLine("inventory", l);
          recAjusteInventario.setCurrentSublistValue("inventory", "item", itemArray[l]);
          recAjusteInventario.setCurrentSublistValue("inventory", "location", planta);
          if(itemArray[l] == idGasLP){
            var cantidadGasLP = cantidadArray[l] / 0.54;
            recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadGasLP);
          } else {
            recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadArray[l]);
          }
          recAjusteInventario.commitLine("inventory");
        }

        var idAjusteInventario = recAjusteInventario.save();

        objUpdate.custrecord_ptg_ajuste_inventario_gtcl = idAjusteInventario;
        log.audit("Ajuste de Inventario creado", idAjusteInventario);

      }

      if(!idNotaCredito){

        var recNotaCredito = record.create({
          type: "creditmemo",
          isDynamic: true,
        });

        recNotaCredito.setValue("entity", cliente);
        recNotaCredito.setValue("location", planta);
        


        for (var m = 0; m < lineCountTransaccion; m++) {
          recNotaCredito.selectLine("item", m);
          recNotaCredito.setCurrentSublistValue("item", "item", itemArray[m]);
          if(itemArray[m] == idGasLP){
            var cantidadGasLP = cantidadArray[m] / 0.54;
            recNotaCredito.setCurrentSublistValue("item", "quantity", cantidadGasLP);
            recNotaCredito.setCurrentSublistValue("item", "rate", precio);
          } else {
            recNotaCredito.setCurrentSublistValue("item", "quantity", cantidadArray[m]);
            recNotaCredito.setCurrentSublistValue("item", "rate", precioEnvaseArray[m]);
          }
          recNotaCredito.commitLine("item");
        }

        var idNotaCredito = recNotaCredito.save();

        objUpdate.custrecord_ptg_nota_credito_gtcl = idNotaCredito;
        log.audit("Nota de Credito creada", idNotaCredito);
      }


        
        
        log.debug({
          title: "Record created successfully",
          details: "Id: " + recId,
        });

    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    } finally {
      record.submitFields({
        id: recId,
        type: tipo,
        values: objUpdate,
      });
  }
  }
  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
  };
});
