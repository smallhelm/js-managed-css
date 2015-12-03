# js-managed-css
Define and insert CSS via javascript. This also generates unique class and id names automatically. Handy when doing virtual dom (or react) inline css as your primary styling.

```js
var jsCss = require("js-managed-css");

var btn_height = 10;

var vars = jsCss({
  ".$btn": {
    "color": "blue",
    "height": btn_height + "px",
    ":hover": {
      "color": "red"
    },
    "&.active": {
      "color": "yello"
    }
  },
  "#$nav": {
    "> .$link": {
      "margin": "0 auto"
    }
  }
});

//At this point your css was compiled and inserted into the DOM
//"vars" is an object where the keys are your variable names and
//the values are the generated names

//now in your rendering code you can use variables from your css 
h("a." + vars.btn, "click me")
```

## Why?
Modular css code that lives right next to the js code that depends on it.

## License
MIT
