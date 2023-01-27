/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 02/2022
 * Script name: DRT - Preliq liquidacion Estacionario CS
 * Script id: customscript_drt_preliq_liq_esta_cs
 * customer Deployment id: customdeploy_drt_preliq_liq_esta_cs
 * Applied to: PTG - PreLiquidacion Estacionarios
 * File: drt_preliq_liquidacion_esta_cs.js
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
        var parametroRespuesta = window.location.search;
        log.audit("parametroRespuesta", parametroRespuesta);
        var urlParametro = new URLSearchParams(parametroRespuesta);
        log.audit("urlParametro", urlParametro);
        var parametroVehiculo = urlParametro.get('vehiculo');
        log.audit("parametroVehiculo", parametroVehiculo);
        var parametroNoViaje = urlParametro.get('noviaje');
        log.audit("parametroNoViaje", parametroNoViaje);

        if(parametroVehiculo){
          currentRecord.setValue("custrecord_ptg_vehiculo_preliqest_", parametroVehiculo);
        }
        if(parametroNoViaje){
          currentRecord.setValue("custrecord_ptg_nodeviaje_preliq_est_", parametroNoViaje);
        } 


    } catch (error) {
      console.log({
        title: "error pageInit",
        details: JSON.stringify(error),
      });
    }
  }
     

    function validateField(context) {
      var currentRecord = context.currentRecord;
      var recId = currentRecord.id;
      var numeroViaje = currentRecord.getValue("custrecord_ptg_nodeviaje_preliq_est_");
      var kilometraje = currentRecord.getValue("custrecord_ptg_kilometraje_preliq_");
      log.audit("numeroViaje", numeroViaje);
      log.audit("kilometraje", kilometraje);


      var cantidadDotacion = currentRecord.getValue("custrecord_ptg_dotacion_cilindros");
      var ubicacion = currentRecord.getValue("custrecord_ptg_ruta_");
      var articulo = currentRecord.getValue("custrecord_ptg_cilindro_dotacion_");
      var disponible = "";
      log.audit("ID CR", recId);
      log.audit("Cantidad Dotacion Selec", cantidadDotacion);
      log.audit("Ubicacion Selec", ubicacion);
      log.audit("Articulo Selec", articulo);
  
      if (numeroViaje && kilometraje) {
        var viajesObj = record.load({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          id: numeroViaje,
        });
        //log.audit("viajesObj", viajesObj);
        var vehiculo = viajesObj.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
        log.audit("vehiculo", vehiculo);
        
        var vehiculoObj = record.load({
          type: "customrecord_ptg_equipos",
          id: vehiculo,
        });
      }
      return true;
    }


    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var fieldName = context.fieldId;
            var numViaje = currentRecord.getValue("custrecord_ptg_nodeviaje_preliq_est_");
            var totalizador1 = currentRecord.getValue("custrecord_ptg_totalizador1_preliq_est_");
            var totalizador2 = currentRecord.getValue("custrecord_ptg_totalizador2_preliq_est_");
            var control = currentRecord.getValue("custrecord_ptg_controllitros_preliq_est_");
            var totalizadorUltimaLiquidacion = currentRecord.getValue("custrecord_ptg_tot_ultima_liqui_");
            var litrosReportados = currentRecord.getValue("custrecord_ptg_litrosreportados_");
            var nuevoTotalLitros = currentRecord.getValue("custrecord_ptg_nuevo_tot_litros");
            var litrosReportadosVigilancia = currentRecord.getValue("custrecord_ptg_lts_reportados_vigilancia");
            var diferencia = currentRecord.getValue("custrecord_ptg_diferencia_");
            var litros = currentRecord.getValue("custrecord_ptg_litrostotal_preliq_est_");
            var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_preliqest_");
            log.emergency("totalizador1", totalizador1);
            log.audit("totalizador2", totalizador2);
            log.audit("control", control);
            log.audit("totalizadorUltimaLiquidacion", totalizadorUltimaLiquidacion);
            log.audit("litrosReportados", litrosReportados);
            log.audit("nuevoTotalLitros", nuevoTotalLitros);
            log.audit("litrosReportadosVigilancia", litrosReportadosVigilancia);
            log.audit("diferencia", diferencia);
            log.audit("viaje fieldChange", numViaje);

            var cabeceraFieldName = context.fieldId;
            var milPesos = currentRecord.getValue("custrecord_ptg_billetes_1000_");
            var quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_500");
            var doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_200");
            var cienPesos = currentRecord.getValue("custrecord_ptg_billetes_100");
            var cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_50");
            var veintePesos = currentRecord.getValue("custrecord_ptg_billetes_20");
            var diezPesos = currentRecord.getValue("custrecord_ptg_monedas_10");
            var cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_5");
            var dosPesos = currentRecord.getValue("custrecord_ptg_monedas_2");
            var unPeso = currentRecord.getValue("custrecord_ptg_monedas_1");
            var cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_50_c");
            var veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_20_c");
            var diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_10_c");
            var unCentavo = currentRecord.getValue("custrecord_ptg_monedas_1_c");
            var suma = 0;

            var estatusEnCurso = 0;
            if (runtime.envType === runtime.EnvType.SANDBOX) {
              estatusEnCurso = 3;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              estatusEnCurso = 3;
            }


            if(vehiculo && fieldName === "custrecord_ptg_vehiculo_preliqest_"){
              var customrecord_ptg_registro_salida_pipas_SearchObj = search.create({
                type: "customrecord_ptg_registro_salida_pipas_",
                filters: [["custrecord_ptg_salida_pipa_","anyof",vehiculo]],
                columns: [
                   search.createColumn({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida"}),
                   search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})
                ]
             });
             var llenadoPipasObjResult = customrecord_ptg_registro_salida_pipas_SearchObj.run().getRange({
              start: 0,
              end: 2,
            });

            (totalizadorAntesLlenado = llenadoPipasObjResult[0].getValue({name: "custrecord_ptg_lts_totalizador_salida_", label: "PTG - Litros totalizador salida"})||0);
            currentRecord.setValue("custrecord_ptg_totalizador1_preliq_est_", totalizadorAntesLlenado);


            var customrecord_ptg_entrada_pipas_SearchObj = search.create({
              type: "customrecord_ptg_entrada_pipas_",
              filters:[["custrecord_ptg_vehiculoentrada_","anyof",vehiculo]],
              columns:[
                 search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
                 search.createColumn({name: "custrecord_ptg_lts_totali_entrada_pipa_", label: "PTG - Litros totalizador entrada pipa"})
              ]
           });
           var entradaVehiculoCount = customrecord_ptg_entrada_pipas_SearchObj.runPaged().count;
            if(entradaVehiculoCount > 0){
              var llenadoPipasObjResultTotalizado2 = customrecord_ptg_entrada_pipas_SearchObj.run().getRange({
                start: 0,
                end: 2,
              });
              (totalizadorDos = llenadoPipasObjResultTotalizado2[0].getValue({name: "custrecord_ptg_lts_totali_entrada_pipa_", label: "PTG - Litros totalizador entrada pipa"}));
                currentRecord.setValue("custrecord_ptg_totalizador2_preliq_est_", totalizadorDos);
               // currentRecord.setValue("custrecord_ptg_tot_ultima_liqui_", totalizadorDos);
               currentRecord.setValue("custrecord_ptg_tot_ultima_liqui_", totalizadorAntesLlenado);
                currentRecord.setValue("custrecord_ptg_lts_reportados_vigilancia", totalizadorDos);
  
                var totalizadorAntesLlenadoPF = parseFloat(totalizadorAntesLlenado);
                var totalizadorDosPF = parseFloat(totalizadorDos);
                var controLitros = totalizadorDosPF - totalizadorAntesLlenadoPF;
    
                currentRecord.setValue("custrecord_ptg_controllitros_preliq_est_", controLitros);
                currentRecord.setValue("custrecord_ptg_litrostotal_preliq_est_", controLitros);

                //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
                var viajeActivoObj = search.create({
                  type: "customrecord_ptg_tabladeviaje_enc2_",
                  filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusEnCurso]],
                  columns:[ search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})]
                });
                var viajeActivoObjCount = viajeActivoObj.runPaged().count;
                if(viajeActivoObjCount > 0){
                  var viajeActivoObjResult = viajeActivoObj.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
                  currentRecord.setValue("custrecord_ptg_nodeviaje_preliq_est_",numeroViaje);
                } else {
                  currentRecord.setValue("custrecord_ptg_nodeviaje_preliq_est_",'');
                  var options = {
                    title: "Viaje",
                    message: "No hay viaje activo asignado al vehículo seleccionado",};
                    dialog.alert(options);
                  }
                } else {
                  var options = {
                    title: "Viaje",
                    message: "No se ha realizado entrada a este vehículo",};
                    dialog.alert(options);
              }

              
            }

            if(vehiculo && numViaje && fieldName === "custrecord_ptg_nodeviaje_preliq_est_"){
              //SS: PTG - Ventas Estacionario Litros Reportados
              var litrosReportadosObj = search.create({
                type: "customrecord_ptg_ventas_estacionario",
                filters:[["custrecord_ptg_num_viaje_est_vts_","anyof",numViaje], "AND", 
                ["custrecord_ptg_registro_oportunidad","is","T"]],
                columns: [
                  search.createColumn({name: "custrecord_ptg_litros_est_vts_", summary: "SUM", label: "PTG - Litros est vts"})]
                });
                var litrosReportadosObjCount = litrosReportadosObj.runPaged().count;
                if(litrosReportadosObjCount > 0){
                  var litrosReportadosObjResult = litrosReportadosObj.run().getRange({
                    start: 0,
                    end: 2,
                  });
                  (totalLitrosBG = litrosReportadosObjResult[0].getValue({name: "custrecord_ptg_litros_est_vts_", summary: "SUM", label: "PTG - Litros est vts"})||0);
                } else {
                  totalLitrosBG = 0;
                }
             

            //SS: PTG - Trapasos Estacionarios Reportados
            var litrosReportadosTraspasoObj = search.create({
              type: "customrecord_ptg_traspaso_estacionarios_",
              filters: [
                 ["custrecord_ptg_num_viaje_est","anyof",numViaje], "AND", 
                 ["custrecord_ptg_referencia_traspaso_","noneof","@NONE@"], "AND", 
                 ["custrecord_ptg_traspasorelacionado_","anyof","@NONE@"]
              ],
              columns: [
                 search.createColumn({name: "custrecord_ptg_litros_traspaso_", summary: "SUM", label: "PTG - Litros traspaso"})
              ]
            });
            var litrosReportadosTraspasoObjCount = litrosReportadosTraspasoObj.runPaged().count;
            if(litrosReportadosTraspasoObjCount > 0){
              var litrosReportadosTraspasoObjResult = litrosReportadosTraspasoObj.run().getRange({
                start: 0,
                end: 2,
              });
              (totalLitrosTraspasoBG = litrosReportadosTraspasoObjResult[0].getValue({name: "custrecord_ptg_litros_traspaso_", summary: "SUM", label: "PTG - Litros traspaso"})||0);
            } else {
              totalLitrosTraspasoBG = 0;
            }
            log.audit("totalLitrosBG", totalLitrosBG);
            log.audit("totalLitrosTraspasoBG", totalLitrosTraspasoBG);

            totalLitros = parseFloat(totalLitrosTraspasoBG) + parseFloat(totalLitrosBG);
            log.audit("totalLitros", totalLitros);


            currentRecord.setValue("custrecord_ptg_litrosreportados_", totalLitros);
          }
            

            if ((totalizadorUltimaLiquidacion && fieldName === "custrecord_ptg_tot_ultima_liqui_") || (litrosReportados && fieldName === "custrecord_ptg_litrosreportados_")){
              var totalizadorUltimaLiquidacionPF = parseFloat(totalizadorUltimaLiquidacion);
              var litrosReportadosPF = parseFloat(litrosReportados);
              var nuevoTotal = totalizadorUltimaLiquidacionPF + litrosReportadosPF;
              currentRecord.setValue("custrecord_ptg_nuevo_tot_litros", nuevoTotal);
            }
            if ((nuevoTotalLitros && fieldName === "custrecord_ptg_nuevo_tot_litros") || (litrosReportadosVigilancia && fieldName === "custrecord_ptg_lts_reportados_vigilancia")){
              var litrosReportadosVigilanciaPF = parseFloat(litrosReportadosVigilancia);
              var nuevoTotalPF = parseFloat(nuevoTotalLitros);
              var diferenciaPF = nuevoTotalPF - litrosReportadosVigilanciaPF;
              currentRecord.setValue("custrecord_ptg_diferencia_", diferenciaPF);
            }

            if(((milPesos || !milPesos) && cabeceraFieldName === "custrecord_ptg_billetes_1000_") || ((quinientosPesos || !quinientosPesos) && cabeceraFieldName === "custrecord_ptg_billetes_500") || 
            ((doscientosPesos || !doscientosPesos)&& cabeceraFieldName === "custrecord_ptg_billetes_200") || ((cienPesos || !cienPesos) && cabeceraFieldName === "custrecord_ptg_billetes_100") ||
            ((cincuentaPesos || !cincuentaPesos) && cabeceraFieldName === "custrecord_ptg_billetes_50") || ((veintePesos || !veintePesos) && cabeceraFieldName === "custrecord_ptg_billetes_20") ||
            ((diezPesos || !diezPesos) && cabeceraFieldName === "custrecord_ptg_monedas_10") || ((cincoPesos || !cincoPesos) && cabeceraFieldName === "custrecord_ptg_monedas_5") ||
            ((dosPesos || !dosPesos) && cabeceraFieldName === "custrecord_ptg_monedas_2") || ((unPeso || !unPeso) && cabeceraFieldName === "custrecord_ptg_monedas_1") ||
            ((cincuentaCentavos || !cincuentaCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_50_c") || ((veinteCentavos || !veinteCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_20_c") ||
            ((diezCentavos || !diezCentavos) && cabeceraFieldName === "custrecord_ptg_monedas_10_c") || ((unCentavo || !unCentavo) && cabeceraFieldName === "custrecord_ptg_monedas_1_c")){
              milPesos = currentRecord.getValue("custrecord_ptg_billetes_1000_");
              quinientosPesos = currentRecord.getValue("custrecord_ptg_billetes_500");
              doscientosPesos = currentRecord.getValue("custrecord_ptg_billetes_200");
              cienPesos = currentRecord.getValue("custrecord_ptg_billetes_100");
              cincuentaPesos = currentRecord.getValue("custrecord_ptg_billetes_50");
              veintePesos = currentRecord.getValue("custrecord_ptg_billetes_20");
              diezPesos = currentRecord.getValue("custrecord_ptg_monedas_10");
              cincoPesos = currentRecord.getValue("custrecord_ptg_monedas_5");
              dosPesos = currentRecord.getValue("custrecord_ptg_monedas_2");
              unPeso = currentRecord.getValue("custrecord_ptg_monedas_1");
              cincuentaCentavos = currentRecord.getValue("custrecord_ptg_monedas_50_c");
              veinteCentavos = currentRecord.getValue("custrecord_ptg_monedas_20_c");
              diezCentavos = currentRecord.getValue("custrecord_ptg_monedas_10_c");
              unCentavo = currentRecord.getValue("custrecord_ptg_monedas_1_c");
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
              currentRecord.setValue("custrecord_ptg_total_efectivo_esta", suma);
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
        var montoTotalizador = currentRecord.getValue("custrecord_ptg_total_efectivo_esta");
        var efectivoDetalle = currentRecord.getValue("custrecord_ptg_efectivo_preliq_est_");
        var diferencia = currentRecord.getValue("custrecord_ptg_diferencia_");
        var controlLitros = currentRecord.getValue("custrecord_ptg_controllitros_preliq_est_");
        var litrosTotal = currentRecord.getValue("custrecord_ptg_litrostotal_preliq_est_");
        var litrosReportados = currentRecord.getValue("custrecord_ptg_litrosreportados_");
        var estatus = currentRecord.getValue("custrecord_ptg_liquidacion_status_est");
        var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_preliqest_");
        var numeroViaje = currentRecord.getValue("custrecord_ptg_nodeviaje_preliq_est_");
        var diferenciaCero = 0;

        var estatusLiquidacion = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusLiquidacion = 2;

        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusLiquidacion = 2;
        }

        //Búsqueda Guardada: PTG - PreLiquidacion Estacionarios SS
        var preliquidacionObj = search.create({
          type: "customrecord_ptg_preliq_estacionario_",
          filters: [
             ["custrecord_ptg_vehiculo_preliqest_","anyof",vehiculo], "AND", 
             ["custrecord_ptg_nodeviaje_preliq_est_","anyof",numeroViaje]
          ],
          columns: [
            search.createColumn({name: "internalid", sort: search.Sort.ASC, label: "ID interno"}),
            search.createColumn({name: "custrecord_ptg_vehiculo_preliqest_", label: "PTG - Vehículo preliq est"}),
            search.createColumn({name: "custrecord_ptg_nodeviaje_preliq_est_", label: "PTG - # de viaje preliq est"}),
            search.createColumn({name: "custrecord_ptg_folio_preliq_est_", label: "PTG - Folio preliq est"})
          ]
        });
        var preliquidacionObjCount = preliquidacionObj.runPaged().count;
        log.debug("preliquidacionObjCount",preliquidacionObjCount);
        if(preliquidacionObjCount > 0){
          var preliquidacionObjResult = preliquidacionObj.run().getRange({
            start: 0,
            end: 2,
          });
          idInternoPreliquidacion = preliquidacionObjResult[0].getValue({name: "internalid", sort: search.Sort.ASC, label: "ID interno"});
        }

        /*var numeroViajeObj = record.load({
          id: numeroViaje,
          type: "customrecord_ptg_tabladeviaje_enc2_",
        });

        var serviciosSinConciliar = numeroViajeObj.getValue("custrecord_ptg_contador_sin_conciliar");
        log.audit("serviciosSinConciliar", serviciosSinConciliar);*/

        //SS: PTG - Conciliacion Servicios SS
        var sinConciliarObj = search.create({
          type: "customrecord_ptg_registro_servicios_es_l",
          filters: [
             ["custrecord_ptg_ruta_sin_conciliar_2","noneof","@NONE@"], "AND", 
             ["custrecord_ptg_id_reg_serv_est_lin.custrecord_ptg_no_vehiculo_reg_serv_est","anyof",vehiculo], "AND", 
             ["custrecord_ptg_oportun_reg_serv_est_lin","anyof","@NONE@"]
          ],
          columns:[
             search.createColumn({name: "internalid", label: "ID interno"})
          ]
       });
       var serviciosSinConciliar = sinConciliarObj.runPaged().count;


       //Búsqueda Guardada: PTG - Registro de Servicios Linea Estacionario SS
      var registroManualObj = search.create({
        type: "customrecord_ptg_registro_servicios_es_l",
        filters: [
           ["custrecord_ptg_id_reg_serv_est_lin.custrecord_ptg_no_vehiculo_reg_serv_est","anyof",vehiculo], "AND", 
           ["custrecord_ptg_id_reg_serv_est_lin.custrecord_ptg_num_viaje_reg_serv_est","anyof",numeroViaje], "AND", 
           ["custrecord_ptg_oportun_reg_serv_est_lin","anyof","@NONE@"]
        ],
        columns:[]
      });
      var registroManualObjCount = registroManualObj.runPaged().count;
      log.debug("registroManualObjCount", registroManualObjCount);

      if(registroManualObjCount == 0){
        if(serviciosSinConciliar == 0){
          if (controlLitros == litrosTotal) {
            if (controlLitros == litrosReportados) {
              if (diferencia == diferenciaCero) {
                if(estatus == estatusLiquidacion){
                  if (montoTotalizador > 0 || montoTotalizador != "") {
                  //if (montoTotalizador == efectivoDetalle) {
                    return true;
                  } else {
                    var options = {
                      title: "Desglose de efectivo",
                      message: "Debe ingresar una cantidad para el desglose de efectivo ",
                    };
                    dialog.alert(options);
                  }
                } else {
                  return true;
                }
              } else {
                var options = {
                  title: "Diferencia",
                  message: "El campo PTG - DIFERENCIA debe ser cero",
                };
                dialog.alert(options);
              }
            } else {
              var options = {
                title: "Litros Reportados No Coinciden",
                message: "La cantidad de PTG - LITROS REPORTADOS (" + litrosReportados + ") no coincide con la cantidad de PTG - CONTROL DE LITROS ni PTG - LITROS TOTAL (" + controlLitros +")",
              };
              dialog.alert(options);
            }
          } else {
            var options = {
              title: "Litros No Coinciden",
              message: "La cantidad de PTG - CONTROL DE LITROS debe ser igual a PTG - LITROS TOTAL",
            };
            dialog.alert(options);
          }
          //return false;
        } else {
          var options = {
            title: "Servicios Sin Conciliar",
            message: "Hay "+serviciosSinConciliar+" servicios sin conciliar.",
          };
          dialog.alert(options);
        }
      } else {
        var options = {
          title: "Servicios en proceso",
          message: "Se están creando los registros para los servicios que se han cargado.",
        };
        dialog.alert(options);
      }


      } catch (error) {
        console.log({
          title: "error saveRecord",
          details: JSON.stringify(error),
        });
      }
    }
     

    function redirectTo() {
        try {
          log.audit("redirectTo cs");
          var formularioLiquidacion = 0;
          var estatusViajeLiquidacion = 0;
          var estatusLiquidacion = 0;
          
          if (runtime.envType === runtime.EnvType.SANDBOX) {
            formularioLiquidacion = 179;
            estatusViajeLiquidacion = 2;
            estatusLiquidacion = 2;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            formularioLiquidacion = 203;
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
            var numeViaje = recordObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
            log.audit("numeViaje", numeViaje);
  
            record.submitFields({
              type: 'customrecord_ptg_tabladeviaje_enc2_',
              id: numeViaje,
              values: {custrecord_ptg_estatusdeviaje_ : estatusViajeLiquidacion}
            })
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status_est : estatusLiquidacion}
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
          formularioFacturacion = 177;
          estatusViajeEjecutado = 3;
          estatusEjecutado = 3;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          formularioFacturacion = 205;
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
          var numeViaje = recordObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
          log.audit("numeViaje", numeViaje);

          record.submitFields({
            type: 'customrecord_ptg_tabladeviaje_enc2_',
            id: numeViaje,
            values: {custrecord_ptg_estatusdeviaje_ : estatusViajeEjecutado}
          })
          

          record.submitFields({
              type: recObj.type,
              id: recObj.id,
              values: {custrecord_ptg_liquidacion_status_est : estatusEjecutado}
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
          
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioFacturacion = 177;
        estatusViajeEjecutado = 3;
        estatusEjecutado = 3;
        urlCustomRecord = 'https://5298967-sb1.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=486&vehiculo=';
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioFacturacion = 205;
        estatusViajeEjecutado = 3;
        estatusEjecutado = 3;
        urlCustomRecord = 'https://5298967.app.netsuite.com/app/common/custom/custrecordentry.nl?rectype=588&vehiculo=';
      }

        const newForm = formularioFacturacion;
        
        recObj = currentRecord.get();
        console.log("recObj", recObj);
        log.debug("recObj", recObj);

        var recordObj = record.load({
          type: recObj.type,
          id: recObj.id,
        });
        var numeViaje = recordObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
        log.audit("numeViaje", numeViaje);

        record.submitFields({
          type: 'customrecord_ptg_tabladeviaje_enc2_',
          id: numeViaje,
          values: {custrecord_ptg_estatusdeviaje_ : estatusViajeEjecutado}
        })
        

        record.submitFields({
            type: recObj.type,
            id: recObj.id,
            values: {custrecord_ptg_liquidacion_status_est : estatusEjecutado}
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

        var urlRedirect = urlCustomRecord+vehiculo;

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


      var urlStlt = url.resolveScript({
          scriptId: "customscript_drt_ptg_factur_opor_esta_sl",
          deploymentId: "customdeploy_drt_ptg_factur_opor_esta_sl",
          returnExternalUrl: false
      });
      https.get({
          url: urlStlt+'&id='+currentRecord.get().id
      })

      recObj = currentRecord.get();
          console.log("recObj", recObj);
      var recordObj = record.load({
        type: recObj.type,
        id: recObj.id
      });
      log.audit("lookupRecord", recordObj);
      var numViaje = recordObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
      log.audit("numViaje", numViaje);
    
      record.submitFields({
        type: "customrecord_ptg_tabladeviaje_enc2_",
        id: numViaje,
        values: {custrecord_ptg_estatus_tabladeviajes_ : estatusViajeConcluido,
          custrecord_ptg_estatusdeviaje_: estatusFacturado
        }
      });

      log.audit("facturar Oportunidad cs PT2");

      resultadoFactura();

  } catch (e) {
      log.error("Error", "[ invoice ] " + e);
  }
  };

  function redirectToAprobar() {
    try {
      log.audit("redirectToAprobar cs");

        recObj = currentRecord.get();
        log.debug("recObj", recObj);

        
        record.submitFields({
            type: recObj.type,
            id: recObj.id,
            values: {custrecord_ptg_conteo_exceso_preliq_est : 0}
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


  function resultadoFactura(){
    try {
      log.audit("facturar cambio pestana facturar");

      var formularioFacturacion = 0;
      var estatusFacturacion = 0;
      var limiteURL = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        formularioFacturacion = 177;
        estatusFacturacion = 4;
        limiteURL = 100;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        formularioFacturacion = 205;
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
            var numeViaje = recordObj.getValue("custrecord_ptg_nodeviaje_preliq_est_");
            log.audit("numeViaje", numeViaje);
            
            record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_liquidacion_status_est : estatusFacturacion}
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
      log.error("Error", "[ invoice ] " + e);
  }
  };

  function borrarDesglose(){
    log.audit("Borrar desglose");
    recObj = currentRecord.get();
    log.audit("Borrar desglose recObj", recObj);

    var vacio = "";

    recObj.setValue("custrecord_ptg_total_efectivo_esta", vacio);
    recObj.setValue("custrecord_ptg_billetes_1000_", vacio);
    recObj.setValue("custrecord_ptg_billetes_500", vacio);
    recObj.setValue("custrecord_ptg_billetes_200", vacio);
    recObj.setValue("custrecord_ptg_billetes_100", vacio);
    recObj.setValue("custrecord_ptg_billetes_50", vacio);
    recObj.setValue("custrecord_ptg_billetes_20", vacio);
    recObj.setValue("custrecord_ptg_monedas_10", vacio);
    recObj.setValue("custrecord_ptg_monedas_5", vacio);
    recObj.setValue("custrecord_ptg_monedas_2", vacio);
    recObj.setValue("custrecord_ptg_monedas_1", vacio);
    recObj.setValue("custrecord_ptg_monedas_50_c", vacio);
    recObj.setValue("custrecord_ptg_monedas_20_c", vacio);
    recObj.setValue("custrecord_ptg_monedas_10_c", vacio);
    recObj.setValue("custrecord_ptg_monedas_1_c", vacio);

  }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        fieldChanged: fieldChanged,
        redirectTo: redirectTo,
        redirectToFacturacion: redirectToFacturacion,
        facturarOportunidad: facturarOportunidad,
        redirectToNuevoViajeYFacturacion: redirectToNuevoViajeYFacturacion,
        borrarDesglose: borrarDesglose,
        redirectToAprobar: redirectToAprobar,
    };
});