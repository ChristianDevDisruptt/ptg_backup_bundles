/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - PTG - Ord Traslado a Custom
 * Script id: customscript_drt_ptg_ord_tras_custom
 * Deployment id: customdeploy_drt_ptg_ord_tras_custom
 * Applied to: Orden de traslado
 * File: DRT - Orden Traslado a Custom Record.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(["N/record", "N/search", "N/runtime"], function (record, search, runtime) {
    function afterSubmit(context) {
      try {

        if (context.type == "create") {
          var customRec = context.newRecord;
          var recId = customRec.id;
          var recType = customRec.type;
          var nombre = customRec.getValue("tranid");
          var numeroViaje = customRec.getValue("custbody_ptg_numero_viaje");
          var zonaPrecio = customRec.getValue("custbody_ptg_zonadeprecio_traslado_");
          var numeroViajeDestino = customRec.getValue("custbody_ptg_numero_viaje_destino");
          var registroMovCreado = customRec.getValue("custbody_drt_ptg_registro_mov_creado");
          var itemCount = customRec.getLineCount({ sublistId: "item" });
          var codigoMovimiento = customRec.getValue("custbody_ptg_codigo_movimiento");
          var ubicacionOrigen = customRec.getValue("location");
          var estacionCarburacion = customRec.getValue("custbody_ptg_estacion_carburacion");
          var articuloArray = [];
          var cantidadArray = [];
          var lookupItem = [];
          var unidadArray = [];
          var registroArray = [];
          var articuloCilindro = 0;
          var cilindro10 = 0;
          var cilindro20 = 0;
          var cilindro30 = 0;
          var cilindro45 = 0;
          var articuloEstacionario = 0;
          var unidad10 = 0;
          var unidad20 = 0;
          var unidad30 = 0;
          var unidad45 = 0;
          
          if (runtime.envType === runtime.EnvType.SANDBOX) {
            cilindro10 = 4094;
            cilindro20 = 4095;
            cilindro30 = 4096;
            cilindro45 = 4602;
            articuloEstacionario = 2;
            unidad10 = 24;
            unidad20 = 25;
            unidad30 = 26;
            unidad45 = 27;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            cilindro10 = 4210;
            cilindro20 = 4211;
            cilindro30 = 4212;
            cilindro45 = 4213; 
            articuloEstacionario = 2; 
            unidad10 = 12;
            unidad20 = 13;
            unidad30 = 14;
            unidad45 = 15;  
          }

          //if(numeroViaje && numeroViajeDestino) {
          if(numeroViaje) {

          

          for (var i = 0; i < itemCount; i++) {
            articuloArray[i] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "item",
              line: i,
            });
            log.audit("Articulo: "+i, articuloArray[i]);
            cantidadArray[i] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              line: i,
            });
            log.audit("Cantidad: "+i, cantidadArray[i]);

            unidadArray[i] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "units",
              line: i,
            });
            log.audit("unidadArray: "+i, unidadArray[i]);

            registroArray[i] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_drt_ptg_registro_mov_creado",
              line: i,
            });
            log.audit("registroArray: "+i, registroArray[i]);

            if(!registroArray[i]){
              lookupItem[i] = search.lookupFields({
                type: search.Type.INVENTORY_ITEM,
                id: articuloArray[i],
                columns: ["custitem_ptg_tipodearticulo_"],
              });
  
              var tipoItem = lookupItem[i].custitem_ptg_tipodearticulo_[0].value;
              log.audit("tipoItem", tipoItem);
  
              if(tipoItem == articuloEstacionario){
                log.audit("***ESTACIONARIOS***");
  
                var lookupViaje = search.lookupFields({
                  type: 'customrecord_ptg_tabladeviaje_enc2_',
                  id: numeroViaje,
                  columns: ["custrecord_ptg_vehiculo_tabladeviajes_"],
                });
      
                var lookupIdEquipo = lookupViaje.custrecord_ptg_vehiculo_tabladeviajes_[0].value;
                log.audit("lookupIdEquipo", lookupIdEquipo);
      
                var lookupEquipo = search.lookupFields({
                  type: 'customrecord_ptg_equipos',
                  id: lookupIdEquipo,
                  columns: ["custrecord_ptg_descripcion_equipo_", "custrecord_ptg_ubicacionruta_"],
                });
                log.audit("lookupEquipo", lookupEquipo);
      
                var lookupEquipoDescripcion = lookupEquipo.custrecord_ptg_descripcion_equipo_;
                log.audit("lookupEquipoDescripcion", lookupEquipoDescripcion);
  
                var lookupEquipoRut = lookupEquipo.custrecord_ptg_ubicacionruta_;
                log.audit("lookupEquipoRut", lookupEquipoRut);
      
                var lookupEquipoRuta = lookupEquipo.custrecord_ptg_ubicacionruta_[0].text;
                log.audit("lookupEquipoRuta", lookupEquipoRuta);
                
                var rec1 = record.create({
                  type: "customrecord_ptg_traspaso_estacionarios_",
                  isDynamic: true,
                });
      
                rec1.setValue("custrecord_ptg_vehiculo_traspaso_", lookupIdEquipo);
                rec1.setValue("custrecord_ptg_traspasodescrip_vehiculo_", lookupEquipoDescripcion);
                rec1.setValue("custrecord_ptg_ruta_traspaso_", lookupEquipoRuta);
                rec1.setValue("custrecord_ptg_litros_traspaso_", cantidadArray[i]);
                rec1.setValue("custrecord_ptg_num_viaje_est", numeroViaje);
                rec1.setValue("custrecord_ptg_referencia_traspaso_", recId);
  
                var recIdSavedEstacionarios = rec1.save();
  
                var rec3 = record.load({
                  type: customRec.type,
                  id: customRec.id,
                  isDynamic: true
                });
      
                rec3.selectLine('item', i);
                rec3.setCurrentSublistValue('item', 'custcol_drt_ptg_registro_mov_estac', recIdSavedEstacionarios);
                rec3.commitLine('item');
      
                rec3.save();
      
                log.debug({
                  title: "Record successfully ESTACIONARIOS",
                  details: "Id Saved: " + recIdSavedEstacionarios,
                });
  
              } else {
                log.audit("***CILINDROS***");

                if(unidadArray[i] == unidad10){
                  articuloCilindro = cilindro10;
                } else if(unidadArray[i] == unidad20){
                  articuloCilindro = cilindro20;
                } else if(unidadArray[i] == unidad30){
                  articuloCilindro = cilindro30;
                }  else if(unidadArray[i] == unidad45){
                  articuloCilindro = cilindro45;
                }
                log.audit("articuloCilindro:", articuloCilindro);
                
              var rec = record.create({
                type: "customrecord_ptg_regitrodemovs_",
                isDynamic: true,
              });
    
              rec.setValue("name", recId);
              rec.setValue("custrecord_ptg_codigomov_", codigoMovimiento);
              rec.setValue("custrecord_ptg_movmas_", 0);
              rec.setValue("custrecord_ptg_movmenos_", cantidadArray[i]);
              rec.setValue("custrecord_ptg_cilindro", articuloCilindro);
              rec.setValue("custrecord_ptg_ventagas_", 0);
              rec.setValue("custrecord_ptg_envasesvendidos_", 0);
              rec.setValue("custrecord_ptg_lts_", 0);
              rec.setValue("custrecord_ptg_tasa", 0);
              rec.setValue("custrecord_ptg_num_viaje_oportunidad", numeroViaje);
              rec.setValue("custrecord_ptg_origen", true);
              rec.setValue("custrecord_ptg_zonadeprecio_registromovs", zonaPrecio);
              rec.setValue("custrecord_ptg_unidad_", unidadArray[i])
              rec.setValue("custrecord_drt_ptg_reg_transaccion", recId);
      
              var recIdSaved = rec.save();
  
              var rec2 = record.load({
                type: recType,
                id: recId,
                isDynamic: true
              });
    
              rec2.selectLine('item', i);
              rec2.setCurrentSublistValue('item', 'custcol_drt_ptg_registro_mov_creado', recIdSaved);
              rec2.commitLine('item');
    
              rec2.save();
    
              log.debug({
                title: "Record successfully CILINDROS",
                details: "Id Saved: " + recIdSaved,
              });
  
            }
            }

            

          }
        }
          
        }
        
      } catch (e) {
        log.error({ title: e.name, details: e.message });
      }
    }
    return {
      afterSubmit: afterSubmit,
    };
  });