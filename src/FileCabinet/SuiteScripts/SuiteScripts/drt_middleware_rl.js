/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
define([], function () {

    function _get(context) {
        try {
            var respuesta = {
                succes: true,
                data: 'get'
            };
            log.audit({
                title: ' get ',
                details: JSON.stringify(context)
            });
        } catch (error) {
            log.error({
                title: 'error get',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta get',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function _post(context) {
        try {
            var respuesta = {
                succes: true,
                data: 'post'
            };
            log.audit({
                title: ' post ',
                details: JSON.stringify(context)
            });
        } catch (error) {
            log.error({
                title: 'error post',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta post',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function _put(context) {
        try {
            var respuesta = {
                succes: true,
                data: 'put'
            };
            log.audit({
                title: ' put ',
                details: JSON.stringify(context)
            });
        } catch (error) {
            log.error({
                title: 'error put',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta put',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    function _delete(context) {
        try {
            var respuesta = {
                succes: true,
                data: 'delete'
            };
            log.audit({
                title: ' delete ',
                details: JSON.stringify(context)
            });
        } catch (error) {
            log.error({
                title: 'error delete',
                details: JSON.stringify(error)
            });
        } finally {
            log.audit({
                title: 'respuesta delete',
                details: JSON.stringify(respuesta)
            });
            return respuesta;
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete
    }
});