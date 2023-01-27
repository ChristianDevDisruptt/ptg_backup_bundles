// Valida una dirección a guardar
$('body').delegate('#guardarDireccion', 'click', function () {
    validateAddressFields("guardar");
});

// Valida la frecuencia de un pedido tipo aviso o programado
$("#frecuenciaFormCliente").on('change', function(e) {
    let val = $(this).val();
    $('.dias-semana').prop('disabled', false);
    // $('.dias-semana').prop('checked', false);
    $('.frecuencia-cada, .frecuencia-semana').addClass('d-none');
    $("#fechaInicioServicio").closest(".col-6").removeClass("d-none");

    if ( val == idDiario ) { // Diario
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', true);    
        $("#fechaInicioServicio").closest(".col-6").addClass("d-none");
    } else if(val == idSemanal) {
        $("#fechaInicioServicio").closest(".col-6").addClass("d-none");
    } else if ( val == idSemanas ) { // Semanas
        arrayDaysOfWeek = [];
        $('.frecuencia-cada').removeClass('d-none');
        $('#fechaInicioServicio').val('');
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', false);
    } else if ( val == idMeses ) { //Meses
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', false);
        $('.frecuencia-cada').removeClass('d-none');
    } else if ( val == idDias ) { //Días
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', false);
        $('.frecuencia-cada').removeClass('d-none');
    } else if ( val == idDias ) { //Días
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', false);
    } else if ( val == idMensual ) { //Mensual
        $('.dias-semana').prop('disabled', true);
        $('.dias-semana').prop('checked', false);
    }
});

// Obtiene el arreglo de objetos de los días de una semana en específico
function getDaysOfWeek(fecha) {
    arrayDaysOfWeek = [];
    let newDate     = new Date();
    let fechaSplit  = fecha.split('-');

    console.log(fechaSplit);
    
    if ( fechaSplit.length ) {
        newDate.setDate(fechaSplit[2]);
        newDate.setMonth( Number(fechaSplit[1]) - 1 );
        newDate.setFullYear(fechaSplit[0]);

        let customDate = moment(newDate);
        let cloneDate = customDate.clone().startOf('isoWeek');
        
        for (i = 0; i <= 6; i++) {
            arrayDaysOfWeek.push({
                id : i,
                fecha: moment(cloneDate).add(i, 'days').format("YYYY-MM-DD"),
            });
        }
    }

    return arrayDaysOfWeek;
}

// Método para validar los campos de una dirección
function validateAddressFields(type) {
    if(!type) {
        return;
    }
    let tipoAccion = $("#tipoAccionDireccion").val();
    let numAddress = $('table.table-address tbody').children('tr.address').length;
    if(validateForm($("#formDireccionesModal"))) {
        return;
    }
    if(
        // Dependiendo del tipo de acción, se validará los campos requeridos
        $("input[name=tipoAccionFormCliente]:checked").val() != "1" && 
        $("#frecuenciaFormCliente").val() != idDias &&
        $("#frecuenciaFormCliente").val() != idDiario &&
        ( 
            ($("#frecuenciaFormCliente").val() == idSemanal && $('input.dias-semana:checked').length == 0) // Semanal
        ) 
    ) {
        infoMsg('warning', 'Seleccionar al menos un día de la semana');
        return;
    }


    // Devuelve un objeto formateado con la información de la dirección a guardar en netsuite
    let address = getAddressOnList();
    console.log(address);
    // Enlista las direcciones en  una tabla dinámica
    if ( tipoAccion == 'lista' ) {
        // Valida que el domicilio d facturación sólo lo tenga una dirección
        validateTableAddress(address.obj);
        // Si es la primera dirección que se agrega, se limpia el texto por defecto de la tabla
        if (! numAddress ) {
            $('table.table-address tbody').children('tr').remove();
        }
        //console.log(address);
        if(address.obj.domFacturacion) {
            let trs = $('table.table-address tbody').find(".address");
            for (let x = 0; x < trs.length; x++) {
                const element = $(trs[x]);
                let addressAux = element.data('address');
                addressAux.domFacturacion = false;
                element.data('address', address);
                element.find('.check-fact').parent().html('<i class="fa-regular fa-square color-primary check-fact" style="cursor: pointer;"></i>');
            }
        }
        $('table.table-address tbody').append(
            '<tr class="address" data-time="'+address.obj.timeUnix+'" data-address='+"'"+JSON.stringify(address.obj)+"'"+'>'+
                '<td>'+address.str+'</td>'+
                '<td class="text-center">'+
                    '<div class="text-center" style="font-size: 26px;">'+
                        (address.obj.principal ? '<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-entrega" style="cursor: pointer;"></i>')+
                    '</div>'+
                '</td>'+
                '<td class="text-center dato-facturacion '+($("input[name=requiereFactura]:checked").val() == "si" ? '' : 'd-none')+'">'+
                    '<div class="text-center" style="font-size: 26px;">'+
                        (address.obj.domFacturacion ? '<i class="fa-solid fa-square-check color-primary check-fact" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-fact" style="cursor: pointer;"></i>')+
                    '</div>'+/*'<div class="text-center" style="font-size: 20px;">'+
                        '<div class="content-input content-input-primary">'+
                            '<input id="domFacturacionDireccion'+address.obj.timeUnix+'" type="checkbox" class="form-check-input form-ptg address-table" '+(address.obj.domFacturacion ? 'checked' : '')+' style="width: auto;" value="">'+
                        '</div>'+
                        // (address.obj.principal ? '<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-entrega" style="cursor: pointer;"></i>')+
                    '</div>'+*/
                '</td>'+
                '<td class="text-center">'+
                    '<button class="btn btn-sm btn-info edit-address"> <i class="fa fa-pen-to-square"></i> </button>&nbsp;&nbsp;'+
                    '<button class="btn btn-sm btn-danger delete-address"> <i class="fa-solid fa-trash-can"></i> </button>&nbsp;&nbsp;'+
                    '<button class="btn btn-sm btn-primary copy-address"> <i class="fa-solid fa-copy"></i> </button>'+
                '</td>'+
            '</tr>'
        )

        $('div#formDireccionesModal').modal('hide');
    } else if ( tipoAccion == 'editLista' ) {
        // Valida que el domicilio d facturación sólo lo tenga una dirección
        /*validateTableAddress(address.obj);
        //console.log(address);
        if(address.obj.domFacturacion) {
            let trs = $('table.table-address tbody').find(".address");
            for (let x = 0; x < trs.length; x++) {
                const element = $(trs[x]);
                let addressAux = element.data('address');
                addressAux.domFacturacion = false;
                element.data('address', address);
                element.find('.check-fact').parent().html('<i class="fa-regular fa-square color-primary check-fact" style="cursor: pointer;"></i>');
            }
        }*/
        var auxEdit = $("#tipoAccionDireccion").data("auxEdit");
        address.obj.timeUnix = auxEdit.timeUnix;
        address.obj.principal = auxEdit.principal;
        address.obj.domFacturacion = auxEdit.domFacturacion;
        
        $('table.table-address tbody').find("tr[data-time="+address.obj.timeUnix+"]").data("address", address.obj)
        $('table.table-address tbody').find("tr[data-time="+address.obj.timeUnix+"]").html('<td>'+address.str+'</td>'+
            '<td class="text-center">'+
                '<div class="text-center" style="font-size: 26px;">'+
                    (address.obj.principal ? '<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-entrega" style="cursor: pointer;"></i>')+
                '</div>'+
            '</td>'+
            '<td class="text-center dato-facturacion '+($("input[name=requiereFactura]:checked").val() == "si" ? '' : 'd-none')+'">'+
                '<div class="text-center" style="font-size: 26px;">'+
                    (address.obj.domFacturacion ? '<i class="fa-solid fa-square-check color-primary check-fact" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-fact" style="cursor: pointer;"></i>')+
                '</div>'+/*'<div class="text-center" style="font-size: 20px;">'+
                    '<div class="content-input content-input-primary">'+
                        '<input id="domFacturacionDireccion'+address.obj.timeUnix+'" type="checkbox" class="form-check-input form-ptg address-table" '+(address.obj.domFacturacion ? 'checked' : '')+' style="width: auto;" value="">'+
                    '</div>'+
                    // (address.obj.principal ? '<i class="fa-solid fa-square-check color-primary check-entrega" style="cursor: pointer;"></i>' : '<i class="fa-regular fa-square color-primary check-entrega" style="cursor: pointer;"></i>')+
                '</div>'+*/
            '</td>'+
            '<td class="text-center">'+
                '<button class="btn btn-sm btn-info edit-address"> <i class="fa fa-pen-to-square"></i> </button>&nbsp;&nbsp;'+
                '<button class="btn btn-sm btn-danger delete-address"> <i class="fa-solid fa-trash-can"></i> </button>&nbsp;&nbsp;'+
                '<button class="btn btn-sm btn-primary copy-address"> <i class="fa-solid fa-copy"></i> </button>'+
            '</td>');

        $('div#formDireccionesModal').modal('hide');
    } else if( tipoAccion == 'guardar' ) {// Envía una dirección a guardar o actualizar
        let idAddress = $('#internalIdDireccion').val();
        let dataToSend = null;

        if ( idAddress ) {// Se actualiza la dirección
            let updateAddress = {}

            address.obj['domFacturacion'] ? updateAddress['defaultbilling'] = address.obj['domFacturacion'] : '';
            address.obj['stateName'] ? updateAddress['custrecord_ptg_estado'] = address.obj['stateName'] : '';
            address.obj['ruta'] ? updateAddress['custrecord_ptg_colonia_ruta'] = address.obj['ruta'] : '';
            address.obj['colonia'] ? updateAddress['custrecord_ptg_nombre_colonia'] = address.obj['colonia'] : '';
            address.obj['lunes'] ? updateAddress['custrecord_ptg_lunes'] = address.obj['lunes'] : '';
            address.obj['city'] ? updateAddress['city'] = address.obj['city'] : '';
            address.obj['ruta'] ? updateAddress['custrecord_ptg_colonia_ruta'] = address.obj['ruta'] : '';
            updateAddress['custrecord_ptg_ruta_asignada'] = address.obj['idRoute'] ? address.obj['idRoute'] : '';
            updateAddress['custrecord_ptg_ruta_asignada2'] = address.obj['idRoute2'] ? address.obj['idRoute2'] : '';
            address.obj['colonia'] ? updateAddress['custrecord_ptg_nombre_colonia'] = address.obj['colonia'] : '';
            address.obj.hasOwnProperty( 'lunes' ) ? updateAddress['custrecord_ptg_lunes'] = address.obj['lunes'] : '';
            address.obj.hasOwnProperty( 'martes' ) ? updateAddress['custrecord_ptg_martes'] = address.obj['martes'] : '';
            address.obj.hasOwnProperty( 'miercoles' ) ? updateAddress['custrecord_ptg_miercoles'] = address.obj['miercoles'] : '';
            address.obj.hasOwnProperty( 'jueves' ) ? updateAddress['custrecord_ptg_jueves'] = address.obj['jueves'] : '';
            address.obj.hasOwnProperty( 'viernes' ) ? updateAddress['custrecord_ptg_viernes'] = address.obj['viernes'] : '';
            address.obj.hasOwnProperty( 'sabado' ) ? updateAddress['custrecord_ptg_sabado'] = address.obj['sabado'] : '';
            address.obj.hasOwnProperty( 'domingo' ) ? updateAddress['custrecord_ptg_domingo'] = address.obj['domingo'] : '';
            updateAddress['custrecord_ptg_cada'] = address.obj['cada'] ? address.obj['cada'] : '';
            address.obj['frecuencia'] ? updateAddress['custrecord_ptg_periodo_contacto'] = address.obj['frecuencia'] : '';
            address.obj['entre_las'] ? updateAddress['custrecord_ptg_entre_las'] = address.obj['entre_las'] : '';
            address.obj['y_las'] ? updateAddress['custrecord_ptg_y_las'] = address.obj['y_las'] : '';
            address.obj['inThatWeek'] ? updateAddress['custrecord_ptg_en_la_semana'] = address.obj['inThatWeek'] : '';// Hay que actualizar el custom record
            address.obj['typeContact'] ? updateAddress['custrecord_ptg_tipo_contacto'] = address.obj['typeContact'] : '';
            address.obj['typeService'] ? updateAddress['custrecord_ptg_tipo_servicio'] = address.obj['typeService'] : '';
            address.obj['frequencyItem'] ? updateAddress['custrecord_ptg_articulo_frecuente'] = address.obj['frequencyItem'] : '';
            address.obj['capacidad'] ? updateAddress['custrecord_ptg_capacidad_art'] = address.obj['capacidad'] : '';
            address.obj['frequencyItem2'] ? updateAddress['custrecord_ptg_articulo_frecuente2'] = address.obj['frequencyItem2'] : '';
            address.obj['capacidad2'] ? updateAddress['custrecord_ptg_capacidad_can_articulo_2'] = address.obj['capacidad2'] : '';
            updateAddress['custrecord_ptg_entrecalle_'] = address.obj['street_aux1'] ? address.obj['street_aux1'] : '';
            updateAddress['custrecord_ptg_y_entre_'] = address.obj['street_aux2'] ? address.obj['street_aux2'] : '';
            address.obj['nameStreet'] ? updateAddress['custrecord_ptg_street'] = address.obj['nameStreet'] : '';
            address.obj['numExterno'] ? updateAddress['custrecord_ptg_exterior_number'] = address.obj['numExterno'] : '';
            updateAddress['custrecord_ptg_interior_number'] = address.obj['numInterno'] ? address.obj['numInterno'] : '';
            address.obj['commentsAddress'] ? updateAddress['custrecord_ptg_obesarvaciones_direccion_'] = address.obj['commentsAddress'] : '';
            address.obj['telefonoPrinc'] ? updateAddress['custrecord_ptg_telefono_principal'] = address.obj['telefonoPrinc'] : '';
            updateAddress['custrecord_ptg_telefono_alterno'] = address.obj['telefonoSec'];
            updateAddress['custrecord_ptg_fecha_inicio_servicio'] = address.obj['startDayService'] ? address.obj['startDayService']: '';

            //programados

            if(updateAddress['custrecord_ptg_tipo_contacto'] != 1) {
                if($("#frecuenciaFormCliente").val() == idDiario) {
                    updateAddress['custrecord_ptg_cada'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                } else if($("#frecuenciaFormCliente").val() == idDias) {
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                } else if($("#frecuenciaFormCliente").val() == idSemanal) {
                    updateAddress['custrecord_ptg_cada'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                } else if($("#frecuenciaFormCliente").val() == idSemanas) {
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                } else if($("#frecuenciaFormCliente").val() == idMensual) {
                    updateAddress['custrecord_ptg_cada'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                } else if($("#frecuenciaFormCliente").val() == idMeses) {
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = '';
                    updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = '';
                }
                
            } else {
                updateAddress['custrecord_ptg_lunes'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio'] = address.obj['date_lunes'] ? address.obj['date_lunes'] : '';

                updateAddress['custrecord_ptg_martes'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_mar'] = address.obj['date_martes'] ? address.obj['date_martes'] : '';

                updateAddress['custrecord_ptg_miercoles'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_mi'] = address.obj['date_miercoles'] ? address.obj['date_miercoles'] : '';

                updateAddress['custrecord_ptg_jueves'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_jue'] = address.obj['date_jueves'] ? address.obj['date_jueves'] : '';

                updateAddress['custrecord_ptg_viernes'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_vi'] = address.obj['date_viernes'] ? address.obj['date_viernes'] : '';

                updateAddress['custrecord_ptg_sabado'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_sab'] = address.obj['date_sabado'] ? address.obj['date_sabado'] : '';

                updateAddress['custrecord_ptg_domingo'] = false;
                updateAddress['custrecord_ptg_fecha_inicio_servicio_dom'] = address.obj['date_domingo'] ? address.obj['date_domingo'] : '';

            }
            

            if(!$("#fechaInicioContratoCliente").prop("disabled")) {
                if(address.obj['isContract']) {
                    updateAddress['custrecord_ptg_direccion_contrato'] = true;
                    updateAddress['custrecord_ptg_fecha_alta_contrato'] = address.obj['contractDate'];
                }
            }

            dataToSend = {
                "customers" : [
                    {
                        id : customerGlobal.id,
                        bodyFields : {},
                        bodyAddress : [
                            {
                                id : idAddress,
                                addresses : updateAddress
                            }
                        ]
                    }
                ] 
            };
        } else {// Se guarda
            console.log(address);
            address.obj.tag = $("#direccionCliente").children("option").length > 9 ? $("#direccionCliente").children("option").length.toString() : "0"+$("#direccionCliente").children("option").length.toString();
            address.obj.defaultshipping = false;
            address.obj.addresses = {defaultshipping : false}
            address.obj.principal = false;
            dataToSend = {
                "customers" : [
                    {
                        id : customerGlobal.id,
                        bodyFields : {
                            'custentity_ptg_indicaciones_cliente' : customerGlobal?.notasCustomer
                        },
                        bodyAddress : [
                            address.obj                          
                        ]
                    }
                ]
            }

        }
        
        loadMsg('Guardando dirección...');
        let settings = {
            url      : urlGuardarCliente,
            method   : 'PUT',
            data     : JSON.stringify(dataToSend),
        }
        console.log(idAddress);
        setAjax(settings).then((response) => {
            infoMsg('success', 'Datos de dirección guardados exitósamente');
            $('div.modal').modal('hide');
            searchCustomer(customerGlobal.id, idAddress);
        }).catch((error) => {
            infoMsg('error', 'Algo salió mal en la creación del registro');
            console.log('Error en la consulta', error);
        });
    }
}

ajaxEstados = null;

function getEstados(trigger = false, callback = null) {
    if(ajaxEstados) {
        ajaxEstados.abort();
    }
    loadColonias = true;
    let elem = $("#estadoDireccion");
        elem.children('option').remove();
        elem.append('<option value="">Seleccione una opción</option>');
    let settings = {
        url      : urlGetEstados,
        method   : 'POST',
        data     : JSON.stringify({
            "planta" : $("#plantas option:selected").text().trim()
        }),
    }

    ajaxEstados = $.ajax({
        url: settings.url,
        method: settings.method,
        data: settings.data ?? null,
        contentType: 'application/json',
        dataType: 'json',
        success: function (response) {
            loadColonias = false;
            if ( response.success ) {
                if(response.data.length > 0) {
                    let auxEstados = {};
                    response.data.forEach(element => {
                        if(element.estadoId && !auxEstados[element.estadoId]) {
                            auxEstados[element.estadoId] = {
                                id: element.estadoId,
                                name: element.estado,
                                municipios: {}
                            }
                        }
        
                        if(element.estadoId && element.municipioId && !auxEstados[element.estadoId].municipios[element.municipioId]) {
                            auxEstados[element.estadoId].municipios[element.municipioId] = {
                                id: element.municipioId,
                                name: element.municipio,
                                colonias: {}
                            }
                        }
                        if(element.estadoId && element.municipioId && element.coloniaId && !auxEstados[element.estadoId].municipios[element.municipioId].colonias[element.coloniaId]) {
                            auxEstados[element.estadoId].municipios[element.municipioId].colonias[element.coloniaId] = {
                                id: element.coloniaId,
                                name: element.colonia,
                                cps: {}
                            };
                        }
                        if(element.estadoId && element.municipioId && element.coloniaId && element.cpId && !auxEstados[element.estadoId].municipios[element.municipioId].colonias[element.coloniaId].cps[element.cpId]) {
                            auxEstados[element.estadoId].municipios[element.municipioId].colonias[element.coloniaId].cps[element.cpId] = element;
                        }
                    });            
                    let arrayEst = [];
                    Object.keys(auxEstados).forEach(element => {
                        arrayEst.push(auxEstados[element]);                
                    });
                    arrayEst.sort(dynamicSort("name"));
                    arrayEst.forEach(element => {
                        elem.append('<option data-item='+"'"+JSON.stringify(element)+"'"+' data-name="'+element.name+'" value="'+element.id+'">'+element.name+'</option>');
                    });
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
                    $("#estadoDireccion").val("").trigger("change");
                    infoMsg('warning', 'Alerta:', 'No se encontraron estados para la planta actual favor de volver a intentarlo');
                }
            } else {
                infoMsg('warning', 'Alerta:', 'Ocurrio un error al tratar de obtener los estados para la planta actual favor de volver a intentarlo');
            }
            ajaxEstados = null;
        }, error: function (xhr, status, error) {
            console.log(error);
            if(error != "abort") {
                infoMsg('warning', 'Alerta:', 'Ocurrio un error al tratar de obtener los estados para la planta actual favor de volver a intentarlo');
            }        
        }
    });
}

function setDataDireccion(items, elem, trigger = true) {
    elem.children('option').remove();
    elem.append('<option value="">Seleccione una opción</option>');
    console.log(Object.keys(items));
    Object.keys(items).forEach(element => {
        elem.append('<option '+(items[element].zip ? 'data-cp="'+items[element].zip+'"' : '')+' data-item='+"'"+JSON.stringify(items[element])+"'"+' value="'+items[element].name+'">'+items[element].name+'</option>');
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

    elem.select2({
        selectOnClose: true,
        dropdownParent: $('#formDireccionesModal'),
        language: {
            "noResults": function(){
                return "Sin resultados encontrados";
            }
        }
    });
}

// Muestra las rutas acorde a si la dirección otorgada es cilindro, estacionario o ambas
function setTextRoutesByAddress(address) {
    $('#rutaMat').text(address.route ? getRouteNumber(address.route) : 'Sin ruta');
    $('#rutaVesp').text(address.route2 ? getRouteNumber(address.route2) : 'Sin ruta');    
    initTooltips();
}

// Obtiene la ruta completa de la dirección
function getRouteStr(route) {
    let splited = route.split(':');

    return splited[1] ?? 'Sin ruta';
}

// Obtiene el número del vehículo la ruta
function getRouteNumber(route) {
    
    let rutaSplited = route.split(':');
    let nombreRuta  = '';
    let numeroRuta  = '';
    if ( rutaSplited[1] ) {// Tiene secciones
        nombreRuta = rutaSplited[1].split(' - ');

        if ( nombreRuta.length && nombreRuta[0] ) {
            numeroRuta = nombreRuta[0].split('-');
            if (numeroRuta.length && numeroRuta[2]) {
                return numeroRuta[2];

            } else {
                return nombreRuta[0];
            }
        } else {
            return rutaSplited[1];
        }
    } else {
        console.log(route);
        return route;
    }
}

$('body').delegate('#fechaInicioServicio', 'change', function () {
    /*if($("#frecuenciaFormCliente").val() == idSemanas) {
        $(".dias-semana").prop("disabled", false).prop("checked", false);
        let auxVal = dateFormatFromString($("#fechaInicioServicio").val()).getDay();
        if(auxVal == 0) {
            $("#domingoFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 1) {
            $("#lunesFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 2) {
            $("#martesFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 3) {
            $("#miercolesFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 4) {
            $("#juevesFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 5) {
            $("#viernesFormCliente").prop("disabled", true).prop("checked", true);
        } else if(auxVal == 6) {
            $("#sabadoFormCliente").prop("disabled", true).prop("checked", true);
        }
    }    */
});

// Coloca una dirección en el listado de direcciones del cliente
function getAddressOnList() {
    let addressStr = '';
    let requiereFactura = $("input[name=requiereFactura]:checked").val();
    let customStartTime = customEndTime = new Date();
    let yLas            = $("#lasFormCliente").val();
    let entreLas        = $("#entreFormCliente").val();
    let tipoServicioId  = $("#tipoServicioFormCliente").val();
    //let periodoContacto = $("select#frecuenciaFormCliente").val();
    let horaInicio      = entreLas.split(':');
    let horaFin         = yLas.split(':');
    let periodo         = parseInt($("#frecuenciaFormCliente").val());
    let tipoContacto    = parseInt($("input[name=tipoAccionFormCliente]:checked").val());
    let domFacturacion  = $('#domFacturacionDireccion').is(':checked');
    let coloniaRutas    = $('#coloniaDireccion').children(':selected').data('item');
    let requiereContrato  = ($("input[name=requiereContrato]:checked").val() == "si" ? true : false);

    if ( horaInicio.length ) {
        customStartTime.setHours(horaInicio[0]);
        customStartTime.setMinutes(horaInicio[1]);
        horaInicioStr = moment(customStartTime).format('h:mm a');
        console.log('Hora inicio: '+ horaInicioStr);
    }

    if ( horaFin.length ) {
        customEndTime.setHours(horaFin[0]);
        customEndTime.setMinutes(horaFin[1]);
        horaFinStr = moment(customEndTime).format('h:mm a');
        console.log('Hora fin: '+ horaFinStr);
    }

    let addressObj = {
        timeUnix        : Date.now(),
        principal       : $('table.table-address tbody').find(".address").length == 0 ? true : false,
        stateName       : $("#estadoDireccion option:selected").data('item').name.trim(),
        domFacturacion  : ( $('table.table-address tbody').find(".address").length == 0 ? (requiereFactura == 'si' ? true : false) : ( requiereFactura == 'si' ? $('#domFacturacionDireccion').is(':checked') : false ) ),
        city            : $("#municipioDireccion option:selected").data('item').name.trim(),
        zip             : $("#cpDireccion option:selected").data('item').cp.trim(),
        nameStreet      : $("#calleDireccion").val().trim(),
        numExterno      : $("#exteriorDireccion").val().trim(),
        numInterno      : $("#interiorDireccion").val().trim(),
        colonia         : $("#coloniaDireccion option:selected").data('item').name.trim(),
        latitud         : "",
        longitud        : "",
        street_aux1     : $("#entre1Direccion").val().trim(),
        street_aux2     : $("#entre2Direccion").val().trim(),
        //zonaVenta       : $("#zonaVentaDireccion").val().trim(),
        ruta            : $("#cpDireccion option:selected").data("item").id,
        // idRoute         : parseInt($("#tipoServicioFormCliente").val()) == 1 || parseInt($("#tipoServicioFormCliente").val()) == 4 ? $("#coloniaDireccion option:selected").data("item").rutaCilId : $("#coloniaDireccion option:selected").data("item").rutaEstaId,//$("#rutaIdDireccion").val().trim(),
        // idRoute2        : parseInt($("#tipoServicioFormCliente").val()) == 4 ? $("#coloniaDireccion option:selected").data("item").rutaEstaId : null,//$("#rutaId2Direccion").val().trim(),
        typeContact     : tipoContacto,
        inThatWeek      : ( tipoContacto != 1 && periodo == idMeses ? $('#numeroSemana').val() : null ),
        startDayService : ( tipoContacto != 1 && (periodo == idDias || periodo == idSemanas || periodo == idMensual || periodo == idMeses) ? dateFormatFromDate( $("#fechaInicioServicio").val(), '5' ) : null ),
        cada            : tipoContacto != 1 && (periodo == idDias || periodo == idSemanas || periodo == idMeses) ? parseInt($("#cadaFormCliente").val()) : null,
        frecuencia      : tipoContacto != 1 ? periodo : null,
        entre_las       : tipoContacto != 1 ? horaInicioStr : null,
        y_las           : tipoContacto != 1 ? horaFinStr : null,
        lunes           : tipoContacto != 1 ? $("#lunesFormCliente").prop("checked") : false,
        martes          : tipoContacto != 1 ? $("#martesFormCliente").prop("checked") : false,
        miercoles       : tipoContacto != 1 ? $("#miercolesFormCliente").prop("checked") : false,
        jueves          : tipoContacto != 1 ? $("#juevesFormCliente").prop("checked") : false,
        viernes         : tipoContacto != 1 ? $("#viernesFormCliente").prop("checked") : false,
        sabado          : tipoContacto != 1 ? $("#sabadoFormCliente").prop("checked") : false,
        domingo         : tipoContacto != 1 ? $("#domingoFormCliente").prop("checked") : false,
        typeService     : parseInt($("#tipoServicioFormCliente").val()),
        commentsAddress : $("#indicacionesFormCliente").val().trim(),
        tag             : '',
        isContract      : requiereContrato,
        contractDate    : requiereContrato ? dateFormatFromDate($('#fechaInicioContratoCliente').val(), '5') : null,
        telefonoPrinc   : $("#telefonoPrincipalDireccion").val(),
        telefonoSec     : '',
    }

    if(periodo == idSemanas) {
        let aux = getDaysOfWeek($("#fechaInicioServicio").val());
        if(addressObj.lunes) {
            addressObj.date_lunes = dateFormatFromDate(aux[0].fecha, '5' );
        }
        if(addressObj.martes) {
            addressObj.date_martes = dateFormatFromDate(aux[1].fecha, '5' );
        }
        if(addressObj.miercoles) {
            addressObj.date_miercoles = dateFormatFromDate(aux[2].fecha, '5' );
        }
        if(addressObj.jueves) {
            addressObj.date_jueves = dateFormatFromDate(aux[3].fecha, '5' );
        }
        if(addressObj.viernes) {
            addressObj.date_viernes = dateFormatFromDate(aux[4].fecha, '5' );
        }
        if(addressObj.sabado) {
            addressObj.date_sabado = dateFormatFromDate(aux[5].fecha, '5' );
        }
        if(addressObj.domingo) {
            addressObj.date_domingo = dateFormatFromDate(aux[6].fecha, '5' );
        }
    }

    let telAdic = $("#telefonosAdicionales tbody").children('.telAdic');
    for (let x = 0; x < telAdic.length; x++) {
        const element = $(telAdic[x]);
        if(addressObj.telefonoSec != "") {
            addressObj.telefonoSec += "|";
        }

        addressObj.telefonoSec += element.find('td').first().html().trim();
    }

    addressObj['idRoute']  = null;
    addressObj['idRoute2'] = null;

    // Se agregan campos acorde al tipo de servicio
    if ( tipoServicioId == idCilindro ) {// Cilindros
        addressObj['frequencyItem']  = $("#articuloFrecuenteCilFormCliente").val();
        addressObj['capacidad']      = $("#inputCapacidadCilTipoServicio").val();
        addressObj['idRoute']  = $("#rutaCiliMat").val() ? $("#rutaCiliMat").val() : null;
        addressObj['idRoute2'] = $("#rutaCiliVesp").val() ? $("#rutaCiliVesp").val() : null;
    } else if ( tipoServicioId == idEstacionario ) {// Estacionarios
        addressObj['frequencyItem']  = $("#articuloFrecuenteEstFormCliente").val();
        addressObj['capacidad']      = $("#inputCapacidadEstTipoServicio").val();
        addressObj['idRoute'] = $("#rutaEstaMat").val() ? $("#rutaEstaMat").val() : null;
        addressObj['idRoute2'] = $("#rutaEstaVesp").val() ? $("#rutaEstaVesp").val() : null;
    } else if ( tipoServicioId == idMontacarga ) {// Montacarga
        addressObj['frequencyItem' ] = $("#articuloFrecuenteCilFormCliente").val();
        addressObj['capacidad']      = $("#inputCapacidadMonTipoServicio").val();
        addressObj['idRoute']  = $("#rutaMonMat").val() ? $("#rutaMonMat").val() : null;
        addressObj['idRoute2'] = $("#rutaMonVesp").val() ? $("#rutaMonVesp").val() : null;
    }

    addressStr += addressObj['nameStreet'];
    addressObj['numExterno'] ? addressStr+= ' #'+addressObj['numExterno'] : '';
    addressObj['colonia']    ? addressStr+= ', Col. '+addressObj['colonia'] : '';
    addressObj['stateName']  ? addressStr+= ', '+addressObj['stateName'] : '';
    addressObj['city']       ? addressStr+= ', '+addressObj['city'] : '';
    addressObj['zip']        ? addressStr+= ', C.P. '+addressObj['zip'] : '';
    addressObj['zonaVenta']  ? addressStr+= '<br>Zona de venta: '+addressObj['zonaVenta'] : '';
    addressObj['ruta']       ? addressStr+= '<br>Ruta: '+addressObj['ruta'] : '';

    // addressObj['domFacturacion'] = $('table.table-address tbody').find(".address").length == 0 ? true : $('#domFacturacionDireccion').is(':checked');
    return {
        str : addressStr,
        obj : addressObj
    };
}

// Cada que se agrega una dirección, iterará las direcciones para actualizar el domFacturación en caso de que se haya enviado
function validateTableAddress(objAddress) {
    let trDirecciones = $('#tab-client-domicilio table.table-address tbody').children('tr.address');
    // Si la dirección actual es el domicilio de facturación, entonces todas se desmarcan a excepción de la suya
    if ( objAddress.domFacturacion == true ) {
        $('input.address-table').prop('checked', false);// Desmarca todos los check de la tabla
        $('input#domFacturacionDireccion'+objAddress.timeUnix).prop('checked', true);
    }
    // domFacturacionDireccion'+address.obj.timeUnix+'
    trDirecciones.each(function( index ) {
        let direccion = $(this).data('address');
        if ( direccion.timeUnix != objAddress.timeUnix ) {// Va a verificar todas las direcciones a excepción de la creada recientemente
            
            if ( objAddress.domFacturacion == true ) {// Si la dirección recientemente agregada es de facturación, se remueven todas las anteriores
                direccion['domFacturacion'] = false;
            }
            console.log('Se actualizará esta dirección');
        }
        $(this).data('address', direccion);
    });
}

// Checa si se clickea el domicilio de facturación
$('body').delegate('input.address-table','change', function() {
    // Falta código para deschequear los otros checkbox
    let parent = $(this).parent().parent().parent().parent();
    let direccion = parent.data('address');

    if( this.checked ) {
        direccion['domFacturacion'] = true;
    } else {
        direccion['domFacturacion'] = false;
    }
    parent.data('address', direccion);

    validateTableAddress(direccion);
});

// Formatea la fecha retornada de un campo de netsuite
function getMomentDateFormat(netSuiteDate, format = 'YYYY-MM-DD') {
    let aux = netSuiteDate.split('/');
    let newDate = moment();

    if (! aux.length ) {
        return null;
    }

    newDate.set('year', aux[2]);
    newDate.set('month', Number(parseInt(aux[1])) - 1);  // April
    newDate.set('date', aux[0]);

    return newDate.format(format);
}