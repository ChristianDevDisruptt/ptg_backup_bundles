/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(
    [
        'N/runtime'
    ],
    function (
        runtime
    ) {

        function validateLine(context) {
            try {
                debugger;
                var respuesta = true;
                var sublistName = context.sublistId;
                var role = runtime.getCurrentUser().role || "";
                if (
                    role &&
                    role != 1146 &&
                    sublistName == 'item'
                ) {
                    var rate = context.currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcol_disa_precio_lista',
                    }) || context.currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'rate',
                    }) || 0;
                    var precio_unitario = context.currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcol_disa_precio_unitario',
                    }) || 0;
					debugger;
                    if (
                        rate &&
                        precio_unitario &&
                        rate <= precio_unitario
                    ) {

                        context.currentRecord.setCurrentSublistValue({
                            sublistId: sublistName,
                            fieldId: 'rate',
                            value: precio_unitario
                        });
                    } else if(
                        rate &&
                        precio_unitario &&
                        rate >= precio_unitario
                    ) {
                        //alert("El precio unitario no es válido.");
                        //respuesta = false;
                        context.currentRecord.setCurrentSublistValue({
                            sublistId: sublistName,
                            fieldId: 'rate',
                            value: precio_unitario
                        });
                    }

                }

            } catch (error) {
                log.error({
                    title: 'error validateLine',
                    details: error
                });
            } finally {
                log.audit({
                    title: 'respuesta validateLine',
                    details: JSON.stringify(respuesta)
                });
                return respuesta;
            }
        }

        function postSourcing(context) {
            try {
                var sublistName = context.sublistId;
                var sublistFieldName = context.fieldId;

                if (
                    sublistName === 'item' &&
                    sublistFieldName === 'item'
                ) {
                    var rate = context.currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: "rate"
                    }) || '';
                    var precio_lista = context.currentRecord.getCurrentSublistValue({
                        sublistId: sublistName,
                        fieldId: "custcol_disa_precio_lista"
                    }) || '';
                  	debugger;
                    if (
                        rate
                    ) {
                        context.currentRecord.setCurrentSublistValue({
                            sublistId: sublistName,
                            fieldId: "custcol_disa_precio_unitario",
                            value: rate
                        });
                        if (!precio_lista) {
                            context.currentRecord.setCurrentSublistValue({
                                sublistId: sublistName,
                                fieldId: "custcol_disa_precio_lista",
                                value: rate
                            });
                        }
                    }
                }

            } catch (error) {
                log.error({
                    title: 'error postSourcing',
                    details: JSON.stringify(error)
                });
            }
        }

        function fieldChanged(context) {
            try {
              var currentRecord = context.currentRecord;
              var sublistName = context.sublistId;
              var sublistFieldName = context.fieldId;
              var sublista = '';
      
              if (sublistName === 'item' && sublistFieldName === 'quantity') {
                  var total = currentRecord.getCurrentSublistValue('item', 'rate');
                  if(total){
                    context.currentRecord.setCurrentSublistValue({
                      sublistId: sublistName,
                      fieldId: "custcol_disa_precio_unitario",
                      value: total
                    });
      
                    context.currentRecord.setCurrentSublistValue({
                      sublistId: sublistName,
                      fieldId: "custcol_disa_precio_lista",
                      value: total
                    });
                  }
              }
      
            } catch (error) {
              log.error({
                title: 'error fieldChanged',
                details: JSON.stringify(error)
              });
            }
          }

        return {
            postSourcing: postSourcing,
            validateLine: validateLine,
            fieldChanged: fieldChanged
        }
    });