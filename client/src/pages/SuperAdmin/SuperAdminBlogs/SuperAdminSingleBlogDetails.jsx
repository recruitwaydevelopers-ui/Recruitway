import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft, FaCalendarAlt, FaCheckCircle, FaSave, FaTimes, FaPlusCircle, FaEye, FaEyeSlash, FaImage } from "react-icons/fa";
import { useAuthContext } from "../../../context/auth-context";
import axios from "axios";
import toast from "react-hot-toast";

const SuperAdminSingleBlogDetails = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [title, setTitle] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [sections, setSections] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { server, token } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {

        const getBlogById = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/blogs/getBlogById/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const { blog } = res.data
                setBlog(blog);
                setTitle(blog.title);
                setThumbnailUrl(blog.thumbnailUrl);
                setThumbnailPreview(blog.thumbnailUrl);
                setSections(blog.sections.map(section => ({ ...section, id: section._id })));
            } catch (error) {
                console.error("Error fetching blogs:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }

        getBlogById()

    }, [id]);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        setShowDeleteModal(false);
        try {
            const res = await axios.delete(`${server}/api/v1/blogs/deleteBlog/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(res.data.message)
            navigate("/superadmin/allBlog")
        } catch (error) {
            toast.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }

    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const enableEditMode = () => {
        setEditMode(true);
    };

    const cancelEdit = () => {
        setEditMode(false);
        // Reset to original blog data
        if (blog) {
            setTitle(blog.title);
            setThumbnailUrl(blog.thumbnailUrl);
            setThumbnailPreview(blog.thumbnailUrl);
            setSections(blog.sections.map(section => ({ ...section, id: section._id })));
        }
    };

    const updateBlog = async () => {
        if (!title.trim()) {
            toast.error("Please enter a blog title before updating.");
            return;
        }

        if (sections.length === 0) {
            toast.error("Please add at least one section before updating.");
            return;
        }

        // ✅ Prepare FormData for multipart upload
        const formData = new FormData();
        formData.append("title", title);
        formData.append("sections", JSON.stringify(sections));
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

        setLoading(true);

        try {
            const res = await axios.put(
                `${server}/api/v1/blogs/updateBlog/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(res.data.message || "Blog updated successfully!");

            // ✅ Update local state
            const updatedBlog = {
                ...blog,
                title,
                thumbnailUrl: thumbnailPreview || blog.thumbnailUrl,
                sections,
                updatedAt: new Date().toISOString(),
            };

            setBlog(updatedBlog);
            setEditMode(false);

            // ✅ Redirect
            navigate("/superadmin/allBlog");
        } catch (error) {
            console.error("Error updating blog:", error);
            toast.error(
                error.response?.data?.message ||
                "An error occurred while updating the blog."
            );
        } finally {
            setLoading(false);
        }
    };

    // Image handling functions
    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnailFile(file);

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = function (event) {
                setThumbnailPreview(event.target.result);
                setThumbnailUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setThumbnailFile(null);
        setThumbnailPreview("");
        setThumbnailUrl("");
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith("image/")) {
                setThumbnailFile(file);

                // Create a preview URL
                const reader = new FileReader();
                reader.onload = function (event) {
                    setThumbnailPreview(event.target.result);
                    setThumbnailUrl(event.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                alert("Please upload an image file.");
            }
        }
    };

    // Section handling functions
    const addSection = (type, index = null) => {
        const newSection = {
            id: Date.now(),
            type,
            content: ""
        };

        if (index !== null) {
            // Insert at specific position
            const updatedSections = [...sections];
            updatedSections.splice(index + 1, 0, newSection);
            setSections(updatedSections);
        } else {
            // Add to the end
            setSections([...sections, newSection]);
        }
    };

    const updateSection = (id, value) => {
        setSections(
            sections.map((section) =>
                section.id === id ? { ...section, content: value } : section
            )
        );
    };

    const removeSection = (id) => {
        setSections(sections.filter((section) => section.id !== id));
    };

    const moveSection = (id, direction) => {
        const index = sections.findIndex(section => section.id === id);
        if (
            (direction === "up" && index > 0) ||
            (direction === "down" && index < sections.length - 1)
        ) {
            const updatedSections = [...sections];
            const newIndex = direction === "up" ? index - 1 : index + 1;

            // Swap sections
            [updatedSections[index], updatedSections[newIndex]] =
                [updatedSections[newIndex], updatedSections[index]];

            setSections(updatedSections);
        }
    };

    // Render functions
    const renderSection = (section, index) => {
        return (
            <div key={section.id} className="card mb-3 border-0 shadow-sm">
                {editMode && (
                    <div className="card-header bg-light d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            {index + 1}. {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                        </h5>
                        <div className="d-flex gap-1">
                            <>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => moveSection(section.id, "up")}
                                    disabled={index === 0}
                                >
                                    ↑
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => moveSection(section.id, "down")}
                                    disabled={index === sections.length - 1}
                                >
                                    ↓
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => addSection("heading", index)}
                                >
                                    +H
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => addSection("paragraph", index)}
                                >
                                    +P
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => addSection("list", index)}
                                >
                                    +L
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeSection(section.id)}
                                >
                                    <FaTrash className="me-1" /> Remove
                                </button>
                            </>
                        </div>
                    </div>
                )}

                <div className="card-body">
                    {editMode ? (
                        <>
                            {section.type === "heading" && (
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter heading..."
                                    value={section.content}
                                    onChange={(e) => updateSection(section.id, e.target.value)}
                                />
                            )}
                            {section.type === "paragraph" && (
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter paragraph..."
                                    value={section.content}
                                    onChange={(e) => updateSection(section.id, e.target.value)}
                                ></textarea>
                            )}
                            {section.type === "list" && (
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter bullet points (one per line)"
                                    value={section.content}
                                    onChange={(e) => updateSection(section.id, e.target.value)}
                                ></textarea>
                            )}
                        </>
                    ) : (
                        <>
                            {section.type === "heading" && (
                                <h2 className="fw-bold">{section.content}</h2>
                            )}
                            {section.type === "paragraph" && (
                                <p className="lead">{section.content}</p>
                            )}
                            {section.type === "list" && (
                                <div className="d-flex align-items-start mb-3">
                                    <FaCheckCircle className="text-success me-3 mt-1" size={20} />
                                    <div>
                                        <h4 className="fw-bold mb-2">{section.content}</h4>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Render blog content for preview
    const renderBlogContent = () => {
        const elements = [];
        let i = 0;

        while (i < sections.length) {
            const section = sections[i];

            if (section.type === "list" && i + 1 < sections.length && sections[i + 1].type === "paragraph") {
                // Render list item with its following paragraph
                elements.push(
                    <div key={section.id} className="mb-4">
                        <div className="d-flex align-items-start mb-3">
                            <FaCheckCircle className="text-success me-3 mt-1" size={20} />
                            <div>
                                <h4 className="fw-bold mb-2">{section.content}</h4>
                                <p className="mb-0">{sections[i + 1].content}</p>
                            </div>
                        </div>
                    </div>
                );
                i += 2; // Skip the next paragraph as it's already rendered
            } else {
                // Regular section (heading, paragraph, or standalone list)
                elements.push(
                    <div key={section.id} className="mb-3">
                        {section.type === "heading" && (
                            <h2 className="fw-bold">{section.content}</h2>
                        )}
                        {section.type === "paragraph" && (
                            <p className="lead">{section.content}</p>
                        )}
                        {section.type === "list" && (
                            <div className="d-flex align-items-center">
                                <FaCheckCircle className="text-success me-3" size={20} />
                                <h4 className="fw-bold mb-0">{section.content}</h4>
                            </div>
                        )}
                    </div>
                );
                i += 1;
            }
        }

        return elements;
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
        );
    }

    if (!blog) {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="text-center py-5">
                        <h4 className="text-muted">Blog not found</h4>
                        <Link to="/superadmin/allBlog" className="btn btn-primary mt-3">
                            <FaArrowLeft className="me-2" /> Back to Blogs
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // View Mode - Clean Blog Display
    if (!editMode) {
        return (
            <div className="container-fluid bg-light">
                <div className="container position-relative">
                    {/* Header with Edit/Delete buttons */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <Link to="/superadmin/allBlog" className="btn btn-sm btn-outline-secondary">
                            <FaArrowLeft className="me-2" /> Back to Blogs
                        </Link>
                        <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-secondary" onClick={enableEditMode}>
                                <FaEdit className="me-2" /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                                <FaTrash className="me-2" /> Delete
                            </button>
                        </div>
                    </div>

                    {/* Blog Display */}
                    <div className="card shadow-lg p-4 p-md-5 mb-5">
                        <h1 className="fw-bold mb-4 text-primary">{blog.title}</h1>

                        <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="img-fluid rounded mb-4"
                            style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                        />

                        <div className="d-flex align-items-center text-muted mb-4">
                            <FaCalendarAlt className="me-2" />
                            {formatDate(blog.createdAt)}
                        </div>

                        <div className="blog-content">
                            {renderBlogContent()}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Deletion</h5>
                                    <button type="button" className="btn-close" onClick={cancelDelete}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this blog post?</p>
                                    <p className="text-danger fw-bold">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                        <FaTrash className="me-2" /> Delete Blog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Edit Mode - Full Editor Interface
    return (
        <div className="container-fluid bg-light">
            <div className="container position-relative">
                {/* Header with Save/Cancel buttons */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Link to="/superadmin/allBlog" className="btn btn-outline-secondary">
                        <FaArrowLeft className="me-2" /> Back to Blogs
                    </Link>
                    <div className="btn-group" role="group">
                        <button className="btn btn-success" onClick={updateBlog}>
                            <FaSave className="me-2" /> Save
                        </button>
                        <button className="btn btn-secondary" onClick={cancelEdit}>
                            <FaTimes className="me-2" /> Cancel
                        </button>
                    </div>
                </div>

                {/* Sticky Add Section Bar */}
                <div
                    className="position-sticky bg-white shadow-sm p-3 mb-4 rounded border"
                    style={{ top: "0px", zIndex: 1050 }}
                >
                    <div className="d-flex gap-2 justify-content-center flex-wrap">
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
                </div>

                {/* Blog Editor */}
                <div className="card shadow-lg p-4 p-md-5 mb-5">
                    <h2 className="mb-4 text-primary">Edit Blog</h2>

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
                                className={`border rounded-3 p-4 text-center ${dragActive ? "border-primary bg-light" : "border-secondary"}`}
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
                                        style={{ maxHeight: "300px", objectFit: "cover" }}
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

                    {/* Blog Date */}
                    <div className="mb-4">
                        <div className="d-flex align-items-center text-muted">
                            <FaCalendarAlt className="me-2" />
                            {formatDate(blog.createdAt)}
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="mb-4">
                        <h4 className="mb-3">Blog Sections</h4>
                        {sections.length === 0 ? (
                            <div className="text-center py-5 bg-light rounded">
                                <p className="text-muted mb-0">
                                    No sections added yet. Use the buttons above.
                                </p>
                            </div>
                        ) : (
                            sections.map((section, idx) => renderSection(section, idx))
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button className="btn btn-sm btn-primary px-5" onClick={updateBlog}>
                            <FaSave className="me-2" />
                            Save Blog
                        </button>
                    </div>
                </div>

                {/* Live Preview */}
                {showPreview && (
                    <div className="card shadow-sm p-4 p-md-5 mb-5">
                        <h4 className="text-primary mb-3">Blog Preview</h4>
                        <hr />
                        <h2 className="fw-bold mb-3">{title || "Blog Title"}</h2>
                        {(thumbnailPreview || thumbnailUrl) && (
                            <img
                                src={thumbnailPreview || thumbnailUrl}
                                alt="Blog thumbnail"
                                className="img-fluid rounded mb-4"
                                style={{ maxHeight: "400px", objectFit: "cover" }}
                            />
                        )}
                        {sections.length > 0 ? (
                            renderBlogContent()
                        ) : (
                            <p className="text-muted">No content added yet.</p>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Deletion</h5>
                                    <button type="button" className="btn-close" onClick={cancelDelete}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this blog post?</p>
                                    <p className="text-danger fw-bold">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                        <FaTrash className="me-2" /> Delete Blog
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuperAdminSingleBlogDetails;