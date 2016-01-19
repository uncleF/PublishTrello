var BOARD_JSON = (function() {

  var request = require('request-promise');

  function get(link) {
    return request(link);
  }

  return {
    get: get
  };

})();

module.exports = BOARD_JSON;
