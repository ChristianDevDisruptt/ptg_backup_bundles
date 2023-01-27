/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/search"], function (search) {

    function _post(request) {
        log.audit("request", request);
        let response = {
            success: false,
            data: []
        };
        try {
            var arrayCaso = [];
            var objCaso = {};
            var supportcaseSearchObj = search.create({
                type: "supportcase",
                filters: [],
                columns: [
                    search.createColumn({
                        name: "company",
                        label: "Empresa"
                    }),
                    search.createColumn({
                        name: "phone",
                        join: "customer",
                        label: "Teléfono"
                    }),
                    search.createColumn({
                        name: "category",
                        label: "Tipo"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_relacionar_caso_existente",
                        label: "PTG - RELACIONAR A CASO EXISTENTE"
                    }),
                    search.createColumn({
                        name: "quicknote",
                        label: "Nota rápida"
                    }),
                    search.createColumn({
                        name: "item",
                        label: "Artículo"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_fecha_visita",
                        label: "PTG - FECHA DE VISITA"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_horario_preferido",
                        label: "PTG - HORARIO PREFERIDO"
                    }),
                    search.createColumn({
                        name: "assigned",
                        label: "Asignado a"
                    }),
                    search.createColumn({
                        name: "priority",
                        label: "Prioridad"
                    }),
                    search.createColumn({
                        name: "status",
                        label: "Estado"
                    }),
                    search.createColumn({
                        name: "casenumber",
                        sort: search.Sort.ASC,
                        label: "Número"
                    }),
                    search.createColumn({
                        name: "createddate",
                        label: "Fecha de creación"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_direccion_para_casos",
                        label: "PTG - DIRECCION PARA CASOS"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_conceptos_casos",
                        label: "PTG - CONCEPTOS PARA CASOS"
                    }),
                    search.createColumn({
                        name: "type",
                        join: "transaction",
                        label: "Type"
                    }),
                    search.createColumn({
                        name: "tranid",
                        join: "transaction",
                        label: "Document Number"
                    }),
                    search.createColumn({
                        name: "transactionname",
                        join: "transaction",
                        label: "Transaction Name"
                    }),
                    search.createColumn({
                        name: "internalid",
                        join: "transaction",
                        label: "Internal ID"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_ano_producto",
                        label: "PTG - AÑO DEL PRODUCTO"
                    }),
                    search.createColumn({
                        name: "custevent_ptg_capacidad_tanq_est",
                        label: "PTG - CAPACIDAD DEL TANQUE ESTACIONARIO"
                    }),
                    search.createColumn({ name: "internalid", label: "Internal ID" }),
                    search.createColumn({ name: "custevent_ptg_codigo_postal", label: "PTG - CODIGO POSTAL" }),
                    search.createColumn({ name: "custevent_ptg_municipio", label: "PTG - MUNICIPIO" }),
                    search.createColumn({ name: "custevent_ptg_estado", label: "PTG - ESTADO" }),
                    search.createColumn({ name: "custevent_ptg_etiqueta", label: "PTG - ETIQUETA" }),
                    search.createColumn({ name: "custevent_ptg_colonia", label: "PTG - COLONIA" }),
                    search.createColumn({ name: "custevent_ptg_nombre_calle", label: "PTG - NOMBRE DE CALLE" }),
                    search.createColumn({ name: "custevent_ptg_numero_exterior", label: "PTG - NUMERO EXTERIOR" }),
                    search.createColumn({ name: "custevent_ptg_numero_interior", label: "PTG - NUMERO INTERIOR" }),
                    search.createColumn({ name: "custevent_ptg_repuse_cilindro_danado", label: "PTG - REPUSE CILINDRO DAÑADO" }),
                    search.createColumn({ name: "custevent_ptg_realice_trasiego", label: "PTG - REALICÉ TRASIEGO" }),
                    search.createColumn({ name: "custevent_ptg_cantidad_recolectada_tras", label: "PTG - CANTIDAD RECOLECTADA EN TRASIEGO" }),
                    search.createColumn({ name: "custevent_ptg_prueba_hermetica", label: "PTG - PRUEBA HERMETICA" }),
                    search.createColumn({ name: "custevent_ptg_problema_localizado_en", label: "PTG - PROBLEMA LOCALIZADO EN" }),
                    search.createColumn({ name: "custevent_ptg_solucion", label: "PTG - SOLUCION" }),
                    search.createColumn({ name: "custevent_ptg_recogi_cilindro_danado", label: "PTG - RECOGÍ CILINDRO DAÑADO" }),
                    search.createColumn({ name: "custevent_ptg_agente_call_center", label: "PTG - AGENTE CALL CENTER" }),
                    search.createColumn({ name: "custevent_ptg_prueba_hermet_realizada", label: "PTG - PRUEBA HERMETICA REALIZADA" }),
                    search.createColumn({ name: "custevent_ptg_hay_fuga", label: "PTG - ¿HAY FUGA?" }),
                    search.createColumn({ name: "custevent_ptg_motivo_reemplazo_cil", label: "PTG - MOTIVO DE REMPLAZO DE CIL" }),
                    search.createColumn({ name: "custevent_ptg_motivo_reprogramacion", label: "PTG -PTG - MOTIVO DE REPROGRAMACION" }),
                    search.createColumn({ name: "custevent_ptg_cantidad_evidenciada", label: "PTG - PORCENTAJE INICIAL EVIDENCIADO" }),
                    search.createColumn({ name: "custevent_ptg_porcentaje_final_eviden", label: "PTG - PORCENTAJE FINAL EVIDENCIADO" }),
                    search.createColumn({ name: "custevent_ptg_entre_calle", label: "PTG - ENTRE CALLE" }),
                    search.createColumn({ name: "custevent_ptg_y_calle", label: "PTG - Y CALLE" }),
                ]
            });

            //filtros
            //["createddate","within","9/1/2022 12:00 am","10/1/2022 11:59 pm"]
            //["company","haskeywords","Zulay Aponte PTG"]
            //["customer.email","haskeywords","zulay@test.com"]
            //["type","anyof","6"]
            //["status","anyof","5"]
            //["priority","anyof","3"]
            //["customer.phone","haskeywords","4771234567"]
            var arrayFechaSolicitud = [];
            let rangoSolicitud1 = request.fechaSolicitud1 ? request.fechaSolicitud1+" 00:00" : "";
            arrayFechaSolicitud.push(rangoSolicitud1);
            let rangoSolicitud2 = request.fechaSolicitud2 ? request.fechaSolicitud2+" 23:59" : "";
            arrayFechaSolicitud.push(rangoSolicitud2);
            if (rangoSolicitud1 || rangoSolicitud2) {
                log.audit("arrayFechaSolicitud", arrayFechaSolicitud);
                var fechaPrometida = search.createFilter({
                    name: "createddate",
                    operator: "within",
                    values: arrayFechaSolicitud
                })
                supportcaseSearchObj.filters.push(fechaPrometida);
            }

            //Filtro por fecha de visita
            // var arrayFechaVisita = [];
            // let rangoVisita1 = request.fechaVisita1 || "";
            // arrayFechaVisita.push(rangoVisita1);
            // let rangoVisita2 = request.fechaVisita2 || "";
            // arrayFechaVisita.push(rangoVisita2);
            // if (rangoVisita1 || rangoVisita2) {
            //     var fechaVisita = search.createFilter({
            //         name: "custevent_ptg_fecha_visita",
            //         operator: "within",
            //         values: arrayFechaVisita
            //     })
            //     supportcaseSearchObj.filters.push(fechaVisita);
            // }

            let clienteNombre = request.nombre_cliente;
            if (clienteNombre) {
                var nombreCliente = search.createFilter({
                    name: "company",
                    operator: "haskeywords",
                    values: clienteNombre
                })
                supportcaseSearchObj.filters.push(nombreCliente);
            }

            let correoNombre = request.email_cliente;
            if (correoNombre) {
                var emailCliente = search.createFilter({
                    name: "email",
                    join: "customer",
                    operator: "haskeywords",
                    values: correoNombre
                })
                supportcaseSearchObj.filters.push(emailCliente);
            }

            let telefonoNombre = request.telefono;
            if (telefonoNombre) {
                var phoneCliente = search.createFilter({
                    name: "phone",
                    join: "customer",
                    operator: "haskeywords",
                    values: telefonoNombre
                })
                supportcaseSearchObj.filters.push(phoneCliente);
            }

            let idTipo = request.tipo_servicio;
            if (idTipo) {
                var tipoServicio = search.createFilter({
                    name: "type",
                    operator: "anyof",
                    values: idTipo
                })
                supportcaseSearchObj.filters.push(tipoServicio);
            }

            let estadoId = request.estado;
            if (estadoId) {
                var estadoServicio = search.createFilter({
                    name: "status",
                    operator: "anyof",
                    values: estadoId
                })
                supportcaseSearchObj.filters.push(estadoServicio);
            }

            let prioridadId = request.prioridad;
            if (prioridadId) {
                var prioridadServicio = search.createFilter({
                    name: "priority",
                    operator: "anyof",
                    values: prioridadId
                })
                supportcaseSearchObj.filters.push(prioridadServicio);
            }

            let tecnicoId = request.tecnico;
            if (tecnicoId) {
                var tecnicoServicio = search.createFilter({
                    name: "assigned",
                    operator: "anyof",
                    values: tecnicoId
                })
                supportcaseSearchObj.filters.push(tecnicoServicio);
            }

            let calleC = request.calle;
            if (calleC) {
                var calleCaso = search.createFilter({
                    name: "custevent_ptg_nombre_calle",
                    operator: "contains",
                    values: calleC
                })
                supportcaseSearchObj.filters.push(calleCaso);
            }

            let nIntC = request.nInt;
            if (nIntC) {
                var nIntCaso = search.createFilter({
                    name: "custevent_ptg_numero_interior",
                    operator: "contains",
                    values: nIntC
                })
                supportcaseSearchObj.filters.push(nIntCaso);
            }

            let nExtC = request.nExt;
            if (nExtC) {
                var nExtCaso = search.createFilter({
                    name: "custevent_ptg_numero_exterior",
                    operator: "contains",
                    values: nExtC
                })
                supportcaseSearchObj.filters.push(nExtCaso);
            }

            var searchResultCount = supportcaseSearchObj.run();
            var results = searchResultCount.getRange(0, 999);
            log.audit('results', results)
            for (var i = 0; i < results.length; i++) {
                let numberAsiggned = "";
                var columnas = results[i].columns;
                var idEmpresa = results[i].getValue(columnas[0]);
                var phone = results[i].getValue(columnas[1]);
                var idTipoServicio = results[i].getValue(columnas[2]);
                var relacionCasoExistente = results[i].getValue(columnas[3]);
                var relacionCasoExistenteText = results[i].getText(columnas[3]);
                var note = results[i].getValue(columnas[4]);
                var item = results[i].getValue(columnas[5]);
                var itemText = results[i].getText(columnas[5]);
                var fechaV = results[i].getValue(columnas[6]);
                var horaV = results[i].getValue(columnas[7]);
                var asignadoA = results[i].getValue(columnas[8]);
                if(!!asignadoA){
                    var employeeDate = search.lookupFields({
                        type: 'employee',
                        id: asignadoA,
                        columns: ['mobilephone']
                    });

                    numberAsiggned = employeeDate['mobilephone'];

                }
                var asignadoNombre = results[i].getText(columnas[8]);
                var priority = results[i].getValue(columnas[9]);
                var status = results[i].getValue(columnas[10]);
                var nCaso = results[i].getValue(columnas[11]);
                var fechaC = results[i].getValue(columnas[12]);
                var idOpp = results[i].getValue(columnas[18]);
                var Opp = results[i].getValue(columnas[17]);
                var yearTanque = results[i].getValue(columnas[19]);
                var capacidadEstacionario = results[i].getValue(columnas[20]);
                var internalId = results[i].getValue(columnas[21]);
                var cp = results[i].getValue(columnas[22]);
                var municipio = results[i].getValue(columnas[23]);
                var estado = results[i].getValue(columnas[24]);
                var label = results[i].getValue(columnas[25]);
                var colonia = results[i].getValue(columnas[26]);
                var calleDireccion = results[i].getValue(columnas[27]);
                var nExterior = results[i].getValue(columnas[28]);
                var nInterior = results[i].getValue(columnas[29]);
                var repuseCilindro = results[i].getValue(columnas[30]);
                var isTrasiego = results[i].getValue(columnas[31]);
                var quantityTrasiego = results[i].getValue(columnas[32]);
                var testHermatica = results[i].getValue(columnas[33]);
                var problemAtId = results[i].getValue(columnas[34]);
                var problemAt = results[i].getText(columnas[34]);
                var solution = results[i].getValue(columnas[35]);   
                var recogiCilindro = results[i].getValue(columnas[36]);
                var agenteCallCenterId = results[i].getValue(columnas[37]);
                var agenteCallCenter = results[i].getText(columnas[37]);
                var pruebaHermeticaRealizada = results[i].getValue(columnas[38]);
                var hayFuga = results[i].getValue(columnas[39]);
                var motivoReemplazoCilId = results[i].getValue(columnas[40]);
                var motivoReemplazoCil = results[i].getText(columnas[40]);
                var motivoReprogramacionId = results[i].getValue(columnas[41]);
                var motivoReprogramacion = results[i].getText(columnas[41]);
                var motivoReprogramacion = results[i].getText(columnas[41]);
                var inicialEvidenciado = results[i].getValue(columnas[42]);
                var finalEvidenciado = results[i].getValue(columnas[43]);
                var entre1 = results[i].getValue(columnas[44]);
                var entre2 = results[i].getValue(columnas[45]);
                
                var lookupFieldName = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: idEmpresa,
                    columns: ['altname']
                });

                var countPendingNotification = getPendingNotes(internalId);

                objCaso = {
                    numero_caso: nCaso,
                    id_cliente: idEmpresa,
                    nombre: lookupFieldName.altname,
                    telefono: phone,
                    tipo_servicio: idTipoServicio,
                    relacion_caso: relacionCasoExistente,
                    relacion_caso_text: relacionCasoExistenteText,
                    nota: note,
                    ariculo: item,
                    ariculoText: itemText,
                    fecha_visita: fechaV,
                    horario_preferido: horaV,
                    asignado_a: asignadoA,
                    asignadoNombre : asignadoNombre,
                    prioridad: priority,
                    estado: status,
                    fecha_solicitud: fechaC,
                    direccion_casos: results[i].getValue(columnas[13]),
                    concepto_casos: results[i].getValue(columnas[14]),
                    concepto_casos_name: results[i].getText(columnas[14]),
                    idOpp: idOpp,
                    Opp: Opp,
                    yearTanque: yearTanque,
                    capacidadEstacionario: capacidadEstacionario,
                    internalId: internalId,
                    numberAsiggned : numberAsiggned,
                    cp : cp,
                    municipio : municipio,
                    estadoDireccion : estado,
                    label : label,
                    colonia : colonia,
                    calleDireccion : calleDireccion,
                    nExterior : nExterior,
                    nInterior : nInterior,
                    repuseCilindro : repuseCilindro,
                    isTrasiego : isTrasiego,
                    quantityTrasiego : quantityTrasiego,
                    testHermatica : testHermatica,
                    problemAtId: problemAtId,
                    problemAt : problemAt,
                    solution : solution,
                    recogiCilindro: recogiCilindro,
                    countPendingNotification: countPendingNotification,
                    agenteCallCenterId: agenteCallCenterId,
                    agenteCallCenter: agenteCallCenter,
                    pruebaHermeticaRealizada: pruebaHermeticaRealizada,
                    hayFuga: hayFuga,
                    motivoReemplazoCilId: motivoReemplazoCilId,
                    motivoReemplazoCil: motivoReemplazoCil,
                    motivoReprogramacionId: motivoReprogramacionId,
                    motivoReprogramacion: motivoReprogramacion,
                    inicialEvidenciado: inicialEvidenciado,
                    finalEvidenciado: finalEvidenciado,
                    entre1: entre1,
                    entre2: entre2
                }

                arrayCaso.push(objCaso);
            }
            response.success = true;
            response.data = (arrayCaso.length > 0) ? arrayCaso : [];
            return response;

        } catch (error) {
            log.audit('error', error);
            response.message = error;
            return response;
        }
    }

    function getPendingNotes(id) {
        var opportunitySearchObj = search.create({
            type: "supportcase",
            filters:
            [
               ["internalid","is",id], 
               "AND", 
               ["usernotes.custrecord_ptg_solicitud_notificacion","is","T"]
            ],
            columns:
            [
               search.createColumn({
                  name: "note",
                  join: "userNotes",
                  label: "Nota"
               })
            ]
         });
         var searchResultCount = opportunitySearchObj.runPaged().count;
         log.debug("opportunitySearchObj result count",searchResultCount);
         return searchResultCount;
    }

    return {
        post: _post
    }
});