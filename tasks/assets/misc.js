const process = require("process");
const path = require("path");
const fs = require("fs");

// Custom 
const bootstrap = require("../../bootstrap");

// Properties
const settings = bootstrap.settings;

// Generate a list 
let watchFiles = [
    "*",
    "**/*",
    "**/**/*",
    "**/**/**/*",
];

module.exports = {
    watchFiles,
    task() {
        let gulp = this;

        if (settings.misc === true) {
            gulp.src(watchFiles, { 
                cwd: bootstrap.src + "/misc",
                dot: true // include hidden files like .htaccess
            })
            .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)));
        }
    }
};