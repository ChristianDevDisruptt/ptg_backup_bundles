/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(
    [
        './drt_wep_save_record_lib',
        'N/runtime',
        'N/search',
        'N/record',
        'N/https',
        'N/ui/serverWidget',
        'N/redirect'
    ],
    function (
        lib,
        runtime,
        search,
        record,
        https,
        ui,
        redirect
    ) {

        function afterSubmit(context) {
            try {
                if (context.type == context.UserEventType.CREATE || context.type == context.UserEventType.EDIT) {

                    var currentRecord = context.newRecord;
                    var itemType = currentRecord.type;
                    var itemId = currentRecord.id;

                    log.audit('itemType', itemType);

                    var response = {
                        body: {},
                        code: 0,
                    };

                    var responseHuella = {
                        body: {},
                        code: 0,
                    };

                    var idInstance = runtime.envType;
                    var itemInterface = 'product';
                    var footPrintInterface = 'footprint';
                    var urlItem = lib.changeUrl(itemInterface, idInstance);
                    log.audit('urlItem', urlItem);
                    var urlFottPrint = lib.changeUrl(footPrintInterface, idInstance);
                    log.audit('urlFottPrint', urlFottPrint);

                    var nombreHuella = currentRecord.getValue({
                        fieldId: 'custitem_disa_huella_name'
                    });

                    //creacion de variables y extraccion de valores
                    var objtProductIntraface = {};

                    var objFootPrintInterface = {};

                    var objMaterialListInterface = {};

                    var disaLote = currentRecord.getValue({
                        fieldId: 'custitem_disa_lote'
                    }) ? 1 : 0;

                    var disaSerie = currentRecord.getValue({
                        fieldId: 'custitem_disa_serie'
                    }) ? 1 : 0;

                    var disaKit = currentRecord.getValue({
                        fieldId: 'custitem_disa_kit'
                    }) ? 1 : 0;

                    var disaSendWep = currentRecord.getValue({
                        fieldId: 'custitem_disa_send_interface'
                    });

                    var disaRequiredExpiration = currentRecord.getValue({
                        fieldId: 'custitem_disa_required_expiration'
                    }) ? 1 : 0;

                    var disaImportNumber = currentRecord.getValue({
                        fieldId: 'custitem_disa_import_number'
                    }) ? 1 : 0;

                    var description = currentRecord.getValue({
                        fieldId: 'displayname'
                    }) || '';

                    var lookupSubFamily = search.lookupFields({
                        type: itemType,
                        id: itemId,
                        columns: ['custitem_disa_subfamilia']
                    });

                    log.audit('lookupSubFamily', lookupSubFamily.custitem_disa_subfamilia[0].text);
                    var familiName = lookupSubFamily.custitem_disa_subfamilia[0].text;

                    var shortD = description.substr(0, 50);

                    objtProductIntraface.shortDescription = shortD;

                    objtProductIntraface.sku = currentRecord.getValue({
                        fieldId: 'upccode'
                    }) || '';

                    objtProductIntraface.isKit = disaKit;

                    objtProductIntraface.isLot = disaLote;

                    objtProductIntraface.isSerial = disaSerie;

                    objtProductIntraface.largeDescription = currentRecord.getValue({
                        fieldId: 'displayname'
                    }) || '';

                    objtProductIntraface.requireInspection = 0;
                    objtProductIntraface.checkNumber = 1;

                    objtProductIntraface.sendInterface = 1;

                    var formulario = currentRecord.getValue({
                        fieldId: 'customform'
                    });
                    log.audit('formulario', formulario);

                    if (formulario == 112 || formulario == 113) {
                        objtProductIntraface.lotDaysInterval = "0";
                    } else if (formulario == 114) {
                        objtProductIntraface.lotDaysInterval = "30";
                    }

                    objtProductIntraface.account = {};

                    objtProductIntraface.account.name = currentRecord.getValue({
                        fieldId: 'custitem_disa_account_name'
                    }) || '';

                    objtProductIntraface.inventoryRotation = {};

                    objtProductIntraface.inventoryRotation.name = currentRecord.getValue({
                        fieldId: 'custitem_disa_inventory_rotation_name'
                    }) || '';

                    objtProductIntraface.warehouse = {};

                    objtProductIntraface.warehouse.code = currentRecord.getValue({
                        fieldId: 'custitem_disa_warehose_code'
                    }) || '';

                    objtProductIntraface.subfamily = {};

                    objtProductIntraface.subfamily.name = familiName;

                    objtProductIntraface.defaultLifeDays = currentRecord.getValue({
                        fieldId: 'custitem_disa_default_life_days'
                    });

                    objtProductIntraface.isRequiredExpiration = "0";

                    log.audit('objtProductIntraface', objtProductIntraface);

                    //arreglo footPrint-Interface

                    objFootPrintInterface.name = nombreHuella;

                    objFootPrintInterface.description = currentRecord.getValue({
                        fieldId: 'custitem_disa_descripcion_huella'
                    });

                    var footPrint = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_default'
                    }) ? 1 : 0;
                    objFootPrintInterface.isDefault = footPrint;

                    objFootPrintInterface.accessory = {};
                    objFootPrintInterface.accessory.name = currentRecord.getValue({
                        fieldId: 'custitem_disa_accesory_name'
                    });

                    objFootPrintInterface.product = {};
                    objFootPrintInterface.product.sku = currentRecord.getValue({
                        fieldId: 'upccode'
                    });

                    objFootPrintInterface.account = {};
                    objFootPrintInterface.account.name = currentRecord.getValue({
                        fieldId: 'custitem_disa_account_name'
                    });

                    objFootPrintInterface.warehouse = {};
                    objFootPrintInterface.warehouse.code = currentRecord.getValue({
                        fieldId: 'custitem_disa_warehose_code'
                    });

                    var footPrintLarge = currentRecord.getValue({
                        fieldId: 'custitem_disa_largo'
                    });

                    var footPrintWidth = currentRecord.getValue({
                        fieldId: 'custitem_disa_ancho'
                    });

                    var footPrintHeight = currentRecord.getValue({
                        fieldId: 'custitem_disa_alto'
                    });

                    var footPrintWeight = currentRecord.getValue({
                        fieldId: 'custitem_disa_peso'
                    });

                    var footPrintIsPickable = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_pickable'
                    }) ? true : false;

                    var footPrintIsLevelSerial = 0;

                    var footPrintIsBaseUnit = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_base_unit'
                    }) ? true : false;

                    var footPrintConversionFactor = currentRecord.getValue({
                        fieldId: 'custitem_disa_conversion_factor'
                    });

                    var footPrintIsPalletLevel = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_pallet_level'
                    }) ? true : false;

                    var footPrintIsCaseLevel = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_case_level'
                    }) ? true : false;

                    var footPrintPackageLevel = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_package_level'
                    }) ? true : false;

                    var footPrintIsEachLevel = currentRecord.getValue({
                        fieldId: 'custitem_disa_is_each_level'
                    }) ? true : false;

                    var footPrintUomCode = "PZ";

                    //search.lookupFields({
                    //type: itemType,
                    //id: itemId,
                    //columns: ['custitem_disa_uom_code']
                    //});

                    objFootPrintInterface.footprintDetails = [{
                        large: footPrintLarge,
                        width: footPrintWidth,
                        height: footPrintHeight,
                        weight: footPrintWeight,
                        isPickable: footPrintIsPickable,
                        isLevelSerial: footPrintIsLevelSerial,
                        isBaseUnit: true,
                        conversionFactor: 1,
                        isPalletLevel: footPrintIsPalletLevel,
                        isCaseLevel: footPrintIsCaseLevel,
                        isPackageLevel: footPrintPackageLevel,
                        isEachLevel: true,
                        uom: {
                            code: footPrintUomCode
                        }

                    }];

                    //arreglo material list interface

                    var BuildToOrder = currentRecord.getValue({
                        fieldId: 'custitem_disa_build_order'
                    });

                    var skuMaterialList = currentRecord.getValue({
                        fieldId: 'custitem_disa_sku_ml'
                    });

                    var wareHouseCode = currentRecord.getValue({
                        fieldId: 'custitem_disa_warehose_code'
                    });

                    var accountName = currentRecord.getValue({
                        fieldId: 'custitem_disa_account_name'
                    });

                    var skuAsociado = currentRecord.getValue({
                        fieldId: 'displayname'
                    });

                    objMaterialListInterface.sku = skuMaterialList;
                    objMaterialListInterface.warehouse = {};
                    objMaterialListInterface.warehouse.code = wareHouseCode;
                    objMaterialListInterface.account = {};
                    objMaterialListInterface.account.name = accountName;
                    objMaterialListInterface.components = {};
                    objMaterialListInterface.components.component = {};
                    objMaterialListInterface.components.component.sku = skuAsociado;
                    objMaterialListInterface.components.quantity = 10;
                    objMaterialListInterface.components.isBuildToOrder = BuildToOrder;
                    objMaterialListInterface.components.progression = {};
                    objMaterialListInterface.components.progression.name = 'Default'

                    var nombreInterface = '';

                    var createItem = currentRecord.getValue({
                        fieldId: 'custitem_drt_create_item_wms'
                    });

                    var updateWep = currentRecord.getValue({
                        fieldId: 'custitem_drt_disa_apdate_wep'
                    });

                    var updateFootPrintWep = currentRecord.getValue({
                        fieldId: 'custitem_disa_aupdate_footprint'
                    });

                    var createFootPrintWep = currentRecord.getValue({
                        fieldId: 'custitem_drt_disa_footprint_wep'
                    });

                    var createMaterialList = currentRecord.getValue({
                        fieldId: 'custitem_drt_creatre_ml_wms'
                    });

                    var loadRecord = record.create({
                        type: 'customrecord_drt_web_otutput_netsuite',
                        isDynamic: true
                    });

                    var metodoEnvio = '';
                    var metodoEnvioHuella = '';
                    var respuestaHuella = ''

                    var headerObj = {
                        'Content-Type': 'application/json',
                    };

                    //inicia interfas de material-list-intefrface (definicion de kits)

                    //termina interfas de material-list


                    log.audit('product Interface', objtProductIntraface);
                    var respuestaProduct = '';

                    if (disaSendWep) {
                        if (updateWep) {
                            metodoEnvio = 'put'
                        } else {
                            metodoEnvio = 'post'
                        }

                        if (updateFootPrintWep) {
                            metodoEnvioHuella = 'put'
                        } else {
                            metodoEnvioHuella = 'post'
                        }

                        try {
                            response = https[metodoEnvio]({
                                url: urlItem,
                                body: JSON.stringify(objtProductIntraface),
                                headers: headerObj
                            });

                            log.audit('response product', response);
                            log.audit('response code product', response.code);
                            log.audit('response body product', response.body);


                        } catch (error) {
                            log.audit('error response product-interface', error);
                        }

                        var salidaProduct = '';

                        //se envia la interfas de footprint-interface


                        if (response.code == 200 && nombreHuella) {
                            log.audit('cracion', 'ok');
                            objtProductIntraface = objFootPrintInterface;
                            log.audit('footprint-interface', objtProductIntraface);
                            try {
                                responseHuella = https[metodoEnvioHuella]({
                                    url: urlFottPrint,
                                    body: JSON.stringify(objtProductIntraface),
                                    headers: headerObj
                                });
                                log.audit('response footprint', responseHuella);
                                log.audit('response code footprint', responseHuella.code);
                                log.audit('response body footprint', responseHuella.body);
                            } catch (error) {
                                log.audit('error response footprint-interface', error);
                            }
                        }
                    }

                    if(response.code == 200){
                        respuestaProduct = response.body;
                    } 
                    
                    if (response.code == 500) {
                        var salida= JSON.parse(response.body);
                        log.audit('salida', salida);
                        respuestaProduct = salida.message;
                    }
                    
                    if(responseHuella.code == 200){
                        respuestaHuella = responseHuella.body
                    } else if(responseHuella.code == 500){
                        var respuestaHuellas= JSON.parse(responseHuella.body);
                        log.audit('respuestaHuella', respuestaHuella);
                        respuestaHuella = respuestaHuellas.message;
                    }
                    

                    record.submitFields({
                        type: itemType,
                        id: itemId,
                        values: {
                            custitem_drt_response_wms: response.code,
                            custitem_disa_drt_esponse_product: respuestaProduct,
                            custitem_drt_response_foot: responseHuella.code,
                            custitem_disa_drt_response_footprint: respuestaHuella
                        },
                        options: {
                            enableSourcing: false,
                            ignoreMandatoryFields: true
                        }
                    });


                    var salida = 0;

                    log.audit('respose p', response.code);
                    log.audit('respose f', responseHuella.code);
                    if (response.code == 200) {
                        salida = 1;
                    }
                    if (responseHuella.code == 500) {
                        salida = 2
                    } 

                    if(response.code == 500){
                        salida = 3;
                    }

                    if(responseHuella.code == 200){
                        salida = 4
                    }

                    var objUpate = {
                        custitem_drt_disa_apdate_wep: false,
                        custitem_disa_aupdate_footprint: false
                    };

                    if (response.code == 200) {

                        record.submitFields({
                            type: itemType,
                            id: itemId,
                            values: {
                                custitem_drt_disa_apdate_wep: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });
                    } else if (responseHuella == 200) {
                        record.submitFields({
                            type: itemType,
                            id: itemId,
                            values: {
                                custitem_disa_aupdate_footprint: true
                            },
                            options: {
                                enableSourcing: false,
                                ignoreMandatoryFields: true
                            }
                        });

                    }

                    redirect.toRecord({
                        type: currentRecord.type,
                        id: currentRecord.id,
                        parameters: {
                            'wms': salida
                        }
                    });

                }
            } catch (error) {
                log.audit('error aafterSubmit', error);
            }
        }

        return {
            afterSubmit: afterSubmit
        }
    });