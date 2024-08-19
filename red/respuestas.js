exports.success = function(req, res, msg = '', status = 200) {
    const statusCode = status || 200;
    const mensajeOk = msg || '';
    res.status(statusCode).send({
        error: false,
        status: status,
        body: msg
    });
}


exports.error = function(req, res, msg = 'Error interno', status = 500) {
    res.status(status).send({
        error: false,
        status: status,
        body: msg
    });
}