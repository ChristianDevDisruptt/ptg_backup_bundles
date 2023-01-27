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
                success: false,
                data: []
            };

            try {
                let customlist_ptg_lista_origenSearchObj = search.create({
                    type: "customlist_ptg_lista_origen",
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
                let searchResultCount = customlist_ptg_lista_origenSearchObj.runPaged().count;
                log.debug("customlist_ptg_lista_origenSearchObj result count", searchResultCount);

                if(searchResultCount > 0){
                    let data = []
                    customlist_ptg_lista_origenSearchObj.run().each(function (result) {
                        let info = {};
                        info.id = result.getValue({name: "internalid",label: "Internal ID"});
                        info.name = result.getValue({name: "name", sort: search.Sort.ASC, label: "Name"});
                        data.push(info);
                        // .run().each has a limit of 4,000 results
                        return true;
                    });

                    response.success = true;
                    response.data = data;
                }
                


                return response;
            } catch (error) {
                response.message = error;
                return response;
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