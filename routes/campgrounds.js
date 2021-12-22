const   express     = require("express"),
        router      = express.Router(),
        Camp        = require("../models/campground"),
        middleware  = require("../middleware/index");
//Setting relative time with moment.js


router.get("/", function(req, res){
    Camp.find({}, function(err, allCamps){
        if(err){
            console.log(err);
        }
         else{
            res.render("campgrounds/index", { campgrounds : allCamps });
    
        }
    }) 
      
})

//NEW CAMPGROUND
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/newcamp");
})

router.post("/", middleware.isLoggedIn, function(req,res){
    var name        = req.body.name;
    var price       = req.body.price;
    var image       = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name : name, price : price, image : image, description : description, author : author};
    Camp.create(newCampground, function(err, newlyCreated){
        
        if(err) req.flash("error", "There was a problem while adding Campground! Please, try again.");
        else  {
            req.flash("success", "Campground has been added succesfully!");
            res.redirect("/campgrounds");
        }
    })
   
    
   
})
//SHOW CAMPGROUND
router.get("/:id", function(req,res){
    Camp.findById(req.params.id).populate("comments").exec( function(err, foundCamp){
    if(err){
        req.flash("error", "Oops, someting went wrong!");
    }
    else{
        res.render("campgrounds/show", {campground : foundCamp});
    }  
    })
})  
//EDIT CAMPGROUND
router.get("/:id/edit", middleware.checkCampOwnership, function(req, res){

        Camp.findById(req.params.id, function(err, foundCamp){
             res.render("campgrounds/editcamp", {campground: foundCamp});      
        })

})
//UPDATE CAMPGROUND
router.put("/:id", middleware.checkCampOwnership, function(req, res){
//find and update the correct campground
    Camp.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err) {
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/campgrounds/" + req.params.id);
        }
//redirect somewhere(e.g. show page) 
        else{
            req.flash("success", "Campground info has been updated!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })

})
//REMOVE CAMPGROUND
router.delete("/:id", middleware.checkCampOwnership, function(req, res){
  
    Camp.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("/campgrounds/"+req.params.id);
        }else{
            req.flash("success", "Campground has been removed!");
            res.redirect("/campgrounds");
        }
    })
})


//EXPORT
module.exports = router;