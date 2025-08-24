const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const minify = require('gulp-minify');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');

function jsBundle() {
  return gulp
    .src(['./**/*.js', '!./node_modules/**', '!app.js', '!gulpfile.js'])
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: [
        "@babel/plugin-proposal-class-properties"
      ]
    }))
    .pipe(concat('svg-editor.js'))
    .pipe(gulp.dest('dist'))
    .pipe(minify({
      ext:{
        src:'-debug.js',
        min:'.js'
      },
      exclude: ['tasks'],
      ignoreFiles: ['.combo.js', '-min.js']
    }));
}

function html() {
  return gulp
    .src('src/index.html')
    .pipe(replace(/.\/main.js/gi, './svg-editor.js'))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
}

function styleBundle() {
  return gulp
    .src('src/styles.css')
    .pipe(replace(/[\s]+/gm, ''))
    .pipe(gulp.dest('dist'))
}

exports.build = gulp.series(
  gulp.parallel(
    html,
    jsBundle,
    styleBundle
  )
);
