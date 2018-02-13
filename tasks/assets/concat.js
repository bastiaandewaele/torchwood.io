const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../configs/settings.torchwood.config.js").get();
const files = bootstrap.concat;

module.exports.files = files;
module.exports.watchFiles = watchFiles = [
    "*.*", 
    "**/*.*", 
    "**/**/*.*", 
    "**/**/**/*.*",
];
module.exports.task = function () {
    let gulp = this;

    if (files.size > 0) {
        for (var [key, filesList] of files) {        
            let exportDirectory = path.join(bootstrap.cwd, settings.export);   
            
            gulp
            .src(filesList.map(file => {
                return path.join(process.cwd()+"/src/concat", file);
            }))
            .pipe(concat(key))
            .pipe(gulp.dest(exportDirectory));
        }
    }
};
module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/concat"}, () => gulp.start("concat")).on('change', localhost.browserSync.reload);
};