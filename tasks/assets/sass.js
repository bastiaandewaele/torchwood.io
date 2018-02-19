const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const clc = require("cli-color");

// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../configs/settings.torchwood.config.js").get();
const files = bootstrap.sass;

module.exports.files = files;
module.exports.watchFiles = watchFiles = [
    "*.sass", 
    "**/*.sass", 
    "**/**/*.sass", 
    "*.scss", 
    "**/*.scss", 
    "**/**/*.scss", 
];
module.exports.task = function() {
    let gulp = this;
    if (files.size > 0) {
        for (var [key, value] of files) {        
            let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key)); 

            gulp
            .src(path.join(bootstrap.src+"/sass", value))
            .pipe(
                sass({ 
                    style: "compressed",
                    flexbox: true,
                    grid: true,
                    stats: true
                })
                .on("error", error => {
                    console.log(clc.yellow("The following error occurred:"));
                    console.log(clc.red(error));
                })
                .on("error", notify.onError(error => { return "SASS Error: " + error.message; }))
            )
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({    
                browsers: ['last 4 version', 'ie 10', 'ie 11'],
                cascade: false
            }))
            .pipe(concat(path.basename(key)))
            .pipe(sourcemaps.write()) // inline .map
            .pipe(gulp.dest(exportDirectory));
        }
    }
};
module.exports.watch = function () {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/sass"}, () => gulp.start("sass")).on('change', localhost.browserSync.reload);
};