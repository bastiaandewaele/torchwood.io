const process = require("process");
const torchwood = require(process.cwd()+"/torchwood.config.js");

module.exports = torchwood.hasOwnProperty("settings") ? torchwood.settings : {};