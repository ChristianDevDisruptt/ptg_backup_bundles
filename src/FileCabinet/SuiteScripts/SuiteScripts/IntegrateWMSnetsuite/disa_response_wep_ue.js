/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/ui/serverWidget', 'N/record'], function (ui,record) {

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {
                if (context.newRecord.type == record.Type.CUSTOMER) {
                    var msgField = context.form.addField({
                        id: 'custpage_drt_customer',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuesta = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuesta);

                    var currentRecord = context.newRecord;

                    var respuesta = currentRecord.getValue({
                        fieldId: 'custentity_drt_disa_response_wep'
                    });

                    if (parametroRespuesta == 200) {
                        param_message = "Su registro se envio con éxito a WEP"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuesta == 500) {
                        param_message = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + "  " + respuesta + " ', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                } else if (context.newRecord.type == record.Type.VENDOR) {
                    var mensaje = context.form.addField({
                        id: 'custpage_drt_vendor',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroProveedor = context.request.parameters.wms;
                    log.audit('parametro', parametroProveedor);

                    var currentRecord = context.newRecord;

                    var respuestaVendor = currentRecord.getValue({
                        fieldId: 'custentity_disa_response_body'
                    });

                    var respuestaCorta = '';

                    if (parametroProveedor == 200) {
                        respuestaCorta = "Su registro se envio con éxito a WEP"
                        mensaje.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaCorta + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroProveedor == 500) {
                        respuestaCorta = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        mensaje.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaCorta + "  " + respuestaVendor + " ', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                } else if (context.newRecord.type == record.Type.INVENTORY_ITEM) {
                    var msgField = context.form.addField({
                        id: 'custpage_drt_inventory_item',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuesta = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuesta);

                    var currentRecord = context.newRecord;

                    var respuesta = currentRecord.getValue({
                        fieldId: 'custitem_disa_drt_response_footprint'
                    });

                    if (parametroRespuesta == 1) {
                        param_message = "Su registro se envio con éxito a WEP"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuesta == 2) {
                        param_message = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + "  " + respuesta + " ', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                } else if(context.newRecord.type == record.Type.LOT_NUMBERED_INVENTORY_ITEM){
                    var msgLot = context.form.addField({
                        id: 'custpage_drt_inventory_item_lot',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuestaLot = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuestaLot);

                    var currentRecord = context.newRecord;

                    var respuestaL = currentRecord.getValue({
                        fieldId: 'custitem_disa_drt_response_footprint'
                    });

                    var respuestaP = currentRecord.getValue({
                        fieldId: 'custitem_disa_drt_esponse_product'
                    }); 

                    log.audit('respuestaL', respuestaL);
                    log.audit('respuestaP', respuestaP);

                    var respuestaLote ='';

                    if (parametroRespuestaLot == 1 || parametroRespuestaLot == 4) {
                        respuestaLote = "Su registro se envio con éxito a WEP"
                        msgLot.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaLote + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuestaLot == 2) {
                        respuestaLote = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgLot.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaLote + "  " + respuestaL + " del articulo  " + respuestaP + "', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    } else if(parametroRespuestaLot == 3){
                        respuestaLote = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgLot.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaLote + "  " + respuestaP + "', type: message.Type.ERROR}).show({duration: 25000})  });</script>"; 
                    }
                } else if(context.newRecord.type == record.Type.KIT_ITEM){
                    var msgkIT = context.form.addField({
                        id: 'custpage_drt_inventory_KIT',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuestakIT = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuestakIT);

                    var currentRecord = context.newRecord;

                    var respuestak = currentRecord.getValue({
                        fieldId: 'custitem_disa_drt_esponse_product'
                    }); 

                    log.audit('respuestaK', respuestak);

                    var respuestaKit ='';

                    if (parametroRespuestakIT == 200) {
                        respuestaKit = "Su registro se envio con éxito a WEP"
                        msgkIT.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaKit + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuestakIT == 500) {
                        respuestaLote = "Su transaccion no se pudo crear por que contiene el siguiente error:"
                        msgkIT.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + respuestaLote + "  " + respuestak + "', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                } else {
                    var msgField = context.form.addField({
                        id: 'custpage_drt_all',
                        label: 'Message',
                        type: ui.FieldType.INLINEHTML
                    });

                    var parametroRespuesta = context.request.parameters.wms;
                    log.audit('parametro', parametroRespuesta);

                    var currentRecord = context.newRecord;

                    var respuesta = currentRecord.getValue({
                        fieldId: 'custbody_disa_responce_body'
                    });

                    if (parametroRespuesta == 200) {
                        param_message = "Su registro se envio con éxito a WEP"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + " ', type: message.Type.CONFIRMATION}).show({duration: 25000})  });</script>";
                    } else if (parametroRespuesta == 500) {
                        param_message = "Su transaccion no se pudo crear  por que contiene el siguiente error:"
                        msgField.defaultValue = "<script> require(['N/ui/message'], function(message){ message.create({title:'Respuesta WMS: " + param_message + "  " + respuesta + " ', type: message.Type.ERROR}).show({duration: 25000})  });</script>";
                    }
                }
            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});