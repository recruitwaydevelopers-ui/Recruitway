const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

// ✅ CREATE
const createBlog = async (req, res) => {
    try {
        const { title, sections } = req.body;

        // Validate required fields
        if (!title || !sections) {
            return res.status(400).json({ message: "Title and sections are required." });
        }

        // Parse sections JSON
        let parsedSections;
        try {
            parsedSections = JSON.parse(sections);
        } catch (err) {
            return res.status(400).json({ message: "Invalid sections format. Must be JSON." });
        }

        let uploadedImageUrl = null;
        let uploadedImagePublicId = null;

        // ✅ Upload to Cloudinary if thumbnail provided
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "blogs",
                        transformation: [{ width: 1200, crop: "limit" }],
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            uploadedImageUrl = uploadResult.secure_url;
            uploadedImagePublicId = uploadResult.public_id;
        }

        // ✅ Create the blog document
        const newBlog = await Blog.create({
            title: title.trim(),
            thumbnailUrl: uploadedImageUrl,
            thumbnailPublicId: uploadedImagePublicId,
            sections: parsedSections,
        });

        return res.status(201).json({
            success: true,
            message: "Blog created successfully.",
            blog: newBlog,
        });
    } catch (error) {
        console.error("❌ Error creating blog:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating blog.",
            error: error.message,
        });
    }
};

// ✅ READ - All
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        console.error("❌ Error fetching blogs:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

// ✅ READ - Single
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }

        res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error("❌ Error fetching blog:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

// ✅ UPDATE
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, sections } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) return res.status(404).json({ success: false, message: "Blog not found." });

        let parsedSections = blog.sections;
        if (sections) {
            try {
                parsedSections = JSON.parse(sections);
            } catch (err) {
                return res.status(400).json({ message: "Invalid sections format." });
            }
        }

        // ✅ If new thumbnail uploaded → delete old + upload new
        let uploadedImageUrl = blog.thumbnailUrl;
        let uploadedImagePublicId = blog.thumbnailPublicId;

        if (req.file) {
            if (blog.thumbnailPublicId) {
                await cloudinary.uploader.destroy(blog.thumbnailPublicId);
            }

            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "blogs", transformation: [{ width: 1200, crop: "limit" }] },
                    (error, result) => (error ? reject(error) : resolve(result))
                );
                stream.end(req.file.buffer);
            });

            uploadedImageUrl = uploadResult.secure_url;
            uploadedImagePublicId = uploadResult.public_id;
        }

        // ✅ Update blog
        blog.title = title || blog.title;
        blog.sections = parsedSections;
        blog.thumbnailUrl = uploadedImageUrl;
        blog.thumbnailPublicId = uploadedImagePublicId;

        await blog.save();

        res.status(200).json({
            success: true,
            message: "Blog updated successfully.",
            blog,
        });
    } catch (error) {
        console.error("❌ Error updating blog:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

// ✅ DELETE
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found." });
        }

        // ✅ Delete thumbnail from Cloudinary if exists
        if (blog.thumbnailPublicId) {
            await cloudinary.uploader.destroy(blog.thumbnailPublicId);
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully.",
        });
    } catch (error) {
        console.error("❌ Error deleting blog:", error);
        res.status(500).json({ success: false, message: "Server error.", error: error.message });
    }
};

module.exports = { createBlog, getBlogs, getBlogById, updateBlog, deleteBlog }

