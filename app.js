const   express                 = require("express"),
        app                     = express(),
        passport                = require("passport"),
        bodyParser              = require("body-parser"),
        mongoose                = require("mongoose"),
        methodOverride          = require("method-override"),
        flash                   = require("connect-flash"),
        Camp                    = require("./models/campground"),
        Comment                 = require("./models/comment"),
        User                    = require("./models/user"),
        localStrategy           = require("passport-local"),
        passportLocalMon        = require("passport-local-mongoose");
    
/********************************************* */
//setting up momment.js
app.locals.moment = require('moment');
//REQUIRING ROUTES
const   indexRoutes      = require("./routes/index"),
        campgroundRoutes = require("./routes/campgrounds"),
        commentRoutes    = require("./routes/comments")  

//CONNECTING TO DB
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

//app.use("/admin", adminRoutes);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Cherry in deep sleep",
    resave: false,
    saveUninitialized: false
   
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
})

//USING ROUTES
//APP USE
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3333, function(){
    console.log("SERVER 3333 HAS STARTED");
})