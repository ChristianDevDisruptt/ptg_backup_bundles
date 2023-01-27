/*******************************************************************************
 * * DisrupTT * DisrupTT Developers *
 * **************************************************************************
 * Date: 2021
 * Script name: DRT - Reallocate Item UE
 * Script id: customscript_drt_reallocate_item_ue
 * customer Deployment id: customdeploy_drt_reallocate_item_ue
 * Applied to: Invoice
 * File: drt_reallocate_item_ue.js
 ******************************************************************************/
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope public
 */
define(['N/search', 'N/record', 'N/error', 'N/runtime'],
    function (search, record, error, runtime) {

    var main = {

		beforeLoad: function(scriptContext) {

            var userObj = runtime.getCurrentUser();
            var roleId = userObj.role;
            log.debug("roleId", roleId);
            if (roleId != 3) {
                throw "No tiene permisos para acceder a esta página";
            }

		}
    };

    function isValidField(field) {
        return field !== '' && field != null;
    }

    return main;
});