const random = require("@helper-modules/random");

class Response {

    constructor(data) {
        this.data = data;
        this.statusCode = 200;
    }

    setStatusCode(code) {
        this.statusCode = code;
        return this;
    }

    setData(data) {
        this.data = data;
        return this;
    }

}

module.exports = Response;