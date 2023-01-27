/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 03/2022
 * Script name: DRT - Recibir aport Cil a EstCarb CS
 * Script id: customscript_drt_repecion_aportacion_cs
 * customer Deployment id: customdeploy_drt_repecion_aportacion_cs
 * Applied to: PTG - Crear/Recibir aportación Est-carb
 * File: drt_recepcion_aportacion_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
 define(['N/https', 'N/currentRecord', 'N/url', 'N/ui/message', 'N/ui/dialog', 'N/search', 'N/runtime', 'N/record', 'N/error', ['N/currency']], 
 function (https, currentRecord, url, message, dialog, search, runtime, record, error, currency) {
   

    function fieldChanged(context) {
      try {
        var currentRecord = context.currentRecord;
      var fieldName = context.fieldId;
      var numViaje = currentRecord.getValue("custrecord_ptg_rec_apor_est_carb_");
      var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_estcarb_rec_apor");
      log.audit("numViaje", numViaje);
      log.audit("vehiculo", vehiculo);
      var estatusViajeEnCurso = 0;
      if (runtime.envType === runtime.EnvType.SANDBOX) {
        estatusViajeEnCurso = 3;
      } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
        estatusViajeEnCurso = 3;   
      }

      if (vehiculo && fieldName === "custrecord_ptg_vehiculo_estcarb_rec_apor") {
        //BÚSQUEDA GUARDADA: PTG - Viaje activo SS
        var viajeActivoObj = search.create({
          type: "customrecord_ptg_tabladeviaje_enc2_",
          filters:[["custrecord_ptg_vehiculo_tabladeviajes_","anyof",vehiculo], "AND", ["custrecord_ptg_estatus_tabladeviajes_","anyof",estatusViajeEnCurso]],
          columns:[
             search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"})
          ]
        });
        var viajeActivoObjCount = viajeActivoObj.runPaged().count;
        if(viajeActivoObjCount > 0){
          var viajeActivoObjResult = viajeActivoObj.run().getRange({
            start: 0,
            end: 2,
          });
          numeroViaje = viajeActivoObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"});
          currentRecord.setValue("custrecord_ptg_rec_apor_est_carb_",numeroViaje);
        } else {
          currentRecord.setValue("custrecord_ptg_rec_apor_est_carb_",'');
          var options = {
            title: "Viaje",
            message: "No hay viaje activo asignado al vehículo seleccionado",};
            dialog.alert(options);
        }

        return true;
      }
      } catch (error) {
        log.error("error", error);
      }
      
    }


    function validateLine(context){
      try {
        var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistaTraslado = "recmachcustrecord_ptg_detalle_aportacion_";
      var vehiculo = currentRecord.getValue("custrecord_ptg_vehiculo_estcarb_rec_apor");
      var equiposObj = record.load({
        id: vehiculo,
        type: "customrecord_ptg_equipos",
      });
      var ubicacionRuta = equiposObj.getValue("custrecord_ptg_ubicacionruta_");
      log.audit("ubicacionRuta", ubicacionRuta);
      
      
      if (sublistName === sublistaTraslado){
        var articulo = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_tipoenv_rec_est_carb_'});
        var cantidadAnden = currentRecord.getCurrentSublistValue({ sublistId: sublistName, fieldId: 'custrecord_ptg_cantidad_aport_cil_'});

        //SS: PTG - Cantidad disponible
        var itemObj = search.create({
          type: "item",
          filters: [
             ["internalid","anyof",articulo], "AND", 
             ["inventorylocation","anyof",ubicacionRuta]
          ],
          columns:[
             search.createColumn({name: "locationquantityavailable", label: "Ubicación disponible"})
          ]
       });
       var itemObjCount = itemObj.runPaged().count;
       if(itemObjCount > 0){
        var itemObjResults = itemObj.run().getRange({
          start: 0,
          end: 2,
        });
        (cantidadDotacion = itemObjResults[0].getValue({name: "locationquantityavailable", label: "Ubicación disponible"}));
        if(cantidadAnden > cantidadDotacion){
          var options = {
            title: "Excede cantidad",
            message: "La cantidad a traspasar es mayor a la del vehículo ("+cantidadDotacion+")."};
            dialog.alert(options);
          return false;
        } else {
          return true;
        }
      } else {
        var options = {
          title: "Sin registro",
          message: "No hay cantidad disponible del vehículo"};
          dialog.alert(options);
        return false;
      }
            
        }
      } catch (error) {
        log.error("error validateLine", error)
      }
      }


     

    function redirectTo() {
        try {
          log.audit("redirectTo cs");
          
          var options = {
            title: 'Confirmación de recepción',
            message: '¿Está seguro de aceptar la recepción?'
          };

          var formularioCustomRecord = 0;
          var estatusRecibido = 0;
          var formularioRecepcion = 0;

          if (runtime.envType === runtime.EnvType.SANDBOX) {
            formularioCustomRecord = 324;
            estatusRecibido = 2;
            formularioRecepcion = 258;
          } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
            formularioCustomRecord = 189;
            estatusRecibido = 2;
            formularioRecepcion = 270;
          }
          
          function success(result) {
            console.log('Success with value ' + result);
            
            if(result) {
              const newForm = formularioCustomRecord;              


              recObj = currentRecord.get();
              console.log("recObj", recObj);
            
              record.submitFields({
                type: recObj.type,
                id: recObj.id,
                values: {custrecord_ptg_status_recepcion : estatusRecibido}
              });

              recObj = record.load({
                type: recObj.type,
                id: recObj.id,
                defaultValues: {customform : newForm}
              });

              var idOrdenTraslado = recObj.getValue("custrecord_ptg_orden_traslado");
              console.log("idOrdenTraslado", idOrdenTraslado);

              var newRecordItemReceipt = record.transform({
                fromType: record.Type.TRANSFER_ORDER,
                fromId: idOrdenTraslado,
                toType: record.Type.ITEM_RECEIPT,
                isDynamic: false
              });

              newRecordItemReceipt.setValue("customform", formularioRecepcion);

              var idItemReceipt = newRecordItemReceipt.save({
                enableSourcing: false,
                ignoreMandatoryFields: true,
              }) || "";
              console.log("idItemReceipt", idItemReceipt);

              recObj.setValue("custrecord_ptg_recepcion_articulo", idItemReceipt);

              var customRecord = recObj.save();

              if(customRecord){
                var urll = location;
                var urlll = location.href;
                var url = location.href + "&cf=" + newForm;
                location.replace(url);
              }

            } else {
              console.log("NO OK porque es " + result);
            }

            
          }

          function failure(reason) {
            console.log('Failure: ' + reason);
            
          }

          dialog.confirm(options).then(success).catch(failure);          

        } catch (e) {
            log.error("Error", "[ redirectTo ] " + e);
        }

    };


    return {
        fieldChanged: fieldChanged,
        redirectTo: redirectTo,
        validateLine: validateLine
    };
});