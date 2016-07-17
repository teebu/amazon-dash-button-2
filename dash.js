var dash_button = require('node-dash-button');
var dash = dash_button(["44:65:0d:b3:fb:e6"]); // get the mac address of dash button
dash.on("detected", function (dash_id){
  console.log("omg found", dash_id);
});