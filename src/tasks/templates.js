const gulp = require('gulp');
const path = require("path");
const process = require("process");
const clc = require("cli-color");
const through = require("through2");

// Custom code
const bootstrap = require("../../bootstrap");
const settings = require(bootstrap.app+"/src/settings");
const settingsTemplates = require(bootstrap.app+"/src/templates");
const localhost = require(bootstrap.app+"/src/tasks/localhost");

// Nunjucks
const nunjucks = require('nunjucks');
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(bootstrap.src+"/templates"), {});
const version = Date.now(); // timestamp reloading stylsheets and JS (cache)

const watchFiles = [
    "*.html", 
    "**/*.html", 
    "**/**/*.html", 
];

// Nunjucks: set globals
env.addGlobal("version", version);
env.addGlobal("assets", {
    // global that can be printed: {{ assets.sass | safe }}
    get sass() {
        let template = "";
        if (bootstrap.sass.size > 0) {
            for (let [file, value] of bootstrap.sass) {
                 // add `v` queryString as timestamp to force assets reload (when devtools are not open)
                template+= `\n<link rel="stylesheet" type="text/css" href="${file}?v=${version}">`;
            }
        }

        return template+"\n";
    },
    // global that can be printed: {{ assets.js | safe }}
    get js () {
        let template = "";
        if (bootstrap.js.size > 0) {
            for (let [file, value] of bootstrap.sass) {
                // add `v` queryString as timestamp to force assets reload (when devtools are not open)
                template+= `\n<script type="text/javascript" src="${file}?v=${version}"></script>`;
            }
        }

        return template+"\n";
    }
});

// Set global properties that are define in torchwood.config.js
if (settingsTemplates.hasOwnProperty("data")) {
    Object.keys(settingsTemplates.data).forEach((key) => {
        env.addGlobal(key, settingsTemplates.data[key]);
    });
}
// Set global fitters
if (settingsTemplates.hasOwnProperty("filters")) {
    Object.keys(settingsTemplates.filters).forEach((key) => {
        env.addFilter(key, settingsTemplates.filters[key]);
    });
}

// Export
module.exports.name = "templates";
module.exports.watchFiles = watchFiles;
module.exports.task = task = function() {
    return new Promise((resolve, reject) => {
        gulp.src(bootstrap.src+"/templates/*.html")
        // compile nunjucks templates
        .pipe(through.obj(function (file, enc, cb) {
            try {
                file.contents = Buffer.from(env.renderString(file.contents.toString(), file.data));
                this.push(file);
            } catch (error) {
                console.log(clc.red("ERROR: "), error);
            }

            cb();
        }))
        .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)))
        .on('end', () => {
            console.log(clc.yellow(`+ done compiling templates from the directory /src/templates`));
            resolve();
        });
    }); 
};

module.exports.watch = watch = function() {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/templates"}, () => task()).on('change', 
        // only reload when settings.localhost is set to true
        settings.localhost === true ? localhost.browserSync.reload : task
    );

    return task();
};