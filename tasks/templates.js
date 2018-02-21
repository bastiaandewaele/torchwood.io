const gulp = require('gulp');
const path = require("path");
const process = require("process");
const nunjucks = require('gulp-nunjucks');
const clc = require("cli-color");

// Custom code
const bootstrap = require("../bootstrap");
const localhost = require("./localhost");
const settings = require("../configs/settings.torchwood.config.js").get();

module.exports.watchFiles = watchFiles = [
    "*.html", 
    "**/*.html", 
    "**/**/*.html", 
    "**/**/**/*.html",
];
module.exports.task = task = function() {
    return new Promise((resolve, reject) => {
        let data = Object.create(settings.data instanceof Object ? settings.data : {}); // make copy of data 

        // add dynamic properties per reload
        data.version = Date.now(); // timestamp for stylesheets and javascript (when dev tools are not enabled

        // Set standard messages
        data.assets = {
            sass: "",
            js: "",
        };

        // Set properties that include all SASS and JS files to printed with {{ assets.sass | sage }} or  {{ assets.js | sage }}
        if (bootstrap.sass.size > 0) {
            data.assets.sass = "";
            for (let [file, value] of bootstrap.sass) {
                data.assets.sass+= `<!-- CSS files -->\n <link rel="stylesheet" type="text/css" href="${file}?v${data.version}">`;
            }
        }

        if (bootstrap.js.size > 0) {
            data.assets.js = "";
            for (let [file, value] of bootstrap.js) {
                data.assets.js+= `<!-- JS files -->\n <script type="text/javascript" src="${file}?v${data.version}"></script>`;
            }
        }

        // recompile temmplates
        gulp.src(bootstrap.src+"/templates/*.html")
        .pipe(nunjucks.compile(data))
        .pipe(gulp.dest(path.join(bootstrap.cwd, settings.export)))
        .on('end', () => {
            console.log(clc.blue("torchwood.io: ")+clc.yellow(`done compiling templates from the directory /src/templates`));
            resolve();
        });
    }); 
};
if (process.argv.includes("--watch")) {
    gulp.watch(watchFiles, {cwd: bootstrap.src+"/templates"}, () => gulp.start("templates")).on('change', 
        // only use reload when localhost is true
        settings.localhost === true ? localhost.browserSync.reload : null
    );
}