/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Consumo Interno de Combustible MR
 * Script id: customscript_drt_ptg_cons_int_comb_mr
 * Deployment id: customdeploy_drt_ptg_cons_int_comb_mr
 * Applied to: 
 * File: drt_ptg_cons_int_comb_mr.js
 ******************************************************************/

/**
 *@NApiVersion 2.x
 *@NScriptType MapReduceScript
 */
 define(['N/runtime', 'N/search', 'N/record', 'N/email', 'N/error', 'N/url', 'N/https'], function (runtime, search, record, email, error, url, https) {

    function getInputData() {
        try {
            var respuesta = '';

            var idRegistro = runtime.getCurrentScript().getParameter({
                name: 'custscript_drt_ptg_id_reg_cons_comb'
            }) || '';
            log.debug("idRegistro", idRegistro);
             
            var arrayColumns = [
                search.createColumn({name: "custrecord_ptg_litroscargados", label: "PTG - Litros cargados"}),
                search.createColumn({name: "custrecord_ptg_ubicacionruta_", join: "CUSTRECORD_PTG_NUMVEHICULO_CONSUMINTERN_", label: "PTG - Ubicación/Ruta" }),
                search.createColumn({name: "custrecord_ptg_subsidiaria_1", join: "CUSTRECORD_PTG_NUMVEHICULO_CONSUMINTERN_", label: "PTG- SUBSIDIARIA" }),
                search.createColumn({name: "custrecord_ptg_precio_por_omision_", join: "CUSTRECORD_PTG_CONSUM_INTERN_", label: "PTG - Precio por Omisión"})
            ];

            var arrayFilters = [
                ["custrecord_ptg_consum_intern_","anyof",idRegistro], 
                "AND", 
                ["custrecord_ptg_consuinterno_ajuste","anyof","@NONE@"]
             ],

            //BÚSQUEDA GUARDADA: PTG - Consumo Interno SS
            respuesta = search.create({
                type: 'customrecord_ptg_detalle_consumo_interno',
                columns: arrayColumns,
                filters: arrayFilters
            });


        } catch (error) {
            log.audit({
                title: 'error getInputData',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta getInputData Finally',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function map(context) {
        try {
            log.audit({
                title: 'context map',
                details: JSON.stringify(context)
            });

            var objValue = JSON.parse(context.value);
            var idRegistroLinea = objValue.id;
            log.audit("idRegistroLinea", idRegistroLinea);
            var cuentaAjuste = 0;
            var idArticuloGasolina = 0;
            var idAlmacenGasolina = 0;
            var regUpdate = {};
            var litros = objValue.values["custrecord_ptg_litroscargados"];
            var planta = objValue.values["custrecord_ptg_ubicacionruta_.CUSTRECORD_PTG_NUMVEHICULO_CONSUMINTERN_"].value;
            var subsidiaria = objValue.values["custrecord_ptg_subsidiaria_1.CUSTRECORD_PTG_NUMVEHICULO_CONSUMINTERN_"].value;
            var precioOmision = objValue.values["custrecord_ptg_precio_por_omision_.CUSTRECORD_PTG_CONSUM_INTERN_"];
            log.debug("litros", litros);
            log.debug("planta", planta);
            log.debug("subsidiaria", subsidiaria);

            if (runtime.envType === runtime.EnvType.SANDBOX) {
              idAlmacenGasolina = 1524;
              idArticuloGasolina = 4605;
              cuentaAjuste = 994;
            } else if (runtime.envType === runtime.EnvType.PRODUCTION) {
              idAlmacenGasolina = 1524;
              idArticuloGasolina = 4605;
              cuentaAjuste = 994;
            }

            var cantidadLitros = parseFloat(litros) * -1;
            log.debug("cantidadLitros", cantidadLitros);


            var recAjusteInventario = record.create({
                type: "inventoryadjustment",
                isDynamic: true,
              });
      
              recAjusteInventario.setValue("subsidiary", subsidiaria);
              recAjusteInventario.setValue("adjlocation", planta);
              recAjusteInventario.setValue("account", cuentaAjuste);
      
              for (var k = 0; k < 1; k++) {
                recAjusteInventario.selectLine("inventory", k);
                recAjusteInventario.setCurrentSublistValue("inventory", "item", idArticuloGasolina);
                recAjusteInventario.setCurrentSublistValue("inventory", "location", idAlmacenGasolina);
                recAjusteInventario.setCurrentSublistValue("inventory", "adjustqtyby", cantidadLitros);
                recAjusteInventario.setCurrentSublistValue("inventory", "unitcost", precioOmision);
                recAjusteInventario.commitLine("inventory");
              }
      
              var recAjusteIdSaved = recAjusteInventario.save();
      
              log.debug("Ajuste de inventario creado", "ID: "+recAjusteIdSaved);

              regUpdate.custrecord_ptg_consuinterno_ajuste = recAjusteIdSaved;
              regUpdate.custrecord_ptg_error_consumintern_ = "";      
            

            context.write({
                key: recAjusteIdSaved,
                value: recAjusteIdSaved
            });
               
        } catch (error) {
            log.error({
                title: 'error map',
                details: JSON.stringify(error)
            });
            regUpdate.custrecord_ptg_error_consumintern_ = error.message;
        } finally {
            record.submitFields({
                id: idRegistroLinea,
                type: "customrecord_ptg_detalle_consumo_interno",
                values: regUpdate,
            });
        }
    }

    function reduce(context) {
        try {
            log.audit({
                title: 'context reduce',
                details: JSON.stringify(context)
            });
            var idAjusteInventario = JSON.parse(context.key);
            log.audit("idAjusteInventario", idAjusteInventario);
            
			
        } catch (error) {
            log.error({
                title: 'error reduce',
                details: JSON.stringify(error)
            });
        }
    }

    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});