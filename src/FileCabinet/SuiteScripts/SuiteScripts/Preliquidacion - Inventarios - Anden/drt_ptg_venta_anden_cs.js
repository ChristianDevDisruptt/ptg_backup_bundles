/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - VENTA ANDEN CS
 * Script id: customscript_drt_ptg_venta_anden_cs
 * customer Deployment id: customdeploy_drt_ptg_venta_anden_cs
 * Applied to: PTG - VENTA ANDEN
 * File: drt_ptg_venta_anden_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog", 'N/currentRecord', 'N/url'], function (record, search, error, runtime, dialog, currentRecord, url) {

    function fieldChanged(context) {
      try {
        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var fieldName = context.fieldId;
        var line = context.line;
        var idCliente = currentRecord.getValue("custrecord_ptg_cliente");
        var precioGasCabecera = currentRecord.getValue("custrecord_ptg_precio_gas_venta_anden");
        var sublistaArticuloAVender = "recmachcustrecord_ptg_linea_venta_anden";
        var importe = 0;
        var total = 0;
        var precioValvulas = 0;
        var cilindro10 = 0;
        var cilindro20 = 0;
        var cilindro30 = 0;
        var cilindro45 = 0;
        var envase10 = 0;
        var envase20 = 0;
        var envase30 = 0;
        var envase45 = 0;
        var idCilindroChatarra = 0;
        var valvula = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          precioValvulas = 100;
          cilindro10 = 4094;
          cilindro20 = 4095;
          cilindro30 = 4096;
          cilindro45 = 4602;
          envase10 = 4097;
          envase20 = 4099;
          envase30 = 4098;
          envase45 = 4604;
          idCilindroChatarra = 4831;
          valvula = 4670;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          precioValvulas = 100;
          cilindro10 = 4210;
          cilindro20 = 4211;
          cilindro30 = 4212;
          cilindro45 = 4213;
          envase10 = 4206;
          envase20 = 4207;
          envase30 = 4208;
          envase45 = 4209;          
          idCilindroChatarra = 4831;
          valvula = 4670;
        }
  
        if(precioGasCabecera && fieldName === 'custrecord_ptg_precio_gas_venta_anden'){
          if (sublistName === 'recmachcustrecord_ptg_linea_venta_anden') {
            currentRecord.setCurrentSublistValue({
              sublistId: "recmachcustrecord_ptg_linea_venta_anden", 
              fieldId: "custrecord_ptg_precio_unitario_anden", 
              value: precioGasCabecera,
            });
          }
          }
        
  
        if(idCliente && fieldName === 'custrecord_ptg_cliente'){
          var clienteObj = record.load({
            type: record.Type.CUSTOMER,
            id: idCliente,
          });
          var idArray = [];
          var defaultBillingArray = [];
          var lineCount = clienteObj.getLineCount({ sublistId:'addressbook' })||0;
          if(lineCount > 0){
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
        
                var precio = zonaPrecioObj.getValue("custrecord_ptg_precio_") || precioGasCabecera;
                log.audit("precio", precio);
              } else {
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
        
                var precio = zonaPrecioObj.getValue("custrecord_ptg_precio_") || precioGasCabecera;
                log.audit("precio", precio);
              }
            }
          } else {
            precio = precioGasCabecera;
          }
          
  
          currentRecord.setValue({
            fieldId: 'custrecord_ptg_precio_gas_venta_anden',
            value: precio
          });

          currentRecord.setCurrentSublistValue({
            sublistId: sublistaArticuloAVender,
            fieldId: 'custrecord_ptg_precio_unitario_anden',
            value: precio
          });


        }
        
        if (sublistName === sublistaArticuloAVender && sublistFieldName === 'custrecord_ptg_cantidad_anden'){
  
          var cantidad = currentRecord.getCurrentSublistValue({
            sublistId: sublistaArticuloAVender,
            fieldId: 'custrecord_ptg_cantidad_anden',
          });
  
          var precioUnitario = currentRecord.getCurrentSublistValue({
            sublistId: sublistaArticuloAVender,
            fieldId: 'custrecord_ptg_precio_unitario_anden'
          });
  
          if((cantidad)&&(precioUnitario)){
            var cantidadPF = parseFloat(cantidad);
            var precioUnitarioPF = parseFloat(precioUnitario);
  
            importe = cantidadPF * precioUnitarioPF;
            log.audit("importe cambio cantidad", importe);
  
            var importePF = parseFloat(importe);
            total = importePF * 1.16;
  
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_importe_anden',
              value: importePF.toFixed(2)
            });
  
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_impuesto_anden',
              value: 16.0
            });
  
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_total_anden',
              value: total.toFixed(2)
            });
          }
          
        }

        if (sublistName === sublistaArticuloAVender && sublistFieldName === 'custrecord_ptg_total_anden'){
    
            var total = parseFloat(currentRecord.getCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_total_anden',
            }));
    
            var precioUnitario = parseFloat(currentRecord.getCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_precio_unitario_anden'
            }));
    
            if((total)&&(precioUnitario)){
    
              importe = total / 1.16;
              log.audit("importe cambio total", importe);
    
              var importePF = parseFloat(importe);
              total = importePF * 1.16;

              var cantidad = importe / precioUnitario;
    
              currentRecord.setCurrentSublistValue({
                sublistId: sublistaArticuloAVender,
                fieldId: 'custrecord_ptg_importe_anden',
                value: importePF.toFixed(2)
              });
    
              currentRecord.setCurrentSublistValue({
                sublistId: sublistaArticuloAVender,
                fieldId: 'custrecord_ptg_impuesto_anden',
                value: 16.0
              });
    
              currentRecord.setCurrentSublistValue({
                sublistId: sublistaArticuloAVender,
                fieldId: 'custrecord_ptg_cantidad_anden',
                value: cantidad.toFixed(4)
              });
            }
            
          }
  
        if ((sublistName === sublistaArticuloAVender && sublistFieldName === 'custrecord_ptg_articulo_anden')){
  
          var articuloAnden = currentRecord.getCurrentSublistValue({
            sublistId: sublistaArticuloAVender,
            fieldId: 'custrecord_ptg_articulo_anden',
          });
  
          var precioUnitario = currentRecord.getCurrentSublistValue({
            sublistId: sublistaArticuloAVender,
            fieldId: 'custrecord_ptg_precio_unitario_anden',
          });
  
          if(articuloAnden == cilindro10 || articuloAnden == cilindro20 || articuloAnden == cilindro30 || articuloAnden == cilindro45){
            articuloObj = record.load({
              type: search.Type.INVENTORY_ITEM,
              id: articuloAnden,
            });
  
            var capacidad = articuloObj.getValue("custitem_ptg_capacidadcilindro_");
            log.audit("capacidad", capacidad);
            var conversion = capacidad / 0.54;
            log.audit("conversion", conversion);
            var capacidadXPrecioUnitario = conversion * precioUnitario;
            log.audit("capacidadXPrecioUnitario", capacidadXPrecioUnitario);
  
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_precio_unitario_anden',
              value: capacidadXPrecioUnitario.toFixed(6)
              });
  
          } 
          else if(articuloAnden == envase10 || articuloAnden == envase30 || articuloAnden == envase20 || articuloAnden == envase45 || articuloAnden == idCilindroChatarra){
            articuloObj = record.load({
              type: search.Type.INVENTORY_ITEM,
              id: articuloAnden,
            });
  
            var precioBase  = articuloObj.getSublistValue({
              sublistId:'price1',
              fieldId:'price_1_',
              line: 0
          });
  
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_precio_unitario_anden',
              value: precioBase
              });
  
          } else if(articuloAnden == valvula){
            currentRecord.setCurrentSublistValue({
              sublistId: sublistaArticuloAVender,
              fieldId: 'custrecord_ptg_precio_unitario_anden',
              value: precioValvulas
              });
  
          }
  
        }
      } catch (error) {
        log.error("Error fieldChange", error);
      }
    }

    function validateLine(context){
      try {
        var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistaArticuloAVender = "recmachcustrecord_ptg_linea_venta_anden";
      var sublistaPagos = "recmachcustrecord_ptg_detallepago_";
      var totalizador = currentRecord.getValue("custrecord_ptg_totalizador_venta_anden") || 0;
      var idCilindroChatarra = 0;
      var total = 0;
      var tarjetaDebitoAnden = 0;
      var tarjetaCreditoAnden = 0;
      

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        tarjetaDebitoAnden = 2;
        tarjetaCreditoAnden = 3;
        idCilindroChatarra = 4831;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        tarjetaDebitoAnden = 2;
        tarjetaCreditoAnden = 3;
        idCilindroChatarra = 4831;
      }
      
        if (sublistName === sublistaArticuloAVender){
          var articuloAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_articulo_anden'});
          var cantidadAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_cantidad_anden'});
          var precioUnitarioAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_precio_unitario_anden'});
          var totalAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_total_anden'});
          var totalControl = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_total_control_anden"});
          var totalAndenPF = parseFloat(totalAnden);
          log.audit("totalControl", totalControl);
          
  
            if ((!articuloAnden)||(!cantidadAnden)||(!precioUnitarioAnden)) {
              var options = {
                title: "Faltan datos",
                message: "Faltan datos en el registro",};
                dialog.alert(options);
              return false;
            } else { 
              if(articuloAnden == idCilindroChatarra){
                log.audit("Chatarra");
                if(!totalControl){
                  totalCabeceraPF = parseFloat(totalizador);
                  total = totalCabeceraPF - totalAndenPF;
                  log.audit("totalCabeceraPF", totalCabeceraPF);
                  log.audit("totalAndenPF", totalAndenPF);
                  log.audit("total", total);
                  currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", total);
                  currentRecord.setCurrentSublistValue({
                    sublistId: sublistaArticuloAVender,
                    fieldId: 'custrecord_ptg_total_control_anden',
                    value: totalAndenPF
                  });
                } else {
                  totalCabeceraPF = parseFloat(totalizador);
                  total = totalCabeceraPF + totalControl;
                  totalFinal = total - totalAndenPF;
                  log.audit("totalCabeceraPF", totalCabeceraPF);
                  log.audit("totalAndenPF", totalAndenPF);
                  log.audit("total", total);
                  log.audit("totalFinal", totalFinal);
                  currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", totalFinal);
                  currentRecord.setCurrentSublistValue({
                    sublistId: sublistaArticuloAVender,
                    fieldId: 'custrecord_ptg_total_control_anden',
                    value: totalAndenPF
                  });
                }

                return true;
              } else {
                log.audit("NO Chatarra");
                if(!totalControl){
                  totalCabeceraPF = parseFloat(totalizador);
                  total = totalCabeceraPF + totalAndenPF;
                  log.audit("totalCabeceraPF", totalCabeceraPF);
                  log.audit("totalAndenPF", totalAndenPF);
                  log.audit("total", total);
                  currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", total);
                  currentRecord.setCurrentSublistValue({
                    sublistId: sublistaArticuloAVender,
                    fieldId: 'custrecord_ptg_total_control_anden',
                    value: totalAndenPF
                  });
                } else {
                  totalCabeceraPF = parseFloat(totalizador);
                  total = totalCabeceraPF - totalControl;
                  totalFinal = total + totalAndenPF;
                  log.audit("totalCabeceraPF", totalCabeceraPF);
                  log.audit("totalAndenPF", totalAndenPF);
                  log.audit("total", total);
                  log.audit("totalFinal", totalFinal);
                  currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", totalFinal);
                  currentRecord.setCurrentSublistValue({
                    sublistId: sublistaArticuloAVender,
                    fieldId: 'custrecord_ptg_total_control_anden',
                    value: totalAndenPF
                  });
                }

                return true;
              }
            }
            
        } else if (sublistName === sublistaPagos){
          var tipoPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_tipo_pago_anden'});
          var totalPago = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_total_detalle'});
          var referencia = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_folio_autorizacion_anden'});

          if(tipoPago){
            if((tipoPago == tarjetaDebitoAnden)||(tipoPago == tarjetaCreditoAnden)){
              if ((!totalPago)||(!referencia)) {
                var options = {
                  title: "Faltan datos",
                  message: "Faltan datos en el registro",};
                  dialog.alert(options);
                return false;
              } else {
                return true;
              }
            } else {
              if ((!totalPago)) {
                var options = {
                  title: "Faltan datos",
                  message: "Faltan datos en el registro",};
                  dialog.alert(options);
                return false;
              } else {
                return true;
              }
            }
          } else {
            var options = {
              title: "Faltan datos",
              message: "Faltan datos en el registro",};
              dialog.alert(options);
            return false;
          }         
            
        }
      } catch (error) {
        log.error("error validateLine", error);
      }
    }

    function saveRecord(context) {
        try {
          var currentRecord = context.currentRecord;
        var totalServicio = currentRecord.getValue("custrecord_ptg_totalizador_venta_anden");
        var lineas = currentRecord.getLineCount({sublistId: "recmachcustrecord_ptg_detallepago_",});
        var total = 0;
        log.audit("currentRecord", currentRecord);
        log.audit("totalServicio", totalServicio);
        log.audit("lineas", lineas);
        for (var i = 0; i < lineas; i++) {
          var totalLinea = currentRecord.getSublistValue({sublistId: "recmachcustrecord_ptg_detallepago_", fieldId: "custrecord_ptg_total_detalle", line: i,});
          log.audit("totalLinea " + i, totalLinea);
          total = total + totalLinea;
        }
        log.audit("total final", total);
        var totalMenor = parseFloat(totalServicio - 1);
        var totalMayor = parseFloat(totalServicio + 1);
        log.audit("totalMenor", totalMenor);
        log.audit("totalMayor", totalMayor);
    
        if ((total <= totalMayor)&&(total >= totalMenor)) {
          log.audit("entra true");
          return true;
        } else {
          var options = {
            title: "Totales no coinciden",
            message: "La suma del total de las líneas " + total + " no coincide con la cantidad total " + totalServicio,
          };
          dialog.alert(options);
        }
        } catch (error) {
          log.error("error saveRecord", error);
        }
     }

    function pageInit(context) {
        try {
          var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var fieldName = context.fieldId;
        var line = context.line;
        var precioGasCabecera = currentRecord.getValue("custrecord_ptg_precio_gas_venta_anden");
        log.audit("precioGasCabecera", precioGasCabecera);
        var sublistaArticuloAVender = "recmachcustrecord_ptg_linea_venta_anden";
        currentRecord.setCurrentSublistValue({
          sublistId: sublistaArticuloAVender,
          fieldId: 'custrecord_ptg_precio_unitario_anden',
          value: precioGasCabecera
          });
        } catch (error) {
          log.error("error pageInit", error);
        }
         
    }

    function lineInit(context) {
        try {
          var currentRecord = context.currentRecord;
          var sublistName = context.sublistId;
          var precioGasCabecera = currentRecord.getValue("custrecord_ptg_precio_gas_venta_anden");
          if (sublistName === 'recmachcustrecord_ptg_linea_venta_anden') {
                currentRecord.setCurrentSublistValue({
                  sublistId: "recmachcustrecord_ptg_linea_venta_anden", 
                  fieldId: "custrecord_ptg_precio_unitario_anden", 
                  value: precioGasCabecera,
                });
    
              }
        } catch (error) {
          log.error("error lineInit", error);
        } 
    }

    function redirectToCreateCustomer() {
      try {
        recObj = currentRecord.get();
        var urlRegistroCliente = "";

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          urlRegistroCliente = "https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=1070&planta=";
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          urlRegistroCliente = "https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=645&planta=";
        }

        var planta = recObj.getValue("custrecord_ptg_planta_anden");
        log.audit("planta", planta);

        log.audit("redirectToCreateCustomer cs");
  
        var urlRedirect = urlRegistroCliente+planta;
  
        window.open(urlRedirect, '_blank');
    
      } catch (e) {
          log.error("Error", "[ redirectTo ] " + e);
      }
  
  }

  function validateDelete(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistaArticuloAVender = "recmachcustrecord_ptg_linea_venta_anden";
      var sublistaPagos = "recmachcustrecord_ptg_detallepago_";
      var totalizador = currentRecord.getValue("custrecord_ptg_totalizador_venta_anden") || 0;
      var idCilindroChatarra = 0;
      var total = 0;

      if (runtime.envType === runtime.EnvType.SANDBOX) {
        idCilindroChatarra = 4831;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        idCilindroChatarra = 4831;
      }

      if (sublistName === sublistaArticuloAVender){
        if (currentRecord.getCurrentSublistValue({sublistId: sublistName, fieldId: "custrecord_ptg_cantidad_anden",}) > 0){
          var articuloAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_articulo_anden'});
          var cantidadAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_cantidad_anden'});
          var totalControl = parseFloat(currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: "custrecord_ptg_total_control_anden"}));

          if (cantidadAnden) {

            if(totalizador){
              if(articuloAnden == idCilindroChatarra){
                var totalCabeceraPF = parseFloat(totalizador);
                total = totalCabeceraPF + totalControl;
                currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", total);
              } else {
                var totalCabeceraPF = parseFloat(totalizador);
                total = totalCabeceraPF - totalControl;
                currentRecord.setValue("custrecord_ptg_totalizador_venta_anden", total);
              }
              
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

  
    return {
      saveRecord: saveRecord,
      fieldChanged: fieldChanged,
      validateLine: validateLine,
      pageInit: pageInit,
      lineInit: lineInit,
      redirectToCreateCustomer: redirectToCreateCustomer,
      validateDelete: validateDelete,
    };
  });
