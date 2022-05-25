const CryptoJS = require("crypto-js");

module.exports = (string) => {
    let hash = CryptoJS.SHA256(string);
    return hash.toString();
}