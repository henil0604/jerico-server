const http = require("http");
const { Server: SocketServer } = require("socket.io");
const random = require("@helper-modules/random");

const InitializeSocketNodes = () => {

    globalThis.Server = http.createServer(globalThis.App);

    globalThis.io = new SocketServer(Server, {
        cors: {
            origin: '*',
        }
    });

    const SocketNodes = require("@Data/SocketNodes");

    io.on('connection', (socket) => {
        log(`Connected with {${socket.id}}`, 'log', '[SocketNode]')
        SocketNodes.forEach(Node => {
            const node = new Node;
            node.Socket = socket;
            node.create()
        });
    })

}


module.exports = InitializeSocketNodes;