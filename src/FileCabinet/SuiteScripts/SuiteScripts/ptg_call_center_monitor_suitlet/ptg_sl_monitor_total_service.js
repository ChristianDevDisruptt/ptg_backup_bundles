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
            
            let getRutasActivas = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_rutas_activas',
                deploymentId: 'customdeploy_ptg_rl_get_rutas_activas'
            });
          
          	let getChoferes = url.resolveScript({
                scriptId: 'customscript_ptg_rl_get_choferes',
                deploymentId: 'customdeploy_ptg_rl_get_choferes'
            });
            
            datasource.userName = remainingUser.name
            datasource.userRole = remainingUser.roleId
          	datasource.userSubsidiary = remainingUser.subsidiary
            datasource.getPlantas = getPlantas   
            datasource.getTotalOfRoutes = getTotalOfRoutes
            datasource.getListStatusOpp = getListStatusOpp
            datasource.getRutasActivas = getRutasActivas
          	datasource.getChoferes = getChoferes
            //Carga de View (html)
            let viewHtml = file.load({
                id: 'SuiteScripts/ptg_call_center_monitor_suitlet/view/resumen_rutas.html'
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
