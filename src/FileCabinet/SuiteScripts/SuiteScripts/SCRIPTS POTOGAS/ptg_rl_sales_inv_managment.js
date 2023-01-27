/**
 *@NApiVersion 2.1 
 *@NScriptType Restlet
 *@Author Juan Cocom
 *@description Reslet para el manejo de traspasos entre rutas. Debe impactar varios registros. Favor de validar.
 */

/** 
 * Definición del modulo personalizado
 * El reslet tiene la intención de permitir realizar el movimiento del inventario (registro personalizado) entre los vehiculos en operación.
 * @param {import('N/record')} record 
 * @param {import('N/format')} format  
 * @param {import('N/search')} search 
 */
function detailsModule(record, format, search) {

    const entryPoints = {
        /** @type {import('N/types').EntryPoints.RESTlet.post} */
        post: null
    }

    /**
     * @typedef {object} CustomItems
     * @property {number} item
     * @property {number} units
     * @property {number} quantity
     */

    /**
     * @typedef {object} CustomRequestParams
     * @property {number} routeOrigin 
     * @property {number} routeDestiny
     * @property {CustomItems[]} items
     */

    /**
     * @param {any} params 
     * @returns {{responseItem:CustomRequestParams, errors: Error[]}:object}
     */
    function validatePayload(params) {

        /** @type {CustomRequestParams} */
        let newItem = params
        /** @type {CustomRequestParams} */
        let responseItem = {}
        /** @type {Error[]} */
        let errors = []

        if (typeof newItem != "object")
            errors.push(new Error("Requiere ser objeto"));

        if (!newItem.routeDestiny || isNaN(parseInt(newItem.routeDestiny) || +newItem.routeDestiny == 0))
            errors.push(new Error("Sin ruta destino válida"));

        if (!!newItem.routeDestiny && !!newItem.routeOrigin && newItem.routeDestiny == newItem.routeOrigin)
            errors.push(new Error("Rutas no pueden ser iguales"));

        if (!newItem.routeOrigin || isNaN(parseInt(newItem.routeOrigin) || +newItem.routeOrigin == 0))
            errors.push(new Error("Sin ruta origen válida"));

        if (!newItem.items || ((newItem.items instanceof Array) && newItem.items.length < 1))
            errors.push(new Error("Requiere articulos"));

        responseItem.routeDestiny = +newItem.routeDestiny;
        responseItem.routeOrigin = +newItem.routeOrigin;
        if (newItem.items)
            responseItem.items = newItem.items.map((x, ix) => {
                if (!x.item || isNaN(parseInt(x.item) || +x.item == 0))
                    errors.push(new Error("Artículo Invalido (" + ix + ")"));

                if (!x.quantity || isNaN(parseInt(x.quantity)))
                    errors.push(new Error("Cantidad Inválida (" + ix + ")"));

                //NO NEEDED
                /* if (!x.units || isNaN(parseInt(x.units) || +x.units == 0))
                    errors.push(new Error("Unidad inválida (" + ix + ")")); */

                return { item: +x.item, quantity: +x.quantity, /* units: +x.units */ };
            })
        //else errors.push(new Error("Propiedad de articulos no definida"));

        return { responseItem, errors };

    }

    function validateRoutes(origen, destino) {

        let fields = null;
        try {
            if (origen) {
                fields = search.lookupFields({
                    id: origen, type: "customrecord_ptg_tabladeviaje_enc2_",
                    columns: [
                        "custrecord_ptg_viaje_tabladeviajes_",
                        "custrecord_ptg_vehiculo_tabladeviajes_",
                        "custrecord_ptg_chofer_tabladeviajes_",
                        "custrecord_ptg_planta_tabladeviajes_",
                        "custrecord_ptg_estatus_tabladeviajes_"
                    ]
                });
            }
        } catch (error) {
            log.debug("ROUTE ORIGIN ERROR", error);
        }

        let fields2 = null
        try {
            if (destino) {
                fields2 = search.lookupFields({
                    id: destino, type: "customrecord_ptg_tabladeviaje_enc2_",
                    columns: [
                        "custrecord_ptg_viaje_tabladeviajes_",
                        "custrecord_ptg_vehiculo_tabladeviajes_",
                        "custrecord_ptg_chofer_tabladeviajes_",
                        "custrecord_ptg_planta_tabladeviajes_",
                        "custrecord_ptg_estatus_tabladeviajes_"
                    ]
                });
            }
        } catch (error) {
            log.debug("ROUTE DESTINY ERROR", error);
        }
        return { valids: (!!fields && !!fields2), origin: fields, destiny: fields2 }
    }

    function validateItems(items) {
        log.debug("ITEM FILTER", items)
        let res_items = [];
        if (!items || items.length == 0) return res_items;
        let customSearch = search.create({
            type: "item",
            filters: [["internalid", "anyof", items]],
            columns: [
                search.createColumn({ name: "itemid", sort: search.Sort.ASC, label: "Name" }),
                search.createColumn({ name: "displayname", label: "Display Name" }),
                search.createColumn({ name: "salesdescription", label: "Description" }),
                search.createColumn({ name: "type", label: "Type" }),
                search.createColumn({ name: "baseprice", label: "Base Price" })
            ]
        });

        let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 });
        customSearchPagedData.pageRanges.forEach(pageRange => {
            let currentPage = customSearchPagedData.fetch({ index: pageRange.index })
            currentPage.data.forEach((result, indx, origingArray) => {
                /// Do something
                res_items.push({
                    name: result.getValue({ name: "itemid" }),
                    id: result.id
                });
            });
        });

        return res_items;

    }

    /**
     * Funcion para obtener rutas disponibles
     * @returns 
     */
    entryPoints.get = function _get() {
        let viajes = [];
        try {

            let customSearch = search.create({
                type: "customrecord_ptg_tabladeviaje_enc2_",
                filters: [
                    ["created", "within", "today"], "AND",
                    ["custrecord_ptg_chofer_tabladeviajes_", "noneof", "@NONE@"]
                ],
                columns: [
                    search.createColumn({ name: "custrecord_ptg_viaje_tabladeviajes_" }),
                    //search.createColumn({ name: "custrecord_ptg_viaje_tabladeviajes_", label: "PTG - #Viaje (Tabla de viajes)" }),
                    search.createColumn({ name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)" }),
                    search.createColumn({ name: "internalid", label: "ID interno" })
                ]
            });

            let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 })
            customSearchPagedData.pageRanges.forEach(pageRange => {
                let currentPage = customSearchPagedData.fetch({ index: pageRange.index })
                currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    viajes.push({
                        id: result.getValue({ name: "internalid" }),
                        name: result.getValue({ name: "custrecord_ptg_viaje_tabladeviajes_" }),
                        driverId: result.getValue({ name: "custrecord_ptg_chofer_tabladeviajes_" }),
                        driver: result.getText({ name: "custrecord_ptg_chofer_tabladeviajes_" })
                    })
                })
            });
        } catch (error) {
            log.debug("ERROR", error);
        }

        const responseData = {
            isSuccessful: true,
            message: "Available routes",
            data: null,
            apiErrorGet: [],
            apiErrorPost: []
        };
        responseData.data = viajes
        return JSON.stringify(responseData);
    }

    entryPoints.post = function _post(requestBody) {

        const responseData = {
            isSuccessful: false,
            message: "Some errors occured",
            data: null,
            apiErrorGet: [],
            apiErrorPost: []
        };

        let testResult = validatePayload(requestBody);
        let routesResult = validateRoutes(testResult.responseItem.routeOrigin, testResult.responseItem.routeDestiny)
        log.debug("Request", requestBody);
        log.debug("Route Result", routesResult);
        try {

            if (!routesResult.valids) {
                if (!routesResult.origin)
                    throw new Error("Route Origin Invalid!")

                if (!routesResult.destiny)
                    throw new Error("Route Destiny Invalid!")
            }

            log.debug("Routes validated, Test Result", testResult);
            let items = testResult.responseItem.items;
            items = validateItems(items.map(x => x.item));
            let reducedItems = testResult.responseItem.items.filter((v, ix, ax) => ax.indexOf(v) == ix);
            log.debug("ITems", reducedItems);
            if (items.length != reducedItems.length)
                throw new Error('¡Array contains invalid items!');

            let _error = null
            if (testResult.errors.length > 0) {
                _error = new Error("Invalid Payload");
                _error.name = "E001";
                throw _error;
            }

            let responseItem = testResult.responseItem;
            log.debug("Item", responseItem);
            let newIDs = responseItem.items.map((items, ix) => {
                let movement = record.create({ type: "customrecord_ptg_viajepotgas_movinv_" });
                movement.setValue({ fieldId: "custrecord_ptg_viajeenvia_detallemovinv_", value: responseItem.routeOrigin });
                movement.setValue({ fieldId: "custrecord_ptg_viajerecibe_detallemovinv", value: responseItem.routeDestiny });
                movement.setValue({ fieldId: "custrecord_ptg_articulo_detallemovinv_", value: items.item });
                movement.setValue({ fieldId: "custrecord_ptg_cantidad_detallemovinv_", value: items.quantity });
                //movement.setValue({ fieldId: "custrecord_ptg_servicios_movunidades", value: items.units });
                let id = -1;
                id = movement.save();
                log.debug("ITEM " + ix, movement);
                return id;
            });

            responseData.isSuccessful = true;
            responseData.message = "Creado con éxito";
            responseData.data = newIDs;

        } catch (error) {

            log.debug("ERROR", error);
            responseData.isSuccessful = false;
            responseData.message = error.message;
            errorsClass01 = testResult.errors.map(x => ({ code: 'EC-001', errorMessage: x.message }))
            responseData.apiErrorPost.push(...errorsClass01);

        }

        return responseData;
    };

    return entryPoints;
}


var module = null;
(typeof define != void 0) && (module = { exports: {} }) && (define(['N/record', 'N/format', 'N/search'], detailsModule));
module.exports = module ? null : detailsModule();