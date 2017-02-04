'use strict';

    import gulp from 'gulp';

	  import sass from 'gulp-sass';
    import cssnano from 'gulp-cssnano';
    import sourcemaps from 'gulp-sourcemaps';
    import autoprefixer from 'gulp-autoprefixer';
    import del from 'del';
    import pug from 'gulp-pug';
    import chalk from 'chalk';
    import babel from 'gulp-babel';
    import uglify from 'gulp-uglify';
    import plumber from 'gulp-plumber';
	  import browserSync from 'browser-sync';

gulp.task('default',['del','browserSync', 'watch'], () => {
});

gulp.task('del', () => {
  del('dist').then(() => {
    console.log(chalk.green('Dist folder deleted'));
  });
});

gulp.task('build', gulp.series('del', 'unPugify', 'uglify', 'sass', function(done) {
  console.log(chalk.green('Built Dist Folder'));
  gulp.src('src/js/questions.json')
    .pipe(gulp.dest('dist/js'));
  gulp.src(['src/images/**', 'src/videos/**', 'src/js/questions.json'], { base: 'src/' })
    .pipe(gulp.dest('dist'));
  console.log(chalk.green('Moved files'));
  done();
}));

gulp.task('unPugify', () => {
  return gulp.src('src/pug/*.pug')
  .pipe(plumber())
  .pipe(pug({pretty: true}))
  .pipe(gulp.dest('dist/'));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  });
});

gulp.task('reload', () => {
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
  gulp.watch('src/sass/**/*.+(scss|sass)', ['sass', 'reload']); // useref
  gulp.watch('dist/**/*.html', ['reload']);
  gulp.watch('src/**/*.pug', ['unPugify']);
  gulp.watch('src/js/*.js', ['uglify','reload']);
});
