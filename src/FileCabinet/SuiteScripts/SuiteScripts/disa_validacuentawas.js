/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define([], function() {
    function onAction(scriptContext){
        try {
            var flag=0;
          	var currentRecord = scriptContext.newRecord;
            var acctnumber = currentRecord.getValue('acctnumber');
            log.audit('Cuenta',acctnumber);
            /*var acctnumber = scriptContext.currentRecord.getValue({
           		fieldId: 'acctnumber'
			});*/
        	var patt1 = /\d{4}-\d{3}-\d{3}/;
  			var result = acctnumber.match(patt1);
            log.audit('Result',result);
            log.audit('Longitud',acctnumber.length);
  			if(result && acctnumber.length==12){
            	log.audit('Resultado','Estructura Cuenta Correcta');
              	flag = 1;
  			}else{
				log.audit('Resultado','Estructura Cuenta NO Correcta');
              	flag = 0;
			}
          	log.audit('Salida', flag);
            return flag;
        } catch (error) {
            log.audit('Eror en ejecución', error);
            return 0;
        }
    }
    return {
        onAction: onAction
    }
});