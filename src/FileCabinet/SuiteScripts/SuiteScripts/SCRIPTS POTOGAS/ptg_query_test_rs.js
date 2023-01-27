/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/query"], function(query) {

    function _searchCustomer(request) {
     try {
        
        let telefonoCliente = request.phone;
        var myCustomerQuery = query.create({
            type: query.Type.CUSTOMER
        });
    
        myCustomerQuery.columns = [
            myCustomerQuery.createColumn({
                fieldId: 'entityid'
            }),
            myCustomerQuery.createColumn({
                fieldId: 'email'
            })
        ];
    
        myCustomerQuery.condition = myCustomerQuery.createCondition({
            fieldId: 'isperson',
            operator: query.Operator.IS,
            values: [true]
        });
    
        var mySQLCustomerQuery = myCustomerQuery.toSuiteQL();
    
        var results = mySQLCustomerQuery.run();

        log.audit('results', results)
     } catch (error) {
         log.audit('error', error);
     }   
    }

    return {
        post: _searchCustomer
    }
});
