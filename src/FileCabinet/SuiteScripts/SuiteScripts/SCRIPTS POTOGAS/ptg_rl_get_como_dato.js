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
        let response = {
            success: true,
            data: []
        }                
        try {

            var customrecord_ptg_comodato_asignadoSearchObj = search.create({
                type: "customrecord_ptg_comodato_asignado",
                filters:
                [
                   ["custrecord_ptg_relacion_cliente.internalid","anyof",requestParams.id]
                ],
                columns:
                [
                   search.createColumn({
                      name: "custrecord_ptg_articulo_asignado",
                      sort: search.Sort.ASC,
                      label: "PTG - ARTICULO ASIGNADO"
                   }),
                   search.createColumn({name: "custrecord_ptg_cantidad_asignada", label: "PTG - CANTIDAD ASIGNADA"}),
                   search.createColumn({name: "custrecord_ptg_relacion_cliente", label: "PTG - RELACION A CLIENTE"})
                ]
            });
            let data = [];
            var searchResultCount = customrecord_ptg_comodato_asignadoSearchObj.runPaged().count;
            log.debug("customrecord_ptg_comodato_asignadoSearchObj result count",searchResultCount);
            customrecord_ptg_comodato_asignadoSearchObj.run().each(function(result){
                data.push({
                    articulo: result.getText({name: "custrecord_ptg_articulo_asignado",label: "PTG - ARTICULO ASIGNADO"}),
                    cantidad: result.getValue({name: "custrecord_ptg_cantidad_asignada",label: "PTG - CANTIDAD ASIGNADA"}),
                });
                return true;
            });
            

            log.debug('data', data)
            response.success = true;
            response.data = data;
        } catch (error) {
            log.debug('error', error);
            response.message = error;
        }

        return response;
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
