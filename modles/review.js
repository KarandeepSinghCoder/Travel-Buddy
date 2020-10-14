var  mongoose= require("mongoose");
var review = new mongoose.Schema({
    trainnumber: String,
    points: Number,
    Remarks: String
});
module.exports = mongoose.model("review",review);