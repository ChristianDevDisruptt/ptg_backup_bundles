/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 *@Author Jorge Macias
 *@description Obtener todos los articulos por la subsidiaria Potogas
 */
define(['N/search', 'N/log'], function (search, log) {

    const responseData = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null,
        apiErrorGet: ""
    }

    function getArticle(params) {
        try {
            var articleArray = [];
            var itemSearchObj = search.create({
                type: search.Type.ITEM,
                id: 'customsearch_ptg_busqueda_articulos',
                filters:
                    [
                        ["subsidiary", "anyof", "15"],
                        "AND",
                        ["internalid", "anyof", "1753", "1754", "1755", "1756", "1757"]
                    ],
                columns:
                    [
                        "displayname",
                        "baseprice",
                        search.createColumn({
                            name: "rate",
                            join: "CUSTITEM_PTG_TIPO_IMPUESTO"
                         })
                    ]
            });
            let articleSearchPagedData = itemSearchObj.runPaged({ pageSize: 1000 });

            articleSearchPagedData.pageRanges.forEach(pageRange => {
                // Carga la info
                let currentPage = articleSearchPagedData.fetch({ index: pageRange.index })
                // Itera sobre cada resultado, es como el "each",
                currentPage.data.forEach((result, indx, origingArray) => {
                    //convertir "result object" a objeto deseado

                    let id = result.id;
                    let name = result.getValue({ name: "displayname" });
                    let basePrice = parseInt(result.getValue({ name: "baseprice" }));
                    let tax = parseInt(result.getValue({ name: "rate", join: "CUSTITEM_PTG_TIPO_IMPUESTO"}))

                    const artcicleObj = {
                        id,
                        name,
                        Price: basePrice*(tax/100) + basePrice
                    }

                    articleArray.push(artcicleObj);
                    responseData.data = articleArray

                })
                if (articleArray) {
                    responseData.isSuccessful = true
                    responseData.message = 'Lista de Articulos de PotoGas';
                    responseData.apiErrorGet = null;
                }

                log.debug({
                    title: "responseData",
                    details: responseData
                })

            });

        } catch (err) {
            responseData.apiErrorGet = err.message
        }



        return JSON.stringify(responseData)

    }


    return {
        get: getArticle
    }
});
