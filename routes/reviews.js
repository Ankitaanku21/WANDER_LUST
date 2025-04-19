import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from "../utils/wrapAsync.js";
import Review from '../models/review.js';
import Listing from '../models/listing.js';
import { validateReview, isLoggedIn, isReviewAuthor } from "../middleware.js";

import reviewController from "../controllers/reviews.js";
//Review 
// POST Route
router.post("/",isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

router.post("/", (req, res) => {
    res.send("Review submitted successfully!");
});


export default router;