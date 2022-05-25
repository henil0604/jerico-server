const RouteNode = require("@Modules/RouteNode");
const JOI = require("joi");
const Document = require("@Models/Document");


module.exports = class API$Create extends RouteNode {

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

    async Create(req, res, next) {

        let data = {
            name: req.data.name,
            description: req.data.description,
            createdBy: req.ClientIp
        }

        data.id = random(25);

        const document = await Document.create(data);

        req.Document = document;
    }

    get Handler() {
        return async (req, res, next) => {
            req.Response = new this.Response();

            await this.ValidateData(req, res, next)

            await this.Create(req, res, next);

            req.Response.setData({
                status: 'success',
                data: req.Document
            }).setStatusCode(201)

            throw req.Response;
        }
    }

    get ValidationSchema() {
        const Schema = JOI.object({
            name: JOI.string().required(),
            description: JOI.string().default(null)
        })

        return Schema;
    }

    get Path() {
        return '/create';
    }

    get Base() {
        return '/api';
    }

    get Type() {
        return 'route';
    }

}