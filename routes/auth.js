import express from "express";
import passport from "passport";
const router = express.Router();

// Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Logged in with Google!");
        res.redirect("/listings");
    }
);


export default router;
