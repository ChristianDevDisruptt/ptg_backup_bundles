/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Obtener las oportunidades por estados
 */
define(['N/log', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos', 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors', 'N/record', 'N/format'], function (log, opport, error, record, format) {

    // se crea la estructura donde se cargará toda la data
    const responseData = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null,
        apiErrorGet: [],
        apiErrorPost: []
    }

    // función que obtiene las oportunidades
    function getOpportunityStatus(params) {

        log.debug({ title: "Params", details: params })
        // try catch para capturar el error
        try {
            // id capturado de params en decimal
            let salesRepId = parseInt(params.operarioId, 10);
            let status = params.status
            // arreglo vacio que tendra la data en objetos
            var resultArray = [];
            // ejecución de la funcion que obtiene las oportunidades filtradas
            // para màs detalle ver la funcion en el siguiente modulo : ptg_modulo_aoportunidades.js
            responseData.isSuccessful = opport.getServiceStatus(salesRepId, status, resultArray, responseData);

            log.debug({
                title: 'responseData',
                details: responseData
            })


            // LOGICA PRINCIPAL
            // Si responseData.isSuccessful es true, se valida que ha cargado la data
            if (responseData.isSuccessful) {
                responseData.message = 'Lista de servicios en curso';
                responseData.apiErrorGet = null;
            }

        } catch (error) {
            log.debug({
                title: "error",
                details: error.message
            })
        }

        // se retorna el objeto con todos los cambios y el cargue de data

        return JSON.stringify(responseData)
    }



    return {
        get: getOpportunityStatus,
    }
});