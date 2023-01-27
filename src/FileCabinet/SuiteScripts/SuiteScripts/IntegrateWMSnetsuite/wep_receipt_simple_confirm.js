/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 * Recepciones de compra  - receipt-simple-confirm-interface
 * Confirmación Traspasos a Central - receipt-simple-confirm-interface
 * Confirmación de devoluciones de venta - receipt-simple-confirm-interface
 */
 define(['./drt_wep_save_record_lib', 'N/record', 'N/search', 'N/error', 'N/runtime', 'N/format'], function (drt_wep_lib, record, search, error, runtime, format) {
    var IdInternosNetsuite = {
        'SANDBOX': 211,
        'PRODUCTION': 211
    };
    var idInternoNetsuiteSubcidiaria = {
        'SANDBOX': 8,
        'PRODUCTION': 2
    };
    var idInternoNetsuitTrancito = {
        'SANDBOX': 273,
        'PRODUCTION': 2
    }
    var ubicacionesIndexadas = {};

    /*
        1. Iterar recepciones desde context
        1.1 Detectar tipo de recepción
        2. Validar que la transacción no ha sido creada con disa_id.
        3. Transformar desde OC.
        4. Reset de lineas.
        5. Por cada artículo: validar que existe y agregar a lineas de Recepción.
    */

    function _post(arr) {
        try {
            var objFolio = {};
            var objId = {};
            var objSku = {};
            var objLot = {};
            var objItemLot = {};
            var objareas = {};

            // 1. Iterar recepciones desde context
            arr.forEach(receipt => {
                // 1.1 Detectar tipo de recepción
                var folio = receipt.folio;
                var tipoT = folio.substring(0, 6);
                var controlId = receipt.receiptDetails.map(art => art.id)
                log.audit('controlId', controlId);

                switch (tipoT) {
                    case 'PURCHO':
                        processPurchaseOrder(receipt, receipt.warehouse);
                        break;
                    case 'RTNAUT':
                        processReturnOrder(receipt, receipt.warehouse);
                        break;
                    case 'TRNFRO':
                        processTransferOrder(receipt);
                        break;
                    default:
                        break;
                }
            });
        } catch (error) {
            log.audit('Error al procesar transacción', error);
        }
    }

    function processPurchaseOrder(purchOrd, warehouse) {
        // 3. Transformar desde OC.
        try {
            var respuesta = {
                success: false,
                data: [],
                error: []
            };
            log.audit('OC a procesar', purchOrd.folio);
            var purchaseorderSearchObj = search.create({
                type: record.Type.PURCHASE_ORDER,
                filters: [
                    ["type", "anyof", "PurchOrd"],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    ["transactionnumber", "startswith", purchOrd.folio]
                ],
                columns: [
                    search.createColumn({
                        name: "tranid",
                        label: "Número de documento"
                    }),
                    search.createColumn({
                        name: 'custbody_disa_control_transaccion',
                        label: "Control de transacciones",
                    })
                ]
            });
            var resultPurchaseOrder = purchaseorderSearchObj.run().getRange({
                start: 0,
                end: 999
            });
            var idPO = resultPurchaseOrder[0].id;
            log.audit('IdPO', idPO);

            var ids = resultPurchaseOrder[0].getValue({
                name: 'custbody_disa_control_transaccion'
            }) || '[]';

            ids = JSON.parse(ids);

            log.audit({
                title: 'ids',
                details: ids
            });

            var nuevosMovimientos = purchOrd.receiptDetails.filter(move => !ids.includes(move.id));
            var idMovimientos = nuevosMovimientos.map(art => art.id);
            log.audit('nuevosMovimientos', nuevosMovimientos);
            log.audit('idMovimientos', idMovimientos);
            var ubicaciones = purchOrd.receiptDetails.map(loc => loc.area.code);
            log.audit('ubicaciones', ubicaciones);
            var wareHouse = purchOrd.warehouse;
            var newTransaccion = '';
            var skus = purchOrd.receiptDetails.map(objeto => objeto.sku);
            log.audit('skus', skus);

            if (nuevosMovimientos.length < 1) {
                log.audit('validacion', 'Ya se procesaron todos los movimientos de esta transaccion');
                return;
            }

            var filterItem = [];
            skus.forEach(sku => {
                filterItem.push([
                    // "name", search.Operator.IS, sku
                    "upccode", search.Operator.IS, sku
                ]);
                filterItem.push('OR');
            });
            log.audit({
                title: 'filterItem',
                details: JSON.stringify(filterItem)
            });
            filterItem.pop();
            log.audit({
                title: 'filterItem',
                details: JSON.stringify(filterItem)
            });
            var objItem = searchRecord( //
                search.Type.ITEM,
                filterItem,
                [{
                    name: "upccode"
                }]
            );
            log.audit('objItem', objItem);
            //condicion para validar el tipo de orden nacional o importacion
            if (purchOrd.receiptType == "Recibo Orden de Importacion") {
                var subcidiaria = idInternoNetsuiteSubcidiaria[runtime.envType];
                var ubicacionOrigen = idInternoNetsuitTrancito[runtime.envType];
                var filterItem = [];
                skus.forEach(sku => {
                    filterItem.push([
                        "upccode", search.Operator.IS, sku
                    ]);
                    filterItem.push('OR');
                });
                filterItem.pop();
                log.audit({
                    title: 'filterItem',
                    details: JSON.stringify(filterItem)
                });
                var objItem = searchRecord( //
                    search.Type.ITEM,
                    filterItem,
                    [{
                        name: "upccode"
                    }]
                );
                log.audit('objItem', objItem);

                var objSku = {};
                for (var itemn in objItem.data) {
                    if (
                        objItem.data[itemn].id &&
                        objItem.data[itemn].upccode
                    ) {
                        objSku[objItem.data[itemn].upccode] = objItem.data[itemn].id;
                    }
                }
                log.audit('objSku', objSku);

                purchOrd.receiptDetails.forEach(receipt => {
                    if (idMovimientos.includes(receipt.id)) {
                        try {
                            var cantidad = receipt.quantity;
                            var lote = receipt.lot;
                            var areaF = receipt.area.code;
                            var area = areaF.substring(0, 2);
                            var ubicacionDestino = ubicacionesIndexadas[warehouse][area];
                            var fechaCreacion = receipt.admissionDate;
                            var formato1 = format.format({
                                value: new Date(fechaCreacion),
                                type: format.Type.DATE
                            });

                            log.audit('formato1', formato1);

                            var formattedDateString = format.parse({
                                value: formato1,
                                type: format.Type.DATE
                            });
                            log.audit('formattedDateString', formattedDateString);
                            var objField = {
                                subsidiary: subcidiaria,
                                location: ubicacionOrigen,
                                transferlocation: ubicacionDestino,
                                memo: "Creado desde Orden de compra de importacion" + purchOrd.folio,
                                custbody_disa_wms_id: JSON.stringify([nuevosMovimientos.map(art => art.id)]),
                                trandate: formattedDateString
                            }

                            var objLine = {
                                'inventory': [{
                                    item: objSku[receipt.sku],
                                    location: ubicacionesIndexadas[warehouse][area],
                                    adjustqtyby: cantidad,
                                    lot: lote
                                }],
                            };

                            var newJournal = createRecord(record.Type.INVENTORY_TRANSFER, objField, objLine);

                            if (newJournal.success) {
                                respuesta.data.push(newJournal);
                                ids.push(receipt.id);
                            }

                            //guarddo correcto en custom record
                            var objImportacion = {
                                custrecord_drt_wep_output_json: JSON.stringify(receipt),
                                custrecord_drt_wep_output_metodo: 3,
                                custrecord_drt_wep_output_name: 9,
                                custrecorddrt_id_wms: receipt.id
                            }

                            var saveSuccesImportacion = drt_wep_lib.saveRequest(objImportacion);
                            log.audit('respuesta OK', saveSuccesImportacion);

                            if (saveSuccesImportacion.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }
                        } catch (error) {
                            //guardado con errores en custom record
                            var objImportacionError = {
                                custrecord_drt_wep_output_json: JSON.stringify(purchOrd),
                                custrecord_drt_wep_output_metodo: 4,
                                custrecord_drt_wep_output_name: 9,
                                custrecorddrt_id_wms: receipt.id,
                                custrecord_disa_error: error
                            }

                            var saveErrorImportacion = drt_wep_lib.saveRequest(objImportacionError);
                            log.audit('respuesta OK', objImportacionError);

                            if (saveErrorImportacion.success) {
                                log.audit('OK', 'Se registro el error en el custom record.');
                            }
                        }
                    }
                });

            } else {
                log.audit('Entrada de datos', purchOrd.receiptDetails);
                purchOrd.receiptDetails.forEach(receipt => {
                    if (idMovimientos.includes(receipt.id)) {
                        try {
                            var newTransaccion = record.transform({
                                fromType: record.Type.PURCHASE_ORDER,
                                fromId: idPO,
                                toType: record.Type.ITEM_RECEIPT,
                                isDynamic: true
                            });

                            var fechaCreacion = receipt.admissionDate;
                            var formato1 = format.format({
                                value: new Date(fechaCreacion),
                                type: format.Type.DATE
                            });

                            log.audit('formato1', formato1);

                            var formattedDateString = format.parse({
                                value: formato1,
                                type: format.Type.DATE
                            });
                            log.audit('formattedDateString', formattedDateString);

                            newTransaccion.setValue({
                                fieldId: 'memo',
                                value: 'Recepcion de articulo creado desde response wms GET ' + purchOrd.folio
                            });

                            newTransaccion.setValue({
                                fieldId: 'custbody_disa_wms_id',
                                value: receipt.id
                            });

                            newTransaccion.setValue({
                                fieldId: 'trandate',
                                value: formattedDateString
                            })

                            var detallesTransaccion = nuevosMovimientos;

                            var lineas = newTransaccion.getLineCount({
                                sublistId: 'item'
                            });

                            for (var i = 0; i < lineas; i++) {
                                newTransaccion.selectLine({
                                    sublistId: 'item',
                                    line: i
                                });
                                var lineSku = newTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'itemname'
                                });

                                log.audit('SKU de linea', lineSku);

                                var idSku = newTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'item'
                                });
                                log.audit('idSku', idSku);

                                var lookupItem = search.lookupFields({
                                    type: record.Type.INVENTORY_ITEM,
                                    id: idSku,
                                    columns: ['upccode']
                                });

                                log.audit('lookupItem', lookupItem);

                                var item = lookupItem.upccode;
                                log.audit('item', item);

                                //var artRecibido = detallesTransaccion.find(art => art.sku === item);
                                log.audit('R', receipt.sku);
                                var artRecibido = item == receipt.sku
                                log.audit('artRecibido', artRecibido);
                                if (artRecibido) {

                                    var area = receipt.area.code;
                                    var areaFinal = area.substring(0, 2);
                                    log.audit('area', areaFinal);

                                    log.audit('cantidad', receipt.quantity);

                                    //var locationId = ubicacionesIndexadas[wareHouse][areaFinal];
                                    //log.audit('locationId', locationId);

                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity',
                                        value: receipt.quantity,
                                    });

                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'location',
                                        value: IdInternosNetsuite[runtime.envType]
                                    });
                                    try {
                                        if (receipt.lot) {
                                            var subRecord = newTransaccion.getCurrentSublistSubrecord({
                                                sublistId: 'item',
                                                fieldId: 'inventorydetail'
                                            });

                                            log.audit('subRecord', subRecord);


                                            subRecord.selectLine({
                                                sublistId: 'inventoryassignment',
                                                line: 0
                                            });

                                            subRecord.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'receiptinventorynumber',
                                                value: receipt.lot
                                            });

                                            log.audit('total', artRecibido.quantity);

                                            subRecord.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity',
                                                value: receipt.quantity
                                            });

                                            subRecord.commitLine({
                                                sublistId: 'inventoryassignment'
                                            });
                                        }
                                    } catch (error) {
                                        log.audit('error en lotes', error)
                                    }

                                } else {
                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'itemreceive',
                                        value: false,
                                    });
                                }
                                newTransaccion.commitLine({
                                    sublistId: 'item'
                                });
                            }

                            var idRc = newTransaccion.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            });

                            if (idRc) {
                                ids.push(receipt.id);
                                log.audit('Exito', 'La transaccion se creo con exito OK ' + receipt.id);
                            } else {
                                log.audit('Error', 'La transaccion no se creo' + receipt.id);
                            }

                            log.audit({
                                title: 'Recepción procesada:' + ' ' + idPO,
                                details: newTransaccion
                            })

                            var objReceipSimpleConfirmSucces = {
                                custrecord_drt_wep_output_json: JSON.stringify(purchOrd),
                                custrecord_drt_wep_output_metodo: 3,
                                custrecord_drt_wep_output_name: 9,
                                custrecorddrt_id_wms: receipt.id
                            }

                            var saveSuccesReceip = drt_wep_lib.saveRequest(objReceipSimpleConfirmSucces);
                            log.audit('respuesta OK', saveSuccesReceip);

                            if (saveSuccesReceip.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }

                        } catch (error) {
                            var objReceipSimpleConfirmError = {
                                custrecord_drt_wep_output_json: JSON.stringify(purchOrd),
                                custrecord_drt_wep_output_metodo: 3,
                                custrecord_drt_wep_output_name: 9,
                                custrecorddrt_id_wms: receipt.id,
                                custrecord_disa_error: error
                            }

                            var saveErrorShipmet = drt_wep_lib.saveRequest(objReceipSimpleConfirmError);
                            log.audit('respuesta OK', objReceipSimpleConfirmError);

                            if (saveErrorShipmet.success) {
                                log.audit('OK', 'Se registro el error en el custom record.');
                            }
                        }
                    }
                });
            }
            record.submitFields({
                type: record.Type.PURCHASE_ORDER,
                id: idPO,
                values: {
                    custbody_disa_control_transaccion: JSON.stringify(ids)
                },
                options: {
                    enablesourcing: false,
                    ignoreMandatoryFields: true
                }

            });

        } catch (error) {
            log.audit('error creacion PO', error);
        }

    }

    function processTransferOrder(transferOrder, instanciaNetsuite) {
        // Procesamiento de OT
        try {
            log.audit('3° prueba', 'La prueba paso');
            //se crea busqueda de Orden de traslado

            var transferorderSearchObj = search.create({
                type: "transferorder",
                filters: [
                    ["mainline", "is", "T"],
                    "AND",
                    ["transactionnumber", "startswith", transferOrder.folio]
                ],
                columns: [
                    search.createColumn({
                        name: "tranid",
                        label: "Número de documento"
                    }),
                    search.createColumn({
                        name: 'custbody_disa_control_transaccion',
                        label: "Control de transacciones",
                    }),
                    search.createColumn({
                        name: "entity",
                        label: "Nombre"
                    })
                ]
            });

            var resultTransferO = transferorderSearchObj.run().getRange({
                start: 0,
                end: 999
            });
            log.audit('IdTO', resultTransferO[0].id);
            var idTransferOrder = resultTransferO[0].id;

            var ids = resultTransferO[0].getValue({
                name: 'custbody_disa_control_transaccion'
            }) || '[]';

            ids = JSON.parse(ids);

            log.audit({
                title: 'ids',
                details: ids
            });

            var nuevosMovimientos = transferOrder.receiptDetails.filter(move => !ids.includes(move.id));
            var idMovimientos = nuevosMovimientos.map(art => art.id);
            var wareHouse = transferOrder.warehouse;
            log.audit({
                title: 'nuevosMovimientos',
                details: nuevosMovimientos
            })

            if (nuevosMovimientos.length < 1) {
                log.audit('validacion', 'Ya se procesaron todos los movimientos de esta transaccion');
                return;
            }

            log.audit('transferOrder.receiptDetails', transferOrder.receiptDetails)

            var newTransaccion = record.transform({
                fromType: record.Type.TRANSFER_ORDER,
                fromId: idTransferOrder,
                toType: record.Type.ITEM_RECEIPT,
                isDynamic: true
            });

            newTransaccion.setValue({
                fieldId: 'memo',
                value: 'Recepcion de articulo creado desde response wms GET en una Orden de transferencia' + " " + transferOrder.folio
            });
            /*
            newTransaccion.setValue({
                fieldId: 'custbody_disa_wms_id',
                value: receipt.id
            });
            */

            newTransaccion.setValue({
                fieldId: 'location',
                value: 211
            });

            var detallesTransaccion = nuevosMovimientos;
            log.audit('detallesTransaccion', detallesTransaccion);

            var lineas = newTransaccion.getLineCount({
                sublistId: 'item'
            });

            log.audit({
                title: 'lienas',
                details: lineas
            })

            var obj = {};
            var array = [];
            var objLote = {};
            var arrayL = [];

            for (var h in transferOrder.receiptDetails) {
                log.audit('ff', transferOrder.receiptDetails[h])
                let item = transferOrder.receiptDetails[h].sku;
                let cantidad = transferOrder.receiptDetails[h].quantity;
                let lote = transferOrder.receiptDetails[h].lot;
                if(lote){
                    objLote[item] = {
                        lot: lote,
                        quantity: cantidad
                    }
    
                    arrayL.push(objLote)
                    if (!obj[item]) {
                        obj[item] = {
                            articulo: item,
                            quantity: 0,
                            lotes: arrayL
                        }
                    }
    
                    obj[item].quantity += cantidad;
                } else {
                    arrayL

                    if (!obj[item]) {
                        obj[item] = {
                            articulo: item,
                            quantity: 0,
                            lotes: []
                        }
                    }
    
                    obj[item].quantity += cantidad;
                }

            }

            for (var i in obj) {
                array.push(obj[i]);
            }

            log.audit('array',array)

            for (var i = 0; i < lineas; i++) {
                newTransaccion.selectLine({
                    sublistId: 'item',
                    line: i
                });
                var lineSku = newTransaccion.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'itemname'
                });
                log.audit('SKU de linea', lineSku);

                var idSku = newTransaccion.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });
                //log.audit('idSku', idSku);

                var lookupItem = search.lookupFields({
                    type: record.Type.INVENTORY_ITEM,
                    id: idSku,
                    columns: ['upccode']
                });

                //log.audit('lookupItem', lookupItem);

                var item = lookupItem.upccode;

                if (obj[item]) {
                    log.audit('10000', 'entro')

                    newTransaccion.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: obj[item]['quantity']
                    });

                    newTransaccion.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'location',
                        value: IdInternosNetsuite[runtime.envType]
                    });

                    

                    //log.audit('subregistro', subregistro);

                    //if (loteDisponible == "T") {
                        
                        for (var k in obj[item]['lotes']) {
                            var serie = obj[item]['lotes'][k]['lot'];
                            var cantidadS = obj[item]['lotes'][k]['quantity'];
                            if(serie){
                                var subregistro = newTransaccion.getCurrentSublistSubrecord({
                                    sublistId: 'item',
                                    fieldId: 'inventorydetail'
                                });
            
                                var loteDisponible = newTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'inventorydetailavail'
                                });

                                if (loteDisponible == "T") {
                                    var lineSubrecord = subregistro.getLineCount({
                                        sublistId: 'inventoryassignment'
                                    });

                                    for (var d = 0; d < lineSubrecord; d++) {
                                        subregistro.selectLine({
                                            sublistId: 'inventoryassignment',
                                            line: d
                                        });
                                        var receiptinventorynumber = subregistro.getCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'receiptinventorynumber',
                                        }) || '';
        
                                        if (receiptinventorynumber == serie) {
                                            subregistro.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'quantity',
                                                value: cantidadS
                                            });
        
                                            subregistro.setCurrentSublistValue({
                                                sublistId: 'inventoryassignment',
                                                fieldId: 'receiptinventorynumber',
                                                value: serie
                                            });
        
                                            subregistro.commitLine({
                                                sublistId: 'inventoryassignment'
                                            });
                                        } else {
                                            subregistro.removeLine({
                                                sublistId: 'inventoryassignment',
                                                line: d,
                                                ignoreRecalc: true
                                            });
                                            lineSubrecord = subregistro.getLineCount('inventoryassignment');
                                            d--
                                        }
        
                                    }
                                }
                            }
                            
                        }
                    //}

                    newTransaccion.commitLine({
                        sublistId: 'item'
                    });
                } else {
                    newTransaccion.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        value: false,
                    });
                }

            }

            transferOrder.receiptDetails.forEach(receipt => {
                if (idMovimientos.includes(receipt.id)) {
                    ids.push(receipt.id);
                }
            });

            var idItemF = newTransaccion.save({
               enableSourcing: false,
               ignoreMandatoryFields: true
            }) || '';
            if (idItemF) {
                log.audit('Exito', 'La transaccion se creo con exito OK ');
            } else {
                log.audit('Error', 'La transaccion no se creo')//receipt.id);
            }

            record.submitFields({
                type: record.Type.TRANSFER_ORDER,
                id: idTransferOrder,
                values: {
                    custbody_disa_control_transaccion: JSON.stringify(ids)
                },
                options: {
                    enablesourcing: false,
                    ignoreMandatoryFields: true
                }
            });

        } catch (error) {
            log.audit('error orden de tranferencia', error)
        }

    }

    function processReturnOrder(returnOrder, warehouse, instanciaNetsuite) {
        // Procesamiento de Devolución
        try {

            var customrecord_drt_web_otutput_netsuiteSearchObj = search.create({
                type: record.Type.RETURN_AUTHORIZATION,
                filters: [
                    ["type", "anyof", "RtnAuth"],
                    "AND",
                    ["transactionnumber", "startswith", returnOrder.folio],
                    "AND",
                    ["mainline", "is", "T"]
                ],
                columns: [
                    search.createColumn({
                        name: "location"
                    }),
                    search.createColumn({
                        name: "salesrep"
                    }),
                    search.createColumn({
                        name: "custentity_disa_oficina_ventas",
                        join: "salesrep",
                        label: "Oficina de ventas"
                    })
                ]
            });

            var salida = customrecord_drt_web_otutput_netsuiteSearchObj.run().getRange({
                start: 0,
                end: 999
            });

            var ordenId = salida[0].id;

            log.audit('ordenId', ordenId);

            var inventorylocation = salida[0].getValue({
                name: "location"
            });
            var idEmployee = salida[0].getValue({
                name: "salesrep"
            });
            log.audit('inventorylocation', inventorylocation);
            log.audit('idEmployee', idEmployee);

            var oficinaVentas = salida[0].getValue({
                name: "custentity_disa_oficina_ventas",
                join: "salesrep"
            });

            log.audit('oficinaVentas', oficinaVentas);

            var returnAuth = record.load({
                type: record.Type.RETURN_AUTHORIZATION,
                id: ordenId,
                isDynamic: true
            });

            var ids = returnAuth.getValue({
                fieldId: 'custbody_disa_control_transaccion'
            }) || '[]';

            ids = JSON.parse(ids);

            log.audit({
                title: 'ids',
                details: ids
            });

            var nuevosMovimientos = returnOrder.receiptDetails.filter(move => !ids.includes(move.id));
            //var ubicaciones = purchOrd.receiptDetails.map(loc => loc.area.code);
            var idMovimientos = nuevosMovimientos.map(art => art.id);
            var wareHouse = returnOrder.warehouse;
            log.audit({
                title: 'nuevosMovimientos',
                details: nuevosMovimientos
            });

            var objReturnAuth = {};

            if (nuevosMovimientos.length < 1) {
                log.audit('validacion', 'Ya se procesaron todos los movimientos de esta transaccion');
                return;
            }

            if (oficinaVentas) {
                returnOrder.receiptDetails.forEach(receipt => {
                    if (idMovimientos.includes(receipt.id)) {
                        try {
                            var oficinaTransaccion = record.transform({
                                fromType: record.Type.RETURN_AUTHORIZATION,
                                fromId: ordenId,
                                toType: record.Type.ITEM_RECEIPT,
                                isDynamic: true
                            });

                            oficinaTransaccion.setValue({
                                fieldId: 'memo',
                                value: 'Recepcion de articulo creado desde response WMS GET en oficina de venta de la transaccion' + ' ' + returnOrder.folio
                            });

                            oficinaTransaccion.setValue({
                                fieldId: 'custbody_disa_wms_id',
                                value: receipt.id
                            });

                            oficinaTransaccion.setValue({
                                fieldId: 'location',
                                value: oficinaVentas
                            });

                            var detallesTransaccion = nuevosMovimientos;

                            log.audit('detallesTransaccion', detallesTransaccion);

                            var lineas = oficinaTransaccion.getLineCount({
                                sublistId: 'item'
                            });

                            log.audit({
                                title: 'lienas',
                                details: lineas
                            })

                            for (var i = 0; i < lineas; i++) {
                                oficinaTransaccion.selectLine({
                                    sublistId: 'item',
                                    line: i
                                });
                                var lineSku = oficinaTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'itemname'
                                });
                                log.audit('SKU de linea', lineSku);

                                var idSku = oficinaTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'item'
                                });
                                log.audit('idSku', idSku);

                                var lookupItem = search.lookupFields({
                                    type: record.Type.INVENTORY_ITEM,
                                    id: idSku,
                                    columns: ['upccode']
                                });

                                log.audit('lookupItem', lookupItem);

                                var item = lookupItem.upccode;
                                log.audit('item', item);
                                var artRecibido = item == receipt.sku;
                                log.audit('artRecibido', artRecibido);

                                if (artRecibido) {
                                    var area = receipt.area.code;
                                    area.substring(0, 2);
                                    //se hace el substring para la ubicacion y mandarlo a dos digitos

                                    //var locationId = ubicacionesIndexadas[wareHouse][area];
                                    //log.audit('locationId', locationId);

                                    log.audit('cantidad1', receipt.quantity);

                                    oficinaTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity',
                                        value: receipt.quantity,
                                    });

                                    oficinaTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'location',
                                        value: oficinaVentas
                                    });
                                    //validacion para lotes

                                    if (receipt.lot) {
                                        var subRecord = oficinaTransaccion.getCurrentSublistSubrecord({
                                            sublistId: 'item',
                                            fieldId: 'inventorydetail'
                                        });
                                        subRecord.selectLine({
                                            sublistId: 'inventoryassignment',
                                            line: 0
                                        });
                                        log.audit('subRecord', subRecord);
                                        log.audit('cantidad12', receipt.quantity);
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'receiptinventorynumber',
                                            value: receipt.lot
                                        });
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'quantity',
                                            value: receipt.quantity
                                        });
                                        subRecord.commitLine({
                                            sublistId: 'inventoryassignment'
                                        });
                                    }

                                } else {
                                    oficinaTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'itemreceive',
                                        value: false,
                                    });
                                }
                                oficinaTransaccion.commitLine({
                                    sublistId: 'item'
                                });
                            }

                            var idDev = oficinaTransaccion.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }) || '';

                            if (idDev) {
                                ids.push(receipt.id);
                                log.audit('Exito', 'La transaccion se creo con exito OK ' + receipt.id);
                            } else {
                                log.audit('Error', 'La transaccion no se creo' + receipt.id);
                            }

                            objReturnAuth.custrecord_drt_wep_output_json = JSON.stringify(transferOrder);
                            objReturnAuth.custrecord_drt_wep_output_metodo = 3,
                                objReturnAuth.custrecord_drt_wep_output_name = 9,
                                objReturnAuth.custrecorddrt_id_wms = receipt.id


                            var saveSuccesReturnAuth = drt_wep_lib.saveRequest(objReturnAuth);
                            log.audit('respuesta OK', saveSuccesReturnAuth);

                            if (saveSuccesReturnAuth.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }

                        } catch (error) {
                            objReturnAuth.custrecord_drt_wep_output_json = JSON.stringify(returnOrder);
                            objReturnAuth.custrecord_drt_wep_output_metodo = 3,
                                objReturnAuth.custrecord_drt_wep_output_name = 9,
                                objReturnAuth.custrecorddrt_id_wms = receipt.id,
                                objReturnAuth.custrecord_disa_error = error

                            var saveErrorReturnAuth = drt_wep_lib.saveRequest(objReturnAuth);
                            log.audit('respuesta OK', saveErrorReturnAuth);

                            if (saveErrorReturnAuth.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }
                        }
                    }
                });

                record.submitFields({
                    type: record.Type.RETURN_AUTHORIZATION,
                    id: ordenId,
                    values: {
                        custbody_disa_control_transaccion: JSON.stringify(ids)
                    },
                    options: {
                        enablesourcing: false,
                        ignoreMandatoryFields: true
                    }
                });

            } else {
                returnOrder.receiptDetails.forEach(receipt => {
                    if (idMovimientos.includes(receipt.id)) {
                        try {

                            var newTransaccion = record.transform({
                                fromType: record.Type.RETURN_AUTHORIZATION,
                                fromId: ordenId,
                                toType: record.Type.ITEM_RECEIPT,
                                isDynamic: true
                            });

                            newTransaccion.setValue({
                                fieldId: 'memo',
                                value: 'Recepcion de articulo creado desde response wms GET en una Devolucion de Cliente con folio' + ' ' + returnAuth.folio
                            });

                            newTransaccion.setValue({
                                fieldId: 'custbody_disa_wms_id',
                                value: receipt.id
                            });

                            var detallesTransaccion = nuevosMovimientos;

                            log.audit('detallesTransaccion', detallesTransaccion);

                            var lineas = newTransaccion.getLineCount({
                                sublistId: 'item'
                            });

                            log.audit({
                                title: 'lienas',
                                details: lineas
                            })

                            for (var i = 0; i < lineas; i++) {
                                newTransaccion.selectLine({
                                    sublistId: 'item',
                                    line: i
                                });
                                var lineSku = newTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'itemname'
                                });
                                log.audit('SKU de linea', lineSku);

                                var idSku = newTransaccion.getCurrentSublistValue({
                                    sublistId: 'item',
                                    fieldId: 'item'
                                });
                                log.audit('idSku', idSku);

                                var lookupItem = search.lookupFields({
                                    type: record.Type.INVENTORY_ITEM,
                                    id: idSku,
                                    columns: ['upccode']
                                });

                                log.audit('lookupItem', lookupItem);

                                var item = lookupItem.upccode;
                                log.audit('item', item);
                                var artRecibido = item == receipt.id;
                                if (artRecibido) {

                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'quantity',
                                        value: receipt.quantity,
                                    });

                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'location',
                                        value: IdInternosNetsuite[runtime.envType]
                                    });

                                    log.audit('cantidad', receipt.quantity);

                                    if (receipt.lot) {
                                        var subRecord = oficinaTransaccion.getCurrentSublistSubrecord({
                                            sublistId: 'item',
                                            fieldId: 'inventorydetail'
                                        });

                                        subRecord.selectLine({
                                            sublistId: 'inventoryassignment',
                                            line: 0
                                        });
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'receiptinventorynumber',
                                            value: receipt.lot
                                        });
                                        subRecord.setCurrentSublistValue({
                                            sublistId: 'inventoryassignment',
                                            fieldId: 'quantity',
                                            value: receipt.quantity
                                        });
                                        log.audit('cantidad', receipt.quantity);
                                        subRecord.commitLine({
                                            sublistId: 'inventoryassignment'
                                        });
                                    }
                                } else {
                                    newTransaccion.setCurrentSublistValue({
                                        sublistId: 'item',
                                        fieldId: 'itemreceive',
                                        value: false,
                                    });
                                }
                                newTransaccion.commitLine({
                                    sublistId: 'item'
                                });
                            }

                            log.audit({
                                title: 'itemR',
                                details: newTransaccion
                            });

                            var idDevCustomer = newTransaccion.save({
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }) || '';

                            if (idDevCustomer) {
                                ids.push(receipt.id);

                                log.audit('Exito', 'La transaccion se creo con exito OK ' + receipt.id);
                            } else {
                                log.audit('Error', 'La transaccion no se creo' + receipt.id);
                            }

                            objReturnAuth.custrecord_drt_wep_output_json = JSON.stringify(transferOrder);
                            objReturnAuth.custrecord_drt_wep_output_metodo = 3,
                                objReturnAuth.custrecord_drt_wep_output_name = 9,
                                objReturnAuth.custrecorddrt_id_wms = receipt.id


                            var saveSuccesReturnAuth = drt_wep_lib.saveRequest(objReturnAuth);
                            log.audit('respuesta OK', saveSuccesReturnAuth);

                            if (saveSuccesReturnAuth.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }

                        } catch (error) {
                            objReturnAuth.custrecord_drt_wep_output_json = JSON.stringify(returnOrder);
                            objReturnAuth.custrecord_drt_wep_output_metodo = 3,
                                objReturnAuth.custrecord_drt_wep_output_name = 9,
                                objReturnAuth.custrecorddrt_id_wms = receipt.id,
                                objReturnAuth.custrecord_disa_error = error

                            var saveErrorReturnAuth = drt_wep_lib.saveRequest(objReturnAuth);
                            log.audit('respuesta OK', saveErrorReturnAuth);

                            if (saveErrorReturnAuth.success) {
                                log.audit('OK', 'Se registro se creo con exito');
                            }
                        }
                    }
                });

                record.submitFields({
                    type: record.Type.RETURN_AUTHORIZATION,
                    id: ordenId,
                    values: {
                        custbody_disa_control_transaccion: JSON.stringify(ids)
                    },
                    options: {
                        enablesourcing: false,
                        ignoreMandatoryFields: true
                    }
                });

            }

        } catch (error) {
            log.audit('error rden de transferencia', error);
        }
    }

    function createRecord(param_type, param_field_value, param_obj_sublist) {
        try {
            var respuesta = {
                success: false,
                data: '',
                error: {}
            };
            // var param_obj_sublist= {
            //     item:[
            //         {
            //             item:5,
            //             price:3,
            //         }
            //     ]
            // }
            // }
            log.audit({
                title: 'createRecord',
                details: ' param_type: ' + param_type +
                    ' param_field_value: ' + JSON.stringify(param_field_value) +
                    ' param_obj_sublist: ' + JSON.stringify(param_obj_sublist)
            });

            var newRecord = record.create({
                type: param_type,
                isDynamic: true
            });

            for (var field in param_field_value) {
                newRecord.setValue({
                    fieldId: field,
                    value: param_field_value[field]
                });
            }

            for (var sublist in param_obj_sublist) {
                for (var element in param_obj_sublist[sublist]) {
                    newRecord.selectNewLine({
                        sublistId: sublist
                    });

                    for (var field in param_obj_sublist[sublist][element]) {

                        if (field == 'lot' && param_obj_sublist[sublist][element][field] != '') {
                            log.audit('lote', param_obj_sublist[sublist][element][field]);
                            var subRecord = newRecord.getCurrentSublistSubrecord({
                                sublistId: sublist,
                                fieldId: 'inventorydetail'
                            });

                            subRecord.selectNewLine({
                                sublistId: 'inventoryassignment'
                            });

                            subRecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'receiptinventorynumber',
                                value: param_obj_sublist[sublist][element][field]
                            });

                            subRecord.setCurrentSublistValue({
                                sublistId: 'inventoryassignment',
                                fieldId: 'quantity',
                                value: param_obj_sublist[sublist][element].adjustqtyby
                            });

                            subRecord.commitLine({
                                sublistId: 'inventoryassignment'
                            });
                        } else {
                            newRecord.setCurrentSublistValue({
                                sublistId: sublist,
                                fieldId: field,
                                value: param_obj_sublist[sublist][element][field]
                            });
                        }

                        log.audit('item', param_obj_sublist[sublist][element]['item']);
                        log.audit('sublist', sublist)

                    }
                    newRecord.commitLine({
                        sublistId: sublist
                    });


                }
            }

            respuesta.data = newRecord.save({
                enableSourcing: false,
                ignoreMandatoryFields: true
            }) || '';

            respuesta.success = respuesta.data != '';
        } catch (error) {
            log.error({
                title: 'error createRecord',
                details: JSON.stringify(error)
            });
            respuesta.error = error;
        } finally {
            log.audit({
                title: 'respuesta createRecord',
                details: respuesta
            });
            return respuesta;
        }
    }

    function searchRecord(param_type, param_filters, param_column) {
        try {
            var respuesta = {
                success: false,
                length: 0,
                data: {},
                error: {},
                array: []
            };
            /*
             param_filters=[
                ['isinactive', search.Operator.IS, 'F']
            ];
            param_column=[
                    { name: 'name' }
            ]
             */
            log.audit({
                title: 'searchRecord',
                details: ' param_type: ' + param_type +
                    ' param_filters: ' + JSON.stringify(param_filters) +
                    ' param_column: ' + JSON.stringify(param_column)
            });
            if (param_type &&
                param_filters &&
                param_column
            ) {

                var result = search.create({
                    type: param_type,
                    filters: param_filters,
                    columns: param_column
                });
                var resultData = result.run();
                var start = 0;
                do {
                    var resultSet = resultData.getRange(start, start + 1000);
                    if (resultSet && resultSet.length > 0) {
                        for (var i = 0; i < resultSet.length; i++) {
                            respuesta.array.push(resultSet[i]);
                            if (
                                resultSet[i].id &&
                                !respuesta.data[resultSet[i].id]
                            ) {
                                respuesta.data[resultSet[i].id] = {
                                    id: resultSet[i].id,
                                };
                                for (var column in param_column) {
                                    respuesta.data[resultSet[i].id][param_column[column].name] = resultSet[i].getValue(param_column[column]) || '';
                                }
                            }
                        }
                    }
                    start += 1000;
                } while (resultSet && resultSet.length == 1000);
            }
            respuesta.length = Object.keys(respuesta.data).length;
            respuesta.success = respuesta.length > 0;
        } catch (error) {
            log.error({
                title: 'error searchRecord',
                details: JSON.stringify(error)
            });
            respuesta.error = error;
        } finally {
            log.emergency({
                title: 'respuesta searchRecord',
                details: respuesta
            });
            return respuesta;
        }
    }

    return {
        post: _post,
    }
});