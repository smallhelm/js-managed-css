var jsToCss = require("./js-to-css");
var insertCss = require("insert-css");

module.exports = function(json){
  var d = jsToCss(json);
  insertCss(d.css);
  return d.vars;
};
