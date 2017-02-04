// Created By Jonathan Wood - github.com/JonathanDWood
'use strict';
    // Gulp
    import gulp from 'gulp';
    // HTML
    import pug from 'gulp-pug';
    // CSS
	  import sass from 'gulp-sass';
    import sourcemaps from 'gulp-sourcemaps';
    import autoprefixer from 'gulp-autoprefixer';
    // JS
    import babel from 'gulp-babel';
    import uglify from 'gulp-uglify';
    // System Tools
    import del from 'del';
    import chalk from 'chalk';
    import plumber from 'gulp-plumber';
    import pathExists from 'path-exists';
    import browserSync from 'browser-sync';

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
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 3 versions'] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('uglify', () => {
 return gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', () => {
  console.log(chalk.green('Watching Files'));
  gulp.watch('src/sass/**/*.+(scss|sass)', gulp.series('sass', 'reload', (done) => {
    done();
  }));
  gulp.watch('dist/**/*.html', gulp.series('reload', (done) => {
    done();
  }));
  gulp.watch('src/**/*.pug',  gulp.series('unPugify', (done) => {
    done();
  }));
  gulp.watch('src/js/*.js', gulp.series('uglify', 'reload', (done) => {
    done();
  }));
});

gulp.task('del', (done) => {
  if (pathExists.sync('dist')) {
      console.log(chalk.green('Dist Folder Exists'));
      console.log(chalk.red('Deleting Dist Folder'));
      done();
      return del.sync('dist', {force:true});
  }
  done();
  return console.log(chalk.red('Dist Folder Not Found'));
});

gulp.task('preBuild', (done) => {
  // Array of files to be moved
  gulp.src(['src/images/**'], { base: 'src/' })
    .pipe(gulp.dest('dist'));
  console.log(chalk.green('Created Dist Folder'));
  console.log(chalk.green('Moved files'));
  console.log(chalk.green('Starting build'));
  done();
});

// Convert Pug, JS, and SASS
gulp.task('build', gulp.series('del','preBuild', gulp.parallel('unPugify', 'uglify', 'sass')), (done) => {
  done();
});

gulp.task('default', gulp.series('build', gulp.parallel('watch','browserSync')), (done) => {
  done();
});
