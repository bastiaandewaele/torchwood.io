const process = require("process");
const path = require("path");
const fs = require("fs");
const concat = require("gulp-concat");
const sourcemaps = require("gulp-sourcemaps");
const babel = require('gulp-babel');
const uglifyjs = require('gulp-uglifyjs');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');

// Custom 
const bootstrap = require("../../bootstrap");

// Properties
const settings = bootstrap.settings();
const js = bootstrap.js;

// tasks for sass and js:
// on every task request first check if twiggy.config contains asset files.

module.exports = {
    files: js,
    watchFiles: [
        "*.js", 
        "**/*.js", 
        "**/**/*.js", 
        "**/**/**/*.js",
    ],
    task() {
        let gulp = this; 

        if (js.size > 0) {      

            for (let [key, value] of js) {    
                let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key));

                // use browserify and babelify to support import and export syntax
                let bundler = browserify({
                    entries: path.join(bootstrap.src, value),
                    debug: true,
                    cwd: bootstrap.src + "/js" // use src/js directory as main directory              
                });

                bundler
                .transform(babelify.configure({
                    presets: ["es2015"],
                    plugins: ["transform-runtime"]
                }))
                .bundle()
                .on("error", function (err) { console.error(err); })
                .pipe(source(path.basename(key)))
                .pipe(buffer())
                .pipe(uglifyjs({
                    outSourceMap: true
                }))
                .pipe(gulp.dest(exportDirectory));
            }
        }
    }
};