/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(['N/ui/message','N/ui/dialog','N/search'],
 function (message,dialog,search) {

    function validateLine(context) {
        try{
            var uuid="";
            var returnTransaction = true;
            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;
            var field = "custcol_drt_uuid_informes_gastos";
            var patt1 = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;
            if (sublistName === 'expense'){
                uuid = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: field,
                });
                var result = uuid.match(patt1);
                if(uuid.length==0 || (result && uuid.length==36)){
                    console.log('Estructura UUID Correcta: '+uuid);
                    return true;
                }else{
                    console.log('Estructura UUID Incorrecta: '+uuid);
                    showmessage({
                            title: "Error",
                            message: "La estructura del UUID no es correcta, esta debe ser XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                            type: message.Type.ERROR
                        },
                        0,
                        true
                    );
                    returnTransaction = false;
                    return false;
                }
            }
        } catch (error) {
            console.log('error ' + JSON.stringify(error));
            return false;
        } finally {
            console.log("returnTransaction " + returnTransaction)
            return returnTransaction;
        }
    }


    function showmessage(param_message, param_duration, param_show) {
        try {
            if (param_show) {
                var m = {
                    title: "My Title",
                    message: "My Message",
                    cause: 'cause',
                    type: message.Type.CONFIRMATION
                };
                var myMsg = message.create(param_message);

                myMsg.show({
                    duration: param_duration
                });
            } else {
                var options = {
                    title: '',
                    message: '',
                };
                options.title = param_message.title;
                options.message = param_message.message;
                dialog.alert(options);
            }

        } catch (error) {
            log.error({
                title: 'error showmessage',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        validateLine: validateLine
    }
});