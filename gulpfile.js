const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

// Static Server + Watching sass/html/js/img files
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        notify: true
    });
    gulp.watch("src/sass/**/*.sass", gulp.series('sass'));
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    gulp.watch("src/js/**/*.js").on('change', browserSync.reload);
    gulp.watch("src/img/**/*").on('change',  browserSync.reload);
    gulp.watch("src/sass/**/img/*").on('change',  browserSync.reload);
});

// Compile SASS into CSS & auto-inject into browsers
gulp.task('sass', function () {
    return gulp.src("src/sass/**/*.sass")
        .pipe(sass())
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('default', gulp.parallel('server'));