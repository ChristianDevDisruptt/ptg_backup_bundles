/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Pagos Farmacias Guadalajara Lin UE
 * Script id: customscript_drt_ptg_pag_far_gld_li_ue
 * Deployment id: customdeploy_drt_ptg_pag_far_gld_li_ue
 * Applied to: PTG - Pagos Farmacias Guadalajara Lineas
 * File: drt_ptg_pag_far_gld_li_ue.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/record', 'N/format', 'N/search'], function (record, format, search) {

    function afterSubmit(context) {
        try {
            //if (context.type == "create") {

            var newRecord = context.newRecord;
            var contratoCliente = newRecord.getValue("custrecord_ptg_no_contrato_farm_gdl_l");
            var referencia = newRecord.getValue("custrecord_ptg_ref_pago_farm_gdl_l");
            var fecha = newRecord.getValue("custrecord_ptg_fecha_pago_farm_gdl_l");
            var importe = newRecord.getValue("custrecord_ptg_importe_pago_farm_gdl_l");
            //Búsqueda Guardada: PTG - Pagos Farmacias GDL SS
            var customerSearchObj = search.create({
                type: "customer",
                filters: [["address.custrecord_ptg_numero_contrato", "is", contratoCliente]],
                columns: [
                    search.createColumn({name: "internalid", label: "ID interno"})
                ]
             });

             var srchResults = customerSearchObj.run().getRange({
                start: 0,
                end: 2,
              });
              
              (idCliente = srchResults[0].getValue({name: "internalid", label: "ID interno"}));

            //Búsqueda Guardada: DRT - Oportunidad Relacion SS
            var opportunitySearchObj = search.create({
                type: "opportunity",
                filters: [["numbertext","is",referencia]],
                columns:[
                   search.createColumn({name: "internalid", label: "ID interno"})
                ]
             });
             
             var oportunidadSrchResults = opportunitySearchObj.run().getRange({
                start: 0,
                end: 2,
              });
              
              (idOportunidad = oportunidadSrchResults[0].getValue({name: "internalid", label: "ID interno"}));

            //Búsqueda Guardada: DRT - Filtro Factura de Venta SS
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters: [
                   ["type","anyof","CustInvc"], 
                   "AND", 
                   ["opportunity","anyof",idOportunidad], 
                   "AND", 
                   ["mainline","is","T"]
                ],
                columns: [
                   search.createColumn({name: "internalid", label: "ID interno"})
                ]
             });

             var invoiceSrchResults = invoiceSearchObj.run().getRange({
                start: 0,
                end: 2,
              });
              
              (idFactura = invoiceSrchResults[0].getValue({name: "internalid", label: "ID interno"}));
              log.debug("Factura Creado con: ", idFactura);
           
              var pagoObj = record.transform({
                fromType: record.Type.INVOICE,
                fromId: idFactura,
                toType: record.Type.CUSTOMER_PAYMENT,
                isDynamic: false
            });


            pagoObj.setValue("trandate", fecha);

            var pagoObjID = pagoObj.save({
                ignoreMandatoryFields: true
            });
            log.debug("Pago Creado con: ", pagoObjID);

            objUpdate = {
                custrecord_ptg_cliente_farm_gdl_l: idCliente,
                custrecord_ptg_pago_farm_gdl_l: pagoObjID,
                custrecord_ptg_fac_farm_gdl_l: idFactura
            }

            var actualizar = record.submitFields({
                id: newRecord.id,
                type: newRecord.type,
                values: objUpdate,
            });

            log.debug("Registro actualizado", actualizar);


            
        //}
        } catch (error) {
            log.audit('error afterSubmit', error);
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});