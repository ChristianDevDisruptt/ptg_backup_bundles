/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Creacion de servicio de antojados
 */
define(['N/log', 'SuiteScripts/SCRIPTS POTOGAS/ptg_modulos', 'SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors', 'N/record', 'N/format'], function (log, opport, error, record, format) {

    // se crea estructura donde se cargarà toda la data
    const responseData = {
        success: true,
        message: "",
        data: null,
        apiErrorGet: [],
        apiErrorPost: []
    }

    function putOpportunity(request) {
        log.audit("request", request);
        let noteRecord = record.load({
            type: "note",
            id: request.id,
            isDynamic: true
        });

        try {
            for (var field in request.bodyFields) {
                noteRecord.setValue({
                    fieldId: field,
                    value: request.bodyFields[field]
                });
            }
            noteRecord.save();
        } catch (error) {
            log.audit('error', error);
            responseData.success = false;
        }
        return responseData
    }



    return {
        put: putOpportunity
    }

});