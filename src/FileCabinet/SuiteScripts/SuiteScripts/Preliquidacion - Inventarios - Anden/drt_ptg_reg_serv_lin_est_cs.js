/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 06/2022
 * Script name: PTG - Registro Servicios Linea Estaci CS
 * Script id: customscript_drt_ptg_reg_serv_lin_est_cs
 * customer Deployment id: customdeploy_drt_ptg_reg_serv_lin_est_cs
 * Applied to: PTG - Registro de Servicios Linea Estaci
 * File: drt_ptg_reg_serv_lin_est_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/currentRecord", "N/ui/dialog"], function (record, search, error, currentRecord, dialog) {
    function fieldChanged(context) {
        try {
            debugger;
            var currentRecord = context.currentRecord;
            var cabeceraFieldName = context.fieldId;
            var sublistName = context.sublistId;
            var cantidad = currentRecord.getValue("custrecord_ptg_cantidad_reg_serv_est_lin");
            var precio = currentRecord.getValue("custrecord_ptg_precio_reg_serv_est_lin");


            if((cantidad && cabeceraFieldName === "custrecord_ptg_cantidad_reg_serv_est_lin")||
            (precio && cabeceraFieldName === "custrecord_ptg_precio_reg_serv_est_lin")){
              subtotal = cantidad * precio;
              impuesto = subtotal * 0.16;
              total = subtotal + impuesto;
              currentRecord.setValue("custrecord_ptg_subtotal_registro_servs_e", subtotal);
              currentRecord.setValue("custrecord_ptg_impuesto_reg_serv_est_lin", impuesto);
              currentRecord.setValue("custrecord_ptg_total_reg_serv_est_lin", total);
            }


        } catch (error) {
            log.debug({
                title: "error fieldChanged",
                details: JSON.stringify(error),
            });
        }
    }
    
    return {
        fieldChanged: fieldChanged,
    };
});
