/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/https', 'N/record', 'N/render', 'N/runtime', 'N/search', 'N/url'],
    /**
 * @param{file} file
 * @param{https} https
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 * @param{url} url
 */
    (file, https, record, render, runtime, search, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            let remainingUsage = runtime.getCurrentScript()
            let remainingUser = runtime.getCurrentUser()
            let remainingSession = runtime.getCurrentSession()
            log.debug('remainingUsage', remainingUsage)
            log.debug('remainingUser', remainingUser)
            log.debug('remainingSession', remainingSession)
            log.debug('test mac')

            //Instacia del DS
            let datasource = {};

            //Instancia de RL para consumir      
            let getPlantas = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_plantas_rs',
                deploymentId: 'customdeploy_ptg_consulta_plantas_rs'
            });   
            
            let getTotalOfRoutes = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_total_op_mo',
                deploymentId: 'customdeploy_ptg_rl_get_list_total_op_mo'
            });

            let getListStatusOpp = url.resolveScript({
                scriptId: 'customscript_ptg_status_op_rs',
                deploymentId: 'customdeploy_ptg_status_op_rs'
            });

            let getZone = url.resolveScript({
                scriptId: 'customscript_drt_ptg_get_zonas_rs',
                deploymentId: 'customdeploy_drt_ptg_get_zonas_rs'
            });

            let getListRoutes = url.resolveScript({
                scriptId: 'customscript_ptg_rutas_get_rs',
                deploymentId: 'customdeploy_ptg_rutas_get_rs'
            });
                        
            let getListTypeServices = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_tipo_servicio',
                deploymentId: 'customdeploy_ptg_consulta_tipo_servicio'
            });
                        
            let getListTypeContact = url.resolveScript({
                scriptId: 'customscript_ptg_rl_list_get_typecontact',
                deploymentId: 'customdeploy_ptg_rl_list_get_typecontact'
            });

            let getOppMonitor = url.resolveScript({
                scriptId: 'customscript_ptg_get_op_monitor_rs',
                deploymentId: 'customdeploy_ptg_get_op_monitor_rs'
            });

            let getItemsOpp = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_items_of_opp',
                deploymentId: 'customdeploy_ptg_rl_get_items_of_opp'
            });

            let putOppMonitor = url.resolveScript({
                scriptId: 'customscript_ptg_rl_post_opport',
                deploymentId: 'customdeploy_ptg_rl_post_opport'
            });

            let postNoteandMessage = url.resolveScript({
                scriptId: 'customscript_ptg_post_note_message_rl',
                deploymentId: 'customdeploy_ptg_post_note_message_rl'
            });

            let getMessageandNotes = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_msg_note_of_case',
                deploymentId: 'customdeploy_ptg_rl_get_msg_note_of_case'
            });
          
          	let getNotesOfOPP = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_msg_note_of_opp',
                deploymentId: 'customdeploy_ptg_rl_get_msg_note_of_opp'
            });

            let getListCancellReason = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_cancell_rea',
                deploymentId: 'customdeploy_ptg_rl_get_list_cancell_rea'
            });

            let getMethodPayments = url.resolveScript({
                scriptId: 'customscript_ptg_sl_get_method_payment',
                deploymentId: 'customdeploy_ptg_sl_get_method_payment'
            });

            let getItems = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_items_rs',
                deploymentId: 'customdeploy_ptg_consulta_items_rs'
            });

            let getListStatusCallAlert = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_status_callalert',
                deploymentId: 'customdeploy_ptg_rl_get_status_callalert'
            });

            let getColonias = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_colonias',
                deploymentId: 'customdeploy_ptg_rl_get_colonias'
            });

            let getCustomerV2 = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_customer_v2',
                deploymentId: 'customdeploy_ptg_rl_get_customer_v2'
            });

            /*let getHistoricoOpp = url.resolveScript({
                scriptId: 'customscript_ptg_cc_oport_changelog',
                deploymentId: 'customdeploy_ptg_cc_oport_changelog_imp'
            });*/

            let getOppTelefonico = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_opp_telefonico',
                deploymentId: 'customdeploy_ptg_rl_get_opp_telefonico'
            });

            let postCtrlTel = url.resolveScript({
                scriptId: 'customscript_ptg_rl_post_ctrl_telefonico',
                deploymentId: 'customdeploy_ptg_rl_post_ctrl_telefonico'
            });

            let getCtrlTel = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_contro_tel',
                deploymentId: 'customdeploy_ptg_rl_get_contro_tel'
            });
                        
            datasource.userName = remainingUser.name
            datasource.userRole = remainingUser.roleId
            datasource.getPlantas = getPlantas   
            datasource.getTotalOfRoutes = getTotalOfRoutes
            datasource.getListStatusOpp = getListStatusOpp
            datasource.getZone = getZone
            datasource.getListRoutes = getListRoutes
            datasource.getListTypeServices = getListTypeServices
            datasource.getListTypeContact = getListTypeContact
            datasource.getOppMonitor = getOppMonitor
            datasource.getItemsOpp = getItemsOpp
            datasource.putOppMonitor = putOppMonitor
            datasource.postNoteandMessage = postNoteandMessage
            datasource.getMessageandNotes = getMessageandNotes
          	datasource.getNotesOfOPP = getNotesOfOPP
            datasource.getListCancellReason = getListCancellReason
            datasource.getMethodPayments = getMethodPayments
            datasource.getItems = getItems
            datasource.getListStatusCallAlert = getListStatusCallAlert
            datasource.getColonias = getColonias
            datasource.getCustomerV2 = getCustomerV2
            //datasource.getHistoricoOpp = getHistoricoOpp
            datasource.getOppTelefonico = getOppTelefonico
            datasource.postCtrlTel = postCtrlTel
            datasource.getCtrlTel = getCtrlTel;

            //Carga de View (html)
            let viewHtml = file.load({
                id: 'SuiteScripts/ptg_call_center_monitor_suitlet/view/servicios_programados.html'
            });

            //Creación del Render
            let renderView = render.create();
            renderView.templateContent = viewHtml.getContents();

            //Pase del DS, con información y los restlet
            renderView.addCustomDataSource({
                format: render.DataSource.OBJECT,
                alias: 'ds',
                data: datasource

            });

            let renderedPage = renderView.renderAsString();
            scriptContext.response.write(renderedPage);

        }

        return {onRequest}

    });
