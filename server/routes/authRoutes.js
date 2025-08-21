const express = require('express');
const router = express.Router();
const {
    registerController, loginController, userController, verifyCode, resendCode,
    checkPassword, forgotPassword, changePassword, resetPassword, deleteAccount,
    loginWithGoogle, loginWithLinkedin
} = require("../controllers/authController");
const authMiddleware = require('../middleware/auth-middleware');
const updateLastActive = require('../middleware/update-lastActive-middleware');

router.post("/register", registerController)
router.post("/verifyCode", verifyCode)
router.post("/resendCode", resendCode)
router.post("/google", updateLastActive, loginWithGoogle)
router.post("/linkedin", updateLastActive, loginWithLinkedin)
router.post("/login", updateLastActive, loginController)
router.get("/user", authMiddleware, userController)
router.post("/checkPassword", authMiddleware, checkPassword)
router.post("/forgot-password", forgotPassword)
router.post("/change-password", authMiddleware, changePassword)
router.post("/reset-password/:token", resetPassword)
router.delete("/delete-account", authMiddleware, deleteAccount)

module.exports = router;
