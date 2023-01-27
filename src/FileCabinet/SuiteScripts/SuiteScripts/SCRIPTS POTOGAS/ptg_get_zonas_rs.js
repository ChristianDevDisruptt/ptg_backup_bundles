/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _get(context) {
        try {
            log.audit('context', context)
            log.audit('prueba', 'prueba')
            var start = 0;
            var end = 1000;
            var arrayColonias = [];
            var objColonias = {};
            //todo pruebas
            var status = {
                success: false,
                data: arrayColonias
            }
            var zipCode = context.zip;
            var colonia = context.colonia;
            var customrecord_ptg_coloniasrutas_SearchObj = search.create({
                type: "customrecord_ptg_coloniasrutas_",
                filters: [],
                columns: [
                    // "internalid",
                    // search.createColumn({
                    //     name: "name",
                    //     sort: search.Sort.ASC
                    // }),
                    // "custrecordptg_zona_de_precio",
                    // "custrecordptg_cp_",
                    // search.createColumn({
                    //     name: "custrecord_ptg_territoriodescripcion_",
                    //     join: "CUSTRECORDPTG_ZONA_DE_PRECIO",
                    //     label: "PTG - Descripción Territorio"
                    // }),
                    // search.createColumn({
                    //     name: "custrecord_ptg_rutacil_",
                    //     label: "PTG - CIL"
                    // }),
                    // search.createColumn({
                    //     name: "custrecord_ptg_rutaest_",
                    //     label: "PTG - EST"
                    // })
                    search.createColumn({
                        name: "internalid",
                        label: "Internal ID"
                    }),
                    search.createColumn({
                        name: "name",
                        sort: search.Sort.ASC,
                        label: "Name"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_zona_de_precio_",
                        label: "PTG - Zona de Precio"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_cp_",
                        label: "PTG - CP"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_pbservaciones_",
                        label: "PTG - Observaciones"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_rutacil_",
                        label: "PTG - CIL"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_rutaest_",
                        label: "PTG - EST"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_nombrecolonia_",
                        label: "PTG - NOMBRE DE COLONIA"
                    }),
                    search.createColumn({
                        name: "custrecord_ptg_precio_",
                        join: "CUSTRECORD_PTG_ZONA_DE_PRECIO_",
                        label: "PTG - PRECIO"
                     })
                ]
            });
            log.audit('customrecord_ptg_coloniasrutas_SearchObj', customrecord_ptg_coloniasrutas_SearchObj);
            //todo validar uso
            if (zipCode && colonia) {
                var zipCodeFilter = search.createFilter({
                    name: "custrecord_ptg_cp_",
                    operator: "startswith",
                    values: zipCode,
                })
                customrecord_ptg_coloniasrutas_SearchObj.filters.push(zipCodeFilter);

                var coloniaFilter = search.createFilter({
                    name: "custrecord_ptg_nombrecolonia_",
                    operator: "startswith",
                    values: colonia,
                })
                customrecord_ptg_coloniasrutas_SearchObj.filters.push(coloniaFilter);
            }


            var searchResultCount = customrecord_ptg_coloniasrutas_SearchObj.run();
            var results = searchResultCount.getRange(start, end);
            log.audit('results get zone', results)
            if (results.length > 0) {

                //log.audit('entro al if', 'if')
                for (var i = 0; i < results.length; i++) {
                    var columnas = results[i].columns;
                    //log.audit('columnas', columnas)
                    var idColonia = results[i].getValue(columnas[0]);
                    var NombreColonia = results[i].getValue(columnas[1]);
                    var zonaPrecio = results[i].getValue(columnas[8]);
                    var codigoPostal = results[i].getValue(columnas[3]);
                    var nombreZonaPrecio = results[i].getText(columnas[2]);
                    var cil = results[i].getValue(columnas[5]);
                    var est = results[i].getValue(columnas[6]);
                    //log.audit('cil', cil);
                    //log.audit('est', est);
                    if (cil && est) {
                        var lookupLocationCil = search.lookupFields({
                            type: search.Type.LOCATION,
                            id: cil,
                            columns: ['name']
                        });

                        var nameCil = lookupLocationCil.name;

                        var lookupLocationEst = search.lookupFields({
                            type: search.Type.LOCATION,
                            id: est,
                            columns: ['name']
                        });

                        var nameEst = lookupLocationEst.name;
                    }
                    objColonias = {
                        id: idColonia,
                        nombre: NombreColonia,
                        zona_venta: nombreZonaPrecio,
                        cp: codigoPostal,
                        ubicacionCil: cil,
                        nameUbicacionCil: nameCil || '',
                        ubicacionEst: est,
                        nameUbicacionEst: nameEst || '',
                        precio : zonaPrecio
                    }
                    log.audit('objColonis', objColonias)
                    arrayColonias.push(objColonias);
                }
                status.success = true;
                status.data = arrayColonias;
            }

            return status

        } catch (error) {
            log.audit('error', error)
            status['detail'] = error;
            return status
        }

    }

    return {
        get: _get
    }
});