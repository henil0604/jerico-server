const RouteNode = require("@Modules/RouteNode");

module.exports = class PostRequest$Middleware extends RouteNode {

    constructor() {
        super();

    }

    get Handler() {
        return (req, res, next) => {
            if (res.writable === false) {
                return;
            }

            if (req.Response !== undefined) {
                throw req.Response;
            }

            req.Response = new req.RouteNode.Response();

            req.Response
                .setData({
                    status: 404,
                    message: "Not Found"
                })
                .setStatusCode(404);

            throw req.Response;
        }
    }

    get Path() {
        return null;
    }

    get Base() {
        return null;
    }

    get Type() {
        return 'middleware';
    }


}
