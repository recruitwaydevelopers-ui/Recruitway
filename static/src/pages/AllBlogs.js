import { useState, useEffect } from 'react';
import NavbarTwo from '../components/NavbarTwo';
import FooterTwo from '../components/FooterTwo';
import {
    FaCalendarAlt,
    FaRegFolderOpen,
    FaRegUser,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
const server = process.env.REACT_APP_SERVER;

const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(9);

    useEffect(() => {
        const getAllBlogs = async () => {
            try {
                const res = await axios.get(`${server}/api/v1/blogs/getAllBlogs`);
                const { blogs } = res.data;
                setBlogs(blogs);
                setFilteredBlogs(blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        getAllBlogs();
    }, []);

    // Filter blogs based on search term and date filter
    useEffect(() => {
        let filtered = [...blogs];

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    blog.sections.some(
                        (section) =>
                            section.type === "paragraph" &&
                            section.content.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );
        }

        // Filter by date
        if (dateFilter !== "all") {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case "week":
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case "month":
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case "year":
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
                default:
                    break;
            }

            filtered = filtered.filter(
                (blog) => new Date(blog.createdAt) >= filterDate
            );
        }

        setFilteredBlogs(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [searchTerm, dateFilter, blogs]);

    // Get current posts for pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredBlogs.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get excerpt from blog content
    const getExcerpt = (sections, maxLength = 120) => {
        const para = sections?.find((s) => s.type === "paragraph")?.content || "";
        return para.length > maxLength ? para.slice(0, maxLength) + "..." : para;
    };

    if (!blogs || blogs.length === 0) {
        return;
    }

    if (loading) {
        return (
            <div className="preloader">
                <div className="preloader-inner">
                    <div className="preloader-dot"></div>
                    <div className="preloader-dot"></div>
                    <div className="preloader-dot"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Navigation Bar */}
            <NavbarTwo />

            <style jsx>{`
                :root {
                    --primary-color: #4a6cf7;
                    --secondary-color: #6c63ff;
                    --text-primary: #2d3748;
                    --text-secondary: #4a5568;
                    --text-light: #718096;
                    --bg-color: #f7fafc;
                    --card-bg: #ffffff;
                    --border-color: #e2e8f0;
                    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
                    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
                    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
                    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
                    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .preloader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }

                .preloader-inner {
                    display: flex;
                    gap: 10px;
                }

                .preloader-dot {
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background-color: var(--primary-color);
                    animation: preloader-bounce 1.4s infinite ease-in-out both;
                }

                .preloader-dot:nth-child(1) {
                    animation-delay: -0.32s;
                }

                .preloader-dot:nth-child(2) {
                    animation-delay: -0.16s;
                }

                @keyframes preloader-bounce {
                    0%, 80%, 100% {
                        transform: scale(0);
                    }
                    40% {
                        transform: scale(1);
                    }
                }

                .blog-area {
                    padding: 80px 0 120px;
                    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
                    position: relative;
                    overflow: hidden;
                }

                .blog-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .section-header {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .section-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 15px;
                    position: relative;
                    display: inline-block;
                }

                .section-title::after {
                    content: "";
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    border-radius: 2px;
                }

                .section-subtitle {
                    font-size: 1.1rem;
                    color: var(--text-secondary);
                    margin-top: 20px;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .search-filter-container {
                    background: var(--card-bg);
                    border-radius: 16px;
                    padding: 30px;
                    margin-bottom: 50px;
                    box-shadow: var(--shadow-md);
                }

                .search-box {
                    position: relative;
                    margin-bottom: 25px;
                }

                .search-input {
                    width: 100%;
                    padding: 15px 20px 15px 55px;
                    border: 2px solid var(--border-color);
                    border-radius: 12px;
                    font-size: 16px;
                    transition: var(--transition);
                    background-color: var(--bg-color);
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
                    background-color: var(--card-bg);
                }

                .search-icon {
                    position: absolute;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-light);
                    font-size: 18px;
                }

                .filter-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                }

                .filter-label {
                    font-weight: 600;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .filter-select {
                    padding: 12px 20px;
                    border: 2px solid var(--border-color);
                    border-radius: 10px;
                    background-color: var(--bg-color);
                    font-size: 15px;
                    cursor: pointer;
                    transition: var(--transition);
                    min-width: 180px;
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 4px rgba(74, 108, 247, 0.1);
                    background-color: var(--card-bg);
                }

                .results-info {
                    margin-bottom: 30px;
                    color: var(--text-secondary);
                    font-size: 15px;
                    font-weight: 500;
                }

                .blog-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 30px;
                    margin-bottom: 50px;
                }

                .blog-card {
                    background: var(--card-bg);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                    transition: var(--transition);
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    border: 1px solid var(--border-color);
                }

                .blog-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }

                .blog-thumbnail {
                    position: relative;
                    height: 220px;
                    overflow: hidden;
                }

                .blog-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.5s ease;
                }

                .blog-card:hover .blog-thumbnail img {
                    transform: scale(1.05);
                }

                .blog-content {
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }

                .blog-meta {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    color: var(--text-light);
                    font-size: 14px;
                }

                .blog-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                }

                .blog-meta-item svg {
                    color: var(--primary-color);
                }

                .blog-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    color: var(--text-primary);
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .blog-excerpt {
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                    line-height: 1.6;
                    flex-grow: 1;
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .blog-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding-top: 15px;
                    border-top: 1px solid var(--border-color);
                }

                .blog-date {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-light);
                    font-size: 14px;
                    font-weight: 500;
                }

                .blog-date svg {
                    color: var(--primary-color);
                }

                .read-more {
                    display: inline-flex;
                    align-items: center;
                    color: var(--primary-color);
                    font-weight: 600;
                    text-decoration: none;
                    transition: var(--transition);
                    font-size: 15px;
                }

                .read-more:hover {
                    color: var(--secondary-color);
                }

                .read-more svg {
                    margin-left: 6px;
                    transition: var(--transition);
                }

                .read-more:hover svg {
                    transform: translateX(3px);
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 40px;
                }

                .page-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 45px;
                    height: 45px;
                    border-radius: 10px;
                    background: var(--card-bg);
                    border: 2px solid var(--border-color);
                    color: var(--text-secondary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition);
                    font-size: 15px;
                }

                .page-btn:hover {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                }

                .page-btn.active {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .no-results {
                    text-align: center;
                    padding: 80px 20px;
                    color: var(--text-secondary);
                }

                .no-results svg {
                    font-size: 4rem;
                    color: var(--text-light);
                    margin-bottom: 25px;
                }

                .no-results h3 {
                    font-size: 1.8rem;
                    margin-bottom: 15px;
                    color: var(--text-primary);
                    font-weight: 700;
                }

                .no-results p {
                    font-size: 1.1rem;
                    max-width: 500px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                @media (max-width: 992px) {
                    .blog-grid {
                        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .blog-area {
                        padding: 60px 0 80px;
                    }

                    .section-title {
                        font-size: 2.2rem;
                    }

                    .filter-row {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .filter-select {
                        width: 100%;
                    }
                }

                @media (max-width: 576px) {
                    .section-title {
                        font-size: 1.9rem;
                    }

                    .blog-grid {
                        grid-template-columns: 1fr;
                    }

                    .search-filter-container {
                        padding: 20px;
                    }
                }
            `}</style>

            <div className="blog-area">
                <div className="blog-container">
                    <div className="section-header">
                        <h1 className="section-title">Our Blog</h1>
                        <p className="section-subtitle">
                            Discover the latest insights, trends, and innovations in our collection of articles
                        </p>
                    </div>

                    <div className="search-filter-container">
                        <div className="search-box">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search articles by title or content..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-row">
                            <div className="filter-label">
                                <FaCalendarAlt />
                                Filter by date:
                            </div>
                            <select
                                className="filter-select"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            >
                                <option value="all">All Time</option>
                                <option value="week">Past Week</option>
                                <option value="month">Past Month</option>
                                <option value="year">Past Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="results-info">
                        {filteredBlogs.length > 0
                            ? `Showing ${indexOfFirstPost + 1}-${Math.min(indexOfLastPost, filteredBlogs.length)} of ${filteredBlogs.length} articles`
                            : "No articles found"
                        }
                    </div>

                    {filteredBlogs.length > 0 ? (
                        <>
                            <div className="blog-grid">
                                {currentPosts.map((blog) => (
                                    <div key={blog._id} className="blog-card">
                                        <div className="blog-thumbnail">
                                            <img
                                                src={blog.thumbnailUrl}
                                                alt={blog.title}
                                            />
                                        </div>
                                        <div className="blog-content">
                                            <div className="blog-meta">
                                                <div className="blog-meta-item">
                                                    <FaRegUser />
                                                    <span>Admin</span>
                                                </div>
                                                <div className="blog-meta-item">
                                                    <FaRegFolderOpen />
                                                    <span>Article</span>
                                                </div>
                                            </div>
                                            <h3 className="blog-title">{blog.title}</h3>
                                            <p className="blog-excerpt">{getExcerpt(blog.sections)}</p>
                                            <div className="blog-footer">
                                                <div className="blog-date">
                                                    <FaCalendarAlt />
                                                    <span>{formatDate(blog.createdAt)}</span>
                                                </div>
                                                <Link
                                                    to={`/blog/${blog.title}`}
                                                    state={{ blogId: blog._id }}
                                                    className="read-more"
                                                >
                                                    Read More
                                                    <FaChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredBlogs.length > postsPerPage && (
                                <div className="pagination">
                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <FaChevronLeft />
                                    </button>

                                    {Array.from({ length: Math.ceil(filteredBlogs.length / postsPerPage) }).map((_, index) => (
                                        <button
                                            key={index}
                                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                                            onClick={() => paginate(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}

                                    <button
                                        className="page-btn"
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredBlogs.length / postsPerPage)}
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-results">
                            <FaSearch />
                            <h3>No articles found</h3>
                            <p>Try adjusting your search or filter criteria to find what you're looking for</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <FooterTwo />
        </>
    )
}

export default AllBlogs;