const RouteNode = require("@Modules/RouteNode");


module.exports = class Root extends RouteNode {

    constructor() {
        super();

    }

    get Handler() {
        return (req, res, next) => {
            req.Response = new this.Response();

            req.Response.setData({
                status: 200,
                message: "Hello World!"
            })

            req.Response.setStatusCode(200);

            throw req.Response;

        }
    }

    get Path() {
        return '/';
    }

    get Base() {
        return '/';
    }

    get Type() {
        return 'route';
    }

}