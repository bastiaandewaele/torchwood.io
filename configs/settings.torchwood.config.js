const process = require("process");

module.exports.get = function () {
    return Object.assign(require("./defaults.torchwood.config"), require(process.cwd()+"/torchwood.config"));
};