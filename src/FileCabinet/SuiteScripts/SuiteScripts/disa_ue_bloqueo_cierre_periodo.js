/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
 define(['N/record', 'N/search', 'N/error','N/query','N/ui/dialog'],
 function(record, search, error, query, dialog) {
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
             var result=false;
             if (scriptContext.type == scriptContext.UserEventType.EDIT) {
                log.audit('scriptContext.type',scriptContext.type);
                //Obtiene Registro Anterior y Nuevo para comparar
                 var oldRec = scriptContext.oldRecord;
                 var newRec = scriptContext.newRecord;
                //Obtiene Id del registro y el tipo
                 var recId = newRec.id;
                 var recType = newRec.type;
                 //Obtiene el tipo de transacción y posting Period
                 var tranType = parseInt(newRec.getValue('ntype'));
                 var postingPeriodNew = newRec.getValue('postingperiod') || '0';
                 //var postingPeriod2 = oldRec.getValue('postingperiod');
                 var postingPeriodOld = "";

                    var sql =
                    "SELECT " +
                    "  postingperiod" +
                    " FROM " +
                    "  transaction " +
                    " WHERE " +
                    "  id="+recId;
                    var resultIterator = query.runSuiteQLPaged({
                        query: sql,
                        pageSize: 10
                    }).iterator();
                    resultIterator.each(function(page) {
                        var pageIterator = page.value.data.iterator();
                        pageIterator.each(function(row) {
                            postingPeriodOld = row.value.getValue(0);
                            return true;
                        });
                        return true;
                    });

				 
                 log.audit('postingPeriodOld', postingPeriodOld);
                 log.audit('postingPeriodNew', postingPeriodNew);
                 var subsidiary    = parseInt(newRec.getValue('subsidiary'));
                 var idFieldFilter = '';
                 
                 var bloquearEdicion = false;
                 
                 log.audit('tranType', tranType);
                 
                 switch (tranType) {
                     case 1://Journal 
                         idFieldFilter = "custrecord_drt_asiento_contable";
                         bloquearEdicion = revisarCambiosJournal(oldRec, newRec);
                         break;
                     case 5://Cash Sale  
                         idFieldFilter = "custrecord_drt_venta_efectivo";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 7://Invoice  
                         idFieldFilter = "custrecord_drt_factura_venta";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 9://Payment  /Customer payment
                         idFieldFilter = "custrecord_drt_pago_cliente";
                         bloquearEdicion = revisarCambiosCustPay(oldRec, newRec);
                         break;
                     case 10://Credit Memo  
                         idFieldFilter = "custrecord_drt_nota_credito";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 11://Inventory Adjustment 
                         idFieldFilter = "custrecord_drt_ajuste_inventario";
                         bloquearEdicion = revisarCambiosAjusteInv(oldRec, newRec);
                         break;
                     case 12://Inventory Transfer 
                         idFieldFilter = "custrecord_drt_traslado_inventario";
                         bloquearEdicion = revisarCambiosAjusteInv(oldRec, newRec);
                         break;
                     case 15://Purchase Order  
                         idFieldFilter = "custrecord_drt_orden_compra";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 16://Item Receipt
                         idFieldFilter = "custrecord_drt_recepcion_articulo";
                         bloquearEdicion = revisarCambiosOrdTransf(oldRec, newRec);
                         break;
                     case 17://Bill  /vendor Bill
                         idFieldFilter = "custrecord_drt_factura_proveedor";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 18://Bill Payment  / Vendor Payment
                         idFieldFilter = "custrecord_drt_pago_proveedor";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 20://Bill Credit / Vendor Credit 
                         idFieldFilter = "custrecord_drt_credito_provedor";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;				
                     case 31://Sales Order  
                         idFieldFilter = "custrecord_drt_orden_venta";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 33://Return Authorization  
                         idFieldFilter = "custrecord_drt_autorizacion_devolucion";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 43://Vendor Return Authorization  
                         idFieldFilter = "custrecord_drt_autorizacion_devolucion_p";
                         bloquearEdicion = revisarCambiosFactura(oldRec, newRec);
                         break;
                     case 48://Transfer Order / Orden de traslado
                         idFieldFilter = "custrecord_drt_orden_traslado";
                         bloquearEdicion = revisarCambiosOrdTransf(oldRec, newRec);
                         break;
                     // case 1://ASIENTO CONTABLE ENTRE EMPRESAS AVANZADO  (El mismmo que asiento contable)
                         //idFieldFilter = "custrecord_drt_asiento_contable";
                         // break;
                     case 79://Pago anticipado proveedor  
                         idFieldFilter = "custrecord_drt_pago_anticipado_proveedor";
                         bloquearEdicion = revisarCambiosVendPP(oldRec, newRec);
                         break;
                 }
                 
                 log.audit('tranType', tranType);
                 log.audit('idFieldFilter', idFieldFilter);
                 log.audit('bloquearEdicion', bloquearEdicion);
                 
                 if(idFieldFilter && bloquearEdicion){
                     var configBloqueoSearchObj = search.create({
                         type: 'customrecord_drt_configuracion_cierre_p',
                         filters: [
                             [idFieldFilter,"is","T"], 
                             "AND", 
                             ["custrecord_drt_periodo_a_cerrar","anyof", postingPeriodOld, postingPeriodNew],
                             "AND", 
                             ["custrecord_drt_subsidiaria_2","anyof",subsidiary]
                         ],
                         columns:
                         [
                             search.createColumn({
                                 name: "scriptid",
                                 sort: search.Sort.ASC,
                                 label: "ID de script"
                             }),
                             search.createColumn({name: "custrecord_drt_periodo_a_cerrar", label: "Periodos"})
                         ]
                     });
                     var configBloqueoSrchResults = configBloqueoSearchObj.run().getRange({
                         start: 0,
                         end: 1000
                     });
                     if(configBloqueoSrchResults.length > 0){
                        log.audit('configBloqueoSrchResults', configBloqueoSrchResults);
                        newRec.setValue('custbody_drt_transaccion_bloqueada',true);
                        var options = {
                            title: "Periodo Bloqueado",
                            message: "No puede editar este tipo de transacción para el periodo seleccionado."
                       };
                       dialog.alert(options); 
                        var myCustomError = error.create({
                            name: error.Type.THAT_RECORD_IS_NOT_EDITABLE,
                             message: 'No puede editar este tipo de transacción para el periodo seleccionado.',
                             notifyOff: false
                        });
                        log.debug(myCustomError.name , myCustomError.message);
                        result=false;
                        //throw myCustomError;
                     }else{
                         result=true;
                     }
                 }else{
                     result=true;
                 }
             } else if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.DELETE ) {
                log.audit('scriptContext.type',scriptContext.type);
                //Obtiene el nuevo registro
                var newRec = scriptContext.newRecord;
                //Obtiene id y tipo de registro
                var recId = newRec.id;
                var recType = newRec.type;
                log.audit("tranDate0:",newRec.getValue('trandate').toISOString());
                var tranDate = newRec.getValue('trandate').toISOString().substring(0,10);
                log.audit("tranDate1:",tranDate);
                var temptranDate = tranDate.split("-");
                tranDate = temptranDate[2]+"/"+temptranDate[1]+"/"+temptranDate[0];
                log.audit("tranDate2:",tranDate);
                var tranType = parseInt(newRec.getValue('ntype'));
                //var postingPeriodNew = newRec.getValue    ('postingperiod') || '0';
                var postingPeriodNew = 0;

                var sql = "select id from accountingperiod where isposting='T' and '"+tranDate+"' >= startdate and '"+tranDate+"'<= enddate";
                log.audit("Create sql:",sql);
                var resultIterator = query.runSuiteQLPaged({
                    query: sql,
                    pageSize: 10
                }).iterator();
                resultIterator.each(function(page) {
                    var pageIterator = page.value.data.iterator();
                    pageIterator.each(function(row) {
                        postingPeriodNew = row.value.getValue(0);
                        return true;
                    });
                    return true;
                });

                //var postingPeriod2 = oldRec.getValue('postingperiod');
                log.audit('postingPeriodNew', postingPeriodNew);
                var subsidiary    = parseInt(newRec.getValue('subsidiary'));
                var idFieldFilter = '';
                var bloquearEdicion = false;
                
                log.audit('tranType', tranType);
                
                switch (tranType) {
                    case 1://Journal 
                        idFieldFilter = "custrecord_drt_asiento_contable";
                        //bloquearEdicion = revisarCambiosJournal('', newRec);
                        break;
                    case 5://Cash Sale  
                        idFieldFilter = "custrecord_drt_venta_efectivo";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 7://Invoice  
                        idFieldFilter = "custrecord_drt_factura_venta";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 9://Payment  /Customer payment
                        idFieldFilter = "custrecord_drt_pago_cliente";
                        //bloquearEdicion = revisarCambiosCustPay('', newRec);
                        break;
                    case 10://Credit Memo  
                        idFieldFilter = "custrecord_drt_nota_credito";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 11://Inventory Adjustment 
                        idFieldFilter = "custrecord_drt_ajuste_inventario";
                        //bloquearEdicion = revisarCambiosAjusteInv('', newRec);
                        break;
                    case 12://Inventory Transfer 
                        idFieldFilter = "custrecord_drt_traslado_inventario";
                        //bloquearEdicion = revisarCambiosAjusteInv('', newRec);
                        break;
                    case 15://Purchase Order  
                        idFieldFilter = "custrecord_drt_orden_compra";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 16://Item Receipt
                        idFieldFilter = "custrecord_drt_recepcion_articulo";
                        //bloquearEdicion = revisarCambiosOrdTransf('', newRec);
                        break;
                    case 17://Bill  /vendor Bill
                        idFieldFilter = "custrecord_drt_factura_proveedor";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 18://Bill Payment  / Vendor Payment
                        idFieldFilter = "custrecord_drt_pago_proveedor";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 20://Bill Credit / Vendor Credit 
                        idFieldFilter = "custrecord_drt_credito_provedor";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;				
                    case 31://Sales Order  
                        idFieldFilter = "custrecord_drt_orden_venta";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 33://Return Authorization  
                        idFieldFilter = "custrecord_drt_autorizacion_devolucion";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 43://Vendor Return Authorization  
                        idFieldFilter = "custrecord_drt_autorizacion_devolucion_p";
                        //bloquearEdicion = revisarCambiosFactura('', newRec);
                        break;
                    case 48://Transfer Order / Orden de traslado
                        idFieldFilter = "custrecord_drt_orden_traslado";
                        //bloquearEdicion = revisarCambiosOrdTransf('', newRec);
                        break;
                    // case 1://ASIENTO CONTABLE ENTRE EMPRESAS AVANZADO  (El mismmo que asiento contable)
                        //idFieldFilter = "custrecord_drt_asiento_contable";
                        // break;
                    case 79://Pago anticipado proveedor  
                        idFieldFilter = "custrecord_drt_pago_anticipado_proveedor";
                        //bloquearEdicion = revisarCambiosVendPP('', newRec);
                        break;
                }
                log.audit('tranType', tranType);
                log.audit('idFieldFilter', idFieldFilter);
                log.audit('bloquearEdicion', bloquearEdicion);
                
                //if(idFieldFilter && bloquearEdicion){
                if(idFieldFilter){
                    var configBloqueoSearchObj = search.create({
                        type: 'customrecord_drt_configuracion_cierre_p',
                        filters: [
                            [idFieldFilter,"is","T"], 
                            "AND", 
                            ["custrecord_drt_periodo_a_cerrar","anyof", postingPeriodNew],
                            "AND", 
                            ["custrecord_drt_subsidiaria_2","anyof",subsidiary]
                        ],
                        columns:
                        [
                            search.createColumn({
                                name: "scriptid",
                                sort: search.Sort.ASC,
                                label: "ID de script"
                            }),
                            search.createColumn({name: "custrecord_drt_periodo_a_cerrar", label: "Periodos"})
                        ]
                    });
                    log.audit('configBloqueoSearchObj',configBloqueoSearchObj);
                    var configBloqueoSrchResults = configBloqueoSearchObj.run().getRange({
                        start: 0,
                        end: 1000
                    });
                    log.audit('configBloqueoSrchResults',configBloqueoSrchResults);
                    if(configBloqueoSrchResults.length > 0){
                        newRec.setValue('custbody_drt_transaccion_bloqueada',true);
                        var options = {
                            title: "Periodo Bloqueado",
                            message: "No puede crear este tipo de transacción para el periodo seleccionado."
                        };          
                        //error.Type.THAT_RECORD_IS_NOT_EDITABLE         
                        dialog.alert(options);
                        var myCustomError = error.create({
                             name: error.Type.THAT_RECORD_IS_NOT_EDITABLE,
                             message: 'No puede crear este tipo de transacción para el periodo seleccionado.',
                             notifyOff: false
                         });
                         log.error(myCustomError.name , myCustomError.message);
                         result=false;
                    }else{
                        log.audit("Bloqueo?", "No Encontró Bloqueo");
                        result=true;
                    }
                }else{
                    log.audit("Bloqueo?", "No es Transacción Bloqueo");
                    result=true;
                }
            }
            return result;
         } catch (error) {
             log.error({ title: 'error beforeSubmit', details: JSON.stringify(error) });
         } finally{
            if (result){
                return result;
            } else {
                throw myCustomError;
            }
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

     function beforeLoad(scriptContext) {
        try {
             var currentRecord = scriptContext.newRecord;
             log.audit('currentRecord',currentRecord);
             var tranType 	  = parseInt(currentRecord.getValue('ntype'));
             var postingPeriod = currentRecord.getValue('postingperiod');
             var trandate = currentRecord.getValue('trandate');
             if(!postingPeriod){
                postingPeriod=getPostingPeriod(trandate);
             }
             var subsidiary    = parseInt(currentRecord.getValue('subsidiary'));
             var idFieldFilter = '';
             
             switch (tranType) {
                 case 1://Journal 
                     idFieldFilter = "custrecord_drt_asiento_contable";
                     break;
                 case 5://Cash Sale  
                     idFieldFilter = "custrecord_drt_venta_efectivo";
                     break;
                 case 7://Invoice  
                     idFieldFilter = "custrecord_drt_factura_venta";
                     break;
                 case 9://Payment  /Customer payment
                     idFieldFilter = "custrecord_drt_pago_cliente";
                     break;
                 case 10://Credit Memo  
                     idFieldFilter = "custrecord_drt_nota_credito";
                     break;
                 case 11://Inventory Adjustment 
                     idFieldFilter = "custrecord_drt_ajuste_inventario";
                     break;
                 case 12://Inventory Transfer  
                     idFieldFilter = "custrecord_drt_traslado_inventario";
                     break;
                 case 15://Purchase Order  
                     idFieldFilter = "custrecord_drt_orden_compra";
                     break;
                 case 16://Item Receipt  
                     idFieldFilter = "custrecord_drt_recepcion_articulo";
                     break;
                 case 17://Bill  /vendor Bill
                     idFieldFilter = "custrecord_drt_factura_proveedor";
                     break;
                 case 18://Bill Payment  / Vendor Payment
                     idFieldFilter = "custrecord_drt_pago_proveedor";
                     break;
                 case 20://Bill Credit / Vendor Credit 
                     idFieldFilter = "custrecord_drt_credito_provedor";
                     break;				
                 case 31://Sales Order  
                     idFieldFilter = "custrecord_drt_orden_venta";
                     break;
                 case 33://Return Authorization  
                     idFieldFilter = "custrecord_drt_autorizacion_devolucion";
                     break;
                 case 43://Vendor Return Authorization  
                     idFieldFilter = "custrecord_drt_autorizacion_devolucion_p";
                     break;
                 case 48://Transfer Order / Orden de traslado
                     idFieldFilter = "custrecord_drt_orden_traslado";
                     break;
                 // case 1://ASIENTO CONTABLE ENTRE EMPRESAS AVANZADO  (El mismmo que asiento contable)
                     //idFieldFilter = "custrecord_drt_asiento_contable";
                     // break;
                 case 79://Pago anticipado proveedor  
                     idFieldFilter = "custrecord_drt_pago_anticipado_proveedor";
                     break;
             }
             if(idFieldFilter){
                 var configBloqueoSearchObj = search.create({
                     type: 'customrecord_drt_configuracion_cierre_p',
                     filters: [
                         [idFieldFilter,"is","T"], 
                         "AND", 
                         ["custrecord_drt_periodo_a_cerrar","anyof",postingPeriod],
                         "AND", 
                         ["custrecord_drt_subsidiaria_2","anyof",subsidiary]
                     ],
                     columns:
                     [
                         search.createColumn({
                             name: "scriptid",
                             sort: search.Sort.ASC,
                             label: "ID de script"
                         }),
                         search.createColumn({name: "custrecord_drt_periodo_a_cerrar", label: "Periodos"})
                     ]
                 });
                 var configBloqueoSrchResults = configBloqueoSearchObj.run().getRange({
                     start : 0,
                     end   : 9
                 });
                 if(configBloqueoSrchResults.length > 0){
                    if(scriptContext.type == 'view' || scriptContext.type == 'edit'){
                        var yourForm = scriptContext.form;
                        yourForm.removeButton('void');
                        yourForm.removeButton('delete');
                    }
                 };
                 return true;
             }else{
                return true;
             }
         }
         catch(error){
             log.error('Error BeforeLoad', error);
         }
         
    }
     
     function revisarCambiosJournal(oldRec, newRec) {
         var subsOld = oldRec.getValue('subsidiary');
         var subsNew = newRec.getValue('subsidiary');
         var lineOld = oldRec.getLineCount('line');
         var lineNew = newRec.getLineCount('line');
         
         if(subsOld != subsNew || lineOld != lineNew){
             return true;
         }else{
             var impDebOld  = 0;
             var impCredNew = 0;
             var impDebNew  = 0;
             var impCredOld = 0;
             
             for (var i = 0; i <= lineOld; i++){
                 impDebOld += parseFloat(oldRec.getSublistValue('line', 'debit',i)) || 0;
                 impCredOld += parseFloat(oldRec.getSublistValue('line', 'credit',i)) || 0;
                 
                 var accOld = oldRec.getSublistValue('line', 'account',i)||'';
                 var accNew = newRec.getSublistValue('line', 'account',i)||'';
                 var deptoOld = oldRec.getSublistValue('line', 'department',i)||'';
                 var deptoNew = newRec.getSublistValue('line', 'department',i)||'';
                 var claseOld = oldRec.getSublistValue('line', 'class',i)||'';
                 var claseNew = newRec.getSublistValue('line', 'class',i)||'';
                 var ubicOld = oldRec.getSublistValue('line', 'location',i)||'';
                 var ubicNew = newRec.getSublistValue('line', 'location',i)||'';
                 if(accOld != accNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew){
                     return true;
                 }
             }
             for (var j = 0; j <= lineNew; j++){
                 impDebNew += parseFloat(newRec.getSublistValue('line', 'debit',j)) || 0;
                 impCredNew += parseFloat(newRec.getSublistValue('line', 'credit',j)) || 0;
             }
             log.audit('impDebOld', impDebOld);
             log.audit('impCredNew', impCredNew);
             log.audit('impDebNew', impDebNew);
             log.audit('impCredOld', impCredOld);
             var valDate =  revisarFechas(oldRec, newRec);
             if(impDebOld != impDebNew || impCredOld != impCredNew || valDate ){
                 return true;
             }else{
                 return false;
             }			
         }
     }

     function getPostingPeriod(trandate){ 
        var postingPeriod=0;
        var trandate1 = new Date(trandate);
        log.audit('trandate1',trandate1);
        var dateMonth = trandate1.getMonth()+1;if(dateMonth<10){dateMonth="0"+dateMonth;}
        var dateYear = trandate1.getFullYear();
        var dateDay = trandate1.getDate();if(dateDay<10){dateDay="0"+dateDay;}
        var myDate = dateDay +'-' + dateMonth + '-' + dateYear;
        log.audit('myDate',myDate);

        var sql =
                "SELECT " +
                "id" +
                " FROM " +
                "  accountingPeriod " +
                " WHERE isposting='T' and isquarter='F' and " +
                "TO_DATE('"+myDate+"', 'DD-MM-YYYY')>=startdate and TO_DATE('"+myDate+"', 'DD-MM-YYYY')<=enddate";
                var resultIterator = query.runSuiteQLPaged({
                    query: sql,
                    pageSize: 10
                }).iterator();
                resultIterator.each(function(page) {
                    var pageIterator = page.value.data.iterator();
                    pageIterator.each(function(row) {
                        postingPeriod = row.value.getValue(0);
                        return true;
                    });
                    return true;
                });
        return postingPeriod;
    }
     
     function revisarCambiosAjusteInv(oldRec, newRec) {
         
         var subsOld = oldRec.getValue('subsidiary');
         var deptoOld = oldRec.getValue('department');
         var claseOld = oldRec.getValue('class');
         var ubicOld = oldRec.getValue('location');
         var transferLocOld = oldRec.getValue('transferlocation');
         
         var subsNew = newRec.getValue('subsidiary');
         var deptoNew = newRec.getValue('department');
         var claseNew = newRec.getValue('class');
         var ubicNew = newRec.getValue('location');
         var transferLocNew = newRec.getValue('transferlocation');
         
         var lineOld = oldRec.getLineCount('inventory');
         var lineNew = newRec.getLineCount('inventory');

         var valDate =  revisarFechas(oldRec, newRec);
         
         if(subsOld != subsNew || lineOld != lineNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew || transferLocOld != transferLocNew || valDate){
             return true;
         }else{
             
             for (var i = 0; i <= lineOld; i++){
                 
                 var artOld  = oldRec.getSublistValue('inventory', 'item',i)||'';
                 var cantOld = parseFloat(oldRec.getSublistValue('inventory', 'adjustqtyby',i)) || 0;
                 var ubicLineOld  = oldRec.getSublistValue('inventory', 'location',i)||'';
                 var dptoLineOld = oldRec.getSublistValue('inventory', 'department',i)||'';
                 var classLineOld = oldRec.getSublistValue('inventory', 'class',i)||'';
                 
                 var artNew  = newRec.getSublistValue('inventory', 'item',i)||'';
                 var cantNew = parseFloat(newRec.getSublistValue('inventory', 'adjustqtyby',i)) || 0;
                 var ubicLineNew  = newRec.getSublistValue('inventory', 'location',i)||'';
                 var dptoLineNew = newRec.getSublistValue('inventory', 'department',i)||'';
                 var classLineNew = newRec.getSublistValue('inventory', 'class',i)||'';
                 
                 if(artOld != artNew || cantOld != cantNew || ubicLineOld != ubicLineNew || dptoLineOld != dptoLineNew || classLineOld != classLineNew){
                     return true;
                 }
             }
         }
         return false;	
     }
     
     function revisarCambiosOrdTransf(oldRec, newRec) {
         
         var subsOld = oldRec.getValue('subsidiary');
         var deptoOld = oldRec.getValue('department');
         var claseOld = oldRec.getValue('class');
         var ubicOld = oldRec.getValue('location');
         var transferLocOld = oldRec.getValue('transferlocation');
         
         var subsNew = newRec.getValue('subsidiary');
         var deptoNew = newRec.getValue('department');
         var claseNew = newRec.getValue('class');
         var ubicNew = newRec.getValue('location');
         var transferLocNew = newRec.getValue('transferlocation');
         
         var lineOld = oldRec.getLineCount('item');
         var lineNew = newRec.getLineCount('item');

         var valDate =  revisarFechas(oldRec, newRec);
         
         
         if(subsOld != subsNew || lineOld != lineNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew || transferLocOld != transferLocNew || valDate){
             return true;
         }else{
             
             for (var i = 0; i <= lineOld; i++){
                 
                 var artOld  = oldRec.getSublistValue('item', 'item',i)||'';
                 var cantOld = parseFloat(oldRec.getSublistValue('item', 'quantity',i)) || 0;
                 var ubicLineOld  = oldRec.getSublistValue('item', 'location',i)||'';
                 var dptoLineOld = oldRec.getSublistValue('item', 'department',i)||'';
                 var classLineOld = oldRec.getSublistValue('item', 'class',i)||'';
                 
                 var artNew  = newRec.getSublistValue('item', 'item',i)||'';
                 var cantNew = parseFloat(newRec.getSublistValue('item', 'quantity',i)) || 0;
                 var ubicLineNew  = newRec.getSublistValue('item', 'location',i)||'';
                 var dptoLineNew = newRec.getSublistValue('item', 'department',i)||'';
                 var classLineNew = newRec.getSublistValue('item', 'class',i)||'';
                 
                 if(artOld != artNew || cantOld != cantNew || ubicLineOld != ubicLineNew || dptoLineOld != dptoLineNew || classLineOld != classLineNew){
                     return true;
                 }
             }
         }
         return false;	
     }
     
     function revisarCambiosFactura(oldRec, newRec) {
         
         var entidadOld = oldRec.getValue('entity');
         var subsOld = oldRec.getValue('subsidiary');
         var deptoOld = oldRec.getValue('department')||'';
         var claseOld = oldRec.getValue('class')||'';
         var ubicOld = oldRec.getValue('location')||'';
         var cuentaOld = oldRec.getValue('account')||'';
         var importeOld = oldRec.getValue('total');     
         
         var entidadNew = newRec.getValue('entity');
         var subsNew = newRec.getValue('subsidiary');
         var deptoNew = newRec.getValue('department')||'';
         var claseNew = newRec.getValue('class')||'';
         var ubicNew = newRec.getValue('location')||'';
         var cuentaNew = newRec.getValue('account')||'';
         var importeNew = newRec.getValue('total');

         var valLines =  revisarLineas(oldRec, newRec);
         var valDate =  revisarFechas(oldRec, newRec);

         log.audit('entidadOld != entidadNew:', entidadOld != entidadNew);
         log.audit('subsOld != subsNew:', subsOld != subsNew);
         log.audit('deptoOld != deptoNew:', deptoOld != deptoNew);
         log.audit('claseOld != claseNew:', claseOld != claseNew);
         log.audit('ubicOld != ubicNew:', ubicOld != ubicNew);
         log.audit('cuentaOld != cuentaNew:', cuentaOld != cuentaNew);
         log.audit('importeOld != importeNew:', importeOld != importeNew);

         log.audit('valDate:', valDate);
         log.audit('valLines:', valLines);
         
         if(entidadOld != entidadNew || subsOld != subsNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew || cuentaOld != cuentaNew || importeOld != importeNew || valLines || valDate ) {
             return true;
         } else {
             return false;
         }
         // if(entidadOld != entidadNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar la Entidad de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(subsOld != subsNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar la Subsidiaria de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(deptoOld != deptoNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar el Departamento de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(claseOld != claseNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar la Clase de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(ubicOld != ubicNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar la Entidad de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(cuentaOld != cuentaNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar la Cuenta de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
         // if(importeOld != importeNew){
             // var options = {
                 // title: "Periodo Bloqueado",
                 // message: "No puede editar el Importe de este tipo de transacción para el periodo seleccionado."
             // };    		 
             // dialog.alert(options);
             // return false;
         // }
     }
     
     function revisarCambiosVendPP(oldRec, newRec) {
         var entidadOld = oldRec.getValue('entity');
         var subsOld = oldRec.getValue('subsidiary');
         var deptoOld = oldRec.getValue('department')||'';
         var claseOld = oldRec.getValue('class')||'';
         var ubicOld = oldRec.getValue('location')||'';
         var cuentaOld = oldRec.getValue('account')||'';
         var importeOld = oldRec.getValue('payment');
         
         var entidadNew = newRec.getValue('entity');
         var subsNew = newRec.getValue('subsidiary');
         var deptoNew = newRec.getValue('department')||'';
         var claseNew = newRec.getValue('class')||'';
         var ubicNew = newRec.getValue('location')||'';
         var cuentaNew = newRec.getValue('account')||'';
         var importeNew = newRec.getValue('payment');

         var valDate =  revisarFechas(oldRec, newRec);
         
         if(entidadOld != entidadNew || subsOld != subsNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew || cuentaOld != cuentaNew || importeOld != importeNew || valDate){
             return true;
         }else{
             return false;
         }	
     }
     
     function revisarCambiosCustPay(oldRec, newRec) {
         var entidadOld = oldRec.getValue('customer');
         var subsOld = oldRec.getValue('subsidiary');
         var deptoOld = oldRec.getValue('department')||'';
         var claseOld = oldRec.getValue('class')||'';
         var ubicOld = oldRec.getValue('location')||'';
         var cuentaOld = oldRec.getValue('account')||'';
         var importeOld = oldRec.getValue('total');
         
         var entidadNew = newRec.getValue('customer');
         var subsNew = newRec.getValue('subsidiary');
         var deptoNew = newRec.getValue('department')||'';
         var claseNew = newRec.getValue('class')||'';
         var ubicNew = newRec.getValue('location')||'';
         var cuentaNew = newRec.getValue('account')||'';
         var importeNew = newRec.getValue('total');

         var valDate =  revisarFechas(oldRec, newRec);
         
         if(entidadOld != entidadNew || subsOld != subsNew || deptoOld != deptoNew || claseOld != claseNew || ubicOld != ubicNew || cuentaOld != cuentaNew || importeOld != importeNew || valDate){
             return true;
         }else{
             return false;
         }	
     }

     function revisarLineas(oldRec, newRec) {

        var valLines=false;
        var lineasOld = oldRec.getLineCount({
            sublistId: 'item'
        }) || 0;
        var lineasNew = newRec.getLineCount({
            sublistId: 'item'
        }) || 0;

        if(lineasOld === lineasNew){
            for (var i = 0; i < lineasOld; i++) {
                var qtyOld = oldRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                });

                var priceOld = oldRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    line: i
                });

                var qtyNew = newRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                });

                var priceNew = newRec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    line: i
                });

                if ( qtyNew != qtyOld || priceNew != priceOld ) {
                    valLines=true;
                    break;
                }
            }
        }else{
            valLines = true;
        }
        log.audit('ResultRevisarLíneas:', valLines);
        return valLines;
    }

    function revisarFechas(oldRec, newRec){ 
        var valDate = false; 
        var dateOld = oldRec.getValue('trandate');
        var dateNew = newRec.getValue('trandate');
        var dateMonthOld = dateOld.getMonth();
        var dateMonthNew = dateNew.getMonth();
        log.audit('dateMonthOld:',dateMonthOld);
        log.audit('dateMonthNew:',dateMonthNew);
        if(dateMonthOld != dateMonthNew){
            valDate = true; 
        }
        log.audit('ResultRevisarFechas:', valDate);
        return valDate;
    }
     
     return {
         beforeSubmit: beforeSubmit,
         beforeLoad: beforeLoad
         //afterSubmit: afterSubmit
     };
     
 });
 