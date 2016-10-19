var util = require('./util');
var settings = require('./settings');
var $ = require('gulp-load-plugins')();
var gulp = require('./settings').gulp;
var reload = require('./sync').reload;
var _ = require('lodash');

module.exports = vendor;

function vendor(options) {
  options = _.defaults({}, options, {
    cssNano: {
      safe: true,
      discardUnused: false, // no remove @font-face
      reduceIdents: false // no change on @keyframes names
    },
  });

  return function () {
    util.log('Copying base vendor assets..');

    var jsFilter = $.filter('**/*.js', {
      restore: true,
    });
    var cssFilter = $.filter('**/*.css', {
      restore: true,
    });

    return gulp
      .src(options.src)
      .pipe($.expectFile(options.src))

      .pipe(jsFilter)
        .pipe($.concat(options.dest.js))
        .pipe($.if(settings.isProduction, $.uglify()))
        .pipe(gulp.dest(options.dest.dirJs))
      .pipe(jsFilter.restore())

      .pipe(cssFilter)
        .pipe($.concat(options.dest.css))
        .pipe($.cssnano(options.cssNano))
        .pipe(gulp.dest(options.dest.dirCss))
      .pipe(cssFilter.restore())
      ;
  };
}
