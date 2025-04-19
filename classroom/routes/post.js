import express from 'express';
const router = express.Router();

//POST
// Show Route for Users
router.get("/:id", (req,res) =>{
    res.send("Show Route For Users");
});

//Post Route for Users
router.post("/", (req,res) =>{
    res.send("POST For Users");
});

//Delete Route for Users
router.get("/:id", (req,res) =>{
    res.send("Delete For User ID");
});

//Index Route for Users
router.get("/", (req,res) =>{
    res.send("For Users");
});

export default router;