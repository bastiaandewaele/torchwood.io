const gulp = require("gulp");
const process = require("process");
const path = require("path");
const fs = require("fs");
const image = require("gulp-image");
const clc = require("cli-color");

// Custom 
const bootstrap = require("../../../bootstrap");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Properties
const settings = require(bootstrap.app+"/src/settings");

// Generate a list 
let watchFiles = [];
["jpg", "jpeg", "gif", "png", "webp", "svg"].forEach(fileExtention => {
    for (let i = 0; i < 3; i++) {
        watchFiles.push(("**/".repeat(i))+"*."+fileExtention);
    }
});
module.exports.name = "images";
module.exports.watchFiles = watchFiles;
const task = module.exports.task = function(files) {
    return new Promise((resolve, reject) => {
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
        .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)+"/images"))
        .on('end', () => {
            console.log(clc.yellow(`+ done compressing images from the directory /src/images`));
            resolve();
        });
    });
};
module.exports.watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/images"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );
};