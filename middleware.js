const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next)=>{
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create Listing");
        return res.redirect("/login");
    }
    next();
}

// below will first save the current lcoation and then after login you will be redirected to the same page
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params; 
    
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You do not have permission to change");
        return res.redirect(`/listings/${id}`);
    }
    next();

}


module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You do not have permission to delete this review");
    return res.redirect(`/listings/${id}`);
  }

  next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);  // Send clean error message
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};