/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define([
    'N/ui/message',
    'N/ui/dialog',
    'N/search',
    'N/query',
    'N/runtime'
], function (
    message,
    dialog,
    search,
    query,
    runtime
) {

    function saveRecord(context) {
        var respuesta=true;
        var userObj = runtime.getCurrentUser();
        var userId = userObj.id;
        log.debug({
            title: 'User ID',
            details: userId
        });
        try{
            var currentRecord = context.currentRecord;
            var from_location = currentRecord.getValue({
                fieldId: 'location'
            }) || '';
            var to_location = currentRecord.getValue({
                fieldId: 'transferlocation'
            }) || '';
            var user_location = currentRecord.getValue({
                fieldId: 'nlloc'
            }) || '';

            var sql =
            "SELECT " +
            "  location" +
            " FROM " +
            "  employee " +
            " WHERE " +
            "  id="+userId;
          var resultIterator = query.runSuiteQLPaged({
            query: sql,
            pageSize: 10
          }).iterator();
          resultIterator.each(function(page) {
            var pageIterator = page.value.data.iterator();
            pageIterator.each(function(row) {
              user_location = row.value.getValue(0);
              return true;
            });
            return true;
          });

          log.debug({
              title: 'User Location',
              details: user_location
          });

          	/* Campo en SBX */
            /*var from_location_parent = search.lookupFields({
                type: search.Type.LOCATION,
                id: from_location,
                columns: ['custrecord_drt_nivel_superior_ubicacion']
            });*/
          	custrecord_disa_nombre_ubicacion_padre
            /* Campo en PRD */
            var from_location_parent = search.lookupFields({
                type: search.Type.LOCATION,
                id: from_location,
                columns: ['custrecord_disa_nombre_ubicacion_padre']
            });
            var from_location_parent_id = from_location_parent.custrecord_disa_nombre_ubicacion_padre[0].value;
            log.debug({
                title: 'From Location Parent',
                details: from_location_parent_id
            });
          	/* Campo en SBX 
            var to_location_parent = search.lookupFields({
                type: search.Type.LOCATION,
                id: to_location,
                columns: ['custrecord_drt_nivel_superior_ubicacion']
            });*/
          	/* Campo en PRD */
          	var to_location_parent = search.lookupFields({
                type: search.Type.LOCATION,
                id: to_location,
                columns: ['custrecord_disa_nombre_ubicacion_padre']
            });
            var to_location_parent_id = to_location_parent.custrecord_disa_nombre_ubicacion_padre[0].value;
            log.debug({
                title: 'To Location Parent',
                details: to_location_parent_id
            });
            /*var user_location_parent = search.lookupFields({
                type: search.Type.LOCATION,
                id: user_location,
                columns: ['custrecord_drt_nivel_superior_ubicacion']
            });
            var user_location_parent_id = user_location_parent.value;
            log.debug({
                title: 'User Location Parent',
                details: user_location_parent
            });*/
            if(from_location_parent_id != user_location || to_location_parent_id != user_location){
                showmessage({
                    title: "Error",
                    message: "No puedes utilizar ubicaciones que no pertenecen a tu almacén.",
                    type: message.Type.ERROR
                },
                15000,
                true);
                respuesta=false;
            }
        } catch (error) {
            log.error({
                title: 'error SaveRecord',
                details: JSON.stringify(error)
            });
        } finally {
            log.emergency({
                title: 'respuesta SaveRecord',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function fieldChanged(context) {
        debugger;
        var userObj = runtime.getCurrentUser();
        var userId = userObj.id;
        log.debug({
            title: 'User ID',
            details: userId
        });
        try{
            log.debug({
                title: 'Inicia FieldChanged',
                details: 'Inicio'
            });
            var respuesta = true;
            var currentRecord = context.currentRecord;
            var FieldName = context.fieldId;
            log.debug({
                title: 'Campo que Cambio',
                details: FieldName
            });
            if ( FieldName === 'location' || FieldName === 'transferlocation') {
                var currentRecord = context.currentRecord;
                log.debug({
                    title: 'Lee la Ubicación',
                    details: 'Antes'
                });
                var location = currentRecord.getValue({
                    fieldId: FieldName
                }) || '';
              	log.debug({
                    title: 'Obtuvo la Ubicación',
                    details: location
                });
                var user_location = currentRecord.getValue({
                    fieldId: 'nlloc'
                }) || '';
                
                var sql =
                "SELECT " +
                "  location" +
                " FROM " +
                "  employee " +
                " WHERE " +
                "  id="+userId;
              var resultIterator = query.runSuiteQLPaged({
                query: sql,
                pageSize: 10
              }).iterator();
              resultIterator.each(function(page) {
                var pageIterator = page.value.data.iterator();
                pageIterator.each(function(row) {
                  user_location = row.value.getValue(0);
                  return true;
                });
                return true;
              });
  
              log.debug({
                  title: 'User Location',
                  details: user_location
              });

              	/* Campo en SBX
                var location_parent = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: location,
                    columns: ['custrecord_drt_nivel_superior_ubicacion']
                });*/
              	/* Campo en PRD */
              	log.debug({
                    title: 'Busqueda Padre',
                    details: 'Inicio Búsqueda'
                });
              	var location_parent = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: location,
                    columns: ['custrecord_disa_nombre_ubicacion_padre']
                });
              	log.debug({
                    title: 'Busqueda Padre',
                    details: 'Terminó Búsqueda'
                });
                var location_parent_id = location_parent.custrecord_disa_nombre_ubicacion_padre[0].value;
                log.debug({
                    title: 'Location Parent',
                    details: location_parent_id
                });
                if(location_parent_id != user_location){
                    showmessage({
                        title: "Error",
                        message: "No puedes utilizar ubicaciones que no pertenecen a tu almacén.",
                        type: message.Type.ERROR
                    },
                    15000,
                    true);
                    respuesta=false;
                }
            }
        } catch (error) {
            log.error({
                title: 'error fieldChanged',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta fieldChanged',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
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
        fieldChanged: fieldChanged,
        saveRecord: saveRecord
    }
});