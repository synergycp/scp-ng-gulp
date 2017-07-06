var util = require('./util');
var settings = require('./settings');
var $ = require('gulp-load-plugins')();
var gulp = require('./settings').gulp;
var _ = require('lodash');

module.exports = merge;

function merge(options) {
  return function () {
    var jsFilter = $.filter('**/*.js', {
      restore: true,
    });
    var cssFilter = $.filter('**/*.css', {
      restore: true,
    });

    return gulp
      .src(options.src)

      .pipe($.sourcemaps.init({loadMaps: true,  largeFile: true}))
      .pipe(jsFilter)
        .pipe($.concat(options.js))
      .pipe(jsFilter.restore())

      .pipe(cssFilter)
        .pipe($.concat(options.css))
      .pipe(cssFilter.restore())

      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(options.dest))
      ;
  };
}
