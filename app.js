var express = require('express');
var app = express();
var fs = require('fs');
var twitter = require('./server/services/twitter.js')(app);


app.get('/',function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/*', function (req, res) {
  var file = req.params[0]; 
  res.sendFile( __dirname + '/public/' + file );
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});