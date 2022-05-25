const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");
const FetchDocument = require("@Modules/FetchDocument");
const DocumentLog = require("@Modules/DocumentLog");


module.exports = class API$Remove extends RouteNode {

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

    async Remove(req, res, next) {
        try {

            let data = req.Document.data;
            let key = req.data.key;
            let value = data[key] || null;

            delete data[req.data.key];

            await DocumentLog(req.Document.id, {
                action: 'document.remove',
                data: {
                    key: req.data.key,
                    value: value
                },
                at: Date.now(),
            })

            await Document.update({
                id: req.Document.id
            }, {
                $set: {
                    data: data
                },
                updatedAt: Date.now()
            }, false)

            req.Document = await Document.get({ id: req.Document.id })

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
                error: "Failed to remove value"
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

                await this.Remove(req, res, next);

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
            key: JOI.string().required()
        })

        return Schema;
    }

    get Path() {
        return '/remove';
    }

    get Base() {
        return '/api/document';
    }

    get Type() {
        return 'route';
    }

}