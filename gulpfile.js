// NPM packages
const gulp = require("gulp");
const path = require("path");
const process = require("process");
const fs = require("fs");
const rimraf = require("rimraf");

// 
const data = require('gulp-data');

// Custom
const bootstrap = require("./bootstrap");
const templates = require("./tasks/templates");
const sass = require("./tasks/assets/sass");
const js = require("./tasks/assets/js");
const images = require("./tasks/assets/images");
const misc = require("./tasks/assets/misc");
const concat = require("./tasks/assets/concat");
const localhost = require("./tasks/localhost");

// https://mozilla.github.io/nunjucks/
// https://www.npmjs.com/package/gulp-nunjucks

// todo: add gulp-webpack-server

// Settings
const settings = bootstrap.settings;

// Main tasks

gulp.task("templates", templates.task);
gulp.task("sass", sass.task);
gulp.task("js", js.task);
gulp.task("images", images.task);
gulp.task("misc", misc.task);
gulp.task("concat", concat.task);
gulp.task("localhost", localhost.task);

// When the user isn't running any command; then show some help text 
gulp.task("default", ["help"]);
gulp.task("help", () => {
  console.log("help me!");
  process.exit();
});

// RUN 
gulp.task("run", () => {
  rimraf(path.join(process.cwd(), settings.export), () => {
    // check by twiggy.config.js what start on run task
  
    if (settings.templates === true) gulp.start("templates");
    if (settings.localhost === true) gulp.start("localhost");
    if (settings.assets === true) {
      if (sass.files.size > 0) gulp.start("sass");
      if (js.files.size > 0) gulp.start("js");
      gulp.start("images");
    }

    if (settings.misc === true) {
      gulp.start("misc");
    }

    if (settings.concat === true) {
      gulp.start("concat");
    }
  
    // Watch for changes
    gulp.start("watch");
  });
});

// Watch for changes to templates, assets, ... 
// per watch task { cwd: "..." } is check if a new file has been added 
gulp.task("watch", () => {

  // templates:
  if (settings.templates === true) {
    gulp.watch(templates.watchFiles, {cwd: bootstrap.src+"/templates"}, () => gulp.start("templates")).on('change', localhost.browserSync.reload);
  }

  // Assets: batch sass, js and concat together
  if (settings.assets === true) {
    if (sass.files.size > 0) {
      gulp.watch(sass.watchFiles, {cwd: bootstrap.src+"/sass"}, () => gulp.start("sass")).on('change', localhost.browserSync.reload);
    }
  
    if (js.files.size > 0) {
      gulp.watch(js.watchFiles, {cwd: bootstrap.src+"/js"}, () => gulp.start("js")).on('change', localhost.browserSync.reload);
    }
  
    if (concat.files.size > 0) {
      gulp.watch(concat.watchFiles, {cwd: bootstrap.src+"/concat"}, () => gulp.start("concat")).on('change', localhost.browserSync.reload);
    }
  }
  
  // Other tasks that only be enabled if the option is true
  if (settings.images === true) {
    gulp.watch(images.watchFiles, {cwd: bootstrap.src+"/images"}, () => gulp.start("images")).on('change', localhost.browserSync.reload);
  }
  
  if (settings.misc === true) {
    gulp.watch(misc.watchFiles, {cwd: bootstrap.src+"/misc"}, () => gulp.start("misc")).on('change', localhost.browserSync.reload);
  }

  if (settings.concat === true) {
    gulp.watch(concat.watchFiles, {cwd: bootstrap.src+"/concat"}, () => gulp.start("concat")).on('change', localhost.browserSync.reload);
  }

  if (localhost === true) {
    gulp.watch("localhost", localhost.watch);
  }
});