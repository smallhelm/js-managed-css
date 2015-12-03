module.exports = function(key, varToCSS){
  var path = "";
  var buff = "";
  var is_in_var = false;
  var i, c;
  for(i=0; i < key.length; i++){
    c = key[i];
    if(is_in_var){
      if(/^[a-zA-Z0-9\-_]$/.test(c)){
        buff += c;
      }else{
        path += varToCSS(buff);
        is_in_var = false;
        buff = "";
      }
    }
    if(c === "$"){
      is_in_var = true;
      buff = "";
    }else if(!is_in_var){
      path += c;
    }
  }
  if(is_in_var && buff.length > 0){
    path += varToCSS(buff);
  }
  return path;
};
