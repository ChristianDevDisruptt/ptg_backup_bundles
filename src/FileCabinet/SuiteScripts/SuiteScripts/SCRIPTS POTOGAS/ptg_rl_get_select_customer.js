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
                success: false,
                data: []
            };

            try {
                if (requestBody.hasOwnProperty('filtro') && requestBody.filtro != "" && requestBody.filtro.trim() != "") {
                    requestBody.filtro = requestBody.filtro.trim();
                    //Primera version del search
                    //     let customerSearchObj = search.create({
                    //         type: "customer",
                    //         filters:
                    //             [
                    //                 ["custentity_ptg_plantarelacionada_", "anyof", requestBody.idPlanta],
                    //                 "AND",
                    //                 ["subsidiary", "anyof", "23", "20", "25"],
                    //                 "AND",
                    //                 ["internalid","anyof", requestBody.filtro], 
                    //                 "OR",
                    //                 //["entityid", "contains", requestBody.filtro],
                    //                 ["entityid", "startswith", requestBody.filtro],
                    //                 "OR",
                    //                 //["phone", "startswith", requestBody.filtro],
                    //                 ["phone", "startswith", requestBody.filtro],
                    //                 "OR",
                    //                 //["email", "contains", requestBody.filtro],
                    //                 ["email", "startswith", requestBody.filtro],
                    //                 "OR",
                    //                 //["address.custrecord_ptg_nombre_colonia", "contains", requestBody.filtro],
                    //                 ["address.custrecord_ptg_nombre_colonia", "startswith", requestBody.filtro],
                    //                 "OR",
                    //                 //["address.custrecord_ptg_street", "contains", requestBody.filtro],
                    //                 ["address.custrecord_ptg_street", "startswith", requestBody.filtro],
                    //                 "OR",
                    //                 //["address.custrecord_ptg_exterior_number", "contains", requestBody.filtro]
                    //                 ["address.custrecord_ptg_exterior_number", "startswith", requestBody.filtro]
                    //             ],
                    //         columns:
                    //             [
                    //                 search.createColumn({
                    //                     name: "internalid",
                    //                     summary: "GROUP",
                    //                     label: "Internal ID"
                    //                 }),
                    //                 search.createColumn({
                    //                     name: "altname",
                    //                     summary: "GROUP",
                    //                     label: "Name"
                    //                 }),
                    //                 search.createColumn({
                    //                     name: "phone",
                    //                     summary: "GROUP",
                    //                     label: "Phone"
                    //                 }),
                    //                 search.createColumn({
                    //                     name: "email",
                    //                     summary: "GROUP",
                    //                     label: "Email"
                    //                 }),
                    //                 search.createColumn({
                    //                     name: "datecreated",
                    //                     summary: "GROUP",
                    //                     label: "Date Created"
                    //                 })
                    //             ]
                    //     });

                    //     log.audit('customerSearchObj', customerSearchObj)
                    //     //let contador = customerSearchObj.runPaged().count;
                    //     //log.audit('contador', contador);
                    //     let searchResultCount = customerSearchObj.run();
                    //     let start = 0;
                    //     let data = [];

                    //     do {
                    //         var results = searchResultCount.getRange(start, start + 1000);
                    //         log.audit('results note', results)
                    //         if (results && results.length > 0) {
                    //             for (let i = 0; i < results.length; i++) {
                    //                 let columnas = results[i].columns;
                    //                 let obj = {};
                    //                 obj.id = results[i].getValue(columnas[0]);
                    //                 obj.text = `${results[i].getValue(columnas[1])} - ${results[i].getValue(columnas[2])} - ${results[i].getValue(columnas[3])}`;
                    //                 obj.dateCreated = results[i].getValue(columnas[4]);
                    //                 data.push(obj);
                    //             }
                    //         }
                    //         start += 1000;
                    //     } while (results && results.length == 1000);

                    //     response.success = true;
                    //     response.data = (data.length > 0) ? data : [];


                    //Version mejora con sentencia sql
                    let sql = "",
                        sql2 = "";

                        //sbx subsidiary 25
                    if (requestBody.isApp) {
                        sql = `SELECT
                        customer.id, customer.altname, customer.email, customer.phone
                        FROM
                        customer
                        LEFT JOIN CustomerSubsidiaryRelationship on customer.id = CustomerSubsidiaryRelationship.entity
                        LEFT JOIN customerAddressbook on Customer.id = customerAddressbook.entity
                        LEFT JOIN customerAddressbookEntityAddress on customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey
                        WHERE                    
                        subsidiary in (20,23,26) AND	
                        ( LOWER(altname) LIKE LOWER('${requestBody.filtro}%')
                        OR customer.id LIKE '${requestBody.filtro}%'
                        OR ( LOWER(phone) LIKE LOWER('${requestBody.filtro}%') )
                        OR ( LOWER(custrecord_ptg_street) LIKE LOWER('${requestBody.filtro}%') )
                        OR ( LOWER(custrecord_ptg_nombre_colonia) LIKE LOWER('${requestBody.filtro}%') )
                        OR ( LOWER(custrecord_ptg_exterior_number) LIKE LOWER('${requestBody.filtro}%') ) )
                        GROUP BY customer.id, customer.altname, customer.email, customer.phone`
                    } else {
                        sql = `SELECT 
                        customer.id, customer.altname, customerAddressbookEntityAddress.custrecord_ptg_telefono_principal, customerAddressbook.defaultshipping, 
                        customerAddressbookEntityAddress.custrecord_ptg_street, customerAddressbookEntityAddress.custrecord_ptg_exterior_number, 
                        customerAddressbookEntityAddress.custrecord_ptg_interior_number, customerAddressbookEntityAddress.custrecord_ptg_nombre_colonia, 
                        customerAddressbookEntityAddress.custrecord_ptg_codigo_postal, customerAddressbookEntityAddress.custrecord_ptg_entrecalle_, 
                        customerAddressbookEntityAddress.custrecord_ptg_y_entre_, customerAddressbook.internalid
                        FROM customer
                        LEFT JOIN CustomerSubsidiaryRelationship on customer.id = CustomerSubsidiaryRelationship.entity
                        LEFT JOIN customerAddressbook on Customer.id = customerAddressbook.entity
                        LEFT JOIN customerAddressbookEntityAddress on customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey
                        WHERE
                            custentity_ptg_plantarelacionada_ = ${Number(requestBody.idPlanta)} AND			
                            subsidiary in (20,23,26) AND 
                            (   (LOWER(altname) LIKE LOWER('%${requestBody.filtro}%')
                                OR customer.entityid LIKE '${requestBody.filtro}%'
                                OR ( LOWER(custrecord_ptg_telefono_principal) LIKE LOWER('%${requestBody.filtro}%') )
                                OR ( LOWER(
                                    CONCAT(custrecord_ptg_street, CONCAT(
                                    ' ', CONCAT(
                                        custrecord_ptg_exterior_number, CONCAT(
                                            ' ', custrecord_ptg_nombre_colonia)
                                        )
                                    )
                                    )
                                    ) LIKE LOWER('${requestBody.filtro}%') 
                                    ) 
                                    )  `;
                        sql += `)
                        GROUP BY customer.id, customer.altname, customerAddressbookEntityAddress.custrecord_ptg_telefono_principal, customerAddressbook.defaultshipping,  
                        customerAddressbookEntityAddress.custrecord_ptg_street, customerAddressbookEntityAddress.custrecord_ptg_exterior_number, 
                        customerAddressbookEntityAddress.custrecord_ptg_interior_number, customerAddressbookEntityAddress.custrecord_ptg_nombre_colonia, 
                        customerAddressbookEntityAddress.custrecord_ptg_codigo_postal, customerAddressbookEntityAddress.custrecord_ptg_entrecalle_, 
                        customerAddressbookEntityAddress.custrecord_ptg_y_entre_, customerAddressbook.internalid`;

                        if(requestBody.filtro.split(" ").length > 1) {
                            sql2 = `SELECT 
                            customer.id, customer.altname, customerAddressbookEntityAddress.custrecord_ptg_telefono_principal, customerAddressbook.defaultshipping, 
                            customerAddressbookEntityAddress.custrecord_ptg_street, customerAddressbookEntityAddress.custrecord_ptg_exterior_number, 
                            customerAddressbookEntityAddress.custrecord_ptg_interior_number, customerAddressbookEntityAddress.custrecord_ptg_nombre_colonia, 
                            customerAddressbookEntityAddress.custrecord_ptg_codigo_postal, customerAddressbookEntityAddress.custrecord_ptg_entrecalle_, 
                            customerAddressbookEntityAddress.custrecord_ptg_y_entre_, customerAddressbook.internalid
                            FROM customer
                            LEFT JOIN CustomerSubsidiaryRelationship on customer.id = CustomerSubsidiaryRelationship.entity
                            LEFT JOIN customerAddressbook on Customer.id = customerAddressbook.entity
                            LEFT JOIN customerAddressbookEntityAddress on customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey
                            WHERE
                                custentity_ptg_plantarelacionada_ = ${Number(requestBody.idPlanta)} AND			
                                subsidiary in (20,23,26) AND 
                                (`;
                            sqlAux = "";
                            
                            requestBody.filtro.split(" ").forEach(element => {
                                if(sqlAux != "") {
                                    sqlAux += " OR "
                                }
                                sqlAux += ` 
                                        (LOWER(altname) LIKE LOWER('%${element}%')
                                        OR customer.entityid LIKE '${element}%'
                                        OR ( LOWER(custrecord_ptg_telefono_principal) LIKE LOWER('%${element}%') )
                                        OR ( LOWER(
                                            CONCAT(custrecord_ptg_street, CONCAT(
                                            ' ', CONCAT(
                                                custrecord_ptg_exterior_number, CONCAT(
                                                    ' ', custrecord_ptg_nombre_colonia)
                                                )
                                            )
                                            )
                                            ) LIKE LOWER('${element}%') 
                                            ) 
                                            ) `
                            });
                            sql2 += sqlAux +`)
                            GROUP BY customer.id, customer.altname, customerAddressbookEntityAddress.custrecord_ptg_telefono_principal, customerAddressbook.defaultshipping,  
                            customerAddressbookEntityAddress.custrecord_ptg_street, customerAddressbookEntityAddress.custrecord_ptg_exterior_number, 
                            customerAddressbookEntityAddress.custrecord_ptg_interior_number, customerAddressbookEntityAddress.custrecord_ptg_nombre_colonia, 
                            customerAddressbookEntityAddress.custrecord_ptg_codigo_postal, customerAddressbookEntityAddress.custrecord_ptg_entrecalle_, 
                            customerAddressbookEntityAddress.custrecord_ptg_y_entre_, customerAddressbook.internalid`;
                                
                        }

                    }
                    // let sql = `SELECT
                    // customer.id, customer.altname, customer.email, customer.phone
                    // FROM
                    // customer
                    // LEFT JOIN CustomerSubsidiaryRelationship on customer.id = CustomerSubsidiaryRelationship.entity
                    // LEFT JOIN customerAddressbook on Customer.id = customerAddressbook.entity
                    // LEFT JOIN customerAddressbookEntityAddress on customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey
                    // WHERE
                    // custentity_ptg_plantarelacionada_ = ${Number(requestBody.idPlanta)} AND
                    // subsidiary in (20,23,25) AND	
                    // ( LOWER(altname) LIKE LOWER('${requestBody.filtro}%')
                    // OR customer.id LIKE '${requestBody.filtro}%'
                    // OR ( LOWER(phone) LIKE LOWER('${requestBody.filtro}%') )
                    // OR ( LOWER(custrecord_ptg_street) LIKE LOWER('${requestBody.filtro}%') )
                    // OR ( LOWER(custrecord_ptg_nombre_colonia) LIKE LOWER('${requestBody.filtro}%') )
                    // OR ( LOWER(custrecord_ptg_exterior_number) LIKE LOWER('${requestBody.filtro}%') ) )
                    // GROUP BY customer.id, customer.altname, customer.email, customer.phone`

                    let resultIterator = query.runSuiteQL({
                        query: sql
                    }).iterator();
                    log.audit("sql", sql);
                    let data = [];
                    log.audit("resultIterator", resultIterator);
                    resultIterator.each(function (row) {
                        let obj = {};
                        if (!!row.value.getValue(0)) {
                            obj.id = row.value.getValue(0);
                            if(requestBody.isApp) {
                                obj.text = `${row.value.getValue(1)} - ${row.value.getValue(2)} - ${row.value.getValue(3)}`;
                            } else {
                                obj.idAux = row.value.getValue(0)+"-"+row.value.getValue(11);
                                obj.nombre = row.value.getValue(1);
                                obj.telefono = row.value.getValue(2);
                                obj.calle = row.value.getValue(4);
                                obj.nExterior = row.value.getValue(5);
                                obj.nInterior = row.value.getValue(6);
                                obj.colonia = row.value.getValue(7);
                                obj.cp = row.value.getValue(8);
                                obj.entre1 = row.value.getValue(9);
                                obj.entre2 = row.value.getValue(10);
                                obj.idAdress = row.value.getValue(11);
                            }
                            
                            data.push(obj);
                        }
                        return true;
                    });
                    //log.audit("sql2", sql2);

                    /*if(sql2) {
                        log.audit("sql2", sql2);
                        let resultIterator2 = query.runSuiteQL({
                            query: sql2
                        }).iterator();
                        log.audit("sql2", sql2);
                        log.audit("resultIterator", resultIterator2);
                        resultIterator2.each(function (row) {
                            log.audit("row", row);
                            let obj = {};
                            if (!!row.value.getValue(0)) {
                                obj.id = row.value.getValue(0);
                                if(requestBody.isApp) {
                                    obj.text = `${row.value.getValue(1)} - ${row.value.getValue(2)} - ${row.value.getValue(3)}`;
                                } else {
                                    obj.idAux = row.value.getValue(0)+"-"+row.value.getValue(11);
                                    obj.nombre = row.value.getValue(1);
                                    obj.telefono = row.value.getValue(2);
                                    obj.calle = row.value.getValue(4);
                                    obj.nExterior = row.value.getValue(5);
                                    obj.nInterior = row.value.getValue(6);
                                    obj.colonia = row.value.getValue(7);
                                    obj.cp = row.value.getValue(8);
                                    obj.entre1 = row.value.getValue(9);
                                    obj.entre2 = row.value.getValue(10);
                                    obj.idAdress = row.value.getValue(11);
                                }
                                
                                data.push(obj);
                            }
                            return true;
                        });
                    }*/

                    log.debug('data', data)
                    response.success = true;
                    response.data = data;
                }

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
