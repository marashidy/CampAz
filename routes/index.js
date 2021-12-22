const   express     = require("express"),
        router      = express.Router(),
        passport    = require("passport"),
        User        = require("../models/user"),
        middleware  = require("../middleware/index")

//LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
})
//REGISTER
router.get("/register", function(req,res){
    res.render("register");
})

router.post("/register", function(req, res){
    var newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email
    });
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to the CampAz " + user.username);
            res.redirect("/campgrounds");
        })
    })
})
//LOGIN ROUTE
router.get("/login", function(req, res){
    res.render("login");
})

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){});
//LOGOUT ROUTE
router.get("/logout", function(req, res){
    req.flash("success", "You logged out!");
    req.logout();
    res.redirect("/campgrounds");

})

//EXPORT
module.exports = router;