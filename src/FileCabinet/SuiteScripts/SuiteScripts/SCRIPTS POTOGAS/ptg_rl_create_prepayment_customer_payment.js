/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/record', 'N/search'],
    /**
   * @param{record} record
   * @param{search} search
   */
    (record, search) => {
        /**
         * Defines the function that is executed when a GET request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const get = (requestParams) => {

        }

        /**
         * Defines the function that is executed when a PUT request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body are passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const put = (requestBody) => {

        }

        /**
         * Defines the function that is executed when a POST request is sent to a RESTlet.
         * @param {string | Object} requestBody - The HTTP request body; request body is passed as a string when request
         *     Content-Type is 'text/plain' or parsed into an Object when request Content-Type is 'application/json' (in which case
         *     the body must be a valid JSON)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const post = (requestBody) => {
            let response = {
                success: false
            };
            log.debug('requestBody', requestBody)

            try {

                if (requestBody.customerPayments.length > 0) {
                    let idsCustomerPrepayment = [];

                    for (let key in requestBody.customerPayments) {
                        let dataCustomer = requestBody.customerPayments[key];

                        let payment = record.create({
                            type: record.Type.CUSTOMER_PAYMENT,
                            isDynamic: true,
                        });

                        payment.setValue({
                            fieldId: 'customer',
                            value: dataCustomer.customer
                        });

                        payment.setValue({
                            fieldId: 'custbody_ptg_cliente_prepago',
                            value: dataCustomer.customer
                        });

                        payment.setValue({
                            fieldId: 'custbody_ptg_tarjeta_credito',
                            value: dataCustomer.isCredit
                        });

                        payment.setValue({
                            fieldId: 'custbody_ptg_tarjeta_debito',
                            value: dataCustomer.isDebit
                        });

                        payment.setValue({
                            fieldId: 'memo',
                            value: dataCustomer.numRef
                        });

                        payment.setValue({
                            fieldId: 'location',
                            value: dataCustomer.planta
                        });

                        payment.setValue({
                            fieldId: 'account',
                            value: dataCustomer.account
                        });

                        payment.setValue({
                            fieldId: 'custbody_ptg_prepago',
                            value: true
                        });

                        payment.setValue({
                            fieldId: 'payment',
                            value: dataCustomer.amount
                        });

                        let id = payment.save();

                        if (!!id) {
                            idsCustomerPrepayment.push(id);
                        }

                    }

                    response.success = true;
                    response.ids = (idsCustomerPrepayment.length > 0) ? idsCustomerPrepayment : [];
                }

            } catch (error) {
                log.debug('error', error);
                response.message = error;
            }

            return response;

        }

        /**
         * Defines the function that is executed when a DELETE request is sent to a RESTlet.
         * @param {Object} requestParams - Parameters from HTTP request URL; parameters are passed as an Object (for all supported
         *     content types)
         * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
         *     Object when request Content-Type is 'application/json' or 'application/xml'
         * @since 2015.2
         */
        const doDelete = (requestParams) => {

        }

        return { get, put, post, delete: doDelete }

    });