/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
 define(['N/https', 'N/log'],
 /**
  * @param{https} https
  * @param{log} log
  */
 (https, log) => {
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
     const post = (request) => {
         let result = {
             success : false
         }; 
         try {                           
             log.debug('data', request)    
             if (request.type == "estado") {
                 let response = https.request({
                     method: https.Method.GET,
                     url: `https://apisgratis.com/cp/ciudades/?estado=${request.data}`,              
                 });
                                     
                 
                 if(response.code == 200 || response.code == "200"){                        
                     result.success = true;
                     result.data = response.body;
                 }
 
             } else if (request.type == "colonia") {
                 let response = https.request({
                     method: https.Method.GET,
                     url: `https://apisgratis.com/cp/cp/ciudad/?valor=${request.data}`,              
                 });
                                     
                 
                 if(response.code == 200 || response.code == "200"){                        
                     result.success = true;
                     result.data = response.body;
                 }
 
             } else if (request.type == "entidades") {
                 let response = https.request({
                     method: https.Method.GET,
                     url: 'https://apisgratis.com/cp/entidades/',              
                 });
                                     
                 
                 if(response.code == 200 || response.code == "200"){                                 
                     result.success = true;
                     result.data = response.body;
                 }
                 
             }

             return result;
 
             
         } catch (error) {
             log.debug('err', error)
             return result;
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

     return {
         get,
         put,
         post,
         delete: doDelete
     }

 });