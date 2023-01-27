/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - PTG - Oportunidad a Custom
 * Script id: customscript_drt_ptg_oportunidad_custom
 * Deployment id: customdeploy_drt_ptg_oportunidad_custom
 * Applied to: Opportunity
 * File: DRT - Oportunidad a Custom Record.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(["N/record", "N/search", "N/runtime", "N/format", "N/config"], function (record, search, runtime, format, config) {
  function beforeSubmit(context) {
    if (context.type == "create") {
      var customRec = context.newRecord;
      var recId = customRec.id;
      var formulario = customRec.getValue("customform");
      var servicio = customRec.getValue("custbody_ptg_tipo_servicio");
      var probabilidad = customRec.getValue("probability");
      var tipoPago = customRec.getValue("custbody_ptg_tipopago_carburacion_");
      var linea = customRec.getLineCount("item");
      var formularioComp = 0;
      var servicioComp = 0;
      var tipoPagoComp = 0;
      var tipoPagoCreditoComp = 0;
      
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioComp = 307;
        servicioComp = 3;
        tipoPagoComp = 2;
        tipoPagoCreditoComp = 5;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioComp = 264;
        servicioComp = 3;
        tipoPagoComp = 2;
        tipoPagoCreditoComp = 5;
      }


      if(formulario == formularioComp && servicio == servicioComp && probabilidad == "100"){
        
        for(var i = 0; i < linea; i++){
          totalImporte = customRec.getSublistValue({
            sublistId: "item",
            fieldId: "grossamt",
            line: i,
          });
        }
        if(tipoPago == tipoPagoComp){
          var pagoObj = [{
            tipo_pago: tipoPagoCreditoComp,
            monto: totalImporte,
          }];
        } else {
          var pagoObj = [{
            tipo_pago: tipoPago,
            monto: totalImporte,
          }];
        }
        
        var pago2Obj = {
          pago: pagoObj
        };

        var objValue = JSON.stringify(pago2Obj);
        log.audit("objValue", objValue);
        
      }
    }
    
    if (context.type == "edit") {
      var customRec = context.newRecord;
      var recId = customRec.id;
      var numeroViaje = customRec.getValue("custbody_ptg_numero_viaje");
      var numConsecut = customRec.getValue("custbody_drt_ptg_num_consecutivo");
      var estadoOport = customRec.getValue("custbody_ptg_estado_pedido");
      var entregadoEstadoPedido = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        entregadoEstadoPedido = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        entregadoEstadoPedido = 3;
      }

      if (numeroViaje && !numConsecut && estadoOport == entregadoEstadoPedido) {
        //BÚSQUEDA GUARDADA: Opportunity Search Consecutivo
        var opportunitySearchObj = search.create({
          type: "opportunity",
          filters: [["custbody_ptg_numero_viaje", "anyof", numeroViaje], "AND", ["custbody_ptg_estado_pedido", "anyof", entregadoEstadoPedido],],
          columns: [
            search.createColumn({name: "custbody_drt_ptg_num_consecutivo", sort: search.Sort.ASC, label: "PTG - Numero consecutivo"}),
          ],
        });
        var searchResultCount = opportunitySearchObj.runPaged().count;
        log.audit("ULTIMO REC OPORT", searchResultCount);
          if (searchResultCount == 0) {
            customRec.setValue("custbody_drt_ptg_num_consecutivo", 1);
          } else {
            var consecutivoFin = searchResultCount + 1;
            customRec.setValue("custbody_drt_ptg_num_consecutivo", consecutivoFin);
          }
      }
    }
  }


  function afterSubmit(context) {
    try {
      if (context.type == "create") {
        var customRec = context.newRecord;
        var recId = customRec.id;
        var formulario = customRec.getValue("customform");
        var servicio = customRec.getValue("custbody_ptg_tipo_servicio");
        var probabilidad = customRec.getValue("probability");
        var itemCount = customRec.getLineCount({sublistId : 'item'});
        var opcionPagoOBJ = customRec.getValue("custbody_ptg_opcion_pago_obj");
        log.debug("opcionPagoOBJ create", opcionPagoOBJ);
        var estacionCarburacion = customRec.getValue("custbody_ptg_estacion_carburacion");
        var total = customRec.getValue("total");
        var totalOportunidad = customRec.getValue("total");
        var objValue = JSON.parse(opcionPagoOBJ);
        log.debug("objValue create", objValue);
        var objValue2 = objValue;
        var objValue3 = objValue2.pago;
        var objCount = objValue3.length;
        var opcionPago = 0;
        var formularioComp = 0;
        var articuloEstacionario = 0;
        var servicioComp = 0;
        var tipoPagoVariosComp = 0;
        var cantidadTotalstacionario = 0;
        var articuloArray = [];
        var cantidadArray = [];
        var tasaArray = [];
      
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          formularioComp = 307;
          articuloEstacionario = 2;
          servicioComp = 3;
          tipoPagoVariosComp = 7;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioComp = 264;
          articuloEstacionario = 2;
          servicioComp = 3;
          tipoPagoVariosComp = 7;
        }

        log.audit("total", total);
        log.audit("totalOportunidad", totalOportunidad);

        if(formulario == formularioComp && servicio == servicioComp && probabilidad == "100"){

          for (var j = 0; j < itemCount; j++) {

            articuloArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "item",
              line: j,
            });
            log.audit("Articulo: "+j, articuloArray[j]);
  
            cantidadArray[j] = parseFloat(customRec.getSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              line: j,
            }));
            log.debug("Cantidad: "+j, cantidadArray[j]);
  
            tasaArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "rate",
              line: j,
            });
            log.audit("Tasa: "+j, tasaArray[j]);

            if(tasaArray[j] > 0){
              var lookupItem = search.lookupFields({
                type: "item",
                id: articuloArray[j],
                columns: ["custitem_ptg_tipodearticulo_"],
              });
              var lookupItemObject = lookupItem.custitem_ptg_tipodearticulo_[0];
              var lookupItemType = lookupItemObject.value;
              log.audit("Tipo articulo", lookupItemType);
            }
            if(lookupItemType == articuloEstacionario){
              cantidadTotalstacionario += cantidadArray[j];
            }
          }


          /*var equipoTXT = customRec.getValue("custbody_ptg_equipo_");
          log.audit("equipoTXT", equipoTXT);
          var customrecord_ptg_equiposSearchObj = search.create({
            type: "customrecord_ptg_equipos",
            filters: [["name","contains",equipoTXT]],
            columns: [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "name",sort: search.Sort.ASC,label: "Nombre"})
              ]
            });
         var searchResultCount = customrecord_ptg_equiposSearchObj.runPaged().count;
         log.audit("searchResultCount create", searchResultCount);
         if(searchResultCount > 0){
          var srchResults = customrecord_ptg_equiposSearchObj.run().getRange({
            start: 0,
            end: searchResultCount,
          });
          idEquipo = parseInt(srchResults[0].getValue({name: "internalid", label: "ID interno"}));
          log.audit("idEquipo", idEquipo);
         }*/


         

        var recPagos = record.create({
          type: "customrecord_ptg_pagos",
          isDynamic: true,
        });

        recPagos.setValue("custrecord_ptg_oportunidad_pagos", recId);
        //recPagos.setValue("custrecord_ptg_num_viaje_pagos", numeroViaje);
        recPagos.setValue("custrecord_ptg_total_servicio", totalOportunidad);
        recPagos.setValue("custrecord_registro_desde_oportunidad_p", true);
        recPagos.setValue("custrecord_ptg_estacion_carburacion", estacionCarburacion);
        recPagos.setValue("custrecord_ptg_total_litros_esta", cantidadTotalstacionario)

        var recIdSavedEstacionariosPagos = recPagos.save();

        log.debug({
          title: "Record created successfully pagos",
          details: "Id Saved: " + recIdSavedEstacionariosPagos,
        });
        if(objCount > 1){
          opcionPago = tipoPagoVariosComp;
          log.audit("varias opciones de pago", opcionPago);
        } else {
          opcionPago = objValue3[0].tipo_pago;
          log.audit("Una opcion de pago", opcionPago);
        }

        for (var tipoPago = 0; tipoPago < objCount; tipoPago++) {
          var objPos = objValue3[tipoPago];
          var objTipoPago = objPos.tipo_pago;
          var objMonto = parseFloat(objPos.monto);
          var objFolio = objPos.folio;
          log.audit("objPos", objPos);
          log.audit("objTipoPago", objTipoPago);
          log.audit("objMonto", objMonto);

          var recPagosOportunidad = record.create({
            type: "customrecord_ptg_pagos_oportunidad",
            isDynamic: true,
          });

          recPagosOportunidad.setValue("custrecord_ptg_oportunidad", recId);
          recPagosOportunidad.setValue("custrecord_ptg_num_viaje", numeroViaje);
          recPagosOportunidad.setValue("custrecord_ptg_tipo_pago", objTipoPago);
          recPagosOportunidad.setValue("custrecord_ptg_total", objMonto);
          recPagosOportunidad.setValue("custrecord_ptg_referenciapago_", objFolio);
          recPagosOportunidad.setValue("custrecord_ptg_registro_pagos", recIdSavedEstacionariosPagos);
          recPagosOportunidad.setValue("custrecord_registro_desde_oportunidad_po", true);
          recPagosOportunidad.setValue("custrecord_ptg_estacion_carburacion_", estacionCarburacion);

          var recIdSavedEstacionariosPagosOportunidad = recPagosOportunidad.save();

          log.debug({
            title: "Record created successfully pagos oportunidad",
            details: "Id Saved: " + recIdSavedEstacionariosPagosOportunidad,
          });
        }

        var equipoObj = {};

        var fechaObj = customRec.getValue("custbodyptg_inicio_servicio");
        log.audit("fechaObj", fechaObj);

        if(fechaObj){

        var yyyy = fechaObj.substring(0, 4);
        var mm = fechaObj.substring(5, 7);
        var dd = fechaObj.substring(8, 10)
        var time = formatAMPM(fechaObj);
        var val = (dd[1] ? dd : dd[0]) + '/' + (mm[1] ? mm : mm[0]) + '/' + yyyy + " " + time;
     
        var newFecha = val.toString();
        log.audit("newFecha",newFecha);
        
        equipoObj.custbody_ptg_fecha_hora_servicio_carb = newFecha;
        /* var objUpdate = {
          custbody_ptg_fecha_hora_servicio_carb: newFecha
        };
        log.audit("objUpdate",objUpdate);

        record.submitFields({
          id: customRec.id,
          type: customRec.type,
          values: objUpdate,
          options: {
            enableSourcing: false,
            ignoreMandatoryFields: true,
          },
        });*/

      }






      equipoObj.custbody_ptg_registro_pagos = recIdSavedEstacionariosPagos;
      equipoObj.custbody_ptg_opcion_pago = opcionPago;

        /*var equipoObj = {
          custbody_ptg_registro_pagos: recIdSavedEstacionariosPagos,
          custbody_ptg_opcion_pago: opcionPago,
        };
        log.audit("equipoObj", equipoObj);*/
        var actualizar = record.submitFields({
          id: customRec.id,
          type: customRec.type,
          values: equipoObj
        });
        log.debug("actualizar", actualizar);


        }/* else {
          var oportunidadID = record.load({
            type: search.Type.OPPORTUNITY,
            id: customRec.id,
          });
  
          var oportunidadLoadSaved = oportunidadID.save();
  
          log.audit("Oportunidad edita y guarda", oportunidadLoadSaved);
        }*/
      }
      if (context.type == "edit") {
        var customRec = context.newRecord;
        var recId = customRec.id;
        var servicioEstacionario = false;
        var cantidadTotalstacionario = 0;
        var registroCreado = customRec.getValue("custbody_drt_ptg_registro_creado");
        var tipoPagoOld = context.oldRecord.getValue("custbody_ptg_opcion_pago");
        var tipoPagoNew = customRec.getValue("custbody_ptg_opcion_pago");
        var registroPagos = customRec.getValue("custbody_ptg_registro_pagos")
        log.audit("tipoPagoNew", tipoPagoNew);
        var probabilidad = customRec.getValue("probability");   
        var itemCount = customRec.getLineCount({sublistId : 'item'});
        var numeroViaje = customRec.getValue("custbody_ptg_numero_viaje");
        var zonaPrecio = customRec.getValue("custbody_ptg_zonadeprecioop_");
        var folioSGC = customRec.getValue("custbody_ptg_foliounidad_sgc");
        var registroCreadoMov = customRec.getValue("custbody_drt_ptg_registro_creado_mov");
        var total = customRec.getValue("total");
        var nombre = customRec.getValue("tranid");  
        var codigoMovimiento = customRec.getValue("custbody_ptg_codigo_movimiento");
        var cliente = customRec.getValue("entity");
        var clienteTxt = customRec.getText("entity");
        var estacionCarburacion = customRec.getValue("custbody_ptg_estacion_carburacion");
        var articuloArray = [];
        var capacidadArray = [];
        var cantidadArray = [];
        var tasaArray = [];
        var importeArray = [];
        var impuestoArray = [];
        var importeBrutoArray = [];
        var cantidadSGCArray = [];
        var precioUnSGCArray = [];
        var subtotalSGCArray = [];
        var impuestoSGCArray = [];
        var impBrutoSGCArray = [];
        var totalSGCArray = [];
        var litrosTotalesArray = [];
        var totalCantidad = 0;
        var totalTasa = 0;
        var opcionPagoOBJ = customRec.getValue("custbody_ptg_opcion_pago_obj");
        var objValue = JSON.parse(opcionPagoOBJ);
        var objValue2 = objValue;
        var objValue3 = objValue2.pago;
        var objCount = objValue3.length;
        var opcionPago = 0;
        var idTipoPagoArray = [];
        var idArticuloDescuento = 0;
        var articuloCilindro = 0;
        var articuloEstacionario = 0;
        var articuloEnvase = 0;
        var tipoPagoVariosComp = 0;
        var formularioComp = 0;
        var servicioComp = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          idArticuloDescuento = 4528;
          articuloCilindro = 1;
          articuloEstacionario = 2;
          articuloEnvase = 5;
          tipoPagoVariosComp = 7;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          idArticuloDescuento = 4217;
          articuloCilindro = 1;
          articuloEstacionario = 2;
          articuloEnvase = 5;
          tipoPagoVariosComp = 7;
          formularioComp = 264;
          servicioComp = 3;
        }


        var entityObj = record.load({
          type: record.Type.CUSTOMER,
          id: cliente,
        });
        var direccion = entityObj.getValue("defaultaddress");
        var rfcCliente = entityObj.getValue("custentity_mx_rfc");
        var banco = entityObj.getText("custentity_ptg_banco_");
        var cuenta = entityObj.getValue("custentity_ptg_num_cuenta_");
        var resultBanco = banco.substr(-4);
        var referencia = resultBanco +" / "+ cuenta;
        

        if(probabilidad == "100" && !registroCreadoMov && numeroViaje){


          for (var j = 0; j < itemCount; j++) {

            articuloArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "item",
              line: j,
            });
            log.audit("Articulo: "+j, articuloArray[j]);

            capacidadArray[j] = parseFloat(customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_capacidad_articulo",
              line: j,
            }));
            log.debug("Capacidad: "+j, capacidadArray[j]);
  
            cantidadArray[j] = parseFloat(customRec.getSublistValue({
              sublistId: "item",
              fieldId: "quantity",
              line: j,
            }));
            log.debug("Cantidad: "+j, cantidadArray[j]);

            litrosTotalesArray[j] = cantidadArray[j] * capacidadArray[j];
            log.debug("litros Totales: "+j, litrosTotalesArray[j]);
  
            tasaArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "rate",
              line: j,
            });
            log.audit("Tasa: "+j, tasaArray[j]);

            importeArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "amount",
              line: j,
            });
            log.audit("Importe: "+j, importeArray[j]);

            impuestoArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "tax1amt",
              line: j,
            });
            log.audit("Impuesto: "+j, impuestoArray[j]);

            importeBrutoArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "grossamt",
              line: j,
            });
            log.audit("Importe Bruto: "+j, importeBrutoArray[j]);

            cantidadSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_cantidad_sgc",
              line: j,
            });
            log.audit("Cantidad SGC: "+j, cantidadSGCArray[j]);
  
            precioUnSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_preciounitario_sgc_",
              line: j,
            });
            log.audit("Precio Unitario SGC: "+j, precioUnSGCArray[j]);
  
            subtotalSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_subtotal_sgc_",
              line: j,
            });
            log.audit("Subtotal SGC: "+j, subtotalSGCArray[j]);
  
            impuestoSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_importe_impustos_sgc_",
              line: j,
            });
            log.audit("Impuesto SGC: "+j, impuestoSGCArray[j]);
  
            impBrutoSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_importebruto_sgc_",
              line: j,
            });
            log.audit("Importe Bruto SGC: "+j, impBrutoSGCArray[j]);
  
            totalSGCArray[j] = customRec.getSublistValue({
              sublistId: "item",
              fieldId: "custcol_ptg_total_sgc",
              line: j,
            });
            log.audit("Total SGC: "+j, totalSGCArray[j]);

            if(tasaArray[j] > 0){
              var lookupItem = search.lookupFields({
                type: "item",
                id: articuloArray[j],
                columns: ["custitem_ptg_tipodearticulo_"],
              });
              var lookupItemObject = lookupItem.custitem_ptg_tipodearticulo_[0];
              var lookupItemType = lookupItemObject.value;
              log.audit("Tipo articulo", lookupItemType);
            }


            


            if(lookupItemType == articuloEstacionario){
              servicioEstacionario = true;

              if(articuloArray[j] != idArticuloDescuento){

              var recVentaEstacionario = record.create({
                type: "customrecord_ptg_ventas_estacionario",
                isDynamic: true,
              });
              cantidadTotalstacionario += cantidadArray[j];

              recVentaEstacionario.setValue("custrecord_ptg_nota_estacionarios_", nombre);
              recVentaEstacionario.setValue("custrecord_ptg_foliosgc_", folioSGC);  
              recVentaEstacionario.setValue("custrecord_ptg_tipodepago_estacionarios_", tipoPagoNew);
              recVentaEstacionario.setValue("custrecord_ptg_cliente_est_vts", cliente);
              recVentaEstacionario.setValue("custrecord_ptg_nombre_cli_est_vts", clienteTxt);
              recVentaEstacionario.setValue("custrecord_ptg_direccion_cli_est_", direccion);
              recVentaEstacionario.setValue("custrecord_ptg_litros_est_vts_", cantidadArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_precio_est_vts_", tasaArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_importe_est_vts_", importeArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_referencia_est_vts_", referencia);
              recVentaEstacionario.setValue("custrecord_ptg_impuesto_est_vts_", impuestoArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_total_est_vts_", importeBrutoArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_litros_teor_est_vts_", cantidadSGCArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_precio_teor_est_vts_", precioUnSGCArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_importe_teor_est_vts_", impBrutoSGCArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_total_teor_est_vts_", totalSGCArray[j]);
              recVentaEstacionario.setValue("custrecord_ptg_num_viaje_est_vts_", numeroViaje);
              recVentaEstacionario.setValue("custrecord_ptg_registro_oportunidad", true);
              recVentaEstacionario.setValue("custrecord_ptg_rfc_cliente_est_vts", rfcCliente);
              recVentaEstacionario.setValue("custrecord_ptg_oportunidad_estacionario", recId);

              var recIdSavedEstacionarios = recVentaEstacionario.save();

            var rec1 = record.load({
              type: customRec.type,
              id: customRec.id,
              isDynamic: true
            });
            rec1.setValue('custbody_drt_ptg_registro_creado_mov', true);
            rec1.setValue("custbody_ptg_servicioestacionario_", true);

            rec1.selectLine('item', j);
            rec1.setCurrentSublistValue('item', 'custcol_ptg_registro_estacionario', recIdSavedEstacionarios);
            rec1.commitLine('item');

            rec1.save();

            log.debug({
              title: "Record created successfully",
              details: "Id Saved: " + recIdSavedEstacionarios,
            });

          }


            } 
            else {

              if(articuloArray[j] != idArticuloDescuento){
                var rec = record.create({
                  type: "customrecord_ptg_regitrodemovs_",
                  isDynamic: true,
                });
                rec.setValue("name", nombre);
                rec.setValue("custrecord_ptg_codigomov_", codigoMovimiento);
                rec.setValue("custrecord_ptg_movmas_", 0);
                rec.setValue("custrecord_ptg_movmenos_", 0);
                rec.setValue("custrecord_ptg_cilindro", articuloArray[j]);
    
                if (lookupItemType == articuloCilindro) {
                  rec.setValue("custrecord_ptg_ventagas_", cantidadArray[j]);
                  rec.setValue("custrecord_ptg_envasesvendidos_", 0);
                }
                if (lookupItemType == articuloEnvase) {
                  rec.setValue("custrecord_ptg_ventagas_", 0);
                  rec.setValue("custrecord_ptg_envasesvendidos_", cantidadArray[j]);
                }
                if (!lookupItemType) {
                  rec.setValue("custrecord_ptg_ventagas_", 0);
                  rec.setValue("custrecord_ptg_envasesvendidos_", 0);
                }
    
                rec.setValue("custrecord_ptg_lts_", litrosTotalesArray[j]);
                rec.setValue("custrecord_ptg_tasa", tasaArray[j]);
                rec.setValue("custrecord_ptg_num_viaje_oportunidad", numeroViaje);
                rec.setValue("custrecord_ptg_origen", true);
                rec.setValue("custrecord_ptg_zonadeprecio_registromovs", zonaPrecio);
                rec.setValue("custrecord_drt_ptg_reg_oportunidad", recId);
                var recIdSaved = rec.save();
    
                var rec2 = record.load({
                  type: customRec.type,
                  id: customRec.id,
                  isDynamic: true
                });
                rec2.setValue('custbody_drt_ptg_registro_creado_mov', true);
                rec2.setValue("custbody_ptg_serviciocilindro_", true);
    
                rec2.selectLine('item', j);
                rec2.setCurrentSublistValue('item', 'custcol_drt_ptg_registro_mov_creado', recIdSaved);
                rec2.commitLine('item');
    
                rec2.save();
    
                log.debug({
                  title: "Record updated successfully",
                  details: "Id Saved: " + recIdSaved,
                });
              }

            
          }
          }
          

          var recPagos = record.create({
            type: "customrecord_ptg_pagos",
            isDynamic: true,
          });

          recPagos.setValue("custrecord_ptg_oportunidad_pagos", recId);
          recPagos.setValue("custrecord_ptg_num_viaje_pagos", numeroViaje);
          recPagos.setValue("custrecord_ptg_total_servicio", total);
          recPagos.setValue("custrecord_registro_desde_oportunidad_p", true);
          if(servicioEstacionario){
            recPagos.setValue("custrecord_ptg_total_litros_esta", cantidadTotalstacionario);
          }

          var recIdSavedEstacionariosPagos = recPagos.save();

          if(objCount > 1){
            opcionPago = tipoPagoVariosComp;
            log.audit("varias opciones de pago", opcionPago);
          } else {
            opcionPago = objValue3[0].tipo_pago;
            log.audit("Una opcion de pago", opcionPago);
          }
          
          log.debug({
            title: "Record created successfully pagos",
            details: "Id Saved: " + recIdSavedEstacionariosPagos,
          });

          for (var tipoPago = 0; tipoPago < objCount; tipoPago++) {
            var objPos = objValue3[tipoPago];
            var objTipoPago = objPos.tipo_pago;
            var objMonto = objPos.monto;
            var objFolio = objPos.folio;
            log.audit("objPos", objPos);
            log.audit("objTipoPago", objTipoPago);
            log.audit("objMonto", objMonto);
            idTipoPagoArray.push(objTipoPago);

            var recPagosOportunidad = record.create({
              type: "customrecord_ptg_pagos_oportunidad",
              isDynamic: true,
            });

            recPagosOportunidad.setValue("custrecord_ptg_oportunidad", recId);
            recPagosOportunidad.setValue("custrecord_ptg_num_viaje", numeroViaje);
            recPagosOportunidad.setValue("custrecord_ptg_tipo_pago", objTipoPago);
            recPagosOportunidad.setValue("custrecord_ptg_total", objMonto);
            recPagosOportunidad.setValue("custrecord_ptg_referenciapago_", objFolio);
            recPagosOportunidad.setValue("custrecord_ptg_registro_pagos", recIdSavedEstacionariosPagos);
            recPagosOportunidad.setValue("custrecord_registro_desde_oportunidad_po", true);

            var recIdSavedEstacionariosPagosOportunidad = recPagosOportunidad.save();

            log.debug({
              title: "Record created successfully pagos oportunidad",
              details: "Id Saved: " + recIdSavedEstacionariosPagosOportunidad,
            });
          }

          log.audit({
            title: "idTipoPagoArray",
            details: JSON.stringify(idTipoPagoArray)
          });

          var objUpdateEstacionarioPagos = {
            custbody_ptg_registro_pagos: recIdSavedEstacionariosPagos,
            custbody_ptg_opcion_pago: opcionPago,
            custbody_ptg_tipos_de_pago: idTipoPagoArray,
          };

          record.submitFields({
            id: customRec.id,
            type: customRec.type,
            values: objUpdateEstacionarioPagos,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });


        }/* else {
          log.audit("edita");
          var fechaObj = customRec.getValue("custbodyptg_inicio_servicio");
          log.audit("fechaObj", fechaObj);

          if(fechaObj){

          var yyyy = fechaObj.substring(0, 4);
          var mm = fechaObj.substring(5, 7);
          var dd = fechaObj.substring(8, 10)
          var time = formatAMPM(fechaObj);
          var val = (dd[1] ? dd : dd[0]) + '/' + (mm[1] ? mm : mm[0]) + '/' + yyyy + " " + time;
       
          var newFecha = val.toString();
          log.audit("newFecha",newFecha);
       
           var objUpdate = {
            custbody_ptg_fecha_hora_servicio_carb: newFecha
          };
          log.audit("objUpdate",objUpdate);

          record.submitFields({
            id: customRec.id,
            type: customRec.type,
            values: objUpdate,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });

        }

        }*/

        else if (estacionCarburacion && !numeroViaje && !tipoPagoNew && !registroPagos){
          log.audit("Edición carburacion")
          var recPagos = record.create({
            type: "customrecord_ptg_pagos",
            isDynamic: true,
          });
  
          recPagos.setValue("custrecord_ptg_oportunidad_pagos", recId);
          recPagos.setValue("custrecord_ptg_num_viaje_pagos", numeroViaje);
          recPagos.setValue("custrecord_ptg_total_servicio", total);
          recPagos.setValue("custrecord_registro_desde_oportunidad_p", true);
          recPagos.setValue("custrecord_ptg_estacion_carburacion", estacionCarburacion);
  
          var recIdSavedEstacionariosPagos = recPagos.save();
  
          log.debug({
            title: "Record created successfully pagos",
            details: "Id Saved: " + recIdSavedEstacionariosPagos,
          });
          if(objCount > 1){
            opcionPago = tipoPagoVariosComp;
            log.audit("varias opciones de pago", opcionPago);
          } else {
            opcionPago = objValue3[0].tipo_pago;
            log.audit("Una opcion de pago", opcionPago);
          }
  
          for (var tipoPago = 0; tipoPago < objCount; tipoPago++) {
            var objPos = objValue3[tipoPago];
            var objTipoPago = objPos.tipo_pago;
            var objMonto = parseFloat(objPos.monto);
            var objFolio = objPos.folio;
            log.audit("objPos", objPos);
            log.audit("objTipoPago", objTipoPago);
            log.audit("objMonto", objMonto);
  
            var recPagosOportunidad = record.create({
              type: "customrecord_ptg_pagos_oportunidad",
              isDynamic: true,
            });
  
            recPagosOportunidad.setValue("custrecord_ptg_oportunidad", recId);
            recPagosOportunidad.setValue("custrecord_ptg_num_viaje", numeroViaje);
            recPagosOportunidad.setValue("custrecord_ptg_tipo_pago", objTipoPago);
            recPagosOportunidad.setValue("custrecord_ptg_total", objMonto);
            recPagosOportunidad.setValue("custrecord_ptg_referenciapago_", objFolio);
            recPagosOportunidad.setValue("custrecord_ptg_registro_pagos", recIdSavedEstacionariosPagos);
            recPagosOportunidad.setValue("custrecord_registro_desde_oportunidad_po", true);
            recPagosOportunidad.setValue("custrecord_ptg_estacion_carburacion_", estacionCarburacion);
  
            var recIdSavedEstacionariosPagosOportunidad = recPagosOportunidad.save();
  
            log.debug({
              title: "Record created successfully pagos oportunidad",
              details: "Id Saved: " + recIdSavedEstacionariosPagosOportunidad,
            });
          }
  
          var equipoObj = {};
   
  
  
        equipoObj.custbody_ptg_registro_pagos = recIdSavedEstacionariosPagos;
        equipoObj.custbody_ptg_opcion_pago = opcionPago;
  
          var actualizar = record.submitFields({
            id: customRec.id,
            type: customRec.type,
            values: equipoObj
          });
          log.debug("actualizar", actualizar);
        //}

       // else {
          log.audit("edita");
          var fechaObj = customRec.getValue("custbodyptg_inicio_servicio");
          log.audit("fechaObj", fechaObj);

          if(fechaObj){

          var yyyy = fechaObj.substring(0, 4);
          var mm = fechaObj.substring(5, 7);
          var dd = fechaObj.substring(8, 10)
          var time = formatAMPM(fechaObj);
          var val = (dd[1] ? dd : dd[0]) + '/' + (mm[1] ? mm : mm[0]) + '/' + yyyy + " " + time;
       
          var newFecha = val.toString();
          log.audit("newFecha",newFecha);
       
           var objUpdate = {
            custbody_ptg_fecha_hora_servicio_carb: newFecha
          };
          log.audit("objUpdate",objUpdate);

          record.submitFields({
            id: customRec.id,
            type: customRec.type,
            values: objUpdate,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });

        }

        }
      }
      
    } catch (e) {
      log.error({ title: e.name, details: e.message });
    }
  }

  function formatAMPM(date) {
    var hours = date.substring(11, 13);
    var minutes = date.substring(14, 16);
    var seconds = date.substring(17, 19);
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    return strTime;
 }

  return {
    beforeSubmit: beforeSubmit,
    afterSubmit: afterSubmit,
  };
});
