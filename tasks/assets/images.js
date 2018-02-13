const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");

const image = require("gulp-image");

// Custom 
const bootstrap = require("../../bootstrap");
const localhost = require("../localhost");

// Properties
const settings = require("../../configs/settings.torchwood.config.js").get();

// Generate a list 
let watchFiles = [];
["jpg", "jpeg", "gif", "png", "webp", "svg"].forEach(fileExtention => {
    for (let i = 0; i < 3; i++) {
        watchFiles.push(("**/".repeat(i))+"*."+fileExtention);
    }
});

module.exports.watchFiles = watchFiles;
module.exports.task = function() {
    let gulp = this;

    gulp.src(watchFiles, { cwd: bootstrap.src+"/images"})
    .pipe(image({
        pngquant: true,
        optipng: false,
        zopflipng: true,
        jpegRecompress: false,
        mozjpeg: true,
        guetzli: false,
        gifsicle: true,
        svgo: true,
        concurrent: 10,
        options: {
            optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
            pngquant: ['--speed=1', '--force', 256],
            zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
            jpegRecompress: ['--strip', '--quality', 'medium', '--min', 50, '--max', 100],
            mozjpeg: ['-optimize', '-progressive'],
            guetzli: ['--quality', 85],
            gifsicle: ['--optimize'],
            svgo: ['--enable', '--disable', 'convertColors']
        }
    }))
    .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)+"/images"));
};
module.exports.watch = function () {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/images"}, () => gulp.start("images")).on('change', localhost.browserSync.reload);
};