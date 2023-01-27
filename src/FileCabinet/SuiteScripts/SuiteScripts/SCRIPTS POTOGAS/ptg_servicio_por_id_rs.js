/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record"], function (record) {

    function _post(request) {
        try {
            let arrayItems = [];
            let objItems = {}
            let objOportunidad = {};
            let idTransaccion = request.id;
            let oportunityLoad = record.load({
                type: record.Type.OPPORTUNITY,
                id: idTransaccion,
                isDynamic: true,
            });

            let cliente = oportunityLoad.getText({
                fieldId: 'entity'
            });

            let Representante = oportunityLoad.getText({
                fieldId: 'salesrep'
            });

            let estado = oportunityLoad.getText({
                fieldId: 'entitystatus'
            });

            let origenServicio = oportunityLoad.getText({
                fieldId: 'custbody_ptg_origen_servicio'
            });

            let memo = oportunityLoad.getValue({
                fieldId: 'memo'
            });

            let ptgTipoServicio = oportunityLoad.getText({
                fieldId: 'custbody_ptg_type_service'
            });

            let entreLas = oportunityLoad.getValue({
                fieldId: 'custbody_ptg_entre_las'
            });

            let yLas = oportunityLoad.getValue({
                fieldId: 'custbody_ptg_y_las'
            });

            let opcionPago = oportunityLoad.getText({
                fieldId: 'custbody_ptg_opcion_pago'
            });
            let numViaje = oportunityLoad.getText({
                fieldId: 'custbody_ptg_numero_viaje'
            });
            let zonaPrecio = oportunityLoad.getText({
                fieldId: 'custbody_ptg_zonadeprecioop_'
            });
            let ptgMonitor = oportunityLoad.getText({
                fieldId: 'custbody_ptg_monitor'
            });

            let lineas = oportunityLoad.getLineCount({
                sublistId: 'item'
            });

            for (var i = 0; i < lineas; i++) {
                let item = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: i
                });

                let itemdescription = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'description',
                    line: i
                });

                let itemDisplay = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item_display',
                    line: i
                });

                let itemUnits_display = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'units_display',
                    line: i
                });

                let itemPrecioUnitario = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'amount',
                    line: i
                });

                let itemPrecioFinal = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'grossamt',
                    line: i
                });

                let quantity = oportunityLoad.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                });

                objItems = {
                    id_articulo: item,
                    articulo_descripcion: itemdescription,
                    cantidad: quantity,
                    articulo_unidad: itemUnits_display,
                    precio_unitario: itemPrecioUnitario,
                    precio_final: itemPrecioFinal
                }
            }

            arrayItems.push(objItems);

            objOportunidad = {
                cliente: cliente,
                representante_ventas: Representante,
                estado_oportunidad: estado,
                origen_servicio: origenServicio,
                nota: memo,
                tipo_servicio: ptgTipoServicio,
                programacion_entre: entreLas,
                programacion_y_las: yLas,
                metodo_pago: opcionPago,
                numero_viaje: numViaje,
                zona_precio: zonaPrecio,
                monitor: ptgMonitor,
                articulos: arrayItems
            }

            return JSON.stringify(objOportunidad);

        } catch (error) {
            log.audit('error', error)
        }
    }

    return {
        post: _post
    }
});