import express from 'express';
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import {saveRedirectUrl} from "../middleware.js";

router.get("/signup" , (req,res) =>{
    res.render("users/signup.ejs"); 
});

router.post("/signup",wrapAsync(async (req,res) =>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            else{
                req.flash("sucess", "Welcome to WanderLust");
                res.redirect("/listings");
            }
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login" , (req,res) =>{
    res.render("users/login.ejs"); 
});

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    async(req,res) => {
        req.flash("success","Welcome back to wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
});

router.get("/logout", (req,res) =>{
    req.logout((err) =>{
        if(err) return next(err);
        else{
            req.flash("success", "You are logged out now");
            res.redirect("/listings");
        }
    })
})

export default router;