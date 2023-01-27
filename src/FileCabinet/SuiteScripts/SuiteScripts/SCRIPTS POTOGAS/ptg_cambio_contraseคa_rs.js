/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 * @author Manuel Mateos
 * @description Función que permite cambiar la contraseña de un empleado 
 */
define(["N/search", "N/record"], function (search, record) {

    const responseData = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null
    }

    function _put(request) {

        log.audit('test christian', request)
        let paswoordUpdate = [];

        try {
            let idUsuario = request.id;
            let password = request.nueva_contrasena;
            let loadEmployee = record.load({
                type: record.Type.EMPLOYEE,
                id: idUsuario,
                isDynamic: true,
            });

            loadEmployee.setValue({
                fieldId: "custentity_ptg_employee_password",
                value: password
            });

            let employeeId = loadEmployee.save();
            paswoordUpdate.push(employeeId)
            if (employeeId) {
                responseData.isSuccessful = true;
                responseData.message = "password update successfully";
                responseData.data = paswoordUpdate
            }
        } catch (error) {
            log.audit('error', error)
        }

        return responseData
    }

    return {
        put: _put
    }
});