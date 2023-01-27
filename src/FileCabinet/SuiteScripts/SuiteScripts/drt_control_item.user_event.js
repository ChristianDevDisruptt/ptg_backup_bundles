/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
 define(['N/search', 'N/runtime', 'N/record'],
 /**
* @param{search} search
*/
 (search, runtime, record) => {
     /**
      * Defines the function definition that is executed before record is loaded.
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
      * @param {Form} scriptContext.form - Current form
      * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
      * @since 2015.2
      */
     const beforeLoad = (scriptContext) => {


         /*Crear campo dinamico que sirva como un datasource de busquedas guardadas para la impresion de pdf*/


         //crear campo dinamico


     }

     /**
      * Defines the function definition that is executed before record is submitted.
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {Record} scriptContext.oldRecord - Old record
      * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
      * @since 2015.2
      */
     const afterSubmit = (scriptContext) => {

         const newRecord = scriptContext.newRecord;
         const script = runtime.getCurrentScript();
         const fieldEdoc = "custbody_psg_ei_trans_edoc_standard";
         const fieldTemplate = "custbody_psg_ei_template";
         const fieldMethod = "custbody_psg_ei_sending_method";
         const fieldTipoUnidad = "custbody_drt_cp_unidadpeso";
         const fieldLocationOrigen = "custbody_ptg_cp_id_origen";
         const fieldLocationDestino = "custbody_ptg_cp_id_destino";
         const fieldTransport = "custbody_ptg_cp_transporte";
         const fieldFiguraTransporte = "custbody_ptg_cp_figuratransporte";
         const fieldJsonUbicacion = "custbody_ptg_cp_json_ubicacion";
         const fieldJsonTransport= "custbody_ptg_cp_json_figura_transporte";
         const fieldJsonFigura = "custbody_ptg_cp_json_figura";
         const fieldTypeTransport = "custbody_ptg_cp_tipo_transporte";
         
         const allowedSubsidiary = [];
         const fieldEmployee = {
             TIPO_FIGURA: "custentity_ptg_cp_tipofigura",
             NUM_LICENCIA: "custentity_ptg_cp_numlicencia",
             CALLE: "custentity_ptg_cp_calle",
             NUM_EXTERIOR: "custentity_ptg_cp_numext",
             NUM_INTERIOR: "custentity_ptg_cp_numinterior",
             COLONIA_SAT: "custentity_ptg_cp_colonia",
             CODIGO_POSTAL: "custentity_ptg_cp_codigopostal",
             LOCALIDAD: "custentity_ptg_cp_localidad",
             MUNICIPIO: "custentity_ptg_cp_municipio",
             ESTADO_SAT: "custentity_ptg_cp_estado"
         };

         const params = {
             method: script.getParameter({ name: 'custscript_drt_control_item_method' }),
             edoc: Number(script.getParameter({ name: 'custscript_drt_control_item_edoc' })),
             template: script.getParameter({ name: 'custscript_drt_control_item_template' }),
             tipoUnidad: 2,

         };
         log.audit("params", JSON.stringify(params));
         var createdFrom = {
             id: newRecord.getValue({ fieldId: 'createdfrom' }),
             type: "",
             numeroViaje: "",
             locationOrigen: null,
             locationDestino: null,
             locationOrigenId: null,
             locationDestinoId: null,
             transport: null,
             fieldFiguraTransporte: null,
         };

         //Obtener tipo de cretedfrom para saber si es una orden de compra o una orden de traslado
         if (createdFrom.id) {
             var searchResult = search.lookupFields({
                 type: "transaction",
                 id: createdFrom.id,
                 columns: [
                     "type",
                     "custbody_ptg_numero_viaje_destino",
                     "location",
                     "transferlocation",
                 ]
             });

             if (searchResult) {
                 createdFrom.type = searchResult.type[0].value;
                 createdFrom.numeroViaje = searchResult.custbody_ptg_numero_viaje_destino[0].value
                 createdFrom.locationOrigen = getLocationName(searchResult.location[0].value, true),
                 createdFrom.locationDestino = getLocationName(searchResult.transferlocation[0].value, false)
                 createdFrom.locationOrigenId = searchResult.location[0].value,
                 createdFrom.locationDestinoId = searchResult.transferlocation[0].value
             }
         }

         log.audit("createdFrom", JSON.stringify(createdFrom));
         //Setear metodo de envio de la carta porte
         if (params.method && createdFrom.type == "TrnfrOrd") {
             //Abrir registro de Orden de traslado
             try {
                 //
                 if (createdFrom.numeroViaje) {
                     //TABLA DE RUTAS = customrecord_ptg_tabladeviaje_enc2_
                     var searchVehicle = search.lookupFields({
                         type: "customrecord_ptg_tabladeviaje_enc2_",
                         id: createdFrom.numeroViaje,
                         columns: ['custrecord_ptg_vehiculo_tabladeviajes_', 'custrecord_ptg_chofer_tabladeviajes_']
                     });
                     createdFrom.transport = searchVehicle.custrecord_ptg_vehiculo_tabladeviajes_[0].value;
                     createdFrom.fieldFiguraTransporte = searchVehicle.custrecord_ptg_chofer_tabladeviajes_[0].value;
                   
                       log.audit("searchVehicle", JSON.stringify(searchVehicle));

                     // Busca datos del Transporte

                     var searchInTravel = search.lookupFields({
                         type: "customrecord_ptg_equipos",
                         id: createdFrom.transport,
                         columns: ["custrecord_ptg_cp_tipotransporte"
                             , "custrecord_ptg_cp_permisosct"
                             , "custrecord_ptg_licensenumber_"
                             , "custrecord_ptg_cp_configvehicular"
                             , "custrecord_ptg_cp_placa"
                             , "custrecord_ptg_anofabricacion_"
                             , "custrecord_ptg_cp_aseguradora"
                             , "custrecord_ptg_cp_polizarespciv"
                             , "custrecord_ptg_cp_asegmedamb"
                             , "custrecord_ptg_cp_polizamedamb"]
                     });

                     log.debug("searchInTravel", JSON.stringify(searchInTravel));

                     var typeTransport = searchInTravel.custrecord_ptg_cp_tipotransporte.value ||1;

                     var objTransport = {
                         tipoTransporte: "01: " + searchInTravel.custrecord_ptg_cp_tipotransporte[0].text,
                         permSCT: searchInTravel.custrecord_ptg_cp_permisosct ? searchInTravel.custrecord_ptg_cp_permisosct[0].text.split(":")[0]:"",
                         numPermisoSCT: searchInTravel.custrecord_ptg_licensenumber_,
                         configVehicular: searchInTravel.custrecord_ptg_cp_configvehicular ? searchInTravel.custrecord_ptg_cp_configvehicular[0].text.split(":")[0] : "",
                         placaVM: searchInTravel.custrecord_ptg_cp_placa,
                         anioModeloVM: searchInTravel.custrecord_ptg_anofabricacion_,
                         aseguraRespCivil: searchInTravel.custrecord_ptg_cp_aseguradora,
                         polizaRespCivil: searchInTravel.custrecord_ptg_cp_polizarespciv,
                         aseguraMedAmbiente: searchInTravel.custrecord_ptg_cp_asegmedamb,
                         polizaMedAmbiente: searchInTravel.custrecord_ptg_cp_polizamedamb
                     };
                     log.debug("objTransport", JSON.stringify(objTransport));

                     // Busca datos de la Figura de Transporte

                     var searchInFiguraTrans = search.lookupFields({
                         type: "employee",
                         id: createdFrom.fieldFiguraTransporte,
                         columns: ["custentity_ptg_cp_tipofigura"
                             , "custentity_ptg_cp_numlicencia"
                             , "custentity_ptg_cp_calle"
                             , "custentity_ptg_cp_numext"
                             , "custentity_ptg_cp_numinterior"
                             , "custentity_ptg_cp_colonia"
                             , "custentity_ptg_cp_codigopostal"
                             , "custentity_ptg_cp_localidad"
                             , "custentity_ptg_cp_municipio"
                             , "custentity_mx_rfc"
                             , "custentity_ptg_cp_estado"]
                     });

                     log.debug("searchInFiguraTrans", JSON.stringify(searchInFiguraTrans));

                     var objFiguraTransport = {
                         tipoFigura:searchInFiguraTrans.custentity_ptg_cp_tipofigura? searchInFiguraTrans.custentity_ptg_cp_tipofigura[0].text.substring(0,2): "" ,
                         numlicencia: searchInFiguraTrans.custentity_ptg_cp_numlicencia,
                         calle: searchInFiguraTrans.custentity_ptg_cp_calle,
                         numeroexterior: searchInFiguraTrans.custentity_ptg_cp_numext,
                         numerointerior: searchInFiguraTrans.custentity_ptg_cp_numinterior,
                         colonia: searchInFiguraTrans.custentity_ptg_cp_colonia,
                         codigopostal: searchInFiguraTrans.custentity_ptg_cp_codigopostal,
                         localidad: searchInFiguraTrans.custentity_ptg_cp_localidad,
                         municipio: searchInFiguraTrans.custentity_ptg_cp_municipio,
                         estado: searchInFiguraTrans.custentity_ptg_cp_estado,
                         rfc: searchInFiguraTrans.custentity_mx_rfc,
                         residenciafiscalfigura: 'MEX'

                     };
                     log.debug("objFiguraTransport", JSON.stringify(objFiguraTransport));


                 }
             } catch (e) {
                 log.error("Error on get transport data", e);
             }

             log.audit("save record", JSON.stringify(params));
             log.audit("save record", JSON.stringify(createdFrom));

             //setear ubicacion

             var objUbicacion = [];

            //Obtiene datos de Ubicación Origen

            // Load the record.
           var recOrigen = record.load({
                type: record.Type.LOCATION,
                id: createdFrom.locationOrigenId,
                isDynamic: true
            });

            /*recOrigen.selectNewLine({
                sublistId: 'addressbook'
            });*/

            var subrecOrigen = recOrigen.getSubrecord({
                fieldId: 'mainaddress'
            });

            /*let subrecOrigen = recOrigen.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            })*/

            // Create a variable to initialize it to the
            // value of the subrecord's city field.
            var calleValue = subrecOrigen.getValue({
                fieldId: 'custrecord_streetname'
            });

            var numValue = subrecOrigen.getValue({
                fieldId: 'custrecord_streetnum'
            });

            var colValue = subrecOrigen.getValue({
                fieldId: 'custrecord_colonia'
            });

            var munValue = subrecOrigen.getValue({
                fieldId: 'custrecord_village'
            });

            var zipValue = subrecOrigen.getValue({
                fieldId: 'zip'
            });

            var stateValue = subrecOrigen.getValue({
                fieldId: 'custrecord_ptg_estado'
            });

             var objOrigenUbicacion = {
                   "tipoEstacion": "",
                 "tipoUbicacion": "Origen",
                 "idUbicacion": createdFrom.locationOrigen,
                   "nombreRemitenteDestinatario": "",
                 "numRegIdTrib": "",
                 "residenciaFiscal": "MEX",
                 "numEstacion": "",
                 "zip": zipValue,
                 "nombreEstacion": "",
                 "navegacionTrafico": "",
                 "domicilioCalle": calleValue,
                 "domicilioNumExt": numValue,
                 "domicilioNumInt": "",
                 "domicilioColonia": colValue,
                 "domicilioLocalidad": stateValue,
                 "domicilioReferencia": "",
                 "domicilioMunicipio": munValue,
                 "domicilioPais": "MEX",
             }

             var recDestino = record.load({
                type: record.Type.LOCATION,
                id: createdFrom.locationDestinoId,
                isDynamic: true
            });

            // Retrieve the subrecord associated with that same line.
            /*var subrecDestino = recDestino.getSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress',
                line: 0
            });*/

            var subrecDestino = recDestino.getSubrecord({
                fieldId: 'mainaddress'
            });

            /*recDestino.selectNewLine({
                sublistId: 'addressbook'
         });              
            let subrecDestino = recDestino.getCurrentSublistSubrecord({
                sublistId: 'addressbook',
                fieldId: 'addressbookaddress'
            })*/

            calleValue = subrecDestino.getValue({
                fieldId: 'custrecord_streetname'
            });

            numValue = subrecDestino.getValue({
                fieldId: 'custrecord_streetnum'
            });

            colValue = subrecDestino.getValue({
                fieldId: 'custrecord_colonia'
            });

            munValue = subrecDestino.getValue({
                fieldId: 'custrecord_village'
            });

            zipValue = subrecDestino.getValue({
                fieldId: 'zip'
            });

            stateValue = subrecDestino.getValue({
                fieldId: 'custrecord_ptg_estado'
            });

             var objDestinoUbicacion = {
                 "distanciaRecorrida": "90.00",
                 "tipoUbicacion": "Destino",
                 "idUbicacion": createdFrom.locationDestino,
                 "nombreRemitenteDestinatario": "",
                 "numRegIdTrib": "",
                 "residenciaFiscal": "MEX",
                 "numEstacion": "",
                 "zip": zipValue,
                 "nombreEstacion": "",
                 "navegacionTrafico": "",
                 "domicilioCalle": calleValue,
                 "domicilioNumExt": numValue,
                 "domicilioNumInt": "",
                 "domicilioColonia": colValue,
                 "domicilioLocalidad": stateValue,
                 "domicilioReferencia": "",
                 "domicilioMunicipio": munValue,
                 "domicilioPais": "MEX",
             }

             objUbicacion.push(objOrigenUbicacion);
             objUbicacion.push(objDestinoUbicacion);

            /*setFieldValue(newRecord, fieldEdoc, params.edoc);
            setFieldValue(newRecord, fieldMethod, params.method);
            setFieldValue(newRecord, fieldTemplate, params.template);
            setFieldValue(newRecord, fieldTipoUnidad, params.tipoUnidad);
            setFieldValue(newRecord, fieldLocationDestino, createdFrom.locationDestino,true);
            setFieldValue(newRecord, fieldLocationOrigen, createdFrom.locationOrigen,true);
            setFieldValue(newRecord, fieldTransport, createdFrom.transport);
            setFieldValue(newRecord, fieldFiguraTransporte, createdFrom.fieldFiguraTransporte);
            setFieldValue(newRecord, fieldTypeTransport, typeTransport,true);
            setFieldValue(newRecord, fieldJsonUbicacion, JSON.stringify(objUbicacion),true);
            setFieldValue(newRecord, fieldJsonTransport, JSON.stringify([objTransport]),true);
            setFieldValue(newRecord, fieldJsonFigura, JSON.stringify([objFiguraTransport]),true);*/

           
            var objSubmit = {};
            objSubmit.custbody_psg_ei_trans_edoc_standard = params.edoc;
            objSubmit.custbody_psg_ei_sending_method=params.method;
            objSubmit.custbody_psg_ei_template=params.template;
            objSubmit.custbody_drt_cp_unidadpeso=params.tipoUnidad;
            objSubmit.custbody_ptg_cp_id_destino=createdFrom.locationDestino;
            objSubmit.custbody_ptg_cp_id_origen=createdFrom.locationOrigen;
            objSubmit.custbody_ptg_cp_transporte=createdFrom.transport;
            objSubmit.custbody_ptg_cp_figuratransporte=createdFrom.fieldFiguraTransporte;
            objSubmit.custbody_ptg_cp_tipo_transporte=typeTransport;
            objSubmit.custbody_ptg_cp_json_ubicacion=JSON.stringify(objUbicacion);
            objSubmit.custbody_ptg_cp_json_figura_transporte=JSON.stringify([objTransport]);
            objSubmit.custbody_ptg_cp_json_figura=JSON.stringify([objFiguraTransport]);

            record.submitFields({
                     type: newRecord.type,
                     id: newRecord.id,
                     values: objSubmit,
                     options: {
                         enableSourcing: false,
                         ignoreMandatoryFields: true
                     }
             });
         }


     }


     const setFieldValue = (currentRecord, fieldId, value,forced) => {
         try {
             //validar si campo actual tiene valor y si no tiene valor,  se actualiza
             if (forced||!currentRecord.getValue({ fieldId: fieldId }) || currentRecord.getValue({ fieldId: fieldId }) == ""  ) {
                 currentRecord.setValue({ fieldId: fieldId, value: value });
             }
         } catch (e) {
             log.error("Error in setFieldValue", e);
         }

     }

     /*Crear formato de nombre de id de locacion para el campo de origen y destino definiendo el origen iniciando con los caracteres "ORI" y
      el destino con "DES" y el id de la locacion sean 6 digitos rellenados por 0*/
     const getLocationName = (locationId, esOrigen) => {
         var locationName = "";
         var formatedLocationId = "";
         if (locationId) {
             formatedLocationId = locationId.toString().padStart(6, "0");
             if (esOrigen) {
                 locationName = "OR" + formatedLocationId;
             } else {
                 locationName = "DE" + formatedLocationId;
             }
         }
         return locationName;
     }

     const getEmployeeData = (employeeId) => {
         const employeeSearch = search.create({
             type: "employee",
             filters: [
                 ["internalid", "anyof", employeeId]
             ],
             columns: [
                 "subsidiary",


             ],
         });
         const employeeData = employeeSearch.run().getRange({ start: 0, end: 1 });
         return employeeData[0].getValue({ name: "subsidiary" });
     }

     // Consultar custom record 



     /**
      * Defines the function definition that is executed after record is submitted.
      * @param {Object} scriptContext
      * @param {Record} scriptContext.newRecord - New record
      * @param {Record} scriptContext.oldRecord - Old record
      * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
      * @since 2015.2
      */


     return { beforeLoad, afterSubmit }

 });
