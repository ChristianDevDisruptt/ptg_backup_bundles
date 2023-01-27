// Abre el modal de direcciones
$("#agregarDirecciones, #agregarDireccion").click(function() {
    //loadMsg();
    if(loadColonias) {
        infoMsg('warning', 'Aun están cargando los datos para direcciones, favor de esperar un momento');
    } else {
        if($("#estadoDireccion option").length == 2) {
            $("#estadoDireccion").prop("disabled", true);
            $("#estadoDireccion").val($($("#estadoDireccion option")[1]).val()).trigger("change");
        } else {
            $("#estadoDireccion").prop("disabled", false);
        }    
        $("#formDireccionesModal").modal("show");
    }    
    //swal.close();            
    //getStates();
});

// Prellena los datos de una dirección en el modal
$("#editarDireccion").click(function() {
    if(loadColonias) {
        infoMsg('warning', 'Aun están cargando los datos para direcciones, favor de esperar un momento');
    } else {
        let direccion = $('#direccionCliente').children(':selected').data('address');
        $("#tipoAccionDireccion").val('guardar');
        let periodo = '';
        if ( direccion ) {
            if(customerGlobal.requiereFactura) {
                $($(".dato-facturacion").removeClass("d-none"));
            } else {
                $($(".dato-facturacion").addClass("d-none"));
            }
            // Se ocultan los campos de frecuencia y posteriormente se decide si se muestran o no
            $('.frecuencia-cada, .frecuencia-semana').addClass('d-none');
            if ( direccion.defaultBilling ) {// Dirección de facturación
                // $('#domFacturacionDireccion').parent().parent().removeClass('d-none');
                $('#domFacturacionDireccion').prop('checked', true);
            }
            
            $('#internalIdDireccion').val(direccion.idAdress);
            $('#cpDireccion').val(direccion.zip);
            $('#calleDireccion').val(direccion.nameStreet);
            $('#exteriorDireccion').val(direccion.numExterno);
            $('#interiorDireccion').val(direccion.numInterno);
            $('#entre1Direccion').val(direccion.entreCalle);
            $('#entre2Direccion').val(direccion.entreYCalle);
            $('#tipoServicioFormCliente').val(direccion.typeServiceId).trigger("change");
            $("#telefonoPrincipalDireccion").val(direccion.telefonoPrincipal);
    
            if(direccion.telefonoAdicionales) {
                if(direccion.telefonoAdicionales.split("|").length > 0) {
                    $("#telefonosAdicionales tbody").children('tr').remove();
                }
                direccion.telefonoAdicionales.split("|").forEach(element => {
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
    
            $('#entreFormCliente').val(formatTimeToPicker(direccion.ptg_entre_addr));
            $('#lasFormCliente').val(formatTimeToPicker(direccion.ptg_y_addr));
            $('#indicacionesFormCliente').val(direccion.commentsAddr);
    
            // Valida el tipo de servicio y los datos mostrados en la ruta
            // En caso de ser ambos, el item 1 se considera como cilindro y el item 2 como estacionario
            // Sí sólo es o cilindro o estacionario, se tomará el item1 para definir sus datos
            if ( direccion.typeServiceId == idCilindro ) {// Cilindro
                $('#articuloFrecuenteCilFormCliente').val(direccion.item1Id);
                $('#inputCapacidadCilTipoServicio').val(direccion.item1Capacidad);
            } else if ( direccion.typeServiceId == idEstacionario ) {// Estacionario
                $('#inputCapacidadEstTipoServicio').val(direccion.item1Capacidad);
            } else if ( direccion.typeServiceId == idMontacarga ) {// Montacarga
                $('#inputCapacidadMonTipoServicio').val(direccion.item1Capacidad);
            }
    
            // Campos de frecuencia
            
            $('#numeroSemana').val(parseInt(direccion.inThatWeek));
    
            $('#cadaFormCliente').val(direccion.frecuencia)
            $('#frecuenciaFormCliente').val(direccion.periodoId).trigger("change");
    
            // Días de la semana
            $('#lunesFormCliente').prop('checked', direccion.isLunes ? true : false);
            $('#martesFormCliente').prop('checked', direccion.isMartes ? true : false);
            $('#miercolesFormCliente').prop('checked', direccion.isMiercoles ? true : false);
            $('#juevesFormCliente').prop('checked', direccion.isJueves ? true : false);
            $('#viernesFormCliente').prop('checked', direccion.isViernes ? true : false);
            $('#sabadoFormCliente').prop('checked', direccion.isSabado ? true : false);
            $('#domingoFormCliente').prop('checked', direccion.isDomingo ? true : false);
            
            if(direccion.requiereContrato) {
                $('#requiereContrato1').prop('checked', true).trigger("change");
                $('#numeroContratoCliente').val(direccion.numeroContrato);
                $('#fechaInicioContratoCliente').val(dateFormatFromDate(direccion.fechaContrato, "2"));
                $('#fechaInicioContratoCliente').prop("disabled", true);
                $("input[name=requiereContrato]").prop("disabled", true);
            } else {
                $('#requiereContrato2').prop('checked', true).trigger("change");
            }
            
            // Falta código para mostrar ciertos campos cuando se define el tipo de acción
            if ( direccion.dataZoneRoute ) {
                setRouteData(direccion.dataZoneRoute);
            } else {
                $("input#zonaVentaDireccion, input#rutaColoniaIdDireccion, input#rutaIdDireccion, input#rutaId2Direccion").val('');
            }
    
            if(customerGlobal.alianzaComercial.toUpperCase() == "CREDITO") {
                $("input[name=requiereContrato]").prop("disabled", true);
            } else {
                $("input[name=requiereContrato]").prop("disabled", false);
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

            /*if(direccion.periodoId == "2") {
                if(direccion.isLunes && direccion.startDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.startDayService)).trigger("change");
                } else if(direccion.isMartes && direccion.martesDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.martesDayService)).trigger("change");
                } else if(direccion.isMiercoles && direccion.miercolesDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.miercolesDayService)).trigger("change");
                } else if(direccion.isJueves && direccion.juevesDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.juevesDayService)).trigger("change");
                } else if(direccion.isViernes && direccion.viernesDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.viernesDayService)).trigger("change");
                } else if(direccion.isSabado && direccion.sabadoDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.sabadoDayService)).trigger("change");
                } else if(direccion.isDomingo && direccion.domingoDayService) {
                    $('#fechaInicioServicio').val(getMomentDateFormat(direccion.domingoDayService)).trigger("change");
                }
            } else {*/
                $('#fechaInicioServicio').val(getMomentDateFormat(direccion.startDayService)).trigger("change");
            //}
                        
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
                if ( direccion.typeServiceId == idCilindro ) {// Cilindro
                    $("#rutaCiliMat").val(direccion.idRoute);
                    $("#rutaCiliVesp").val(direccion.idRoute2);
                } else if ( direccion.typeServiceId == idEstacionario ) {// Estacionario
                    $("#rutaEstaMat").val(direccion.idRoute);
                    $("#rutaEstaVesp").val(direccion.idRoute2);
                } else if ( direccion.typeServiceId == idMontacarga ) {// Montacarga
                    $("#rutaMonMat").val(direccion.idRoute);
                    $("#rutaMonVesp").val(direccion.idRoute2);
                }
            }
            $("#formDireccionesModal").modal("show");
            swal.close();     
        }
        console.log(direccion);
    }
});

// Prellena los datos de una dirección en el modal
$("#copiarDireccion").click(function() {
    if(loadColonias) {
        infoMsg('warning', 'Aun están cargando los datos para direcciones, favor de esperar un momento');
    } else {
        let direccion = $('#direccionCliente').children(':selected').data('address');
        $("#tipoAccionDireccion").val('guardar');
        let periodo = '';
        if ( direccion ) {
            if(customerGlobal.requiereFactura) {
                $($(".dato-facturacion").removeClass("d-none"));
            } else {
                $($(".dato-facturacion").addClass("d-none"));
            }
            // Se ocultan los campos de frecuencia y posteriormente se decide si se muestran o no
            $('.frecuencia-cada, .frecuencia-semana').addClass('d-none');
            if ( direccion.defaultBilling ) {// Dirección de facturación
                // $('#domFacturacionDireccion').parent().parent().removeClass('d-none');
                $('#domFacturacionDireccion').prop('checked', true);
            }
            
            $('#internalIdDireccion').val(null);
            $('#cpDireccion').val(direccion.zip);
            $('#calleDireccion').val(direccion.nameStreet);
            $('#exteriorDireccion').val(direccion.numExterno);
            $('#interiorDireccion').val(direccion.numInterno);
            $('#entre1Direccion').val(direccion.entreCalle);
            $('#entre2Direccion').val(direccion.entreYCalle);
            $('#tipoServicioFormCliente').val(null).trigger("change");
            $("#telefonoPrincipalDireccion").val(direccion.telefonoPrincipal);
    
            if(direccion.telefonoAdicionales) {
                if(direccion.telefonoAdicionales.split("|").length > 0) {
                    $("#telefonosAdicionales tbody").children('tr').remove();
                }
                direccion.telefonoAdicionales.split("|").forEach(element => {
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
    
            /*$('#entreFormCliente').val(formatTimeToPicker(direccion.ptg_entre_addr));
            $('#lasFormCliente').val(formatTimeToPicker(direccion.ptg_y_addr));
            $('#indicacionesFormCliente').val(direccion.commentsAddr);
    
            // Campos de frecuencia
    
            $('#frecuenciaFormCliente').val(direccion.periodoId).trigger("change");
            $('#fechaInicioServicio').val(getMomentDateFormat(direccion.startDayService));
            $('#cadaFormCliente').val(direccion.frecuencia)
            $('#frecuenciaFormCliente').val(periodo);
    
            // Días de la semana
            $('#lunesFormCliente').prop('checked', direccion.isLunes ? true : false);
            $('#martesFormCliente').prop('checked', direccion.isMartes ? true : false);
            $('#miercolesFormCliente').prop('checked', direccion.isMiercoles ? true : false);
            $('#juevesFormCliente').prop('checked', direccion.isJueves ? true : false);
            $('#viernesFormCliente').prop('checked', direccion.isViernes ? true : false);
            $('#sabadoFormCliente').prop('checked', direccion.isSabado ? true : false);
            $('#domingoFormCliente').prop('checked', direccion.isDomingo ? true : false);*/
            
            if(direccion.requiereContrato) {
                $('#requiereContrato1').prop('checked', true).trigger("change");
                $('#numeroContratoCliente').val(direccion.numeroContrato);
                $('#fechaInicioContratoCliente').val(dateFormatFromDate(direccion.fechaContrato, "2"));
                $('#fechaInicioContratoCliente').prop("disabled", true);
                $("input[name=requiereContrato]").prop("disabled", true);
            } else {
                $('#requiereContrato2').prop('checked', true).trigger("change");
            }
            
            // Falta código para mostrar ciertos campos cuando se define el tipo de acción
            if ( direccion.dataZoneRoute ) {
                setRouteData(direccion.dataZoneRoute);
            } else {
                $("input#zonaVentaDireccion, input#rutaColoniaIdDireccion, input#rutaIdDireccion, input#rutaId2Direccion").val('');
            }
    
            if(customerGlobal.alianzaComercial.toUpperCase() == "CREDITO") {
                $("input[name=requiereContrato]").prop("disabled", true);
            } else {
                $("input[name=requiereContrato]").prop("disabled", false);
            }
        
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
            swal.close();     
        }
        console.log(direccion);
    }
});

// Cuando el select de estados cambie, manda a llamar la petición de obtener ciudades
$('select#estadoDireccion').on('change', function(e) {
    let elem = $("#municipioDireccion");
        elem.children('option').remove();
        elem.append('<option value="">Seleccione una opción</option>');
    if($(this).val()) {        
        let auxMunicipios = $("#estadoDireccion option:selected").data("item").municipios;
        console.log($("#estadoDireccion option:selected").data("item"));

        let arrayMun = [];
        Object.keys(auxMunicipios).forEach(element => {
            arrayMun.push(auxMunicipios[element]); 
        });

        arrayMun.sort(dynamicSort("name"));
        arrayMun.forEach(element => {
            elem.append('<option data-item='+"'"+JSON.stringify(element)+"'"+' data-name="'+element.name+'" value="'+element.id+'">'+element.name+'</option>');
        });

        let valAux = "";
        
        if(Object.keys(auxMunicipios).length == 1) {
            valAux = auxMunicipios[Object.keys(auxMunicipios)[0]].id;
            elem.prop("disabled", true);
        } else {
            elem.prop("disabled", false);
        }
        elem.val(valAux).trigger("change");
        elem.select2({
            selectOnClose: true,
            dropdownParent: $('#formDireccionesModal'),
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
    } else {
        elem.val("").trigger("change");
        elem.prop("disabled", true);
    }    
});

$('select#municipioDireccion').on('change', function(e) {
    let elem = $("#coloniaDireccion");
        elem.children('option').remove();
        elem.append('<option value="">Seleccione una opción</option>');
    if($(this).val()) {
        let auxColonias = $("#municipioDireccion option:selected").data("item").colonias;
        console.log($("#municipioDireccion option:selected").data("item"));

        let arrayCol = [];
        Object.keys(auxColonias).forEach(element => {
            arrayCol.push(auxColonias[element]); 
        });

        arrayCol.sort(dynamicSort("name"));
        arrayCol.forEach(element => {
            elem.append('<option data-item='+"'"+JSON.stringify(element)+"'"+' data-name="'+element.name+'" value="'+element.id+'">'+element.name+'</option>');
        });

        let valAux = "";
        
        if(Object.keys(auxColonias).length == 1) {
            valAux = auxColonias[Object.keys(auxColonias)[0]].id;
            elem.prop("disabled", true);
        } else {
            elem.prop("disabled", false);
        }
        elem.val(valAux).trigger("change");
        elem.select2({
            selectOnClose: true,
            dropdownParent: $('#formDireccionesModal'),
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
    } else {
        elem.val("").trigger("change");
        elem.prop("disabled", true);
    }
});

// Se busca la zona de venta/ruta
$('select#coloniaDireccion').on('change', function(e) {
    let elem = $("#cpDireccion");
        elem.children('option').remove();
        elem.append('<option value="">Seleccione una opción</option>');
    if($(this).val()) {   
        let auxCps = $("#coloniaDireccion option:selected").data("item").cps;
        console.log($("#coloniaDireccion option:selected").data("item"));

        let arrayCp = [];
        Object.keys(auxCps).forEach(element => {
            arrayCp.push(auxCps[element]); 
        });

        arrayCp.sort(dynamicSort("cp"));
        arrayCp.forEach(element => {
            elem.append('<option data-item='+"'"+JSON.stringify(element)+"'"+' data-name="'+element.cp+'" value="'+element.cpId+'">'+element.cp+'</option>');
        });

        let valAux = "";
        //console.log("prueba", Object.keys(auxCps).length, Object.keys(auxCps), auxCps[Object.keys(auxCps)[0]].id);
        if(Object.keys(auxCps).length == 1) {
            valAux = auxCps[Object.keys(auxCps)[0]].cpId;
            elem.prop("disabled", true);
        } else {
            elem.prop("disabled", false);
        }
        elem.val(valAux).trigger("change");
        elem.select2({
            selectOnClose: true,
            dropdownParent: $('#formDireccionesModal'),
            language: {
                "noResults": function(){
                    return "Sin resultados encontrados";
                }
            }
        });
    } else {
        elem.val("").trigger("change");
        elem.prop("disabled", true);
    }
});

// Se busca la zona de venta/ruta
$('select#cpDireccion').on('change', function(e) {
    console.log($("#cpDireccion option:selected").data("item"));
    setDataAuxDireccion();
    if( $("#cpDireccion").val() ) {
        let auxItem = $("#cpDireccion option:selected").data("item");
        let rutasCilindros = {},
            rutasEstacionarios = {};
        if(auxItem.rutaCilId) {
            auxItem.rutaCilId.split(",").forEach((element, key) => {
                if(!rutasCilindros[element]) {
                    rutasCilindros[element] = {id: element, name: auxItem.rutaCil.split(",")[key]};
                }
            });
        }
        if(auxItem.rutaEstaId) {
            console.log(auxItem.rutaEstaId, auxItem.rutaEsta);
            auxItem.rutaEstaId.split(",").forEach((element, key) => {
                if(!rutasEstacionarios[element]) {
                    rutasEstacionarios[element] = {id: element, name: auxItem.rutaEsta.split(",")[key]};
                }
            });
        }
        console.log(rutasCilindros, rutasEstacionarios);
        setDataRutas(rutasCilindros, $("#rutaCiliMat, #rutaCiliVesp"), false);
        setDataRutas(rutasEstacionarios, $("#rutaEstaMat, #rutaEstaVesp"), false);
        setDataRutas(rutasEstacionarios, $("#rutaMonMat, #rutaMonVesp"), false);
    } else {
        setDataRutas({}, $("#rutaCiliMat, #rutaCiliVesp"), false);
        setDataRutas({}, $("#rutaEstaMat, #rutaEstaVesp"), false);
        setDataRutas({}, $("#rutaMonMat, #rutaMonVesp"), false);
    }
});

function setDataAuxDireccion() {
    //let plantaActual   = $("#plantas option:selected").text().trim();

    if( $("#cpDireccion").val() ) {
        let auxItem = $("#cpDireccion option:selected").data("item");
        $("#zonaVentaDireccion").val(auxItem.zonePrice);   
    } else {
        $("#zonaVentaDireccion, #cpDireccion").val("");
    }
}

function setDataRutas(items, elem, trigger = true) {
    elem.children('option').remove();
    elem.append('<option value="">Seleccione una opción</option>');

    Object.keys(items).forEach(element => {
        elem.append('<option data-item='+"'"+JSON.stringify(items[element])+"'"+' value="'+items[element].name+'">'+getRouteNumber(":"+items[element].name)+'</option>');
    });

    if(Object.keys(items).length == 1) {
        if(trigger) {
            elem.val(Object.keys(items)[0]).trigger("change");
        } else {
            elem.val(Object.keys(items)[0]);
        }
        elem.prop("disabled", true);
    } else {
        elem.val(null);
        elem.prop("disabled", false);
    }
}

// Se debe modificar la ruta dependiendo del tipo de servicio
$('select#tipoServicioFormCliente').on('change', function(e) {
    let val = $(this).val();
    $('.art-fre-est').addClass('d-none');
    $('.art-fre-cil').addClass('d-none');
    $('.art-fre-mon').addClass('d-none');
    if ( val == idCilindro ) {// Cilindros
        $('.art-fre-cil').removeClass('d-none');
    } else if ( val == idEstacionario ) {// Estacionarios
        $('.art-fre-est').removeClass('d-none');
    } else if ( val == idMontacarga ) {// montacarga
        $('.art-fre-mon').removeClass('d-none');
    }

    // Setea o resetea los campos de ruta
    setDataAuxDireccion();

    // Nota: Preferible agregar una función que haga esto.
    //console.log('Falta código para validar los inputs relacionados a las rutas');
});

// Cambia la información de los campos relacionados a la ruta de envío
function setRouteData(route) {
    let tipoServicioId = $('#tipoServicioFormCliente').val();
    // console.log('Data: ', data);
    let nombreRuta = ubicacionId = '';
    let zonaVenta = route.zona_venta;
    let routeId = route.id;
    let ubicacionId2 = null;
    let splitRutaCil = route.nameUbicacionCil.split(" : ");
    let splitRutaEst = route.nameUbicacionEst.split(" : ");
    if ( tipoServicioId == 1 ) {//Cilindro
        console.log('cilindro');
        splitRutaCil[1] ? ( nombreRuta+=splitRutaCil[1] ) : '';
        ubicacionId = route.ubicacionCil;
    } else if( tipoServicioId == 2 ) {// Estacionario
        console.log('estacionario');
        splitRutaEst[1] ? ( nombreRuta+=splitRutaEst[1] ) : '';
        ubicacionId = route.ubicacionEst;
    } else if( tipoServicioId == 4 ) {// Ambas
        console.log('ambas');
        splitRutaCil[1] ? ( nombreRuta+=splitRutaCil[1] ) : '';
        splitRutaEst[1] ? ( nombreRuta+=', '+splitRutaEst[1] ) : '';
        ubicacionId  = route.ubicacionCil;
        ubicacionId2 = route.ubicacionEst;
    } else {// No se ha seleccionado nada
        console.log('ninguna seleccionada');
        nombreRuta = zonaVenta = '';
        ubicacionId = ubicacionId2 = routeId = null;
    }

    $("input#zonaVentaDireccion").val(zonaVenta);
    $("input#rutaColoniaIdDireccion").val(routeId);
    $("input#rutaIdDireccion").val(ubicacionId);
    $("input#rutaId2Direccion").val(ubicacionId2);
}