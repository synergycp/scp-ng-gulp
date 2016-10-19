var util = require('./util');
var settings = require('./settings');
var $ = require('gulp-load-plugins')();
var gulp = require('./settings').gulp;
var reload = require('./sync').reload;
var _ = require('lodash');

module.exports = views;

function views (options) {
  options = _.defaults({}, options, {
    pug: {
      basedir: './',
    },
  });

  return function () {
    return gulp
      .src(options.src)

      .pipe($.pug(options.pug))
      .on('error', util.error)

      .pipe(gulp.dest(options.dest))
      .pipe(reload({
        stream: true,
      }))
      ;
  };
}
