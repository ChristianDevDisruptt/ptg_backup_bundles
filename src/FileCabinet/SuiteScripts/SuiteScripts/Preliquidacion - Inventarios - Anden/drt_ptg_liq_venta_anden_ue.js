/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - LIQUIDACION VENTA ANDEN UE
 * Script id: customscript_drt_ptg_liq_venta_anden_ue
 * customer Deployment id: customdeploy_drt_ptg_liq_venta_anden_ue
 * Applied to: PTG - LIQUIDACION VENTA ANDEN
 * File: drt_ptg_liq_venta_anden_ue.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(["N/record", "N/search", "N/task", "N/format", 'N/config', "N/runtime"], function (record, search, task, format, config, runtime) {
  
  function beforeLoad(context) {
    try {
        var newRecord = context.newRecord;
        var type_event = context.type;
        var form = context.form;
        var recId = newRecord.id;
        var objUpdate = {};
        var status = newRecord.getValue("custrecord_ptg_status_liq_anden");
        var desglose = newRecord.getValue("custrecord_ptg_total_anden_liq");
        var estatusLiquidacion = 0;
        var estatusFacturacion = 0;
        if (runtime.envType === runtime.EnvType.SANDBOX) {
          estatusLiquidacion = 2;
          estatusFacturacion = 4;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          estatusLiquidacion = 2;
          estatusFacturacion = 4;
        }
        
        if (type_event == "view") {
          if (status == estatusLiquidacion && desglose == "") {
            form.title = "Ingresar Desglose de efectivo";
          } else if (status == estatusLiquidacion && desglose != "") {
              form.title = "Liquidación Venta Andén";
          } else if (status == estatusFacturacion) {
              form.title = "Venta Andén Facturada";
          }
          
          if (status == estatusLiquidacion && desglose != "") {
              form.addButton({
                  id: "custpage_drt_to_facturar",
                  label: "Facturar Ventas",
                  functionName: "facturarVentaAnden()",
              });
          }

          //Búsqueda Guardada: PTG - TOTAL DE VENTAS EN ANDEN A FACTURAR SS
          var ventasAFacturarObj = search.create({
            type: "customrecord_ptg_total_ventas_anden_liq",
            filters: [["custrecord_ptg_relacion_liq_anden","anyof",recId]],
            columns: [
               search.createColumn({name: "custrecord_ptg_id_venta", summary: "GROUP", label: "PTG - ID DE VENTA"})
            ]
          });
          objUpdate.custrecord_ptg_facturas_generar_liq = ventasAFacturarObj.runPaged().count;

          //BÚSQUEDA GUARDADA: PTG - Registro Facturación Generadas Cil
          var facturasGeneradas = search.create({
            type: "customrecord_drt_ptg_registro_factura",
            filters: [["custrecord_ptg_venta_anden","anyof", recId]],
            columns: [
               search.createColumn({name: "scriptid", sort: search.Sort.ASC, label: "ID de script"})
            ]
         });
         objUpdate.custrecord_ptg_fac_generadas_liq_anden = facturasGeneradas.runPaged().count;
         
         //BÚSQUEDA GUARDADA: PTG - Registro Facturación Generadas Cil Error
         var facturasGeneradasError = search.create({
            type: "customrecord_drt_ptg_registro_factura",
            filters: [["custrecord_ptg_venta_anden","anyof",recId], "AND", ["custrecord_ptg_status","doesnotstartwith","Success"]],
            columns: [
               search.createColumn({name: "scriptid", sort: search.Sort.ASC, label: "ID de script"})
            ]
         });
         objUpdate.custrecord_ptg_fac_con_errores_liq_anden = facturasGeneradasError.runPaged().count;


          record.submitFields({
            id: newRecord.id,
            type: newRecord.type,
            values: objUpdate,
          });        

        } else if (type_event == "edit"){
          if(status == estatusLiquidacion){
              form.addButton({
                  id: "custpage_drt_borrar_montos_ve",
                  label: "Borrar Desglose",
                  functionName: "borrarDesglose()",
              });
          }
      }
      form.clientScriptModulePath = "./drt_ptg_liq_venta_anden_cs.js";
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function afterSubmit(context) {
    try {
      if (context.type == "create") {
        log.audit('Remaining Usage init afterSubmit start', runtime.getCurrentScript().getRemainingUsage());
        var newRecord = context.newRecord;
        var recId = newRecord.id;
        var fechaInicio = newRecord.getValue("custrecord_ptg_fecha_liq_anden");
        var fechaFin = newRecord.getValue("custrecord_ptg_fecha_fin_liq_anden");
        var responsable = newRecord.getValue("custrecord_ptg_responsable_anden");
        var planta = newRecord.getValue("custrecord_ptg_planta_anden_liq");
        var objUpdateAS = {};
        var idRegistro = [];
        var efectivoAnden = 0;
        var tarjetaDebitoAnden = 0;
        var tarjetaCreditoAnden = 0;
        var chequeAnden = 0;
        var cortesiaAnden = 0;
        var valesTraspAnden = 0;
        var creditoClienteAnden = 0;
        var recirculacionAnden = 0;

        if (runtime.envType === runtime.EnvType.SANDBOX) {         
          efectivoAnden = 1;
          tarjetaDebitoAnden = 2;
          tarjetaCreditoAnden = 3;
          chequeAnden = 4;
          cortesiaAnden = 5;
          valesTraspAnden = 6;
          creditoClienteAnden = 7;
          recirculacionAnden = 8;
        } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
          efectivoAnden = 1;
          tarjetaDebitoAnden = 2;
          tarjetaCreditoAnden = 3;
          chequeAnden = 4;
          cortesiaAnden = 5;
          valesTraspAnden = 6;
          creditoClienteAnden = 7;
          recirculacionAnden = 8;
        }

        var d = fechaInicio;
        var conf = config.load({
          type: config.Type.USER_PREFERENCES,
        });
        var tz = conf.getValue("DATEFORMAT");

        var tmInicio = format.format({
          value: d,
          type: format.Type.DATE,
          timezone: tz,
        });
        log.debug("tmInicio", tmInicio);


        var e = fechaFin;

        var tmFin = format.format({
          value: e,
          type: format.Type.DATE,
          timezone: tz,
        });
        log.debug("tmFin", tmFin);

        log.audit('Remaining Usage init afterSubmit start ss', runtime.getCurrentScript().getRemainingUsage());
        //Búsqueda Guardada: PTG - TOTAL DE VENTAS EN ANDEN SS
        var ventasAndenObj = search.create({
          type: "customrecord_ptg_total_ventas_anden_liq",
          filters: [
            ["created","within",tmInicio,tmFin],  "AND", 
             ["custrecord_ptg_id_venta.custrecord_ptg_planta_anden","anyof",planta], "AND", 
             ["custrecord_ptg_id_venta.custrecord_ptg_vendedor_anden","anyof",responsable], "AND", 
             ["custrecord_ptg_id_venta.custrecord_ptg_venta_liquidada_venta_and","is","F"], "AND", 
             ["custrecord_ptg_fro_oportunidad_liq_anden","is","T"]
          ],
          columns: [
             search.createColumn({name: "internalid", label: "ID interno"})
          ]
       });
       log.audit("ventasAndenObj", ventasAndenObj);
       var ventasAndenObjCount = ventasAndenObj.runPaged().count;
       var ventasAndenObjResult = ventasAndenObj.run().getRange({
        start: 0,
        end: ventasAndenObjCount,
      });
      log.audit("ventasAndenObjResult", ventasAndenObjResult);

      log.audit('Remaining Usage init afterSubmit end ss', runtime.getCurrentScript().getRemainingUsage());

      for(i = 0; i < ventasAndenObjCount; i++){
        (idRegistro = ventasAndenObjResult[i].getValue({name: "internalid", label: "ID interno"}));
        

        var objRecord = record.copy({
          type: "customrecord_ptg_total_ventas_anden_liq",
          id: idRegistro,
          isDynamic: true,
        });
        objRecord.setValue("custrecord_ptg_fro_oportunidad_liq_anden", false);
        objRecord.setValue("custrecord_ptg_relacion_liq_anden", recId);

        var ventaSaved = objRecord.save();

        log.debug("Registro copiado", ventaSaved)
      }

      log.audit('Remaining Usage init afterSubmit end rec', runtime.getCurrentScript().getRemainingUsage());

        for(var k = 1; k < 8; k++){
          //Búsqueda Guardada: PTG - DETALLE PAGO EN ANDEN TIPO PAGO SS
          var grupoPagoObj = search.create({
            type: "customrecord_ptg_detalle_pago_anden",
            filters: [
               ["custrecord_ptg_detallepago_.custrecord_ptg_vendedor_anden","anyof",responsable], "AND", 
               ["custrecord_ptg_detallepago_.custrecord_ptg_planta_anden","anyof",planta], "AND", 
               ["custrecord_ptg_detallepago_.custrecord_ptg_venta_liquidada_venta_and","is","F"], "AND", 
               ["custrecord_ptg_tipo_pago_anden","anyof",k], "AND", 
               ["custrecord_ptg_detallepago_.custrecord_ptg_fecha_venta_anden","within",tmInicio,tmFin]
            ],
            columns: [
               search.createColumn({name: "custrecord_ptg_tipo_pago_anden", summary: "GROUP", label: "PTG - TIPO DE PAGO"}),
               search.createColumn({name: "custrecord_ptg_total_detalle", summary: "SUM", label: "PTG - TOTAL"})
            ]
         });
         var grupoPagoObjResult = grupoPagoObj.run().getRange({
          start: 0,
          end: 1,
        });
        if(grupoPagoObjResult.length > 0){
          (sumatoriaTotal = grupoPagoObjResult[0].getValue({name: "custrecord_ptg_total_detalle", summary: "SUM", label: "PTG - TOTAL"})||0);
        } else {
          sumatoriaTotal = 0;
        }
          
          if(k == efectivoAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_efectivo_liq_anden = sumatoriaTotal;
            objUpdateAS.custrecord_ptg_desglose_efec_liq_anden = sumatoriaTotal;
          } else if(k == tarjetaDebitoAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_td_liq_anden = sumatoriaTotal;
          } else if(k == tarjetaCreditoAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_tc_liq_anden = sumatoriaTotal;
          } else if(k == chequeAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_cheque_liq_anden = sumatoriaTotal;
          } else if(k == cortesiaAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_cortesia_liq_anden = sumatoriaTotal;
          } else if(k == valesTraspAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_valestran_liq_anden = sumatoriaTotal;
          } else if(k == creditoClienteAnden){
            log.debug("Pago "+k, sumatoriaTotal);
            objUpdateAS.custrecord_ptg_total_credito_c_liq_anden = sumatoriaTotal;
          }

        }
        log.audit("objUpdateAS", objUpdateAS);

        record.submitFields({
          id: recId,
          type: newRecord.type,
          values: objUpdateAS,
        });


      log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());
       }
    } catch (e) {
      log.error({
        title: e.name,
        details: e.message,
      });
    }
  }

  function beforeSubmit(context){
    try {
      if (context.type == "create") {
      var newRecord = context.newRecord;
      var folio = newRecord.getValue("custrecord_ptg_numero_liquidacion");

      if(!folio){
        var liqVentaAndenObj = search.create({
          type: "customrecord_ptg_liquidacion_venta_anden",
          filters: [],
          columns: []
        });
        var liqVentaAndenObjCount = liqVentaAndenObj.runPaged().count;

        if(liqVentaAndenObjCount > 0){
          var folio = liqVentaAndenObjCount + 1;
          newRecord.setValue("custrecord_ptg_numero_liquidacion", folio.toFixed(0));
          newRecord.setValue("name", folio.toFixed(0));
        } else {
          newRecord.setValue("custrecord_ptg_numero_liquidacion", 1);
          newRecord.setValue("name", 1);
        }
      }
    }
        
    } catch (error) {
      
    }
  }
  return {
    afterSubmit: afterSubmit,
    beforeLoad: beforeLoad,
    beforeSubmit: beforeSubmit,
  };
});