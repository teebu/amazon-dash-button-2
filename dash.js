var open = require('open');
var dash_button = require('node-dash-button-winpcap');
var dash = dash_button(["44:65:0d:b3:fb:e6"]); // get the mac address of dash buttons

dash.on("detected", function (dash_id){
  // todo: do stuff here
  console.log("omg found", dash_id);
  open('https://www.youtube.com/watch?v=oHg5SJYRHA0');
});