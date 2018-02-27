const process = require("process");
const torchwood = require(process.cwd()+"/torchwood.config.js");
const defaults = require("../configs/defaults.torchwood.config");

module.exports = Object.assign(defaults.localhost, torchwood.hasOwnProperty("localhost") ? torchwood.localhost : {});