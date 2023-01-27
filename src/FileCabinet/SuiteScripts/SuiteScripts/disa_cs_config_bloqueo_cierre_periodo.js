/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record','N/ui/dialog', 'N/search'],

function(record,dialog, search) {
    
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

	
	function fieldChanged(scriptContext) {
		
		
	}
	
	function saveRecord(scriptContext) {
		
		try {
			var currentRecord = scriptContext.currentRecord;
			var tranId	 	  = currentRecord.getValue('id')||'';
			var tranType 	  = currentRecord.getValue('custrecord_drt_tipo_transaccion');
			var subsidiary    = currentRecord.getValue('custrecord_drt_subsidiaria');
			
			log.audit('tranId', tranId);
			
			if(tranId){
				var configBloqueoSearchObj = search.create({
					type: 'customrecord_drt_configuracion_cierre_p',
					filters:
					[
						["custrecord_drt_tipo_transaccion","anyof",tranType],
						"AND", 
						["custrecord_drt_subsidiaria","anyof",subsidiary],
						"AND", 
						["internalid","noneof",tranId]
					],
					columns:
					[
						search.createColumn({
							name: "scriptid",
							sort: search.Sort.ASC,
							label: "ID de script"
						}),
						search.createColumn({name: "custrecord_drt_tipo_transaccion", label: "Tipo de Transacción"}),
						search.createColumn({name: "custrecord_drt_periodo_a_cerrar", label: "Periodos"})
					]
				});
			}else{
				var configBloqueoSearchObj = search.create({
					type: 'customrecord_drt_configuracion_cierre_p',
					filters:
					[
						["custrecord_drt_tipo_transaccion","anyof",tranType],
						"AND", 
						["custrecord_drt_subsidiaria","anyof",subsidiary]
					],
					columns:
					[
						search.createColumn({
							name: "scriptid",
							sort: search.Sort.ASC,
							label: "ID de script"
						}),
						search.createColumn({name: "custrecord_drt_tipo_transaccion", label: "Tipo de Transacción"}),
						search.createColumn({name: "custrecord_drt_periodo_a_cerrar", label: "Periodos"})
					]
				});
			}
			
			
			var configBloqueoSrchResults = configBloqueoSearchObj.run().getRange({
				start : 0,
				end   : 9
			});
			if(configBloqueoSrchResults.length > 0){
				var tranTypeTxt   = currentRecord.getText('custrecord_drt_tipo_transaccion');
				var subsidiaryTxt = currentRecord.getText('custrecord_drt_subsidiaria');
				var options = {
					title: "Configuración Duplicada",
					message: "Ya se creó una configuración de cierre de periodo para la transacción "+ tranTypeTxt +" en la subsidiairia "+ subsidiaryTxt +"."
				};    		 
				dialog.alert(options);
				return false;
			}else{
				return true;
			}
		}
        catch(error){
			log.error('main error', error);
		}
	}
	
    return {
        //pageInit: pageInit,
        //fieldChanged: fieldChanged,
        //postSourcing: postSourcing,
        //sublistChanged: sublistChanged,
        //lineInit: lineInit,
        //validateField: validateField,
        //validateLine: validateLine,
        //validateInsert: validateInsert,
        //validateDelete: validateDelete,
        saveRecord: saveRecord
    };
    
});


