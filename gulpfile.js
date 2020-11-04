const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imageMin= require('gulp-imagemin');

// Create static server + watching sass/html/js/img files
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        notify: true
    });
    gulp.watch("src/sass/**/*.sass", gulp.series('sass'));
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js").on('change', gulp.series('scripts'));
    gulp.watch("src/img/**/*").on('change',  browserSync.reload);
    gulp.watch("src/sass/**/img/*").on('change',  browserSync.reload);
});

// Compile SASS into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("src/sass/**/*.sass")
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.stream());
});

// Concatenation of JS files into one file & minify it
gulp.task('scripts', function () {
    return gulp.src([
        "src/js/jquery-3.5.1.js",
        "src/js/script.js"
    ])
        .pipe(concat("script-min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("src/js"))
        .pipe(browserSync.stream());
});

// Minify images
gulp.task('images', function () {
    return gulp.src([
        "src/img/**/*",
        "src/sass/**/img/*"
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
        .pipe(gulp.dest("dist"));
});

gulp.task('default', gulp.parallel('server'));