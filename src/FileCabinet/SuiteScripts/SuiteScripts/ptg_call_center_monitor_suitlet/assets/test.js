$(function() {
    $('.select-search-customer').select2({
        ajax: {
            url: urlGetSelectCustomer,
            delay: 450,
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: function (params) {
                let queryParameters = {
                    filtro: params.term,
                    idPlanta : $('select#plantas').val(),
                }

                return JSON.stringify(queryParameters);
            },
            processResults: function (response) {
                if(response.data.length > 0) {
                    response.data = removeDuplicates(response.data, 'idAux');
                    response.data.forEach(element => {
                        element.text = element.nombre + " - " + getDireccionFormat(element, "cliente") + " - " + element.telefono;
                    });
                }
                return {                     
                    results: $.map(response.data, function(obj) {
                        return { id: obj.id, text: obj.text, idAdress: obj.idAdress };
                    })
                };
            },
        },
        placeholder: 'Buscar por nombre, id, teléfono...',
        language: "es"
    });
});

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
    newArray.push(lookupObject[i]);
    }
    return newArray;
}

function getDireccionFormat(item, tipo) { 
    let auxDir = "";
    if(tipo == "pedido") {
        auxDir += (item.street && item.street.trim() ? item.street.trim() : '');
        auxDir += (item.numExterno && item.numExterno.trim() ? (auxDir ? ' #' : '#') + item.numExterno.trim() : '');
        auxDir += (item.numInterno && item.numInterno.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.numInterno.trim() : '');
        auxDir += (item.colonia && item.colonia.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', ' : '') + item.cp.trim() : '');
        auxDir += (item.ciudadDireccion && item.ciudadDireccion.trim() ? (auxDir ? ' ' : '') + capitalizeFirstsLetter(item.ciudadDireccion.trim()) : '');
        auxDir += (item.estadoDireccion && item.estadoDireccion.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.estadoDireccion.trim()) : '');
    } else if(tipo == "caso") {
        auxDir += (item.calleDireccion && item.calleDireccion.trim() ? item.calleDireccion.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.colonia && item.colonia.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', ' : '') + item.cp.trim() : '');
        auxDir += (item.municipio && item.municipio.trim() ? (auxDir ? ' ' : '') + capitalizeFirstsLetter(item.municipio.trim()) : '');
        auxDir += (item.estadoDireccion && item.estadoDireccion.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.estadoDireccion.trim()) : '');
    } else if(tipo == "cliente") {
        auxDir += (item.calle && item.calle.trim() ? item.calle.trim() : '');
        auxDir += (item.nExterior && item.nExterior.trim() ? (auxDir ? ' #' : '#') + item.nExterior.trim() : '');
        auxDir += (item.nInterior && item.nInterior.trim() ? (auxDir ? ' Int. ' : 'Int. ') + item.nInterior.trim() : '');
        auxDir += (item.colonia && item.colonia.trim() ? (auxDir ? ', ' : '') + capitalizeFirstsLetter(item.colonia.trim()) : '');
        auxDir += (item.cp && item.cp.trim() ? (auxDir ? ', C.P. ' : '') + item.cp.trim() : '');
        auxDir += (item.entre1 && item.entre1.trim() ? (auxDir ? ', Entre ' : '') + capitalizeFirstsLetter(item.entre1.trim()) : '');
        auxDir += (item.entre2 && item.entre2.trim() ? (auxDir ? ' y ' : '') + capitalizeFirstsLetter(item.entre2.trim()) : '');
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

// Se podrá solicitar la información de un cliente al seleccionar una opción del listado de resultados
$('.select-search-customer').on("select2:select", function (e) { 
    let clienteId = $(this).val();
    let tieneProductos = $('#sinProductos').hasClass('d-none');
    if ( tieneProductos ) {// Tiene productos agregados
        swal({
            title: 'Tiene un pedido en curso, ¿Está seguro de continuar con la búsqueda de un cliente nuevo?',
            icon: 'warning',
            buttons:{
                cancel: {
                  text: "Cancelar",
                  value: null,
                  visible: true,
                  className: "btn-danger-cc",
                  closeModal: true,
                },
                confirm: {
                  text: "Aceptar",
                  value: true,
                  visible: true,
                  className: "btn-primary-cc",
                  closeModal: true
                }
            },
            dangerMode: true,
            cancelButtonColor: "btn-light" 
        }).then((accept) => {
            if ( accept ) {
                searchCustomer( clienteId, e.params.data.idAdress );
            }
        }).catch(swal.noop);
    } else {
        searchCustomer( clienteId, e.params.data.idAdress );
    }
    $('select.select-search-customer').val(null).trigger("change");
});

// Se inyecta la información del usuario logueado
$('span.user-name').text(userName);
$('span#role').text(userRole);

// Si el rol es distinto a administrador HEB, se eliminan los campos
if ( userRoleId != idAgenteHEB ) {
    console.log(userRole);
    $('.campos-contrato').addClass('d-none');
    // $('.campos-contrato').remove();
} else {
    console.log(userRole);
    $('.campos-contrato').removeClass('d-none');
}

// Función para filtrar clientes por un texto
function searchCustomer(clienteId, idAddress = null) {
    loadMsg('Espere un momento...');

    clearCustomerInfo();

    let dataSearchCustomer = {
        "internalId" : clienteId,
        // "planta"     : $("select#plantas").val(),
    };

    let settings = {
        url    : urlObtenerClientePorId,
        method : 'POST',
        data   : JSON.stringify(dataSearchCustomer),
    }

    setAjax(settings).then((response) => {
        swal.close();
        // console.log('Cliente encontrado', response);
        customerGlobal = response.data[0];
        setCustomerInfo(response.data[0], idAddress);
        $('#filtrarHistorico, #editarCliente, #agregarDireccion, #editarDireccion, #copiarDireccion, #guardarPedido, #agregarProducto, #agregarMetodoPago, #guardarFugaQueja, #historicoCliente, #agregarNotasCliente').attr('disabled', false);
    }).catch((error) => {
        infoMsg('error', 'Cliente no encontrado', 'Verifique que la información sea correcta');
        // Limpia los campos de cliente
        clearCustomerInfo();
        console.log(error);
    });
}

function getCorrectFormat(number) {
    return Intl.NumberFormat('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(number);
}

// Función para enviar la información del cliente al frontend
function setCustomerInfo(customer, idAddress = null) {
    let direcciones = customer.addr;
    let zonaVenta = direccionDefault = null;
    
    $('.badgesClientes').addClass('d-none');
    $('#badgeDescuento').children('span.badge').removeClass('bg-danger-cc, bg-success-cc'); // Se le quita la clase success o danger
    
    $('#idCliente').text(customer.entityId);
    $('#nombreCliente').text(customer.nombreCompleto);
    $('#giroCliente').text(customer.giroCustomer ? customer.giroCustomer : 'Sin giro');
    $('#notasCliente').text(customer.notasCustomer ? customer.notasCustomer : 'Sin notas');
    $('#tipoCliente').text(customer.typeCustomer);
    $('#razonSocialPedido').val(customer.razonSocialFact);
    $('#rfcPedido').val(customer.rfc);
    $("#requiereFacturaPedido").prop("checked", false).trigger("change");
    // Campos del formulario quejas y fugas
    $('#emailFugaQueja').val(customer.email);

    if ( customer.statusCostumer == 'Activo') { $('#badgeActivo').removeClass('d-none'); }
    else if ( customer.statusCostumer == 'Inactivo') { $('#badgeInactivo').removeClass('d-none');  }
    
    // Muestra el badge de descuento
    if ( customer.descuento ) {
        let tipoDescuento  = null;
        let totalDescuento = null;
        let saldoVencido = parseFloat(customer.saldoVencido);
        $('#badgeDescuento').removeClass('d-none');
        if ( saldoVencido > 0 ) {
            $('#badgeDescuento').children('span.badge').addClass('bg-danger-cc');
        } else {
            $('#badgeDescuento').children('span.badge').addClass('bg-success-cc');
        }
        
        tipoDescuento  = 'Pesos';
        totalDescuento = '$'+getCorrectFormat(customer.descuento) + ' MXN';
        $('.descuento-tipo').children('td').siblings("td:nth-child(2)").text(tipoDescuento ? tipoDescuento : 'Sin asignar');
        $('.descuento-cantidad').children('td').siblings("td:nth-child(2)").text(totalDescuento ?? 'Sin asignar');
    }

    // Agrega las direcciones del cliente al select
    $('#direccionCliente').children('option').remove();
    console.log(idAddress, direcciones);
    if ( direcciones.length ) {
        for ( var key in direcciones ) {
            if ( direcciones.hasOwnProperty( key ) ) {
                // Se obtiene la dirección por default
                if ( direcciones[key].defaultShipping ) {
                    direccionDefault = direcciones[key];
                }
                let textoDireccion = setDir(direcciones[key], customer.requiereFactura);
                $('#direccionCliente').append(
                    '<option '+((!idAddress && direcciones[key].defaultShipping) || (idAddress == direcciones[key].idAddressLine) || (idAddress == direcciones[key].idAdress) ? 'selected' : '')+' data-address='+"'"+JSON.stringify(direcciones[key])+"'"+' value="'+direcciones[key].idAddressLine+'">'+textoDireccion+'</option>'
                );
            }
        }
    }
    if ( direccionDefault?.typeService ) {
        $('#direccionCliente').prop('title', setDir( direccionDefault, customer.requiereFactura ));// Activa el tooltip de la dirección
        $('#tipoServicioCliente').text(direccionDefault.typeService);
        setTextRoutesByAddress(direccionDefault);

        initTooltips();
    }
    // Obtiene los casos y oportunidades del cliente
    //getCasosOportunidades();

    // Se obtienen los datos de la colonia
    setColoniaZonaData(direccionDefault);

    // Muestra los casos pendientes si es que existen
    getPendingCases();

    // Muestra la lista de créditos del cliente
    getListCreditCustomer();

    // Muestra la lista de créditos por aprobar, sólo debe ser visible por el usuario con rol supervisor
    getListRmaCustomer();

    //Obtiene valores de comodato
    getComodato();

    //Obtiene notas
    //getMsgNotes(customerGlobal, 'cliente', true);

    //Obtiene historico real de cliente
    //getRealHistoric();
    
    $('#direccionCliente').trigger("change");
}

function getRealHistoric() {
    let dataObtenerPedido = {
        "cliente" : customerGlobal.id,
        "idAddress" : $("#direccionCliente option:selected").data("address").idAdress
    };

    let settings = {
        url      : urlGetRealHistoric,
        method   : 'POST',
        data     : JSON.stringify(dataObtenerPedido),
    }

    $("#table-historico-consumos tbody").children("tr").remove();

    setAjax(settings).then((response) => {
        let auxData = {},
            auxDataArray = [];
        response.data.forEach(element => {
            if(!auxData[element.id]) {
                auxData[element.id] = {
                    id: element.id,
                    fecha_cierre: element.fecha_cierre,
                    total: element.total,
                    articulos: [{
                        id: element.articulo_id,
                        nombre: element.articulo,
                        cantidad: element.cantidad
                    }]
                }
            } else {
                auxData[element.id].articulos.push({
                    id: element.articulo_id,
                    nombre: element.articulo,
                    cantidad: element.cantidad
                });
            }
        });

        Object.keys(auxData).forEach(element => {
            auxDataArray.push(auxData[element]);                
        });

        auxDataArray.forEach(element => {
            let tr ='<tr>'+
                        '<td class="ion-text-center sticky-col"></td>'+
                        '<td class="ion-text-center">'+element.id+'</td>'+
                        '<td class="ion-text-center">'+element.fecha_cierre+'</td>'+
                        '<td class="ion-text-center">';

                element.articulos.forEach(element2 => {
                    tr +=       '<li>'+element2.nombre + '  *  ' + element2.cantidad +'</li>';
                });
                tr +=   '</td>'+
                        '<td class="ion-text-center">$'+element.total+'</td>'+
                    '</tr>';
            $("#table-historico-consumos tbody").append(tr);   
        });
        if(auxDataArray.length == 0) {
            $("#table-historico-consumos tbody").append('<tr>'+
                                                            '<td colspan="5" class="text-center">Sin histórico encontrado</td>'+
                                                        '</tr>');   
        }
        console.log(auxDataArray);
    }).catch((error) => {
        console.log('Error en la consulta', error);
    });
}

// Función para obtener la lista de créditos disponibles
function getComodato() {
    $("#comodatoClienteModal tbody").children("tr").remove();
    let settings = {
        url    : urlGetComoDato+"&id="+customerGlobal.id,
        method : 'GET'
    }

    setAjax(settings).then((response) => {
        console.log(response);
        if(response.success && response.data.length > 0) {
            $("#badgeComodato").removeClass("d-none");
            response.data.forEach(element => {
                $("#comodatoClienteModal tbody").append('<tr>'+
                                                            '<td>'+element.articulo+'</td>'+
                                                            '<td>'+element.cantidad+'</td>'+
                                                        '</tr>')
            });
        }
    }).catch((error) => {
        console.log(error);
    });
}

// Setea los datos dependiendo del tipo de alianza del cliente: contrato, crédito o contado
function setAlianzaComercial(customer, showAlert = true) {
    let tipoAlianza = customer.alianzaComercial.toUpperCase();
    let infoComercial = customer.objInfoComercial;
    $('#badgeAlianza').children('span').removeClass('bg-danger-cc bg-success-cc');
    $('tr.alianza').addClass('d-none');

    // Valida el color que debe mostrar la alianza comercial
    if ( infoComercial.diasAtraso ) {
        console.log('tiene el objeto dias atraso');
        if ( parseInt(infoComercial.diasAtraso) > 0 ) {
            $('#badgeAlianza').children('span').addClass('bg-danger-cc');
        } else {
            $('#badgeAlianza').children('span').addClass('bg-success-cc');
        }
    }
    
    if ( tipoAlianza ==  'CREDITO' ) {
        $('#badgeAlianza').children('span').text('Crédito');
        $('#badgeAlianza').removeClass('d-none');
        $('.alianza-fecha-inicio, .alianza-limite-credito, .alianza-dias-credito, .alianza-saldo-disponible, .alianza-dias-vencidos, .alianza-monto-adeudo, .alianza-saldo-vencido').removeClass('d-none')
        $('.alianza-fecha-alta').children('td').siblings("td:nth-child(2)").text(infoComercial.fechaAlta ? infoComercial.fechaAlta : 'Sin asignar');
        $('.alianza-fecha-inicio').children('td').siblings("td:nth-child(2)").text(customer.fechaContrato ? customer.fechaContrato : 'Sin asignar');
        $('.alianza-limite-credito').children('td').siblings("td:nth-child(2)").text(infoComercial.limiteCredito ? ( '$'+ getCorrectFormat(infoComercial.limiteCredito) +' MXN' ) : 'Sin asignar');
        $('.alianza-dias-credito').children('td').siblings("td:nth-child(2)").text(infoComercial.terms ? infoComercial.terms : 'Sin asignar');
        $('.alianza-saldo-disponible').children('td').siblings("td:nth-child(2)").text(infoComercial.saldoDisponible ? ( '$'+ getCorrectFormat(infoComercial.saldoDisponible) +' MXN' ) : 'Sin asignar');
        $('.alianza-dias-vencidos').children('td').siblings("td:nth-child(2)").text(infoComercial.diasAtraso ? infoComercial.diasAtraso : 'Sin asignar');
        $('.alianza-monto-adeudo').children('td').siblings("td:nth-child(2)").text(infoComercial.creditoUtilizado ? ( '$'+ getCorrectFormat(infoComercial.creditoUtilizado) +' MXN' ) : 'Sin asignar');
        $('.alianza-saldo-vencido').children('td').siblings("td:nth-child(2)").text(infoComercial.saldoVencido ? ( '$'+ getCorrectFormat(infoComercial.saldoVencido) +' MXN' ) : 'Sin asignar');
        if(showAlert) {
            if(Number(infoComercial.saldoDisponible) > 0) {
                showAlertsAux("");
                $("#badgeAlianza span").addClass("bg-success-cc").removeClass("bg-danger-cc");
            } else {
                showAlertsAux("No cuenta con saldo disponible");
                $("#badgeAlianza span").removeClass("bg-success-cc").addClass("bg-danger-cc");
            }
        }
    } else {
        if(showAlert) {
            showAlertsAux("");
        }
    }
}

// Setea los datos de la dirección actual seleccionada del cliente
function setColoniaZonaData(direccion) {
    // Estos campos están en la tarjeta de cliente
    $('#zonaVentaCliente').text('Sin Zona de Venta');
    $('#zonaPrecioCliente').text('Sin Zona de Precio');
    $('#rutaCliente').text("Sin ruta");
    
    // Estos campos están en el formulario de pedido
    $('#zonaVentaPedido, #desdePedido, #hastaPedido, #observacionesPagoPedido').val('');

    let zonaRuta = direccion.dataZoneRoute;

    if(direccion.zonaExp) {
        zonaRuta.territorio = direccion.zonaExp.territorio;
        zonaRuta.precioLt = direccion.zonaExp.precioLt;
        zonaRuta.precioKg = direccion.zonaExp.precioKg;
        zonaRuta.factor = direccion.zonaExp.factor;
    }
    // console.log('Esta es la data de la zona:', zonaRuta);
    let ruta = zonaRuta.nameUbicacionCil;
    let splitRuta = ruta.split(" : ");
    let desde = direccion.ptg_entre_addr;
    let hasta = direccion.ptg_y_addr;
    let horaInicioFormateada = horaFinFormateada = horas = null;
    console.log(zonaRuta);
    $('#zonaVentaCliente').text(zonaRuta.zona_venta);
    $('#zonaPrecioCliente').text(zonaRuta.territorio).data("precioKg", zonaRuta.precioKg).data("precioLt", zonaRuta.precioLt).data("factor", zonaRuta.factor);
    $('#rutaCliente').text(splitRuta[1] ?? "Sin ruta");
    $('#zonaVentaPedido').val(zonaRuta?.zona_venta);
    $('#tipoServicioCliente').text(direccion.typeService ? direccion.typeService : 'Sin tipo de servicio');
    let today = moment().endOf('day');
    $('#fechaPrometidaPedido').val(today.format('YYYY-MM-DD').toString());
    $("#origenPedido").val(origenPedidoDefault);
    /*if ( desde ) {// Si la dirección es de aviso o programado, se setea el campo desde de manera automática
        let medioDia = desde.split(" ");
        let horaInicio = desde.split(":");

        // Se le suma 12 horas por el formato de 24 hrs
        if ( medioDia[1].toUpperCase() == 'PM' ) {
            horas = new Number(horaInicio[0]) + 12;
        } else {
            horas = horaInicio[0];
        }

        let customDate = new Date();
        customDate.setHours(horas);
        customDate.setMinutes(horaInicio[1].split(" ")[0]);

        let horaInicioStr = moment(customDate).format('HH:mm');
        $('#desdePedido').val(horaInicioStr);
    } else {// Se setea por default la hora actual en el campo desde*/
        let horaDefault = moment().format('HH:mm');
        $('#desdePedido').val(horaDefault);
    //}

    if ( hasta ) {
        let medioDia = hasta.split(" ");
        let horaInicio = hasta.split(":");

        // Se le suma 12 horas por el formato de 24 hrs
        if ( medioDia[1].toUpperCase() == 'PM' ) {
            horas = new Number(horaInicio[0]) + 12;
        } else {
            horas = horaInicio[0];
        }

        let customDate = new Date();
        customDate.setHours(horas);
        customDate.setMinutes(horaInicio[1].split(" ")[0]);

        let horaFinStr = moment(customDate).format('HH:mm');
        $('#hastaPedido').val(horaFinStr);
    }
}

// Función para configurar el formato / texto de la dirección de un cliente
function setDir(direccion, requiereFactura = false) {
    let str = '';

    str += direccion.nameStreet;
    direccion.numExterno      ? str+= ' #'+direccion.numExterno : '';
    direccion.numInterno      ? str+= ' #'+direccion.numInterno : '';
    direccion.entreCalle      ? str+= ' Entre '+direccion.entreCalle : '';
    direccion.entreYCalle     ? str+= ' Y '+direccion.entreYCalle : '';
    direccion.colonia         ? str+= ', Col. '+direccion.colonia : '';
    direccion.zip             ? str+= ', C.P. '+direccion.zip : '';
    direccion.stateName       ? str+= ', '+direccion.stateName : '';
    direccion.city            ? str+= ', '+direccion.city : '';
    console.log(requiereFactura);
    if(requiereFactura) {
        direccion.defaultBilling  ? str+= ', Facturación' : '';
    }     

    return str;
}

// Función para obtener la lista de estatus de las oportunidades
function getListaStatusOpp() {
    let settings = {
        url      : urlGetEstadosOpp,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        estadosOppArr = response.data;
        setSelectEstatusOpp(estadosOppArr);
    }).catch((error) => {
        console.log(error);
    });
}

// Función para obtener las plantas
function getPlantas() {
    loadColonias = true;
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

// Función para obtener los artículos
function getArticulos() {
    let settings = {
        url      : urlObtenerArticulos,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectArticulos((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Función para obtener los tipos de pago
function getMetodosPago() {
    let settings = {
        url      : getMethodPayments,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectMetodosPago((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Función para obtener la lista de cuentas disponibles para los prepagos
function getListaCuentas(metodoId) {
    let params = {
        "subsidiary"    : userSubsidiary,
        //"subsidiary"    : 25,
        "methodPayment" : metodoId
    }
    let settings = {
        url      : urlGetAccountsPrepayment,
        method   : 'POST',
        data     : JSON.stringify(params)
    }

    setAjax(settings).then((response) => {
        setSelectListaCuenta((response.data));
    }).catch((error) => {
        console.log(error);
    });
}


// Función para obtener la lista de origen del servicio
function getServiceOrigin() {
    let settings = {
        url      : urlGetServicesOriginList,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectServiceOrigin((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Función para obtener los giros de negocio
function getBusinessType() {
    let settings = {
        url      : urlGetBusinessType,
        method   : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectBusinessType((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Obtiene la lista de cancelación
function getListaCancelacion() {
    let settings = {
        url    : urlGetListaCancelacion,
        method : 'GET',
    }

    setAjax(settings).then((response) => {
        setSelectCancelacion((response.data));
    }).catch((error) => {
        console.log(error);
    });
}

// Pobla los selects dinámicos de los formularios
getPlantas();
getArticulos();
getMetodosPago();
getBusinessType();
getServiceOrigin();
getListaStatusOpp();
getListaCancelacion();

// Método para llenar el select de plantas
function setSelectPlants(items) {
    if ( items.length ) {
        $('select#plantas').children('option').remove();
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#plantas").append(
                    '<option data-pedido-minimo="'+parseFloat(items[key].min)+'" value='+items[key].id+'>'+items[key].nombre+'</option>'
                );
            }
        }
        getEstados();
        $('title').html($("#plantas option:selected").text());
    } else {
        console.warn('No hay plantas por cargar');
    }
}

// Método para llenar los select de artículos
function setSelectArticulos(items) {
    if ( items.length ) {
        articulosArr = items;
        $('select#articuloFrecuenteCilFormCliente, select#articuloFrecuenteEstFormCliente, select#capacidadFormProductos, select#articuloFugaQueja').children('option').remove();
        $('select#articuloFugaQueja').append('<option value="">Seleccione una opción</option>')
        // $('select#articuloFrecuenteEstFormCliente').children('option').remove();
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                let articulo = '<option value='+items[key].id+' data-articulo=' + "'" + JSON.stringify(items[key]) + "'" + '>'+(items[key].tipo_articulo == idEstacionarioTipo ? 'GAS LP' : items[key].nombre)+'</option>';
                if ( items[key].tipo_articulo == idCilindroTipo ) {// Cilindro
                    $("select#articuloFrecuenteCilFormCliente, select#capacidadFormProductos").append( articulo );
                } else if ( items[key].tipo_articulo == idEstacionarioTipo ) {// Estacionario
                    $("select#articuloFrecuenteEstFormCliente").append( articulo );
                }

                if ( [idCilindroTipo, idEstacionarioTipo].includes(Number(items[key].tipo_articulo)) ) {
                    $("select#articuloFugaQueja, select#filtroTipoProductoCaso").append( articulo );
                }
            }
        }
    } else {
        articulosArr = [];
        console.warn('No hay artículos por cargar');
    }
}

// Método para llenar el select de método de pago
function setSelectMetodosPago(items) {
    $('select#metodoPagoPedido').children('option').remove();
    if ( items.length ) {
        metodosPago = items;
        $("select#metodoPagoPedido").append('<option value="">Seleccione una opción</option>')
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                let metodo = items[key];
                let metodoId = parseInt(metodo.id);
                let classMethod = '';

                if ( metodoId == metodoCredito ) { classMethod = 'opt-method-credito-cliente d-none'; } // Es método crédito de cliente
                else { classMethod = 'opt-method-normal'; } // Es método de pago normal

                if ( metodoId != metodoMultiple ) {// Si es diferente a método de pago múltiple, se añade al select
                    $("select#metodoPagoPedido").append(
                        '<option class="'+classMethod+'" value='+metodo.id+'>'+metodo.method+'</option>'
                    );
                }
            }
        }
    } else {
        console.warn('No hay métodos de pago por cargar');
    }
}

// Método para llenar el select de la lista de cuentas acorde al prepago seleccionado
function setSelectListaCuenta(items) {
    $('select#tipoCuenta').children('option').remove();
    if ( items.length ) {
        // $("select#tipoCuenta").append('<option value="0">Seleccione una opción</option>')
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                let cuenta = items[key];

                $("select#tipoCuenta").append(
                    '<option value='+cuenta.accountId+'>'+cuenta.account+'</option>'
                );
            }
        }
    } else {
        console.warn('No hay métodos de pago por cargar');
    }
}

// Método para llenar el select de origen de servicio
function setSelectServiceOrigin(items) {
    $('select#origenPedido').children('option').remove();
    if ( items.length ) {
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#origenPedido").append(
                    '<option value='+items[key].id+'>'+items[key].name+'</option>'
                );
            }
        }
        $("#origenPedido").val(origenPedidoDefault);
    } else {
        console.warn('No hay registros por cargar');
    }
}

// Método para llenar el select de giro de negocio
function setSelectBusinessType(items) {
    $('select#giroNegocioFormCliente').children('option').remove();
    if ( items.length ) {
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#giroNegocioFormCliente").append(
                    '<option value='+items[key].id+'>'+items[key].name+'</option>'
                );
            }
        }
    } else {
        console.warn('No hay registros por cargar');
    }
}

// Método para llenar el select de los estatus de la oportunidad
function setSelectEstatusOpp(items) {
    if ( items.length ) {
        $('select#estadoSolicitudFiltro').children('option').remove();
        $("select#estadoSolicitudFiltro").append('<option value="">Seleccione una opción</option>');

        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#estadoSolicitudFiltro").append(
                    '<option value='+items[key].id+'>'+items[key].nombre+'</option>'
                );
            }
        }
    } else {
        console.warn('No hay plantas por cargar');
    }
}


// Método para llenar el select de motivos de cancelación para un caso u oportunidad
function setSelectCancelacion(items) {
    $('select#cancelarOppMotivo').children('option').remove();
    if ( items.length ) {
        $("select#cancelarOppMotivo").append('<option value="">Seleccione una opción</option>')
        for ( var key in items ) {
            if ( items.hasOwnProperty( key ) ) {
                $("select#cancelarOppMotivo").append(
                    '<option value='+items[key].id+'>'+items[key].name+'</option>'
                );
            }
        }
    } else {
        console.warn('No hay registros por cargar');
    }
}


// Función y ajax para obtener los pedidos
function getCasosOportunidades(showPend = true) {
    clearTable();
    let dataObtenerPedido = {
        "id" : customerGlobal.id,
        "idAddress" : $("#direccionCliente option:selected").data("address").idAdress
    };

    let settings = {
        url      : urlObtenerPedidos,
        method   : 'POST',
        data     : JSON.stringify(dataObtenerPedido),
    }

    // Se remueven registros previos
    $('div#historic-data table.table-gen tbody').children('tr').remove();
 
    $('select#asociarServicioFugaQueja, select#asociarCasoFugaQueja').children('option').remove();
    $('select#asociarServicioFugaQueja, select#asociarCasoFugaQueja').append('<option value="">Seleccione una opción</option>');

    setAjax(settings).then((response) => {
        // console.log('pedidos obtenidos exitósamente', response);
        pedidosGlobal = JSON.parse(response.data);
        setCasosOportunidades(JSON.parse(response.data));
    }).catch((error) => {
        console.log('Error en la consulta', error);
    });
}

$('body').delegate('.sort-grid-pedidos', 'click', function () {
    $('div#historic-data table.table-gen tbody').children('tr').remove();
 
    $('select#asociarServicioFugaQueja, select#asociarCasoFugaQueja').children('option').remove();
    $('select#asociarServicioFugaQueja, select#asociarCasoFugaQueja').append('<option value="">Seleccione una opción</option>');
    setCasosOportunidades(pedidosGlobal, ($(this).find("i").hasClass('fa-sort-down') ? 'asc' : 'desc'), false);
});

// Valida el contenido de casos y oportunidades y llama la función setTrOppCases
function setCasosOportunidades( data, tipo ="desc", showPend = true ) {
    //$('div#historic-data').fadeOut();
    let casos         = data.casos;
    let oportunidades = data.oportunidades;
    let auxData       = casos.concat(oportunidades);
    let pendientes    = [];
    let totalRows     = data.casos.length + data.oportunidades.length;
    console.log('Casos', casos);
    console.log('Oportunidades', oportunidades);

    $("div#historic-data table thead tr th").css('z-index', "3");
    $($("div#historic-data table thead tr th")[0]).css('z-index', "4");
    $($("div#historic-data table thead tr th")[1]).css('z-index', "4");
    // $($("div#historic-data table thead tr th")[2]).css('z-index', "4");

    auxData.forEach(element => {
        if(element.numeroCaso) {
            element.fechaAux = dateFormatFromString(element.fechaCreacion.split(" ")[0], "2");
        } else {
            element.fechaAux = dateFormatFromString(element.fecha, "2");
        }
    });

    auxData.sort(dynamicSort("fechaAux"));

    if(tipo == "desc") {
        auxData.reverse();
        $(".sort-grid-pedidos").find("i").removeClass("fa-sort-up").addClass("fa-sort-down");
    } else {
        $(".sort-grid-pedidos").find("i").removeClass("fa-sort-down").addClass("fa-sort-up");
    }

    console.log('auxData', auxData);

    auxData.forEach(element => {
        $('div#historic-data table.table-gen tbody').append(
            setTrOppCases( element, element.numeroCaso ? 'casos' : 'oportunidades', auxData.length, null )
        );

        if(element.numeroCaso) {
            $('select#asociarCasoFugaQueja').append('<option value="'+element.id_Transaccion+'">No. caso: '+element.numeroCaso+' - Fecha visita: '+element.fecha_visita+'</option>');
        } else {
            if ( [idAsignado,idPorNotificar,idPorConfirmar,idPorReprogramar].includes(parseInt(element.estadoId)) ) {
                pendientes.push(element);
            }
            $('select#asociarServicioFugaQueja').append('<option value="'+element.id_Transaccion+'"> No. servicio: '+element.numeroDocumento+' - Fecha: '+element.fecha+'</option>');
        }
    });

    // Enlista el número de documento de la oportunidad
    if ( showPend && pendientes.length ) {

        showAlertsAux("Tiene pedido(s) pendiente(s)");
        $('#badgePendientes').removeClass('d-none');
        $('table.opp-pendientes').children('tbody').children('tr').remove();

        for (let x = 0; x < pendientes.length; x++) {
            $('table.opp-pendientes tbody').append(
                '<tr>'+
                    '<td class="ion-text-center">'+pendientes[x].fecha+'</td>'+
                    '<td class="ion-text-center">'+pendientes[x].cierrePrevisto+'</td>'+
                    '<td class="ion-text-center">'+pendientes[x].numeroDocumento+'</td>'+
                    '<td class="ion-text-center">'+( pendientes[x].conductorAsignado ? pendientes[x].conductorAsignado : 'Sin asignar' )+'</td>'+
                '</tr>'
            );
        }
    } else {
        showAlertsAux("");
    }

    // Vuelve a mostrar la tabla
    initTable();
    if ($(".btn-expand").find("i").hasClass('fa-caret-right')) {
        $("tfoot").addClass("expand");
    } else {
        $("tfoot").removeClass("expand");
    }
    // $('div#historic-data table').DataTable();
    //$('div#historic-data').fadeIn('slow');
}

function initTable() {
    $('div#historic-data table').fancyTable({
        pagination: true,
        perPage: 10,
        searchable:false,
        sortable: false
    });
}

// Método para llenar la tabla de casos y oportunidades
function setTrOppCases(item, type = 'casos', numItems = 1, posicion) {
    let tr = 
    '<tr class='+type+' data-item='+"'"+JSON.stringify(item)+"'"+'>'+
        '<td class="text-center sticky-col">'+  
            '<div class="btn-group dropend vertical-center drop-options-'+item.id_Transaccion+' d-none '+type+'">'+
                '<i class="fa-solid fa-ellipsis-vertical c-pointer dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" style="font-size: 24px;"></i>'+
                '<ul class="dropdown-menu" style="width: 230px">'+
                    '<li onclick="verDetalles(this)" class="'+type+' px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-eye color-primary"></i> Ver detalles'+
                    '</li>'+
                    (type == 'oportunidades' && (item.estadoId == idPorNotificar || item.estadoId == idAsignado) ? '<li onclick="gestionarServicio(this)" class="px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-gears color-primary"></i> Gestionar servicio'+
                    '</li>' : '')+
                    '<li onclick="verNotasAdicionales(this)" class="'+type+' px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-list color-primary"></i> Ver comentarios'+
                    '</li>'+
                    '<li onclick="verNotasAgregarDescuento(this)" class="'+(type) +' '+ (type == 'oportunidades' && userRoleId == idSupervisor ? '' : 'd-none')+' px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-tag color-primary"></i> Agregar descuento'+
                    '</li>'+
                    (type == 'oportunidades' && (item.estadoId == idPorNotificar || item.estadoId == idAsignado) && !item.solicitudCancelacion ? '<li onclick="cancelarPedido(this)" class="'+type+' px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-circle-xmark text-danger"></i> Solicitud de cancelación'+
                    '</li>' : '')+
                    (type == 'oportunidades' && (item.estadoId == idPorNotificar || item.estadoId == idAsignado) && !item.solicitudCambioFecha ? '<li onclick="cambiarFechaPedido(this)" class="'+type+' px-2 py-1 c-pointer" style="font-size: 16px">'+
                        '<i class="fa-solid fa-calendar color-primary"></i> Solicitud de cambio de fecha'+
                    '</li>' : '')+
                '</ul>'+
            '</div>'+
        '</td>'+
        '<td style="left: 40px;" class="text-center sticky-col">'+
            '<div class="text-center">'+
                '<input class="form-check-input check-opp-caso '+type+'" type="checkbox" value="" id="'+item.id_Transaccion+'">'+
            '</div>'+
        '</td>'+
        // '<td style="left: 80px;" class="sticky-col"><button class="btn btn-danger"></button></td>'+
        '<td>'+( type == "casos" ? ( item.asunto ?? 'Sin asignar' ) : ( 'Pedido' ) )+'</td>'+// Asunto
        '<td>'+( type == "casos" ? ( item.estatus ?? 'Sin asignar' ) : ( item.estado ?? 'Sin asignar' ) )+'</td>'+// Estado
        '<td>'+( type == "casos" ? dateFormatFromDate(item.fechaCreacion.split(" ")[0], '5')  : dateFormatFromDate(item.fecha, '5') )+'</td>'+//Fecha creación
        '<td>'+( type == "casos" ? ( 'Sin fecha prometida' ) : (item.cierrePrevisto ?? 'Sin fecha prometida') )+'</td>'+// Fecha prometida
        '<td>'+( type == "casos" ? ( item.dateClose ? item.dateClose : 'Sin asignar' ) : ('N/A') )+'</td>'+// Fecha de cierre, sólo para casos
        '<td>'+( type == "casos" ? ( item.articulo ?? 'Sin asignar' ) : ( item.tipoServicio ? item.tipoServicio : 'Sin asignar' ) )+'</td>'+// Tipo servicio
        '<td>'+( item.ultimaNota ? item.ultimaNota : 'Sin notas' )+'</td>'+// Ultima nota
        '<td>'+( type == "casos" ? ( item.numeroCaso ?? 'Sin asignar' ) : ( item.numeroDocumento ?? 'Sin asignar' ) )+'</td>'+// Numero de documento u caso
        '<td>'+( type == "casos" ? ( 'N/A' ) : ( item.representanteVentas ?? 'Sin asignar' ) )+'</td>'+// Atendido por
        '<td>'+( type == "casos" ? ( 'N/A' ) : ( item.rutaAsignada ? getRouteNumber(item.rutaAsignada) : 'Sin asignar' ) )+'</td>'+// Ruta
        '<td class="'+(isAdmin ? '' : 'd-none')+'">'+( item.id_Transaccion ?? 'Sin ID de servicio')+'</td>'+
        // '<td>'+( type == "casos" ? ( item.prioridad ?? 'Sin asignar' ) : 'N/A' )+'</td>'+// Prioridad
    '</tr>';

    return tr;
}

// Método para limpiar la data del cliente cuando falla una búsqueda
function clearCustomerInfo () {
    // Se eliminan todos los tooltips
    $('.tooltip').remove();
    
    // Inhabilita el botón de agregar dirección
    $('#filtrarHistorico, #editarCliente, #agregarDireccion, #editarDireccion, #copiarDireccion, #guardarPedido, #agregarProducto, #agregarMetodoPago, #guardarFugaQueja, #historicoCliente').attr('disabled', true);
        
    // Se reinician los labels
    $('#idCliente').text('0');
    $('#nombreCliente').text('Busque un cliente');
    $('#telefonoCliente').text('Sin teléfono');
    $('#giroCliente').text('Sin giro');
    $('#contratoCliente').text('Pendiente de validar');
    $('#zonaVentaCliente').text('Sin Zona de Venta');
    $('#zonaPrecioCliente').text('Sin Zona de Precio');
    $('#notasCliente').text('Sin Notas');
    $('#tipoCliente').text('Sin tipo cliente');
    $('#tipoServicioCliente').text('Sin servicio');
    $('#rutaCliente').text('Sin ruta');
    // Se resetean las rutas
    $('#rutaMat, #rutaVesp').text('Sin ruta');

    // Se reinicia el select de las direcciones
    $('select#direccionCliente').children('option').remove();
    $('select#direccionCliente').append('<option>Sin direcciones</option>');

    // Se quitan los casos y oportunidades
    $('div#historic-data table.table-gen tbody').children('tr').remove();

    // Se remueven los datos personalizados del cliente del form de pedidos
    $('#desdePedido, #hastaPedido, #zonaVentaPedido').val('');

    // Se remueven los datos personalizados del cliente en quejas y figas
    $('#emailFugaQueja, #telefonoFugaQueja').val('');
    
    // Se remueven los badge de información adicional del cliente
    $('.badgesClientes').addClass('d-none');

    // Se oculta el select de casos pendientes
    $('select#casoPedido').parent().parent().addClass('d-none');
    $('select#casoPedido').children('option').remove();
    customerGlobal = null;
    resurtidosPendientesCliente = null;

    $("#notasClientes tbody").children("tr").remove();
    $("#notasClientes tbody").append('<tr><td class="text-center" colspan="3">Sin notas</td></tr>');
    resetProductList();
}

// Resetea la tabla de productos de los pedidos y métodos de pago
function resetProductList(){
    // Productos
    $('.productosCilindroPedido').children('tbody').children('tr').remove();
    $('.productosEstacionarioPedido').children('tbody').children('tr').remove();

    $('.productosCilindroPedido').parent().parent().addClass('d-none');
    $('.productosEstacionarioPedido').parent().parent().addClass('d-none');
    
    $('#sinProductos').removeClass('d-none');
    
    // Métodos de pago
    $('.productosMetodoPago').children('tbody').children('tr').remove();
    $('.productosMetodoPago').parent().parent().addClass('d-none');
    $('#sinMetodosPago').removeClass('d-none');
    
}

function setDefaultItem() {
    if($("#direccionCliente").val() && $("#direccionCliente").val() != 'Sin direcciones' && $('#zonaPrecioCliente').data("precioKg") && $('#zonaPrecioCliente').data("precioLt")) {
        let direccion = $("#direccionCliente option:selected").data("address");
        let prices = 0;
        if ( direccion.typeServiceId == idCilindro ) {
            prices = Number($('#zonaPrecioCliente').data("precioKg"));
        } else if ( direccion.typeServiceId == idEstacionario || direccion.typeServiceId == idMontacarga ) {
            prices = Number($('#zonaPrecioCliente').data("precioLt"));
        }
        let item1Capacidad = Number(parseInt(direccion.item1Capacidad));
        let auxArt = {};
        articulosArr.forEach(element => {
            if(element.id == direccion.item1Id) {
                auxArt = element;
            }
        });
        let capacidad = parseInt( ( auxArt && auxArt.capacidad_litros ? auxArt.capacidad_litros : 0 ) );
        if(direccion.typeServiceId == idCilindro) {
            let articulo  = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 1,
                "capacity"  : capacidad,
                "quantity"  : item1Capacidad,
                "article"   : direccion.item1Id
            };
            let subtotal = parseFloat( Number(capacidad) *  Number(item1Capacidad) * Number(prices));
            let total    = parseFloat( Number(subtotal) * 1.16 );

            $(".productosCilindroPedido tbody").append(
                '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                    '<td class="text-center">'+(auxArt && auxArt.nombre ? auxArt.nombre : 'Sin nombre asignado')+'</td>'+
                    '<td class="text-center">'+articulo['quantity']+'</td>'+
                    '<td class="text-center">'+capacidad+' kg</td>'+
                    '<td class="text-center" data-total='+total+'>$'+getCorrectFormat(total)+' MXN</td>'+
                    // '<td class="text-center">'+(envase ? 'Si' : 'No')+'</td>'+
                    '<td class="text-center">'+
                        '<button class="btn btn-sm btn-info edit-producto-cil"> <i class="fa fa-pen-to-square"></i> </button> '+
                        '<button class="btn btn-sm btn-danger delete-producto-cil" data-table-ref=".productosCilindroPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                    '</td>'+
                '</tr>'
            );
            $('#sinProductos').addClass('d-none');
            $('.productosCilindroPedido').parent().parent().removeClass('d-none');
            setTotalPedido( $(".productosCilindroPedido") );
        } else if(direccion.typeServiceId == idEstacionario) {
            let articulo = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 2,
                "capacity"  : item1Capacidad,
                "quantity"  : 1,
                "article"   : articuloGasLp// ID de GAS LP
            };
            let subtotal = parseFloat(item1Capacidad * prices); 
            
            let total = parseFloat(subtotal * 1.16);
            
            $('#sinProductos').addClass('d-none');
            $('.productosEstacionarioPedido').parent().parent().removeClass('d-none');
            $(".productosEstacionarioPedido tbody").append(
                '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                    '<td>Gas LP</td>'+
                    //'<td class="text-center">1</td>'+
                    '<td class="text-center">'+item1Capacidad+'</td>'+
                    '<td class="text-center" data-total='+total+'>$'+getCorrectFormat(total)+' MXN</td>'+
                    '<td class="text-center">'+
                        '<button class="btn btn-sm btn-info edit-producto-est"> <i class="fa fa-pen-to-square"></i> </button> '+
                        '<button class="btn btn-sm btn-danger delete-producto-est" data-table-ref=".productosEstacionarioPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                    '</td>'+
                '</tr>'
            );
            setTotalPedido( $(".productosEstacionarioPedido") );
        } else if(direccion.typeServiceId == idMontacarga) {
            let articulo = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 2,
                "capacity"  : item1Capacidad,
                "quantity"  : 1,
                "article"   : articuloGasLp+"|"+new Date().getTime()// ID de GAS LP
            };
            let subtotal = parseFloat(item1Capacidad * prices); 
            
            let total = parseFloat(subtotal * 1.16);
            
            $('#sinProductos').addClass('d-none');
            $('.productosEstacionarioPedido').parent().parent().removeClass('d-none');
            $(".productosEstacionarioPedido tbody").append(
                '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                    '<td>Montacarga Gas LP</td>'+
                    //'<td class="text-center">1</td>'+
                    '<td class="text-center">'+item1Capacidad+'</td>'+
                    '<td class="text-center" data-total='+total+'>$'+getCorrectFormat(total)+' MXN</td>'+
                    '<td class="text-center">'+
                        '<button class="btn btn-sm btn-info edit-producto-est"> <i class="fa fa-pen-to-square"></i> </button> '+
                        '<button class="btn btn-sm btn-danger delete-producto-est" data-table-ref=".productosEstacionarioPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                    '</td>'+
                '</tr>'
            );
            setTotalPedido( $(".productosEstacionarioPedido") );
        }
        
        $(".productosMetodoPago tbody").children("tr").remove();
        let totalProducto = 0;
        if (! $('.productosEstacionarioPedido').parent().parent().hasClass('d-none') ) {// Estacionario
            totalProducto = $('.productosEstacionarioPedido').children('tfoot').find('td.total').data('total');
        } else if (! $('.productosCilindroPedido').parent().parent().hasClass('d-none') ) {// Cilindro
            totalProducto = $('.productosCilindroPedido').children('tfoot').find('td.total').data('total');
        }

        $('#montoPagoPedido').val(totalProducto);

        $('#sinMetodosPago').addClass('d-none');
        $('.productosMetodoPago').parent().parent().removeClass('d-none');
        let metodoObj    = {
            metodo_txt   : 'Efectivo',
            tipo_pago    : 1,
            tipo_cuenta  : null,
            tipo_tarjeta : null,
            monto        : totalProducto,
            folio        : "",
        };
        agregarMetodoPago(metodoObj);
        setTotalMetodoPago( $(".productosMetodoPago") );
    }
}

// Muestra un mensaje de cargando...
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

// Regresa el valor de un input tiempicker al formato de netsuite
function formatTime(value, format = 'hh:mm a') {
    if ( value ) {
        let hora = value.split(':');
        let customDateTime = new Date();
    
        if ( hora.length ) {
    
            customDateTime.setHours(hora[0]);
            customDateTime.setMinutes(hora[1]);
    
            return moment(customDateTime).format(format);
    
        }
    }

    return '';
}

// Debe limpiarse el formulario
$('select#plantas').on('change', function(e) {
    $('title').html($("#plantas option:selected").text());
    clearCustomerInfo();
    resetProductList();
    clearFields();
    getEstados();
});

// Valida que el valor introducido a un input siempre sea de tipo numérico con máximo 2 decimales
function onlyNumbers(value, input) {
    /*value = value.replace(/[^0-9.]/g, ''); 
    value = value.replace(/(\..*)\./g, '$1');
    value = (value.indexOf('.') >= 0) ? (value.substr(0, value.indexOf('.')) + value.substr(value.indexOf('.'), 3)) : value;
    
    $(input).val(value);*/
}

// Muestra un sweetalert personalizado
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

function confirmMsg(type, title, callback) {

    let swalObj = {
        title: title,
        icon: type ?? 'info',
        buttons:{
            cancel: {
              text: "Cancelar",
              value: null,
              visible: true,
              className: "btn-danger-cc",
              closeModal: true,
            },
            confirm: {
              text: "Aceptar",
              value: true,
              visible: true,
              className: "btn-primary-cc",
              closeModal: true
            }
        },
        closeOnEsc: false,
        closeOnClickOutside: false,
    };

    swal(swalObj).then((resp) => {
        callback(resp);
    }).catch(swal.noop);
}

// Método para ver el detalle de los casos y/o oportunidades
function verDetalles($this) {
    $('.campos-casos, .campos-oportunidad, .campos-art, .campos-metodos-pago, .casos-imagenes').addClass('d-none');
    $('table.table-notas tbody').children('tr').remove();
    $('table.table-desgloce-art tbody').children('tr').remove();
    $('table.table-desgloce-metodos-pago tbody').children('tr').remove();
    $('.casos-imagenes').children().remove();
    
    let direccion = '';
    let pedido   = $($this).closest("tr").data("item");
    let ruta     = pedido.rutaAsignada;
    let vehiculo = ruta ? getRouteNumber(ruta) : 'Sin asignar';
    console.log(pedido);

    // Datos generales del modal
    $("#verDetallesCliente").html(customerGlobal.entityId+(pedido.label ? "-"+pedido.label : '') + " - " + customerGlobal.nombreCompleto);
    $("#verDetallesTipoServicio").html(customerGlobal.typeCustomer.trim());
    $("#verDetallesTelefono").html(customerGlobal.telefono.trim());
    $("#verDetallesDireccion").html('');
    
    if ( $($this).hasClass('oportunidades') ) {

        pedido['street']          ? direccion+= pedido['street'] : '';
        pedido['numExterno']      ? direccion+= ' Num. Ext. '+pedido['numExterno'] : '';
        pedido['numInterno']      ? direccion+= ' Num. Int. '+pedido['numInterno'] : '';
        pedido['colonia']         ? direccion+= ', Col. '+pedido['colonia'] : '';
        pedido['zip']             ? direccion+= ', C.P. '+pedido['zip'] : '';
        pedido['ciudadDireccion'] ? direccion+= ', '+pedido['ciudadDireccion'] : '';
        pedido['estadoDireccion'] ? direccion+= ', '+pedido['estadoDireccion'] : '';
        // pedido['zonaVenta']  ? direccion+= 'Zona de venta: '+pedido['zonaVenta'] : '';
        // pedido['ruta']       ? direccion+= 'Ruta: '+pedido['ruta'] : '';

        $("#verDetallesServicio").html(pedido.numeroDocumento);
        $("#verDetallesDireccion").html(direccion ? direccion : 'Sin asignar');
    
        $("#verDetallesVehiculo").html(vehiculo);
        // $("#verDetallesVehiculo").html(pedido.vehiculo ? pedido.vehiculo.trim() : 'Sin asignar');
        $("#verDetallesZona").html(pedido.zone ? pedido.zone : 'Sin asignar');
        $("#verDetallesUsuarioMonitor").html(pedido.monitor ? pedido.monitor.trim() : 'Sin asignar');
        $("#verDetallesDireccion2").html(direccion);
        // $("#verDetallesDireccion2").html($('#direccionCliente').children(':selected').text());
        // $("#verDetallesFechaPrometida").html(dateFormatFromDate(pedido.fecha_prometida, '5'));
        $("#verDetallesFechaPrometida").html(pedido.cierrePrevisto ? pedido.cierrePrevisto : 'Sin asignar');
        $("#verDetallesFechaPedido").html(pedido.fecha ? pedido.fecha : 'Sin asignar');
        // $("#verDetallesFechaPedido").html(pedido.fecha ? dateFormatFromDate(pedido.fecha, '5') : 'Sin asignar');
        $("#verDetallesFechaNotificacion").html(pedido.fechaNotificacion ? pedido.fechaNotificacion : 'Sin asignar');// Usar el método de Alexis para ver la hora
        $("#verDetallesAgenteAtiende").html(pedido.representanteVentas ? pedido.representanteVentas : userName);
        $("#verDetallesConductorAsignado").html(pedido.conductorAsignado ? pedido.conductorAsignado : 'Sin asignar');
        $("#verDetallesRuta").html(pedido.rutaAsignada ? pedido.rutaAsignada : 'Sin asignar');
        $("#verDetallesTipoProducto").html(pedido.tipoServicio ? pedido.tipoServicio : 'N/A');
        $("#verDetallesObservaciones").html(pedido.nota ? pedido.nota : 'Sin asignar');
        
        $("#verDetallesTiempoNotificacion")
        .html(pedido.horaNoti ? 
            getRestTime(dateFormatFromString(pedido.fechaNotificacion+(pedido.horaNoti ? " "+pedido.horaNoti : ''), "2")) 
            : 'Sin asignar'
        );

        $('.campos-oportunidad').removeClass('d-none');
       
        setMetodosPago(pedido, 'oportunidad');
        getMsgNotes(pedido, 'oportunidad');
        getItemPedido(pedido, 'oportunidad');

    } else if ( $($this).hasClass('casos') ) {

        pedido['calle']        ? direccion+= pedido['calle'] : '';
        pedido['nExterior']    ? direccion+= ' Num. Ext. '+pedido['nExterior'] : '';
        pedido['nInterior']    ? direccion+= ' Num. Int. '+pedido['nInterior'] : '';
        pedido['colonia']      ? direccion+= ', Col. '+pedido['colonia'] : '';
        pedido['codigoPostal'] ? direccion+= ', C.P. '+pedido['codigoPostal'] : '';
        pedido['municipio']    ? direccion+= ', '+pedido['municipio'] : '';
        pedido['estado']       ? direccion+= ', '+pedido['estado'] : '';

        $("#verDetallesServicio").html(pedido.numeroCaso);
        $("#verDetallesDireccion").html( direccion );

        $(".casos-tipo").html(pedido.asunto ? pedido.asunto.trim() : 'Sin asignar');
        $(".casos-concepto").html(pedido.conceptoCaso ? pedido.conceptoCaso : 'Sin asignar');
        $(".casos-fecha-visita").html(pedido.fecha_visita ? pedido.fecha_visita : 'Sin asignar');
        $(".casos-horario-preferido").html(pedido.hora_visita ? pedido.hora_visita : 'Sin asignar');
        $(".casos-articulo").html(pedido.articulo ? pedido.articulo : 'Sin asignar');
        $(".casos-prioridad").html(pedido.prioridad ? pedido.prioridad : 'Sin asignar');
        $(".casos-email").html(pedido.email ? pedido.email : 'Sin asignar');
        $(".casos-telefono").html($("#direccionCliente option:selected").data("address").telefonoPrincipal ? $("#direccionCliente option:selected").data("address").telefonoPrincipal  : 'Sin asignar');
        $(".casos-servicio-asociado").html(pedido.numeroCaso ? pedido.numeroCaso : 'Sin asignar');
        $(".casos-caso-asociado").html(pedido.casoAsociado ? pedido.casoAsociado : 'Sin asignar');
        $(".casos-descripcion").html(pedido.descripcion ? pedido.descripcion : 'N/A');
        // $(".casos-notas-adicionales").html(pedido.nota ? pedido.nota : 'Sin asignar');
        
        $('.campos-casos').removeClass('d-none');

        getMsgNotes(pedido, 'caso');
        // getItemPedido(pedido, 'caso');
    }

    $("#formVerDetallesPedidos").modal("show");
}

// Obtienes los mensajes/notas de un pedido o caso
function getMsgNotes(pedido, tipo, showAlert = false) {
    let url  = null;
    let data = null;

    if ( tipo == 'caso' ) {
        url = urlGetMessageandNotes;
        data = { case : pedido.id_Transaccion };
    } else {
        url = urlGetNoteOpp;
        data = { opp : tipo === 'cliente' ? pedido.id : pedido.id_Transaccion, tipo: tipo };
    }

    let settings = {
        url    : url,
        method : 'POST',
        data   : JSON.stringify(data)
    }

    setAjax(settings).then((response) => {
        // console.log(response);
        let imgs = [];
        mensajeData = response.messageData;
        noteData = [];
        if ( tipo == 'caso' ) {// Casos
            imgs = response.imgData;
            noteData = response.noteData;
            $(".casos-notas-adicionales").html(mensajeData && mensajeData[0] ? mensajeData[0].message : 'Sin asignar');
        } else {// Oportunidades
            noteData = response.data;
        }

        if(tipo === 'cliente') {
            let auxShowAlert = false,
                auxNote = "";
            if( noteData.length ) {// Tiene más de una nota 
                $('#notasClientes tbody').children("tr").remove();
            }
            for ( var key in noteData ) {
                if ( noteData.hasOwnProperty( key ) ) {
                    if(noteData[key].mostrar_alerta) {
                        auxShowAlert = true;
                        auxNote = noteData[key].note;
                    }
                    $('#notasClientes tbody').append(
                        '<tr data-item=' + "'" + JSON.stringify(noteData[key]) + "'"+'>'+
                            '<td class="ion-text-center">'+noteData[key].author+'</td>'+
                            '<td class="ion-text-center">'+noteData[key].date+'</td>'+
                            '<td class="ion-text-center">'+noteData[key].note+'</td>'+
                            '<td class="ion-text-center">'+(userRoleId == idSupervisor ? (noteData[key].mostrar_alerta ? '<button title="No mostrar alerta" data-bs-toggle="tooltip" data-bs-placement="left" class="btn btn-sm btn-danger delete-mostrar-alerta"> <i class="fa-solid fa-bell-slash"></i> </button>' : '') : '')+'</td>'+
                        '</tr>'
                    );
                }
            }

            if(showAlert) {
                showAlertsAux(auxNote);
            } else {
                showAlertsAux("");
            }
            initTooltips();
        } else {
            if( noteData.length ) {// Tiene más de una nota
                for ( var key in noteData ) {
                    if ( noteData.hasOwnProperty( key ) ) {
            
                        $('table.table-notas tbody').append(
                            '<tr class="notas-opp-caso">'+
                                '<td class="ion-text-center sticky-col fw-bold">'+noteData[key].author+'</td>'+
                                '<td class="ion-text-center sticky-col fw-bold">'+noteData[key].date+'</td>'+
                                '<td class="ion-text-center sticky-col fw-bold">'+noteData[key].note+'</td>'+
                            '</tr>'
                        );
                    }
                }
            } else {
                $('table.table-notas tbody').append(
                    '<tr class="notas-opp-caso">'+
                        '<td class="text-center" colspan="3">Sin notas adicionales</td>'+
                    '</tr>'
                );
            }
    
            // Tiene fotos por mostrar
            if( imgs.length ) {// Tiene más de una nota
                for ( var key in imgs ) {
                    if ( imgs.hasOwnProperty( key ) ) {
                        $('.casos-imagenes').append(
                            '<div class="col-6">'+
                                '<img class="img-thumbnail evidencia-img" alt="'+imgs[key].name+'" src="'+imgs[key].url+'">'+
                            '</div>'
                        );
                    }
                }
                $('.casos-imagenes').removeClass('d-none');
            }
        }
       swal.close();
    }).catch((error) => {
        console.log(error);
    });
}

auxAlerts = [];
countAlerts = 0;
totalAlerts = 4;

function resetAlerts() {
    auxAlerts = [];
    countAlerts = 0;
}

function showAlertsAux(alerta) {
    if(alerta && auxAlerts.indexOf(alerta) == -1) {
        auxAlerts.push(alerta);
    }    
    countAlerts = countAlerts + 1;
    if(countAlerts >= totalAlerts) {
        if(auxAlerts.length > 0) {
            infoMsg("warning", auxAlerts[0], '', null, function(resp) {
                if(auxAlerts.length > 1) {
                    infoMsg("warning", auxAlerts[1], '', null, function(resp) {
                        if(auxAlerts.length > 2) {
                            infoMsg("warning", auxAlerts[2], '', null, function(resp) {
                                if(auxAlerts.length > 3) {
                                    infoMsg("warning", auxAlerts[3]);       
                                }
                            })
                        }
                    })
                }
            })
        }
        
    }
}

// Obtiene el artículo asociado a una oportunidad
function getItemPedido(pedido, tipo) {
    let url  = null;
    let data = null;

    if ( tipo == 'caso' ) {
        url = urlGetItemsOpp;
        data = { case : pedido.id_Transaccion };
    } else {
        url = urlGetItemsOpp;
        data = { opp : pedido.id_Transaccion };
    }

    let settings = {
        url    : url,
        method : 'POST',
        data   : JSON.stringify(data)
    }

    setAjax(settings).then((response) => {
        let items = response.data;
        let totalFinal = 0;

        if ( items.length ) {
            for ( var key in items ) {
                let cantidad = 0;
                let total = Number(items[key].amount);
                let tax = Number(items[key].taxAmount);

                if ( [articuloDesc].includes( parseInt(items[key].itemId) ) ) { // Es un item de descuento
                    cantidad = 1;
                } else { // Se trata de un producto de cilindro
                    cantidad = Number(items[key].quantity).toFixed(0);
                }

                totalFinal += ( total + tax );
                
                $('table.table-desgloce-art tbody').append(
                    '<tr class="'+( items[key].itemId == articuloDesc ? 'descuento' : '' )+'">'+
                        '<td class="">'+items[key].item+'</td>'+
                        '<td class="text-center">'+cantidad+'</td>'+
                        '<td class="text-center">$'+parseFloat( total + tax ).toFixed(2)+'</td>'+
                    '</tr>'
                )
            }

            $('table.table-desgloce-art tfoot').find('.total-pedido-detalle').text('$'+parseFloat(totalFinal).toFixed(2));

            $('.campos-art').removeClass('d-none');
        }

        console.log(response);
       
    }).catch((error) => {
        console.log(error);
    });
}

// Enlista los métodos de pago de un pedido
function setMetodosPago(pedido, tipo) {
    let obj = JSON.parse(pedido.objMetodosPago);
    let totalFinal = 0;
    let items = obj.pago ?? [];

    if ( items.length ) {
        for ( var key in items ) {
            let monto = Number(items[key].monto);
            totalFinal += monto;

            let metodo = metodosPago.find( metodo => parseInt( metodo.id ) === parseInt(items[key].tipo_pago) );
            
            $('table.table-desgloce-metodos-pago tbody').append(
                '<tr>'+
                    '<td class="">'+( metodo ? metodo.method : 'N/A' )+'</td>'+
                    '<td class="text-center">'+( items[key].folio ? items[key].folio : 'N/A' ) +'</td>'+
                    '<td style="text-align: right;">$'+parseFloat(monto).toFixed(2)+'</td>'+
                '</tr>'
            )
        }

        $('table.table-desgloce-metodos-pago tfoot').find('.total-metodos-pago-detalle').text('$'+parseFloat(totalFinal).toFixed(2));

        $('.campos-metodos-pago').removeClass('d-none');
    }

    console.log(obj);
}

function gestionarServicio($this) {
    let servicio = $($this).closest("tr").data("item");
    $("#clientes-data").find("input, select, button").prop("disabled", true);
    if($(".btn-expand").find(".fa-caret-left").length) {
        $(".btn-expand").trigger("click");
    }
    if($(".btn-expand-down").find(".fa-caret-down").length) {
        $(".btn-expand-down").trigger("click");
    }
    $(".tab").css("pointer-events", "none");
    $("#editarPedido").parent().removeClass("d-none");
    $("#cancelarEditarPedido").parent().removeClass("d-none");
    $("#guardarPedido").parent().addClass("d-none");
    $(".header-edit").removeClass("d-none");
    $("#creditosCliente").parent().parent().addClass("d-none");
    $("#creditosCliente").parent().parent().addClass("d-none");
    $(".tab").first().trigger("click");
    $("#agregarProducto").parent().addClass('d-none');
    loadMsg();
    $("#dataPedidosCliente").html(customerGlobal.id + " - " + customerGlobal.nombreCompleto);
    $("#dataPedidosTelefono").html(customerGlobal.telefono.trim());
    $("#dataPedidosDireccion").html(getDireccionFormat(servicio, "pedido"));

    $("#noPedido").html(servicio.numeroDocumento);
    $("#fechaSolicitudPedido").html(dateFormatFromDate(servicio.fecha, '5'));

    $("#fechaPrometidaPedido").val(dateFormatFromDate(servicio.cierrePrevisto, "2"));
    $("#fechaPrometidaPedido").attr('disabled', true);
    $("#desdePedido").val(servicio.entre_las ? getTimeFromString(servicio.entre_las) : null);
    $("#hastaPedido").val(servicio.y_las ? getTimeFromString(servicio.y_las) : null);

    $('#viajeVentaPedido').children('option').remove();
    
    $("#zonaVentaPedido").val(servicio.zone);

    $("#origenPedido").val(servicio.origenServicioId);

    $('.productosMetodoPago tbody').children("tr").remove();

    if(servicio.objMetodosPago) {
        let aux = JSON.parse(servicio.objMetodosPago);
        let total = 0;
        if(aux.pago) {
            aux.pago.forEach(element => {
                $(".productosMetodoPago tbody").append(
                    '<tr data-metodo-id='+element.tipo_pago+' class="metodo-item" data-metodo=' + "'" + JSON.stringify(element) + "'" + '>' +
                        '<td>'+getMetodoPagoNombre(element)+'</td>'+
                        '<td class="text-center">'+(element.folio ? element.folio : 'No aplica')+'</td>'+
                        '<td class="text-center" data-total='+element.monto+'>$'+getCorrectFormat(element.monto)+' MXN</td>'+
                        '<td class="text-center">'+
                            '<button class="btn btn-sm btn-info edit-metodo-pago" data-table-ref=".productosMetodoPago" data-metodo-id='+element.tipo_pago+'> <i class="fa-solid fa-pen-to-square"></i> </button>&nbsp;&nbsp;'+
                            '<button class="btn btn-sm btn-danger delete-metodo-pago" data-table-ref=".productosMetodoPago" data-metodo-id='+element.tipo_pago+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                        '</td>'+
                    '</tr>'
                );
                total = total + parseFloat(element.monto);
            });
            $('.productosMetodoPago').parent().parent().removeClass('d-none');
            $("#sinMetodosPago").addClass('d-none');
            if(aux.pago.length > 0) {
                $("#sinMetodosPago").addClass("d-none");
                $(".productosMetodoPago").parent().parent().removeClass("d-none");
            } else {
                $("#sinMetodosPago").removeClass("d-none");
                $(".productosMetodoPago").parent().parent().addClass("d-none");
            }
        } else {
            $("#sinMetodosPago").removeClass("d-none");
            $(".productosMetodoPago").parent().parent().addClass("d-none");
        }
        
        $('.productosMetodoPago').children('tfoot').find('td.total').data('total', total);
        $('.productosMetodoPago').find('td.total').text('$'+getCorrectFormat(total)+' MXN');
    } else {
        $("#sinMetodosPago").removeClass("d-none");
        $(".productosMetodoPago").parent().parent().addClass("d-none");
    }

    $("#observacionesPagoPedido").val(servicio.nota);

    let settings = {
        url      : urlGetItemsOpp,
        method   : 'POST',
        data     : JSON.stringify({opp : servicio.id_Transaccion}),
    }

    setAjax(settings).then((response) => {
        $('.productosCilindroPedido, .productosEstacionarioPedido').parent().parent().addClass('d-none');
        $('.productosCilindroPedido tbody, .productosEstacionarioPedido tbody').children("tr").remove();
        if(response.success) {
            servicio.articulos = response.data;
            var table = $('.productosCilindroPedido');
            response.data.forEach(element => {
                if(element.itemId == articuloGasLp) {
                    table = $('.productosEstacionarioPedido');
                }
            });
            let total = 0,
                descuento = 0;
            if(response.data.length > 0) {
                $('#sinProductos').addClass('d-none');
                table.parent().parent().removeClass('d-none');
            } else {
                $('#sinProductos').removeClass('d-none');
                table.parent().parent().addClass('d-none');
            }
            response.data.forEach(articulo => {
                if(articulo.itemId != articuloDesc) {
                    articulo.capacity = articulo.typeId != "2" ? (articulo.capacidad ? articulo.capacidad : '0') : (articulo.quantity ? articulo.quantity : '0');
                    articulo.article = articulo.itemId ? articulo.itemId : '0';
                    articulo.amount = articulo.amount ? parseFloat(articulo.amount) : 0;
                    articulo.taxAmount = articulo.taxAmount ? parseFloat(articulo.taxAmount) : 0;
                    if(table.hasClass('productosCilindroPedido')) {
                        $(".productosCilindroPedido tbody").append(
                            '<tr data-item-id='+articulo.itemId+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                                '<td class="text-center">'+articulo.item+'</td>'+
                                '<td class="text-center">'+articulo.quantity+'</td>'+
                                '<td class="text-center">'+articulo.capacidad+' kg</td>'+
                                '<td class="text-center" data-total='+(articulo.amount+articulo.taxAmount)+'>$'+getCorrectFormat((articulo.amount+articulo.taxAmount))+' MXN</td>'+
                                '<td class="text-center">'+
                                    //(articulo.typeId != "5" ? '<button class="btn btn-sm btn-info edit-producto-cil"> <i class="fa fa-pen-to-square"></i> </button> ' : '') +
                                    //'<button class="btn btn-sm btn-danger delete-producto-cil" data-table-ref=".productosCilindroPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                                '</td>'+
                            '</tr>'
                        );
                    } else {
                        $(".productosEstacionarioPedido tbody").append(
                            '<tr data-item-id='+articulo.itemId+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                                '<td>'+articulo.item+'</td>'+
                                //'<td class="text-center">1</td>'+
                                '<td class="text-center">'+articulo.quantity+'</td>'+                                        
                                '<td class="text-center" data-total='+(articulo.amount+articulo.taxAmount)+'>$'+getCorrectFormat((articulo.amount+articulo.taxAmount))+' MXN</td>'+
                                '<td class="text-center">'+
                                    '<button class="btn btn-sm btn-info edit-producto-est"> <i class="fa fa-pen-to-square"></i> </button> '+
                                    '<button class="btn btn-sm btn-danger delete-producto-est" data-table-ref=".productosEstacionarioPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                                '</td>'+
                            '</tr>'
                        );
                    }
                    
                    total = total + (articulo.amount+articulo.taxAmount);
                } else {
                    descuento = Number(articulo.amount) + Number(articulo.taxAmount);
                    descuento = Number(descuento.toString().replace('-',''));
                }                        
            });

            total = total - descuento;

            table.children('tfoot').find('td.descuento').data('descuento', descuento);
            table.children('tfoot').find('td.descuento').text('$'+getCorrectFormat(descuento)+' MXN');  

            table.children('tfoot').find('td.total').data('total', total);
            table.children('tfoot').find('td.total').text('$'+getCorrectFormat(total)+' MXN');  
        } else {
            servicio.articulos = [];
            table.parent().parent().addClass('d-none');
            $("#sinProductos").removeClass("d-none");      
        }

        $("#editarPedido").data("item", servicio);
            
        swal.close();
    }).catch((error) => {
        $("#sinProductos").addClass("d-none");      
        console.log(error);
        swal.close();
    });
}

$('body').delegate('#eliminarContrato', 'click', function () {
    swal({
        title: '¿Está seguro de eliminar el contrato del cliente '+customerGlobal.nombreCompleto+'?',
        icon: 'warning',
        buttons:{
            cancel: {
              text: "Cancelar",
              value: null,
              visible: true,
              className: "btn-danger-cc",
              closeModal: true,
            },
            confirm: {
              text: "Aceptar",
              value: true,
              visible: true,
              className: "btn-primary-cc",
              closeModal: true
            }
        },
        dangerMode: true,
        cancelButtonColor: "btn-light" 
    }).then((accept) => {
        if ( accept ) {
            let dataToSend = {
                "customers" : [
                    {
                        id : customerGlobal.id,
                        bodyFields : {},
                        bodyAddress : [
                            {
                                id: $("#direccionCliente option:selected").data("address").idAdress,
                                addresses: {
                                    custrecord_ptg_direccion_contrato: false
                                }                             
                            }                        
                        ]
                    }
                ]
            }
            loadMsg();
            let settings = {
                url      : urlGuardarCliente,
                method   : 'PUT',
                data     : JSON.stringify(dataToSend),
            }
            setAjax(settings).then((response) => {
                infoMsg('success', 'Datos de contrato eliminados exitósamente');
                searchCustomer(customerGlobal.id, $("#direccionCliente option:selected").data("address").idAdress);
            }).catch((error) => {
                infoMsg('error', 'Algo salió mal en la eliminación del contrato');
                console.log('Error en la consulta', error);
            });
        }
    }).catch(swal.noop);
});

$('body').delegate('#cancelarEditarPedido', 'click', function () {
    $("#fechaPrometidaPedido").attr('disabled', false);
    $("#clientes-data").find("input, select, button").prop("disabled", false);
    $(".tab").css("pointer-events", "unset");
    $("#editarPedido").parent().addClass("d-none");
    $("#cancelarEditarPedido").parent().addClass("d-none");
    $("#guardarPedido").parent().removeClass("d-none");
    $(".header-edit").addClass("d-none");
    $("#direccionCliente").trigger("change");
    $("#agregarProducto").parent().removeClass('d-none');
});

$('body').delegate('#editarPedido', 'click', function () {
    let servicio = $("#editarPedido").data("item");
    let tipoPedido       = null;
    let tablaProd        = null;
    let totalPedido      = 0;
    let totalMetodosPago = 0;
    let descuento        = 0;
    let minimoGasLp      = Number($('select#plantas').children(':selected').data('pedido-minimo'));

    if(validateForm($("#tab-pedidos"))) {
        return;
    }    

    /* Valida que fecha sea mayor a hoy */
    // if(dateFormatFromString(dateFormatFromDate(new Date(), "2")) > dateFormatFromString($("#fechaPrometidaPedido").val())) {
    //     infoMsg('warning', 'Fecha prometida menor a la fecha actual');
    //     return;
    // }

    // Define cuál tabla de productos es la que se usará para calcular totales y descuentos
    if (! $('.productosEstacionarioPedido').parent().parent().hasClass('d-none') ) { // Estacionario
        tablaProd = $('.productosEstacionarioPedido');
        tipoPedido = 'estacionario';
    } else if (! $('.productosCilindroPedido').parent().parent().hasClass('d-none') ) { // Cilindro
        tablaProd = $('.productosCilindroPedido');
        tipoPedido = 'cilindro';
    }
    
    if (! tablaProd ) {// No hay productos seleccionados
        infoMsg('warning', 'Agregue al menos un producto a la lista');
        return;
    }

    totalPedido = tablaProd.children('tfoot').find('td.total').data('total');
    descuento   = tablaProd.children('tfoot').find('td.descuento').data('descuento');

    // Calcula el total de método de pago basándose en los especificados en la lista
    if (! $('.productosMetodoPago').parent().parent().hasClass('d-none') ) {// Contiene métodos
        totalMetodosPago = $('.productosMetodoPago').children('tfoot').find('td.total').data('total');
    }

    if ( totalPedido != totalMetodosPago ) {
        infoMsg('warning', 'El total a pagar debe ser igual al total de productos enlistados');
        return;
    }

    // Necesita verificarse el monto mínimo
    if ( tipoPedido == 'estacionario' && minimoGasLp && ( ( Number(totalPedido) + Number(descuento)) < minimoGasLp ) ) {
        infoMsg('warning', "El monto mínimo para gas lp es de " + minimoGasLp);
        return;
    }
          
    let pagosArr     = [];         
    let dataSend = {
        "opportunitiesUpdate": [
            {
                "id": servicio.id_Transaccion,
                "bodyFields": {
                    "expectedclosedate": dateFormatFromDate($("#fechaPrometidaPedido").val(), "5"),
                    "custbody_ptg_entre_las": formatTime( $('#desdePedido').val() ),
                    "memo": $('#observacionesPagoPedido').val(),
                    'custbody_ptg_opcion_pago_obj': '',
                    'custbody_ptg_origen_servicio': $("#origenPedido").val()
                },
                "lines": [
                    
                ]
            }
        ]
    };

    if($('#hastaPedido').val()) {
        dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_y_las = formatTime( $('#hastaPedido').val());
    }

    // Agrega la lista de métodos de pago
    $('table.productosMetodoPago > tbody  > tr.metodo-item').each(function() {
        let metodoObj = $(this).data('metodo');

        if ( metodoObj.tipo_pago == '9' ) {// El método de pago es crédito
            totalConCredito = parseFloat( Number(metodoObj.monto) );
        }
        pagosArr.push( $( this ).data('metodo') );
    });
    
    dataSend.opportunitiesUpdate[0].bodyFields.custbody_ptg_opcion_pago_obj = JSON.stringify({pago:pagosArr})
    console.log(dataSend);
    loadMsg();
    let settings = {
        url      : urlActualizarOpp,
        method   : 'PUT',
        data: JSON.stringify(dataSend)
    }
    setAjax(settings).then((response) => {
        if(response.success) {
            swal.close();
            infoMsg('success', '', "Servicio editado de manera correcta", null, function(resp) {
                $("#cancelarEditarPedido").trigger('click');
                $('select#direccionCliente').trigger("change");
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
});

function getMetodoPagoNombre(item) {
    let aux = "No encontrado";
    console.log(item);
    if(item.tipo_pago) {
        metodosPago.forEach(element => {
            if(element.id == item.tipo_pago) {
                aux = element.method;
            }
        });
    }
    return aux;
}

// Abre el modal para cancelar el pedido
function cancelarPedido($this) {
    let pedido = $($this).closest("tr").data("item");

    $('#cancelarOppMotivo').val('');
    $("#cancelarOppObservaciones").val('');
    // $('#cancelarOppMotivo').val('').trigger('change');
    $("#cancelarOppModal").data("item", pedido);
    $("span#cancelarOppPedido").html(pedido.id_Transaccion ? " - " + pedido.id_Transaccion : '');
    $("#cancelarOppModal").modal("show");
}

// Abre el modal para solicitar la fecha prometida de un pedido
function cambiarFechaPedido($this) {
    let pedido = $($this).closest("tr").data("item");

    $('#nuevaFechaPrometida, #cambiarFechaOppObservaciones').val('');
    // $('#cancelarOppMotivo').val('').trigger('change');
    $("#cambiarFechaOppModal").data("item", pedido);
    $("span#cambiarFechaOppPedido").html(pedido.id_Transaccion ? " - " + pedido.id_Transaccion : '');
    $("#cambiarFechaOppModal").modal("show");
}

// Inicializa los tooltips
function initTooltips() {
    $('.tooltip').remove();
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
}

// Formatea la hora de netsuite para ser compatible con el timepicker del formulario
function formatTimeToPicker (value, format = 'HH:mm') {
    if ( value ) {
        let medioDia = value.split(" ");
        let horaInicio = value.split(":");

        // Se le suma 12 horas por el formato de 24 hrs
        if ( medioDia[1].toUpperCase() == 'PM' ) {
            horas = new Number(horaInicio[0]) + 12;
        } else {
            horas = horaInicio[0];
        }

        let customDate = new Date();
        customDate.setHours(horas);
        customDate.setMinutes(horaInicio[1].split(" ")[0]);

        return moment(customDate).format(format);
        // $('#desdePedido').val(horaInicioStr);
    }

    return '';
}

// Call a global ajax method
function setAjax(settings) {
    // Generamos el AJAX dinamico para las peticiones relacionadas con peddos
    return new Promise((resolve, reject) => {
        $.ajax({
            url: settings.url,
            method: settings.method,
            data: settings.data ?? null,
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