// import axios from "axios";
// import { useState, useEffect } from "react";
// import { FaTrash, FaEye, FaSearch, FaPlus, FaCalendarAlt, FaTh, FaList } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuthContext } from "../../../context/auth-context";
// import toast from "react-hot-toast";

// const SuperAdminAllBlog = () => {
//     const [blogs, setBlogs] = useState([]);
//     const [filteredBlogs, setFilteredBlogs] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [viewMode, setViewMode] = useState("grid"); // grid or list
//     const navigate = useNavigate();
//     const { server, token } = useAuthContext();

//     // Mock data based on the provided structure
//     useEffect(() => {

//         const getBlogs = async () => {
//             try {
//                 const res = await axios.get(`${server}/api/v1/blogs/getBlogs`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );

//                 const { blogs } = res.data
//                 setBlogs(blogs);
//                 setFilteredBlogs(blogs);
//             } catch (error) {
//                 console.error("Error fetching blogs:", error.response?.data || error.message);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         getBlogs()

//     }, []);

//     // Filter blogs based on search term
//     useEffect(() => {
//         let result = blogs;

//         // Filter by search term
//         if (searchTerm) {
//             result = result.filter(blog =>
//                 blog.title.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         setFilteredBlogs(result);
//     }, [blogs, searchTerm]);

//     const handleDelete = async (id) => {
// setLoading(true);
//         try {
//             const res = await axios.delete(`${server}/api/v1/blogs/deleteBlog/${id}`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//             toast.success(res.data.message)
//             setBlogs(blogs.filter(blog => blog._id !== id));
//         } catch (error) {
//             toast.error(error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//             setShowDeleteModal(false);
//         }

//     }

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'short', day: 'numeric' };
//         return new Date(dateString).toLocaleDateString(undefined, options);
//     };

//     const getFirstParagraph = (sections) => {
//         const paragraphSection = sections.find(section => section.type === "paragraph");
//         return paragraphSection ? paragraphSection.content.substring(0, 200) + "..." : "";
//     };

//     const handleNewBlog = () => {
//         navigate("/superadmin/create-new-blog");
//     };

//     return (
//         <div className="container-fluid bg-light">
//             <div className="container">
//                 {/* Header Section */}
//                 <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
//                     <h2 className="mb-3 mb-md-0 text-primary fw-bold">All Blogs</h2>
//                     <button className="btn btn-sm btn-primary" onClick={handleNewBlog}>
//                         <FaPlus className="me-2" /> Create New Blog
//                     </button>
//                 </div>

//                 {/* Search and Filter Bar */}
//                 <div className="card shadow-sm mb-4 border-0">
//                     <div className="card-body p-3 p-md-4">
//                         <div className="row g-3 align-items-center">
//                             <div className="col-12 col-md-8">
//                                 <div className="input-group input-group-sm">
//                                     <span className="input-group-text bg-white border-end-0">
//                                         <FaSearch />
//                                     </span>
//                                     <input
//                                         type="text"
//                                         className="form-control border-start-0 ps-0"
//                                         placeholder="Search blogs..."
//                                         value={searchTerm}
//                                         onChange={(e) => setSearchTerm(e.target.value)}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="col-12 col-md-4">
//                                 <div className="btn-group w-100" role="group">
//                                     <button
//                                         type="button"
//                                         className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
//                                         onClick={() => setViewMode("grid")}
//                                     >
//                                         <FaTh className="me-1 me-md-2" />
//                                         <span className="d-none d-md-inline">Grid</span>
//                                     </button>
//                                     <button
//                                         type="button"
//                                         className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
//                                         onClick={() => setViewMode("list")}
//                                     >
//                                         <FaList className="me-1 me-md-2" />
//                                         <span className="d-none d-md-inline">List</span>
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="d-flex justify-content-center align-items-center vh-100">
//                         <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
//                             <span className="visually-hidden">Loading...</span>
//                         </div>
//                     </div>
//                 )}

//                 {/* No Results State */}
//                 {!loading && filteredBlogs.length === 0 && (
//                     <div className="text-center py-5 bg-white rounded shadow-sm">
//                         <div className="mb-4">
//                             <FaSearch className="text-muted" style={{ fontSize: "3rem" }} />
//                         </div>
//                         <h4 className="text-muted">No blogs found</h4>
//                         <p className="text-muted">Try adjusting your search criteria</p>
//                     </div>
//                 )}

//                 {/* Grid View */}
//                 {!loading && filteredBlogs.length > 0 && viewMode === "grid" && (
//                     <div className="row g-4">
//                         {filteredBlogs.map((blog) => (
//                             <div key={blog._id} className="col-12 col-sm-6 col-lg-4">
//                                 <div className="card h-100 shadow-sm border-0 overflow-hidden blog-card">
//                                     <div className="position-relative">
//                                         <img
//                                             src={blog.thumbnailUrl}
//                                             className="card-img-top blog-image border-bottom border-black"
//                                             alt={blog.title}
//                                         />
//                                         <div className="position-absolute top-0 end-0 p-2">
//                                             <span className="badge bg-primary">Blog</span>
//                                         </div>
//                                     </div>
//                                     <div className="card-body d-flex flex-column p-3 p-md-4">
//                                         <h5 className="card-title fw-bold mb-3">{blog.title}</h5>
//                                         <p className="card-text text-muted flex-grow-1">{getFirstParagraph(blog.sections)}</p>
//                                         <div className="d-flex align-items-center mt-auto text-muted small">
//                                             <FaCalendarAlt className="me-2" /> {formatDate(blog.createdAt)}
//                                         </div>
//                                     </div>
//                                     <div className="card-footer bg-white border-0 p-3 p-md-4 pt-0">
//                                         <div className="d-flex flex-column flex-sm-row gap-2">
//                                             <Link to={`/superadmin/blog/${blog._id}`} className="btn btn-sm btn-primary flex-fill">
//                                                 <FaEye className="me-1" /> Read
//                                             </Link>
//                                             <button
//                                                 className="btn btn-sm btn-outline-danger flex-fill"
//                                                 onClick={() => handleDelete(blog._id)}
//                                             >
//                                                 <FaTrash className="me-1" /> Delete
//                                             </button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* List View */}
//                 {!loading && filteredBlogs.length > 0 && viewMode === "list" && (
//                     <div className="card shadow-sm border-0">
//                         <div className="table-responsive">
//                             <table className="table table-hover mb-0 align-middle">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th scope="col" className="d-none d-md-table-cell">Image</th>
//                                         <th scope="col">Title</th>
//                                         <th scope="col" className="d-none d-lg-table-cell">Excerpt</th>
//                                         <th scope="col">Date</th>
//                                         <th scope="col">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {filteredBlogs.map((blog) => (
//                                         <tr key={blog._id}>
//                                             <td className="d-none d-md-table-cell">
//                                                 <img
//                                                     src={blog.thumbnailUrl}
//                                                     alt={blog.title}
//                                                     style={{ width: "80px", height: "60px", objectFit: "cover" }}
//                                                     className="rounded"
//                                                 />
//                                             </td>
//                                             <td>
//                                                 <div className="fw-bold">{blog.title}</div>
//                                                 <div className="d-md-none text-muted small mt-1">
//                                                     {getFirstParagraph(blog.sections)}
//                                                 </div>
//                                             </td>
//                                             <td className="d-none d-lg-table-cell">
//                                                 <div className="text-muted small">
//                                                     {getFirstParagraph(blog.sections)}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="text-muted small">
//                                                     <FaCalendarAlt className="me-1" /> {formatDate(blog.createdAt)}
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div className="btn-group flex-column flex-sm-row" role="group">
//                                                     <Link to={`/superadmin/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
//                                                         <FaEye />
//                                                     </Link>
//                                                     <button
//                                                         className="btn btn-sm btn-outline-danger"
//                                                         onClick={() => handleDelete(blog._id)}
//                                                     >
//                                                         <FaTrash />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <style>{`
//                 .blog-card {
//                     transition: transform 0.3s ease, box-shadow 0.3s ease;
//                 }
//                 .blog-card:hover {
//                     transform: translateY(-5px);
//                     box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
//                 }
//                 .blog-image {
//                     height: 200px;
//                     object-fit: cover;
//                     transition: transform 0.5s ease;
//                 }
//                 .blog-card:hover .blog-image {
//                     transform: scale(1.05);
//                 }
//                 .table-hover tbody tr:hover {
//                     background-color: rgba(0,0,0,.03);
//                 }
//                 @media (max-width: 576px) {
//                     .btn-group .btn {
//                         font-size: 0.75rem;
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default SuperAdminAllBlog;









import axios from "axios";
import { useState, useEffect } from "react";
import { FaTrash, FaEye, FaSearch, FaPlus, FaCalendarAlt, FaTh, FaList } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../context/auth-context";
import toast from "react-hot-toast";

const SuperAdminAllBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState(null);
    const navigate = useNavigate();
    const { server, token } = useAuthContext();

    // Data Of Blog
    useEffect(() => {
        const getBlogs = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/blogs/getBlogs`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const { blogs } = res.data
                setBlogs(blogs);
                setFilteredBlogs(blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }

        getBlogs()

    }, []);

    // Filter blogs based on search term
    useEffect(() => {
        let result = blogs;

        // Filter by search term
        if (searchTerm) {
            result = result.filter(blog =>
                blog.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBlogs(result);
    }, [blogs, searchTerm]);

    const handleDelete = async (id) => {
        // Set the blog to delete and show the modal
        const blog = blogs.find(b => b._id === id);
        setBlogToDelete(blog);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!blogToDelete) return;

        setLoading(true);
        setShowDeleteModal(false);
        try {
            const res = await axios.delete(`${server}/api/v1/blogs/deleteBlog/${blogToDelete._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(res.data.message)
            setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
            setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== blogToDelete._id));
        } catch (error) {
            toast.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
            setBlogToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setBlogToDelete(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getFirstParagraph = (sections) => {
        const paragraphSection = sections.find(section => section.type === "paragraph");
        return paragraphSection ? paragraphSection.content.substring(0, 200) + "..." : "";
    };

    const handleNewBlog = () => {
        navigate("/superadmin/create-new-blog");
    };

    return (
        <div className="container-fluid bg-light">
            <div className="container">
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
                    <h2 className="mb-3 mb-md-0 text-primary fw-bold">All Blogs</h2>
                    <button className="btn btn-sm btn-primary" onClick={handleNewBlog}>
                        <FaPlus className="me-2" /> Create New Blog
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="card shadow-sm mb-4 border-0">
                    <div className="card-body p-3 p-md-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-12 col-md-8">
                                <div className="input-group input-group-sm">
                                    <span className="input-group-text bg-white border-end-0">
                                        <FaSearch />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0 ps-0"
                                        placeholder="Search blogs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="btn-group w-100" role="group">
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <FaTh className="me-1 me-md-2" />
                                        <span className="d-none d-md-inline">Grid</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setViewMode("list")}
                                    >
                                        <FaList className="me-1 me-md-2" />
                                        <span className="d-none d-md-inline">List</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div
                        className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-light bg-opacity-50"
                        style={{ zIndex: 1050 }}
                    >
                        <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{ width: "3rem", height: "3rem" }}
                        >
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}

                {/* No Results State */}
                {!loading && filteredBlogs.length === 0 && (
                    <div className="text-center py-5 bg-white rounded shadow-sm">
                        <div className="mb-4">
                            <FaSearch className="text-muted" style={{ fontSize: "3rem" }} />
                        </div>
                        <h4 className="text-muted">No blogs found</h4>
                        <p className="text-muted">Try adjusting your search criteria</p>
                    </div>
                )}

                {/* Grid View */}
                {!loading && filteredBlogs.length > 0 && viewMode === "grid" && (
                    <div className="row g-4">
                        {filteredBlogs.map((blog) => (
                            <div key={blog._id} className="col-12 col-sm-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 overflow-hidden blog-card">
                                    <div className="position-relative">
                                        <img
                                            src={blog.thumbnailUrl}
                                            className="card-img-top blog-image border-bottom border-black"
                                            alt={blog.title}
                                        />
                                        <div className="position-absolute top-0 end-0 p-2">
                                            <span className="badge bg-primary">Blog</span>
                                        </div>
                                    </div>
                                    <div className="card-body d-flex flex-column p-3 p-md-4">
                                        <h5 className="card-title fw-bold mb-3">{blog.title}</h5>
                                        <p className="card-text text-muted flex-grow-1">{getFirstParagraph(blog.sections)}</p>
                                        <div className="d-flex align-items-center mt-auto text-muted small">
                                            <FaCalendarAlt className="me-2" /> {formatDate(blog.createdAt)}
                                        </div>
                                    </div>
                                    <div className="card-footer bg-white border-0 p-3 p-md-4 pt-0">
                                        <div className="d-flex flex-column flex-sm-row gap-2">
                                            <Link to={`/superadmin/blog/${blog._id}`} className="btn btn-sm btn-primary flex-fill">
                                                <FaEye className="me-1" /> Read
                                            </Link>
                                            <button
                                                className="btn btn-sm btn-outline-danger flex-fill"
                                                onClick={() => handleDelete(blog._id)}
                                            >
                                                <FaTrash className="me-1" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* List View */}
                {!loading && filteredBlogs.length > 0 && viewMode === "list" && (
                    <div className="card shadow-sm border-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="d-none d-md-table-cell">Image</th>
                                        <th scope="col">Title</th>
                                        <th scope="col" className="d-none d-lg-table-cell">Excerpt</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.map((blog) => (
                                        <tr key={blog._id}>
                                            <td className="d-none d-md-table-cell">
                                                <img
                                                    src={blog.thumbnailUrl}
                                                    alt={blog.title}
                                                    style={{ width: "80px", height: "60px", objectFit: "cover" }}
                                                    className="rounded"
                                                />
                                            </td>
                                            <td>
                                                <div className="fw-bold">{blog.title}</div>
                                                <div className="d-md-none text-muted small mt-1">
                                                    {getFirstParagraph(blog.sections)}
                                                </div>
                                            </td>
                                            <td className="d-none d-lg-table-cell">
                                                <div className="text-muted small">
                                                    {getFirstParagraph(blog.sections)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-muted small">
                                                    <FaCalendarAlt className="me-1" /> {formatDate(blog.createdAt)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="btn-group flex-column flex-sm-row" role="group">
                                                    <Link to={`/superadmin/blog/${blog._id}`} className="btn btn-sm btn-outline-primary">
                                                        <FaEye />
                                                    </Link>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(blog._id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
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
                                {blogToDelete && (
                                    <>
                                        <p>Are you sure you want to delete this blog post?</p>
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <h6 className="card-title">{blogToDelete.title}</h6>
                                                <p className="card-text text-muted small">
                                                    {getFirstParagraph(blogToDelete.sections)}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-danger fw-bold">This action cannot be undone.</p>
                                    </>
                                )}
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

            <style>{`
                .blog-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
                }
                .blog-image {
                    height: 200px;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }
                .blog-card:hover .blog-image {
                    transform: scale(1.05);
                }
                .table-hover tbody tr:hover {
                    background-color: rgba(0,0,0,.03);
                }
                @media (max-width: 576px) {
                    .btn-group .btn {
                        font-size: 0.75rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SuperAdminAllBlog;