/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 08/2022
 * Script name: PTG - SERV NO CONCILIADO LIBR
 * Script id: customscript_ptg_serv_no_conciliados_lib
 * customer Deployment id: customdeploy_ptg_serv_no_conciliados_lib
 * Applied to:
 * File: drt_ptg_serv_no_conciliados_lib.js
 ******************************************************************/
/**
 * @NApiVersion 2.x
 */
define(['N/search', 'N/config', 'N/record', 'N/log'],

	function (search, config, record, log) {
		const CONST_SUBSIDIARY = 9;

		/**
		 * [getAllTransaction description]
		 * @param  {[type]} params [description]
		 * @return {[type]}        [description]
		 */
		function getAllTransaction(params) {
			var resultSearch = [];
			var rangini = 0;
			var rangend = 1000;

			log.debug("params lib", params);

			try {
				var afilters = [];
				afilters.push(['custrecord_ptg_ruta_sin_conciliar', search.Operator.ANYOF, params.vehiculo]);
				afilters.push("AND");
				afilters.push(['custrecord_ptg_cliente_sin_conciliar', search.Operator.ANYOF, "@NONE@"]);

				log.audit({
					title: 'afilters',
					details: JSON.stringify(afilters)
				});
				var acolumns = ['internalid', 'custrecord_ptg_ruta_sin_conciliar', 'custrecord_ptg_planta_sin_conciliar', 'custrecord_ptg_litros_sin_conciliar', 'custrecord_ptg_total_ser_sin_conciliar'];
				log.audit({
					title: 'acolumns',
					details: JSON.stringify(acolumns)
				});

				//SS: PTG - Registros Sin Conciliar SS
				var schRecord = search.create({
					type: "customrecord_ptg_registros_sin_conciliar",
					filters: afilters,
					columns: acolumns,
				});
				log.audit({
					title: 'schRecord',
					details: JSON.stringify(schRecord)
				});
				var searchResultCount = schRecord.runPaged().count;
				schRecord.run().each(function (row) {
					resultSearch.push({
						idInterno: row.getValue('internalid'),
						ruta: row.getValue('custrecord_ptg_ruta_sin_conciliar'),
						planta: row.getValue('custrecord_ptg_planta_sin_conciliar'),
						litros: row.getValue('custrecord_ptg_litros_sin_conciliar'),
						total: row.getValue('custrecord_ptg_total_ser_sin_conciliar')
					});
					return true;
				});


			} catch (err) {
				log.error('Error resultSearch', err);
			}
			log.audit({
				title: 'resultSearch',
				details: JSON.stringify(resultSearch)
			});
			return resultSearch;
		}
		/**
		 * [getFilebyName description]
		 * @param  {[type]} filename [description]
		 * @return {[type]}          [description]
		 */
		function getFilebyName(filename) {
			var fileId = null;
			var afilters = [{
				name: 'name',
				operator: search.Operator.IS,
				values: filename
			}];
			var acolumns = ['folder'];

			search.create({
				type: 'file',
				columns: acolumns,
				filters: afilters
			}).run().each(function (r) {
				fileId = r.id;
			});
			return fileId;
		}
		/**
		 * [getTranslate description]
		 * @return {[type]} [description]
		 */
		function getTranslate() {
			var userPrefer = config.load({
				type: config.Type.USER_PREFERENCES
			});
			var defaultHelpE = 'This is a custom field created for your account. Contact your administrator for details.';
			var defaultHelpS = 'Este es un campo personalizado creado para su cuenta. Comuníquese con su administrador para obtener más detalles.';
			var expreg = /es/;
			var strlang = expreg.test(userPrefer.getValue('LANGUAGE'));
			var label = {
				form: strlang == true ? 'Conciliación de servicios' : 'Conciliación de servicios',
				label1: strlang == true ? 'Vehículo' : 'Vehículo',
				label2: strlang == true ? 'Uso CFDI' : 'CFDI Usage',
				label3: strlang == true ? 'Metodo de Pago SAT' : 'SAT Payment Method',
				label4: strlang == true ? 'Forma de Pago SAT' : 'SAT Payment Term',
				label5: strlang == true ? 'Fecha Inicio' : 'Star Date',
				labe18: strlang == true ? 'Fecha Fin' : 'End Date',
				label6: strlang == true ? 'Registros' : 'Records',
				label7: strlang == true ? 'Subsidiaria' : 'Subsidiary',
				label8: strlang == true ? 'Cliente:Trabajo' : 'Cliente:Trabajo',
				label9: strlang == true ? 'Importe' : 'Amount',
				label10: strlang == true ? 'Arreglo' : 'Array',
				sublist: strlang == true ? 'Transacciones' : 'Transaction',
				column1: strlang == true ? 'Selecciona' : 'Select',
				column2: strlang == true ? 'Vehículo' : 'Vehículo',
				column3: strlang == true ? 'Planta' : 'Planta',
				column4: strlang == true ? 'Litros' : 'Litros',
				column5: strlang == true ? 'Total' : 'Total',
				column6: strlang == true ? 'Confirmar' : 'Confirm',
				help1: strlang == true ? defaultHelpS : defaultHelpE,
				help2: strlang == true ? defaultHelpS : defaultHelpE,
				help3: strlang == true ? defaultHelpS : defaultHelpE,
				help4: strlang == true ? defaultHelpS : defaultHelpE,
				help5: strlang == true ? defaultHelpS : defaultHelpE,
				help6: strlang == true ? defaultHelpS : defaultHelpE,
				help7: strlang == true ? defaultHelpS : defaultHelpE,
				help8: strlang == true ? defaultHelpS : defaultHelpE,
				message1: strlang == true ? 'El proceso se ha ejecutado, la actualización puede tardar algunos minutos.' : 'The process has run, the update may take some minutes.',
				message2: strlang == true ? 'Por favor, seleccionar facturas' : 'Please, select invoices',
				button1: strlang == true ? 'Buscar' : 'Search',
				button2: strlang == true ? 'Generar Documento Electrónico' : 'Generate Electronic Document',
				button3: strlang == true ? 'Certificar Documento Electrónico' : 'Certify Electronic Document',
				button4: strlang == true ? 'Enviar' : 'Send'
			};
			return label;
		}

		return {
			getAllTransaction: getAllTransaction,
			getFilebyName: getFilebyName,
			getTranslate: getTranslate,
		};
	});