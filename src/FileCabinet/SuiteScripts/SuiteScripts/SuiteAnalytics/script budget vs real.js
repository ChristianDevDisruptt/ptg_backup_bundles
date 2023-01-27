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
           
            context.workbook = wb;
        }
    }


});