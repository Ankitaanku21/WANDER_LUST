import Review from "../models/review.js";
import Listing from "../models/listing.js";

export async function createReview(req, res){
        const { id } = req.params;
        let listing = await Listing.findById(id);
        let review = new Review(req.body.review);
        review.author = req.user._id;
        await review.save();
        listing.reviews.push(review);
        await listing.save();
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${id}`); 
};

export async function destroyReview(req,res){
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
}

export default {createReview, destroyReview};

