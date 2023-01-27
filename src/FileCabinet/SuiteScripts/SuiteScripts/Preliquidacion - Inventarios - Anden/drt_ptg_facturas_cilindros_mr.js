/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 07/2022
 * Script name: PTG - Filtro Facturas
 * Script id: customscript_ptg_filtro_facturas
 * Deployment id: customdeploy_ptg_filtro_facturas
 * Applied to: 
 * File: drt_ptg_facturas_cilindros_mr.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';
            var tipo_servicio = runtime.getCurrentScript().getParameter({
                name: 'custscript_ptg_tipo_servicio_facturas'
            }) || '';
            log.audit("tipo_servicio", tipo_servicio);

            var registro_preliquidacion = runtime.getCurrentScript().getParameter({
                name: 'custscript_ptg_registro_preliquidacion'
            }) || '';
            log.audit("registro_preliquidacion", registro_preliquidacion);

            if(tipo_servicio == 1){
                var arrayColumns = [
                    search.createColumn({name: "custrecord_ptg_oportunidad_", label: "PTG - Oportunidad"})
                ];
                
                var arrayFilters = [
                   ["custrecord_ptg_optpreliq_","anyof",registro_preliquidacion], "AND", 
                   ["custrecord_ptg_invalidar_reg_oport","is","T"]
                ];
               
                //SS: PTG - Registro de Oportunidad Invalidar - Cilindros
                respuesta = search.create({
                    type: 'customrecord_ptg_registrooportunidad_',
                    columns: arrayColumns,
                    filters: arrayFilters
                });
            } else if(tipo_servicio == 2){
                var arrayColumns = [
                    search.createColumn({name: "custrecord_ptg_oportunidad_estacionario", label: "PTG - OPORTUNIDAD ESTACIONARIO"})
                ];
                
                var arrayFilters = [
                   ["custrecord_ptg_preliqui_rel_vts_","anyof",registro_preliquidacion], "AND", 
                   ["custrecord_ptg_invalidar_est_vts_","is","T"]
                ];
               
                //SS: PTG - Ventas Invalidar - Estacionario
                respuesta = search.create({
                    type: 'customrecord_ptg_ventas_estacionario',
                    columns: arrayColumns,
                    filters: arrayFilters
                });
            }

            var respuestaCount = respuesta.runPaged().count;
            log.audit("respuestaCount", respuestaCount);

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
            var objValue = JSON.parse(context.value);

            var tipo_servicio = runtime.getCurrentScript().getParameter({
                name: 'custscript_ptg_tipo_servicio_facturas'
            }) || '';
            var registro_preliquidacion = runtime.getCurrentScript().getParameter({
                name: 'custscript_ptg_registro_preliquidacion'
            }) || '';

            if(tipo_servicio == 1){

                var idOportunidad = objValue.values["custrecord_ptg_oportunidad_"].value;
                log.audit("idOportunidad", idOportunidad);

                var objUpdateOportundiad = {
                    custbody_ptg_servicio_invalidado: true,
                };

                var oportunidadUpd = record.submitFields({
                    type: record.Type.OPPORTUNITY,
                    id: idOportunidad,
                    values: objUpdateOportundiad,
                });

                log.audit("Oportundiad Actualizada", oportunidadUpd);
            
                //SS: PTG - Oportunidades a Facturar Filtro - Cil
                var cilindroEstacionarioObj = search.create({
                    type: "customrecord_ptg_oportunidad_facturar",
                    filters: [
                        ["custrecord_ptg_id_oportunidad_fact","anyof",idOportunidad], "AND", 
                        ["custrecord_ptg_preliq_cilindros","anyof",registro_preliquidacion]
                    ],
                    columns: [
                        search.createColumn({name: "internalid", label: "ID interno"})
                    ]
                });
                var cilindroEstacionarioObjResult = cilindroEstacionarioObj.run().getRange({
                    start: 0,
                    end: 3,
                });

                idRegistro = cilindroEstacionarioObjResult[0].getValue({name: "internalid", label: "ID interno"});
                
                var objUpdateRegistro = {
                    isinactive: true,
                };
                var registroUpd = record.submitFields({
                    type: "customrecord_ptg_oportunidad_facturar",
                    id: idRegistro,
                    values: objUpdateRegistro,
                });
                log.audit("Registro Actualizado", registroUpd);
            } else if (tipo_servicio == 2){
                var idOportunidad = objValue.values["custrecord_ptg_oportunidad_estacionario"].value;
                log.audit("idOportunidad", idOportunidad);

                var objUpdateOportundiad = {
                    custbody_ptg_servicio_invalidado: true,
                };

                var oportunidadUpd = record.submitFields({
                    type: record.Type.OPPORTUNITY,
                    id: idOportunidad,
                    values: objUpdateOportundiad,
                });

                log.audit("Oportundiad Actualizada", oportunidadUpd);

                //SS: PTG - Ventas Invalidar - Estacionario Upd Registros
                var ventasRegistroObj = search.create({
                    type: "customrecord_ptg_ventas_estacionario",
                    filters: [
                       ["custrecord_ptg_oportunidad_estacionario","anyof",idOportunidad], "AND", 
                       ["custrecord_ptg_preliqui_rel_vts_","anyof",registro_preliquidacion], "AND", 
                       ["custrecord_ptg_invalidar_est_vts_","is","F"]
                    ],
                    columns: [
                       search.createColumn({name: "internalid", label: "ID interno"})
                    ]
                });

                var ventasRegistroObjCount = ventasRegistroObj.runPaged().count;
                if(ventasRegistroObjCount > 0){
                    var ventasRegistroObjResult = ventasRegistroObj.run().getRange({
                        start: 0,
                        end: ventasRegistroObjCount,
                    });
    
                    for(var i = 0; i < ventasRegistroObjCount; i++){
                        idRegistro = ventasRegistroObjResult[i].getValue({name: "internalid", label: "ID interno"});
                        var updRegistroVentas = {
                            custrecord_ptg_invalidar_est_vts_: true,
                        };
    
                        var actualizarRegistro = record.submitFields({
                            type: customrecord_ptg_ventas_estacionario,
                            id: idRegistro,
                            values: updRegistroVentas
                        });
    
                        log.audit("Registros Actualizados", actualizarRegistro);
                    }
                }

                //SS: PTG - Oportunidades a Facturar Filtro - Est
                var cilindroEstacionarioObj = search.create({
                    type: "customrecord_ptg_oportunidad_facturar",
                    filters: [
                        ["custrecord_ptg_id_oportunidad_fact","anyof",idOportunidad], "AND", 
                        ["custrecord_ptg_preliq_estacionarios","anyof",registro_preliquidacion]
                    ],
                    columns: [
                        search.createColumn({name: "internalid", label: "ID interno"})
                    ]
                });
                var cilindroEstacionarioObjResult = cilindroEstacionarioObj.run().getRange({
                    start: 0,
                    end: 3,
                });

                idRegistro = cilindroEstacionarioObjResult[0].getValue({name: "internalid", label: "ID interno"});
                
                var objUpdateRegistro = {
                    isinactive: true,
                };
                var registroUpd = record.submitFields({
                    type: "customrecord_ptg_oportunidad_facturar",
                    id: idRegistro,
                    values: objUpdateRegistro,
                });
                log.audit("Registro Actualizado", registroUpd);

                
                
            }

            context.write({
                key: oportunidadUpd,
                value: oportunidadUpd
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