var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

	body: String,

	createDate: {

		type: Date,

		default: Date.now
	}
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;