/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Registro de Servicios Cilindros CS
 * Script id: customscript_drt_ptg_reg_serv_cil_cs
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_cil_cs
 * Applied to: PTG - Registro de Servicios
 * File: drt_ptg_reg_serv_cil_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/currentRecord", "N/ui/dialog", "N/runtime"], function (record, search, error, currentRecord, dialog, runtime) {
    function pageInit(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var nombre = 'Por Asignar';
            currentRecord.setValue("name", nombre);

        } catch (error) {
            log.error({
                title: "error pageInit",
                details: JSON.stringify(error),
            });
        }
    }

    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var sublistName = context.sublistId;
            var numViaje = currentRecord.getValue("custrecord_ptg_num_viaje_reg_serv_cil");
            var vehiculo = currentRecord.getValue("custrecord_ptg_no_vehiculo_reg_serv_cil");
            var idRegistroDeServicios = 'recmachcustrecord_ptg_id_reg_serv_cil_lin';
            var sublistFieldName = context.fieldId;
            var cilindro10 = 0;
            var cilindro20 = 0;
            var cilindro30 = 0;
            var cilindro45 = 0;
            var descuentoPorcentaje = 0;
            var descuentoPeso = 0;
            var estatusViejeEnCurso = 0;
            var articuloEnvase = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
              cilindro10 = 4094;
              cilindro20 = 4095;
              cilindro30 = 4096;
              cilindro45 = 4602;
              descuentoPorcentaje = 1;
              descuentoPeso = 2;
              estatusViejeEnCurso = 3;
              articuloEnvase = 5;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              cilindro10 = 4210;
              cilindro20 = 4211;
              cilindro30 = 4212;
              cilindro45 = 4213;
              descuentoPorcentaje = 1;
              descuentoPeso = 2;
              estatusViejeEnCurso = 3;
              articuloEnvase = 5; 
            }

            if(vehiculo && cabeceraFieldName === "custrecord_ptg_no_vehiculo_reg_serv_cil"){
                //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
                var viajeActivoObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejeEnCurso]],
                    columns:[
                       search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                       search.createColumn({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"}),
                    ]
                });
                var viajeActivoObjCount = viajeActivoObj.runPaged().count;
                log.audit("viajeActivoObjCount", viajeActivoObjCount);
                var viajeActivoObjResult = viajeActivoObj.run().getRange({
                    start: 0,
                    end: 2,
                });
                log.audit("viajeActivoObjResult", viajeActivoObjResult);
                if(viajeActivoObjCount > 0){
                numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
                vendedor = viajeActivoObjResult[0].getValue({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"});
                currentRecord.setValue("custrecord_ptg_num_viaje_reg_serv_cil",numeroViaje);
                currentRecord.setValue("custrecord_ptg_vendedor_reg_serv_cil",vendedor);
                } else {
                currentRecord.setValue("custrecord_ptg_num_viaje_reg_serv_cil",'');
                currentRecord.setValue("custrecord_ptg_vendedor_reg_serv_cil",'');
                var options = {
                  title: "Viaje",
                  message: "No hay viaje activo asignado al vehículo seleccionado",};
                  dialog.alert(options);
              }
                

            }


            if(sublistName === idRegistroDeServicios && sublistFieldName === "custrecord_ptg_vehiculo_reg_serv_cil_lin"){
              var vehiculoDestino = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_vehiculo_reg_serv_cil_lin'});
              //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
              var viajeActivoObj = search.create({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculoDestino], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejeEnCurso]],
                  columns:[
                     search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                  ]
              });
              var viajeActivoObjResult = viajeActivoObj.run().getRange({
                  start: 0,
                  end: 2,
              });
              log.audit("viajeActivoObjResult", viajeActivoObjResult);
              numeroViajeDestino = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});

              currentRecord.setCurrentSublistValue({
                sublistId: idRegistroDeServicios,
                fieldId: 'custrecord_ptg_num_vdes_reg_serv_cil_lin',
                value: numeroViajeDestino
              });
            }


            if ((sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cliente_reg_serv_cil_lin') ||
            (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cantidad_reg_serv_cil_lin')  ||
            (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_cil_lin')){
                var idCliente = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cliente_reg_serv_cil_lin'});
                var precioCabecera = parseInt(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cantidad_reg_serv_cil_lin'}));
                var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_cil_lin",});

               if(articuloServCilindros == cilindro10 || articuloServCilindros == cilindro20 || articuloServCilindros == cilindro30 || articuloServCilindros == cilindro45){
                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: idCliente,
                  });
                  var idArray = [];
                  var defaultBillingArray = [];
                  var descuento = 0;
                  var precio = 0;
                  var tipoDescuento = clienteObj.getValue("custentity_ptg_tipo_descuento");
                  log.audit("tipoDescuento", tipoDescuento);
                  var cantidadDescuento = parseFloat(clienteObj.getValue("custentity_ptg_descuento_asignar"));
                  log.audit("cantidadDescuento", cantidadDescuento);
                  var lineCount = clienteObj.getLineCount({ sublistId:'addressbook' })||0;
                  for ( var i = 0; i < lineCount; i++){
                    idArray[i] = clienteObj.getSublistValue({
                      sublistId: "addressbook",
                      fieldId: "id",
                      line: i,
                    }) || "";
                    log.audit("id:", idArray[i]);
          
                    defaultBillingArray[i] = clienteObj.getSublistValue({
                      sublistId: "addressbook",
                      fieldId: "defaultbilling",
                      line: i,
                    }) || "";
                    log.audit("defaultBillingArray:", defaultBillingArray[i]);
          
                    if(defaultBillingArray[i]){
                      var sublistFieldValue = clienteObj.getSublistSubrecord({
                        sublistId: "addressbook",
                        fieldId: 'addressbookaddress',
                        line: i,
                      });
              
                      var idColoniaRuta = sublistFieldValue.getValue("custrecord_ptg_colonia_ruta");
                      log.audit("idColoniaRuta", idColoniaRuta);
              
                      var coloniasRutasObj = record.load({
                        type: "customrecord_ptg_coloniasrutas_",
                        id: idColoniaRuta,
                      });
              
                      var idZonaPrecio = coloniasRutasObj.getValue("custrecord_ptg_zona_de_precio_");
                      log.audit("idZonaPrecio", idZonaPrecio);
              
                      var zonaPrecioObj = record.load({
                        type: "customrecord_ptg_zonasdeprecio_",
                        id: idZonaPrecio,
                      });
              
                      precio = zonaPrecioObj.getValue("custrecord_ptg_precio_kg");
                      log.audit("precio", precio);
                    }
            
                  }

                  if(precio > 0){
                    if(tipoDescuento == descuentoPorcentaje){
                      log.audit("Descuento Porcentaje precio zona");
                      var porcentaje = cantidadDescuento / 100;
                      descuento = precio - (precio * porcentaje);
                      log.audit("descuento pz", descuento);
                    } else if (tipoDescuento == descuentoPeso){
                      log.audit("Descuento Pesos precio zona");
                      descuento = precio - cantidadDescuento;
                      log.audit("descuento pz", descuento);
                    } else if (!tipoDescuento){
                      descuento = precio;
                      log.audit("NO descuento", descuento);
                    }
                  } else {
                    if(tipoDescuento == descuentoPorcentaje){
                      log.audit("Descuento Porcentaje precio cabecera");
                      var porcentaje = cantidadDescuento / 100;
                      descuento = precioCabecera - (precioCabecera * porcentaje);
                      log.audit("descuento c", descuento);
                    } else if (tipoDescuento == descuentoPeso){
                      log.audit("Descuento Pesos precio cabecera");
                      descuento = precioCabecera - cantidadDescuento;
                      log.audit("descuento c", descuento);
                    } else if (!tipoDescuento){
                      log.audit("NO Descuento");
                      descuento = precioCabecera;
                      log.audit("descuento c", descuento);
                    }
                  }

                  if(tipoDescuento == descuentoPorcentaje){//Descuento porcentaje
                    log.audit("Descuento Porcentaje");
                    var porcentaje = cantidadDescuento / 100;
                    var porcentajeSinIVA = porcentaje / 1.16;
                    descuento = precio - (precio * porcentajeSinIVA);
                    log.audit("descuento pz", descuento);
                  } else if (tipoDescuento == descuentoPeso){//Descuento pesos
                    log.audit("Descuento Pesos");
                    var porcentajeSinIVA = cantidadDescuento / 1.16;
                    descuento = precio - porcentajeSinIVA;
                    log.audit("descuento pz", descuento);
                  } else if (!tipoDescuento){
                    descuento = precio;
                    log.audit("NO descuento", descuento);
                  }

                  currentRecord.setCurrentSublistValue({
                    sublistId: idRegistroDeServicios,
                    fieldId: 'custrecord_ptg_zonadeprecio_',
                    value: idZonaPrecio
                  });

                  currentRecord.setCurrentSublistValue({
                    sublistId: idRegistroDeServicios,
                    fieldId: 'custrecord_ptg_precio_reg_serv_cil_lin',
                    //value: descuento.toFixed(2)
                    value: descuento
                  });

                }
              }


              if (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_cil_lin'){
                var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_cil_lin",});
                
                log.audit("articuloServCilindros", articuloServCilindros);
                var itemObj = record.load({
                  id: articuloServCilindros,
                  type: search.Type.INVENTORY_ITEM,
                });
                var tipoArticulo = itemObj.getValue("custitem_ptg_tipodearticulo_");
                if(tipoArticulo == articuloEnvase){
                  var price = 0;
                  price = itemObj.getSublistValue({
                    sublistId: "price1",
                    fieldId: "price_1_",
                    line: 0,
                  });
                  log.audit("price", price);

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_precio_reg_serv_cil_lin',
                  value: price.toFixed(2)
                });
                }
              }

              if ((sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_cil_lin') ||
                (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cantidad_reg_serv_cil_lin')||
              (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_precio_reg_serv_cil_lin')){
                var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_cil_lin",});
                var cantidadLinea = parseInt(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cantidad_reg_serv_cil_lin'}));
                var precioLinea = parseFloat(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_precio_reg_serv_cil_lin'}));
                log.audit("cantidadLinea", cantidadLinea);
                log.audit("precioLinea", precioLinea);

                if(cantidadLinea > 0){
                if(articuloServCilindros == cilindro10 || articuloServCilindros == cilindro20 || articuloServCilindros == cilindro30 || articuloServCilindros == cilindro45){
                var itemObj = record.load({
                  id: articuloServCilindros,
                  type: search.Type.INVENTORY_ITEM,
                });
                var capacidad = parseFloat(itemObj.getValue("custitem_ptg_capacidadcilindro_")) || 1;

                //var capacidadFinal = capacidad / 0.54;
                var capacidadFinal = capacidad;
                log.debug("capacidadFinal", capacidadFinal);

                var subTotal = (cantidadLinea * precioLinea) * capacidadFinal;
                log.debug("subTotal", subTotal);
              } else {
                var subTotal = (cantidadLinea * precioLinea);
              }
                var impuestoLinea = subTotal * .16;
                log.debug("impuestoLinea", impuestoLinea);
                var totalLinea = subTotal * 1.16;
                log.debug("totalLinea", totalLinea);

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_subtotal_registro_servs_',
                  //value: subTotal.toFixed(2)
                  value: subTotal
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_impuesto_reg_serv_cil_lin',
                  //value: impuestoLinea.toFixed(2)
                  value: impuestoLinea
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_total_reg_serv_cil_lin',
                  //value: totalLinea.toFixed(2)
                  value: totalLinea
                });

              } 
              
              }

              

        } catch (error) {
            log.error({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }

    function validateLine(context) {
      try{
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var idRegistroDeServicios = "recmachcustrecord_ptg_id_reg_serv_cil_lin";
      var tipoServicio = currentRecord.getValue("custrecord_ptg_tipo_servici_reg_serv_cil");
      var totalCabeceraPF = 0;
      var total = 0;
      var idPublicoGeneral = 0;
      var efectivoId = 0;
      var tarjetaCreditoId = 0;
      var tarjetaDebitoId = 0;
      var consumoInternoId = 0;
      var ticketCardId = 0;
      var recirculacionId = 0;
      var canceladoId = 0;
      var traspasoId = 0;
      var tarjetaCreditoBancomerId = 0;
      var tarjetaCreditoHSBCId = 0;
      var tarjetaCreditoBanamexId = 0;
      var tarjetaDebitoBanamexId = 0;
      var tarjetaDebitoBancomerId = 0;
      var tarjetaDebitoHSBCId = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        idPublicoGeneral = 14508;
        efectivoId = 1;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        consumoInternoId = 12;
        ticketCardId = 19;
        recirculacionId = 21;
        canceladoId = 22;
        traspasoId = 25;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        idPublicoGeneral = 27041;
        efectivoId = 1;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        consumoInternoId = 12;
        ticketCardId = 19;
        recirculacionId = 21;
        canceladoId = 22;
        traspasoId = 25;  
        tarjetaCreditoBancomerId = 31;
        tarjetaCreditoHSBCId = 32;
        tarjetaCreditoBanamexId = 33;
        tarjetaDebitoBanamexId = 34;
        tarjetaDebitoBancomerId = 35;
        tarjetaDebitoHSBCId = 36;
      }

      if (sublistName === idRegistroDeServicios) {
        var clienteServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cliente_reg_serv_cil_lin",});
        var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_cil_lin",});
        var cantidadServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_reg_serv_cil_lin",});
        var precioUnitarioServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_precio_reg_serv_cil_lin",});
        var formaPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_form_pago_reg_serv_cil_li",});
        var referencia = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_referencia_",});
        var vehiculoDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_vehiculo_reg_serv_cil_lin",});
        var numeroViajeDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_num_vdes_reg_serv_cil_lin",});
        var totalServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_total_reg_serv_cil_lin",});
        var totalServCilindrosOld = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_tot_ctrl_reg_serv_cil_lin",});

        if (!clienteServCilindros || !articuloServCilindros || !cantidadServCilindros || !precioUnitarioServCilindros || !formaPago){
        log.debug("formaPago", formaPago);
          var options = {
            title: "Faltan datos",
            message: "Faltan datos en la línea",
          };
          dialog.alert(options);
          return false;
        } else {
          log.audit("DATOS OK");
          var totalCabecera = currentRecord.getValue("custrecord_ptg_total_reg_serv_cil") || 0;


          if((formaPago != efectivoId) && (formaPago != tarjetaCreditoId) && (formaPago != tarjetaDebitoId) && (formaPago != consumoInternoId) && (formaPago != recirculacionId) && (formaPago != canceladoId) && (formaPago != traspasoId) && (formaPago != tarjetaCreditoBancomerId) && (formaPago != tarjetaCreditoHSBCId) && (formaPago != tarjetaCreditoBanamexId) && (formaPago != tarjetaDebitoBanamexId) && (formaPago != tarjetaDebitoBancomerId) && (formaPago != tarjetaDebitoHSBCId) && clienteServCilindros == idPublicoGeneral){
            var options = {
              title: "Restricción",
              message: "No se puede registrar el servicio a Público General.",
            };
            dialog.alert(options);
            return false;
          } else if ((formaPago == traspasoId) && (!vehiculoDestino || !numeroViajeDestino)){
            var options = {
              title: "Faltan datos",
              message: "Se requiere el vehículo y el número de viaje destino.",
            };
            dialog.alert(options);
            return false;
          } else if ((formaPago == tarjetaCreditoId || formaPago == tarjetaDebitoId || formaPago == ticketCardId || formaPago == tarjetaCreditoBancomerId || formaPago == tarjetaCreditoHSBCId || formaPago == tarjetaCreditoBanamexId || formaPago == tarjetaDebitoBanamexId || formaPago == tarjetaDebitoBancomerId || formaPago == tarjetaDebitoHSBCId) && (!referencia)){
            var options = {
              title: "Faltan datos",
              message: "Se requiere referencia del pago.",
            };
            dialog.alert(options);
            return false;
          } else {
            totalCabeceraPF = parseFloat(totalCabecera);
            log.emergency("totalCabeceraPF", totalCabeceraPF);
            total = totalCabeceraPF + totalServCilindros;
            log.emergency("total", total);
            currentRecord.setValue("custrecord_ptg_total_reg_serv_cil", total);

            if(!totalServCilindrosOld){
              totalCabeceraPF = parseFloat(totalCabecera);
              total = totalCabeceraPF + totalServCilindros;
              currentRecord.setValue("custrecord_ptg_total_reg_serv_cil", total);
              currentRecord.setCurrentSublistValue({
                sublistId: idRegistroDeServicios,
                fieldId: 'custrecord_ptg_tot_ctrl_reg_serv_cil_lin',
                value: totalServCilindros
              });
            } else {
              totalCabeceraPF = parseFloat(totalCabecera);
              total = totalCabeceraPF - totalServCilindrosOld;
              totalFinal = total + totalServCilindros;
              currentRecord.setValue("custrecord_ptg_total_reg_serv_cil", totalFinal);
              currentRecord.setCurrentSublistValue({
                sublistId: idRegistroDeServicios,
                fieldId: 'custrecord_ptg_tot_ctrl_reg_serv_cil_lin',
                value: totalServCilindros
              });
            }

            return true;
          }
          
        }
      }
    } catch (error) {
      log.error({
          title: "error validateLine",
          details: JSON.stringify(error),
      });
  }
    }

    function pasarPreliquidacion() {
      try {
        log.audit("pasarPreliquidacion cs");
        var urlPreliquidacion = '';
          
          recObj = currentRecord.get();
          log.debug("recObj", recObj);
  
          var recordObj = record.load({
            type: recObj.type,
            id: recObj.id,
          });
          var servicioCilindro = 0;
          var servicioEstacionario = 0;
          var urlCilindros = "";
          var urlEstacionarios = "";
          var etapaProcesado = 0;

          if (runtime.envType === runtime.EnvType.SANDBOX) {
            servicioCilindro = 1;
            servicioEstacionario = 2;
            urlCilindros = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=497&whence=&vehiculo=';
            urlEstacionarios = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=495&whence=&vehiculo=';
            etapaProcesado = 2;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            servicioCilindro = 1;
            servicioEstacionario = 2;
            urlCilindros = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=585&whence=&vehiculo=';
            urlEstacionarios = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=659&whence=&vehiculo=';
            etapaProcesado = 2;
          }

          var numeViaje = recordObj.getValue("custrecord_ptg_num_viaje_reg_serv_cil");
          log.audit("numeViaje", numeViaje);

          var vehiculo = recordObj.getValue("custrecord_ptg_no_vehiculo_reg_serv_cil");
          log.audit("vehiculo", vehiculo);

          var tipoServicio = recordObj.getValue("custrecord_ptg_tipo_servici_reg_serv_cil");
          log.audit("tipoServicio CS", tipoServicio);

          if(tipoServicio == servicioCilindro){
            urlPreliquidacion = urlCilindros;
          } 
          else if(tipoServicio == servicioEstacionario){
            urlPreliquidacion = urlEstacionarios;
          }

          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_etapa_reg_serv_cil : etapaProcesado}
          });
  
          var urll = location;
            log.debug("urll_2", urll);
  
            var urlll = location.href;
            log.audit("urlll_2", urlll);
  
          var url = location.href;
          log.debug('url_2', url);
          location.replace(url);
  
          var urlRedirect = urlPreliquidacion+vehiculo+'&noviaje='+numeViaje;
          log.debug("urlRedirect", urlRedirect);
          window.open(urlRedirect, '_blank');
  
      } catch (e) {
          log.error("Error", "[ pasarPreliquidacion ] " + e);
      }
  
  };

  function validateDelete(context) {
    try {

      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;

      if (sublistName === "recmachcustrecord_ptg_id_reg_serv_cil_lin"){
        if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_tot_ctrl_reg_serv_cil_lin",}) > 0){
          var cantidad = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_tot_ctrl_reg_serv_cil_lin",});
          var cantidadLitros = parseFloat(cantidad);

          if (cantidad) {

            var totalCabecera = currentRecord.getValue("custrecord_ptg_total_reg_serv_cil");
            if(totalCabecera){
              var totalCabeceraPF = parseFloat(totalCabecera);
              total = totalCabeceraPF - cantidadLitros;
              currentRecord.setValue("custrecord_ptg_total_reg_serv_cil", total);
            }
            
          }
          
        }
      }
    
      return true;
    } catch (error) {
      console.log({
        title: "error validateDelete",
        details: JSON.stringify(error),
      });
    }
    
  }

  function lineInit(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var idRegistroDeServicios = 'recmachcustrecord_ptg_id_reg_serv_cil_lin';
      var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_cil");
      if (sublistName === idRegistroDeServicios) {
        currentRecord.setCurrentSublistValue({
          sublistId: idRegistroDeServicios, 
          fieldId: "custrecord_ptg_precio_reg_serv_cil_lin", 
          value: precioCabecera,
        });
      }
    } catch (error) {
      log.error("Error lineInit", error);
    }
  }

  function saveRecord(context) {
    try {
      var currentRecord = context.currentRecord;
      var vehiculo = currentRecord.getValue("custrecord_ptg_no_vehiculo_reg_serv_cil");
      var numViaje = currentRecord.getValue("custrecord_ptg_num_viaje_reg_serv_cil");

      var preliquidacionObj = search.create({
        type: "customrecord_ptg_preliquicilndros_",
        filters: [
           ["custrecord_ptg_nodevehiculo_prelicil_","anyof",vehiculo], "AND", 
           ["custrecord_ptg_numdeviaje_","anyof",numViaje]
        ],
        columns: [
          search.createColumn({name: "internalid", label: "ID interno"})
        ]
      });
      var preliquidacionObjCount = preliquidacionObj.runPaged().count;

      //Validación que bloquea si ya hay una preliquidación no permite guardar
      if(preliquidacionObjCount > 0){
        var options = {
          title: "Acción No Permitida",
          message: "Existe una preliquidación creada con el número de viaje",
        };
        dialog.alert(options);
        return false
      } else {
        return true
      }
    } catch (error) {
      log.audit("error saveRecord", error);
    }
 }
    
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        validateLine: validateLine,
        validateDelete: validateDelete,
        //lineInit: lineInit,
        pasarPreliquidacion: pasarPreliquidacion,
        saveRecord: saveRecord,
    };
});
