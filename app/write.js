var FILE = (function() {

  var fs = require('fs');

  function file(data, path, ext) {
    fs.writeFile((path + '.' + ext), data);
  }

  return {
    file: file
  };

})();

module.exports = FILE;
