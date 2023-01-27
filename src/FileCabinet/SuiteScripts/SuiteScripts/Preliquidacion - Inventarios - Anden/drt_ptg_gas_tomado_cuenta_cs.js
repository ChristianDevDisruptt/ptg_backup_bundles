  /******************************************************************
   * * DisrupTT * DisrupTT Developers *
   * ****************************************************************
   * Date: 04/2022
   * Script name: PTG - Gas tomado a cuenta CS
   * Script id: customscript_drt_ptg_gas_tomado_cuent_cs
   * customer Deployment id: customdeploy_drt_ptg_gas_tomado_cuent_cs
   * Applied to: PTG - Gas tomado a cuenta
   * File: drt_ptg_gas_tomado_cuenta_cs.js
   ******************************************************************/
  /**
   *@NApiVersion 2.x
  *@NScriptType ClientScript
  */
  define(["N/record", "N/search", "N/error", "N/runtime", "N/ui/dialog"], function (record, search, error, runtime, dialog) {
    function pageInit(context) {
      try {
        var currentRecord = context.currentRecord;
        var recId = currentRecord.id;
        var tipo = currentRecord.type;
        var folio = currentRecord.getValue("custrecord_ptg_num_toma_a_cuenta_");
        var nombre = "Por Asignar";

        if(!folio){
          currentRecord.setValue("custrecord_ptg_num_toma_a_cuenta_", nombre);
        }


      } catch (error) {
        console.log({
          title: "error fieldChanged",
          details: JSON.stringify(error),
        });
      }
    }

    function fieldChanged(context) {
      try {

        var currentRecord = context.currentRecord;
        var sublistName = context.sublistId;
        var sublistFieldName = context.fieldId;
        var line = context.line;
        var inventarioCero = 0;
        var cliente = currentRecord.getValue("custrecord_ptg_cliente_gas_cuenta_");

        if (cliente && sublistFieldName === "custrecord_ptg_cliente_gas_cuenta_"){
          
        //Búsqueda Guardada: Gas tomado cuenta cliente SS
        var oportunidadObj = search.create({
          type: "transaction",
          filters: [
            ["type","anyof","Opprtnty"], "AND", 
            ["name","anyof",cliente], "AND", 
            ["mainline","is","T"], "AND", 
            ["probability","equalto","100"]
          ],
          columns: [
            search.createColumn({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}),
            search.createColumn({name: "custrecord_ptg_ruta", join: "CUSTBODY_PTG_NUMERO_VIAJE", label: "PTG - Ruta"})
          ]
        });
        var oportunidadObjCount = oportunidadObj.runPaged().count;
        if(oportunidadObjCount > 0){
          var oportunidadObjResult = oportunidadObj.run().getRange({
            start: 0,
            end: 2,
          });
          (idOportunidad = oportunidadObjResult[0].getValue({name: "internalid", sort: search.Sort.DESC, label: "Internal ID"}));
          currentRecord.setValue("custrecord_ptg_ord_venta_gas_cuenta_", idOportunidad);
          (ruta = oportunidadObjResult[0].getValue({name: "custrecord_ptg_ruta", join: "CUSTBODY_PTG_NUMERO_VIAJE", label: "PTG - Ruta"}));
         
          var ubicacionObj = record.load({
            type: search.Type.LOCATION,
            id: ruta,
          });
          var planta = ubicacionObj.getValue("parent");
          currentRecord.setValue("custrecord_ptg_planta_gas_tomcuenta_", planta);

        } else {
          var options = {
            title: "Sin registro",
            message: "No hay servicios de Estacionarios para el cliente seleccionado",
          };
          dialog.alert(options);
        }
      }


      } catch (error) {
        console.log({
          title: "error fieldChanged",
          details: JSON.stringify(error),
        });
      }
    }

    function saveRecord(context) {
      try {
        debugger;
        var currentRecord = context.currentRecord;
        var idOportunidad = currentRecord.getValue("custrecord_ptg_ord_venta_gas_cuenta_");
        var litrosRecibidos = currentRecord.getValue("custrecord_ptg_lts_recibi_gas_cuenta_");
        var oportunidadObj = record.load({
          id: idOportunidad,
          type: search.Type.OPPORTUNITY,
        });
        var servicioEstacionario = oportunidadObj.getValue("custbody_ptg_servicioestacionario_");
        var servicioCilindro = oportunidadObj.getValue("custbody_ptg_serviciocilindro_");

        if(servicioEstacionario){
          //Búsqueda Guardada: PTG - Venta total Oportunidad SS
          var oportunidadObjSearch = search.create({
            type: "transaction",
            filters: [
               ["type","anyof","Opprtnty"], "AND", 
               ["mainline","is","F"], "AND", 
               ["internalid","anyof",idOportunidad], "AND", 
               ["taxline","is","F"]
            ],
            columns: [
               search.createColumn({name: "quantity", summary: "SUM", label: "Cantidad"})
            ]
         });
         var srchResults = oportunidadObjSearch.run().getRange({
          start: 0,
          end: 2,
        });
        if(srchResults.length > 0){
          (sumaVenta = srchResults[0].getValue({name: "quantity", summary: "SUM", label: "Cantidad"}));
        }
        } else if (servicioCilindro){
          //Búsqueda Guardada: PTG - Venta total Oportunidad Cilindro SS
          var oportunidadObjSearch = search.create({
            type: "transaction",
            filters: [
               ["type","anyof","Opprtnty"], "AND", 
               ["mainline","is","F"], "AND", 
               ["internalid","anyof",idOportunidad], "AND", 
               ["taxline","is","F"]
            ],
            columns: [
              search.createColumn({name: "quantity", label: "Cantidad"}),
              search.createColumn({name: "custcol_ptg_capacidad_articulo", label: "PTG - CAPACIDAD DEL ARTÍCULO"})
            ]
         });
         var srchResults = oportunidadObjSearch.run().getRange({
          start: 0,
          end: 2,
        });
        if(srchResults.length > 0){
          var suma = 0;
          for(var i = 0; i < srchResults.length; i++){
            (cantidad = srchResults[i].getValue({name: "quantity", label: "Cantidad"}));
          (capacidad = srchResults[i].getValue({name: "custcol_ptg_capacidad_articulo", label: "PTG - CAPACIDAD DEL ARTÍCULO"}));
          log.audit("cantidad", cantidad);
          log.audit("capacidad", capacidad);
          var capacidadTotal = cantidad * capacidad;
          log.audit("capacidadTotal", capacidadTotal);
          suma += capacidadTotal;
          log.audit("suma", suma);
          }
          sumaVenta = suma;
        }
        
        }
  
          if (litrosRecibidos > sumaVenta) {
            var options = {
              title: "Litros superados",
              message: "La cantidad ingresada (" + litrosRecibidos + ") supera la cantidad de la venta (" + sumaVenta + ") en el servicio",
            };
            dialog.alert(options);
            log.audit("Cantidad superada");
            return false;
          }
          return true;
      } catch (error) {
        console.log({
          title: "error saveRecord",
          details: JSON.stringify(error),
        });
      }
    }

    return {
      pageInit: pageInit,
      fieldChanged: fieldChanged,
     // saveRecord: saveRecord,
    };
  });
