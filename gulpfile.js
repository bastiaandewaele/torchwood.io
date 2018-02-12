// NPM packages
const gulp = require("gulp");
const path = require("path");
const process = require("process");
const fs = require("fs");
const rimraf = require("rimraf");

// 
const data = require('gulp-data');

// Bootstrap, functions and settings
const bootstrap = require("./bootstrap");
const settings = bootstrap.settings;
const init = require("./tasks/init");

// Certain tasks that doesn't any main task to boot
// Why: performance / speed
if (process.argv.includes("init")) {
  init.task();
}

// Main modules
const templates = require("./tasks/templates");
const sass = require("./tasks/assets/sass");
const js = require("./tasks/assets/js");
const images = require("./tasks/assets/images");
const misc = require("./tasks/assets/misc");
const concat = require("./tasks/assets/concat");
const localhost = require("./tasks/localhost");

// Other modules

// https://mozilla.github.io/nunjucks/
// https://www.npmjs.com/package/gulp-nunjucks

// todo: add gulp-webpack-server

// Main tasks

gulp.task("templates", templates.task);
gulp.task("assets", () => {
  gulp.task("sass");
  gulp.task("js");
});
gulp.task("sass", sass.task);
gulp.task("js", js.task);
gulp.task("images", images.task);
gulp.task("misc", misc.task);
gulp.task("concat", concat.task);
gulp.task("localhost", localhost.task);

// Other tasks
gulp.task("init", init.task);

gulp.task("help", () => {
  console.log("help me!");
  process.exit();
});

// When no specific task is requested; perform everything from
//  the config file tochwood.config.js

gulp.task("default", () => {
  // On every run first completely remove the export directory  
  rimraf(path.join(bootstrap.cwd, settings.export), () => {
  
    if (settings.templates === true) gulp.start("templates");
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

    if (settings.localhost === true) gulp.start("localhost");
  
    if (process.argv.includes("--watch")) {
      // Watch for changes
      watch();
    }
  });
});

// Watch for changes to templates, assets, ... 
// per watch task { cwd: "..." } is check if a new file has been added 
function watch () {

  if (settings.templates === true) templates.watch();

  // Assets: assign specific watch tasks
  if (settings.assets === true && sass.files.size > 0) sass.watch();
  if (settings.assets === true && js.files.size > 0) js.watch();
  if (settings.images === true) images.watch();
  if (settings.misc === true) misc.watch();
  if (settings.concat === true) concat.watch();
}