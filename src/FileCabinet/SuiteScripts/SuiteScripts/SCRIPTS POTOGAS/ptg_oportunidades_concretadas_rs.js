/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
 define(['N/search', 'N/record'], function (search, record) {

    function _getOportunidadesPorNviajeApp(request) {

        try {
            var arrayOportunidadesApp = [];
            var objOportunidadesApp = {};
            var arraytItem = [];

            let numViaje = request.numero_viaje;


            //segunda busqueda 
            var transactionSearchObj = search.create({
                type: "transaction",
                filters: [
                    ["type", "anyof", "Opprtnty"],
                    "AND",
                    ["mainline", "is", "T"],
                    "AND",
                    ["taxline", "is", "F"],
                    // "AND",
                    // ["subsidiary", "anyof", "20", "14", "16", "13"],
                    "AND",
                    ["custbody_ptg_estado_pedido", "anyof", "3"],
                    "AND",
                    ["custbody_ptg_numero_viaje", "anyof", numViaje]
                ],
                columns: [
                    search.createColumn({
                        name: "tranid",
                        label: "Número de documento"
                    }),
                    search.createColumn({
                        name: "entity",
                        label: "Nombre"
                    }),
                    search.createColumn({
                        name: "transactionnumber",
                        label: "Número de transacción"
                    }),
                    search.createColumn({
                        name: "salesrep",
                        label: "Representante de ventas"
                    }),
                    search.createColumn({
                        name: "custbody_ptg_estado_pedido",
                        label: "PTG - ESTADO DEL PEDIDO"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_estatus_tabladeviajes_",
                        join: "CUSTBODY_PTG_NUMERO_VIAJE",
                        label: "PTG - Estatus (Tabla de viajes)"
                    }),
                    search.createColumn({
                        name: "shipaddress",
                        label: "Dirección de envío"
                    }),
                    search.createColumn({
                        name: "altname",
                        join: "customer",
                        label: "Nombre"
                    }),
                    // search.createColumn({
                    //     name: "custentity_ptg_indicaciones_cliente",
                    //     join: "customer",
                    //     label: "PTG - INDICACIONES DEL CLIENTE"
                    // }),
                    search.createColumn({
                        name: "custbody_ptg_opcion_pago",
                        label: "Opción de Pago"
                    }),
                    search.createColumn({
                        name: "internalid",
                        label: "ID interno"
                    }),
                    // search.createColumn({
                    //     name: "internalid",
                    //     join: "item",
                    //     label: "ID interno"
                    // }),
                    // search.createColumn({
                    //     name: "itemid",
                    //     join: "item",
                    //     label: "Nombre"
                    // }),
                    // search.createColumn({
                    //     name: "salesdescription",
                    //     join: "item",
                    //     label: "Descripción"
                    // }),
                    // search.createColumn({
                    //     name: "quantity",
                    //     label: "Cantidad de partida"
                    // }),
                    //search.createColumn({
                    //    name: "lineunit",
                    //    label: "Unidades de partida"
                    //}),
                    // search.createColumn({
                    //     name: "custitem_ptg_capacidadcilindro_",
                    //     join: "item",
                    //     label: "PTG - Capacidad cilindro"
                    // }),
                    // search.createColumn({
                    //     name: "rate",
                    //     label: "Tasa de artículo"
                    // })
                ]
            });
            //fin

            var estado = request.estado;
            if (estado) {
                var state = search.createFilter({
                    name: "custrecord_ptg_estatus_tabladeviajes_",
                    operator: "anyof",
                    join: "custbody_ptg_numero_viaje",
                    values: estado
                })
                opportunitySearchObj.filters.push(state);
            }

            var searchResultCount = transactionSearchObj.run();
            var start = 0;
            do {
                var results = searchResultCount.getRange(start, start + 1000);
                log.audit('results', results)
                 if (results && results.length > 0) {
                     for (var i = 0; i < results.length; i++) {
                         var columnas = results[i].columns;
                         var idDocumento = results[i].getValue(columnas[0]);
                         var idCliente = results[i].getValue(columnas[1]);
                         var nombreCliente = results[i].getText(columnas[1]);
                         var idRepresentante = results[i].getValue(columnas[3]);
                         var nombreRepresentante = results[i].getText(columnas[3]);
                         var statusOportunidad = results[i].getText(columnas[4]);
                         var idstatusNumeroViaje = results[i].getValue(columnas[5]);
                         var nombreStatusNumeroViaje = results[i].getText(columnas[5]);
                         var cDireccion = results[i].getValue(columnas[6]);
                        var sNombre = results[i].getValue(columnas[7]);
                //        // var cIndicaciones = results[i].getValue(columnas[8]);
                         var mPago = results[i].getText(columnas[8]);
                        var idInterno_tramnsaccion = results[i].getValue(columnas[9]);
                        objOportunidadesApp = {
                            numero_documento: idDocumento,
                            id_cliente: idCliente,
                            nombre_cliente: nombreCliente,
                            id_representante: idRepresentante,
                            nombre_representante: nombreRepresentante,
                            estado_oportunidad: statusOportunidad,
                            id_estado_numero_viaje: idstatusNumeroViaje,
                            estado_numero_viaje: nombreStatusNumeroViaje,
                            direccion: cDireccion,
                            nombre: sNombre,
                           // observaciones: cIndicaciones,
                            forma_pago: mPago,
                            id_interno_oportunidad: idInterno_tramnsaccion,
                            // articulos: [{
                            //     id_item: results[i].getValue(columnas[10]),
                            //     nomnbre: results[i].getValue(columnas[12]),
                            //     cantidad: results[i].getValue(columnas[13]),
                            //     //unidad_medida: results[i].getValue(columnas[14])
                            //     precio_unitario: results[i].getValue(columnas[15]),
                            // }]
                        }


                        arrayOportunidadesApp.push(objOportunidadesApp);
                     }
                }
                start += 1000;
            } while (results && results.length == 1000);

            return JSON.stringify(arrayOportunidadesApp);

        } catch (error) {
            log.audit('error', error);
        }
    }

    function busquedaItems(id) {

        let arrayItems = [];
        let objItem = {};

        let loadOportunidad = record.load({
            type: record.Type.OPPORTUNITY,
            id: id,
            isDynamic: true,
        });

        let lineas = loadOportunidad.getLineCount({
            sublistId: 'item'
        });

        for (var i = 0; i < lineas; i++) {
            let articuloLinea = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });

            let descriptionItem = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'description',
                line: i
            });


            let quantity = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: i
            });

            let rate = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                line: i
            });

            let unitM = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'units_display',
                line: i
            });

            let lookupItem = search.lookupFields({
                type: search.Type.ITEM,
                id: articuloLinea,
                columns: ['custitem_ptg_capacidadcilindro_']
            });

            objItem = {
                id_articulo: articuloLinea,
                descripcion_articulo: descriptionItem,
                cantidad: quantity,
                unidad_medida: unitM,
                importe: rate,
                capacidad: lookupItem.custitem_ptg_capacidadcilindro_
            };
        }
        arrayItems.push(objItem);

        return arrayItems;
    }

    return {
        post: _getOportunidadesPorNviajeApp
    }
})