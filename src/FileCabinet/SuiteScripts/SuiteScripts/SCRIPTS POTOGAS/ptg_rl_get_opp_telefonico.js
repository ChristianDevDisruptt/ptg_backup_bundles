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
                            TR.id,
                            TR.entity, 
                            TR.closedate,
                            CUS.altname,
                            ADDR.custrecord_ptg_telefono_principal,
                            TIPSER.name,
                            CUS.custentity_ptg_notas_cliente_,
                            ADDR.custrecord_ptg_street, 
                            ADDR.custrecord_ptg_exterior_number, 
                            ADDR.custrecord_ptg_interior_number, 
                            ADDR.custrecord_ptg_nombre_colonia, 
                            ADDR.custrecord_ptg_codigo_postal, 
                            ADDR.custrecord_ptg_entrecalle_, 
                            ADDR.custrecord_ptg_y_entre_,
                            ESTA.name AS estado,
                            ESTA.id AS estado_id
                        FROM transaction TR
                        LEFT JOIN
                            Customer CUS ON CUS.id = TR.entity 
                        LEFT JOIN
                            CUSTOMLIST_PTG_TIPODESERVICIO_ TIPSER ON TIPSER.id = TR.custbody_ptg_tipo_servicio 
                        LEFT JOIN
                            transactionShippingAddress ADDR ON TR.shippingaddress = ADDR.nkey
                        LEFT JOIN
                            CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA CTRL ON 
                            CTRL.custrecord_ptg_id_cliente_ctal = TR.entity AND
                            CTRL.custrecord_ptg_id_oportunidad_ctal = TR.id
                        LEFT JOIN
                            CUSTOMLIST_PTG_ESTADO_AVISO_LLAMADAS ESTA ON 
                            ESTA.id = CTRL.custrecord_ptg_estado_seguimiento_ctal
                        WHERE
                            TR.id = (SELECT MAX(TR2.id) FROM transaction TR2 
                                        LEFT JOIN 
                                            transactionShippingAddress ADDR2 ON TR2.shippingaddress = ADDR2.nkey 
                                        WHERE 
                                            TR2.entity = TR.entity AND 
                                            TR2.type = 'Opprtnty' AND 
                                            TR2.entitystatus != 14 AND 
                                            TR2.custbody_ptg_planta_relacionada = ${requestBody.planta} AND `;

                
                if(requestBody.fecha) {
                    sql +=                  `TR2.closedate <= '${requestBody.fecha}' AND `
                }

                if(requestBody.route_string) {
                    sql +=                  `TR2.custbody_ptg_ruta_asignada = '${requestBody.route_string}' AND `
                }

                if(requestBody.colonia) {
                    sql +=                  `ADDR2.custrecord_ptg_colonia_ruta = '${requestBody.colonia}' AND `
                }

                if(requestBody.tipo_producto) {
                    sql +=                  `TR2.custbody_ptg_tipo_servicio = '${requestBody.tipo_producto}' AND `
                }

                sql +=  `                   ADDR2.custrecord_ptg_tipo_contacto = 1) AND
                            TR.closedate IS NOT NULL AND 
                            (CTRL.id IS NULL OR 
                            CTRL.id = (SELECT MAX(CTRL2.id) FROM CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA CTRL2 
                                    WHERE 
                                        CTRL2.custrecord_ptg_id_cliente_ctal = TR.entity AND
                                        CTRL2.custrecord_ptg_id_oportunidad_ctal = TR.id)) `

                if(requestBody.status_alert && requestBody.status_alert == "3") {
                    sql +=  ` AND (CTRL.custrecord_ptg_estado_seguimiento_ctal = '${requestBody.status_alert}' OR CTRL.custrecord_ptg_estado_seguimiento_ctal IS NULL ) `;
                } else if(requestBody.status_alert) {
                    sql +=  ` AND (CTRL.custrecord_ptg_estado_seguimiento_ctal = '${requestBody.status_alert}') `
                }
                
                sql +=  `ORDER BY
                            TR.closedate DESC`;
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
                     if (!!row.value.getValue(0)) {
                         obj.id = row.value.getValue(0);
                         obj.id_cliente = row.value.getValue(1);
                         obj.fecha_cierre = row.value.getValue(2);
                         obj.nombre_cliente = row.value.getValue(3);
                         obj.telefono_cliente = row.value.getValue(4);
                         obj.tipo_servicio = row.value.getValue(5);
                         obj.observaciones = row.value.getValue(6);
                         obj.calle = row.value.getValue(7);
                         obj.nExterior = row.value.getValue(8);
                         obj.nInterior = row.value.getValue(9);
                         obj.colonia = row.value.getValue(10);
                         obj.cp = row.value.getValue(11);
                         obj.entre1 = row.value.getValue(12);
                         obj.entre2 = row.value.getValue(13);
                         obj.estado = row.value.getValue(14);
                         obj.estado_id = row.value.getValue(15);
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
