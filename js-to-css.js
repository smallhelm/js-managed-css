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

var renderProperties = function(properties){
  return map(properties, function(val, key){
    return key + ":" + val;
  }).join(";");
};

var renderRules = function(rules){
  return map(rules, function(val, key){
    return key + "{" + renderProperties(val) + "}";
  }).join("\n");
};

var keyToRule = function(context, key_orig){
  var key = key_orig.replace(/\s+/, " ").replace(/^\s+/, "").replace(/\s+$/, "");
  if(key[0] === ":"){
    return context + key;
  }else if(key[0] === "&"){
    return context + key.substring(1);
  }
  return (context + " " + key).replace(/^\s+/, "");
};

module.exports = function(json){
  var rules = {};
  var var_cache = {};

  var cleanKey = function(key_orig){
    var key = key_orig.replace(/\s+/, " ").replace(/^\s+/, "").replace(/\s+$/, "");
    return replaceVars(key, function(v){
      if(!var_cache.hasOwnProperty(v)){
        var_cache[v] = gen();
      }
      return var_cache[v];
    });
  };

  var recurseRules = function(context, o){
    map(o, function(val, key){
      if(Object.prototype.toString.call(val) === "[object Object]"){
        recurseRules(keyToRule(context, cleanKey(key)), val);
      }else{
        if(!rules.hasOwnProperty(context)){
          rules[context] = {};
        }
        rules[context][key] = val;
      }
    });
  };
  recurseRules("", json);

  return {
    css: renderRules(rules),
    vars: var_cache
  };
};
