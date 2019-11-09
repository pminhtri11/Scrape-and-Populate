var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var NewSchema = new Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }],
    description: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    }
});

var News = mongoose.model("News", NewSchema);

module.exports = News;