var open = require('open');
var request = require('request');

var dash_button = require('node-dash-button-winpcap');
var dash = dash_button(["44:65:0d:b3:fb:e6"]); // get the mac address of dash buttons

dash.on("detected", function (dash_id){
  // todo: do stuff here
  console.log("found:", dash_id);

  // open the brwoser to any url (youtube video)
  //open('https://www.youtube.com/watch?v=oHg5SJYRHA0');

  // load a url (my music players pause/play)
  //doRequest('http://127.0.0.1:8888/pluginrpc/Obyekt%20666%20C2.0/do/pp') // pause/play
  doRequest('http://127.0.0.1:8888/pluginrpc/Obyekt%20666%20C2.0/do/ne') // next song

});


function doRequest(requestUrl, method, options, callback) {
  options = options || {}
  options.query = options.query || {}
  options.json = options.json || false
  options.headers = options.headers || {}

  var reqOpts = {
    url: requestUrl,
    method: method || 'GET',
    qs: options.query,
    body: options.body,
    json: options.json,
    headers: options.headers
  }

  request(reqOpts, function onResponse(error, response, body) {
    if (error) {
      console.log("there was an error");
      console.log(error);
    }
    if (response.statusCode === 401) {
      console.log("Not authenticated");
      console.log(error);
    }
    if (response.statusCode !== 200) {
      console.log("Not a 200");
      console.log(error);
    }

    if (callback) {
      callback(error, response, body)
    }
  })
}