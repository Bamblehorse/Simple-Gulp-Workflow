'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create();

gulp.task('default',['browserSync', 'sass:watch'], function() {
});

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'src'
    },
  });
});

gulp.task('refresh', function() {
	return gulp
    .src('src')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass','refresh']);
});