import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import Listing from '../models/listing.js';
import { isLoggedIn, isOwner, validateListing } from '../middleware.js';
import listingController from "../controllers/listing.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({ storage });

//  Search Route
router.get("/search", wrapAsync(async (req, res) => {
    const {query} = req.query;
    console.log(req.query);
    if(!query||query.trim()===""){
        req.flash("error", "The Listing you searched for does not exists!");
        return res.redirect("/");
    }
    const listings = await Listing.find({
        $or: [
            {title: {$regex: query, $options: "i"}},
            {location: { $regex: query, $options: "i" }},
            {country: {$regex: query, $options: "i"}},
            {description: {$regex: query, $options: "i"}},
            {category: {$regex: query, $options: "i"}}
        ],
    });
    if(listings.length===0){
        req.flash("error", "The Listing you searched for does not exists!");
        return res.redirect("/");
    }
    res.render("listings/search-result.ejs", { listings });
}));

//  New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

//  Main Index Route with filters
router.get("/", wrapAsync(async (req, res) => {
    const { category, search } = req.query;
    let listings;

    if (category) {
        listings = await Listing.find({ category });
    } else if (search) {
        listings = await Listing.find({
            title: { $regex: new RegExp(search, "i") }
        });
    } else {
        listings = await Listing.find({});
    }

    res.render("listings/index", {
        listings,
        message: listings.length === 0 ? "No listing present" : null
    });
}));

//  Create New Listing
router
    .route("/")
    .post(
        isLoggedIn,
        validateListing,
        upload.single('listing[image]'),
        wrapAsync(listingController.createListing)
    );

//  Category Icons
router.get("/icons", listingController.getCategory);

//  Edit / Show / Update / Delete a listing
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

//  Edit Form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

export default router;
