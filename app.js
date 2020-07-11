//required variables
var traindata = require('./asserts/data/traindata.json');
// console.log(traindata[0].number);
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    vitian  = require("./modles/vitian");
mongoose
.connect("mongodb://localhost/vitian", {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
    console.log("fail");
    console.log(err);
});
// vitian.create(
//         {
//             date: "25/11/2020",
//         	trainnumber: "12757",
//             name: "KD",
//             number: "9090262977",
//             CarNumber: "B2",
//             CarSeat: "56"
//         },function(err,campground){
//             if(err){
//                 console.log("error");
//             }else{
//                 console.log("New Vitian ");
//                 console.log(vitian);
//             }
//         });

app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine","ejs");
//routes

app.get("/",function(req,res){
    //to search train by its number
    res.render("searchTrain");
});
app.post("/traindetails",function(req,res){
    //to show train details
    var num=req.body.num;
    for(var i = 0; i < traindata.length; i++) {
        var obj = traindata[i];
       if(obj.number==num){
        // console.log("found");
           var id=i;
           break;
       }}
       vitian.find({},function(err, allvitian){
        if(err){
            console.log(err);
        }else{
            res.render("traindetails", {num: num,name: traindata[id].trainName,vitian: allvitian});
        }
});
});
app.post("/traindetails/request",function(req,res){
    var trainnumber=req.body.trainnumber;
    var name= req.body.name;
    var number= req.body.wpnumber;
    var CarNumber=req.body.carnumber;
    var CarSeat= req.body.seatnumber;
    var date= req.body.date;

    var newvitian={date: date,trainnumber: trainnumber,name: name,number: number,CarNumber: CarNumber,CarSeat: CarSeat};
    vitian.create(newvitian,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            console.log("new vitian");
            console.log(newvitian);
            res.render("traindetails", {num: trainnumber,name: name,vitian: newvitians});
        }
    });

});


app.get("/about",function(req,res){
    res.render("about");
});
    
//server start
    app.listen(3001,'localhost',function(){
        console.log("server is on");
    });
