const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req,res,next)=>{
    try {
       let listing = await Listing.findById(req.params.id);
       if (!listing) {
          return res.status(404).send("Listing not found");
       }

       console.log("Submitted review:", req.body);
       let newReview = new Review(req.body.review);
       newReview.author = req.user._id
       await newReview.save(); // Save review first
       listing.reviews.push(newReview);
   
       await listing.save();
       req.flash("success","Review Added!");
       res.redirect(`/listings/${listing._id}`);
    } catch (e) {
       console.error("Review submission error:", e);
       next(e);
    }
 }

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
 }