import axios from "axios";
import { useState } from "react";
import { FaPlusCircle, FaTrash, FaSave, FaEye, FaEyeSlash, FaImage, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useAuthContext } from "../../../context/auth-context";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SuperAdminNewBlogCreator = () => {
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [sections, setSections] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false)
    const { server, token } = useAuthContext()
    const navigate = useNavigate();

    // 🔹 Image Upload Handlers
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            processImageFile(e.target.files[0]);
        }
    };

    const processImageFile = (file) => {
        setThumbnailFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setThumbnailPreview(event.target.result);
        reader.readAsDataURL(file);
        setThumbnail(`temp-preview-${file.name}`);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
        else if (e.type === "dragleave") setDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) processImageFile(file);
        else alert("Please upload an image file.");
    };

    const removeImage = () => {
        setThumbnailFile(null);
        setThumbnailPreview("");
        setThumbnail("");
    };

    // 🔹 Section Handlers
    const addSection = (type) => {
        setSections([...sections, { id: Date.now(), type, content: "" }]);
    };

    const updateSection = (id, value) => {
        setSections(
            sections.map((s) => (s.id === id ? { ...s, content: value } : s))
        );
    };

    const removeSection = (id) => {
        setSections(sections.filter((s) => s.id !== id));
    };

    const handleSubmit = async () => {
        // 🔹 Validate title
        if (!title.trim()) {
            toast.dismiss()
            toast.error("Please enter a blog title before submitting.");
            return;
        }

        // 🔹 Validate sections
        if (sections.length === 0) {
            toast.dismiss()
            toast.error("Please add at least one section to the blog.");
            return;
        }

        // 🔹 Validate thumbnail size (max 5MB)
        if (thumbnailFile && thumbnailFile.size > 5 * 1024 * 1024) {
            toast.dismiss()
            toast.error("Thumbnail file size exceeds 5 MB. Please upload a smaller image.");
            return;
        }

        // 🔹 Prepare FormData
        const formData = new FormData();
        formData.append("title", title);
        formData.append("sections", JSON.stringify(sections));
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        setLoading(true);

        try {
            const res = await axios.post(
                `${server}/api/v1/blogs/createBlog`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(res.data.message || "Blog created successfully!");

            // ✅ Reset form after success
            setTitle("");
            setSections([]);
            setThumbnail("");
            setThumbnailFile(null);
            setThumbnailPreview("");

            // ✅ Navigate after success
            navigate("/superadmin/allBlog");
        } catch (error) {
            console.error("Blog creation failed:", error);

            toast.error(
                error.response?.data?.message ||
                "An error occurred while creating the blog. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-50" style={{ zIndex: 1050 }}>
                <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid">
            <div className="container position-relative">
                {/* ✅ Sticky Add Section Bar */}
                <div className="position-sticky top-0 bg-white shadow-sm p-3 mb-4 rounded border d-flex flex-wrap align-items-center justify-content-between gap-3" style={{ zIndex: 1050 }} >
                    {/* Back Button */}
                    <Link to="/superadmin/allBlog" className="btn btn-sm btn-outline-secondary">
                        <FaArrowLeft className="me-2" /> Back to Blogs
                    </Link>

                    {/* Section Buttons */}
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={() => addSection("heading")}
                        >
                            <FaPlusCircle className="me-1" /> Add Heading
                        </button>

                        <button
                            className="btn btn-sm btn-success"
                            onClick={() => addSection("paragraph")}
                        >
                            <FaPlusCircle className="me-1" /> Add Paragraph
                        </button>

                        <button
                            className="btn btn-sm btn-warning"
                            onClick={() => addSection("list")}
                        >
                            <FaPlusCircle className="me-1" /> Add Bullet Points
                        </button>
                    </div>
                </div>

                {/* ✅ Blog Editor */}
                <div className="card shadow-lg p-4 p-md-5 mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                        <h2 className="mb-0 text-primary">Create a New Blog</h2>
                        <button
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                            onClick={() => setShowPreview(!showPreview)}
                        >
                            {showPreview ? (
                                <FaEyeSlash className="me-2" />
                            ) : (
                                <FaEye className="me-2" />
                            )}
                            {showPreview ? "Hide" : "Show"} Preview
                        </button>
                    </div>

                    {/* Blog Title */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Blog Title</label>
                        <input
                            type="text"
                            className="form-control form-control-md"
                            placeholder="Enter blog title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="mb-4">
                        <label className="form-label fw-bold">Thumbnail Image</label>
                        {!thumbnailPreview ? (
                            <div
                                className={`border rounded-3 p-4 text-center ${dragActive ? "border-primary bg-light" : "border-secondary"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <FaImage className="text-muted mb-3" style={{ fontSize: "3rem" }} />
                                <h5 className="text-muted mb-2">Drag & Drop your image here</h5>
                                <p className="text-muted small mb-3">or</p>
                                <label htmlFor="thumbnail-upload" className="btn btn-sm btn-primary">
                                    Browse Files
                                </label>
                                <input
                                    id="thumbnail-upload"
                                    type="file"
                                    accept="image/*"
                                    className="d-none"
                                    onChange={handleImageUpload}
                                />
                                <p className="text-muted small mt-3">
                                    Supported formats: JPG, PNG, GIF, WebP
                                </p>
                            </div>
                        ) : (
                            <div className="position-relative">
                                <div className="card border-0 shadow-sm">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="img-fluid rounded w-100"
                                        style={{ maxHeight: "300px", objectFit: "contain" }}
                                    />
                                </div>
                                <button
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                                    onClick={removeImage}
                                >
                                    <FaTimes />
                                </button>
                                <div className="mt-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <span className="text-muted small">
                                        {thumbnailFile ? thumbnailFile.name : "Image uploaded"}
                                    </span>
                                    <label
                                        htmlFor="thumbnail-replace"
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Replace Image
                                    </label>
                                    <input
                                        id="thumbnail-replace"
                                        type="file"
                                        className="d-none"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sections */}
                    <div className="mb-4">
                        {sections.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded">
                                <p className="text-muted mb-0">
                                    No sections added yet. Use the buttons above.
                                </p>
                            </div>
                        ) : (
                            sections.map((section, idx) => (
                                <div key={section.id} className="card mb-3 border-0 shadow-sm">
                                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">
                                            {idx + 1}.{" "}
                                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                        </h5>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => removeSection(section.id)}
                                        >
                                            <FaTrash className="me-1" /> Remove
                                        </button>
                                    </div>
                                    <div className="card-body">
                                        {section.type === "heading" && (
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                placeholder="Enter heading..."
                                                value={section.content}
                                                onChange={(e) =>
                                                    updateSection(section.id, e.target.value)
                                                }
                                            />
                                        )}
                                        {section.type === "paragraph" && (
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="4"
                                                placeholder="Enter paragraph..."
                                                value={section.content}
                                                onChange={(e) =>
                                                    updateSection(section.id, e.target.value)
                                                }
                                            ></textarea>
                                        )}
                                        {section.type === "list" && (
                                            <textarea
                                                className="form-control form-control-sm"
                                                rows="3"
                                                placeholder="Enter bullet points (one per line)"
                                                value={section.content}
                                                onChange={(e) =>
                                                    updateSection(section.id, e.target.value)
                                                }
                                            ></textarea>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Submit */}
                    <div className="text-center">
                        <button className="btn btn-sm btn-primary px-5" onClick={handleSubmit}>
                            <FaSave className="me-2" />
                            Save Blog
                        </button>
                    </div>
                </div>

                {/* ✅ Live Preview */}
                {showPreview && (
                    <div className="card shadow-sm p-4 p-md-5 mb-5">
                        <h4 className="text-primary mb-3">Blog Preview</h4>
                        <hr />
                        <h2 className="fw-bold mb-3">{title || "Blog Title"}</h2>
                        {(thumbnailPreview || thumbnail) && (
                            <img
                                src={thumbnailPreview || thumbnail}
                                alt="Blog thumbnail"
                                className="img-fluid rounded mb-4"
                                style={{ maxHeight: "400px", objectFit: "cover" }}
                            />
                        )}
                        {sections.length > 0 ? (
                            sections.map((sec) => (
                                <div key={sec.id} className="mb-3">
                                    {sec.type === "heading" && (
                                        <h4 className="fw-bold mt-3">{sec.content || "Heading"}</h4>
                                    )}
                                    {sec.type === "paragraph" && (
                                        <p className="text-muted">{sec.content || "Paragraph"}</p>
                                    )}
                                    {sec.type === "list" && (
                                        <ul>
                                            {sec.content
                                                .split("\n")
                                                .filter((item) => item.trim() !== "")
                                                .map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                        </ul>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No content added yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminNewBlogCreator;
