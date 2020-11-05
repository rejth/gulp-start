const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const notify = require('gulp-notify');
const del = require('del');

// Create static server
function serverTask() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        notify: true
    });
};

// Watching html/css/js/img files
function watchTask() {
    watch("src/**/*.html").on('change', browserSync.reload);
    watch("src/css/**/*.css").on('change', browserSync.reload);
    watch("src/js/**/*.js").on('change', browserSync.reload);
    watch("src/img/**/*").on('change',  browserSync.reload);
};

// Compile SASS into CSS, autoprefix, minify & load to dist directory
function sassTask() {
    return src("src/sass/**/*.sass")
        .pipe(sass().on("error", notify.onError()))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest("dist/css"));
};

// Concatenation of all JS files, minify & load to the dist directory
function scriptsTask() {
    return src([
        "src/js/jquery-3.5.1.js",
        "src/js/script.js"
    ])
        .pipe(concat("script-min.js"))
        .pipe(uglify())
        .pipe(dest("dist/js"));
};

// Minify, optimize all images & load to the dist directory
function imagesTask() {
    return src([
        "src/img/**/*",
    ])
        .pipe(imageMin([
            imageMin.mozjpeg({quality: 75, progressive: true}),
            imageMin.optipng({optimizationLevel: 5}),
            imageMin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(dest("dist/img"));
}

// Delete dist directory
function deleteTask() {
    return del(["dist"]);
};

// Build project & load to the dist directory
function buildTask() {
    return src("src/**/*.html")
        .pipe(dest("dist"))
}

exports.server = serverTask;
exports.watch = watchTask;
exports.del = deleteTask;
exports.sass = sassTask;
exports.scripts = scriptsTask;
exports.images = imagesTask;

exports.build = series(deleteTask, sassTask, scriptsTask, imagesTask, buildTask);
exports.default = parallel(serverTask, watchTask);