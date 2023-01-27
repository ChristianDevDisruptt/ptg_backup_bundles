//#region Variable de Elementos

let comboArticulos = $('#capacidadFormProductos');
let btnAddArticles = $('#guardarProductosForm');
let txtCantidad = $('#cantidadFormProductos');
let flagArticuloEm = $('#envaseFormProductos');
let txtValorSinIva = $('#valorFormProductos');
let txtValorConIva = $('#totalFormProductos');
let btnGuardarPedido = $('#guardarPedido')

//#endregion



//#region Variables de objetos

let articulos = [];
let items = [];
let opportunities = [];
let articulosGrid = [];

//#endregion



//#region ciclo de vida de ejecucion
$(document).ready(function () {
    // Funcion para obtener los articulos
    // getArticulos();

    onClickAddProducto();

    // onChangeValue();

    savePedido();
});

$('body').delegate('input.check-opp-caso','change', function() {
    $('div[class*="drop-options"]').addClass('d-none');
    if( this.checked ) {
        $('.check-opp-caso').prop('checked', false);
        $(this).prop('checked', true);
        $('.drop-options-'+this.id).removeClass('d-none');
        // console.log('está chequeado');
    } else {
        // console.log('no está chequeado');
    }
});
//#endregion

$( "input#litrosFormProductos, input#cantidadFormProductos, input#totalFormProductos" ).on('change keyup paste', function(e) {
    onChangeValue( $(this) );
});

$('select#productoFormProductos, select#capacidadFormProductos, #capacidadMontacargaFormProductos').on('change', function(e) {
    onChangeValue( $(this) );
});

// Valida la información mostrada en el modal del producto
$('select#productoFormProductos').on('change', function(e) {
    let val = $(this).val();
    $('.info-minimo-gas-lp').addClass('d-none');
    $(".estacionarioFormProductos").addClass("d-none");
    $(".cilindroFormProductos").addClass("d-none");
    $(".montacargaFormProductos").addClass("d-none");
    if ( val == "cilindro" ) {
        $("#totalFormProductos").prop('readonly', true);
        $(".cilindroFormProductos").removeClass("d-none");
    } else if ( val == "estacionario" ) {
        $('.info-minimo-gas-lp').removeClass('d-none');
        $("#totalFormProductos").attr('readonly', false);
        $(".estacionarioFormProductos").removeClass("d-none");
    } else if ( val == "montacarga" ) {
        $("#totalFormProductos").attr('readonly', true);
        $(".montacargaFormProductos").removeClass("d-none");
    } else {
        $("#totalFormProductos").prop('readonly', true);
    }
});


// Valida la información que se mostrará en el modal
$("#agregarProducto").click(function () {
    let direccion   = $('select#direccionCliente').children('option:selected').data('address');
    let minimoGasLp = Number($('select#plantas').children(':selected').data('pedido-minimo'));
    $('.minimo-gas-lp').text(getCorrectFormat(minimoGasLp));
    /*$(".opt-pro-pedido-cilindro").attr("disabled", true);
    $(".opt-pro-pedido-estacionario").attr("disabled", true);
    $(".opt-pro-pedido-montacarga").attr("disabled", true);*/
    $(".montacargaFormProductos").addClass("d-none");
    $(".estacionarioFormProductos").addClass("d-none");
    $(".cilindroFormProductos").addClass("d-none");
    console.log(direccion);
    
    if ( direccion ) {
        let item1Id        = Number(parseInt(direccion.item1Id));
        let item1Capacidad = Number(parseInt(direccion.item1Capacidad));

        if ( direccion.typeServiceId == idCilindro ) {// Cilindro
            $("#productoFormProductos").val("cilindro");
            $("#totalFormProductos").prop('readonly', true);
            $(".cilindroFormProductos").removeClass("d-none");
            // Se realiza el cálculo del total
            $('#cantidadFormProductos').val(item1Capacidad);
            $('#capacidadFormProductos').val(item1Id);
            onChangeValue( $('input#cantidadFormProductos') );
        } else if ( direccion.typeServiceId == idEstacionario ) {// Estacionario
            $('.info-minimo-gas-lp').removeClass('d-none');
            /*if($('table.productosEstacionarioPedido tbody').children("tr").first().children("td").first().html().trim() == "Montacarga Gas LP") {
                $("#productoFormProductos").val("montacarga");
                $('#litrosFormProductos').val(item1Capacidad);
                $(".montacargaFormProductos").removeClass("d-none");
                onChangeValue( $('input#litrosFormProductos') );
            } else {*/
                $("#productoFormProductos").val("estacionario");
                $('#litrosFormProductos').val(item1Capacidad);
                $(".estacionarioFormProductos").removeClass("d-none");
                onChangeValue( $('input#litrosFormProductos') );
            //}
            
            $("#totalFormProductos").attr('readonly', false);
            
            
        } else if ( direccion.typeServiceId == idMontacarga ) {// Montacarga
            $("#productoFormProductos").val("montacarga").trigger("change");
            $("#totalFormProductos").prop('readonly', true);
            $("#capacidadMontacargaFormProductos").val(direccion.item1Capacidad).trigger("change");
        }
    }

    // Se validan los option disponibles si es que algún producto ya fue registrado
    $(".opt-pro-pedido-cilindro").attr("disabled", true);
    $(".opt-pro-pedido-estacionario").attr("disabled", true);
    $(".opt-pro-pedido-montacarga").attr("disabled", true);
    if (! $('table.productosEstacionarioPedido').parent().parent().hasClass('d-none') ) {
        if($('table.productosEstacionarioPedido tbody').children("tr").first().children("td").first().html().trim() == "Montacarga Gas LP") {// Ya se agregó montacarga gas LP
            $(".opt-pro-pedido-montacarga").attr("disabled", false);
        } else {// Ya se agregó gas LP
            $(".opt-pro-pedido-estacionario").attr("disabled", false);
        }        
    } else if (! $('table.productosCilindroPedido').parent().parent().hasClass('d-none') ) {// Ya se agregó un cilindro
        $(".opt-pro-pedido-cilindro").attr("disabled", false);
    } else {
        $(".opt-pro-pedido-cilindro, .opt-pro-pedido-estacionario, .opt-pro-pedido-montacarga").attr("disabled", false);
    }

    $("#envaseFormProductos").prop("checked", false);
    $('#formProductosModal').modal('show');
});

// Edita un producto agregado en la lista del pedido
$('body').delegate('.edit-producto-cil, .edit-producto-est, .edit-producto-mont','click', function() {
    let button   = $(this);
    let lblPrice = 'Precio x kg';
    let prices   = 0;
    let artObj   = button.parent().parent().data('item');
    let total    = 0;
    let subtotal = 0;
    // let direccion = $('select#direccionCliente').children('option:selected').data('address');
    
    if ( button.hasClass('edit-producto-cil') ) {// Producto cilindro
        prices = Number($('#zonaPrecioCliente').data("precioKg"));
        lblPrice = 'Precio x kg ';
        $('.precio-unitario-label').html(lblPrice);
        $("#formProductosModalPrecio").html('$'.concat(getCorrectFormat(Number(prices * 1.16))));
        $("#productoFormProductos").val("cilindro");
        $("#totalFormProductos").prop('readonly', true);
        $(".cilindroFormProductos").removeClass("d-none");
        $(".estacionarioFormProductos").addClass("d-none");

        subtotal = parseFloat( Number(artObj.capacity) *  Number(artObj.quantity) * Number(prices));
        total    = parseFloat( Number(subtotal) * 1.16 );

        $('#capacidadFormProductos, #pedidoProductoId').val(artObj.article);
        $('#cantidadFormProductos').val(artObj.quantity);
        $('#valorFormProductos').val(subtotal.toFixed(2));
        $('#totalFormProductos').val(total.toFixed(2)).data("value", total.toFixed(6));        
    } else if ( button.hasClass('edit-producto-est') ) {// Producto estacionario
        prices = Number($('#zonaPrecioCliente').data("precioLt"));
        lblPrice = 'Precio x litro ';
        $('.precio-unitario-label').html(lblPrice);
        $("#formProductosModalPrecio").html('$'.concat(getCorrectFormat(Number(prices * 1.16))));
        $("#productoFormProductos").val("estacionario");
        $("#totalFormProductos").attr('readonly', false);
        $(".estacionarioFormProductos").removeClass("d-none");
        $(".cilindroFormProductos").addClass("d-none");

        subtotal = parseFloat( Number(artObj.capacity) * Number(prices) );
        total    = parseFloat( Number(subtotal) * 1.16 );

        $("#pedidoProductoId").val( artObj.article );// Este input indicará que se trata de un edit
        $("#litrosFormProductos").val( artObj.capacity );
        $("#valorFormProductos").val( subtotal.toFixed(2) );
        $("#totalFormProductos").val( total.toFixed(2) ).data("value", total.toFixed(6));       
    }

    // Se validan los option disponibles si es que algún producto ya fue registrado
    if (! $('table.productosEstacionarioPedido').parent().parent().hasClass('d-none') ) {// Ya se agregó gas LP
        $(".opt-pro-pedido-cilindro").attr("disabled", true);
    } else if (! $('table.productosCilindroPedido').parent().parent().hasClass('d-none') ) {// Ya se agregó un cilindro
        $(".opt-pro-pedido-estacionario").attr("disabled", true);
    } else {
        // $(".opt-pro-pedido-cilindro, .opt-pro-pedido-estacionario").attr("disabled", false);
    }

    $('#formProductosModal').modal('show');
});

// Abre el modal de métodos de pago
$("#agregarMetodoPago").click(function () {
    if($("#sinProductos").is(':hidden')) {
        let totalProducto = 0;
        let totalMetodosPago = 0;
        let montoRestante = 0;
        // Calcula el total del pedido basándose en los productos agregados al listado
        if (! $('.productosEstacionarioPedido').parent().parent().hasClass('d-none') ) {// Estacionario
            totalProducto = $('.productosEstacionarioPedido').children('tfoot').find('td.total').data('total');
        } else if (! $('.productosCilindroPedido').parent().parent().hasClass('d-none') ) {// Cilindro
            totalProducto = $('.productosCilindroPedido').children('tfoot').find('td.total').data('total');
        }

        // Calcula el total de método de pago basándose en los especificados en la lista
        if (! $('.productosMetodoPago').parent().parent().hasClass('d-none') ) {// Contiene métodos
            totalMetodosPago = $('.productosMetodoPago').children('tfoot').find('td.total').data('total');
        }

        montoRestante = parseFloat( Number(totalProducto) - Number(totalMetodosPago) );
        montoRestante = montoRestante > 0 ? montoRestante : 0;

        $('#montoPagoPedido').val(montoRestante.toFixed(2));

        // Se vuelve a llamar este método únicamente para que valide el método de pago crédito cliente
        setAlianzaComercial(customerGlobal, false);
        checkCreditoCliente();
        $('#formMetodoPagosModal').data("tipo", "add");
        $('#formMetodoPagosModal').modal('show');
    } else {
        infoMsg('warning', 'Alerta:', "Es necesario primero agregar un producto para poder ingresar un metodo de pago");
    }
});

// Valida los inputs disponibles en los métodos de pago
$("#metodoPagoPedido").change(function () {
    let metodoId = parseInt( $(this).val() );
    $("#folioAutorizacionPedidoObligatorio").removeClass("d-none");
    $("#folioAutorizacionPedido").addClass("required");
    if ( metodosPagoPrepago.includes( metodoId ) || metodoId == metodoTransferencia ) {// Si el método de pago es transferencia, prepago
        $(".campo-prepago").removeClass("d-none");
        getListaCuentas(metodoId);
    } else {
        $(".campo-prepago").addClass("d-none");
    }

    if ( metodoId == metodoTransferencia ) {// Se trata de una transferencia, no debe de mostrar el tipo de tarjeta que es
        $('#tipoTarjeta').parent().parent().addClass('d-none');
        $("#folioAutorizacionPedidoObligatorio").addClass("d-none");
        $("#folioAutorizacionPedido").removeClass("required");
    }
});

// Agrega un método de pago nuevo
$('#guardarMetodoPagoForm').on('click', function () {
    // let conFolio    = ["8", "2", "5", "6"];
    let metodoId    = parseInt( $("#metodoPagoPedido").val() );
    let metodoTxt   = $('#metodoPagoPedido').children(':selected').text();
    let tipoTarjeta = parseInt($("#tipoTarjeta").val());
    let tipoCuenta  = parseInt($("#tipoCuenta").val());
    let folioAut    = $("#folioAutorizacionPedido").val().trim();
    let total        = parseFloat($('#montoPagoPedido').val());

    if(validateForm($("#formMetodoPagosModal"))) {
        return;
    }

    if(metodoId == metodoCredito) {
        if(customerGlobal.alianzaComercial.trim().toUpperCase() == "CREDITO") {
            if(customerGlobal.condicionCredito == idCreditoBloqueado) {
                infoMsg("warning", "Su crédito se encuentra bloqueado");   
                return;
            } else  if(customerGlobal.condicionCredito == idLimiteCreditoVencido) {
                if(Number(customerGlobal.saldoVencido) > 0) {
                    infoMsg("warning", "Tiene saldo vencido");   
                    return;
                } else if(total > Number(customerGlobal.saldoDisponible)) {
                    infoMsg("warning", "El saldo disponible es menor a la cantidad ingresada ($"+getCorrectFormat(customerGlobal.saldoDisponible)+" MXN)");   
                    return;
                }
            } else {
                if(total > Number(customerGlobal.saldoDisponible)) {
                    infoMsg("warning", "El saldo disponible es menor a la cantidad ingresada ($"+getCorrectFormat(customerGlobal.saldoDisponible)+" MXN)");   
                    return;
                }
            }
        } else {
            if(total > Number(customerGlobal.saldoDisponible)) {
                infoMsg("warning", "El saldo disponible es menor a la cantidad ingresada ($"+getCorrectFormat(customerGlobal.saldoDisponible)+" MXN)");   
                return;
            }
        }
    }

    if ( !(metodosPagoPrepago.includes( metodoId ) || metodoId != metodoTransferencia) ) {
        tipoTarjeta = null;
        folio = "";
        tipoCuenta = null;
    }
    // let searchTr = $('table.productosMetodoPago > tbody > tr[data-metodo-id="'+metodoId+'"]');

    $('#sinMetodosPago').addClass('d-none');
    $('.productosMetodoPago').parent().parent().removeClass('d-none');
    
    let metodoObj    = {
        metodo_txt   : metodoTxt,
        tipo_pago    : metodoId,
        tipo_cuenta  : tipoCuenta,
        tipo_tarjeta : tipoTarjeta,
        monto        : total,
        folio        : folioAut,
    };

    if($("#formMetodoPagosModal").data("tipo") == "add") {
        agregarMetodoPago(metodoObj);
    } else {
        let tr = $("#formMetodoPagosModal").data("tr");
        tr.data("metodoId", metodoId);
        tr.data("metodo", metodoObj);
        $(tr.find("td")[0]).html(metodoObj.metodo_txt);
        $(tr.find("td")[1]).html((metodoObj.folio ? metodoObj.folio : 'No aplica'));
        $(tr.find("td")[2]).html('$'+getCorrectFormat(metodoObj.monto)+' MXN');
        $(tr.find("td")[2]).data("total", metodoObj.monto)
        console.log($("#formMetodoPagosModal").data("tr").data());
    }    

    // Falta código para setear un total
    setTotalMetodoPago( $(".productosMetodoPago") );
    $('#formMetodoPagosModal').modal('hide');

});

// Cuando el select de estados cambie, manda a llamar la petición de obtener ciudades

async function onClickAddProducto() {
    btnAddArticles.on('click', function () {
        let tipoProducto = $('#productoFormProductos').val();
        let productoId  = $('#pedidoProductoId').val();
        let defaultProMsg = $('#sinProductos');
        let prices = 0;
        if(validateForm($("#formProductosModal"))) {
            return;
        }
        if ( tipoProducto == 'cilindro' ) {
            prices = Number($('#zonaPrecioCliente').data("precioKg"));
        } else if ( tipoProducto == 'estacionario' || tipoProducto == 'montacarga' ) {
            prices = Number($('#zonaPrecioCliente').data("precioLt"));
        }

        // Se remueve el mensaje principal de que no hay productos
        defaultProMsg.addClass('d-none');

        let itemId   = ( tipoProducto == 'cilindro' ? $( '#capacidadFormProductos' ).val() : articuloGasLp );
        let searchTr = $('tr[data-item-id="'+itemId+'"]');

        // Se agrega el artículo a la tabla
        if ( tipoProducto == 'cilindro' ) {// Cilindro

            $('.productosCilindroPedido').parent().parent().removeClass('d-none');
            
            let total     = parseFloat($('#totalFormProductos').data("value"));
            let artSel    = $( '#capacidadFormProductos' ).children('option:selected').data('articulo');
            let capacidad = parseInt( ( artSel && artSel.capacidad_litros ? artSel.capacidad_litros : 0 ) );
            let envase    = $('#envaseFormProductos').is(':checked');
            let articulo  = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 1,
                "capacity"  : capacidad,
                "quantity"  : $( '#cantidadFormProductos' ).val(),
                "article"   : $( '#capacidadFormProductos' ).val()
            };

            agregarEnvase(envase, $(".productosCilindroPedido"), artSel, prices);
            
            if ( searchTr.length ) {// Se verifica si el artículo fue previamente registrado

                if ( productoId ) {// Si es una edición, se reemplazará todo el contenido
                    searchTr.data('item', articulo);
                    // searchTr.data('item-id', articulo.article);
                    searchTr.children('td').siblings("td:nth-child(1)").text(artSel && artSel.nombre ? artSel.nombre : 'Sin nombre asignado');
                    searchTr.children('td').siblings("td:nth-child(2)").text(articulo['quantity']);
                    searchTr.children('td').siblings("td:nth-child(3)").text(capacidad+' kg');
                    searchTr.children('td').siblings("td:nth-child(4)").data('total', total);
                    searchTr.children('td').siblings("td:nth-child(4)").text('$'+getCorrectFormat(total)+' MXN');
                    // searchTr.children('td').siblings("td:nth-child(4)").children('button.delete-producto-cil').data('item-id', articulo.article);
                } else {
                    let firstItem         = searchTr.data('item');
                    let firstTotal        = parseFloat( searchTr.children('td').siblings("td:nth-child(4)").data('total') );
                    firstItem['quantity'] = parseInt( Number(firstItem['quantity']) + Number(articulo['quantity']));
    
                    total = parseFloat(Number(total) + Number(firstTotal));
                    searchTr.data('item', firstItem);
                    searchTr.children('td').siblings("td:nth-child(2)").text(firstItem['quantity']);
                    searchTr.children('td').siblings("td:nth-child(4)").data('total', total);
                    searchTr.children('td').siblings("td:nth-child(4)").text('$'+getCorrectFormat(total)+' MXN');
                    console.log(firstItem);
                }
                
            } else {

                // Se llena la información del item
                $(".productosCilindroPedido tbody").append(
                    '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                        '<td class="text-center">'+(artSel && artSel.nombre ? artSel.nombre : 'Sin nombre asignado')+'</td>'+
                        '<td class="text-center">'+articulo['quantity']+'</td>'+
                        '<td class="text-center">'+capacidad+' kg</td>'+
                        '<td class="text-center" data-total='+total.toFixed(6)+'>$'+getCorrectFormat(total)+' MXN</td>'+
                        // '<td class="text-center">'+(envase ? 'Si' : 'No')+'</td>'+
                        '<td class="text-center">'+
                            '<button class="btn btn-sm btn-info edit-producto-cil"> <i class="fa fa-pen-to-square"></i> </button> '+
                            '<button class="btn btn-sm btn-danger delete-producto-cil" data-table-ref=".productosCilindroPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                        '</td>'+
                    '</tr>'
                );

            }

            setTotalPedido( $(".productosCilindroPedido") );

        } else if ( tipoProducto == 'estacionario' ) {// Estacionario

            $('.productosEstacionarioPedido').parent().parent().removeClass('d-none');
            
            let total  = parseFloat( $('#totalFormProductos').data("value") );
            let litros = parseInt( $("#litrosFormProductos").val() );
            let minimoGasLp      = Number($('select#plantas').children(':selected').data('pedido-minimo'));
            let articulo = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 2,
                "capacity"  : litros,
                "quantity"  : 1,
                "article"   : articuloGasLp// ID de GAS LP
            };

            

            if ( searchTr.length ) {// Se verifica si el artículo fue previamente registrado
                
                if ( productoId ) {// Si es una edición, se reemplazará todo el contenido
                    searchTr.data('item', articulo);
                    searchTr.children('td').siblings("td:nth-child(2)").text(articulo['capacity']);
                    searchTr.children('td').siblings("td:nth-child(3)").data('total', total);
                    searchTr.children('td').siblings("td:nth-child(3)").text('$'+getCorrectFormat(total)+' MXN');
                } else {// Se suma el consumo del cliente
                    let firstItem         = searchTr.data('item');
                    let firstTotal        = parseFloat( searchTr.children('td').siblings("td:nth-child(3)").data('total') );
                    firstItem['capacity'] = firstItem['capacity'] + articulo['capacity'];
                    console.log(firstItem, total, firstTotal);
                    total = parseFloat(Number(total) + Number(firstTotal));
                    searchTr.data('item', firstItem);
                    searchTr.children('td').siblings("td:nth-child(2)").text(firstItem['capacity']);
                    searchTr.children('td').siblings("td:nth-child(3)").data('total', total);
                    searchTr.children('td').siblings("td:nth-child(3)").text('$'+getCorrectFormat(total)+' MXN');
                    console.log(firstItem);
                }

                if(total < minimoGasLp) {
                    infoMsg("warning", "El pedido es menor a la cantidad minima");
                }

            } else {// Se llena la información del item
                if(total < minimoGasLp) {
                    infoMsg("warning", "El pedido es menor a la cantidad minima");
                }
                $(".productosEstacionarioPedido tbody").append(
                    '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                        '<td>Gas LP</td>'+
                        //'<td class="text-center">1</td>'+
                        '<td class="text-center">'+$("#litrosFormProductos").val()+'</td>'+
                        '<td class="text-center" data-total='+total.toFixed(6)+'>$'+getCorrectFormat(total)+' MXN</td>'+
                        '<td class="text-center">'+
                            '<button class="btn btn-sm btn-info edit-producto-est"> <i class="fa fa-pen-to-square"></i> </button> '+
                            '<button class="btn btn-sm btn-danger delete-producto-est" data-table-ref=".productosEstacionarioPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                        '</td>'+
                    '</tr>'
                );

            }

            setTotalPedido( $(".productosEstacionarioPedido") );

        } else if ( tipoProducto == 'montacarga' ) {// Montacarga

            $('.productosEstacionarioPedido').parent().parent().removeClass('d-none');
            
            let total  = parseFloat( $('#totalFormProductos').data("value") );
            let litros = parseFloat( $("#capacidadMontacargaFormProductos").val() );
            let articulo = {
                "zoneprice" : prices,// Este es el valor de la zona
                "tipo"      : 2,
                "capacity"  : litros,
                "quantity"  : 1,
                "article"   : articuloGasLp+"|"+new Date().getTime()// ID de GAS LP
            };
                
            $(".productosEstacionarioPedido tbody").append(
                '<tr data-item-id='+articulo.article+' class="product-item" data-item=' + "'" + JSON.stringify(articulo) + "'" + '>' +
                    '<td>Montacarga Gas LP</td>'+
                    '<td class="text-center">'+litros+'</td>'+
                    '<td class="text-center" data-total='+total.toFixed(6)+'>$'+getCorrectFormat(total)+' MXN</td>'+
                    '<td class="text-center">'+
                        //'<button class="btn btn-sm btn-info edit-producto-mont"> <i class="fa fa-pen-to-square"></i> </button> '+
                        '<button class="btn btn-sm btn-danger delete-producto-mont" data-table-ref=".productosEstacionarioPedido" data-item-id='+articulo.article+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                    '</td>'+
                '</tr>'
            );

            setTotalPedido( $(".productosEstacionarioPedido") );

        }

        // Desvanece el modal
        $('#formProductosModal').modal('hide');
    });
}

// Agrega el envase seleccionado de un cilindro
function agregarEnvase(conEnvase, table, cilindro, zonaVenta) {
    if (! conEnvase ) { return; }// Sólo si tiene envase valida el proceso

    let artEnvase = null; 

    // Si el tipo de artículo es envase y coincide con la capacidad del artículo seleccionado
    for (let i = 0; i < articulosArr.length; i++) {
        if ( articulosArr[i].tipo_articulo == idEnvase && articulosArr[i].capacidad_litros == cilindro.capacidad_litros ) {
            artEnvase = articulosArr[i];
        }
        
    }
    
    if (! artEnvase ) { return; }// No encontró el envase del artículo y no agrega nada

    let searchTr = $('tr[data-item-id="'+artEnvase.id+'"]');
    
    if (! searchTr.length ) {// Se verifica si el artículo fue previamente registrado

        let artObj  = {
            "zoneprice" : zonaVenta,// Este es el valor de la zona
            "tipo"      : 5,
            "precio"    : artEnvase.basePrice,
            "capacity"  : artEnvase.capacidad_litros,
            "quantity"  : 1,
            "article"   : artEnvase.id
        };

        let total = parseFloat( Number(artEnvase.basePrice) * 1.16 );

        // Se llena la información del item
        $(table).children("tbody").append(
            '<tr data-item-id='+artEnvase.id+' class="product-item" data-item=' + "'" + JSON.stringify(artObj) + "'" + '>' +
                '<td class="text-center">'+(artEnvase.nombre ? artEnvase.nombre : 'Sin nombre asignado')+'</td>'+
                '<td class="text-center tr-data-quantity">'+artObj['quantity']+'</td>'+
                '<td class="text-center">'+artObj['capacity']+' kg</td>'+
                '<td class="text-center tr-data-total" data-total='+total.toFixed(6)+'>$'+getCorrectFormat(total)+' MXN</td>'+
                '<td class="text-center">'+
                    // '<button class="btn btn-sm btn-info edit-producto-cil"> <i class="fa fa-pen-to-square"></i> </button> '+
                    '<button class="btn btn-sm btn-danger delete-producto-cil" data-table-ref=".productosCilindroPedido" data-item-id='+artEnvase.id+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                '</td>'+
            '</tr>'
        );
        
    } else {
        let auxEnv = searchTr.data("item");
        auxEnv.quantity = auxEnv.quantity + 1;
        //auxEnv.precio = (Number(auxEnv.precio) * auxEnv.quantity).toString();
        searchTr.find('.tr-data-quantity').html(auxEnv.quantity);
        let auxTotal = ((Number(auxEnv.precio) * auxEnv.quantity) * 1.16);
        searchTr.find('.tr-data-total').data("total", auxTotal);
        searchTr.find('.tr-data-total').html("$"+auxTotal-toFixed(2));
        searchTr.data("item", auxEnv);
        console.log('El envase ya había sido agregado', searchTr.data());

    }
}

// Método para calcular los campos valor y total acorde al tipo de producto.
function onChangeValue(element) {
    var elementId    = element.attr('id');
    let subtotal     = total = 0;
    let lblPrice     = 'Precio x kg';
    let tipoProducto = $('#productoFormProductos').val();
    let prices       = 0;
    let cantidad     = parseInt( $('#cantidadFormProductos').val() );
    let litros       = parseInt( $('#litrosFormProductos').val() );
    let litrosMont   = parseInt( $('#capacidadMontacargaFormProductos').val() );
    let valor        = parseFloat( $('#valorFormProductos').val() );
    let articulo     = $('#capacidadFormProductos').children(':selected').data('articulo');
    console.log(articulo);
    let capArticulo  = ( articulo && articulo.capacidad_litros ? articulo.capacidad_litros : 0 );
    
    cantidad = ( isNaN(cantidad) ? 0 : cantidad );
    litros   = ( isNaN(litros) ? 0 : litros );
    litrosMont = ( isNaN(litrosMont) ? 0 : litrosMont );
    valor    = ( isNaN(valor) ? 0 : valor );
    console.log(tipoProducto);
    if ( tipoProducto == 'cilindro' ) {// Cilindro
        prices = Number($('#zonaPrecioCliente').data("precioKg"));
        lblPrice = 'Precio x kg ';
        $('.precio-unitario-label').html(lblPrice);
        $("#formProductosModalPrecio").html('$'.concat(getCorrectFormat(Number(prices * 1.16))));
        if ( elementId == 'cantidadFormProductos' || elementId == 'capacidadFormProductos' || elementId == 'productoFormProductos' ) {// Producto (cilindro) y cantidad de producto

            subtotal = parseFloat( capArticulo *  cantidad * prices);
            $('#valorFormProductos').val(subtotal.toFixed(2));

        } else if ( elementId == 'cantidadFormProductos' ) {// Se resetea el formulario ¿?

        }

        total = parseFloat(subtotal * 1.16);
        $('#totalFormProductos').val(total.toFixed(2)).data("value", total.toFixed(6));
        
    } else if ( tipoProducto == 'estacionario' ) {// Estacionario
        prices = Number($('#zonaPrecioCliente').data("precioLt"));
        lblPrice = 'Precio x litro ';
        $('.precio-unitario-label').html(lblPrice);
        $("#formProductosModalPrecio").html('$'.concat(getCorrectFormat(Number(prices * 1.16))));
        if ( elementId == 'totalFormProductos' || elementId == 'productoFormProductos' ) {// Se calculan los litros a contratar

            total = parseFloat( $('#totalFormProductos').data("value") );
            total = ( isNaN(total) ? 0 : total );
            subtotal = parseFloat(total / 1.16);
            // subtotal = Math.ceil( $('#valorFormProductos').val() );
            // subtotal = ( isNaN(subtotal) ? 0 : subtotal );
            litros = parseFloat(subtotal / prices);
            $('#litrosFormProductos').val(litros.toFixed(2));
            

        } else if( elementId == 'litrosFormProductos' ) {// Se calcula el total acorde a los litros

            subtotal = parseFloat(litros * prices); 
            total = parseFloat(subtotal * 1.16);
            console.log(litros, prices, subtotal, total);
            $('#totalFormProductos').val(total.toFixed(2)).data("value", total.toFixed(6));
            
        } else if ( elementId == 'cantidadFormProductos' ) {// 

        }

        $('#valorFormProductos').val(subtotal.toFixed(2));
    
    } else if ( tipoProducto == 'montacarga' ) {
        prices = Number($('#zonaPrecioCliente').data("precioLt"));
        lblPrice = 'Precio x litro ';
        $('.precio-unitario-label').html(lblPrice);
        $("#formProductosModalPrecio").html('$'.concat(getCorrectFormat(Number(prices * 1.16))));
        subtotal = parseFloat(litrosMont * prices); 
        console.log(subtotal);
        total = parseFloat(subtotal * 1.16);
        $('#valorFormProductos').val(subtotal.toFixed(2));
        $('#totalFormProductos').val(total.toFixed(2)).data("value", total.toFixed(6));
    } else {// Todo se coloca en 0
        
    }
}

// Guarda la información de un pedido
async function savePedido() {
    btnGuardarPedido.on('click', function () {

        let direccion        = $('#direccionCliente :selected').data('address');
        let minimoGasLp      = Number($('select#plantas').children(':selected').data('pedido-minimo'));
        let totalPedido      = 0;
        let tipoPedido       = null;
        let totalConCredito  = 0;
        let descuento        = 0;
        let totalMetodosPago = 0;
        let casoPedido       = $('select#casoPedido').val();
        let notasCredito     = $('select#creditosCliente').val();
        let tablaProd        = null;
        let articulosArr     = [];
        let pagosArr         = [];
        let prepaymentArr    = [];
        let rutas            = [];
        let time             = moment().format('h:mm a');
        let saldoDisponible  = Number(customerGlobal.objInfoComercial && customerGlobal.objInfoComercial.saldoDisponible ? customerGlobal.objInfoComercial.saldoDisponible : customerGlobal.saldoDisponible);
        saldoDisponible      = isNaN(saldoDisponible) ? 0 : saldoDisponible;

        if(validateForm($("#tab-pedidos"))) {
            return;
        }

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
        /*if ( tipoPedido == 'estacionario' && minimoGasLp && ( ( Number(totalPedido) + Number(descuento)) < minimoGasLp ) ) {
            infoMsg('warning', "El monto mínimo para gas lp es de " + minimoGasLp);
            return;
        }*/
        
        // Agrega la lista de artículos
        tablaProd.children('tbody').children('tr.product-item').each(function(e) {
            let auxItem = $(this).data('item');
            console.log(auxItem);
            if(auxItem.article && auxItem.article.toString().split("|").length > 1) {
                auxItem.article = auxItem.article.toString().split("|")[0];
            }
            
            articulosArr.push(auxItem);
        });

        // Agrega la lista de métodos de pago
        $('table.productosMetodoPago > tbody  > tr.metodo-item').each(function() {
            let metodoObj = $(this).data('metodo');
            let metodoId  = parseInt(metodoObj.tipo_pago);
            metodoObj.monto = parseFloat(Number(metodoObj.monto).toFixed(6))
            if ( metodoObj.tipo_pago == '9' ) {// El método de pago es crédito
                totalConCredito = Number(totalConCredito + parseFloat( Number(metodoObj.monto) ));
            }
            
            // Si el método de pago es transferencia o prepago, se enviará una orden de prepago después de guardar el pedido
            if ( metodosPagoPrepago.includes( metodoId ) || metodoId == metodoTransferencia ) {
                prepaymentArr.push({
                    customer : customerGlobal.id,
                    account : metodoObj.tipo_cuenta,
                    amount : metodoObj.monto,
                    isCredit: metodosPagoPrepago.includes( metodoId ) ? (metodoObj.tipo_tarjeta == "2" ? true : false) : false,
                    isDebit: metodosPagoPrepago.includes( metodoId ) ? (metodoObj.tipo_tarjeta == "1" ? true : false) : false,
                    numRef: metodosPagoPrepago.includes( metodoId ) ? metodoObj.folio : null,
                    planta: $("#plantas").val()
                });
            }
            console.log(metodoObj);
            pagosArr.push( metodoObj );
        });

        let isEstacionario = $(".productosCilindroPedido").is(':hidden');
        // Si el cliente tiene saldo a favor y seleccionó como método de pago el crédito,
        // se validará si el monto a pagar con crédito es igual o menor al límite del saldo a favor, 
        // para permitir la venta, de lo contrario no se procesa
        if ( totalConCredito > 0 ) {
            if ( totalConCredito > saldoDisponible ) { // El total a pagar con crédito excede el saldo disponible actual del cliente
                infoMsg('warning', "El total del pedido excede el saldo disponible");
                return;
            }
        } 
        
        // Tiene descuento
        if ( descuento ) {
            articulosArr.push({
                "tipo"      : 4,
                "precio"    : parseFloat(Number(descuento * -1).toFixed(6)),
                "article"   : articuloDesc// ID de artículo de descuento
            });
        }

        let direccionSel = $('#direccionCliente').children(':selected').data('address');
        let typeService  = '';
        let statusOpp    = 1;
        $('.productosCilindroPedido').is(':visible') ? typeService = idCilindro : '';
        $('.productosEstacionarioPedido').is(':visible') ? $('table.productosEstacionarioPedido tbody').children("tr").first().children("td").first().html().trim() == "Montacarga Gas LP" ? typeService = idMontacarga2 : typeService = idEstacionario : '';

        // Código para insertar las posibles rutas de la dirección del cliente
        // rutas[0] = { id : ( direccion && direccion.idRoute ? direccion.idRoute : '' ), name : ( direccion && direccion.route ? direccion.route : '') }; // Cilindro matutino
        rutas[0] = { id : direccion?.routeId,  name : direccion?.route};// Cilindro matutino
        rutas[1] = { id : (direccion.routeId2 ? direccion.routeId2 : direccion.routeId), name : (direccion.route2 ? direccion.route2 : direccion.route)};// Cilindro vesp
        //rutas[2] = { id : direccion?.idRoute3, name : direccion?.route3};// Estacionario matutino
        //rutas[3] = { id : (direccion.idRoute4 ? direccion.idRoute4 : direccion.idRoute3 ), name : (direccion.route4 ? direccion.route4 : direccion.route3)};// Estacionario vesp

        let tmp = {
            // "status"        : 1,
            "zona_precio"           : direccionSel.dataZoneRoute.territorio_id,//Este es el Id de la zona
            "customer"              : customerGlobal.id,
            "plantaRelated"         : $('#plantas').val(),
            "closeDate"             : dateFormatFromDate($('#fechaPrometidaPedido').val(), '5'),
            "idAddressShip"         : $('#direccionCliente').val(),
            "statusOpp"             : statusOpp,
            "operario"              : userId,
            "typeservice"           : typeService,
            "cases"                 : [],
            "routes"                : rutas,
            "time"                  : time,
            "turn"                  : 1,
            //"paymentMethod        " : $('#metodoPagoPedido').val(),
            "origen"                : $('#origenPedido').val(),
            "comentary"             : $('#observacionesPagoPedido').val(),
            "rangeHour1"            : formatTime( $('#desdePedido').val() ),
            "rangeHour2"            : formatTime( $('#hastaPedido').val() ),
            "tipo"                  : typeService,
            "items"                 : articulosArr,
            "pago"                  : {pago:pagosArr},
            "typeserviceAddr"       : $("#direccionCliente option:selected").data("address").typeServiceId,
            "idAddress"             : $("#direccionCliente option:selected").data("address").idAdress,
            "labelAddress"          : $("#direccionCliente option:selected").data("address").label,
            "requiereFactura"       : $("#requiereFacturaPedido").prop("checked"),
            "rfcFactura"            : $("#requiereFacturaPedido").prop("checked") ? customerGlobal.rfc : "",
            "razonSocialFactura"    : $("#requiereFacturaPedido").prop("checked") ? customerGlobal.razonSocialFact: ""
        }

        // Seleccionó un resurtido pendiente
        if ( casoPedido ) {
            tmp['case'] = casoPedido;
        }

        // Seleccionó una o varias notas de crédito
        if ( notasCredito.length > 0 ) {
            tmp['cases'] = notasCredito;
        }

        opportunities.push(tmp);

        let settings = {
            url    : urlCrearPedido,
            method : 'POST',
            data   : JSON.stringify({ opportunities: opportunities }),
        }

        loadMsg('Guardando información...');

        setAjax(settings).then((response) => {
            infoMsg('success', 'Pedido', 'El pedido se a creado de manera correcta', 2000)
            console.log('Pedido creado exitósamente', response);
            opportunities = [];
            clearFields();
            getPendingCases();
            $('select#direccionCliente').trigger("change");
            if ( prepaymentArr.length > 0 ) {// Si se realizaron prepagos, se enviará a gestionar
                sendPrepayment(prepaymentArr);
            }
        }).catch((error) => {
            opportunities = [];
            infoMsg('error', 'El pedido no ha sido creado', error.message);
            // Limpia los campos de cliente
            
            console.log('El error es: ');
            console.log(error);
        });
    });
}

// Método para envíar un prepago
function sendPrepayment(prepaymentArr) {
    let params = {
        "customerPayments" : prepaymentArr
    };

    let settings = {
        url    : urlMakePrepayment,
        method : 'POST',
        data   : JSON.stringify(params),
    }

    setAjax(settings).then((response) => {
        console.log('Prepagos enviado exitósamente', response);
    }).catch((error) => {
        // Limpia los campos de cliente
        console.log('Ha ocurrido un error al enviar los prepagos');
        console.log(error);
    });
}

async function clearFields() {
    // $('#fechaPrometidaPedido').val('');
    $('#hastaPedido, #observacionesPagoPedido').val('');

    $("#sinProductos, #sinMetodosPago").removeClass("d-none");
    
    // Remueve los productos agregados
    $("table.productosCilindroPedido").parent().parent().addClass("d-none");
    $("table.productosCilindroPedido").children('tbody').children('tr').remove();
    $("table.productosEstacionarioPedido").parent().parent().addClass("d-none");
    $("table.productosEstacionarioPedido").children('tbody').children('tr').remove();

    // Remueve los métodos de pago
    $("table.productosMetodoPago").parent().parent().addClass("d-none");
    $("table.productosMetodoPago").children('tbody').children('tr').remove();

    // Resetea el select de créditos del cliente
    $('select#creditosCliente').val(null).trigger("change");
    // $("#productosCilindroPedido").find(".content").remove();
}
//#endregion

// Elimina un artículo de la tabla
$('body').delegate('.delete-producto-cil, .delete-producto-est, .delete-producto-mont','click', function() {
    let item  = $(this).parent().parent().data('item');
    let table = $(this).data('table-ref');
    let id    = ( item && item.article ? item.article : 0 );

    swal({
        title: 'Se dará de baja el producto seleccionado, ¿Está seguro de continuar?',
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
    }).then((accept) => {
        if ( accept ) {
            $(table).children('tbody').children('tr[data-item-id="'+id+'"]').remove();
            validarTablaProductos( $(table) );
        }
    }).catch(swal.noop);
});

$('body').delegate('.edit-metodo-pago','click', function() {
    let metodo = $(this).closest("tr").data("metodo");
    $("#metodoPagoPedido").val(metodo.tipo_pago).trigger("change");
    $("#montoPagoPedido").val(metodo.monto);
    $("#tipoCuenta").val(metodo.tipo_cuenta);
    $("#tipoTarjeta").val(metodo.tipo_tarjeta);
    $("#folioAutorizacionPedido").val(metodo.folio);
    checkCreditoCliente();
    $('#formMetodoPagosModal').data("tipo", "edit");
    $('#formMetodoPagosModal').data("tr", $(this).closest("tr"));
    $("#formMetodoPagosModal").modal("show");
    
});

// Elimina un método de pago de la tabla
$('body').delegate('.delete-metodo-pago','click', function() {
    let metodo  = $(this).parent().parent().data('metodo');
    let table = $(this).data('table-ref');
    let id    = ( metodo && metodo.tipo_pago ? metodo.tipo_pago : 0 );

    swal({
        title: '¿Desea eliminar el método de pago seleccionado?',
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
    }).then((accept) => {
        if ( accept ) {
            $(table).children('tbody').children('tr[data-metodo-id="'+id+'"]').remove();
            validarTablaMetodosPago( $(table) );
        }
    }).catch(swal.noop);
});

// Agrega un método de pago a la tabla de métodos
function agregarMetodoPago(metodoObj) {
    let searchTr = $('table.productosMetodoPago > tbody > tr[data-metodo-id="'+metodoObj.tipo_pago+'"]');

    if ( searchTr.length && ( !metodosPagoPrepago.includes(metodoObj.tipo_pago) && metodoObj.tipo_pago != metodoTransferencia ) ) {// Se verifica si el artículo fue previamente registrado y si no es un prepago se edita el row

        searchTr.data('metodo', metodoObj);
        searchTr.children('td').siblings("td:nth-child(2)").text(metodoObj.folio ? metodoObj.folio : 'No aplica');
        searchTr.children('td').siblings("td:nth-child(3)").data('total', metodoObj.monto);
        searchTr.children('td').siblings("td:nth-child(3)").text('$'+getCorrectFormat(metodoObj.monto)+' MXN');
        console.log(metodoObj);
        
    } else {// Se llena la información del item
        
        $(".productosMetodoPago tbody").append(
            '<tr data-metodo-id='+metodoObj.tipo_pago+' class="metodo-item" data-metodo=' + "'" + JSON.stringify(metodoObj) + "'" + '>' +
                '<td>'+metodoObj.metodo_txt+'</td>'+
                '<td class="text-center">'+(metodoObj.folio ? metodoObj.folio : 'No aplica')+'</td>'+
                '<td class="text-center" data-total='+metodoObj.monto+'>$'+getCorrectFormat(metodoObj.monto)+' MXN</td>'+
                '<td class="text-center">'+
                '<button class="btn btn-sm btn-info edit-metodo-pago" data-table-ref=".productosMetodoPago" data-metodo-id='+metodoObj.tipo_pago+'> <i class="fa-solid fa-pen-to-square"></i> </button>&nbsp;&nbsp;'+
                    '<button class="btn btn-sm btn-danger delete-metodo-pago" data-table-ref=".productosMetodoPago" data-metodo-id='+metodoObj.tipo_pago+'> <i class="fa-solid fa-trash-can"></i> </button>'+
                '</td>'+
            '</tr>'
        );

    }
}

// Valida la información mostrada en la lista de artículos
function validarTablaProductos(table) {
    if (! table.children('tbody').children('tr.product-item').length ) {
        table.parent().parent().addClass('d-none');
        $('#sinProductos').removeClass('d-none');
    }

    setTotalPedido(table);
}

// Valida la información mostrada en la lista de métodos de pago
function validarTablaMetodosPago(table) {
    if (! table.children('tbody').children('tr.metodo-item').length ) {
        table.parent().parent().addClass('d-none');
        $('#sinMetodosPago').removeClass('d-none');
    }

    setTotalMetodosPago(table);
}

// Calcula el total de los productos
// Parámetros: 
// table: La tabla a realizar el cálculo de total de descuento
// table: El tipo de desucento a enviar: nativo, resurtido (Cilindro), nota crédito(Gas LP) 
function setTotalPedido(table, tipoDescuento = 'nativo') {
    let total           = 0;
    let totalDescontado = 0;
    let totalLitros     = 0;
    let descuento       = Number( parseFloat(customerGlobal.descuento ? customerGlobal.descuento : 0) );
    let esEstacionario  = !$('.productosEstacionarioPedido').parent().parent().hasClass('d-none');
    console.log("total1", total);
    // console.log(descuento);
    table.children('tbody').children('tr.product-item').each(function() {
        let articulo = $( this ).data('item');
        if ( articulo.tipo == '1' ) { // Cilindro
            totalLitros = (Number(totalLitros) + Number( parseFloat(articulo.capacity * articulo.quantity)));
        } else if  ( articulo.tipo == '2' ) { // Estacionario
            totalLitros = (Number(totalLitros) + Number( parseFloat(articulo.capacity)));
        }
        let subtotal = articulo.tipo == '1' || articulo.tipo == "5" ? parseFloat($( this ).children('td').siblings("td:nth-child(4)").data('total')) : parseFloat($( this ).children('td').siblings("td:nth-child(3)").data('total'));
        total = parseFloat( Number(total) + Number(subtotal) );
    });

    if ( tipoDescuento == 'nativo' ) { // Validación para especificar el descuento natural que puede tener el cliente
        //descuento = descuento;
        totalDescontado = Number( parseFloat( parseFloat(totalLitros) * parseFloat(descuento) ) );
        if ( !esEstacionario ) {
            totalDescontado = Number( parseFloat( totalDescontado / Number($('#zonaPrecioCliente').data("factor")) ));
        }
    } else if ( tipoDescuento == 'resurtido' ) {// Descuento por devolución de cilindro
        totalDescontado = 0 ;
        console.log('Tipo: ', tipoDescuento);
    } else if ( tipoDescuento == 'nota' ) {// Descuento por nota de crédito asociado a Gas LP

    }
    console.log("total3", total);
    total = parseFloat( Number(total) - Number(totalDescontado) );
    console.log("total4", total);
    // Se asigna el descuento
    table.children('tfoot').find('td.descuento').data('descuento', totalDescontado);
    table.children('tfoot').find('td.descuento').text('$'+getCorrectFormat(totalDescontado)+' MXN');

    // Se asigna el total
    table.children('tfoot').find('td.total').data('total', total);
    table.children('tfoot').find('td.total').text('$'+getCorrectFormat(total)+' MXN');

    setDefPago(total);
}

function setDefPago(total) {
    if($(".productosMetodoPago tbody").find(".metodo-item").length == 1) {
        let item = $($(".productosMetodoPago tbody").find(".metodo-item")[0]);
        let metodoObj = item.data("metodo");
        metodoObj.monto = total;
        item.data("metodo", metodoObj);
        let td = $(item.find("td")[2]);
        td.data("total", total);
        td.html('$'+getCorrectFormat(metodoObj.monto)+' MXN');
        setTotalMetodosPago($(".productosMetodoPago"));
    }
}

// Calcula el total de los métodos de pago agregados
function setTotalMetodosPago(table) {
    let total = 0;

    table.children('tbody').children('tr.metodo-item').each(function() {
        // let articulo = $( this ).data('item');
        let subtotal = parseFloat($( this ).children('td').siblings("td:nth-child(3)").data('total'));
        total = parseFloat( Number(total) + Number(subtotal) );
    });

    table.children('tfoot').find('td.total').data('total', total);
    table.children('tfoot').find('td.total').text('$'+getCorrectFormat(total)+' MXN');
}

// Calcula el total del método de pago
function setTotalMetodoPago(table, tipoDescuento = 'nativo') {
    let total = 0;

    if ( tipoDescuento == 'nativo' || tipoDescuento == 'resurtido') { // Validación para especificar el descuento natural que puede tener el cliente
        table.children('tbody').children('tr.metodo-item').each(function() {
            // let articulo = $( this ).data('item');
            let subtotal = parseFloat($( this ).children('td').siblings("td:nth-child(3)").data('total'));
            total = Number(total) + Number(subtotal);
        });
    } else if ( tipoDescuento == 'nota' ) {// Descuento por nota de crédito asociado a Gas LP

    }

    table.children('tfoot').find('td.total').data('total', parseFloat(total));
    table.children('tfoot').find('td.total').text('$'+getCorrectFormat(total)+' MXN');
}

// Método que ejecuta la solicitud cancelación de un pedido
$("#guardarCancelarOpp").click(function () {
    let statusID = null;
    let pedido = $("div#cancelarOppModal").data("item");

    if(validateForm($("#cancelarOppModal"))) {
        return;
    }

    swal({
        title: '¿Está seguro de cancelar este registro?',
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
    }).then((accept) => {
        if ( accept ) {
            // Busca el ID del status cancelado
            /*estadosOppArr.forEach(element => {
                if( element.nombre.toLowerCase().trim() == "cancelado" ) {
                    statusID = element.id;
                }
            });*/

            let dataSend = {
                "opportunitiesUpdate": [
                    {
                        "id": pedido.id_Transaccion,
                        "bodyFields": {
                            "custbody_ptg_solicitud_cancelacion": true,
                            "custbody_ptg_motivo_cancelation" : $("#cancelarOppMotivo").val()
                        },
                        "lines": [
                            
                        ]
                    }
                ]
            };
            console.log('Primer data', dataSend);
            loadMsg();
            let settings = {
                url      : urlActualizarOpp,
                method   : 'PUT',
                data     : JSON.stringify(dataSend)
            }
            console.log('Settings', settings);
            setAjax(settings).then((response) => {
                console.log('exito cancelando', response);
                let nota = [{ 
                    type: "nota", 
                    idRelacionado: pedido.id_Transaccion, 
                    titulo: userName + " (Cancelación de servicio)", 
                    nota: $("#cancelarOppObservaciones").val().trim(),
                    transaccion: "oportunidad",
                    solicitudNotificacion: false,
                    solicitudCancelacion: true
                }];
                let settingsNota = {
                    url      : urlGuardarNotaMensaje,
                    method   : 'POST',
                    data: JSON.stringify({ informacion: nota })
                }
                setAjax(settingsNota).then((response) => {
                    console.log('exito agregando la nota');
                    $("#cancelarOppModal").modal("hide");
                    infoMsg('success', '', "Servicio cancelado correctamente");
                    $('select#direccionCliente').trigger("change");
                }).catch((error) => {
                    console.log(error);
                    swal.close();
                });
                       
            }).catch((error) => {
                console.log(error);
                swal.close();
            });
        }
    }).catch(swal.noop);
});

// Método que ejecuta la solicitud de modificación de la fecha prometida de un pedido
$("#guardarCambioFechaOpp").click(function () {
    let statusID = null;
    let pedido = $("div#cambiarFechaOppModal").data("item");

    if(validateForm($("#cambiarFechaOppModal"))) {
        return;
    }

    swal({
        title: '¿Está seguro de modificar la fecha prometida de este registro?',
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
    }).then((accept) => {
        if ( accept ) {
            // Busca el ID del status cancelado
            /*estadosOppArr.forEach(element => {
                if( element.nombre.toLowerCase().trim() == "cancelado" ) {
                    statusID = element.id;
                }
            });*/

            let dataSend = {
                "opportunitiesUpdate": [
                    {
                        "id": pedido.id_Transaccion,
                        "bodyFields": {
                            "custbody_ptg_solici_cambio_fech_prome": true
                        },
                        "lines": [
                            
                        ]
                    }
                ]
            };
            console.log('Primer data', dataSend);
            loadMsg();
            let settings = {
                url      : urlActualizarOpp,
                method   : 'PUT',
                data     : JSON.stringify(dataSend)
            }
            setAjax(settings).then((response) => {
                console.log('exito enviando la solicitud de cambio de fecha prometida', response);
                let nota = [{ 
                    type: "nota", 
                    idRelacionado: pedido.id_Transaccion, 
                    titulo: userName + " (Cambio de fecha prometida)", 
                    nota: $("#cambiarFechaOppObservaciones").val().trim(),
                    fechaPrometida: dateFormatFromDate($('#nuevaFechaPrometida').val(), '5'),
                    solicitudCambioFecha : true,
                    transaccion: "oportunidad",
                    solicitudNotificacion: false,
                }];
                let settingsNota = {
                    url      : urlGuardarNotaMensaje,
                    method   : 'POST',
                    data: JSON.stringify({ informacion: nota })
                }
                setAjax(settingsNota).then((response) => {
                    // console.log('exito agregando la nota');
                    $("#cambiarFechaOppModal").modal("hide");
                    infoMsg('success', 'Solicitud de fecha prometida generada exitósamente');
                    $('select#direccionCliente').trigger("change");
                }).catch((error) => {
                    console.log(error);
                    swal.close();
                });
                       
            }).catch((error) => {
                console.log(error);
                swal.close();
            });
        }
    }).catch(swal.noop);
});

// Envía una segunda llamada
$("#inputSegundaLlamada").click(function () {
    let idTransaccion = $('#internalIdServicio').val();

    if( this.checked ) {
        swal({
            title: '¿Está seguro de marcar una segunda llamada?',
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
        }).then((accept) => {
            if ( accept ) {
                let dataSend = {};
                if($("#formVerNotasAdicionalesModal").data("tipo") == "oportunidad") {
                    dataSend = {
                        "opportunitiesUpdate": [
                            {
                                "id": idTransaccion,
                                "bodyFields": {
                                    "custbody_ptg_segundas_llamadas": true
                                },
                                "lines": [
                                    
                                ]
                            }
                        ]
                    };
                } else {
                    dataSend = {
                        "casosUpdate": [
                            {
                                "id": idTransaccion,
                                "notAllEdit": true,
                                "secondCall": true
                            }
                        ]
                    };
                }
                
                loadMsg();
                let settings = {
                    url      : $("#formVerNotasAdicionalesModal").data("tipo") == "oportunidad" ? urlActualizarOpp : urlGuardarFugaQueja,
                    method   : 'PUT',
                    data     : JSON.stringify(dataSend)
                }
                setAjax(settings).then((response) => {
                    swal.close();
                    $("#inputSegundaLlamada").prop('disabled', true);
                    $('select#direccionCliente').trigger("change");
                    console.log('Segunda llamada enviada exitósamente', response);
                }).catch((error) => {
                    console.log(error);
                });
            } else {
                $("#inputSegundaLlamada").prop('checked', false);
            }
        }).catch(swal.noop);
    }
});

// Código para filtrado del grid de servicios y oportunidades
// Determina qué status se mostrarán acorde al tipo de caso seleccionado (Fuga/Queja)
$('select#tipoServicioFiltro').on('change', function(e) {
    let tipoServicio = $('#tipoServicioFiltro').val();
    $('select#estadoSolicitudFiltro').children('option').remove();
    $("select#estadoSolicitudFiltro").append('<option value="">Seleccione una opción</option>');
    $(".filtro-tipo-producto-casos, .filtro-tipo-producto-opp").addClass('d-none');
    // Se llenan los estatus acorde al tipo de servicio requerido
    if ( tipoServicio == 1 || tipoServicio == 2 ) {// Sólo fugas o quejas
        for (var i = 0; i < statusCasesArr.length; i++) {
            $("select#estadoSolicitudFiltro").append('<option value='+statusCasesArr[i].id+'>'+statusCasesArr[i].nombre+'</option>');
        }
        $(".filtro-tipo-producto-casos").removeClass('d-none');
    } else if( tipoServicio == 3 ) {// Oportunidades
        for (var x = 0; x < estadosOppArr.length; x++) {
            $("select#estadoSolicitudFiltro").append('<option value='+estadosOppArr[x].id+'>'+estadosOppArr[x].nombre+'</option>');
        }
        $(".filtro-tipo-producto-opp").removeClass('d-none');
    }
});

$('.filtrar-historico').on('click', function(e) {
    filtrarHistorico();
});

// Limpia los filtros de la búsqueda
function limpiarFiltrosBusqueda() {
    $('div#filtros').find('select.form-ptg').each(function( index ) {
        $( this ).val($(this).children("option:first").val());
    });
    setSelectEstatusOpp(estadosOppArr);
    $('#filtros').find('input.form-ptg').val('');
    $(".filtro-tipo-producto-casos").addClass('d-none');
    $(".filtro-tipo-producto-opp").removeClass('d-none');
    $('select#direccionCliente').trigger("change");
}

// Filtra acorde a los parámetros proporcionados por el cliente
function filtrarHistorico() {
    let fechaAtencionIni  = $("#filtroFechaAtencionIni").val() ? dateFormatFromDate( $("#filtroFechaAtencionIni").val(), '5' ) : '';
    let fechaAtencionFin  = $("#filtroFechaAtencionFin").val() ? dateFormatFromDate( $("#filtroFechaAtencionFin").val(), '5' ) : '';
    let fechaSolicitudIni = $("#filtroFechaSolicitudIni").val() ? dateFormatFromDate( $("#filtroFechaSolicitudIni").val(), '5' ) : '';
    let fechaSolicitudFin = $("#filtroFechaSolicitudFin").val() ? dateFormatFromDate( $("#filtroFechaSolicitudFin").val(), '5' ) : '';
    let status            = $("#estadoSolicitudFiltro").val();
    let productoCaso      = $("#filtroTipoProductoCaso").val();
    let productoOpp       = $("#filtroTipoProductoOpp").val();
    let tipoServicio      = $('#tipoServicioFiltro').val();
    let tipoNombre        = '';
    let url               = '';
    let dataToSend        = { id : customerGlobal.id, idAddress : $("#direccionCliente option:selected").data("address").idAdress };
    
    // Filtro de solicitud de fecha
    fechaSolicitudIni ? dataToSend['fechaPrometida1'] = fechaSolicitudIni : '';
    fechaSolicitudFin ? dataToSend['fechaPrometida2'] = fechaSolicitudFin : '';
    
    if ( tipoServicio == 3 ) {// Oportunidades
        tipoNombre = 'oportunidades';
        url = urlGetOppV2;
        status ? dataToSend['status_oportunidad'] = status : '';
        productoOpp ? dataToSend['tipo_producto'] = productoOpp : '';
        fechaAtencionIni ? dataToSend['fechaCierre1'] = fechaAtencionIni : '';
        fechaAtencionFin ? dataToSend['fechaCierre2'] = fechaAtencionFin : '';

    } else {// Fugas o quejas
        tipoNombre = 'casos';
        url = urlGetFugaQuejasV2;
        dataToSend['tipo_servicio'] = tipoServicio;
        status ? dataToSend['estado'] = status : '';
        productoCaso ? dataToSend['itemId'] = productoCaso : '';
        fechaAtencionIni ? dataToSend['fechaVisita1'] = fechaAtencionIni : '';
        fechaAtencionFin ? dataToSend['fechaVisita2'] = fechaAtencionFin : '';
    };

    console.log('Data:', dataToSend);
    let settings = {
        url    : url,
        method : 'POST',
        data   : JSON.stringify(dataToSend)
    }

    loadMsg('Espere un momento...');

    // Se remueve la información acerca
    // setCasosOportunidades(JSON.parse(response.data));

    clearTable();
    
    setAjax(settings).then((response) => {
        let items = response.data;
        $('div#historic-data table.table-gen tbody').children('tr').remove();
        $('div#historic-data').fadeOut();
        if ( items.length ) {
            // numero de documento, fecha
            for ( var key in items ) {
                if ( items.hasOwnProperty( key ) ) {
                    $('div#historic-data table.table-gen tbody').append(
                        setTrOppCases( items[key], tipoNombre, items.length, key )
                    );
                }
            }
        } else {
            // console.warn('No hay casos por cargar');
        }
        initTable()
        $('div#historic-data').fadeIn('slow');
        swal.close();
        console.log(response);
    }).catch((error) => {
        swal.close();
        console.log(error);
    });
}

// funcion para generar las peticiones
function requests(url, method, data) {
    // Generamos el AJAX dinamico para las peticiones relacionadas con peddos
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                resolve(data);
            }, error: function (xhr, status, error) {
                reject({ xhr: xhr, status: status, error: error });
            }
        });
    });
}

//#endregion