/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define([
    "N/format",
    "N/record",
    "N/file",
    "N/runtime"
], function (
    format,
    record,
    file,
    runtime
) {
    function _post(context) {
        try {
            var respuesta = {
                succes: true,
                data: "",
                file: "",
                folder: "",
                error: ""
            };
            log.audit({
                title: ' post ',
                details: JSON.stringify(context)
            });

            respuesta.folder = runtime.getCurrentScript().getParameter({
                name: 'custscript_disa_inventory_folder'
            }) || "";
            if (
                context &&
                context.length > 0 &&
                context[0].dateConsulted &&
                respuesta.folder
            ) {
                var detail_csv = file.create({
                    name: context[0].dateConsulted + '.json',
                    fileType: file.Type.PLAINTEXT,
                    contents: JSON.stringify(context),
                    encoding: file.Encoding.UTF8,
                    folder: respuesta.folder,
                    isOnline: true
                });
                respuesta.file = detail_csv.save() || "";
                if (respuesta.file) {
                    var newRecord = record.create({
                        type: 'customrecord_wep_inventory_wms',
                        isDynamic: true
                    });
                    var d = new Date();
                    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
                    var objDate = new Date(utc + (3600000 * '-5'));

                    newRecord.setValue({
                        fieldId: "name",
                        value: objDate.toISOString()
                    });

                    newRecord.setValue({
                        fieldId: "custrecord_wms_inventory_fecha_consulta",
                        value: format.parse({
                            value: new Date(context[0].dateConsulted),
                            type: format.Type.DATE
                        })
                    });
                    newRecord.setValue({
                        fieldId: "custrecord_wms_inventory_fecha_hora",
                        value: context[0].dateConsulted
                    });
                }

                newRecord.setValue({
                    fieldId: 'custrecord_wms_inventory_type',
                    value: 2
                });

                newRecord.setValue({
                    fieldId: 'custrecord_wms_inventory_numero_registro',
                    value: context.length
                });

                newRecord.setValue({
                    fieldId: 'custrecord_wms_inventory_summary_json',
                    value: JSON.stringify(respuesta.file)
                });

                respuesta.data = newRecord.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });

            }
        } catch (error) {
            log.error({
                title: 'error post',
                details: error
            });
            respuesta.error = error;
        } finally {
            log.audit({
                title: 'respuesta post',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    return {
        post: _post,
    }
});