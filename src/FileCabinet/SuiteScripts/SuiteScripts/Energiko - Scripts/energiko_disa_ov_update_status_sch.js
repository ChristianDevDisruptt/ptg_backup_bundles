/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */
define([
    'N/search','N/record','N/email'], function (search,record,email) {
    function execute(context){
        var errores=[];
        try
        {
            
            //Estado: Ejecucion del pedido pendiente
            //Estatus: Pendiente enviar WMS
            var ov_1=SearchOVPendienteEnviarWMS();
            log.audit('SearchOVPendienteEnviarWMS',ov_1);
            for(var i=0;i<ov_1.length;i++)
            {
                try{
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_1[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '18'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_1[i].tranid;
                    errores.push(error);
                    continue;
                }
            }

            //Estado: Ejecucion del pedido pendiente
            //Estatus: Pendiente surtir WMS diferente AC
            var ov_2=SearchOVPendienteSurtir();
            log.audit('SearchOVPendienteSurtir',ov_2);
            for(var i=0;i<ov_2.length;i++)
            {
                try{

                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_2[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '4'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_2[i].tranid;
                    errores.push(error);
                    continue;
                }
                
            }
            //Estado: Ejecucion del pedido pendiente
            //Estatus: Backorder para todas las ubicaciones sin comprometido
            var ov_3=SearchOVPendienteSurtirBackOrder();
            log.audit('SearchOVPendienteSurtirBackOrder',ov_3);
            for(var i=0;i<ov_3.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_3[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '15'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_3[i].tranid;
                    errores.push(error);
                    continue;
                }
                
            }  

            //Estado: Facturado
            var ov_4=SearchOVFacturadas();
            log.audit('SearchOVFacturadas',ov_4);
            for(var i=0;i<ov_4.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_4[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '6'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex){
                    var error='Orden de venta: '+ov_4[i].tranid;
                    log.audit('Error en Ordenes de Venta Facturadas ',error);
                    errores.push(error);
                    // email.send({
                    //     author: 10033,
                    //     recipients: ['mplascencia@energiko.com','amonreal@energiko.com','jislas@energiko.com'],
                    //     subject: 'DISA | Error en actualización de estatus de OV',
                    //     body: error                        
                    // });
                    continue;
                }
                
            } 
            //Estado: Cancelado
            var ov_5=SearchOVCanceladas();
            log.audit('SearchOVCanceladas',ov_5);
            for(var i=0;i<ov_5.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_5[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '14'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_5[i].tranid;
                    errores.push(error);
                    continue;
                }

            } 

            //Estado: Cerrado Completo
            var ov_6=SearchOVCerradasCompleta();
            log.audit('SearchOVCerradasCompleta',ov_6);
            for(var i=0;i<ov_6.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_6[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '13'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_6[i].tranid;
                    errores.push(error);
                    continue;
                }
            }           
            
            //Estado: Facturacion pendiente
            var ov_7=SearchOVPendienteFacturar();
            log.audit('SearchOVPendienteFacturar',ov_7);
            for(var i=0;i<ov_7.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_7[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '5'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_7[i].tranid;
                    errores.push(error);
                    continue;
                }
            }
             //Estado: Cerrado Parcial
             var ov_8=SearchOVCerradasParcial();
             log.audit('SearchOVCerradasParcial',ov_8);
             for(var i=0;i<ov_8.length;i++)
             {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_8[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '17'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_8[i].tranid;
                    errores.push(error);
                    continue;
                }
             } 
             
             //Estado: Parcialmente completado
             //Estatus: Parcial sin existencia

             var ov_9=SearchOVParcialSinExistencia();
             log.audit('SearchOVParcialSinExistencia',ov_9);
             for(var i=0;i<ov_9.length;i++)
             {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_9[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '19'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_9[i].tranid;
                    errores.push(error);
                    continue;
                }

                
             }

             //Estado: Parcialmente completado
             //Estatus: Pendiente facturar parcial

              var ov_10=SearchOVPendienteFacturarParcial();
              log.audit('SearchOVPendienteFacturarParcial',ov_10);
              for(var i=0;i<ov_10.length;i++)
              {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_10[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '20'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_10[i].tranid;
                    errores.push(error);
                    continue;
                }
              }
              
            //Estado: Parcialmente completado
            //Estatus: Pendiente Surtir WMS parcial

             var ov_11=SearchOVPendienteSurtirWMS();
             log.audit('SearchOVPendienteSurtirWMS',ov_11);
             for(var i=0;i<ov_11.length;i++)
             {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_11[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '23'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_11[i].tranid;
                    errores.push(error);
                    continue;
                }
             }
             
            //Estado: Parcialmente completado
            //Estatus: Pendiente Surtir parcial

            var ov_12=SearchOVPendienteSurtirParcial();
            log.audit('SearchOVPendienteSurtirParcial',ov_12);
            for(var i=0;i<ov_12.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_12[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '21'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_12[i].tranid;
                    errores.push(error);
                    continue;
                }
            }

            //Estado: Parcialmente completado
            //Estatus: Pendiente Enviar WMS parcial

            var ov_13=SearchOVPendienteEnviarWMSParcial();
            log.audit('SearchOVPendienteEnviarWMSParcial',ov_13);
            for(var i=0;i<ov_13.length;i++)
            {
                try
                {
                    var ordersaleObj = record.load({
                        type: record.Type.SALES_ORDER,
                        id: ov_13[i].internalid
                    });
                    ordersaleObj.setValue({
                        fieldId: 'custbody_disa_estatus_ov',
                        value: '22'
                    });
                    ordersaleObj.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    }
                    );
                }catch(ex)
                {
                    var error='Orden de venta: '+ov_13[i].tranid;
                    errores.push(error);
                    continue;
                }
            }
            var body='';
            for(var i=0;i<errores.length;i++)
            {
                body += errores[i]+'\n';                
            }
            if(errores.length>0)
            {
                EnvioEmail(body);
            }

        }catch (error) {
            log.error({
                title: 'error',
                details: JSON.stringify(error)
            });
        }
    }
    function EnvioEmail(cuerpo)
    {
          email.send({
            author: 10033,
            recipients: ['mplascencia@energiko.com','amonreal@energiko.com','jislas@energiko.com'],
            subject: 'DISA | Error en actualización de estatus de OV',
            body: cuerpo                        
        });

    }
    function SearchOVPendienteEnviarWMS()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["quantitycommitted","greaterthan","0"], 
               "AND", 
               ["status","anyof","SalesOrd:B"], 
               "AND", 
               ["location","anyof","211"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","18"],
               "AND", 
               ["mainline","is","F"],
               "AND", 
               ["subsidiary","anyof","2"],
               "AND",
               ["custbody_drt_response_wms","isempty",""], 
               "AND", 
               ["custrecord_disa_orden_venta.custrecord_disa_item_fulfillment","anyof","@NONE@"],

            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP"                
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP"                
                })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);
       
        for(var i=0;i<results.length;i++)
        {
            var orden={};
            orden.internalid=results[i].getValue({name: 'internalid', summary: "GROUP"});
            orden.tranid=results[i].getValue({name: 'tranid', summary: "GROUP"});
            ordenes.push(orden);
        }
        return ordenes;

    }
    function SearchOVPendienteSurtir()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["quantitycommitted","greaterthan","0"], 
               "AND", 
               ["status","anyof","SalesOrd:B"], 
               "AND", 
               ["location","noneof","211"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","4"],
               "AND", 
               ["mainline","is","F"],
               "AND", 
                ["subsidiary","anyof","2"],
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP"                
                })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);
       
        for(var i=0;i<results.length;i++)
        {
            var orden={};
            orden.internalid=results[i].getValue({name: 'internalid', summary: "GROUP"});
            orden.tranid=results[i].getValue({name: 'tranid', summary: "GROUP"});
            ordenes.push(orden);
        }
        return ordenes;

    }
    function SearchOVPendienteSurtirBackOrder()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:B"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","15"],
               "AND", 
               ["mainline","is","F"],
               "AND", 
                ["subsidiary","anyof","2"],
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "quantitycommitted",
                summary: "SUM",
                label: "Cantidad confirmada"
             }),
             search.createColumn({
                name: "tranid",
                summary: "GROUP"                
              })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {
            var orden={};
            var cantidad=parseInt(results[i].getValue({name: 'quantitycommitted',summary: "SUM"}));
            cantidad = cantidad || 0;
            
            if(cantidad<=0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid', summary: "GROUP"});
                ordenes.push(orden);
            }
        }
        return ordenes;

    }
    function SearchOVFacturadas()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:G"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","6"],
               "AND", 
               ["mainline","is","T"],
               "AND", 
               ["subsidiary","anyof","2"]
            ],
            columns:
            [
               search.createColumn({name: "internalid" }),
               search.createColumn({name: "tranid" })    
                           
            ],
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);
        
        for(var i=0;i<results.length;i++)
        {
            var orden={};
            orden.internalid=results[i].getValue({name: 'internalid'});
            orden.tranid=results[i].getValue({name: 'tranid'});
            ordenes.push(orden);
            
        }
        return ordenes;
    }
    function SearchOVCanceladas()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:C"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","14"],
               "AND", 
               ["mainline","is","T"],
               "AND", 
               ["subsidiary","anyof","2"]
            ],
            columns:
            [
               search.createColumn({name: "internalid"}),
               search.createColumn({name: "tranid" })   
            ],
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {   
            var orden={};         
            orden.internalid=results[i].getValue({name: 'internalid'});
            orden.tranid=results[i].getValue({name: 'tranid'});
            ordenes.push(orden);
           
        }
        return ordenes;

    }
    function SearchOVCerradasCompleta()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:H"], 
               "AND", 
               ["mainline","is","F"],
               "AND", 
               ["subsidiary","anyof","2"],
               "AND", 
               ["custbody_disa_estatus_ov","noneof","13","17"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
             }),
               search.createColumn({
                  name: "quantitybilled",
                  summary: "SUM",
                  label: "Cantidad facturada"
               })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);
               
        for(var i=0;i<results.length;i++)
        {
            
            var orden={};
            var facturada=parseInt(results[i].getValue({name: 'quantitybilled',summary: "SUM",}));
            facturada= facturada || 0;
            
            if(facturada==0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVCerradasParcial()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:H"], 
               "AND", 
               ["mainline","is","F"],
               "AND", 
               ["subsidiary","anyof","2"],
               "AND", 
               ["custbody_disa_estatus_ov","noneof","17","13"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
             }),
               search.createColumn({
                  name: "quantitybilled",
                  summary: "SUM",
                  label: "Cantidad facturada"
               })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0,1000); 
        log.audit('results lenght',results.length);
        log.audit('results',results);
        
        for(var i=0;i<results.length;i++)
        {
            
            var orden={};
            var facturada=parseInt(results[i].getValue({name: 'quantitybilled',summary: "SUM"}));
            facturada= facturada || 0;
            
            if(facturada>0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP"});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP"});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVPendienteFacturar()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:F","SalesOrd:E"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","5"],
               "AND", 
               ["mainline","is","T"],
               "AND", 
               ["subsidiary","anyof","2"]
            ],
            columns:
            [
               search.createColumn({name: "internalid"}),
               search.createColumn({name: "tranid"})
            ],
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {
            var orden={};
            orden.internalid=results[i].getValue({name: 'internalid'});
            orden.tranid=results[i].getValue({name: 'tranid'});
            ordenes.push(orden);
           
        }
        return ordenes;

    }
    function SearchOVParcialSinExistencia()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:D"], 
               "AND", 
               ["mainline","is","F"],
               "AND", 
               ["subsidiary","anyof","2"],
               "AND", 
               ["custbody_disa_estatus_ov","noneof","19"]
               
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
             }),
               search.createColumn({
                  name: "quantitycommitted",
                  summary: "SUM",
                  label: "Cantidad confirmada"
               })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {
            
            var orden={};
            var parcial=parseInt(results[i].getValue({name: 'quantitycommitted',summary: "SUM",}));

            parcial = parcial || 0;
            
            if(parcial==0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVPendienteFacturarParcial()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:D"], 
               "AND", 
               ["mainline","is","F"], 
               "AND", 
               ["subsidiary","anyof","2"],
               "AND", 
               ["custbody_disa_estatus_ov","noneof","20"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
                }),
               search.createColumn({
                  name: "quantityshiprecv",
                  summary: "SUM",
                  label: "Cantidad completada/recibida"
               }),
               search.createColumn({
                  name: "quantitybilled",
                  summary: "SUM",
                  label: "Cantidad facturada"
               })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {            
            var orden={};
            var completada=parseInt(results[i].getValue({name: 'quantityshiprecv',summary: "SUM",}));
            var facturada=parseInt(results[i].getValue({name: 'quantitybilled',summary: "SUM",}));
            
            if(completada>facturada){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVPendienteSurtirWMS()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["mainline","is","T"], 
               "AND", 
               ["status","anyof","SalesOrd:D"], 
               "AND", 
               ["location","anyof","211"], 
               "AND", 
               ["subsidiary","anyof","2"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","23"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
               }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "CASE WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='200' THEN 1 WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='500' THEN 1 ELSE 0 END",
                  label: "Fórmula (numérica)"
               }),
               search.createColumn({
                  name: "custrecord_disa_item_fulfillment",
                  join: "CUSTRECORD_DISA_ORDEN_VENTA",
                  summary: "COUNT",
                  label: "DISA - Item Fulfillment"
               })
            ]
         });
        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       

        for(var i=0;i<results.length;i++)
        {            
            var orden={};            
            var enviado= parseInt(results[i].getValue({ name: "formulanumeric",summary: "SUM",
            formula: "CASE WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='200' THEN 1 WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='500' THEN 1 ELSE 0 END",
            })); //3
            var surtido=parseInt(results[i].getValue({name: "custrecord_disa_item_fulfillment",join: "CUSTRECORD_DISA_ORDEN_VENTA",summary: "COUNT"})); //2
            var interno = results[i].getValue({name: 'internalid',summary: "GROUP"});

            
            //Comprometida

            var mySearch2 = search.create({
                type: "salesorder",
                filters:
                [
                   ["type","anyof","SalesOrd"], 
                   "AND", 
                   ["mainline","is","F"], 
                   "AND", 
                   ["status","anyof","SalesOrd:D"], 
                   "AND", 
                   ["location","anyof","211"], 
                   "AND", 
                   ["subsidiary","anyof","2"], 
                   "AND", 
                   ["custbody_disa_estatus_ov","noneof","23"], 
                   "AND", 
                   ["internalid","anyof",interno]
                ],
                columns:
                [
                   search.createColumn({
                      name: "internalid",
                      summary: "GROUP",
                      label: "ID interno"
                   }),
                   search.createColumn({
                    name: "tranid",
                    summary: "GROUP",
                    label: "TranId"
                }),
                   search.createColumn({
                      name: "quantitycommitted",
                      summary: "SUM",
                      label: "Cantidad confirmada"
                   })
                ]
             });

            var resultSet2 = mySearch2.run();
            var results2 = resultSet2.getRange(0,100);      
            
            
            var comprometida=0;
            

            for(var j=0;j<results2.length;j++)
            {
                comprometida=parseInt(results2[j].getValue({name: 'quantitycommitted',summary: "SUM"}));

                comprometida = comprometida || 0;
            }
            var apoyo={};
            apoyo.enviado=enviado;
            apoyo.surtido=surtido;
            apoyo.comprometida=comprometida;
            

            if(enviado>surtido && comprometida>0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVPendienteSurtirParcial()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["status","anyof","SalesOrd:D"], 
               "AND", 
               ["mainline","is","F"], 
               "AND", 
               ["subsidiary","anyof","2"], 
               "AND", 
               ["location","noneof","211"],
               "AND", 
               ["custbody_disa_estatus_ov","noneof","21"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
                }),
               search.createColumn({
                  name: "quantitycommitted",
                  summary: "SUM",
                  label: "Cantidad confirmada"
               })
            ]
         });

        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       
        for(var i=0;i<results.length;i++)
        {            
            var orden={};
            var comprometida=parseInt(results[i].getValue({name: 'quantitycommitted',summary: "SUM"}));
            comprometida =  comprometida || 0;
            
            
            if(comprometida>0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;

    }
    function SearchOVPendienteEnviarWMSParcial()
    {
        var ordenes=[];
        //Generar las busqueda con las condiciones        
        var mySearch = search.create({
            type: "salesorder",
            filters:
            [
               ["type","anyof","SalesOrd"], 
               "AND", 
               ["mainline","is","T"], 
               "AND", 
               ["status","anyof","SalesOrd:D"], 
               "AND", 
               ["location","anyof","211"], 
               "AND", 
               ["subsidiary","anyof","2"], 
               "AND", 
               ["custbody_disa_estatus_ov","noneof","22"]
            ],
            columns:
            [
               search.createColumn({
                  name: "internalid",
                  summary: "GROUP",
                  label: "ID interno"
               }),
               
               search.createColumn({
                name: "tranid",
                summary: "GROUP",
                label: "TranId"
             }),
               search.createColumn({
                  name: "formulanumeric",
                  summary: "SUM",
                  formula: "CASE WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='200' THEN 1 WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='500' THEN 1 ELSE 0 END",
                  label: "Fórmula (numérica)"
               }),
               search.createColumn({
                  name: "custrecord_disa_item_fulfillment",
                  join: "CUSTRECORD_DISA_ORDEN_VENTA",
                  summary: "COUNT",
                  label: "DISA - Item Fulfillment"
               })
            ]
         });
        var resultSet = mySearch.run();
        var results = resultSet.getRange(0, 1000);        
       

        for(var i=0;i<results.length;i++)
        {            
            var orden={};            
            var enviado= parseInt(results[i].getValue({ name: "formulanumeric",summary: "SUM",
            formula: "CASE WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='200' THEN 1 WHEN {custrecord_disa_orden_venta.custrecord_disa_response_code}='500' THEN 1 ELSE 0 END",
            })); //3
            var surtido=parseInt(results[i].getValue({name: "custrecord_disa_item_fulfillment",join: "CUSTRECORD_DISA_ORDEN_VENTA",summary: "COUNT"})); //2
            var interno = results[i].getValue({name: 'internalid',summary: "GROUP"});

            
            //Comprometida

            var mySearch2 = search.create({
                type: "salesorder",
                filters:
                [
                   ["type","anyof","SalesOrd"], 
                   "AND", 
                   ["mainline","is","F"], 
                   "AND", 
                   ["status","anyof","SalesOrd:D"], 
                   "AND", 
                   ["location","anyof","211"], 
                   "AND", 
                   ["subsidiary","anyof","2"], 
                   "AND", 
                   ["custbody_disa_estatus_ov","noneof","22"], 
                   "AND", 
                   ["internalid","anyof",interno]
                ],
                columns:
                [
                   search.createColumn({
                      name: "internalid",
                      summary: "GROUP",
                      label: "ID interno"
                   }),
                   search.createColumn({
                    name: "tranid",
                    summary: "GROUP",
                    label: "TranId"
                 }),
                   search.createColumn({
                      name: "quantitycommitted",
                      summary: "SUM",
                      label: "Cantidad confirmada"
                   })
                ]
             });

            var resultSet2 = mySearch2.run();
            var results2 = resultSet2.getRange(0,100);      
            
            
            var comprometida=0;
            

            for(var j=0;j<results2.length;j++)
            {
                comprometida=parseInt(results2[j].getValue({name: 'quantitycommitted',summary: "SUM"}));

                comprometida = comprometida || 0;
            }
            var apoyo={};
            apoyo.enviado=enviado;
            apoyo.surtido=surtido;
            apoyo.comprometida=comprometida;
            

            if(enviado==surtido && comprometida>0){
                orden.internalid=results[i].getValue({name: 'internalid',summary: "GROUP",});
                orden.tranid=results[i].getValue({name: 'tranid',summary: "GROUP",});
                ordenes.push(orden);
            }   
           
        }
        return ordenes;
    }


   
     return {
        execute: execute
    }
});