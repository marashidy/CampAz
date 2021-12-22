const   express     = require("express"),
        router      = express.Router({ mergeParams: true}),
        Camp        = require("../models/campground"),
        Comment     = require("../models/comment"),
        middleware  = require("../middleware/index");




//COMMENTS
router.get("/new", middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(err, campground){
        if(err) req.flash("error", "Oops, something went wrong!");
        else{
            res.render("comments/newcmt", {campground : campground});
        }
    })
})
router.post("/", middleware.isLoggedIn, function(req, res){
Camp.findById(req.params.id, function(err, campground){
    if(err) {
        req.flash("error", "Oops, something went wrong!");
        res.redirect("/campgrounds/"+campground._id);
    }
    else{
        Comment.create(req.body.comment, function(err, comment){
            if(err) req.flash("error", "Oops, something went wrong!");
            else{
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Your comment has been added!");
                res.redirect("/campgrounds/"+campground._id);
            }
        })
    }
  
})
})
//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/editcmt", {campground_id : req.params.id, comment : foundComment});
        }
    })

})
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,
         function(err, updatedComment){
            if(err){
                req.flash("error", "Oops, something went wrong!");
                res.redirect("back");
            }else{
                req.flash("success", "Your comment has been updated!")
                res.redirect("/campgrounds/" + req.params.id);
            }
    })
})
//REMOVE COMMENT
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Oops, something went wrong!");
            res.redirect("back");
        }else{
            req.flash("success", "Comment has been removed!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

//EXPORT
module.exports = router;