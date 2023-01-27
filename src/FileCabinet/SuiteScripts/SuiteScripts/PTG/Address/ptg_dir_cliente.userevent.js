/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
       

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

            const newRecord = scriptContext.newRecord;
            const type = scriptContext.type;

            const fields={
                "idDireccion": "custrecord_ptg_direccion",
                "zonaPrecio": "custrecord_ptg_zona_precios",
                "coloniaRuta": "custrecord_ptg_colonia_ruta",
                "customer":"custrecord_ptg_cliente_dir"
            }
            const typeRecords={
                "customer": "customer",
                "coloniaRuta": "customrecord_ptg_coloniasrutas_", 
            }
          
            const idDireccion = newRecord.getValue(fields.idDireccion)

            if(type == scriptContext.UserEventType.CREATE ){

                //REVISAR SI EXISTE LA DIRECCION

                const searchObj = search.create({
                    type: newRecord.type,
                    filters: [
                        { name:fields.idDireccion, operator: 'is', values: idDireccion }
                    ],
                    columns: [
                        { name: 'internalid' },
                    ],
                });
                const searchResult = searchObj.run().getRange(0, 1);
                if (searchResult.length > 0) {
                  //  throw new Error('Ya existe una dirección Custom con esa dirección');
                }
            }
            if(type == scriptContext.UserEventType.EDIT || type == scriptContext.UserEventType.CREATE){
                var result = { coloniaRuta:"", zonaPrecio:"" };

                var customerSearchObj = search.create({
                    type: "customer",
                    filters:
                    [
                      
                       ["address.internalid","anyof",idDireccion]
                    ],
                    columns:
                    [
                       search.createColumn({
                          name: "internalid",
                          join: "Address",
                          label: "Internal ID"
                       }),
                       search.createColumn({name: "address", label: "Address"}),
                       search.createColumn({
                          name: fields.coloniaRuta,
                          join: "Address",
                          label: "PTG - COLONIA Y RUTA"
                       })
                    ]
                 });
                 var searchResultCount = customerSearchObj.runPaged().count;
                 log.debug("customerSearchObj result count",searchResultCount);
                //Obtenemos solo un resultado
                var customerSearchResult = customerSearchObj.run().getRange(0, 1);
                if (customerSearchResult.length > 0) {
                    var customerSearchResult = customerSearchResult[0];
                    var coloniaRuta = customerSearchResult.getValue({name: fields.coloniaRuta, join: "Address"});
                    var address = customerSearchResult.getValue({name: "address"});
                    var customer = customerSearchResult.id
                    result.coloniaRuta = coloniaRuta;  
                    result.address = address.replace(/\n/g, '');
                    result.customer=  customer;           
                }

                if(result.coloniaRuta ){
                    var coloniaLookup = search.lookupFields({
                        type: typeRecords.coloniaRuta,
                        id: result.coloniaRuta,
                        columns: ["custrecord_ptg_zona_de_precio_"],
                    });
                    result.zonaPrecio = coloniaLookup["custrecord_ptg_zona_de_precio_"][0]?coloniaLookup["custrecord_ptg_zona_de_precio_"][0].value:"";

                }
                log.debug("result",result);

            // {"coloniaRuta":"14","zonaPrecio":"1","address":"México SAN LUIS POTOSI ,AGUA SAL, 78385 , Paez, 9889, 1, ,,"}	
            newRecord.setValue(fields.zonaPrecio, result.zonaPrecio);
            newRecord.setValue("name", result.address);
            newRecord.setValue(fields.customer, result.customer);

                
            }




        }

       

        return {beforeSubmit}

    });
