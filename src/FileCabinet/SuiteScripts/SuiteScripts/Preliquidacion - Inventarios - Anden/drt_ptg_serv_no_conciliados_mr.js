/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 08/2022
 * Script name: PTG - SERV NO CONCILIADO MR
 * Script id: customscript_ptg_serv_no_conciliados_mr
 * customer Deployment id: customdeploy_ptg_serv_no_conciliados_mr
 * Applied to:
 * File: drt_ptg_serv_no_conciliados_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';
            var id_search = runtime.getCurrentScript().getParameter({
                name: 'custscript_ptg_reg_historico'
            }) || '';
            log.audit("id_search 1", id_search);

            var arrayColumns = [
                search.createColumn({name: "custrecord_ptg_json_historico_concil", label: "PTG - JSON" }),
            ];
            log.audit("arrayColumns", arrayColumns);

            var arrayFilters = [
                ['internalid', search.Operator.ANYOF, id_search]
             ];
             log.audit("arrayFilters", arrayFilters);
            
                respuesta = search.create({
                    type: 'customrecord_ptg_historico_conciliacion',
                    columns: arrayColumns,
                    filters: arrayFilters
                });

                var respuestaResultCount = respuesta.runPaged().count;
                log.debug("respuestaResultCount", respuestaResultCount);

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
            log.audit("objValueM", objValue);

            var objValueJSONHistorico = objValue.values["custrecord_ptg_json_historico_concil"];
            log.audit("objValueJSONHistorico", objValueJSONHistorico);
            var objValueJSON = JSON.parse(objValueJSONHistorico);
            log.audit("objValueJSON", objValueJSON);

            for (var j = 0; j < objValueJSON.length; j++){
                var objPos = objValueJSON[j];
                var idInterno = objPos.idInterno;
                var customer = objPos.customer;
                log.audit("idInterno", idInterno);
                log.audit("customer", customer);

                var objUpdate = {
                    custrecord_ptg_cliente_sin_conciliar: customer
                };
                var historico = record.submitFields({
                    id: idInterno,
                    type: "customrecord_ptg_registros_sin_conciliar",
                    values: objUpdate
                });
                log.audit("historico", historico);
            }
            
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
        } finally {
            log.debug({
                title: 'Termina proceso',
                details: 'Termina proceso'
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