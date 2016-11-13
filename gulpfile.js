'use strict';

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const remember = require('gulp-remember');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const ngAnnotate = require('gulp-ng-annotate');
const sequence = require('gulp-sequence');
const notify = require('gulp-notify');

const templateCache = require('gulp-angular-templatecache');

const nodemon = require('gulp-nodemon');

gulp.task('serve', ['watch'], function() {
  return nodemon({
    nodeArgs: ['--debug'],
    script: './back/server.js',
    ignore: ['front']
  })
    .on('start', function() {
      gulp.src('gulpfile.js').pipe(notify({message: 'Server restarted'}));
    });
});

gulp.task('styles', function() {
  return gulp.src('./front/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 version'))
    .pipe(remember('styles'))
    .pipe(cssnano())
    .pipe(concat('main.min.css'))
    .pipe(gulp.dest('./front/build'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
  return gulp.src(['./front/app/**/*.js', '!./front/app/build/app.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    //.pipe(uglify())
    .pipe(gulp.dest('./front/build'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('templates', function() {
  return gulp.src('./front/app/**/*.pug')
    .pipe(pug())
    .pipe(templateCache({
        standalone: true,
        transformUrl: (url) => {
          let regexp = /(?!\/)[\w_-]*(?=\.html)/;
          return regexp.exec(url)[0];
        }
    }))
  .pipe(gulp.dest('./front/build'))
  .pipe(notify({ message: 'Templates task complete' }));
});

gulp.task('build', ['styles', 'scripts', 'templates']);

gulp.task('watch', ['styles', 'scripts', 'templates'], function() {

  // Watch .scss files
  gulp.watch('./front/app/**/*.scss', ['styles']).on('unlink', function(filepath) {
    remember.forget('styles', path.resolve(filepath))
  });

  // Watch .js files
  gulp.watch(['./front/app/**/*.js', '!./front/build/app.js'], ['scripts']).on('unlink', function(filepath) {
    remember.forget('scripts', path.resolve(filepath))
  });

  // Watch .pug files
  gulp.watch(['./front/**/*.pug'], ['templates']).on('unlink', function(filepath) {
    remember.forget('templates', path.resolve(filepath))
  });
});

// gulp.task('db:create', sequence('db:init', 'db:load:users', 'db:load:types'));
// gulp.task('db:init', require('./libs/db/init'));
// gulp.task('db:update', require('./libs/db/update'));
// gulp.task('db:load:users', require('./libs/db/loadUsers'));
// gulp.task('db:load:types', require('./libs/db/loadTypes'));

gulp.task('update', ['build']);
//
process.on('uncaughtException', function(err) {
  console.error(err.message, err.stack, err.errors);
  process.exit(255);
});
