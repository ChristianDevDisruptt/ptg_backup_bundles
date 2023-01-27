/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description script principal que contiene los estados implementados en el Front-End
 */
define([
    "N/log",
    "SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors",
    "SuiteScripts/SCRIPTS POTOGAS/ptg_modulos",
    "N/record",
    "N/format",
    "N/search",
  ], function (log, error, opport, record, format, search) {
    const responseData = {
      isSuccessful: false,
      message: "Some errors occured",
      data: null,
      apiErrorGet: [],
      apiErrorPost: [],
    };
  
    function postPrincipal(request) {
      let status = request.status;
  
      log.debug({
        title: "request",
        details: request,
      });
  
      try {
        if (request === null || request === undefined || request.length === 0) {
          responseData.apiErrorPost.push(error.errorRequestEmpty());
        }
      } catch (error) {
        return responseData;
      }
  
      try {
        switch (status) {
          case "1": // oportunidad cancelada
            opport.changeStatusOpportunity(request, responseData, "14");
            break;
  
          case "2": // oportunidad se reprograma
            opport.changeStatusOpportunity(request, responseData, "11");
            break;
  
          case "3": //confimar
           // opport.createOrder(request, responseData);
            opport.changeStatusOpportunity(request, responseData, "13");
            break;
  //
          case "4": //modificar
            opport.modifOpportunity(request, responseData);
            break;
          default:
            throw new Error("Invalid option selected!")
            break;
        }
      } catch (err) {
        responseData.apiErrorPost.push(error.errorNotParameter(err.message));
      }
  
      return responseData;
    }
  
    return {
      post: postPrincipal,
    };
  });
  