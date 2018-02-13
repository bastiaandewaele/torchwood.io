#!/usr/bin/env node

const process = require("process");
const path = require("path");
const gulp = require("gulp");
const fs = require("fs");

// Custom code
const bootstrap = require("../bootstrap");

module.exports.task = function() {
    
    if (!fs.existsSync(bootstrap.cwd+"/torchwood.config.js")) {
        // Create config file if it doesn't exists yet
        fs.writeFileSync(bootstrap.cwd+"/torchwood.config.js", fs.readFileSync(__dirname+"/../configs/sample.torchwood.config.js"));
    }
    
    if (!fs.existsSync(bootstrap.src)) {
        // Create the most importants files
        fs.mkdirSync(bootstrap.src, 0755);
        fs.mkdirSync(bootstrap.src+"/concat", 0755);
        fs.mkdirSync(bootstrap.src+"/css", 0755);
        fs.mkdirSync(bootstrap.src+"/images", 0755);
        fs.mkdirSync(bootstrap.src+"/js", 0755);
        fs.mkdirSync(bootstrap.src+"/mic", 0755);
        fs.mkdirSync(bootstrap.src+"/sass", 0755);
        fs.mkdirSync(bootstrap.src+"/templates", 0755);

        // Add basic files (related to sample.torchwood.config.js)
        fs.writeFileSync(bootstrap.src+"/sass/main.scss", fs.readFileSync(__dirname+"/../src/sass/main.scss"));
        fs.writeFileSync(bootstrap.src+"/js/main.js", fs.readFileSync(__dirname+"/../src/js/main.js"));
        fs.writeFileSync(bootstrap.src+"/css/test.css", fs.readFileSync(__dirname+"/../src/css/test.css"));
        fs.writeFileSync(bootstrap.src+"/css/foo.css", fs.readFileSync(__dirname+"/../src/css/foo.css"));

    }

    process.exit();
};