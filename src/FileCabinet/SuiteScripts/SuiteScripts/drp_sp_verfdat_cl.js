/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define([], function () {

    function pageInit(context) {

    }

    function saveRecord(context) {

        try {
            
            var item_number = context.currentRecord.getValue({
                fieldId: 'upccode'
            }) || '';
            var output = [item_number.slice(0,2),"-",item_number.slice(2,4),"-",
            item_number.slice(4,5),"-",item_number.slice(5)].join('');

            context.currentRecord.setValue({
                fieldId: 'itemid',
                value: output
            }) || ''; 

            
        } catch (error) {

            console.log(error);

        } finally {

            console.log(output);

            return true;

        }
    }

    function validateField(context) {
        try {
            var respuesta = true;
            var sublistName = context.sublistId || '';
            var sublistFieldName = context.fieldId || '';
            var line = context.line;
            if (
                !sublistName &&
                sublistFieldName == 'acctnumber'
            ) {
                var acctnumber = context.currentRecord.getValue({
                    fieldId: 'acctnumber'
                }) || '';

                respuesta = acctnumber != '';

                context.currentRecord.setValue({
                    fieldId: 'description',
                    value: 'El nombre de la cuenta es: ' + acctnumber + ' esta permitido ' + respuesta
                });

            }
        } catch (error) {
            console.log(error);
        } finally {
            console.log(respuesta);
            return respuesta;
        }
    }

    function fieldChanged(context) {
        try {
            debugger
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId || '';
            var sublistFieldName = context.fieldId || '';
            var line = context.line;

            if (!sublistName) {
                if (
                    sublistFieldName == 'custitem_drt_consecutivo_2' ||
                    sublistFieldName == 'custitem_drt_consecutivo_1' ||
                    sublistFieldName == 'custitem_drt_clase' ||
                    sublistFieldName == 'custitem_drt_tipo_material'
                ) {
                    var consecutivo_2 = currentRecord.getValue({
                        fieldId: 'custitem_drt_consecutivo_2'
                    }) || '';
                    var consecutivo_1 = currentRecord.getValue({
                        fieldId: 'custitem_drt_consecutivo_1'
                    }) || '';
                    var clase = currentRecord.getValue({
                        fieldId: 'custitem_drt_clase'
                    }) || '';
                    var tipo_material = currentRecord.getValue({
                        fieldId: 'custitem_drt_tipo_material'
                    }) || '';

                    

                    /* currentRecord.setValue({
                        fieldId: 'itemid',
                        value:

                            tipo_material +
                            '-' +
                            clase +
                            '-' +
                            consecutivo_1 +
                            '-' +
                            consecutivo_2
                    }); */
                    currentRecord.setValue({
                        fieldId: 'upccode',
                        value: tipo_material +
                            clase +
                            consecutivo_1 +
                            consecutivo_2
                    });
                }
                if ( sublistFieldName == 'upccode' ) {
                    var item_number = context.currentRecord.getValue({
                        fieldId: 'upccode'
                    }) || '';
                    var output = [item_number.slice(0,2),"-",item_number.slice(2,4),"-",
                    item_number.slice(4,5),"-",item_number.slice(5)].join('');
        
                    context.currentRecord.setValue({
                        fieldId: 'itemid',
                        value: output
                    }) || '';
                    
                }

            }



        } catch (error) {
            console.log({
                title: 'error fieldChanged',
                details: JSON.stringify(error)
            });
        }
    }

    function postSourcing(context) {

    }

    function lineInit(context) {

    }

    function validateDelete(context) {

    }

    function validateInsert(context) {

    }

    function validateLine(context) {

    }

    function sublistChanged(context) {

    }

    return {
        // pageInit: pageInit,
        //saveRecord: saveRecord,
        // validateField: validateField,
        fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // lineInit: lineInit,
        // validateDelete: validateDelete,
        // validateInsert: validateInsert,
        // validateLine: validateLine,
        // sublistChanged: sublistChanged
    }
});