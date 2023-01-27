/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record", "N/search"], function (record, search) {

    function _get(request) {

        let arrayItems = [];
        let objItem = {};

        let loadOportunidad = record.load({
            type: record.Type.OPPORTUNITY,
            id: request.id_oportunidad,
            isDynamic: true,
        });

        let lineas = loadOportunidad.getLineCount({
            sublistId: 'item'
        });

        for (var i = 0; i < lineas; i++) {
            let articuloLinea = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'item',
                line: i
            });

            let descriptionItem = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'description',
                line: i
            });


            let quantity = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'quantity',
                line: i
            });

            let rate = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'rate',
                line: i
            });

            let unitM = loadOportunidad.getSublistValue({
                sublistId: 'item',
                fieldId: 'units_display',
                line: i
            });

            let lookupItem = search.lookupFields({
                type: search.Type.ITEM,
                id: articuloLinea,
                columns: ['custitem_ptg_capacidadcilindro_']
            });

            objItem = {
                id_articulo: articuloLinea,
                descripcion_articulo: descriptionItem,
                cantidad: quantity,
                unidad_medida:  unitM,
                importe: rate,
                capacidad: lookupItem.custitem_ptg_capacidadcilindro_
            };
        }
        arrayItems.push(objItem);

        return JSON.stringify(arrayItems);

    }

    return {
        post: _get
    }
});