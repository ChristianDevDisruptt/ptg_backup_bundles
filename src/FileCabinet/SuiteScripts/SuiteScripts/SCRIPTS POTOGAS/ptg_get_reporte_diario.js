/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(['N/search', 'N/query'], function (search, query) {

    const responseData = {
        success: false,
        message: "",
        data: null,
        apiErrorPost: []
    }

    function _get(request) {

        try {
            let sql = ` SELECT
                            TR.id,
                            TR.closedate,
                            TL.item,
                            I.fullname,
                            TL.quantity,
                            TR.foreigntotal,
                            TRSA.custrecord_ptg_street,
                            TRSA.custrecord_ptg_exterior_number,
                            TRSA.custrecord_ptg_interior_number,
                            TRSA.custrecord_ptg_nombre_colonia,
                            TRSA.zip,
                            TRSA.city,
                            TRSA.custrecord_ptg_estado,
                            E.isperson,
                            E.firstname,
                            E.lastname,
                            E.altname,
                            E.entityid,
                            TRSA.custrecord_ptg_numero_contrato,
                            TRSA.custrecord_ptg_direccion_contrato,
                            TRSA.custrecord_ptg_digito_verificador,
                            TRSA.custrecord_ptg_telefono_principal,
                            EM.id,
                            EM.entityid,
                            TR.memo,
                            C.custentity_ptg_alianza_comercial_cliente,
                            CPAC.name,
                            C.creditlimit,
                            C.balancesearch,
                            TR.custbody_ptg_oportunidad_programado,
                            TR.custbody_ptg_oportunidad_avisos_llamad,
                            TR.custbody_ptg_ruta_asignada,
                            (SELECT 
                                MAX(TR2.closedate) 
                            FROM 
                                transaction TR2 
                            WHERE 
                                TR2.type = 'Opprtnty' AND 
                                TR2.entity = TR.entity AND
                                TR2.shippingaddress = TR.shippingaddress) AS AUX,
                            TR.custbody_ptg_estado_pedido
                        FROM
                            transaction TR
                        LEFT JOIN transactionLine TL ON
                            TR.id = TL.transaction
                        LEFT JOIN item I ON
                            TL.item = I.id
                        LEFT JOIN transactionShippingAddress TRSA ON
                            TR.shippingaddress = TRSA.nkey
                        LEFT JOIN entity E ON
                            TR.entity = E.id
                        LEFT JOIN employee EM ON
                            TR.employee = EM.id
                        LEFT JOIN Customer C ON
                            E.customer = C.id
                        LEFT JOIN CUSTOMLIST_PTG_ALIANZA_COMERCIAL CPAC ON
                            C.custentity_ptg_alianza_comercial_cliente = CPAC.id
                        WHERE
                            TR.type = 'Opprtnty' AND
                            TL.taxline = 'F' `;

            if(request.tipo_producto) {
                sql += ` AND TR.custbody_ptg_tipo_servicio = ${request.tipo_producto} `;
            }

            if(request.planta) {
                sql += ` AND TR.custbody_ptg_planta_relacionada = '${request.planta}' `;
            }

            if(request.fechaPrometida) {
                sql += ` AND TR.expectedclosedate = '${request.fechaPrometida}' `;
            }

            if(!request.programado) {
                sql += ` AND (TR.custbody_ptg_oportunidad_programado = 'F' OR TR.custbody_ptg_oportunidad_programado IS NULL) `;
            }

            if(request.status_oportunidad) {
                let auxStatus = '';
                request.status_oportunidad.forEach(element => {
                    if(auxStatus != "") {
                        auxStatus += " OR "
                    }
                    auxStatus += ` TR.custbody_ptg_estado_pedido = '${element}' `
                });
                
                sql += ` AND (${auxStatus}) `;
            }

            if(request.rutas) {
                let auxRut = '';
                request.rutas.forEach(element => {
                    if(auxRut != "") {
                        auxRut += " OR "
                    }
                    auxRut += ` TR.custbody_ptg_ruta_asignada like '%${element}%' `
                });
                sql += ` AND (${auxRut}) `;
            }

            sql += `ORDER BY
                        TR.custbody_ptg_ruta_asignada`;

            log.audit("sql", sql);

            var arrayData = [];

            let resultIterator = query.runSuiteQLPaged({
                query: sql,
                pageSize: 1000
            }).iterator();

            resultIterator.each(function (page) {
                let pageIterator = page.value.data.iterator();
                pageIterator.each(function (row) {
                    let data = {
                        id: row.value.getValue(0),
                        fecha_cierre: row.value.getValue(1),
                        articulo_id: row.value.getValue(2),
                        articulo: row.value.getValue(3),                            
                        cantidad: row.value.getValue(4),
                        total: row.value.getValue(5),
                        street: row.value.getValue(6),
                        nExterior: row.value.getValue(7),
                        nInterior: row.value.getValue(8),
                        colonia: row.value.getValue(9),
                        cp: row.value.getValue(10),
                        municipio: row.value.getValue(11),
                        estadoDireccion: row.value.getValue(12),//12
                        isPerson : row.value.getValue(13),
                        firstName : row.value.getValue(14),
                        lastName : row.value.getValue(15),
                        companyName : row.value.getValue(16),
                        entityidcliente: row.value.getValue(17),
                        contrato: row.value.getValue(18),
                        conContrato: row.value.getValue(19),
                        digitoVerificador: row.value.getValue(20),
                        telefono: row.value.getValue(21),
                        usuario_pedido_solicitud_id: row.value.getValue(22),
                        usuario_pedido_solicitud: row.value.getValue(23),                        
                        observaciones: row.value.getValue(24),
                        alianzaId: row.value.getValue(25),
                        alianza: row.value.getValue(26),
                        credito_disponible: row.value.getValue(27) - row.value.getValue(28),
                        programado: row.value.getValue(29),
                        aviso: row.value.getValue(30),
                        ruta: row.value.getValue(31),
                        ultimo_servicio: row.value.getValue(32),
                        status: row.value.getValue(33)
                    }
                    arrayData.push(data);

                    return true;
                });
                return true;
            });

            responseData.success = true;
            responseData.data = arrayData
            return responseData;

        } catch (error) {
            log.audit('error', error);
            responseData.message = error;
            return responseData;
        }
    }

    return {
        post: _get
    }
});