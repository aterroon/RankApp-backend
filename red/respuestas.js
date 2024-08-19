exports.success = function(req, res, msg, status) {
    const statusCode = status || 200;
    const msgOk = msg || '';
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: msgOk
    });
}


exports.error = function(req, res, msg, status) {
    const statusCode = status || 500;
    const msgError = msg || 'Error interno';
    res.status(status).send({
        error: false,
        status: statusCode,
        body: mensajeError
    });
}