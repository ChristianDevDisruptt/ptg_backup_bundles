/**
 *@NApiVersion 2.1
 *@NScriptType Restlet
 */
define(["N/record"], function(record) {
    
    const responseData = {
        isSuccessful: false,
        message: "Some errors occured",
        data: null
    }

    function _post(request) {
        log.audit('request', request);
        let receiptList = [];
        try {
            request.Item_receipt.forEach((receipt) => {
                let idTransaction = receipt.id;
                //se verifica que si haya el elemento id
                if(idTransaction){
                    let idItemReceipt = record.transform({
                        fromType: record.Type.TRANSFER_ORDER,
                        fromId: idTransaction,
                        toType: record.Type.ITEM_RECEIPT,
                        isDynamic: true,
                    });

                    let idSaveItemReceipt = idItemReceipt.save();
                    log.audit('transaccion guardada', idSaveItemReceipt);
                    receiptList.push(idSaveItemReceipt);
                    if(idSaveItemReceipt){
                        responseData.isSuccessful = true;
                        responseData.message = "Item receipt created successfully";
                        responseData.data = receiptList
                    }
                }
            });
        } catch (error) {
            log.audit('error', error);
        }

        return responseData;
    }

    return {
        post: _post
    }
}); 