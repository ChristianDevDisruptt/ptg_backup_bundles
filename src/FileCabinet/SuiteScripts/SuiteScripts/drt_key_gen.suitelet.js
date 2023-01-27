/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget'],
    /**
 * @param{serverWidget} serverWidget
 */
    (ui) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            var request = scriptContext.request;
            var response = scriptContext.response;  
            if(request.method === "GET"){
                var form = ui.createForm({title: 'Enter SFTP Credentials'});
                var credField = form.addCredentialField({
                id: 'custfield_sftp_password_token',
                label: 'SFTP Password',
                //restrictToScriptIds: ['customscriptdrt_carta_porte_map_reduce'],
                restrictToScriptIds: ['customscript_drt_cp_tim_masive_mr'],
                restrictToDomains:["207.249.139.228"],

                restrictToCurrentUser: false //Depends on use case
                });
                credField.maxLength = 64;
                form.addSubmitButton();
                response.writePage(form);
               }
               if(request.method === "POST"){
                // Read the request parameter matching the field ID we specified in the form
                var passwordToken = request.parameters.custfield_sftp_password_token;
                log.debug({
                title: 'New password token',
                details: passwordToken
                });
                // In a real-world script, "passwordToken" is saved into a custom field here...
               }
                              
        }

        return {onRequest}

    });
