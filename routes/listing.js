import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema } from "../Schema.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from '../models/listing.js';

// Middleware to validate listing schema
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// NEW Route - show form to create a new listing
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// INDEX Route - show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// CREATE Route - add new listing to DB
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// EDIT Route - show form to edit a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id);
    res.render("listings/edit.ejs", { listing });
}));

// UPDATE Route - update a listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing");
    }

    // Find the existing listing
    const existingListing = await Listing.findById(id);

    // If no new image is submitted, preserve the existing one
    if (!req.body.listing.image || !req.body.listing.image.url) {
        req.body.listing.image = existingListing.image;
    }

    // Update the listing with preserved or updated image
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));


// DELETE Route - delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// SHOW Route - show details of a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

export default router;
