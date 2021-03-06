// Require Liberaries
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scrapping Tools
var axios = require("axios");
var cheerio = require("cheerio");

//Data base require all models
var db = require("./models")
var PORT = process.env.PORT || 3000;

//initialize express
var app = express();

app.use(logger("dev"));
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scapeHWdb", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

//-------------------------------------------------Routes-------------------------------------------------------    
app.get("/", function (req, res) {
    res.render("index");
})
// Scrape route for scraping the Website
app.get("/scrape", function (req, res) {
    axios.get("https://myanimelist.net/news").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.news-unit").each(function (i, element) {

            var image = $(element).find("img").attr("src");
            // console.log(image);
            var title = $(element).find(".news-unit-right").find("p.title").text().trim();
            var link = $(element).find(".news-unit-right").find("p.title").find("a").attr("href");
            var description = $(element).find(".news-unit-right").find("div.text").text().trim();

            var result = {
                image: image,
                title: title,
                link: link,
                description: description,
                saved: false
            };

            db.News.create(result).then(function (data) {
                // console.log(data);
            }).catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
            if (i > 10) {
                return false;
            }
        }).then(delay());
    });
    function delay() {
        db.News.find({}).limit(11).then(function (data) {
            res.render("index", {
                News: data
            });
        });
    }
});

app.get("/clear", function (req, res) {
    db.News.deleteMany({}, function (err, data) {
        if (err) {
            console.log(err)
        }
    });
    res.render("index");
});

//display saved article
app.get("/saved", function (req, res) {
    db.News.find({ "saved": true }).then(function (result) {
        res.render("index", {
            News: result
        });
    });
});

// Save Article
app.post("/saved/:id", function (req, res) {
    db.News.findOneAndUpdate({ "_id": req.params.id }, { "$set": { "saved": true } })
        .then(function (result) {
            res.json(result);
        }).catch(function (err) {
            res.json(err);
        });
});

app.get("/api/news", function (req, res) {
    db.News.find({})
        .then(function (result) {
            res.send(result);
        }).catch(function (err) {
            res.json(err);
        });
});

app.get("/news/:id", function (req, res) {
    // console.log(req.params.id)
    db.News.findOne({ "_id": req.params.id })
        .populate("note")
        .then(function (note) {
            res.json(note);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/news/:id", function (req, res) {
    console.log(req.params);
    db.Note.create(req.body)
        .then(function (note) {
            return db.News.findOneAndUpdate(
                { "_id": req.params.id },
                { $push: { "note": note._id } },
                { new: true });
        })
        .then(function (data) {
            res.json(data);
        });
});

app.listen(PORT, function () {
    console.log("App running on http://localhost:" + PORT);
});




