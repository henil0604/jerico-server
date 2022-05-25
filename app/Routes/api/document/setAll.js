const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");
const FetchDocument = require("@Modules/FetchDocument");
const FilterString = require("@Modules/FilterString");
const DocumentLog = require("@Modules/DocumentLog");


module.exports = class API$SetAll extends RouteNode {

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

    async SetAll(req, res, next) {
        try {

            const documentId = req.Document.id;
            const prevData = req.Document.data;

            await Document.update({
                id: documentId
            }, {
                data: req.data.data || prevData,
                updatedAt: Date.now()
            })

            await DocumentLog(documentId, {
                action: 'document.setAll',
                data: {
                    data: req.data.data,
                    prevData
                },
                at: Date.now(),
            })

            const newDocument = await Document.get({
                id: documentId
            });

            req.Document = newDocument;
        } catch (e) {
            req.Response.setData({
                status: 'error',
                error: "Failed to set value"
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

                await this.SetAll(req, res, next);

                req.Response.setData({
                    status: 'success',
                    data: req.Document.data
                })

                throw req.Response;
            }
        ];
    }

    get ValidationSchema() {
        const Schema = JOI.object({
            documentId: JOI.string().required(),
            data: JOI.object().required()
        })

        return Schema;
    }

    get Path() {
        return '/setAll';
    }

    get Base() {
        return '/api/document';
    }

    get Type() {
        return 'route';
    }

}