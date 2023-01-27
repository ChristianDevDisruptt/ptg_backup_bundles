/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 1000;
        var arrayEmployee = [];
        var objEmployee = {};

        var employeeSearchObj = search.create({
            type: "employee",
            filters: [
                ["subsidiary", "anyof", "16"],
                "AND",
                ["isinactive", "is", "F"],
                "AND",
                ["custentitycustentity_ptg_employee_rol", "anyof", "1", "2", "3", "4"]
            ],
            columns: [
                "internalid",
                search.createColumn({
                    name: "entityid",
                    sort: search.Sort.ASC
                }),
                "lastname",
                "role",
                "custentity_ptg_employee_password"
            ]
        });
        var searchResultCount = employeeSearchObj.run();
        var results = searchResultCount.getRange(start, end);

        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var idEmployee = results[i].getValue(columnas[0]);
            var nameEmployee = results[i].getValue(columnas[1]);
            var lastNameEmployee = results[i].getValue(columnas[2]);
            var rolEmployee = results[i].getValue(columnas[3]);
            var passwordEmployee = results[i].getValue(columnas[4]);

            objEmployee = {
                id: idEmployee,
                nombre: nameEmployee,
                apellido: lastNameEmployee,
                rol: rolEmployee,
                contraseña: passwordEmployee
            }

            log.audit('objEmployee', objEmployee)

            arrayEmployee.push(objEmployee);

        }

        return JSON.stringify(arrayEmployee);

    }

    return {
        get: _get
    }
});