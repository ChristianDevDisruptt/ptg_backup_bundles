/*******************************************************************************
* * DisrupTT * DisrupTT Developers *
* **************************************************************************
* Date: 01/2022
* Script name: DRT - EI Auto STLT
* Script id: customscript_drt_ei_auto_stlt
* customer Deployment id: customdeploy_drt_ei_auto_stlt
* Applied to:
* File: drt_ei_auto_stlt.js
******************************************************************************/
/**
*@NApiVersion 2.1
*@NScriptType Suitelet
*@NModuleScope Public
*/

//define(['N/search', 'N/record', 'N/format', 'N/runtime', 'N/https', 'N/xml', 'N/encode', 'N/config', 'N/task', 'N/xml', 'N/email', 'N/file','../Bundle 373485/com.netsuite.mexicocompliance/src/electronicInvoicing/PacConnectors/mysuite/signedxml-req/util'], SBX
define(['N/search', 'N/record', 'N/format', 'N/runtime', 'N/https', 'N/xml', 'N/encode', 'N/config', 'N/task', 'N/xml', 'N/email', 'N/file','../../SuiteBundles/Bundle 373485/com.netsuite.mexicocompliance/src/electronicInvoicing/PacConnectors/mysuite/signedxml-req/util'],
 function (search, record, format, runtime, https, xml, encode, config, task, xml, email, file, util) {

	 const CONST_ARR_CHART = ['&', '"', '<', '>', "'", '´'];
	 const OPERATION = 'CONVERT_NATIVE_XML';
	 //const OPERATION = 'ASYNC_CONVERT_VERIFY';
	 var jsonData = null;

	 function getSerialNumber(id) {
		log.audit("getSerialNumber(id)", id);
		 var schResult = '';

		 if (id === null) {
			 return 'GEN-1000000001';
		 }
		 var source = 'customrecord_drt_setup_serial_gi';
		 var afilters = [{
			 name: 'custrecord_drt_num_subsidiary',
			 operator: search.Operator.ANYOF,
			 values: id
		 }];
		 log.audit("afilters", afilters);
		 var acolumns = ['custrecord_drt_prefix', 'custrecord_drt_suffix', 'custrecord_drt_current', 'custrecord_drt_initial'];
		 log.audit("acolumns", acolumns);
		 var schRecord = search.create({
			 type: source,
			 filters: afilters,
			 columns: acolumns
		 }).run().each(function (result) {
			 if (result.getValue('custrecord_drt_prefix')) {
				 schResult += result.getValue('custrecord_drt_prefix');
			 }
			 if (result.getValue('custrecord_drt_suffix')) {
				 schResult += result.getValue('custrecord_drt_suffix');
			 }
			 if (parseInt(result.getValue('custrecord_drt_current')) == 0) {
				 schResult += result.getValue('custrecord_drt_initial').toString();
			 } else {
				 schResult += (result.getValue('custrecord_drt_current') || 1).toString();
			 }
			 schResult = {
				 serial: schResult,
				 id: result.id
			 };
		 });
		 log.audit("schRecord", schRecord);
		 return schResult;
	 }

	 function getDataSAT(type, id) {

		 var fieldName = 'name';
		 if (type == 'customrecord_mx_sat_payment_term') {
			 fieldName = 'custrecord_mx_sat_pt_code';
		 }
		 // 1 unidad
		 var result = search.lookupFields({
			 type: type,
			 id: id,
			 columns: [fieldName]
		 });
		 return result.name;
	 }

	 function getFormatDateXML(d) {
		 if (!d) {
			 return '';
		 }
		 var dd = (d.getDate() + 100).toString().substr(1, 2);
		 var MM = (d.getMonth() + 101).toString().substr(1, 2);
		 var yy = d.getFullYear();
		 var hh = (parseInt(d.getHours()) + 100).toString().substr(1, 2);
		 var mm = (parseInt(d.getMinutes()) + 100).toString().substr(1, 2);
		 var ss = (parseInt(d.getSeconds()) + 100).toString().substr(1, 2);

		 return yy + '-' + MM + '-' + dd + 'T' + hh + ':' + mm + ':' + ss;
	 }

	 function getSetupCFDI(idsub) {
		 var result = null;
		 // 0 units
		 var SUBSIDIARIES = runtime.isFeatureInEffect({
			 feature: 'SUBSIDIARIES'
		 });

		 if (SUBSIDIARIES && idsub) {
			 // Configuracion de la subsidiaria
			 // 5 Units
			 var subsidiary = record.load({
				 type: 'subsidiary',
				 id: idsub
			 });

			 result = {
				 rfcemisor: subsidiary.getValue('federalidnumber') || 'XAXX010101000',
				 regfiscal: subsidiary.getText('custrecord_mx_sat_industry_type').split('-')[0] || '',
				 razonsoc: subsidiary.getValue('name')
			 };

		 } else if (!SUBSIDIARIES) {
			 // Configuracion de la compania
			 // 10 unidades
			 var configRecObj = config.load({
				 type: config.Type.COMPANY_INFORMATION
			 });

			 result = {
				 rfcemisor: configRecObj.getValue('employerid') || '',
				 regfiscal: configRecObj.getText('custrecord_mx_sat_industry_type').split('-')[0] || '',
				 razonsoc: configRecObj.getValue('legalname')
			 };
		 }
		 return result;
	 }

	/*function generateUrlParamString(data) {
		return Object.keys(data).map(function (k) {
			return encodeURIComponent(k) + '=' + encodeURI(data[k]);
		}).join('&');
	}

	function getQRcode(data) {
		var SAT_URL_LINK = 'https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx';
		var QR_WIDTH = 10;
		var QR_HEIGHT = 10;
		var SELLO_LAST_CH = 8;
		var BASE64_TXT_IN_URL = 'base64,';
		var url = SAT_URL_LINK+'?' + generateUrlParamString({
			Id :data.cfdiUuid,
			re : data.rfcEmisor,
			rr : data.rfcReceptor,
			tt : data.voucherTotal,
			fe : data.selloCfd.substring(data.selloCfd.length - SELLO_LAST_CH),
		});
		var qr = qrcode(0,'M');
		qr.addData(url,'Byte');
		qr.make();
		var genQrCode = qr.createDataURL(QR_WIDTH, QR_HEIGHT);
		var base64TxtIdx = genQrCode.indexOf(BASE64_TXT_IN_URL);
		var qrCode = genQrCode.substr(base64TxtIdx+BASE64_TXT_IN_URL.length);
		log.audit('qrCode',qrCode);
		return qrCode;
	}*/

	 function getXMLHead(userName) {
		 log.audit("getXMLHead(userName)");
		 // Obtengo el folio de la factura
		 if (!jsonData.idsetfol) {
			 var idsetfol = getSerialNumber(jsonData.subsidiary);
			 jsonData.idsetfol = idsetfol.id;
			 log.audit("idsetfol", idsetfol);
		 }


		 var xmlDoc = '';
		 xmlDoc += '<?xml version="1.0" encoding="UTF-8"?>';
		 xmlDoc += '<fx:FactDocMX ';
		 xmlDoc += 'xmlns:fx="http://www.fact.com.mx/schema/fx" ';
		 xmlDoc += 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ';
		 xmlDoc += 'xsi:schemaLocation="http://www.fact.com.mx/schema/fx http://www.mysuitemex.com/fact/schema/fx_2010_f.xsd">';
		 xmlDoc += '  <fx:Version>7</fx:Version>';
		 xmlDoc += '  <fx:Identificacion>';
		 xmlDoc += '    <fx:CdgPaisEmisor>MX</fx:CdgPaisEmisor>';
		 xmlDoc += '    <fx:TipoDeComprobante>FACTURA</fx:TipoDeComprobante>';
		 xmlDoc += '    <fx:RFCEmisor>' + jsonData.rfcemisor + '</fx:RFCEmisor>';
		  //xmlDoc += '    <fx:RFCEmisor>XAXX010101000</fx:RFCEmisor>';
		 xmlDoc += '    <fx:RazonSocialEmisor>' + jsonData.razonsoc + '</fx:RazonSocialEmisor>';
		 xmlDoc += '    <fx:Usuario>' + userName + '</fx:Usuario>';
		 xmlDoc += '    <fx:AsignacionSolicitada>';
		 xmlDoc += '      <fx:Serie>' + jsonData.tranid.substring(0,1) + '</fx:Serie>';
		 xmlDoc += '      <fx:Folio>' + jsonData.tranid.substring(1) + '</fx:Folio>';
		 xmlDoc += '      <fx:TiempoDeEmision>' + jsonData.today + '</fx:TiempoDeEmision>'; // 2020-11-11T00:00:00
		 xmlDoc += '    </fx:AsignacionSolicitada>';
		 xmlDoc += '    <fx:LugarExpedicion>64780</fx:LugarExpedicion>';
		 xmlDoc += '  </fx:Identificacion>';
		 xmlDoc += '  <fx:Emisor>';
		 xmlDoc += '    <fx:RegimenFiscal>';
		 xmlDoc += '      <fx:Regimen>' + jsonData.regfiscal.split('-')[0].trim() + '</fx:Regimen>'; //601
		 xmlDoc += '    </fx:RegimenFiscal>';
		 xmlDoc += '  </fx:Emisor>';
		 xmlDoc += '  <fx:Receptor>';
		 xmlDoc += '    <fx:CdgPaisReceptor>MX</fx:CdgPaisReceptor>';
		 xmlDoc += '    <fx:RFCReceptor>' + jsonData.rfcrecep + '</fx:RFCReceptor>';
		 //xmlDoc += '    <fx:NombreReceptor>' + jsonData.entity.replace("2 ", "").replace("1 ", "") + '</fx:NombreReceptor>';
		 xmlDoc += '    <fx:NombreReceptor>' + jsonData.entity + '</fx:NombreReceptor>';
		 // xmlDoc += '    <fx:NombreReceptor>PUBLICO EN GENERAL</fx:NombreReceptor>';
		 xmlDoc += '    <fx:UsoCFDI>' + jsonData.cfdi.split('-')[0].trim() + '</fx:UsoCFDI>'; //P01
		 xmlDoc += '  </fx:Receptor>';
		 xmlDoc += '  <fx:Conceptos>';

		 var totTaxAmount = 0;
		 for (var i = 0; i < jsonData.items.length; i++) {

			 var codeItem = jsonData.items[i].itemid;
			 var nameItem = jsonData.items[i].name;

			 for (var t = 0; t < CONST_ARR_CHART.length; t++) {
				 if (nameItem.indexOf(CONST_ARR_CHART[t]) >= 0) {
					 nameItem = xml.escape({
						 xmlText: nameItem
					 });
					 break;
				 }
			 }

			 for (var t = 0; t < CONST_ARR_CHART.length; t++) {
				 if (codeItem.indexOf(CONST_ARR_CHART[t]) >= 0) {
					 codeItem = xml.escape({
						 xmlText: codeItem
					 });
					 break;
				 }
			 }

			 var liquidacion = "";
			 var descripcionArticulo = "";
			 var oportunidadRec = record.load({
				type: search.Type.OPPORTUNITY,
				id: jsonData.oportunidadID,
			});
			var folioEstacionario = "";
			var folioSGC = oportunidadRec.getValue("custbody_ptg_folio_sgc_");
			if(!folioSGC){
				folioEstacionario = jsonData.oportunidad.substring(1);
			} else {
				folioEstacionario = folioSGC;
			}
			 if(jsonData.preliqCilind){
				liquidacion = jsonData.preliqCilind;
				descripcionArticulo = nameItem + " Nota: " + jsonData.oportunidad.substring(1) + " - Liquidación.: " + liquidacion;
			 } else if(jsonData.preliqEstaci){
				liquidacion = jsonData.preliqEstaci;
				descripcionArticulo = nameItem + " Nota: " + folioEstacionario + " - Liquidación.: " + liquidacion;
			 } else if(jsonData.preLiqCarbur){
				liquidacion = jsonData.preliqCarbur;
				descripcionArticulo = nameItem + " Nota: " + jsonData.oportunidad.substring(1) + " - Liquidación.: " + liquidacion;
			 } else if(jsonData.preliqVenAnd){
				liquidacion = jsonData.preliqVenAnd;
				descripcionArticulo = nameItem + " Nota: " + jsonData.oportunidad.substring(1) + " - Liquidación.: " + liquidacion;
			 } else if(jsonData.preliqViaEsp){
				liquidacion = jsonData.preliqViaEsp;
				descripcionArticulo = nameItem + " Nota: " + jsonData.oportunidad.substring(1) + " - Liquidación.: " + liquidacion;
			 }

			 xmlDoc += '    <fx:Concepto>';
			 //xmlDoc += '      <fx:NoIdentificacion>' + jsonData.permiso + '</fx:NoIdentificacion>';
			 xmlDoc += '      <fx:Cantidad>' + jsonData.items[i].quantity + '</fx:Cantidad>';
			 xmlDoc += '      <fx:ClaveUnidad>' + jsonData.items[i].ClaveUnidad + '</fx:ClaveUnidad>';
			 xmlDoc += '      <fx:UnidadDeMedida>' + jsonData.items[i].unit + '</fx:UnidadDeMedida>';
			 xmlDoc += '      <fx:ClaveProdServ>' + jsonData.items[i].ClaveProdServ + '</fx:ClaveProdServ>';
			 //xmlDoc += '      <fx:Codigo>' + codeItem + '</fx:Codigo>';
			 xmlDoc += '      <fx:Codigo>' + jsonData.permiso+'-'+ jsonData.consecutivo + '</fx:Codigo>';
			 //xmlDoc += '      <fx:Descripcion>' + nameItem + " Nota: " + jsonData.oportunidad.substring(1) + " - Liquidación.: " + liquidacion +'</fx:Descripcion>';
			 xmlDoc += '      <fx:Descripcion>' + descripcionArticulo +'</fx:Descripcion>';
			 xmlDoc += '      <fx:ValorUnitario>' + jsonData.items[i].rate + '</fx:ValorUnitario>';
			 xmlDoc += '      <fx:Importe>' + jsonData.items[i].amount + '</fx:Importe>';
			 xmlDoc += '      <fx:Descuento>' + jsonData.items[i].discount + '</fx:Descuento>';
			 //xmlDoc += '      <fx:Descuento>11.60</fx:Descuento>';
			 xmlDoc += '      <fx:ImpuestosSAT>';
			 xmlDoc += '        <fx:Traslados>';
			 if (jsonData.items[i].taxcodeid == 307) {
				 xmlDoc += '          <fx:Traslado Base="' + jsonData.items[i].amount + '" Impuesto="002" TipoFactor="Exento" />';
			 } else {
				 xmlDoc += '          <fx:Traslado Base="' + jsonData.items[i].amount + '" Importe="' + jsonData.items[i].taxamt + '" Impuesto="002" TasaOCuota="' + jsonData.items[i].taxrate + '" TipoFactor="Tasa" />';
			 }
			 xmlDoc += '        </fx:Traslados>';
			 xmlDoc += '      </fx:ImpuestosSAT>';
			 xmlDoc += '    </fx:Concepto>';
			 totTaxAmount += parseFloat(jsonData.items[i].taxamt);
		 }

		 xmlDoc += '  </fx:Conceptos>';
		 xmlDoc += '  <fx:ImpuestosSAT TotalImpuestosTrasladados="' + totTaxAmount.toFixed(2) + '">';
		 xmlDoc += '    <fx:Traslados>';
		 xmlDoc += '      <fx:Traslado Importe="' + totTaxAmount.toFixed(2) + '" Impuesto="002" TasaOCuota="' + jsonData.items[0].taxrate + '" TipoFactor="Tasa" />';
		 xmlDoc += '    </fx:Traslados>';
		 xmlDoc += '  </fx:ImpuestosSAT>';
		 xmlDoc += '  <fx:Totales>';
		 xmlDoc += '    <fx:Moneda>' + jsonData.currency + '</fx:Moneda>';
		 xmlDoc += '    <fx:TipoDeCambioVenta>' + jsonData.exchange + '</fx:TipoDeCambioVenta>';
		 xmlDoc += '    <fx:SubTotalBruto>' + jsonData.subtot + '</fx:SubTotalBruto>';
		 xmlDoc += '    <fx:SubTotal>' + jsonData.subtot + '</fx:SubTotal>';
		 //xmlDoc += '    <fx:SubTotalBruto>238.62</fx:SubTotalBruto>';
		 //xmlDoc += '    <fx:SubTotal>238.62</fx:SubTotal>';
		 xmlDoc += '    <fx:Descuento>' + jsonData.destot + '</fx:Descuento>';
		 //xmlDoc += '    <fx:Descuento>11.60</fx:Descuento>';
		 xmlDoc += '    <fx:Total>' + jsonData.total + '</fx:Total>';
		 xmlDoc += '    <fx:TotalEnLetra>-</fx:TotalEnLetra>';
		 xmlDoc += '    <fx:FormaDePago>' + jsonData.payform + '</fx:FormaDePago>';
		 xmlDoc += '  </fx:Totales>';
		 xmlDoc += '  <fx:ComprobanteEx>';
		 xmlDoc += '    <fx:TerminosDePago>';
//		 xmlDoc += '      <fx:MetodoDePago>PPD</fx:MetodoDePago>';
		 xmlDoc += '      <fx:MetodoDePago>' + jsonData.paymeth + '</fx:MetodoDePago>';
		 xmlDoc += '    </fx:TerminosDePago>';
		 xmlDoc += '  </fx:ComprobanteEx>';
		 xmlDoc += '</fx:FactDocMX>';

		 return xmlDoc;
	 }

	// function getAllRecords() {
	
	function getAllRecords(id_factura) {
		 log.audit('Remaining Usage init getAllRecords', runtime.getCurrentScript().getRemainingUsage());
		 var isentry = true;

		 log.audit("getAllRecords_id_factura", id_factura);

		 var objItems = {};
		 var totalDescuentos = 0;
		 var lineaDescuentos = 0;
		 var subtotales = 0;
		 var lineaSubtotales = 0;
		 var linea = 0;
		 var arrayItem = [];
		 var arrayItem2 = [];
		 var rec = record.load({
			type: record.Type.INVOICE,
			id: id_factura,
			isDynamic: true,
		  });
		//jsonData.tranid = rec.getValue({ fieldId: 'tranid'});
		//jsonData.consecutivo = rec.getValue({ fieldId: 'transactionnumber'});
		  log.audit("rec", rec);
		  var itemCount = rec.getLineCount({
			  sublistId : 'item'
			});
//		log.audit('Numero lineas: ' + itemCount);
		for (var j=0; j<itemCount; j++) {
			log.audit("vuelta j", j);
			var lineaArray = j;
			
			var itemidArray = rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'item',
				line: j
			 }) || "";
			 var nameArray = rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'item_display',
				line: j
			 });
			 var quantityArray = rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'quantity',
				line: j
			});
			var unitArray = rec.getSublistValue({
				sublistId: 'item',
				fieldId: 'units_display',
				line: j
			 });
			if(nameArray == "GAS LP TEST UNIDAD GAS LP TEST UNIDAD" || nameArray == "GAS LP - PI GAS LP - PI" || nameArray == "GAS LP - PI" || nameArray == "GAS LP GAS LP" || nameArray == "GAS LP"){
				unitArray = "LTS"
			}
			var taxcodeidArray = rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'taxcode',
				line: j
			 });
			var taxcodeArray = rec.getSublistText({
				sublistId: 'item', 
				fieldId: 'taxcode',
				line: j
			 });
			var taxrateArray = '0.160000';
			var rateArray = parseFloat(rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'rate',
				line: j
			 })).toFixed(2);
			var taxamtArray = parseFloat(rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'tax1amt',
				line: j
			 })).toFixed(2);
			var amountArray = parseFloat(rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'amount',
				line: j
			 })).toFixed(2);
			var discouArray = parseFloat(rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'discountamount',
				line: j
			 }) || 0).toFixed(2);
			var importeBrutoArray = parseFloat(rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'grossamt',
				line: j
			 }) || 0).toFixed(2);
			var idinvoArray = rec.id;
			var typeArray = rec.type;
			var ClaveUArray = (rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'units_display',
				line: j
			}) || ";").split(';')[0];
			//log.audit('ClaveUArray',ClaveUArray);
			if(nameArray == "GAS LP TEST UNIDAD GAS LP TEST UNIDAD" || nameArray == "GAS LP - PI GAS LP - PI" || nameArray == "GAS LP - PI" || nameArray == "GAS LP GAS LP" || nameArray == "GAS LP"){
				ClaveUArray = "LTR"
			}else{
              	ClaveUArray = "H87"
            }
			var ClavePArray = (rec.getSublistValue({
				sublistId: 'item', 
				fieldId: 'custcol_mx_txn_line_sat_item_code_display',
				line: j
			 }) || " ").split(' ')[0];

			 if(nameArray != "Descuentos, bonificaciones y devoluciones"){

				objItems = {line: lineaArray, itemid: itemidArray, name: nameArray, quantity: quantityArray, unit: unitArray, taxcodeid: taxcodeidArray, taxcode: taxcodeArray, taxrate: taxrateArray, rate: rateArray,
					taxamt: taxamtArray, amount: amountArray, discount: discouArray, idinvo: idinvoArray, type: typeArray, ClaveUnidad: ClaveUArray, ClaveProdServ: ClavePArray}

				lineaSubtotales = amountArray * 1;
				subtotales += lineaSubtotales;

				linea = j;
				//arrayItem.push(objItems);
					//log.audit("arrayItem.push vuelta " +j, arrayItem);

			 } else {
				lineaDescuentos = importeBrutoArray * -1;
				totalDescuentos += lineaDescuentos;
				log.audit("totalDescuentos", totalDescuentos);

				findAndUpdate(linea, "discount", lineaDescuentos.toFixed(2));
			 }

			 if(j == linea){
				arrayItem.push(objItems);
				log.audit("arrayItem.push vuelta " +j, arrayItem);
			 }
			 
			function findAndUpdate(posicion, parametro, nuevoValor){
				log.audit("entra funciona findAndUpdate");
				var foundElement = arrayItem.find(function(articulo){
					return articulo.line === posicion;
				});
				log.audit("foundElement", foundElement);
		
				foundElement[parametro] = nuevoValor;
			}
			 
		}



		//arrayItem.push(objItems);

		log.audit("arrayItem.push", arrayItem);

		 
		 /*var rangini = 0;
		 var rangend = 1000;
		 var subtot = 0;
		 var taxtot = 0;
		 var total = 0;
		 var destot = 0;
		 
		 var sourceId = runtime.getCurrentScript().getParameter('custscript_drt_glb_search');
		 // cargo la busqueda guardada
		 var searchRecord = search.load({
			 id: sourceId
		 });

		 var today = runtime.getCurrentScript().getParameter('custscript_drt_glb_today') || null;
		 if (!today) {
			 today = new Date();
			 today = format.format({
				 value: today,
				 type: format.Type.DATE
			 });
		 } else {
			 today = format.format({
				 value: today,
				 type: format.Type.DATE
			 });
		 }

		 var schResultRange = searchRecord.run().getRange({
			 start: rangini,
			 end: rangend
		 });
		 log.audit('schResultRange', schResultRange.length);
		 do {
			 schResultRange.forEach(function (row) {

				 var itemtype = row.getValue({
					 name: 'type',
					 join: 'item'
				 }).toLowerCase();
				 var itemCodeSAT = row.getText('custcol_mx_txn_line_sat_item_code');

				 subtot += parseFloat(row.getValue('amount'));
				 taxtot += parseFloat(row.getValue('taxamount'));
				 total += parseFloat(row.getValue('grossamount'));*/

				 // Busqueda del Permiso de la Ubicación
				 var Objpermiso = search.lookupFields({
					type: search.Type.LOCATION,
					id: rec.getValue('custbody_ptg_planta_factura'),
					//id: 762,
					columns: ['custrecord_ptg_permiso_number']
				});

				var permiso = Objpermiso.custrecord_ptg_permiso_number; 

				 if (isentry == true) {
//					 log.audit("***ENTRA IF***");

					 jsonData = {
						idinvoice: rec.getValue('id'),
						 subsidiary: rec.getValue('subsidiary'),
						 trandate: rec.getValue('trandate'),
						 tranid: rec.getValue('tranid'),
						 //entity: rec.getText('entity'),
						 entity: rec.getText('custbody_razon_social_para_facturar'),
						 // rfcrecep: 'XAXX010101000', 
						 rfcrecep: rec.getValue('custbody_mx_customer_rfc'),
						 currency: 'MXN',
						 exchange: parseInt(rec.getValue('exchangerate')),
						 permiso: permiso,
						 subtot: subtotales.toFixed(2),
						 //subtot: rec.getText('subtotal').replace(',', ''),
						 //subtot: rec.getValue('subtotal'),
						 //taxtot: 0,
						 total: rec.getText('total').replace(',', ''),
						 //total: rec.getValue('total'),
						 //destot: rec.getText('discounttotal').replace(',', ''),
						 //destot: rec.getValue('discounttotal'),
						 destot: totalDescuentos.toFixed(2),
						 //cfdi: 'G03',
						 cfdi: rec.getText("custbody_mx_cfdi_usage").split(' ')[0],//G03
						 //payform: '',
						 payform: rec.getText("custbody_mx_txn_sat_payment_method").split(' ')[0],//99
						 //paymeth: '',
						 paymeth: rec.getText("custbody_mx_txn_sat_payment_term").split(' ')[0],//PPD
						 oportunidad: rec.getText("opportunity").split(' ')[1],
						 oportunidadID: rec.getValue("opportunity"),
						 preliqCilind: rec.getText("custbody_ptg_registro_pre_liq"),
						 preliqEstaci: rec.getText("custbody_ptg_registro_pre_liq_esta"),
						 preliqCarbur: rec.getText("custbody_ptg_registro_pre_liq_carb"),
						 preliqVenAnd: rec.getText("custbody_ptg_registro_liq_venta_anden"),
						 preliqViaEsp: rec.getText("custbody_ptg_liq_viaje_especial"),
						 rfcemisor: '',
						 today: '',
						 regfiscal: '',
						 idsetfol: '',
						 consecutivo: rec.getValue("transactionnumber"),
						 
						 items: arrayItem
						/* [{
							 itemid: rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'item',
								line: 0
							 }) || "",
							 name: rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'item_display',
								line: 0
							 }), 
							 quantity: rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'quantity',
								line: 0
							}),
							 unit: rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'unit',
								line: 0
							 }),
							 taxcodeid: rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'taxcode',
								line: 0
							 }),
							 taxcode: rec.getSublistText({
								sublistId: 'item', 
								fieldId: 'taxcode',
								line: 0
							 }),
							 taxrate: '0.160000',
							 rate: parseFloat(rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'rate',
								line: 0
							 })).toFixed(2),
							 taxamt: parseFloat(rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'tax1amt',
								line: 0
							 })).toFixed(2),
							 amount: parseFloat(rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'amount',
								line: 0
							 })).toFixed(2),
							 discount: parseFloat(rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'discountamount',
								line: 0
							 }) || 0).toFixed(2),
							 idinvoice: rec.id,
							 type: rec.type,
							 ClaveUnidad: (rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'units_display',
								line: 0
							}) || ";").split(';')[0],
							ClaveProdServ: (rec.getSublistValue({
								sublistId: 'item', 
								fieldId: 'custcol_mx_txn_line_sat_item_code_display',
								line: 0
							 }) || " ").split(' ')[0],
						 },]*/
					 };
					 isentry = false;
					 log.audit("jsonData", jsonData);
					//log.audit("jsonData.items.length", jsonData.items.length);

				 } /*else {
					log.audit("***ENTRA ELSE***");
					 jsonData.items.push({
						 itemid: row.getValue({
							 name: "custitem_dtt_skuproducteca",
							 join: "item"
						 }) || "", //row.getText('item'),
						 name: row.getValue({
							 name: 'salesdescription',
							 join: 'item'
						 }) || row.getValue({
							 name: "custitem_dtt_skuproducteca",
							 join: "item"
						 }),
						 quantity: row.getValue('quantity'),
						 unit: row.getValue('unit'),
						 taxcodeid: row.getValue('taxcode'),
						 taxcode: row.getText('taxcode'),
						 taxrate: '0.160000',
						 rate: parseFloat(row.getValue('rate')).toFixed(2),
						 taxamt: parseFloat(row.getValue('taxamount')).toFixed(2),
						 amount: parseFloat(row.getValue('amount')).toFixed(2),
						 discount: parseFloat(row.getValue('discountamount') || 0).toFixed(2),
						 satcode: itemCodeSAT,
						 idcashsales: row.id,
						 type: row.type,
						 ClaveUnidad: (row.getValue({
							 name: "custitem_drt_nc_units",
							 join: "item"
						 }) || ";").split(';')[1],
						 ClaveProdServ: (row.getValue({
							 name: "custitem_drt_nc_units",
							 join: "item"
						 }) || ";").split(';')[0]
					 });
				 }*/
			 /*});
			 rangini = rangend;
			 rangend += 1000;
			 schResultRange = searchRecord.run().getRange({
				 start: rangini,
				 end: rangend
			 });

		 } while (schResultRange.length > 0);*/

		/* if (jsonData) {
			 jsonData.subtot = subtot.toFixed(2);
			 jsonData.taxtot = taxtot.toFixed(2);
			 jsonData.total = ((total + taxtot) - destot).toFixed(2);
			 jsonData.destot = destot.toFixed(2);
		 }*/
		 log.audit('Remaining Usage getAllRecords', runtime.getCurrentScript().getRemainingUsage());
	 }

/*	 function createFileXML(xml) {

		 var date = new Date();
		 date = getFormatDateXML(date);

		 var fileObj = file.create({
			 name: 'XML' + date,
			 fileType: file.Type.XMLDOC,
			 contents: xml,
			 description: 'XML SAT',
			 encoding: file.Encoding.UTF8,
			 folder: runtime.getCurrentScript().getParameter('custscript_drt_glb_folder'),
			 isOnline: true
		 });
		 var fileId = fileObj.save();
		 log.audit({
			 title: 'fileId',
			 details: JSON.stringify(fileId)
		 });
		 return fileId;
	 }*/

	 function createFile(param_name, param_fileType, param_contents, param_description, param_encoding, param_folder) {
		 try {
			 log.audit({
				 title: 'createFile',
				 details: ' param_name: ' + JSON.stringify(param_name) +
					 ' param_fileType: ' + JSON.stringify(param_fileType) +
					 ' param_contents: ' + JSON.stringify(param_contents) +
					 ' param_description: ' + JSON.stringify(param_description) +
					 ' param_encoding: ' + JSON.stringify(param_encoding) +
					 ' param_folder: ' + JSON.stringify(param_folder)
			 });
			 var respuesta = {
				 success: false,
				 data: '',
				 error: []
			 };


			 var fileObj = file.create({
				 name: param_name,
				 fileType: param_fileType,
				 contents: param_contents,
				 description: param_description,
				 encoding: param_encoding,
				 folder: param_folder,
				 isOnline: true
			 });
			 respuesta.data = fileObj.save() || '';
			 respuesta.success = respuesta.data != '';

		 } catch (error) {
			 respuesta.error.push(JSON.stringify(error));
			 log.error({
				 title: 'error createFile',
				 details: JSON.stringify(error)
			 });
		 } finally {
			 log.emergency({
				 title: 'respuesta createFile',
				 details: JSON.stringify(respuesta)
			 });
			 return respuesta;
		 }
	 }

	 function parsePACResponse(xmlstr){
			var xmlDocument = xml.Parser.fromString({
				text : xmlstr,
			});
			var resultNode = xml.XPath.select({
				node : xmlDocument,
				xpath : '/soap:Envelope/soap:Body/*[namespace-uri()=\'http://www.fact.com.mx/schema/ws\']', 
			});
				
			var pacResponseObj = util.createPacResponseObject(resultNode[0].childNodes[0]);
			var error = pacResponseObj.error;
	
			// Code 3109 is already Stamped with UUID (TIMBRE_ALREADY_APPLIED) . 
			if (error && error.code === '3109') {
				pacResponseObj.uuidStamped = 'USE_FOLIO';
			}
			log.audit('pacResponseObj',pacResponseObj);
			return pacResponseObj;
	 }

	 function execute(context) {

		 try {
			 log.audit('Remaining Usage init execute', runtime.getCurrentScript().getRemainingUsage());
			 var test = false;
			 log.audit({
				 title: 'execute 536',
				 details: JSON.stringify(context)
			 });
			 var id_factura = context.request.parameters.id_factura;
			 log.audit("id_factura", id_factura);

			 var invoiceObj = record.load({
				id: id_factura,
				type: search.Type.INVOICE,
			 });

			 var nombreInvoice = invoiceObj.getValue("tranid");
			 var subsidiariaInvoice = invoiceObj.getValue("subsidiary");

			 var requestorID = 0;
			 if(subsidiariaInvoice == 22){//subsidiariaCorpoGas
				requestorID = 5;
			 } else if (subsidiariaInvoice == 26){//subsidiariaDistribuidora
				requestorID = 4;
			 } else if (subsidiariaInvoice == 26){//subsidiariaSanLuis
				requestorID = 6;
			}
			 //getAllRecords(id_factura);

			 // obtengo la transaccion
			 var getData = getAllRecords(id_factura);
			 log.audit('getData', getData);
			 // informacion obtenida guardarla en un custom

			 if (!jsonData) {
				 log.debug('Message', 'No se encontraron resultados en la busqueda.');
				 return;
			 }
			 var resultGUID = runtime.getCurrentScript().getParameter('custscript_drt_glb_uuid') || null;
			 if (runtime.getCurrentScript().getParameter('custscript_drt_glb_folio')) {
				 jsonData.idsetfol = runtime.getCurrentScript().getParameter('custscript_drt_glb_folio');
			 }

			 log.debug('resultGUID', resultGUID);

			 //MODIFICAR
//			 jsonData.cfdi = getDataSAT('customrecord_mx_sat_cfdi_usage', runtime.getCurrentScript().getParameter('custscript_drt_glb_usagecfdi'));
//			 jsonData.payform = '99'; //runtime.getCurrentScript().getParameter('custscript_drt_glb_payform_sat');
			 //MODIFICAR
			 //jsonData.paymeth = getDataSAT('customrecord_mx_mapper_values', runtime.getCurrentScript().getParameter('custscript_drt_glb_paymethod_sat'));
			 // formateo la fecha de registro
			 var today = new Date();
			 log.audit("today", today);
			 if (runtime.getCurrentScript().getParameter('custscript_drt_glb_createdate')) {
				 today = runtime.getCurrentScript().getParameter('custscript_drt_glb_createdate');
			 }
			 jsonData.today = getFormatDateXML(today);

			 var setupConfig = getSetupCFDI(jsonData.subsidiary);
			 if (setupConfig) {
				 jsonData.rfcemisor = setupConfig.rfcemisor;
				 jsonData.regfiscal = setupConfig.regfiscal;
				 jsonData.razonsoc = setupConfig.razonsoc;
			 }
			 // Cargo la configuracion del PAC
			 var mySuiteConfig = record.load({
				 type: 'customrecord_mx_pac_connect_info',
				 //MODIFICAR
				 //id: runtime.getCurrentScript().getParameter('custscript_drt_glb_requestor')
				 //id: 4
				 id: requestorID
			 });
			 var url = mySuiteConfig.getValue('custrecord_mx_pacinfo_url') || '';
			 log.audit({
				 title: 'url1',
				 details: JSON.stringify(url)
			 });
			 // var url = 'https://www.mysuitetest.com/mx.com.fact.wsfront/FactWSFront.asmx';
			 var idFiscal = mySuiteConfig.getValue('custrecord_mx_pacinfo_taxid') || '';
			 // var userName = 'ADMIN'; 
			 // var requestor = '0c320b03-d4f1-47bc-9fb4-77995f9bf33e'; 
			 // var user = '0c320b03-d4f1-47bc-9fb4-77995f9bf33e';
			 var userName = mySuiteConfig.getValue('custrecord_mx_pacinfo_username')
			 var requestor = mySuiteConfig.getValue('custrecord_mx_pacinfo_username') || '';
			 var user = mySuiteConfig.getValue('custrecord_mx_pacinfo_username') || '';

			 log.audit({
				 title: 'jsonData',
				 details: JSON.stringify(jsonData)
			 });
			 
			 if (!resultGUID) {
				 // armo el xml
//				 log.audit("!resultGUID");
				 var xmlStr = getXMLHead(userName);
//				 log.audit("xmlStr", xmlStr);
				 var date = new Date();
				 log.audit("date", date);
				 date = getFormatDateXML(date);

				 var idFileXML = createFile(
					 'XML_'+nombreInvoice+'_'+ date,
					 file.Type.XMLDOC,
					 xmlStr,
					 'XML SAT',
					 file.Encoding.UTF8,
					 runtime.getCurrentScript().getParameter('custscript_drt_glb_folder')
				 );
				 log.audit("idFileXML doc", idFileXML);
				 // var idFileXML = createFileXML(xmlStr);
				 log.audit({
					 title: 'xmlStr',
					 details: JSON.stringify(xmlStr)
				 });
				 // convertir el xml a base 64
				 var xmlStrB64 = encode.convert({
					 string: xmlStr,
					 inputEncoding: encode.Encoding.UTF_8,
					 outputEncoding: encode.Encoding.BASE_64
				 });
				 // Envio el xml
				 var req = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://www.fact.com.mx/schema/ws">';
				 req += '   <soapenv:Header/>';
				 req += '   <soapenv:Body>';
				 req += '      <ws:RequestTransaction>';
				 req += '         <ws:Requestor>' + requestor + '</ws:Requestor>';
				 req += '         <ws:Transaction>' + OPERATION + '</ws:Transaction>';
				 req += '         <ws:Country>MX</ws:Country>';
				 req += '         <ws:Entity>' + jsonData.rfcemisor + '</ws:Entity>';
				 // req += '         <ws:Entity>XAXX010101000</ws:Entity>';
				 req += '         <ws:User>' + user + '</ws:User>';
				 req += '         <ws:UserName>' + userName + '</ws:UserName>';
				 req += '         <ws:Data1> ' + xmlStrB64 + ' </ws:Data1>';
				 //req += '         <ws:Data2>COMPROBANTE PDF</ws:Data2>';
				 //req += '         <ws:Data2>XML</ws:Data2>';
				 req += '         <ws:Data2>PDF XML</ws:Data2>';
				 req += '         <ws:Data3></ws:Data3>';
				 req += '      </ws:RequestTransaction>';
				 req += '   </soapenv:Body>';
				 req += '</soapenv:Envelope>';

				 var headers = {
					 'Content-Type': 'text/xml; charset=utf-8',
					 'Content-Length': '"' + req.length + '"',
					 'SOAPAction': 'http://www.fact.com.mx/schema/ws/RequestTransaction',
				 };

				 log.audit({
					 title: 'url2',
					 details: JSON.stringify(url)
				 });
				 log.audit({
					 title: 'req',
					 details: JSON.stringify(req)
				 });
				 log.audit({
					 title: 'headers',
					 details: JSON.stringify(headers)
				 });
				 if (!test) {
					 var serviceResponse = https.post({
						 url: url,
						 body: req,
						 headers: headers
					 });
					 // Obtengo el resultado
					 if(serviceResponse.code == 200){
					 	var parsedResponse = parsePACResponse(serviceResponse.body);
					 }
					 log.audit('parsedResponse',parsedResponse);
					 var responseText = serviceResponse.body;
					 log.audit({
						 title: 'responseText',
						 details: JSON.stringify(responseText)
					 });

					 var resp = createFile(
						 'serviceResponse '+nombreInvoice+'_'+ date,
						 file.Type.PLAINTEXT,
						 responseText,
						 'Respuesta SAT',
						 file.Encoding.UTF8,
						 runtime.getCurrentScript().getParameter('custscript_drt_glb_folder')
					 );
					 log.audit("resp", resp);

					 var xml_response = xml.Parser.fromString({
						 text: responseText
					 });
					 log.audit("xml_response", xml_response);

					 var nodeResponse = xml_response.getElementsByTagName({
						 tagName: 'Response'
					 })[0];
					 log.audit("nodeResponse", nodeResponse);
					 // verifico el resultado de la solicitud
					 var result = nodeResponse.getElementsByTagName({
						 tagName: 'Result'
					 })[0].textContent;
					 log.audit("resultt", result);

					//if (result == 'false' || result == 'true') {
					if (result == 'false') {
						 var description = nodeResponse.getElementsByTagName({
							 tagName: 'Data'
						 })[0].textContent;

						 log.error('FALLA_DE_VALIDACION_SAT', description);
						 log.audit('ID FACTURA ERROR', jsonData.idinvoice);

						 var invoiceObj = record.load({
							type: search.Type.INVOICE,
							id: jsonData.idinvoice,
						});
						var oportunidad = invoiceObj.getValue("opportunity");
						log.audit("OPORTUNIDAD ERROR", oportunidad);
						var fecha = invoiceObj.getValue("createddate");
						log.audit("FECHA ERROR", fecha);
						var entity = invoiceObj.getValue("entity");
						log.audit("entity", entity);
						var preLiqCilindro = invoiceObj.getValue("custbody_ptg_registro_pre_liq");
						log.audit("preLiqCilindro", preLiqCilindro);
						var preLiqEstacionario = invoiceObj.getValue("custbody_ptg_registro_pre_liq_esta");
						log.audit("preLiqEstacionario", preLiqEstacionario);
						var preLiqCarburacion = invoiceObj.getValue("custbody_ptg_registro_pre_liq_carb");
						log.audit("preLiqCarburacion", preLiqCarburacion);
						var ventaAnden = invoiceObj.getValue("custbody_ptg_registro_liq_venta_anden");
						log.audit("ventaAnden", ventaAnden);
						var tipoServicio = invoiceObj.getValue("custbody_ptg_tipo_servicio");
						log.audit("tipoServicio", tipoServicio);
						var tiposDePagos = invoiceObj.getValue("custbody_ptg_tipos_de_pago");
						log.audit("tiposDePagos", tiposDePagos);
						var liqViejaEspecial = invoiceObj.getValue("custbody_ptg_liq_viaje_especial");
						log.audit("liqViejaEspecial", liqViejaEspecial);

						var customRecFactura = record.create({
							type: "customrecord_drt_ptg_registro_factura",
							isDynamic: true,
						});
						var recIdSaved = customRecFactura.save();
						log.debug({
							title: "Registro de facturacion con error creado",
							details: "Id Saved: " + recIdSaved,
						});


						var objSumbitCR = {
							custrecord_ptg_id_oportunidad: oportunidad,
							custrecord_ptg_id_factura: jsonData.idinvoice,
							custrecord_ptg_cliente_facturado: entity,
							custrecord_ptg_status: description,
							custrecord_ptg_fecha_creacion: fecha,
							custrecord_ptg_tipos_pagos: tiposDePagos,
						}

						if(tipoServicio == 1){
							objSumbitCR.custrecord_ptg_num_viaje_fac_ = preLiqCilindro || '';
						}
						else if(tipoServicio == 2){
							objSumbitCR.custrecord_ptg_num_viaje_fac_estac = preLiqEstacionario || '';
						}
						else if(tipoServicio == 3){
							objSumbitCR.custrecord_ptg_registro_fac_carburacion = preLiqCarburacion || '';
						} else if(tipoServicio == 5){
							objSumbitCR.custrecord_ptg_venta_anden = ventaAnden || '';
						} else if(tipoServicio == 7){
							objSumbitCR.custrecord_ptg_registro_fac_viaje_especi = liqViejaEspecial || '';
						}
 
						record.submitFields({
							id: recIdSaved,
							type: "customrecord_drt_ptg_registro_factura",
							values: objSumbitCR,
						})



						/*if(tipoServicio == 1){
							log.audit("TIPOSERVICIO 1");
							var objSumbitCR = {
								id_oportunidad: oportunidad,
								id_factura: jsonData.idinvoice,
								status: description,
								fecha: fecha,
								entity: entity,
								registro_pre_liq: preLiqCilindro,
							}
							log.audit("objSumbitCR ERROR", objSumbitCR);
	
							var customRecFactura = record.create({
								type: "customrecord_drt_ptg_registro_factura",
								isDynamic: true,
							  });
	
							  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
							  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
							  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
							  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
							  customRecFactura.setValue("custrecord_ptg_num_viaje_fac_", objSumbitCR.registro_pre_liq);
	
							  var recIdSaved = customRecFactura.save();
							  log.debug({
								title: "Regisro de facturacion con error creado",
								details: "Id Saved: " + recIdSaved,
							  });
						}
						if(tipoServicio == 2){
							log.audit("TIPOSERVICIO 2");
							var objSumbitCR = {
								id_oportunidad: oportunidad,
								id_factura: jsonData.idinvoice,
								status: description,
								fecha: fecha,
								entity: entity,
								registro_pre_liq: preLiqEstacionario,
							}
							log.audit("objSumbitCR ERROR", objSumbitCR);
	
							var customRecFactura = record.create({
								type: "customrecord_drt_ptg_registro_factura",
								isDynamic: true,
							  });
	
							  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
							  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
							  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
							  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
							  customRecFactura.setValue("custrecord_ptg_num_viaje_fac_estac", objSumbitCR.registro_pre_liq);
	
							  var recIdSaved = customRecFactura.save();
							  log.debug({
								title: "Registo de facturacion con error creado",
								details: "Id Saved: " + recIdSaved,
							  });
						}
						if(tipoServicio == 3){
							log.audit("TIPOSERVICIO 3");
							var objSumbitCR = {
								id_oportunidad: oportunidad,
								id_factura: jsonData.idinvoice,
								status: description,
								fecha: fecha,
								entity: entity,
								registro_pre_liq: preLiqCarburacion,
							}
							log.audit("objSumbitCR ERROR", objSumbitCR);
	
							var customRecFactura = record.create({
								type: "customrecord_drt_ptg_registro_factura",
								isDynamic: true,
							  });
	
							  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
							  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
							  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
							  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
							  customRecFactura.setValue("custrecord_ptg_registro_fac_carburacion", objSumbitCR.registro_pre_liq);
	
							  var recIdSaved = customRecFactura.save();
							  log.debug({
								title: "Registo de facturacion con error creado",
								details: "Id Saved: " + recIdSaved,
							  });
						}*/




						var objSubmitError = {
							custbody_psg_ei_template: 123, //PLANTILLA DEL DOCUMENTO ELECTRÓNICO: MySuite outbound invoice template
							custbody_psg_ei_sending_method: 11, //MÉTODO DE ENVÍO DE DOCUMENTOS ELECTRÓNICOS: MySuite
							custbody_psg_ei_status: 5, //ESTADO DEL DOCUMENTO ELECTRÓNICO (Error en la generación)
							custbody_ptg_registro_facturacion: recIdSaved,
						};
						log.audit("objSubmitError aqui salia error", objSubmitError);


						var id = record.submitFields({
							type: record.Type.INVOICE,
							id: jsonData.idinvoice,
							values: objSubmitError,
							options: {
								enableSourcing: true,
								ignoreMandatoryFields: true
							}
						});
						log.audit({
							title: 'id Error Invoice',
							details: JSON.stringify(id)
						});

						 

						//Traza de documento electrónico
/*						var customRecAuditoria = record.create({
							type: "customrecord_psg_ei_audit_trail",
							isDynamic: true,
						  });
						  customRecAuditoria.setValue("custrecord_psg_ei_audit_transaction", objSumbitCR.id_factura);
						  customRecAuditoria.setValue("custrecord_psg_ei_audit_entity", objSumbitCR.entity);
						  customRecAuditoria.setValue("custrecord_psg_ei_audit_event", 21);
						  customRecAuditoria.setValue("custrecord_psg_ei_audit_owner", runtime.getCurrentUser().id);
						  customRecAuditoria.setValue("custrecord_psg_ei_audit_details", objSumbitCR.status);
						  var recIdSavedAuditoria = customRecAuditoria.save();
						  log.debug({
							title: "Registro de traza de facturacion con error creado",
							details: "Id Saved: " + recIdSavedAuditoria,
						  });*/


						 return;
					 } else {

						 // proceso de forma correcta
						 /*resultGUID = nodeResponse.getElementsByTagName({
							 tagName: 'DocumentGUID'
						 })[0].textContent;*/
						 var resultGUID = parsedResponse.cfdiUuid;

						 // Obtiene el Timestamp de la certificación
						 /*var resultTimeStamp = nodeResponse.getElementsByTagName({
                            tagName: 'IssuedTimeStamp'
                        })[0].textContent;
						log.audit("resultTimeStamp", resultTimeStamp);*/
						var resultTimeStamp = parsedResponse.dateOfCertification;

						 var responseData1 = xml_response.getElementsByTagName({
							 tagName: 'ResponseData1'
						 })[0].textContent;
						 log.audit("responseData1", responseData1);

						 var responseData2 = xml_response.getElementsByTagName({
							 tagName: 'ResponseData3'
						 })[0].textContent;
						 log.audit("responseData2", responseData2);

						 var newRecord = record.create({
							 type: 'customrecord_drt_global_invoice_response',
							 isDynamic: true
						 });
						 log.audit("newRecord", newRecord);
						 
						 // Agrego el registro personalizado
						  
						 //newRecord.setValue({
						 //	fieldId: 'custrecord_drt_json_data',
						 //	value: JSON.stringify(jsonData)
						 //});
						 //newRecord.setValue({
						 //	fieldId: 'custrecord_drt_base64_xml',
						 //	value: responseData1
						 //}); 
						 
						 //var resp = {};
						// var resppdf = {};
						 if (responseData1) {
							 log.audit("if responseData1");
							var respxml = createFile(
								"XML_"+nombreInvoice+'_'+resultGUID,
								 file.Type.XMLDOC,
								 encode.convert({
									 string: responseData1,
									 inputEncoding: encode.Encoding.BASE_64,
									 outputEncoding: encode.Encoding.UTF_8
								 }),
								 'XML Certificado',
								 file.Encoding.UTF8,
								 runtime.getCurrentScript().getParameter('custscript_drt_glb_folder')
							 ) || '';
							 log.audit("if responseData1 fin XML", respxml);
						 }
						 
						 if (responseData2) {
							log.audit("if responseData2");
							var resppdf = createFile(
								 "PDF_"+nombreInvoice+'_'+resultGUID,
								 file.Type.PDF,
								 responseData2,
								 'PFD Certificado',
								 file.Encoding.UTF8,
								 runtime.getCurrentScript().getParameter('custscript_drt_glb_folder')
							 ) || '';
							 log.audit("if responseData2 fin PDF", resppdf);
						 }

						 //newRecord.setValue({fieldId: 'custrecord_drt_base64_pdf', value: responseData2});
						
						 if (respxml.success) {
							newRecord.setValue({
								fieldId: 'custrecord_drt_xml_sat',
								value: respxml.data
							});
						}
						 if (resppdf.success) {
							 newRecord.setValue({
								 fieldId: 'custrecord_drt_pdf_sat',
								 value: resppdf.data
							 });
						 }
						 if (idFileXML.success) {
							 newRecord.setValue({
								 fieldId: 'custrecord_drt_doc_xml',
								 value: idFileXML.data
							 });
							 try {
								 email.send({
									 //author: 1729,
									 //author: 37276,
									 author: ['jose.fernandez@disruptt.mx'],
									 recipients: ['jose.fernandez@disruptt.mx'],
									 subject: 'Timbrado PotoGas ' + jsonData.rfcemisor,
									 body: 'Factura ' + resultGUID,
									 attachments: [file.load({
										 id: idFileXML.data
									 })],

								 });
								 log.audit("email success")
							 } catch (error) {
								 log.error({
									 title: 'error email',
									 details: JSON.stringify(error)
								 });
							 }
						 }
						 newRecord.setValue({
							 fieldId: 'custrecord_drt_guid',
							 value: resultGUID
						 });
						 newRecord.setValue({
							fieldId: 'custrecord_drt_factura',
							value: jsonData.idinvoice
						});

						 var recordId = newRecord.save({
							 enableSourcing: true,
							 ignoreMandatoryFields: true
						 });

						 /***Actualiza Datos en el record de Factura ****/
						 var idSubmit = record.submitFields({
							 type: record.Type.INVOICE,
							 id: jsonData.idinvoice,
							 values: {
								 'custbody_mx_cfdi_uuid': parsedResponse.cfdiUuid,
								 'custbody_mx_cfdi_certify_timestamp': parsedResponse.dateOfCertification,
								 'custbody_psg_ei_certified_edoc': respxml.data,
								 'custbody_psg_ei_generated_edoc': "",
								 'custbody_edoc_generated_pdf': resppdf.data,
								 //'custbody_mx_cfdi_usage': context.request.parameters.custbody_mx_cfdi_usage,
								// 'custbody_psg_ei_template': 123,
								// 'custbody_psg_ei_sending_method': 11,
								// 'custbody_psg_ei_status': 3,
								 'custbody_ptg_registro_facturacion': recIdSaved,
								 'custbody_mx_cfdi_cadena_original': parsedResponse.cfdiCadenaOriginal,
								 //'custbody_mx_cfdi_folio':'CUSTINVC13605',
								 //'custbody_mx_cfdi_issue_datetime': parsedResponse.dateOfCertification,
								 'custbody_mx_cfdi_issuer_serial': parsedResponse.noCertificado,
								 'custbody_mx_cfdi_qr_code': parsedResponse.cfdiQrCode,
								 'custbody_mx_cfdi_sat_serial': parsedResponse.noCertificadoSat,
								 'custbody_mx_cfdi_sat_signature': parsedResponse.selloSat,
								 'custbody_mx_cfdi_signature': parsedResponse.selloCfd,
							 },
							 options: {
								 enableSourcing: false,
								 ignoreMandatoryFields: true
							 }
						 });

						 log.debug("Factura actualizada", idSubmit);


						 log.audit({
							 title: 'id Error Invoice',
							 details: JSON.stringify(id)
							});

					 }
				 }
			 }
			 
			 if (!test) {
				 log.audit("!test, !test");
				 // Actualizo las transaaciones con los datos de la factura global
				/* if (resp.success) {
					 log.audit("resp.success");
					 newRecord.setValue({
						 fieldId: 'custrecord_drt_xml_sat',
						 value: resp.data
					 });
				 }
				 if (resppdf.success) {
					 log.audit("resppdf.success");
					 newRecord.setValue({
						 fieldId: 'custrecord_drt_pdf_sat',
						 value: resp.data
					 });
				 }
				 if (idFileXML.success) {
					 log.audit("idFileXML.success");
					 newRecord.setValue({
						 fieldId: 'custrecord_drt_doc_xml',
						 value: idFileXML.data
					 });
				 }*/
				// for (var i = 0; i < jsonData.items.length; i++) {

					var invoiceObj = record.load({
                        type: search.Type.INVOICE,
                        id: jsonData.idinvoice,
                    });
                    var oportunidad = invoiceObj.getValue("opportunity");
                    log.audit("oportunidad", oportunidad);
					var fecha = invoiceObj.getValue("createddate");
					log.audit("fecha", fecha);
					var entity = invoiceObj.getValue("entity");
					log.audit("entity", entity);
					var preLiqCilindro = invoiceObj.getValue("custbody_ptg_registro_pre_liq");
					log.audit("preLiqCilindro", preLiqCilindro);
					var preLiqEstacionario = invoiceObj.getValue("custbody_ptg_registro_pre_liq_esta");
					log.audit("preLiqEstacionario", preLiqEstacionario);
					var preLiqCarburacion = invoiceObj.getValue("custbody_ptg_registro_pre_liq_carb");
					log.audit("preLiqCarburacion", preLiqCarburacion);
					var ventaAnden = invoiceObj.getValue("custbody_ptg_registro_liq_venta_anden");
					log.audit("ventaAnden", ventaAnden);
					var tipoServicio = invoiceObj.getValue("custbody_ptg_tipo_servicio");
					log.audit("tipoServicio", tipoServicio);
					var tiposDePagos = invoiceObj.getValue("custbody_ptg_tipos_de_pago");
					log.audit("tiposDePagos", tiposDePagos);

					var customRecFactura = record.create({
						type: "customrecord_drt_ptg_registro_factura",
						isDynamic: true,
					});

					var recIdSaved = customRecFactura.save();
					log.debug({
						title: "Registro de facturacion creado",
						details: "Id Saved: " + recIdSaved,
					});

					var objSumbitCR = {
						custrecord_ptg_id_oportunidad: oportunidad,
						custrecord_ptg_id_factura: jsonData.idinvoice,
						custrecord_ptg_cliente_facturado: entity,
						custrecord_ptg_pdf_generado: resppdf.data,
						custrecord_ptg_xml_generado: respxml.data,
						custrecord_ptg_documento_xml: idFileXML.data,
						custrecord_ptg_status: 'Success',
						custrecord_ptg_fecha_creacion: fecha,
						custrecord_ptg_tipos_pagos: tiposDePagos,
						//entity: entity,
					}

					if(tipoServicio == 1){
						objSumbitCR.custrecord_ptg_num_viaje_fac_ = preLiqCilindro || '';
					}
					else if(tipoServicio == 2){
						objSumbitCR.custrecord_ptg_num_viaje_fac_estac = preLiqEstacionario || '';
					}
					else if(tipoServicio == 3){
						objSumbitCR.custrecord_ptg_registro_fac_carburacion = preLiqCarburacion || '';
					}
					else if(tipoServicio == 5){
						objSumbitCR.custrecord_ptg_venta_anden = ventaAnden || '';
					}

					record.submitFields({
						id: recIdSaved,
						type: "customrecord_drt_ptg_registro_factura",
						values: objSumbitCR,
					})

					/*if(tipoServicio == 1){
						var objSumbitCR = {
							id_oportunidad: oportunidad,
							id_factura: jsonData.idinvoice,
							documento_pdf_cert: resppdf.data,
							documento_xml_cert: respxml.data,
							documento_xml: idFileXML.data,
							status: 'Success',
							fecha: fecha,
							entity: entity,
							registro_pre_liq: preLiqCilindro,
						}
						log.audit("objSumbitCR", objSumbitCR);
	
						var customRecFactura = record.create({
							type: "customrecord_drt_ptg_registro_factura",
							isDynamic: true,
						  });
				  
						  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
						  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
						  customRecFactura.setValue("custrecord_ptg_pdf_generado", objSumbitCR.documento_pdf_cert);
						  customRecFactura.setValue("custrecord_ptg_xml_generado", objSumbitCR.documento_xml_cert);
						  customRecFactura.setValue("custrecord_ptg_documento_xml", objSumbitCR.documento_xml);
						  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
						  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
						  customRecFactura.setValue("custrecord_ptg_num_viaje_fac_", objSumbitCR.registro_pre_liq);
				  
						  var recIdSaved = customRecFactura.save();
						  log.debug({
							title: "Registo de facturacion creado",
							details: "Id Saved: " + recIdSaved,
						  });
					}

					if(tipoServicio == 2){
						var objSumbitCR = {
							id_oportunidad: oportunidad,
							id_factura: jsonData.idinvoice,
							documento_pdf_cert: resppdf.data,
							documento_xml_cert: respxml.data,
							documento_xml: idFileXML.data,
							status: 'Success',
							fecha: fecha,
							entity: entity,
							registro_pre_liq_esta: preLiqEstacionario,
						}
						log.audit("objSumbitCR", objSumbitCR);
	
						var customRecFactura = record.create({
							type: "customrecord_drt_ptg_registro_factura",
							isDynamic: true,
						  });
				  
						  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
						  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
						  customRecFactura.setValue("custrecord_ptg_pdf_generado", objSumbitCR.documento_pdf_cert);
						  customRecFactura.setValue("custrecord_ptg_xml_generado", objSumbitCR.documento_xml_cert);
						  customRecFactura.setValue("custrecord_ptg_documento_xml", objSumbitCR.documento_xml);
						  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
						  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
						  customRecFactura.setValue("custrecord_ptg_num_viaje_fac_estac", objSumbitCR.registro_pre_liq_esta);
				  
						  var recIdSaved = customRecFactura.save();
						  log.debug({
							title: "Registo de facturacion creado",
							details: "Id Saved: " + recIdSaved,
						  });
					}

					if(tipoServicio == 3){
						var objSumbitCR = {
							id_oportunidad: oportunidad,
							id_factura: jsonData.idinvoice,
							documento_pdf_cert: resppdf.data,
							documento_xml_cert: respxml.data,
							documento_xml: idFileXML.data,
							status: 'Success',
							fecha: fecha,
							entity: entity,
							registro_pre_liq_carb: preLiqCarburacion,
						}
						log.audit("objSumbitCR", objSumbitCR);
	
						var customRecFactura = record.create({
							type: "customrecord_drt_ptg_registro_factura",
							isDynamic: true,
						  });
				  
						  customRecFactura.setValue("custrecord_ptg_id_oportunidad", objSumbitCR.id_oportunidad);
						  customRecFactura.setValue("custrecord_ptg_id_factura", objSumbitCR.id_factura);
						  customRecFactura.setValue("custrecord_ptg_pdf_generado", objSumbitCR.documento_pdf_cert);
						  customRecFactura.setValue("custrecord_ptg_xml_generado", objSumbitCR.documento_xml_cert);
						  customRecFactura.setValue("custrecord_ptg_documento_xml", objSumbitCR.documento_xml);
						  customRecFactura.setValue("custrecord_ptg_status", objSumbitCR.status);
						  customRecFactura.setValue("custrecord_ptg_fecha_creacion", objSumbitCR.fecha);
						  customRecFactura.setValue("custrecord_ptg_registro_fac_carburacion", objSumbitCR.registro_pre_liq_carb);
				  
						  var recIdSaved = customRecFactura.save();
						  log.debug({
							title: "Registo de facturacion creado",
							details: "Id Saved: " + recIdSaved,
						  });
					}*/

					


					  //Traza de documento electrónico
/*					  var customRecAuditoria = record.create({
						type: "customrecord_psg_ei_audit_trail",
						isDynamic: true,
					  });
					  customRecAuditoria.setValue("custrecord_psg_ei_audit_transaction", objSumbitCR.id_factura);
					  customRecAuditoria.setValue("custrecord_psg_ei_audit_entity", objSumbitCR.entity);
					  customRecAuditoria.setValue("custrecord_psg_ei_audit_event", 3);
					  customRecAuditoria.setValue("custrecord_psg_ei_audit_owner", runtime.getCurrentUser().id);
					  customRecAuditoria.setValue("custrecord_psg_ei_audit_details", "Documento electrónico correctamente certificado");
					  var recIdSavedAuditoria = customRecAuditoria.save();
					  log.debug({
						title: "Registro de traza de facturacion creado",
						details: "Id Saved: " + recIdSavedAuditoria,
					  });*/

					  var objSubmit = {
						custbody_mx_cfdi_uuid: resultGUID,
						custbody_drt_psg_ei_generated_edoc: respxml.data, //DRT - DOCUMENTO ELECTRÓNICO GENERADO (CERTIFICADO)
						custbody_psg_ei_certified_edoc: idFileXML.data, //DOCUMENTO ELECTRÓNICO CERTIFICADO (NO CERTIFICADO)
						custbody_edoc_generated_pdf: resppdf.data, //PDF GENERDO
						custbody_psg_ei_status: 3, //ESTADO DEL DOCUMENTO ELECTRÓNICO (Para generación)
						custbody_ptg_registro_facturacion: recIdSaved,
						// custbody_mx_cfdi_usage: value1,
						// custbody_mx_txn_sat_payment_method: value2,
						// custbody_mx_txn_sat_payment_term: value3,
					};
					log.audit("objSubmit", objSubmit);

					/* if (runtime.getCurrentScript().getRemainingUsage() <= 3000 && (i + 1) < jsonData.items.length) {
						 log.audit("runtime.getCurrentScript().getRemainingUsage() <= 3000 && (i + 1) < jsonData.items.length)");
						 var status = task.create({
							 taskType: task.TaskType.SCHEDULED_SCRIPT,
							 scriptId: runtime.getCurrentScript().id,
							 deploymentId: runtime.getCurrentScript().deploymentId,
							 params: {
								 custscript_drt_glb_uuid: resultGUID,
								 custscript_drt_glb_folio: jsonData.idsetfol
							 }
						 });
						 if (status == 'QUEUED') {
							 return;
						 }
					 }*/
					 // var value1 = runtime.getCurrentScript().getParameter('custscript_drt_glb_usagecfdi');
					 // var value2 = runtime.getCurrentScript().getParameter('custscript_drt_glb_payform_sat');
					 // var value3 = runtime.getCurrentScript().getParameter('custscript_drt_glb_paymethod_sat');

					 var id = record.submitFields({
						 type: record.Type.INVOICE,
						 //id: jsonData.items[i].idcashsales,
						 id: jsonData.idinvoice,
						 values: objSubmit,
						 options: {
							 enableSourcing: true,
							 ignoreMandatoryFields: true
						 }
					 });
					 log.audit({
						 title: 'id 900',
						 details: JSON.stringify(id)
					 });

				 //}
				 // actualizo el numero de serie
				 if (jsonData.idsetfol) {
					 var crSerial = search.lookupFields({
						 type: 'customrecord_drt_setup_serial_gi',
						 id: jsonData.idsetfol,
						 columns: ['custrecord_drt_current']
					 });
					 var nextNumber = crSerial.custrecord_drt_current || 1;
					 nextNumber++;
					 var id = record.submitFields({
						 type: 'customrecord_drt_setup_serial_gi',
						 id: jsonData.idsetfol,
						 values: {
							 custrecord_drt_current: nextNumber
						 }
					 });
				 }
			 }
			 log.audit('Remaining Usage end execute', runtime.getCurrentScript().getRemainingUsage());
			 log.audit('Proceso Finalizado...');
			 
		 } catch (err) {
			 log.error({
				 title: 'err',
				 details: JSON.stringify(err)
			 });
		 }
	 }

	 return {
		onRequest: execute
	 };
 });