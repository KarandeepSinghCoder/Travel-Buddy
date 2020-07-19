//required variables
// console.log(traindata[0].number);
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    vitian  = require("./modles/vitian");
    app.use('/', express.static('public'));
var traindata = require('./public/asserts/data/traindata.json');
var port = process.env.PORT || 3001;


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://travelbuddyvit:Karan@143@travelbuddyvit.3j8c3.mongodb.net/vitian?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });
// client.connect(err => {
// 	   console.log("fail");
//     console.log("err");
// });

mongoose
.connect("mongodb+srv://vitian:vitian.123@travelbuddyvit.3j8c3.mongodb.net/vitian?retryWrites=true&w=majority", {
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
        }
    });
    vitian.find({},function(err, allvitian){
        if(err){
            console.log(err);
        }else{
            res.render("traindetails", {num: trainnumber,name: name,vitian: allvitian});
        }
});
});


app.get("/about",function(req,res){
    res.render("about");
});
    
//server start
    app.listen(port,function(){
        console.log("server is on");
    });
