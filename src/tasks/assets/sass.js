const gulp = require("gulp");
const path = require("path");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const notify = require("gulp-notify");
const chalk = require("chalk");
const through = require("through2");

// Custom 
const bootstrap = require("../../../bootstrap");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Properties
const settings = require(bootstrap.app+"/src/settings");
const files = bootstrap.sass;

module.exports.name = "sass";
module.exports.files = files;
const watchFiles = module.exports.watchFiles = [
    "*.scss", 
    "**/*.scss", 
    "**/**/*.scss", 
    "*.sass", 
    "**/*.sass", 
    "**/**/*.sass", 
];
const task = module.exports.task = function() {     
    return Promise.all(Array.from(files.keys()).map(key => new Promise((resolve, reject) => {
        const value = files.get(key);

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
                console.log(chalk.yellow("The following error occurred:"));
                console.log(chalk.red(error));
            })
            .on("error", notify.onError(error => { 
                if (settings.notify === true) {
                    return "SASS Error: " + error.message;
                }
            }))
        )
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({    
            browsers: ['last 4 version', 'ie 10', 'ie 11'],
            cascade: false,
        }))
        .pipe(sourcemaps.write())// inline .map
        .pipe(gulp.dest(exportDirectory))
        .on('end', () => {
            console.log(chalk.yellow(`+ done compiling \`src/sass/${key}\` successfully`));
            resolve();
        });
    })));
};
module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/sass"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );
};