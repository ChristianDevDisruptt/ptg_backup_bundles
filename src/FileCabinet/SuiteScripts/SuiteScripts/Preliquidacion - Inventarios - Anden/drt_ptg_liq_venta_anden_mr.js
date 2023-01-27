/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: DRT - Liquidación Venta Anden MR
 * Script id: customscript_drt_ptg_liq_venta_anden_mr
 * Deployment id: customdeploy_drt_ptg_liq_venta_anden_mr
 * Applied to: 
 * File: drt_ptg_liq_venta_anden_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';

            var fechaInicioSearch = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_fecha_inicio_va'
            }) || '';

            var fechaFinSearch = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_fecha_fin_va'
            }) || '';
             
            var arrayColumns = [
                search.createColumn({name: "internalid", label: "Internal ID"}),
                search.createColumn({name: "custrecord_ptg_folio_anden", label: "PTG - FOLIO"}),
                search.createColumn({name: "custrecord_ptg_tipos_de_pago", join: "CUSTRECORD_PTG_PAGO_ANDEN_RELACION", label: "PTG - Tipos de Pago"}),
                search.createColumn({name: "custrecord_ptg_cliente", label: "PTG - CLIENTE"}),
                search.createColumn({name: "custrecord_ptg_articulo_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - ARTICULO"}),
                search.createColumn({name: "custrecord_ptg_cantidad_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - CANTIDAD"}),
                search.createColumn({name: "custrecord_ptg_precio_unitario_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - PRECIO UNITARIO"}),
                search.createColumn({name: "custrecord_ptg_importe_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - IMPORTE"}),
                search.createColumn({name: "custrecord_ptg_impuesto_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - IMPUESTO"}),
                search.createColumn({name: "custrecord_ptg_total_anden", join: "CUSTRECORD_PTG_LINEA_VENTA_ANDEN", label: "PTG - TOTAL"})
            ];

            var arrayFilters = [
                ["custrecord_ptg_fecha_venta_anden","within",fechaInicioSearch,fechaFinSearch]
            ];

            //BÚSQUEDA GUARDADA: PTG - VENTA ANDEN LIQUIDACION
            respuesta = search.create({
                type: 'customrecord_ptg_venta_anden',
                columns: arrayColumns,
                filters: arrayFilters
            });


        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            log.audit({
                title: 'context map',
                details: JSON.stringify(context)
            });

            var idPlanta = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_registro_liq_va'
            }) || '';
            log.debug("idPlanta", idPlanta);

            var objValue = JSON.parse(context.value);

            var idVenta = objValue.values["internalid"].value;
            var folio = objValue.values["custrecord_ptg_folio_anden"];
            var tipoPago = objValue.values["custrecord_ptg_tipos_de_pago.CUSTRECORD_PTG_PAGO_ANDEN_RELACION"];
            var cliente = objValue.values["custrecord_ptg_cliente"].value;
            var articulo = objValue.values["custrecord_ptg_articulo_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"].value;
            var cantidad = objValue.values["custrecord_ptg_cantidad_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"];
            var precioUnitario = objValue.values["custrecord_ptg_precio_unitario_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"];
            var importe = objValue.values["custrecord_ptg_importe_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"];
            var impuesto = objValue.values["custrecord_ptg_impuesto_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"];
            var total = objValue.values["custrecord_ptg_total_anden.CUSTRECORD_PTG_LINEA_VENTA_ANDEN"];
            var entityObj = record.load({
                type: record.Type.CUSTOMER,
                id: cliente,
            });
            var direccion = entityObj.getValue("defaultaddress");

            var recTotalVentasAnden = record.create({
                type: "customrecord_ptg_total_ventas_anden_liq",
                isDynamic: true,
            });
            recTotalVentasAnden.setValue("custrecord_ptg_id_venta", idVenta);
            recTotalVentasAnden.setValue("custrecord_ptg_folio_venta_liq_anden", folio);
            recTotalVentasAnden.setValue("custrecord_ptg_forma_pago_liq_anden", tipoPago);
            recTotalVentasAnden.setValue("custrecord_ptg_cliente_liq_anden", cliente);
            recTotalVentasAnden.setValue("custrecord_ptg_direccion_embar_liq_anden", direccion);
            recTotalVentasAnden.setValue("custrecord_ptg_articulo_liq_anden", articulo);
            recTotalVentasAnden.setValue("custrecord_ptg_litros_cantidad_liq_anden", cantidad);
            recTotalVentasAnden.setValue("custrecord_ptg_precio_unitario_liq_anden", precioUnitario);
            recTotalVentasAnden.setValue("custrecord_ptg_importe_liq_anden", importe);
            recTotalVentasAnden.setValue("custrecord_ptg_impuesto_liq_anden", impuesto);
            recTotalVentasAnden.setValue("custrecord_ptg_total_venta_liq_anden", total);
            recTotalVentasAnden.setValue("custrecord_ptg_relacion_liq_anden", idRegistro);
            var recTotalVentasAndenIdSaved = recTotalVentasAnden.save();
            log.debug({
                title: "Total Venta Anden",
                details: "Id Saved: " + recTotalVentasAndenIdSaved,
            });

            context.write({
                key: recObjID,
                value: recObjID
            });
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idFactura = JSON.parse(context.key);
            log.audit("idFactura", idFactura);
            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});