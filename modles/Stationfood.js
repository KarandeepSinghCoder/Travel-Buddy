var  mongoose= require("mongoose");
var Stationfood = new mongoose.Schema({
    Station_Code: String,
    Dish_name: String,
    WP_number: String,
    platform: String,
    Remarks: String
});
module.exports = mongoose.model("Stationfood",Stationfood);