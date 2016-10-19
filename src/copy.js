var util = require('./util');
var settings = require('./settings');
var $ = require('gulp-load-plugins')();
var gulp = require('./settings').gulp;
var _ = require('lodash');

module.exports = copy;

function copy(options) {
  var gulpOptions = {};

  if (options.base) {
    gulpOptions.base = options.base;
  }

  return function () {
    return gulp
      .src(options.src, gulpOptions)
      .pipe(gulp.dest(options.dest))
      ;
  };
}
