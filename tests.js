var test = require("tape");
var replaceVars = require("./replace-vars");

test("replace-vars", function(t){
  var fn = function(txt){
    return replaceVars(txt, function(v){
      return "[" + v + "]";
    });
  };

  t.equals(fn("$one"), "[one]");
  t.equals(fn(".$two"), ".[two]");
  t.equals(fn(".$a.$b#$c:hover>$d"), ".[a].[b]#[c]:hover>[d]");
  t.equals(fn(".one:two$three-4 .$f1_ve.$ok"), ".one:two[three-4] .[f1_ve].[ok]");

  t.end();
});
