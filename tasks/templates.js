const gulp = require('gulp');
const path = require("path");
const nunjucks = require('gulp-nunjucks');

// Custom code
const bootstrap = require("../bootstrap");
const localhost = require("./localhost");
const settings = bootstrap.settings;

module.exports.watchFiles = watchFiles = [
    "*.html", 
    "**/*.html", 
    "**/**/*.html", 
    "**/**/**/*.html",
];
module.exports.task = task = function() {
    let gulp = this;

    gulp.src(bootstrap.src+"/templates/*.html")
    .pipe(nunjucks.compile(settings.data instanceof Object ? settings.data : {}))
    .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)));   
};
module.exports.watch = watch = function () {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/templates"}, () => gulp.start("templates")).on('change', localhost.browserSync.reload);
};