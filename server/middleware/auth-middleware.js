const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth/Auth-model");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(500).json({ message: "Unauthorizes Token !! Token Not Provided" })
  }

  const jwtToken = token.replace("Bearer", " ").trim()

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET)

    const userData = await Auth.findOne({ email: isVerified?.email }).select("-password")

    if (!userData) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.user = userData
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token! Please log in again." })
  }
}

module.exports = authMiddleware




