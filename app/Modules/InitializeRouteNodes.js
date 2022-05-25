const Initialize = () => {

    const RouteNodes = require("@Data/RouteNodes");
    App.RouteNodes = [];

    RouteNodes.forEach(node => {
        const Instance = new node();
        App.RouteNodes.push(Instance);
    })


}


module.exports = Initialize;