var  mongoose= require("mongoose");
var vitianSchema = new mongoose.Schema({
    date: String,
    trainnumber: String,
    name: String,
    number: String,
    CarNumber: String,
    CarSeat: String
});
module.exports = mongoose.model("vitian",vitianSchema);