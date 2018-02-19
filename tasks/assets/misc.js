const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");

// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../configs/settings.torchwood.config.js").get();

// Generate a list 
module.exports.watchFiles = watchFiles = [
    "*",
    "**/*",
    "**/**/*",
    "**/**/**/*",
];
module.exports.task = function() {
    let gulp = this;

    gulp.src(watchFiles, { 
        cwd: bootstrap.src + "/misc",
        dot: true // include hidden files like .htaccess
    })
    .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)))
};
module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/misc"}, () => gulp.start("misc")).on('change', localhost.browserSync.reload);
}