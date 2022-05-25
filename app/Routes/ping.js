const RouteNode = require("@Modules/RouteNode");


module.exports = class Ping extends RouteNode {

    constructor() {
        super();

    }

    get Handler() {
        return (req, res, next) => {
            req.Response = new this.Response();

            req.Response.setData({
                status: 200,
                message: "Pong"
            })

            req.Response.setStatusCode(200);

            throw req.Response;

        }
    }

    get Path() {
        return '/ping';
    }

    get Base() {
        return '/';
    }

    get Type() {
        return 'route';
    }

}