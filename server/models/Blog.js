const { Schema, model } = require("mongoose");

const SectionSchema = new Schema({
    type: {
        type: String,
        enum: ["heading", "paragraph", "list"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
});

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String      // Cloudinary secure_url
    },
    thumbnailPublicId: {
        type: String     // public_id (useful to delete/replace)
    },
    sections: [SectionSchema],
}, { timestamps: true });

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
