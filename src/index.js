module.exports = function (gulp) {
  var build = gulp;
  require('./settings').gulp = gulp;

  build.require = shimRequire;

  return build;
};

function shimRequire(name) {
  return require('./'+name);
}
