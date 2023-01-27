		/**
		 * Author      : Arturo Duran Moreno
		 * Language    : javascript
		 * Date        : 9may22
		 */
		/**
		 * @NApiVersion 2.1
		 * @NScriptType Suitelet
		 */
		 define(['N/ui/serverWidget', 'N/runtime', 'N/error', 'N/format', 'N/url', 'N/redirect', 'N/ui/message','N/query', 'N/record','N/search'],

		 function( ui, runtime, error, format, url, redirect, message, query, record, search) {

			 function createForm (context) {
				 let scriptParams = context.request.parameters;
				 let locations = '3, 305, 306, 312, 307, 410, 423, 524, 509, 311, 313, 434, 315';
				 let locations2 = '3, 305, 306, 312, 307, 410, 423, 524, 509, 311, 313, 434, 315';
				 log.debug('locations2',locations2);
                 log.debug('locations2',locations2);
               	 let form    = ui.createForm({
					 title: "Top 10 de Cartera Vencida"
				 });

               	 log.debug('scriptParams',scriptParams);
				 if (scriptParams.custpage_sk_list_locationId){
					locations2 = scriptParams.custpage_sk_list_locationId
				 }else{
					locations2 = locations
				 }
               
               	log.debug('locations2',locations2);

				 var params = {
					custpage_disa_as_date_of : scriptParams.custpage_sk_as_date_of || '',
					custpage_disa_sublist_query_result : scriptParams.custpage_sk_sublist_query_result,
					reload : scriptParams.reload,
                    custpage_disa_list_locationId : locations2
				 };

				

				 log.debug('params',params);

				 //Asigno un script de cliente
				 //form.clientScriptFileId = 166074;
				 form.clientScriptFileId = 229023;
				 
				 // campos principales
				 // Fecha AS of Date
				 var field = form.addField({
					 id: 'custpage_disa_as_date_of', type: ui.FieldType.DATE, label: "Fecha: "
				 });
				 field.setHelpText({help: "Fecha de Cartera"});
				 field.updateDisplaySize({height : 60, width: 60});
				 if(params.custpage_disa_as_date_of != ''){
					 field.defaultValue = params.custpage_disa_as_date_of;
				 }else{
					 var date = new Date();
					 field.defaultValue = date;
				 }
               
               	 var field = form.addField({
					 id: 'custpage_disa_as_date_of2', type: ui.FieldType.DATE, label: "Fecha: "
				 });
               	 field.updateDisplayType({displayType : ui.FieldDisplayType.HIDDEN});
               
				  // Ubicación
				field = form.addField({
					 id: 'custpage_disa_list_location', type: ui.FieldType.MULTISELECT, label: "Almacén"
				});
				 field.setHelpText({help: "Almacén del cual se quiere obtener el top"});
				 //field.updateDisplaySize({height : 60, width: 60});
				 field.addSelectOption({value: 0, text: '---- TODOS LOS ALMACENES ----'});
				 var getlocations = getLocations(locations);
				 if ( getlocations && getlocations.length > 0 ) {
					 for ( var j = 0; j < getlocations.length; j++ ) {
						 var values = getlocations[j];
						 //log.debug('custpage_disa_list_locationId', params.custpage_disa_list_locationId);
						 field.addSelectOption({value: values.value, text: values.text});
						 if(params.custpage_disa_list_locationId.length > 0){
							log.debug('values.value', values.value);
							field.defaultValue = params.custpage_disa_list_locationId;
						 }else{
							field.defaultValue = 0;
						 }
					 }
				 }

				 // Crea la sub lista
				 var sublist = form.addSublist({
					 id: 'custpage_disa_sublist_query_result', type: ui.SublistType.LIST, label: 'Resultado'
				 });
				 sublist.addField({
					 id: 'custpage_disa_sublist_cliente', type: ui.FieldType.TEXT, label: 'Cliente'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});
				 sublist.addField({
					 id: 'custpage_disa_sublist_almacen', type: ui.FieldType.TEXT, label: 'Almacén'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});
				 /*sublist.addField({
					 id: 'custpage_disa_sublist_0_30', type: ui.FieldType.TEXT, label: '0 - 30'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});*/
				 sublist.addField({
					 id: 'custpage_disa_sublist_30_60', type: ui.FieldType.TEXT, label: '30 -60'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});
				 sublist.addField({
					 id: 'custpage_disa_sublist_60_90', type: ui.FieldType.TEXT, label: '60 - 90'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});
				 sublist.addField({
					 id: 'custpage_disa_sublist_90', type: ui.FieldType.TEXT, label: '> 90'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});
				 sublist.addField({
					 id: 'custpage_disa_sublist_total', type: ui.FieldType.TEXT, label: 'Total'
				 }).updateDisplayType({displayType : ui.FieldDisplayType.INLINE});

				 if(params.reload == 1){
					try{
						var getData = getAgingReport(params);		
						if ( getData && getData.length > 0 ) {
							var row = 0;
							var loc = 0;
							var temploc = '';
							var top10 = 0;
							for ( var i = 0; i < getData.length; i++ ) {
								var records = getData[i];
								if(top10 < 10){
									sublist.setSublistValue({id: 'custpage_disa_sublist_cliente', line: row, value: records.cliente});
									sublist.setSublistValue({id: 'custpage_disa_sublist_almacen', line: row, value: records.almacen});
									//if(records.actual == null){sublist.setSublistValue({id: 'custpage_disa_sublist_actual', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_actual', line: row, value: records.actual});}
									//if(records.range0_30 == null){sublist.setSublistValue({id: 'custpage_disa_sublist_0_30', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_0_30', line: row, value: records.range0_30});}
									if(records.range30_60 == null){sublist.setSublistValue({id: 'custpage_disa_sublist_30_60', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_30_60', line: row, value: format.format({value:records.range30_60, type: format.Type.FLOAT})});}
									if(records.range60_90 == null){sublist.setSublistValue({id: 'custpage_disa_sublist_60_90', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_60_90', line: row, value: format.format({value:records.range60_90, type: format.Type.FLOAT})});}
									if(records.range90 == null){sublist.setSublistValue({id: 'custpage_disa_sublist_90', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_90', line: row, value: format.format({value:records.range90, type: format.Type.FLOAT})});}
									if(records.total == null){sublist.setSublistValue({id: 'custpage_disa_sublist_total', line: row, value: 0});}else{sublist.setSublistValue({id: 'custpage_disa_sublist_total', line: row, value: format.format({value:records.total, type: format.Type.FLOAT})});}
									row ++;
								}
								if(loc != records.location){
									/*if(loc != 0){
										sublist.setSublistValue({id: 'custpage_disa_sublist_cliente', line: row, value: 'Total'});
										sublist.setSublistValue({id: 'custpage_disa_sublist_almacen', line: row, value: temploc});
										sublist.setSublistValue({id: 'custpage_disa_sublist_30_60', line: row, value: ' '});
										sublist.setSublistValue({id: 'custpage_disa_sublist_60_90', line: row, value: ' '});
										sublist.setSublistValue({id: 'custpage_disa_sublist_90', line: row, value: ' '});
										sublist.setSublistValue({id: 'custpage_disa_sublist_total', line: row, value:subtotal});
										row ++;
									}*/
									top10=1;
									loc = records.location;
									temploc = records.almacen;
									subtotal = records.total;
								}else{
									top10++;
									if(top10 <= 10){
										subtotal += records.total;
									}
								}
								log.debug( `Arreglo: `,`Loc: ${loc}, Records.locaiton: ${records.location}, top10: ${top10}`);
							}
							/*sublist.setSublistValue({id: 'custpage_disa_sublist_cliente', line: row, value: 'Total'});
							sublist.setSublistValue({id: 'custpage_disa_sublist_almacen', line: row, value: temploc});
							sublist.setSublistValue({id: 'custpage_disa_sublist_30_60', line: row, value: ' '});
							sublist.setSublistValue({id: 'custpage_disa_sublist_60_90', line: row, value: ' '});
							sublist.setSublistValue({id: 'custpage_disa_sublist_90', line: row, value: ' '});
							sublist.setSublistValue({id: 'custpage_disa_sublist_total', line: row, value:subtotal});
							row ++;*/
							///field.defaultValue = row;
						}
					} catch( err ) {
						log.debug( 'Error Get', err.message );
					}
					/*form.clientScriptModulePath = '../SuiteScripts/excel_export_clientscript.js';
					form.addButton({
						id: 'custpage_export_btn',
						label: 'Exportar',
						functionName: "excelDownload(" + periodFromId + "," + periodToId + "," + subsidiaryIdData + ","+basecurrency+","+subsidiaryNameData+");"
					});*/
				 }
				 var strFuncName = 'reloadForm("' + scriptParams.script + '","' + scriptParams.deploy + '")';
				 form.addButton({
					 id: 'custpage_search',
					 label:  "Generar Reporte",
					 functionName: strFuncName
				 });
				 context.response.writePage( form );
			 }

			 function onRequest( context ) {
				 if (context.request.method === 'GET') {
					 createForm(context);
				 }
				 if (context.request.method === 'POST') {
					 var msg ="";
					 var merr = "";
					 var obj = context.request.parameters;
					 if( !obj.custpage_disa_as_date_of) {
						 obj.custpage_disa_as_date_of = new Date();
					 }
					 var consultedDate = obj.custpage_disa_as_date_of;
					 var formatedDate = getFormatDate(consultedDate);
					 log.audit('consultedDate', consultedDate);
					 log.audit('formatedDate', formatedDate);
				 }
			 }

			 function getAgingReport (params){
				log.debug('params',params);
				let sql = `
				WITH
				mytemprable AS 
				(
					SELECT distinct
				OT.entity,
				OT.id,
				(select case when INSTR(name, 'VENTA')>0 then BUILTIN.DF(parent) else name end from location where id=TL.location) as almacen,
				TL.location,
				OT.foreigntotal,
				 (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) as AmountUnPaid,
				case 
					 when OT.duedate > TRUNC(SYSDATE) then  0 
					 else 
						 case 
							 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
							 else
												case
										   when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
											   (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
													   else
															 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
											   (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
								  end
						 end
				 end as daysoverdue,
				 case when 
						 (
						 case 
							 when OT.duedate > TRUNC(SYSDATE) then  0 
							 else 
								 case 
									 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
									 else
													 case
												 when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
													 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
															 else
																	 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
													 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
										 end
								 end
						 end) <= 0 OR  (
						 case 
							 when OT.duedate > TRUNC(SYSDATE) then  0 
							 else 
								 case 
									 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
									 else
													 case
												 when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
													 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
															 else
																	 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
													 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
										 end
								 end
						 end) is null Then 'Actual'
					 else 
						 (
						   case when 
								 (
								 case 
									 when OT.duedate > TRUNC(SYSDATE) then  0 
									 else 
										 case 
											 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
											 else
															 case
														 when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
																	 else
																			 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
												 end
										 end
								 end) < 30 Then '0 - 30'
							 else 
								 (
									 case when 
								 (
								 case 
									 when OT.duedate > TRUNC(SYSDATE) then  0 
									 else 
										 case 
											 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
											 else
															 case
														 when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
																	 else
																			 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
												 end
										 end
								 end) < 60 Then '30 - 60'
							 else 
								 (
									 (
									 case when 
								 (
								 case 
									 when OT.duedate > TRUNC(SYSDATE) then  0 
									 else 
										 case 
											 when (OT.foreigntotal - (select case when sum(NTLL.foreignamount)>0 then sum(NTLL.foreignamount) else 0 end as TotalPaid  FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy'))) > 0 then (to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy') - OT.duedate)
											 else
															 case
														 when ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate) < 0 then 0
																	 else
																			 ((select max(NT.trandate) FROM NextTransactionLineLink AS NTLL INNER JOIN Transaction AS NT ON (NT.ID = NTLL.NextDoc) WHERE ( NTLL.PreviousDoc = OT.id) AND
															 (NT.type='CustPymt'  OR NT.type='CustCred') AND NT.trandate<= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')) - duedate)
												 end
										 end
								 end) < 90 Then '60 - 90'
							 else 
								 (
									 'mas90'
								 )
							 end  
								 )
								 )
							 end  
								 )
							 end  
						 )
				 end as Aging 
			 from transaction OT, transactionline TL
			 where OT.type = 'CustInvc' and
			 --OT.entity = 620 and
			 OT.id = TL.transaction and TL.subsidiary=2 and TL.location in (${params['custpage_disa_list_locationId']}) and OT.trandate <= to_date('${params['custpage_disa_as_date_of']}','dd/mm/yyyy')
				 ),
			 
				 agingrangesbyCustomer AS
						 (
				 SELECT 
					 a.entity, a.almacen, a.location, b.altname, a.aging, sum(AmountUnPaid) as amount
				 from 
					 mytemprable a, customer b
				 where 
					 a.entity=b.id
				 group by 
					 a.entity, a.almacen, a.location, b.altname, a.aging
				 ),
			 
				 finalranges AS 
				 (
				 select distinct
						 x.altname as cliente, 
						 x.almacen,
						 x.location,
						 (select sum(amount) from agingrangesbyCustomer y where y.entity = x.entity and y.aging = '30 - 60') as Range30_60,
						 (select sum(amount) from agingrangesbyCustomer y where y.entity = x.entity and y.aging = '60 - 90') as Range60_90,
						 (select sum(amount) from agingrangesbyCustomer y where y.entity = x.entity and y.aging = 'mas90') as Range90,
						 (select sum(amount) from agingrangesbyCustomer y where y.entity = x.entity and (y.aging = '30 - 60' or y.aging = '60 - 90' or y.aging = 'mas90')) as Total
				 from agingrangesbyCustomer x
				 )
			 
				select 
					 cliente,
					 location, 
					 almacen, 
					 case when Range30_60 is null then 0 else round(Range30_60,0) end as Range30_60, 
					 case when Range60_90 is null then 0 else round(Range60_90,0) end as Range60_90,
					 case when Range90 is null then 0 else round(Range90,0) end as Range90, 
					 case when Total is null then 0 else round(Total,0) end as Total 
				from 
					 finalranges 
					 where 
					 total is not null 
				order by almacen, total desc
				 `;
			//log.audit('sql',sql);

			// Run the query.
			let queryResults = query.runSuiteQL({
				query: sql,
			});
			// Get the mapped results.
			let beginTime = new Date().getTime();
			let records = queryResults.asMappedResults();
			let endTime = new Date().getTime();
			let elapsedTime = endTime - beginTime;
			return records;
		 }


		 function getLocations(locations){
			 let sql = `select id,
			 case when INSTR(name, 'VENTA')>0 then BUILTIN.DF(parent) else name end as name
			from 
				location 
			where id in (${locations}) order by 2`;
			 //log.debug('sql locations', sql);
			 let resultIterator = query.runSuiteQLPaged({
				 query: sql,
				 pageSize: 1000
			 }).iterator();
	 
			 let data = [];
	 
			 resultIterator.each(function (page) {
				 let pageIterator = page.value.data.iterator();
				 pageIterator.each(function (row) {
					 let obj = {};
					 if (!!row.value.getValue(0)) {
						 obj.value = row.value.getValue(0);
						 obj.text = row.value.getValue(1);
						 data.push(obj);
					 }
					 return true;
				 });
				 return true;
			 });
			 return data;
		 }

		 function getFormatDate(date) {
			 log.debug('date', date);
			 var currrentUser = runtime.getCurrentUser();
			 var dateFormat = currrentUser.getPreference('DATEFORMAT');
			 var temp = date.split('/');
			 if (dateFormat == 'MM/DD/YYYY'){
				 var myDate = new Date(temp[0] + '/' + temp[1] + '/' + temp[2]);
			 } else {
				 var myDate = new Date(temp[1] + '/' + temp[0] + '/' + temp[2]);
			 }
			 var myDateF = format.format({value:myDate, type: format.Type.DATE, timezone: format.Timezone.AMERICA_MEXICO_CITY}); // String DateTime (MX) con formato de preferencias
			 var myDateP = format.parse({value:myDateF, type: format.Type.DATE}); //Obj Date hora MX
			 return myDateP;
		 }

			 return {
				 onRequest: onRequest
			 };
		 });



		 