const fs = require("fs");
const path = require("path");
const process = require("process");

// get requested task
const task = process.argv[2]; 

// list of tasks for initializing a new project
if (["help", "init"].includes(task)) {
  require("./tasks/"+task);
  process.exit();
}

// 
const gulp = require("gulp");
const debounce = require("lodash/debounce");
const rimraf = require("rimraf");
const clc = require("cli-color");
const bootstrap = require("./bootstrap");

// Before we start running tasks we need to check if the cwd contains atorchwood.config.js file 
// and also an src directory.
if (!fs.existsSync(bootstrap.cwd+"/torchwood.config.js")) {
  console.warn(clc.red(`\`torchwood.config.js\` doesn't exists in your directory (${bootstrap.cwd}). Please use \`torchwood-init\` to create a config.`));
  process.exit();
}

if (!fs.existsSync(bootstrap.src)) {
  console.warn(clc.red(`The directory \`src\` doesn't exists inside ${bootstrap.cwd}. Please use \`torchwood-init\` to create the src directory.`));
  process.exit();
}

// boot and check all listed files inside `torchwood.config.js` exists
bootstrap.boot();

// get the user defined settings (torchwood.config.js)
const settings = require("./configs/settings.torchwood.config").get();

// Commands (templates, sass, js, images, concat, ...)

// note i'm not using gulp because of performance reasons. 
// gulp: needs 1000-4000ms to boot 
// basic: needs 300-750ms to boot
if (process.argv.includes("templates")) require("./tasks/templates").task();
if (process.argv.includes("sass")) {
  const sass = require("./tasks/assets/sass");
  if (sass.files.size > 0) sass.task();
}
if (process.argv.includes("js")) {
  const js = require("./tasks/assets/js");
  if (js.files.size > 0) js.task();
}
if (process.argv.includes("images")) require("./tasks/assets/images").task();
if (process.argv.includes("misc")) require("./tasks/assets/misc").task();
if (process.argv.includes("concat")) require("./tasks/assets/concat").task();
if (process.argv.includes("localhost")) require("./tasks/localhost").task();

// When no specific task is requested; perform everything that has
// been set to true inside the config file torchwood.config.js

const done = debounce(() => {
  if (settings.localhost === true) require("./tasks/localhost").task();
}, 500);

if (!task || task === "--watch") {
  // On every run first completely remove the export directory  
  rimraf(path.join(bootstrap.cwd, settings.export), () => {  
    if (settings.templates === true) require("./tasks/templates").task().then(done);
    if (settings.assets === true) {
      if (process.argv.includes("sass")) {
        const sass = require("./tasks/assets/sass");
        if (sass.files.size > 0) sass.task().then(done);;
      }
      if (process.argv.includes("js")) {
        const js = require("./tasks/assets/js");
        if (js.files.size > 0) js.task().then(done);;
      } 
    }
    if (settings.images === true) require("./tasks/assets/images").task().then(done);
    if (settings.misc === true)  require("./tasks/assets/misc").task().then(done);
    if (settings.concat === true) require("./tasks/assets/concat").task().then(done);
  });
}