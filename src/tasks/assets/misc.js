const gulp = require("gulp");
const chalk = require("chalk");
const process = require("process");
const path = require("path");
const fs = require("fs");

// Custom 
const bootstrap = require("../../../bootstrap");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Properties
const settings = require(bootstrap.app+"/src/settings");

module.exports.name = "misc";
const watchFiles = module.exports.watchFiles = [
    "*",
    "**/*",
    "**/**/*",
];
const task = module.exports.task = function() {
    return new Promise((resolve, reject) => {
        gulp.src(watchFiles, { 
            cwd: bootstrap.src + "/misc",
            dot: true // include hidden files like .htaccess
        })
        .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)))
        .on('end', () => {
            console.log(chalk.yellow(`+ done copying files from the /src/misc directory`));
            resolve();
        });
    });
};
module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/misc"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );
};