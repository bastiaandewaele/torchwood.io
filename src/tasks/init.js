const process = require("process");
const path = require("path");
const gulp = require("gulp");
const fs = require("fs");
const chalk = require('chalk');
// Custom code
const bootstrap = require("../../bootstrap");
const cwd = process.cwd();
const src = process.cwd()+'/src';

if (!fs.existsSync(cwd+"/torchwood.config.js")) {
    // Create config file if it doesn't exists yet
    fs.writeFileSync(cwd+"/torchwood.config.js", fs.readFileSync(__dirname+"/../../configs/sample.torchwood.config.js"));
    console.log(chalk.green(`+ the file torchwood.config.js has been succesfully been added inside the directory ${src}`));
} else {
    console.log(chalk.red(`- torchwood.config.js already exists in your directory (${cwd})`));
    process.exit();
}

if (!fs.existsSync(src)) {
    // Start copying sample files and create base directories
    fs.mkdirSync(src, 0755);
    fs.mkdirSync(src+"/concat", 0755);
    fs.mkdirSync(src+"/images", 0755);
    fs.mkdirSync(src+"/js", 0755);
    fs.mkdirSync(src+"/mic", 0755);
    fs.mkdirSync(src+"/sass", 0755);
    fs.mkdirSync(src+"/templates", 0755);

    // Add basic files (related to sample.torchwood.config.js)
    fs.writeFileSync(src+"/sass/main.scss", fs.readFileSync(__dirname+"/../../samples/sass/main.scss"));
    fs.writeFileSync(src+"/js/main.js", fs.readFileSync(__dirname+"/../../samples/js/main.js"));

    // Concat
    fs.writeFileSync(src+"/concat/test.css", fs.readFileSync(__dirname+"/../../samples/concat/test.css"));
    fs.writeFileSync(src+"/concat/foo.css", fs.readFileSync(__dirname+"/../../samples/concat/foo.css"));
    fs.writeFileSync(src+"/concat/foo.js", fs.readFileSync(__dirname+"/../../samples/concat/foo.js"));
    fs.writeFileSync(src+"/concat/test.js", fs.readFileSync(__dirname+"/../../samples/concat/test.js"));
    fs.writeFileSync(src+"/templates/index.html", fs.readFileSync(__dirname+"/../../samples/templates/index.html"));
    fs.writeFileSync(src+"/templates/about.html", fs.readFileSync(__dirname+"/../../samples/templates/about.html"));
    fs.mkdirSync(src+"/templates/partials", 0755);
    fs.writeFileSync(src+"/templates/partials/header.html", fs.readFileSync(__dirname+"/../../samples/templates/partials/header.html"));

    console.log(chalk.green(`+ the directory /src has been succesfully been added inside the directory ${src}`));

} else {
    console.log(chalk.red(`- The directory /src already exists in your directory (${src})`));
    process.exit();
}

process.exit();