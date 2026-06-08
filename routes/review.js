// const express = require("express");
// const router = express.Router({ mergeParams: true });

// const Listing = require("../models/listing.js"); // ✅ fixed
// const Review = require("../models/review.js");

// const wrapAsync = require("../utils/wrapAsync.js");
// const { reviewSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js");


// // Validate Review
// const validateReview = (req,res,next)=>{
//   let {error} = reviewSchema.validate(req.body);

//   if(error){
//     let errMsg = error.details.map((el)=>el.message).join(",");
//     throw new ExpressError(400,errMsg);
//   }else{
//     next();
//   }
// };



// // Create Review
// router.post(
// "/",
// validateReview,
// wrapAsync(async (req,res)=>{

//   let listing = await Listing.findById(req.params.id);

//   let newReview = new Review(req.body.review);

//   listing.reviews.push(newReview);

//   await newReview.save();
//   await listing.save();
//  req.flash("success","New Review Created")
//   res.redirect(`/listing/${listing._id}`);
// })
// );



// // Delete Review
// router.delete(
// "/:reviewId",
// wrapAsync(async(req,res)=>{

//  let {id,reviewId} = req.params;

//  await Listing.findByIdAndUpdate(id,{
//    $pull:{reviews: reviewId}
//  });

//  await Review.findByIdAndDelete(reviewId);

//  req.flash("success"," Review Deleted ")
//  res.redirect(`/listing/${id}`);
// })
// );


// module.exports = router;

const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { reviewSchema } = require("../schema.js");
const reviewController = require("../controllers/review.js");

// Validate Review
const validateReview = (req, res, next) => {

    console.log(req.body);

    req.body.review.rating = Number(req.body.review.rating);

    let { error } = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400, error.details[0].message);
    }

    next();
};

// CREATE REVIEW
router.post("/",
   isLoggedIn,
   validateReview,
    wrapAsync(reviewController.createReview));

// DELETE REVIEW
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
   wrapAsync(reviewController.deleteReview));

module.exports = router;