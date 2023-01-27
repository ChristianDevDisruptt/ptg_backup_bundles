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
                success : false,
                data : []
            }

            try {

                let customlist_motivodecancelacion_SearchObj = search.create({
                    type: "customlist_motivodecancelacion_",
                    filters:
                    [
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "name",
                          sort: search.Sort.ASC,
                          label: "Name"
                       }),
                       search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                 });
                 let searchResultCount = customlist_motivodecancelacion_SearchObj.runPaged().count;
                 log.debug("customlist_motivodecancelacion_SearchObj result count",searchResultCount);
                 let values = [];
                 customlist_motivodecancelacion_SearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    let info = {};
                    info.id = result.getValue({name: "internalid", label: "Internal ID"});
                    info.name = result.getValue({name: "name", label: "Name"});
                    values.push(info);
                    return true;
                 });

                 log.debug('values data', values)

                 response.success = true;
                 response.data = (values.length > 0) ? values : [];
                
            } catch (error) {
                log.debug('error', error)
                response.message = error
            }

            log.debug('response', response)
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

            let response = {
                success : false,
                data : []
            }

            try {

                let customlist_motivodecancelacion_SearchObj = search.create({
                    type: "customlist_motivodecancelacion_",
                    filters:
                    [
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "name",
                          sort: search.Sort.ASC,
                          label: "Name"
                       }),
                       search.createColumn({name: "internalid", label: "Internal ID"})
                    ]
                 });
                 let searchResultCount = customlist_motivodecancelacion_SearchObj.runPaged().count;
                 log.debug("customlist_motivodecancelacion_SearchObj result count",searchResultCount);
                 let values = [];
                 customlist_motivodecancelacion_SearchObj.run().each(function(result){
                    // .run().each has a limit of 4,000 results
                    let info = {};
                    info.id = result.getValue({name: "internalid", label: "Internal ID"});
                    info.name = result.getValue({name: "name", label: "Name"});
                    values.push(info);
                    return true;
                 });

                 log.debug('values data', values)

                 response.success = true;
                 response.data = (values.length > 0) ? values : [];
                
            } catch (error) {
                log.debug('error', error)
                response.message = error
            }

            log.debug('response', response)
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

        return {get, put, post, delete: doDelete}

    });
