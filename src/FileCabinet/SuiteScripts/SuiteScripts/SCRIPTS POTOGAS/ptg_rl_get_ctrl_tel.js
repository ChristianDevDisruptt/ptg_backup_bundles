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
             
             let sql = `SELECT CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.custrecord_ptg_obser_ctal, CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.custrecord_ptg_fecha_cracion_ctal, employee.firstname, employee.lastname FROM CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA
                        LEFT JOIN employee ON
                            employee.id = CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.owner
                        WHERE
                            CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.custrecord_ptg_id_cliente_ctal = '${requestBody.id_cliente}' AND
                            CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.custrecord_ptg_id_oportunidad_ctal = '${requestBody.id_opp}'
                        ORDER BY
                            CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA.id DESC`;
            log.audit("sql", sql);
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
                    obj.observaciones = row.value.getValue(0);
                    obj.fecha = row.value.getValue(1);
                    obj.nombre = (row.value.getValue(2) ? row.value.getValue(2).trim() + " " + (row.value.getValue(4) ? row.value.getValue(4) : '') : (row.value.getValue(4) ? row.value.getValue(4) : ''));
                    data.push(obj);

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
