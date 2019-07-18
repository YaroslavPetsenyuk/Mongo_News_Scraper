var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

	title: {

		type: String,

		required: true,

		unique : true

	},


	link: {

		type: String,

		required: true

	},
// This determines whether the article is saved or not.
	saved: {

		type: Boolean,

		default: false

	},

// Creating this note object to reference the object ID to our note model so that we can assosiacte correct note to the article

	note: [
		{
			type: Schema.Types.ObjectId,

			ref: "Note"
		}
	]
});



// Creating a model from above schema.

var Article = mongoose.model("Article", ArticleSchema);



// Exporting the article model

module.exports = Article;