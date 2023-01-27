/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(["N/search"], function (search) {

    function _get(context) {
      log.debug('entre', context)
        var tranId = context.id;
        var recordtype = "-30";
        if(context.type && context.type.toLowerCase() == "cliente") {
          recordtype = "-9";
        } else if(context.type && context.type.toLowerCase() == "caso") {
          recordtype = "-20";
        }
        var start = 0;
        var end = 1000;
        var arrayChanges = [];
        var objChanges = {};
        var customSearch = search.create({
            type: "systemnote",
            filters:
            [
               ["recordtype","anyof",recordtype], 
               "AND", 
               ["recordid","equalto", tranId]
            ],
             columns: [
                search.createColumn({
                    name: "date",
                    sort: search.Sort.DESC,
                    label: "Fecha"
                 }),
                 search.createColumn({name: "name", label: "Definido por"}),
                 search.createColumn({name: "context", label: "Contexto"}),
                 search.createColumn({name: "type", label: "Tipo"}),
                 search.createColumn({name: "field", label: "Campo"}),
                 search.createColumn({name: "oldvalue", label: "Valor anterior"}),
                 search.createColumn({name: "newvalue", label: "Nuevo valor"})
              ]
         });
        var searchResultCount = customSearch.run();
      	log.audit('searchResultCount', searchResultCount)
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var date = results[i].getValue(columnas[0]);
          	var userId = results[i].getValue(columnas[1]);
            var userName = results[i].getText(columnas[1]);
            var ui = results[i].getValue(columnas[2]);
            var type = results[i].getValue(columnas[3]);
            var fieldId = results[i].getValue(columnas[4]);
          	var fieldName = results[i].getText(columnas[4]);
            var oldvalue = results[i].getValue(columnas[5]);
            var newvalue = results[i].getValue(columnas[6]);
            objChanges = {
                date: date,
              	userId: userId,
                userName: userName,
                ui: ui,
                type: type,
                fieldId: fieldId,
              	fieldName: fieldName,
                oldvalue: oldvalue,
                newvalue: newvalue
            }
            log.audit('objChanges', objChanges)
            arrayChanges.push(objChanges);
        }

        return { success: true, data: arrayChanges };
    }

    return {
        get: _get
    }
});