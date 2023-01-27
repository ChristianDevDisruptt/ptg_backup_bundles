/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Juan Cocom
 *@description Reslet para el manejo de quejas.
 */

/** 
 * Definición del modulo personalizado
 * El reslet tiene la intención de permitir realizar el movimiento del inventario (registro personalizado) entre los vehiculos en operación.
 * @param {import('N/record')} record 
 * @param {import('N/format')} format  
 * @param {import('N/search')} search 
 * @param {import('N/url')} url 
 */
function detailsModule(record, format, search, url) {
    const entryPoints = {
        /** @type {import('N/types').EntryPoints.RESTlet.post} */
        post: null,

        ///** @type {import('N/types').EntryPoints.RESTlet.get} */
        //get: null
    }

    entryPoints.post = function (context) {
        log.debug("CONTEXT", context)
        if (Object.keys(context).length == 0) {

            return JSON.stringify(getErrorInResponse('POST', "Error en objeto argumento", []))
        }

        let payload = JSON.parse(JSON.stringify(context));

        // campos de paginacion predeterminados, inicia en ceros
        payload.page = payload.page || 0;
        payload.pageSize = payload.pageSize || 1000;

        let errors = []

        if (payload.mode) {
            switch (payload.mode) {
                case "STATES": case "states":
                    return JSON.stringify(searchAvailableStates(payload));
                case "PENDING": case "pending":
                    return JSON.stringify(searchFailures(payload, 'PENDIENTE'));
                case "DONE": case "done":
                    return JSON.stringify(searchFailures(payload, 'ATENDIDO'));
                default: return JSON.stringify(getErrorInResponse('POST', 'Opcion no válida'))

            }
        }
        else {
            try {
                return updateService(payload)
            } catch (error) {
                log.debug("ERROR", error);
                errors.unshift("Cannot create!");
                errors.push(error.message);
                return JSON.stringify(getErrorInResponse("POST", "Fallido", errors));
            }

        }
    }

    function searchFailures(context, stateStr) {
        let concepts = [];
        let customSearch = search.create({
            type: 'customrecord_ptg_fuga',
            columns: [
                'custrecord_ptg_fuga_domicilio',
                'custrecord_ptg_fuga_detail_case',
                'custrecord_ptg_fuga_concept',
                'custrecord_ptg_fuga_priority'
            ],
            filters: [
                ["formulatext: {custrecord_ptg_fuga_state}", "is", stateStr], 'AND',
                ['isinactive', 'is', 'F']
            ]
        })

        let customSearchPagedData = customSearch.runPaged({ pageSize: context.pageSize });
        let ranges = customSearchPagedData.pageRanges;
        log.debug("RANGES", ranges);
        ranges.filter(x => x.index == context.page).forEach(pageRange => {
            let currentPage = customSearchPagedData.fetch({ index: pageRange.index })
            currentPage.data.forEach((result, indx, origingArray) => {
                /// Do something
                concepts.push({
                    address: result.getValue({ name: "custrecord_ptg_fuga_domicilio" }),
                    details: result.getValue({ name: "custrecord_ptg_fuga_detail_case" }),
                    concept: result.getValue({ name: "custrecord_ptg_fuga_concept" }),
                    priority: result.getValue({ name: "custrecord_ptg_fuga_priority" }),
                    id: result.id
                })
            })
        })

        return getResponse("Solicitud '" + stateStr + "' exitosa", concepts)

    }

    function searchAvailableStates(context) {

        try {

            let res = [];
            let customSearch = search.create({
                type: 'customlist_ptg_fail_states',
                columns: ["name"],
                filters: []
            });

            let customSearchPagedData = customSearch.runPaged({ pageSize: context.pageSize });
            let ranges = customSearchPagedData.pageRanges;
            log.debug("RANGES", ranges);
            ranges.filter(x => x.index == context.page).forEach(pageRange => {
                let currentPage = customSearchPagedData.fetch({ index: pageRange.index });
                currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    res.push({
                        name: result.getValue('name'),
                        value: result.id
                    });
                });
            });

            return getResponse("Solicitud exitosa", res)
        } catch (error) {
            return getErrorInResponse("GET", error.message)
        }

    }

    /**
    * Crea un objeto de respuesta exitoso
    * @param {string} message 
    * @param {object} body 
    * @returns 
    */
    function getResponse(message, body) {
        return {
            isSuccessful: true,
            message: message,
            data: body,
            apiErrorGet: [],
            apiErrorPost: []
        }
    }

    /**
     * Genera un formato de error
     * @param {"GET"| "POST"} mode 
     * @param {string} message 
     * @param {string[]} details 
     * @returns 
     */
    function getErrorInResponse(mode, message, details) {

        return {
            isSuccessful: false,
            message: message,
            data: null,
            apiErrorGet: (details && mode == 'GET') ? details : [],
            apiErrorPost: (details && mode == 'POST') ? details : []
        }


    }


    function updateService(context) {
        let errors = [];
        try {
            let nid = -1,
                nuid = -1;

            if (context.userId > 0)
                nuid = search.lookupFields({ id: context.userId, type: search.Type.CUSTOMER, columns: ['internalid', 'custentitycustentity_ptg_employee_rol', 'isinactive'] })
            if (!nuid) throw new Error('¡Usuario no existe!')
            else log.debug("NUID", nuid)

            if (!(nuid && nuid.custentitycustentity_ptg_employee_rol == 4 && nuid.isinactive == 'F')) {
                throw new Error('¡Usuario no existe!')
            }


            if (context.id > 0)
                nid = search.lookupFields({ id: context.id, type: 'customrecord_ptg_fuga', columns: ['internalid'] })
            if (!nid) throw new Error('¡Fuga no existe!')


            if (!(context.status > 0))
                throw new Error('Estado invalido!')
            let state = search.lookupFields({ id: context.status, type: 'customlist_ptg_fail_states', columns: ['name'] })
            if (!state) throw new Error('¡Estado inválido!')

            record.submitFields({ id: context.id, type: 'customrecord_ptg_fuga', values: { 'custrecord_ptg_fuga_state': context.status } })

            return JSON.stringify(getResponse('Actualizado Correctamente', context.id))


        } catch (error) {
            log.debug("ERROR", error);
            errors.unshift("Cannot update!");
            errors.push(error.message);
            return JSON.stringify(getErrorInResponse("POST", "Fallido", errors));
        }

    }

    // DONE Pendientes
    // DONE Complete
    // TODO Atender servicio/cancelar   --|
    // TODO Atender servicio/confirmar  --| En una misma ruta.
    // TODO Pendientes/Atender servicio --|

    return entryPoints;
}

var module = null;
(typeof define != void 0) && (module = { exports: {} }) && (define(['N/record', 'N/format', 'N/search', 'N/url'], detailsModule));
module.exports = module ? null : detailsModule();