var dash_button = require('node-dash-button');
var dash = dash_button(["44:65:0d:b3:fb:e6"]); // get the mac address of dash buttons

dash.on("detected", function (dash_id){
  // todo: do stuff here
  console.log("omg found", dash_id);
});