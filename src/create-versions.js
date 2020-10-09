// TODO: Deprecate this file in favor of the more generic version-manifest.js

var path = require("path");
var gulp = require("./settings").gulp;
var $ = require("gulp-load-plugins")();

module.exports = createVersions;

function createVersions() {
  return gulp.series(["replace-js-css"]);
}

var build = {
  scripts: "public/app/js",
};

gulp.task("public-manifest", function () {
  // create manifest that will be used on client side
  return gulp
    .src([
      "!./public/index.html",
      "!./public/app/css/*.css",
      "!./public/app/js/*.js",
      "./public/**/*.*",
    ])
    .pipe(
      $.revAll.revision({
        includeFilesInManifest: [".html", ".json", ".js", ".css"],
        fileNameManifest: "./public/files-versions-manifest.js",
        transformFilename: function (file, hash) {
          file.path = "/"; // to remove path and leave only hash (transformPath() not working)
          return hash.substr(0, 10);
        },
      })
    )
    .pipe($.revAll.manifestFile())
    .pipe($.insert.prepend("window.FILES_VERSIONS = "))
    .pipe($.insert.append(";"))
    .pipe(gulp.dest("./"));
});

gulp.task(
  "implement-public-manifest",
  gulp.series(["public-manifest"], function () {
    // inject public manifest into app.js file
    return gulp
      .src(["./public/files-versions-manifest.js", build.scripts + "/app.js"])
      .pipe($.concat(build.scripts + "/app.js"))
      .pipe(gulp.dest("./", { overwrite: true }));
  })
);

gulp.task(
  "js-css-manifest",
  gulp.series(["implement-public-manifest"], function () {
    // create manifest for files referenced in index.html
    return gulp
      .src(["./public/app/css/*.css", "./public/app/js/*.js"])
      .pipe(
        $.revAll.revision({
          fileNameManifest: "./public/index-files-versions-manifest.json",
          transformFilename: function (file, hash) {
            var ext = path.extname(file.path);
            return (
              path.basename(file.path, ext) + ext + "?__" + hash.substr(0, 10)
            );
          },
        })
      )
      .pipe($.revAll.manifestFile())
      .pipe(gulp.dest("./"));
  })
);

gulp.task(
  "replace-js-css",
  gulp.series(["js-css-manifest"], function () {
    return gulp
      .src(["./public/index.html"])
      .pipe(
        $.revReplace({
          manifest: gulp.src("./public/index-files-versions-manifest.json"),
        })
      )
      .pipe(gulp.dest("./public/", { overwrite: true }));
  })
);
