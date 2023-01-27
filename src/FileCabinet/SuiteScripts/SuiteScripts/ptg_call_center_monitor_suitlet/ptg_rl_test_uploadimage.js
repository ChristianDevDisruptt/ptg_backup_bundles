/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/file', 'N/record', 'N/search', 'N/query'],
    /**
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    (file, record, search, query) => {
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

            const response = {
                success: false
            }
            try {
                // let img = requestBody.img64;
                // log.debug('img 64', img)

                // let fileObj = file.create({
                //     name: 'test2.jpg',
                //     fileType: file.Type.JPGIMAGE,
                //     contents: img,
                //     encoding: file.Encoding.UTF8,
                //     folder: 14055,
                // });

                // let id = fileObj.save();
                // log.debug('id img', id)

                // let addImg = record.attach({
                //     record: {
                //         type: 'file',
                //         id: id
                //     },
                //     to: {
                //         type: record.Type.SUPPORT_CASE,
                //         id: 275
                //     }
                // });

                // log.debug('relacion attach img to case', addImg)

                //Prueba sql o query
                //let sql = 'SELECT customer.entityid, customer.email, customer.id, customer.altname FROM customer WHERE customer.id = 14535';                
                //let sql = 'SELECT customer.id, customer.altname customer.companyname, customeraddressbook.addressbookaddress, customeraddressbook.label, customeraddressbookentityaddress.nkey, customeraddressbookentityaddress.addr1 FROM customer LEFT OUTER JOIN customeraddressbook on (customer.id = customeraddressbook.entity) LEFT OUTER JOIN customeraddressbookentityaddress ON (customeraddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey)';
                //let sql = `SELECT altname FROM customer WHERE LOWER(altname) LIKE LOWER('Ronald%')`;

                let sql = `SELECT
                customer.id, customer.altname, customer.email, customer.phone
                FROM
                customer
                LEFT JOIN customerAddressbook on Customer.id = customerAddressbook.entity
                LEFT JOIN customerAddressbookEntityAddress on customerAddressbook.addressbookaddress = customerAddressbookEntityAddress.nkey
                WHERE
                LOWER(altname) LIKE LOWER('${requestBody.filtro}%')
                OR id LIKE '${requestBody.filtro}%'
                OR ( LOWER(phone) LIKE LOWER('${requestBody.filtro}%') )
                OR ( LOWER(custrecord_ptg_street) LIKE LOWER('${requestBody.filtro}%') )
                OR ( LOWER(custrecord_ptg_nombre_colonia) LIKE LOWER('${requestBody.filtro}%') )
                OR ( LOWER(custrecord_ptg_exterior_number) LIKE LOWER('${requestBody.filtro}%') )
                GROUP BY customer.id, customer.altname, customer.email, customer.phone`

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
                        if(!!row.value.getValue(0)){
                            obj.id = row.value.getValue(0);
                            obj.text = `${row.value.getValue(1)} - ${row.value.getValue(2)} - ${row.value.getValue(3)}`;
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
                log.debug('error', error)
                response.error = error
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
