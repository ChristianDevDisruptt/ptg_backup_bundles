/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
function(record, search) {
   /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
		try {
			var transactionRec = scriptContext.newRecord;
			var recId = transactionRec.id;
            var recType = transactionRec.type;
			var lineCount = transactionRec.getLineCount({ sublistId:'item' })||0;
          	var form = transactionRec.getValue({
                    fieldId: 'customform'
            });
          	log.audit('CustForm:',form);
          	if(form != 221){
              var pesoBrutoTotal = 0;
              if(lineCount > 0){
                  for (var k = 0; k < lineCount; k++) {
                      var pesoEnKG = parseFloat(transactionRec.getSublistValue({
                          sublistId: 'item',
                          fieldId: 'custcol_disa_peso_total_cp',
                          line: k
                      })) || 0;
                      transactionRec.setSublistValue({
                          sublistId: 'item',
                          fieldId: 'custcol_drt_cp_pesoenkg',
                          line: k,
                          value: pesoEnKG
                      });
                      pesoBrutoTotal = pesoBrutoTotal + pesoEnKG;
                  }
              }
              if(pesoBrutoTotal){
              	transactionRec.setValue('custbody_drt_cp_pesobrutototal',pesoBrutoTotal);
              }
            }
		} catch (error) {
            log.error({ title: 'error beforeSubmit', details: JSON.stringify(error) });
        }
    }
	
	/**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	
    }
    return {
        beforeSubmit: beforeSubmit
		//afterSubmit: afterSubmit
    };
    
});
