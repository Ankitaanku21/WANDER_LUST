import express from "express";
const app = express();
import users from "./routes/user.js";
import posts from "./routes/post.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import path from "path";

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set("views", path.join(__dirname, "views"));


app.use("/users", users);
app.use("/posts", posts);
app.use(cookieParser("secretcode"));

const sessionOptions = ({secret: "mysupersecterstring", resave: false, saveUninitialized:true});

app.use(session(sessionOptions));
app.use(flash());

//store in middleware 
app.use((req, res, next) =>{
    res.locals.successMsg =  req.flash("success");
    res.locals.errorMsg =  req.flash("error");
    next();
})

app.get("/register", (req,res) =>{
    let {name = "anonymus"} = req.query;
    req.session.name = name;
    if(name=== "anonymus")
        req.flash("error", "user not registered");
    else 
        req.flash("success", "user registered successfully");
    res.redirect("/hello");
}); 

app.get("/hello", (req,res) =>{
    res.render("page.ejs", {name: req.session.name});
})



// //track single session in all the tabs present in a browser
// app.get("/reqcount",(req,res) =>{
//     if(req.session.count) req.session.count++;
//     else req.session.count = 1;
//     res.send(`You sent a request ${req.session.count} times`);
// });

// app.get("/test", (req,res) =>{
//     res.send("Test successful");
// })

// //signed cookie
// app.get("/getsignedcookie", (req,res) =>{
//     res.cookie("made-in", "India", {signed:true});
//     res.send("signed cookie sent");
// });

// app.get("/verify", (req,res) =>{
//     console.log(req.signedCookies);  //to print signed cookies
// })

// //Cookies
// app.get("/getcookies",(req,res) =>{
//     res.cookie("Greet", "hello");
//     res.cookie("madeIn", "India");
//     res.send("Send you some cookies");
// });

// app.get("/greet", (req,res) =>{
//     let {name = "anonymus"} = req.cookies;
//     res.send(`Hi! ${name}`);
// })

// app.get("/", (req,res) =>{
//     console.dir(req.cookies);
//     res.send("Hii I'm groot!!");
// });



app.listen(3000, () =>{
    console.log("App is listening on port no 3000");
});


