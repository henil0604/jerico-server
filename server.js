require("@Modules/LoadGlobals")
globalThis.$ROOT = require("app-root-path").resolve("../");

log(`--{${Config.App.name}}--`)

log("Importing App")
const App = require("@/Index");

globalThis.App = App;

log("Setting up MongoDb");
const InitializeMongoDb = require("@Modules/InitializeMongoDb");
InitializeMongoDb();

log("Setting Up Routes");

const InitializeSocketNodes = require("@Modules/InitializeSocketNodes");
InitializeSocketNodes();

const InitializeRouteNodes = require("@Modules/InitializeRouteNodes.js");

InitializeRouteNodes();

Server.listen(Config.App.PORT || 4001, () => {
    log(`Listening on {${Config.App.PORT}}`)
})