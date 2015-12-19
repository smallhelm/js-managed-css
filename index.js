var jsToCss = require("./js-to-css");
var insertCss = require("insert-css");

var css = "";
var has_inserted_batch = false;
setTimeout(function(){
  if(css.length > 0){
    insertCss(css);
    has_inserted_batch = true;
  }
}, 1);

module.exports = function(json){
  var d = jsToCss(json);
  if(has_inserted_batch){
    insertCss(d.css);
  }else{
    css += "\n" + d.css;
  }
  return d.vars;
};
