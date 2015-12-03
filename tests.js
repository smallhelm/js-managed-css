var test = require("tape");
var jsToCss = require("./js-to-css");
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

test("js-to-css", function(t){
  t.deepEquals(jsToCss({
    ".$one": {
      "color": "blue",
      "height": 10,
      ":hover": {
        "color": "red",
        "> .$two": {
          "margin": "0 auto"
        }
      }
    },
    ".$two": {
      "position": "relative",
      "&.$three": {
        "color": "#00F"
      }
    }
  }), {
    css: ".g1{color:blue;height:10}\n.g1:hover{color:red}\n.g1:hover > .g2{margin:0 auto}\n.g2{position:relative}\n.g2.g3{color:#00F}",
    vars: {
      one: "g1",
      two: "g2",
      three: "g3"
    }
  });
  t.end();
});
