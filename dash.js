var open = require('open'),
    request = require('request'),
    dash_button = require('node-dash-button-winpcap'),
    Twitter = require('twitter'),
    debug = false,
    enableITTT = false

//twitter stuff
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var dash = dash_button(["44:65:0d:b3:fb:e6", "44:65:0d:f0:ad:61"]); // get the mac address of dash buttons

dash.on("detected", function (dash_id){
  // todo: do stuff here
  console.log("found:", dash_id);

  // open the brwoser to any url (youtube video)
  //open('https://www.youtube.com/watch?v=oHg5SJYRHA0');

  // load a url (my music players pause/play)
  if (dash_id == "44:65:0d:b3:fb:e6"){ // redbull
    doRequest('http://127.0.0.1:8888/pluginrpc/Obyekt%20666%20C2.0/do/pp') // pause/play
  }

  if (dash_id == "44:65:0d:f0:ad:61"){ // fiji
    doRequest('http://127.0.0.1:8888/pluginrpc/Obyekt%20666%20C2.0/do/ne') // next song
  }

  // post tweet
  var tweet = 'Hello, it is ' + new Date()
  if (enableITTT) tweet += ' #button01 activated!' // enable ITTT to do stuff, it is triggers on #button01 hashtag
  //postTweet(tweet, function(err,res){ console.log('Tweet:', res.text) })

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

function postTweet(text, callback){
  client.post('statuses/update', {status: text},  function(error, tweet, response){
    if(error) console.log(error)
    if (debug) console.log(tweet.text);  // Tweet body.
    //console.log(response);  // Raw response object.
    return callback(error,tweet)
  });
}