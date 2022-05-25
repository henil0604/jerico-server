const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");
const FetchDocument = require("@Modules/FetchDocument");
const DocumentLog = require("@Modules/DocumentLog");
const hash = require("@Modules/hash");

module.exports = class API$GetAll extends RouteNode {

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

    async GetAll(req, res, next) {
        try {

            await DocumentLog(req.Document.id, {
                action: 'document.getAll',
                data: hash(JSON.stringify(req.Document.data)),
                at: Date.now(),
            })

            req.Response.setData({
                status: 'success',
                data: req.Document.data
            }).setStatusCode(200);

            throw req.Response;

        } catch (e) {
            if (e instanceof this.Response) {
                throw e;
            }

            req.Response.setData({
                status: 'error',
                error: "Failed to get value"
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

                await this.GetAll(req, res, next);

                req.Response.setData({
                    status: 'success',
                    data: {}
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
        return '/getAll';
    }

    get Base() {
        return '/api/document';
    }

    get Type() {
        return 'route';
    }

}