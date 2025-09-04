import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

// Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, 
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback"

}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.create({
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id
            });
        }
        console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
        console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

