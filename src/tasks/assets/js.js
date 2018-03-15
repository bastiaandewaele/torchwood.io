const gulp = require("gulp");
const gulpIf = require("gulp-if");
const path = require("path");
const uglify = require('gulp-uglify');
const sourcemaps = require("gulp-sourcemaps");
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const notify = require("gulp-notify");
const clc = require("cli-color");

// Custom 
const bootstrap = require("../../../bootstrap");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Properties
const settings = require(bootstrap.app+"/src/settings");
const files = bootstrap.js;

module.exports.name = "js";
module.exports.files = files;
const watchFiles = module.exports.watchFiles = [
    "*.js", 
    "**/*.js", 
    "**/**/*.js", 
];
const task = module.exports.task = function () {
    return Promise.all(Array.from(files.keys()).map(key => new Promise((resolve, reject) => {
        const value = files.get(key); 
        let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key));

        // use browserify and babelify to support import and export syntax
        let bundler = browserify({
            entries: path.join(bootstrap.src+"/js", value),
            debug: true,
            cwd: bootstrap.src + "/js" // use src/js directory as main directory              
        });

        bundler
        .transform(babelify.configure({
            presets: [
                bootstrap.app+"/node_modules/babel-preset-react", 
                bootstrap.app+"/node_modules/babel-preset-env"
            ],
            plugins: [
                bootstrap.app+"/node_modules/babel-plugin-transform-runtime",
                bootstrap.app+"/node_modules/babel-plugin-transform-async-to-generator",
            ]
        }))
        .bundle()
        .on("error", function (error) { 
            console.log(clc.yellow("JS error:"));
            console.error(clc.red(error));
        })
        .on("error",notify.onError(function (error) {
            if (settings.notify === true) {
                return "Error message!: " + error.message;
            }
        }))
        .pipe(source(path.basename(key)))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify({}))
        .pipe(sourcemaps.write())// inline .map
        .pipe(gulp.dest(exportDirectory))
        .on('end', () => {
            console.log(clc.yellow(`+ done compiling \`src/js/${key}\` successfully`));
            resolve();
        });
    })));
};

module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/js"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );
};