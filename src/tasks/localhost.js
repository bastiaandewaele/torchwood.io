const process = require("process");
const path = require("path");
const gulp = require("gulp");
const browserSync = require('browser-sync').create();
const clc = require("cli-color");

// Custom code
const bootstrap = require("../../bootstrap");
const settings = require(bootstrap.app+"/src/settings");
const settingsLocalhost = require(bootstrap.app+"/src/localhost");


module.exports.browserSync = browserSync;

/**
 * Callback that can be used like:
 * const localhost = require("tasks/localhost");
 * gulp.task("sass", localhost.task);
 */
module.exports.name = "localhost";
module.exports.task = task = function() {
  console.log(clc.blue("torchwood.io: ")+clc.green("booting Browsersync\n"));
  
  browserSync.init(Object.assign(settingsLocalhost, {
    server: {
      baseDir: path.join(bootstrap.cwd, settings.export),
    }
  }));
};