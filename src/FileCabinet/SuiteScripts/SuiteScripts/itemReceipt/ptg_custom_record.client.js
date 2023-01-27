/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
    /**
     * @param{search} search
     */
    function (search) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            const fieldId = scriptContext.fieldId;
            const sublistId = scriptContext.sublistId;
            const lineFields = {
                "address": "custrecord_ptg_direccion_venta",
                "addressLimited": "custrecord_ptg_limited",
                "customer": "custrecord_ptg_cliente_est_vts"
            }
            const context = scriptContext.currentRecord;
            const lineNum = scriptContext.line;

            console.log(scriptContext);
            debugger

            //Cuando cambie  de direccion se cambia  customers a nivel linea

            if (fieldId == lineFields.address) {

                const address = context.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: lineFields.address,
                    line: lineNum
                });
                console.log("address" + address);
                //Se abre registro de custom address y se obtiene el customer
                const customer = search.create({
                    type: "customrecord_ptg_direcciones",
                    filters: [
                        {
                            name: "internalid",
                            operator: "is",
                            values: address
                        }
                    ],
                    columns: [
                        {
                            name: "custrecord_ptg_cliente_dir",
                        }
                    ]
                }).run().getRange(0, 1)[0].getValue("custrecord_ptg_cliente_dir");
                context.setCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: lineFields.customer,
                    value: customer,
                    line: lineNum,
                    ignoreFieldChange: true
                });
                //timeout para que se cargue la direccion





            }
            if (fieldId == lineFields.addressLimited) {

                const addressLimited = context.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: lineFields.addressLimited,
                    line: lineNum
                });
                var addres = context.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: lineFields.address,
                    line: lineNum
                });
                if (addres != addressLimited) {
                    console.log("address" + addressLimited);
                    setTimeout(function () {

                        context.setCurrentSublistValue({
                            sublistId: sublistId,
                            fieldId: lineFields.address,
                            value: addressLimited,
                            line: lineNum,
                            ignoreFieldChange: true
                        });
                    }, 1000);
                }
            }




        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        return {
            fieldChanged: fieldChanged,

        };

    });
