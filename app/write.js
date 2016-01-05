var FILE = (function() {

  var fs = require('fs');

  function file(data, path, ext) {
    fs.writeFile((path + '.' + ext), data, function(error) {
      if (error) {
        console.error(error);
        return false;
      }
      return true;
    });
  }

  return {
    file: file
  };

})();

module.exports = FILE;
