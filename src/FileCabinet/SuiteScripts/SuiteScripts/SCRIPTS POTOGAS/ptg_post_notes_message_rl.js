/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record"], function (record) {

    function _post(request) {

        const responseData = {
            success: false,
            message: "some errors occured",
            data: null,
            apiErrorPost: []
        }

        try {
            log.audit('request', request);
            request.informacion.forEach((fugas) => {
                let messageList = [];
                let tipoT = fugas.type;
                let idTransaccion = fugas.idRelacionado;
                let nombreTransaccionn = fugas.transaccion;
                log.audit('tipoT', tipoT);
                if (tipoT == "mensaje") {
                    var newMessage = record.create({
                        type: 'message',
                        isDynamic: true
                    });

                    if (nombreTransaccionn == "caso") {
                        newMessage.setValue({
                            fieldId: 'activity',
                            value: idTransaccion
                        });
                    } else if (nombreTransaccionn == "oportunidad") {
                        newMessage.setValue({
                            fieldId: 'transaction',
                            value: idTransaccion
                        });
                    };

                    newMessage.setValue({
                        fieldId: 'message',
                        value: fugas.nota
                    });

                    newMessage.setValue({
                        fieldId: 'subject',
                        value: fugas.nota
                    });

                    newMessage.save();
                    var idMessage = newMessage;
                    log.audit('mensaje creado', idMessage);
                    messageList.push(idMessage)

                    if (idMessage) {
                        responseData.success = true;
                        responseData.message = "Note created successfully";
                        responseData.data = messageList
                    }
                } else if (tipoT == "nota") {
                    let noteList = [];
                    var newNote = record.create({
                        type: 'note',
                        isDynamic: true
                    });

                    if (nombreTransaccionn == "caso") {
                        newNote.setValue({
                            fieldId: 'activity',
                            value: idTransaccion
                        });
                    } else if (nombreTransaccionn == "oportunidad") {
                        newNote.setValue({
                            fieldId: 'transaction',
                            value: idTransaccion
                        });
                    } else if (nombreTransaccionn == "cliente") {
                        newNote.setValue({
                            fieldId: 'entity',
                            value: idTransaccion
                        });
                    }

                    if(fugas.isApp){
                        newNote.setValue({
                            fieldId: 'author',
                            value: fugas.author
                        });
                    }

                    if(fugas.atCustomer){
                        newNote.setValue({
                            fieldId: 'notetype',
                            value: 13
                        });
                    }
                    
                    //transaction
                    newNote.setValue({
                        fieldId: 'title',
                        value: fugas.titulo
                    });

                    newNote.setValue({
                        fieldId: 'note',
                        value: fugas.nota
                    });

                    if (fugas.solicitudNotificacion) {
                        newNote.setValue({
                            fieldId: 'custrecord_ptg_solicitud_notificacion',
                            value: fugas.solicitudNotificacion
                        });
                    }

                    if (fugas.solicitudCancelacion) {
                        newNote.setValue({
                            fieldId: 'custrecord_ptg_solicitud_cancelacion',
                            value: fugas.solicitudCancelacion
                        });
                    }

                    if (fugas.solicitudCambioFecha) {
                        newNote.setValue({
                            fieldId: 'custrecord_ptg_solici_cambio_fech_prome',
                            value: fugas.solicitudCambioFecha
                        });

                        newNote.setText({
                            fieldId: 'custrecord_ptg_nueva_fecha_prometida',
                            text: fugas.fechaPrometida
                        });
                    }

                    if (fugas.mostrarAlerta) {
                        newNote.setValue({
                            fieldId: 'custrecord_ptg_mostrar_alerta',
                            value: fugas.mostrarAlerta
                        });
                    }

                    var idNote = newNote.save();
                    noteList.push(idNote)
                    log.audit('id de nota creada', idNote);
                    if (idNote) {
                        responseData.success = true;
                        responseData.message = "Note created successfully";
                        responseData.data = noteList
                    }
                }
            });
        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
        }

        return responseData
    }

    return {
        post: _post
    }
});