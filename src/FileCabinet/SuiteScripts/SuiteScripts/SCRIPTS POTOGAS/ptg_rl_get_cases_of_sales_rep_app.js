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
                success: false
            };

            try {                
                //let status = 7
                let filters = [
                    ["assigned", "anyof", requestBody.salesRep],
                    //"AND",
                    //["status", "anyof", status],
                    "AND",
                    ["category", "anyof", "1"],
                ];
                if (requestBody.open) {
                    //status = 2
                    filters.push("AND",
                    ["status", "anyof", "2"])
                } else {
                    filters.push("AND", ['custevent_ptg_fecha_visita', "within", requestBody.startDate, requestBody.endDate], "AND",
                    ["status", "anyof", "7"]);
                }

                log.debug('filters', filters)
                let supportcaseSearchObj = search.create({
                    type: "supportcase",
                    filters: filters,
                    columns:
                        [
                            search.createColumn({ name: "custevent_ptg_direccion_para_casos", label: "PTG - DIRECCION PARA CASOS" }),
                            search.createColumn({ name: "company", label: "Company" }),
                            search.createColumn({ name: "priority", label: "Priority" }),
                            search.createColumn({ name: "message", label: "Message Text" }),
                            search.createColumn({ name: "custevent_ptg_horario_preferido", label: "PTG - HORARIO PREFERIDO" }),
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({
                                name: "phone",
                                join: "company",
                                label: "Phone"
                            }),
                            search.createColumn({ name: "item", label: "Item" }),
                            search.createColumn({
                                name: "custitem_ptg_tipodearticulo_",
                                join: "item",
                                label: "PTG - TIPO DE ARTÍCULO"
                            }),
                            search.createColumn({
                                name: "casenumber",
                                sort: search.Sort.ASC,
                                label: "Number"
                            }),
                            search.createColumn({ name: "custevent_ptg_ano_producto", label: "PTG - AÑO DEL PRODUCTO" }),
                            search.createColumn({
                                name: "custitem_ptg_capacidadcilindro_",
                                join: "item",
                                label: "PTG - Capacidad cilindro"
                            }),
                            search.createColumn({
                                name: "custevent_ptg_fecha_visita",
                                label: "PTG - FECHA DE VISITA"
                            }),
                            search.createColumn({ name: "custevent_ptg_conceptos_casos", label: "custevent_ptg_conceptos_casos" }),
                            search.createColumn({ name: "status", label: "Status" }),
                        ]
                });
                // var searchResultCount = supportcaseSearchObj.runPaged().count;
                // log.debug("supportcaseSearchObj result count", searchResultCount);
                // supportcaseSearchObj.run().each(function (result) {
                //     // .run().each has a limit of 4,000 results
                //     return true;
                // });
                let searchResultCount = supportcaseSearchObj.run();
                let start = 0;
                let data = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                obj.address = results[i].getValue(columnas[0]);
                                obj.customerId = results[i].getValue(columnas[1]);
                                obj.customer = results[i].getText(columnas[1]);
                                obj.priorityId = results[i].getValue(columnas[2]);
                                obj.priority = results[i].getText(columnas[2]);
                                obj.message = results[i].getValue(columnas[3]);
                                obj.horarioPref = results[i].getValue(columnas[4]);
                                obj.id = results[i].getValue(columnas[5]);
                                obj.phone = results[i].getValue(columnas[6]);
                                obj.item = results[i].getText(columnas[7]);
                                obj.itemId = results[i].getValue(columnas[7]);
                                obj.typeId = results[i].getValue(columnas[8]);
                                obj.type = results[i].getText(columnas[8]);
                                obj.numberCase = results[i].getValue(columnas[9]);
                                obj.yearProduct = results[i].getValue(columnas[10]);
                                obj.capItem = results[i].getValue(columnas[11]);
                                obj.visitDate = results[i].getValue(columnas[12]);
                                obj.custevent_ptg_conceptos_casos = results[i].getValue(columnas[13])
                                obj.statusId = results[i].getValue(columnas[14])
                                obj.status = results[i].getText(columnas[14])

                                data.push(obj);
                            }
                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.data = (data.length > 0) ? data : [];

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