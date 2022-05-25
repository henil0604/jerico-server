const path = require("path");

const PathResolver = (p) => {
    return path.resolve(__dirname, p);
}

module.exports = {
    entry: ["./server.js"],
    output: {
        path: __dirname + "/build",
        filename: "server.js"
    },
    resolve: {
        extensions: ['.js', '.config.js'],
        alias: {
            '@': PathResolver('app'),
            '@Config': PathResolver('app/Config'),
            '@Data': PathResolver('app/Data'),
            '@Modules': PathResolver('app/Modules'),
            '@Routes': PathResolver('app/Routes'),
            '@Sockets': PathResolver('app/Sockets'),
            '@Models': PathResolver('app/Models'),
        },
    },
    target: 'node',
}