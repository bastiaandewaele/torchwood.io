const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
// Custom 
const bootstrap = require("../../bootstrap");

// Properties
const settings = bootstrap.settings;
const files = bootstrap.concat;

module.exports = {
    files,
    watchFiles: [
        "*.*", 
        "**/*.*", 
        "**/**/*.*", 
        "**/**/**/*.*",
    ],
    task() {
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
    }
};