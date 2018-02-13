#!/usr/bin/env node

const process = require("process");
const path = require("path");
const gulp = require("gulp");
const fs = require("fs");
const clc = require('cli-color');

// Custom code
const bootstrap = require("../bootstrap");

if (!fs.existsSync(bootstrap.cwd+"/torchwood.config.js")) {
    // Create config file if it doesn't exists yet
    fs.writeFileSync(bootstrap.cwd+"/torchwood.config.js", fs.readFileSync(__dirname+"/../configs/sample.torchwood.config.js"));

    console.log(clc.green(`+ the file torchwood.config.js has been succesfully been added inside the directory ${bootstrap.cwdsrc}`));
} else {
    console.log(clc.red(`- torchwood.config.js already exists in your directory (${bootstrap.cwd})`));
    process.exit();
}

if (!fs.existsSync(bootstrap.src)) {
    // Create the most importants files
    fs.mkdirSync(bootstrap.src, 0755);
    fs.mkdirSync(bootstrap.src+"/concat", 0755);
    fs.mkdirSync(bootstrap.src+"/images", 0755);
    fs.mkdirSync(bootstrap.src+"/js", 0755);
    fs.mkdirSync(bootstrap.src+"/mic", 0755);
    fs.mkdirSync(bootstrap.src+"/sass", 0755);
    fs.mkdirSync(bootstrap.src+"/templates", 0755);

    // Add basic files (related to sample.torchwood.config.js)
    fs.writeFileSync(bootstrap.src+"/sass/main.scss", fs.readFileSync(__dirname+"/../src/sass/main.scss"));
    fs.writeFileSync(bootstrap.src+"/js/main.js", fs.readFileSync(__dirname+"/../src/js/main.js"));

    // Concat
    fs.writeFileSync(bootstrap.src+"/concat/test.css", fs.readFileSync(__dirname+"/../src/concat/test.css"));
    fs.writeFileSync(bootstrap.src+"/concat/foo.css", fs.readFileSync(__dirname+"/../src/concat/foo.css"));
    fs.writeFileSync(bootstrap.src+"/concat/foo.js", fs.readFileSync(__dirname+"/../src/concat/foo.js"));
    fs.writeFileSync(bootstrap.src+"/concat/test.js", fs.readFileSync(__dirname+"/../src/concat/test.js"));
    fs.writeFileSync(bootstrap.src+"/templates/index.html", fs.readFileSync(__dirname+"/../src/templates/index.html"));
    fs.mkdirSync(bootstrap.src+"/templates/partials", 0755);
    fs.writeFileSync(bootstrap.src+"/templates/partials/header.html", fs.readFileSync(__dirname+"/../src/templates/partials/header.html"));

    console.log(clc.green(`+ the directory /src has been succesfully been added inside the directory ${bootstrap.src}`));

} else {
    console.log(clc.red(`- The directory /src already exists in your directory (${bootstrap.src})`));
    process.exit();
}

process.exit();