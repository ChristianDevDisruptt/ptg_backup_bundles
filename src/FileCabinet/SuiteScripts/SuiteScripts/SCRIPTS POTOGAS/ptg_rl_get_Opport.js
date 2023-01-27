/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Obtener las oportunidades por medio de una busqueda guardada
 */
define(['N/log', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos', 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors', 'N/record', 'N/format', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos.ext'],
    /**
     * 
     * @param {import('N/log')} log 
     * @param {*} opport 
     * @param {import('N/error')} error 
     * @param {import('N/record')} record 
     * @param {import('N/format')} format 
     * @param {import('./ptg_modulos.ext')} oport_details 
     * @returns */
    function (log, opport, error, record, format, oport_details) {

        const TEST_MODE = false;
        const MODE_DETAILS = "details";
        // se crea la estructura donde se cargará toda la data
        const responseData = {
            isSuccessful: false,
            message: "Some errors occured",
            data: null,
            apiErrorGet: [],
            apiErrorPost: []
        }

        /**
         * @typedef {object} get_payload
         * @property {'details'|null} type
         * @property {number} operarioId
         */


        /**  
         * Función que obtiene las oportunidades
         */
        function getOpportunity(params) {

            /** @type {get_payload} */
            let customParams = params

            log.debug({ title: "Params", details: params })
            // try catch para capturar el error
            try {
                // id capturado de params en decimal
                let salesRepId = parseInt(customParams.operarioId, 10);
                // arreglo vacio que tendra la data en objetos
                var resultArray = [];

                switch (params.type) {
                    case MODE_DETAILS:

                        // TEST
                        let from = new Date();
                        let to = from;
                        
                        if (TEST_MODE) {
                            to = new Date();
                            from = new Date(to.getTime() - (86400000 * 15));
                        }

                        responseData.data = oport_details.getSalesDetails(salesRepId, from, to)
                        responseData.isSuccessful = true;
                        responseData.message = 'Ventas realizadas';
                        break;
                    default:
                        // ejecución de la funcion que obtiene las oportunidades filtradas
                        // para màs detalle ver la funcion en el siguiente modulo : ptg_modulo_aoportunidades.js
                        responseData.isSuccessful = opport.getTodayService(salesRepId, resultArray, responseData);
                        responseData.message = 'Lista de servicio de dia de hoy';
                        break;
                }

                log.debug({ title: 'responseData', details: responseData })

                // LOGICA PRINCIPAL
                // Si responseData.isSuccessful es true, se valida que ha cargado la data
                if (responseData.isSuccessful) {
                    responseData.apiErrorGet = null;
                }

            } catch (error) {
                log.debug({ title: "error", details: error.message })
            }

            // se retorna el objeto con todos los cambios y el cargue de data

            return JSON.stringify(responseData)
        }



        return {
            get: getOpportunity,
        }
    });
