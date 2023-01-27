/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 12/2021
 * Script name: DRT - PTG - Registro Traslado Inv UES
 * Script id: customscript_drt_ptg_reg_tras_inv_ues
 * Deployment id: customdeploy_drt_ptg_reg_tras_inv_ues
 * Applied to: PTG - Tabla de viajes
 * File: DRT - PTG Registro de Traslado de Inventario UES.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", 'N/config', 'N/format', "N/runtime"], function (record, search, config, format, runtime) {
  function afterSubmit(context) {
    try {
      var objUpdate = {};

      if(context.type == "create"){
        var newRecord = context.newRecord;
        var numViajeSearchObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters: [],
          columns: []
       });

       var searchResultCount = numViajeSearchObj.runPaged().count;
       log.audit("searchResultCount", searchResultCount);
       var searchResultViaje = numViajeSearchObj.run().getRange({
        start: 0,
        end: 2,
      });
      log.audit("searchResultViaje", searchResultViaje);

    var numeroEntero = searchResultCount;
    log.audit("numeroEntero", numeroEntero);

         objUpdate.name = numeroEntero;
         objUpdate.custrecord_ptg_viaje_tabladeviajes_ = numeroEntero;

      }

      var newRecord = context.newRecord;
        var recId = newRecord.id;
        var numViaje = newRecord.getValue("name");
        var ruta = newRecord.getValue("custrecord_ptg_ruta");
        var vehiculo = newRecord.getValue("custrecord_ptg_vehiculo_tabladeviajes_");
        var estatus = newRecord.getValue("custrecord_ptg_estatus_tabladeviajes_");
        var transaccionesCreadas = newRecord.getValue("custrecord_drt_ptg_transferencia_tv");
        var fechaEnCurso = newRecord.getValue("custrecord_ptg_fecha_viaje_en_curso");
        var lineCount = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_numviaje_dot_",});
        var lineCountEstacionario = newRecord.getLineCount({sublistId: "recmachcustrecord_ptg_viajellenadopipa_",});
        var transacciones = transaccionesCreadas[0];
        var formulario = newRecord.getValue("customform");
        var paqueteMySuite = 0;
        var plantillaDocumentoElectronico = 0;
        var metodoDeEnvio = 0;
        var gasLPUnidades = 0;
        var idTransaccionArray = [];
        var articuloArray = [];
        var cantidadArray = [];
        var unidadArray = [];
        var pesoTotalArray = [];
        var unidad10 = 0;
        var unidad20 = 0;
        var unidad30 = 0;
        var unidad45 = 0;
        var formularioCilindros = 0;
        var formularioEstacionarios = 0;
        var estatusEnCurso = 0;
        var formularioTrasladoCarburacion = 0;
        log.audit("formulario", formulario);


        if (runtime.envType === runtime.EnvType.SANDBOX) {
          plantillaDocumentoElectronico = 135;
          metodoDeEnvio = 11;
          unidad10 = 24;
          unidad20 = 25;
          unidad30 = 26;
          unidad45 = 27;
          formularioCilindros = 172;
          formularioEstacionarios = 173;
          paqueteMySuite = 2;
          estatusEnCurso = 3;
          formularioTrasladoCarburacion = 313;
          gasLPUnidades = 4693;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          plantillaDocumentoElectronico = 119;
          metodoDeEnvio = 10;
          unidad10 = 12;
          unidad20 = 13;
          unidad30 = 14;
          unidad45 = 15;
          formularioCilindros = 177;
          formularioEstacionarios = 176;
          paqueteMySuite = 2;
          estatusEnCurso = 3;
          formularioTrasladoCarburacion = 266;
          gasLPUnidades = 4216;
        }


        var locationObj = record.load({
          type: search.Type.LOCATION,
          id: ruta,
        });
        var parent = locationObj.getValue("parent");
        var parentText = locationObj.getText("parent");
        var subsidiary = locationObj.getValue("subsidiary");
        var subsidiaryText = locationObj.getText("subsidiary");
        
        var d = new Date();
        var conf = config.load({
          type: config.Type.USER_PREFERENCES,
        });
        var tz = conf.getValue("DATEFORMAT");

        var tme = format.format({
          value: d,
          type: format.Type.DATE,
          timezone: tz,
        });
        log.debug("tme", tme);

        

      if (estatus == estatusEnCurso && !fechaEnCurso) {

        if (formulario == formularioCilindros && !transacciones) {
          //BÚSQUEDA GUARDADA: DRT - PTG Dotacion
          log.audit("entra cilindros");

          var customrecord_ptg_registrodedotacion_cil_SearchObj = search.create(
            {
              type: "customrecord_ptg_registrodedotacion_cil_",
              filters: [["custrecord_ptg_numviaje_dot_", "anyof", recId]],
              columns: [
                search.createColumn({name: "custrecord_ptg_novehiculo_", label: "PTG - No de Vehículo ",}),
                search.createColumn({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación",}),
                search.createColumn({name: "custrecord_ptg_dotacion_cilindros", label: "PTG - Dotación cilndros",}),
                search.createColumn({name: "internalid", label: "ID interno",}),
              ],
            }
          );
          var searchResultCount = customrecord_ptg_registrodedotacion_cil_SearchObj.runPaged().count;
          log.debug("customrecord_ptg_registrodedotacion_cil_SearchObj result count", searchResultCount);
          var searchResult = customrecord_ptg_registrodedotacion_cil_SearchObj.run().getRange({
            start: 0,
            end: searchResultCount,
          });
          log.audit("searchResult", searchResult);
          for (var j = 0; j < searchResult.length; j++) {
            (idRegDotacion = searchResult[j].getValue({name: "internalid", label: "ID interno",})),
            (idarticulo = searchResult[j].getValue({name: "custrecord_ptg_cilindro_dotacion_", label: "PTG - Cilindro dotación",}));
            //log.audit("searchResult: " + j, idRegDotacion);
            log.audit("idarticulo " + j, idarticulo);
            var itemObj = record.load({
              type: search.Type.INVENTORY_ITEM,
              id: idarticulo,
            });
            var tipoArticulo = itemObj.getValue("custitem_ptg_tipodearticulo_");
            log.audit("tipoArticulo", tipoArticulo);
            var objUpdate = {
              custrecord_ptg_novehiculo_: vehiculo,
              custrecord_ptg_ruta_: ruta,
              custrecord_ptg_subsidiaria_: subsidiaryText,
              custrecord_ptg_tipo_articulo: tipoArticulo,
              custrecord_ptg_registro_dotacion: true,
              custrecord_ptg_numviaje_detalledotacion: recId,
            };

            record.submitFields({
              id: idRegDotacion,
              type: "customrecord_ptg_registrodedotacion_cil_",
              values: objUpdate,
              options: {
                enableSourcing: false,
                ignoreMandatoryFields: true,
              },
            });
          }

          for (var l = 0; l < lineCount; l++) {
            articuloArray[l] = newRecord.getSublistValue({sublistId: "recmachcustrecord_ptg_numviaje_dot_", fieldId: "custrecord_ptg_cilindro_dotacion_", line: l,});
            cantidadArray[l] = newRecord.getSublistValue({sublistId: "recmachcustrecord_ptg_numviaje_dot_", fieldId: "custrecord_ptg_dotacion_cilindros", line: l,});
            log.audit("Articulo: L:" + l, articuloArray[l]);
            log.audit("Cantidad: L:" + l, cantidadArray[l]);
            var itemCilObj = record.load({
              type: search.Type.INVENTORY_ITEM,
              id: articuloArray[l],
            });
            var capacidadArticulo = itemCilObj.getValue("custitem_ptg_capacidadcilindro_");
            log.emergency("capacidadArticulo", capacidadArticulo);
            pesoTotalArray[l] = (cantidadArray[l] * capacidadArticulo) / 0.54;
            log.audit("PesoTotalArray: L:" + l, pesoTotalArray[l]);
            if(capacidadArticulo == 10){
              unidadArray[l] = unidad10;
            } else if(capacidadArticulo == 20){
              unidadArray[l] = unidad20;
            } else if(capacidadArticulo == 30){
              unidadArray[l] = unidad30;
            }  else if(capacidadArticulo == 45){
              unidadArray[l] = unidad45;
            }
            log.audit("unidad: L:" + l, unidadArray[l]);

          }

          var recOrdenTraslado = record.create({
            type: "transferorder",
            isDynamic: true,
          });

          recOrdenTraslado.setValue("customform", formularioTrasladoCarburacion);
          recOrdenTraslado.setValue("subsidiary", subsidiary);
          recOrdenTraslado.setValue("location", parent);
          recOrdenTraslado.setValue("transferlocation", ruta);
          recOrdenTraslado.setValue("custbody_ptg_numero_viaje_destino", recId);
          recOrdenTraslado.setValue("custbody_psg_ei_trans_edoc_standard", paqueteMySuite);

          /*for (var i = 0; i < lineCount; i++) {
            log.audit("Cantidad OT: L:" + i, cantidadArray[i]);
            log.audit("Unidad OT: L:" + i, unidadArray[i]);
            recOrdenTraslado.selectLine("item", i);
            recOrdenTraslado.setCurrentSublistValue("item", "item", gasLPUnidades);
            recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadArray[i]);
            recOrdenTraslado.setCurrentSublistValue("item", "units", unidadArray[i]);
            recOrdenTraslado.setCurrentSublistValue("item", "custcol_disa_peso_total_cp", pesoTotalArray[i]);
            recOrdenTraslado.commitLine("item");
          }*/


          var x = 0;
    
          for (var i = 0; i < lineCount; i++) {
            if(cantidadArray[i] > 0){
              log.audit("Cantidad OT: L:" + i, cantidadArray[i]);
              log.audit("Unidad OT: L:" + i, unidadArray[i]);
              recOrdenTraslado.selectLine("item", x);
              recOrdenTraslado.setCurrentSublistValue("item", "item", gasLPUnidades);
              recOrdenTraslado.setCurrentSublistValue("item", "quantity", cantidadArray[i]);
              recOrdenTraslado.setCurrentSublistValue("item", "units", unidadArray[i]);
              recOrdenTraslado.setCurrentSublistValue("item", "custcol_disa_peso_total_cp", pesoTotalArray[i]);
              recOrdenTraslado.commitLine("item");
              x += 1;
            }
          }


          var idOrdenTraslado = recOrdenTraslado.save();
          log.debug("idOrdenTraslado", idOrdenTraslado);

          idTransaccionArray.push(idOrdenTraslado);

          if (idOrdenTraslado) {
            var newRecordItemFulfillment = record.transform({
              fromType: record.Type.TRANSFER_ORDER,
              fromId: idOrdenTraslado,
              toType: record.Type.ITEM_FULFILLMENT,
              isDynamic: true,
              ignoreMandatoryFields: true,
            });

            newRecordItemFulfillment.setValue("custbody_ptg_numero_viaje_destino", recId);
            newRecordItemFulfillment.setValue("shipstatus", "C");
            newRecordItemFulfillment.setValue("custbody_psg_ei_template", plantillaDocumentoElectronico);
            newRecordItemFulfillment.setValue("custbody_psg_ei_sending_method", metodoDeEnvio);

            var idItemFulfillment = newRecordItemFulfillment.save({
              enableSourcing: false,
              ignoreMandatoryFields: true,
            }) || "";

            log.debug("idItemFulfillment", idItemFulfillment);

            idTransaccionArray.push(idItemFulfillment);
          }

          if (idItemFulfillment) {
            var newRecordItemReceipt = record.transform({
              fromType: record.Type.TRANSFER_ORDER,
              fromId: idOrdenTraslado,
              toType: record.Type.ITEM_RECEIPT,
              isDynamic: true,
              ignoreMandatoryFields: true,
            });

            newRecordItemReceipt.setValue("location", ruta);

            var idItemReceipt = newRecordItemReceipt.save({
              enableSourcing: false,
              ignoreMandatoryFields: true,
            }) || "";

            log.debug("idItemReceipt", idItemReceipt);

            idTransaccionArray.push(idItemReceipt);
          }

          log.audit({
            title: "idTransaccionArray",
            details: JSON.stringify(idTransaccionArray),
          });

          var objUpdate = {
            name: numeroEntero,
            custrecord_ptg_viaje_tabladeviajes_: numeroEntero,
            custrecord_drt_ptg_transferencia_tv: idTransaccionArray,
            custrecord_ptg_serviciocilindro_: true,
            custrecord_ptg_fecha_viaje_en_curso: tme,
            custrecord_ptg_viajeactivo_: true,
          };
          record.submitFields({
            id: newRecord.id,
            type: newRecord.type,
            values: objUpdate,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });

          log.debug({
            title: "Record created successfully",
            details: "Id: " + recId,
          });
        }
        log.debug("No entra validacion");

        if (formulario == formularioEstacionarios) {
          //BÚSQUEDA GUARDADA: DRT - PTG Dotacion estacionarios
          log.audit("entra formulario estacionarios");
          
            objUpdate.custrecord_ptg_servicioestacionario_ = true,
            objUpdate.custrecord_ptg_fecha_viaje_en_curso = tme,
            objUpdate.custrecord_ptg_viajeactivo_ = true,

          record.submitFields({
            id: newRecord.id,
            type: newRecord.type,
            values: objUpdate,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });
          log.debug({
            title: "Record created successfully Estacionario",
            details: "Id: " + recId,
          });
        }

        var objUpdateEquipo = {};
          objUpdateEquipo.custrecord_ptg_equipo_viaje_activo = true;

          var equipoUpdate = record.submitFields({
            id: vehiculo,
            type: "customrecord_ptg_equipos",
            values: objUpdateEquipo,
            options: {
              enableSourcing: false,
              ignoreMandatoryFields: true,
            },
          });
          log.debug({
            title: "Registro de equipo actualizado",
            details: "Id: " + equipoUpdate,
          });

      } 
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context) {
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
        var recId = newRecord.id;
       // var numViaje = newRecord.getValue("name");

        var numViaje = newRecord.getValue("custrecord_ptg_viaje_tabladeviajes_");
        var numViajeSearchObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:
          [
          ],
          columns:
          [
             search.createColumn({name: "id", label: "ID"}),
             search.createColumn({name: "custrecord_ptg_planta_tabladeviajes_", label: "PTG - Planta (Tabla de viajes)"}),
             search.createColumn({name: "custrecord_ptg_viaje_tabladeviajes_",
                sort: search.Sort.DESC,
                label: "PTG - #Viaje (Tabla de viajes)"
             })
          ]
       });

       var searchResultCount = numViajeSearchObj.runPaged().count;
       log.audit("searchResultCount", searchResultCount);

        if (!numViaje || numViaje != "Por Asignar") {
              var numeroEntero = searchResultCount + 1;
              newRecord.setValue("custrecord_ptg_viaje_tabladeviajes_", numeroEntero);
              newRecord.setValue("name", numeroEntero.toFixed(0));
        }
      }
        
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeLoad(context) {
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
        var recId = newRecord.id;

        newRecord.setValue("name", "Por Asignar");
       
      }
        
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }


  return {
    afterSubmit: afterSubmit,
    beforeSubmit: beforeSubmit,
    beforeLoad: beforeLoad,
  };
});
