/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search'], function (search) {

    const responseData = {
        success: false,
        message: "",
        data: null,
        apiErrorPost: []
    }

    function _getZona(request) {

        try {
            log.audit('request data', request)
            var arrayOportunidadesM = [];
            var objOportunidadesM = {};
            var transactionSearchObj = search.create({
                type: "transaction",
                filters: [
                    ["type", "anyof", "Opprtnty"],
                    // "AND",
                    // ["subsidiary", "anyof", "16", "13"],
                    "AND",
                    ["mainline", "is", "T"]
                ],
                columns: [
                    //Primera Versión
                    // search.createColumn({
                    //     name: "internalid",
                    //     join: "customer"
                    // }),
                    // search.createColumn({
                    //     name: "custentity_ptg_tipodecliente_",
                    //     join: "customer"
                    // }),
                    // "trandate",
                    // "statusref",
                    // "entity",
                    // search.createColumn({
                    //     name: "phone",
                    //     join: "customer"
                    // }),
                    // search.createColumn({
                    //     name: "address",
                    //     join: "customer"
                    // }),
                    // "custbody_ptg_zonadeprecioop_",
                    // "asofdate",
                    // "tranid",
                    // "memo",
                    // "amount",
                    // search.createColumn({
                    //     name: "custentity_ptg_tipodecliente_",
                    //     join: "customer",
                    //     label: "PTG - Tipo de cliente"
                    // }),
                    // search.createColumn({
                    //     name: "salesrep",
                    //     label: "Representante de ventas"
                    // }),
                    // search.createColumn({
                    //     name: "expectedclosedate",
                    //     label: "Cierre previsto"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_hora_cierre",
                    //     label: "Hora Cierre" //No existe
                    // }),
                    // search.createColumn({
                    //     name: "internalid",
                    //     label: "id de la transaccion"
                    // }),
                    // search.createColumn({
                    //     name: "entitystatus",
                    //     label: "estados"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_hora_notificacion",
                    //     label: "PTG - HORA DE NOTIFICACION"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_segundas_llamadas",
                    //     label: "PTG - SEGUNDAS LLAMADAS"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_reference",
                    //     label: "Referencias" //No existe
                    // }),
                    // search.createColumn({
                    //     name: "custbody_otg_folio_aut",
                    //     label: "Folio Aut."
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_opcion_pago",
                    //     label: "Opción de Pago"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_entre_las",
                    //     label: "Entre las" //No existe
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_y_las",
                    //     label: "Y las" //No existe
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_fecha_notificacion",
                    //     label: "PTG - Fecha de Notificación"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_type_service",
                    //     label: "Tipo de Servicio"
                    // }),
                    // search.createColumn({
                    //     name: "custentity_ptg_numero_contrato",
                    //     join: "customer",
                    //     label: "PTG - NUMERO DE CONTRATO"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_numero_viaje",
                    //     label: "Número de Viaje"
                    // }),
                    // search.createColumn({
                    //     name: "custbody_ptg_monitor",
                    //     label: "Monitor"
                    // }),
                    // search.createColumn({
                    //     name: "memo",
                    //     label: "Nota"
                    // }),
                    // search.createColumn({
                    //     name: "custrecord_ptg_colonia_ruta",
                    //     join: "shippingAddress",
                    //     label: "PTG - COLONIA Y RUTA"
                    //  }),
                    //  search.createColumn({
                    //     name: "custrecord_ptg_vehiculo_tabladeviajes_",
                    //     join: "CUSTBODY_PTG_NUMERO_VIAJE",
                    //     label: "PTG - Vehiculo (Tabla de Viajes)"
                    //  })
                    //Primera Versión

                    search.createColumn({//0
                        name: "internalid",
                        join: "customer",
                        label: "Internal ID"
                    }),
                    search.createColumn({//1
                        name: "custentity_ptg_tipodecliente_",
                        join: "customer",
                        label: "PTG - Tipo de cliente"
                    }),
                    search.createColumn({ name: "trandate", label: "Date" }),//2
                    search.createColumn({ name: "custbody_ptg_estado_pedido", label: "PTG - ESTADO DEL PEDIDO" }),//3
                    search.createColumn({ name: "entity", label: "Name" }),//4
                    search.createColumn({//5
                        name: "phone",
                        join: "customer",
                        label: "Phone"
                    }),
                    search.createColumn({//7
                        name: "address",
                        join: "shippingAddress",
                        label: " Address"
                    }),
                    search.createColumn({ name: "custbody_ptg_zonadeprecioop_", label: "PTG - Zona de precio Oportuidad" }),//8
                    search.createColumn({ name: "tranid", label: "Document Number" }),//9
                    search.createColumn({ name: "memo", label: "Memo" }),//10
                    search.createColumn({ name: "amount", label: "Amount" }),//11
                    search.createColumn({//12
                        name: "custentity_ptg_tipodecliente_",
                        join: "customer",
                        label: "PTG - Tipo de cliente"
                    }),
                    search.createColumn({ name: "salesrep", label: "Sales Rep" }),//13
                    search.createColumn({ name: "expectedclosedate", label: "Expected Close" }),//14
                    search.createColumn({ name: "internalid", label: "Internal ID" }),//15
                    search.createColumn({ name: "custbody_ptg_estado_pedido", label: "PTG - ESTADO DEL PEDIDO" }),//16
                    search.createColumn({ name: "custbody_ptg_hora_notificacion", label: "PTG - HORA DE NOTIFICACION" }),//17
                    search.createColumn({ name: "custbody_ptg_segundas_llamadas", label: "PTG - SEGUNDAS LLAMADAS" }),//18
                    search.createColumn({ name: "custbody_ptg_folio_aut", label: "PTG - FOLIO DE AUTORIZACIÓN" }),//19
                    search.createColumn({ name: "custbody_ptg_opcion_pago", label: "Opción de Pago" }),//20
                    search.createColumn({ name: "custbody_ptg_fecha_notificacion", label: "PTG - Fecha de Notificación" }),//21
                    search.createColumn({ name: "custbody_ptg_tipo_servicio", label: "PTG - Tipo Servicio" }),//22
                    search.createColumn({//23
                        name: "custrecord_ptg_numero_contrato",
                        join: "shippingAddress",
                        label: "PTG - NUMERO DE CONTRATO"
                    }),
                    search.createColumn({ name: "custbody_ptg_numero_viaje", label: "Número de Viaje" }),//24
                    search.createColumn({ name: "custbody_ptg_monitor", label: "PTG - Monitor" }),//25
                    search.createColumn({//26
                        name: "custrecord_ptg_nombre_colonia",
                        join: "shippingAddress",
                        label: "PTG - NOMBRE COLONIA"
                    }),
                    search.createColumn({//27
                        name: "custrecord_ptg_vehiculo_tabladeviajes_",
                        join: "CUSTBODY_PTG_NUMERO_VIAJE",
                        label: "PTG - Vehiculo (Tabla de Viajes)"
                    }),
                    search.createColumn({ name: "custbody_ptg_entre_las", label: "Entre las" }),//28
                    search.createColumn({ name: "custbody_ptg_y_las", label: "Y las" }),//29
                    search.createColumn({ name: "custbody_ptg_opcion_pago_obj", label: "PTG - OPCIÓN DE PAGO OBJ" }),//30
                    search.createColumn({//31
                        name: "custentity_ptg_alianza_comercial_cliente",
                        join: "customer",
                        label: "PTG - ALIANZA COMERCIAL DEL CLIENTE"
                    }),
                    search.createColumn({ name: "custbody_ptg_hora_trans", label: "PTG - HORA TRANS" }),//32
                    search.createColumn({ name: "shipname", label: "Shipping Label" }),//33
                    search.createColumn({//34
                        name: "custrecord_ptg_street",
                        join: "shippingAddress",
                        label: "PTG -  CALLE"
                    }),
                    search.createColumn({//35
                        name: "custrecord_ptg_exterior_number",
                        join: "shippingAddress",
                        label: "PTG - NUMERO EXTERIOR"
                    }),
                    search.createColumn({//36
                        name: "custrecord_ptg_interior_number",
                        join: "shippingAddress",
                        label: "PTG - NUMERO INTERIOR"
                    }),
                    search.createColumn({//37
                        name: "custentity_ptg_saldo_disponible",
                        join: "customer",
                        label: "PTG - Saldo Disponible"
                    }),
                    search.createColumn({//38
                        name: "custrecord_ptg_chofer_tabladeviajes_",
                        join: "CUSTBODY_PTG_NUMERO_VIAJE",
                        label: "PTG - Chofer (Tabla de viajes)"
                    }),
                    search.createColumn({//38
                        name: "custrecord_ptg_telefono_chofer",
                        join: "CUSTBODY_PTG_NUMERO_VIAJE",
                        label: "PTG - TELEFONO DEL CHOFER"
                    }),
                    search.createColumn({//39
                        name: "custrecord_ptg_ruta",
                        join: "CUSTBODY_PTG_NUMERO_VIAJE",
                        label: "PTG - RUTA"
                    }),
                    search.createColumn({//40
                        name: "city",
                        join: "shippingAddress",
                        label: "CITY"
                    }),
                    search.createColumn({//41
                        name: "custrecord_ptg_estado",
                        join: "shippingAddress",
                        label: "PTG - ESTADO"
                    }),
                    search.createColumn({//42
                        name: "zip",
                        join: "shippingAddress",
                        label: "ZIP"
                    }),
                    search.createColumn({ name: "custbody_ptg_precio_articulo_zona", label: "PTG - PRECIO DEL ARICULO EN LA ZONA" }),//43
                    search.createColumn({//44
                        name: "custentity_ptg_tipo_descuento",
                        join: "customer",
                        label: "PTG - TIPO DE DESCUENTO"
                    }),
                    search.createColumn({//45
                        name: "custentity_ptg_descuento_asignar",
                        join: "customer",
                        label: "PTG - DESCUENTO PARA ASIGNAR ( % o $ )"
                    }),
                    search.createColumn({//46
                        name: "custrecord_ptg_articulo_frecuente",
                        join: "shippingAddress",
                        label: "PTG - ARTICULO FRECUENTE"
                    }),
                    search.createColumn({//47
                        name: "custrecord_ptg_capacidad_art",
                        join: "shippingAddress",
                        label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO"
                    }),
                    search.createColumn({//48
                        name: "custrecord_ptg_articulo_frecuente2",
                        join: "shippingAddress",
                        label: "PTG - ARTICULO FRECUENTE 2"
                    }),
                    search.createColumn({//49
                        name: "custrecord_ptg_capacidad_can_articulo_2",
                        join: "shippingAddress",
                        label: "PTG - CAPACIDAD O CANTIDAD DEL ARTICULO 2"
                    }),
                    search.createColumn({//50
                        name: "custrecord_ptg_tipo_servicio",
                        join: "shippingAddress",
                        label: "PTG - TIPO DE SERVICIO"
                    }),
                    search.createColumn({//51
                        name: "isperson",
                        join: "customer",
                        label: "Is Individual"
                     }),
                     search.createColumn({//52
                        name: "firstname",
                        join: "customer",
                        label: "First Name"
                     }),
                     search.createColumn({//53
                        name: "lastname",
                        join: "customer",
                        label: "Last Name"
                     }),
                     search.createColumn({//54
                        name: "companyname",
                        join: "customer",
                        label: "Company Name"
                     }),
                     /*search.createColumn({
                        name: "custrecord_ptg_desc_terminal_cuenta",
                        join: "CUSTBODY_PTG_TERMINAL_UTILIZADA",
                        label: "PTG - DESCRIPCION DE LA TERMINAL Y CUENTA"
                    }),*/
                    search.createColumn({name: "custbody_ptg_turno_equipo", label: "PTG - TURNO DEL EQUIPO"}),//55
                    search.createColumn({ name: "custbody_ptg_estado_aviso_llamadas", label: "PTG - ESTADO AVISOS/LLAMADAS" }),//56
                  	search.createColumn({ name: "custbody_ptg_ruta_asignada", label: "PTG - RUTA ASIGNADA" }),//57
                      search.createColumn({//58
                        name: "custrecord_ptg_direccion_contrato",
                        join: "shippingAddress",
                        label: "PTG - DIRECCION CON CONTRATO"
                    }),
                    search.createColumn({//59
                        name: "custrecord_ptg_digito_verificador",
                        join: "shippingAddress",
                        label: "PTG - DIGITO VERIFICADOR"
                    }),
                    search.createColumn({//60
                        name: "custbody_ptg_solicitud_cancelacion",
                        label: "PTG - SOLICITUD DE CANCELACION"
                    }),
                    search.createColumn({//61
                        name: "custbody_ptg_solici_cambio_fech_prome",
                        label: "PTG - SOLICITUD DE CAMBIO DE FECHA PROMETIDA"
                    }),
                    search.createColumn({//62
                        name: "custbody_ptg_motivo_cancelation",
                        label: "PTG - MOTIVO DE CANCELACION"
                    }),
                    search.createColumn({//63
                        name: "custrecord_ptg_telefono_principal",
                        join: "shippingAddress",
                        label: "PTG - TELEFONO PRINCIPAL"
                    }),
                    search.createColumn({//64
                        name: "custentity_ptg_saldo_disponible",
                        join: "customer",
                        label: "PTG - SALDO DISPONIBLE"
                    }),
                    search.createColumn({//65
                        name: "entityid",
                        join: "customer",
                        label: "ID"
                    }),
                    search.createColumn({//66
                        name: "custrecord_ptg_entrecalle_",
                        join: "shippingAddress",
                        label: "PTG - ENTRE CALLE"
                    }),
                    search.createColumn({//67
                        name: "custrecord_ptg_y_entre_",
                        join: "shippingAddress",
                        label: "PTG - Y CALLE"
                    }),
                    search.createColumn({//68
                        name: "custbody_ptg_etiqueta_direccion_envio",
                        label: "custbody_ptg_etiqueta_direccion_envio"
                    })
                ]
            });

            //let tipoTransaccion = request.tipo;
            //let idOportunidad = request.id;
            var arrayFechasSolicitud = [];
            let rangoSolicitud1 = request.fechaSolicitud1 || "";
            arrayFechasSolicitud.push(rangoSolicitud1)
            let rangoSolicitud2 = request.fechaSolicitud2 || "";
            arrayFechasSolicitud.push(rangoSolicitud2)
            log.audit('rangoSolicitud1', rangoSolicitud1);
            log.audit('rangoSolicitud2', rangoSolicitud2);
            if (rangoSolicitud1 || rangoSolicitud2) {
                var fechaSolicitud = search.createFilter({
                    name: "trandate",
                    operator: "within",
                    values: arrayFechasSolicitud
                })
                transactionSearchObj.filters.push(fechaSolicitud);
            }

            if (rangoSolicitud1 || rangoSolicitud2) {
                var fechaSolicitud = search.createFilter({
                    name: "trandate",
                    operator: "within",
                    values: arrayFechasSolicitud
                })
                transactionSearchObj.filters.push(fechaSolicitud);
            }
            //["expectedclosedate","within","10/1/2022","10/1/2022"]
            var arrayFechaPrometida = [];
            let rangoPrometido1 = request.fechaPrometida1 || "";
            arrayFechaPrometida.push(rangoPrometido1);
            let rangoPrometido2 = request.fechaPrometida2 || "";
            arrayFechaPrometida.push(rangoPrometido2);
            if (rangoPrometido1 || rangoPrometido2) {
                var fechaPrometida = search.createFilter({
                    name: "expectedclosedate",
                    operator: "within",
                    values: arrayFechaPrometida
                })
                transactionSearchObj.filters.push(fechaPrometida);
            }

            var status = request.status_oportunidad;
            if (status) {
                var statusOportunidad = search.createFilter({
                    name: "custbody_ptg_estado_pedido",
                    operator: "anyof",
                    values: status
                })
                transactionSearchObj.filters.push(statusOportunidad);
            }

            // var route = request.ruta_oportunidad;
            // if(route){
            //     var routeOportunidad = search.createFilter({
            //         name: "custbody_route",
            //         operator: "anyof",
            //         values: route
            //     })
            //     transactionSearchObj.filters.push(routeOportunidad);
            // }

            //Este filtra por el tipo de servicio si es pedido, fuga o queja
            // var serviceType = request.tipo_servicio;
            // if(serviceType){
            //     var serviceTypeOportunidad = search.createFilter({
            //         name: "custbody_ptg_type_service",
            //         operator: "anyof",
            //         values: serviceType
            //     })
            //     transactionSearchObj.filters.push(serviceTypeOportunidad);
            // }

            //Este filtra por cilindro estacionar o carburación
            var productType = request.tipo_producto;
            if (productType) {
                var productTypeCustomer = search.createFilter({
                    name: "custbody_ptg_tipo_servicio",
                    operator: "anyof",
                    values: productType
                })
                transactionSearchObj.filters.push(productTypeCustomer);
            }

            var telefono = request.phone;
            if (telefono) {
                var phoneCliente = search.createFilter({
                  	name: "custrecord_ptg_telefono_principal",
                  	join: "shippingAddress",
                 	operator: "haskeywords",
                  	label: "PTG - TELEFONO PRINCIPAL",
                    values: telefono
                })
                transactionSearchObj.filters.push(phoneCliente);
            }

            var correoElectronico = request.email;
            if (correoElectronico) {
                var emailCliente = search.createFilter({
                    name: "email",
                    operator: "haskeywords",
                    join: "customer",
                    values: correoElectronico
                })
                transactionSearchObj.filters.push(emailCliente);
            }

            var nombreCliente = request.name;
            if (nombreCliente) {
                var name_customer = search.createFilter({
                    name: "entityid",
                    operator: "startswith",
                    join: "customer",
                    values: nombreCliente
                })
                transactionSearchObj.filters.push(name_customer);
            }

            //Filtro por calle ["shippingaddress.custrecord_ptg_street","startswith","Alto Prado"]
            var street = request.calle;
            if (street) {
                var street_customer = search.createFilter({
                    name: "custrecord_ptg_street",
                    operator: "contains",
                    join: "shippingaddress",
                    values: street
                })
                transactionSearchObj.filters.push(street_customer);
            }

            //Filtro por n exterior ["shippingaddress.custrecord_ptg_exterior_number","startswith","5454"]
            var nExterior = request.nExt;
            if (nExterior) {
                var next_customer = search.createFilter({
                    name: "custrecord_ptg_exterior_number",
                    operator: "startswith",
                    join: "shippingaddress",
                    values: nExterior
                })
                transactionSearchObj.filters.push(next_customer);
            }

            //Filtro por n Interior ["shippingaddress.custrecord_ptg_exterior_number","startswith","5454"]
            var nInterior = request.nInt;
            if (nInterior) {
                var nint_customer = search.createFilter({
                    name: "custrecord_ptg_interior_number",
                    operator: "startswith",
                    join: "shippingaddress",
                    values: nInterior
                })
                transactionSearchObj.filters.push(nint_customer);
            }

            //Filtro por tipo programado ["shippingaddress.custrecord_ptg_tipo_contacto","anyof","4"]
            var isScheduled = request.programado;
            if (isScheduled) {
                var scheduled_customer = search.createFilter({
                    name: "custbody_ptg_oportunidad_programado",
                    operator: "is",
                    values: isScheduled
                })
                transactionSearchObj.filters.push(scheduled_customer);
            }

            //["custbody_ptg_numero_viaje.custrecord_ptg_ruta","anyof","1244"]
            let rutaId = request.ruta;
            if (rutaId) {
                var ruta = search.createFilter({
                    name: "custrecord_ptg_ruta",
                    join: "custbody_ptg_numero_viaje",
                    operator: "anyof",
                    values: rutaId
                })
                transactionSearchObj.filters.push(ruta);
            }

            var coloniaCliente = request.colonia;
            if (coloniaCliente) {
                var colonia_customer = search.createFilter({
                    name: "custrecord_ptg_colonia_ruta",
                    operator: "anyof",
                    join: "shippingaddress",
                    values: coloniaCliente
                })
                transactionSearchObj.filters.push(colonia_customer);
            }

            var sLlamadas = request.segunda_llamada;
            if (sLlamadas) {
                var secondCall = search.createFilter({
                    name: "custbody_ptg_segundas_llamadas",
                    operator: "is",
                    values: sLlamadas
                })
                transactionSearchObj.filters.push(secondCall);
            }

            let plantaId = request.planta;
            if (plantaId) {
                var planta = search.createFilter({
                    name: "custbody_ptg_planta_relacionada",
                    //join: "custbody_ptg_numero_viaje",
                    operator: "is",
                    values: plantaId
                })
                transactionSearchObj.filters.push(planta);
            }

            var statusAlert = request.status_alert;
            if (statusAlert) {
                var statusAlertFilter = search.createFilter({
                    name: "custbody_ptg_estado_aviso_llamadas",
                    operator: "anyof",
                    values: statusAlert
                })
                transactionSearchObj.filters.push(statusAlertFilter);
            }
          
          	var routeString = request.route_string;
            if (routeString) {
                var routeStringFilter = search.createFilter({
                    name: "custbody_ptg_ruta_asignada",
                    operator: "contains",
                    values: routeString
                })
                transactionSearchObj.filters.push(routeStringFilter);
            }

            //["customer.custentity_ptg_tipodeservicio_","anyof","1"] => cliente tipo de servicio
            //["entitystatus","anyof","11"] status
            //["custbody_route","anyof","1"] rote
            //["trandate","within","17/1/2022","18/1/2022"] fecha
            //["custbody_ptg_type_service","anyof","1"] tipo de servicio
            //["customer.custentity_ptg_tipodeservicio_","anyof","1"]
            //["customer.phone","haskeywords","3354133932"] => telefono
            //["customer.email","haskeywords","zulay@test.com" email
            //["customer.altname","is","Zulay Aponte PTG"] nombre
            //["shippingaddress.custrecord_ptg_colonia_ruta","anyof","14"]
            //["custbody_ptg_segundas_llamadas","is","T"]
            log.audit('transactionSearchObj', transactionSearchObj)
            var contador = transactionSearchObj.runPaged().count;
            log.audit('contador', contador);
            var searchResultCount = transactionSearchObj.run();
            var start = 0;
            var tipoCliente = '';
            var nombreZona = '';
            var nombreRepresentanteV = '';

            do {
                var results = searchResultCount.getRange(start, start + 1000);
                log.audit('results', results)
                if (results && results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        var columnas = results[i].columns;
                        var idCustomer = results[i].getValue(columnas[0]);
                        var typeCustomer = results[i].getValue(columnas[1]);
                        var dateCustomer = results[i].getValue(columnas[2]);
                        var status = results[i].getValue(columnas[3]);
                        var idCustomer = results[i].getValue(columnas[4]);
                        var phoneCustomer = results[i].getValue(columnas[63]);
                        var addressCustomer = results[i].getValue(columnas[6]);
                        var zonaPrice = results[i].getValue(columnas[7]);
                        var documentNumber = results[i].getValue(columnas[8]);
                        var idRepresentante = results[i].getValue(columnas[12]);
                        var cierreP = results[i].getValue(columnas[13]);
                        //var horaP = results[i].getValue(columnas[14]);
                        var idtransaccion = results[i].getValue(columnas[14]);
                        var idStatus = results[i].getValue(columnas[15]);
                        var horaN = results[i].getValue(columnas[16]);
                        var sLlamada = results[i].getValue(columnas[17]);
                        //var ref = results[i].getValue(columnas[20]);
                        var folioA = results[i].getValue(columnas[18]);
                        var oPago = results[i].getValue(columnas[19]);
                        var intervaloHoraInicio = results[i].getValue(columnas[27]);
                        var intervaloHoraFin = results[i].getValue(columnas[28]);
                        var fechaNot = results[i].getValue(columnas[20]);
                        var idTipoServicio = results[i].getValue(columnas[21]);
                        var tipoServicio = results[i].getText(columnas[21]);
                        var noContrato = results[i].getValue(columnas[22]);
                        var idNumeroViaje = results[i].getValue(columnas[23]);
                        var numeroViaje = results[i].getText(columnas[23]);
                        var monitor = results[i].getValue(columnas[24]);
                        var memo = results[i].getValue(columnas[9]);
                        //var idColonia = results[i].getValue(columnas[25]);
                      	var coloniaNombre = results[i].getValue(columnas[25]);
                        var idVehiculo = results[i].getValue(columnas[26]);
                        var objPagos = results[i].getValue(columnas[29]);
                        var tipoContrato = results[i].getText(columnas[30]);
                        var tipoContratoId = results[i].getValue(columnas[30]);
                        var horaTrans = results[i].getValue(columnas[31]);
                        var label = results[i].getValue(columnas[32]);
                        var street = results[i].getValue(columnas[33]);
                        var nExterior = results[i].getValue(columnas[34]);
                        var nInterior = results[i].getValue(columnas[35]);
                        var saldoDisponible = results[i].getValue(columnas[36]);
                        var choferId = results[i].getValue(columnas[37]);
                        var chofer = results[i].getText(columnas[37]);
                        var phoneChofer = results[i].getValue(columnas[38]);
                        var rutaAsigId = results[i].getValue(columnas[39]);
                        var rutaNombre = results[i].getText(columnas[39]);
                        var municipio = results[i].getValue(columnas[40]);
                        var estadoDireccion = results[i].getValue(columnas[41]);
                        var cp = results[i].getValue(columnas[42]);
                        var precioZona = results[i].getValue(columnas[43]);
                        var typeDiscount = results[i].getValue(columnas[44]);
                        var discount = results[i].getValue(columnas[45]);
                        var item1Id = results[i].getValue(columnas[46]);
                        var item1 = results[i].getText(columnas[46]);
                        var capacidad1 = results[i].getValue(columnas[47]);
                        var item2Id = results[i].getValue(columnas[48]);
                        var item2 = results[i].getText(columnas[48]);
                        var capacidad2 = results[i].getValue(columnas[49]);
                        var serviceTypeId = results[i].getValue(columnas[50]);
                        var serviceType = results[i].getText(columnas[50]);
                        var isPerson = results[i].getValue(columnas[51]);
                        var firstName = results[i].getValue(columnas[52]);
                        var lastName = results[i].getValue(columnas[53]);
                        var companyName = results[i].getValue(columnas[54]); 
                        //var terminalName = results[i].getValue(columnas[55]); 
                        var turnoId = results[i].getValue(columnas[55]); 
                        var turno = results[i].getText(columnas[55]); 
                        var statusAlertName = results[i].getText(columnas[56]); 
                        var statusAlertId = results[i].getValue(columnas[56]); 
                      	var routeText = results[i].getValue(columnas[57]);
                        var conContrato = results[i].getValue(columnas[58]);
                        var digitoVerificador = results[i].getValue(columnas[59]);
                        var solicitudCancelacion = results[i].getValue(columnas[60]);
                        var solicitudCambioFecha = results[i].getValue(columnas[61]);
                        var motivoCancelacion = results[i].getValue(columnas[62]);
                        var credito_disponible = results[i].getValue(columnas[64]);
                        var entityidcliente = results[i].getValue(columnas[65]);
                        var entre1 = results[i].getValue(columnas[66]);
                        var entre2 = results[i].getValue(columnas[67]);
                        var labelAddress = results[i].getValue(columnas[68]);


                        //obtencion de informacion por id
                        if (typeCustomer == 1) {
                            tipoCliente = 'Industrial'
                        } else if (typeCustomer == 2) {
                            tipoCliente = 'Intercompañía'
                        } else if (typeCustomer == 3) {
                            tipoCliente = 'Doméstico'
                        } else if (typeCustomer == 4) {
                            tipoCliente = 'Otras Compañias'
                        } else if (typeCustomer == 5) {
                            tipoCliente = 'Comercial'
                        }

                        var lookupFieldName = search.lookupFields({
                            type: search.Type.CUSTOMER,
                            id: idCustomer,
                            columns: ['altname']
                        });
                        var nameCustomer = lookupFieldName.altname;

                        if (!zonaPrice) {
                            nombreZona = "No hay zona"
                        } else {
                            var lookupFieldZona = search.lookupFields({
                                type: 'customrecord_ptg_zonasdeprecio_',
                                id: zonaPrice,
                                columns: ['custrecord_ptg_territoriodescripcion_']
                            });

                            nombreZona = lookupFieldZona.custrecord_ptg_territoriodescripcion_;
                        }

                        if (!idRepresentante) {
                            nombreRepresentanteV = " "
                        } else {
                            var lookupRepresentanteV = search.lookupFields({
                                type: search.Type.EMPLOYEE,
                                id: idRepresentante,
                                columns: ['entityid', 'firstname']
                            });

                            nombreRepresentanteV = lookupRepresentanteV.entityid
                        }

                        let noViaje = '';
                        //customrecord_ptg_zonasdeprecio_

                        if (!idNumeroViaje) {
                            noViaje = " "
                        } else {
                            var lookupNoViaje = search.lookupFields({
                                type: 'customrecord_ptg_tabladeviaje_enc2_',
                                id: idNumeroViaje,
                                columns: ['name']
                            });
                            noViaje = lookupNoViaje.name
                        }
                        let nombreMonitorista = '';
                        if (!monitor) {
                            nombreMonitorista = " "
                        } else {
                            var lookupMonitorista = search.lookupFields({
                                type: search.Type.EMPLOYEE,
                                id: monitor,
                                columns: ['entityid', 'firstname']
                            });

                            nombreMonitorista = lookupMonitorista.entityid;
                        }
                        /*let coloniaNombre = '';
                        if (!idColonia) {
                            coloniaNombre = " "
                        } else {
                            var lookupcolonia = search.lookupFields({
                                type: 'customrecord_ptg_coloniasrutas_',
                                id: idColonia,
                                columns: ['custrecord_ptg_nombrecolonia_']
                            });

                            coloniaNombre = lookupcolonia.custrecord_ptg_nombrecolonia_;
                        }*/

                        let nombreVehiculo = "";
                        if (!idVehiculo) {
                            nombreVehiculo = " "
                        } else {
                            var lookupVehiculo = search.lookupFields({
                                type: 'customrecord_ptg_equipos',
                                id: idVehiculo,
                                columns: ['custrecord_ptg_idequipo_']
                            });

                            nombreVehiculo = lookupVehiculo.custrecord_ptg_idequipo_;
                        }

                       var ultimaNota = getLastNote(idtransaccion);
                       var countPendingNotification = getPendingNotes(idtransaccion);

                        objOportunidadesM = {
                            no_pedido: idtransaccion,
                            id_cliente: idCustomer,
                            tipo_cliente: tipoCliente || '',
                            fecha_solicitud: dateCustomer,
                            estado: status,
                            nombre_cliente: nameCustomer,
                            telefono: phoneCustomer,
                            direccion: addressCustomer,
                            zona: nombreZona,
                            observaciones: memo,
                            servicio: idTipoServicio,
                            servicioNombre: tipoServicio,
                            usuario_pedido_solicitud: nombreRepresentanteV,
                            fecha_prometida: cierreP,
                            //hora_prometido: horaP || "",
                            tipo_producto: "",
                            status_id: idStatus,
                            hora_notificacion: horaN,
                            segunda_llamada: sLlamada,
                            folio_autorizacion: folioA,
                            metodo_pago: oPago,
                            //referencias: ref,
                            desde: intervaloHoraInicio,
                            hasta: intervaloHoraFin,
                            fecha_notificacion: fechaNot,
                            contrato: noContrato,
                            id_no_viaje: idNumeroViaje,
                            nombre_numero_viaje: numeroViaje,
                            usuario_monitor: nombreMonitorista,
                            //id_colonia: idColonia,
                            colonia: coloniaNombre,
                            id_vehiculo: idVehiculo,
                            nombre_vehiculo: nombreVehiculo,
                            objPagos: objPagos,
                            tipoContrato: tipoContrato,
                            tipoContratoId: tipoContratoId,
                            horaTrans: horaTrans,
                            label: label,
                            street: street,
                            nExterior: nExterior,
                            nInterior: nInterior,
                            saldoDisponible: saldoDisponible,
                            choferId: choferId,
                            chofer: chofer,
                            phoneChofer: phoneChofer,
                            rutaAsigId: rutaAsigId,
                            rutaNombre: rutaNombre,
                            documentNumber: documentNumber,
                            municipio: municipio,
                            estadoDireccion: estadoDireccion,
                            cp: cp,
                            precioZona: precioZona,
                            typeDiscount: typeDiscount,
                            discount: discount,
                            item1: item1,
                            item1Id: item1Id,
                            capacidad1: capacidad1,
                            item2: item2,
                            item2Id: item2Id,
                            capacidad2: capacidad2,
                            serviceType : serviceType,
                            serviceTypeId : serviceTypeId,
                            isPerson : isPerson,
                            firstName : firstName,
                            lastName : lastName,
                            companyName : companyName,
                            //terminalName : terminalName,
                            turnoId : turnoId,
                            turno : turno,
                            statusAlertName : statusAlertName,
                            statusAlertId : statusAlertId,
                          	routeText : routeText,
                            conContrato: conContrato,
                            digitoVerificador: digitoVerificador,
                            solicitudCancelacion: solicitudCancelacion,
                            solicitudCambioFecha: solicitudCambioFecha,
                            motivoCancelacion: motivoCancelacion,
                            ultimaNota: ultimaNota,
                            countPendingNotification: countPendingNotification,
                            credito_disponible: credito_disponible,
                            entityidcliente: entityidcliente,
                            entre1: entre1,
                            entre2: entre2,
                            labelAddress: labelAddress
                        }

                        arrayOportunidadesM.push(objOportunidadesM);
                    }
                }
                start += 1000;
            } while (results && results.length == 1000);

            // return JSON.stringify(arrayOportunidadesM);
            //if(arrayOportunidadesM.length > 0){
            responseData.success = true;
            responseData.data = arrayOportunidadesM
            //}
            return responseData;

        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
            return responseData;
        }
    }

    function getLastNote(id, tipo = "opportunity") {
        let nota = "";
        let opportunitySearchObj = search.create({
            type: tipo,
            filters:
                [
                    ["internalid", "anyof", id]
                ],
            columns:
                [
                    search.createColumn({
                        name: "note",
                        join: "userNotes",
                        label: "Memo"
                    })
                ]
        });
        /*let searchResultCount = opportunitySearchObj.runPaged().count;
        log.debug("opportunitySearchObj result count", searchResultCount);*/
        opportunitySearchObj.run().each(function (result) {
            // .run().each has a limit of 4,000 results
            nota = result.getValue({name: "note",
            join: "userNotes",
            label: "Memo"});
        
        });

        return nota;
    }

    function getPendingNotes(id, tipo = "opportunity") {
        var opportunitySearchObj = search.create({
            type: tipo,
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
        post: _getZona
    }
});