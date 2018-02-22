const gulp = require('gulp');
const path = require("path");
const process = require("process");
const nunjucks = require('gulp-nunjucks');
const clc = require("cli-color");
const inlineCss = require('gulp-inline-css');

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
        // Turn settings.data into globals
        let data = Object.assign(Object.create(settings.data instanceof Object ? settings.data : {}), {

            // Add global properties that are always available
            version: Date.now(), // timestamp reloading stylsheets and JS (cache)

            assets: {
                // global that can be printed: {{ assets.sass | safe }}
                get sass() {
                    let template = "";
                    if (bootstrap.sass.size > 0) {
                        for (let [file, value] of bootstrap.sass) {
                            template+= `<link rel="stylesheet" type="text/css" href="${file}?v${data.version}">`;
                        }
                    }

                    return template;
                },
                // global that can be printed: {{ assets.js | safe }}
                get js () {
                    let template = "";
                    if (bootstrap.js.size > 0) {
                        for (let [file, value] of bootstrap.sass) {
                            template+= `<script type="text/javascript" src="${file}?v${data.version}"></script>`;
                        }
                    }

                    return template;
                }
            }
        });

        gulp.src(bootstrap.src+"/templates/*.html")
        // compile nunjucks templates
        .pipe(nunjucks.compile(data))
        // compile stylesheets into inline CSS
        .pipe(pipeIf(settings.inline === true), inlineCss({
            applyStyleTags: true,
            applyLinkTags: true,
            removeStyleTags: true,
            removeLinkTags: true
        }))
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