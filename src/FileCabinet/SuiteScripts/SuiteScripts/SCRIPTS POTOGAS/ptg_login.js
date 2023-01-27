/**
  * @NApiVersion 2.1
  * @NScriptType Restlet
  * @author Ivan Deluquez
  * @description Función que regresara la información del empleado 
  */


define(['N/search', 'N/log', 'N/record'],
    /**
     * Definicion de funcionalidades. Generador
     * @param {import('N/search')} search 
     * @param {import('N/log')} log 
     * @param {import('N/record')} record 
     * @returns  */
    function (search, log, record) {

        //validación de Busqueda de empleados; por medio del Id Interno de NS
        /**
         * Busqueda de empleado. Retorna sólo un valor modelado, el primero. Omite inactivos.
         * @param {string} employee 
         * @returns {{ id: string, internalId:number, name:string, role:{ name:string, id:number}, subsidiary: { name:string, id:number }, passwordEmployee: string, masterPasword:string }:object}
         */

        function searchEmployee(employee) {

            try {
                //const searchEmp = search.load({id: searchId});
                let employeeSearchObj = search.create({
                    type: "employee",
                    filters: [["entityid", "is", employee], "AND", ["isinactive", "is", "F"]],
                    columns: [
                        search.createColumn({ name: "entityid", sort: search.Sort.ASC, label: "Nombre" }),
                        search.createColumn({ name: "firstname" }),
                        search.createColumn({ name: "middlename" }),
                        search.createColumn({ name: "lastname" }),
                        search.createColumn({ name: "phone", label: "Teléfono" }),
                        search.createColumn({ name: "altphone", label: "Número telefónico de la oficina" }),
                        search.createColumn({ name: "supervisor", label: "Supervisor" }),
                        search.createColumn({ name: "custentitycustentity_ptg_employee_rol", label: "Rol" }),
                        search.createColumn({ name: "custentity_ptg_employee_password", label: "Contraseña" }),
                        search.createColumn({ name: "custentity_ptg_employee_masterpassword", label: "Contraseña Maestra" }),
                        search.createColumn({ name: "subsidiary", label: "Subsidiaria" }),
                        //search.createColumn({ name: "custentity_ptg_ruta_empleado_", label: "Ruta empleado" }),
                        //search.createColumn({ name: "custentity_ptg_vehiculo_", label: "Vehiculo" }),						
                      /*  
                      search.createColumn({
                           name: "custrecord_ptg_ubicacionruta_",
                           join: "customrecord_ptg_equipos",
                           label: "PTG - Ubicación/Ruta"
                        }),
                        search.createColumn({
                            name: "custrecord_ptg_idequipo_",
                            join: "customrecord_ptg_equipos",
                            label: "PTG - ID EQUIPO"
                         }),
                      */
                      search.createColumn({
                            name: "custrecord_ptg_ubicacionruta_",
                            join: "CUSTRECORD_PTG_CHOFEREQUIPO_",
                            label: "PTG - Ubicación/Ruta"
                         }),
                         search.createColumn({
                            name: "custrecord_ptg_idequipo_",
                            join: "CUSTRECORD_PTG_CHOFEREQUIPO_",
                            label: "PTG - ID EQUIPO"
                         })
                    ]
                });

                const resultSearch = employeeSearchObj.run();
                //log.debug("count", employeeSearchObj.runPaged().count);
                let employeeObjResult = null;
                log.audit('resultSearch',resultSearch);
                resultSearch.each(function (result) {
                    let internalId = result.id;
                    let id = result.getValue({ name: 'entityid' });
                    let name = result.getValue({ name: 'firstname' });
                    let subsidiary = {
                        name: result.getText({ name: 'subsidiary' }),
                        id: result.getValue({ name: 'subsidiary' })
                    };
                    //let ruta = result.getValue({name: 'custrecord_ptg_ubicacionruta_', join :'customrecord_ptg_equipos'});
                    //let vehiculo = result.getValue({name: 'custrecord_ptg_idequipo_', join: 'customrecord_ptg_equipos'});
                    let ruta = result.getValue({name: 'custrecord_ptg_ubicacionruta_', join :'CUSTRE-CORD_PTG_CHOFEREQUIPO_'});
                    let vehiculo = result.getValue({name: 'custrecord_ptg_idequipo_', join: 'CUSTRECORD_PTG_CHOFEREQUIPO_'});
                    let telefono = result.getValue({name: 'phone'});
                    let role = {
                        name: result.getText({ name: 'custentitycustentity_ptg_employee_rol' }),
                        id: result.getValue({ name: 'custentitycustentity_ptg_employee_rol' })
                    };

                    let passwordEmployee = result.getValue({ name: 'custentity_ptg_employee_password' });
                    let masterPasword = result.getValue({ name: 'custentity_ptg_employee_masterpassword' });
                    let fullname = [
                        result.getValue({ name: 'firstname' }),
                        result.getValue({ name: 'middlename' }),
                        result.getValue({ name: 'lastname' })
                    ].join(" ");

                    employeeObjResult = {
                        id: id,
                        internalId: internalId,
                        name: name,
                        subsidiary: subsidiary,
                        role: role,
                        passwordEmployee: passwordEmployee,
                        masterPasword: masterPasword,
                        fullname: fullname,
                        //ruta: ruta,
                        //unidad: vehiculo,
                        telefono: telefono
                    };
                });

                log.debug("employee on search", employeeObjResult);

                return employeeObjResult;

            } catch (error) {
                log.debug("searchEmployee ERROR", error);
                return null;

            }
        }

        function searchRoute(user) {

            let customSearch = search.create({
                type: "customrecord_ptg_tabladeviaje_enc2_",
                filters: [
                  	["created", "within", "today"], "AND",
                    ["custrecord_ptg_chofer_tabladeviajes_", "is", user], "AND",
                    ["custrecord_ptg_estatus_tabladeviajes_", "anyof", 3], "AND",
                    ["isinactive", "is", "F"]
                ],
                columns: [
                    search.createColumn({ name: "name" }),
                    search.createColumn({ name: "custrecord_ptg_viaje_tabladeviajes_", label: "PTG - #Viaje (Tabla de viajes)" }),
                    search.createColumn({ name: "custrecord_ptg_chofer_tabladeviajes_", label: "PTG - Chofer (Tabla de viajes)" }),
                    search.createColumn({ name: "internalid", label: "ID interno" }),
                    search.createColumn({ name: "custrecord_ptg_planta_tabladeviajes_", label: "Planta" }),
                    search.createColumn({ name: "custrecord_ptg_vehiculo_tabladeviajes_", label: "Vehiculo" }),
                    search.createColumn({ name: "custrecord_ptg_turno", label: "Turno" }),
                  search.createColumn({name: "custrecord_ptg_ruta", label: "PTG - Ruta"})
                ]
            });

            /** @type {{id: string, name: string, driverId: string, driver: string}[]: object[]} */
            let viajes = [];

            //let customSearchPagedData = customSearch.runPaged({ pageSize: 1000 });
            let customSearchPagedData = customSearch.run();
            var results = customSearchPagedData.getRange(0, 1000);
            for (var i = 0; i < results.length; i++) {
                var columnas = results[i].columns;
                viajes = {
                    name : results[i].getValue(columnas[0]),
                    vehicleId: results[i].getValue(columnas[5]),
                    vehicle: results[i].getText(columnas[5]),
                    plantId: results[i].getValue(columnas[4]),
                    plant: results[i].getText(columnas[4]),
                    turnId: results[i].getValue(columnas[6]),
                    turn: results[i].getText(columnas[6]),
                    ruta: results[i].getValue(columnas[7])
                }
            }
            //customSearchPagedData.pageRanges.forEach(pageRange => {
                //let currentPage = customSearchPagedData.fetch({ index: pageRange.index });
                //currentPage.data.forEach((result, indx, origingArray) => {
                    /// Do something
                    //viajes.push({
                    //    id: result.getValue({ name: "internalid" }),
                    //    name: result.getValue({ name: "custrecord_ptg_viaje_tabladeviajes_" }),
                    //    //driverId: result.getValue({ name: "custrecord_ptg_chofer_tabladeviajes_" }),
                    //    //driver: result.getText({ name: "custrecord_ptg_chofer_tabladeviajes_" }),
                    //    vehicleId: result.getValue({ name: "custrecord_ptg_vehiculo_tabladeviajes_" }),
                    //    vehicle: result.getText({ name: "custrecord_ptg_vehiculo_tabladeviajes_" }),
                    //    plantId: result.getValue({ name: "custrecord_ptg_planta_tabladeviajes_" }),
                    //    plant: result.getText({ name: "custrecord_ptg_planta_tabladeviajes_" }),
                    //    turnId: result.getValue({ name: "custrecord_ptg_turno" }),
                    //    turn: result.getText({ name: "custrecord_ptg_turno" })
                    //});
                //});
            //});
            log.audit('viajes', viajes)
            return viajes;
        }


        function validateMandatoryFields(mandatoryFields, empObj) {
            try {
                mandatoryFields.forEach(function (field) {
                    // Si el campo obligatorio no se encuentra
                    if (!(field in empObj)) {
                        log.debug({
                            title: "False",
                            details: field + " missing."
                        })
                        throw new Error(field + " missing.");
                    }
                })
            } catch (e) {
                return false;
            }

            return true;
        }

        function doPost(context) {

            let errorCode;
            let mandatory = ['user', 'password'];

            log.debug({ title: 'Request', details: context })

            // Mensaje de respuesta 

            let response = {
                isSuccessful: false,
                message: 'Some errors occured',
                data: null,
                apiError: {
                    time: null,
                    errorMessage: []
                }
            };


            try {
                // Verificar que el request no este vacio
                if (context == null || context == undefined || context.length === 0) {
                    errorCode = "lOG-001";
                    throw new Error('Request must not be empty, null or undefined.');
                }

                // Verificar que los campos obligatorios se encuentran en el request
                let allFields = validateMandatoryFields(mandatory, context);
                if (!allFields) {
                    errorCode = "LOG-003";
                    throw new Error('One or more mandatory fields are missing.');
                }
            } catch (error) {
                response.apiError.time = new Date().toISOString();
                let errorMessageData = { message: error.message, code: errorCode };
                response.apiError.errorMessage.push(errorMessageData);
                return response;
            }


            //Datos para login
            let userId = context.user;
            let userPass = context.password;

            let employee = searchEmployee(userId);
            if (!!employee)
                switch (context.type) {
                    case "updatePassword":
                        // actualizacion de contraseña. Se recomienda validacion de patrones.
                        if (!userPass || userPass.trim().length < 8) {
                            response.apiError.time = new Date().toISOString();
                            let errorMessageData = {
                                message: 'Invalid configuration. Bad Password format',
                                code: 'LOG-006'
                            };

                            response.apiError.errorMessage.push(errorMessageData);
                        };

                        record.submitFields({ id: employee.internalId, type: record.Type.EMPLOYEE, values: { custentity_ptg_employee_password: userPass } });
                        response.data = {};
                        break;

                    default:
                        //login

                        try {
                            // validar el campo de password 
                            if (employee.passwordEmployee == null) {
                                throw new Error('invalid password')
                            }

                        } catch (e) {
                            response.apiError.time = new Date().toISOString();
                            let errorMessageData = {
                                message: 'Invalid configuration. Validation data is not defined.',
                                code: 'LOG-004'
                            };

                            response.apiError.errorMessage.push(errorMessageData);
                        }

                        //Validación de usuario y contraseña 
                        log.debug("Validacion", employee);
                        if ((userId).toLowerCase() == (employee.id).toLowerCase() && userPass == employee.passwordEmployee || (userId).toLowerCase() == (employee.id).toLowerCase() && userPass == employee.masterPasword) {
                            delete employee.masterPasword;
                            delete employee.passwordEmployee;
                            response.data = employee;
                            try {

                                //let routes = searchRoute(employee.internalId);
                                let routes = searchRoute(employee.internalId);
                                response.data.travel = routes;

                            } catch (error) {

                                log.debug("Error on Route", error);

                            }
                        }
                        else {
                            if ((userId).toLowerCase() == (employee.id).toLowerCase()) {
                                response.apiError.errorMessage.push({ message: "Wrong password.", code: 'LOG-007' })
                            }
                        }

                        break;
                }

            // Sin resultados, el usuario no existe o las credenciales fueron incorrectas.
            if (!response.data) {

                response.apiError.time = new Date().toISOString();
                let errorMessageData = {
                    message: "Employee doesn't exist or access rights haven't been granted.",
                    code: 'LOG-005'
                };

                response.apiError.errorMessage.push(errorMessageData);

            } else if (response.apiError != null && response.apiError.errorMessage.length == 0) {

                switch (context.type) {
                    case "updatePassword":
                        response.message = 'Password updated';
                        break;
                    default:
                        response.message = 'Login successful';
                        break;
                }

                response.isSuccessful = true;
                response.apiError = null;
            }

            log.debug({ title: "Response", details: response });
            return response;
        }

        return {
            post: doPost
        };

    });