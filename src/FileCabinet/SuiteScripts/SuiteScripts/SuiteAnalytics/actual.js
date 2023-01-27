 /**
 * @NApiVersion 2.0
 * @NScriptType datasetbuilderplugin
 */

define(['N/dataset'], function(dataset) { return Object.freeze({ createDataset: function(context) {

	var join = dataset.createJoin({

         fieldId: "location"

     });
  var joinitem = dataset.createJoin({

         fieldId: "item^item"

     });

      var postingperiod = dataset.createColumn({

         fieldId: "postingperiod",

         alias: "postingperiod",

         label: "Posting Period"

     }); 

     var amount = dataset.createColumn({

         fieldId: "amount",

         alias: "amount",

         label: "Amount"

     });
  
    var account = dataset.createColumn({

         fieldId: "account",

         alias: "account",

         label: "Account"

     });
  
      var item = dataset.createColumn({

         fieldId: "item",

         alias: "item",

         label: "Item"

     });
  var clase = dataset.createColumn({

         fieldId: "class",

         alias: "class",

         label: "class"

     });

  var location = dataset.createColumn({

         join: join,

         fieldId: "custrecord_disa_nombre_ubicacion_padre",

         alias: "location",

         label: "Location"

     });
   var marca = dataset.createColumn({

         join: joinitem,

         fieldId: "custitem_disa_marca",

         alias: "marca",

         label: "Marca"

     });
  var subfamilia= dataset.createColumn({

         join: joinitem,

         fieldId: "custitem_disa_subfamilia",

         alias: "subfamilia",

         label: "Subfamilia"

     });
    var origen= dataset.createColumn({

         join: joinitem,

         fieldId: "custitem_disa_origen",

         alias: "origen",

         label: "origen"

     });
    var myFormulaColumn = dataset.createColumn({
      formula: '{class#display}',
      type: 'STRING',
      id: 11,
      alias: 'Mes Contable',
      label: 'Mes Contable'
    });

    var myFormulaItem = dataset.createColumn({
        formula: '{class#display}',
        type: 'STRING',
        id: 12,
        alias: "Articulo Completo",
        label: 'Articulo Completo'
    });




     var ds = dataset.create({

         type: 'salesinvoiced',

         columns: [postingperiod,amount,account,item,location,myFormulaColumn,myFormulaItem,clase,subfamilia,origen,marca]

     });

     context.dataset = ds;

 }

}); });