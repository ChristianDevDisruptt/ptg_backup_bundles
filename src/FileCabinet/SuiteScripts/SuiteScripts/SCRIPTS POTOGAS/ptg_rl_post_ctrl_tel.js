/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record"], function (record) {

    function _post(request) {

        const responseData = {
            success: false,
            message: "some errors occured",
            data: null,
            apiErrorPost: []
        }

        try {
            log.audit('request', request);
            var newCtrl = record.create({
                type: 'CUSTOMRECORD_PTG_CONTROL_CLI_TLF_AVI_LLA',
                isDynamic: true
            });

            newCtrl.setValue({
                fieldId: 'custrecord_ptg_id_cliente_ctal',
                value: request.id_cliente
            });

            newCtrl.setValue({
                fieldId: 'custrecord_ptg_id_oportunidad_ctal',
                value: request.id_opp
            });

            newCtrl.setValue({
                fieldId: 'custrecord_ptg_obser_ctal',
                value: request.observacion
            });

            newCtrl.setValue({
                fieldId: 'custrecord_ptg_estado_seguimiento_ctal',
                value: request.estado
            });

            newCtrl.setValue({
                fieldId: 'custrecord_ptg_fecha_cracion_ctal',
                value: new Date()
            });

            newCtrl.save();

            var idCtrl = newCtrl;
            log.audit('ctrl creado', idCtrl);

            if (idCtrl) {
                responseData.success = true;
                responseData.message = "Ctrl created successfully";
                responseData.data = idCtrl
            }

        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
        }

        return responseData
    }

    return {
        post: _post
    }
});