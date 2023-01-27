/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record'], function(record) {
	function beforeLoad(context) {
		try {
            if (context.type == context.UserEventType.CREATE) {
                var currentRecord =  context.newRecord || '';
                var recordID = currentRecord.id;
                var recordType = currentRecord.type;
                var objUpdate={};
				var clientId = currentRecord.getValue('entity');				
                var clientRec = record.load({
                    type: 'customer',
                    id  : clientId
                });
				
                var usoCFDI = clientRec.getValue('custentity_drt_uso_cfdi')||'';
				var metodoPago = clientRec.getValue('custentity_drt_metodo_pago')||'';
				var formaPago = clientRec.getValue('custentity_drt_forma_pago')||'';
				
				log.audit('usoCFDI',usoCFDI);
				log.audit('metodoPago',metodoPago);
				log.audit('formaPago',formaPago);
                
				if(usoCFDI != ''){
                    objUpdate.custbody_mx_cfdi_usage = usoCFDI;
                }
				if(metodoPago != ''){
                    objUpdate.custbody_mx_txn_sat_payment_term = metodoPago;
                }
				if(formaPago != ''){
                    objUpdate.custbody_mx_txn_sat_payment_method = formaPago;
                }				
				log.audit({title:'objUpdate',details:JSON.stringify(objUpdate)});
				if(Object.keys(objUpdate).length>0&&
                recordID&&
recordType

                ){
				record.submitFields({
					id: recordID,
					type: recordType,
					values: objUpdate,
					options: {
						enableSourcing: false,
						ignoreMandatoryFields: true
					}
				});     }
            }          		
            
        } catch (error) {
            log.error({title:'error',details:JSON.stringify(error)});
        }
    }
    function afterSubmit(context) {
		try {
            if (context.type == context.UserEventType.CREATE||context.type == context.UserEventType.EDIT) {
                var currentRecord =  context.newRecord || '';
                var recordID = currentRecord.id;
                var recordType = currentRecord.type;
              var eDocEstatus = currentRecord.getValue('custbody_psg_ei_status');
              log.audit('status',eDocEstatus);
                if(recordType == 'customerpayment'){
                    var clientId = currentRecord.getValue('customer');
                }
                else{
                    var clientId = currentRecord.getValue('entity');
                }			
                var clientRec = record.load({
                    type: 'customer',
                    id  : clientId
                });
                var eDocPack = clientRec.getValue('custentity_psg_ei_entity_edoc_standard');
              
              var custbody_psg_ei_template = currentRecord.getValue('custbody_psg_ei_template')||'';
                
                if(eDocPack != "" && !custbody_psg_ei_template){
                    switch (recordType) {
                        case 'invoice': 
                            plantillaEdoc = 9;
                            break;
                        case 'customerpayment': 
                            plantillaEdoc = 11;
                            break;
                        case 'creditmemo': 
                            plantillaEdoc = 8;
                            break;		
                        case 'cashsale': 
                            plantillaEdoc = 7;
                            break;								
                        default:
                            plantillaEdoc = 'N/A';
                            break;
                    }
                    if(plantillaEdoc != 'N/A'){
                        var objUpdate={
                            custbody_psg_ei_sending_method:5
                        };
                      if(eDocEstatus != 3){//3 - Listo para enviar
                        objUpdate.custbody_psg_ei_status= 1;
                      }
						//objUpdate.custbody_psg_ei_status= 1;
                        objUpdate.custbody_psg_ei_template=9;
                        //log.audit({title:'com_ext',details:JSON.stringify(com_ext)});
                        
                        log.audit({title:'objUpdate',details:JSON.stringify(objUpdate)});
                        record.submitFields({
                            id: recordID,
                            type: recordType,
                            values: objUpdate,
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
     
                    }
                }		
            }
        } catch (error) {
            log.error({title:'error',details:JSON.stringify(error)});
        }
    }

    return {
        beforeLoad : beforeLoad,
		afterSubmit: afterSubmit
    }
});
