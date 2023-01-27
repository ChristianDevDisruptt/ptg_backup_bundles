/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
 define(['N/ui/serverWidget','N/https'], function(serverWidget,https) {
    function onRequest(context) {
        if (context.request.method === 'GET') {

            // Section One - Forms - See 'Steps for Creating a Custom Form' in topic 'Sample Custom Form Script'
            var form = serverWidget.createForm({
                title: 'Reproceso Personalizado de WMS'
            });
          
            log.audit('Fecha Actual y hora: ', new Date());

            var usergroup = form.addFieldGroup({
                id: 'usergroup',
                label: 'Información de la Interfaz'
            });
            usergroup.isSingleColumn = false;

            var endpoint = form.addField({
                id: 'endpointid',
                type: serverWidget.FieldType.SELECT,
                label: 'Interfaz',
                container: 'usergroup'
            });

            endpoint.addSelectOption({
                value: '0',
                text: 'Selecciona la Interfaz'
            });
            endpoint.addSelectOption({
                value: '1',
                text: 'Receipt Simple Confirm'
            });
            endpoint.addSelectOption({
                value: '2',
                text: 'Picking Simple Confirm'
            });
            endpoint.addSelectOption({
                value: '3',
                text: 'Shipment'
            });
            endpoint.addSelectOption({
                value: '4',
                text: 'Adjust Confirm'
            });
            endpoint.addSelectOption({
                value: '5',
                text: 'Movement Between Areas'
            });
            endpoint.addSelectOption({
                value: '6',
                text: 'Inventory-Summary'
            });

            endpoint.isMandatory = true;

            var folio = form.addField({
                id: 'folioid',
                type: serverWidget.FieldType.TEXT,
                label: 'Folio',
                container: 'usergroup'
            });

            folio.maxLength = 15;
            folio.richTextWidth= 15;

            // Fecha Inicio
            var start = form.addField({
                id: 'startdateid',
                type: serverWidget.FieldType.DATE,
                label: 'Fecha Inicio',
                container: 'usergroup'
            });

            start.isMandatory = true;
            start.maxLength = 10;

            var starttime = form.addField({
                id: 'starttimeid',
                type: serverWidget.FieldType.SELECT,
                label: 'Hora Inicio',
                container: 'usergroup'
            });

            starttime.addSelectOption({
                value: '00',
                text: '00'
            });
            starttime.addSelectOption({
                value: '01',
                text: '01'
            });
            starttime.addSelectOption({
                value: '02',
                text: '02'
            });
            starttime.addSelectOption({
                value: '03',
                text: '03'
            });
            starttime.addSelectOption({
                value: '04',
                text: '04'
            });
            starttime.addSelectOption({
                value: '05',
                text: '05'
            });
            starttime.addSelectOption({
                value: '06',
                text: '06'
            });
            starttime.addSelectOption({
                value: '07',
                text: '07'
            });
            starttime.addSelectOption({
                value: '08',
                text: '08'
            });
            starttime.addSelectOption({
                value: '09',
                text: '09'
            });
            starttime.addSelectOption({
                value: '10',
                text: '10'
            });
            starttime.addSelectOption({
                value: '11',
                text: '11'
            });
            starttime.addSelectOption({
                value: '12',
                text: '12'
            });
            starttime.addSelectOption({
                value: '13',
                text: '13'
            });
            starttime.addSelectOption({
                value: '14',
                text: '14'
            });
            starttime.addSelectOption({
                value: '15',
                text: '15'
            });
            starttime.addSelectOption({
                value: '16',
                text: '16'
            });
            starttime.addSelectOption({
                value: '17',
                text: '17'
            });
            starttime.addSelectOption({
                value: '18',
                text: '18'
            });
            starttime.addSelectOption({
                value: '19',
                text: '19'
            });
            starttime.addSelectOption({
                value: '20',
                text: '20'
            });
            starttime.addSelectOption({
                value: '21',
                text: '21'
            });
            starttime.addSelectOption({
                value: '22',
                text: '22'
            });
            starttime.addSelectOption({
                value: '23',
                text: '23'
            });

            starttime.isMandatory = true;
            starttime.maxLength = 2;

            // Fecha Fin
            var end = form.addField({
                id: 'enddateid',
                type: serverWidget.FieldType.DATE,
                label: 'Fecha Fin',
                container: 'usergroup'
            });

            end.isMandatory = true;
            end.maxLength = 10;

            var endtime = form.addField({
                id: 'endtimeid',
                type: serverWidget.FieldType.SELECT,
                label: 'Hora Fin',
                container: 'usergroup'
            });

            endtime.addSelectOption({
                value: '00',
                text: '00'
            });
            endtime.addSelectOption({
                value: '01',
                text: '01'
            });
            endtime.addSelectOption({
                value: '02',
                text: '02'
            });
            endtime.addSelectOption({
                value: '03',
                text: '03'
            });
            endtime.addSelectOption({
                value: '04',
                text: '04'
            });
            endtime.addSelectOption({
                value: '05',
                text: '05'
            });
            endtime.addSelectOption({
                value: '06',
                text: '06'
            });
            endtime.addSelectOption({
                value: '07',
                text: '07'
            });
            endtime.addSelectOption({
                value: '08',
                text: '08'
            });
            endtime.addSelectOption({
                value: '09',
                text: '09'
            });
            endtime.addSelectOption({
                value: '10',
                text: '10'
            });
            endtime.addSelectOption({
                value: '11',
                text: '11'
            });
            endtime.addSelectOption({
                value: '12',
                text: '12'
            });
            endtime.addSelectOption({
                value: '13',
                text: '13'
            });
            endtime.addSelectOption({
                value: '14',
                text: '14'
            });
            endtime.addSelectOption({
                value: '15',
                text: '15'
            });
            endtime.addSelectOption({
                value: '16',
                text: '16'
            });
            endtime.addSelectOption({
                value: '17',
                text: '17'
            });
            endtime.addSelectOption({
                value: '18',
                text: '18'
            });
            endtime.addSelectOption({
                value: '19',
                text: '19'
            });
            endtime.addSelectOption({
                value: '20',
                text: '20'
            });
            endtime.addSelectOption({
                value: '21',
                text: '21'
            });
            endtime.addSelectOption({
                value: '22',
                text: '22'
            });
            endtime.addSelectOption({
                value: '23',
                text: '23'
            });

            endtime.isMandatory = true;
            endtime.maxLength = 2;

            form.addSubmitButton({
                label: 'Enviar'
            });
            context.response.writePage(form);
        } else {
            // Section Four - Output - Used in all sections
            var bodyObj = {};
            var response ={};
            var headerObj = {
                'Content-Type': 'application/json',
            };

            var delimiter = /\u0001/;
            var endpoint = context.request.parameters.endpointid;
            var start = (context.request.parameters.startdateid).split("/");
            var end = (context.request.parameters.enddateid).split("/");
            var starttime = context.request.parameters.starttimeid;
            var endtime = context.request.parameters.endtimeid;
            var folio = context.request.parameters.folioid;

            if(start[0].length == 1){start[0]="0"+start[0];}
            if(end[0].length == 1){end[0]="0"+end[0];}
            if(start[1].length == 1){start[1]="0"+start[1];}
            if(end[1].length == 1){end[1]="0"+end[1];}

            var dateRange = "{\"start\":\""+ start[2]+"-" + start[1]+"-" + start[0] +"T" + starttime +":00:00\",\"end\":\""+ end[2]+"-" + end[1]+"-" + end[0] +"T" + endtime +":59:59\"}";

            //{"start":"2021-10-04T16:29:48","end":"2021-10-04T17:29:48"}
            log.audit('dateRange',dateRange);
            var metodoEnvio = 'get'
            // URL Sandbox
            //var url = "https://i-disa-wms-ondemand-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/get-wms?";
            // URL PRD
            var url = "https://i-disa-prd-wms-ondemand-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/get-wms?";
            url += "endpoint="+endpoint;
            if(endpoint != "6"){url += "&between="+ dateRange}
            if( (endpoint == "1" || endpoint == "2" || endpoint == "3") && folio.length>0 ){
                url += "&folio="+ folio
            }
            log.audit('Url',url);
            try {
                response = https[metodoEnvio]({
                    url: url,
                    body: JSON.stringify(bodyObj),
                    headers: headerObj
                });
                log.audit('Respuesta Obtener Info:', response);
            } catch (error) {
                log.audit('Error Obtener Info', error);
            }
          
          	var endpointname='';
          	switch(endpoint){
              case 1:
                endpointname="Receipt Simple Confirm";
                break;
              case 2:
                endpointname="Picking Simple Confirm";
                break;
              case 3:
                endpointname="Shipment";
                break;
              case 4:
                endpointname="Adjust Confirm";
                break;
              case 5:
                endpointname="Movement Between Areas";
                break;
              default:
                endpointname="Inventory-Summary";
                break;
            }
          
            context.response.write('Se proceso la siguiente información:'
            + '<br/>  Endpoint: '+ endpointname
            + '<br/>  dateRange: ' + dateRange
            + '<br/>  Folio: ' + folio
            + '<br/>  Código Respuesta: ' + response.code
            + '<br/>  Respuesta: ' + response.data
            + '<br/>  Error: ' + response.error
            + '<br/>  <a href=\"history.back()\">'
            );

        }
    }
    return {
        onRequest: onRequest
    };
});