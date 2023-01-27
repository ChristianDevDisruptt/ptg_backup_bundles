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
		
			var currentRecord = scriptContext.newRecord;
			var lineCount = currentRecord.getLineCount({ sublistId:'item' })||0;
			var ubicacion = parseInt(currentRecord.getValue('location'));
			debugger;
		
			if (ubicacion == 309 || ubicacion == 413 || ubicacion == 414 || ubicacion == 415 || ubicacion == 416 || ubicacion == 417 || ubicacion == 418 || ubicacion == 419 || ubicacion == 420 || ubicacion == 421 || ubicacion == 422 || ubicacion == 423 || ubicacion == 424)//232 - id de ubicacion
			{
				for (var index = 0; index < lineCount; index++) {
				
					var itemTaxCode = parseInt(currentRecord.getSublistValue({
						sublistId: 'item',
						fieldId: 'taxcode',
						line: index
					}))|| '';
					
					if (itemTaxCode == 6) {//5- Id IVA: No aplica
						
						currentRecord.setSublistValue({
							sublistId: 'item',
							fieldId: 'taxcode',
							value: 13,//1930 - id de Importaciones:no aplica
							line: index
						});
						
						log.audit('itemTaxCode' + index, itemTaxCode);	
					}
				}
			}
		}
        catch(error){
			log.error('main error', error);
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
