import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from '../models/listing.js';
import {isLoggedIn, isOwner, validateListing} from '../middleware.js';


// NEW Route - show form to create a new listing
router.get("/new", isLoggedIn, (req, res) => {
    console.log("Current user:", req.user);
    console.log("Is Authenticated:", req.isAuthenticated?.());
    res.render("listings/new.ejs");
});


// INDEX Route - show all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// CREATE Route - add new listing to DB
router.post("/",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

// EDIT Route - show form to edit a listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id);
    if(!listing){
        req.flash("error", "Listing you are requested doesn't exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// UPDATE Route - update a listing
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
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
    req.flash("success", "Listing upadated!");
    res.redirect(`/listings/${id}`);
}));


// DELETE Route - delete a listing
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}));

// SHOW Route - show details of a specific listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");
    if(!listing){
        req.flash("error", "Listing you are requested doesn't exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}));

export default router;
