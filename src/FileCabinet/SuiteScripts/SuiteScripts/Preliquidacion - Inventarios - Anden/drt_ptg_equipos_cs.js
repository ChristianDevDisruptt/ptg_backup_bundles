/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Equipos CS
 * Script id: customscript_drt_ptg_equipos_cs
 * customer Deployment id: customdeploy_drt_ptg_equipos_cs
 * Applied to: PTG - Equipos
 * File: drt_ptg_equipos_cs.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */
define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog",], function (record, search, error, runtime, dialog) {
  function fieldChanged(context) {
    try {
      var currentRecord = context.currentRecord;
      var cabeceraFieldName = context.fieldId;
      var nombre = currentRecord.getValue("name");

      if (nombre && cabeceraFieldName === "name") {
        currentRecord.setValue("custrecord_ptg_idequipo_", nombre);
      }
    } catch (error) {
      log.audit({
        title: "error fieldChanged",
        details: JSON.stringify(error),
      });
    }
  }

  function validateLine(context) {
    try {
      var currentRecord = context.currentRecord;
      var sublistName = context.sublistId;
      var sublistaDotacion = "recmachcustrecord_ptg_equipodotacion";

      if (sublistName === sublistaDotacion) {
        var articulo = currentRecord.getCurrentSublistValue({
          sublistId: sublistName,
          fieldId: "custrecord_ptg_cilindro_dotacion",
        });
        var cantidad = currentRecord.getCurrentSublistValue({
          sublistId: sublistName,
          fieldId: "custrecord_ptg_cantidad_dotacion_",
        });

        if (!articulo || !cantidad) {
          var options = {
            title: "Faltan datos",
            message: "Faltan datos en el registro",
          };
          dialog.alert(options);
          return false;
        } else {
          return true;
        }
      }
    } catch (error) {}
  }

  function saveRecord(context) {
    try {
      var currentRecord = context.currentRecord;
      var idRecord = currentRecord.id;
      log.debug("idRecord", idRecord);
      var idEquipo = currentRecord.getValue("custrecord_ptg_idequipo_");
      //Búsqueda Guardada: PTG - Equipos Búsqueda
      var idEquipoObj = search.create({
        type: "customrecord_ptg_equipos",
        filters: [
          ["custrecord_ptg_idequipo_", "is", idEquipo], "OR",
          ["name", "is", idEquipo],
        ],
        columns: [
          //search.createColumn({name: "internalid", label: "ID interno"})
          search.createColumn({ name: "internalid", sort: search.Sort.DESC, label: "ID interno"})
        ],
      });
      var idEquipoObjCount = idEquipoObj.runPaged().count;
      

      if (idEquipoObjCount > 0) {
        var idEquipoObjResult = idEquipoObj.run().getRange({
          start: 0,
          end: idEquipoObjCount,
        });
        (idInternoEquipo = idEquipoObjResult[0].getValue({name: "internalid", label: "ID interno"}));
        if(idRecord != idInternoEquipo){
          var options = {
            title: "Nombre existente",
            message: "Ya existe un Equipo con el ID " + idEquipo + ".",
          };
          dialog.alert(options);
        }
        else {
          return true;
        }
      } else {
        return true;
      }
    } catch (error) {
      console.log({
        title: "error saveRecord",
        details: JSON.stringify(error),
      });
    }
  }

  return {
    validateLine: validateLine,
    fieldChanged: fieldChanged,
    saveRecord: saveRecord,
  };
});
