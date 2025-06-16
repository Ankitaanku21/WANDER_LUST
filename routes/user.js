import express from 'express';
const router = express.Router();
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import {saveRedirectUrl} from "../middleware.js";
import userController from "../controllers/users.js";

router
    .route("/signup")   
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .get(userController.logout);

router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}),
    userController.login);

router.get("/logout", userController.logout);

export default router;