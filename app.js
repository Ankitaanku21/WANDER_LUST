import express from 'express';
const app = express();
import mongoose from 'mongoose';
import Listing from './models/listing.js';

import path from "path";
import { fileURLToPath } from "url";

import methodOveride from "method-override";
import ejsMate from "ejs-mate";

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

app.listen(8080, ()=>{
    console.log("Server is listening on port no 8080");
});

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOveride("_method"));

//Update Route
app.put("/listings/:id",async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");
    // res.redirect(`/listings/${id}`);     //used to redirect to page which changes it's val and show me that
})

//New Route
app.get("/listings/new", (req,res) =>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

//Create Route
app.post("/listings",async (req,res) =>{ 
    // let {title,description, image, price, location, country} = req.body; 
    let listing = req.body.listing;
    const newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit",async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing}); 
});

//Delete Route
app.delete("/listings/:id",async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

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
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });  