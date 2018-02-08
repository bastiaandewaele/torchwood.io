// once upon a time waiting on a sunny day ... i was trying to bootup head start and started hating it (the original)

const process = require("process");
const path = require("path");
const fs = require("fs");
const fileExtension = require('file-extension');
const gulpSass = require("gulp-sass");

// Settings
const settings = require("./torch.config");

// 
const extend = require('extend');
const sass = new Map;
const js = new Map;

// --- ASSETS ---

;(function () {
  if (settings.assets === true && Object.keys(settings.files).length > 0) {
    for (key in settings.files) {
      let value = settings.files[key];
      let file = path.join(process.cwd()+"/src", value);

      // Stop compiling or booting localhost wen a file doesn't exists
      if (!fs.existsSync(file)) {
        console.log(`the file ${value} doesn't exist inside te property assets`);
        return process.exit();
      }

      // Map files to correct
      switch (fileExtension(file)) {
        case "sass":
        case "scss":
          sass.set(key, value);
          break;
        case "js":
          js.set(key, value);
          break;
      }
    }
  }
})();


/**
 * Get settings and extended with default settings
 *
 * @returns {Object}
 */
module.exports.settings = function () {

  if (!(settings instanceof Object)) {
    console.log("Settings must be an object");
    process.abort();
  }


  return extend(require("./defaults"), settings);
};

module.exports.directory = function() {
  return __dirname;
}

module.exports.cwd = process.cwd();
module.exports.src = process.cwd() + "/src";
module.exports.sass = sass;
module.exports.js = js;