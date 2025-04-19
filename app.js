import 'dotenv/config';
console.log(process.env.SECRET);

import express from 'express';
const app = express();
import mongoose from 'mongoose';

import path from "path";
import { fileURLToPath } from "url";

import methodOveride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";

import flash from "connect-flash";

import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';

import reviewRouter from './routes/reviews.js';
import listingRouter from "./routes/listing.js";
import userRouter from './routes/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Base api
app.get("/", (req,res) =>{
    res.redirect("/listings");
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


// app.all("*", (req,res,next) =>{
//     next(new ExpressError(404, "Page not found!"));
// });

const secretOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: false,
    cookie:{
        expires: Date.now() + 7*60*60*24*1000,
        maxAge:  7*60*60*24*1000,
        httpOnly: true,
    },
};

app.use(session(secretOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});


// app.get("/demoUser", async(req,res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });
//     let registeredUser = await User.register(fakeUser, "helloworld!");
//     res.send(registeredUser);
// })

app.use((err,req,res,next) =>{
    let {status=500, message="Something went wrong"} = err;
    // res.status(status).send(message);
    res.status(status).render("error.ejs", {message});
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.listen(8080, ()=>{
    console.log("Server is listening on port no 8080");
});




