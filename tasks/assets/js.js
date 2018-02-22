const gulp = require("gulp");
const gulpIf = require("gulp-if");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const uglifyjs = require('gulp-uglifyjs');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const notify = require("gulp-notify");
const clc = require("cli-color");

// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../configs/settings.torchwood.config.js").get();
const files = bootstrap.js;

// tasks for sass and js:
// on every task request first check if twiggy.config contains asset files.
module.exports.files = files;
module.exports.watchFiles = watchFiles = [
    "*.js", 
    "**/*.js", 
    "**/**/*.js", 
];
module.exports.task = function () {
    return new Promise((resolve, reject) => {
        for (let [key, value] of files) {    
            let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key));

            // use browserify and babelify to support import and export syntax
            let bundler = browserify({
                entries: path.join(bootstrap.src+"/js", value),
                debug: true,
                cwd: bootstrap.src + "/js" // use src/js directory as main directory              
            });

            bundler
            .transform(babelify.configure({
                presets: [path.join(__dirname, "../../node_modules/babel-preset-es2015")],
                plugins: [path.join(__dirname, "../../node_modules/babel-plugin-transform-runtime")]
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
            .pipe(uglifyjs({
                outSourceMap: settings.map === true,
            }))
            .pipe(gulp.dest(exportDirectory))
            .on('end', () => {
                console.log(clc.blue("torchwood.io: ")+clc.yellow(`+ done compiling the file \`src/js/${key}\` successfully`));
                resolve();
            });
        }
    });
};

if (process.argv.includes("--watch")) {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/js"}, () => gulp.start("js")).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : null
    );
}