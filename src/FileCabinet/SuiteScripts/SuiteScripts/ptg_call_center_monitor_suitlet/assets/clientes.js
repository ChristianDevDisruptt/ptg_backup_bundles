// Revisa que acción ejecutará el modal de acuerdo al botón cliqueado
$("#agregarDirecciones, #agregarDireccion").click( function() {
    let id = $(this).attr('id');
    $('.dias-semana').prop('checked', true);

    if ( id == 'agregarDirecciones' ) {
        $("#tipoAccionDireccion").val('lista');
        $("input[name=tipoAccionFormCliente][value=1]").prop("checked", true).trigger("change");
        $("#tipoServicioFormCliente").val(idCilindro);
        //$($(".dato-facturacion").addClass("d-none"));
        $("#tipoServicioFormCliente").trigger("change");
    } else if ( id == 'agregarDireccion' ) {
        $("#estadoDireccion").val("").trigger("change");
        $("#frecuenciaFormCliente").trigger("change")
        $("input[name=tipoAccionFormCliente][value=1]").prop("checked", true).trigger("change");
        if(customerGlobal.requiereFactura) {
            $($(".dato-facturacion").removeClass("d-none"));
        } else {
            $($(".dato-facturacion").addClass("d-none"));
        }
        if(customerGlobal.alianzaComercial.toUpperCase() == "CREDITO") {
            $("input[name=requiereContrato]").prop("disabled", true);
        } else {
            $("input[name=requiereContrato]").prop("disabled", false);
        }
        $("#tipoAccionDireccion").val('guardar');
    }
});

// Si el cliente requiere factura, se mostrarán esos campos en el form de cliente
$('input[name=requiereContrato]').on('change', function(e) {
    let val = $("input[name=requiereContrato]:checked").val();
    if ( val == "si" ) {// Se muestran los datos exclusivos de factura
        $(".dato-contrato").removeClass("d-none");
    } else {// Se ocultan los campos de factura
        $(".dato-contrato").addClass("d-none");
    }
});

// Si el cliente requiere factura, se mostrarán esos campos en el form de cliente
$('input[name=requiereFactura]').on('change', function(e) {
    let val = $("input[name=requiereFactura]:checked").val();
    if ( val == "si" ) {// Se muestran los datos exclusivos de factura
        $(".dato-facturacion").removeClass("d-none");
        if($(".table-address tbody").children("tr").length == 1 && $(".table-address tbody").children("tr").text().trim().toLowerCase() == 'sin direcciones') {
            $(".table-address tbody").children("tr").find("td").prop("colspan", "4");
        }
    } else {// Se ocultan los campos de factura
        $(".dato-facturacion").addClass("d-none");
        if($(".table-address tbody").children("tr").length == 1 && $(".table-address tbody").children("tr").text().trim().toLowerCase() == 'sin direcciones') {
            $(".table-address tbody").children("tr").find("td").prop("colspan", "3");
        }
    }
});

// Si el cliente es de régimen moral, muestra el campo para la razón social, caso contrario, se muestran los de régimen físico (Doméstico)
$('input[name=tipoRegimen]').on('change', function(e) {
    let val = $("input[name=tipoRegimen]:checked").val()
    if ( val == "domestico" ) {// Se muestran los datos de régimen físico
        $(".dato-regimen-fisico").removeClass("d-none");
        $(".dato-regimen-moral").addClass("d-none");
    } else if( val == "comercial" || val == "industrial" ) {// Se muestran los campos de régimen moral
        $(".dato-regimen-moral").removeClass("d-none");
        $(".dato-regimen-fisico").addClass("d-none");
    }
});

// Cuando el select de estados cambie, manda a llamar la petición de obtener ciudades
$('select#direccionCliente').on('change', function(e) {
    let direccion = $( this ).children('option:selected').data('address');
    console.log('esta es la dirección', direccion);    
    if(direccion.requiereContrato && userRoleId == idAgenteHEB && elimCont) {
        $(".btn-elim-cont").removeClass("d-none");
    } else {
        $(".btn-elim-cont").addClass("d-none");
    }
    $('#contratoCliente').text(direccion.requiereContrato ? direccion.numeroContrato + " ("+direccion.digitoVerificador+")" : 'Sin contrato');
    $('#telefonoCliente').text(direccion.telefonoPrincipal ? direccion.telefonoPrincipal : 'Sin asignar');
    $('#telefonoFugaQueja').val(direccion.telefonoPrincipal ? direccion.telefonoPrincipal : '');
    resetAlerts();
    getRealHistoric();
    getCasosOportunidades();
    getMsgNotes(customerGlobal, 'cliente', true);
    setAlianzaComercial(customerGlobal);
    resetProductList();
    if ( direccion ) {
        $(this).prop('title', setDir( direccion, customerGlobal.requiereFactura ));// Activa el tooltip de la dirección
        setTextRoutesByAddress(direccion);
        setColoniaZonaData( direccion );        
        setContratoCliente(direccion);
        setDefaultItem();
        initTooltips();
    } else {// Podría ser buena práctica meter este bloque de código en una función
        // Estos campos están en la tarjeta de cliente
        $('#zonaVentaCliente').text('Sin Zona de Venta');
        $('#zonaPrecioCliente').text('Sin Zona de Precio');
        $('#rutaCliente').text("Sin ruta");
        
        // Estos campos están en el formulario de pedido
        $('#zonaVentaPedido, #desdePedido, #hastaPedido').val('');
    }
});

function setContratoCliente(addr) {
    console.log("addr: ", addr);
    $('#badgeContrato').children('span').removeClass('bg-danger-cc bg-success-cc');
    if(addr.requiereContrato) {
        if ( customerGlobal.diasAtraso ) {
            console.log('tiene el objeto dias atraso');
            if ( parseInt(customerGlobal.diasAtraso) > 0 ) {
                $('#badgeContrato').children('span').addClass('bg-danger-cc');
            } else {
                $('#badgeContrato').children('span').addClass('bg-success-cc');
            }
        }
        $("#badgeContrato").removeClass("d-none");
        $('.contrato-no-contrato, .contrato-fecha-inicio, .contrato-limite-credito, .contrato-dias-credito, .contrato-saldo-disponible, .contrato-dias-vencidos, .contrato-monto-adeudo, .contrato-saldo-vencido').removeClass('d-none')
        $('.contrato-no-contrato').children('td').siblings("td:nth-child(2)").text(addr.numeroContrato ? addr.numeroContrato + " ("+addr.digitoVerificador+")" : 'Sin asignar');
        $('.contrato-fecha-inicio').children('td').siblings("td:nth-child(2)").text(addr.fechaContrato ? addr.fechaContrato : 'Sin asignar');
        $('.contrato-limite-credito').children('td').siblings("td:nth-child(2)").text(customerGlobal.limiteCredito ? ( '$' + getCorrectFormat(customerGlobal.limiteCredito) + ' MXN' ) : 'Sin asignar');
        $('.contrato-dias-credito').children('td').siblings("td:nth-child(2)").text(customerGlobal.terminos ? customerGlobal.terminos : 'Sin asignar');
        $('.contrato-saldo-disponible').children('td').siblings("td:nth-child(2)").text(customerGlobal.saldoDisponible ? ( '$' + getCorrectFormat(customerGlobal.saldoDisponible) + ' MXN' ) : 'Sin asignar');
        $('.contrato-dias-vencidos').children('td').siblings("td:nth-child(2)").text(customerGlobal.diasAtraso ? customerGlobal.diasAtraso : 'Sin asignar');
        $('.contrato-monto-adeudo').children('td').siblings("td:nth-child(2)").text(customerGlobal.creditoUtilizado ? ( '$' + getCorrectFormat(customerGlobal.creditoUtilizado) + ' MXN' ) : 'Sin asignar');
        $('.contrato-saldo-vencido').children('td').siblings("td:nth-child(2)").text(customerGlobal.saldoVencido ? ( '$' + getCorrectFormat(customerGlobal.saldoVencido) + ' MXN' ) : 'Sin asignar');
    
        if(Number(customerGlobal.saldoDisponible) > 0) {
            showAlertsAux("");
            $("#badgeContrato span").addClass("bg-success-cc").removeClass("bg-danger-cc");
        } else {
            showAlertsAux("No cuenta con saldo disponible");
            $("#badgeContrato span").removeClass("bg-success-cc").addClass("bg-danger-cc");
        }
    } else {
        showAlertsAux("");
        $("#badgeContrato").addClass("d-none");    
    }
}

// Setea el formulario de cliente para guardar uno nuevo
$("#agregarCliente").click(function () {
    clearCustomerForm();
    next('inicio');
    $("div.domicilio-tab").removeClass('d-none');
    $("div.guardar-cliente-edit").addClass('d-none');
    $("button.next-to-domicilio").parent().removeClass('d-none');// Se muestra el botón de siguiente para visualizar la vista de domicilio
    
    $($(".dato-facturacion").addClass("d-none"));
    $("#home-view, #btnMenu").addClass("d-none");
    $("#form-client-view, #btnBack").removeClass("d-none");
    $("#btnBack").data("back", "home-view");
    $("#btnBack").data("current", "form-client-view");
    $("#btnBack").data("title-back", "Call Center");
    $("#header-title").html("Alta de cliente");
});

// Configura el formulario de edición del cliente
$("#editarCliente").click(function () {
    clearCustomerForm();
    next('inicio');
    $("#home-view, #btnMenu").addClass("d-none");
    $("#form-client-view, #btnBack").removeClass("d-none");
    $("#btnBack").data("back", "home-view");
    $("#btnBack").data("current", "form-client-view");
    $("#btnBack").data("title-back", "Call Center");
    $("#header-title").html("Edición de cliente");

    $("div.domicilio-tab").addClass('d-none');
    $("div.guardar-cliente-edit").removeClass('d-none');
    $("button.next-to-domicilio").parent().addClass('d-none');// Se remueve el botón de siguiente para visualizar la vista de domicilio

    // Este input definirá si es una edición por el id interno del cliente
    $('#idInternoFormCliente').val(customerGlobal.id);

    if ( customerGlobal.fechaContrato ) {// Si el cliente tiene una fecha de contrato, se coloca acá como ilustrativo solamente
        let fechaContrato = moment(customerGlobal.fechaContrato);
        $('#fechaInicioContratoCliente').attr('disabled', true);
        $('#fechaInicioContratoCliente').val(fechaContrato.format('YYYY-MM-DD').toString());
    }

    // Se prellenan los inputs del form
    if ( customerGlobal.typeCustomer == "Doméstico" ) {
        $("input#tipoRegimen1").prop('checked', true);
        $(".dato-regimen-fisico").removeClass("d-none");
        $(".dato-regimen-moral").addClass("d-none");
    } else if ( customerGlobal.typeCustomer == "Comercial" ) {
        $("input#tipoRegime2").prop('checked', true);
    } else if ( customerGlobal.typeCustomer == "Industrial" ) {
        $("input#tipoRegime3").prop('checked', true);
    }

    // Si es comercial o industrial
    if ( customerGlobal.typeCustomer == "Comercial" || customerGlobal.typeCustomer == "Industrial" ) {
        $('#nombreRazonSocialFormCliente').val(customerGlobal.nombreCompleto);
        $('#giroNegocioFormCliente').parent().removeClass('d-none');
        $(".dato-regimen-fisico").addClass("d-none");
        $(".dato-regimen-moral").removeClass("d-none");
    }

    if ( customerGlobal.giroCustomerId ) {
        $('#giroNegocioFormCliente').val(customerGlobal.giroCustomerId);
    }

    if ( customerGlobal.requiereFactura ) {
        $("input#requiereFactura1").prop('checked', true);
        $(".dato-facturacion").removeClass("d-none");
        $('#rfcFormCliente').val(customerGlobal.rfc);
        $('#usoCfdiFormCliente').val(customerGlobal.cdfiId);
        
    } else {
        $(".dato-facturacion").addClass("d-none");
    }

    // Falta código para prellenar los campos de contrato

    // Se setean los demás campos de forma natural
    $('#nombreFormCliente').val(customerGlobal.primerNombre);
    $('#nombreFacturacionFormCliente').val(customerGlobal.razonSocialFact);
    $('#apellidosFormCliente').val(customerGlobal.apellidos);
    
    $('#correoFormCliente').val(customerGlobal.email);
    $('#telefonoAlternoFormCliente').val(customerGlobal.telefonoAlt);
    $('#correoAlternativoFormCliente').val(customerGlobal.emailAlt);
    $('#observacionesFormCliente').val(customerGlobal.notasCustomer);
    $("#nombreFacturacionFormCliente, #rfcFormCliente, #usoCfdiFormCliente, #correoAlternativoFormCliente, #copiarDatosContacto").prop("disabled", true);
});

$("#historicoCliente").click(function () {
    loadMsg();
    $("#historicoCambiosTitle").html((customerGlobal.primerNombre + ' ' + customerGlobal.apellidos).trim());
    let settings = {
        url      : urlGetHistorico+"&id="+customerGlobal.id+"&type=cliente",
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
                let trAux = "";
                if(element.fieldName.trim().toLowerCase() == "ptg - opción de pago obj") {
                    trAux += getChangesMetodosPago(element);
                } else {
                    trAux += '<tr>' +
                                '<td class="ion-text-center fw-bold">'+element.userName+'</td>'+
                                '<td class="ion-text-center fw-bold">'+element.date+'</td>'+
                                '<td class="ion-text-center fw-bold">'+(element.ui.trim()== 'Script (RESTlet)' ? 'Call Center/<br>Monitor' : 'Netsuite')+'</td>'+
                                '<td class="ion-text-center fw-bold">'+element.fieldName+'</td>'+
                                '<td class="ion-text-center fw-bold">'+element.oldvalue+'</td>'+
                                '<td class="ion-text-center fw-bold">'+element.newvalue+'</td>'+
                            '</tr>';
                }
                $("#table-historico-cambios tbody").append(trAux);
            });
            swal.close();
            $("#formHistoricoCambiosModal").modal("show");
        }
    }).catch((error) => {
        console.log(error);
    });
});

// Click en guardar cliente
$("button#guardarCliente").click( function() {
    saveCustomer();
});

$('body').delegate('.check-entrega', 'click', function () {
    let address = $(this).closest('.address').data('address');
    
    if(!address.principal) {
        for (let x = 0; x < $('table.table-address tbody').find(".address").length; x++) {
            let element = $($('table.table-address tbody').find(".address")[x]);
            let addressAux = element.data('address');
            if(addressAux.principal) {
                addressAux.principal = false;
                element.data('address', addressAux);
                element.find('.check-entrega').parent().html('<i class="fa-regular fa-square color-primary check-entrega" style="cursor: pointer;"></i>');
            }

            if((x + 1) == $('table.table-address tbody').find(".address").length) {
                address.principal = true;
                $(this).closest('.address').data('address', address);
                $(this).parent().html('<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>');
            }
        }
    }
});

$('body').delegate('.check-fact', 'click', function () {
    let address = $(this).closest('.address').data('address');
    if(!address.domFacturacion) {
        for (let x = 0; x < $('table.table-address tbody').find(".address").length; x++) {
            let element = $($('table.table-address tbody').find(".address")[x]);
            let addressAux = element.data('address');
            if(addressAux.domFacturacion) {
                addressAux.domFacturacion = false;
                element.data('address', addressAux);
                element.find('.check-fact').parent().html('<i class="fa-regular fa-square color-primary check-fact" style="cursor: pointer;"></i>');
            }
            if((x + 1) == $('table.table-address tbody').find(".address").length) {
                address.domFacturacion = true;
                $(this).closest('.address').data('address', address);
                $(this).parent().html('<i class="fa-solid fa-square-check color-primary check-fact" style="cursor: pointer;"></i>');
            }
        }
    }
});

$('body').delegate('.delete-address', 'click', function () {
    let button = $(this);
    confirmMsg("warning", "¿Seguro que desea eliminar la dirección?", function(resp) {
        if( resp ) {
            let address = button.closest('.address').data('address');
            //button.parent().parent().remove();
            if((address.principal || address.domFacturacion) && $('table.table-address tbody').find(".address").length > 1) {
                button.closest('.address').remove();
                let element = $($('table.table-address tbody').find(".address")[0]);
                let addressAux = element.data('address');
                if(address.principal) {
                    addressAux.principal = true;
                    element.find('.check-entrega').parent().html('<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>');
                }
                if(address.domFacturacion) {
                    addressAux.domFacturacion = true;
                    element.find('.check-fact').parent().html('<i class="fa-solid fa-square-check color-primary check-fact" style="cursor: pointer;"></i>');
                }
                element.data('address', addressAux);              
            } else {
                let val = $("input[name=requiereFactura]:checked").val();
                $('table.table-address tbody').append(
                    '<tr>'+
                        '<td class="text-center" colspan="'+(val == 'si' ? '4' : '3')+'">Sin direcciones</td>'+
                    '</tr>'
                );
                button.closest('.address').remove();
            }
        }
    })
});

$('body').delegate('.edit-address', 'click', function () {
    if(loadColonias) {
        infoMsg('warning', 'Aun están cargando los datos para direcciones, favor de esperar un momento');
    } else {
        let direccion = $(this).closest('.address').data('address');
        $("#tipoAccionDireccion").val('guardar');
        console.log(direccion);
        if ( direccion ) {
            let requiereFactura  = ($("input[name=requiereFactura]:checked").val() == "si" ? true : false);
            if(requiereFactura) {
                $($(".dato-facturacion").removeClass("d-none"));
            } else {
                $($(".dato-facturacion").addClass("d-none"));
            }
            // Se ocultan los campos de frecuencia y posteriormente se decide si se muestran o no
            $('.frecuencia-cada, .frecuencia-semana').addClass('d-none');
            if ( direccion.domFacturacion ) {// Dirección de facturación
                // $('#domFacturacionDireccion').parent().parent().removeClass('d-none');
                $('#domFacturacionDireccion').prop('checked', true);
            }

            $('#cpDireccion').val(direccion.zip);
            $('#calleDireccion').val(direccion.nameStreet);
            $('#exteriorDireccion').val(direccion.numExterno);
            $('#interiorDireccion').val(direccion.numInterno);
            $('#entre1Direccion').val(direccion.street_aux1);
            $('#entre2Direccion').val(direccion.street_aux2);
            $('#tipoServicioFormCliente').val(direccion.typeService).trigger("change");;

            $("#telefonoPrincipalDireccion").val(direccion.telefonoPrinc);

            if(direccion.telefonoSec) {
                if(direccion.telefonoSec.split("|").length > 0) {
                    $("#telefonosAdicionales tbody").children('tr').remove();
                }
                direccion.telefonoSec.split("|").forEach(element => {
                    $("#telefonosAdicionales tbody").append('<tr class="telAdic">'+
                                                                '<td class="fw-bold">'+
                                                                element+
                                                                '</td>'+
                                                                '<td width="50" class="ion-text-center fw-bold">'+
                                                                    '<i class="fa-solid fa-trash-can" style="cursor: pointer;" onclick="deleteTelAdic(this)"></i>'  +
                                                                '</td>'+
                                                            '</tr>');
                });
            }
    
            $('#entreFormCliente').val(formatTimeToPicker(direccion.entre_las));
            $('#lasFormCliente').val(formatTimeToPicker(direccion.y_las));
            $('#indicacionesFormCliente').val(direccion.commentsAddress);

            // Valida el tipo de servicio y los datos mostrados en la ruta
            // En caso de ser ambos, el item 1 se considera como cilindro y el item 2 como estacionario
            // Sí sólo es o cilindro o estacionario, se tomará el item1 para definir sus datos
            if ( direccion.typeService == idCilindro ) {// Cilindro
                $('#articuloFrecuenteCilFormCliente').val(direccion.frequencyItem);
                $('#inputCapacidadCilTipoServicio').val(direccion.capacidad);
            } else if ( direccion.typeService == idEstacionario ) {// Estacionario
                $('#inputCapacidadEstTipoServicio').val(direccion.capacidad);
            } else if ( direccion.typeService == idMontacarga ) {// Montacarga
                $('#inputCapacidadMonTipoServicio').val(direccion.capacidad);
            }

            // Campos de frecuencia
            if ( direccion.frecuencia == idDias ) {
                $('.dias-semana').prop('disabled', true);
                $('.dias-semana').prop('checked', true);
            } else if ( direccion.frecuencia == idSemanas ) {
                $('.dias-semana').prop('disabled', false);
                $('.frecuencia-cada').removeClass('d-none');
            } else if ( direccion.frecuencia == idMeses ) {
                $('.dias-semana').prop('disabled', false);
                $('.frecuencia-cada, .frecuencia-semana').removeClass('d-none');
                $('#numeroSemana').val(parseInt(direccion.inThatWeek));
            }

            $('#fechaInicioServicio').val(direccion.startDayService ? getMomentDateFormat(direccion.startDayService) : null);
            $('#cadaFormCliente').val(direccion.cada)
            $('#frecuenciaFormCliente').val(direccion.frecuencia);

            // Días de la semana
            $('#lunesFormCliente').prop('checked', direccion.lunes ? true : false);
            $('#martesFormCliente').prop('checked', direccion.martes ? true : false);
            $('#miercolesFormCliente').prop('checked', direccion.miercoles ? true : false);
            $('#juevesFormCliente').prop('checked', direccion.jueves ? true : false);
            $('#viernesFormCliente').prop('checked', direccion.viernes ? true : false);
            $('#sabadoFormCliente').prop('checked', direccion.sabado ? true : false);
            $('#domingoFormCliente').prop('checked', direccion.domingo ? true : false);
            
            if(direccion.isContract) {
                $('#requiereContrato1').prop('checked', true).trigger("change");
                $('#numeroContratoCliente').val("");
                $('#fechaInicioContratoCliente').val(dateFormatFromDate(direccion.contractDate, "2"));
            } else {
                $('#requiereContrato2').prop('checked', true).trigger("change");
            }

            // Tipo de acción
            if ( direccion.typeContact == idTelefonico ) {// Teléfono
                $("input#tipoAccionFormClient1").prop('checked', true);
                $(".tipo-aviso-programado").addClass('d-none');
            } else if ( direccion.typeContact == idAviso ) {// Aviso
                $("input#tipoAccionFormClient2").prop('checked', true);
                $(".tipo-aviso-programado").removeClass('d-none');
            } else if ( direccion.typeContact == idProgramado ) {// Programado
                $("input#tipoAccionFormClient3").prop('checked', true);
                $(".tipo-aviso-programado").removeClass('d-none');
            }
            $("#tipoAccionDireccion").val('editLista');
            $("#tipoAccionDireccion").data("auxEdit", direccion)
            
            if($("#estadoDireccion option[data-name='"+direccion.stateName+"']").length > 0) {
                $("#estadoDireccion").val($("#estadoDireccion option[data-name='"+direccion.stateName+"']").val()).trigger("change");
            }

            if($("#municipioDireccion option[data-name='"+direccion.city+"']").length > 0) {
                $("#municipioDireccion").val($("#municipioDireccion option[data-name='"+direccion.city+"']").val()).trigger("change");
            }

            if($("#coloniaDireccion option[data-name='"+direccion.colonia+"']").length > 0) {
                $("#coloniaDireccion").val($("#coloniaDireccion option[data-name='"+direccion.colonia+"']").val()).trigger("change");
            }
            
            if($("#cpDireccion option[data-name='"+direccion.zip+"']").length > 0) {
                $("#cpDireccion").val($("#cpDireccion option[data-name='"+direccion.zip+"']").val()).trigger("change");
                if ( direccion.typeService == idCilindro ) {// Cilindro
                    $("#rutaCiliMat").val(direccion.idRoute);
                    $("#rutaCiliVesp").val(direccion.idRoute2);
                } else if ( direccion.typeService == idEstacionario ) {// Estacionario
                    $("#rutaEstaMat").val(direccion.idRoute);
                    $("#rutaEstaVesp").val(direccion.idRoute2);
                } else if ( direccion.typeService == idMontacarga ) {// Montacarga
                    $("#rutaMonMat").val(direccion.idRoute);
                    $("#rutaMonVesp").val(direccion.idRoute2);
                }
                
            }
            $("#formDireccionesModal").modal("show");
            //swal.close(); 
        }
    }
});

$('body').delegate('.copy-address', 'click', function () {
    if(loadColonias) {
        infoMsg('warning', 'Aun están cargando los datos para direcciones, favor de esperar un momento');
    } else {
        let direccion = $(this).closest('.address').data('address');
        $("#tipoAccionDireccion").val('guardar');
        console.log(direccion);
        if ( direccion ) {
            let requiereFactura  = ($("input[name=requiereFactura]:checked").val() == "si" ? true : false);
            if(requiereFactura) {
                $($(".dato-facturacion").removeClass("d-none"));
            } else {
                $($(".dato-facturacion").addClass("d-none"));
            }
            // Se ocultan los campos de frecuencia y posteriormente se decide si se muestran o no
            $('.frecuencia-cada, .frecuencia-semana').addClass('d-none');
            if ( direccion.domFacturacion ) {// Dirección de facturación
                // $('#domFacturacionDireccion').parent().parent().removeClass('d-none');
                $('#domFacturacionDireccion').prop('checked', true);
            }

            $('#cpDireccion').val(direccion.zip);
            $('#calleDireccion').val(direccion.nameStreet);
            $('#exteriorDireccion').val(direccion.numExterno);
            $('#interiorDireccion').val(direccion.numInterno);
            $('#entre1Direccion').val(direccion.street_aux1);
            $('#entre2Direccion').val(direccion.street_aux2);
            $('#tipoServicioFormCliente').val(null).trigger("change");;

            $("#telefonoPrincipalDireccion").val(direccion.telefonoPrinc);

            if(direccion.telefonoSec) {
                if(direccion.telefonoSec.split("|").length > 0) {
                    $("#telefonosAdicionales tbody").children('tr').remove();
                }
                direccion.telefonoSec.split("|").forEach(element => {
                    $("#telefonosAdicionales tbody").append('<tr class="telAdic">'+
                                                                '<td class="fw-bold">'+
                                                                element+
                                                                '</td>'+
                                                                '<td width="50" class="ion-text-center fw-bold">'+
                                                                    '<i class="fa-solid fa-trash-can" style="cursor: pointer;" onclick="deleteTelAdic(this)"></i>'  +
                                                                '</td>'+
                                                            '</tr>');
                });
            }
    
            /*$('#entreFormCliente').val(formatTimeToPicker(direccion.entre_las));
            $('#lasFormCliente').val(formatTimeToPicker(direccion.y_las));*/
            $('#indicacionesFormCliente').val(direccion.commentsAddress);

            // Campos de frecuencia
            /*if ( direccion.frecuencia == "1" ) {
                $('.dias-semana').prop('disabled', true);
                $('.dias-semana').prop('checked', true);
            } else if ( direccion.frecuencia == "2" ) {
                $('.dias-semana').prop('disabled', false);
                $('.frecuencia-cada').removeClass('d-none');
            } else if ( direccion.frecuencia == "3" ) {
                $('.dias-semana').prop('disabled', false);
                $('.frecuencia-cada, .frecuencia-semana').removeClass('d-none');
                $('#numeroSemana').val(parseInt(direccion.inThatWeek));
            }

            $('#fechaInicioServicio').val(direccion.startDayService ? getMomentDateFormat(direccion.startDayService) : null);
            $('#cadaFormCliente').val(direccion.cada)
            $('#frecuenciaFormCliente').val(direccion.frecuencia);

            // Días de la semana
            $('#lunesFormCliente').prop('checked', direccion.lunes ? true : false);
            $('#martesFormCliente').prop('checked', direccion.martes ? true : false);
            $('#miercolesFormCliente').prop('checked', direccion.miercoles ? true : false);
            $('#juevesFormCliente').prop('checked', direccion.jueves ? true : false);
            $('#viernesFormCliente').prop('checked', direccion.viernes ? true : false);
            $('#sabadoFormCliente').prop('checked', direccion.sabado ? true : false);
            $('#domingoFormCliente').prop('checked', direccion.domingo ? true : false);
            */
            if(direccion.isContract) {
                $('#requiereContrato1').prop('checked', true).trigger("change");
                $('#numeroContratoCliente').val("");
                $('#fechaInicioContratoCliente').val(dateFormatFromDate(direccion.contractDate, "2"));
            } else {
                $('#requiereContrato2').prop('checked', true).trigger("change");
            }

            $("#tipoAccionDireccion").val('lista');
            $("#tipoAccionDireccion").data("auxEdit", direccion)
            
            if($("#estadoDireccion option[data-name='"+direccion.stateName+"']").length > 0) {
                $("#estadoDireccion").val($("#estadoDireccion option[data-name='"+direccion.stateName+"']").val()).trigger("change");
            }

            if($("#municipioDireccion option[data-name='"+direccion.city+"']").length > 0) {
                $("#municipioDireccion").val($("#municipioDireccion option[data-name='"+direccion.city+"']").val()).trigger("change");
            }

            if($("#coloniaDireccion option[data-name='"+direccion.colonia+"']").length > 0) {
                $("#coloniaDireccion").val($("#coloniaDireccion option[data-name='"+direccion.colonia+"']").val()).trigger("change");
            }
            
            if($("#cpDireccion option[data-name='"+direccion.zip+"']").length > 0) {
                $("#cpDireccion").val($("#cpDireccion option[data-name='"+direccion.zip+"']").val()).trigger("change");
            }
            $("#formDireccionesModal").modal("show");
            //swal.close(); 
        }
    }
});


// Guarda la información de un cliente en Netsuite
function saveCustomer() {
    let tipoRegimen      = $("input[name=tipoRegimen]:checked").val();
    let requiereFactura  = ($("input[name=requiereFactura]:checked").val() == "si" ? true : false);

    if ( !$("input#idInternoFormCliente").val() && $('table.table-address tbody').find(".address").length == 0 ) {
        infoMsg('warning', 'Favor de colocar al menos una dirección')
        return;
    }

    let idCliente    = $("input#idInternoFormCliente").val();
    let businessType = tipoRegimen != 'domestico' ? $('select#giroNegocioFormCliente').val() : "";
    let businessName = $('#nombreRazonSocialFormCliente').val();
    let cfdi         =  requiereFactura ? $('#usoCfdiFormCliente').val() : "";
    // let middleName      = tipoRegimen != 'domestico' ? $('select#giroNegocioFormCliente').val() : "";
    let lastName     = $('input#apellidosFormCliente').val().trim();
    let rfc          = requiereFactura ? $('input#rfcFormCliente').val() : "";
    let razonSocialFact = requiereFactura ? $('#nombreFacturacionFormCliente').val() : "";
    let email        = $("input#correoFormCliente").val();
    let emailAlt     = requiereFactura ? $("input#correoAlternativoFormCliente").val() : "";
    let telefonoPrinc = '';
    // let service      = $("select#tipoServicioFormCliente").val();
    // let typeService  = null;
    let regimenId    = null;

    if( tipoRegimen == 'industrial'){ regimenId = idIndustrial; }
    else if( tipoRegimen == 'domestico'){ regimenId = idDomestico; }
    else if( tipoRegimen == 'comercial'){ regimenId = idComercial; }

    /*if( service == 'cilindro' ){ typeService = 1; }
    else if( service == 'estacionario' ){ typeService = 2; }
    else if( service == 'ambos' ){ typeService = 4; }*/

    let listAddress = [];
    let count = 1;
    
    for (let x = 0; x < $('table.table-address tbody').find(".address").length; x++) {
        let element = $($('table.table-address tbody').find(".address")[x]);
        let address = element.data('address');
        if( address.principal ) {
            address.tag = "00";
            telefonoPrinc = address.telefonoPrinc;
        } else {
            address.tag = "0"+count;
            count = count + 1;
        }
        element.data('address', address);
        listAddress.push(address);
    }

    let customer = {
        nombre : $('input#nombreFormCliente').val(),
        middleName : '',
        businessType : businessType,
        lastName : lastName,
        businessName: businessName,
        cfdi: cfdi,
        rfc : rfc,
        razonSocialFact: razonSocialFact,
        regimeType : regimenId != idDomestico ? false : true,
        // regimeType : tipoRegimen,
        email : email,
        emails : {
            principal : email,
            adicionales : emailAlt
        },
        planta : $('select#plantas').val(),
        telefonoAlt : $("input#telefonoAlternoFormCliente").val(),
        subsidiary : userSubsidiary,// Seteado de forma estática
        regimenId : regimenId,
        notaCliente : $('#observacionesFormCliente').val(),
        //typeService : typeService,
        address : listAddress,
        requiereFactura: requiereFactura,
        telefono: telefonoPrinc
    }
    console.log(customer);
    // return;
    loadMsg('Guardando información...');
    // Se envía la información del cliente por ajax
    let dataToSend = null;
    if ( idCliente ) {// Se actualiza

        let customerEdit = {
            firstname : customer['nombre'],
            lastname : customer['lastName'],
            custentity_ptg_giro_negocio : customer['businessType'],
            companyname : customer['businessName'],
            email : customer['email'],
            // custentity_ptg_plantarelacionada_ : customer['planta'],
            //phone : customer['telefono'],
            //altphone : customer['telefonoAlt'],
            // subsidiary : customer['subsidiary'],
            custentity_ptg_tipodecliente_ : customer['regimenId'],
            custentity_ptg_notas_cliente_ : customer['notaCliente']
        }

        /*customerEdit.custentity_razon_social_para_facturar = razonSocialFact;
        customerEdit.custentity_mx_rfc = rfc;
        customerEdit.custentity_disa_uso_de_cfdi_ = cfdi;
        customerEdit.custentity_drt_sed_email_invoice = emailAlt;*/

        dataToSend = {
            "customers" : [
                {
                    id : idCliente,
                    bodyFields : customerEdit,
                    bodyAddress : []
                }
            ] 
        };

    } else {// Se crea uno nuevo
        let arrayCustomers = [];
        arrayCustomers.push(customer);

        dataToSend = {
            "customers" : arrayCustomers,
        };
    
    }
    
    let settings = {
        url    : urlGuardarCliente,
        method : idCliente ? 'PUT' : 'POST',
        data   : JSON.stringify(dataToSend),
    }

    setAjax(settings).then((response) => {
        infoMsg('success', 'Registro guardado exitósamente');
        if ( idCliente ) {
            searchCustomer(response.data[0].idSaveCustomer);
        } else {
            searchCustomer(response.data[0]);
        }
        clearCustomerForm('create');
        // $( "input#buscarCliente" ).val(telefono);
        // searchCustomer(telefono);
    }).catch((error) => {
        if(error.apiErrorPost.length > 0) {
            infoMsg('error', 'Algo salió mal en la creación del registro');
        } else {
            infoMsg('error', error.message);
        }
        
        console.log('Error en la consulta', error);
    });    
}

// Método para limpiar todos los campos del form de clientes
function clearCustomerForm(type = 'create') {
    $('table.table-address tbody').children('tr').remove();

    $('table.table-address tbody').append(
        '<tr>'+
            '<td class="text-center" colspan="3">Sin direcciones</td>'+
        '</tr>'
    );

    $(".only-fact").addClass("d-none");

    $(".dato-facturacion").addClass("d-none");
    $(".dato-regimen-moral").addClass("d-none");
    $(".dato-regimen-fisico").removeClass("d-none");

    // Limpia los textarea e inputs de todo el form
    $('#form-client-view').find('input.form-ptg[type="text"], input.form-ptg[type="email"], input.form-ptg[type="time"], input.form-ptg[type="number"], input.form-ptg[type="date"], textarea.form-ptg').val('');

    // Tab inicio
    $("input#tipoRegimen1").prop('checked', true).trigger("change");
    $("input#requiereFactura2").prop('checked', true);
    $('.dato-contrato').addClass('d-none');
    $("select#giroNegocioFormCliente").parent().addClass('d-none');
    $('#fechaInicioContratoCliente').attr('disabled', false);

    // Tab contacto
    $("input#rfcFormCliente").parent().parent().addClass('d-none');
    $('#tab-client-contacto').find('select.form-ptg').each(function( index ) {
        $( this ).val($(this).children("option:first").val());
    });

    // Tab programación
    $('#form-client-view').find('[type="checkbox"]').prop('checked', false);
    $("input#tipoAccionFormClient1").prop('checked', true);

    $("#nombreFacturacionFormCliente, #rfcFormCliente, #usoCfdiFormCliente, #correoAlternativoFormCliente, #copiarDatosContacto").prop("disabled", false);

    // Aquí empieza
    $( "#btnBack" ).trigger( "click" );
    $("button.next-to-domicilio").parent().addClass('d-none');// Se esconde el botón de siguiente para visualizar la vista de domiciliod
    $("div.domicilio-tab").addClass('d-none');
}