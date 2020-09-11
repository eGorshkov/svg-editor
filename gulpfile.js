const gulp = require('gulp');
const concat = require('gulp-concat');
const replace = require('gulp-replace');

function jsBundle() {
  return gulp
    .src(['./**/*.js', '!./node_modules/**', '!app.js', '!gulpfile.js'])
    .pipe(concat('bundle.js'))
    .pipe(replace(/^import.+;/gm, ''))
    .pipe(replace(/(\/\/TODO.+)/gm, ''))
    .pipe(replace(/\/\*\*[\s\S]+\*\//g, ''))
    .pipe(replace(/[\s]+/gm, ''))
    .pipe(gulp.dest('dist'));
}

exports.build = gulp.series(
  gulp.parallel(
    jsBundle
  )
);
