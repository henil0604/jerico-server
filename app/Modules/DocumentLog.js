const Document = require("@Models/Document");

const DocumentLog = async (documentId, data) => {

    await Document.update({
        id: documentId
    }, {
        $push: {
            "logs": data
        }
    }, false)

    return await Document.get({ id: documentId })
}

module.exports = DocumentLog;