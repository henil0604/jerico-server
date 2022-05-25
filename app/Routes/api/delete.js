const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");
const FetchDocument = require("@Modules/FetchDocument");
const DocumentLog = require("@Modules/DocumentLog");
const hash = require("@Modules/hash");

module.exports = class API$Delete extends RouteNode {

    constructor() {
        super();

    }

    async ValidateData(req, res, next) {

        const data = await this.ValidationSchema.validate(req.body);

        if (data.error) {
            req.Response.setStatusCode(400);
            req.Response.setData({
                status: 'error',
                error: data.error.details[0].message
            });
            throw req.Response;
        }

        req.data = data.value;
        return;
    }

    async Delete(req, res, next) {
        try {

            await Document.delete({
                id: req.Document.id
            });

        } catch (e) {
            req.Response.setData({
                status: 'error',
                error: "Failed to remove all value"
            }).setStatusCode(500);
            throw req.Response;
        }
    }

    get Handler() {
        return [
            FetchDocument(true),
            async (req, res, next) => {
                req.Response = new this.Response();

                await this.ValidateData(req, res, next)

                await this.Delete(req, res, next);

                req.Response.setData({
                    status: 'success',
                    data: {
                        documentId: req.Document.id
                    }
                }).setStatusCode(200)

                throw req.Response;
            }
        ];
    }

    get ValidationSchema() {
        const Schema = JOI.object({
            documentId: JOI.string().required(),
        })

        return Schema;
    }

    get Path() {
        return '/delete';
    }

    get Base() {
        return '/api';
    }

    get Type() {
        return 'route';
    }

}