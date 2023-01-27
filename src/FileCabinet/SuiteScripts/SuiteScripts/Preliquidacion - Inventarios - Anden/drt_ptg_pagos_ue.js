/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Pagos UE
 * Script id: customscript_drt_pagos_ue
 * customer Deployment id: customdeploy_drt_pagos_ue
 * Applied to: PTG - Pagos
 * File: drt_ptg_pagos_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(["N/record", "N/search", "N/runtime", 'N/https', 'N/url', 'N/ui/serverWidget'], function (record, search, runtime, https, url, serverWidget) {
 
  function afterSubmit(context) {
      try {
          if (context.type == "edit") {
              var customRec = context.newRecord;
              var recId = customRec.id;
              var oportunidadID = customRec.getValue("custrecord_ptg_oportunidad_pagos");
              var numeroViaje = customRec.getValue("custrecord_ptg_num_viaje_pagos");
              var totalDelServicio = customRec.getValue("custrecord_ptg_oportunidad_pagos");
              var lineas = customRec.getLineCount({ sublistId: "recmachcustrecord_ptg_registro_pagos"});
              var lineasOld = context.oldRecord.getLineCount({ sublistId: "recmachcustrecord_ptg_registro_pagos"});
              var carburacion = customRec.getValue("custrecord_ptg_estacion_carburacion");
              var vehiculoConsumoInterno = customRec.getValue("custrecord_ptg_vehiculo_consumo_interno");
              var numeroViajeConsumoInterno = customRec.getValue("custrecord_ptg_num_viaje_consumo_interno");
              var kilometrajeConsumoInterno = customRec.getValue("custrecord_ptg_kilometra_consumo_interno");
              var objPagos = {};
              var arrayPagos = [];
              var objPagosOportunidad = {};
              var opcionPago = 0;
              var tipoPagoArraySublista = [];
              var tipoPagoArraySublistaOld = [];
              var montoArraySublistaOld = [];
              var montoArraySublista = [];
              var folioArraySublista = [];
              var precioLitro = 0;
              var nuevoLitro = 0;
              var nuevoImporte = 0;
              var nuevoImpuesto = 0;
              var detalleCarburacionDespa = 0;
              var prepagoTransferenciaId = 0;
              var prepagoBancomerId = 0;
              var prepagoHSBCId = 0;
              var prepagoBanamexId = 0;
              var prepagoSantanderId = 0;
              var prepagoScotianId = 0;
              var prepagoBanorteId = 0;
              var saldoAFavorId = 0;
              var consumoInternoId = 0;
              var recirculacionId = 0;
              var canceladoId = 0;
              var multipleId = 0;

              if (runtime.envType === runtime.EnvType.SANDBOX) {
                prepagoBanorteId = 2;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                recirculacionId = 21;
                canceladoId = 22;
              } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
                prepagoBanorteId = 2;
                multipleId = 7;
                prepagoTransferenciaId = 8;
                saldoAFavorId = 11;
                consumoInternoId = 12;
                prepagoBancomerId = 13;
                prepagoHSBCId = 14;
                prepagoBanamexId = 15;
                prepagoSantanderId = 16;
                prepagoScotianId = 17;
                recirculacionId = 21;
                canceladoId = 22;
              }

              log.audit("oportunidadID", oportunidadID);
              log.audit("numeroViaje", numeroViaje);
              log.audit("lineas", lineas);
              log.audit("lineasOld", lineasOld);
              log.audit("carburacion", carburacion);
              if(!carburacion){
                var numeroViajeObj = record.load({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  id: numeroViaje,
                });
                var estacionarios = numeroViajeObj.getValue("custrecord_ptg_servicioestacionario_");
                log.audit("estacionarios", estacionarios);
              }
              
              

              if(estacionarios){
                log.audit("***ESTACIONARIOS***");
                var objEstacionarios = {};
                if(lineas != lineasOld){
                  for (var i = lineasOld; i < lineas; i++){
                    tipoPagoArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_tipo_pago',
                      line: i
                    });

                    montoArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_total',
                      line: i
                    });

                    folioArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos',
                      fieldId: 'custrecord_ptg_referenciapago_',
                      line: i
                    });
                  }

                  //BÚSQUEDA GUARDADA: PTG - Ventas Estacionario SS
                  var registroEstacionarioObj = search.create({
                    type: "customrecord_ptg_ventas_estacionario",
                    filters: [
                      ["custrecord_ptg_oportunidad_estacionario","anyof",oportunidadID], 
                      "AND", 
                      ["custrecord_ptg_num_viaje_est_vts_","anyof",numeroViaje]
                    ],
                    columns: [
                      search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                      search.createColumn({name: "custrecord_ptg_preliqui_rel_vts_", label: "PTG - Preliquidacion relacionada vts"}),
                      search.createColumn({name: "custrecord_ptg_nota_estacionarios_", label: "PTG - Nota"}),
                      search.createColumn({name: "custrecord_ptg_tipodepago_estacionarios_", label: "PTG - Tipo de Pago est ventas"}),
                      search.createColumn({name: "custrecord_ptg_pago_vts_", label: "PTG - Pago"}),
                      search.createColumn({name: "custrecord_ptg_modificar_met_pago", label: "PTG - Modificar Método de Pago"}),
                      search.createColumn({name: "custrecord_ptg_cliente_est_vts", label: "PTG - Cliente est ventas"}),
                      search.createColumn({name: "custrecord_ptg_nombre_cli_est_vts", label: "PTG - Nombre cli est vts"}),
                      search.createColumn({name: "custrecord_ptg_direccion_cli_est_", label: "PTG - Direccion clie est"}),
                      search.createColumn({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"}),
                      search.createColumn({name: "custrecord_ptg_precio_est_vts_", label: "PTG - Precio est vts"}),
                      search.createColumn({name: "custrecord_ptg_importe_est_vts_", label: "PTG - Importe est vts"}),
                      search.createColumn({name: "custrecord_ptg_referencia_est_vts_", label: "PTG - Referencia est vts"}),
                      search.createColumn({name: "custrecord_ptg_impuesto_est_vts_", label: "PTG - Impuesto est vts"}),
                      search.createColumn({name: "custrecord_ptg_total_est_vts_", label: "PTG - Total est vts"}),
                      search.createColumn({name: "custrecord_ptg_num_viaje_est_vts_", label: "PTG - Num Viaje"}),
                      search.createColumn({name: "custrecord_ptg_litros_teor_est_vts_", label: "PTG - Litros Teorico est vts"}),
                      search.createColumn({name: "custrecord_ptg_precio_teor_est_vts_", label: "PTG - Precio Teorico est vts"}),
                      search.createColumn({name: "custrecord_ptg_importe_teor_est_vts_", label: "PTG - Importe Teorico est vts"}),
                      search.createColumn({name: "custrecord_ptg_total_teor_est_vts_", label: "PTG - Total Teorico est vts"}),
                      search.createColumn({name: "custrecord_ptg_registro_oportunidad", label: "PTG - Oportunidad est vts"}),
                      search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"}),
                      search.createColumn({name: "custrecord_ptg_consumointerno_", label: "PTG - Consumo Interno"}),
                      search.createColumn({name: "custrecord_ptg_idquipo_", label: "PTG - Id Equipo"}),
                      search.createColumn({name: "custrecord_ptg_kilometraje_", label: "PTG - Kilometraje"}),
                      search.createColumn({name: "custrecord_ptg_rfc_cliente_est_vts", label: "PTG - RFC Cliente"})
                    ]
                  });
                  var registroEstacionarioObjCount = registroEstacionarioObj.runPaged().count;
                  if(registroEstacionarioObjCount > 0){
                    var registroEstacionarioObjResult = registroEstacionarioObj.run().getRange({
                      start: 0,
                      end: 2,
                    });
                    log.audit("registroEstacionarioObjResult", registroEstacionarioObjResult);
                    (idInternoEst = registroEstacionarioObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                    (idPreliquEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_preliqui_rel_vts_", label: "PTG - Preliquidacion relacionada vts"})),
                    (notaEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_nota_estacionarios_", label: "PTG - Nota"})),
                    (tipoPagoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_tipodepago_estacionarios_", label: "PTG - Tipo de Pago est ventas"})),
                    (pagoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_pago_vts_", label: "PTG - Pago"})),
                    (urlEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_modificar_met_pago", label: "PTG - Modificar Método de Pago"})),
                    (clienteEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_cliente_est_vts", label: "PTG - Cliente est ventas"})),
                    (nombreClienteEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_nombre_cli_est_vts", label: "PTG - Nombre cli est vts"})),
                    (direccionEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_direccion_cli_est_", label: "PTG - Direccion clie est"})),
                    (litrosEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"})),
                    (precioEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_precio_est_vts_", label: "PTG - Precio est vts"})),
                    (importeEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_importe_est_vts_", label: "PTG - Importe est vts"})),
                    (referenciaEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_referencia_est_vts_", label: "PTG - Referencia est vts"})),
                    (impuestoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_impuesto_est_vts_", label: "PTG - Impuesto est vts"})),
                    (totalEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_total_est_vts_", label: "PTG - Total est vts"})),
                    (numeroViajeEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_num_viaje_est_vts_", label: "PTG - Num Viaje"})),
                    (litrosTeoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_litros_teor_est_vts_", label: "PTG - Litros Teorico est vts"})),
                    (precioTeoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_precio_teor_est_vts_", label: "PTG - Precio Teorico est vts"})),
                    (importeTeoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_importe_teor_est_vts_", label: "PTG - Importe Teorico est vts"})),
                    (totalTeoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_total_teor_est_vts_", label: "PTG - Total Teorico est vts"})),
                    (oportunidadCheckEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_registro_oportunidad", label: "PTG - Oportunidad est vts"})),
                    (idOportundiadEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - Oportunidad Estacionario"})),
                    (consumoInternoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_consumointerno_", label: "PTG - Consumo Interno"})),
                    (idEquipoEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_idquipo_", label: "PTG - Id Equipo"})),
                    (kilometrajeEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_kilometraje_", label: "PTG - Kilometraje"})),
                    (rfcClienteEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_rfc_cliente_est_vts", label: "PTG - RFC Cliente"}));
                    log.emergency("litrosEst", litrosEst);
                    log.emergency("pagoEst", pagoEst);
                    precioLitro = litrosEst / pagoEst;
                    log.emergency("precioLitro", precioLitro);

                    for (var j = lineasOld; j < lineas; j++){

                      nuevoLitro = precioLitro * montoArraySublista[j];
                      log.emergency("nuevoLitro", nuevoLitro);
                      nuevoImporte = nuevoLitro * precioEst;
                      log.emergency("nuevoImporte", nuevoImporte);
                      nuevoImpuesto = nuevoImporte * .16;
                      log.emergency("nuevoImpuesto", nuevoImpuesto);

                      var recTipoPagoEsta = record.create({
                        type: "customrecord_ptg_ventas_estacionario",
                        isDynamic: true,
                      });
                      recTipoPagoEsta.setValue("custrecord_ptg_preliqui_rel_vts_", idPreliquEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_nota_estacionarios_", notaEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_tipodepago_estacionarios_", tipoPagoArraySublista[j]);
                      recTipoPagoEsta.setValue("custrecord_ptg_pago_vts_", pagoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_modificar_met_pago", urlEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_cliente_est_vts", clienteEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_nombre_cli_est_vts", nombreClienteEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_direccion_cli_est_", direccionEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_litros_est_vts_", nuevoLitro);
                      recTipoPagoEsta.setValue("custrecord_ptg_precio_est_vts_", precioEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_importe_est_vts_", nuevoImporte);
                      recTipoPagoEsta.setValue("custrecord_ptg_referencia_est_vts_", folioArraySublista[j]);
                      recTipoPagoEsta.setValue("custrecord_ptg_impuesto_est_vts_", nuevoImpuesto);
                      recTipoPagoEsta.setValue("custrecord_ptg_total_est_vts_", montoArraySublista[j]);
                      recTipoPagoEsta.setValue("custrecord_ptg_num_viaje_est_vts_", numeroViajeEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_litros_teor_est_vts_", litrosTeoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_precio_teor_est_vts_", precioTeoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_importe_teor_est_vts_", importeTeoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_total_teor_est_vts_", totalTeoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_registro_oportunidad", oportunidadCheckEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_oportunidad_estacionario", idOportundiadEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_consumointerno_", consumoInternoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_idquipo_", idEquipoEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_kilometraje_", kilometrajeEst);
                      recTipoPagoEsta.setValue("custrecord_ptg_rfc_cliente_est_vts", rfcClienteEst);
                      if(tipoPagoArraySublista[j] == prepagoBanorteId || tipoPagoArraySublista[j] == prepagoTransferenciaId || tipoPagoArraySublista[j] == prepagoBancomerId || tipoPagoArraySublista[j] == prepagoHSBCId || tipoPagoArraySublista[j] == prepagoBanamexId || tipoPagoArraySublista[j] == prepagoSantanderId || tipoPagoArraySublista[j] == prepagoScotianId){
                        recTipoPagoEsta.setValue("custrecord_ptg_prepago_aplicado_est_vts_", true);
                      }
                      var recTipoPagoEstaIdSaved = recTipoPagoEsta.save();
                      log.debug({
                        title: "DETALLE DE TIPO DE PAGO ESTACIONARIO",
                        details: "Id Saved: " + recTipoPagoEstaIdSaved,
                      });

                    }

                    for (var l = 0; l < lineasOld; l++){

                      objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_tipo_pago',
                        line: l
                      });
  
                      objEstacionarios.custrecord_ptg_total_est_vts_ = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_total',
                        line: l
                      });
  
                      objEstacionarios.custrecord_ptg_referencia_est_vts_ = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos',
                        fieldId: 'custrecord_ptg_referenciapago_',
                        line: l
                      });

                      nuevoLitro = precioLitro * objEstacionarios.custrecord_ptg_total_est_vts_;
                      log.emergency("nuevoLitro old", nuevoLitro);
                      nuevoImporte = nuevoLitro * precioEst;
                      log.emergency("nuevoImporte old", nuevoImporte);
                      nuevoImpuesto = nuevoImporte * .16;
                      log.emergency("nuevoImpuesto old", nuevoImpuesto);

                      objEstacionarios.custrecord_ptg_litros_est_vts_ = nuevoLitro.toFixed(2);
                      objEstacionarios.custrecord_ptg_importe_est_vts_ = nuevoImporte.toFixed(2);
                      objEstacionarios.custrecord_ptg_impuesto_est_vts_ = nuevoImpuesto.toFixed(2);


                      if(objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoBanorteId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoTransferenciaId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoBancomerId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoHSBCId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoBanamexId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoSantanderId || objEstacionarios.custrecord_ptg_tipodepago_estacionarios_ == prepagoScotianId){
                        objEstacionarios.custrecord_ptg_prepago_aplicado_est_vts_ = true;
                      }


                    }
  
                    var registroUpd = record.submitFields({
                      type: "customrecord_ptg_ventas_estacionario",
                      id: idInternoEst,
                      values: objEstacionarios,
                    });
                    log.audit("Registro actualizado", registroUpd);

                  }  
                  
                } else if (lineas == 1){
                  var tipoPagoLinea = 0;
                  var prepagoSinAplicar = false;
                  for (var j = 0; j < lineas; j++){
                    tipoPagoLinea = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_tipo_pago',
                      line: j
                    });

                    if(tipoPagoLinea == prepagoBanorteId || tipoPagoLinea == prepagoTransferenciaId || tipoPagoLinea == prepagoBancomerId || tipoPagoLinea == prepagoHSBCId || tipoPagoLinea == prepagoBanamexId || tipoPagoLinea == prepagoSantanderId || tipoPagoLinea == prepagoScotianId){
                      prepagoSinAplicar = true;
                    }


                  }

                  
                    var detalleVentasEstacionariosObj = search.create({
                      type: "customrecord_ptg_ventas_estacionario",
                      filters: [
                         ["custrecord_ptg_oportunidad_estacionario","anyof",oportunidadID], "AND", 
                         ["custrecord_ptg_num_viaje_est_vts_","anyof",numeroViaje]
                      ],
                      columns: [
                         search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                         search.createColumn({name: "custrecord_ptg_preliqui_rel_vts_", label: "PTG - Preliquidacion relacionada vts"}),
                         search.createColumn({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"})
                      ]
                    });

                    var detalleVentasEstacionariosObjResult = detalleVentasEstacionariosObj.run().getRange({
                      start: 0,
                      end: 2,
                    });
                    (idRegistroDetalleVenta = detalleVentasEstacionariosObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                    (idPreliquidacion = detalleVentasEstacionariosObjResult[0].getValue({name: "custrecord_ptg_preliqui_rel_vts_", label: "PTG - Preliquidacion relacionada vts"})),
                    (litrosDetalleVenta = detalleVentasEstacionariosObjResult[0].getValue({name: "custrecord_ptg_litros_est_vts_", label: "PTG - Litros est vts"}));
                   
                    if(tipoPagoLinea == consumoInternoId){

                    var recDetalleConI = record.create({
                      type: "customrecord_ptg_consumo_interno_registr",
                      isDynamic: true,
                    });
                    recDetalleConI.setValue("custrecord_ptg_preliquidacion_coni", idPreliquidacion);
                    recDetalleConI.setValue("custrecord_ptg_oportunidad_coni", oportunidadID);
                    recDetalleConI.setValue("custrecord_ptg_tipo_pago_coni", consumoInternoId);
                    recDetalleConI.setValue("custrecord_ptg_litros_coni", litrosDetalleVenta);
                    var recDetalleConIIdSaved = recDetalleConI.save();
                    log.debug({
                      title: "DETALLE CONSUMO INTERNO",
                      details: "Id Saved: " + recDetalleConIIdSaved,
                    });

                    var idRegistroDetalleVentas = record.delete({
                      type: "customrecord_ptg_ventas_estacionario",
                      id: idRegistroDetalleVenta,
                    });
                    log.audit("idRegistroDetalleVentas", idRegistroDetalleVentas);
                  } else {
                    var objEstacionario = {
                      custrecord_ptg_tipodepago_estacionarios_: tipoPagoLinea,
                      custrecord_ptg_prepago_aplicado_est_vts_: prepagoSinAplicar,
                    }
                    var registroUpdate = record.submitFields({
                      type: "customrecord_ptg_ventas_estacionario",
                      id: idRegistroDetalleVenta,
                      values: objEstacionario,
                    });
                    log.audit("Registro actualizado", registroUpdate);
                  }
                }
                


              } else if(carburacion){
                log.audit("***CARBURACION***");
                var objCarburacion = {};
                  if(lineas != lineasOld){
                    for (var h = 0; h < lineasOld; h++){
                      tipoPagoArraySublistaOld[h] = context.oldRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_tipo_pago',
                        line: h
                      });

                      montoArraySublistaOld[h] = context.oldRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_total',
                        line: h
                      });

                    }
                    for (var i = lineasOld; i < lineas; i++){
                      tipoPagoArraySublista[i] = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_tipo_pago',
                        line: i
                      });
  
                      montoArraySublista[i] = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_total',
                        line: i
                      });
  
                      folioArraySublista[i] = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos',
                        fieldId: 'custrecord_ptg_referenciapago_',
                        line: i
                      });
                    }
  
                    //BÚSQUEDA GUARDADA: PTG - Detalle despachador SS
                    var registroEstacionarioObj = search.create({
                      type: "customrecord_ptg_detalle_despachador_",
                      filters: [
                        ["custrecord_ptg_oportunidad_carburacion","anyof",oportunidadID]
                      ],
                      columns: [
                        search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                       search.createColumn({name: "custrecord_ptg_numdespachador", label: "PTG- #Despachador"}),
                       search.createColumn({name: "custrecord_ptg_facturadespachador_", label: "PTG - Factura despachador"}),
                       search.createColumn({name: "custrecord_ptg_notadespachador_", label: "PTG - Nota despachador"}),
                       search.createColumn({name: "custrecord_ptg_tipopagoespachador_", label: "PTG - Tipo de pago despachador"}),
                       search.createColumn({name: "custrecord_ptg_ref_pago_", label: "PTG - Ref Pago"}),
                       search.createColumn({name: "custrecord_ptg_clientedespachador_", label: "PTG - Cliente Despachador"}),
                       search.createColumn({name: "custrecord_ptg_dir_embarque_despachador_", label: "PTG - Dirección embarque despachador"}),
                       search.createColumn({name: "custrecord_ptg_num_cli_desp_", label: "PTG - Nombre cliente despachador"}),
                       search.createColumn({name: "custrecord_ptg_lts_vendidos_despachador_", label: "PTG - Litros vendidos despachador"}),
                       search.createColumn({name: "custrecord_ptg_preciounidespachador_", label: "PTG - Precio Unitario despachador"}),
                       search.createColumn({name: "custrecord_ptg_importe_despachador_", label: "PTG - Importe despachador"}),
                       search.createColumn({name: "custrecord_ptg_impuestodespachador_", label: "PTG - Impuesto despachador"}),
                       search.createColumn({name: "custrecord_ptg_total_despachador_", label: "PTG - Total despachador"}),
                       search.createColumn({name: "custrecord_ptg_detallecrburacion_", label: "PTG - Detallecarburacion"}),
                       search.createColumn({name: "custrecord_ptg_oportunidad_carburacion", label: "PTG - Oportunidad"}),
                       search.createColumn({name: "custrecord_ptg_modificar_met_pago_gas", label: "PTG - Modificar Método de Pago"})
                      ]
                    });
                    var registroEstacionarioObjCount = registroEstacionarioObj.runPaged().count;
                    if(registroEstacionarioObjCount > 0){
                      var registroEstacionarioObjResult = registroEstacionarioObj.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      log.audit("registroEstacionarioObj", registroEstacionarioObj);
                      log.audit("registroEstacionarioObjCount", registroEstacionarioObjCount);
                      log.audit("registroEstacionarioObjResult", registroEstacionarioObjResult);
                      (idInternoDespa = registroEstacionarioObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})),
                      log.audit("idInternoDespa", idInternoDespa);
                      (numDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_numdespachador", label: "PTG- #Despachador"})),
                      log.audit("numDespa", numDespa);
                      (facturaDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_facturadespachador_", label: "PTG - Factura despachador"})),
                      log.audit("facturaDespa", facturaDespa);
                      (notaDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_notadespachador_", label: "PTG - Nota despachador"})),
                      log.audit("notaDespa", notaDespa);
                      (tipoPagoDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_tipopagoespachador_", label: "PTG - Tipo de pago despachador"})),
                      log.audit("tipoPagoDespa", tipoPagoDespa);
                      (refPagoDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_ref_pago_", label: "PTG - Ref Pago"})),
                      log.audit("refPagoDespa", refPagoDespa);
                      (clienteDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_clientedespachador_", label: "PTG - Cliente Despachador"})),
                      (nombreClienteEst = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_num_cli_desp_", label: "PTG - Nombre cliente despachador"})),
                      (direccionDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_dir_embarque_despachador_", label: "PTG - Dirección embarque despachador"})),
                      (litrosDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_lts_vendidos_despachador_", label: "PTG - Litros vendidos despachador"})),
                      (precioDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_preciounidespachador_", label: "PTG - Precio Unitario despachador"})),
                      (importeDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_importe_despachador_", label: "PTG - Importe despachador"})),
                      (impuestoDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_impuestodespachador_", label: "PTG - Impuesto despachador"})),
                      (totalDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_total_despachador_", label: "PTG - Total despachador"})),
                      (detalleCarburacionDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_detallecrburacion_", label: "PTG - Detallecarburacion"})),
                      (oportunidadDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_oportunidad_carburacion", label: "PTG - Oportunidad"})),
                      (modificarPagoDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_modificar_met_pago_gas", label: "PTG - Modificar Método de Pago"}));
                      log.emergency("litrosDespa", litrosDespa);
                      log.emergency("totalDespa", totalDespa);
                      precioLitro = litrosDespa / totalDespa;
                      log.emergency("precioLitro", precioLitro);
  
                      for (var j = lineasOld; j < lineas; j++){

                        nuevoLitro = precioLitro * montoArraySublista[j];
                        log.emergency("nuevoLitro", nuevoLitro);
                        nuevoImporte = nuevoLitro * precioDespa;
                        log.emergency("nuevoImporte", nuevoImporte);
                        nuevoImpuesto = nuevoImporte * .16;
                        log.emergency("nuevoImpuesto", nuevoImpuesto);


                        var recTipoPagoEsta = record.create({
                          type: "customrecord_ptg_detalle_despachador_",
                          isDynamic: true,
                        });
                        recTipoPagoEsta.setValue("custrecord_ptg_detallecrburacion_", detalleCarburacionDespa);//Este es el ID del CR de preliquidacion gas
                        recTipoPagoEsta.setValue("custrecord_ptg_numdespachador", numDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_facturadespachador_", facturaDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_notadespachador_", notaDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_tipopagoespachador_", tipoPagoArraySublista[j]);
                        recTipoPagoEsta.setValue("custrecord_ptg_ref_pago_", folioArraySublista[j]);
                        recTipoPagoEsta.setValue("custrecord_ptg_clientedespachador_", clienteDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_num_cli_desp_", nombreClienteEst);
                        recTipoPagoEsta.setValue("custrecord_ptg_dir_embarque_despachador_", direccionDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_lts_vendidos_despachador_", nuevoLitro.toFixed(2));
                        recTipoPagoEsta.setValue("custrecord_ptg_preciounidespachador_", precioDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_importe_despachador_", nuevoImporte.toFixed(2));
                        recTipoPagoEsta.setValue("custrecord_ptg_impuestodespachador_", nuevoImpuesto.toFixed(2));
                        recTipoPagoEsta.setValue("custrecord_ptg_total_despachador_", montoArraySublista[j]);
                        recTipoPagoEsta.setValue("custrecord_ptg_oportunidad_carburacion", oportunidadDespa);
                        recTipoPagoEsta.setValue("custrecord_ptg_modificar_met_pago_gas", modificarPagoDespa);
                        if(tipoPagoArraySublista[j] == prepagoBanorteId || tipoPagoArraySublista[j] == prepagoTransferenciaId || tipoPagoArraySublista[j] == prepagoBancomerId || tipoPagoArraySublista[j] == prepagoHSBCId || tipoPagoArraySublista[j] == prepagoBanamexId || tipoPagoArraySublista[j] == prepagoSantanderId || tipoPagoArraySublista[j] == prepagoScotianId){
                          recTipoPagoEsta.setValue("custrecord_ptg_prepago_sin_aplicar_despa", true);
                        }
                        var recTipoPagoEstaIdSaved = recTipoPagoEsta.save();
                        log.debug({
                          title: "DETALLE DE TIPO DE PAGO GAS CARBURACION",
                          details: "Id Saved: " + recTipoPagoEstaIdSaved,
                        });

                        //PTG - Detalle tipo de pago - Pago OLD
                      var pagoOldObjMas = search.create({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        filters: [
                           ["custrecord_ptg_detalle_pago_carb_","anyof",detalleCarburacionDespa], "AND", 
                           ["custrecord_ptg_descripcion_","anyof",tipoPagoArraySublista[j]]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                           search.createColumn({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"})
                        ]
                      });
                      var pagoOldObjResultMas = pagoOldObjMas.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      (idEstacionTipoPagoMas = pagoOldObjResultMas[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                      (totalEstacionTipoPagoMas = pagoOldObjResultMas[0].getValue({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"}));
                      var totalEstacionTipoPagoPFMas = parseFloat(totalEstacionTipoPagoMas);
                      var totalNuevoEstacionMas = totalEstacionTipoPagoPFMas + montoArraySublista[j];
                      var nuevoValorMas = {
                        custrecord_ptg_total_est_carb_: totalNuevoEstacionMas,
                      };
                      log.audit("nuevoValorMas", nuevoValorMas);
                      var registroActualizadoMas = record.submitFields({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        id: idEstacionTipoPagoMas,
                        values: nuevoValorMas
                      });
                      log.audit("registroActualizadoMas nuevo pago mas", registroActualizadoMas);
  
                      }

                      for (var l = 0; l < lineasOld; l++){

                        objCarburacion.custrecord_ptg_tipopagoespachador_ = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                          fieldId: 'custrecord_ptg_tipo_pago',
                          line: l
                        });
    
                        objCarburacion.custrecord_ptg_total_despachador_ = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                          fieldId: 'custrecord_ptg_total',
                          line: l
                        });
    
                        objCarburacion.custrecord_ptg_ref_pago_ = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos',
                          fieldId: 'custrecord_ptg_referenciapago_',
                          line: l
                        });
  
                        nuevoLitro = precioLitro * objCarburacion.custrecord_ptg_total_despachador_;
                        log.emergency("nuevoLitro old", nuevoLitro);
                        nuevoImporte = nuevoLitro * precioDespa;
                        log.emergency("nuevoImporte old", nuevoImporte);
                        nuevoImpuesto = nuevoImporte * .16;
                        log.emergency("nuevoImpuesto old", nuevoImpuesto);
  
                        objCarburacion.custrecord_ptg_lts_vendidos_despachador_ = nuevoLitro.toFixed(2);
                        objCarburacion.custrecord_ptg_importe_despachador_ = nuevoImporte.toFixed(2);
                        objCarburacion.custrecord_ptg_impuestodespachador_ = nuevoImpuesto.toFixed(2);

                        if(objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoBanorteId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoTransferenciaId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoBancomerId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoHSBCId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoBanamexId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoSantanderId || objCarburacion.custrecord_ptg_tipopagoespachador_ == prepagoScotianId){
                          objCarburacion.custrecord_ptg_prepago_sin_aplicar_despa = true;
                        }

                        var diferencia = montoArraySublistaOld[l] - objCarburacion.custrecord_ptg_total_despachador_;
                        log.audit("diferencia", diferencia);

                        //PTG - Detalle tipo de pago - Pago OLD
                        var pagoOldObj = search.create({
                          type: "customrecord_ptg_det_tipo_pago_est_car_",
                          filters: [
                             ["custrecord_ptg_detalle_pago_carb_","anyof",detalleCarburacionDespa], "AND", 
                             ["custrecord_ptg_descripcion_","anyof",tipoPagoArraySublistaOld[l]]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"})
                          ]
                        });
                        var pagoOldObjResult = pagoOldObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idEstacionTipoPago = pagoOldObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (totalEstacionTipoPago = pagoOldObjResult[0].getValue({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"}));
                        var totalEstacionTipoPagoPF = parseFloat(totalEstacionTipoPago);
                        //var totalNuevoEstacion = totalEstacionTipoPagoPF - objCarburacion.custrecord_ptg_total_despachador_;
                        var totalNuevoEstacion = totalEstacionTipoPagoPF - diferencia.toFixed(2);
                        var nuevoValor = {
                          custrecord_ptg_total_est_carb_: totalNuevoEstacion.toFixed(2),
                        };
                        log.audit("nuevoValor", nuevoValor);
                        var registroActualizado = record.submitFields({
                          type: "customrecord_ptg_det_tipo_pago_est_car_",
                          id: idEstacionTipoPago,
                          values: nuevoValor
                        });
                        log.audit("registroActualizado nuevo pago menos", registroActualizado);                     
  
                      }
    
                      var registroUpd = record.submitFields({
                        type: "customrecord_ptg_detalle_despachador_",
                        id: idInternoDespa,
                        values: objCarburacion,
                      });
                      log.audit("Registro actualizado gas carburacion", registroUpd);


                    }  else {
                      //Búsqueda Guardada: PTG - Detalle Envases est carb - Modificar Pago
                      var envasePagoObj = search.create({
                        type: "customrecord_ptg_detalleenv_est_carb_",
                        filters: [
                           ["custrecord_ptg_id_oportunidad_envases","anyof",oportunidadID]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                           search.createColumn({name: "custrecord_ptg_nota_env_est_carb_", label: "PTG - Nota env est carb"}),
                           search.createColumn({name: "custrecord_ptg_cliente_env_est_carb_", label: "PTG - Cliente env est carb"}),
                           search.createColumn({name: "custrecord_ptg_direc_env_est_carb_", label: "PTG - Dirección Envases env est carb"}),
                           search.createColumn({name: "custrecord_ptg_nombre_env_est_carb_", label: "PTG - Nombre env est carb"}),
                           search.createColumn({name: "custrecord_ptg_tipocil_env_est_carb_", label: "PTG - Tipo cil env est carb"}),
                           search.createColumn({name: "custrecord_ptg_cantidad_env_est_carb_", label: "PTG - Cantidad env est carb"}),
                           search.createColumn({name: "custrecord_ptg_precio_env_est_carb_", label: "PTG - Precio env est carb"}),
                           search.createColumn({name: "custrecord_ptg_importe_env_est_carb_", label: "PTG - Importe env est carb"}),
                           search.createColumn({name: "custrecord_ptg_imp_env_est_carb_", label: "PTG - Impuestos env est carb"}),
                           search.createColumn({name: "custrecord_ptg_total_env_est_carb_", label: "PTG - Total env est carb"}),
                           search.createColumn({name: "custrecord_ptg_envdetallecarb_", label: "PTG - Envase detalle"}),
                           search.createColumn({name: "custrecord_ptg_id_oportunidad_envases", label: "PTG - Id Oportunidad"}),
                           search.createColumn({name: "custrecord_ptg_modificar_met_pago_env", label: "PTG - Modificar Método de Pago"}),
                           search.createColumn({name: "custrecord_ptg_saldo_venci_env_est_carb_", label: "PTG - SALDO VENCIDO"}),
                           search.createColumn({name: "custrecord_ptg_limite_cred_env_est_carb_", label: "PTG - Límite de Crédito"}),
                           search.createColumn({name: "custrecord_ptg_saldo_env_est_carb_", label: "PTG - Saldo"}),
                           search.createColumn({name: "custrecord_ptg_excede_limi_env_est_carb_", label: "PTG - Excede Límite de Crédito"})
                        ]
                      });
                      var envasePagoObjCount = envasePagoObj.runPaged().count;
                      if(envasePagoObjCount > 0){
                        var envasePagoObjResult = envasePagoObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idInternoEnvase = envasePagoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (notaEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_nota_env_est_carb_", label: "PTG - Nota env est carb"})),
                        (clienteEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_cliente_env_est_carb_", label: "PTG - Cliente env est carb"})),
                        (direccionEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_direc_env_est_carb_", label: "PTG - Dirección Envases env est carb"})),
                        (clienteTXTEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_nombre_env_est_carb_", label: "PTG - Nombre env est carb"})),
                        (tipoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_tipocil_env_est_carb_", label: "PTG - Tipo cil env est carb"})),
                        (cantidadEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_cantidad_env_est_carb_", label: "PTG - Cantidad env est carb"})),
                        (precioEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_precio_env_est_carb_", label: "PTG - Precio env est carb"})),
                        (importeEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_importe_env_est_carb_", label: "PTG - Importe env est carb"})),
                        (impuestoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_imp_env_est_carb_", label: "PTG - Impuestos env est carb"})),
                        (totalEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_total_env_est_carb_", label: "PTG - Total env est carb"})),
                        (idPreliquidacionEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_envdetallecarb_", label: "PTG - Envase detalle"})),
                        (idOportunidadEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_id_oportunidad_envases", label: "PTG - Id Oportunidad"})),
                        (modificarPagoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_modificar_met_pago_env", label: "PTG - Modificar Método de Pago"})),
                        (saldoVencidoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_saldo_venci_env_est_carb_", label: "PTG - SALDO VENCIDO"})),
                        (limiteCreditoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_limite_cred_env_est_carb_", label: "PTG - Límite de Crédito"})),
                        (saldoEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_saldo_env_est_carb_", label: "PTG - Saldo"})),
                        (excedeLimiteEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_excede_limi_env_est_carb_", label: "PTG - Excede Límite de Crédito"}));
                        log.emergency("cantidadEnvase", cantidadEnvase);
                        log.emergency("totalEnvase", totalEnvase);
                        precioLitro = cantidadEnvase / totalEnvase;
                        log.emergency("precioLitro", precioLitro);

                        for (var j = lineasOld; j < lineas; j++){
                          nuevoLitro = precioLitro * montoArraySublista[j];
                          log.emergency("nuevoLitro", nuevoLitro);
                          nuevoImporte = nuevoLitro * precioEnvase;
                          log.emergency("nuevoImporte", nuevoImporte);
                          nuevoImpuesto = nuevoImporte * .16;
                          log.emergency("nuevoImpuesto", nuevoImpuesto);


                          var recTipoPagoEsta = record.create({
                            type: "customrecord_ptg_detalleenv_est_carb_",
                            isDynamic: true,
                          });
                          recTipoPagoEsta.setValue("custrecord_ptg_tipodepago_enva_est_carb_", tipoPagoArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_referencia_env_est_carb_", folioArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_nota_env_est_carb_", notaEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_cliente_env_est_carb_", clienteEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_direc_env_est_carb_", direccionEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_nombre_env_est_carb_", clienteTXTEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_tipocil_env_est_carb_", tipoEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_cantidad_env_est_carb_", cantidadEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_precio_env_est_carb_", precioEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_importe_env_est_carb_", nuevoImporte.toFixed(2));
                          recTipoPagoEsta.setValue("custrecord_ptg_imp_env_est_carb_", nuevoImpuesto.toFixed(2));
                          recTipoPagoEsta.setValue("custrecord_ptg_total_env_est_carb_", montoArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_envdetallecarb_", idPreliquidacionEnvase);//Este es el ID del CR de preliquidacion Envases
                          recTipoPagoEsta.setValue("custrecord_ptg_id_oportunidad_envases", idOportunidadEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_modificar_met_pago_env", modificarPagoEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_saldo_venci_env_est_carb_", saldoVencidoEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_limite_cred_env_est_carb_", limiteCreditoEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_saldo_env_est_carb_", saldoEnvase);
                          recTipoPagoEsta.setValue("custrecord_ptg_excede_limi_env_est_carb_", excedeLimiteEnvase);
                          if(tipoPagoArraySublista[j] == prepagoBanorteId || tipoPagoArraySublista[j] == prepagoTransferenciaId || tipoPagoArraySublista[j] == prepagoBancomerId || tipoPagoArraySublista[j] == prepagoHSBCId || tipoPagoArraySublista[j] == prepagoBanamexId || tipoPagoArraySublista[j] == prepagoSantanderId || tipoPagoArraySublista[j] == prepagoScotianId){
                            recTipoPagoEsta.setValue("custrecord_ptg_prepago_sin_apl_env_e_car", true);
                          }
                          
                          var recTipoPagoEstaIdSaved = recTipoPagoEsta.save();
                          log.debug({
                            title: "DETALLE DE TIPO DE PAGO ENVASE CARBURACION",
                            details: "Id Saved: " + recTipoPagoEstaIdSaved,
                          });


                          //Búsqueda Guardada: PTG - Totales por tipo de pago - Envase OLD
                        var pagoOldEnvaseObjMas = search.create({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          filters: [
                            ["custrecord_ptg_envases_por_tipopago_","anyof",idPreliquidacionEnvase], "AND", 
                            ["custrecord_ptg_descripcion_tipopago_","anyof",tipoPagoArraySublista[j]]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"})
                          ]
                        });
                        var pagoOldEnvaseObjMasResult = pagoOldEnvaseObjMas.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idEstacionTipoPagoMas = pagoOldEnvaseObjMasResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (totalEstacionTipoPagoMas = pagoOldEnvaseObjMasResult[0].getValue({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"}));
                        var totalEstacionTipoPagoPFMas = parseFloat(totalEstacionTipoPagoMas);
                        var totalNuevoEstacionMas = totalEstacionTipoPagoPFMas + montoArraySublista[j];
                        var nuevoValorMas = {
                          custrecord_ptg_totaltipopago_: totalNuevoEstacionMas,
                        };
                        log.audit("nuevoValorMas", nuevoValorMas);
                        var registroActualizadoMas = record.submitFields({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          id: idEstacionTipoPagoMas,
                          values: nuevoValorMas
                        });
                        log.audit("registroActualizadoMas nuevo pago mas", registroActualizadoMas);

                        } 

                        for (var l = 0; l < lineasOld; l++){

                          objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ = customRec.getSublistValue({
                            sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                            fieldId: 'custrecord_ptg_tipo_pago',
                            line: l
                          });
      
                          objCarburacion.custrecord_ptg_total_env_est_carb_ = customRec.getSublistValue({
                            sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                            fieldId: 'custrecord_ptg_total',
                            line: l
                          });
      
                          objCarburacion.custrecord_ptg_referencia_env_est_carb_ = customRec.getSublistValue({
                            sublistId: 'recmachcustrecord_ptg_registro_pagos',
                            fieldId: 'custrecord_ptg_referenciapago_',
                            line: l
                          });
    
                          nuevoLitro = precioLitro * objCarburacion.custrecord_ptg_total_env_est_carb_;
                          log.emergency("nuevoLitro old", nuevoLitro);
                          nuevoImporte = nuevoLitro * precioEnvase;
                          log.emergency("nuevoImporte old", nuevoImporte);
                          nuevoImpuesto = nuevoImporte * .16;
                          log.emergency("nuevoImpuesto old", nuevoImpuesto);
    
                          //objCarburacion.custrecord_ptg_cantidad_env_est_carb_ = nuevoLitro;
                          objCarburacion.custrecord_ptg_importe_env_est_carb_ = nuevoImporte.toFixed(2);
                          objCarburacion.custrecord_ptg_imp_env_est_carb_ = nuevoImpuesto.toFixed(2);

                          if(objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoBanorteId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoTransferenciaId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoBancomerId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoHSBCId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoBanamexId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoSantanderId || objCarburacion.custrecord_ptg_tipodepago_enva_est_carb_ == prepagoScotianId){
                            objCarburacion.custrecord_ptg_prepago_sin_apl_env_e_car = true;
                          }

                          
                          var diferencia = montoArraySublistaOld[l] - objCarburacion.custrecord_ptg_total_env_est_carb_;
                          log.audit("diferencia", diferencia);


                           //Búsqueda Guardada: PTG - Totales por tipo de pago - Envase OLD
                        var pagoOldEnvaseObj = search.create({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          filters: [
                            ["custrecord_ptg_envases_por_tipopago_","anyof",idPreliquidacionEnvase], "AND", 
                            ["custrecord_ptg_descripcion_tipopago_","anyof",tipoPagoArraySublistaOld[l]]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"})
                          ]
                        });
                        var pagoOldEnvaseObjResult = pagoOldEnvaseObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idEstacionTipoPago = pagoOldEnvaseObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (totalEstacionTipoPago = pagoOldEnvaseObjResult[0].getValue({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"}));
                        log.audit("idEstacionTipoPago", idEstacionTipoPago);
                        log.audit("totalEstacionTipoPago", totalEstacionTipoPago);
                        var totalEstacionTipoPagoPF = parseFloat(totalEstacionTipoPago);
                        var totalNuevoEstacion = totalEstacionTipoPagoPF - diferencia.toFixed(2);
                        log.audit("totalNuevoEstacion", totalNuevoEstacion);
                        var nuevoValor = {
                          custrecord_ptg_totaltipopago_: totalNuevoEstacion,
                        };
                        log.audit("nuevoValor", nuevoValor);
                        var registroActualizado = record.submitFields({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          id: idEstacionTipoPago,
                          values: nuevoValor
                        });
                        log.audit("registroActualizado nuevo pago menos", registroActualizado);

                       
    
                        }
      
                        var registroUpd = record.submitFields({
                          type: "customrecord_ptg_detalleenv_est_carb_",
                          id: idInternoEnvase,
                          values: objCarburacion,
                        });
                        log.audit("objCarburacion", objCarburacion);
                        log.audit("Registro actualizado envases carburacion", registroUpd);


                      } else {
                        //Búsqueda Guardada: PTG - Detalle Gas Cilindro tipo de pago - Modificar Pago
                        var cilindroPagoObj = search.create({
                          type: "customrecord_ptg_det_gas_tipo_pago_",
                          filters: [
                             ["custrecord_ptg_id_oportunidad_gas","anyof",oportunidadID]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_tipopago_gas", label: "PTG - Tipo de Pago gas"}),
                             search.createColumn({name: "custrecord_ptg_referenciagas_", label: "PTG - Referencia gas"}),
                             search.createColumn({name: "custrecord_ptg_notasgas_", label: "PTG - Nota Gas"}),
                             search.createColumn({name: "custrecord_ptg_clientegas_", label: "PTG - Cliente gas"}),
                             search.createColumn({name: "custrecord_ptg_direccionembgas_", label: "PTG - Dirección embarque gas"}),
                             search.createColumn({name: "custrecord_ptg_nombre_gas", label: "PTG - Nombre gas"}),
                             search.createColumn({name: "custrecord_ptg_foliofiscalgas_", label: "PTG - Folio Fiscal gas"}),
                             search.createColumn({name: "custrecord_ptg_tipocil_gas_", label: "PTG - Tipo cil gas"}),
                             search.createColumn({name: "custrecord_ptg_cantidadgas_", label: "PTG - Cantidad Gas"}),
                             search.createColumn({name: "custrecord_ptg_preciogas", label: "PTG - Precio gas"}),
                             search.createColumn({name: "custrecord_ptg_importegas_", label: "PTG - Importe gas"}),
                             search.createColumn({name: "custrecord_ptg_impuestogas_", label: "PTG - Impuesto gas"}),
                             search.createColumn({name: "custrecord_ptg_total_gas", label: "PTG - Total gas"}),
                             search.createColumn({name: "custrecord_ptg_detgas_tipo_pago_", label: "PTG - Detalle Gas tipo de pago"}),
                             search.createColumn({name: "custrecord_ptg_id_oportunidad_gas", label: "PTG - Id Oportunidad"}),
                             search.createColumn({name: "custrecord_ptg_modificar_met_pago_cil", label: "PTG - Modificar Método de Pago"}),
                             search.createColumn({name: "custrecord_ptg_saldo_vencido_detalle_gas", label: "PTG - SALDO VENCIDO"}),
                             search.createColumn({name: "custrecord_ptg_limite_credit_detalle_gas", label: "PTG - Límite de Crédito"}),
                             search.createColumn({name: "custrecord_ptg_saldo_detalle_gas", label: "PTG - Saldo"})
                          ]
                       });
                       var cilindroPagoObjCount = cilindroPagoObj.runPaged().count;
                       if(cilindroPagoObjCount > 0){
                        var cilindroPagoObjResult = cilindroPagoObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idInternoCilindro = cilindroPagoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (notaCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_notasgas_", label: "PTG - Nota Gas"})),
                        (clienteCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_clientegas_", label: "PTG - Cliente gas"})),
                        (direccionCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_direccionembgas_", label: "PTG - Dirección embarque gas"})),
                        (clienteTXTCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_nombre_gas", label: "PTG - Nombre gas"})),
                        (folioCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_foliofiscalgas_", label: "PTG - Folio Fiscal gas"})),
                        (tipoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_tipocil_gas_", label: "PTG - Tipo cil gas"})),
                        (cantidadCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_cantidadgas_", label: "PTG - Cantidad Gas"})),
                        (precioCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_preciogas", label: "PTG - Precio gas"})),
                        (importeCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_importegas_", label: "PTG - Importe gas"})),
                        (impuestoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_impuestogas_", label: "PTG - Impuesto gas"})),
                        (totalCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_total_gas", label: "PTG - Total gas"})),
                        (idPreliquidacionCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_detgas_tipo_pago_", label: "PTG - Detalle Gas tipo de pago"})),
                        (oportunidadCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_id_oportunidad_gas", label: "PTG - Id Oportunidad"})),
                        (modificarPagoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_modificar_met_pago_cil", label: "PTG - Modificar Método de Pago"})),
                        (saldoVencidoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_saldo_vencido_detalle_gas", label: "PTG - SALDO VENCIDO"})),
                        (limiteCreditoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_limite_credit_detalle_gas", label: "PTG - Límite de Crédito"})),
                        (saldoCilindro = cilindroPagoObjResult[0].getValue({name: "custrecord_ptg_saldo_detalle_gas", label: "PTG - Saldo"}));
                        log.emergency("cantidadCilindro", cantidadCilindro);
                        log.emergency("totalCilindro", totalCilindro);
                        var itemObj = record.load({
                          type: search.Type.INVENTORY_ITEM,
                          id: tipoCilindro,
                        });
                        var capacidadCilindro = itemObj.getValue("custitem_ptg_capacidadcilindro_");
                        log.audit("capacidadCilindro", capacidadCilindro);
                        var totalCantidad = cantidadCilindro * capacidadCilindro;
                        log.emergency("totalCantidad", totalCantidad);
                        precioLitro = totalCantidad / totalCilindro;
                        log.emergency("precioLitro", precioLitro);

                        for (var j = lineasOld; j < lineas; j++){
                          nuevoLitro = precioLitro * montoArraySublista[j];
                          log.emergency("nuevoLitro", nuevoLitro);
                          nuevoImporte = nuevoLitro * precioCilindro;
                          log.emergency("nuevoImporte", nuevoImporte);
                          nuevoImpuesto = nuevoImporte * .16;
                          log.emergency("nuevoImpuesto", nuevoImpuesto);


                          var recTipoPagoEsta = record.create({
                            type: "customrecord_ptg_det_gas_tipo_pago_",
                            isDynamic: true,
                          });
                          recTipoPagoEsta.setValue("custrecord_ptg_tipopago_gas", tipoPagoArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_referenciagas_", folioArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_notasgas_", notaCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_clientegas_", clienteCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_direccionembgas_", direccionCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_nombre_gas", clienteTXTCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_foliofiscalgas_", folioCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_tipocil_gas_", tipoCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_cantidadgas_", cantidadCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_preciogas", precioCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_importegas_", nuevoImporte.toFixed(2));
                          recTipoPagoEsta.setValue("custrecord_ptg_impuestogas_", nuevoImpuesto.toFixed(2));
                          recTipoPagoEsta.setValue("custrecord_ptg_total_gas", montoArraySublista[j]);
                          recTipoPagoEsta.setValue("custrecord_ptg_detgas_tipo_pago_", idPreliquidacionCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_id_oportunidad_gas", oportunidadCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_modificar_met_pago_cil",modificarPagoCilindro );
                          recTipoPagoEsta.setValue("custrecord_ptg_saldo_vencido_detalle_gas", saldoVencidoCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_limite_credit_detalle_gas", limiteCreditoCilindro);
                          recTipoPagoEsta.setValue("custrecord_ptg_saldo_detalle_gas", saldoCilindro);
                          if(tipoPagoArraySublista[j] == prepagoBanorteId || tipoPagoArraySublista[j] == prepagoTransferenciaId || tipoPagoArraySublista[j] == prepagoBancomerId || tipoPagoArraySublista[j] == prepagoHSBCId || tipoPagoArraySublista[j] == prepagoBanamexId || tipoPagoArraySublista[j] == prepagoSantanderId || tipoPagoArraySublista[j] == prepagoScotianId){
                            recTipoPagoEsta.setValue("custrecord_ptg_prepago_sin_aplic_det_gas", true);
                          }
                          
                          var recTipoPagoEstaIdSaved = recTipoPagoEsta.save();
                          log.debug({
                            title: "DETALLE DE TIPO DE PAGO CILINDRO CARBURACION",
                            details: "Id Saved: " + recTipoPagoEstaIdSaved,
                          });
                       }

                       for (var l = 0; l < lineasOld; l++){

                        objCarburacion.custrecord_ptg_tipopago_gas = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                          fieldId: 'custrecord_ptg_tipo_pago',
                          line: l
                        });
    
                        objCarburacion.custrecord_ptg_total_gas = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                          fieldId: 'custrecord_ptg_total',
                          line: l
                        });
    
                        objCarburacion.custrecord_ptg_referenciagas_ = customRec.getSublistValue({
                          sublistId: 'recmachcustrecord_ptg_registro_pagos',
                          fieldId: 'custrecord_ptg_referenciapago_',
                          line: l
                        });
  
                        nuevoLitro = precioLitro * objCarburacion.custrecord_ptg_total_gas;
                        log.emergency("nuevoLitro old", nuevoLitro);
                        nuevoImporte = nuevoLitro * precioCilindro;
                        log.emergency("nuevoImporte old", nuevoImporte);
                        nuevoImpuesto = nuevoImporte * .16;
                        log.emergency("nuevoImpuesto old", nuevoImpuesto);
  
                        //objCarburacion.custrecord_ptg_cantidadgas_ = nuevoLitro;
                        objCarburacion.custrecord_ptg_importegas_ = nuevoImporte.toFixed(2);
                        objCarburacion.custrecord_ptg_impuestogas_ = nuevoImpuesto.toFixed(2);

                        if(objCarburacion.custrecord_ptg_tipopago_gas == prepagoBanorteId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoTransferenciaId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoBancomerId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoHSBCId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoBanamexId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoSantanderId || objCarburacion.custrecord_ptg_tipopago_gas == prepagoScotianId){
                          objCarburacion.custrecord_ptg_prepago_sin_aplic_det_gas = true;
                        }

                      }
    
                      var registroUpd = record.submitFields({
                        type: "customrecord_ptg_det_gas_tipo_pago_",
                        id: idInternoCilindro,
                        values: objCarburacion,
                      });
                      log.audit("Registro actualizado cilindro carburacion", registroUpd);

                      }

                    }
                    
                    }
                  } else if (lineas == 1){
                    var tipoPagoLinea = 0;
                    var referenciaPagoLinea = 0;
                    var montoPagoLinea = 0;
                    var tipoPagoLineaOld = 0;
                    var prepagoSinAplicar = false;
                    var objCarburacionUno = {};
                    var oportunidadesAFacturar = {};

                    for (var j = 0; j < lineas; j++){
                      tipoPagoLineaOld = context.oldRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_tipo_pago',
                        line: j
                      });
                      tipoPagoLinea = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_tipo_pago',
                        line: j
                      });
                      referenciaPagoLinea = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_referenciapago_',
                        line: j
                      });
                      montoPagoLineaOld = context.oldRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_total',
                        line: j
                      });
                      montoPagoLinea = customRec.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                        fieldId: 'custrecord_ptg_total',
                        line: j
                      });

                      if(tipoPagoLinea == prepagoBanorteId || tipoPagoLinea == prepagoTransferenciaId || tipoPagoLinea == prepagoBancomerId || tipoPagoLinea == prepagoHSBCId || tipoPagoLinea == prepagoBanamexId || tipoPagoLinea == prepagoSantanderId || tipoPagoLinea == prepagoScotianId){
                        prepagoSinAplicar = true;
                      }
                    }

                    
                    //BÚSQUEDA GUARDADA: PTG - Detalle despachador SS
                    var registroEstacionarioObj = search.create({
                      type: "customrecord_ptg_detalle_despachador_",
                      filters: [
                        ["custrecord_ptg_oportunidad_carburacion","anyof",oportunidadID]
                      ],
                      columns: [
                        search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                        search.createColumn({name: "custrecord_ptg_detallecrburacion_", label: "PTG - Detallecarburacion"}),
                      ]
                    });
                    var registroEstacionarioObjCount = registroEstacionarioObj.runPaged().count;

                    if(numeroViajeConsumoInterno){
                      objCarburacionUno.custrecord_ptg_numero_viaje_destino = numeroViajeConsumoInterno;
                    }
                    if(registroEstacionarioObjCount > 0){
                      var registroEstacionarioObjResult = registroEstacionarioObj.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      log.audit("registroEstacionarioObjResult", registroEstacionarioObjResult);
                      (idInternoDespa = registroEstacionarioObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})),
                      (idPreliquidacionDespa = registroEstacionarioObjResult[0].getValue({name: "custrecord_ptg_detallecrburacion_", label: "PTG - Detallecarburacion"}));
                      
                      objCarburacionUno.custrecord_ptg_tipopagoespachador_ = tipoPagoLinea;
                      objCarburacionUno.custrecord_ptg_ref_pago_ = referenciaPagoLinea;
                      objCarburacionUno.custrecord_ptg_prepago_sin_aplicar_despa = prepagoSinAplicar;
                      
                      var registroUpdate = record.submitFields({
                        type: "customrecord_ptg_detalle_despachador_",
                        id: idInternoDespa,
                        values: objCarburacionUno,
                      });
                      log.audit("Registro actualizado gas carburacion", registroUpdate);


                      //PTG - Detalle tipo de pago - Pago OLD
                      var pagoOldObj = search.create({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        filters: [
                           ["custrecord_ptg_detalle_pago_carb_","anyof",idPreliquidacionDespa], "AND", 
                           ["custrecord_ptg_descripcion_","anyof",tipoPagoLineaOld]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                           search.createColumn({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"})
                        ]
                      });
                      var pagoOldObjResult = pagoOldObj.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      (idEstacionTipoPago = pagoOldObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                      (totalEstacionTipoPago = pagoOldObjResult[0].getValue({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"}));
                      var totalEstacionTipoPagoPF = parseFloat(totalEstacionTipoPago);
                      
                      //if(tipoPagoLineaOld != tipoPagoLinea){
                      var totalNuevoEstacion = totalEstacionTipoPagoPF - montoPagoLinea;
                      var nuevoValor = {
                        custrecord_ptg_total_est_carb_: totalNuevoEstacion,
                      };
                      log.audit("nuevoValor", nuevoValor);
                      var registroActualizado = record.submitFields({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        id: idEstacionTipoPago,
                        values: nuevoValor
                      });
                      log.audit("registroActualizado nuevo pago menos", registroActualizado);

                      //PTG - Detalle tipo de pago - Pago OLD
                      var pagoOldObjMas = search.create({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        filters: [
                           ["custrecord_ptg_detalle_pago_carb_","anyof",idPreliquidacionDespa], "AND", 
                           ["custrecord_ptg_descripcion_","anyof",tipoPagoLinea]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                           search.createColumn({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"})
                        ]
                      });
                      var pagoOldObjResultMas = pagoOldObjMas.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      (idEstacionTipoPagoMas = pagoOldObjResultMas[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                      (totalEstacionTipoPagoMas = pagoOldObjResultMas[0].getValue({name: "custrecord_ptg_total_est_carb_", label: "PTG - Total est carb"}));
                      var totalEstacionTipoPagoPFMas = parseFloat(totalEstacionTipoPagoMas);
                      var totalNuevoEstacionMas = totalEstacionTipoPagoPFMas + montoPagoLinea;
                      var nuevoValorMas = {
                        custrecord_ptg_total_est_carb_: totalNuevoEstacionMas,
                      };
                      log.audit("nuevoValorMas", nuevoValorMas);
                      var registroActualizadoMas = record.submitFields({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        id: idEstacionTipoPagoMas,
                        values: nuevoValorMas
                      });
                      log.audit("registroActualizadoMas nuevo pago mas", registroActualizadoMas);
/*                    } else if(tipoPagoLineaOld == tipoPagoLinea){
                      var totalNuevoEstacion = totalEstacionTipoPagoPF - totalEstacionTipoPagoPF;
                      var totalNuevoEstacionNew = totalNuevoEstacion + montoPagoLinea;

                      var nuevoValor = {
                        custrecord_ptg_total_est_carb_: totalNuevoEstacionNew,
                      };
                      log.audit("nuevoValor cambio monto", nuevoValor);
                      var registroActualizado = record.submitFields({
                        type: "customrecord_ptg_det_tipo_pago_est_car_",
                        id: idEstacionTipoPago,
                        values: nuevoValor
                      });
                      log.audit("registroActualizado nuevo monto en pago", registroActualizado);

                    }*/

                    } else {
                      //Búsqueda Guardada: PTG - Detalle Envases est carb - Modificar Pago
                      var envasePagoObj = search.create({
                        type: "customrecord_ptg_detalleenv_est_carb_",
                        filters: [
                           ["custrecord_ptg_id_oportunidad_envases","anyof",oportunidadID]
                        ],
                        columns: [
                           search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                           search.createColumn({name: "custrecord_ptg_envdetallecarb_", label: "PTG - Envase detalle"})
                        ]
                      });
                      var envasePagoObjCount = envasePagoObj.runPaged().count;
                      if(envasePagoObjCount > 0){
                        var envasePagoObjResult = envasePagoObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idInternoEnvase = envasePagoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (idPreliquidacionEnvase = envasePagoObjResult[0].getValue({name: "custrecord_ptg_envdetallecarb_", label: "PTG - Envase detalle"}));

                        objCarburacionUno.custrecord_ptg_tipodepago_enva_est_carb_ = tipoPagoLinea;
                        objCarburacionUno.custrecord_ptg_referencia_env_est_carb_ = referenciaPagoLinea;
                        objCarburacionUno.custrecord_ptg_prepago_sin_apl_env_e_car = prepagoSinAplicar;
                      
                        var registroUpdate = record.submitFields({
                          type: "customrecord_ptg_detalleenv_est_carb_",
                          id: idInternoEnvase,
                          values: objCarburacionUno,
                        });
                        log.audit("Registro actualizado envase carburacion", registroUpdate);

                        //Búsqueda Guardada: PTG - Totales por tipo de pago - Envase OLD
                        var pagoOldEnvaseObj = search.create({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          filters: [
                            ["custrecord_ptg_envases_por_tipopago_","anyof",idPreliquidacionEnvase], "AND", 
                            ["custrecord_ptg_descripcion_tipopago_","anyof",tipoPagoLineaOld]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"})
                          ]
                        });
                        var pagoOldEnvaseObjResult = pagoOldEnvaseObj.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idEstacionTipoPago = pagoOldEnvaseObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (totalEstacionTipoPago = pagoOldEnvaseObjResult[0].getValue({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"}));
                        var totalEstacionTipoPagoPF = parseFloat(totalEstacionTipoPago);
                        var totalNuevoEstacion = totalEstacionTipoPagoPF - montoPagoLinea;
                        var nuevoValor = {
                          custrecord_ptg_totaltipopago_: totalNuevoEstacion,
                        };
                        log.audit("nuevoValor", nuevoValor);
                        var registroActualizado = record.submitFields({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          id: idEstacionTipoPago,
                          values: nuevoValor
                        });
                        log.audit("registroActualizado nuevo pago menos", registroActualizado);


                        //Búsqueda Guardada: PTG - Totales por tipo de pago - Envase OLD
                        var pagoOldEnvaseObjMas = search.create({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          filters: [
                            ["custrecord_ptg_envases_por_tipopago_","anyof",idPreliquidacionEnvase], "AND", 
                            ["custrecord_ptg_descripcion_tipopago_","anyof",tipoPagoLinea]
                          ],
                          columns: [
                             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                             search.createColumn({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"})
                          ]
                        });
                        var pagoOldEnvaseObjMasResult = pagoOldEnvaseObjMas.run().getRange({
                          start: 0,
                          end: 2,
                        });
                        (idEstacionTipoPagoMas = pagoOldEnvaseObjMasResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})),
                        (totalEstacionTipoPagoMas = pagoOldEnvaseObjMasResult[0].getValue({name: "custrecord_ptg_totaltipopago_", label: "PTG - Total tipo de pago"}));
                        var totalEstacionTipoPagoPFMas = parseFloat(totalEstacionTipoPagoMas);
                        var totalNuevoEstacionMas = totalEstacionTipoPagoPFMas + montoPagoLinea;
                        var nuevoValorMas = {
                          custrecord_ptg_totaltipopago_: totalNuevoEstacionMas,
                        };
                        log.audit("nuevoValorMas", nuevoValorMas);
                        var registroActualizadoMas = record.submitFields({
                          type: "customrecord_ptg_totalesxtipopago_est_ca",
                          id: idEstacionTipoPagoMas,
                          values: nuevoValorMas
                        });
                        log.audit("registroActualizadoMas nuevo pago mas", registroActualizadoMas);

                      }
                    }

                    //Búsqueda Guardada: PTG - Oportunidades A Facturar - Upd
                    var oportunidadAFacturarObj = search.create({
                      type: "customrecord_ptg_oportunidades_",
                      filters: [["custrecord_ptg_idoportunidad_","anyof", oportunidadID]],
                      columns: [
                         search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})
                      ]
                    });
                    var oportunidadAFacturarObjCount = oportunidadAFacturarObj.runPaged().count;
                    if(oportunidadAFacturarObjCount > 0){
                      var oportunidadAFacturarObjResult = oportunidadAFacturarObj.run().getRange({
                        start: 0,
                        end: 2,
                      });
                      (idRegOporAFacturar = oportunidadAFacturarObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}));
                    }

                    if(tipoPagoLinea != saldoAFavorId && tipoPagoLinea != consumoInternoId && tipoPagoLinea != recirculacionId && tipoPagoLinea != canceladoId){
                      log.audit("tipoPagoLinea if", tipoPagoLinea);
                      oportunidadesAFacturar.custrecord_ptg_facturar_servicio = true;
                    } else if (tipoPagoLinea == saldoAFavorId || tipoPagoLinea == consumoInternoId || tipoPagoLinea == recirculacionId || tipoPagoLinea == canceladoId){
                      log.audit("tipoPagoLinea if else", tipoPagoLinea);
                      oportunidadesAFacturar.custrecord_ptg_facturar_servicio = false;
                    }
                    log.audit("oportunidadesAFacturar", oportunidadesAFacturar);
                    var regOporAFacturar = record.submitFields({
                      type: "customrecord_ptg_oportunidades_",
                      id: idRegOporAFacturar,
                      values: oportunidadesAFacturar
                    });
                    log.audit("regOporAFacturar", regOporAFacturar);
                  }
              }

              else {
                var objCilindros = {};
                var objDetalleResumen = {};

                if(lineas != lineasOld){
                  for (var i = lineasOld; i < lineas; i++){
                    tipoPagoArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_tipo_pago',
                      line: i
                    });

                    montoArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_total',
                      line: i
                    });

                    folioArraySublista[i] = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos',
                      fieldId: 'custrecord_ptg_referenciapago_',
                      line: i
                    });
                  }

                  //Búsqueda Guardada: PTG - Modificar Pagos Cilindro SS
                  var registroCilindroObj = search.create({
                    type: "customrecord_ptg_registrooportunidad_",
                    filters: [
                       ["custrecord_ptg_oportunidad_","anyof",oportunidadID], "AND", 
                       ["custrecordptg_numviajeoportunidad_","anyof",numeroViaje]
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_oportunidad_", label: "PTG - Oportunidad"}),
                       search.createColumn({name: "custrecordptg_numviajeoportunidad_", label: "PTG - Num Viaje oportunidad"}),
                       search.createColumn({name: "custrecord_ptg_optpreliq_", label: "PTG - Oportunidad preliq"}),
                       search.createColumn({name: "custrecord_ptg_tipopago_oportunidad_", label: "PTG - Tipo de Pago"}),
                       search.createColumn({name: "custrecord_ptg_total_", label: "PTG - Total"}),
                       search.createColumn({name: "custrecord_drt_ptg_registro_oportunidad", label: "PTG - Registro desde Oportunidad"}),
                       search.createColumn({name: "custrecord_ptg_modificar_met_pago_cilind", label: "PTG - Modificar Método de Pago"}),
                       search.createColumn({name: "custrecord_ptg_cliente_reg_oport", label: "PTG - Cliente"}),
                       search.createColumn({name: "custrecord_ptg_saldo_vencido_reg_oport", label: "PTG - SALDO VENCIDO"}),
                       search.createColumn({name: "custrecord_ptg_limite_credito_reg_oport", label: "PTG - Límite de Crédito"}),
                       search.createColumn({name: "custrecord_ptg_saldo_reg_oport", label: "PTG - Saldo"}),
                       search.createColumn({name: "custrecord_ptg_excede_limite_reg_oport", label: "PTG - Excede Límite de Crédito"}),
                       search.createColumn({name: "custrecord_ptg_restriccion_reg_oport", label: "PTG - RESTRICCION"}),
                       search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})
                    ]
                 });
                 var registroCilindroObjCount = registroCilindroObj.runPaged().count;
                 if(registroCilindroObjCount > 0){
                  var registroCilindroObjResult = registroCilindroObj.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (idOportunidadCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_oportunidad_", label: "PTG - Oportunidad"})),
                  (numViajeCil = registroCilindroObjResult[0].getValue({name: "custrecordptg_numviajeoportunidad_", label: "PTG - Num Viaje oportunidad"})),
                  (registroCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_optpreliq_", label: "PTG - Oportunidad preliq"})),
                  (tipoPagoCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_tipopago_oportunidad_", label: "PTG - Tipo de Pago"})),
                  (totalCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_total_", label: "PTG - Total"})),
                  (registroDesdeOportunidad = registroCilindroObjResult[0].getValue({name: "custrecord_drt_ptg_registro_oportunidad", label: "PTG - Registro desde Oportunidad"})),
                  (urlCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_modificar_met_pago_cilind", label: "PTG - Modificar Método de Pago"})),
                  (nombreClienteCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_cliente_reg_oport", label: "PTG - Cliente"})),
                  (saldoVencidoCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_saldo_vencido_reg_oport", label: "PTG - SALDO VENCIDO"})),
                  (limiteCreditoCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_limite_credito_reg_oport", label: "PTG - Límite de Crédito"})),
                  (saldoCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_saldo_reg_oport", label: "PTG - Saldo"})),
                  (excedeLimiteCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_excede_limite_reg_oport", label: "PTG - Excede Límite de Crédito"})),
                  (restriccionCil = registroCilindroObjResult[0].getValue({name: "custrecord_ptg_restriccion_reg_oport", label: "PTG - RESTRICCION"})),
                  (idInternoRegistroCil = registroCilindroObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}));

                  for (var j = lineasOld; j < lineas; j++){
                    var recTipoPagoCil = record.create({
                      type: "customrecord_ptg_registrooportunidad_",
                      isDynamic: true,
                    });
                    recTipoPagoCil.setValue("custrecord_ptg_oportunidad_", idOportunidadCil);
                    recTipoPagoCil.setValue("custrecordptg_numviajeoportunidad_", numViajeCil);
                    recTipoPagoCil.setValue("custrecord_ptg_optpreliq_", registroCil);
                    recTipoPagoCil.setValue("custrecord_ptg_tipopago_oportunidad_", tipoPagoArraySublista[j]);
                    recTipoPagoCil.setValue("custrecord_ptg_total_", montoArraySublista[j]);
                    recTipoPagoCil.setValue("custrecord_drt_ptg_registro_oportunidad", registroDesdeOportunidad);
                    recTipoPagoCil.setValue("custrecord_ptg_modificar_met_pago_cilind", urlCil);
                    recTipoPagoCil.setValue("custrecord_ptg_cliente_reg_oport", nombreClienteCil);
                    recTipoPagoCil.setValue("custrecord_ptg_saldo_vencido_reg_oport", saldoVencidoCil);
                    recTipoPagoCil.setValue("custrecord_ptg_limite_credito_reg_oport", limiteCreditoCil);
                    recTipoPagoCil.setValue("custrecord_ptg_saldo_reg_oport", saldoCil);
                    recTipoPagoCil.setValue("custrecord_ptg_excede_limite_reg_oport", excedeLimiteCil);
                    recTipoPagoCil.setValue("custrecord_ptg_restriccion_reg_oport", restriccionCil);
                    if(tipoPagoArraySublista[j] == prepagoBanorteId || tipoPagoArraySublista[j] == prepagoTransferenciaId || tipoPagoArraySublista[j] == prepagoBancomerId || tipoPagoArraySublista[j] == prepagoHSBCId || tipoPagoArraySublista[j] == prepagoBanamexId || tipoPagoArraySublista[j] == prepagoSantanderId || tipoPagoArraySublista[j] == prepagoScotianId){
                      recTipoPagoCil.setValue("custrecord_ptg_prepago_aplicar_oport", true);
                    }
                    var recTipoPagoCilIdSaved = recTipoPagoCil.save();
                    log.debug({
                      title: "DETALLE DE TIPO DE PAGO CILINDRO",
                      details: "Id Saved: " + recTipoPagoCilIdSaved,
                    });
                  }

                  for (var l = 0; l < lineasOld; l++){
                    objCilindros.custrecord_ptg_tipopago_oportunidad_ = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_tipo_pago',
                      line: l
                    });

                    objCilindros.custrecord_ptg_total_ = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_total',
                      line: l
                    });

                    objCilindros.custrecord_ptg_referencia_reg_oport = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos',
                      fieldId: 'custrecord_ptg_referenciapago_',
                      line: l
                    });

                    if(objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBanorteId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoTransferenciaId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBancomerId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoHSBCId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBanamexId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoSantanderId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoScotianId){
                      objCilindros.custrecord_ptg_prepago_aplicar_oport = true;
                    }
                  }

                  var registroUpd = record.submitFields({
                    type: "customrecord_ptg_registrooportunidad_",
                    id: idInternoRegistroCil,
                    values: objCilindros,
                  });
                  log.audit("Registro actualizado cilindro Diferentes Lineas", registroUpd);


                } 

                //SS: PTG - Detalle Resumen SS
                var detalleResumen = search.create({
                  type: "customrecord_ptg_detalle_resumen_",
                  filters:[["custrecord_ptg_oportuni_detalle_resumen_","anyof",oportunidadID]],
                  columns:[search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})]
                });
                var detalleResumenCount = detalleResumen.runPaged().count;
                if(detalleResumenCount > 0){
                  var detalleResumenResult = detalleResumen.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (idDetalleResumen = detalleResumenResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}));
                }

                objDetalleResumen.custrecord_ptg_tipodepago_detalleresumen = multipleId;

                var detalleResumenUpd = record.submitFields({
                  type: "customrecord_ptg_detalle_resumen_",
                  id: idDetalleResumen,
                  values: objDetalleResumen,
                });
                log.audit("Registro actualizado detalleResumenUpd", detalleResumenUpd);


                  
                } else {
                  for (var k = 0; k < lineasOld; k++){
                    objCilindros.custrecord_ptg_tipopago_oportunidad_ = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_tipo_pago',
                      line: k
                    });

                    objCilindros.custrecord_ptg_total_ = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                      fieldId: 'custrecord_ptg_total',
                      line: k
                    });

                    objCilindros.custrecord_ptg_referencia_reg_oport = customRec.getSublistValue({
                      sublistId: 'recmachcustrecord_ptg_registro_pagos',
                      fieldId: 'custrecord_ptg_referenciapago_',
                      line: k
                    });

                    objDetalleResumen.custrecord_ptg_tipodepago_detalleresumen = objCilindros.custrecord_ptg_tipopago_oportunidad_;

                    if(objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBanorteId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoTransferenciaId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBancomerId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoHSBCId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoBanamexId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoSantanderId || objCilindros.custrecord_ptg_tipopago_oportunidad_ == prepagoScotianId){
                      objCilindros.custrecord_ptg_prepago_aplicar_oport = true;
                    }
                  }

                  //Búsqueda Guardada: PTG - Modificar Pagos Cilindro SS
                  var registroCilindroObj = search.create({
                    type: "customrecord_ptg_registrooportunidad_",
                    filters: [
                       ["custrecord_ptg_oportunidad_","anyof",oportunidadID], "AND", 
                       ["custrecordptg_numviajeoportunidad_","anyof",numeroViaje]
                    ],
                    columns: [
                       search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})
                    ]
                 });
                 var registroCilindroObjCount = registroCilindroObj.runPaged().count;
                 if(registroCilindroObjCount > 0){
                  var registroCilindroObjResult = registroCilindroObj.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (idInternoRegistroCil = registroCilindroObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}));

                  var registroUpd = record.submitFields({
                    type: "customrecord_ptg_registrooportunidad_",
                    id: idInternoRegistroCil,
                    values: objCilindros,
                  });
                  log.audit("Registro actualizado Cilindro Mismas Lineas", registroUpd);


                  //SS: PTG - Detalle Resumen SS
                var detalleResumen = search.create({
                  type: "customrecord_ptg_detalle_resumen_",
                  filters:[["custrecord_ptg_oportuni_detalle_resumen_","anyof",oportunidadID]],
                  columns:[search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"})]
                });
                var detalleResumenCount = detalleResumen.runPaged().count;
                if(detalleResumenCount > 0){
                  var detalleResumenResult = detalleResumen.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (idDetalleResumen = detalleResumenResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}));
                }

                var detalleResumenUpd = record.submitFields({
                  type: "customrecord_ptg_detalle_resumen_",
                  id: idDetalleResumen,
                  values: objDetalleResumen,
                });
                log.audit("Registro actualizado detalleResumenUpd", detalleResumenUpd);
                }
                }
            }


            var conteoPrepago = 0;

              for (var i = 0; i < lineas; i++){
                var tipoPagoTXT = customRec.getSublistText({
                  sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                  fieldId: 'custrecord_ptg_tipo_pago',
                  line: i
                });
                var tipoPago = customRec.getSublistValue({
                  sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                  fieldId: 'custrecord_ptg_tipo_pago',
                  line: i
                });
                if(tipoPago == prepagoBanorteId || tipoPago == prepagoTransferenciaId || tipoPago == prepagoBancomerId || tipoPago == prepagoHSBCId || tipoPago == prepagoBanamexId || tipoPago == prepagoSantanderId || tipoPago == prepagoScotianId){
                  conteoPrepago += 1;
                }
                var montoPago = customRec.getSublistValue({
                  sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                  fieldId: 'custrecord_ptg_total',
                  line: i
                });
                var folioPago = customRec.getSublistValue({
                  sublistId: 'recmachcustrecord_ptg_registro_pagos', 
                  fieldId: 'custrecord_ptg_referenciapago_',
                  line: i
                });
                objPagos = {metodo_txt: tipoPagoTXT, tipo_pago: tipoPago, monto: montoPago, folio: folioPago}
                arrayPagos.push(objPagos);
                log.audit("objPagos", objPagos);
              }

              log.audit("conteoPrepago", conteoPrepago);

              


              log.audit("arrayPagos", arrayPagos);
              objPagosOportunidad = {pago: arrayPagos}
              log.audit("objPagosOportunidad", objPagosOportunidad);
              var objValue = JSON.stringify(objPagosOportunidad);
              log.audit("objValueM", objValue);

              if(lineas > 1){
                opcionPago = multipleId;
                log.audit("varias opciones de pago", opcionPago);
              } else {
                jsonTipoPago = objPagosOportunidad.pago;
                log.audit("jsonTipoPago", jsonTipoPago);
                jsonPago = jsonTipoPago[0];
                log.audit("jsonPago", jsonPago);
                opcionPago = jsonPago.tipo_pago;
                log.audit("Una opcion de pago", opcionPago);
              }
              
              var objUpdate = {
                custbody_ptg_opcion_pago_obj: objValue,
                custbody_ptg_opcion_pago: opcionPago,
              }
              log.audit("objUpdate", objUpdate);

              var oportunidadActualizada = record.submitFields({
                id: oportunidadID,
                type: record.Type.OPPORTUNITY,
                values: objUpdate,
              });
              log.debug("oportunidadActualizada", oportunidadActualizada);

              if(numeroViaje){
                var oportunidadObj = record.load({
                  type: record.Type.OPPORTUNITY,
                  id: oportunidadID,
                  isDynamic: true,
                });
                var lineasOportunidad = oportunidadObj.getLineCount({ sublistId: "item"});
                log.audit("lineasOportunidad", lineasOportunidad);
                for(var j = 0; j < lineasOportunidad; j++){
                  oportunidadObj.selectLine({
                    sublistId: 'item',
                    line: j
                  });
  
                  var registroEstacionario = oportunidadObj.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custcol_ptg_registro_estacionario',
                  });
                  log.audit("Registro Estacionario "+j, registroEstacionario);

                  if(registroEstacionario){
                    var objUpdateRegistro = {
                      custrecord_ptg_tipodepago_estacionarios_: opcionPago,
                    };
                    record.submitFields({
                      type: "customrecord_ptg_ventas_estacionario",
                      id: registroEstacionario,
                      values: objUpdateRegistro,
                    });
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