//required variables
// console.log(traindata[0].number);
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    passport       = require("passport"),
    mongoose       = require("mongoose"),
    localStrategy  = require("passport-local"),
    User           = require("./modles/user"),
    TrainstoBan    = require("./modles/TrainstoBan"),
    TrainstoChe    = require("./modles/TrainstoChe"),
    vitian         = require("./modles/vitian"),
    Stationfood    = require("./modles/Stationfood"),
    cabtoBANGALORE = require("./modles/cabtoBANGALORE"),
    cabtoCHENNAI   = require("./modles/cabtoCHENNAI"),
    contribute     = require("./modles/contribute"),
    review         = require("./modles/review"),
    passportLocalMongoose=require("passport-local-mongoose");
    app.use('/', express.static('public'));

const { check, validationResult } = require('express-validator')

var traindata = require('./public/asserts/data/traindata.json');
var food = require('./public/asserts/data/food.json'); 
var port = process.env.PORT || 3001;
// mongodb+srv://vitian:vitian.123@travelbuddyvit.3j8c3.mongodb.net/vitian?retryWrites=true&w=majority
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
app.use(bodyParser.urlencoded({extended: true})); 
app.set("view engine","ejs");

//passport
app.use(require("express-session")({
    secret: "HIII KARAN",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.get("/",function(req,res){
    //to search train by its number
    res.render("home");
});
app.post("/register",[
    check('username', 'Email is not valid Sign Up Again').isEmail().normalizeEmail(),    
    check('name', 'This username must me 3+ characters long Sign Up Again').exists().isLength({ min: 3 }),
    check('password','The password must have at least 7 character Sign Up Again').exists().isLength({ min: 7 })
],function(req,res){

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const alert = errors.array()
            res.render("home",{alert});
        }
        else{
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username, name:req.body.name,WPnum: req.body.WPnum}),req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("home");
       }
       passport.authenticate("local")(req,res,function(){
           res.redirect("/");
           
       });
    });
    }
});

app.post("/login",passport.authenticate("local",{successRedirect: "/searchTrain",failureRedirect: "/"}),function(req,res){
});

app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.get("/searchTrain",isLoggedIn,function(req,res){
    //to search train by its number
    res.render("searchTrain", {
        user: req.user
      });
});
app.post("/traindetails",[
    check('num','Must be a number of 5 digits').isNumeric().isLength({min: 5, max: 5})
],function(req,res){
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const alert = errors.array()
            res.render("searchTrain",{user: req.user,alert});
        }
        else{
    //to show train details
    var num=req.body.num;
    for(var i = 0; i < traindata.length; i++) {
        var obj = traindata[i];
       if(obj.number==num){
           var id=i;
           break;
       }}
       vitian.find({},function(err, allvitian){
        if(err){
            console.log(err);
        }else{
            res.render("traindetails", {num: num,name: traindata[id].trainName,vitian: allvitian,user: req.user});
        }
});
        }
});
app.post("/traindetails/request",[

    check('name','This username must me 3+ characters').exists().isLength({ min: 3 }),
    check('trainnumber','Must be a number of 5 digits').exists().isLength({min: 5}),
    check('date','Must Enter a valid date').isDate(),
    check('station','Station code must be in Upper Case').isUppercase()

],function(req,res){
    const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const alert = errors.array()
            // res.render("traindetails",{alert,user: req.user});
    var num=req.body.trainnumber;
    for(var i = 0; i < traindata.length; i++) {
        var obj = traindata[i];
       if(obj.number==num){
           var id=i;
           break;
       }}
       vitian.find({},function(err, allvitian){
        if(err){
            console.log(err);
        }else{
            res.render("traindetails",{num: num,name: traindata[id].trainName,vitian: allvitian,user: req.user, alert});
        }
});
        }
        else{
    var train_user=req.user.id;
    var trainnumber=req.body.trainnumber;
    var name= req.body.name;
    var number= req.body.wpnumber;
    var CarNumber=req.body.carnumber;
    var CarSeat= req.body.seatnumber;
    var date= req.body.date;
    var station= req.body.station;
    var newvitian={train_user:train_user,date: date,trainnumber: trainnumber,name: name,number: number,CarNumber: CarNumber,CarSeat: CarSeat,station: station};
    vitian.create(newvitian,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{

            vitian.find({},function(err, allvitian){
                if(err){
                    console.log(err);
                }else{
                    for(var i = 0; i < traindata.length; i++) {
                        var obj = traindata[i];
                       if(obj.number==trainnumber){
                           var id=i;
                           break;
                       }}
                    res.render("traindetails", {num: trainnumber,name: traindata[id].trainName,vitian: allvitian,user: req.user});
                }
        });
        }
    });
}
});

app.get("/cabtobangalore",function(req,res){
    cabtoBANGALORE.find({},function(err, allcabtoBANGALORE){
        if(err){
            console.log(err);
        }else{
            res.render("cabtobangalore", {allcabtoBANGALORE: allcabtoBANGALORE,user: req.user});
        }
}); 
});
app.post("/cabtobangalore",function(req,res){
    var cab_user=req.user.id;
    var Username= req.body.Username;
    var cabprice= req.body.cabprice;
    var WPnumber=req.body.WPnumber;
    var ppp= req.body.ppp;
    var numberOfSeats= req.body.numberOfSeats;
    var freeSeats=req.body.freeSeats;
    var dateOfTravel= req.body.dateOfTravel;
    var newcabtobangalore={cab_user: cab_user,Name: Username, Cab_Price:cabprice, WhatsApp:WPnumber, ppp:ppp, Number_of_seats:numberOfSeats,Free_Seats:freeSeats,Date_Of_travel:dateOfTravel};
    cabtoBANGALORE.create(newcabtobangalore,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            cabtoBANGALORE.find({},function(err, allcabtoBANGALORE){
                if(err){
                    console.log(err);
                }else{
                    res.render("cabtobangalore", {allcabtoBANGALORE: allcabtoBANGALORE,user: req.user});
                }
        });        
    }
    });
});

app.get("/cabtochennai",function(req,res){
    cabtoCHENNAI.find({},function(err, allcabtoCHENNAI){
        if(err){
            console.log(err);
        }else{
            res.render("cabtochennai", {allcabtoCHENNAI: allcabtoCHENNAI,user: req.user});
        }
}); 
});
app.post("/cabtochennai",function(req,res){
    var cab_user=req.user.id;
    var Username= req.body.Username;
    var cabprice= req.body.cabprice;
    var WPnumber=req.body.WPnumber;
    var ppp= req.body.ppp;
    var numberOfSeats= req.body.numberOfSeats;
    var freeSeats=req.body.freeSeats;
    var dateOfTravel= req.body.dateOfTravel;
    var newcabtochennai={cab_user:cab_user, Name: Username, Cab_Price:cabprice, WhatsApp:WPnumber, ppp:ppp, Number_of_seats:numberOfSeats,Free_Seats:freeSeats,Date_Of_travel:dateOfTravel};
    cabtoCHENNAI.create(newcabtochennai,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            cabtoCHENNAI.find({},function(err, allcabtoCHENNAI){
                if(err){
                    console.log(err);
                }else{
                    res.render("cabtochennai", {allcabtoCHENNAI: allcabtoCHENNAI,user: req.user});
                }
        });        
    }
    });
});
//////////////////////////////////////////

app.get("/preferedtrainstoBANGALORE",function(req,res){
    TrainstoBan.find({}, null, {sort: {points: -1}},function(err, allTrainstoBan){
        if(err){
            console.log(err);
        }else{
            res.render("TrainBANGALORE", {user: req.user,allTrainstoBan: allTrainstoBan});
        }
});
});

app.post("/preferedtrainstoBANGALORE",function(req,res){
    var trainnum=req.body.NumeofTrain;
    TrainstoBan.findOneAndUpdate({Num: trainnum},{ $inc: {'points': 1 } }, {new: true },function(err, response) {
        if (err) {
        console.log(err);
       } else {
        TrainstoBan.find({},null, {sort: {points: -1}},function(err, allTrainstoBan){
            if(err){
                console.log(err);
            }else{
                res.render("TrainBANGALORE", {allTrainstoBan: allTrainstoBan,user: req.user});
            }
    });
              }
});
});

app.get("/preferedtrainstoCHENNAI",function(req,res){
    TrainstoChe.find({}, null, {sort: {points: -1}},function(err, allTrainstoChe){
        if(err){
            console.log(err);
        }else{
            res.render("TrainCHENNAI", {user: req.user,allTrainstoChe: allTrainstoChe});
        }
});
});
app.post("/preferedtrainstoCHENNAI",function(req,res){
    var trainnum=req.body.NumeofTrain;
    TrainstoChe.findOneAndUpdate({Num: trainnum},{ $inc: {'points': 1 } }, {new: true },function(err, response) {
        if (err) {
        console.log(err);
       } else {
        TrainstoChe.find({},null, {sort: {points: -1}},function(err, allTrainstoChe){
            if(err){
                console.log(err);
            }else{
                res.render("TrainCHENNAI", {allTrainstoChe: allTrainstoChe,user: req.user});
            }
    });
            }
});
});
//////////////////////////////////////////
// *******************FOOD STARTS**********************
app.get("/food",function(req,res){
    res.render("food",{food: food});
});

app.post("/Stationfood",[
    check('Station_Code','Must Be in Caps').isUppercase()
],function(req,res){
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const er = errors.array()
        res.render("food",{user: req.user,er});
    }
    else{
    var Station_Code= req.body.StationCode;
    var Dish_name= req.body.dish_name;
    var WP_number=req.body.WP_number;
    var platform= req.body.platform;
    var Remarks= req.body.Remarks;
    var newStatoinfood={Station_Code: Station_Code, Dish_name:Dish_name, WP_number:WP_number, platform:platform, Remarks:Remarks};
    Stationfood.create(newStatoinfood,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/food");
        }
    });
}
});

app.post("/ViewStationfood",[
    check('stationCode','Enter a valid station code').isUppercase().isLength({ min: 3, max:4 })
],function(req,res){
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const alert = errors.array()
        res.render("food",{food: food,user: req.user,alert});
    }
    else{
    var stationCode=req.body.stationCode;
    Stationfood.find({},function(err, allStationfood){
        if(err){
            console.log(err);
        }else{
            res.render("ViewStationfood", {stationCode: stationCode,Stationfood: allStationfood});
        }
});
    }
});
// *******************FOOD ENDS**********************
// ********************************Profile********************************

app.get("/profile",function(req,res){
    vitian.find({train_user: req.user.id},function(err, allvitian){
        if(err){
            console.log(err);
        }else{
            // return allvitian;
            cabtoBANGALORE.find({cab_user: req.user.id},function(err, allcabtoBANGALORE){
                if(err){
                    console.log(err);
                }else{
                    cabtoCHENNAI.find({cab_user: req.user.id},function(err, allcabtoCHENNAI){
                        if(err){
                            console.log(err);
                        }else{
                            res.render("profile",{user: req.user,vitian: allvitian,allcabtoBANGALORE: allcabtoBANGALORE,allcabtoCHENNAI: allcabtoCHENNAI});
                        }
                });
                }
        });
        }
});
});
//*****************clear queries of profile *************************/
app.post('/clearbangaloredata',function(req,res){
    cabtoBANGALORE.deleteMany({cab_user: req.user.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/profile");
        }
    });
});

app.post('/clearchennaidata',function(req,res){
    cabtoCHENNAI.deleteMany({cab_user: req.user.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/profile");
        }
    });
});
app.post('/cleartravellingdata',function(req,res){
    vitian.deleteMany({train_user: req.user.id},function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/profile");
        }
    });
});
// ********************************Profile Ends********************************
app.post("/contribute",function(req,res){
    var emailContributer = req.body.emailContributer;
    var issueContributer = req.body.issueContributer;
    var sollution        = req.body.sollution;
    var newcontribute={emailContributer: emailContributer, issueContributer:issueContributer, sollution: sollution};
    contribute.create(newcontribute,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/searchTrain");
             }

    });
});


// *************************** Review ****************************
app.post("/review",function(req,res){
    var trainnum=req.body.num;
    review.find({trainnumber: trainnum},function(err, allreview){
        if(err){
            console.log(err);
        }else{
            res.render("review", {allreview: allreview,user: req.user,trainnum: trainnum});
        }
});
});
app.post("/newreview",function(req,res){
    var num      = req.body.trainnum;
    var reviewpoints  = req.body.reviewpoints;
    var reviewRemarks = req.body.reviewRemarks;
    var newreview={trainnumber: num, points:reviewpoints, Remarks: reviewRemarks};
    console.
    review.create(newreview,function(err,newreview){
        if(err){
            console.log(err);
        }else{
            for(var i = 0; i < traindata.length; i++) {
                var obj = traindata[i];
               if(obj.number==num){
                   var id=i;
                   break;
               }}
               vitian.find({},function(err, allvitian){
                if(err){
                    console.log(err);
                }else{
                    res.render("traindetails", {num: num,name: traindata[id].trainName,vitian: allvitian,user: req.user});

                }
        });
            }
        }
    )
});
// *************************** Review ****************************
    app.listen(port,function(){
        console.log("server is on");
    });
