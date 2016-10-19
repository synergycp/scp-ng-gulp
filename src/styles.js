var util = require('./util');
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var reload = require('./sync').reload;
var settings = require('./settings');
var gulp = settings.gulp;

module.exports = {
  add: add,
  rtl: rtl,
};

function add(options) {
  return function () {
    options = _.defaults({}, options, {
      sourceMaps: settings.useSourceMaps,
      cssNano: {
        safe: true,
        discardUnused: false, // no remove @font-face
        reduceIdents: false // no change on @keyframes names
      },
      compass: {
        project: settings.dir,
        css: options.dest,
        sass: options.base,
        image: options.image,
      },
    });

    var addRtlSuffix = $.rename(function (path) {
      path.basename += "-rtl";

      return path;
    });

    util.log('Building application styles..');

    return gulp
      .src(options.src)

      .pipe($.if(options.useSourceMaps, $.sourcemaps.init()))
      .pipe($.compass(options.compass))
      .on('error', util.error)

      .pipe($.if(options.rtl, $.rtlcss()))

      .pipe($.if(settings.isProduction, $.cssnano(options.cssNano)))
      .pipe($.if(options.useSourceMaps, $.sourcemaps.write()))

      .pipe($.if(options.rtl, addRtlSuffix))

      .pipe(gulp.dest(options.dest))
      .pipe(reload({
        stream: true,
      }))
      ;
  };
}

function rtl(options) {
  options = _.assign({}, options, {
    rtl: true,
  });
  util.log('Building application RTL styles..');

  return add(options);
}
