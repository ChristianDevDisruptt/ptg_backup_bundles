  /**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 55;
        var arrayNumeroViajes = [];
        var objNumeroViaje = {};

        var transactionSearchObj = search.create({
            type: "transaction",
            filters:
            [
               ["type","anyof","Opprtnty"], 
               "AND", 
               ["mainline","is","T"], 
               "AND", 
               ["customermain.custentityptg_tipodecontacto_","anyof","2"], 
               "AND", 
               ["subsidiary","anyof","13","16"]
            ],
            columns:
            [
               search.createColumn({name: "tranid", label: "Número de documento"}),
               search.createColumn({name: "entity", label: "Nombre"}),
               search.createColumn({name: "custbody_ptg_type_service", label: "Tipo de Servicio"}),
               search.createColumn({
                  name: "phone",
                  join: "customerMain",
                  label: "Teléfono"
               })
            ]
         });

        var searchResultCount = transactionSearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var numDocto = results[i].getValue(columnas[0]);
            var idNombre = results[i].getValue(columnas[1]);
            var tServicio = results[i].getValue(columnas[2]);
            var cTelefono = results[i].getValue(columnas[3]);
            var lookupFieldsCustomer = search.lookupFields({
                type: search.Type.CUSTOMER,
                id: idNombre,
                columns: ['altname']
            });
            var nombreServicio = "";
            if(!tServicio){
                nombreServicio = " ";
            } else if(tServicio == 1){
                nombreServicio = "Pedido Estacionario"
            } else if(tServicio == 2){
                nombreServicio = "Quejas"
            } else if(tServicio == 3){
                nombreServicio = "Fugas"
            } else if(tServicio == 4){
                nombreServicio = "Pedido Cilindro"
            } else if(tServicio == 5){
                nombreServicio = "Antojado"
            }


            objNumeroViaje = {
                numero_documento: numDocto,
                nombre: lookupFieldsCustomer.altname,
                tipo_servicio: nombreServicio,
                telefono_cliente: cTelefono
            }
            log.audit('objRutas', objNumeroViaje)
            arrayNumeroViajes.push(objNumeroViaje);
        }

        return JSON.stringify(arrayNumeroViajes);
    }

    return {
        get: _get
    }
});