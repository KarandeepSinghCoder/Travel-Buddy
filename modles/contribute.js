var  mongoose= require("mongoose");
var contribute = new mongoose.Schema({
    emailContributer: String,
    issueContributer: String,
    sollution: String
});
module.exports = mongoose.model("contribute",contribute);