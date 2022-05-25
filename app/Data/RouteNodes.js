module.exports = [
    require("@Routes/Middlewares/Enhancer"),
    require("@Routes/Middlewares/Logger"),
    require("@Routes/Root"),
    require("@Routes/Ping"),
    require("@Routes/api/create"),
    require("@Routes/api/delete"),
    require("@Routes/api/exists"),
    require("@Routes/api/info"),
    require("@Routes/api/document/set"),
    require("@Routes/api/document/get"),
    require("@Routes/api/document/getAll"),
    require("@Routes/api/document/remove"),
    require("@Routes/api/document/removeAll"),
    require("@Routes/api/document/setAll"),


    // AFTER ALL HANDLERS
    require("@Routes/Middlewares/PostRequest"),
]