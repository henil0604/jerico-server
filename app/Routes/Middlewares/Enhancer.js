const RouteNode = require("@Modules/RouteNode");
const requestIp = require("request-ip");
const biri = require("biri");
const express = require("express");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const bodyParser = require("body-parser");

module.exports = class Enhancer$Middleware extends RouteNode {

    constructor() {
        super();

    }

    getClientIp(req, res, next) {
        req.ClientIp = requestIp.getClientIp(req);

        next();
    }

    async getPublicId(req, res, next) {

        try {
            req.PublicId = await biri();
        } catch (e) { }

        next();

    }

    get Handler() {
        return [
            cors(),
            bodyParser.json(),
            bodyParser.urlencoded({extended: true}),
            cookieParser(),
            this.getClientIp,
            this.getPublicId,
        ]
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
