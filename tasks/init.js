const process = require("process");
const path = require("path");
const gulp = require("gulp");
const fs = require("fs");

// Custom code
const bootstrap = require("../bootstrap");
const settings = bootstrap.settings;

module.exports.task = function() {
    
    if (!fs.existsSync(bootstrap.cwd+"/torchwood.config.js")) {
        // Create config file if it doesn't exists yet
        fs.writeFileSync(bootstrap.cwd+"/torchwood.config.js", fs.readFileSync(__dirname+"/../sample.torchwood.config.js"));
    } else {
        console.warn(`\`torchwood.config.js\` already exists in your directory (${bootstrap.cwd})`);
        process.exit();
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
        fs.writeFileSync(bootstrap.src+"/sass/main.sss", "");
        fs.writeFileSync(bootstrap.src+"/js/main.js", "");
        fs.writeFileSync(bootstrap.src+"/css/test.css", "");
        fs.writeFileSync(bootstrap.src+"/css/foo.css", "");

    } else {
        console.warn(`The directory \`src\` already exists in your directory (${bootstrap.cwd})`);
    }

    process.exit();
};