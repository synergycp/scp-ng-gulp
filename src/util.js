var $ = require('gulp-load-plugins')();

module.exports = new Util();

function Util() {
  this.log = log;
  this.error = error;
}

// log to console using
function log(msg) {
  $.util.log($.util.colors.blue(msg));
}

function error(err) {
  log(err.toString());
  this.emit('end');
}
