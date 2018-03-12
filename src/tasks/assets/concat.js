const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const clc = require("cli-color");

// Custom 
const bootstrap = require("../../../bootstrap");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Properties
const settings = require(bootstrap.app+"/src/settings");
const files = bootstrap.concat;

module.exports.name = "concat";
module.exports.files = files;
module.exports.watchFiles = watchFiles = [
    "*.*", 
    "**/*.*", 
    "**/**/*.*", 
];
module.exports.task = task = function () {
    return new Promise((resolve, reject) => {
        for (var [key, filesList] of files) {        
            let exportDirectory = path.join(bootstrap.cwd, settings.export);   
            
            gulp
            .src(filesList.map(file => {
                return path.join(process.cwd()+"/src/concat", file);
            }))
            .pipe(concat(key))
            .pipe(gulp.dest(exportDirectory))
            .on('end', () => {
                console.log(clc.yellow(`+ done concatenating files from the directory /src/concat`));
                resolve();
            });
        }
    });
};

module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/concat"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );

    return task();
};