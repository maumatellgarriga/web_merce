'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', function() {
    return gulp.src('./css/flexbin.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./'));
});

// Watch SASS file changes
gulp.task('watch', function() {
    gulp.watch('./css/flexbin.scss', ['default']);
});