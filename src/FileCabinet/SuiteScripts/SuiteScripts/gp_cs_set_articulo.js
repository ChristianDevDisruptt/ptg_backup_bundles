/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

    function (record) {

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
         * Function to be executed after a line is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
            try {
                var currentRecord = scriptContext.currentRecord;
                var sublistName = scriptContext.sublistId;
                var sublistFieldName = scriptContext.fieldId;
                var line = scriptContext.line;
                debugger;
                if (sublistName === 'item') {

                    var articulo = currentRecord.getCurrentSublistValue('item', 'custcol_np_articulo') || '';
                    var item = currentRecord.getCurrentSublistValue('item', 'item') || '';
                    if (
                        articulo &&
                        articulo != item
                    ) {
                        currentRecord.setCurrentSublistValue('item', 'item', articulo);
                    }
                }
            } catch (error) {
                log.errorr({
                    title: 'error scriptContext',
                    details: JSON.stringify(error)
                });
            }
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
        function validateLine(context) {

        }


        function postSourcing(scriptContext) {

        }

        function fieldChanged(scriptContext) {
            try {
               debugger;
                var currentRecord = scriptContext.currentRecord;
                var sublistName = scriptContext.sublistId;
                var sublistFieldName = scriptContext.fieldId;
                var line = scriptContext.line;
                if (sublistName === 'item' && sublistFieldName === 'custcol_np_articulo') {
                    debugger;
                    var articulo = currentRecord.getCurrentSublistValue('item', 'custcol_np_articulo') || '';
                    var item = currentRecord.getCurrentSublistValue('item', 'item') || '';
                    if (
                        articulo &&
                        articulo != item
                    ) {
                        currentRecord.setCurrentSublistValue('item', 'item', articulo);
                    }
                }

            } catch (error) {
                log.error({
                    title: 'error fieldChanged',
                    details: JSON.stringify(error)
                });
            }
        }

        return {
            //pageInit: pageInit,
            fieldChanged: fieldChanged,
            //postSourcing: postSourcing,
            //sublistChanged: sublistChanged,
            // lineInit: lineInit,
            //validateField: validateField,
            //validateLine: validateLine,
            //validateInsert: validateInsert,
            //validateDelete: validateDelete,
            //saveRecord: saveRecord
        };

    });