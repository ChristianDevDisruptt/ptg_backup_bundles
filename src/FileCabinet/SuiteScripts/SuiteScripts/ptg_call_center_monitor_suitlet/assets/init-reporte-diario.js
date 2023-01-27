// Se inyecta la información del usuario logueado
$('.user-name').text(userName);
$('#role').text(userRole);

// Función para obtener los motivos de cancelar pedido
function getListCancellReason() {
    let dataListCancellReason = {
        "requestType" : 'getListCancellReason'
    };

    let settings = {
        url      : urlGetListCancellReason,
        method   : 'GET',
        data     : JSON.stringify(dataListCancellReason),
    }

    setAjax(settings).then((response) => {
        setSelectListCancellReason((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

function getMethodPayments() {
    let dataListMethodPayments = {
        "requestType" : 'getMethodPayments'
    };

    let settings = {
        url      : urlGetMethodPayments,
        method   : 'GET',
        data     : JSON.stringify(dataListMethodPayments),
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            response.data.forEach(element => {
                methodPayments.push(element);
            });
        }
    }).catch((error) => {
        console.log(error);
    });
}

// Método para llenar el select de los motivos de cancelar pedido
function setSelectListCancellReason(items) {
    if ( items.length ) {
        $('#cancelarOppMotivo').children('option').remove();
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("#cancelarOppMotivo").append(
                    '<option value='+items[key].id+'>'+items[key].name+'</option>'
                );
            }
        }
        readyInit();
    } else {
        console.warn('No hay plantas por cargar');
        readyInit();
    }
}

// Función para obtener los motivos de cancelar pedido
function getListSuppEmp() {
    let dataListSuppEmp = {
        "requestType" : 'getListSuppEmp'
    };

    let settings = {
        url      : urlGetListSuppEmp,
        method   : 'GET',
        data     : JSON.stringify(dataListSuppEmp),
    }

    setAjax(settings).then((response) => {
        setSelectListSuppEmp((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Método para llenar el select de los motivos de cancelar pedido
function setSelectListSuppEmp(items) { 
    if ( items.length ) {
        $('#asignarTecnicoFugaQueja, #responsableQueja').children('option').remove();
        $('#asignarTecnicoFugaQueja, #responsableQueja').append('<option value="0">Seleccione una opción</option>');
        items.forEach(element => {
            $("#asignarTecnicoFugaQueja, #responsableQueja").append(
                '<option data-item=' + "'" + JSON.stringify(element) + "'" + 'value='+element.id+'>'+element.name+'</option>'
            );
        });
        $('#asignarTecnicoFugaQueja, #responsableQueja').select2({
            selectOnClose: true,
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
        readyInit();
    } else {
        console.warn('No hay plantas por cargar');
        readyInit();
    }
}

// Función para obtener las plantas
function getPlantas() {
    let dataPlantas = {
        "requestType" : 'getPlantas'
    };

    let settings = {
        url      : urlPlantas,
        method   : 'GET',
        data     : JSON.stringify(dataPlantas),
    }

    setAjax(settings).then((response) => {
        setSelectPlants((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Método para llenar el select de plantas
function setSelectPlants(items) {
    if ( items.length ) {
        $('select#plantas').children('option').remove();
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#plantas").append(
                    '<option value='+items[key].id+'>'+items[key].nombre+'</option>'
                );
            }
        }
        //$('select#plantas').val("762");
        $('title').html($("#plantas option:selected").text());
        getRutas();
        getListTravel();
        readyInit();
    } else {
        console.warn('No hay plantas por cargar');
        readyInit();
    }
}

function getListTravel() {
    let settings = {
        url      : urlGetListTravelNumber,
        method   : 'POST',
        data: JSON.stringify({
            namePlanta : $("#plantas option:selected").text()
        })
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            vrViajes = [];
            response.data.forEach(element => {
                vrViajes.push(element);
            });
        }
        readyInit();
    }).catch((error) => {
        readyInit();
        console.log(error);
    });
}

// Función para obtener los estado de la oportunidad
function getStatusOportunidad() {
    let settings = {
        url      : urlStatusOp,
        method   : 'GET'
    }

    setAjax(settings).then((response) => {
        setSelectStatusOp((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Método para llenar el select de los estado de la oportunidad
function setSelectStatusOp(items) {
    vrStatus = [];
    if ( items.length ) {
        $('#filterEstadoSolicitud').children('option').remove();
        /*$('#filterEstadoSolicitud').append(
             '<option value="0">Todos</option>'
        )*/
        
        items.forEach(element => {
            if(element.nombre.trim().toLowerCase() == "por notificar") {
                idPorNotificar = element.id;
            }
            if(element.nombre.trim().toLowerCase() == "asignado") {
                idAsignado = element.id;
            }
            if(element.nombre.trim().toLowerCase() == "cancelado") {
                idCancelado = element.id;
            }
            if(element.nombre.trim().toLowerCase() == "entregado") {
                idEntregado = element.id;
            }
            if(element.nombre.trim().toLowerCase() == "por reprogramar") {
                idPorReprogramar = element.id;
            }
            if(element.nombre.trim().toLowerCase() == "por confirmar") {
                idPorConfirmar = element.id;
            }
            vrStatus.push(element);
        });

        vrStatus.forEach(element => {
            $("#filterEstadoSolicitud").append(
                '<option value="'+element.id+'">'+element.nombre+'</option>'
            );
        });

        $('#filterEstadoSolicitud').select2({
            selectOnClose: true,
            placeholder: "Todos",
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });

        readyInit();
    } else {
        console.warn('No hay estados de solicitud por cargar');
        readyInit();
    }
}

// Función para obtener los estado de la oportunidad
function getRutas(getPedidos = false) {
    if(getPedidos) {
        loadMsg();
    }
    let settings = {
        url      : urlRutas,
        method   : 'POST',
        data: JSON.stringify({
            namePlanta : $("#plantas option:selected").text()
        })
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            rutasCilindros = response.rutaCilindro;
            rutasEstacionarios = response.rutaEstacionario;
            setSelectRutas(getPedidos);
        }        
    }).catch((error) => {
        console.log(error);
    });
}

// Método para llenar el select de los estado de la oportunidad
function setSelectRutas(getPedidos = false) {
    $('#filterRuta').parent().parent().removeClass("d-none");
    $('#filterRuta').children('option').remove();    
    if ( rutasCilindros.length || rutasEstacionarios.length) {        
        if($("#filterTipoProducto").val() == "0" || $("#filterTipoProducto").val() == "1") {
            rutasCilindros.forEach(element => {
                $("#filterRuta").append(
                    '<option value="'+element.internalId+'" data-item='+"'"+JSON.stringify(element)+"'"+'>'+getRutaFormat(element, "ruta")+'</option>'
                );
            });
        }
        if($("#filterTipoProducto").val() == "0" || $("#filterTipoProducto").val() == "2") {
            rutasEstacionarios.forEach(element => {
                $("#filterRuta").append(
                    '<option value="'+element.internalId+'" data-item='+"'"+JSON.stringify(element)+"'"+'>'+getRutaFormat(element, "ruta")+'</option>'
                );
            });
        }
        if($("#filterTipoProducto").val() == "3") {
            $('#filterRuta').parent().parent().addClass("d-none");
        }
        $('#filterRuta').select2({
            selectOnClose: true,
            placeholder: "Todas",
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
        if(getPedidos) {
            getServicios(this);
        }        
        readyInit();
    } else {
        console.warn('No hay rutas por cargar');
        if(getPedidos) {
            getServicios(this);
        }       
        readyInit();
    }
}

// Función para obtener los tipos de servicios
function getTiposServicios() {
    let settings = {
        url      : urlTiposServicios,
        method   : 'GET'
    }

    setAjax(settings).then((response) => {
        setSelectTiposServicios((response.data));
    }).catch((error) => {
        console.log(error);
    });
}
vrTiposServicios = [];
// Método para llenar el select de los estado de la oportunidad
function setSelectTiposServicios(items) {
    vrTiposServicios = [];
    if ( items.length ) {
        $('#filterTipoProducto').children('option').remove();
        $('#filterTipoProducto').append(
            '<option value="0">Todos</option>'
        )
        for ( var key in items ) {
            vrTiposServicios.push(items[key]);
            if ( items.hasOwnProperty( key ) && items[key].id != "4") {
                $("#filterTipoProducto").append(
                    '<option value="'+items[key].id+'">'+items[key].nombre+'</option>'
                );
            }
        }
        readyInit();
    } else {
        console.warn('No hay tipos de servicio por cargar');
        readyInit();
    }
}

// Call a global ajax method
function setAjax(settings) {
    // Generamos el AJAX dinamico para las peticiones relacionadas con peddos
    return new Promise((resolve, reject) => {
        $.ajax({
            url: settings.url,
            method: settings.method,
            data: settings.data ?? null,
            // data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (response) {
                if ( response.success ) {
                    resolve(response);
                } else {
                    reject(response);
                    swal.close();
                    msg = response.msg ? response.msg : 'La petición no devolvió datos';
                    console.log('info', msg);
                    // infoMsg('info', msg);
                }
            }, error: function (xhr, status, error) {
                console.error('mensaje de error');
                reject({ xhr: xhr, status: status, error: error });
            }
        });
    });
}

var globalTimeout = null;  

function getServiciosDelay($event) {
    if (globalTimeout != null) {
        clearTimeout(globalTimeout);
    }
    globalTimeout = setTimeout(function() {
        globalTimeout = null;  
        //ajax code
        getServicios($event)
    }, 1000);  
}

function getFiltPedidos() {
    let filt = {};

    // Para el rango de fecha prometida, se envía la misma fecha tanto en 
    if($("#filterFecha").val()) {
        filt.fechaPrometida = dateFormatFromDate($("#filterFecha").val(), "5");
    }

    if($("#filterEstadoSolicitud").val().length > 0) {
        filt.status_oportunidad = $("#filterEstadoSolicitud").val();
    }

    if($("#filterTipoProducto").val() != "3" && $("#filterRuta").val().length > 0) {
        filt.rutas = [];
        for (let x = 0; x < $("#filterRuta option:selected").length; x++) {
            const element = $($("#filterRuta option:selected")[x]);
            filt.rutas.push(element.data("item").name.trim().split(":")[1] ? element.data("item").name.trim().split(":")[1].trim() : element.data("item").name.trim());
        }
    }

    if($("#filterTipoProducto").val() != "0") {
        filt.tipo_producto = parseInt($("#filterTipoProducto").val());
    }

    if($("#plantas").val()) {
        filt.planta = $("#plantas").val();
    }

    if($("#filterProgramado").prop('checked')) {
        filt.programado = true;
    }

    return filt;
}

function loadMsg(msg = 'Espere un momento porfavor...') {
    
    let swalObj = {
        title: msg,
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
        content: {
            element: "div",
            attributes: {
                innerHTML:"<i class='fa-solid fa-spinner fa-spin fa-2x'></i>"
            },
        }
    };

    swal(swalObj).catch(swal.noop);

}

function infoMsg(type, title, msg = '', timer = null, callback = null) {

    let swalObj = {
        title: title,
        icon: type ?? 'info',
        // buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
        timer: timer,
        content: {
            element: "div",
            attributes: {
                innerHTML:"<p class='text-response'>"+msg ?? "¡Cambios guardados exitosamente!"+"</p>"
            },
        }
    };

    if(callback) {
        swal(swalObj).then((resp) => {
            callback(resp);
        }).catch(swal.noop);
    } else {
        swal(swalObj).catch(swal.noop);
    }
}

// Función para obtener los diferentes tipos de servicios
function getServicios($event) {
    
        let settings = {
            url      : urlGetOpp,
            method   : 'POST',
            data: JSON.stringify(getFiltPedidos())
        }
        if(!swal.getState().isOpen) {
            loadMsg();
        }
        
        $("#tablePedidos tbody").children("tr").remove();
        setAjax(settings).then((response) => {        
            if(response.success) {
                let auxData = {},
                    auxDataArray = [];
                response.data.forEach(element => {
                    if(!auxData[element.id]) {
                        auxData[element.id] = element;
                        auxData[element.id].articulos = element.articulo_id != "" ?[{
                            id: element.articulo_id,
                            nombre: element.articulo,
                            cantidad: element.cantidad
                        }] : []
                    } else if(element.articulo_id != ""){
                        auxData[element.id].articulos.push({
                            id: element.articulo_id,
                            nombre: element.articulo,
                            cantidad: element.cantidad
                        });
                    }
                    if(element.articulo_id == "") {
                        auxData[element.id].observaciones = element.observaciones;
                    }
                });

                Object.keys(auxData).forEach(element => {
                    auxDataArray.push(auxData[element]);                
                });

                $("#printTable").prop("disabled", false);

                response.data = auxDataArray;
                //response.data = removeDuplicates(response.data, 'id');
                if(response.data.length == 0) {
                    $("#tablePedidos tbody").append('<tr><td colspan="8" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
                    initTable("tablePedidos");
                    $("#printTable").prop("disabled", true);
                }
                /*response.data.forEach((pedido, position) => {
                    
                    if(pedido.fecha_prometida) {
                        pedido.fecha_hora_prometida = dateFormatFromString(pedido.fecha_prometida, "2");
                        pedido.fecha_prometida = dateFormatFromDate(new Date(pedido.fecha_prometida.split("/")[2], parseInt(pedido.fecha_prometida.split("/")[1]) - 1, pedido.fecha_prometida.split("/")[0]), "2");
                    }
            
                    if(pedido.fecha_solicitud) {
                        pedido.fecha_hora_solicitud = dateFormatFromString(pedido.fecha_solicitud + (pedido.horaTrans && pedido.horaTrans.trim() ? ' ' + pedido.horaTrans : ''), "2");
                        pedido.fecha_solicitud = dateFormatFromDate(new Date(pedido.fecha_solicitud.split("/")[2], parseInt(pedido.fecha_solicitud.split("/")[1]) - 1, pedido.fecha_solicitud.split("/")[0]), "2");
                    }
                                
                    if(pedido.fecha_notificacion) {
                        pedido.fecha_hora_notificacion = dateFormatFromString(pedido.fecha_notificacion+(pedido.hora_notificacion ? " "+pedido.hora_notificacion : ''), "2");
                        pedido.fecha_notificacion = dateFormatFromDate(new Date(pedido.fecha_notificacion.split("/")[2], parseInt(pedido.fecha_notificacion.split("/")[1]) - 1, pedido.fecha_notificacion.split("/")[0]), "2");
                    }
                    vrStatus.forEach(element2 => {
                        if(element2.id == pedido.status_id) {
                            pedido.estado = element2.nombre;
                        }
                    });
                    if(pedido.desde) {
                        pedido.desde = getTimeFromString(pedido.desde);
                    }
                    if(pedido.hasta) {
                        pedido.hasta = getTimeFromString(pedido.hasta);
                    }
                });
                response.data.sort(dynamicSort("fecha_hora_prometida"));*/
                
                //response.data = orderOrders(response.data);
                /*$("#tablePedidos thead tr th").css('z-index', "3");
                $($("#tablePedidos thead tr th")[0]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[1]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[2]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[3]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[4]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[5]).css('z-index', "4");*/
                response.data.forEach((pedido, position) => {          
                    let trAux = getRowTable(pedido);
                        console.log(trAux);
                    $("#tablePedidos tbody").append(trAux);

                    if(response.data.length == (position + 1)) {
                        initTable("tablePedidos");
                    }
                });

                let auxData2 = {};
                response.data.forEach(element => {
                    if(!auxData2[element.ruta]) {
                        auxData2[element.ruta] = [element];
                    } else {
                        auxData2[element.ruta].push(element);
                    }
                });
                console.log(auxData2);

                let auxHtml = "";
                Object.keys(auxData2).forEach(element => {
                    let auxElem = auxData2[element];
                    if(auxHtml != "") {
                        auxHtml += '<div style="page-break-before:always;"></div>';
                    }
                    auxHtml +=  '<div class="row text-center">'+
                                    '<div class="col">'+
                                        '<p class="color-primary text-center fw-bold" style="font-size: 26px">Pedidos del día para las ruta: '+(element.split(":")[1] ? (element.split(":")[1].split("-")[2] ? element.split(":")[1].split("-")[2] : element.split(":")[1]) : element)+'</p>'+
                                    '</div>'+
                                '</div>'+
                                '<table>'+
                                    '<thead>'+
                                        '<tr>'+
                                            '<th class="text-center">Nombre / Dirección</th>'+
                                            '<th class="text-center">CTE RI-505 / Contrato</th>'+
                                            '<th class="text-center">Teléfono</th>'+
                                            '<th class="text-center">Nota / Desc. Producto</th>'+
                                            '<th class="text-center">Surtir Lts / Cil</th>'+
                                            '<th class="text-center">Atendió / Cto disponible</th>'+
                                            '<th class="text-center">Tipo pedido</th>'+
                                            '<th class="text-center">Último servicio</th>'+
                                        '</tr>'+
                                    '</thead>'+
                                    '<tbody>';
                                        auxElem.forEach(element2 => {
                                            auxHtml += getRowTable(element2);
                                        });
                    auxHtml +=                '</tbody>'+
                                '</table>';
                });
                
                $("#dataPrint").html(auxHtml);
                swal.close();
            } else {
                $("#tablePedidos tbody").append('<tr><td colspan="8" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
                swal.close();
            }
        }).catch((error) => {
            console.log(error);
            $("#tablePedidos tbody").append('<tr><td colspan="8" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
            swal.close();
        });
    
}

function getRowTable(pedido) {
    let auxDir = getDireccionFormat(pedido, "pedido"),
        auxObs = getObservacionesFormat(pedido, "<br>"),
        auxRuta = getRutaFormat(pedido, "pedido");
    let trAux =   '<tr data-item='+"'"+JSON.stringify(pedido)+"'"+'>'+
                        '<td class="text-center">' + 
                            (pedido.isPerson == "T" ? (pedido.firstName.split(" ")[0] + " " + pedido.lastName.split(" ")[0]) : pedido.companyName) + '<br>'+
                            (auxDir ?? 'Sin dirección')+
                        '</td>'+
                        '<td class="text-center">' + (pedido.entityidcliente ? pedido.entityidcliente : '') +'<br>' + (pedido.contrato ? pedido.contrato+'-'+pedido.digitoVerificador : 'Sin contrato') + '</td>'+
                        '<td class="text-center">' + (pedido.telefono ? pedido.telefono : 'Sin teléfono') + '</td>'+
                        '<td class="text-center">' + 
                            (pedido.observaciones ? pedido.observaciones : 'Sin nota') + '<br>';
                        pedido.articulos.forEach(element => {
                        trAux +=  (element.nombre ? element.nombre+ '<br>' : '');
                        });
                        trAux +=   (pedido.item1 ? pedido.item1 : '') + 
                        '</td>'+
                        '<td class="text-center">';
                        pedido.articulos.forEach(element => {
                            trAux +=  (element.cantidad ? element.cantidad.toString().replace("-", '') + '<br>' : '');
                        });
                        trAux +=      '<strong>'+(pedido.alianza ? pedido.alianza : '')+'</strong></td>'+// Aquí falta el litraje/kgs surtidos relacionados al producto
                        '<td class="text-center">' + 
                            ( pedido.usuario_pedido_solicitud ? pedido.usuario_pedido_solicitud : '' ) + '<br>'+// Aquí va la persona que atendió
                            ( '$'+(pedido.credito_disponible ? getCorrectFormat(pedido.credito_disponible) : '0.00') ) + //Aquí va el crédito restante del cliente
                        '</td>'+
                        '<td class="text-center">'+(pedido.status == 1 ? 'No surtido' : (pedido.status == 2 ? 'Asignado' : (pedido.status == 3 ? 'Surtido' : (pedido.status == 4 ? 'Por reprogramar' : (pedido.status == 5 ? 'Cancelado' : 'Por confirmar')))))+' <br> '+((!pedido.aviso || pedido.aviso == 'F') && (!pedido.programado || pedido.programado == 'F') ? 'TELEFÓNICO' : (pedido.aviso && pedido.aviso == 'T') ? 'AVISO' : 'PROGRAMADO')+'</td>'+
                        '<td class="text-center">'+(pedido.ultimo_servicio ? pedido.ultimo_servicio : 'Primer pedido')+'</td>'+
                    '</tr>';
    return trAux;
}

function getCorrectFormat(number) {
    return Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(number);
}

function getRutaFormat(item, tipo) { 
    let auxRut = "";
    let auxRuta = item.name;
    if(tipo == "pedido") {
        auxRuta = item.rutaNombre;
    } else if(tipo == "viajes") {
        auxRuta = item.ruta;
    }
    auxRut += (auxRuta && auxRuta.trim() ? (auxRuta.trim().split(":").length > 1 ? auxRuta.trim().split(":")[1].trim() : auxRuta.trim()) : '')

    if(auxRuta && auxRut.trim()) {
        auxRut = auxRut.trim();
        let rout = auxRut.split(" - ").length > 1 ? auxRut.split(" - ")[0] : auxRut;
        rout = rout.split("-").length > 2 ? rout.split("-")[2] : rout.trim();
        if(tipo == "pedido") {
            auxRut = rout + " (" + (item.turno && item.turno.trim() ? item.turno.trim() : 'Sin especificar') + ")";
        } else if(tipo == "ruta") {
            auxRut = rout;
        } else if(tipo == "viajes") {
            auxRut = rout + " (" + (item.turno && item.turno.trim() ? item.turno.trim() : 'Sin especificar') + ")";
        }
    }
        
    return auxRut;
}

function getObservacionesFormat(item, separador) { 
    let auxObs = "";
    auxObs += (item.observaciones && item.observaciones.trim() ? item.observaciones.trim() : '');
    if(item.objPagos) {
        let aux = JSON.parse(item.objPagos);
        if(aux.pago) {
            aux.pago.forEach(element => {
                if(concatObsPagos.indexOf(element.tipo_pago) > -1) {
                    if(auxObs != "") {
                        auxObs += separador;
                    }
                    auxObs += getMetodoPagoFormat(element);
                }                    
            });
        }
    }
    return auxObs.trim();
}

function getMetodoPagoFormat(item) {     
    return item.metodo_txt + (item.folio ? " - " + item.folio : '') + " - $" + item.monto;
}

function getDireccionFormat(item, tipo) { 
    let auxDir = "";
    if(tipo == "pedido") {
        auxDir += (item.street && item.street.trim() ? item.street.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.colonia && item.colonia.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', ' : '') + item.cp.trim() : '');
        auxDir += (item.municipio && item.municipio.trim() ? (auxDir ? ' ' : '') + capitalizeFirstsLetter(item.municipio.trim()) : '');
        auxDir += (item.estadoDireccion && item.estadoDireccion.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.estadoDireccion.trim()) : '');
    } else {
        auxDir += (item.calleDireccion && item.calleDireccion.trim() ? item.calleDireccion.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.colonia && item.colonia.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', ' : '') + item.cp.trim() : '');
        auxDir += (item.municipio && item.municipio.trim() ? (auxDir ? ' ' : '') + capitalizeFirstsLetter(item.municipio.trim()) : '');
        auxDir += (item.estadoDireccion && item.estadoDireccion.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.estadoDireccion.trim()) : '');
    }
    return auxDir.trim();
}

function capitalizeFirstsLetter(string) {
    let auxStr = "";
    string.split(" ").forEach(element => {
        if(auxStr != "") {
            auxStr += " ";
        }
        auxStr += element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
    });
    return auxStr.trim();
}

function initTable(table) {
    $("#"+table).fancyTable({
        sortColumn:0,
        pagination: true,
        perPage: 50,
        searchable:false,
        sortable: false
    });

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function getMetodoPagoNombre(item) {
    let aux = "No encontrado";
    console.log(item);
    if(item.tipo_pago) {
        methodPayments.forEach(element => {
            if(element.id == item.tipo_pago) {
                aux = element.metodo_txt;
            }
        });
    }
    return aux;
}

$("#guardarPedido").click(function() {
    let servicio = $("#data-pedidos").data("item");
    if(!$("#fechaPrometidaPedido").val() ||
       !$("#desdePedido").val() ||
       !$("#hastaPedido").val() ||
       !$("#viajeVentaPedido").val()) {
        let aux = "<ul>";
        if(!$("#fechaPrometidaPedido").val()) {
            aux += "<li>Fecha prometida</li>";
        }
        if(!$("#desdePedido").val()) {
            aux += "<li>Desde</li>";
        }
        if(!$("#hastaPedido").val()) {
            aux += "<li>Hasta</li>";
        }
        if(!$("#viajeVentaPedido").val()) {
            aux += "<li>Ruta</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
        return;
    }
    confirmMsg("warning", "¿Seguro que desea editar el servicio?", function(resp) {
        if(resp) {
            let dataSend = {
                "opportunitiesUpdate": [
                    {
                        "id": servicio.no_pedido,
                        "bodyFields": {
                            "expectedclosedate": dateFormatFromDate($("#fechaPrometidaPedido").val(), "5"),
                            "custbody_ptg_entre_las": formatTime( $('#desdePedido').val() ),
                            "custbody_ptg_y_las" : formatTime( $('#hastaPedido').val()),
                            "custbody_ptg_numero_viaje" : $('#viajeVentaPedido').val(),
                            "memo": $('#observacionesPagoPedido').val()
                        },
                        "lines": [
                            
                        ]
                    }
                ]
            };

            if(servicio.status_id == idPorNotificar || servicio.status_id == idPorReprogramar) {
                dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_monitor = userId;
                dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_estado_pedido = idAsignado;
                dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_fecha_notificacion = dateFormatFromDate(new Date(), "5");
                dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_hora_notificacion = formatTime(timeFormatFromDate(new Date(), "2"));
            }

            loadMsg();
            let settings = {
                url      : urPutOppMonitor,
                method   : 'PUT',
                data: JSON.stringify(dataSend)
            }
            setAjax(settings).then((response) => {
                if(response.success) {
                    servicio.choferId = $("#viajeVentaPedido option:selected").data("item").choferId;
                    servicio.phoneChofer = $("#viajeVentaPedido option:selected").data("item").choferPhone;
                    servicio.observaciones = $('#observacionesPagoPedido').val();
                    //phoneChofer, choferId, observaciones
                    let auxNoti = getDefaultNotification('pedido', servicio);
                    let dataSendN = {
                        notification: {
                            title: 'Notificación de pedido',
                            message: auxNoti.notificacion,
                            ids: [servicio.choferId]
                        }, sms : {
                            title: servicio.id_cliente+servicio.label+dateFormatFromDate(new Date(), "8"),
                            message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+servicio.phoneChofer
                        }
                    };
                    sendNotification(dataSendN, function(resp) {
                        swal.close();
                        infoMsg('success', '', "Servicio guardado de manera correcta", null, function(resp) {
                            $(".btn-expand").trigger("click");
                            getServicios();
                        }); 
                    });
                } else {
                    swal.close();
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de editar el servicio");
                }            
            }).catch((error) => {
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de editar el servicio");
                console.log(error);
                swal.close();
            });
        }
    });
});

function setSelectConceptosCasos(caso) {
    $('#conceptoFugaQueja, #conceptoQueja').children('option').remove();
    $('#conceptoFugaQueja, #conceptoQueja').append('<option value="0">Seleccione una opción</option>');
    conceptoFugasQuejasArr.forEach(element => {
        if(caso.tipo_servicio == "1" && element.typeName == 'Fugas') {
            $("#conceptoFugaQueja, #conceptoQueja").append('<option value='+element.id+'>'+element.name+'</option>');
        } else if(caso.tipo_servicio == "2" && element.typeName == 'Quejas') {
            $("#conceptoFugaQueja, #conceptoQueja").append('<option value='+element.id+'>'+element.name+'</option>');
        }
    });
    $('#conceptoFugaQueja, #conceptoQueja').select2({
        selectOnClose: true,
        placeholder: "Seleccione una opción",
        language: {
            "noResults": function(){
                return "Sin resultados encontrados";
            }
        }
    });

    if(caso.concepto_casos.trim()) {
        $('#conceptoFugaQueja, #conceptoQueja').val(caso.concepto_casos.trim()).trigger("change");
    } else {
        $('#conceptoFugaQueja, #conceptoQueja').val("0").trigger("change");
    }
}

// Función para obtener los giros de negocio
function getConceptosCasos() {
    let settings = {
        url      : urlGetConceptosCasos,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        if (response.success) {
            conceptoFugasQuejasArr = response.data;
        }
        readyInit();
        // setselectConceptosCasos((response.data));
    }).catch((error) => {
        console.log(error);
        readyInit();
    });
}

// Función y ajax para obtener los pedidos
function getCasosOportunidades(caso) {
    let dataObtenerPedido = {
        "id" : caso.id_cliente
    };

    let settings = {
        url      : urlObtenerPedidos,
        method   : 'POST',
        data     : JSON.stringify(dataObtenerPedido),
    }

    // Se remueven registros previos
    $('#asociarServicioFugaQueja, #asociarCasoFugaQueja, #asociarServicioQueja, #asociarCasoQueja').children('option').remove();
    $('#asociarServicioFugaQueja, #asociarCasoFugaQueja, #asociarServicioQueja, #asociarCasoQueja').append('<option value="0">Seleccione una opción</option>');

    setAjax(settings).then((response) => {
        // console.log('pedidos obtenidos exitósamente', response);
        setCasosOportunidades(caso, JSON.parse(response.data));
    }).catch((error) => {
        console.log('Error en la consulta', error);
    });
}

// Valida el contenido de casos y oportunidades y llama la función setTrOppCases
function setCasosOportunidades(caso, data ) {
    let casos         = data.casos;
    let oportunidades = data.oportunidades;
    console.log('Caso', caso);
    console.log('Casos', casos);
    console.log('Oportunidades', oportunidades);
    
    // Checa casos
    casos.forEach(element => {
        if ( element.numero_caso != element.numeroCaso) {
            $('#asociarCasoFugaQueja, #asociarCasoQueja').append('<option value="'+element.id_Transaccion+'">No. caso: '+element.numeroCaso+' - '+element.tipo_servicio+(element.tipo_servicio.toLowerCase() == "fuga" ? ' - Fecha visita: '+(element.fecha_visita ? element.fecha_visita : 'Sin asignar') : '')+'</option>');
        }
    });

    // Checa oportunidades
    oportunidades.forEach(element => {
        if(element.fecha) {
            element.fecha_date = dateFormatFromString(element.fecha, "2");
            element.fecha = dateFormatFromDate(new Date(element.fecha.split("/")[2], parseInt(element.fecha.split("/")[1]) - 1, element.fecha.split("/")[0]), "5");
        }
    });

    oportunidades.sort(dynamicSort("fecha_date"));
    oportunidades.reverse();

    oportunidades.forEach(element => {
        $('#asociarServicioFugaQueja, #asociarServicioQueja').append('<option value="'+element.id_Transaccion+'"> No. documento: '+element.numeroDocumento+' - Fecha: '+element.fecha+'</option>');
    });
    
    $('#asociarCasoFugaQueja, #asociarCasoQueja').select2({
        selectOnClose: true,
        placeholder: "Seleccione una opción",
        language: {
            "noResults": function(){
                return "Sin resultados encontrados";
            }
        }
    });
    $('#asociarServicioFugaQueja, #asociarServicioQueja').select2({
        selectOnClose: true,
        placeholder: "Seleccione una opción",
        language: {
            "noResults": function(){
                return "Sin resultados encontrados";
            }
        }
    });

    if(caso.relacion_caso.trim()) {
        $('#asociarCasoFugaQueja, #asociarCasoQueja').val(caso.relacion_caso.trim()).trigger("change");
    } else {
        $('#asociarCasoFugaQueja, #asociarCasoQueja').val("0").trigger("change");
    }

    if(caso.idOpp.trim()) {
        $('#asociarServicioFugaQueja, #asociarServicioQueja').val(caso.idOpp.trim()).trigger("change");
    } else {
        $('#asociarServicioFugaQueja, #asociarServicioQueja').val("0").trigger("change");
    }
}

function confirmMsg(type, title, callback) {

    let swalObj = {
        title: title,
        icon: type ?? 'info',
        buttons:["Cancelar", "Aceptar"],
        closeOnEsc: false,
        closeOnClickOutside: false,
    };

    swal(swalObj).then((resp) => {
        callback(resp);
    }).catch(swal.noop);
}

// Regresa el valor de un input tiempicker al formato de netsuite
function formatTime(value, format = 'hh:mm a') {
    let hora = value.split(':');
    let customDateTime = new Date();

    if ( hora.length ) {

        customDateTime.setHours(hora[0]);
        customDateTime.setMinutes(hora[1]);

        return moment(customDateTime).format(format);

    } 

    return '';
}

$("#guardarCerrarCaso").click(function() {
    let caso = $("#cerrarCasoModal").data("item");
    if(!$("#cerrarCasoObservaciones").val() || !$("#cerrarCasoObservaciones").val().trim()) {
        let aux = "<ul>";
        if(!$("#cerrarCasoObservaciones").val() || !$("#cerrarCasoObservaciones").val().trim()) {
            aux += "<li>Observaciones</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
        return;
    }
    confirmMsg("warning", "¿Seguro que desea cerrar el caso?", function(resp) {
        if(resp) {
            let dataSend = [];            
            dataSend.push({
                'id': caso.internalId,
                "status": "5"
            });
            
            loadMsg();
            let settings = {
                url      : urlPutCases,
                method   : 'PUT',
                data: JSON.stringify({casosUpdate : dataSend})
            }

            setAjax(settings).then((response) => {
                if(response.success) {
                    let notas = [];
                    notas.push({ 
                        type: "nota", 
                        idRelacionado: caso.internalId, 
                        titulo: "Cerrar caso", 
                        nota: $("#cerrarCasoObservaciones").val().trim(),
                        transaccion: "caso"
                    });
                    if(notas.length > 0) {
                        let settings2 = {
                            url      : urlPostNoteandMessage,
                            method   : 'POST',
                            data: JSON.stringify({ informacion: notas })
                        }
                        setAjax(settings2).then((response) => { 
                            if(response.success) { 
                                $("#cerrarCasoModal").modal("hide");
                                swal.close();
                                infoMsg('success', '', "Caso cerrado de manera correcta", null, function(resp) {
                                    $(".btn-expand").trigger("click");
                                    getServicios();
                                }); 
                            }
                        }).catch((error) => {
                            //infoMsg('error', 'Error:', "Ocurrio un error al tratar de cerrar");
                            $("#cerrarCasoModal").modal("hide");
                            swal.close();
                            infoMsg('success', '', "Caso cerrado de manera correcta", null, function(resp) {
                                //$(".btn-expand").trigger("click");
                                getServicios();
                            });
                        });
                    } else {
                        $("#cerrarCasoModal").modal("hide");
                        swal.close();
                        infoMsg('success', '', "Caso cerrado de manera correcta", null, function(resp) {
                            //$(".btn-expand").trigger("click");
                            getServicios();
                        });                
                    }
                    
                } else {
                    swal.close();
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de cerrar el caso");
                }            
            }).catch((error) => {
                console.log(error);
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de cerrar el caso");
                swal.close();
            });
        }
    });
    
});

function notificarServicio($this, tipo = "pedido") {
    let item = $($this).closest("tr").data("item");
    console.log(item);
    loadMsg();
    
    let settings = {}
    if(tipo == "pedido") {        
        settings = {
            url      : urlGetItemsOpp,
            method   : 'POST',
            data     : JSON.stringify({opp : item.no_pedido}),
        }
    } else {
        settings = {
            url      : urlGetMessageandNotes,
            method   : 'POST',
            data     : JSON.stringify({case : item.internalId}),
        }
    }
    setAjax(settings).then((response) => {
        if(response.success) {
            if(tipo == "pedido") {
                item.articulos = response.data;
            } else {
                item.messageData = response.messageData && response.messageData.length > 0 && response.messageData[0].message && response.messageData[0].message.trim() ? response.messageData[0].message : '';
            }
        } else {
            if(tipo == "pedido") {
                item.articulos = [];
            } else {
                item.messageData = '';
            }
        }
        $("#notificarPedido").html(tipo == 'pedido' ? (item.documentNumber ? 'servicio - '+item.documentNumber : '') : (item.numero_caso ? 'caso - '+item.numero_caso : ''));
        let auxNoti = getDefaultNotification(tipo, item);
        $("#notificarNotificacion").val(auxNoti.notificacion);
        $("#notificarSms").val(auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," "));
        $("#sendSmsNotificar").prop("checked", true).trigger("change");
        $("#notificarModal").data("item", item);
        $("#notificarModal").modal("show");
        swal.close();
    }).catch((error) => {
        console.log(error);
        swal.close();
    });
}

function getDefaultNotification(tipo, item) {
    let auxNoti = {
        notificacion: "",
        sms: ""
    };
    if(tipo == 'pedido') {
        //Llena msj de sms
        auxNoti.sms += formatTime(timeFormatFromDate(new Date(), "2")) + ","+ item.id_cliente+","+item.label+",";
        auxNoti.sms += item.street.trim()+",";
        auxNoti.sms += item.nExterior.trim()+",";
        auxNoti.sms += (item.nInterior && item.nInterior.trim()) ? item.nInterior.trim()+"," : '';
        auxNoti.sms += item.colonia+",";
        auxNoti.sms += item.nombre_cliente+",";
        auxNoti.sms += (item.contrato && item.contrato.trim()) ? 'CONT'+item.contrato+"," : '';
        item.articulos.forEach(element => {
            if(auxNoti.sms != "") {
                auxNoti.sms += ","
            }
            auxNoti.sms += element.quantity + "," + element.item;
        });
        if(item.objPagos) {
            let auxPagos = JSON.parse(item.objPagos);
            if(auxPagos.pago) {
                if(auxNoti.sms != "") {
                    auxNoti.sms += ","
                }
                auxPagos.pago.forEach(element => {
                    auxNoti.sms += getMetodoPagoFormat(element);
                });
            }
        }
        auxNoti.sms += (item.saldoDisponible && item.saldoDisponible.trim() && parseFloat(item.saldoDisponible.trim()) > 0) ? ',$'+item.saldoDisponible.trim() : '';
        auxNoti.sms += (item.observaciones && item.observaciones.trim()) ? ","+item.observaciones.trim() : '';

        //Llena msj de notificación
        auxNoti.notificacion +=  "Cliente: " + item.id_cliente + " - " + item.nombre_cliente.trim() + "\n"+
                    (item.contrato && item.contrato.trim() ? "Contrato: " + item.contrato.trim() +"\n" : "") +
                    "Dirección: " + getDireccionFormat(item, "pedido")+"\n";
                    
        if(item.articulos.length > 0) {
            auxNoti.notificacion += "Artículos:";
            item.articulos.forEach(element => {
                auxNoti.notificacion += "\n\t- "+ element.quantity + " | " + element.item;
            });
        }
                    
        
        if(item.objPagos) {
            let auxPagos = JSON.parse(item.objPagos);
            if(auxPagos.pago && auxPagos.pago.length > 0) {
                auxNoti.notificacion += "\nTipos de pago:";
                auxPagos.pago.forEach(element => {
                    auxNoti.notificacion += "\n\t- "+getMetodoPagoFormat(element);
                });
            }
        }
        auxNoti.notificacion += (item.saldoDisponible && item.saldoDisponible.trim() && parseFloat(item.saldoDisponible) > 0) ? '\nLímite de crédito: $' + item.saldoDisponible.trim() : '';     
        auxNoti.notificacion += (item.observaciones && item.observaciones.trim() ? '\nObservaciones: ' +item.observaciones.trim() : '');
    } else {
        //Llena msj de sms
        auxNoti.sms += formatTime(timeFormatFromDate(new Date(), "2")) + ","+ item.id_cliente+","+item.label+",";
        auxNoti.sms += item.calleDireccion.trim()+",";
        auxNoti.sms += item.nExterior.trim()+",";
        auxNoti.sms += (item.nInterior && item.nInterior.trim()) ? item.nInterior.trim()+"," : '';
        auxNoti.sms += item.colonia+",";
        auxNoti.sms += item.nombre+",";
        auxNoti.sms += (item.contrato && item.contrato.trim()) ? 'CONT'+item.contrato+"," : '';
        auxNoti.sms += item.tipo_servicio == "1" ? "Fuga" : "Queja";
        auxNoti.sms += (item.messageData && item.messageData) ? ","+item.messageData.trim() : '';
    
        //Llena msj de notificación
        auxNoti.notificacion +=  "Cliente: " + item.id_cliente + " - " + item.nombre.trim() + "\n"+
                    (item.contrato && item.contrato.trim() ? "Contrato: " + item.contrato.trim() +"\n" : "") +
                    "Dirección: " + getDireccionFormat(item, "caso")+"\n";
             
        auxNoti.notificacion += (item.messageData && item.messageData.trim() ? 'Observaciones: ' +item.messageData.trim() : '');
    }
    return auxNoti;
}

function seguimientoServicio($this, tipo = "pedido") {
    let item = $($this).closest("tr").data("item");
    loadMsg();
    let settings = {};
    if(tipo == "pedido") {
        settings = {
            url      : urlGetNotesOfOPP,
            method   : 'POST',
            data     : JSON.stringify({opp : item.no_pedido}),
        }
    } else {
        settings = {
            url      : urlGetMessageandNotes,
            method   : 'POST',
            data     : JSON.stringify({case : item.internalId}),
        }
    }
    $("#seguimientoServicio").html(tipo == 'pedido' ? (item.documentNumber ? 'servicio - '+item.documentNumber : '') : (item.numero_caso ? 'caso - '+item.numero_caso : ''));
    
    $("#nuevaNotaSeguimiento").val("");
    $("#sendSmsSeguimiento").prop("checked", true);
    $("#table-notas-seguimiento tbody").children("tr").remove();
    $("#table-notas-seguimiento tbody").append('<tr>' +
                                                    '<td colspan="3" class="text-center">' +
                                                        'Sin comentarios'+
                                                    '</td>' +
                                                '</tr>');
    setAjax(settings).then((response) => {
        if(response.success) {
            let dataAux = (tipo == "pedido" ? response.data : response.noteData);
            if(dataAux.length > 0) {
                $("#table-notas-seguimiento tbody").children("tr").remove();
            }
            dataAux.forEach(element => {
                if(element.note && element.note.trim()) {
                    let trAux = '<tr>' +
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.author+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.date+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.note+'</td>'+
                                '</tr>';
                    $("#table-notas-seguimiento tbody").append(trAux);
                }
                
            });
            $("#seguimientoModal").data("item", item);
            $("#seguimientoModal").modal("show");
        }
        swal.close();
    }).catch((error) => {
        console.log(error);
        swal.close();
    });
    
}

function asignarViaje($this) {
    let pedido = $($this).closest("tr").data("item");
    console.log(pedido);
    loadMsg();
    let settings = {
        url      : urlGetItemsOpp,
        method   : 'POST',
        data     : JSON.stringify({opp : pedido.no_pedido}),
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            pedido.articulos = response.data;
        } else {
            pedido.articulos = [];
        }
        $("#asignarViajePedido").html(pedido.documentNumber ? pedido.documentNumber : '');
        $('#asignarViajeRuta').children('option').remove();
        vrViajes.forEach(element => {
            $("#asignarViajeRuta").append(
                '<option data-item=' + "'" + JSON.stringify(element) + "'" + ' value="'+element.nViajeId+'">'+getRutaFormat(element, "viajes")+'</option>'
            );
        });
        if(pedido.id_no_viaje && pedido.id_no_viaje.trim()) {
            if($("#asignarViajeRuta option[value="+pedido.id_no_viaje+"]").length == 0) {
                $("#asignarViajeRuta").append(
                    '<option data-item=' + "'" + JSON.stringify({choferId : pedido.choferId, choferPhone: pedido.phoneChofer}) + "'" + ' value="'+pedido.id_no_viaje+'">'+getRutaFormat(pedido, "pedido")+'</option>'
                );       
            }
        }
        $('#asignarViajeRuta').select2({
            selectOnClose: true,
            placeholder: "Seleccione un viaje",
            dropdownParent: $('#asignarViajeModal'),
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
        $('#asignarViajeRuta').val(pedido.id_no_viaje).trigger("change");

        $("#asignarViajeModal").data("item", pedido);
        $("#asignarViajeModal").modal("show");
        swal.close();
    }).catch((error) => {
        console.log(error);
        swal.close();
    });;
}

function cancelarPedido($this) {
    let pedido = $($this).closest("tr").data("item");
    $("#cancelarOppPedido").html(pedido.documentNumber ? " - " + pedido.documentNumber : '');
    $('#cancelarOppMotivo').val(null);
    $('#cancelarOppMotivo').select2({
        selectOnClose: true,
        placeholder: "Seleccione un motivo",
        dropdownParent: $('#cancelarOppModal'),
        language: {
            "noResults": function(){
                return "Sin resultados encontrados";
            }
        }
    });
    $('#cancelarOppObservaciones').val(null);
    $("#cancelarOppModal").data("item", pedido);
    $("#cancelarOppModal").modal("show");
}

function cerrarCaso($this) {
    let caso = $($this).closest("tr").data("item");
    $("#cerrarCasoPedido").html((caso.tipo_servicio == "2" ? 'queja' : 'fuga') + (caso.numero_caso ? " - " + caso.numero_caso : ''));
    $('#cerrarCasoObservaciones').val(null);
    $("#cerrarCasoModal").data("item", caso);
    $("#cerrarCasoModal").modal("show");
}

$("#guardarCancelarOpp").click(function() {
    let pedido = $("#cancelarOppModal").data("item");
    if($("#cancelarOppObservaciones").val().trim() && $("#cancelarOppMotivo").val()) {
        confirmMsg("warning", "¿Seguro que desea enviar la notificación?", function(resp) {
            if(resp) {
                let dataSend = {
                    "opportunitiesUpdate": [
                        {
                            "id": pedido.no_pedido,
                            "bodyFields": {
                                "custbody_ptg_estado_pedido": idCancelado,
                                "custbody_ptg_motivo_cancelation" : $("#cancelarOppMotivo").val()
                            },
                            "lines": [
                                
                            ]
                        }
                    ]
                };
                loadMsg();
                let settings = {
                    url      : urPutOppMonitor,
                    method   : 'PUT',
                    data: JSON.stringify(dataSend)
                }
                setAjax(settings).then((response) => {
                    if(response.success) {
                        let nota = [{ 
                            type: "nota", 
                            idRelacionado: pedido.no_pedido, 
                            titulo: "Cancelación de servicio", 
                            nota: $("#cancelarOppObservaciones").val().trim(),
                            transaccion: "oportunidad"
                        }];
                        let settings2 = {
                            url      : urlPostNoteandMessage,
                            method   : 'POST',
                            data: JSON.stringify({ informacion: nota })
                        }
                        setAjax(settings2).then((response) => {
                            if(response.success) {
                                if(pedido.choferId) {
                                    let dataSend2 = {
                                        notification: {
                                            title: 'Cancelación de servicio - '+pedido.documentNumber,
                                            message: $("#cancelarOppObservaciones").val().trim(),
                                            ids: [pedido.choferId]
                                        }, sms : {
                                            title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                            message: $("#cancelarOppObservaciones").val().trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                        }
                                    };
                                    sendNotification(dataSend2, function(resp) {
                                        $("#cancelarOppModal").modal("hide");
                                        swal.close();
                                        infoMsg('success', '', "Servicio cancelado de manera correcta", null, function(resp) {
                                            getServicios();
                                        });
                                    });
                                } else {
                                    $("#cancelarOppModal").modal("hide");
                                    swal.close();
                                    infoMsg('success', '', "Servicio cancelado de manera correcta", null, function(resp) {
                                        getServicios();
                                    });
                                }
                            }
                        }).catch((error) => {
                            console.log(error);
                            swal.close();
                        });
                    } else {
                        swal.close();
                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de cancelar el servicio");
                    }            
                }).catch((error) => {
                    console.log(error);
                    swal.close();
                });
            }
        });
        
    } else {
        let aux = "<ul>";
        if(!$("#cancelarOppMotivo").val()) {
            aux += "<li>Motivo de Cancelacion</li>";
        }
        if(!$("#cancelarOppObservaciones").val().trim()) {
            aux += "<li>Observaciones</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
    }
});

$("#enviarNotificacion").click(function() {
    let item = $("#notificarModal").data("item");
    if($("#notificarNotificacion").val() && $("#notificarNotificacion").val().trim()) {
        confirmMsg("warning", "¿Seguro que desea enviar la notificación?", function(resp) {
            if(resp) {
                let dataSend = {
                    notification: {
                        title: 'Notificación de '+(item.numero_caso ? 'caso' : 'pedido'),
                        message: $("#notificarNotificacion").val().trim(),
                        ids: [item.numero_caso ? item.asignado_a : item.choferId]
                    }
                };
                if($("#sendSmsNotificar").prop("checked")) {
                    dataSend.sms = {
                        title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                        message: $("#notificarSms").val().trim()+"\n"+(item.numero_caso ? item.numberAsiggned : item.phoneChofer)
                    }
                }

                sendNotification(dataSend, function(resp) {
                    swal.close();
                    if(resp.success) {
                        if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                        } else {
                            $("#notificarModal").modal("hide");
                            infoMsg('success', '', "Notificación enviada de manera correcta");
                        }
                    } else {
                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                    }
                });
            }
        });
    } else {
        let aux = "<ul>";
        if(!$("#notificarNotificacion").val() || !$("#notificarNotificacion").val().trim()) {
            aux += "<li>Notificación</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
    }
});

$("#guardarSeguimiento").click(function() {
    let item = $("#seguimientoModal").data("item");
    if($("#nuevaNotaSeguimiento").val() && $("#nuevaNotaSeguimiento").val().trim()) {
        confirmMsg("warning", "¿Seguro que desea enviar la notificación?", function(resp) {
            if(resp) {
                loadMsg();
                let nota = [{ 
                    type: "nota", 
                    idRelacionado: item.numero_caso ? item.internalId : item.no_pedido, 
                    titulo: "Seguimiento (Monitor)", 
                    nota: $("#nuevaNotaSeguimiento").val().trim(),
                    transaccion: item.numero_caso ? 'caso' : "oportunidad"
                }];
                let settings2 = {
                    url      : urlPostNoteandMessage,
                    method   : 'POST',
                    data: JSON.stringify({ informacion: nota })
                }
                setAjax(settings2).then((response) => {
                    if(response.success) {
                        if((item.numero_caso && item.asignado_a) || (!item.numero_caso && item.choferId)) {
                            let dataSend = {
                                notification: {
                                    title: 'Nueva nota '+(item.numero_caso ? 'caso - '+item.numero_caso : 'pedido - '+item.documentNumber),
                                    message: $("#nuevaNotaSeguimiento").val().trim(),
                                    ids: [item.numero_caso ? item.asignado_a : item.choferId]
                                }
                            };
                            if($("#sendSmsSeguimiento").prop("checked")) {
                                dataSend.sms = {
                                    title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                                    message: $("#nuevaNotaSeguimiento").val().trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+(item.numero_caso ? item.numberAsiggned : item.phoneChofer)
                                }
                            }

                            sendNotification(dataSend, function(resp) {
                                swal.close();
                                if(resp.success) {
                                    if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                                    } else {
                                        $("#seguimientoModal").modal("hide");
                                        infoMsg('success', '', "Nota enviada de manera correcta");
                                    }
                                } else {
                                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                                }
                            });
                        } else {
                            $("#seguimientoModal").modal("hide");
                            swal.close();
                            infoMsg('success', '', "Nota enviada de manera correcta");
                        }
                    }
                }).catch((error) => {
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la nota");
                    swal.close();
                });
            }
        });
    } else {
        let aux = "<ul>";
        if(!$("#nuevaNotaSeguimiento").val() || !$("#nuevaNotaSeguimiento").val().trim()) {
            aux += "<li>Nueva nota</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
    }
});

function sendNotification(dataSend, callback) {
    if(!swal.getState().isOpen) {
        loadMsg();
    }
    let settings = {
        url      : urlSendNotification,
        method   : 'POST',
        data: JSON.stringify(dataSend)
    }
    setAjax(settings).then((response) => {
        callback(response);
    }).catch((error) => {
        callback(false);
    });
}

$("#guardarAsignarViaje").click(function() {
    let pedido = $("#asignarViajeModal").data("item");
    if($("#asignarViajeRuta").val() && $("#asignarViajeRuta").val().trim()) {
        confirmMsg("warning", "¿Seguro que desea asignar un viaje al servicio?", function(resp) {
            if(resp) {
                let dataSend = {
                    "opportunitiesUpdate": [
                        {
                            "id": pedido.no_pedido,
                            "bodyFields": {
                                "custbody_ptg_numero_viaje": $("#asignarViajeRuta").val()
                            },
                            "lines": [
                                
                            ]
                        }
                    ]
                };
        
                if(pedido.status_id == idPorNotificar || pedido.status_id == idPorReprogramar) {
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_monitor = userId;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_estado_pedido = idAsignado;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_fecha_notificacion = dateFormatFromDate(new Date(), "5");
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_hora_notificacion = formatTime(timeFormatFromDate(new Date(), "2"));
                }
        
                loadMsg();
                let settings = {
                    url      : urPutOppMonitor,
                    method   : 'PUT',
                    data: JSON.stringify(dataSend)
                }
                setAjax(settings).then((response) => {
                    if(response.success) {
                        pedido.choferId = $("#asignarViajeRuta option:selected").data("item").choferId;
                        pedido.phoneChofer = $("#asignarViajeRuta option:selected").data("item").choferPhone;
                        let auxNoti = getDefaultNotification('pedido', pedido);
                        let dataSendN = {
                            notification: {
                                title: 'Notificación de pedido',
                                message: auxNoti.notificacion,
                                ids: [pedido.choferId]
                            }, sms : {
                                title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                            }
                        };
                        sendNotification(dataSendN, function(resp) {
                            $("#asignarViajeModal").modal("hide");
                            swal.close();
                            infoMsg('success', '', "Viaje asinado de manera correcta", null, function(resp) {
                                getServicios();
                            });
                        });
                    } else {
                        swal.close();
                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de asinar el viaje al servicio");
                    }            
                }).catch((error) => {
                    console.log(error);
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de asinar el viaje al servicio");
                    swal.close();
                });
            }
        });
    } else {
        let aux = "<ul>";
        if(!$("#asignarViajeRuta").val() || !$("#asignarViajeRuta").val().trim()) {
            aux += "<li>Viaje</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
    }
});

function verDetalles($this) {
    let pedido = $($this).closest("tr").data("item");
    console.log(pedido);
    $("#verDetallesCliente").html(pedido.id_cliente + " - " + pedido.nombre_cliente);
    $("#verDetallesTelefono").html(pedido.telefono.trim());
    $("#verDetallesDireccion").html(getDireccionFormat(pedido, "pedido"));
    $("#verDetallesTipoServicio").html(pedido.tipo_cliente.trim());

    $("#verDetallesServicio").html(pedido.documentNumber);
    $("#verDetallesVehiculo").html(pedido.nombre_vehiculo.trim() ? pedido.nombre_vehiculo.trim() : 'Sin asignar');
    $("#verDetallesZona").html(pedido.zona);
    $("#verDetallesUsuarioMonitor").html(pedido.usuario_monitor.trim() ? pedido.usuario_monitor.trim() : 'Sin asignar');
    $("#verDetallesDireccion2").html(getDireccionFormat(pedido, "pedido"));
    $("#verDetallesFechaPrometida").html(dateFormatFromDate(pedido.fecha_prometida, '5'));
    $("#verDetallesFechaPedido").html(dateFormatFromDate(pedido.fecha_solicitud, '5'));
    $("#verDetallesFechaNotificacion").html(pedido.fecha_notificacion ? dateFormatFromDate(pedido.fecha_notificacion, '5') + " - " + pedido.hora_notificacion : 'Sin asignar');
    $("#verDetallesTipoProducto").html("");
    vrTiposServicios.forEach(element => {
        if(pedido.servicio == element.id) {
            $("#verDetallesTipoProducto").html(element.nombre);
        }
    });
    if($("#verDetallesTipoProducto").html().trim() == "") {
        $("#verDetallesTipoProducto").html("Desconocido");
    }
    $("#verDetallesContrato").html(pedido.contrato ? pedido.contrato : 'Sin contrato');
    $("#verDetallesAgenteAtiende").html(pedido.usuario_pedido_solicitud);
    $("#verDetallesTiempoNotificacion").html(pedido.fecha_hora_notificacion ? getRestTime(dateFormatFromString(pedido.fecha_notificacion+(pedido.hora_notificacion ? " "+pedido.hora_notificacion : ''), "1")) : 'Sin asignar');
    $("#verDetallesObservaciones").html(pedido.observaciones ? pedido.observaciones : 'Sin observaciones');
    $("#formVerDetallesPedidos").modal("show");
}

function verDetallesCaso($this) {
    let caso = $($this).closest("tr").data("item");
    console.log(caso);
    $("#verDetallesClienteCaso").html(caso.id_cliente + " - " + caso.nombre);
    $("#verDetallesTelefonoCaso").html(caso.telefono.trim());
    $("#verDetallesDireccionCaso").html(getDireccionFormat(caso, "caso"));
    $("#verDetallesTipoServicioCaso").html((caso.tipo_servicio == "2" ? 'Queja' : 'Fuga').trim());

    $("#verDetallesNoCaso").html(caso.numero_caso);
    $("#verDetallesFechaReporte").html(caso.fecha_solicitud);
    $("#verDetallesRepuseCilindroDanado").html(caso.repuseCilindro ? 'Si' : 'No');
    $("#verDetallesRealiceTrasiego").html(caso.isTrasiego ? 'Si' : 'No');
    $("#verDetallesCantidadRecolectada").html(caso.quantityTrasiego ? caso.quantityTrasiego : '0');
    $("#verDetallesPruebaHermetica").html(caso.testHermatica ? caso.testHermatica : 'Sin aplicar');
    $("#verDetallesProblemaLocalizado").html(caso.problemAt ? caso.problemAt : 'Sin aplicar');
    $("#verDetallesSolucion").html(caso.solutionName ? caso.solutionName : 'Sin aplicar');

    $("#formVerDetallesCaso").modal("show");
}

function orderOrders(data) {
    let segundaLlamada = [],
        sinNotificar = [],
        auxPedidos = [],
        sinNotificarI = [],
        sinNotificarC = [],
        sinNotificarD = [],
        sinNotificarA = [],
        notificados = [],
        cancelados = [],
        entregados = [],
        faltantes = [];
    data.forEach(element => {
      
      if(element.segunda_llamada && (element.status_id == idPorNotificar || element.status_id == idAsignado)) {
        if(element.status_id == idPorNotificar) {
          element.status_color = '#000';
          element.tooltip = 'Por notificar';
        }
        segundaLlamada.push(element);
      } else if(element.status_id == idPorNotificar) {
        element.status_color = '#000';
        element.tooltip = 'Por notificar';
        sinNotificar.push(element);
      } else if(element.status_id == idAsignado) {
        notificados.push(element);
      } else if(element.status_id == idCancelado) {
        cancelados.push(element);
      } else if(element.status_id == idEntregado) {
        entregados.push(element);
      } else if(element.status_id == idPorReprogramar) {
        faltantes.push(element);
      }
    });

    let auxSegundaLlamada = {};
    segundaLlamada.forEach(element => {
        if(!auxSegundaLlamada[element.fecha_prometida]) {
            auxSegundaLlamada[element.fecha_prometida] = [];
        }
        auxSegundaLlamada[element.fecha_prometida].push(element);
    });
    segundaLlamada = [];
    Object.keys(auxSegundaLlamada).forEach(element => {
        auxSegundaLlamada[element].sort(dynamicSort("fecha_hora_notificacion"));
        auxSegundaLlamada[element].forEach(element2 => {
            segundaLlamada.push(element2);
        });
    });
    
    let auxSinNotificar = {};
    sinNotificar.forEach(element => {
        if(!auxSinNotificar[element.fecha_prometida]) {
            auxSinNotificar[element.fecha_prometida] = [];
        }
        auxSinNotificar[element.fecha_prometida].push(element);
    });
    sinNotificar = [];
    Object.keys(auxSinNotificar).forEach(element => {
        auxSinNotificar[element].sort(dynamicSort("fecha_hora_solicitud"));
        auxSinNotificar[element].forEach(element2 => {
            sinNotificar.push(element2);
        });
    });

    let auxNotificados = {};
    notificados.forEach(element => {
        if(!auxNotificados[element.fecha_prometida]) {
            auxNotificados[element.fecha_prometida] = [];
        }
        auxNotificados[element.fecha_prometida].push(element);
    });
    notificados = [];
    Object.keys(auxNotificados).forEach(element => {
        auxNotificados[element].sort(dynamicSort("fecha_hora_solicitud"));
        auxNotificados[element].forEach(element2 => {
            notificados.push(element2);
        });
    });

    notificados.forEach(element => {
      if(element.fecha_hora_notificacion && element.fecha_hora_notificacion <= new Date()) {
        if(getRestTime(element.fecha_hora_notificacion, "2") >= 2) {
          element.status_color = "#f68f1e";
          element.tooltip = 'Más de dos horas notificado';
        } else {
          element.status_color = "#9a9a9a";
          element.tooltip = 'Menos de dos horas notificado';
        }
      }
    });

    /* Segunda llamada: En orden de notificación del más antiguo al más reciente */
    segundaLlamada.forEach(element => {
      auxPedidos.push(element);
    });

    /* Sin notificar (Color blanco): del más antiguo al más reciente y por tipo de cliente:
    1. Industrial
    2. Comercial
    3. Domestico*/
    sinNotificar.forEach(element => {
      auxPedidos.push(element);
    });

    /* Notificados */
    notificados.forEach(element => {
      auxPedidos.push(element);
    });

    /* Cancelados */
    cancelados.forEach(element => {
      auxPedidos.push(element);
    });

    /* Prestados (entregados) */
    entregados.forEach(element => {
      auxPedidos.push(element);
    });

    /* otros */
    faltantes.forEach(element => {
      auxPedidos.push(element);
    });

    return auxPedidos;
}

function readyInit() {
    let totalServices = 8;
    countServices += 1;
    if(countServices == totalServices) {
        getServicios();
    }
}

// Pobla los selects dinámicos de los formularios
loadMsg();
getPlantas();
getStatusOportunidad();
getTiposServicios();
getListCancellReason();
getConceptosCasos();
getListSuppEmp();
getMethodPayments();