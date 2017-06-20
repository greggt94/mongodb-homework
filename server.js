// Dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');
var Article = require('./models/Article.js');
var Note = require('./models/Note.js');

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// Setting up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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

app.get('/', function(req, res) {

    request("http://www.nytimes.com/", function(error, response, html) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            // Using our Article model, create a new entry
            // This effectively passes the result object to the entry (and the title and link)
            var entry = new Article(result);

            // Now, save that entry to the db
            entry.save(function(err, doc) {
                // Log any errors
                if (err) {
                    console.log(err);
                }
                // Or log the doc
                else {
                    console.log(doc);
                }
            });

        });
        // Tell the browser that we finished scraping the text
        res.render("articles");
    });
});

app.get("/articles", function(req, res) {

    Article.find({}, function(err, doc) {

        if (err) {
            res.send(err);
        } else {
            res.json(doc);
        }
    }).limit(10);

});

app.post("/articles/:id", function(req, res) {

    var newNote = new Note(req.body);

    newNote.save(function(err, doc) {

        if (err) {
            console.log(err);
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id }).exec(function(err, newDoc) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(newDoc);
                }

            });

        }

    });

});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
