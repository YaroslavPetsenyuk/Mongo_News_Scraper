var express = require("express");
var router = express.Router();
var db = require("../models");

// Route for updating the article's saved status

router.post("/save-article/:id", function (req, res) {
    db.Article.findOneAndUpdate(
        {
            _id: req.params.id
        },

        {
            $set: { saved: true }
        })

        .then(function (dbArticle) {
            res.json(dbArticle);
        })

        .catch(function (err) {
            res.writeContinue(err);
        });
});

//delete route to remove a single article from savedArticles
router.post("/delete-from-saved/:id", function (req, res) {
    db.Article.findOneAndUpdate(

        {
            _id: req.params.id
        },

        {
            $set: { saved: false }
        })

        .then(function (response) {

            // Rerender saved articles

            res.redirect("/articles/saved/");
        })
        .catch(function (err) {
            res.writeContinue(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note

router.get("/articles/:id", function (req, res) {

    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({
        _id: req.params.id
    })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);

        })
        .catch(function (err) {
            res.writeContinue(err);
        });
});





// Saving an Article's associated Note

router.post("/save-note/:id", function (req, res) {

    console.log("saving / updating note route - req.params.id: " + req.params.id);

    console.log("saving / updating note route - req.body: " + JSON.stringify(req.body));


    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            },
                {
                    $push: {
                        note: dbNote._id
                    }
                },
                {
                    new: true
                }).populate("note");
        })

        // Send back article and its corresponding notes to the client

        .then(function (dbArticle) {
            console.log("dbArticle with notes" + dbArticle);
            res.json({ success: true });
        })
        .catch(function (err) {
            res.writeContinue(err);
        });
});


// Delete One from the DB

router.post("/delete/:id", function (req, res) {

    console.log("Delete Requested");

    console.log("req.params.id: " + req.params.id);

    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                "note": req.params.id
            },
                {
                    "$pull": { "note": req.params.id }
                });

        })
        .then(function (dbArticle) {
            console.log("dbArticle with notes " + dbArticle);
            res.redirect("back");
        })
        .catch(function (err) {
            res.writeContinue(err);
        });
});

module.exports = router;