var util = require('./util');
var gulp = require('./settings').gulp;
var $ = require('gulp-load-plugins')();

module.exports = {
  app: app,
};

function app(options) {
  return function() {
    return gulp
      .src(options.src)

      .pipe($.jsvalidate())
      .on('error', util.error)

      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.concat(options.dest))
      .pipe($.ngAnnotate())
      .on('error', util.error)

      .pipe($.uglify({
        preserveComments: 'some',
      }))
      .on('error', util.error)
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('./'))
      ;
  };
}
