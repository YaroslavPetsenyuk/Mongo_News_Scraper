var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

var articleRoutes = require("./routes/article");
var indexRoutes = require("./routes/index");
var path = require("path");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.use(express.static(path.join(__dirname, "/public")));

// Define which routes to use
app.use("/", indexRoutes);
app.use("/articles", articleRoutes);

// Set handlebars as the default templating engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Start Server
app.listen(PORT, function() {
	console.log("App running on port " + PORT + "!");
});