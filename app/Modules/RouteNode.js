const urlJoin = require("proper-url-join").default;
const JOI = require("joi");
const Express = require("express");
const Response = require("@Modules/Response");

const ValidateConfig = (Config = {}) => {
    const ConfigSchema = JOI.object({
        autoCreate: JOI.boolean().default(true),
    })

    const Data = ConfigSchema.validate(Config);

    if (Data.error) {
        throw new Error(Data.error.message);
    }

    return Data.value;
}


class RouteNode {

    constructor(Config) {

        this.Response = Response;
        this.Config = ValidateConfig(Config);

        if (this.Config.autoCreate) {
            this.create();
        }
    }

    create() {
        log(`Creating {${this.FullPath || "*"}} [{${this.Type}}]`, "log", "[RouteNode]");

        if (this.Type === "route") {
            const Route = App.route(this.FullPath);

            let Methods = this.Method;

            if (typeof Methods === "string") {
                Methods = [Methods];
            }

            Methods.forEach(method => {
                method = method.toLowerCase();

                let MethodFunction = Route[method]

                MethodFunction.call(Route, ...this._Handler)
            });

        }

        if (this.Type === "static") {
            App.use(this.FullPath, Express.static(this.StaticPath));
        }

        if (this.Type === "middleware") {
            if (this.FullPath === null) {
                App.use.call(App, ...this._Handler);
            } else {
                App.use.call(App, this.FullPath, ...this._Handler);
            }
        }

    }


    get _Handler() {
        // Getting Handler
        const Handler = this.Handler;
        // Initialize _HANDLERS
        let _HANDLERS = [];

        // is Handler Array
        const isHandlerArray = Array.isArray(Handler);

        // Enhancer
        const EnhanceHandler = (Handler) => {
            return async (req, res, next) => {

                req.RouteNode = this;

                try {
                    await Handler(req, res, next);
                } catch (error) {
                    if (error instanceof Response) {
                        res.statusCode = error.statusCode;
                        res.send(error.data);
                        res.end();
                    } else {
                        throw error;
                    }

                }
            }
        }

        // if handler is function
        if (isHandlerArray === false) {
            // enchance handler and push to _HANDLERS
            _HANDLERS.push(EnhanceHandler(Handler));
            // return _HANDLERS
            return _HANDLERS;
        }

        // if handler is array
        Handler.forEach(handler => {
            // enhance Handler and push to _HANDLERS
            _HANDLERS.push(EnhanceHandler(handler));
        })

        // return _HANDLERS
        return _HANDLERS;
    }

    get Handler() {
        return (req, res, next) => {
            res.send("Hello World!");
        }
    }

    get FullPath() {
        return urlJoin(
            this.Base,
            this.Path,
            { leadingSlash: true, trailingSlash: false }
        );
    }

    get Path() {
        return null;
    }

    get Type() {
        return 'route';
    }

    get Method() {
        return "all";
    }

    get Base() {
        return null;
    }

    get StaticPath() {
        return null;
    }

}

module.exports = RouteNode;
