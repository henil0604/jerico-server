const mongoose = require("mongoose");
const MongoDbModel = require("@helper-modules/mongodb-model");

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    description: {
        type: [String, null],
        required: false,
        default: null
    },

    data: {
        type: Object,
        default: {}
    },

    logs: {
        type: Array,
        default: []
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type: String,
        required: true
    },

    settings: {
        type: Object,
        required: false,
        default: {}
    }
}, { minimize: false })

const model = mongoose.model("document", schema);


module.exports = new MongoDbModel(model);