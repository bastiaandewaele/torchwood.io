const gulp = require("gulp");
const clc = require("cli-color");
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
];
module.exports.task = function() {
    return new Promise((resolve, reject) => {
        gulp.src(watchFiles, { 
            cwd: bootstrap.src + "/misc",
            dot: true // include hidden files like .htaccess
        })
        .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)))
        .on('end', () => {
            console.log(clc.blue("torchwood.io: ")+clc.yellow(`done compiling files from the /src/misc directory`));
            resolve();
        });
    });
};
if (process.argv.includes("--watch")) {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/misc"}, () => gulp.start("misc")).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : null
    );
}