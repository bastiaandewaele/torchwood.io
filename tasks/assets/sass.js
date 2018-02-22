const gulp = require("gulp");
const gulpIf = require("gulp-if");
const path = require("path");
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
    return new Promise((resolve, reject) => {
        for (var [key, value] of files) {        
            let exportDirectory = path.dirname(path.join(bootstrap.cwd, settings.export, key)); 

            gulp
            .src(path.join(bootstrap.src+"/sass", value))
            .pipe(
                sass({ 
                    outputStyle: "compressed",
                    style: "compressed",
                    flexbox: true,
                    grid: true,
                    stats: false
                })
                .on("error", error => {
                    console.log(clc.yellow("The following error occurred:"));
                    console.log(clc.red(error));
                })
                .on("error", notify.onError(error => { 
                    if (settings.notify === true) {
                        return "SASS Error: " + error.message;
                    }
                }))
            )
            .pipe(gulpIf(settings.map === true, sourcemaps.init()))
            .pipe(autoprefixer({    
                browsers: ['last 4 version', 'ie 10', 'ie 11'],
                cascade: false,
            }))
            .pipe(concat(path.basename(key)))
            .pipe(gulpIf(settings.map === true), sourcemaps.write())// inline .map
            .pipe(gulp.dest(exportDirectory))
            .on('end', () => {
                console.log(clc.blue("torchwood.io: ")+clc.yellow(`+ done compiling the file \`src/sass/${key}\` successfully`));
                resolve();
            });
        }
    });
};
if (process.argv.includes("--watch")) {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/sass"}, () => gulp.start("sass")).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : null
    );
}