const process = require("process");
const torchwood = require(process.cwd()+"/torchwood.config.js");

module.exports = torchwood.hasOwnProperty("localhost") ? torchwood.localhost : {};