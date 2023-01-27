/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - Preliquidacion liquidacion CS
 * Script id: customscript_drt_preliq_liquidacion_cs
 * customer Deployment id: customdeploy_drt_preliq_liquidacion_cs
 * Applied to: PTG - PreLiquidación de Cilindros
 * File: drt_preliq_liquidacion_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/https', 'N/currentRecord', 'N/url', 'N/ui/message', 'N/ui/dialog', 'N/search', 'N/runtime', 'N/record', 'N/error', ['N/currency']], 
 function (https, currentRecord, url, message, dialog, search, runtime, record, error, currency) {

    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var folio = currentRecord.getValue("custrecord_ptg_folio_preliqui_cil_");
        log.audit("folio", folio);
        var parametroRespuesta = window.location.search;
        log.audit("parametroRespuesta", parametroRespuesta);
        var urlParametro = new URLSearchParams(parametroRespuesta);
        log.audit("urlParametro", urlParametro);
        var parametroVehiculo = urlParametro.get('vehiculo');
        log.audit("parametroVehiculo", parametroVehiculo);
        var parametroNoViaje = urlParametro.get('noviaje');
        log.audit("parametroNoViaje", parametroNoViaje);

          if(parametroVehiculo){
            currentRecord.setValue("custrecord_ptg_nodevehiculo_prelicil_", parametroVehiculo);
          }
          if(parametroNoViaje){
            currentRecord.setValue("custrecord_ptg_numdeviaje_", parametroNoViaje);
          }            

      } catch (error) {
        console.log({
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
            var milPesos = currentRecord.getValue("custrecord_ptg_1000");
            var quinientosPesos = currentRecord.getValue("custrecord_ptg_500");
            var doscientosPesos = currentRecord.getValue("custrecord_ptg_200");
            var cienPesos = currentRecord.getValue("custrecord_ptg_100_");
            var cincuentaPesos = currentRecord.getValue("custrecord_ptg_50_");
            var veintePesos = currentRecord.getValue("custrecord_ptg_20_");
            var diezPesos = currentRecord.getValue("custrecord_ptg_10_p");
            var cincoPesos = currentRecord.getValue("custrecord_ptg_5_p");
            var dosPesos = currentRecord.getValue("custrecord_ptg_2_p");
            var unPeso = currentRecord.getValue("custrecord_ptg_1_p");
            var cincuentaCentavos = currentRecord.getValue("custrecord_ptg_50_c");
            var veinteCentavos = currentRecord.getValue("custrecord_ptg_20_c");
            var diezCentavos = currentRecord.getValue("custrecord_ptg_10_c");
            var unCentavo = currentRecord.getValue("custrecord_ptg_1_c");
            var suma = 0;
            var vehiculo = currentRecord.getValue("custrecord_ptg_nodevehiculo_prelicil_");
            var vehiculoTXT = currentRecord.getText("custrecord_ptg_nodevehiculo_prelicil_");
            var estatusEnCurso = 0;

            if (runtime.envType === runtime.EnvType.SANDBOX) {
              estatusEnCurso = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              estatusEnCurso = 3;
            }

            if(((milPesos || !milPesos) && cabeceraFieldName === "custrecord_ptg_1000") || ((quinientosPesos || !quinientosPesos) && cabeceraFieldName === "custrecord_ptg_500") || 
            ((doscientosPesos || !doscientosPesos) && cabeceraFieldName === "custrecord_ptg_200") || ((cienPesos || !cienPesos) && cabeceraFieldName === "custrecord_ptg_100_") ||
            ((cincuentaPesos || !cincuentaPesos) && cabeceraFieldName === "custrecord_ptg_50_") || ((veintePesos || !veintePesos) && cabeceraFieldName === "custrecord_ptg_20_") ||
            ((diezPesos || !diezPesos) && cabeceraFieldName === "custrecord_ptg_10_p") || ((cincoPesos || !cincoPesos) && cabeceraFieldName === "custrecord_ptg_5_p") ||
            ((dosPesos || !dosPesos) && cabeceraFieldName === "custrecord_ptg_2_p") || ((unPeso || !unPeso) && cabeceraFieldName === "custrecord_ptg_1_p") ||
            ((cincuentaCentavos || !cincuentaCentavos) && cabeceraFieldName === "custrecord_ptg_50_c") || ((veinteCentavos || !veinteCentavos) && cabeceraFieldName === "custrecord_ptg_20_c") ||
            ((diezCentavos || !diezCentavos) && cabeceraFieldName === "custrecord_ptg_10_c") || ((unCentavo || !unCentavo) && cabeceraFieldName === "custrecord_ptg_1_c")){
              milPesos = currentRecord.getValue("custrecord_ptg_1000");
              quinientosPesos = currentRecord.getValue("custrecord_ptg_500");
              doscientosPesos = currentRecord.getValue("custrecord_ptg_200");
              cienPesos = currentRecord.getValue("custrecord_ptg_100_");
              cincuentaPesos = currentRecord.getValue("custrecord_ptg_50_");
              veintePesos = currentRecord.getValue("custrecord_ptg_20_");
              diezPesos = currentRecord.getValue("custrecord_ptg_10_p");
              cincoPesos = currentRecord.getValue("custrecord_ptg_5_p");
              dosPesos = currentRecord.getValue("custrecord_ptg_2_p");
              unPeso = currentRecord.getValue("custrecord_ptg_1_p");
              cincuentaCentavos = currentRecord.getValue("custrecord_ptg_50_c");
              veinteCentavos = currentRecord.getValue("custrecord_ptg_20_c");
              diezCentavos = currentRecord.getValue("custrecord_ptg_10_c");
              unCentavo = currentRecord.getValue("custrecord_ptg_1_c");
              multiplicacionMil = milPesos * 1000;
              multiplicacionQuinientos = quinientosPesos * 500;
              multiplicacionDoscientos = doscientosPesos * 200;
              multiplicacionCien = cienPesos * 100;
              multiplicacionCincuenta = cincuentaPesos * 50
              multiplicacionVeinte = veintePesos * 20
              multiplicacionDiez = diezPesos * 10
              multiplicacionCinco = cincoPesos * 5
              multiplicacionDos = dosPesos * 2
              multiplicacionUno = unPeso * 1
              multiplicacionCinCen = cincuentaCentavos * 0.5;
              multiplicacionVeiCen = veinteCentavos * 0.2;
              multiplicacionDieCen = diezCentavos * 0.1;
              multiplicacionUnCen = unCentavo * 0.01;
              suma = multiplicacionMil + multiplicacionQuinientos + multiplicacionDoscientos + multiplicacionCien + multiplicacionCincuenta + multiplicacionVeinte + multiplicacionDiez + multiplicacionCinco + multiplicacionDos + multiplicacionUno + multiplicacionCinCen + multiplicacionVeiCen + multiplicacionDieCen + multiplicacionUnCen;
              currentRecord.setValue("custrecord_ptg_monto_totalizador", suma);
            }

            if(vehiculo && cabeceraFieldName === "custrecord_ptg_nodevehiculo_prelicil_"){
              //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
              var viajeActivoObj = search.create({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusEnCurso]],
                  columns:[
                     search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                     search.createColumn({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"})
                  ]
              });
              var viajeActivoObjResult = viajeActivoObj.run().getRange({
                  start: 0,
                  end: 2,
              });
              log.audit("viajeActivoObjResult", viajeActivoObjResult);
              log.audit("viajeActivoObjResult LENGHT", viajeActivoObjResult.length);
              var numViajeConteo = viajeActivoObjResult.length;
              if(numViajeConteo > 0){
                numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
                vendedor = viajeActivoObjResult[0].getValue({name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)"});
                currentRecord.setValue("custrecord_ptg_numdeviaje_",numeroViaje);
                currentRecord.setValue("custrecord_ptg_vendedor_preliqcil_",vendedor);
              } else {
                var options = {
                  title: "El vehículo sin viaje activo",
                  message: "El vehículo " + vehiculoTXT + " no tiene viaje activo.",
                };
                dialog.alert(options);
              }
              

          }



        } catch (error) {
            console.log({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }

    function saveRecord(context) {
      try {
        var currentRecord = context.currentRecord;
        var recId = currentRecord.id;
        var vehiculo = currentRecord.getValue("custrecord_ptg_nodevehiculo_prelicil_");
        log.debug("vehiculo SR", vehiculo);
        var estatus = currentRecord.getValue("custrecord_ptg_liquidacion_status");
        log.debug("estatus SR", estatus);
        var montoTotalizador = currentRecord.getValue("custrecord_ptg_monto_totalizador");
        log.debug("montoTotalizador SR", montoTotalizador);
        var efectivoDetalle = currentRecord.getValue("custrecord_ptg_efectivo_");
        log.debug("efectivoDetalle SR", efectivoDetalle);
        var numViaje = currentRecord.getValue("custrecord_ptg_numdeviaje_");
        log.debug("numViaje SR", numViaje);
        var preliquidacionExiste = false;

        var estatusPreliquidacion = 0;
        var estatusLiquidacion = 0;
        var estatusEjecutado = 0;
        var estatusFacturacion = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusPreliquidacion = 1;
          estatusLiquidacion = 2;
          estatusEjecutado = 3;
          estatusFacturacion = 4;

        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusPreliquidacion = 1;
          estatusLiquidacion = 2;
          estatusEjecutado = 3;
          estatusFacturacion = 4;
        }


        if(efectivoDetalle){
          var efectivoRedondeoBajo = efectivoDetalle.toFixed(0);
          var efectivoRedondeoAlto = efectivoDetalle + 1;
        }

        var preliquidacionObj = search.create({
          type: "customrecord_ptg_preliquicilndros_",
          filters: [
            ["custrecord_ptg_numdeviaje_","anyof", numViaje], "AND", 
            ["custrecord_ptg_nodevehiculo_prelicil_","anyof",vehiculo]
          ],
          columns: [
            search.createColumn({name: "internalid", label: "Internal ID"})
          ]
        });
        var preliquidacionObjCount = preliquidacionObj.runPaged().count;
        log.emergency("recId", recId);
        log.emergency("preliquidacionObjCount", preliquidacionObjCount);
        var preliquidacionObjResult = preliquidacionObj.run().getRange({
          start: 0,
          end: preliquidacionObjCount,
        });


        //PTG - Registro de Servicios Linea SS
        var registroManualObj = search.create({
          type: "customrecord_ptg_registro_servicios_ci_l",
          filters: [
             ["custrecord_ptg_id_reg_serv_cil_lin.custrecord_ptg_no_vehiculo_reg_serv_cil","anyof",vehiculo], "AND", 
             ["custrecord_ptg_id_reg_serv_cil_lin.custrecord_ptg_num_viaje_reg_serv_cil","anyof",numViaje], "AND", 
             ["custrecord_ptg_oportun_reg_serv_cil_lin","anyof","@NONE@"]
          ],
          columns:[]
        });
        var registroManualObjCount = registroManualObj.runPaged().count;
        log.debug("registroManualObjCount", registroManualObjCount);


        if(preliquidacionObjCount > 0){
          preliquidacionExiste = true;
          (idRegistro = preliquidacionObjResult[0].getValue({name: "internalid", label: "Internal ID"}));
          log.emergency("preliquidacionExiste", preliquidacionExiste);
          log.emergency("idRegistro", idRegistro);
        } 

        if(preliquidacionExiste && recId != idRegistro){
          var options = {
            title: "Preliquidación existente",
            message: "Existe una preliquidación creada para el vehículo y número de viaje seleccionado",
          };
          dialog.alert(options);
          //return false
          return true
        }
        
        else {
          log.audit("Punto");
         /* if(registroManualObjCount > 0){
            var options = {
              title: "Servicios en proceso",
              message: "Se están creando los registros para los servicios que se han cargado.",
            };
            dialog.alert(options);
          } else {*/
          if(estatus == estatusLiquidacion || estatus == estatusEjecutado){
            log.audit("validacion estatus ", estatus);
            if (montoTotalizador > 0) {
              log.audit("total dentro if");
              return true;
            } else {
              log.audit("total else");
              var options = {
                title: "Desglose de efectivo",
                message: "Debe ingresar una cantidad en la denominación",
              };
              dialog.alert(options);
            }
          } else {
            return true;
          }
            /* else if (estatus == estatusPreliquidacion){
            log.audit("validacion estatus ", estatus);
            if(numViaje){

              var options = {
                title: "Confirmación de registros",
                message: "Se confirma que se han cargado todos los servicios"
               };
               function success(result) { 
                console.log("Success with value " + result); 
                return true;
               }
               function failure(reason) {
                console.log("Failure: " + reason); 
                return false;
               }
               dialog.confirm(options).then(success).catch(failure); 




              //return true;
            } else {
              var options = {
                title: "Vehículo sin número de viaje.",
                message: "No hay viaje activo para el vehículo.",
              };
              dialog.alert(options);
            }
          }  */
       // }     
        }


      } catch (error) {
        console.log({
          title: "error saveRecord",
          details: JSON.stringify(error),
        });
      }
    }

     
    function redirectToAprobar() {
      try {
        log.audit("redirectToAprobar cs");

          recObj = currentRecord.get();
          log.debug("recObj", recObj);

          
          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_conteo_exceso : 0}
          });

          var urll = location;
          log.debug("urll", urll);

          var urlll = location.href;
          log.audit("urlll", urlll);

          var url = location.href;
          log.debug('url_1', url);
          location.replace(url);

      } catch (e) {
          log.error("Error", "[ redirectToAprobar ] " + e);
      }

  };

    function redirectTo() {
        try {
          log.audit("redirectTo cs");

          var formularioLiquidacion = 0;
          var estatusViajeLiquidacion = 0;
          var estatusLiquidacion = 0;
          
          if (runtime.envType === runtime.EnvType.SANDBOX) {
            formularioLiquidacion = 181;
            estatusViajeLiquidacion = 2;
            estatusLiquidacion = 2;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            formularioLiquidacion = 173;
            estatusViajeLiquidacion = 2;
            estatusLiquidacion = 2;
          }

            const newForm = formularioLiquidacion;

            recObj = currentRecord.get();
            console.log("recObj", recObj);
            log.debug("recObj", recObj);

            var recordObj = record.load({
              type: recObj.type,
              id: recObj.id,
            });
            var numeViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
            log.audit("numeViaje", numeViaje);
  
            record.submitFields({
              type: 'customrecord_ptg_tabladeviaje_enc2_',
              id: numeViaje,
              values: {custrecord_ptg_estatusdeviaje_ : estatusViajeLiquidacion}
            })
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status : estatusLiquidacion}
            })

            recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {customform : newForm}
            })
            recObj.save()

            var urll = location;
            log.debug("urll", urll);

            var urlll = location.href;
            log.audit("urlll", urlll);

            var url = location.href + "&cf=" + newForm;
            log.debug('url_1', url);
            location.replace(url);

        } catch (e) {
            log.error("Error", "[ redirectTo ] " + e);
        }

    };

    function redirectToFacturacion() {
      try {
        log.audit("redirectToFacturacion cs");

        var formularioFacturacion = 0;
        var estatusViajeEjecutado = 0;
        var estatusEjecutado = 0;
          
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          formularioFacturacion = 182;
          estatusViajeEjecutado = 3;
          estatusEjecutado = 3;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioFacturacion = 171;
          estatusViajeEjecutado = 3;
          estatusEjecutado = 3;
        }

          const newForm = formularioFacturacion;
          
          recObj = currentRecord.get();
          console.log("recObj", recObj);
          log.debug("recObj", recObj);

          var recordObj = record.load({
            type: recObj.type,
            id: recObj.id,
          });
          var numeViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
          log.audit("numeViaje", numeViaje);

          record.submitFields({
            type: 'customrecord_ptg_tabladeviaje_enc2_',
            id: numeViaje,
            values: {custrecord_ptg_estatusdeviaje_ : estatusViajeEjecutado}
          })
          

          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_liquidacion_status : estatusEjecutado}
          })

          recObj = record.load({
              type: recObj.type,
              id: recObj.id,
              defaultValues: {customform : newForm}
          })
          recObj.save()

          var urll = location;
            log.debug("urll_2", urll);

            var urlll = location.href;
            log.audit("urlll_2", urlll);

          var url = location.href + "&cf=" + newForm;
          log.debug('url_2', url);
          location.replace(url);
      } catch (e) {
          log.error("Error", "[ redirectTo ] " + e);
      }

  };


  function redirectToNuevoViajeYFacturacion() {
    try {
      log.audit("redirectToNuevoViajeYFacturacion cs");

      var formularioFacturacion = 0;
      var estatusViajeEjecutado = 0;
      var estatusEjecutado = 0;
      var urlCustomRecord = '';
      var urlCustomRecordFormulario = '';
      var formularioCilindro = 0;
          
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioFacturacion = 182;
        estatusViajeEjecutado = 3;
        estatusEjecutado = 3;
        formularioCilindro = 0;
        urlCustomRecord = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=486&vehiculo=';
        urlCustomRecordFormulario = '&formulario=';
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioFacturacion = 171;
        estatusViajeEjecutado = 3;
        estatusEjecutado = 3;
        formularioCilindro = 177;
        urlCustomRecord = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=588&vehiculo=';
        urlCustomRecordFormulario = '&formulario=';
      }


        const newForm = formularioFacturacion;
        
        recObj = currentRecord.get();
        console.log("recObj", recObj);
        log.debug("recObj", recObj);

        var recordObj = record.load({
          type: recObj.type,
          id: recObj.id,
        });
        var numeViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
        log.audit("numeViaje", numeViaje);

        record.submitFields({
          type: 'customrecord_ptg_tabladeviaje_enc2_',
          id: numeViaje,
          values: {custrecord_ptg_estatusdeviaje_ : estatusViajeEjecutado}
        })
        

        record.submitFields({
            type: recObj.type,
            id: recObj.id,
            values: {custrecord_ptg_liquidacion_status : estatusEjecutado}
        })

        var viajesObj = record.load({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          id: numeViaje,
        });
        
        var vehiculo = viajesObj.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
        log.debug("vehiculo nf", vehiculo);

        recObj = record.load({
            type: recObj.type,
            id: recObj.id,
            defaultValues: {customform : newForm}
        })
        recObj.save()

        var urll = location;
          log.debug("urll_2", urll);

          var urlll = location.href;
          log.audit("urlll_2", urlll);

        var url = location.href + "&cf=" + newForm;
        log.debug('url_2', url);
        location.replace(url);

        var objUrl = {
          vehiculo: vehiculo,
        }
        log.debug("objUrl", objUrl);

        //var urlRedirect = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=486&vehiculo='+vehiculo;
        var urlRedirect = urlCustomRecord+vehiculo+urlCustomRecordFormulario+formularioCilindro;

        window.open(urlRedirect, '_blank');

        facturarOportunidad();

    } catch (e) {
        log.error("Error", "[ redirectTo ] " + e);
    }

};


  function facturarOportunidad(){
    try {
      log.audit("facturar Oportunidad cs");
      var estatusViajeConcluido = 0;
      var estatusFacturado = 0;
          
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusViajeConcluido = 1;
        estatusFacturado = 4;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusViajeConcluido = 1;
        estatusFacturado = 4;
      }

      var button = document.getElementById('custpage_drt_to_facturacion');
      console.log("button", button);
      log.audit("button", button);

      log.audit("facturar Oportunidad cs PT1");

      recObj = currentRecord.get();
          console.log("recObj", recObj);

      var recordObj = record.load({
        type: recObj.type,
        id: recObj.id
      });
      log.audit("lookupRecord", recordObj);

        var urlStlt = url.resolveScript({
          scriptId: "customscript_drt_ptg_facturacion_opor_sl",
          deploymentId: "customdeploy_drt_ptg_facturacion_opor_sl",
          returnExternalUrl: false
        });

      log.audit("urlStlt", urlStlt);

      https.get({
          url: urlStlt+'&id='+currentRecord.get().id
      })

      var numViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
      log.audit("numViaje", numViaje);
    
      record.submitFields({
        type: "customrecord_ptg_tabladeviaje_enc2_",
        id: numViaje,
        values: {custrecord_ptg_estatus_tabladeviajes_ : estatusViajeConcluido,
          custrecord_ptg_estatusdeviaje_: estatusFacturado,
          custrecord_ptg_viajeactivo_: false
        }
      });

      log.audit("facturar Oportunidad cs PT2");

      resultadoFactura();

  } catch (e) {
      log.error("Error", "[ facturarOportunidad ] " + e);
  }
  };


  function redirectToNuevoViaje() {
    try {
      log.audit("redirectToNuevoViaje cs");

      var formularioFacturacion = 0;
      var urlCustomRecord = '';
      var urlCustomRecordFormulario = '';
      var formularioCilindro = 0;
          
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioFacturacion = 182;
        formularioCilindro = 0;
        urlCustomRecord = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=486&vehiculo=';
        urlCustomRecordFormulario = '&formulario=';
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioFacturacion = 171;
        formularioCilindro = 177;
        urlCustomRecord = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=588&vehiculo=';
        urlCustomRecordFormulario = '&formulario=';
      }

        
        recObj = currentRecord.get();
        console.log("recObj", recObj);
        log.debug("recObj", recObj);

        var recordObj = record.load({
          type: recObj.type,
          id: recObj.id,
        });
        var numeViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
        log.audit("numeViaje", numeViaje);

        var viajesObj = record.load({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          id: numeViaje,
        });
        
        var vehiculo = viajesObj.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
        log.debug("vehiculo nf", vehiculo);

        var objUrl = {
          vehiculo: vehiculo,
        }
        log.debug("objUrl", objUrl);

        var urlRedirect = urlCustomRecord+vehiculo+urlCustomRecordFormulario+formularioCilindro;

        window.open(urlRedirect, '_blank');


    } catch (e) {
        log.error("Error", "[ redirectToNuevoViaje ] " + e);
    }

};


  function resultadoFactura(){
    try {
      log.audit("facturar cambio pestana facturar");

      var formularioFacturacion = 0;
      var estatusFacturacion = 0;
      var limiteURL = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioFacturacion = 182;
        estatusFacturacion = 4;
        limiteURL = 100;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioFacturacion = 171;
        estatusFacturacion = 4;
        limiteURL = 100;
      }

            const newFormF = formularioFacturacion;

            recObj = currentRecord.get();
            console.log("recObj", recObj);
            log.debug("recObj", recObj);


            var recordObj = record.load({
              type: recObj.type,
              id: recObj.id,
            });
            var numeViaje = recordObj.getValue("custrecord_ptg_numdeviaje_");
            log.audit("numeViaje", numeViaje);
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status : estatusFacturacion}
            })

            recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {customform : newFormF}
            })
            recObj.save()

            var str = location.href;
            log.debug("ssttrr", str);

            var newStr = str.substr(0, limiteURL);
            log.debug("newStr", newStr);

            var url = newStr + "&cf=" + newFormF;
            log.debug('url_3', url);
            location.replace(url);

            log.audit("facturar Oportunidad cs PT3");


  } catch (e) {
      log.error("Error", "[ resultadoFactura ] " + e);
  }
  };

  function borrarDesglose(){
    log.audit("Borrar desglose");
    recObj = currentRecord.get();
    log.audit("Borrar desglose recObj", recObj);

    var vacio = "";

    recObj.setValue("custrecord_ptg_monto_totalizador", vacio);
    recObj.setValue("custrecord_ptg_1000", vacio);
    recObj.setValue("custrecord_ptg_500", vacio);
    recObj.setValue("custrecord_ptg_200", vacio);
    recObj.setValue("custrecord_ptg_100_", vacio);
    recObj.setValue("custrecord_ptg_50_", vacio);
    recObj.setValue("custrecord_ptg_20_", vacio);
    recObj.setValue("custrecord_ptg_10_p", vacio);
    recObj.setValue("custrecord_ptg_5_p", vacio);
    recObj.setValue("custrecord_ptg_2_p", vacio);
    recObj.setValue("custrecord_ptg_1_p", vacio);
    recObj.setValue("custrecord_ptg_50_c", vacio);
    recObj.setValue("custrecord_ptg_20_c", vacio);
    recObj.setValue("custrecord_ptg_10_c", vacio);
    recObj.setValue("custrecord_ptg_1_c", vacio);

  }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        redirectTo: redirectTo,
        redirectToFacturacion: redirectToFacturacion,
        facturarOportunidad: facturarOportunidad,
        saveRecord: saveRecord,
        redirectToNuevoViajeYFacturacion: redirectToNuevoViajeYFacturacion,
        redirectToAprobar: redirectToAprobar,
        borrarDesglose: borrarDesglose,
        redirectToNuevoViaje: redirectToNuevoViaje,
    };
});