/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Registro de Servicios Carbura CS
 * Script id: customscript_drt_ptg_reg_serv_carb_cs
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_carb_cs
 * Applied to: PTG - Registro de Servicios Carburación
 * File: drt_ptg_reg_serv_carb_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/currentRecord", "N/ui/dialog", "N/runtime"], function (record, search, error, currentRecord, dialog, runtime) {
    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var sublistName = context.sublistId;
            var idRegistroDeServicios = 'recmachcustrecord_ptg_id_reg_serv_car_lin';
            var sublistFieldName = context.fieldId;
            var estacionCarburacion = currentRecord.getValue("custrecord_ptg_estacion_reg_serv_carb");
            var articuloCilindro = 0;
            var estatusViejaEnCurso = 0;
            var articuloEnvase = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
              articuloCilindro = 1;
              estatusViejaEnCurso = 3;
              articuloEnvase = 5;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              articuloCilindro = 1;
              estatusViejaEnCurso = 3;
              articuloEnvase = 5;
            }

            if(estacionCarburacion && cabeceraFieldName === "custrecord_ptg_estacion_reg_serv_carb"){
              var ubicacionObj = record.load({
                type: record.Type.LOCATION,
                id: estacionCarburacion
              });
              var precioEstacion = ubicacionObj.getValue("custrecord_ptg_precio_est_carb_") || 0;
              currentRecord.setValue("custrecord_ptg_precio_reg_serv_carb", precioEstacion);
            }

            if(sublistName === idRegistroDeServicios && sublistFieldName === "custrecord_ptg_vehiculo_reg_serv_car_lin"){
              var vehiculoDestino = currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_vehiculo_reg_serv_car_lin'});
              //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
              var viajeActivoObj = search.create({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculoDestino], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViejaEnCurso]],
                  columns:[
                     search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                  ]
              });
              var viajeActivoObjResult = viajeActivoObj.run().getRange({
                  start: 0,
                  end: 2,
              });
              numeroViajeDestino = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});

              currentRecord.setCurrentSublistValue({
                sublistId: idRegistroDeServicios,
                fieldId: 'custrecord_ptg_num_vdes_reg_serv_car_lin',
                value: numeroViajeDestino
              });
            }

            var precioLineaTst = parseFloat(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_precio_reg_serv_car_lin'}));
            if ((sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cantidad_reg_serv_car_lin') &&
            !precioLineaTst){
              var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_carb");
               currentRecord.setCurrentSublistValue({
                 sublistId: idRegistroDeServicios,
                 fieldId: 'custrecord_ptg_precio_reg_serv_car_lin',
                 value: precioCabecera
               });
              }

            if (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_car_lin'){
              var articuloServCarburacion = currentRecord.getCurrentSublistValue({ sublistId: idRegistroDeServicios, fieldId: "custrecord_ptg_articulo_reg_serv_car_lin",});
              var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_carb");
              var itemObj = record.load({
                id: articuloServCarburacion,
                type: search.Type.INVENTORY_ITEM,
              });
              var tipoArticulo = itemObj.getValue("custitem_ptg_tipodearticulo_");
              var price = 0;
              if(tipoArticulo == articuloEnvase){
                price = itemObj.getSublistValue({
                  sublistId: "price1",
                  fieldId: "price_1_",
                  line: 0,
                });
              } else {
                price = precioCabecera;
              }
              log.audit("price", price);
                
              currentRecord.setCurrentSublistValue({
                sublistId: idRegistroDeServicios,
                fieldId: 'custrecord_ptg_precio_reg_serv_car_lin',
                value: price
              });
             

            }

              if (//(sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_articulo_reg_serv_car_lin') ||
                (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_cantidad_reg_serv_car_lin')||
              (sublistName === idRegistroDeServicios && sublistFieldName === 'custrecord_ptg_precio_reg_serv_car_lin')){
                
                var articuloServCarburacion = currentRecord.getCurrentSublistValue({ sublistId: idRegistroDeServicios, fieldId: "custrecord_ptg_articulo_reg_serv_car_lin",});
                var cantidadLinea = parseInt(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_cantidad_reg_serv_car_lin'}));
                var precioLinea = parseFloat(currentRecord.getCurrentSublistValue({sublistId: idRegistroDeServicios, fieldId: 'custrecord_ptg_precio_reg_serv_car_lin'}));
                var precioCabecera = currentRecord.getValue("custrecord_ptg_precio_reg_serv_carb");
                var itemObj = record.load({
                  id: articuloServCarburacion,
                  type: search.Type.INVENTORY_ITEM,
                });
                var capacidad = parseFloat(itemObj.getValue("custitem_ptg_capacidadcilindro_")) || 1;
                var capacidadFinal = 0;
                var tipoArticulo = itemObj.getValue("custitem_ptg_tipodearticulo_");
                if(tipoArticulo == articuloEnvase){
                  capacidadFinal = 1;
                } else if(tipoArticulo == articuloCilindro){
                  capacidadFinal = capacidad / 0.54;
                } else {
                  capacidadFinal = 1;
                }


                var subTotal = (cantidadLinea * precioLinea) * capacidadFinal;
                var impuestoLinea = subTotal * .16;
                log.debug("impuestoLinea", impuestoLinea);
                var totalLinea = subTotal * 1.16;
                log.debug("totalLinea", totalLinea);
                

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_subtotal_reg_serv_car_lin',
                  value: subTotal.toFixed(2)
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_impuesto_reg_serv_car_lin',
                  value: impuestoLinea.toFixed(2)
                });

                currentRecord.setCurrentSublistValue({
                  sublistId: idRegistroDeServicios,
                  fieldId: 'custrecord_ptg_total_reg_serv_car_lin',
                  value: totalLinea.toFixed(2)
                });
              
              }

        } catch (error) {
            log.debug({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }

    function validateLine(context) {
      try{
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var idRegistroDeServicios = "recmachcustrecord_ptg_id_reg_serv_car_lin";
      var idPublicoGeneral = 0;
      var alianzaCContrato = 0;
      var alianzaCCredito = 0;
      var alianzaCContado = 0;
      var efectivoId = 0;
      var prepagoBanorteId = 0;
      var valeId = 0;
      var cortesiaId = 0;
      var tarjetaCreditoId = 0;
      var tarjetaDebitoId = 0;
      var multipleId = 0;
      var prepagoTransferenciaId = 0;
      var creditoClienteId = 0;
      var reposicionId = 0;
      var saldoAFavorId = 0;
      var consumoInternoId = 0;
      var prepagoBancomerId = 0;
      var prepagoHSBCId = 0;
      var prepagoBanamexId = 0;
      var prepagoSantanderId = 0;
      var prepagoScotianId = 0;
      var bonificacionId = 0;
      var ticketCardId = 0;
      var chequeBancomerId = 0;
      var recirculacionId = 0;
      var canceladoId = 0;
      var rellenoId = 0;
      var transferenciaId = 0;
      var traspasoId = 0;
      var chequeSantanderId = 0;
      var chequeScotianId = 0;
      var chequeHSBCId = 0;
      var chequeBanamexId = 0;
      var chequeBanorteId = 0;
      var tarjetaCreditoBancomerId = 0;
      var tarjetaCreditoHSBCId = 0;
      var tarjetaCreditoBanamexId = 0;
      var tarjetaDebitoBanamexId = 0;
      var tarjetaDebitoBancomerId = 0;
      var tarjetaDebitoHSBCId = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        idPublicoGeneral = 14508;
        alianzaCContrato = 1;
        alianzaCCredito = 2;
        alianzaCContado = 3;
        efectivoId = 1;
        prepagoBanorteId = 2;
        valeId = 3;
        cortesiaId = 4;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        multipleId = 7;
        prepagoTransferenciaId = 8;
        creditoClienteId = 9;
        reposicionId = 10;
        saldoAFavorId = 11;
        consumoInternoId = 12;
        prepagoBancomerId = 13;
        prepagoHSBCId = 14;
        prepagoBanamexId = 15;
        prepagoSantanderId = 16;
        prepagoScotianId = 17;
        bonificacionId = 18;
        ticketCardId = 19;
        chequeBancomerId = 20;
        recirculacionId = 21;
        canceladoId = 22;
        rellenoId = 23;
        transferenciaId = 24;
        traspasoId = 25;
        chequeSantanderId = 26;
        chequeScotianId = 27;
        chequeHSBCId = 28;
        chequeBanamexId = 29;
        chequeBanorteId = 30;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        idPublicoGeneral = 27041;
        alianzaCContrato = 1;
        alianzaCCredito = 2;
        alianzaCContado = 3;
        efectivoId = 1;
        prepagoBanorteId = 2;
        valeId = 3;
        cortesiaId = 4;
        tarjetaCreditoId = 5;
        tarjetaDebitoId = 6;
        multipleId = 7;
        prepagoTransferenciaId = 8;
        creditoClienteId = 9;
        reposicionId = 10;
        saldoAFavorId = 11;
        consumoInternoId = 12;
        prepagoBancomerId = 13;
        prepagoHSBCId = 14;
        prepagoBanamexId = 15;
        prepagoSantanderId = 16;
        prepagoScotianId = 17;
        bonificacionId = 18;
        ticketCardId = 19;
        chequeBancomerId = 20;
        recirculacionId = 21;
        canceladoId = 22;
        rellenoId = 23;
        transferenciaId = 24;
        traspasoId = 25;
        chequeSantanderId = 26;
        chequeScotianId = 27;
        chequeHSBCId = 28;
        chequeBanamexId = 29;
        chequeBanorteId = 30;
        tarjetaCreditoBancomerId = 31;
        tarjetaCreditoHSBCId = 32;
        tarjetaCreditoBanamexId = 33;
        tarjetaDebitoBanamexId = 34;
        tarjetaDebitoBancomerId = 35;
        tarjetaDebitoHSBCId = 36;
      }

      if (sublistName === idRegistroDeServicios) {
        var clienteServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cliente_reg_serv_car_lin",});
        var articuloServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_articulo_reg_serv_car_lin",});
        var cantidadServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_reg_serv_car_lin",});
        var precioUnitarioServCilindros = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_precio_reg_serv_car_lin",});
        var formaPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_form_pago_reg_serv_car_li",});
        var vehiculoDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_vehiculo_reg_serv_car_lin",});
        var numeroViajeDestino = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_num_vdes_reg_serv_car_lin",});
        var kilometraje = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_kilometraje_serv_car_lin",});
        var referenciaPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_referenci_reg_serv_car_li",});
        log.audit("clienteServCilindros", clienteServCilindros);
        log.audit("vehiculoDestino", vehiculoDestino);
        log.audit("kilometraje", kilometraje);
        log.audit("formaPago", formaPago);
        log.audit("cantidadServCilindros", cantidadServCilindros);
        log.audit("referenciaPago", referenciaPago);

        if (!clienteServCilindros || !articuloServCilindros || !cantidadServCilindros || !precioUnitarioServCilindros || !formaPago){
          log.debug("clienteServCilindros", clienteServCilindros);
          var options = {
            title: "Faltan datos",
            message: "Faltan datos en la línea",
          };
          dialog.alert(options);
          return false;
        } else {
          var clienteObj = record.load({
            type: record.Type.CUSTOMER,
            id: clienteServCilindros,
          });

          var alianzaComercial = clienteObj.getValue("custentity_ptg_alianza_comercial_cliente");
          if(((alianzaComercial == alianzaCContrato || alianzaComercial == alianzaCContado) && formaPago != creditoClienteId) || (alianzaComercial == alianzaCCredito && formaPago == creditoClienteId) || (!alianzaComercial)){
            if(formaPago == consumoInternoId || formaPago == traspasoId){
              if((vehiculoDestino && (!numeroViajeDestino || !kilometraje))){
                log.emergency("vehiculoDestino", vehiculoDestino);
                log.emergency("numeroViajeDestino", numeroViajeDestino);
                log.emergency("kilometraje", kilometraje);
                var options = {
                  title: "Faltan datos",
                  message: "Faltan datos en la línea",
                };
                dialog.alert(options);
                return false;
              } else {
                //Búsqueda Guardada: PTG - Equipos Kilometraje SS
              var equipoObj = search.create({
                type: "customrecord_ptg_equipos",
                filters: [["internalid","anyof",vehiculoDestino]],
                columns: [
                   search.createColumn({name: "custrecord_ptg_kilometraje_equipo_", label: "PTG - Kilometraje equipo"})
                ]
              });
              var equipoObjResult = equipoObj.run().getRange({
                start: 0,
                end: 2,
              });
              (kilimetrajeRegistrado = parseFloat(equipoObjResult[0].getValue({name: "custrecord_ptg_kilometraje_equipo_", label: "PTG - Kilometraje equipo"})));
              log.audit("kilimetrajeRegistrado", kilimetrajeRegistrado);
              var maximoKilometros = kilimetrajeRegistrado + 2000;
              log.audit("maximoKilometros", maximoKilometros);
              if((kilometraje < kilimetrajeRegistrado) || (kilometraje > maximoKilometros)){
                log.debug("Entra validacion "+kilometraje, kilimetrajeRegistrado);
                var options = {
                  title: "Kilometraje",
                  message: "Kilometraje no válido, el kilometraje no debe ser menor al registrado menor actualmente ("+ kilimetrajeRegistrado +"), ni mayor al permitido ("+maximoKilometros+").",
                };
                dialog.alert(options);
                return false;
              } else {
                if((clienteServCilindros != idPublicoGeneral) && formaPago == consumoInternoId){
                  var options = {
                    title: "Restricción",
                    message: "Sólo se puede registrar el servicio a Público General.",
                  };
                  dialog.alert(options);
                  return false;
                } else{
                log.audit("validacion kms OK");
                return true;
                }
              }
              }
              
            } else {
              log.audit("formaPago", formaPago);
              log.audit("clienteServCilindros", clienteServCilindros);
              log.audit("idPublicoGeneral", idPublicoGeneral);
              if(formaPago == canceladoId && cantidadServCilindros > 8){
                var options = {
                  title: "Cantidad",
                  message: "La cantidad de litros permitidos ha sido superada",
                };
                dialog.alert(options);
                return false;
              } else if(formaPago == rellenoId && cantidadServCilindros > 25){
                var options = {
                  title: "Cantidad",
                  message: "La cantidad de litros permitidos ha sido superada",
                };
                dialog.alert(options);
                return false;
              } else if((formaPago != efectivoId) && (formaPago != tarjetaCreditoId) && (formaPago != tarjetaDebitoId) && (formaPago != consumoInternoId) && (formaPago != recirculacionId) && (formaPago != canceladoId) && (formaPago != tarjetaCreditoBancomerId) && (formaPago != tarjetaCreditoHSBCId) && (formaPago != tarjetaCreditoBanamexId) && (formaPago != tarjetaDebitoBanamexId) && (formaPago != tarjetaDebitoBancomerId) && (formaPago != tarjetaDebitoHSBCId) && clienteServCilindros == idPublicoGeneral){
                log.audit("Cliente y credito");
                var options = {
                  title: "Restricción",
                  message: "No se puede registrar el servicio a Público General.",
                };
                dialog.alert(options);
                return false;
              } else if((formaPago == tarjetaCreditoId || formaPago == tarjetaDebitoId || formaPago == ticketCardId || formaPago == tarjetaCreditoBancomerId || formaPago == tarjetaCreditoHSBCId || formaPago == tarjetaCreditoBanamexId || formaPago == tarjetaDebitoBanamexId || formaPago == tarjetaDebitoBancomerId || formaPago == tarjetaDebitoHSBCId) && (!referenciaPago)){
                log.audit("Referencia omitida");
                var options = {
                  title: "Faltan datos",
                  message: "Se requiere referencia del pago.",
                };
                dialog.alert(options);
                return false;
              } else if(formaPago == recirculacionId && clienteServCilindros != idPublicoGeneral){
                var options = {
                  title: "Restricción",
                  message: "Sólo se puede registrar el servicio a Público General.",
                };
                dialog.alert(options);
                return false;
              } else {
                log.audit("DATOS OK");
                return true;
              }
            }
          } else {
            var options = {
              title: "Forma de pago erronea",
              message: "La forma de pago no corresponde a la alizanza con el cliente",
            };
            dialog.alert(options);
            return false;
        }
        }
      }


    } catch (error) {
      log.debug({
          title: "error validateLine",
          details: JSON.stringify(error),
      });
  }
    }


    function pasarPreliquidacion() {
      try {
        log.audit("pasarPreliquidacion cs");
        var urlPreliquidacion = '';
        var estatusProcesado = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          urlPreliquidacion = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=614&whence=&estacion=';
          estatusProcesado = 2;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          urlPreliquidacion = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=658&whence=&estacion=';
          estatusProcesado = 2;
        }
          
          recObj = currentRecord.get();
          log.debug("recObj", recObj);
  
          var recordObj = record.load({
            type: recObj.type,
            id: recObj.id,
          });
          var estacionCarburacion = recordObj.getValue("custrecord_ptg_estacion_reg_serv_carb");
          log.audit("estacionCarburacion", estacionCarburacion);

          var vehiculo = recordObj.getValue("custrecord_ptg_no_vehiculo_reg_serv_cil");
          log.audit("vehiculo", vehiculo);

          
          
          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_etapa_reg_serv_carb : estatusProcesado}
          });
  
          var urll = location;
            log.debug("urll_2", urll);
  
            var urlll = location.href;
            log.audit("urlll_2", urlll);
  
          var url = location.href;
          log.debug('url_2', url);
          location.replace(url);
  
          var urlRedirect = urlPreliquidacion+estacionCarburacion;
          log.debug("urlRedirect", urlRedirect);
          window.open(urlRedirect, '_blank');
  
      } catch (e) {
          log.error("Error", "[ pasarPreliquidacion ] " + e);
      }
  
  };


  function redirectToCreateCustomer() {
    try {
      recObj = currentRecord.get();
      var urlRegistroCliente = '';

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        urlRegistroCliente = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1070&planta=';
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        urlRegistroCliente = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=645&planta=';
      }

      var planta = recObj.getValue("custrecord_ptg_estacion_reg_serv_carb");
      log.audit("planta", planta);

      log.audit("redirectToCreateCustomer cs");

      var urlRedirect = urlRegistroCliente+planta;

      window.open(urlRedirect, '_blank');
  
    } catch (e) {
        log.error("Error", "[ redirectTo ] " + e);
    }

}
    
    return {
        fieldChanged: fieldChanged,
        validateLine: validateLine,
        pasarPreliquidacion: pasarPreliquidacion,
        redirectToCreateCustomer: redirectToCreateCustomer,
    };
});
