const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");

// Custom 
const bootstrap = require("../../bootstrap");

// Properties
const settings = bootstrap.settings();
const sassAssets = bootstrap.sass;

module.exports = {
    files: sassAssets,
    watchFiles: [
        "*.sass", 
        "**/*.sass", 
        "**/**/*.sass", 
        "**/**/**/*.sass",
        "*.scss", 
        "**/*.scss", 
        "**/**/*.scss", 
        "**/**/**/*.scss",
    ],
    task() {
        let gulp = this;

        if (sassAssets.size > 0) {
            for (var [key, value] of sassAssets) {        
                let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key));      
        
                gulp
                .src(path.join(bootstrap.src, value))
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer({    
                    browsers: ['last 4 version', 'ie 10', 'ie 11'],
                    cascade: false
                }))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(exportDirectory))
                .pipe(concat(path.basename(key)));
            }
        }
    }
};