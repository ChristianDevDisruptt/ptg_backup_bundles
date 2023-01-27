/**
 * Author      : Arturo Durán
 * Language    : javascript
 * Date        : 9may2022
 */
/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope Public
 */
 define(['N/currentRecord', 'N/url', 'N/format', 'N/ui/message', 'N/record', 'N/log', 'N/search', 'N/runtime', 'N/query'],

 function (currentRecord, url, format, message, record, log, search, runtime, query) {

	function saveRecord(context) {

		 var rec = currentRecord.get();


		 return true;
	 }
	 /**
	  * [reloadForm description]
	  * @param  {[type]} scId [description]
	  * @param  {[type]} dpId [description]
	  * @return {[type]}      [description]
	  */

	function reloadForm(scId, dpId) {
		debugger;
		var rec = currentRecord.get();
		// mando los parametros al suitelet
		var fecha = '';
		if (rec.getValue('custpage_disa_as_date_of')) {
			fecha = format.format({ value: rec.getValue('custpage_disa_as_date_of'), type: format.Type.DATE}) || '';
		}
		var fecha2 = '';
		if (rec.getValue('custpage_disa_as_date_of2')) {
			fecha2 = format.format({ value: rec.getValue('custpage_disa_as_date_of2'), type: format.Type.DATE}) || '';
		}
		var locations = "";
		var multiSelectArray = new Array(); //Create new array
		multiSelectArray = rec.getValue('custpage_disa_list_location');
        log.audit('multiSelectArray',multiSelectArray);
		for(var n = 0; n < multiSelectArray.length; n++){ //Concatinate to the html each multiselect value
			locations += multiSelectArray[n] + ',';
		}
		locations = locations.substring(0, locations.length-1);
         log.audit('locations',locations);
		/*var location = {
			value: rec.getValue('custpage_disa_list_location') || 0,
			text : rec.getText('custpage_disa_list_location') || null
		};*/
         var sublist = rec.getSublist('custpage_disa_sublist_query_result');
		 var script = url.resolveScript({
			 scriptId: scId,
			 deploymentId: dpId,
			 returnExternalUrl: false,
			 params: {
				custpage_sk_as_date_of : fecha || null,
				custpage_sk_as_date_of2 : fecha2 || null,
				custpage_sk_list_locationId : locations || 0,
				custpage_sk_sublist_query_result : sublist,
				reload : 1
			 }
		 });
		 // refresco la pantalla
		 window.onbeforeunload = false;
		 window.location.href = script;
	 }

	 /**
	  * [showMessage description]
	  * @param  {[type]} msg [description]
	  * @return {[type]}     [description]
	  */
	 function showMessage(msg, time) {
		 if (!msg) {
			 return;
		 }
		 if (!time) {
			 time = 3000;
		 }
		 var myMessage = message.create({
			 title: 'WARNING', message: msg, type: message.Type.WARNING
		 });
		 myMessage.show({ duration: time });
	 }

	 return {
		 saveRecord: saveRecord,
		 reloadForm: reloadForm,
	 };
 });