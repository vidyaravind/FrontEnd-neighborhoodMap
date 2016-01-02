var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-html-minifier');
var minCss = require('gulp-minify-css');
var runSequence = require('run-sequence');

gulp.task('js-min',function () {
    return gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html-min',function () {
    return gulp.src('./src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('css-min',function (){
    return gulp.src('./src/css/*.css')
        .pipe(minCss({compatibility:'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('default', function(done) {
    runSequence('js-min', 'html-min','css-min', function () {
        done();
    });
});