/**
 * @NApiVersion 2.x
 * @NScriptType workbookbuilderplugin
 */
// Crear un worbook desde script


require(['N/workbook', 'N/dataset', 'N/datasetLink'], function(nWorkbook, nDataset, datasetLink) {
    return {
        createWorkbook: function(context) {    
            var join = nDataset.createJoin({
                fieldId: "budgetmachine"
            });

            var period = nDataset.createColumn({
                join: join,
                fieldId: "period",
                alias: "budgetmachineperiod",
                label: "Accounting Period"
            });

            var department = nDataset.createColumn({
                fieldId: "department",
                alias: "department",
                label: "Department"
            });

            var total = nDataset.createColumn({
                fieldId: "total",
                alias: "total",
                label: "Amount (Total)"
            });

            var budget = nDataset.create({
                type: 'budgets',
                columns: [period, department, total]
            });

            var postingperiod = nDataset.createColumn({
                fieldId: "postingperiod",
                alias: "postingperiod",
                label: "Posting Period"
            });

            var amount = nDataset.createColumn({
                fieldId: "amount",
                alias: "amount",
                label: "Amount"
            });

            var sales = nDataset.create({
                type: 'salesinvoiced',
                columns: [postingperiod, department, amount],
            });


            var budgetmachineperiod = budget.getExpressionFromColumn({alias:"budgetmachineperiod"});
            var postingperiodExpression = sales.getExpressionFromColumn({alias:"postingperiod"});
            var link = datasetLink.create({
                datasets: [budget, sales],
                expressions: [[budgetmachineperiod, postingperiodExpression]],
                id: "link"
            });

            var postingPeriodItem = nWorkbook.createDataDimensionItem({expression: postingperiodExpression});
            var postingPeriodDimension = nWorkbook.createDataDimension({
                items: [postingPeriodItem]
            });
            var rowSection = nWorkbook.createSection({
                children: [postingPeriodDimension]
            });

            var departmentItem = nWorkbook.createDataDimensionItem({expression: budget.getExpressionFromColumn({alias: "department"})});
            var departmentDimension = nWorkbook.createDataDimension({
                items: [departmentItem]
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
                children: [departmentDimension, sumTotal, sumAmountNet]
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

            var wb = nWorkbook.create({
                description: 'My Test Workbook',
                name: 'Test Workbook',
                pivots: [pivot]

            });

            // wb.runPivot.promise("pivot").then(function(intersections){
            //     for (var i in intersections)
            //     {
            //         var intersection = intersections[i];
            //         if (intersection.row.itemValues) //skip header
            //         {
            //             console.log("Period: " + intersection.row.itemValues[0].value.name);
            //             console.log(intersection.column.section.children[1].label + ":");
            //             console.log(intersection.measureValues[0] ? intersection.measureValues[0].value.amount : 0);
            //             console.log(intersection.column.section.children[2].label + ":");
            //             console.log(intersection.measureValues[1] ? intersection.measureValues[1].value.amount : 0);
            //         }
            //     }
            // });

            var workbook = wb.create({
                description: 'Libro de trabajo para presupuesto contra real',
                name: 'Workbook Presupuesto vs Real',
                tableDefinitions: [tableview],
                pivotDefinitions: [pivot],
                chartDefinitions: [chart]
            });

            // context.workbook = workbook;

            context.workbook = wb;
        }
    }


});