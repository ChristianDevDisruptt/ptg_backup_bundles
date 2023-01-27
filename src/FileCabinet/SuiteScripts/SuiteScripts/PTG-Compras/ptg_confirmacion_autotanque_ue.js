/**
 *@NApiVersion 2.1
 *@NScriptType UserEventScript
 */
define(["N/record", "N/search"], function (record, search) {

    function afterSubmit(context) {
        try {
            var currentRecord = context.newRecord;
            var statusOrden = 4;
            if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {

                let objPo = {};
                let arrayPo = [];
                let idVendorBill = '';
                let idRecepcion2 = '';
                let idFactura3 = '';
                let idSaveTransferOrder = '';
                let saveinvoice = '';
                let idFacturaInter = '';

                var precioTarifa = currentRecord.getValue({
                    fieldId: 'custrecord_ptg_tarifporkilogramo_csa_'
                })

                var lineas = currentRecord.getLineCount({
                    sublistId: 'recmachcustrecord_ptg_confirmacion_salida_'
                })

                log.audit('lineas', lineas)

                for (var i = 0; i < lineas; i++) {
                    var pg = currentRecord.getSublistText({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_numembarqueprogra_confirm',
                        line: i
                    });

                    var cantidad = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_kgs_pemex_confirmacion_',
                        line: i
                    });



                    var precioTarifaKilogramo = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_tarifa_x_kgm_confirm_',
                        line: i
                    });

                    var tarifaViajeSencillo = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_tarifa_viaje_sencillo_con',
                        line: i
                    });

                    var tarifaSobrePrecioIntercompania = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_sobreprecio_inter_confirm',
                        line: i
                    });

                    var sobrePrecioClientes = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_sobreprecio_clientes_',
                        line: i
                    })

                    var rateConfinrmacion = currentRecord.getSublistValue({
                        sublistId: 'recmachcustrecord_ptg_confirmacion_salida_',
                        fieldId: 'custrecord_ptg_precion_confirmacion',
                        line: i
                    })

                    log.audit('pg', pg);
                    log.audit('cantidad', cantidad);
                    log.audit('sobrePrecioClientes', sobrePrecioClientes);
                    log.audit('tarifaSobrePrecioIntercompania', tarifaSobrePrecioIntercompania);
                    log.audit('tarifaViajeSencillo', tarifaViajeSencillo);
                    log.audit('precioTarifaKilogramo', precioTarifaKilogramo);
                    log.audit('rateConfinrmacion', rateConfinrmacion);


                    var purchaseorderSearchObj = search.create({
                        type: "purchaseorder",
                        filters: [
                            ["type", "anyof", "PurchOrd"],
                            "AND",
                            ["custcol2", "is", pg],
                            "AND",
                            ["mainline", "is", "F"],
                            "AND",
                            ["custcol_ptg_pg_en_uso_", "is", "T"]
                        ],
                        columns: [
                            search.createColumn({
                                name: "ordertype",
                                sort: search.Sort.ASC
                            }),
                            "tranid",
                            "internalid",
                            "location",
                            "custcol_ptg_plantadesvio_",
                            "item",
                            "quantity",
                            "custcol_ptg_centro_e_destino_",
                            "custcol_ptg_centroembarcador_",
                            "subsidiary",
                            "custcol_ptg_clientedesvio_",
                            "custcol_drt_desvio_plant_cli_nin",
                            "custcol_ptg_subsidiaria_",
                            "rate"

                        ]
                    });
                    var searchResultCount = purchaseorderSearchObj.run().getRange(0, 1);

                    if (searchResultCount.length > 0) {
                        var idInterno = searchResultCount[0].getValue({
                            name: "internalid"
                        });

                        var articulo = searchResultCount[0].getValue({
                            name: "item"
                        });

                        var ubicacion = searchResultCount[0].getValue({
                            name: "location"
                        });

                        var cenroE = searchResultCount[0].getValue({
                            name: "custcol_ptg_centro_e_destino_"
                        });

                        var centroEmbarcadorDestino = searchResultCount[0].getText({
                            name: "custcol_ptg_centroembarcador_"
                        });

                        var plantaDesvio = searchResultCount[0].getValue({
                            name: "custcol_ptg_plantadesvio_"
                        });

                        var subsidiaria = searchResultCount[0].getValue({
                            name: "subsidiary"
                        });

                        var clienteDesvio = searchResultCount[0].getValue({
                            name: "custcol_ptg_clientedesvio_"
                        });

                        var tipoDesvio = searchResultCount[0].getValue({
                            name: "custcol_drt_desvio_plant_cli_nin"
                        });

                        var subsidiariaLinea = searchResultCount[0].getValue({
                            name: 'custcol_ptg_subsidiaria_'
                        });

                        var precioArticulo = searchResultCount[0].getValue({
                            name: 'rate'
                        });



                        log.audit('idInterno', idInterno)
                        log.audit('articulo', articulo)
                        log.audit('ubicacion', ubicacion)
                        log.audit('centroEm', cenroE)
                        log.audit('centroEmbarcadorDestino', centroEmbarcadorDestino);
                        log.audit('planta_desvio', plantaDesvio)
                    }

                    log.audit('idInterno1', idInterno);

                    objPo = {
                        id_orden_compra: idInterno,
                        item: articulo,
                        cantidad: cantidad,
                        location: ubicacion,
                        pg: pg,
                        centro_Embarcador: centroEmbarcadorDestino,
                        centroEmbarcadorDestino: cenroE,
                        planta_desvio: plantaDesvio,
                        subsidiaria: subsidiaria,
                        cliente_desvio: clienteDesvio,
                        tipo_desvio: tipoDesvio,
                        subsidiaria_linea: subsidiariaLinea,
                        tarifa_kilogramo: precioTarifaKilogramo,
                        tarifa_v_senciillo: tarifaViajeSencillo,
                        tarifa_sprecio_intercompania: tarifaSobrePrecioIntercompania,
                        sobre_precio_cliente: sobrePrecioClientes,
                        rate: rateConfinrmacion
                    }

                    arrayPo.push(objPo);
                }
                log.audit('arrayPo', arrayPo)

                for (let po in arrayPo) {
                    /********Cambio de estatus de orden de compra**********/
                    var compraLoad = record.load({
                        type: record.Type.PURCHASE_ORDER,
                        id: arrayPo[po]['id_orden_compra'],
                        isDynamic: true,
                    });

                    compraLoad.setValue({
                        fieldId: 'custbody_ptg_estatuspo_',
                        value: statusOrden
                    })

                    var idCompra = compraLoad.save();
                    log.audit('idCompra', idCompra);

                    /*******************Proceso de recepciones**********************/
                    if (!arrayPo[po]['planta_desvio']) {
                        try {
                            let recepcion2 = record.transform({
                                fromType: record.Type.PURCHASE_ORDER,
                                fromId: arrayPo[po]['id_orden_compra'],
                                toType: record.Type.ITEM_RECEIPT,
                                isDynamic: true,
                            });

                            let lineas2 = recepcion2.getLineCount({
                                sublistId: 'item'
                            });
                            //si el campo de planta desvio tiene valor cambiar ubicacaion por almacen vistrual

                            for (var k = 0; k < lineas2; k++) {
                                recepcion2.selectLine({
                                    sublistId: 'item',
                                    line: k
                                });

                                let usoPg = recepcion2.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'custcol_ptg_pg_en_uso_'
                                })

                                let pgAsignado = recepcion2.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'custcol2'
                                });

                                log.audit('pgAsignado', pgAsignado)

                                if (pgAsignado == arrayPo[po]['pg']) {
                                    recepcion2.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity',
                                        value: arrayPo[po]['cantidad'],
                                        line: k
                                    });
                                } else {
                                    recepcion2.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'itemreceive',
                                        value: false
                                    });
                                }

                                recepcion2.commitLine({
                                    sublistId: 'item'
                                });
                            }

                            idRecepcion2 = recepcion2.save();
                            log.audit('idRecepcion2', idRecepcion2)
                        } catch (error_recepcion) {
                            log.audit('error_recepcion', error_recepcion)
                        }
                    }


                    /**********************Proceso Cliente DEsvio************************ */

                    if (arrayPo[po]['cliente_desvio']) {
                        try {
                            let createInvoice = record.create({
                                type: record.Type.INVOICE,
                                isDynamic: true
                            });

                            createInvoice.setValue({
                                fieldId: 'customform',
                                value: 308
                            });

                            createInvoice.setValue({
                                fieldId: 'entity',
                                value: arrayPo[po]['cliente_desvio']
                            });

                            createInvoice.setValue({
                                fieldId: 'subsidiary',
                                value: arrayPo[po]['subsidiaria']
                            });

                            createInvoice.setValue({
                                fieldId: 'location',
                                value: arrayPo[po]['location']
                            });

                            createInvoice.selectNewLine({
                                sublistId: "item",
                            });

                            createInvoice.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "item",
                                value: arrayPo[po]['item']
                            });

                            createInvoice.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "quantity",
                                value: arrayPo[po]['cantidad']
                            });

                            createInvoice.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "rate",
                                value: arrayPo[po]['tarifa_kilogramo'] + arrayPo[po]['sobre_precio_cliente']
                            });

                            createInvoice.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "location",
                                value: arrayPo[po]['location']
                            });

                            let idArticle = createInvoice.commitLine({
                                sublistId: "item",
                            });

                            saveinvoice = createInvoice.save();

                            log.audit('saveinvoice', saveinvoice);
                        } catch (error_cliente_desvio) {
                            log.audit('error_cliente_desvio', error_cliente_desvio);
                        }

                    }

                    /***********Proceso Facturacion de Compra*************/

                    try {
                        let vendorBill = record.transform({
                            fromType: record.Type.PURCHASE_ORDER,
                            fromId: arrayPo[po]['id_orden_compra'],
                            toType: record.Type.VENDOR_BILL,
                            isDynamic: true,
                        });

                        vendorBill.setValue({
                            fieldId: 'customform',
                            value: 300
                        });

                        let lineas = vendorBill.getLineCount('item');

                        log.audit('lineas', lineas)

                        for (var b = 0; b < lineas; b++) {
                            vendorBill.removeLine({
                                sublistId: 'item',
                                line: b,
                                ignoreRecalc: true
                            });

                            lineas = vendorBill.getLineCount('item');
                            b--
                        }

                        vendorBill.selectNewLine('item');

                        vendorBill.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'item',
                            value: arrayPo[po]['item']
                        });

                        vendorBill.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'quantity',
                            value: arrayPo[po]['cantidad']
                        });

                        vendorBill.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'rate',
                            value: arrayPo[po]['rate']
                        });

                        /*
                        vendorBill.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'orderdoc',
                            value: arrayPo[po]['id_orden_compra'] arrayPo[po]['tarifa_kilogramo'] * arrayPo[po]['tarifa_sprecio_intercompania']
                        });
                        */

                        vendorBill.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol2',
                            value: arrayPo[po]['pg']
                        });

                        vendorBill.commitLine('item');

                        idVendorBill = vendorBill.save({
                            ignoreMandatoryFields: true,
                            enableSourcing: true
                        });

                        log.audit('idVendorBill', idVendorBill);
                    } catch (error_factura_compra) {
                        log.audit('error_factura_compra', error_factura_compra)
                    }

                    /***************Creacion de Factura de Flete******************/

                    var customrecord_mant_centroembarcador_SearchObj = search.create({
                        type: "customrecord_mant_centroembarcador_",
                        filters: [
                            ["custrecord_ptg_centroembarce_", "is", arrayPo[po]['centro_Embarcador']]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_ptg_proveedorce_",
                                label: "PTG - Proveedor Centro Embarcador"
                            })
                        ]
                    });
                    var centroE = customrecord_mant_centroembarcador_SearchObj.run().getRange(0, 1);
                    log.audit('centroE', centroE.length);
                    if (centroE.length > 0) {
                        var provedorCE = centroE[0].getValue({
                            name: 'custrecord_ptg_proveedorce_'
                        })
                        log.audit('provedorCE', provedorCE)
                    }

                    var customrecord_pt_tarifa_centro_emb_dest_SearchObj = search.create({
                        type: "customrecord_pt_tarifa_centro_emb_dest_",
                        filters: [
                            ["custrecord_ptg_centroembar_dest_tarifa_", "anyof", arrayPo[po]['centroEmbarcadorDestino']]
                        ],
                        columns: [
                            search.createColumn({
                                name: "custrecord_ptg_centroembar_dest_tarifa_",
                                label: "PTG - Centro Embarcador Destino"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_centroembarcador_tarifa_",
                                label: "PTG - Centro Embarcador"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_planta_tarifa_",
                                label: "PTG - Planta"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_distancia_tarifa_",
                                label: "PTG - Distancia"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_fechainiciovigenciatarifa",
                                label: "PTG - De:"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_fechafinvigenciatarifa_",
                                label: "PTG - A:"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_tarifa_litros_",
                                label: "PTG - Tarifa $/Lts"
                            }),
                            search.createColumn({
                                name: "custrecord_ptg_tarifa_vigente_",
                                label: "PTG - Tarifa Vigente"
                            })
                        ]
                    });
                    var centroED = customrecord_pt_tarifa_centro_emb_dest_SearchObj.run().getRange(0, 1);
                    if (centroED.length > 0) {
                        var distancia = centroED[0].getValue({
                            name: 'custrecord_ptg_distancia_tarifa_'
                        });
                        log.audit('distancia', distancia);

                        var tarifa = centroED[0].getValue({
                            name: 'custrecord_ptg_tarifa_litros_'
                        });

                        log.audit('tarifa', tarifa)
                    }

                    try {

                        var vendorbillSearchObj = search.create({
                            type: "vendorbill",
                            filters: [
                                ["type", "anyof", "VendBill"],
                                "AND",
                                ["mainline", "is", "T"],
                                "AND",
                                ["name", "anyof", "16072"]
                            ],
                            columns: [
                                search.createColumn({
                                    name: "internalid",
                                    summary: "COUNT",
                                    label: "ID interno"
                                })
                            ]
                        });
                        var conteoBusqueda = vendorbillSearchObj.run().getRange({
                            start: 0,
                            end: 1000,
                        });
                        log.debug("vendorbillSearchObj result count", conteoBusqueda);

                        var columnas = conteoBusqueda[0].columns;

                        var numeroViajeBusqueda = conteoBusqueda[0].getValue(columnas[0]);
                        var numeroEntero = parseInt(numeroViajeBusqueda);
                        log.audit('numeroEntero1', numeroEntero);
                        numeroEntero = numeroEntero + 1

                        let facturaFlete = record.create({
                            type: record.Type.VENDOR_BILL,
                            isDynamic: true
                        });

                        facturaFlete.setValue({
                            fieldId: 'entity',
                            value: provedorCE
                        });

                        facturaFlete.setValue({
                            fieldId: 'subsidiary',
                            value: arrayPo[po]['subsidiaria_linea'] ? arrayPo[po]['subsidiaria_linea'] : arrayPo[po]['subsidiaria']
                        });

                        facturaFlete.setValue({
                            fieldId: 'location',
                            value: arrayPo[po]['planta_desvio'] ? arrayPo[po]['planta_desvio'] : arrayPo[po]['location']
                        });

                        facturaFlete.setValue({
                            fieldId: 'tranid',
                            value: 'PTG-Flete' + numeroEntero
                        });

                        facturaFlete.setValue({
                            fieldId: 'approvalstatus',
                            value: 2
                        });

                        facturaFlete.setValue({
                            fieldId: 'memo',
                            value: 'factura de flete'
                        });

                        facturaFlete.setValue({
                            fieldId: 'custpage_4601_witaxcode',
                            value: 1
                        });

                        facturaFlete.selectNewLine({
                            sublistId: 'item'
                        });

                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'item',
                            value: 4114
                        });

                        //facturaFlete.setCurrentSublistValue({
                        //    sublistId: "item",
                        //    fieldId: 'location',
                        //    value: objTransaccion.ubicacion
                        // });

                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'landedcostcategory',
                            value: 48
                        });

                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'quantity',
                            value: 1
                        });

                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'rate',
                            value: arrayPo[po]['cantidad'] * arrayPo[po]['tarifa_v_senciillo']
                        });
                        //custpage_4601_witaxcode
                        //landedcostcategory
                        //custcol_4601_witaxapplies
                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'mandatorytaxcode',
                            value: true
                        });

                        facturaFlete.setCurrentSublistValue({
                            sublistId: "item",
                            fieldId: 'custcol_4601_witaxapplies',
                            value: true
                        });

                        let articuloCreado1 = facturaFlete.commitLine({
                            sublistId: 'item'
                        });

                        idFactura3 = facturaFlete.save();
                        log.audit('idFacturaFlete', idFactura3);

                    } catch (errorF) {
                        log.audit('errorF', errorF)
                    }

                    /**************Proceso de Creacion de Orden de traslado****************** */

                    if (arrayPo[po]['planta_desvio']) {
                        try {
                            let createTransferOrder = record.create({
                                type: record.Type.TRANSFER_ORDER,
                                isDynamic: true
                            });

                            createTransferOrder.setValue({
                                fieldId: 'customform',
                                value: 57
                            });

                            createTransferOrder.setValue({
                                fieldId: 'subsidiary',
                                value: arrayPo[po]['subsidiaria']
                            });

                            createTransferOrder.setValue({
                                fieldId: 'location',
                                value: 1525
                            });

                            if (arrayPo[po]['tipo_desvio'] == 4) {
                                createTransferOrder.setValue({
                                    fieldId: 'transferlocation',
                                    value: arrayPo[po]['location']
                                });
                            } else {
                                createTransferOrder.setValue({
                                    fieldId: 'transferlocation',
                                    value: arrayPo[po]['planta_desvio']
                                });

                            }

                            /*
                            createTransferOrder.setValue({
                                fieldId: 'employee',
                                value: empleado
                            });
                            createTransferOrder.setValue({
                                fieldId: 'orderstatus',
                                value: "B"
                            });
                            */

                            createTransferOrder.setValue({
                                fieldId: 'memo',
                                value: "Proceso Desvio a Planta"
                            });

                            createTransferOrder.selectNewLine({
                                sublistId: 'item'
                            });

                            createTransferOrder.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "item",
                                value: arrayPo[po]['item']
                            });

                            createTransferOrder.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "quantity",
                                value: arrayPo[po]['cantidad']
                            });
                            /*
                            createTransferOrder.setCurrentSublistValue({
                                sublistId: "item",
                                fieldId: "rate",
                                value: arrayNewTransaction[h]['precio_unitario']
                            });
                            */

                            createTransferOrder.commitLine({
                                sublistId: "item",
                            });

                            idSaveTransferOrder = createTransferOrder.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });
                            log.audit('idSaveTransferOrder', idSaveTransferOrder);

                            if(idSaveTransferOrder){
                                let fulfillment = record.transform({
                                    fromType: record.Type.TRANSFER_ORDER,
                                    fromId: idSaveTransferOrder,
                                    toType: record.Type.ITEM_FULFILLMENT,
                                    isDynamic: true,
                                });

                                fulfillment.setValue({
                                    fieldId: 'customform',
                                    value: 40
                                });

                                let saveItemFulfilemnt = fulfillment.save({
                                    enableSourcing: false,
                                    ignoreMandatoryFields: true
                                });

                                log.audit('saveItemFulfilemnt',saveItemFulfilemnt);

                                if(saveItemFulfilemnt){
                                    let receiptOrder = record.transform({
                                        fromType: record.Type.TRANSFER_ORDER,
                                        fromId: idSaveTransferOrder,
                                        toType: record.Type.ITEM_RECEIPT,
                                        isDynamic: false,
                                    });

                                    receiptOrder.setValue({
                                        fieldId: 'customform',
                                        value: 268
                                    });

                                    receiptOrder.setValue({
                                        fieldId: 'location',
                                        value: arrayPo[po]['location']
                                    });
    
                                    
                                    let lineasRecepcio = receiptOrder.getLineCount({
                                        sublistId: 'item'
                                    });
                                    
                                    for(var r = 0; r < lineasRecepcio; r++){
                                        receiptOrder.setSublistValue({
                                            sublistId: 'item',
                                            fieldId: 'location',
                                            value: arrayPo[po]['location'],
                                            line: r
                                        });
                                    }

                                    let facturaFleteLoad = record.load({
                                        type: record.Type.VENDOR_BILL,
                                        id: idFactura3,
                                        isDynamic: true
                                    });

                                    let total = facturaFleteLoad.getValue({
                                        fieldId: 'usertotal'
                                    });

                                    let savefFL = facturaFleteLoad.save();

                                    log.audit('savefFL', savefFL);

                                    
                                    receiptOrder.setValue({
                                        fieldId: 'landedcostmethod',
                                        value: 'QUANTITY'
                                    });
                                    
                                    receiptOrder.setValue({
                                        fieldId: 'landedcostsource48',
                                        value: 'MANUAL'
                                    });
                                    
                                    receiptOrder.setValue({
                                        fieldId: 'landedcostamount48',
                                        value: total
                                    })
                                    
                                    /*
                                    receiptOrder.setValue({
                                        fieldId: 'custbodydrt_impuesto_aduana',
                                        value: 8
                                    })

                                    */
                                    
                                    
                                    let savereceiptOrder = receiptOrder.save({
                                        enableSourcing: false,
                                        ignoreMandatoryFields: true
                                    });
                                    
                                    log.audit('savereceiptOrder',savereceiptOrder);
                                }

                            }
                        } catch (error_transfer_order) {
                            log.audit('error_transfer_order', error_transfer_order)
                        }
                    }

                    /*****************Proceso Intercompañia*************+ */
                    try {
                        if (arrayPo[po]['tipo_desvio'] == 4) {
                            if (arrayPo[po]['subsidiaria'] != arrayPo[po]['subsidiaria_linea']) {
                                log.audit('si hay diferencia de subsidiarias', 'ok');
                                let subsidiaryLookup = search.lookupFields({
                                    type: search.Type.SUBSIDIARY,
                                    id: arrayPo[po]['subsidiaria_linea'],
                                    columns: ['custrecord_ptg_cliente_inter_c', 'custrecord_ptg_proveedor_inter_c']
                                });

                                let subsidiaryLookup2 = search.lookupFields({
                                    type: search.Type.SUBSIDIARY,
                                    id: arrayPo[po]['subsidiaria'],
                                    columns: ['custrecord_ptg_cliente_inter_c']
                                });

                                log.audit('subisidiarias', subsidiaryLookup2 + "  " + subsidiaryLookup);

                                //Creacion de factura de venta

                                let invoiceInter = record.create({
                                    type: record.Type.INVOICE,
                                    isDynamic: true
                                });

                                log.audit('subsidiaryLookup1', subsidiaryLookup.custrecord_ptg_cliente_inter_c[0].value);
                                log.audit('subsidiaryLookup1', subsidiaryLookup.custrecord_ptg_proveedor_inter_c[0].value);

                                invoiceInter.setValue({
                                    fieldId: 'customform',
                                    value: 286
                                });

                                invoiceInter.setValue({
                                    fieldId: 'entity',
                                    value: subsidiaryLookup2.custrecord_ptg_cliente_inter_c[0].value
                                });

                                invoiceInter.setValue({
                                    fieldId: 'subsidiary',
                                    value: 25
                                });

                                if (arrayPo[po]['tipo_desvio'] == 4) {
                                    invoiceInter.setValue({
                                        fieldId: 'location',
                                        value: arrayPo[po]['location']
                                    });
                                } else {
                                    invoiceInter.setValue({
                                        fieldId: 'location',
                                        value: 762
                                    });
                                }

                                invoiceInter.selectNewLine({
                                    sublistId: "item",
                                });

                                invoiceInter.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "item",
                                    value: arrayPo[po]['item']
                                });

                                invoiceInter.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "quantity",
                                    value: arrayPo[po]['cantidad']
                                });

                                if (arrayPo[po]['tipo_desvio'] == 4) {
                                    invoiceInter.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: "location",
                                        value: arrayPo[po]['location']
                                    });
                                } else {
                                    invoiceInter.setCurrentSublistValue({
                                        sublistId: "item",
                                        fieldId: "location",
                                        value: 762
                                    });

                                }

                                invoiceInter.setCurrentSublistValue({
                                    sublistId: "item",
                                    fieldId: "rate",
                                    value: arrayPo[po]['tarifa_kilogramo'] + arrayPo[po]['tarifa_sprecio_intercompania']
                                });

                                invoiceInter.commitLine({
                                    sublistId: "item",
                                });

                                saveinvoice = invoiceInter.save();
                                log.audit('saveinvoice', saveinvoice)
                                //creacion de factura de provedor intercompañia

                                if (saveinvoice) {
                                    try {
                                        let billInter = record.create({
                                            type: record.Type.VENDOR_BILL,
                                            isDynamic: true
                                        });

                                        billInter.setValue({
                                            fieldId: 'entity',
                                            value: subsidiaryLookup.custrecord_ptg_proveedor_inter_c[0].value
                                        });

                                        billInter.setValue({
                                            fieldId: 'subsidiary',
                                            value: arrayPo[po]['subsidiaria_linea']
                                        });

                                        billInter.setValue({
                                            fieldId: 'location',
                                            value: arrayPo[po]['planta_desvio']
                                        });

                                        billInter.setValue({
                                            fieldId: 'tranid',
                                            value: 'FACR24698'
                                        });
                                        /*
                                        billInter.setValue({
                                            fieldId: 'approvalstatus',
                                            value: 2
                                        });
                                        */

                                        billInter.setValue({
                                            fieldId: 'memo',
                                            value: 'factura inter compañia'
                                        });

                                        billInter.setValue({
                                            fieldId: 'custpage_4601_witaxcode',
                                            value: 1
                                        });

                                        billInter.selectNewLine({
                                            sublistId: 'item'
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'item',
                                            value: arrayPo[po]['item']
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'location',
                                            value: arrayPo[po]['planta_desvio']
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'landedcostcategory',
                                            value: 48
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'quantity',
                                            value: arrayPo[po]['cantidad']
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'rate',
                                            value: arrayPo[po]['tarifa_kilogramo'] + arrayPo[po]['tarifa_sprecio_intercompania']
                                        });
                                        //custpage_4601_witaxcode
                                        //landedcostcategory
                                        //custcol_4601_witaxapplies
                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'mandatorytaxcode',
                                            value: true
                                        });

                                        billInter.setCurrentSublistValue({
                                            sublistId: "item",
                                            fieldId: 'custcol_4601_witaxapplies',
                                            value: true
                                        });

                                        let articulo = billInter.commitLine({
                                            sublistId: 'item'
                                        });

                                        idFacturaInter = billInter.save();
                                        log.audit('idFacturaInter', idFacturaInter);
                                    } catch (error_factura_proveedor_interco) {
                                        log.audit('error_factura_proveedor_interco', error_factura_proveedor_interco)
                                    }
                                }
                            }

                        }
                    } catch (error_proceso_intercompañia) {
                        log.audit('error_proceso_intercompañia', error_proceso_intercompañia)
                    }

                    /***************Seteo de creacion de transacioonnes*********************** */

                    let pO = record.load({
                        type: record.Type.PURCHASE_ORDER,
                        id: arrayPo[po]['id_orden_compra'],
                        isDynamic: false,
                    });

                    let lineasPo = pO.getLineCount('item');

                    for (let y = 0; y < lineasPo; y++) {
                        var poF = pO.getSublistValue({
                            sublistId: 'item',
                            fieldId: 'custcol2',
                            line: y
                        });

                        log.audit('poF', poF)

                        if (poF == arrayPo[po]['pg']) {
                            log.audit('emtro', '123456789')
                            log.audit('idRecepcion2', idRecepcion2);
                            log.audit('idVendorBill', idVendorBill);
                            log.audit('idFactura3', idFactura3);
                            if (!arrayPo[po]['planta_desvio'] || arrayPo[po]['cliente_desvio']) {
                                pO.setSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'custcol_ptg_recepcion_',
                                    value: idRecepcion2,
                                    line: y
                                });
                            }

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_fact_provgas_',
                                value: idVendorBill,
                                line: y
                            });

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_facturaflete_',
                                value: idFactura3,
                                line: y
                            });

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_orden_traslado_',
                                value: idSaveTransferOrder,
                                line: y
                            });

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_factura_de_venta',
                                value: saveinvoice,
                                line: y
                            })

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_factura_compra_inter',
                                value: idFacturaInter,
                                line: y
                            })

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_proceso_terminado',
                                value: true,
                                line: y
                            })

                            pO.setSublistValue({
                                sublistId: 'item',
                                fieldId: 'custcol_ptg_pg_en_uso_',
                                value: false,
                                line: y
                            })
                        }
                    }

                    let idPoCammbio = pO.save();
                    log.audit('idPoCammbio', idPoCammbio)
                }

            }

        } catch (error) {
            log.audit('error', error);
        }
    }

    return {
        afterSubmit: afterSubmit
    }
});