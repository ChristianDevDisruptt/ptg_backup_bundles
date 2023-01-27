/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search'],
    /**
   * @param{search} search
   */
    (search) => {
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
                success: false
            };

            try {
                let employeeSearchObj = search.create({
                    type: "employee",
                    filters:
                        [
                            ["supportrep", "is", "T"]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "entityid",
                                sort: search.Sort.ASC,
                                label: "Name"
                            }),
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({ name: "altphone", label: "Office Phone" }),
                            search.createColumn({ name: "phone", label: "Phone" }),
                            search.createColumn({ name: "mobilephone", label: "Mobile Phone" })
                        ]
                });
                log.audit('supportcaseNoteSearchObj', employeeSearchObj)
                //let contador = employeeSearchObj.runPaged().count;
                //log.audit('contador', contador);
                let searchResultCount = employeeSearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results note', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            obj.id = results[i].getValue(columnas[1]);
                            obj.name = results[i].getValue(columnas[0]);
                            obj.phone = results[i].getValue(columnas[3]);
                            obj.officePhone = results[i].getValue(columnas[2]);
                            obj.mobilePhone = results[i].getValue(columnas[4]);
                            data.push(obj);
                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.data = (data.length > 0) ? data : [];
            } catch (error) {
                log.debug('error', error)
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
