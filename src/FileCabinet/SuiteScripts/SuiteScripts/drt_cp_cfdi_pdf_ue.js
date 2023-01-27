/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define([
    'N/record'
], function (
    record
) {
    function beforeLoad(context) {
        try {
			log.debug("Prueba","Prueba")
            if (context.type == context.UserEventType.PRINT) {
                var record_context1 = context.newRecord || '';
                var typeRecord = record_context1.type || '';
                var idRecord = record_context1.id || '';

                var certificaData= [];
                certificaObj = {};

                var record_context = record.load({
                    type: typeRecord,
                    id: idRecord,
                });

                certificaObj.custbody_mx_cfdi_cadena_original = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_cadena_original'
                });
				log.debug("certificaObj.custbody_mx_cfdi_cadena_original",certificaObj.custbody_mx_cfdi_cadena_original);
                certificaObj.custbody_mx_cfdi_issuer_serial = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_issuer_serial'
                });
				log.debug("certificaObj.custbody_mx_cfdi_issuer_serial",certificaObj.custbody_mx_cfdi_issuer_serial);
                certificaObj.custbody_mx_cfdi_qr_code = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_qr_code'
                });

                certificaObj.custbody_mx_cfdi_sat_serial = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_sat_serial'
                });

                certificaObj.custbody_mx_cfdi_sat_signature = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_sat_signature'
                });

                certificaObj.custbody_mx_cfdi_signature = record_context.getValue({
                    fieldId: 'custbody_mx_cfdi_signature'
                });

                certificaData.push(certificaObj);
				
              log.debug("Antes",certificaData);
                record_context1.setValue({
                    fieldId: 'custbody_drt_cp_pdf_data',
                    value: JSON.stringify(certificaData)
                });
              log.debug("Termino",certificaData);

            }
        } catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});