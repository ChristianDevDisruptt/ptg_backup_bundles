/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(["N/search"], function (search) {

    function _get(context) {
        var start = 0;
        var end = 10;
        var arrayFormaDePago = [];
        var objFormaDePago = {};

        var customrecord_ptg_forma_pagoSearchObj = search.create({
            type: "customrecord_ptg_forma_pago",
            filters:
            [
            ],
            columns:
            [
               search.createColumn({name: "custrecord_ptg_id_forma_pago", label: "PTG - Id Forma de Pago"}),
               search.createColumn({name: "custrecord_ptg_nombre_m_pago", label: "PTG - Nombre Metodo de Pago"})
            ]
         });

        var searchResultCount = customrecord_ptg_forma_pagoSearchObj.run();
        var results = searchResultCount.getRange(start, end);
        for (var i = 0; i < results.length; i++) {
            var columnas = results[i].columns;
            var NombrePago = results[i].getValue(columnas[0]);
            var idPago = results[i].getValue(columnas[1]);
            objFormaDePago = {
                id_forma_pago: idPago,
                nombre_forma_pago: NombrePago
            }
            log.audit('objFormaDePago', objFormaDePago)
            arrayFormaDePago.push(objFormaDePago);
        }

        return JSON.stringify(arrayFormaDePago);
    }

    return {
        get: _get
    }
});