import express from 'express';
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import Listing from '../models/listing.js';
import {isLoggedIn, isOwner, validateListing} from '../middleware.js';
import listingController, { updateListing } from "../controllers/listing.js";
import multer from "multer";
import { storage } from "../cloudConfig.js";
const upload = multer({storage});

// NEW Route - show form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/")
    .get(wrapAsync(listingController.index))    //INDEX ROUTE
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing));   //CREATE ROUTE
    

router
    .route("/:id")
    .put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))   // UPDATE Route - update a listing
    .get(wrapAsync(listingController.showListing))         // SHOW Route - show details of a specific listing    
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));           // DELETE Route - delete a listing

// EDIT Route - show form to edit a listing
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));




export default router;
