const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");

// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../settings").get();
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
            /*     
            if (!fs.existsSync(path.join(bootstrap.src+"/sass", value))) {
                console.log("stop", path.join(bootstrap.src+"/sass", value));
                process.exit();
            }
            */

            gulp
            .src(path.join(bootstrap.src+"/sass", value))
            .pipe(sass().on('error', sass.logError))
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({    
                browsers: ['last 4 version', 'ie 10', 'ie 11'],
                cascade: false
            }))
            .pipe(concat(path.basename(key)))
            .pipe(sourcemaps.write()) // inline
            .pipe(gulp.dest(exportDirectory));
        }
    }
};
module.exports.watch = function () {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/sass"}, () => gulp.start("sass")).on('change', localhost.browserSync.reload);
};