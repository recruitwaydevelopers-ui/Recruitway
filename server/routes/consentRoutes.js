const express = require("express");
const { sendCookies, getCookies, migrateCookies } = require("../controllers/consentController");

const router = express.Router();

router.post("/", sendCookies);          // Save/update consent
router.get("/:userId", getCookies);     // Get consent by user
router.post("/migrate", migrateCookies); // Migrate anon consent to user

module.exports = router;
