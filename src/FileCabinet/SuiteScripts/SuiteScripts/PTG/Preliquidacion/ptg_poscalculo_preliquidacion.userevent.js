/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
 define(['N/record', 'N/search',
 "SuiteScripts/PTG/Utilities/ptg_core_preliquidacion.module"],
 /**
* @param{record} record
* @param{search} search
*/
 (record, search,module) => {


     /**
      * Defines the function definition that is executed after record is submitted.
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {Record} scriptContext.oldRecord - Old record
      * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
      * @since 2015.2
      */
     const afterSubmit = (scriptContext) => {

         /*
         Registros a afectar :
         Registro custom de linea = preliquidacion 
         Registro de oportunidad = opportunity
         Linea de oportunidad = item
         Registro inicial custom de linea = preliquidacion
         */
         //Contexto registro personalizado
         const context = scriptContext.newRecord;

         const type = scriptContext.type;
         const relRecords = {
             "preliquidacion": {
                 id: "customrecord_ptg_preliq_estacionario_",
                 ventasEstacionario: "recmachcustrecord_ptg_preliqui_rel_vts",
                 lineaVentasEstacionario: "recmachcustrecord_ptg_preliqui_rel_vts_",
             },
             'ventasEstacionario': {
                 id: 'customrecord_ptg_ventas_estacionario',
                 valorZona: "custrecord_ptg_venta_zona_precios",
                 opportunity: "custrecord_ptg_oportunidad_estacionario"

             },
         }

         //Obtener lineas de preliquidacion

         const sublist = relRecords.preliquidacion.lineaVentasEstacionario;
         const sublistLine = context.getLineCount(sublist);
         log.debug('sublistLine', sublistLine);
         const preliquidacion = {};
         for (var i = 0; i < sublistLine; i++) {
             let preliquidacionLine = parseInt(context.getSublistValue({
                 sublistId: sublist,
                 fieldId: "id",
                 line: i
             }));

             let valorZona = context.getSublistValue({
                 sublistId: sublist,
                 fieldId: relRecords.ventasEstacionario.valorZona,
                 line: i
             });


             if (valorZona) {
                 preliquidacion[preliquidacionLine] = {
                     valorZona: valorZona,
                     id:preliquidacionLine
                 };
             }

         }

         //Obterner ids de preliquidacion
         const preliquidacionIds = Object.keys(preliquidacion);
         log.debug('preliquidacionIds', preliquidacionIds);

         log.debug('preliquidacion', preliquidacion);
if(preliquidacionIds.length>0){
         const searchPreliquidacion = search.create({
             type: relRecords.ventasEstacionario.id,
             filters: [{
                 name: 'internalid',
                 operator: 'anyof',
                 values: preliquidacionIds
             }],
             columns: [{
                 name: relRecords.ventasEstacionario.opportunity,
                 sort: search.Sort.ASC
             }]
         });

         searchPreliquidacion.run().each(function (result) {
             const opportunityId = result.getValue({
                 name: relRecords.ventasEstacionario.opportunity
             });
             preliquidacion[result.id].opportunity = opportunityId;
             return true;
         }
         );
         log.debug('preliquidacion', preliquidacion);

         const arrPreliquidacion = Object.keys(preliquidacion).map(function (key) {
             return preliquidacion[key];
         }
         );
         const opportunityList = arrPreliquidacion.map(function (item) {
             return item.opportunity;
         }
         );
         log.debug('opportunityList', opportunityList);
         const valorZonaList = arrPreliquidacion.map(function (item) {
             return item.valorZona;
         }
         );

         log.debug('valorZonaList', valorZonaList);

         //Busqueda donde el nuevo valor zona no es igual al de el registro de oportunidad
         const searchOportunidad = search.create({
             type: "opportunity",
             filters: [{
                 name: "internalid",
                 operator: "anyof",
                 values: opportunityList
             }],
             columns: [{
                 name: "internalid",
                 sort: search.Sort.ASC
             },
             {
                 name: "CUSTBODY_PTG_ZONADEPRECIOOP_",
             },
             search.createColumn({
                 name: "custrecord_ptg_precio_",
                 join: "CUSTBODY_PTG_ZONADEPRECIOOP_",
                 label: "PTG - PRECIO"
              })
             ]
         });

         const zonaPrecios={};
         const searchZona = search.create({
             type: "customrecord_ptg_zonasdeprecio_",
             filters: [{
                 name: "internalid",
                 operator: "anyof",
                 values: valorZonaList
             }],
             columns: [{
                 name: "internalid",
                 sort: search.Sort.ASC
             },
             {
                 name: "custrecord_ptg_precio_",
                 sort: search.Sort.ASC
             }
             ]
         });
         searchZona.run().each(function (result) {
             zonaPrecios[result.id] = result.getValue({
                 name: "custrecord_ptg_precio_"
             });
             return true;
         }
         );
         log.debug('zonaPrecios', zonaPrecios);

         var filteredOpp = {}
         searchOportunidad.run().each(function (result) {

             const opportunityId = result.id;
             const valorZona = result.getValue({
                 name: "CUSTBODY_PTG_ZONADEPRECIOOP_"
             });

             var index = opportunityList.indexOf(opportunityId);
             
             log.debug('valorZona'+opportunityId, valorZona);
             log.debug('valorZonaList[index]'+opportunityId, valorZonaList[index]);

             if (valorZona != valorZonaList[index]) {

                 filteredOpp[opportunityId] = {
                     valorZona: valorZonaList[index],
                     precio:  zonaPrecios[valorZonaList[index]],
                     preliquidacion:arrPreliquidacion[index].id
                 }
             }
             return true;
         }
         );
         log.audit('filteredOpp1', filteredOpp);

         var updated= module.evaluarOportunidad({ oportunidades :filteredOpp ,recordType:"ventasEstacionario"});
         log.audit('updated', updated);


         /*
         
         {"414629":{"valorZona":"214","precio":"800","preliquidacion":349,"total":"27840.00","taxTotal":3840,"totalItem":"24000.00"}}	
         */
        for(var i in updated){
              var item = updated[i];
             var idRecPreliquida= item.preliquidacion;
             var precio = item.precio;
             var total = item.total;
             var taxTotal = item.taxTotal;
             var totalItem = item.totalItem;

             log.debug('idRecPreliquida', idRecPreliquida);
             log.debug('precio', precio);
             log.debug('total', total);
             log.debug('taxTotal', taxTotal);

            



          
             var recVenta= record.submitFields({
                 type: relRecords.ventasEstacionario.id,
                 id: idRecPreliquida,
                 values: {
                     custrecord_ptg_importe_est_vts_: totalItem,
                     custrecord_ptg_precio_est_vts_: precio,
                     custrecord_ptg_total_est_vts_: total ,
                     custrecord_ptg_impuesto_est_vts_: taxTotal
                 },
                 options: {
                     enableSourcing: false,
                     ignoreMandatoryFields : true
                 }
             });

         }
     }
    }

//METODO PARA EVALUAR OPPORTUNIDAD
    


     return {  afterSubmit }

 });
