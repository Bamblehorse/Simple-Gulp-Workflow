"use strict";
/*jshint esversion:6 */
const gulp = require('gulp'),
    babel = require('gulp-babel'),
	  sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    useref = require('gulp-useref'),
	  browserSync = require('browser-sync').create();

gulp.task('default',['browserSync', 'watch'], () => {
});

gulp.task('unPugify', () => {
  return gulp.src('src/pug/*.pug')
  .pipe(plumber())
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('useref', () =>{
  return gulp.src('dist/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist/'));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  });
});

gulp.task('refresh', () => {
	return gulp
    .src('dist')
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', () => {
  return gulp.src('src/sass/**/*.+(scss|sass)')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('babelify', () => {
    return gulp.src('src/js/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('uglify', () => {
 return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch',  () => {
  gulp.watch('src/sass/**/*.+(scss|sass)', ['sass', 'refresh']); // useref
  gulp.watch('dist/**/*.html', ['refresh']);
  gulp.watch('src/**/*.pug', ['unPugify']);
  gulp.watch('src/js/*.js', ['uglify','refresh']);
});