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
                let customrecord_ptg_conceptos_casosSearchObj = search.create({
                    type: "customrecord_ptg_conceptos_casos",
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
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({name: "custrecord_ptg_tipo_concepto", label: "PTG - Tipo de Concepto"})
                        ]
                });
                let searchResultCount = customrecord_ptg_conceptos_casosSearchObj.runPaged().count;
                log.debug("customrecord_ptg_conceptos_casosSearchObj result count", searchResultCount);
                let info = [];
                customrecord_ptg_conceptos_casosSearchObj.run().each(function (result) {
                    let data = {};
                    data.id = result.getValue({name: "internalid", label: "Internal ID"})
                    data.name = result.getValue({name: "name", sort: search.Sort.ASC, label: "Name"});
                    //data.typeId = result.getValue({name: "custrecord_ptg_tipo_concepto", label: "PTG - Tipo de Concepto"});
                    data.typeName = result.getValue({name: "custrecord_ptg_tipo_concepto", label: "PTG - Tipo de Concepto"})
                    
                    info.push(data);
                    return true;
                });

                response.success = true;
                response.data = (info.length > 0) ? info : [];

            } catch (error) {
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
