import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import Review from '../models/review.js';
import Listing from '../models/listing.js';
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";

//Review 
// POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync (async (req, res) => {
        const { id } = req.params;
        let listing = await Listing.findById(id);
        let review = new Review(req.body.review);
        review.author = req.user._id;
        await review.save();
        listing.reviews.push(review);
        await listing.save();
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${id}`); 
}));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async (req,res) =>{
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}));

router.post("/", (req, res) => {
    res.send("Review submitted successfully!");
});


export default router;