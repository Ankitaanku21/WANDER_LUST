import User from "../models/user.js";
import LocalStrategy from 'passport-local';

export function renderSignupForm(req,res){
    res.render("users/signup.ejs"); 
}

export async function signup(req,res){
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
};

export function renderLoginForm(req,res){
    res.render("users/login.ejs"); 
}

export function login(req,res){
    req.flash("success","Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

export function logout(req,res){
    req.logout((err) =>{
        if(err) return next(err);
        else{
            req.flash("success", "You are logged out now");
            res.redirect("/listings");
        }
    })
};


export default {
    renderSignupForm,
    signup,
    renderLoginForm,
    login,
    logout,
}