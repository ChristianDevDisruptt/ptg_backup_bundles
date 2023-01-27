/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record',
    'N/search',
    'N/log',
    'N/runtime',
    'N/https',
    'N/url',
    'N/file',
    'N/render',
'N/sftp'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record,
        search,
        log,
        runtime,
        https,
        url,
        file,
        render,
        sftp) => {

        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            log.debug("hi", "hi");
            var itemfulfillmentSearchObj = search.create({
                type: "itemfulfillment",
                filters:
                [
                   ["type","anyof","ItemShip"], 
                   "AND", 
                   ["mainline","is","T"], 
                   "AND", 
                   ["createdfrom.type","anyof","TrnfrOrd"], 
                   "AND", 
                   ["createdfrom.custbody_ptg_numero_viaje_destino","noneof","@NONE@"], 
                   "AND", 
                   ["subsidiary","anyof","22","25","23"],
                  "AND", 
                   ["custbody_mx_cfdi_uuid","isempty",""],
                    //"AND",
                   //["internalId" ,"anyof",[526302,526617,516268,516872]]
                ],
                columns:
                [
                   search.createColumn({name: "type", label: "Tipo"}),
                   search.createColumn({name: "trandate", label: "Fecha"}),
                   search.createColumn({name: "tranid", label: "Número de documento"}),
                   search.createColumn({name: "createdfrom", label: "Creado desde"}),
                   search.createColumn({name: "subsidiarynohierarchy", label: "Creado desde"}),
                   search.createColumn({name: "location", label: "Creado desde"}),
                   search.createColumn({
                      name: "custbody_ptg_numero_viaje_destino",
                      join: "createdFrom",
                      label: "NÚMERO DE VIAJE DESTINO"
                   })
                ]
             });
          
        
            return itemfulfillmentSearchObj;
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            //{"recordType":"itemfulfillment","id":"519326","values":{"type":{"value":"ItemShip","text":"Ejecución de pedido de artículo"},"trandate":"21/7/2022","tranid":"9571","createdfrom":{"value":"519325","text":"Orden de traslado #1269"},"subsidiary":{"value":"25","text":"Empresa principal : GAS : POTOGAS HOLDING (CONSOLIDADO) : DISTRIBUIDORA POTOSINA DE GAS, SA DE CV"},"location":{"value":"762","text":"02-0-00000 - PLANTA SAN LUIS PERIFÉRICO"},"custbody_ptg_numero_viaje_destino.createdFrom":{"value":"924","text":"645"}}}

            try{
            const value = JSON.parse(mapContext.value);
            const transId = mapContext.key;
            const data = value.values;
            log.debug("data", data);
            const GENERATE_SU_SCRIPT = "customscript_ei_generation_service_su";
            const GENERATE_SU_DEPLOY = "customdeploy_ei_generation_service_su";
            const SEND_SU_SCRIPT = "customscript_su_send_e_invoice";
            const SEND_SU_DEPLOY = "customdeploy_su_send_e_invoice";

            const script = runtime.getCurrentScript();

            const certSendingMethodId = script.getParameter({ name: 'custscript_ei_method_certification' });

        
            const date = new Date();
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();


            const params = {
                subsidiaryName:data.subsidiarynohierarchy.text,
                certMethod: certSendingMethodId,
                locationName: data.location.text,
                day: day,
                month: month,
                year: year,
                GENERATE_SU_DEPLOY: GENERATE_SU_DEPLOY,
                GENERATE_SU_SCRIPT: GENERATE_SU_SCRIPT,
                SEND_SU_DEPLOY: SEND_SU_DEPLOY,
                SEND_SU_SCRIPT: SEND_SU_SCRIPT
            }

        
            log.debug("params", params);
            log.debug("transId", transId);


            // obtener parametro de script de metodo de generacion de elemento
            


            mapContext.write({
                key:transId,
                value:params
            });
            }catch(e){
                log.error("error", e);
            }

            
            
        }


     


        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {

         
            const transType = "itemfulfillment";

            const values = reduceContext.values;
            const transId = Number(reduceContext.key);
            log.debug("values", values);
            const line0 = JSON.parse(values[0]);
            const GENERATE_SU_SCRIPT = line0.GENERATE_SU_SCRIPT ;
            const GENERATE_SU_DEPLOY = line0.GENERATE_SU_DEPLOY ;
            const SEND_SU_SCRIPT = line0.SEND_SU_SCRIPT ;
            const SEND_SU_DEPLOY = line0.SEND_SU_DEPLOY ;
            const locationName = line0.locationName;
            const subsidiaryName = line0.subsidiaryName;

            const day = line0.day;
            const month = line0.month;
            const year = line0.year;
            const certSendingMethodId = line0.certMethod;

            log.audit("line0", line0);
            
            try {
                
                var suiteletURL = url.resolveScript({
                    scriptId: GENERATE_SU_SCRIPT,
                    deploymentId: GENERATE_SU_DEPLOY,
                    returnExternalUrl: true
                });
                var host = url.resolveDomain({
                    hostType: url.HostType.APPLICATION
                });
                log.debug("host", host);
                log.debug("suiteletURL", suiteletURL);
                var request = https.post({
                    async: true,
                    url: suiteletURL,
                    body: {
                        transId: transId,
                        transType: transType,
                        certSendingMethodId: certSendingMethodId,
                    }
                });
                log.debug("request", request);
            } catch (e) { log.error("Error", e) }

            try {
                var suiteletURL = url.resolveScript({
                    scriptId: SEND_SU_SCRIPT,
                    deploymentId: SEND_SU_DEPLOY,
                    returnExternalUrl: true
                });
                var request = https.post({
                    async: true,
                    url: suiteletURL,
                    body: {
                        transId: transId,
                        transType: transType,
                        certSendingMethodId: certSendingMethodId,
                    }
                }
                );
                log.debug("request SEND SU", request);
            } catch (e) { log.error("Error SEND_SU_SCRIPT", e) }
            var itemFulSearch= search.lookupFields({
                type: "itemfulfillment",
                id: transId,
                columns: ["custbody_psg_ei_certified_edoc"],
            });
            var transactionCert = itemFulSearch.custbody_psg_ei_certified_edoc;
            log.debug("transactionCert", transactionCert);


            if(transactionCert&& transactionCert.length>0){
            var transactionFile;
            try {
                //CONECCION SFTP Y ENVIO DE ARCHIVO

                //SUBSIDIARIA - PLANTA - AÑO - MES - DIA
                 transactionFile = render.transaction({
                    entityId: transId,
                    printMode: render.PrintMode.PDF,
                    inCustLocale: true
                });
                //var passGui = "d0e647c0f3c44b50bb156ee5a0ad0cca";
                  var passGui = "c58f487b063f4e218651b39ad6910838";
                var connection = sftp.createConnection({
                    username: 'netsuite_rioverde',
                    passwordGuid: passGui,
                    url: "207.249.139.228",
                    port:22,
                    hostKey: 'AAAAB3NzaC1yc2EAAAABIwAAAIEA0ZwtkAPK1SX+2cEP1G9DINFbGf92fPCHdq8QPghNDIKzFZlCp51c4ZbkAiZpbHpIKmDSM1LecllIT8NBem4mV0X5TdobsS7OsQ9F5QCHuHrhzYmMgX8LnfGLaZymhiQ89acP1h83qJ4/dj+95x+2f0ZcD5215PAMcqjP5z27Mgc='});
                // specify the file to upload using the N/file module

                var arrayPath = [subsidiaryName, locationName, year, month, day];
                //var fullPath = arrayPath.join("/");
                var fullPath = "/";
                var existPath= false;

                try{
                    var list = connection.list({path: fullPath});
                    log.debug("list", list);
                    existPath = true;
                }
                catch(e){
                    log.debug("No path", e);
                }

                /*if(!existPath){
                    var path=[];
                    for(var i = 0; i < arrayPath.length; i++){
                        
                        var pathName="";
                        var pathName= arrayPath[i] +'';
                        path.push(pathName.trim());
                        pathName = ''+path.join("/")+"/";
                        log.debug("pathName", pathName);

                        try{
                   
                    connection.makeDirectory({
                        path:pathName ,
                        });
                    }catch(e){
                        log.audit("creating directory ", e)
                    }
                    }
                }*/
               
              
                // upload the file to the remote server
              	log.audit("Cargar Archivo ", "Inicio" + subsidiaryName+ year+ month+ day +transId+".pdf");
                connection.upload({
                    //directory: "TEST",
                    //filename:  subsidiaryName+ year+ month+ day +transId+".pdf",
                    filename:  year+"_"+month+"_"+day+"_"+transId+".pdf",
                    file: transactionFile,
                });
              	log.audit("Cargar Archivo ", "Fin" + subsidiaryName+ year+ month+ day +transId+".pdf");
                reduceContext.write({
                    key: "1",
                    value:JSON.stringify({transId: transId,message:"OK"})
                });
            } catch (error) {
                log.error("Error SFTP", error);
                reduceContext.write({
                    key: "2",
                    value:JSON.stringify({transId: transId,message:"ERROR "+error} )
                });
            }
        }else{
            reduceContext.write({
                key: "3",
                value:JSON.stringify({transId: transId,message:"NO CERTIFICADO"})
            });
            
        }

       


        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            const result = summaryContext.output.iterator();
            //Mostrar uso de governance
            log.debug("summaryContext.usage", summaryContext.usage);
            //Mostrar tiempo de ejecucion
            log.debug("summaryContext.seconds", summaryContext.seconds);
            //Mostrar numero de yields
            log.debug("summaryContext.yields", summaryContext.yields);
            //Mostrar resultado
            log.debug("summaryContext.output", summaryContext.output);
  


            

            //SI el id del resultado es 1, es que el archivo se envio correctamente se marca fieldOkCert y fieldOkUpload, si es 2 es que no se envio correctamente se marca fieldOkCert, si es 3 es que no se envio porque el documento no esta certificado
            // el transaction esta en el value {transId: transId,message:message}
            summaryContext.output.iterator().each(function(key, value) {
                
                var okCert = "",
                    okUpload = "";
            
                if (key == 1) {
                    okCert = "T";
                    okUpload = "T";
                } else if (key == 2) {
                    okCert = "T";
                    okUpload = "F";
                } else if (key == 3) {
                    okCert = "F";
                    okUpload = "F";
                }
                log.debug("item.value", value);
                var value = JSON.parse(value);
                var transId = key;
                var message = value.message;
 
                log.debug("transId", transId);
                log.debug("message", message);
                var itemFullRecord = record.submitFields({
                    type: 'itemfulfillment',
                    id: value.transId,
                    values: {
                        "custbody_drt_check_ok_cert": okCert,
                        "custbody_drt_check_ok_upload": okUpload,
                    },
                    options: {
                        enableSourcing: false,
                        ignoreMandatoryFields: true
                    }  

                });
                log.debug("itemFullRecord", itemFullRecord);
                return true;

            })
           
            //SEGUNDO PASO: SE ACTUALIZA EL DOCUMENTO CON EL CAMPO fieldOkCert Y fieldOkUpload
         




        }

        return { getInputData, map, reduce, summarize }

    });
