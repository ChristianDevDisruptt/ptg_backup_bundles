/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Registro para crear clientes CS
 * Script id: customscript_drt_ptg_registro_cliente_cs
 * customer Deployment id: customdeploy_drt_ptg_registro_cliente_cs
 * Applied to: PTG - Registro para crear clientes
 * File: drt_ptg_registro_clientes_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(["N/record", "N/search", "N/error", "N/runtime",  "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function pageInit(context) {
        try {
          var currentRecord = context.currentRecord;
          var parametroRespuesta = window.location.search;
          log.audit("parametroRespuesta", parametroRespuesta);
          var urlParametro = new URLSearchParams(parametroRespuesta);
          log.audit("urlParametro", urlParametro);
          var parametroPlanta = urlParametro.get('planta');
          log.audit("parametroPlanta", parametroPlanta);

          if(parametroPlanta){
            currentRecord.setValue("custrecord_ptg_registro_cliente_planta", parametroPlanta);
          }
          
        } catch (error) {
          console.log({
            title: "error pageInit",
            details: JSON.stringify(error),
          });
        }
  
    }

    return {
      pageInit: pageInit,
    };
  });
