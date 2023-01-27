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
             
             let sql = `SELECT
                        CUSTOMRECORD_PTG_CP_COL_RUT.id,
                        CUSTOMRECORD_PTG_CP_COL_RUT.name,
                        CUSTOMRECORD_PTG_COLONIASRUTAS_.id AS ruta_id,
                                    rutaCil.id AS rutaCilId,
                                    rutaCil.fullname AS rutaCil,
                                    rutaEst.id AS rutaEstId,
                                    rutaEst.fullname AS rutaEst,
                                    CUSTOMRECORD_PTG_ZONASDEPRECIO_.id,
                                    CUSTOMRECORD_PTG_ZONASDEPRECIO_.name
                                FROM
                                    CUSTOMRECORD_PTG_COLONIASRUTAS_
                        LEFT JOIN
                            CUSTOMRECORD_PTG_CP_COL_RUT ON
                            CUSTOMRECORD_PTG_CP_COL_RUT.id = CUSTOMRECORD_PTG_COLONIASRUTAS_.custrecord_ptg_cp_
                        LEFT JOIN MAP_customrecord_ptg_coloniasrutas__custrecord_ptg_rutacil_ cust1 ON
                            CUSTOMRECORD_PTG_COLONIASRUTAS_.id = cust1.mapone 
                        LEFT JOIN 
                            location rutaCil ON cust1.maptwo = rutaCil.id
                        LEFT JOIN MAP_customrecord_ptg_coloniasrutas__custrecord_ptg_rutaest_ cust2 ON
                            CUSTOMRECORD_PTG_COLONIASRUTAS_.id = cust2.mapone 
                        LEFT JOIN 
                            location rutaEst ON cust2.maptwo = rutaEst.id
                        LEFT JOIN
                            CUSTOMRECORD_PTG_ZONASDEPRECIO_ ON CUSTOMRECORD_PTG_ZONASDEPRECIO_.id = CUSTOMRECORD_PTG_COLONIASRUTAS_.custrecord_ptg_zona_de_precio_             
                        WHERE
                            CUSTOMRECORD_PTG_COLONIASRUTAS_.isinactive = 'F' ` 
                            
                        if(requestBody.estado) {
                            sql += ` AND CUSTOMRECORD_PTG_COLONIASRUTAS_.custrecord_ptg_estado_ = '${requestBody.estado}' `
                        }

                        if(requestBody.municipio) {
                            sql += ` AND CUSTOMRECORD_PTG_COLONIASRUTAS_.custrecord_ptg_rutamunicipio_ = '${requestBody.municipio}' `
                        }

                        if(requestBody.colonia) {
                            sql += ` AND CUSTOMRECORD_PTG_COLONIASRUTAS_.custrecord_ptg_nombrecolonia_ = '${requestBody.colonia}' `
                        }

                        if(requestBody.planta) {
                            sql += ` AND
                                        (rutaCil.fullname like '${requestBody.planta}%' OR
                                        rutaEst.fullname like '${requestBody.planta}%') `
                        }
                        
            log.debug("sql", sql)
             let resultIterator = query.runSuiteQLPaged({
                 query: sql,
                 pageSize: 1000
             }).iterator();

             let data = [];
             resultIterator.each(function (page) {
                 let pageIterator = page.value.data.iterator();
                 pageIterator.each(function (row) {
                     //log.debug('ID: ' + row.value.getValue(0) + ', Context: ' + row.value.getValue(1));
                     let obj = {};
                     log.debug('data', row)
                     
                     if (!!row.value.getValue(0)) {
                         obj.id = row.value.getValue(0);
                         obj.name = row.value.getValue(1);
                         obj.rutaId = row.value.getValue(2);
                         obj.rutaCilId = row.value.getValue(3);
                         obj.rutaCil = row.value.getValue(4);
                         obj.rutaEstaId = row.value.getValue(5);
                         obj.rutaEsta = row.value.getValue(6);
                         obj.zonePriceId = row.value.getValue(7);
                         obj.zonePrice = row.value.getValue(8);
                         data.push(obj);
                     }

                     return true;
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
