 /**
 * @NApiVersion 2.0
 * @NScriptType datasetbuilderplugin
 */
// Crear un worbook desde script


define(['N/dataset'], function(dataset) { return Object.freeze({ createDataset: function(context) {

      var join = dataset.createJoin({

         fieldId: "budgetmachine"

     });
  var join2 = dataset.createJoin({

         fieldId: "location"

     });
  var joinitem = dataset.createJoin({

         fieldId: "item^item"

     });

     var period = dataset.createColumn({

         join: join,

         fieldId: "period",

         alias: "budgetmachineperiod",

         label: "Accounting Period"

     });
    var clase = dataset.createColumn({

         fieldId: "class",

         alias: "class",

         label: "class"

     });


    var location = dataset.createColumn({

         join: join2,

         fieldId: "custrecord_disa_nombre_ubicacion_padre",

         alias: "location",

         label: "Location"

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

     var total = dataset.createColumn({

         join: join,

         fieldId: "amount",

         label: "Amount (Total)"

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
      alias: "Mes Contable",
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
        type: 'budgets',
        columns: [period,total,account,item,location,myFormulaColumn,myFormulaItem,clase,subfamilia,origen,marca]
     });

     context.dataset = ds;

 }

}); });

