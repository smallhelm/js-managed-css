var gen = require("gen-css-identifier");
var replaceVars = require("./replace-vars");

var map = function(obj, fn){
  var r = [];
  for(k in obj){
    if(obj.hasOwnProperty(k)){
      r.push(fn(obj[k], k));
    }
  }
  return r;
};

var normalizeWhitespace = function(str){
  return str.replace(/\s+/g, " ").replace(/^\s+/, "").replace(/\s+$/, "");
};

var renderProperties = function(properties){
  return map(properties, function(val, key){
    return normalizeWhitespace(key) + ":" + normalizeWhitespace(val + "");
  }).join(";");
};

var renderRules = function(rules){
  return map(rules, function(group_rules, group){

    var group_css = map(group_rules, function(properties, key){
      return normalizeWhitespace(key) + "{" + renderProperties(properties) + "}";
    }).join("\n");

    return group.length > 0
      ? group + "{" + group_css + "}"
      : group_css;
  }).join("\n");
};

var keyToRule = function(context, key){
  return map(context.split(","), function(c){
    return map(key.split(","), function(p){
      p = normalizeWhitespace(p);

      if(p[0] === ":"){
        return c + p;
      }else if(p[0] === "&"){
        return c + p.substring(1);
      }
      return (c + " " + p).replace(/^\s+/, "");
    }).join(",");
  }).join(",");
};

module.exports = function(json){
  var rules = {};
  var var_cache = {};

  var normalizeAndApplyVars = function(key){
    return replaceVars(normalizeWhitespace(key), function(v){
      if(!var_cache.hasOwnProperty(v)){
        var_cache[v] = gen();
      }
      return var_cache[v];
    });
  };

  var recurseRules = function(group, context, o){
    map(o, function(val, key){
      if(/^@/.test(key)){
        recurseRules(keyToRule(context, normalizeAndApplyVars(key)), context, val);
      }else if(Object.prototype.toString.call(val) === "[object Object]"){
        recurseRules(group, keyToRule(context, normalizeAndApplyVars(key)), val);
      }else{
        if(!rules.hasOwnProperty(group)){
          rules[group] = {};
        }
        if(!rules[group].hasOwnProperty(context)){
          rules[group][context] = {};
        }
        rules[group][context][key] = normalizeAndApplyVars(val + "");
      }
    });
  };
  recurseRules("", "", json);

  return {
    css: renderRules(rules),
    vars: var_cache
  };
};
