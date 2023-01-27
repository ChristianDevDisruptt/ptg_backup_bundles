/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - Registro Servicios Linea Estaci UE
 * Script id: customscript_drt_ptg_reg_serv_lin_est_ue
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_lin_est_ue
 * Applied to: PTG - Registro de Servicios Linea Estaci
 * File: drt_ptg_reg_serv_lin_est_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search"], function (record, search) {
  function afterSubmit(context) {
    try {
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var oportunidad = newRecord.getValue("custrecord_ptg_oportun_reg_serv_est_lin");
        var articulo = newRecord.getValue("custrecord_ptg_articulo_reg_serv_est_lin");
        var cantidad = newRecord.getValue("custrecord_ptg_cantidad_reg_serv_est_lin");
        var precio = newRecord.getValue("custrecord_ptg_precio_reg_serv_est_lin");
        var subtotal = newRecord.getValue("custrecord_ptg_subtotal_registro_servs_e");
        var impuesto = newRecord.getValue("custrecord_ptg_impuesto_reg_serv_est_lin");
        var total = newRecord.getValue("custrecord_ptg_total_reg_serv_est_lin");
        var formaPago = newRecord.getValue("custrecord_ptg_form_pago_reg_serv_est_li");
        var formaPagoTXT = newRecord.getText("custrecord_ptg_form_pago_reg_serv_est_li");
        var referencia = newRecord.getValue("custrecord_ptg_referencia_est");
        var objPagos = {};
        var arrayPagos = [];
        var objPagosOportunidad = {};

        if(oportunidad){
          //SS: PTG - Pagos Oportunidad Registro Serv
          var pagosOportundadObj = search.create({
            type: "customrecord_ptg_pagos_oportunidad",
            filters: [
               ["custrecord_ptg_oportunidad","anyof",oportunidad]
            ],
            columns: [
               search.createColumn({name: "internalid", label: "ID interno"}),
               search.createColumn({name: "custrecord_ptg_registro_pagos", label: "PTG - Pagos"})
            ]
          });
          var pagosOportundadObjCount = pagosOportundadObj.runPaged().count;
          if(pagosOportundadObjCount > 0){
            var pagosOportundadObjResult = pagosOportundadObj.run().getRange({
              start: 0,
              end: 2,
            });
            (idPagoLinea = pagosOportundadObjResult[0].getValue({name: "internalid", label: "ID interno"}));
            (idPagoCabecera = pagosOportundadObjResult[0].getValue({name: "custrecord_ptg_registro_pagos", label: "PTG - Pagos"}));
            log.audit("idPagoLinea", idPagoLinea);
            log.audit("idPagoCabecera", idPagoCabecera);

          var objUpdRegistroLinea = {
            custrecord_ptg_tipo_pago: formaPago,
            custrecord_ptg_total: total,
            custrecord_ptg_referenciapago_: referencia,
          };
          var idRegistroPagoLinea = record.submitFields({
            type: "customrecord_ptg_pagos_oportunidad",
            id: idPagoLinea,
            values: objUpdRegistroLinea
          });
          log.audit("Registro Actualizado Linea", idRegistroPagoLinea);

          if(idRegistroPagoLinea){
            var objUpdRegistroCabecera = {
              custrecord_ptg_total_servicio: total,
            };
            var idRegistroPagoCabecera = record.submitFields({
              type: "customrecord_ptg_pagos",
              id: idPagoCabecera,
              values: objUpdRegistroCabecera
            });
            log.audit("Registro Actualizado Cabecera", idRegistroPagoCabecera);

            if(idRegistroPagoCabecera){
              //SS: Custom PTG - Ventas Estacionario Búsqueda
              var oportunidadRegistroLineaObj = search.create({
                type: "customrecord_ptg_ventas_estacionario",
                filters: [
                  ["custrecord_ptg_oportunidad_estacionario","anyof",oportunidad], "AND", 
                  ["custrecord_ptg_registro_oportunidad","is","T"]
                ],
                columns:[
                  search.createColumn({name: "internalid", label: "ID interno"})
                ]
              });
              var oportunidadRegistroLineaObjCount = oportunidadRegistroLineaObj.runPaged().count;
              if(oportunidadRegistroLineaObjCount > 0){
                var oportunidadRegistroLineaObjResult = oportunidadRegistroLineaObj.run().getRange({
                  start: 0,
                  end: 2,
                });
                (idRegistroOportunidadLinea = oportunidadRegistroLineaObjResult[0].getValue({name: "internalid", label: "ID interno"}));
                log.audit("idRegistroOportunidadLinea", idRegistroOportunidadLinea);
                var objUpdRegistroOportunidadLinea = {
                  custrecord_ptg_tipodepago_estacionarios_: formaPago,
                  custrecord_ptg_litros_est_vts_: cantidad,
                  custrecord_ptg_precio_est_vts_: precio,
                  custrecord_ptg_importe_est_vts_: subtotal,
                  custrecord_ptg_referencia_est_vts_: referencia,
                  custrecord_ptg_impuesto_est_vts_: impuesto,
                  custrecord_ptg_total_est_vts_: total,
                };
                var idRegistroOportundiadLinea = record.submitFields({
                  type: "customrecord_ptg_ventas_estacionario",
                  id: idRegistroOportunidadLinea,
                  values: objUpdRegistroOportunidadLinea
                });
                log.audit("Registro Actualizado Linea Oportunidad", idRegistroOportundiadLinea);
                if(idRegistroOportundiadLinea){
                  var recOportunidad = record.load({
                    type: record.Type.OPPORTUNITY,
                    id: oportunidad,
                    isDynamic: true,
                  });

                  objPagos = {metodo_txt: formaPagoTXT, tipo_pago: formaPago, monto: total, folio: referencia}
                  arrayPagos.push(objPagos);
                  objPagosOportunidad = {pago: arrayPagos}
                  var objValue = JSON.stringify(objPagosOportunidad);

                  recOportunidad.setValue("custbody_ptg_opcion_pago_obj", objValue);
                  recOportunidad.setValue("custbody_ptg_opcion_pago", formaPago);

                  
                  for(var i = 0; i < 1; i++){
                    recOportunidad.selectLine({
                      sublistId: 'item',
                      line: i
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'item',
                      value: articulo
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'quantity',
                      value: cantidad
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'rate',
                      value: precio
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'amount',
                      value: subtotal
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'tax1amt',
                      value: impuesto
                    });
                    recOportunidad.setCurrentSublistValue({
                      sublistId: 'item',
                      fieldId: 'grossamt',
                      value: total
                    });

                    recOportunidad.commitLine({
                      sublistId: 'item'
                    });

                  }
                  var idOportunidad = recOportunidad.save();
                  log.audit("Oportunidad Actualizada", idOportunidad);
                }
              }
            }
          }
        }

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
  };
});
