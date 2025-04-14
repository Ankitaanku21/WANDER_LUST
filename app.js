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

import { reviewSchema } from "./Schema.js";
import listings from "./routes/listing.js";

import reviews from './routes/review.js';


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


app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);

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



