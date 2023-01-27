function customizeGlImpact(transactionRecord, standardLines, customLines, book) {
    try {
        var id = transactionRecord.getFieldValue('id');
        var type = transactionRecord.getFieldValue('type');
        var subsidiary = transactionRecord.getFieldValue('subsidiary') || '';
        nlapiLogExecution('AUDIT', 'id', id);
        nlapiLogExecution('AUDIT', 'type', type);
        var tipo_nc = transactionRecord.getFieldValue('custbody_disa_tipo_nc') || '';
        if (book.isPrimary()) {
            var typeRecord = {
                vendorprepaymentapplication: "vendorprepaymentapplication",
                vendbill: 'vendorbill',
                vendpymt: 'vendorpayment',
                vendcred: 'vendorcredit',
                cashsale: 'cashsale',
                custinvc: 'invoice',
                custpymt: 'customerpayment',
                custcred: 'creditmemo',
                custrfnd: 'customerrefund',
                check: 'check'
            };
            var listTypeRecord = {
                vendorprepaymentapplication: 80,
                vendbill: 17,
                vendpymt: 18,
                vendcred: 20,
                cashsale: 5,
                custinvc: 7,
                custpymt: 9,
                custcred: 10,
                custrfnd: 30,
                check: 3
            };

            var objAccaunt = {
                success: false
            };
            var arrayAccount = [];
            var creditAccaunt = '';
            var debititAccaunt = '';
            var accountChange = ''
            if (tipo_nc) {
                var fields = ['custrecord_disa_tipo_nc_account']
                var columns = nlapiLookupField('customlist_disa_tipo_nc', tipo_nc, fields);
                accountChange = columns.custrecord_disa_tipo_nc_account || '';
            }

            nlapiLogExecution('AUDIT', 'accountChange', JSON.stringify(accountChange));

            var configuration = getConfiguracion(subsidiary, listTypeRecord[type.toLowerCase()]);
            if (configuration.success) {
                switch (type) {
                    case 'custcred':
                        objAccaunt = getStandardLines(standardLines, configuration.account);
                        break;
                    default:
                        break;
                }
            }

            if (objAccaunt.success) {

                for (var a in objAccaunt.data) {
                    for (var c in configuration.data) {
                        if (c == a) {
                            if (
                                objAccaunt.data[a].debitamount &&
                                configuration.data[c].debit
                            ) {
                                if (
                                    accountChange &&
                                    configuration.data[c].debit
                                ) {
                                    nlapiLogExecution('AUDIT', 'accountChange ' + accountChange, 'configuration.data[c].debit ' + configuration.data[c].debit);
                                    configuration.data[c].debit = accountChange;
                                    nlapiLogExecution('AUDIT', 'accountChange ' + accountChange, 'configuration.data[c].debit ' + configuration.data[c].debit);
                                }
                                lineGL(customLines, objAccaunt.data[a].debitamount, configuration.data[c].debit, a, ('Impacto de cuenta: ' + configuration.data[c].debit));

                            }
                            if (
                                objAccaunt.data[a].creditamount &&
                                configuration.data[c].credit
                            ) {
                                if (
                                    accountChange &&
                                    configuration.data[c].credit
                                ) {
                                    nlapiLogExecution('AUDIT', 'accountChange ' + accountChange, 'configuration.data[c].credit ' + configuration.data[c].credit);
                                    configuration.data[c].credit = accountChange;
                                    nlapiLogExecution('AUDIT', 'accountChange ' + accountChange, 'configuration.data[c].credit ' + configuration.data[c].credit);
                                }

                                lineGL(customLines, objAccaunt.data[a].creditamount, a, configuration.data[c].credit, ('Impacto de cuenta: ' + creditAccaunt));
                            }
                        }
                    }
                }
            }

        }
    } catch (error) {
        nlapiLogExecution('ERROR', 'Error customizeGlImpact', JSON.stringify(error));
    }
}

function lineGL(customLines, param_amount, param_account_debit, param_account_credit, param_memo) {
    try {
        // nlapiLogExecution('AUDIT', 'lineGL',
        //     // ' customLines: '+customLines+
        //     ' param_amount: ' + param_amount +
        //     ' param_account_debit: ' + param_account_debit +
        //     ' param_account_credit: ' + param_account_credit +
        //     ' param_memo: ' + param_memo
        // );
        var monto = 0;
        if (
            customLines &&
            param_amount
        ) {

            param_amount = parseFloat(param_amount);
            if (param_amount > 0) {
                monto = param_amount;
            } else {
                monto = param_amount * -1;
            }
            if (monto) {
                nlapiLogExecution('AUDIT', 'Impacto',
                    ' debit param_account_debit: ' + param_account_debit +
                    ' debit monto: ' + monto +
                    ' debit param_memo: ' + param_memo +
                    ' credit param_account_credit: ' + param_account_credit +
                    ' credit monto: ' + monto +
                    ' credit param_memo: ' + param_memo
                );
                if (param_account_debit) {
                    param_account_debit = parseInt(param_account_debit);
                    var newLineDebit = customLines.addNewLine();
                    newLineDebit.setAccountId(param_account_debit);
                    newLineDebit.setDebitAmount(monto);
                    newLineDebit.setMemo(param_memo);
                }

                if (param_account_credit) {
                    param_account_credit = parseInt(param_account_credit);
                    var newLineCredit = customLines.addNewLine();
                    newLineCredit.setAccountId(param_account_credit);
                    newLineCredit.setCreditAmount(monto);
                    newLineCredit.setMemo(param_memo);
                }
            }
        }
    } catch (error) {
        nlapiLogExecution('ERROR', 'error', JSON.stringify(error));
    }
}

function getStandardLines(standardLines, param_array_account) {
    try {
        var respuesta = {
            success: false,
            data: {},
            total_debit: 0,
            total_credit: 0
        };
        nlapiLogExecution('AUDIT', 'standardLines', JSON.stringify(param_array_account));
        if (standardLines) {
            var add = true;
            for (var i = 0; i < standardLines.getCount(); i++) {
                add = true;
                var currLine = standardLines.getLine(i);
                if (currLine.isPosting()) {
                    if (param_array_account && param_array_account.length > 0) {
                        add = param_array_account.indexOf(currLine.getAccountId()) >= 0;
                    }

                    if (add) {
                        if (!respuesta.data[currLine.getAccountId()]) {
                            respuesta.data[currLine.getAccountId()] = {
                                debitamount: 0,
                                creditamount: 0,
                            };
                        }

                        respuesta.data[currLine.getAccountId()].debitamount += parseFloat(currLine.getDebitAmount() || '0');
                        respuesta.data[currLine.getAccountId()].creditamount += parseFloat(currLine.getCreditAmount() || '0');

                        respuesta.total_debit += parseFloat(currLine.getDebitAmount() || '0');
                        respuesta.total_credit += parseFloat(currLine.getCreditAmount() || '0');
                    }
                }
            }
        }

        respuesta.success = Object.keys(respuesta.data).length > 0;
    } catch (error) {
        nlapiLogExecution('ERROR', 'error getStandardLines', JSON.stringify(error));
    } finally {
        nlapiLogExecution('AUDIT', 'respuesta getStandardLines', JSON.stringify(respuesta));
        return respuesta;
    }
}

function getConfiguracion(param_subsidiary, param_recordtype) {
    try {
        var objReturn = {
            success: false,
            data: {},
            account: []
        };
        nlapiLogExecution('AUDIT', 'getConfiguracion', 'param_subsidiary: ' + param_subsidiary + ' param_recordtype: ', param_recordtype);
        var filters = [
            ['isinactive', 'is', 'F']
        ];
        if (param_subsidiary) {
            filters.push('AND');
            filters.push(['custrecord_drt_rc_subsidiaria', 'anyof', param_subsidiary]);
        }
        if (param_recordtype) {
            filters.push('AND');
            filters.push(['custrecord_drt_rc_c_reclasificacion.custrecord_drt_rc_c_transacion', 'is', param_recordtype]);
        }

        var columns = [
            new nlobjSearchColumn('custrecord_drt_rc_c_cuenta', 'custrecord_drt_rc_c_reclasificacion'),
            new nlobjSearchColumn('custrecord_drt_rc_c_debito', 'custrecord_drt_rc_c_reclasificacion'),
            new nlobjSearchColumn('custrecord_drt_rc_c_credito', 'custrecord_drt_rc_c_reclasificacion'),
        ];

        var searchSetup = nlapiSearchRecord('customrecord_drt_rc_reclasificacion', null, filters, columns) || [];
        // nlapiLogExecution('AUDIT','searchSetup',JSON.stringify(searchSetup));
        objReturn.data = searchSetup.reduce(function (curr, next) {
            var cuenta = next.getValue('custrecord_drt_rc_c_cuenta', 'custrecord_drt_rc_c_reclasificacion') || '';
            var debit = parseFloat(next.getValue('custrecord_drt_rc_c_debito', 'custrecord_drt_rc_c_reclasificacion')) || '';
            var credit = parseFloat(next.getValue('custrecord_drt_rc_c_credito', 'custrecord_drt_rc_c_reclasificacion')) || '';
            if (cuenta) {
                cuenta *= 1;
                if (!curr[cuenta]) {
                    curr[cuenta] = {
                        debit: debit,
                        credit: credit
                    };
                    objReturn.account.push(cuenta);
                }
            }
            return curr;
        }, {});
        objReturn.success = Object.keys(objReturn.data).length > 0;
    } catch (error) {
        nlapiLogExecution('ERROR', 'error getConfiguracion', JSON.stringify(error));
    } finally {
        nlapiLogExecution('AUDIT', 'objReturn getConfiguracion', JSON.stringify(objReturn));
        return objReturn;
    }
}