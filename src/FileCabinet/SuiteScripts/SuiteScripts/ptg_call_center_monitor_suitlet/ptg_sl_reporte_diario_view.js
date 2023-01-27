/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/https', 'N/log', 'N/record', 'N/render', 'N/runtime', 'N/search', 'N/url'],
    /**
 * @param{file} file
 * @param{https} https
 * @param{log} log
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 * @param{url} url
 */
    (file, https, log, record, render, runtime, search, url) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        
        const onRequest = (scriptContext) => {
            //Información general del usuario
            let remainingUsage = runtime.getCurrentScript()
            let remainingUser = runtime.getCurrentUser()
            let remainingSession = runtime.getCurrentSession()
            log.debug('remainingUsage', remainingUsage)
            log.debug('remainingUser', remainingUser)
            log.debug('remainingSession', remainingSession)

            //Instacia del DS
            let datasource = {};

            //Instancia de RL para consumir
            //Home
            let getPlantas = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_plantas_rs',
                deploymentId: 'customdeploy_ptg_consulta_plantas_rs'
            });

            let getListStatusOpp = url.resolveScript({
                scriptId: 'customscript_ptg_status_op_rs',
                deploymentId: 'customdeploy_ptg_status_op_rs'
            });

            let getListRoutes = url.resolveScript({
                scriptId: 'customscript_ptg_rutas_get_rs',
                deploymentId: 'customdeploy_ptg_rutas_get_rs'
            });

            let getListTypeServices = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_tipo_servicio',
                deploymentId: 'customdeploy_ptg_consulta_tipo_servicio'
            });

            let getOppMonitor = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_reporte_diario',
                deploymentId: 'customdeploy_ptg_rl_get_reporte_diario'
            });

            let getCasesMonitor = url.resolveScript({
                scriptId: 'customscript_ptg_filter_s_case_rs',
                deploymentId: 'customdeploy_ptg_filter_s_case_rs'
            });

            let putOppMonitor = url.resolveScript({
                scriptId: 'customscript_ptg_rl_post_opport',
                deploymentId: 'customdeploy_ptg_rl_post_opport'
            });

            let getListCancellReason = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_cancell_rea',
                deploymentId: 'customdeploy_ptg_rl_get_list_cancell_rea'
            });

            let postNoteandMessage = url.resolveScript({
                scriptId: 'customscript_ptg_post_note_message_rl',
                deploymentId: 'customdeploy_ptg_post_note_message_rl'
            });

            let getOPP = url.resolveScript({
                scriptId: 'customscript_ptg_get_opportunity_rs',
                deploymentId: 'customdeploy_ptg_get_opportunity_rs'
            });

            let getTotalOfRoutes = url.resolveScript({
                scriptId: 'customscript_ptg_get_opportunity_rs',
                deploymentId: 'customdeploy_ptg_get_opportunity_rs'
            });

            let getLisConceptosCasos = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_con_cases',
                deploymentId: 'customdeploy_ptg_rl_get_list_con_cases'
            });

            let getItems = url.resolveScript({
                scriptId: 'customscript_ptg_consulta_items_rs',
                deploymentId: 'customdeploy_ptg_consulta_items_rs'
            });

            let putCases = url.resolveScript({
                scriptId: 'customscript_ptg_post_case_rl',
                deploymentId: 'customdeploy_ptg_post_case_rl'
            });

            let getMessageandNotes = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_msg_note_of_case',
                deploymentId: 'customdeploy_ptg_rl_get_msg_note_of_case'
            });

            let getListSuppEmp = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_supp_emp',
                deploymentId: 'customdeploy_ptg_rl_get_list_supp_emp'
            });

            let getItemsOpp = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_items_of_opp',
                deploymentId: 'customdeploy_ptg_rl_get_items_of_opp'
            });

            let getMethodPayments = url.resolveScript({
                scriptId: 'customscript_ptg_sl_get_method_payment',
                deploymentId: 'customdeploy_ptg_sl_get_method_payment'
            });

            let getListTravelNumber = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_list_tb_travel',
                deploymentId: 'customdeploy_ptg_rl_get_list_tb_travel'
            });

            let sendNotification = url.resolveScript({
                scriptId: 'customscript_ptg_rl_send_notifications',
                deploymentId: 'customdeploy_ptg_rl_send_notifications'
            });

            let getNotesOfOPP = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_msg_note_of_opp',
                deploymentId: 'customdeploy_ptg_rl_get_msg_note_of_opp'
            });

            let getListStatusCallAlert = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_status_callalert',
                deploymentId: 'customdeploy_ptg_rl_get_status_callalert'
            });

            datasource.getPlantas = getPlantas
            datasource.userId = remainingUser.id
            datasource.userName = remainingUser.name
            datasource.userRole = remainingUser.roleId
            datasource.getListStatusOpp = getListStatusOpp
            datasource.getListRoutes = getListRoutes
            datasource.getListTypeServices = getListTypeServices
            datasource.getOppMonitor = getOppMonitor
            datasource.getCasesMonitor = getCasesMonitor
            datasource.putOppMonitor = putOppMonitor
            datasource.getListCancellReason = getListCancellReason
            datasource.postNoteandMessage = postNoteandMessage
            datasource.getOpp = getOPP
            datasource.getTotalOfRoutes = getTotalOfRoutes
            datasource.getLisConceptosCasos = getLisConceptosCasos
            datasource.getItems = getItems
            datasource.putCases = putCases
            datasource.getMessageandNotes = getMessageandNotes
            datasource.getListSuppEmp = getListSuppEmp
            datasource.getItemsOpp = getItemsOpp
            datasource.getMethodPayments = getMethodPayments
            datasource.getListTravelNumber = getListTravelNumber
            datasource.sendNotification = sendNotification
            datasource.getNotesOfOPP = getNotesOfOPP
            datasource.getListStatusCallAlert = getListStatusCallAlert
            
                        
            //Carga de View (html)
            let viewHtml = file.load({
                id: 'SuiteScripts/ptg_call_center_monitor_suitlet/view/reporte_diario.html'
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
