var BOARD_JSON = (function() {

  var request = require('request');

  function get(link, callback) {
    request(link, function(error, response, data) {
      if (!error && response.statusCode === 200) {
        callback(JSON.parse(data));
      }
    });
  }

  return {
    get: get
  };

})();

module.exports = BOARD_JSON;
