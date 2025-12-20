const express = require("express");
const blogRoutes = express.Router();
const blogUpload = require("../config/blogmulter");
const { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog } = require("../controllers/blogController");
const authMiddleware = require("../middleware/auth-middleware");
const { roleCheck } = require("../middleware/roleCheck");


// POST /api/v1/createBlog
blogRoutes.post("/createBlog", authMiddleware, roleCheck(['superadmin']), blogUpload.single("thumbnail"), createBlog);

// GET /api/v1/getBlogs (Public Api)
blogRoutes.get("/getAllBlogs", getBlogs);

// GET /api/v1/getBlogs
blogRoutes.get("/getBlogs", authMiddleware, roleCheck(['superadmin']), getBlogs);

// GET /api/v1/getSingleBlogById/:id (Public Api)
blogRoutes.get("/getSingleBlogById/:id", getBlogById);

// GET /api/v1/getBlogById/:id
blogRoutes.get("/getBlogById/:id", authMiddleware, roleCheck(['superadmin']), getBlogById);

// UPDATE /api/v1/updateBlog/:id
blogRoutes.put("/updateBlog/:id", authMiddleware, roleCheck(['superadmin']), blogUpload.single("thumbnail"), updateBlog);

// DELETE /api/v1/deleteBlog/:id
blogRoutes.delete("/deleteBlog/:id", authMiddleware, roleCheck(['superadmin']), deleteBlog);

module.exports = blogRoutes;
