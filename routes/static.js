import { Router } from "express";

const router = Router();

// Privacy Policy
router.get("/privacy", (req, res) => {
  res.render("PrivacyPolicy/privacy");
});

// Terms of Service
router.get("/terms", (req, res) => {
  res.render("PrivacyPolicy/terms");
});

// Company Details
router.get("/companyDetails", (req, res) => {
  res.render("PrivacyPolicy/about"); // about.ejs page
});

export default router;
