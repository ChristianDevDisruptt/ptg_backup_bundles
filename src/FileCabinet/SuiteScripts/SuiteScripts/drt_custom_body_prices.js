/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/ui/serverWidget', 'N/record', 'N/search'], function (ui,record,search) {

    function beforeLoad(context) {
        try {
            if (context.type == context.UserEventType.VIEW) {
                var newRecord = context.newRecord;
                var myform = context.form;
                var itemType = newRecord.type;
                var itemId = newRecord.id;
                var sublistName = 'price1';

                log.audit('itemId' , itemId);

                /*var numPriceLevels = newRecord.getLineCount({
                    sublistId: sublistName
                }); */

                var pricingSearchObj = search.create({
                    type: "pricing",
                    filters:
                    [
                       ["item","anyof", itemId], 
                       //"AND", 
                       //["pricelevel","anyof","1"], 
                       "AND", 
                       ["currency","anyof","1"]
                    ],
                    columns:
                    [
                       search.createColumn({name: "item", label: "Artículo"}),
                       search.createColumn({name: "quantityrange", label: "Quantity Range"}),
                       search.createColumn({name: "unitprice", label: "Unit Price"}),
                       search.createColumn({
                        name: "internalid",
                        sort: search.Sort.ASC,
                        label: "ID interno"
                        }),
                        search.createColumn({name: "pricelevel", label: "Nivel de precio"}),
                      search.createColumn({
                         name: "minimumquantity",
                         sort: search.Sort.ASC,
                         label: "Minimum Quantity"
                      })
                    ]
                 });
                 var searchResultCount = pricingSearchObj.runPaged().count;
                 log.debug("pricingSearchObj result count",searchResultCount);
                 var resultSet = pricingSearchObj.run().getRange({
					start: 0,
					end: 999
				});
                var list = "";
                var i = 0;
                var precios ="";
				if (resultSet.length > 0) {
					for (var t = 0; t < resultSet.length; t++) {
						var obj = {};
						obj.label = resultSet[t].getValue({name: "quantityrange", label: "Quantity Range"});
						obj.price = resultSet[t].getValue({name: "unitprice", label: "Unit Price"});
                        obj.listname = resultSet[t].getText({name: "pricelevel", label: "Nivel de precio"});
                        obj.listID = resultSet[t].getValue({name: "pricelevel", label: "Nivel de precio"});
                        if(list != obj.listname){
                            i = 0;
                            list = obj.listname;
                        } else {
                            i++;
                        }

                        field = myform.getField({
                            id : 'custitem_drt_custom_price'+ obj.listID + '_' + i
                        });

                        if (obj.listname.indexOf("PRECIO")){
                            field.label = obj.listname + ' Cant. ' + obj.label;
                        } else{
                            field.label = 'Precio ' + obj.listname + ' Cant. ' + obj.label;
                        }

                        newRecord.setValue({
                            fieldId: 'custitem_drt_custom_price'+ obj.listID + '_' + i,
                            value: obj.price
                        }) || 0;
                        if(i == 0){
                            precios = field.label + ' - ' + obj.price + '<br/>';
                            
                        } else {
                            precios = precios + field.label + ' - ' + obj.price + '<br/>';
                        }
                        newRecord.setValue({
                            fieldId: 'custitem_drt_custom_price_list0',
                            value: precios
                        }) || '0';

                        log.audit('custitem_drt_custom_price'+ obj.listID + '_' + i , obj.price);

					}
				}     
            }
        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        beforeLoad: beforeLoad
    }
});