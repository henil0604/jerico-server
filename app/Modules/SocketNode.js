const JOI = require("joi");

const ValidateConfig = (Config = {}) => {
    const ConfigSchema = JOI.object({
        autoCreate: JOI.boolean().default(false),
    })

    const Data = ConfigSchema.validate(Config);

    if (Data.error) {
        throw new Error(Data.error.message);
    }

    return Data.value;
}


class SocketNode {

    constructor(Config) {
        this.Config = ValidateConfig(Config);
        this.Socket = null;

        if (this.Config.autoCreate) {
            this.create();
        }
    }

    create() {

        log(`Creating Socket Node [{${this.EventName}}]`, "log", "[SocketNode]");

        if (this.Socket === null) {
            throw new Error("Socket must be defined")
        }

        this.Socket.on(this.EventName, ...this._Handler);

        return;
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
            return async (...args) => {

                try {
                    await Handler(this.Socket, ...args);
                } catch (error) {
                    if (error instanceof Response) {
                        return socket.send({
                            error: error.message
                        });
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
        return (socket) => {
            socket.send("Hello World!");
        }
    }

    get EventName() {
        return null;
    }

}


module.exports = SocketNode;