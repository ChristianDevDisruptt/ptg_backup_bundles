/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/record', 'N/search'], function (record, search) {

    // se crea estructura donde se cargarà toda la data
    const responseData = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null,
        apiErrorPost: []
    }

    /*

     */
    function _post(request) {
        let opportunityList = [];
        try {

            request.transferOrder.forEach((tOrder) => {
              log.audit('order', tOrder);
                let idTransaccion = tOrder.id;
              	log.audit('idTransaccion',idTransaccion);
                // let busquedaOrdenTraslado = searchTransferOrder(idTransaccion);
                // if (busquedaOrdenTraslado != null) {
                //     responseData.isSuccessful = false,
                //         responseData.message = "Ya existe una transacccion con este id"
                //     return responseData;
                // } else {

                    let idTransferOrder = record.create({
                        type: record.Type.TRANSFER_ORDER,
                        isDynamic: true
                    });

                    idTransferOrder.setValue({
                        fieldId: 'customform',
                        //value: 313 sbx
                        value: 266
                    });

                    idTransferOrder.setValue({
                        fieldId: 'subsidiary',
                        value: tOrder.subsidiary
                    });

                    idTransferOrder.setValue({
                        fieldId: 'location',
                        value: tOrder.location
                    });

                    idTransferOrder.setValue({
                        fieldId: 'transferlocation',
                        value: tOrder.transferlocation
                    });

                    idTransferOrder.setValue({
                        fieldId: 'custbody_ptg_numero_viaje',
                        value: tOrder.custbody_ptg_numero_viaje
                    });

                    idTransferOrder.setValue({
                        fieldId: 'custbody_ptg_numero_viaje_destino',
                        value: tOrder.custbody_ptg_numero_viaje_destino
                    });

                    idTransferOrder.setValue({
                        fieldId: 'employee',
                        value: tOrder.employee
                    });
                    
                    idTransferOrder.setValue({
                        fieldId: 'orderstatus',
                        value: "B"
                    });

                    idTransferOrder.setValue({
                        fieldId: 'memo',
                        value: tOrder.memo
                    });

                    idTransferOrder.setValue({
                        fieldId: 'custbody_ptg_empleado_a_transferir_rs',
                        value: tOrder.custbody_ptg_empleado_a_transferir_rs
                    });

                    idTransferOrder.setValue({
                        fieldId: 'custbody_ptg_codigo_movimiento',
                        value: tOrder.custbody_ptg_codigo_movimiento
                    });

                    idTransferOrder.setValue({
                        fieldId: 'custbody_ptg_id_app',
                        value: tOrder.id
                    });

                    tOrder.items.forEach((item) => {
                        idTransferOrder.selectNewLine({
                            sublistId: "item",
                        });

                        idTransferOrder.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: "item",
                            value: item.article,
                        });

                        idTransferOrder.setCurrentSublistValue({
                            // cantidad del producto de la oportunidad
                            sublistId: "item",
                            fieldId: "quantity",
                            value: item.quantity,
                        });

                        let idArticle = idTransferOrder.commitLine({
                            sublistId: "item",
                        });

                        log.audit({
                            title: "idArticle",
                            details: idArticle,
                        });
                    });

                    let idSaveTransferOrder = idTransferOrder.save();
                    log.audit('idSaveTransferOrder', idSaveTransferOrder);
                    opportunityList.push(idSaveTransferOrder);
                    if (idSaveTransferOrder) {
                        responseData.isSuccessful = true;
                        responseData.message = "Transfer Order created successfully";
                        responseData.data = opportunityList

                        let idFulFillment = record.transform({
                            fromType: record.Type.TRANSFER_ORDER,
                            fromId: idSaveTransferOrder,
                            toType: record.Type.ITEM_FULFILLMENT,
                            isDynamic: true,
                        });
                        
                        idFulFillment.setValue({
                            fieldId: 'customform',
                            value: 291
                         });

                        idFulFillment.setValue({
                           fieldId: 'shipstatus',
                           value: 'C'
                        });

                        let lines = idFulFillment.getLineCount({
                            sublistId: 'item'
                        });

                        for(let i = 0; i < lines; i++){
                            idFulFillment.selectLine({
                                sublistId: 'item',
                                line: i
                            });

                            idFulFillment.setCurrentSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_drt_cp_pesoenkg',
                                value: 10                                
                            });

                            idFulFillment.commitLine({
                                sublistId: 'item'
                            });
                        }

                        let idSaveItemFulfillment = idFulFillment.save();
                        log.audit('idSaveItemFulfillment', idSaveItemFulfillment);
                    }
                //}
            });
        } catch (error) {
            log.audit({
                title: "Error",
                details: error
            })
        }

        // regresamos el response creado
        return responseData
    }

    function searchTransferOrder(idRefence) {
        var idInterno = null;

        var busquedaV = search.create({
            type: search.Type.TRANSFER_ORDER,
            columns: ['internalid'],
            filters: ['custbody_ptg_id_app', 'is', idRefence]
        });

        busquedaV.run().each(function (result) {
            idInterno = result.getValue({
                name: 'internalid'
            });

            return true;
        });

        return idInterno;
    }

    return {
        post: _post
    }
});