 /**
  *@NApiVersion 2.1
  *@NScriptType Restlet
  */
 define(["N/search"], function (search) {

     function _get(request) {
         try {
             log.audit('request', request);
             var arrayMetodos = [];
             var objMetodos = {};
             var start = 0;
             var end = 999;
             var customrecord_ptg_registrooportunidad_SearchObj = search.create({
                 type: "customrecord_ptg_registrooportunidad_",
                 filters: [
                     ["custrecord_ptg_tipopago_oportunidad_", "anyof", "1", "2", "3", "4", "5", "6"], "AND",
                     ["custrecordptg_numviajeoportunidad_.custrecord_ptg_chofer_tabladeviajes_", "anyof", request.empleado],
                     "AND",
                     ["custrecordptg_numviajeoportunidad_","anyof",request.num_viaje],
                   "AND", 
      ["custrecord_drt_ptg_registro_oportunidad","is","T"]

                 ],
                 columns: [
                     search.createColumn({
                         name: "custrecord_ptg_tipopago_oportunidad_",
                         summary: "GROUP",
                         label: "PTG - Tipo de Pago"
                     }),
                     search.createColumn({
                         name: "custrecord_ptg_oportunidad_",
                         summary: "COUNT",
                         label: "PTG - Oportunidad"
                     }),
                     search.createColumn({
                         name: "custrecord_ptg_total_",
                         summary: "SUM",
                         label: "PTG - Total"
                     })
                 ]
             });
             var searchResultCount = customrecord_ptg_registrooportunidad_SearchObj.run();
             var results = searchResultCount.getRange(start, end);
             for (var i = 0; i < results.length; i++) {
                 var columnas = results[i].columns;
                 var idMetodoPago = results[i].getValue(columnas[0]);
                 var total = results[i].getValue(columnas[1]);
                 var nombreMetodoPago = results[i].getText(columnas[0]);
                 var sumaTotal = results[i].getValue(columnas[2]);
                 objMetodos = {
                     id_metodo_pago: idMetodoPago,
                     nombre_metodo_pago: nombreMetodoPago,
                     total_servicios: total,
                     total_costo: sumaTotal
                 }

                 log.audit('objMetodos', objMetodos)
                 arrayMetodos.push(objMetodos);
             }

             return JSON.stringify(arrayMetodos);

         } catch (error) {
             log.audit('error', error)
         }
     }

     return {
         post: _get
     }
 });