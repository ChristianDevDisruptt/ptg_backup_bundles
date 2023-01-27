/**
 *@NApiVersion 2.1
 *@Author Jorge Macias
 *@description creación y visualización de errores
 */


define([], function() {

    // muestra el siguiente error: Configuración inválida. los datos de búsqueda guardados no están definidos
        function errorSearch(){
            let  error= {
                time : new Date().toISOString(),
                errorMessage : {message: `Configuración inválida. los datos de búsqueda guardados no están definidos.`,
                code: "ERR-001"}}
    
                return error;
        } 
    
    // Muestra el siguiente error : La solicitud no debe estar vacía, nula o indefinida
        function errorRequestEmpty(){
            let  error= {
                time : new Date().toISOString(),
                errorMessage : {message: `La solicitud no debe estar vacía, nula o indefinida.`,
                code: "ERR-002"}}
    
                return error;
        }
    
    // Muestra el siguiente error: Falta ingresar el ID del empleado
        function errorOnlyDate(){
            let  error= {
                time : new Date().toISOString(),
                errorMessage : {message: `Falta ingresar el ID del empleado`,
                code: "ERR-003"}}
    
                return error;
        }
    
    // muestra los errores generales capturados por el cath error
        function errorNotParameter(errorM){
            let  error= {
                time : new Date().toISOString(),
                errorMessage : errorM,
                code: "ERR-004"}
    
                return error;
        }

        function errorMissingParameter(){
            let  error= {
                time : new Date().toISOString(),
                errorMessage : {message: `El campo debe contener un valor.`,
                code: "ERR-005"}}
    
                return error;
        }
     
         return {
            errorSearch : errorSearch,
            errorRequestEmpty : errorRequestEmpty,
            errorOnlyDate : errorOnlyDate,
            errorNotParameter : errorNotParameter,
            errorMissingParameter : errorMissingParameter
         }
     });
     