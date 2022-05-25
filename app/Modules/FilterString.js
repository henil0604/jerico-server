const FilterString = (str) => {
    if (str === "null") {
        return null;
    }

    if (str === "undefined") {
        return undefined;
    }

    if (str === "NaN") {
        return NaN;
    }

    if (str === "Infinity") {
        return Infinity;
    }

    if (str === "-Infinity") {
        return -Infinity;
    }

    if (str === "true") {
        return true;
    }

    if (str === "false") {
        return false;
    }

    try {
        let JSONStr = JSON.parse(str);
        return JSONStr;
    } catch (e) { }

    return str;
}

module.exports = FilterString;