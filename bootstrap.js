// once upon a time waiting on a sunny day ... i was trying to bootup head start and started hating it.)

const process = require("process");
const path = require("path");
const fs = require("fs");
const fileExtension = require('file-extension');
const gulpSass = require("gulp-sass");
const settings = require("./settings");
//const extend = require('object-extend');

// Properties related to task with files and need validation!
const sass = new Map;
const js = new Map;
const concat = new Map;

// reusable properties
const cwd = module.exports.cwd = process.cwd();
const src = module.exports.src = process.cwd() + "/src";

module.exports.boot = function() {
  const config = settings.get();

  if (config.assets === true) {
    if (
      config.files.assets instanceof Object &&
      Object.keys(config.files.assets).length > 0
    ) {
      for (key in config.files.assets) {
        const value = config.files.assets[key];
        const extention = fileExtension(value);
        let directory = cwd+"/src/"+extention;

        // 1. check on file type
        if (!["js", "sass", "scss"].includes(extention)) {
          console.log(`the extention of the file '${value}' ins't allowed inside te property module.exports.assets. Only the file type .js, .scss, .sass is allowed`);
          process.exit();
        }

        if ([!"sass", "scss"].includes(extention)) {
          directory = cwd+"/src/sass";
        }

        // 2. check if file exists
        const file = path.join(directory, value); // todo: to replace and only keep a-z and 0-9 for secureity reasons

        if (!fs.existsSync(file)) {
          // Block compiling when a file doesn't exist
          console.log(`the file '${file}' doesn't exist inside te property module.exports.assets`);
          process.exit();
        }

        // 3. add to map
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

    if (config.concat === true) {
      if (
        config.files.concat instanceof Object &&
        Object.keys(config.files.concat).length > 0
      ) {
        for (key in config.files.concat) {
          const files = config.files.concat[key];
  
          if (!Array.isArray(files)) {
            console.warn(`property ${key} of concat isn't of the type Array`);
            process.exit();
          }

          // Check if every file exists
          files.forEach(value => {
            const file = path.join(process.cwd()+"/src/concat", value);
            if (!fs.existsSync(file)) {
              console.log(`the file '${value}' doesn't exist inside te property module.exports.concat`);
              process.exit(); // kill the task before a task can be performed      
            }
          });

          concat.set(key, files);
        }
      }
    }
  }

};

module.exports.sass = sass;
module.exports.js = js;
module.exports.concat = concat;