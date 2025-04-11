import express from 'express';
const app = express();
import mongoose from 'mongoose';
import Listing from './models/listing.js';
import Review from './models/review.js';

import path from "path";
import { fileURLToPath } from "url";

import methodOveride from "method-override";
import ejsMate from "ejs-mate";

import wrapAsync from "./utils/wrapAsync.js";
import ExpressError from "./utils/ExpressError.js";

import { listingSchema, reviewSchema } from "./Schema.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Base api
app.get("/", (req,res) =>{
    res.send("Home Page");
} )

//Creating database
main()
    .then(()=>{
        console.log("Connection successful");
    })
    .catch((err) => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOveride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el) =>el.message).join(",");
            throw new ExpressError(400,result.errMsg);
        }
        else{
            next();
        }
}


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

//Update Route
app.put("/listings/:id", validateListing ,wrapAsync (async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
    // res.redirect(`/listings/${id}`);     //used to redirect to page which changes it's val and show me that
}));

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
});



//Show Route
app.get("/listings/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
}));

//Create Route
app.post("/listings", validateListing,wrapAsync (async (req,res,next) =>{ 
        const newListing = new Listing(req.body.lisitng);
        await newListing.save();
        res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit",wrapAsync (async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing}); 
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

//Review POST Route
app.post("/listings/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const review = new Review(req.body.review);

        listing.reviews.push(review);
        await review.save();
        await listing.save();

        return res.redirect(`/listings/${id}`); 
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error while adding review");
    }
});

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) =>{
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`);
}))

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "Near Beach",
//         price: 1200,
//         location: "Calicut, Kolkata",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample is saved");
//     res.send("Successful");
// });

// Index Route
app.get("/listings",wrapAsync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));  

// app.all("*", (req,res,next) =>{
//     next(new ExpressError(404, "Page not found!"));
// });

app.use((err,req,res,next) =>{
    let {status=500, message="Something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", {message});
});


app.listen(8080, ()=>{
    console.log("Server is listening on port no 8080");
});



