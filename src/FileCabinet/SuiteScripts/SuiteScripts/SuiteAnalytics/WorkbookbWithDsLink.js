/**
 * @NApiVersion 2.0
 * @NScriptType workbookbuilderplugin
 */
define(['N/workbook', 'N/dataset', 'N/datasetLink'], function(nWorkbook, nDataset, datasetLink) { return Object.freeze({ createWorkbook: function(context) {


     var budget = nDataset.load({

         id: 'custdataset62'

     });


     var sales = nDataset.load({

         id: 'custdataset61'

     });


     var budgetmachineperiod = budget.getExpressionFromColumn({alias:"budgetmachineperiod"});

     var postingperiod = sales.getExpressionFromColumn({alias:"postingperiod"});

     var budgetaccount = budget.getExpressionFromColumn({alias:"account"});

     var account = sales.getExpressionFromColumn({alias:"account"});

  	 var budgetlocation = budget.getExpressionFromColumn({alias:"location"});

     var location = sales.getExpressionFromColumn({alias:"location"});

     var budgetitem = budget.getExpressionFromColumn({alias:"item"});

     var item = sales.getExpressionFromColumn({alias:"item"});

     var budgetmes = budget.getExpressionFromColumn({alias:"Mes Contable"});

     var mes = sales.getExpressionFromColumn({alias:"Mes Contable"});

     var budgetarticulo = budget.getExpressionFromColumn({alias:"Articulo Completo"});

     var articulo = sales.getExpressionFromColumn({alias:"Articulo Completo"});

     var budgetsubfamilia = budget.getExpressionFromColumn({alias:"subfamilia"});

     var subfamilia = sales.getExpressionFromColumn({alias:"subfamilia"});

     var budgetmarca = budget.getExpressionFromColumn({alias:"marca"});

     var marca = sales.getExpressionFromColumn({alias:"marca"});

     var budgetorigen = budget.getExpressionFromColumn({alias:"origen"});

     var origen = sales.getExpressionFromColumn({alias:"origen"});

    var budgetclase = budget.getExpressionFromColumn({alias:"class"});

     var clase = sales.getExpressionFromColumn({alias:"class"});


     var link = datasetLink.create({

         datasets: [budget, sales],

         expressions: [[budgetmachineperiod, postingperiod],[budgetlocation, location],[budgetitem, item],[budgetmes, mes],[budgetarticulo, articulo],[budgetsubfamilia, subfamilia],[budgetmarca, marca],[budgetorigen, origen],[budgetclase, clase]],

         id: "link"

     });


     var postingPeriodItem = nWorkbook.createDataDimensionItem({expression: postingperiod});

     var postingPeriodDimension = nWorkbook.createDataDimension({

         items: [postingPeriodItem]

     });

     var rowSection = nWorkbook.createSection({

         children: [postingPeriodDimension]

     });

     var locationItem = nWorkbook.createDataDimensionItem({expression: budget.getExpressionFromColumn({alias: "location"})});

     var locationDimension = nWorkbook.createDataDimension({

         items: [locationItem]

     });


     var sumTotal = nWorkbook.createDataMeasure({

         label: 'Sum Total',

         expression: budget.getExpressionFromColumn({

             alias: 'total'

         }),

         aggregation: 'SUM'

     });


     var sumAmountNet = nWorkbook.createDataMeasure({

         label: 'Sum Amount',

         expression: sales.getExpressionFromColumn({

             alias: 'amount'

         }),

         aggregation: 'SUM'

     });

     var columnSection = nWorkbook.createSection({

         children: [locationDimension]

     });

     var pivot = nWorkbook.createPivot({

         id: "pivot",

         rowAxis:  nWorkbook.createPivotAxis({

             root: rowSection

         }),

         columnAxis: nWorkbook.createPivotAxis({

             root: columnSection

         }),

         name: "Pivot",

         datasetLink: link

     });

     context.workbook = nWorkbook.create({

         pivots: [pivot]

     });

 }

}); });