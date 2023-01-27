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
            //Tiene la funcionalidad de devolver la lista de los metodos de pago de manera dinamica y no estatica
            //log.debug('requestParam', requestParams);
            log.debug('test git', 'git')
            const response = {
                success: false
            }
            try {

                let customlist_ptg_opciones_pagoSearchObj = search.create({
                    type: "customlist_ptg_opciones_pago_2",
                    filters: [],
                    columns: [
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        })
                    ]
                });
                let searchResultCount = customlist_ptg_opciones_pagoSearchObj.runPaged().count;

                if (searchResultCount > 0) {
                    let methodPayments = [];
                    customlist_ptg_opciones_pagoSearchObj.run().each(function (result) {
                        let obj = {};
                        obj.id = result.getValue({ name: "internalid", label: "Internal ID" });
                        obj.method = result.getValue({ name: "name", label: "Name" });

                        methodPayments.push(obj);
                        return true;
                    });

                    response.success = true;
                    response.data = methodPayments;
                }


                return response;

            } catch (error) {
                response.error = error;
                return response
            }

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
            //Tiene la funcionalidad de devolver la lista de los metodos de pago de manera dinamica y no estatica
            //log.debug('requestParam', requestParams);
            log.debug('test git', 'git')
            const response = {
                success: false
            }
            try {

                let customlist_ptg_opciones_pagoSearchObj = search.create({
                    type: "customlist_ptg_opciones_pago_2",
                    filters: [],
                    columns: [
                        search.createColumn({
                            name: "internalid",
                            label: "Internal ID"
                        }),
                        search.createColumn({
                            name: "name",
                            sort: search.Sort.ASC,
                            label: "Name"
                        })
                    ]
                });
                let searchResultCount = customlist_ptg_opciones_pagoSearchObj.runPaged().count;

                if (searchResultCount > 0) {
                    let methodPayments = [];
                    customlist_ptg_opciones_pagoSearchObj.run().each(function (result) {
                        let obj = {};
                        obj.id = result.getValue({ name: "internalid", label: "Internal ID" });
                        obj.method = result.getValue({ name: "name", label: "Name" });

                        methodPayments.push(obj);
                        return true;
                    });

                    response.success = true;
                    response.data = methodPayments;
                }


                //return response;

            } catch (error) {
                response.error = error;
                //return response
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

        return {
            get,
            put,
            post,
            delete: doDelete
        }

    });