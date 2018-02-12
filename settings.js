const process = require("process");

module.exports.get = function () {
    return Object.assign(require(__dirname+"/defaults.config"), require(process.cwd()+"/torchwood.config"));
};