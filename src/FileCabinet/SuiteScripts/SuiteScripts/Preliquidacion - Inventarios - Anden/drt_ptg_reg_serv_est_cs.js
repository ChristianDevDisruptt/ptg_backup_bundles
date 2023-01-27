/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - Registro de Servicios Estacionario
 * Script id: customscript_drt_ptg_reg_serv_est_cs
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_est_cs
 * Applied to: PTG - Registro de Servicios Estacionario
 * File: drt_ptg_reg_serv_est_cs.js
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
            currentRecord.setValue("custrecord_ptg_etapa_reg_serv_est", 1);

        } catch (error) {
            log.debug({
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
            var numViaje = currentRecord.getValue("custrecord_ptg_num_viaje_reg_serv_est");
            var vehiculo = currentRecord.getValue("custrecord_ptg_no_vehiculo_reg_serv_est");
            var idRegistroDeServicios = 'recmachcustrecord_ptg_id_reg_serv_est_lin';
            var planta = currentRecord.getValue("custrecord_ptg_planta_reg_serv_est");
            var sublistFieldName = context.fieldId;
            var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_est");
            var fechaInicio = currentRecord.getValue("custrecord_ptg_fecha_inicio_reg_serv_est");
            var fechaFin = currentRecord.getValue("custrecord_ptg_fecha_fin_reg_serv_est");
            var element = document.getElementById("btn_multibutton_submitter");
            var nombreBoton = document.getElementById("btn_multibutton_submitter").value;
            log.audit("fechaInicio", fechaInicio);
            log.audit("fechaFin", fechaFin);
            log.audit("element", element);
            log.audit("nombreBoton", nombreBoton);
            var descuentoPorcentaje = 0;
            var descuentoPeso = 0;
            var servicioEstacionario = 0;
            var estatusViejeEnCurso = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
              descuentoPorcentaje = 1;
              descuentoPeso = 2;
              servicioEstacionario = 2;
              estatusViejeEnCurso = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              descuentoPorcentaje = 1;
              descuentoPeso = 2;
              servicioEstacionario = 2;
              estatusViejeEnCurso = 3;
            }

            if((fechaInicio && cabeceraFieldName === "custrecord_ptg_fecha_inicio_reg_serv_est") || (fechaFin && cabeceraFieldName === "custrecord_ptg_fecha_fin_reg_serv_est")){
              element.value = "Conciliar";
              currentRecord.setValue("custrecord_ptg_etapa_reg_serv_est", 3);
            } else if ((!fechaInicio && cabeceraFieldName === "custrecord_ptg_fecha_inicio_reg_serv_est") && (!fechaFin && cabeceraFieldName === "custrecord_ptg_fecha_fin_reg_serv_est")){
              element.value = "Guardar";
              currentRecord.setValue("custrecord_ptg_etapa_reg_serv_est", 1);
            }

            if(vehiculo && cabeceraFieldName === "custrecord_ptg_no_vehiculo_reg_serv_est"){
                //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
                var viajeActivoObj = search.create({
                    type: "customrecord_ptg_tabladeviaje_enc2_",
                    filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejeEnCurso]],
                    columns:[
                       search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                       search.createColumn({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"}),
                       search.createColumn({name: "custrecord_ptg_ruta", label: "PTG - Ruta"}),
                       search.createColumn({name: "custrecord_ptg_servicioestacionario_", label: "PTG - Servicio Estacionarios"})
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
                ruta = viajeActivoObjResult[0].getValue({name: "custrecord_ptg_ruta", label: "PTG - Ruta"});
                servicioEstacionario = viajeActivoObjResult[0].getValue({name: "custrecord_ptg_servicioestacionario_", label: "PTG - Servicio Estacionarios"});
                currentRecord.setValue("custrecord_ptg_num_viaje_reg_serv_est",numeroViaje);
                currentRecord.setValue("custrecord_ptg_vendedor_reg_serv_est",vendedor);
                log.debug("servicioEstacionario", servicioEstacionario);

                if (servicioEstacionario){
                  //BÚSQUEDA GUARDADA: PTG - Precio Por Vehiculo SS
                  currentRecord.setValue("custrecord_ptg_tipo_servici_reg_serv_est", servicioEstacionario);
                  var precioPorVehiculoEstacionario = search.create({
                    type: "customrecord_ptg_coloniasrutas_",
                    filters: [
                      ["custrecord_ptg_rutaest_","anyof",ruta]
                    ],
                    columns: [
                       search.createColumn({name: "custrecord_ptg_precio_", join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_", label: "PTG - PRECIO"})
                    ]
                  });
                  var precioPorVehiculoEstacionarioResult = precioPorVehiculoEstacionario.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  log.audit("precioPorVehiculoEstacionarioResult", precioPorVehiculoEstacionarioResult);
                  precioPorZona = precioPorVehiculoEstacionarioResult[0].getValue({name: "custrecord_ptg_precio_", join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_", label: "PTG - PRECIO"});
                }
                if(numeroViaje){
                  //SS: PTG - Entrada Pipas Litros SS
                  var entradaPipaObj = search.create({
                    type: "customrecord_ptg_entrada_pipas_",
                    filters: [
                      ["custrecord_ptg_vehiculoentrada_","anyof",vehiculo], "AND", 
                      ["custrecord_ptg_numviaje_entradapipa_","anyof",numeroViaje]
                    ],
                    columns: [
                      search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                      search.createColumn({name: "custrecord_ptg_lts_totali_entrada_pipa_", label: "PTG - Litros totalizador entrada pipa"})
                    ]
                  });
                  var entradaPipaObjCount = entradaPipaObj.runPaged().count;
                  if(entradaPipaObjCount > 0){
                    var entradaPipaObjResult = entradaPipaObj.run().getRange({
                      start: 0,
                      end: 2,
                    });
                    litrosEntrada = entradaPipaObjResult[0].getValue({name: "custrecord_ptg_lts_totali_entrada_pipa_", label: "PTG - Litros totalizador entrada pipa"});

                    var salidaPipaObj = search.create({
                      type: "customrecord_ptg_registro_salida_pipas_",
                      filters: [
                        ["custrecord_ptg_salida_pipa_","anyof",vehiculo], "AND", 
                        ["custrecord_ptg_numviaje_salida_pipa","anyof",numeroViaje]
                      ],
                      columns: [
                        search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "ID interno"}),
                        search.createColumn({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida"})
                      ]
                    });
                    var salidaPipaObjResult = salidaPipaObj.run().getRange({
                      start: 0,
                      end: 2,
                    });
                    litrosSalida = salidaPipaObjResult[0].getValue({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida"});
                    var diferenciaLitros = litrosEntrada - litrosSalida;
                    currentRecord.setValue("custrecord_ptg_reportadosvi_reg_serv_est", diferenciaLitros);

                  } else {
                    var options = {
                      title: "Entrada vehículo",
                      message: "No hay viaje registro de Entrada",};
                      dialog.alert(options);
                  }

                }
                

              } else {
                currentRecord.setValue("custrecord_ptg_num_viaje_reg_serv_est",'');
                currentRecord.setValue("custrecord_ptg_vendedor_reg_serv_est",'');
                var options = {
                  title: "Viaje",
                  message: "No hay viaje activo asignado al vehículo seleccionado",};
                  dialog.alert(options);
              }
                
            }

            if(planta && cabeceraFieldName === "custrecord_ptg_planta_reg_serv_est"){
              var ubicacionObj = record.load({
                type: record.Type.LOCATION,
                id: planta,
              });
              var precioPlanta = ubicacionObj.getValue("custrecord_ptg_precioplanta_");
              
              currentRecord.setValue("custrecord_ptg_precio_reg_serv_est", precioPlanta);
            }

            if(sublistName === idRegistroDeServicios && sublistFieldName === "custrecord_ptg_vehiculo_reg_serv_est_lin"){
              var vehiculoDestino = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_vehiculo_reg_serv_est_lin'});
              //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
              var viajeActivoObj = search.create({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculoDestino], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejeEnCurso]],
                  columns:[
                     search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                  ]
              });
              var viajeActivoObjCount = viajeActivoObj.runPaged().count;
              var viajeActivoObjResult = viajeActivoObj.run().getRange({
                  start: 0,
                  end: 2,
              });
              log.audit("viajeActivoObjResult", viajeActivoObjResult);
              if(viajeActivoObjCount > 0){
                numeroViajeDestino = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_num_vdes_reg_serv_est_lin',
                  value: numeroViajeDestino
                });
              } else {
                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_num_vdes_reg_serv_est_lin',
                  value: ''
                });
                var options = {
                  title: "Viaje",
                  message: "No hay viaje activo asignado al vehículo seleccionado",};
                  dialog.alert(options);
              }
            }


            if (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cliente_reg_serv_est_lin'){
                var idCliente = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cliente_reg_serv_est_lin'});
                var precioCabecera = parseInt(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cantidad_reg_serv_est_lin'}));

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
              
                      precio = zonaPrecioObj.getValue("custrecord_ptg_precio_");
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
                      log.audit("No descuento");
                      descuento = precio;
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
                      log.audit("No descuento");
                      descuento = precio;
                    }
                  }

                  currentRecord.setCurrentSublistValue({
                    sublistId: idRegistroDeServicios,
                    fieldId: 'custrecord_ptg_precio_reg_serv_est_lin',
                    value: descuento.toFixed(4)
                  });

                  currentRecord.setCurrentSublistValue({
                    sublistId: idRegistroDeServicios,
                    fieldId: 'custrecord_ptg_zonadeprecio_',
                    value: idZonaPrecio
                  });
              }


              if (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_est_lin'){
                var idCliente = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cliente_reg_serv_est_lin'});
                log.audit("idCliente", idCliente);
              }

              if ((sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_est_lin') ||
                (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cantidad_reg_serv_est_lin')){
                var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_est_lin",});
                var cantidadLinea = parseFloat(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cantidad_reg_serv_est_lin'}));
                var precioLinea = parseFloat(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_precio_reg_serv_est_lin'}));

                var subTotal = (cantidadLinea * precioLinea);
              
                var impuestoLinea = subTotal * .16;
                log.debug("impuestoLinea", impuestoLinea);
                var totalLinea = subTotal * 1.16;
                log.debug("totalLinea", totalLinea);

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_subtotal_registro_servs_e',
                  value: subTotal.toFixed(2)
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_impuesto_reg_serv_est_lin',
                  value: impuestoLinea.toFixed(2)
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_total_reg_serv_est_lin',
                  value: totalLinea.toFixed(2)
                });
              
              }

              
              if (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cliente_reg_serv_est_lin'){
                var idCliente = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cliente_reg_serv_est_lin'});

                var clienteObj = record.load({
                    type: record.Type.CUSTOMER,
                    id: idCliente,
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
              
                    }
            
                  }

                  currentRecord.setCurrentSublistValue({
                    sublistId: idRegistroDeServicios,
                    fieldId: 'custrecord_ptg_zonadeprecio_est',
                    value: idZonaPrecio
                  });
              }

              if(precioCabecera && cabeceraFieldName === "custrecord_ptg_precio_reg_serv_est"){
                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_precio_reg_serv_est_lin',
                  value: precioCabecera
                });
              }

              

        } catch (error) {
            log.error({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }


    function lineInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var idRegistroDeServicios = 'recmachcustrecord_ptg_id_reg_serv_est_lin';
        var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_est");
        if (sublistName === idRegistroDeServicios) {
          currentRecord.setCurrentSublistValue({
            sublistId: idRegistroDeServicios, 
            fieldId: "custrecord_ptg_precio_reg_serv_est_lin", 
            value: precioCabecera,
          });
        }
      } catch (error) {
        log.error("Error lineInit", error);
      }
    }


    function validateLine(context) {
      try{
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var idRegistroDeServicios = "recmachcustrecord_ptg_id_reg_serv_est_lin";
      var tipoServicio = currentRecord.getValue("custrecord_ptg_tipo_servici_reg_serv_est");
      var totalCabeceraPF = 0;
      var total = 0;
      var idPublicoGeneral = 0;
      var efectivoId = 0;
      var consumoInternoId = 0;
      var recirculacionId = 0;
      var canceladoId = 0;
      var rellenoId = 0;
      var traspasoId = 0;
      var tarjetaCreditoId = 0;
      var tarjetaDebitoId = 0;
      var tarjetaCreditoBancomerId = 0;
      var tarjetaCreditoHSBCId = 0;
      var tarjetaCreditoBanamexId = 0;
      var tarjetaDebitoBanamexId = 0;
      var tarjetaDebitoBancomerId = 0;
      var tarjetaDebitoHSBCId = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        idPublicoGeneral = 14508;
        efectivoId = 1;
        consumoInternoId = 12;
        recirculacionId = 21;
        canceladoId = 22;
        rellenoId = 23;
        traspasoId = 25;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        idPublicoGeneral = 14508;
        efectivoId = 1;
        consumoInternoId = 12;
        recirculacionId = 21;
        canceladoId = 22;
        rellenoId = 23;
        traspasoId = 25;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;  
        tarjetaCreditoBancomerId = 31;
        tarjetaCreditoHSBCId = 32;
        tarjetaCreditoBanamexId = 33;
        tarjetaDebitoBanamexId = 34;
        tarjetaDebitoBancomerId = 35;
        tarjetaDebitoHSBCId = 36;
      }

      if (sublistName === idRegistroDeServicios) {
        var clienteServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cliente_reg_serv_est_lin",});
        var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_est_lin",});
        var cantidadServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_reg_serv_est_lin",});
        var precioUnitarioServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_precio_reg_serv_est_lin",});
        var formaPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_form_pago_reg_serv_est_li",});
        var vehiculoDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_vehiculo_reg_serv_est_lin",});
        var numeroViajeDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_num_vdes_reg_serv_est_lin",});
        var kilometraje = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_kilometraje_serv_est_lin",});
        var cantidadServCilindrosOld = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cant_old_reg_serv_est_lin",});
        var estacionCarburacion = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_esta_car_reg_serv_est_lin",});
        var referenciaCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_referencia_est",});


          if ((!clienteServCilindros || !articuloServCilindros || !cantidadServCilindros || !precioUnitarioServCilindros || !formaPago)||
        (formaPago == tarjetaCreditoId || formaPago == tarjetaDebitoId || formaPago == tarjetaCreditoBancomerId || formaPago == tarjetaCreditoHSBCId || formaPago == tarjetaCreditoBanamexId || formaPago == tarjetaDebitoBanamexId || formaPago == tarjetaDebitoBancomerId || formaPago == tarjetaDebitoHSBCId) && !referenciaCilindros){
  
          var options = {
            title: "Faltan datos",
            message: "Faltan datos en la línea",
          };
          dialog.alert(options);
          return false;
        } else {
          log.audit("DATOS OK");

              var totalCabecera = currentRecord.getValue("custrecord_ptg_litros_acumu_reg_serv_est") || 0;
              log.emergency("totalCabecera", totalCabecera);            

              if(formaPago == canceladoId && cantidadServCilindros > 8){
                var options = {
                  title: "Cantidad",
                  message: "La cantidad de litros permitidos ha sido superada",
                };
                dialog.alert(options);
                return false;
              } if(formaPago == rellenoId && cantidadServCilindros > traspasoId){
                var options = {
                  title: "Cantidad",
                  message: "La cantidad de litros permitidos ha sido superada",
                };
                dialog.alert(options);
                return false;
              } else if((formaPago != efectivoId) && (formaPago != tarjetaCreditoId) && (formaPago != tarjetaDebitoId) && (formaPago != consumoInternoId) && (formaPago != recirculacionId) && (formaPago != canceladoId) && (formaPago != rellenoId) && (formaPago != traspasoId) && (formaPago != tarjetaCreditoBancomerId) && (formaPago != tarjetaCreditoHSBCId) && (formaPago != tarjetaCreditoBanamexId) && (formaPago != tarjetaDebitoBanamexId) && (formaPago != tarjetaDebitoBancomerId) && (formaPago != tarjetaDebitoHSBCId) && clienteServCilindros == idPublicoGeneral){
                log.audit("Cliente y credito");
                var options = {
                  title: "Restricción",
                  message: "No se puede registrar el servicio a Público General.",
                };
                dialog.alert(options);
                return false;
              } else if((formaPago == consumoInternoId || formaPago == recirculacionId || formaPago == canceladoId || formaPago == rellenoId || formaPago == traspasoId) && clienteServCilindros != idPublicoGeneral){
                var options = {
                  title: "Restricción",
                  message: "El registro del servicio debe ser a Público General.",
                };
                dialog.alert(options);
                return false;
              } else if(formaPago == traspasoId || formaPago == consumoInternoId){
                log.emergency("formaPago", formaPago);
                if((vehiculoDestino && (!numeroViajeDestino || !kilometraje)) || (!vehiculoDestino && (!estacionCarburacion))){
                  log.emergency("vehiculoDestino", vehiculoDestino);
                  log.emergency("numeroViajeDestino", numeroViajeDestino);
                  log.emergency("kilometraje", kilometraje);
                  log.emergency("estacionCarburacion", estacionCarburacion);
                  var options = {
                    title: "Faltan datos",
                    message: "Faltan datos en la línea",
                  };
                  dialog.alert(options);
                  return false;
                } else {
                  if(vehiculoDestino){
                    var equipoObj = record.load({
                      type: "customrecord_ptg_equipos",
                      id: vehiculoDestino,
                    });
                    var kilometrajeGuardado = parseFloat(equipoObj.getValue("custrecord_ptg_kilometraje_equipo_"));
                    log.emergency("kilometrajeGuardado", kilometrajeGuardado);
                    var maximoKilometros = kilometrajeGuardado + 2000;
                    log.emergency("maximoKilometros", maximoKilometros);
                    if((kilometraje < maximoKilometros) && (kilometraje > kilometrajeGuardado)){
                      totalCabeceraPF = parseFloat(totalCabecera);
                      log.emergency("totalCabeceraPF", totalCabeceraPF);
                      total = totalCabeceraPF + cantidadServCilindros;
                      log.emergency("total", total);
                      log.emergency("OK pasa", total);
                      currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", total);
      
                      if(!cantidadServCilindrosOld){
                        totalCabeceraPF = parseFloat(totalCabecera);
                        total = totalCabeceraPF + cantidadServCilindros;
                        currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", total);
                        currentRecord.setCurrentSublistValue({
                          sublistId: idRegistroDeServicios,
                          fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                          value: cantidadServCilindros
                        });
                      } else {
                        totalCabeceraPF = parseFloat(totalCabecera);
                        total = totalCabeceraPF - cantidadServCilindrosOld;
                        totalFinal = total + cantidadServCilindros;
                        currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", totalFinal);
                        currentRecord.setCurrentSublistValue({
                          sublistId: idRegistroDeServicios,
                          fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                          value: cantidadServCilindros
                        });
                      }
        
                      return true;
                    } else {
                      log.emergency("NO OK pasa");
                      var options = {
                        title: "Kilometraje",
                        message: "Kilometraje no válido, el kilometraje no debe ser menor al registrado menor actualmente ("+ kilometrajeGuardado +"), ni mayor al permitido ("+maximoKilometros+").",
                      };
                      dialog.alert(options);
                      return false;
                    }
                  } else if (estacionCarburacion){
                    if(!cantidadServCilindrosOld){
                      totalCabeceraPF = parseFloat(totalCabecera);
                      total = totalCabeceraPF + cantidadServCilindros;
                      currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", total);
                      currentRecord.setCurrentSublistValue({
                        sublistId: idRegistroDeServicios,
                        fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                        value: cantidadServCilindros
                      });
                    } else {
                      totalCabeceraPF = parseFloat(totalCabecera);
                      total = totalCabeceraPF - cantidadServCilindrosOld;
                      totalFinal = total + cantidadServCilindros;
                      currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", totalFinal);
                      currentRecord.setCurrentSublistValue({
                        sublistId: idRegistroDeServicios,
                        fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                        value: cantidadServCilindros
                      });
                    }
      
                    return true;
                  }
                }
              }else {
              
              if(!cantidadServCilindrosOld){
                totalCabeceraPF = parseFloat(totalCabecera);
                total = totalCabeceraPF + cantidadServCilindros;
                currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", total);
                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                  value: cantidadServCilindros
                });
              } else {
                totalCabeceraPF = parseFloat(totalCabecera);
                total = totalCabeceraPF - cantidadServCilindrosOld;
                totalFinal = total + cantidadServCilindros;
                currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", totalFinal);
                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_cant_old_reg_serv_est_lin',
                  value: cantidadServCilindros
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


    function validateDelete(context) {
      try {
  
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
  
        if (sublistName === "recmachcustrecord_ptg_id_reg_serv_est_lin"){
          if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_reg_serv_est_lin",}) > 0){
            var cantidad = currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_reg_serv_est_lin",});
            var cantidadLitros = parseFloat(cantidad);
  
            if (cantidad) {
  
              var totalCabecera = currentRecord.getValue("custrecord_ptg_litros_acumu_reg_serv_est");
              if(totalCabecera){
                var totalCabeceraPF = parseFloat(totalCabecera);
                total = totalCabeceraPF - cantidadLitros;
                currentRecord.setValue("custrecord_ptg_litros_acumu_reg_serv_est", total);
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


    function saveRecord(context) {
      try {
        var currentRecord = context.currentRecord;
        var litrosRepostadosEntrada = currentRecord.getValue("custrecord_ptg_reportadosvi_reg_serv_est")||0;
        var litrosAcumulados = currentRecord.getValue("custrecord_ptg_litros_acumu_reg_serv_est");
        var vehiculo = currentRecord.getValue("custrecord_ptg_no_vehiculo_reg_serv_est");
        var numViaje = currentRecord.getValue("custrecord_ptg_num_viaje_reg_serv_est");

        //SS: PTG - PreLiquidacion Estacionarios Fact SS
        var preliquidacionObj = search.create({
          type: "customrecord_ptg_preliq_estacionario_",
          filters: [
             ["custrecord_ptg_vehiculo_preliqest_","anyof",vehiculo], "AND", 
             ["custrecord_ptg_nodeviaje_preliq_est_","anyof",numViaje]
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
          return false;
        } else {
          return true;
        }

        /*if (litrosAcumulados == litrosRepostadosEntrada) {
          log.audit("entra true");
          return true;
        } else {
          var options = {
            title: "Totales no coinciden",
            message: "La suma de los litros totales de las líneas " + litrosAcumulados + " no coincide con los litros reportados " + litrosRepostadosEntrada,
          };
          dialog.alert(options);
        }*/

      } catch (error) {
        log.audit("error saveRecord", error);
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
            urlCilindros = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=497&whence=&vehiculo=';
            urlEstacionarios = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=495&whence=&vehiculo=';
            etapaProcesado = 2;
          }




          var numeViaje = recordObj.getValue("custrecord_ptg_num_viaje_reg_serv_est");
          log.audit("numeViaje", numeViaje);

          var vehiculo = recordObj.getValue("custrecord_ptg_no_vehiculo_reg_serv_est");
          log.audit("vehiculo", vehiculo);

          var tipoServicio = recordObj.getValue("custrecord_ptg_tipo_servici_reg_serv_est");
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
              values: {custrecord_ptg_etapa_reg_serv_est : etapaProcesado}
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
    
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        validateLine: validateLine,
        validateDelete: validateDelete,
        pasarPreliquidacion: pasarPreliquidacion,
        lineInit: lineInit,
        saveRecord: saveRecord
    };
});
