/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
define(['N/runtime', 'N/search', 'N/record'], function (runtime, search, record) {

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_search_periodo'
            }) || '';

            log.audit({
                title: 'id_search',
                details: JSON.stringify(id_search)
            });
            if (id_search) {
                respuesta = search.load({
                    id: id_search
                });
            }
        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta getInputData',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            var objvalue = JSON.parse(context.value)
            context.write({
                key: objvalue.id,
                value: objvalue
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
          	var idRec = context.key;
			log.audit('idRec', idRec);
			
    		var subsSrch = search.load({//búsqueda de subsidiarias por si se crea una nueva
    			id : 'customsearch_drt_busqueda_subsidiaria'
    		});
    		var subsSrchResults = subsSrch.run().getRange({
    			start : 0,
    			end   : 999
    		});
			
			//------Obtener parametros y hacer objeto
			var objConfig = {};
			
			objConfig.idPeriodo			= idRec;
			objConfig.ajusteInv 		= runtime.getCurrentScript().getParameter('custscript_drt_ajusteinv') || false;
			objConfig.asientoContable 	= runtime.getCurrentScript().getParameter('custscript_drt_asientocontable') || false;
			objConfig.asientoContableEmp= runtime.getCurrentScript().getParameter('custscript_drt_asientocontableemp') || false;
			objConfig.autDev 			= runtime.getCurrentScript().getParameter('custscript_drt_autorizacion_devolucion') || false;
			objConfig.autDevProv 		= runtime.getCurrentScript().getParameter('custscript_drt_autorizacion_devolucion_p') || false;
			objConfig.creditoProv 		= runtime.getCurrentScript().getParameter('custscript_drt_credito_provedor') || false;
			objConfig.factProv 			= runtime.getCurrentScript().getParameter('custscript_drt_factura_compra') || false;
			objConfig.factVenta 		= runtime.getCurrentScript().getParameter('custscript_drt_factura_venta') || false;
			objConfig.notaCredito 		= runtime.getCurrentScript().getParameter('custscript_drt_nota_credito') || false;
			objConfig.ordenCompra 		= runtime.getCurrentScript().getParameter('custscript_drt_orden_compra') || false;
			objConfig.ordenTraslado 	= runtime.getCurrentScript().getParameter('custscript_drt_orden_traslado') || false;
			objConfig.ordenVenta 		= runtime.getCurrentScript().getParameter('custscript_drt_orden_venta') || false;
			objConfig.pagoAntProv 		= runtime.getCurrentScript().getParameter('custscript_drt_pago_anticipado_proveedor') || false;
			objConfig.pagoProv 			= runtime.getCurrentScript().getParameter('custscript_drt_pago_proveedor') || false;
			objConfig.pagoCliente 		= runtime.getCurrentScript().getParameter('custscript_drt_pago_cliente') || false;
			objConfig.recepcionArt 		= runtime.getCurrentScript().getParameter('custscript_drt_recepcion_articulo') || false;
			objConfig.trasladoInv 		= runtime.getCurrentScript().getParameter('custscript_drt_traslado_inventario') || false;
			objConfig.ventaEfectivo 	= runtime.getCurrentScript().getParameter('custscript_drt_venta_efectivo') || false;
			
			log.audit({ title: 'objConfig', details: JSON.stringify(objConfig) });
			
    		for (var i = 0; i < subsSrchResults.length; i++) {
    			
    			var idSubsidiaria = subsSrchResults[i].getValue({
    				name: 'internalid'
    			});
				
				crearConfig(objConfig,idSubsidiaria);
    			
    		} 
		
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(summary) {

    }
	
	function crearConfig(objConfig,idSubsidiaria) {
		
		log.audit('idSubsidiaria', idSubsidiaria);
		
		var configRec = record.create({
			type : 'customrecord_drt_configuracion_cierre_p'
		});
		
		//Se le asignan al registro los valores obtenidos
		configRec.setValue('custrecord_drt_periodo_a_cerrar', objConfig.idPeriodo);
		configRec.setValue('custrecord_drt_subsidiaria_2', idSubsidiaria);
		configRec.setValue('custrecord_drt_ajuste_inventario', objConfig.ajusteInv);	
		configRec.setValue('custrecord_drt_asiento_contable', objConfig.asientoContable);
		configRec.setValue('custrecord_drt_asiento_contable_entre_em', objConfig.asientoContableEmp);
		configRec.setValue('custrecord_drt_autorizacion_devolucion', objConfig.autDev);
		configRec.setValue('custrecord_drt_autorizacion_devolucion_p', objConfig.autDevProv);
		configRec.setValue('custrecord_drt_credito_provedor', objConfig.creditoProv);
		configRec.setValue('custrecord_drt_factura_proveedor', objConfig.factProv);
		configRec.setValue('custrecord_drt_factura_venta', objConfig.factVenta);
		configRec.setValue('custrecord_drt_nota_credito', objConfig.notaCredito);
		configRec.setValue('custrecord_drt_orden_compra', objConfig.ordenCompra);
		configRec.setValue('custrecord_drt_orden_traslado', objConfig.ordenTraslado);
		configRec.setValue('custrecord_drt_orden_venta', objConfig.ordenVenta);
		configRec.setValue('custrecord_drt_pago_anticipado_proveedor', objConfig.pagoAntProv);
		configRec.setValue('custrecord_drt_pago_proveedor', objConfig.pagoProv);
		configRec.setValue('custrecord_drt_pago_cliente', objConfig.pagoCliente);
		configRec.setValue('custrecord_drt_recepcion_articulo', objConfig.recepcionArt);
		configRec.setValue('custrecord_drt_traslado_inventario', objConfig.trasladoInv);
		configRec.setValue('custrecord_drt_venta_efectivo', objConfig.ventaEfectivo);
		
		var configRecId = configRec.save();    	
		log.audit('configRecId', configRecId);
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});