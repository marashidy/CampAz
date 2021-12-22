var Camp        = require("../models/campground"),
    Comment     = require("../models/comment"),
    midwareObj = {};
//checkCampOwnership
midwareObj.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if(err) {
                req.flash("error", "Oops, someting went wrong!");
                res.redirect("back");
            }
            else{
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Sorry, you do not have permission for this!");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Please, log in first to do that!");
        res.redirect("/login");     
    }
}
//checkCommentOwnership
midwareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash("error", "Oops, someting went wrong!");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Sorry, you do not have permission for this!");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.flash("error", "Please, log in first to do that!");
        res.redirect("/login");     
    }
}
//IS LOGGED IN
midwareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please, log in first to do that!");
    res.redirect("/login");
}


module.exports = midwareObj;