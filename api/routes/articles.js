var app = require("express");
var router = app.Router();

const Article = require("../../models/article");
const checkAuth = require("../../middleware/check-auth");

router.get("/", (req, res, next) => {
  var origin = req.headers.origin;
  console.log("Articles GET request by: " + origin);
  Article.find({}, (err, allArticles) => {
	  if (err) {
		console.log("Failure.");
		console.log(err);
		res.status(500).json({
			message: "An error occured. Could not retrieve articles."
		});
	  } else {
		if (!allArticles) {
			console.log("Error: No articles found.");
			res.status(404).json({
				message: "Error: No articles found."
			});
		} else {
			console.log("Success.");
			res.status(200).json(allArticles);
		}
	  }
  });
});

router.get("/:id", (req,res,next) => {
	var id = req.params.id;
	var origin = req.headers.origin;
	console.log("Article (id: " + id + ") requested by: " + origin);
	Article.findOne({_id: id}, (err, foundArticle) => {
		if (err) {
			console.log("Failure.");
			console.log(err);
			res.status(500).json({
				message: "An error occured. Could not retrieve article."
			});
		} else {
			if (!foundArticle) {
				console.log("Error: Article not found.");
				res.status(404).json({
					message: "Error: Article not found."
				});
			} else {
				console.log("Success.");
				res.status(200).json(foundArticle);
			}
		}
	});
});

router.post("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  console.log("Articles POST request by: " + origin);
  if (req.body === {}) {
    res.status(400).send("Error: Emtpy request.");
  } else {
    var newArticleData = req.body;
    console.log(newArticleData);
    Article.create(newArticleData, err => {
      if (!err) {
        res.status(201).send("Success. New article created.");
        console.log("Success.");
      } else {
        res.status(500).send("An error occured. Could not create article.");
        console.log(err);
        console.log("Failure.");
      }
    });
  }
});

router.put("/", checkAuth, (req, res, next) => {
  var origin = req.headers.origin;
  console.log("Articles PUT request by: " + origin);
  var data = req.body;
  Article.replaceOne({ _id: data._id }, data, err => {
    if (err) {
      console.log(err);
      console.log("Failure.");
      res.status(500).json({ message: "Failed to update article." });
    } else {
      console.log("Success.");
      res.status(200).json({ message: "Updated article." });
    }
  });
});

module.exports = router;