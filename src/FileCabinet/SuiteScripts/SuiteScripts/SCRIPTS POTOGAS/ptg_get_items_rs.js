/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        try {
            log.debug('test', 'christian')
            var response = {
                success: false,
                data: []
            };
            var arrayItem = [];
            var objItem = {};

            var itemSearchObj = search.create({
                type: "item",
                filters: [
                    ["subsidiary", "anyof", "20", "14", "16", "13"],
                    "AND",
                    ["type", "anyof", "InvtPart"],
                    //"AND", 
                    //["subtype","anyof","@NONE@"]
                    "AND",
                    ["subtype", "anyof", "@NONE@"],
                    "AND",
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custitem_ptg_tipodearticulo_", "anyof", "1", "2", "5", "7"],
                    "AND", 
                    ["custitem_ptg_mostrar_call_center","is","T"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "displayname",
                        label: "Nombre para mostrar"
                    }),
                    search.createColumn({
                        name: "salesdescription",
                        label: "Descripción"
                    }),
                    search.createColumn({
                        name: "subsidiary",
                        label: "Subsidiaria"
                    }),
                    search.createColumn({
                        name: "itemid",
                        sort: search.Sort.ASC,
                        label: "Nombre"
                    }),
                    search.createColumn({
                        name: "baseprice",
                        label: "Precio base"
                    }),
                    search.createColumn({
                        name: "salesdescription",
                        label: "Descripción"
                    }),
                    search.createColumn({
                        name: "custitem_ptg_tipodearticulo_",
                        label: "PTG - TIPO DE ARTÍCULO"
                    }),
                    search.createColumn({
                        name: "custitem_ptg_capacidadcilindro_",
                        label: "PTG - Capacidad cilindro"
                    })
                ]
            });
            var searchResultCount = itemSearchObj.run();
            var results = searchResultCount.getRange(0, 200);
            log.debug('results', results)
            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var idItem = results[i].getValue(columnas[0]);
                var nombreItem = results[i].getValue(columnas[1]);
                var descripcionItem = results[i].getValue(columnas[2]);
                var subcidiary = results[i].getValue(columnas[3]);
                var itemType = results[i].getValue(columnas[7]);
                var capacidadLitros = results[i].getValue(columnas[8]);
                var basePrice = results[i].getValue(columnas[5]);
                objItem = {
                    id: idItem,
                    nombre: nombreItem,
                    descripcion: descripcionItem,
                    subsidiaria: subcidiary,
                    tipo_articulo: itemType,
                    capacidad_litros: capacidadLitros,
                    basePrice: basePrice
                }
                log.audit('objItem', objItem)
                arrayItem.push(objItem);
            }

            response.success = true;
            response.data = (arrayItem.length > 0) ? arrayItem : []


            
        } catch (error) {
            log.audit('error', error)
            response.message = error
        }

        return response;
    }

    function post(context) {
        try {
            log.debug('test', 'christian')
            var response = {
                success: false,
                data: []
            };
            var arrayItem = [];
            var objItem = {};

            var itemSearchObj = search.create({
                type: "item",
                filters: [
                    ["subsidiary", "anyof", "20", "14", "16", "13"],
                    "AND",
                    ["type", "anyof", "InvtPart"],
                    //"AND", 
                    //["subtype","anyof","@NONE@"]
                    "AND",
                    ["subtype", "anyof", "@NONE@"],
                    "AND",
                    ["isinactive", "is", "F"],
                    "AND",
                    ["custitem_ptg_tipodearticulo_", "anyof", "1", "2", "5", "7"]
                ],
                columns: [
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    }),
                    search.createColumn({
                        name: "displayname",
                        label: "Nombre para mostrar"
                    }),
                    search.createColumn({
                        name: "salesdescription",
                        label: "Descripción"
                    }),
                    search.createColumn({
                        name: "subsidiary",
                        label: "Subsidiaria"
                    }),
                    search.createColumn({
                        name: "itemid",
                        sort: search.Sort.ASC,
                        label: "Nombre"
                    }),
                    search.createColumn({
                        name: "baseprice",
                        label: "Precio base"
                    }),
                    search.createColumn({
                        name: "salesdescription",
                        label: "Descripción"
                    }),
                    search.createColumn({
                        name: "custitem_ptg_tipodearticulo_",
                        label: "PTG - TIPO DE ARTÍCULO"
                    }),
                    search.createColumn({
                        name: "custitem_ptg_capacidadcilindro_",
                        label: "PTG - Capacidad cilindro"
                    })
                ]
            });
            var searchResultCount = itemSearchObj.run();
            var results = searchResultCount.getRange(0, 200);
            log.debug('results', results)
            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                var idItem = results[i].getValue(columnas[0]);
                var nombreItem = results[i].getValue(columnas[1]);
                var descripcionItem = results[i].getValue(columnas[2]);
                var subcidiary = results[i].getValue(columnas[3]);
                var itemType = results[i].getValue(columnas[7]);
                var capacidadLitros = results[i].getValue(columnas[8]);
                var basePrice = results[i].getValue(columnas[5]);
                objItem = {
                    id: idItem,
                    nombre: nombreItem,
                    descripcion: descripcionItem,
                    subsidiaria: subcidiary,
                    tipo_articulo: itemType,
                    capacidad_litros: capacidadLitros,
                    basePrice: basePrice
                }
                log.audit('objItem', objItem)
                arrayItem.push(objItem);
            }

            response.success = true;
            response.data = (arrayItem.length > 0) ? arrayItem : []


            
        } catch (error) {
            log.audit('error', error)
            response.message = error
        }

        return response;
    }

    return {
        get: _get,
        post : post
    }
});