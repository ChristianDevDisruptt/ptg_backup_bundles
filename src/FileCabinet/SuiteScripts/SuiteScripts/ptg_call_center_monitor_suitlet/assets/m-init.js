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
        $('#asignarTecnicoFugaQueja, #responsableQueja, #filterTecnico').children('option').remove();
        $('#asignarTecnicoFugaQueja, #responsableQueja').append('<option value="0">Seleccione una opción</option>');
        $('#filterTecnico').append('<option value="0">Todos</option>');
        items.forEach(element => {
            $("#asignarTecnicoFugaQueja, #responsableQueja, #filterTecnico").append(
                '<option data-item=' + "'" + JSON.stringify(element) + "'" + 'value='+element.id+'>'+element.name+'</option>'
            );
        });
        $('#asignarTecnicoFugaQueja, #responsableQueja, #filterTecnico').select2({
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
        readyInit();
    } else {
        console.warn('No hay plantas por cargar');
        readyInit();
    }
}

// Función para obtener los artículos
function getArticulos() {
    let settings = {
        url      : urlObtenerArticulos,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectArticulos((response.data));
    }).catch((error) => {
        readyInit();
        console.log(error);
    });
}

function setSelectArticulos(items) {
    if ( items.length ) {
        $('#articuloFugaQueja').children('option').remove();
        $('#articuloFugaQueja').append('<option value="">Seleccione una opción</option>')
        // $('select#articuloFrecuenteEstFormCliente').children('option').remove();
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                let articulo = '<option data-pedido-minimo="'+parseFloat(items[key].min)+'" value='+items[key].id+' data-articulo=' + "'" + JSON.stringify(items[key]) + "'" + '>'+(items[key].tipo_articulo == idEstacionarioTipo ? 'GAS LP' : items[key].nombre)+'</option>';

                if ( [idCilindroTipo,idEstacionarioTipo].includes(Number(items[key].tipo_articulo)) ) {
                    $("select#articuloFugaQueja").append( articulo );
                }
            }
        }
        readyInit();
    } else {
        readyInit();
        console.warn('No hay artículos por cargar');
    }
}

function getCorrectFormat(number) {
    return Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(number);
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
        $('#filterEstadoSolicitud').append(
            '<option value="0">Todos</option>'
        )
        
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
            if ( element.id != "6") {
                $("#filterEstadoSolicitud").append(
                    '<option value="'+element.id+'">'+element.nombre+'</option>'
                );
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
    $("#filterRuta").append(
        '<option value="0">Todas</option>'
    );
    if ( rutasCilindros.length || rutasEstacionarios.length) {        
        if($("#filterTipoProducto").val() == "0" || $("#filterTipoProducto").val() == "1") {
            rutasCilindros.forEach(element => {
                $("#filterRuta").append(
                    '<option data-item='+"'"+JSON.stringify(element)+"'"+' value="'+element.internalId+'">'+getRutaFormat(element, "ruta")+'</option>'
                );
            });
        }
        if($("#filterTipoProducto").val() == "0" || $("#filterTipoProducto").val() == "2") {
            rutasEstacionarios.forEach(element => {
                $("#filterRuta").append(
                    '<option data-item='+"'"+JSON.stringify(element)+"'"+' value="'+element.internalId+'">'+getRutaFormat(element, "ruta")+'</option>'
                );
            });
        }
        if($("#filterTipoProducto").val() == "3") {
            $('#filterRuta').parent().parent().addClass("d-none");
        }
        $('#filterRuta').select2({
            selectOnClose: true,
            placeholder: "Seleccione una opción",
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
                    '<option value="'+(items[key].id == 3 ? 6 : items[key].id)+'">'+items[key].nombre+'</option>'
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

    if($("#filterTipoServicio").val() == "pedidos") {
        if($("#filterFechaSolicitudIni").val()) {
            filt.fechaSolicitud1 = dateFormatFromDate($("#filterFechaSolicitudIni").val(), "5");
        }
      
        if($("#filterFechaSolicitudFin").val()) {
            filt.fechaSolicitud2 = dateFormatFromDate($("#filterFechaSolicitudFin").val(), "5");
        }

        if($("#filterFechaPrometidaIni").val()) {
            filt.fechaPrometida1 = dateFormatFromDate($("#filterFechaPrometidaIni").val(), "5");
        }
      
        if($("#filterFechaPrometidaFin").val()) {
            filt.fechaPrometida2 = dateFormatFromDate($("#filterFechaPrometidaFin").val(), "5");
        }

        if($("#filterEstadoSolicitud").val() != "0") {
            filt.status_oportunidad = $("#filterEstadoSolicitud").val();
        }

        if($("#filterTipoProducto").val() != "3" && $("#filterRuta").val() != "0" && $("#filterRuta").val()) {
            filt.route_string = $("#filterRuta option:selected").data("item").name.split(" : ")[1] ? $("#filterRuta option:selected").data("item").name.split(" : ")[1].trim() : $("#filterRuta option:selected").data("item").name.trim();
        }

        if($("#filterTipoProducto").val() != "0") {
            filt.tipo_producto = parseInt($("#filterTipoProducto").val());
        }

        if($("#plantas").val()) {
            filt.planta = $("#plantas").val();
        }

        if($("#filterSegundaLlamada").prop('checked')) {
            filt.segunda_llamada = "T";
        }

        if($("#filterProgramado").prop('checked')) {
            filt.programado = true;
        }

        if($("#filterBuscarCliente").val().trim()) {
            if($("#filterDatosCliente").val() == "name") {
                filt.name = $("#filterBuscarCliente").val().trim();
            } else if($("#filterDatosCliente").val() == "phone") {
                filt.phone = $("#filterBuscarCliente").val().trim();
            } else if($("#filterDatosCliente").val() == "email") {
                filt.email = $("#filterBuscarCliente").val().trim();
            }  
        } 
        if ($("#filterBuscarCalle").val().trim() || $("#filterBuscarInt").val().trim() || $("#filterBuscarExt").val().trim()) {
            if($("#filterDatosCliente").val() == "address") {
                if($("#filterBuscarCalle").val().trim()) {
                    filt.calle = $("#filterBuscarCalle").val().trim();
                } 
                if($("#filterBuscarInt").val().trim()) {
                    filt.nInt = $("#filterBuscarInt").val().trim();
                } 
                if($("#filterBuscarExt").val().trim()) {
                    filt.nExt = $("#filterBuscarExt").val().trim();
                }
            } 
        }
    } else {
        if($("#filterFechaSolicitudIni").val()) {
            filt.fechaSolicitud1 = dateFormatFromDate($("#filterFechaSolicitudIni").val(), "5");
        }
    
        if($("#filterFechaSolicitudFin").val()) {
            filt.fechaSolicitud2 = dateFormatFromDate($("#filterFechaSolicitudFin").val(), "5");
        }

        if($("#filterTipoServicio").val() == "queja") {
            filt.tipo_servicio = "2";
        } else {
            filt.tipo_servicio = "1";
        }

        if($("#filterEstadoCaso").val() != "0") {
            filt.estado = $("#filterEstadoCaso").val();
        }

        if($("#filterPrioridad").val() != "0") {
            filt.prioridad = $("#filterPrioridad").val();
        }

        if($("#filterTecnico").val() != "0") {
            filt.tecnico = $("#filterTecnico").val();
        }

        if($("#filterBuscarCliente").val().trim()) {
            if($("#filterDatosCliente").val() == "name") {
                filt.nombre_cliente = $("#filterBuscarCliente").val().trim();
            } else if($("#filterDatosCliente").val() == "phone") {
                filt.telefono = $("#filterBuscarCliente").val().trim();
            } else if($("#filterDatosCliente").val() == "email") {
                filt.email_cliente = $("#filterBuscarCliente").val().trim();
            }  
        } 
        if ($("#filterBuscarCalle").val().trim() || $("#filterBuscarInt").val().trim() || $("#filterBuscarExt").val().trim()) {
            if($("#filterDatosCliente").val() == "address") {
                if($("#filterBuscarCalle").val().trim()) {
                    filt.calle = $("#filterBuscarCalle").val().trim();
                } 
                if($("#filterBuscarInt").val().trim()) {
                    filt.nInt = $("#filterBuscarInt").val().trim();
                } 
                if($("#filterBuscarExt").val().trim()) {
                    filt.nExt = $("#filterBuscarExt").val().trim();
                }
            } 
        }
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
    if($event) {
        if($($event).attr("id") == "filterDatosCliente") {
            if($("#filterDatosCliente").val() != "address" && $("#filterBuscarCliente").val().trim() == "") {
                return;
            } else if($("#filterDatosCliente").val() == "address" && $("#filterBuscarCalle").val().trim() == "" && $("#filterBuscarInt").val().trim() == "" && $("#filterBuscarExt").val().trim() == "") {
                return;
            }
        }        
    }
    if($("#filterTipoServicio").val() == "pedidos") {
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
                response.data = removeDuplicates(response.data, 'no_pedido');
                if(response.data.length == 0) {
                    $("#tablePedidos tbody").append('<tr><td colspan="20" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
                    initTable("tablePedidos");
                }
                response.data.forEach((pedido, position) => {
                    
                    if(pedido.fecha_prometida) {
                        pedido.fecha_hora_prometida = dateFormatFromString(pedido.fecha_prometida, "2");
                        pedido.fecha_prometida = dateFormatFromDate(new Date(pedido.fecha_prometida.split("/")[2], parseInt(pedido.fecha_prometida.split("/")[1]) - 1, pedido.fecha_prometida.split("/")[0]), "2");
                    }
            
                    if(pedido.fecha_solicitud) {
                        pedido.fecha_hora_solicitud = dateFormatFromString(pedido.fecha_solicitud + (pedido.horaTrans && pedido.horaTrans.trim() ? ' ' + pedido.horaTrans : ''), "2");
                        pedido.fecha_solicitud = dateFormatFromDate(new Date(pedido.fecha_solicitud.split("/")[2], parseInt(pedido.fecha_solicitud.split("/")[1]) - 1, pedido.fecha_solicitud.split("/")[0]), "2");
                    }
                                
                    if(pedido.fecha_notificacion) {
                        pedido.fecha_hora_notificacion = dateFormatFromString(pedido.fecha_notificacion+(pedido.hora_notificacion ? " "+pedido.hora_notificacion : ''), "3");
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
                response.data.sort(dynamicSort("fecha_hora_prometida"));
                console.log(response.data);
                response.data = orderOrders(response.data);
                console.log(response.data);
                $("#tablePedidos thead tr th").css('z-index', "3");
                $($("#tablePedidos thead tr th")[0]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[1]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[2]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[3]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[4]).css('z-index', "4");
                $($("#tablePedidos thead tr th")[5]).css('z-index', "4");
                response.data.forEach((pedido, position) => {
                    let auxDir = getDireccionFormat(pedido, "pedido"),
                        auxObs = getObservacionesFormat(pedido, "<br>"),
                        auxRuta = getRutaFormat(pedido, "pedido");
                        
                    let trAux = '<tr data-item='+"'"+JSON.stringify(pedido)+"'"+'>'+
                                    '<td class="text-center sticky-col">'+  
                                        '<div class="btn-group dropend vertical-center">'+    
                                            '<div class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">'+                                        
                                                '<i class="fa-solid fa-ellipsis-vertical c-pointer" style="font-size: 24px;"></i>'+
                                                (pedido.solicitudCancelacion || pedido.solicitudCambioFecha || pedido.countPendingNotification > 0 ? '<div class="badge-grid"></div>' : '')+
                                            '</div>'+
                                            '<ul class="dropdown-menu" style="width: 255px">'+
                                                (pedido.status_id != idCancelado && pedido.status_id != idEntregado && pedido.status_id != idPorConfirmar ? '<li onclick="gestionarServicio(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-gears color-primary"></i> Gestionar servicio</li>' : '')+
                                                '<li onclick="seguimientoServicio(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-comment-dots color-primary"></i> <span class="p-rel">Seguimiento'+(pedido.countPendingNotification > 0 ? '<div class="badge-dropdown"></div>' : '')+'</span></li>'+
                                                '<li onclick="historicoCambios(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-clock-rotate-left color-primary"></i> Historial de cambios</li>'+
                                                (pedido.status_id != idCancelado && pedido.status_id != idEntregado && pedido.status_id != idPorConfirmar && pedido.solicitudCambioFecha ? '<li onclick="cambiarFechaPedido(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-calendar color-primary"></i> <span class="p-rel">Solicitud de cambio de fecha <div class="badge-dropdown"></div></span></li>' : '')+
                                                (pedido.status_id != idCancelado && pedido.status_id != idEntregado && pedido.status_id != idPorConfirmar ? '<li onclick="cancelarPedido(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-circle-xmark text-danger"></i> <span class="p-rel">Cancelar servicio'+(pedido.solicitudCancelacion ? '<div class="badge-dropdown"></div>' : '')+'</span></li>' : '')+
                                                (pedido.status_id == idCancelado ? '<li onclick="descancelarPedido(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-circle-xmark text-danger"></i> <span class="p-rel">Descancelar servicio</span></li>' : '')+
                                                (pedido.status_id == idAsignado ? '<li onclick="marcarEntregadoPedido(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-circle-check text-success"></i> <span class="p-rel">Marcar cómo entregado servicio</span></li>' : '')+
                                            '</ul>'+
                                        '</div>'+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 40px;"class="text-center sticky-col">'+
                                        (pedido.status_color ? '<button class="btn" title="'+pedido.tooltip+'" data-bs-toggle="tooltip" data-bs-placement="right" style="cursor: default; background: '+pedido.status_color+';"></button>' : '')+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 80px;"class="text-center sticky-col">'+
                                        (pedido.segunda_llamada ? '<i class="fa-solid fa-square-check color-primary" style="font-size: 21px;" title="Segunda llamada" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '<i class="fa-regular fa-square color-primary" style="font-size: 21px;"></i>')+
                                        //'<input type="checkbox" class="form-check-input form-ptg vertical-center" ' + (pedido.segunda_llamada ? 'checked title="Segunda llamada" data-bs-toggle="tooltip" data-bs-placement="right"' : '') + ' disabled style="width: fit-content;">'+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 120px;"class="text-center sticky-col">'+
                                        '<i onclick="verDetalles(this)" class="fa-solid fa-eye color-primary c-pointer" title="Ver detalles" data-bs-toggle="tooltip" data-bs-placement="right"></i>'+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 160px;"class="text-center sticky-col">'+
                                        (pedido.status_id == idAsignado || pedido.status_id == idPorNotificar ? '<i onclick="notificarServicio(this)" class="fa-solid fa-bell '+(pedido.status_id == idAsignado ? 'text-success' : 'color-primary')+' c-pointer" title="Notificar pedido" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '')+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 200px;"class="text-center sticky-col">'+
                                        ((pedido.servicio == "1" || pedido.servicio == "2") && (pedido.status_id != idCancelado && pedido.status_id != idEntregado && pedido.status_id != idPorConfirmar) ? '<i onclick="asignarViaje(this)" class="fa-solid fa-truck color-primary c-pointer" title="Asignar ruta" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '')+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (auxRuta ? auxRuta : 'Sin asignar') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (pedido.zona ? pedido.zona : 'Sin zona') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (auxObs ? auxObs : 'Sin observaciones') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (auxDir ? auxDir : 'Sin dirección') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + dateFormatFromDate(pedido.fecha_prometida, '5') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + dateFormatFromDate(pedido.fecha_solicitud, '5') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (pedido.fecha_notificacion ? dateFormatFromDate(pedido.fecha_notificacion, '5') + " - " + pedido.hora_notificacion : 'Sin notificar') + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + pedido.servicioNombre + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (pedido.isPerson ? (pedido.firstName.split(" ")[0] + " " + pedido.lastName.split(" ")[0]) : pedido.companyName) + '</td>'+
                                    '<td class="text-center '+(pedido.conContrato || pedido.tipoContratoId == "2" ? 'text-danger': '')+'">' + (pedido.fecha_notificacion ? getRestTime(dateFormatFromString(pedido.fecha_notificacion+(pedido.hora_notificacion ? " "+pedido.hora_notificacion : ''), "1"), "3") : 'Sin notificar') + '</td>'+
                                    
                                '</tr>';
                    $("#tablePedidos tbody").append(trAux);

                    if(response.data.length == (position + 1)) {
                        initTable("tablePedidos");
                    }
                });

                $(".total-rows span").html(response.data.length);
                swal.close();
            } else {
                $("#tablePedidos tbody").append('<tr><td colspan="20" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
                swal.close();
            }
        }).catch((error) => {
            console.log(error);
            $("#tablePedidos tbody").append('<tr><td colspan="20" class="text-center fw-bold py-5">Sin pedidos encontrados</td></tr>');
            swal.close();
        });
    } else {
        let settings = {
            url      : urlGetCasos,
            method   : 'POST',
            data: JSON.stringify(getFiltPedidos())
        }
        if(!swal.getState().isOpen) {
            loadMsg();
        }
        
        $("#tableCasos tbody").children("tr").remove();
        setAjax(settings).then((response) => {    
            if(response.success) {
                if(response.data.length == 0) {
                    $("#tableCasos tbody").append('<tr><td colspan="13" class="text-center fw-bold py-5">Sin casos encontrados</td></tr>');
                    initTable("tableCasos");
                }
                $("#tableCasos thead tr th").css('z-index', "3");
                $($("#tableCasos thead tr th")[0]).css('z-index', "4");
                $($("#tableCasos thead tr th")[1]).css('z-index', "4");
                $($("#tableCasos thead tr th")[2]).css('z-index', "4");
                response.data.forEach((caso, position) => {
                    let auxDir = getDireccionFormat(caso, "caso");
                    let trAux = '<tr data-item='+"'"+JSON.stringify(caso)+"'"+'>'+
                                    '<td class="text-center sticky-col">'+  
                                        '<div class="btn-group dropend vertical-center">'+         
                                            '<div class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">'+                                        
                                                '<i class="fa-solid fa-ellipsis-vertical c-pointer" style="font-size: 24px;"></i>'+
                                                (caso.countPendingNotification > 0 ? '<div class="badge-grid"></div>' : '')+
                                            '</div>'+                                   
                                            '<ul class="dropdown-menu" style="width: 255px">'+
                                                (caso.estado == "1" || caso.estado == "2" || caso.estado == "3" || caso.estado == "6" || (caso.estado == "7") ? '<li onclick="gestionarCaso(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-gears color-primary"></i> Gestionar '+(caso.tipo_servicio == "2" ? 'queja' : 'fuga')+'</li>' : '')+
                                                '<li onclick="seguimientoServicio(this,'+"'caso'"+')" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-comment-dots color-primary"></i> <span class="p-rel">Seguimiento'+(caso.countPendingNotification > 0 ? '<div class="badge-dropdown"></div>' : '')+'</span></li>'+
                                                '<li onclick="historicoCambios(this,'+"'caso'"+')" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-clock-rotate-left color-primary"></i> Historial de cambios</li>'+
                                                (caso.estado != "5" ? '<li onclick="cerrarCaso(this)" class="px-2 py-1 c-pointer" style="font-size: 16px"><i class="fa-solid fa-square-xmark color-primary"></i> Cerrar '+(caso.tipo_servicio == "2" ? 'queja' : 'fuga')+'</li>' : '')+
                                            '</ul>'+
                                        '</div>'+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 40px;"class="text-center sticky-col">'+
                                        '<i onclick="verDetallesCaso(this)" class="fa-solid fa-eye color-primary c-pointer" title="Ver detalles" data-bs-toggle="tooltip" data-bs-placement="right"></i>'+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td style="left: 80px;"class="text-center sticky-col">'+
                                        (caso.asignadoNombre && caso.asignadoNombre.trim() && (caso.estado == "2" || caso.estado == "3" || (userRoleId == idSupervisor && caso.estado == "7")) ? '<i onclick="notificarServicio(this, '+"'caso'"+')" class="fa-solid fa-bell '+(caso.estado == "2" ? 'text-success' : 'color-primary')+' c-pointer" title="Notificar caso" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '')+
                                        '<div style="position: absolute; right: 0; top: 0; height: 100%; width: 1px; background-color: #000;"></div>'+
                                    '</td>'+
                                    '<td class="text-center">' + caso.numero_caso + '</td>'+
                                    '<td class="text-center">' + caso.id_cliente + '</td>'+
                                    '<td class="text-center">' + (caso.tipo_servicio == "2" ? 'Queja' : 'Fuga') + '</td>'+
                                    '<td class="text-center">' + (caso.estado == "1" ? 'No iniciado' : caso.estado == "2" ? 'En curso' : caso.estado == "3" ? 'Escalado' : caso.estado == "5" ? 'Cerrado' : caso.estado == "7" ? 'Atendido' : caso.estado == "6" ? 'Reprogramar' : '') + '</td>'+
                                    '<td class="text-center">' + (caso.asignadoNombre && caso.asignadoNombre.trim() ? caso.asignadoNombre : 'Sin asignar') + '</td>'+
                                    '<td class="text-center">' + (caso.agenteCallCenter && caso.agenteCallCenter.trim() ? caso.agenteCallCenter : 'Sin asignar') + '</td>'+
                                    '<td class="text-center">' + caso.fecha_solicitud + '</td>'+
                                    '<td class="text-center">' + (caso.fecha_visita ? caso.fecha_visita : 'Sin asignar') + '</td>'+
                                    '<td class="text-center">' + (caso.prioridad == "1" ? 'Alto' : caso.prioridad == "2" ? 'Medio' : 'Bajo') + '</td>'+
                                    '<td class="text-center">' + (caso.concepto_casos_name ? caso.concepto_casos_name : 'Sin concepto') + '</td>'+
                                    '<td class="text-center">' + (caso.nombre ? caso.nombre : 'Sin nombre de cliente') + '</td>'+
                                    '<td class="text-center">' + (caso.telefono ? caso.telefono : 'Sin teléfono') + '</td>'+
                                    '<td class="text-center">' + (auxDir ? auxDir : 'Sin dirección') + '</td>'+
                                '</tr>';
                    $("#tableCasos tbody").append(trAux);
                    if(response.data.length == (position + 1)) {
                        initTable("tableCasos");
                    }
                });
                $(".total-rows span").html(response.data.length);
                swal.close();
            } else {
                $("#tableCasos tbody").append('<tr><td colspan="13" class="text-center fw-bold py-5">Sin casos encontrados</td></tr>');
                swal.close();
            }
        }).catch((error) => {
            console.log(error);
            $("#tableCasos tbody").append('<tr><td colspan="13" class="text-center fw-bold py-5">Sin casos encontrados</td></tr>');
            swal.close();
        });
    }
}

function getRutaFormat(item, tipo) { 
    let auxRut = "";
    let auxRuta = item.name;
    if(tipo == "pedido") {
        auxRuta = item.routeText;
    } else if(tipo == "viajes") {
        auxRuta = item.ruta;
    }
    auxRut += (auxRuta && auxRuta.trim() ? (auxRuta.trim().split(":").length > 1 ? auxRuta.trim().split(":")[1].trim() : auxRuta.trim()) : '')

    if(auxRuta && auxRut.trim()) {
        auxRut = auxRut.trim();
        let rout = auxRut.split(" - ").length > 1 ? auxRut.split(" - ")[0] : auxRut;
        rout = rout.split("-").length > 2 ? rout.split("-")[2] : rout.trim();
        if(tipo == "pedido") {
            auxRut = rout;
        } else if(tipo == "ruta") {
            auxRut = rout;
        } else if(tipo == "viajes") {
            auxRut = rout;
        }
    }
        
    return auxRut;
}

function historicoCambios($this, tipo = "pedido") {
    loadMsg();
    let item = $($this).closest("tr").data("item");
    console.log(item);
    $("#historicoCambiosPedido").html(tipo == "pedido" ? ' servicio: ' +item.documentNumber : ' caso: ' + item.numero_caso);
    let settings = {
        url      : urlGetHistorico+"&id="+(tipo == "pedido" ? item.no_pedido : item.internalId)+"&type="+tipo,
        method   : 'GET'
    }
    $("#table-historico-cambios tbody").children("tr").remove();
    $("#table-historico-cambios tbody").append('<tr>' +
                                                    '<td colspan="5" class="text-center">' +
                                                        'Sin cambios registrados'+
                                                    '</td>' +
                                                '</tr>');
    
    setAjax(settings).then((response) => {
        if(response.success) {
            if(response.data.length > 0) {
                $("#table-historico-cambios tbody").children("tr").remove();
            }
            response.data.forEach(element => {
                let trAux = "",
                    auxFieldName = element.fieldName,
                    auxOldvalue = element.oldvalue,
                    auxNewvalue = element.newvalue;
                
                if(element.fieldName.trim().toLowerCase() == 'ptg - ultima notificacion' || element.fieldName.trim().toLowerCase() == 'ptg - ultima modificacion') {
                    auxFieldName = "Notificación";
                    auxOldvalue = '';
                    auxNewvalue = auxNewvalue.split("|").length > 1 ? auxNewvalue.split("|")[1] : auxNewvalue;
                }

                if(element.fieldName.trim().toLowerCase() == "ptg - opción de pago obj") {
                    trAux += getChangesMetodosPago(element);
                } else if(element.fieldName.trim().toLowerCase() != 'ptg - hora de notificacion' && element.fieldName.trim().toLowerCase() != 'ptg - fecha de notificación') {
                    trAux += '<tr>' +
                                '<td class="ion-text-center fw-bold">'+element.userName+'</td>'+
                                '<td class="ion-text-center fw-bold">'+element.date+'</td>'+
                                '<td class="ion-text-center fw-bold">'+(element.ui.trim()== 'Script (RESTlet)' ? 'Call Center/<br>Monitor' : 'Netsuite')+'</td>'+
                                '<td class="ion-text-center fw-bold">'+auxFieldName+'</td>'+
                                '<td class="ion-text-center fw-bold">'+auxOldvalue+'</td>'+
                                '<td class="ion-text-center fw-bold">'+auxNewvalue+'</td>'+
                            '</tr>';
                }
                $("#table-historico-cambios tbody").append(trAux);
            });
            $("#formHistoricoCambiosModal").data("item", item);
            swal.close();
            $("#formHistoricoCambiosModal").modal("show");
        }
    }).catch((error) => {
        console.log(error);
    });
}


function getObservacionesFormat(item, separador) { 
    let auxObs = "";
    auxObs += (item.observaciones && item.observaciones.trim() ? item.observaciones.trim() : '');
    if(item.objPagos) {
        let aux = JSON.parse(item.objPagos);
        if(aux.pago) {
            aux.pago.forEach(element => {
                if(concatObsPagos.indexOf(element.tipo_pago.toString()) > -1) {
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
    let auxMet = item.metodo_txt,
        auxFol = item.folio;
    if(auxMet.split(" ").length > 1) {
        if(auxMet.split(" ")[0].toLowerCase() == "prepago") {
            if(auxMet.split(" ")[1].toLowerCase() == "transferencia") {
                auxMet = auxMet.split(" ")[1]
                if(!auxFol) {
                    auxFol = "Sin folio"
                }
            } else {
                auxMet = auxMet.split(" ")[0];
            }
        }
    }
    return auxMet + (auxFol ? " - " + auxFol : '') + " - $" + getCorrectFormat(item.monto) + " MXN";
}

function getDireccionFormat(item, tipo) { 
    let auxDir = "";
    if(tipo == "pedido") {
        auxDir += (item.street && item.street.trim() ? item.street.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.entre1 && item.entre1.trim() && item.entre2 && item.entre2.trim() ? ', entre ' + item.entre1.trim() + ' y ' + item.entre2.trim() : (item.entre1 && item.entre1.trim() ? ', entre ' + item.entre1.trim() : (item.entre2 && item.entre2.trim() ? ', entre ' + item.entre2.trim() : '' )));
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.colonia && item.colonia.length > 0 && item.colonia[0].text && item.colonia[0].text.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia[0].text.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', ' : '') + item.cp.trim() : '');
        auxDir += (item.municipio && item.municipio.trim() ? (auxDir ? ' ' : '') + capitalizeFirstsLetter(item.municipio.trim()) : '');
        auxDir += (item.estadoDireccion && item.estadoDireccion.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.estadoDireccion.trim()) : '');
        /*if(extra) {
            auxDir += '<br>Entre:'+;
        }*/
    } else {
        auxDir += (item.calleDireccion && item.calleDireccion.trim() ? item.calleDireccion.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.entre1 && item.entre1.trim() && item.entre2 && item.entre2.trim() ? ', entre ' + item.entre1.trim() + ' y ' + item.entre2.trim() : (item.entre1 && item.entre1.trim() ? ', entre ' + item.entre1.trim() : (item.entre1 && item.entre1.trim() ? ', entre ' + item.entre2.trim() : '' )));
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
        //sortColumn:0,
        pagination: true,
        perPage: table == "tablePedidos" ? ($("#filterCantidad").val() != "0" ? parseInt($("#filterCantidad").val()) : $("#"+table+" tbody").children("tr").length) : 50,
        searchable:false,
        sortable: false
    });
    if ($(".btn-expand").find("i").hasClass('fa-caret-right')) {
        $("tfoot").addClass("expand");
    } else {
        $("tfoot").removeClass("expand");
    }
    initTooltips();
}

function initTooltips() {
    $(".tooltip").remove();
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function gestionarServicio($this) {
    let servicio = $($this).closest("tr").data("item");
    console.log(servicio);
    loadMsg();
    if(!$(".btn-expand").find("i").hasClass('fa-caret-right')) {
        $(".btn-expand").trigger("click");
    }
    $("#tipoCasoFuga, #tipoCasoQueja").addClass("d-none");
    $("#sinSeleccionCaso, #data-casos").addClass("d-none");

    $("#dataPedidosCliente").html(servicio.id_cliente + " - " + servicio.nombre_cliente);
    $("#dataPedidosTelefono").html(servicio.telefono.trim());
    $("#dataPedidosDireccion").html(getDireccionFormat(servicio, "pedido"));

    $("#noPedido").html(servicio.documentNumber);
    $("#fechaSolicitudPedido").html(dateFormatFromDate(servicio.fecha_solicitud, '5'));

    $("#fechaPrometidaPedido").val(dateFormatFromDate(servicio.fecha_prometida, "2"));
    $("#desdePedido").val(servicio.desde ? getTimeFromString(servicio.desde) : null);
    $("#hastaPedido").val(servicio.hasta ? getTimeFromString(servicio.hasta) : null);

    $('#viajeVentaPedido').children('option').remove();
    
    $("#zonaVentaPedido").val(servicio.zona);

    $('.productosMetodoPago tbody').children("tr").remove();

    if(servicio.objPagos) {
        let aux = JSON.parse(servicio.objPagos);
        let total = 0;
        if(aux.pago) {
            aux.pago.forEach(element => {
                $(".productosMetodoPago tbody").append(
                    '<tr data-metodo-id='+element.tipo_pago+' class="metodo-item" data-metodo=' + "'" + JSON.stringify(element) + "'" + '>' +
                        '<td>'+getMetodoPagoNombre(element)+'</td>'+
                        '<td class="text-center">'+(element.folio ? element.folio : 'No aplica')+'</td>'+
                        '<td class="text-center" data-total='+element.monto+'>$'+getCorrectFormat(element.monto)+' MXN</td>'+
                    '</tr>'
                );
                total = total + parseFloat(element.monto);
            });
        }
        
        $('.productosMetodoPago').children('tfoot').find('td.total').data('total', total);
        $('.productosMetodoPago').find('td.total').text('$'+getCorrectFormat(total)+' MXN');
    }

    $("#observacionesPagoPedido").val(servicio.observaciones);

    let settings = {
        url      : urlGetItemsOpp,
        method   : 'POST',
        data     : JSON.stringify({opp : servicio.no_pedido}),
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            servicio.articulos = response.data;
        } else {
            servicio.articulos = [];
        }
        if(response.success) {
            $('.productosCilindroPedido, .productosEstacionarioPedido').parent().parent().addClass('d-none');
            $('.productosCilindroPedido tbody, .productosEstacionarioPedido tbody').children("tr").remove();
            var table = $('.productosCilindroPedido');
            response.data.forEach(element => {
                if(element.itemId == deftEstacionarVal) {
                    table = $('.productosEstacionarioPedido');
                }
            });
            table.parent().parent().removeClass('d-none');
            let total = 0;
            response.data.forEach(articulo => {
                articulo.amount = articulo.amount ? parseFloat(articulo.amount) : 0;
                articulo.taxAmount = articulo.taxAmount ? parseFloat(articulo.taxAmount) : 0;
                if(table.hasClass('productosCilindroPedido')) {
                    $(".productosCilindroPedido tbody").append(
                        '<tr data-item-id='+articulo.itemId+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                            '<td class="text-center">'+articulo.item+'</td>'+
                            '<td class="text-center">'+articulo.quantity+'</td>'+
                            '<td class="text-center">'+articulo.capacidad+' kg</td>'+
                            '<td class="text-center" data-total='+(articulo.amount+articulo.taxAmount)+'>$'+getCorrectFormat((articulo.amount+articulo.taxAmount))+' MXN</td>'+
                        '</tr>'
                    );
                } else {
                    $(".productosEstacionarioPedido tbody").append(
                        '<tr data-item-id='+articulo.itemId+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                            '<td>'+articulo.item+'</td>'+
                            '<td class="text-center">'+articulo.quantity+'</td>'+
                            '<td class="text-center">1</td>'+
                            '<td class="text-center" data-total='+(articulo.amount+articulo.taxAmount)+'>$'+getCorrectFormat((articulo.amount+articulo.taxAmount))+' MXN</td>'+
                        '</tr>'
                    );
                }
                
                total = total + (articulo.amount+articulo.taxAmount);
            });

            table.children('tfoot').find('td.total').data('total', total);
            table.children('tfoot').find('td.total').text('$'+getCorrectFormat(total)+' MXN');            
        }

        $("#data-pedidos").removeClass("d-none");
        $("#data-pedidos").data("item", servicio);
        let settings2 = {
            url      : urlGetListTravelNumber,
            method   : 'POST',
            data: JSON.stringify({
                namePlanta : $("#plantas option:selected").text()
            })
        }

        let auxViajeId = servicio.id_no_viaje;
    
        setAjax(settings2).then((response) => {
            if(response.success) {
                response.data.forEach(element => {
                    if((servicio.serviceTypeId == "1" && element.esCilindro) || (servicio.serviceTypeId != "1" && element.esEstacionario)) {
                        $("#viajeVentaPedido").append(
                            '<option data-item=' + "'" + JSON.stringify(element) + "'" + ' value="'+element.nViajeId+'">'+getRutaFormat(element, "viajes")+'</option>'
                        );
                    }                    
                });
                if(servicio.id_no_viaje && servicio.id_no_viaje.trim()) {
                    if($("#viajeVentaPedido option[value="+servicio.id_no_viaje+"]").length == 0) {
                        $("#viajeVentaPedido").append(
                            '<option data-item=' + "'" + JSON.stringify({choferId : servicio.choferId, choferPhone: servicio.phoneChofer}) + "'" + ' value="noviaje">'+getRutaFormat(servicio, "pedido")+'</option>'
                        );  
                        auxViajeId = "noviaje";     
                    }
                } else {
                    let aux = $("#viajeVentaPedido").children('option');
                    for (let x = 0; x < aux.length; x++) {
                        const element = $(aux[x]);
                        if(element.data("item").ruta == servicio.routeText) {
                            auxViajeId = element.data("item").nViajeId;
                        }
                    }

                    if(!auxViajeId) {
                        auxViajeId = "noviaje";
                        $("#viajeVentaPedido").append(
                            '<option value="noviaje">'+getRutaFormat(servicio, "pedido")+'</option>'
                        );
                    }
                }
                $('#viajeVentaPedido').select2({
                    selectOnClose: true,
                    placeholder: "Seleccione una ruta",
                    language: {
                        "noResults": function(){
                            return "Sin resultados encontrados";
                        }
                    }
                });
                $('#viajeVentaPedido').val(auxViajeId).trigger("change");
        
                swal.close();
            }
        }).catch((error) => {
            console.log(error);
        });
    }).catch((error) => {
        console.log(error);
        swal.close();
    });

    
}

function getMetodoPagoNombre(item) {
    let aux = "No encontrado";
    console.log(item);
    if(item.tipo_pago) {
        methodPayments.forEach(element => {
            if(element.id == item.tipo_pago) {
                aux = element.method;
            }
        });
    }
    return aux;
}

$("#guardarPedido").click(function() {
    let servicio = $("#data-pedidos").data("item");
    if(!$("#fechaPrometidaPedido").val() ||
       !$("#desdePedido").val() ||
       !$("#viajeVentaPedido").val()) {
        let aux = "<ul>";
        if(!$("#fechaPrometidaPedido").val()) {
            aux += "<li>Fecha prometida</li>";
        }
        if(!$("#desdePedido").val()) {
            aux += "<li>Desde</li>";
        }
        if(!$("#viajeVentaPedido").val()) {
            aux += "<li>Ruta</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
        return;
    }

    if($("#viajeVentaPedido").val() == "noviaje") {
        infoMsg('warning', 'Ruta sin viaje asignado');
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
                            "custbody_ptg_numero_viaje" : $('#viajeVentaPedido').val(),
                            "memo": $('#observacionesPagoPedido').val()
                        },
                        "lines": [
                            
                        ]
                    }
                ]
            };

            if($('#hastaPedido').val()) {
                dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_y_las = formatTime( $('#hastaPedido').val());
            }

            if(servicio.status_id == idAsignado) {
                if($("#fechaPrometidaPedido").val() != servicio.fecha_prometida) {
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_monitor = null;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_estado_pedido = idPorNotificar;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_fecha_notificacion = null;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_hora_notificacion = null;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_numero_viaje = null;
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_ruta_asignada = $("#viajeVentaPedido option:selected").data("item").ruta;
                }
            } else if(servicio.status_id == idPorNotificar || servicio.status_id == idPorReprogramar) {
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
                    if(servicio.choferId && servicio.status_id == idAsignado && $("#viajeVentaPedido").val() != servicio.id_no_viaje) {
                        let auxNoti2 = getDefaultNotification('pedido', servicio, "Pedido reasignado a otro conductor");
                        let dataSendN2 = {
                            notification: {
                                title: 'Notificación de pedido',
                                message: auxNoti2.notificacion,
                                ids: [servicio.choferId]
                            }, sms : {
                                title: servicio.id_cliente+servicio.label+dateFormatFromDate(new Date(), "8"),
                                message: auxNoti2.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+servicio.phoneChofer
                            }
                        };
                        sendNotification(dataSendN2, "pedido", servicio.no_pedido, new Date().getTime()+"|Pedido reasignado a otro conductor", function(resp) {});
                    }
                    if($("#fechaPrometidaPedido").val() == servicio.fecha_prometida) {
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
                                title: servicio.id_cliente+servicio.label+dateFormatFromDate(new Date(), "8")+"2",
                                message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+servicio.phoneChofer
                            }
                        };
                        sendNotification(dataSendN, "pedido", servicio.no_pedido, new Date().getTime()+"|"+auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," "), function(resp) {
                            swal.close();
                            infoMsg('success', '', "Servicio guardado de manera correcta", null, function(resp) {
                                $(".btn-expand").trigger("click");
                                getServicios();
                            }); 
                        });
                    } else {
                        let auxNoti = getDefaultNotification('pedido', servicio, "Pedido reprogramado");
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
                        sendNotification(dataSendN, "pedido", servicio.no_pedido, new Date().getTime()+"|Pedido reprogramado", function(resp) {
                            swal.close();
                            infoMsg('success', '', "Servicio guardado de manera correcta", null, function(resp) {
                                $(".btn-expand").trigger("click");
                                getServicios();
                            }); 
                        });
                    }
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

function gestionarCaso($this) {
    let caso = $($this).closest("tr").data("item");
    $("#dataCasosCliente").html(caso.id_cliente + " - " + caso.nombre);
    $("#dataCasosTelefono").html(caso.telefono.trim());
    $("#dataCasosDireccion").html(getDireccionFormat(caso, "caso"));
    $("#dataCasosTipoServicio").html((caso.tipo_servicio == "2" ? 'Queja' : 'Fuga').trim());
    $("#tipoCasoFuga, #tipoCasoQueja").addClass("d-none");
    if(!$(".btn-expand").find("i").hasClass('fa-caret-right')) {
        $(".btn-expand").trigger("click");
    }
    
    $("#sinSeleccionCaso, #data-pedidos").addClass("d-none");
    loadMsg();
    let settings = {
        url      : urlGetMessageandNotes,
        method   : 'POST',
        data     : JSON.stringify({case : caso.internalId}),
    }
    $("#notasAdicionales tbody, #notasAdicionalesQueja tbody").html('<tr><td colspan="4" class="text-center">Sin notas</td></tr>');
    setAjax(settings).then((response) => {
        if(response.success) {
            if(response.noteData.length > 0) {
                $("#notasAdicionales tbody, #notasAdicionalesQueja tbody").children("tr").remove();
            }
            response.noteData.forEach(element => {
                if(element.note && element.note.trim()) {
                    let trAux = '<tr>' +
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.author+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.date+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.note+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold"></td>'+
                                '</tr>';
                    $("#notasAdicionales tbody, #notasAdicionalesQueja tbody").append(trAux);
                }
                
            });

            $("#especificacionesFugaQueja, #justificacionQueja").val(response.messageData && response.messageData.length > 0 && response.messageData[0].message && response.messageData[0].message.trim() ? response.messageData[0].message : '');
            caso.messageData = response.messageData && response.messageData.length > 0 && response.messageData[0].message && response.messageData[0].message.trim() ? response.messageData[0].message : '';
            if(caso.tipo_servicio == "1") {
                $("#tipoCasoFuga").removeClass("d-none");     
                //Reporte
                $("#noCaso").html(caso.numero_caso);
                $("#fechaCaso").html(caso.fecha_solicitud);
                getCasosOportunidades(caso);
        
                //Detalle del caso 
                $("#prioridadFugaQueja").val(caso.prioridad);
                setSelectConceptosCasos(caso);
        
                //Información del producto
                $("#articuloFugaQueja").val(caso.ariculo).trigger("change");
                $("#capacidadFugaQueja").val(caso.capacidadEstacionario);
                $("#anioFugaQueja").val(caso.yearTanque);
                
                //Programación visita
                $("#fechaVisitaFugaQueja").val(dateFormatFromDate(caso.fecha_visita, "2"));
                $("#horarioPreferidoFugaQueja").val(getTimeFromString(caso.horario_preferido));
                $("#asignarTecnicoFugaQueja").val((caso.asignado_a ? caso.asignado_a : "0")).trigger("change");
          
            } else {
                $("#tipoCasoQueja").removeClass("d-none");
        
                $("#noQueja").html(caso.numero_caso);
                $("#fechaQueja").html(caso.fecha_solicitud);
                setSelectConceptosCasos(caso);
                getCasosOportunidades(caso);
        
                //Escalar caso
                $("#prioridadFugaQueja").val(caso.prioridad);
                $("#estadoQueja").val(caso.estado).trigger("change");
                $("#motivoReprogramacionQueja").val(caso.motivoReprogramacionId ? caso.motivoReprogramacionId: '0').trigger("change");
                $("#responsableQueja").val((caso.asignado_a ? caso.asignado_a : "0")).trigger("change");
            }
            swal.close();
            $("#data-casos").removeClass("d-none");
            $("#data-casos").data("item", caso);
        }
    }).catch((error) => {
        console.log(error);
    });
    
}

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
        if ( caso.numero_caso != element.numeroCaso) {
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
                "status": "5",
                "notAllEdit": true
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
                                    //$(".btn-expand").trigger("click");
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

$("#guardarCaso").click(function() {
    let caso = $("#data-casos").data("item");

    if(validateForm($("#data-casos"))) {
        return;
    } 
    
    confirmMsg("warning", "¿Seguro que desea editar el caso?", function(resp) {
        if(resp) {
            let dataSend = [];
            let isSendNoti = false;
            if(caso.tipo_servicio == "1") {
                dataSend.push({
                    'id': caso.internalId,
                    "id_oportuniti" : $('#asociarServicioFugaQueja').val() && $("#asociarServicioFugaQueja").val() != "0" ? $('#asociarServicioFugaQueja').val() : 0,
                    "related_record" : $('#asociarServicioFugaQueja').val() && $("#asociarServicioFugaQueja").val() != "0" ? true : false,
                    "case_id": $("#asociarCasoFugaQueja").val() && $("#asociarCasoFugaQueja").val() != "0" ? $("#asociarCasoFugaQueja").val() : 0,
                    //domicilio
                    "custevent_ptg_conceptos_casos" : $('#conceptoFugaQueja').val(),
                    "priority" : $('#prioridadFugaQueja').val(),
                    "item": $('#articuloFugaQueja').val(),
                    "capEstacionario" : $('#articuloFugaQueja').val() == deftEstacionarVal ? ($("#capacidadFugaQueja").val().trim() ? $("#capacidadFugaQueja").val().trim() : "") : "",
                    "yearProduct" : $("#anioFugaQueja").val().trim() ? $("#anioFugaQueja").val().trim() : "",
                    "custevent_ptg_fecha_visita" : $('#fechaVisitaFugaQueja').val() ? dateFormatFromDate($('#fechaVisitaFugaQueja').val(), '5') : null,   
                    "custevent_ptg_horario_preferido" : $('#horarioPreferidoFugaQueja').val() ? formatTime($('#horarioPreferidoFugaQueja').val()) : null,
                    "assigned": $("#asignarTecnicoFugaQueja").val() && $("#asignarTecnicoFugaQueja").val() != "0" ? $("#asignarTecnicoFugaQueja").val() : null
                });

                if(caso.estado == "1" || caso.estado == "2" || caso.estado == "6" || caso.estado == "7") {
                    dataSend[0].status = "2";
                    isSendNoti = true;
                }
                
            } else {
                dataSend.push({
                    'id': caso.internalId,
                    "id_oportuniti" : $('#asociarServicioQueja').val() && $("#asociarServicioQueja").val() != "0" ? $('#asociarServicioQueja').val() : 0,
                    "related_record" : $('#asociarServicioQueja').val() && $("#asociarServicioQueja").val() != "0" ? true : false,
                    "case_id": $("#asociarCasoQueja").val() && $("#asociarCasoQueja").val() != "0" ? $("#asociarCasoQueja").val() : 0,
                    "custevent_ptg_conceptos_casos" : $('#conceptoQueja').val(),
                    "priority" : $('#prioridadQueja').val(),
                    "status": $("#estadoQueja").val(),
                    "assigned": $("#responsableQueja").val() && $("#responsableQueja").val() != "0" ? $("#responsableQueja").val() : null
                });
                if($("#estadoQueja").val() == "1") {
                    dataSend[0].status = "2";
                }

                if(dataSend[0].status == "2" || dataSend[0].status == "3") {
                    isSendNoti = true;
                }

                if(dataSend[0].status == "6") {
                    dataSend[0].custevent_ptg_motivo_reprogramacion = $("#motivoReprogramacionQueja").val()
                }
            }
            loadMsg();
            let settings = {
                url      : urlPutCases,
                method   : 'PUT',
                data: JSON.stringify({casosUpdate : dataSend})
            }

            setAjax(settings).then((response) => {
                if(response.success) {
                    let notas = [];
                    if(caso.tipo_servicio == "1") {
                        for (let index = 0; index < $("#notasAdicionales tbody").children("tr").length; index++) {
                            const element = $("#notasAdicionales tbody").children("tr")[index];
                            if($(element).find("i").length) {
                                notas.push({ 
                                    type: "nota", 
                                    idRelacionado: caso.internalId, 
                                    titulo: "Nota - Monitor", 
                                    nota: $($(element).find("td")[2]).html().trim(),
                                    transaccion: "caso"
                                });
                            }
                        }
                    } else {
                        for (let index = 0; index < $("#notasAdicionalesQueja tbody").children("tr").length; index++) {
                            const element = $("#notasAdicionalesQueja tbody").children("tr")[index];
                            if($(element).find("i").length) {
                                notas.push({ 
                                    type: "nota", 
                                    idRelacionado: caso.internalId, 
                                    titulo: "Nota - Monitor", 
                                    nota: $($(element).find("td")[2]).html().trim(),
                                    transaccion: "caso"
                                });
                            }
                        }
                    }
                    if(notas.length > 0) {
                        let settings2 = {
                            url      : urlPostNoteandMessage,
                            method   : 'POST',
                            data: JSON.stringify({ informacion: notas })
                        }
                        setAjax(settings2).then((response) => { 
                            if(response.success) { 
                                if(isSendNoti) {
                                    caso.asignado_a = (caso.tipo_servicio == "1" ? $("#asignarTecnicoFugaQueja option:selected").data("item").id : $("#responsableQueja option:selected").data("item").id);
                                    caso.numberAsiggned = (caso.tipo_servicio == "1" ? $("#asignarTecnicoFugaQueja option:selected").data("item").mobilePhone : $("#responsableQueja option:selected").data("item").mobilePhone);
                                    let auxNoti = getDefaultNotification('caso', caso);
                                    let dataSendN = {
                                        notification: {
                                            title: 'Notificación de '+(caso.tipo_servicio == "1" ? "fuga" : "queja"),
                                            message: auxNoti.notificacion,
                                            ids: [caso.asignado_a]
                                        }, sms : {
                                            title: caso.id_cliente+caso.label+dateFormatFromDate(new Date(), "8"),
                                            message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+caso.numberAsiggned
                                        }
                                    };
                                    sendNotification(dataSendN, "caso", caso.internalId, new Date().getTime()+"|"+auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," "), function(resp) {
                                        swal.close();
                                        infoMsg('success', '', "Caso guardado de manera correcta", null, function(resp) {
                                            $(".btn-expand").trigger("click");
                                            getServicios();
                                        });                                        
                                    });
                                } else {
                                    swal.close();
                                    infoMsg('success', '', "Caso guardado de manera correcta", null, function(resp) {
                                        $(".btn-expand").trigger("click");
                                        getServicios();
                                    }); 
                                }
                            }
                        }).catch((error) => {
                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de guardar especificaciones o notas del caso");
                            swal.close();
                        });
                    } else {
                        if(isSendNoti) {
                            caso.asignado_a = (caso.tipo_servicio == "1" ? $("#asignarTecnicoFugaQueja option:selected").data("item").id : $("#responsableQueja option:selected").data("item").id);
                            caso.numberAsiggned = (caso.tipo_servicio == "1" ? $("#asignarTecnicoFugaQueja option:selected").data("item").mobilePhone : $("#responsableQueja option:selected").data("item").mobilePhone);
                            let auxNoti = getDefaultNotification('caso', caso);
                            let dataSendN = {
                                notification: {
                                    title: 'Notificación de '+(caso.tipo_servicio == "1" ? "fuga" : "queja"),
                                    message: auxNoti.notificacion,
                                    ids: [caso.asignado_a]
                                }, sms : {
                                    title: caso.id_cliente+caso.label+dateFormatFromDate(new Date(), "8"),
                                    message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+caso.numberAsiggned
                                }
                            };
                            sendNotification(dataSendN, "caso", caso.internalId, new Date().getTime()+"|"+auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," "), function(resp) {
                                swal.close();
                                infoMsg('success', '', "Caso guardado de manera correcta", null, function(resp) {
                                    $(".btn-expand").trigger("click");
                                    getServicios();
                                });                                        
                            });
                        } else {
                            swal.close();
                            infoMsg('success', '', "Caso guardado de manera correcta", null, function(resp) {
                                $(".btn-expand").trigger("click");
                                getServicios();
                            }); 
                        }                  
                    }
                    
                } else {
                    swal.close();
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de editar el caso");
                }            
            }).catch((error) => {
                console.log(error);
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de editar el caso");
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

function notificarNota($this, tipo = "pedido") {
    let item = $($this).closest("tr").data("item");
    if(tipo == "pedido" && item.status_id == idPorNotificar) {
        infoMsg('warning', 'Favor de notificar primero el servicio');
        return;
    }

    if(tipo == "caso" && item.asignado_a.trim() == "") {
        infoMsg('warning', 'Favor de asignar primero el caso');
        return;
    }
    confirmMsg("warning", "¿Seguro que desea enviar la notificación?", function(resp) {
        if(resp) {
            loadMsg();
            let settings = {
                url      : urlPutNotes,
                method   : 'PUT',
                data     : JSON.stringify({id : item.auxNote.noteId, bodyFields: {custrecord_ptg_solicitud_notificacion : false}}),
            }
            setAjax(settings).then((response) => {
                if(response.success) {
                    let auxNoti = getDefaultNotification(tipo, item, item.auxNote.note);
                    let dataSend = {
                        notification: {
                            title: 'Notificación de '+tipo,
                            message: item.auxNote.note,
                            ids: [(tipo == "pedido" ? item.choferId : item.asignado_a)]
                        }, sms : {
                            title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                            message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+(tipo == "pedido" ? item.phoneChofer : item.numberAsiggned)
                        }
                    };

                    sendNotification(dataSend, tipo, (tipo == "pedido" ? item.no_pedido : item.internalId), new Date().getTime()+"|"+item.auxNote.note, function(resp) {
                        swal.close();
                        if(resp.success) {
                            if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                                infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                            } else {
                                $($this).closest("tr").find("td").first().html("");
                                getServicios();
                            }
                        } else {
                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                        }
                    });
                } else {
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                }
            }).catch((error) => {
                console.log(error);
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                swal.close();
            });
            
        }
    });
}

function getDefaultNotification(tipo, item, observacion = "") {
    let auxNoti = {
        notificacion: "",
        sms: ""
    };
    if(tipo == 'pedido') {
        //Llena msj de sms
        auxNoti.sms += formatTime(timeFormatFromDate(new Date(), "2")) + ","+ item.id_cliente/*+","*/+item.label+",";
        auxNoti.sms += item.street.trim()+",";
        auxNoti.sms += item.nExterior.trim()+",";
        auxNoti.sms += (item.nInterior && item.nInterior.trim()) ? item.nInterior.trim()+"," : '';
        auxNoti.sms += item.colonia+",";
        auxNoti.sms += item.nombre_cliente;
        if(item.conContrato) {
            auxNoti.sms += ',CONT'+item.contrato+'('+item.digitoVerificador+')';
        }
        
        item.articulos.forEach(element => {
            if(element.itemId != articuloDesc) {
                if(auxNoti.sms != "") {
                    auxNoti.sms += ", "
                }
                auxNoti.sms += (element.quantity ? element.quantity + "-" : '') + element.item;
            }            
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
        auxNoti.sms += (item.saldoDisponible && item.saldoDisponible.trim() && parseFloat(item.saldoDisponible.trim()) > 0) ? ', LC $'+getCorrectFormat(item.saldoDisponible) + " MXN" : '';
        if(observacion) {
            auxNoti.sms += (observacion && observacion.trim()) ? ","+observacion.trim() : '';
        } else {
            auxNoti.sms += (item.observaciones && item.observaciones.trim()) ? ","+item.observaciones.trim() : '';
        }

        //Llena msj de notificación
        auxNoti.notificacion +=  "Cliente: " + item.id_cliente+item.label + " - " + item.nombre_cliente.trim() + "\n"+
                    (item.conContrato ? "Contrato: " + item.contrato.trim()+'('+item.digitoVerificador+')' +"\n" : "") +
                    "Dirección: " + getDireccionFormat(item, "pedido")+"\n";
                    
        if(item.articulos.length > 0) {
            auxNoti.notificacion += "Artículos:";
            item.articulos.forEach(element => {
                if(element.itemId != articuloDesc) {
                    auxNoti.notificacion += "\n\t- "+ (element.quantity ? element.quantity + " | " : '') + element.item;
                }
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
        auxNoti.notificacion += (item.saldoDisponible && item.saldoDisponible.trim() && parseFloat(item.saldoDisponible) > 0) ? '\nLímite de crédito: $' + getCorrectFormat(item.saldoDisponible) + " MXN" : '';     
        if(observacion) {
            auxNoti.notificacion += (observacion && observacion.trim() ? '\nObservaciones: ' +observacion.trim() : '');
        } else {
            auxNoti.notificacion += (item.observaciones && item.observaciones.trim() ? '\nObservaciones: ' +item.observaciones.trim() : '');
        }
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

        if(observacion) {
            auxNoti.sms += (observacion && observacion.trim()) ? ","+observacion.trim() : '';
        } else {
            auxNoti.sms += (item.messageData && item.messageData) ? ","+item.messageData.trim() : '';
        }
    
        //Llena msj de notificación
        auxNoti.notificacion +=  "Cliente: " + item.id_cliente + " - " + item.nombre.trim() + "\n"+
                    (item.contrato && item.contrato.trim() ? "Contrato: " + item.contrato.trim() +"\n" : "") +
                    "Dirección: " + getDireccionFormat(item, "caso")+"\n";
             
        if(observacion) {
            auxNoti.notificacion += (observacion && observacion.trim() ? 'Observaciones: ' +observacion.trim() : '');
        } else {
            auxNoti.notificacion += (item.messageData && item.messageData.trim() ? 'Observaciones: ' +item.messageData.trim() : '');
        }
        
    }
    return auxNoti;
}

function seguimientoServicio($this, tipo = "pedido") {
    let item = $($this).closest("tr").data("item");
    console.log(item);
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
                                                    '<td colspan="4" class="text-center">' +
                                                        'Sin comentarios'+
                                                    '</td>' +
                                                '</tr>');
    setAjax(settings).then((response) => {
        if(response.success) {
            if(tipo == "pedido") {
                let settings2 = {
                    url      : urlGetItemsOpp,
                    method   : 'POST',
                    data     : JSON.stringify({opp : item.no_pedido}),
                }
                setAjax(settings2).then((response2) => {
                    if(response2.success) {
                        item.articulos = response2.data;
                    } else {
                        item.articulos = [];
                    }
                    let dataAux = (tipo == "pedido" ? response.data : response.noteData);
                    if(dataAux.length > 0) {
                        $("#table-notas-seguimiento tbody").children("tr").remove();
                    }
                    dataAux.forEach(element => {
                        if(element.note && element.note.trim()) {
                            item.auxNote = element;
                            let trAux = '<tr data-item=' + "'" + JSON.stringify(item) + "'" + '>' +
                                            '<td class="ion-text-center sticky-col fw-bold">'+(element.solicitud_notificacion ? '<i onclick="notificarNota(this, '+"'"+tipo+"'"+')" class="fa-solid fa-bell color-primary c-pointer" title="Notificar nota" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '')+'</td>'+
                                            '<td class="ion-text-center sticky-col fw-bold">'+element.author+'</td>'+
                                            '<td class="ion-text-center sticky-col fw-bold">'+element.date+'</td>'+
                                            '<td class="ion-text-center sticky-col fw-bold">'+element.note+'</td>'+
                                        '</tr>';
                            $("#table-notas-seguimiento tbody").append(trAux);
                        }
                        
                    });
                    initTooltips();
                    $("#seguimientoModal").data("item", item);
                    $("#seguimientoModal").modal("show");
                });
            } else {
                let dataAux = (tipo == "pedido" ? response.data : response.noteData);
                if(dataAux.length > 0) {
                    $("#table-notas-seguimiento tbody").children("tr").remove();
                }
                dataAux.forEach(element => {
                    if(element.note && element.note.trim()) {
                        item.auxNote = element;
                        let trAux = '<tr data-item=' + "'" + JSON.stringify(item) + "'" + '>' +
                                        '<td class="ion-text-center sticky-col fw-bold">'+(element.solicitud_notificacion ? '<i onclick="notificarNota(this, '+"'"+tipo+"'"+')" class="fa-solid fa-bell color-primary c-pointer" title="Notificar nota" data-bs-toggle="tooltip" data-bs-placement="right"></i>' : '')+'</td>'+
                                        '<td class="ion-text-center sticky-col fw-bold">'+element.author+'</td>'+
                                        '<td class="ion-text-center sticky-col fw-bold">'+element.date+'</td>'+
                                        '<td class="ion-text-center sticky-col fw-bold">'+element.note+'</td>'+
                                    '</tr>';
                        $("#table-notas-seguimiento tbody").append(trAux);
                    }
                    
                });
                initTooltips();
                $("#seguimientoModal").data("item", item);
                $("#seguimientoModal").modal("show");
            }
        }
        swal.close();
    }).catch((error) => {
        console.log(error);
        swal.close();
    });
    
}

function asignarViaje($this) {
    let pedido = $($this).closest("tr").data("item"),
        auxViajeId = pedido.id_no_viaje;
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
        let settings2 = {
            url      : urlGetListTravelNumber,
            method   : 'POST',
            data: JSON.stringify({
                namePlanta : $("#plantas option:selected").text()
            })
        }
    
        setAjax(settings2).then((response) => {
            if(response.success) {
                response.data.forEach(element => {
                    if((pedido.serviceTypeId == "1" && element.esCilindro) || (pedido.serviceTypeId != "1" && element.esEstacionario)) {
                        $("#asignarViajeRuta").append(
                            '<option data-item=' + "'" + JSON.stringify(element) + "'" + ' value="'+element.nViajeId+'">'+getRutaFormat(element, "viajes")+'</option>'
                        );
                    }                    
                });
                if(pedido.id_no_viaje && pedido.id_no_viaje.trim()) {
                    if($("#asignarViajeRuta option[value="+pedido.id_no_viaje+"]").length == 0) {
                        $("#asignarViajeRuta").append(
                            '<option data-item=' + "'" + JSON.stringify({choferId : pedido.choferId, choferPhone: pedido.phoneChofer}) + "'" + ' value="noviaje">'+getRutaFormat(pedido, "pedido")+'</option>'
                        );    
                        auxViajeId = "noviaje";   
                    }
                } else {
                    let aux = $("#asignarViajeRuta").children('option');
                    for (let x = 0; x < aux.length; x++) {
                        const element = $(aux[x]);
                        if(element.data("item").ruta == pedido.routeText) {
                            auxViajeId = element.data("item").nViajeId;
                        }
                    }
                    if(!auxViajeId) {
                        auxViajeId = "noviaje";
                        $("#asignarViajeRuta").append(
                            '<option value="noviaje">'+getRutaFormat(pedido, "pedido")+'</option>'
                        );
                    }
                }
                $('#asignarViajeRuta').select2({
                    selectOnClose: true,
                    placeholder: "Seleccione una ruta",
                    dropdownParent: $('#asignarViajeModal'),
                    language: {
                        "noResults": function(){
                            return "Sin resultados encontrados";
                        }
                    }
                });
                $('#asignarViajeRuta').val(auxViajeId).trigger("change");
        
                $("#asignarViajeModal").data("item", pedido);
                $("#asignarViajeModal").modal("show");
                swal.close();
            }
        }).catch((error) => {
            console.log(error);
        });
        
    }).catch((error) => {
        console.log(error);
        swal.close();
    });;
}

function cancelarPedido($this) {
    let pedido = $($this).closest("tr").data("item");
    
    $("#cancelarOppPedido").html(pedido.documentNumber ? " - " + pedido.documentNumber : '');
    
    if(pedido.solicitudCancelacion) {
        loadMsg();
        $('#cancelarOppMotivo').val(pedido.motivoCancelacion).trigger("change");
        let settings = {
            url      : urlGetNotesOfOPP,
            method   : 'POST',
            data     : JSON.stringify({opp : pedido.no_pedido}),
        }
    
        setAjax(settings).then((response) => {
            if(response.success) {
                let note = "";
                response.data.forEach(element => {
                    if(!note && element.solicitud_cancelacion) {
                        note = element.note;
                    }
                });
                pedido.auxNote = note;
                $('#cancelarOppObservaciones').val(note);
            } else {
                $('#cancelarOppObservaciones').val(null);
            }
            swal.close();
            $("#cancelarOppModal").data("item", pedido);
            $("#cancelarOppModal").modal("show");
        }).catch((error) => {
            console.log(error);
            swal.close();
        });
    } else {
        $("#cancelarOppObservaciones").val(null);
        $('#cancelarOppMotivo').val(null).trigger("change");
        swal.close();
        $("#cancelarOppModal").data("item", pedido);
        $("#cancelarOppModal").modal("show");
    }    
}

function cambiarFechaPedido($this) {
    let pedido = $($this).closest("tr").data("item");
    console.log(pedido);
    $("#cambiarFechaOppPedido").html(pedido.documentNumber ? " - " + pedido.documentNumber : '');
    
    loadMsg();
    let settings = {
        url      : urlGetNotesOfOPP,
        method   : 'POST',
        data     : JSON.stringify({opp : pedido.no_pedido}),
    }

    setAjax(settings).then((response) => {
        if(response.success) {
            let note = "",
                fecha = "";
            response.data.forEach(element => {
                if(!note && element.solicitud_cambio_fecha) {
                    note = element.note;
                    fecha = dateFormatFromDate(element.solicitud_nueva_fecha, "2");
                }
            });
            pedido.auxNote = note;
            $('#nuevaFechaPrometida').val(fecha);
            $('#cambiarFechaOppObservaciones').val(note);
        }
        swal.close();
        $("#cambiarFechaOppModal").data("item", pedido);
        $("#cambiarFechaOppModal").modal("show");
    }).catch((error) => {
        console.log(error);
        swal.close();
    });
}

function cerrarCaso($this) {
    let caso = $($this).closest("tr").data("item");
    $("#cerrarCasoPedido").html((caso.tipo_servicio == "2" ? 'queja' : 'fuga') + (caso.numero_caso ? " - " + caso.numero_caso : ''));
    $('#cerrarCasoObservaciones').val(null);
    $("#cerrarCasoModal").data("item", caso);
    $("#cerrarCasoModal").modal("show");
}

function descancelarPedido($this) {
    let pedido = $($this).closest("tr").data("item");
    confirmMsg("warning", "¿Seguro que desea descancelar el servicio?", function(resp) {
        if(resp) {
            let dataSend = {
                "opportunitiesUpdate": [
                    {
                        "id": pedido.no_pedido,
                        "bodyFields": {
                            "custbody_ptg_estado_pedido": idPorNotificar,
                            "custbody_ptg_motivo_cancelation" : '',
                            "entitystatus": 11,
                            "custbody_ptg_solicitud_cancelacion": false,
                            'custbody_ptg_fecha_notificacion': '',
                            'custbody_ptg_hora_notificacion': '',
                            custbody_ptg_numero_viaje: null,
                            custbody_ptg_monitor: null
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
                    swal.close();
                    infoMsg('success', '', "Servicio descancelado de manera correcta", null, function(resp) {
                        getServicios();
                    });
                } else {
                    swal.close();
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de descancelar el servicio");
                }            
            }).catch((error) => {
                console.log(error);
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de descancelar el servicio");
                swal.close();
            });
        }
    });
}

function marcarEntregadoPedido($this) {
    let pedido = $($this).closest("tr").data("item");
    confirmMsg("warning", "¿Seguro que desea marcar cómo entregado el servicio?", function(resp) {
        if(resp) {
            let dataSend = {
                "opportunitiesUpdate": [
                    {
                        "id": pedido.no_pedido,
                        "bodyFields": {
                            "custbody_ptg_estado_pedido": idEntregado,
                            "entitystatus": 13,
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
                    swal.close();
                    infoMsg('success', '', "Servicio marcado cómo entregado de manera correcta", null, function(resp) {
                        getServicios();
                    });
                } else {
                    swal.close();
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de marcar cómo entregado el servicio");
                }            
            }).catch((error) => {
                console.log(error);
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de marcar cómo entregado el servicio");
                swal.close();
            });
        }
    });
}

$("#guardarCancelarOpp").click(function() {
    let pedido = $("#cancelarOppModal").data("item");
    if($("#cancelarOppObservaciones").val().trim() && $("#cancelarOppMotivo").val()) {
        confirmMsg("warning", "¿Seguro que desea cancelar el servicio?", function(resp) {
            if(resp) {
                let dataSend = {
                    "opportunitiesUpdate": [
                        {
                            "id": pedido.no_pedido,
                            "bodyFields": {
                                "custbody_ptg_estado_pedido": idCancelado,
                                "custbody_ptg_motivo_cancelation" : $("#cancelarOppMotivo").val(),
                                "entitystatus": 14,
                                "custbody_ptg_solicitud_cancelacion": false
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
                        if(pedido.solicitudCancelacion && (pedido.auxNote && $("#cancelarOppObservaciones").val().trim() == pedido.auxNote.trim())) {
                            if(pedido.status_id == idAsignado && pedido.choferId) {
                                let auxNoti = getDefaultNotification('pedido', pedido, $("#cancelarOppObservaciones").val().trim());
                                let dataSend2 = {
                                    notification: {
                                        title: 'Cancelación de servicio - '+pedido.documentNumber,
                                        message: $("#cancelarOppObservaciones").val().trim(),
                                        ids: [pedido.choferId]
                                    }, sms : {
                                        title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                        message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                    }
                                };
                                sendNotification(dataSend2, "pedido", pedido.no_pedido, new Date().getTime()+"|"+$("#cancelarOppObservaciones").val().trim(), function(resp) {
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
                        } else {
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
                                    if(pedido.status_id == idAsignado && pedido.choferId) {
                                        let auxNoti = getDefaultNotification('pedido', pedido, $("#cancelarOppObservaciones").val().trim());
                                        let dataSend2 = {
                                            notification: {
                                                title: 'Cancelación de servicio - '+pedido.documentNumber,
                                                message: $("#cancelarOppObservaciones").val().trim(),
                                                ids: [pedido.choferId]
                                            }, sms : {
                                                title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                                message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                            }
                                        };
                                        sendNotification(dataSend2, "pedido", pedido.no_pedido, new Date().getTime()+"|"+$("#cancelarOppObservaciones").val().trim(), function(resp) {
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
                        }
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

$("#guardarCambioFechaOpp").click(function() {
    let pedido = $("#cambiarFechaOppModal").data("item");
    if($("#cambiarFechaOppObservaciones").val().trim() && $("#nuevaFechaPrometida").val()) {
        confirmMsg("warning", "¿Seguro que desea cambiar la fecha prometida?", function(resp) {
            if(resp) {
                let dataSend = {
                    "opportunitiesUpdate": [
                        {
                            "id": pedido.no_pedido,
                            "bodyFields": {
                                "expectedclosedate": dateFormatFromDate($("#nuevaFechaPrometida").val(), "5"),
                                "custbody_ptg_solici_cambio_fech_prome": false
                            },
                            "lines": [
                                
                            ]
                        }
                    ]
                };
                if(pedido.status_id == idAsignado) {
                    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_estado_pedido = idPorNotificar;
                }
                
                loadMsg();
                let settings = {
                    url      : urPutOppMonitor,
                    method   : 'PUT',
                    data: JSON.stringify(dataSend)
                }
                setAjax(settings).then((response) => {
                    if(response.success) {
                        if(pedido.auxNote && $("#cambiarFechaOppObservaciones").val().trim() == pedido.auxNote.trim()) {
                            if(pedido.status_id == idAsignado && pedido.choferId) {
                                let auxNoti = getDefaultNotification('pedido', pedido, $("#cancelarOppObservaciones").val().trim());
                                let dataSend2 = {
                                    notification: {
                                        title: 'Reprogramación de servicio - '+pedido.documentNumber,
                                        message: $("#cancelarOppObservaciones").val().trim(),
                                        ids: [pedido.choferId]
                                    }, sms : {
                                        title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                        message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                    }
                                };
                                sendNotification(dataSend2, "pedido", pedido.no_pedido, new Date().getTime()+"|"+$("#cancelarOppObservaciones").val().trim(), function(resp) {
                                    $("#cambiarFechaOppModal").modal("hide");
                                    swal.close();
                                    infoMsg('success', '', "Servicio modificado de manera correcta", null, function(resp) {
                                        getServicios();
                                    });
                                });
                            } else {
                                $("#cambiarFechaOppModal").modal("hide");
                                swal.close();
                                infoMsg('success', '', "Servicio modificado de manera correcta", null, function(resp) {
                                    getServicios();
                                });
                            }
                        } else {
                            let nota = [{ 
                                type: "nota", 
                                idRelacionado: pedido.no_pedido, 
                                titulo: "Cancelación de servicio", 
                                nota: $("#cambiarFechaOppObservaciones").val().trim(),
                                transaccion: "oportunidad"
                            }];
                            let settings2 = {
                                url      : urlPostNoteandMessage,
                                method   : 'POST',
                                data: JSON.stringify({ informacion: nota })
                            }
                            setAjax(settings2).then((response) => {
                                if(response.success) {
                                    if(pedido.status_id == idAsignado && pedido.choferId) {
                                        let auxNoti = getDefaultNotification('pedido', pedido, $("#cambiarFechaOppObservaciones").val().trim());
                                        let dataSend2 = {
                                            notification: {
                                                title: 'Reprogramación de servicio - '+pedido.documentNumber,
                                                message: $("#cambiarFechaOppObservaciones").val().trim(),
                                                ids: [pedido.choferId]
                                            }, sms : {
                                                title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                                message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                            }
                                        };
                                        sendNotification(dataSend2, "pedido", pedido.no_pedido, new Date().getTime()+"|"+$("#cambiarFechaOppObservaciones").val().trim(), function(resp) {
                                            $("#cambiarFechaOppModal").modal("hide");
                                            swal.close();
                                            infoMsg('success', '', "Servicio modificado de manera correcta", null, function(resp) {
                                                getServicios();
                                            });
                                        });
                                    } else {
                                        $("#cambiarFechaOppModal").modal("hide");
                                        swal.close();
                                        infoMsg('success', '', "Servicio modificado de manera correcta", null, function(resp) {
                                            getServicios();
                                        });
                                    }
                                }
                            }).catch((error) => {
                                console.log(error);
                                swal.close();
                            });
                        }
                    } else {
                        swal.close();
                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de modificar el servicio");
                    }            
                }).catch((error) => {
                    console.log(error);
                    swal.close();
                });
            }
        });
        
    } else {
        let aux = "<ul>";
        if(!$("#cambiarFechaOppObservaciones").val()) {
            aux += "<li>Nueva fecha prometida</li>";
        }
        if(!$("#cambiarFechaOppObservaciones").val().trim()) {
            aux += "<li>Observaciones</li>";
        }
        aux += "</ul>";
        infoMsg('warning', 'Campos requeridos:', aux);
    }
});

function validateForm(form) {
    let validates = form.find(".validate"),
        hasError = false,
        firstError = null,
        auxRequired = '',
        auxFormat = '',
        auxMsg = '';
        
    for (let x = 0; x < validates.length; x++) {
        const element = $(validates[x]);        
        if(!element.is(":hidden")) {
            console.log(element, element.hasClass("required"), element.val(), element.hasClass("required") && (!element.val() || !element.val().trim()));
            if(element.hasClass("required") && (!element.val() || !element.val().trim() || (element.hasClass("has0") && element.val().trim() == 0))) {                        
                element.addClass('invalid');
                element.closest(".content-input").addClass('invalid');
                hasError = true;
                if(!firstError) {
                    firstError = element;
                }
                auxRequired += '<li>'+element.attr("title")+'</li>';
            }
            
            if(element.hasClass("format") && element.val() && element.val().trim()) {
                if(element.hasClass('email') && !emailRegex.test(element.val().trim())) {
                    element.addClass('invalid');
                    element.closest(".content-input").addClass('invalid');
                    hasError = true;
                    if(!firstError) {
                        firstError = element;
                    }
                    auxFormat += '<li>'+element.attr("title")+'</li>';
                }
                
                if(element.hasClass('phone') && (element.val().trim().length < 7 || !telNumRegex.test(element.val().trim()))) {
                    element.addClass('invalid');
                    element.closest(".content-input").addClass('invalid');
                    hasError = true;
                    if(!firstError) {
                        firstError = element;
                    }
                    auxFormat += '<li>'+element.attr("title")+'</li>';
                }

                if(element.hasClass('rfc') && !rfcRegex.test(element.val().trim())) {
                    element.addClass('invalid');
                    element.closest(".content-input").addClass('invalid');
                    hasError = true;
                    if(!firstError) {
                        firstError = element;
                    }
                    auxFormat += '<li>'+element.attr("title")+'</li>';
                }
            }
        }
    }

    //firstError.focus();
    if(auxRequired) {
        auxMsg += '<strong>Campos requeridos:</strong>'+auxRequired;
    }

    if(auxFormat) {
        auxMsg += (auxMsg ? '<br>' : '')+'<strong>Campos con formato no valido:</strong>'+auxFormat;
    }
    
    if(auxMsg) {
        infoMsg('warning', '', auxMsg, null, function(resp) {
            firstError.focus();
        })
    }

    return hasError;
}

$("#enviarNotificacion").click(function() {
    if(validateForm($("#notificarModal"))) {
        return;
    } 
    let item = $("#notificarModal").data("item");
    
    if(item.numero_caso) {
        let dataSend = {
            notification: {
                title: 'Notificación de caso',
                message: $("#notificarNotificacion").val().trim(),
                ids: [item.asignado_a]
            }
        };
        if($("#sendSmsNotificar").prop("checked")) {
            dataSend.sms = {
                title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                message: $("#notificarSms").val().trim()+"\n"+item.numberAsiggned
            }
        }
        console.log("jeje");
        sendNotification(dataSend, "caso", item.internalId, ($("#sendSmsNotificar").prop("checked") ? (new Date().getTime()+"|"+$("#notificarSms").val().trim()) : ""), function(resp) {
            console.log("jeje2");
            swal.close();
            if(resp.success) {
                if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                } else {
                    getServicios();
                    $("#notificarModal").modal("hide");
                }
            } else {
                infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
            }
        });
    } else {
        loadMsg();
        let settings2 = {
            url      : urlGetListTravelNumber,
            method   : 'POST',
            data: JSON.stringify({
                namePlanta : $("#plantas option:selected").text()
            })
        }
    
        setAjax(settings2).then((response) => {
            if(response.success) {
                let exist = false;
                let auxIdViaj = '',
                    choferId = '',
                    phoneChofer = '';
                response.data.forEach(element => {
                    if(element.ruta == item.routeText) {
                        exist = true;
                        auxIdViaj = element.nViajeId;
                        choferId = element.choferId;
                        phoneChofer = element.choferPhone;
                    }
                });

                if(exist) {
                    if(item.status_id == idPorNotificar || item.status_id == idPorReprogramar) {
                        let dataSend2 = {
                            "opportunitiesUpdate": [
                                {
                                    "id": item.no_pedido,
                                    "bodyFields": {
                                        "custbody_ptg_numero_viaje": auxIdViaj,
                                        custbody_ptg_monitor : userId,
                                        custbody_ptg_estado_pedido : idAsignado,
                                        custbody_ptg_fecha_notificacion : dateFormatFromDate(new Date(), "5"),
                                        custbody_ptg_hora_notificacion : formatTime(timeFormatFromDate(new Date(), "2"))
                                    },
                                    "lines": [
                                        
                                    ]
                                }
                            ]
                        };
                        let settings = {
                            url      : urPutOppMonitor,
                            method   : 'PUT',
                            data: JSON.stringify(dataSend2)
                        }
                        setAjax(settings).then((response) => {
                            if(response.success) {
                                item.choferId = choferId;
                                item.phoneChofer = phoneChofer;
                                let dataSend = {
                                    notification: {
                                        title: 'Notificación de pedido',
                                        message: $("#notificarNotificacion").val().trim(),
                                        ids: [item.choferId]
                                    }
                                };
                                if($("#sendSmsNotificar").prop("checked")) {
                                    dataSend.sms = {
                                        title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                                        message: $("#notificarSms").val().trim()+"\n"+item.phoneChofer
                                    }
                                }
                
                                sendNotification(dataSend, "pedido", item.no_pedido, ($("#sendSmsNotificar").prop("checked") ? (new Date().getTime()+"|"+$("#notificarSms").val().trim()) : ""), function(resp) {
                                    swal.close();
                                    if(resp.success) {
                                        if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                                        } else {
                                            getServicios();
                                            $("#notificarModal").modal("hide");
                                        }
                                    } else {
                                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                                    }
                                });
                            } else {
                                swal.close();
                                infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                            }            
                        }).catch((error) => {
                            console.log(error);
                            swal.close();
                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");                            
                        });
                    } else {
                        let dataSend = {
                            notification: {
                                title: 'Notificación de pedido',
                                message: $("#notificarNotificacion").val().trim(),
                                ids: [item.choferId]
                            }
                        };
                        if($("#sendSmsNotificar").prop("checked")) {
                            dataSend.sms = {
                                title: item.id_cliente+item.label+dateFormatFromDate(new Date(), "8"),
                                message: $("#notificarSms").val().trim()+"\n"+item.phoneChofer
                            }
                        }
        
                        sendNotification(dataSend, "pedido", item.no_pedido, ($("#sendSmsNotificar").prop("checked") ? (new Date().getTime()+"|"+$("#notificarSms").val().trim()) : ""), function(resp) {
                            swal.close();
                            if(resp.success) {
                                if(!resp.data.notification.status || (resp.data.sms && !resp.data.sms.status)) {
                                    infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                                } else {
                                    getServicios();
                                    $("#notificarModal").modal("hide");
                                }
                            } else {
                                infoMsg('error', 'Error:', "Ocurrio un error al tratar de enviar la notificación favor de volver a intentarlo");
                            }
                        });
                    }

                } else {
                    infoMsg('error', 'Error:', "No existe viaje para la ruta seleccionada");
                }
            }
        }).catch((error) => {
            console.log(error);
        });
            
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

                            sendNotification(dataSend, (item.numero_caso ? "caso" : "pedido"), (item.numero_caso ? item.internalId : item.no_pedido), ($("#sendSmsSeguimiento").prop("checked") ? new Date().getTime()+"|"+$("#nuevaNotaSeguimiento").val().trim() : ""), function(resp) {
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

function sendNotification(dataSend, tipo, idAux, msg, callback) {
    if(!swal.getState().isOpen) {
        loadMsg();
    }
    let settings = {
        url      : urlSendNotification,
        method   : 'POST',
        data: JSON.stringify(dataSend)
    }
    setAjax(settings).then((response) => {
        if(msg) {
            let settings = {};
            if(tipo == "pedido") {
                let dataSend = {
                    "opportunitiesUpdate": [
                        {
                            "id": idAux,
                            "bodyFields": {
                                "custbody_ptg_fecha_hora_ultima_notifi": msg
                            },
                            "lines": [
                                
                            ]
                        }
                    ]
                };
                settings = {
                    url      : urPutOppMonitor,
                    method   : 'PUT',
                    data: JSON.stringify(dataSend)
                }                
            } else {
                settings = {
                    url      : urlPutCases,
                    method   : 'PUT',
                    data: JSON.stringify({casosUpdate : [{'id': idAux, notAllEdit: true, custevent_ptg_ultima_modificacion: msg}]})
                }
            }

            setAjax(settings).then((response2) => {
                console.log("juju");
                callback(response);
            }).catch((error) => {
                console.log(error);
                callback(response);
            });
        } else {
            callback(response);
        }        
    }).catch((error) => {
        console.log(response);
        callback(false);
    });
}

$("#guardarAsignarViaje").click(function() {
    let pedido = $("#asignarViajeModal").data("item");
    if($("#asignarViajeRuta").val() && $("#asignarViajeRuta").val().trim()) {
        if($("#asignarViajeRuta").val() == "noviaje") {
            infoMsg('warning', 'Ruta sin viaje asignado');
            return;
        }
        if($("#asignarViajeRuta").val() != pedido.id_no_viaje) {
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
                            if(pedido.choferId && pedido.status_id == idAsignado) {
                                let auxNoti2 = getDefaultNotification('pedido', pedido, "Pedido reasignado a otro conductor");
                                let dataSendN2 = {
                                    notification: {
                                        title: 'Notificación de pedido',
                                        message: auxNoti2.notificacion,
                                        ids: [pedido.choferId]
                                    }, sms : {
                                        title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8"),
                                        message: auxNoti2.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                    }
                                };
                                sendNotification(dataSendN2, "pedido", pedido.no_pedido, new Date().getTime()+"|Pedido reasignado a otro conductor", function(resp) {});
                            }
                            pedido.choferId = $("#asignarViajeRuta option:selected").data("item").choferId;
                            pedido.phoneChofer = $("#asignarViajeRuta option:selected").data("item").choferPhone;
                            let auxNoti = getDefaultNotification('pedido', pedido);
                            let dataSendN = {
                                notification: {
                                    title: 'Notificación de pedido',
                                    message: auxNoti.notificacion,
                                    ids: [pedido.choferId]
                                }, sms : {
                                    title: pedido.id_cliente+pedido.label+dateFormatFromDate(new Date(), "8")+"2",
                                    message: auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," ")+"\n"+pedido.phoneChofer
                                }
                            };
                            sendNotification(dataSendN, "pedido", pedido.no_pedido, new Date().getTime()+"|"+auxNoti.sms.trim().replace(/(\r\n|\n|\r)/gm," "), function(resp) {
                                $("#asignarViajeModal").modal("hide");
                                swal.close();
                                getServicios();
                            });
                        } else {
                            swal.close();
                            infoMsg('error', 'Error:', "Ocurrio un error al tratar de asignar el viaje al servicio");
                        }            
                    }).catch((error) => {
                        console.log(error);
                        infoMsg('error', 'Error:', "Ocurrio un error al tratar de asignar el viaje al servicio");
                        swal.close();
                    });
                }
            });
        } else {
            $("#asignarViajeModal").modal("hide");
        }
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

    $("#verDetallesCliente").html(pedido.entityidcliente+(pedido.labelAddress ? "-"+pedido.labelAddress : '') + " - " + pedido.nombre_cliente);
    $("#verDetallesTelefono").html(pedido.telefono.trim());
    $("#verDetallesDireccion").html(getDireccionFormat(pedido, "pedido"));
    $("#verDetallesTipoServicio").html(pedido.tipo_cliente.trim());

    $("#verDetallesServicio").html(pedido.documentNumber);
    $("#verDetallesVehiculo").html(getRutaFormat(pedido, "pedido"));
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

    $("#verDetallesContrato").html(pedido.conContrato ? pedido.contrato+'('+pedido.digitoVerificador+')' : 'Sin contrato');
    $("#verDetallesAgenteAtiende").html(pedido.usuario_pedido_solicitud);
    $("#verDetallesTiempoNotificacion").html(pedido.fecha_hora_notificacion ? getRestTime(dateFormatFromString(pedido.fecha_notificacion+(pedido.hora_notificacion ? " "+pedido.hora_notificacion : ''), "1")) : 'Sin asignar');
    $("#verDetallesObservaciones").html(pedido.observaciones ? pedido.observaciones : 'Sin observaciones');

    loadMsg();
    
    let settings = {
        url      : urlGetItemsOpp,
        method   : 'POST',
        data     : JSON.stringify({opp : pedido.no_pedido}),
    }

    setAjax(settings).then((response) => {
        $(".table-desgloce-art tbody").children("tr").remove();
        let totalFinal = 0;
        response.data.forEach(element => {
            let total = Number(element.amount);
            let tax = Number(element.taxAmount);

            if( [deftEstacionarVal].includes( parseInt(element.itemId).toString() ) ) { // Es gas LP
                cantidad = Number(element.quantity);
            }
            else if ( [articuloDesc].includes( parseInt(element.itemId) ) ) { // Es un item de descuento
                cantidad = 1;
            } else { // Se trata de un producto de cilindro
                cantidad = Number(element.quantity).toFixed(0);
                // cantidad = parseFloat(Number(items[key].capacidad) * Number(items[key].quantity)).toFixed(0);
            }

            totalFinal += ( total + tax );

            $('.table-desgloce-art tbody').append(
                '<tr class="'+( element.itemId == articuloDesc ? 'descuento' : '' )+'">'+
                    '<td class="">'+element.item+'</td>'+
                    '<td class="text-center">'+cantidad+'</td>'+
                    '<td class="text-center">$'+parseFloat( total + tax ).toFixed(2)+'</td>'+
                '</tr>'
            )
        });

        $('table.table-desgloce-art tfoot').find('.total-pedido-detalle').text('$'+parseFloat(totalFinal).toFixed(2));
        swal.close();
        $("#formVerDetallesPedidos").modal("show");
    }).catch((error) => {
        console.log(error);
        infoMsg("error", "Ocurrio un error al tratar de obtener los artículos del servicio");
        swal.close();
    });
    
    
    
}

function verDetallesCaso($this) {
    let caso = $($this).closest("tr").data("item");
    loadMsg();
    console.log(caso);
    $("#verDetallesClienteCaso").html(caso.id_cliente + " - " + caso.nombre);
    $("#verDetallesTelefonoCaso").html(caso.telefono.trim());
    $("#verDetallesDireccionCaso").html(getDireccionFormat(caso, "caso"));
    $("#verDetallesTipoServicioCaso").html((caso.tipo_servicio == "2" ? 'Queja' : 'Fuga').trim());

    $("#verDetallesNoCaso").html(caso.numero_caso);
    $("#verDetallesFechaReporte").html(caso.fecha_solicitud);
    $("#verDetallesRecogiCilindroDanado").html(caso.recogiCilindro ? 'Si' : 'No');
    $("#verDetallesRepuseCilindroDanado").html(caso.repuseCilindro ? 'Si' : 'No');
    $("#verDetallesRealiceTrasiego").html(caso.isTrasiego ? 'Si' : 'No');
    $("#verDetallesCantidadRecolectada").html(caso.quantityTrasiego ? caso.quantityTrasiego : '0');
    $("#verDetallesHayFuga").html(caso.hayFuga ? 'Si' : 'No');
    $("#verDetallesPruebaHermetica").html(caso.pruebaHermeticaRealizada ? 'Si' : 'No');
    $("#verDetallesPruebaHermeticaComentario").html(caso.testHermatica ? caso.testHermatica : 'Sin aplicar');
    $("#verDetallesProblemaLocalizado").html(caso.problemAt ? caso.problemAt : 'Sin aplicar');
    $("#verDetallesMotivoReemplazoCilindro").html(caso.motivoReemplazoCil ? caso.motivoReemplazoCil : 'Sin aplicar');
    $("#verDetallesSolucion").html(caso.solution ? caso.solution : 'Sin aplicar');
    $(".table-notas tbody").children("tr").remove();
    $(".table-notas tbody").append('<tr>' +
                                                    '<td colspan="3" class="text-center">' +
                                                        'Sin comentarios'+
                                                    '</td>' +
                                                '</tr>');
    $("#verDetallesServicioAsociado").html(caso.idOpp.trim() ? 'No. documento: ' + caso.Opp.trim().split("#")[1] : 'Sin asociar');    
    $("#verDetallesCasoAsociado").html(caso.relacion_caso_text.trim() ? 'No. caso: ' + caso.relacion_caso_text : 'Sin asociar'); 
    $("#verDetallesArticulo").html(caso.ariculoText.trim() ? caso.ariculoText : 'Sin asociar'); 
    $("#verDetallesAnio").html(caso.yearTanque ? caso.yearTanque : 'Sin asignar');
    $("#verDetallesCapacidad").html(caso.capacidadEstacionario ? caso.capacidadEstacionario : 'Sin asignar');
    $("#verDetallesInicialEvidenciado").html(caso.inicialEvidenciado ? caso.inicialEvidenciado : 'Sin asignar'); 
    $("#verDetallesFinalEvidenciado").html(caso.finalEvidenciado ? caso.finalEvidenciado : 'Sin asignar'); 
    if(caso.tipo_servicio == "1") {
        $("#verDetallesArticulo").parent(".row").removeClass("d-none");
        $("#verDetallesAnio").parent(".row").removeClass("d-none");
        $("#verDetallesCapacidad").parent(".row").removeClass("d-none");
        $("#verDetallesInicialEvidenciado").parent(".row").removeClass("d-none");
        $("#verDetallesFinalEvidenciado").parent(".row").removeClass("d-none");
    } else {
        $("#verDetallesArticulo").parent(".row").addClass("d-none");
        $("#verDetallesAnio").parent(".row").addClass("d-none");
        $("#verDetallesCapacidad").parent(".row").addClass("d-none");
        $("#verDetallesInicialEvidenciado").parent(".row").addClass("d-none");
        $("#verDetallesFinalEvidenciado").parent(".row").addClass("d-none");
    }
    if(caso.estado == "6") {
        $("#verDetallesMotivoReprogramacion").parent(".row").removeClass("d-none");
        $("#verDetallesMotivoReprogramacion").html(caso.motivoReprogramacion);
    } else {
        $("#verDetallesMotivoReprogramacion").parent(".row").addClass("d-none");
    }
    //$("#verDetallesCasoEspecificaciones").html(caso.messageData ? caso.messageData : 'Sin especificaciones');    
    
    let settings = {
        url      : urlGetMessageandNotes,
        method   : 'POST',
        data     : JSON.stringify({case : caso.internalId}),
    }
    setAjax(settings).then((response) => {
        if(response.success) {
            let dataAux = response.noteData;
            console.log(response.messageData);
            let messageData = response.messageData && response.messageData.length > 0 && response.messageData[0].message && response.messageData[0].message.trim() ? response.messageData[0].message : 'Sin especificaciones';
            //console.log(messageData);
            $("#verDetallesCasoEspecificaciones").html(messageData);
            if(dataAux.length > 0) {
                $(".table-notas tbody").children("tr").remove();
            }
            dataAux.forEach(element => {
                if(element.note && element.note.trim()) {
                    let trAux = '<tr>' +
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.author+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.date+'</td>'+
                                    '<td class="ion-text-center sticky-col fw-bold">'+element.note+'</td>'+
                                '</tr>';
                    $(".table-notas tbody").append(trAux);
                }
                
            });
            initTooltips();
            $("#formVerDetallesCaso").modal("show");
        }
        swal.close();
    }).catch((error) => {
        console.log(error);
        swal.close();
    });
    
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
        } else {
            if(element.fecha_hora_notificacion && element.fecha_hora_notificacion <= new Date()) {
                console.log(getRestTime(element.fecha_hora_notificacion, "2"));
              if(getRestTime(element.fecha_hora_notificacion, "2") >= 2) {
                element.status_color = "#f68f1e";
                element.tooltip = 'Más de dos horas notificado';
              } else {
                element.status_color = "#9a9a9a";
                element.tooltip = 'Menos de dos horas notificado';
              }
            }
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
        element.status_color = 'red';
        element.tooltip = 'Cancelados';
      } else if(element.status_id == idEntregado) {
        entregados.push(element);
        element.status_color = 'green';
        element.tooltip = 'Entregados';
      } else if(element.status_id == idPorReprogramar) {
        faltantes.push(element);
      }
    });
    console.log(segundaLlamada);
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
    console.log(segundaLlamada);
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
    console.log(notificados);
    notificados.forEach(element => {
        console.log(element.fecha_hora_notificacion);
      if(element.fecha_hora_notificacion && element.fecha_hora_notificacion <= new Date()) {
          console.log(element.fecha_hora_notificacion, getRestTime(element.fecha_hora_notificacion, "2"));
        if(getRestTime(element.fecha_hora_notificacion, "2") >= 2) {
          element.status_color = "#f68f1e";
          element.tooltip = 'Más de dos horas notificado';
        } else {
            console.log("jojo");
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
    let totalServices = 9;
    countServices += 1;
    if(countServices == totalServices) {
        getServicios();
    }
}

function getMotivosCancelacionCasos() {

    let settings = {
        url      : urlGetMotivosReprogramacionCasos,
        method   : 'GET'
    }

    setAjax(settings).then((response) => {
        $('#motivoReprogramacionQueja').children('option').remove();
        $('#motivoReprogramacionQueja').append('<option value="0">Seleccione una opción</option>');
        response.data.forEach(element => {
            $("#motivoReprogramacionQueja").append(
                '<option data-item=' + "'" + JSON.stringify(element) + "'" + 'value='+element.id+'>'+element.name+'</option>'
            );
        });
        $('#motivoReprogramacionQueja').select2({
            selectOnClose: true,
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
        readyInit();
    }).catch((error) => {
        console.log(error);
    });
}

// Pobla los selects dinámicos de los formularios
loadMsg();
getPlantas();
getStatusOportunidad();
getTiposServicios();
getListCancellReason();
getConceptosCasos();
getArticulos();
getListSuppEmp();
getMethodPayments();
getMotivosCancelacionCasos();