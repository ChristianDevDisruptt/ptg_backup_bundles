/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

define(["N/search", "SuiteScripts/SCRIPTS POTOGAS/ptg_module_errors"], function(search, ptgErrors) {
    // Estructura generica del response
    let response = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null,
        apiErrorGet: []
    };

    function doGet(context) {
        log.debug({
            title: "[GET] Request",
            details: context
        });

        let salesRepId = parseInt(context.salesrep, 10);

        // Si no se entrega un id de representante de ventas no se puede realizar la
        // busqueda, por lo que se realiza la comprobacion inicial
        if (!salesRepId) {
            log.debug({
                title: "No se otorgo el ID de un representante de ventas.",
                details: "Sales Rep: " + salesRepId
            });

            response.apiErrorGet.push(ptgErrors.errorRequestEmpty());
            return JSON.stringify(response);
        }

        // Primera busqueda
        // Se carga la busqueda guardada con todos los items que se encuentren en ordenes de venta
        try {
            let itemsSearch = search.load({id: 'customsearch_ptg_ventas_empleado'});

            // Se crea un filtro para solo recibir las ordenes del representante de ventas en cuestion
            let salesRepFilter = search.createFilter({
                name: "salesrep",
                operator: search.Operator.IS,
                values: salesRepId
            });
            itemsSearch.filters.push(salesRepFilter);

            var itemsResult = itemsSearch.run();
        } catch(e) {
            log.debug({
                title: 'Configuracion de busqueda invalida.',
                details: e
            });

            response.apiErrorGet.push(ptgErrors.errorSearch());
            return JSON.stringify(response);
        }

        // Se obtiene el nombre del representante de ventas
        let salesRepSearch = search.lookupFields({
            type: search.Type.EMPLOYEE,
            id: salesRepId,
            columns: ['entityid']
        });
        let salesRepName = salesRepSearch.entityid;

        // Objeto con la informacion del representante de ventas
        // El id se obtiene del request
        let salesRep = {
            name: salesRepName,
            id: salesRepId
        }
        
        let listTotal = 0;

        // itemsArray guardara todos los resultados obtenidos en la busqueda de articulos
        let itemsArray = [];
        itemsResult.each(function(items) {
            let item = {
                name: items.getText({
                    name: 'item',
                    summary: 'GROUP'
                }),
                id: items.getValue({
                    name: 'item',
                    summary: 'GROUP'
                })
            };
            let quantity = items.getValue({
                name: 'quantity',
                summary: 'SUM'
            });
            let grossAmount = items.getValue({
                name: 'grossamount',
                summary: 'SUM'
            });
            let taxAmount = items.getValue({
                name: 'taxamount',
                summary: 'SUM'
            });

            let parsedTotal = parseFloat(grossAmount) + parseFloat(taxAmount);
            listTotal = listTotal + parsedTotal;
            let total = parsedTotal.toFixed(2);

            const itemObj = {
                item,
                quantity,
                total
            };

            itemsArray.push(itemObj);

            return true;
        });

        // Segunda busqueda
        // Los valores totales de venta en efectivo, vales y tarjeta
        try {
            let methodSearch = search.load({id: 'customsearch_ptg_venta_metodo_empleado'});

            // Se crea un filtro para solo recibir las ordenes del representante de ventas en cuestion
            let salesRepFilter = search.createFilter({
                name: "salesrep",
                operator: search.Operator.IS,
                values: salesRepId
            });
            methodSearch.filters.push(salesRepFilter);
           
            var methodsResult = methodSearch.run();
        } catch (e) {
            log.debug({
                title: 'Configuracion de busqueda invalida.',
                details: e
            });

            response.apiErrorGet.push(ptgErrors.errorSearch());
            return JSON.stringify(response);
        }

        // Se definen las variables de los metodos de pago que se pasan al response
        let efectivo = 0;
        let bono = 0;
        let vale = 0;

        methodsResult.each(function(method) {
            let paymentMethod = method.getValue({
                name: 'custbody_ptg_opcion_pago',
                summary: 'GROUP'
            });
            let option = parseInt(paymentMethod, 10);

            let grossAmount = method.getValue({
                name: 'grossamount',
                summary: 'SUM'
            });
            let taxAmount = method.getValue({
                name: 'taxamount',
                summary: 'SUM'
            });

            let parsedTotal = parseFloat(grossAmount) + parseFloat(taxAmount);
            let total = parsedTotal.toFixed(2);

            switch (option) {
                case 1:
                    efectivo = total;
                    break;
                case 2:
                    bono = total;
                    break;
                case 3:
                    vale = total;
                    break;
                default:
                    break;
            }

            return true;
        })

        // Objeto con la informacion final, que sera enviado al response
        const responseObj = {
            salesRep: salesRep,
            efectivo: efectivo,
            bono: bono,
            vale: vale,
            total: listTotal.toFixed(2),
            items: itemsArray
        }
        response.data = responseObj;

        // Si no existen errores, se regresa una respuesta satisfactoria
        if (response.apiErrorGet.length == 0) {
            response.isSuccessful = true;
            response.message = "Lista de items vendido por " + salesRep.name + "."
            response.apiErrorGet = null;
        }

        log.debug({
            title: "[GET] Response",
            details: response
        });

        return JSON.stringify(response);
    }

    return {
        get: doGet
    }
});