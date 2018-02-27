const fs = require("fs");
const path = require("path");
const process = require("process");
const clc = require("cli-color");

// get requested task
const task = process.argv[2]; 

console.log(clc.blue("torchwood.io: ")+clc.greenBright("booting...\n"));

// list of tasks for initializing a new project
if (["help", "init"].includes(task)) {
  require("./tasks/"+task);
  process.exit();
}

// 
const gulp = require("gulp");
const debounce = require("lodash/debounce");
const rimraf = require("rimraf");
const bootstrap = require("./bootstrap");

// Before we start running tasks we need to check if the cwd contains atorchwood.config.js file 
// and also an src directory.
if (!fs.existsSync(bootstrap.cwd+"/torchwood.config.js")) {
  console.warn(clc.red(`\`torchwood.config.js\` doesn't exists in your directory (${bootstrap.cwd}). \n Please use \`torchwood init\` to create a config.`));
  process.exit();
}

if (!fs.existsSync(bootstrap.src)) {
  console.warn(clc.red(`The directory \`src\` doesn't exists inside ${bootstrap.cwd}. \n Please use \`torchwood init\` to create the src directory.`));
  process.exit();
}

// boot and check all listed files inside `torchwood.config.js` exists
bootstrap.boot();

// get the user defined settings (torchwood.config.js)
const settings = require(bootstrap.app+"/src/settings");

// Commands (templates, sass, js, images, concat, ...)

// note i'm not using gulp because of performance reasons. 
// gulp: needs 1000-4000ms to boot 
// basic: needs 300-750ms to boot

let tasks = [];

if (process.argv.includes("templates")) tasks.push(require(bootstrap.app+"/src/tasks/templates"));
if (process.argv.includes("sass")) {
  const sass = require(bootstrap.app+"/src/tasks/assets/sass");
  if (sass.files.size > 0) tasks.push(sass);
}
if (process.argv.includes("js")) {
  const js = require(bootstrap.app+"/src/tasks/assets/js");
  if (js.files.size > 0) tasks.push(js);
}
if (process.argv.includes("images")) tasks.push(require(bootstrap.app+"/src/tasks/assets/images"));
if (process.argv.includes("misc")) tasks.push(require(bootstrap.app+"/src/tasks/assets/misc"));
if (process.argv.includes("concat")) tasks.push(require(bootstrap.app+"/src/tasks/assets/concat"));

if (tasks.length > 0) {
  Promise.all(tasks.map(todo => todo.task())).then(() => {

    if (process.argv.includes("localhost")) tasks.push(require(bootstrap.app+"/src/tasks/localhost"));

    if (process.argv.includes("--watch")) {
      console.log(clc.green("\nwatchers:"));    
      tasks.forEach(task => {
        if (task.hasOwnProperty("watch")) {              
          console.log(clc.green("✓ ")+task.name);  
        }
      });
      tasks.forEach(task => {
        if (task.hasOwnProperty("watch")) {  
          task.watch();
        }
      });
    } else {
      process.exit();
    }
  });
} else {
  // When no specific task is requested; perform everything that has
  // been set to true inside the config file torchwood.config.js

  // On every run first completely remove the export directory  
  rimraf(path.join(bootstrap.cwd, settings.export), () => {  
    let tasks = [];

    if (settings.templates === true) tasks.push(require(bootstrap.app+"/src/tasks/templates"));
    if (settings.assets === true) {
      const sass = require(bootstrap.app+"/src/tasks/assets/sass");
      if (sass.files.size > 0) tasks.push(sass);
      const js = require(bootstrap.app+"/src/tasks/assets/js");
      if (js.files.size > 0) tasks.push(js);
    }
    if (settings.images === true) tasks.push(require(bootstrap.app+"/src/tasks/assets/images"));
    if (settings.misc === true)  tasks.push(require(bootstrap.app+"/src/tasks/assets/misc"));
    if (settings.concat === true) tasks.push(require(bootstrap.app+"/src/tasks/assets/concat"));

    Promise.all(tasks.map(todo => todo.task())).then(() => {
      if (process.argv.includes("--watch")) {
        console.log(clc.green("\nwatchers:"));    
        tasks.forEach(task => {
          if (task.hasOwnProperty("watch")) {            
            console.log(clc.green("✓ ")+task.name);  
          }
        });
        tasks.forEach(task => {
          if (task.hasOwnProperty("watch")) {  
            task.watch();
          }
        });
      }
      if (settings.localhost === true) require(bootstrap.app+"/src/tasks/localhost").task();
    });
  });
}