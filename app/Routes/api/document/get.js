const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");
const FetchDocument = require("@Modules/FetchDocument");
const DocumentLog = require("@Modules/DocumentLog");


module.exports = class API$Get extends RouteNode {

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

    async Get(req, res, next) {
        try {

            const value = req.Document.data[req.data.key] || null;

            await DocumentLog(req.Document.id, {
                action: 'document.get',
                data: {
                    key: req.data.key,
                    value
                },
                at: Date.now(),
            })

            req.Response.setData({
                status: 'success',
                data: {
                    key: req.data.key,
                    value
                }
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

                await this.Get(req, res, next);

                req.Response.setData({
                    status: 'success',
                    data: {
                        key: req.data.key,
                        value: null
                    }
                }).setStatusCode(200)

                throw req.Response;
            }
        ];
    }

    get ValidationSchema() {
        const Schema = JOI.object({
            documentId: JOI.string().required(),
            key: JOI.string().required(),
        })

        return Schema;
    }

    get Path() {
        return '/get';
    }

    get Base() {
        return '/api/document';
    }

    get Type() {
        return 'route';
    }

}