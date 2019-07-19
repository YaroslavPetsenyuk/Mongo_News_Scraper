var express = require("express");

var router = express.Router();

var db = require("../models");

var axios = require("axios");

var cheerio = require("cheerio");

router.get("/", function(req, res) {

	db.Article.find({}).sort({created: -1}).limit(20)

		.then(function(article) {

			res.render("index", { articles: article });

		})

		.catch(function(err) {

			res.writeContinue(err);

		});

});

// Route to display saved articles

router.get("/articles/saved/", function(req, res) {

	db.Article.find({saved: true}).sort({created: -1}).limit(20).populate("note")

		.then(function(article) {

			res.render("savedArticles", { articles: article });

		})

		.catch(function(err) {

			res.writeContinue(err);

		});

});

// Scrape function

router.get("/scrape", function(req, res) {


	axios.get("https://longform.org/").then(function(response) {

		var $ = cheerio.load(response.data);

		$("h3.title").each(function(i, element) {

			var result = {};

			result.title = $(this).parent("a").text();

			result.link = $(this).parent("a").attr("href");

			db.Article.create(result)

				.then(function(dbArticle) {
					console.log("This is the created dbArticle" + dbArticle);

				})

				.catch(function(err) {
					res.writeContinue(err);
				});
        });
        
		res.send("Scrape Complete");
	});
});



// route to delete article

router.delete("/deleteArticle/:id", function(req,res){
	db.Article.remove({_id: req.params.id})

		.then(function(dbArticle) {
	res.json(dbArticle);
		}) 
		.catch(function(err) {
			res.writeContinue(err);
		});  
});


router.get("/clear-articles", function(req, res) {

	db.Article.remove({}, function(error, response) {


		if (error) {
			res.writeContinue(err);
		}

		else {
			console.log(response);
			res.send(response);
		}
	});
});



module.exports = router;