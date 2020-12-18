var express = require('express');
var fs = require('fs');

var app = express();

var files = fs.readdirSync('./models');

files.forEach(file => require(file)(app));

var files = fs.readdirSync('./controllers');

files.forEach(file => require(file)(app));

app.listen(3000);