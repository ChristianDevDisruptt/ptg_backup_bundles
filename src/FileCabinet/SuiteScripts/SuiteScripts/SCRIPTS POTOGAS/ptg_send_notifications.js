/**
* @NApiVersion 2.x
* @NScriptType Restlet
*/

define(["N/log", "N/record", "N/search", 'N/https', 'N/sftp', 'N/file', 'N/crypto', 'N/encode', 'N/https'], function (log, record, search, https, sftp, file, crypto, encode, https) {
    function sendNotification(context) {
        log.audit("data", context);
        var data = { 
            notification: {
                status: true,
                data: null
            }
        };
        if(context.sms) {
            data.sms ={
                status: true,
                data: null
            };

            try {
                log.audit("0", "0");
                const url = "207.249.139.228";
                const port = 22;
                const hostKeyType = "rsa";
                const HOST_KEY_TOOL_URL = 'https://ursuscode.com/tools/sshkeyscan.php?url=';
                var splitString = "ssh-rsa";
                var myUrl = HOST_KEY_TOOL_URL + url + "&port=" + port + "&type=" + hostKeyType;
                var rgx = /ssh-.+? ([^ \r\n]+)/igm
                log.audit(myUrl);
                //theResponse = https.get({ url: myUrl });
                //log.audit("theResponse", theResponse);
                //var code = "AAAAB3NzaC1yc2EAAAABIwAAAIEA0ZwtkAPK1SX+2cEP1G9DINFbGf92fPCHdq8QPghNDIKzFZlCp51c4ZbkAiZpbHpIKmDSM1LecllIT8NBem4mV0X5TdobsS7OsQ9F5QCHuHrhzYmMgX8LnfGLaZymhiQ89acP1h83qJ4/dj+95x+2f0ZcD5215PAMcqjP5z27Mgc=";// theResponse.body.split(splitString)[1].replace(' ', '');
                var code = "AAAAB3NzaC1yc2EAAAABIwAAAIEA0ZwtkAPK1SX+2cEP1G9DINFbGf92fPCHdq8QPghNDIKzFZlCp51c4ZbkAiZpbHpIKmDSM1LecllIT8NBem4mV0X5TdobsS7OsQ9F5QCHuHrhzYmMgX8LnfGLaZymhiQ89acP1h83qJ4/dj+95x+2f0ZcD5215PAMcqjP5z27Mgc=";
                log.audit("code", code);
                log.audit("context", context);
                log.audit("0.1","0.1");
                // Establish a connection to a remote FTP server
                var connection = sftp.createConnection({
                    username: 'netsuite_rioverde',
                    secret: 'custsecret_ptg_sftp_potogas_2',
                    url: url,
                    port: port,
                    hostKey: code,
                    hostKeyType: hostKeyType
                });
                log.audit("1","1");
                var myFileToUpload = file.create({
                    name: context.sms.title+'.txt',
                    fileType: file.Type.PLAINTEXT,
                    contents: context.sms.message
                });
                log.audit("2","2");
                connection.upload({
                    filename: context.sms.title+'.txt',
                    file: myFileToUpload,
                    replaceExisting: true
                });
                log.audit("3","3");
                data.sms.data = "SMS enviado correctamente";
            } catch(er02) {
                data.sms.status = false;
                data.sms.data = er02;
            }
            
        }


        var header=[];
        var postData= {
            "app_id": "e85893ff-bde7-4196-a104-c673fc4680eb",
            "headings": {"en": context.notification.title, "es": context.notification.title},
            "contents":  {"en": context.notification.message, "es": context.notification.message},
            "included_segments" : ["Active Users"]
        };
        postData=JSON.stringify(postData);
        header['Content-Type'] = 'application/json';
        header['Authorization'] = 'Basic NWVlNjI0MmUtNWViYy00ZGI1LTgzMTUtZGY4NmJiYTk5OGZi';

        var apiURL='https://onesignal.com/api/v1/notifications';
        try {
            var response = https.post({
              url: apiURL,
              headers: header,
              body: postData
            });
            var newSFID=response.body;
            
            data.notification.data = JSON.parse(newSFID);
        } catch(er02) {
            data.notification.status = false;
            data.notification.data = er02;
        }
        log.audit("data", data);
        return { success: true, data: data };
    }
    return {
        post: sendNotification
    }
});
