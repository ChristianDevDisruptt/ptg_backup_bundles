/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {

        const evaluarOportunidad = ({ oportunidades = {}, recordType = "" }) => {
            try {
                const rlRecords = {
                    pagos: {
                        "id": "customrecord_ptg_pagos"
                        , "total": "custrecord_ptg_total_servicio"
                        , "sublistPagos": "recmachcustrecord_ptg_registro_pagos",
                        "lineaTotal": "custrecord_ptg_total",

                    },
                    zonaPrecio: {
                        id: "customrecord_ptg_zonasdeprecio_",
                        precio: "custrecord_ptg_precio_"

                    },

                    ventasEstacionario: {
                        id: "customrecord_ptg_ventas_estacionario",
                        total: "custrecord_ptg_total_est_vts_",
                        impuesto: "custrecord_ptg_impuesto_est_vts_",
                        precio: "custrecord_ptg_precio_est_vts_",
                        importe: "custrecord_ptg_importe_est_vts_",
                        colOpplinea: "custcol_ptg_registro_estacionario"

                    },
                    detalleCarburacion: {
                        id: "customrecord_ptg_detalle_despachador_",
                        total: "custrecord_ptg_importe_despachador_",
                        impuesto: "custrecord_ptg_impuestodespachador_",
                        precio: "custrecord_ptg_preciounidespachador_",
                        importe: "custrecord_ptg_importe_despachador_",
                        colOpplinea: "custcol_ptg_registro_estacionario"

                    },
                    ventaCilindros: {
                        id: "customrecord_ptg_regitrodemovs_",
                        total: "custrecord_ptg_total_cil_vts_",
                        impuesto: "custrecord_ptg_impuesto_cil_vts_",
                        precio: "custrecord_ptg_tasa",
                        importe: "custrecord_ptg_importe_cil_vts_",
                        zonaPrecio: "custrecord_ptg_zonadeprecio_registromovs",
                        colOpplinea: "custcol_drt_ptg_registro_mov_creado",
                        capacidad: "custcol_ptg_capacidad_articulo"

                    },
                    
                    carburacionCilindros: {
                        id: "customrecord_ptg_regitrodemovs_",
                        total: "custrecord_ptg_total_cil_vts_",
                        impuesto: "custrecord_ptg_impuesto_cil_vts_",
                        precio: "custrecord_ptg_tasa",
                        importe: "custrecord_ptg_importe_cil_vts_",
                        zonaPrecio: "custrecord_ptg_zonadeprecio_registromovs",
                        colOpplinea: "custcol_drt_ptg_registro_mov_creado",
                        capacidad: "custcol_ptg_capacidad_articulo",
                    }

                };

                const recType = rlRecords[recordType];
                log.audit("recType" + recordType, recType);

                for (let opp in oportunidades) {

                    const opportunityId = opp;
                    const zonaVenta = oportunidades[opp].valorZona;
                    const precio = oportunidades[opp].precio;

                    log.debug('opportunityId', opportunityId);
                    log.debug('zonaVenta', zonaVenta);
                    log.debug('precio', precio);

                    const recOportunity = record.load({
                        type: 'opportunity',
                        id: parseInt(opportunityId),
                        isDynamic: true,
                    });
                    var idVenta = 0;

                    recOportunity.setValue({
                        fieldId: 'custbody_ptg_zonadeprecioop_',
                        value: parseInt(zonaVenta),
                    });


                    const items = recOportunity.getLineCount({ sublistId: 'item' });
                    for (let i = 0; i < items; i++) {
                        var nuevoPrecio;
                        recOportunity.selectLine({ sublistId: 'item', line: i });



                        if (recType.capacidad) {
                            var capacidad = recOportunity.getCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: recType.capacidad,
                            });

                            nuevoPrecio = capacidad * precio;
                            oportunidades[opp].importe =nuevoPrecio
                        }
                        if (nuevoPrecio || precio) {

                            oportunidades[opp].item = recOportunity.getCurrentSublistValue({
                                sublistId: 'item',
                                fieldId:"item",
                            });
                            oportunidades[opp].quantity = recOportunity.getCurrentSublistValue({
                                sublistId: 'item',
                                fieldId:"quantity",
                            });

                            recOportunity.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'pricelevels',
                                value: -1,
                            });
                            recOportunity.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'rate',
                                value: nuevoPrecio || precio,
                            });
                        }
                        idVenta = recOportunity.getSublistValue({
                            sublistId: 'item',
                            fieldId: recType.colOpplinea,
                            line: i,
                        });

                        recOportunity.commitLine({ sublistId: 'item' });
                    }

                    //el total de la transaccion se guarda en el campo de json pagos
                    var total = recOportunity.getValue({ fieldId: 'total' });
                    var taxTotal = recOportunity.getValue({ fieldId: 'taxtotal' });
                    var totalItem = recOportunity.getValue({ fieldId: 'item_total' });

                    oportunidades[opp].total = total;
                    oportunidades[opp].taxTotal = taxTotal;
                    oportunidades[opp].totalItem = totalItem;

                    log.debug("total", total);
                    recOportunity.setValue({ fieldId: 'custbody_ptg_opcion_pago_obj', value: JSON.stringify({ "pago": [{ "metodo_txt": "Efectivo", "tipo_pago": "1", "monto": total, "folio": "" }] }) });

                    var idPagos = recOportunity.getValue({ fieldId: 'custbody_ptg_registro_pagos' });
                    recOportunity.setValue({ fieldId: rlRecords.pagos.total, value: total });


                    log.debug("recOportunity saved", recOportunity.save());


                    var recCustPayments = record.load({ type: 'customrecord_ptg_pagos', isDynamic: true, id: idPagos });

                    var sublist = "recmachcustrecord_ptg_registro_pagos";
                    var totalLines = recCustPayments.getLineCount(sublist);
                    log.debug("totalLines", totalLines);
                    //Obtenemos la primera linea
                    for (var i = totalLines - 1; i > 1; i--) {
                        //borrar la linea
                        recCustPayments.removeLine({ sublistId: sublist, line: i });
                    }
                    recCustPayments.selectLine({ sublistId: sublist, line: 0 });
                    //Actualizamos el monto
                    recCustPayments.setCurrentSublistValue({ sublistId: sublist, fieldId: "custrecord_ptg_total", value: total });
                    recCustPayments.commitLine({ sublistId: sublist });
                    recCustPayments.setValue({ fieldId: "custrecord_ptg_total_servicio", value: total });


                    log.debug("recCustPayments saved", recCustPayments.save());
                    if (recordType == "ventasEstacionario" || recordType == "ventaCilindros") {
                        var recVenta = record.load({ type: recType.id, isDynamic: true, id: idVenta });
                        cusSetValue({ fieldId: recType.total, value: total, rec: recVenta });
                        cusSetValue({ fieldId: recType.impuesto, value: taxTotal, rec: recVenta });
                        cusSetValue({ fieldId: recType.precio, value: precio, rec: recVenta });
                        cusSetValue({ fieldId: recType.importe, value: totalItem, rec: recVenta });

                        cusSetValue({ fieldId: recType.zonaPrecio, value: zonaVenta, rec: recVenta });


                        log.debug(recType.id + " saved", recVenta.save());

                    }

                }
                return oportunidades;

            } catch (e) {
                log.debug('Error', e);
            }


        }
        const cusSetValue = ({ rec = null, fieldId = null, value = null }) => {
            if (fieldId && value) {
                rec.setValue({ fieldId: fieldId, value: value });
            }

        }


        return { evaluarOportunidad }

    });
