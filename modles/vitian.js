var  mongoose= require("mongoose");
var vitianSchema = new mongoose.Schema({
    train_user: String,
    date: String,
    trainnumber: String,
    name: String,
    number: String,
    CarNumber: String,
    CarSeat: String,
    station: String
});
module.exports = mongoose.model("vitian",vitianSchema);