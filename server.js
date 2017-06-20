// Dependencies
var express = require('express');
var handlebars = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');

mongoose.Promise = Promise;

// Initialize Express
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Database Config
//mongoose.connect('mongodb://heroku_knsxcr5v:e8m1p7kckoelh36ehjcrtsbkv@ds129281.mlab.com:29281/heroku_knsxcr5v');
mongoose.connect('mongodb://localhost/mongo-homework');
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

// Routes

app.get();

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
