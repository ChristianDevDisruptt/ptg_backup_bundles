/**
 * drt_wep_save_record_lib.js
 * @NApiVersion 2.x
 * @NModuleScope public
 */

define([
        'N/search',
        'N/record'
    ],
    function (
        search,
        record
    ) {

        function saveRequest(param_field_value) {
            try {

                var respuesta = {
                    success: false,
                    data: '',
                    error: {}
                };

                log.audit({
                    title: 'saveRequest',
                    details: 'param_field_value: ' + JSON.stringify(param_field_value)
                });

                var newRecord = record.create({
                    type: 'customrecord_drt_web_otutput_netsuite',
                    isDynamic: true
                });

                for (var field in param_field_value) {
                    newRecord.setValue({
                        fieldId: field,
                        value: param_field_value[field]
                    });
                }

                respuesta.data = newRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }) || '';

                respuesta.success = respuesta.data != '';
            } catch (error) {
                log.error({
                    title: 'error de Guardo de Request',
                    details: JSON.stringify(error)
                });
                respuesta.error = error;
            } finally {
                log.audit({
                    title: 'respuesta saveRequest',
                    details: respuesta
                });
                return respuesta;
            }
        }


        function changeUrl(param_registro, param_interfas) {
            try {
                var respuesta = {
                    success: false,
                    data: '',
                    error: {}
                };
                log.audit("changeUrl", "param_registro: " + param_registro + " param_interfas: " + param_interfas);

                var objInterfaceUrl = {
                    'wep_proveedor': {
                        SANDBOX: 'https://i-disa-test-supplier-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/supplier',
                        PRODUCTION: 'https://i-disa-prd-supplier-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/supplier'
                    },
                    'wep_cliente': {
                        SANDBOX: 'https://i-disa-test-customer-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/customer',
                        PRODUCTION: 'https://i-disa-prd-customer-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/customer'
                    },
                    'wep_orden_venta': {
                        SANDBOX: 'https://i-disa-test-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order',
                        PRODUCTION: 'https://i-disa-prd-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order'
                    },
                    'wep_orden_compra': {
                        SANDBOX: 'https://i-disa-test-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order',
                        PRODUCTION: 'https://i-disa-prd-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order'
                    },
                    'wep_dev_cliente': {
                        SANDBOX: 'https://i-disa-test-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order',
                        PRODUCTION: 'https://i-disa-prd-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order'
                    },
                    'wep_dev_proveedor': {
                        SANDBOX: 'https://i-disa-test-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order',
                        PRODUCTION: 'https://i-disa-prd-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order'
                    },
                    'product': {
                        SANDBOX: 'https://i-disa-test-product-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/product',
                        PRODUCTION: 'https://i-disa-prd-product-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/product'
                    },
                    'footprint': {
                        SANDBOX: 'https://i-disa-test-footprint-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/footprint',
                        PRODUCTION: 'https://i-disa-prd-footprint-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/footprint'
                    },
                    'material_list': {
                        SANDBOX: 'https://i-disa-test-material-list-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/material-list',
                        PRODUCTION: 'https://i-disa-prd-material-list-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/material-list'
                    },

                    'traslado_ac_ce': {
                        SANDBOX: 'https://i-disa-test-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order',
                        PRODUCTION: 'https://i-disa-prd-receipt-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/receipt-order'
                    },
                    'traslado_ce_ac': {
                        SANDBOX: 'https://i-disa-test-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order',
                        PRODUCTION: 'https://i-disa-prd-shipment-order-interface-dtt-middleware.apps.mw-cluster.kt77.p1.openshiftapps.com/shipment-order'
                    }
                };

            } catch (error) {
                log.error({
                    title: 'error de Guardo de Request',
                    details: JSON.stringify(error)
                });
                respuesta.error = error;
            } finally {
                log.audit({
                    title: 'respuesta cambio de url',
                    details: objInterfaceUrl[param_registro][param_interfas]
                });
                return objInterfaceUrl[param_registro][param_interfas]
            }
        }

        function formatoHoraMexico(param_fecha, separador_destino, lugar_año, luigar_mes, lugar_dia, hora) {
            var respuesta = {
                format: '',
                año: '',
                mes: '',
                dia: '',
            };
            try {
                var objDate = '';
              	log.audit({
                    title: 'param_fecha',
                    details: param_fecha
                });
                if (param_fecha) {
                    objDate = format.parse({
                        value: param_fecha,
                        type: format.Type.DATE
                    });
                } else {
                    objDate = new Date();
                }
              
              	log.audit({
                    title: 'objDate',
                    details: objDate
                });
                var año = objDate.getFullYear() || '';
                var mes = objDate.getMonth() || '';
                var dia = objDate.getDate() || '';
                var arrayFecha = ['', '', '', ];
                arrayFecha[lugar_año] = año;
                arrayFecha[luigar_mes] = mes * 1 + 1 < 10 ? '0' + (mes * 1 + 1) : mes * 1 + 1;
                arrayFecha[lugar_dia] = dia < 10 ? '0' + dia : dia;

                log.audit({
                    title: 'fecha1',
                    details: ' objDate ' + objDate +
                        ' año ' + año +
                        ' mes ' + mes +
                        ' dia ' + dia
                });
                respuesta.format = arrayFecha[0] + separador_destino + arrayFecha[1] + separador_destino + arrayFecha[2] + hora;
                respuesta.año = año;
                respuesta.mes = mes * 1 + 1;
                respuesta.dia = dia;

            } catch (error) {
                log.error({
                    title: 'error fechaSplit',
                    details: JSON.stringify(error)
                });
                respuesta = '';
            } finally {
                log.audit({
                    title: 'respuesta fechaSplit',
                    details: JSON.stringify(respuesta)
                });
                return respuesta;
            }
        }

        return {
            saveRequest: saveRequest,
            changeUrl: changeUrl,
            formatoHoraMexico:formatoHoraMexico
        }
    });