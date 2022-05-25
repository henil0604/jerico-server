const SocketNode = require("@Modules/SocketNode");


module.exports = class Connection extends SocketNode {

    constructor() {
        super();
    }

    get Handler() {
        return (socket, { name }) => {
            socket.emit("hello", `Hello ${name}`)
        }
    }

    get EventName() {
        return 'hello';
    }

}