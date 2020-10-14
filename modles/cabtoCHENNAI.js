var  mongoose= require("mongoose");
var cabtoCHENNAI = new mongoose.Schema({
    cab_user: String,
    Name: String,
    Cab_Price: String,
    WhatsApp: String,
    ppp: String,
    Number_of_seats: String,
    Free_Seats: String,
    Date_Of_travel:String
});
module.exports = mongoose.model("cabtoCHENNAI",cabtoCHENNAI);