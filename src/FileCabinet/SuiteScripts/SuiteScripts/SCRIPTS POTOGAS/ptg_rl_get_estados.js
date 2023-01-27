/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
 define(['N/search', 'N/query'],
 /**
* @param{search} search
*/
 (search, query) => {
     /**
      * Defines the function that is executed when a GET request is sent to a RESTlet.
      * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
      *     content types)
      * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
      *     Object when request Content-Type is 'application/json' or 'application/xml'
      * @since 2015.2
      */
     const get = (requestParams) => {
     }

     /**
      * Defines the function that is executed when a PUT request is sent to a RESTlet.
      * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
      *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
      *     the body must be a valid JSON)
      * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
      *     Object when request Content-Type is 'application/json' or 'application/xml'
      * @since 2015.2
      */
     const put = (requestBody) => {

     }

     /**
      * Defines the function that is executed when a POST request is sent to a RESTlet.
      * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
      *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
      *     the body must be a valid JSON)
      * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
      *     Object when request Content-Type is 'application/json' or 'application/xml'
      * @since 2015.2
      */
     const post = (requestBody) => {
         let response = {
             success: true,
             data: []
         }                
         try {
             
            var customrecord_ptg_coloniasrutas_SearchObj = search.create({
                type: "customrecord_ptg_coloniasrutas_",
                filters:                
                [
                    ["isinactive","is","F"], 
                    "AND", 
                    ["custrecord_ptg_rutacil_.name","startswith",requestBody.planta], 
                    "OR", 
                    ["isinactive","is","F"], 
                    "AND", 
                    ["custrecord_ptg_rutaest_.name","startswith",requestBody.planta]
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "custrecord_ptg_estado_", label: "PTG - Estado "}),
                    search.createColumn({name: "custrecord_ptg_rutamunicipio_", label: "PTG - MUNICIPIO"}),
                    search.createColumn({name: "custrecord_ptg_nombrecolonia_", label: "PTG - NOMBRE DE COLONIA"}),                    
                    search.createColumn({name: "custrecord_ptg_cp_", label: "PTG - CP"}),                    
                    search.createColumn({name: "custrecord_ptg_rutacil_", label: "PTG - CIL"}),
                    search.createColumn({name: "custrecord_ptg_rutaest_", label: "PTG - EST"}),
                    search.createColumn({name: "custrecord_ptg_zona_de_precio_", label: "PTG - Zona de Precio"})
                ]
            });
            var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.run();
            let data = [];
            let start = 0;
            do {
                var results = searchResultCount.getRange(start, start + 1000);
                log.debug("results", results);
                if (results && results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        let result = results[i];
                        let columnas = result.columns;
                        let idsCil = result.getValue(columnas[5]);
                        let idsEst = result.getValue(columnas[6]);
                        let aux =  {
                            id: result.getValue(columnas[0]),
                            estadoId: result.getValue(columnas[1]),
                            estado: result.getText(columnas[1]),
                            municipioId: result.getValue(columnas[2]),
                            municipio: result.getText(columnas[2]),
                            coloniaId: result.getValue(columnas[3]),
                            colonia: result.getText(columnas[3]),
                            cpId: result.getValue(columnas[4]),
                            cp: result.getText(columnas[4]),
                            rutaCilId: result.getValue(columnas[5]),
                            rutaCil: result.getText(columnas[5]),
                            rutaEstaId: result.getValue(columnas[6]),
                            rutaEsta: result.getText(columnas[6]),
                            zonePriceId: result.getValue(columnas[7]),
                            zonePrice: result.getText(columnas[7])
                        };

                        data.push(aux);
                    }
                }
                start += 1000;
            } while (results && results.length == 1000);

            response.success = true;
            response.data = data;
         } catch (error) {
             log.debug('error', error);
             response.success = false;
             response.message = error;
         }

         return response;

     }

     function getRutas(ids) {
        if(ids) {
            var locationSearchObj = search.create({
                type: "location",
                filters:
                [
                   ["subsidiary","anyof","22","26","20","23"], 
                   "AND", 
                   ["internalid","anyof"].concat(ids.split(","))
                ],
                columns:
                [
                    search.createColumn({name: "internalid", label: "ID interno"}),
                    search.createColumn({name: "custrecord4", label: "PTG - Entidad"})
                ]
            });
            let rutas = [];
            var searchResultCount = locationSearchObj.runPaged().count;
                log.debug("locationSearchObj result count",searchResultCount);
            locationSearchObj.run().each(function(result){
                rutas.push({
                    id: result.getValue({name: "internalid", label: "ID interno"}),
                    name: result.getValue({name: "custrecord4", label: "PTG - Entidad"})
                });
                return true;
            });
            return rutas;
        } else {
            return [];
        }        
     }

     /**
      * Defines the function that is executed when a DELETE request is sent to a RESTlet.
      * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
      *     content types)
      * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
      *     Object when request Content-Type is 'application/json' or 'application/xml'
      * @since 2015.2
      */
     const doDelete = (requestParams) => {

     }

     return { get, put, post, delete: doDelete }

 });
