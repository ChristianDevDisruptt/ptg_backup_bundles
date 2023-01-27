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

    const responseData = {
        isSuccessful: true,
        message: "Available routes",
        data: null,
        apiErrorGet: [],
        apiErrorPost: []
    }


    let model = {
        date: "string",
        concept: "number",
        customer: "number",
        details: "string[]",
        service: "number",
        complaint: "number"
    }
    // Se debe proporcionar un "modo update"?
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

        if (payload.mode)
            switch (payload.mode) {
                case "CONCEPTS": case "concepts":
                    return JSON.stringify(searchConcepts());
                case "COMPLAINTS": case "complaints":
                    return JSON.stringify(searchComplaints(payload));
                case "OPORTUNITIES": case "oportunities":
                    return JSON.stringify(searchOportunities(payload));
                default: return JSON.stringify(getErrorInResponse('POST', 'Opcion no válida'))

            }

        else {
            let all = Object.keys(model).map(x => {
                if (model[x].indexOf("[]") != -1) {
                    if (payload[x] instanceof Array) {
                        let innerType = model[x].replace('[]', '');
                        /** @type {boolean[]} */
                        let types = payload[x].map(y => (typeof y) == innerType);
                        let ret = types.every(x => !!x);
                        if (!ret)
                            errors.push(`'${payload[x]}'' no coincide con el tipo '${model[x]}'`);
                        return ret;
                    }
                    else {
                        errors.push(`${payload[x]} debe ser un arreglo de '${model[x]}'`);
                        return false;
                    }
                }
                else {
                    let rs = (typeof payload[x]) == model[x]
                    if (!rs)
                        errors.push(`2. '${payload[x]}' no coincide con el tipo '${model[x]}'`)
                    return rs;
                }
            });

            if (all.every(x => !!x)) {
                try {

                    let nid = create(payload)
                    return JSON.stringify(getResponse("Exitoso", nid));
                } catch (error) {
                    log.debug("ERROR", error);
                    errors.unshift("Cannot create!");
                    errors.push(error.message);
                    return JSON.stringify(getErrorInResponse("POST", "Fallido", errors));
                }
            }
            else
                return JSON.stringify(getErrorInResponse("POST", "Payload invalido", errors));

        }
    }

    /**
     * @typedef {object} Payload
     * @property {string} date
     * @property {number} concept
     * @property {number} customer
     * @property {string[]} details
     * @property {number} service
     * @property {number} complaint
     */

    /**
     * 
     * @param {Payload} payload 
     */
    function create(payload) {
        let complaint = record.create({ type: "customrecord_ptg_complaints" })


        complaint.setValue({ fieldId: "custrecord_ptg_compl_date", value: new Date() })
        complaint.setValue({ fieldId: "custrecord_ptg_compl_concept", value: payload.concept })
        let results = null;

        if (payload.customer > 0) results = search.lookupFields({ type: search.Type.CUSTOMER, id: payload.customer, columns: ['internalid'] })
        else results = null
        log.debug("RESULTS 1_1", results)
        if (payload.customer > 0 && results && results.internalid) complaint.setValue({ fieldId: "custrecord_ptg_compl_customer", value: payload.customer })
        else if (payload.customer > 0 && (!results || !results.internalid)) throw new Error('No se encontró cliente a vincular')
        log.debug("RESULTS 1_2", results)

        if (payload.service > 0) results = search.lookupFields({ type: search.Type.OPPORTUNITY, id: payload.service, columns: ['internalid'] })
        else results = null;
        log.debug("RESULTS 2_1", results)
        if (payload.service > 0 && results && results.internalid) complaint.setValue({ fieldId: "custrecord_ptg_compl_asservic", value: payload.service });
        else if (payload.service > 0 && (!results || !results.internalid)) throw new Error('No se encontró servicio a vincular')
        log.debug("RESULTS 2_2", results)

        if (payload.complaint > 0) results = search.lookupFields({ type: "customrecord_ptg_complaints", id: payload.complaint, columns: ['internalid'] })
        else results = null
        log.debug("RESULTS 3_1", results)
        if (payload.complaint > 0 && results && results.internalid) complaint.setValue({ fieldId: "custrecord_ptg_compl_ascompl", value: payload.complaint });
        else if (payload.complaint > 0 && (!results || !results.internalid)) throw new Error('No se encontró queja a vincular')

        log.debug("RESULTS 3_2", results)

        let complaintId = complaint.save()

        let durl = url.resolveRecord({ recordType: 'customrecord_ptg_complaints', recordId: complaintId });
        let results2 = /rectype=(\d+).+?$/.exec(durl);
        let recid = -1
        if (results2.length > 0)
            recid = results2[1]

        log.debug("URL", durl)


        /* let savedDetails = search.lookupFields({ type: 'customrecord_ptg_complaints', id: complaintId, columns: ['recordtype'] });
        log.debug("responseType", savedDetails); */

        if (recid > 0)
            payload.details.forEach(x => {
                let note = record.create({ type: record.Type.NOTE, isDynamic: true })
                note.setValue({ fieldId: "recordtype", value: recid })
                note.setValue({ fieldId: "record", value: complaintId })
                note.setValue({ fieldId: "note", value: x })
                note.save()
            })

        return complaintId

    }

    entryPoints.get = function (context) {

        let response = null;
        log.debug("CONTEXT", context)
        if (!context.mode) {
            //repsonse = 
            return JSON.stringify(getErrorInResponse('GET', 'Modo no definido'))
        }

        switch (context.mode) {
            case "CONCEPTS":
                return JSON.stringify(searchConcepts());
            case "COMPLAINTS":
                return JSON.stringify(searchComplaints(context));
            case "OPORTUNITIES":
                return JSON.stringify(searchOportunities(context))
            default:
                return JSON.stringify(getErrorInResponse('GET', 'Modo inválido'))
        }


    }

    function searchConcepts() {
        let concepts = [];
        let customSearch = search.create({
            type: 'customlist_ptg_compl_concepts',
            columns: ['name'],
            filters: []
        })

        let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 })
        customSearchPagedData.pageRanges.forEach(pageRange => {
            let currentPage = customSearchPagedData.fetch({ index: pageRange.index })
            currentPage.data.forEach((result, indx, origingArray) => {
                /// Do something
                concepts.push({ title: result.getValue({ name: "name" }), id: result.id })
            })
        })

        return getResponse("Solicitud de conceptos exitosa", concepts)

    }

    function searchComplaints(context) {

        try {
            if (!context.customerId)
                throw new Error('"customerId" not defined')

            let res = []
            let customSearch = search.create({
                type: 'customrecord_ptg_complaints',
                columns: [
                    'custrecord_ptg_compl_date',
                    'custrecord_ptg_compl_asservic',
                    'custrecord_ptg_compl_ascompl'
                ],
                filters: [
                    ['custrecord_ptg_compl_customer', search.Operator.ANYOF, context.customerId]
                ]
            })
            let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 })
            customSearchPagedData.pageRanges.forEach(pageRange => {
                let currentPage = customSearchPagedData.fetch({ index: pageRange.index })
                currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    res.push({
                        id: result.id,
                        date: result.getValue('custrecord_ptg_compl_date'),
                        service: result.getValue('custrecord_ptg_compl_asservic'),
                        complaint: result.getValue('custrecord_ptg_compl_ascompl')
                    })
                })
            })

            return getResponse("Solicitud exitosa", res)
        } catch (error) {
            return getErrorInResponse("GET", error.message)
        }
    }

    function searchOportunities(context) {
        /* let items = [
            { "id": 123456, "folio": 123 },
            { "id": 1234567, "folio": 1234 },
            { "id": 12345678, "folio": 12345 }
        ]

        return getResponse("Solicitud de Oportunidades exitosa", items) */

        try {
            if (!context.customerId)
                throw new Error('"customerId" not defined')

            log.debug("ARGS", context);

            let res = [];
            let customSearch = search.create({
                type: search.Type.TRANSACTION,
                columns: [
                    "status",
                    "salesrep",
                    "tranid",
                    "custbody_ptg_opcion_pago",
                    "entity",
                    search.createColumn({ name: "closedate", sort: search.Sort.DESC })
                ],
                filters: [
                    ['entity', search.Operator.ANYOF, context.customerId], 'AND',
                    ["type", "anyof", "Opprtnty"], "AND",
                    ["status", "anyof", "Opprtnty:C", "SalesOrd:C"], "AND",
                    ["mainline", "is", "T"]
                ]
            });

            let customSearchPagedData = customSearch.runPaged({ pageSize: context.pageSize });
            let ranges = customSearchPagedData.pageRanges;
            log.debug("RANGES", ranges);
            ranges.filter(x => x.index == context.page).forEach(pageRange => {
                let currentPage = customSearchPagedData.fetch({ index: pageRange.index });
                currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    res.push({
                        id: result.id,
                        status: result.getText('status'),
                        tranid: result.getValue('tranid'),
                        paymentMethod: result.getValue('custbody_ptg_opcion_pago'),
                        entity: result.getText('entity'),
                        date: result.getText({ name: "closedate", sort: search.Sort.DESC })
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

    return entryPoints
}

var module = null;
(typeof define != void 0) && (module = { exports: {} }) && (define(['N/record', 'N/format', 'N/search', 'N/url'], detailsModule));
module.exports = module ? null : detailsModule();