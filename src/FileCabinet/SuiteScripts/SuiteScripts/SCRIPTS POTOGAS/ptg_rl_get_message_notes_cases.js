/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/search', 'N/file'],
    /**
   * @param{search} search
   */
    (search, file) => {
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
                let idCase = requestBody.case;
                log.debug('idCase', idCase)

                //Busqueda de mensajes
                let supportcaseSearchObj = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["internalid", "anyof", idCase]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "message",
                                join: "messages",
                                label: "Message"
                            }),
                            search.createColumn({
                                name: "casenumber",
                                label: "Number"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "messages",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "messagedate",
                                join: "messages",
                                sort: search.Sort.DESC,
                                label: "Date"
                            })
                        ]
                });

                log.audit('supportcaseSearchObj', supportcaseSearchObj)
                //let contador = supportcaseSearchObj.runPaged().count;
                //log.audit('contador', contador);
                let searchResultCount = supportcaseSearchObj.run();
                let start = 0;
                let messagesData = [];

                do {
                    var results = searchResultCount.getRange(start, start + 1000);
                    log.audit('results message', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[2])) {
                                obj.message = results[i].getValue(columnas[0]);
                                obj.messageId = results[i].getValue(columnas[2]);
                                messagesData.push(obj);
                            }

                        }
                    }
                    start += 1000;
                } while (results && results.length == 1000);


                //Busqueda de notas
                var supportcaseNoteSearchObj = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["internalid", "anyof", idCase]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "author",
                                join: "userNotes",
                                label: "Author"
                            }),
                            search.createColumn({
                                name: "company",
                                join: "userNotes",
                                label: "Company"
                            }),
                            search.createColumn({
                                name: "notedate",
                                join: "userNotes",
                                sort: search.Sort.DESC,
                                label: "Date"
                            }),
                            search.createColumn({
                                name: "direction",
                                join: "userNotes",
                                label: "Direction"
                            }),
                            search.createColumn({
                                name: "internalid",
                                join: "userNotes",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "note",
                                join: "userNotes",
                                label: "Memo"
                            }),
                            search.createColumn({
                                name: "title",
                                join: "userNotes",
                                label: "Title"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_solicitud_notificacion",
                                join: "userNotes",
                                label: "PTG - SOLICITUD DE NOTIFICACIÓN"
                            })
                        ]
                });

                log.audit('supportcaseNoteSearchObj', supportcaseNoteSearchObj)
                //let contador = supportcaseNoteSearchObj.runPaged().count;
                //log.audit('contador', contador);
                let searchResultCountNotes = supportcaseNoteSearchObj.run();
                let start2 = 0;
                let notesData = [];

                do {
                    var results = searchResultCountNotes.getRange(start2, start2 + 1000);
                    log.audit('results note', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[4])) {
                                obj.title = results[i].getValue(columnas[6]);
                                obj.note = results[i].getValue(columnas[5]);
                                obj.date = results[i].getValue(columnas[2]);
                                obj.author = results[i].getText(columnas[0]);
                                obj.noteId = results[i].getValue(columnas[4]);
                                obj.solicitud_notificacion = results[i].getValue(columnas[7]);
                                notesData.push(obj);
                            }

                        }
                    }
                    start2 += 1000;
                } while (results && results.length == 1000);

                let supportcaseImg = search.create({
                    type: "supportcase",
                    filters:
                        [
                            ["internalid", "anyof", idCase]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "internalid",
                                join: "file",
                                label: "Internal ID"
                            }),
                            search.createColumn({
                                name: "folder",
                                join: "file",
                                label: "Folder"
                            }),
                            search.createColumn({
                                name: "name",
                                join: "file",
                                label: "Name"
                            }),
                            search.createColumn({
                                name: "url",
                                join: "file",
                                label: "URL"
                            })
                        ]
                });
                //  let searchResultCount = supportcaseSearchObj.runPaged().count;
                //  log.debug("supportcaseSearchObj result count",searchResultCount);
                //  supportcaseSearchObj.run().each(function(result){
                //     // .run().each has a limit of 4,000 results
                //     return true;
                //  });
                let searchResultCountImg = supportcaseImg.run();
                let start3 = 0;
                let imgData = [];

                do {
                    var results = searchResultCountImg.getRange(start3, start3 + 1000);
                    log.audit('results img', results)
                    if (results && results.length > 0) {
                        for (let i = 0; i < results.length; i++) {
                            let columnas = results[i].columns;
                            let obj = {};
                            if (!!results[i].getValue(columnas[0])) {
                                let imgFile = file.load({
                                    id: results[i].getValue(columnas[0])
                                });

                                let dataImg = imgFile.getContents();

                                obj.imgId = results[i].getValue(columnas[0]);
                                obj.base64 = dataImg;
                                obj.name = results[i].getValue(columnas[2]);
                                obj.url = results[i].getValue(columnas[3]);
                                // obj.author = results[i].getText(columnas[0]);
                                // obj.noteId = results[i].getValue(columnas[4]);
                                imgData.push(obj);
                            }

                        }
                    }
                    start3 += 1000;
                } while (results && results.length == 1000);

                response.success = true;
                response.messageData = (messagesData.length > 0) ? messagesData : [];
                response.noteData = (notesData.length > 0) ? notesData : [];
                response.imgData = (imgData.length > 0) ? imgData : [];

                return response;

            } catch (error) {
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
