const Document = require("@Models/Document");
const Response = require("@Modules/Response");

module.exports = (required = false) => {

    return async (req, res, next) => {
        const error = () => {
            if (required === true) {
                req.Response = new Response();
                req.Response.setStatusCode(400);
                req.Response.setData({
                    status: 'error',
                    error: 'Document Not Found'
                });
                throw req.Response;
            }
        }

        if (!req.body.documentId) {
            req.Document = null;

            error();
            return next();
        }

        req.Document = await Document.get({
            id: req.body.documentId
        });

        if (req.Document === null) {
            error();
        }

        return next();
    }
}