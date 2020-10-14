var  mongoose= require("mongoose");
var TrainstoBan = new mongoose.Schema({
  cab_user: String,  
  Num: String,
    NameofTrain: String,
    Dates_of_running: String,
    hr: String,
    // points: int
    points: {
        type     : Number,
        validate : {
          validator : Number.isInteger,
          message   : '{VALUE} is not an integer value'
        }
      }
});
module.exports = mongoose.model("TrainstoBan",TrainstoBan);