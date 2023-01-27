/******************************************************************
 * * DisrupTT * DisrupTT Developers *
 * ****************************************************************
 * Date: 05/2022
 * Script name: PTG - Pagos Farmacias Guadalajara UE
 * Script id: customscript_drt_ptg_pagos_famr_gld_ue
 * Deployment id: customdeploy_drt_ptg_pagos_famr_gld_ue
 * Applied to: PTG - Pagos Farmacias Guadalajara
 * File: drt_ptg_pagos_famr_gld_ue.js
 ******************************************************************/
/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
 define(['N/record', 'N/xml', 'N/file', 'N/format', 'N/task', 'N/runtime'], function (record, xml, file, format, task, runtime) {

    function afterSubmit(context) {
        try {
            log.audit('Remaining Usage init afterSubmit start', runtime.getCurrentScript().getRemainingUsage());
            var record_context = context.newRecord;
            var recType = record_context.type;
            var recId = record_context.id;
            log.audit('record_context', record_context);
            log.audit('recType', recType);
            log.audit('recId', recId);

            
            if (context.type == "create") {
            log.audit({
                title: 'context.type',
                details: JSON.stringify(context.type)
            });

            

            var recordLoad = record.load({
                type: recType,
                id: recId,
                isDynamic: true,
            });

            log.audit('recordLoad', recordLoad);

            var xmlTransaction = recordLoad.getValue({
                fieldId: 'custrecord_ptg_archivo_pagos_farm_gld'
            });

            var fileXml = file.load({
                id: xmlTransaction
            });
            log.audit('fileXml', fileXml);

            var xmlData = fileXml.getContents();
            log.audit('xmlData', xmlData);

            var line = xmlData.split('|');
            log.audit("line", line);
            log.audit("lineconteo", line.length);

            var conteoMenos = 0;

            var temp = [];
            var tst = [];
            
            for(var i = 0; i<line.length; i+=8){
                pedacito = line.slice(i, i+8);
                temp.push(pedacito);
            }
            log.debug("temp fuera", temp);
            log.debug("temp conteo", temp.length);

            for(var j = 0; j<temp.length; j++){
                tst[j] = temp[j];
                var numeroSucursal = tst[j][0];
                var referenciaPago = parseFloat(tst[j][1]).toFixed(0) || 0;
                var fechaDePago = tst[j][2];
                var ceroUno = tst[j][3];
                var importeDePago = parseFloat(tst[j][4]).toFixed(2);
                var numeroContrato = parseFloat(tst[j][5]).toFixed(0) || 0;
                //var septimoValor = tst[j][6];
                //var octavoValor = tst[j][7];

                log.audit("tst", tst[j]);
                log.audit("numeroSucursal", numeroSucursal);
                log.audit("referenciaPago", referenciaPago);
                log.audit("fechaDePago", fechaDePago);
                log.audit("ceroUno", ceroUno);
                log.audit("importeDePago", importeDePago);
                log.debug("numeroContrato", numeroContrato);
                //log.audit(septimoValor);
                //log.audit(octavoValor);

                //var fechaPS = fechaDePago.toString();

                //var fechaPSS = fechaDePago.replace(/ /g, "");

                

                if(!importeDePago){
                    conteoMenos += 1;
                } else {
                    var fechaPSS = fechaDePago.split(" ").join("");
                    log.emergency("fechaPSS", fechaPSS);
                    
                    var fechaFormato = format.parse({
                        value: fechaPSS.substring(0, 2) + '/' + fechaPSS.substring(3, 5) + '/' + fechaPSS.substring(6, 10),
                        type: format.Type.DATE
                    });
                    log.emergency("fechaFormato", fechaFormato);

                    var pagosFarmaciasLineas = record.create({
                        type: "customrecord_ptg_pagos_farmacias_gdl_lin",
                        isDynamic: true,
                    });
                    pagosFarmaciasLineas.setValue("custrecord_ptg_no_sucursal_farm_gdl_l", numeroSucursal);
                    pagosFarmaciasLineas.setValue("custrecord_ptg_ref_pago_farm_gdl_l", referenciaPago);
                    pagosFarmaciasLineas.setValue("custrecord_ptg_fecha_pago_farm_gdl_l", format.parse({
                        value: fechaPSS.substring(0, 2) + '/' + fechaPSS.substring(3, 5) + '/' + fechaPSS.substring(6, 10),
                        type: format.Type.DATE
                    }));
                    pagosFarmaciasLineas.setValue("custrecord_ptg_cero_uno_farm_gdl_l", ceroUno);
                    pagosFarmaciasLineas.setValue("custrecord_ptg_importe_pago_farm_gdl_l", importeDePago);
                    pagosFarmaciasLineas.setValue("custrecord_ptg_no_contrato_farm_gdl_l", numeroContrato);
                   // pagosFarmaciasLineas.setValue("custrecord_ptg_campo7", septimoValor);
                   // pagosFarmaciasLineas.setValue("custrecord_ptg_campo8", octavoValor);
                    pagosFarmaciasLineas.setValue("custrecord_ptg_pagos_farmacias_gdl_paren", recId);
                    var pagosFarmaciasLineasIdSaved = pagosFarmaciasLineas.save();
                    log.debug({
                        title: "DETALLE DE VENTAS",
                        details: "Id Saved: " + pagosFarmaciasLineasIdSaved,
                    });
                }
            }

            var conteoLineas = parseInt(temp.length);

            var totalPagosProcesar = conteoLineas - conteoMenos;
            log.debug("totalPagosProcesar", totalPagosProcesar);

            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_drt_ptg_pag_far_gld_li_mr',
                params: {
                  custscript_drt_ptg_id_registro_pag_far: recId,
                }
              });
              var mrTaskId = mrTask.submit();
              var taskStatus = task.checkStatus(mrTaskId);
              log.audit({title: 'taskStatus', details: JSON.stringify(taskStatus)});

              log.audit('Remaining Usage init afterSubmit end', runtime.getCurrentScript().getRemainingUsage());

        } else {
            var mrTask = task.create({
                taskType: task.TaskType.MAP_REDUCE,
                scriptId: 'customscript_drt_ptg_pag_far_gld_li_mr',
                params: {
                  custscript_drt_ptg_id_registro_pag_far: recId,
                }
              });
              var mrTaskId = mrTask.submit();
              var taskStatus = task.checkStatus(mrTaskId);
              log.audit({title: 'taskStatus', details: JSON.stringify(taskStatus)});
        }
        } catch (error) {
            log.audit('error afterSubmit', error);
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});