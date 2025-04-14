import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { reviewSchema } from "../Schema.js";
import Review from '../models/review.js';
import Listing from '../models/listing.js';

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) =>el.message).join(",");
            throw new ExpressError(400,result.errMsg);
        }
        else{
            next();
        }
}

//Review 
// POST Route
router.post("/",validateReview, wrapAsync (async (req, res) => {
        const { id } = req.params;
        console.log(req.params.id);
        const listing = await Listing.findById(id);
        const review = new Review(req.body.review);

        listing.reviews.push(review);
        await review.save();
        await listing.save();

        return res.redirect(`/listings/${id}`); 
}));

//Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req,res) =>{
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    res.redirect(`/listings/${id}`);
}))

export default router;