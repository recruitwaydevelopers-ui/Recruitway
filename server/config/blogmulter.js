const multer = require("multer");

const storage = multer.memoryStorage();
const blogUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit (adjust)
    },
    fileFilter: (req, file, cb) => {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true)
        }
        else cb(new Error("Only JPG, PNG, and WebP images are allowed!"));
    },
});

module.exports = blogUpload;
