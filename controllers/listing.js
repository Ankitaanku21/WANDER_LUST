import Listing from "../models/listing.js";
import dotenv from "dotenv";
dotenv.config();

import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

export async function index(req, res){
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

export function renderNewForm(req, res){
    res.render("listings/new.ejs");
};

export async function showListing(req, res){
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
};

export async function createListing(req, res, next){
    //for converting places to its corrdinates
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
    })
    .send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");

    listing.geometry = {
    type: 'Point',
    coordinates: [longitude, latitude]
    };
    await listing.save();

}

//this render form is for UI only
export async function renderEditForm(req, res){
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id);
    if(!listing){
        req.flash("error", "Listing you are requested doesn't exist");
        res.redirect("/listings");
    }

    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("listings/edit.ejs", { listing, OriginalImageUrl });
}

//actual update in backend happend with this funtion
export async function updateListing(req, res){
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
      
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
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

    listing.geometry = {
    type: 'Point',
    coordinates: [longitude, latitude]
};
await listing.save();

};

export async function destroyListing(req, res) {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
}

//This function is to render the listings belonged to that category
export const getCategory=async(req,res)=>{
    let {icon}=req.query;
    console.log(icon);
    let listing=await Listing.find({category:icon});
    console.log(listing);
    if(listing.length>0){
        res.render("listings/iconDetail.ejs",{listing,icon});
    }else{
        res.render("/listings")
    }
}

export default {
    index,
    renderNewForm,
    createListing,
    showListing,
    renderEditForm,
    updateListing,
    destroyListing,
    getCategory,
  };
  
