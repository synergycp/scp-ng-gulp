var settings = require('./settings');

module.exports = production;

function production() {
  return function () {
    settings.isProduction = true;
    settings.useSourceMaps = false;
  };
}
