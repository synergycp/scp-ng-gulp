var path = require('path');
var _ = require('lodash');
var gulp = require('./settings').gulp;
var $ = require('gulp-load-plugins')();
var gulpsync = $.sync(gulp);
function genPrependManifest(ngModule, pkg) {
  var addMethod = pkg ? 'addForPackage("'+ pkg + '",' : 'add(';
  return (
    '(function () {' +
    '  "use strict";' +
    '  angular.module("'+ngModule+'")' +
    '    .config(["versionsProvider", function (versionsProvider) {' +
    '      versionsProvider.'+addMethod
  );
}
function genAppendManifest() {
  return (
    '      );' +
    '    }]);' +
    '})();'
  );
}

module.exports = versionManifest;

var exampleOptions = {
  angularModule: 'scp.angle',
  build: './public/',
  files: ['!public/index.html', 'public/**/*.js'],
  package: 'backup/admin',
};
/**
 * @param options
 * @return {function(): undefined|void|*}
 */
function versionManifest(optionOverrides) {
  var options = _.defaults({}, optionOverrides, {
    angularModule: 'scp.angle',
    build: './public',
  });
  var mainJSFile = options.build + '/app.js';
  var manifestTempFile = options.build + '/files-versions-manifest.js';
  var fileExtensionWhitelist = ['.html', '.json', '.js', '.css'];
  gulp.task('public-manifest', function () {
    // create manifest that will be used on client side
    return gulp
      .src(options.files)
      .pipe($.revAll.revision({
        includeFilesInManifest: fileExtensionWhitelist,
        fileNameManifest: manifestTempFile,
        transformFilename: function (file, hash) {
          file.path = "/"; // to remove path and leave only hash (transformPath() not working)
          return hash.substr(0, 10);
        }
      }))
      .pipe($.revAll.manifestFile())
      .pipe($.insert.prepend(genPrependManifest(options.angularModule, options.package)))
      .pipe($.insert.append(genAppendManifest()))
      .pipe(gulp.dest('./'));
  });

  gulp.task('implement-public-manifest', ['public-manifest'], function () {
    // inject public manifest into app.js file
    return gulp.src([manifestTempFile, mainJSFile])
      .pipe($.concat(mainJSFile))
      .pipe(gulp.dest('./', { overwrite: true }));
  })

  return gulpsync.sync(['public-manifest', 'implement-public-manifest']);
}

