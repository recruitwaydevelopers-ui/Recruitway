import { useState, useEffect } from 'react';
import FooterTwo from "./FooterTwo";
import NavbarTwo from "./NavbarTwo";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaRegUser,
    FaArrowLeft,
} from "react-icons/fa";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
const server = process.env.REACT_APP_SERVER;

const SingleBlog = () => {
    const { name } = useParams()
    const location = useLocation();
    const { blogId } = location?.state

    const navigate = useNavigate();

    const [scrollProgress, setScrollProgress] = useState(0);
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allBlogs, setAllBlogs] = useState([]);

    useEffect(() => {
        if (!blogId) return;

        const getBlogById = async () => {
            try {
                // Get single blog
                const res = await axios.get(`${server}/api/v1/blogs/getSingleBlogById/${blogId}`);
                const { blog } = res.data
                setBlog(blog);

                // Get all blogs for related posts
                const allRes = await axios.get(`${server}/api/v1/blogs/getAllBlogs`);
                const { blogs } = allRes.data;
                setAllBlogs(blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        }

        getBlogById()
    }, [blogId]);

    // Track reading progress
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Get related posts (excluding current blog, max 3)
    const getRelatedPosts = () => {
        if (!allBlogs.length || !blog) return [];
        return allBlogs
            .filter(b => b._id !== blog._id)
            .slice(0, 3);
    };

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

    if (!blog) {
        return (
            <div className="blog-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8 text-center py-5">
                            <h2>Blog not found</h2>
                            <p>The blog you're looking for doesn't exist.</p>
                            <Link to="/blog" className="btn btn-primary mt-3">Back to Blogs</Link>
                        </div>
                    </div>
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
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 40px;
                }

                .blog-main {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .blog-card {
                    background: var(--card-bg);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-lg);
                    transition: var(--transition);
                }

                .blog-thumbnail {
                    position: relative;
                    height: 400px;
                    overflow: hidden;
                }

                .blog-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: var(--transition);
                }

                .blog-card:hover .blog-thumbnail img {
                    transform: scale(1.05);
                }

                .blog-thumbnail::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 120px;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
                    z-index: 1;
                }

                .blog-content {
                    padding: 40px;
                }

                .blog-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 25px;
                    color: var(--text-light);
                    font-size: 14px;
                }

                .blog-meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .blog-meta-item svg {
                    color: var(--primary-color);
                }

                .blog-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 25px;
                    color: var(--text-primary);
                    position: relative;
                    padding-bottom: 15px;
                }

                .blog-title::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    border-radius: 2px;
                }

                .blog-heading {
                    font-size: 1.8rem;
                    font-weight: 600;
                    margin: 35px 0 20px;
                    color: var(--text-primary);
                    position: relative;
                    padding-left: 15px;
                }

                .blog-heading::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 5px;
                    height: calc(100% - 10px);
                    width: 4px;
                    background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
                    border-radius: 2px;
                }

                .blog-paragraph {
                    font-size: 1.1rem;
                    line-height: 1.8;
                    color: var(--text-secondary);
                    margin-bottom: 20px;
                }

                .blog-list {
                    margin: 25px 0;
                    padding-left: 10px;
                }

                .blog-list-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    margin-bottom: 15px;
                    padding: 12px 15px;
                    background: rgba(74, 108, 247, 0.05);
                    border-radius: 8px;
                    transition: var(--transition);
                }

                .blog-list-item:hover {
                    background: rgba(74, 108, 247, 0.1);
                    transform: translateX(5px);
                }

                .blog-list-item svg {
                    color: var(--primary-color);
                    font-size: 20px;
                    margin-top: 3px;
                    flex-shrink: 0;
                }

                .blog-sidebar {
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }

                .sidebar-widget {
                    background: var(--card-bg);
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                }

                .widget-header {
                    padding: 20px;
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    color: white;
                    font-weight: 600;
                    font-size: 18px;
                }

                .widget-content {
                    padding: 20px;
                }

                .related-posts {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .related-post {
                    display: flex;
                    gap: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid var(--border-color);
                    cursor: pointer;
                    transition: var(--transition);
                }

                .related-post:last-child {
                    border-bottom: none;
                    padding-bottom: 0;
                }

                .related-post:hover {
                    transform: translateX(5px);
                }

                .related-post-thumb {
                    width: 80px;
                    height: 80px;
                    border-radius: 8px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .related-post-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: var(--transition);
                }

                .related-post:hover .related-post-thumb img {
                    transform: scale(1.05);
                }

                .related-post-content h5 {
                    margin: 0 0 5px;
                    font-size: 16px;
                    line-height: 1.4;
                    color: var(--text-primary);
                }

                .related-post-meta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 12px;
                    color: var(--text-light);
                }

                .related-post-meta span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }

                .blog-navigation {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 40px;
                }

                @media (max-width: 992px) {
                    .blog-container {
                        grid-template-columns: 1fr;
                    }

                    .blog-sidebar {
                        order: -1;
                    }

                    .blog-title {
                        font-size: 2.2rem;
                    }
                }

                @media (max-width: 768px) {
                    .blog-area {
                        padding: 60px 0 80px;
                    }

                    .blog-thumbnail {
                        height: 280px;
                    }

                    .blog-content {
                        padding: 30px 20px;
                    }

                    .blog-title {
                        font-size: 1.9rem;
                    }

                    .blog-heading {
                        font-size: 1.5rem;
                    }

                    .blog-paragraph {
                        font-size: 1rem;
                    }

                    .blog-navigation {
                        flex-direction: column;
                        gap: 15px;
                    }
                }

                @media (max-width: 576px) {
                    .blog-title {
                        font-size: 1.7rem;
                    }

                    .blog-heading {
                        font-size: 1.3rem;
                    }

                    .blog-meta {
                        gap: 15px;
                    }
                }
            `}</style>

            <div className="blog-area">
                <div className="blog-container">
                    <div className="blog-main">
                        <div className="blog-card">
                            {/* Thumbnail */}
                            <div className="blog-thumbnail">
                                <img
                                    src={blog?.thumbnailUrl}
                                    alt={blog?.title}
                                />
                            </div>

                            {/* Blog Content */}
                            <div className="blog-content">
                                {/* Blog Meta */}
                                <div className="blog-meta">
                                    <div className="blog-meta-item">
                                        <FaRegUser />
                                        <span>Admin</span>
                                    </div>
                                    <div className="blog-meta-item">
                                        <FaCalendarAlt />
                                        <span>{formatDate(blog?.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Blog Title */}
                                <h1 className="blog-title">{blog?.title}</h1>

                                {/* Blog Body */}
                                {blog?.sections.map((section) => {
                                    switch (section.type) {
                                        case "heading":
                                            return (
                                                <h2 key={section._id} className="blog-heading">
                                                    {section.content}
                                                </h2>
                                            );

                                        case "paragraph":
                                            return (
                                                <p key={section._id} className="blog-paragraph">
                                                    {section.content}
                                                </p>
                                            );

                                        case "list":
                                            return (
                                                <div key={section._id} className="blog-list">
                                                    <div className="blog-list-item">
                                                        <FaCheckCircle />
                                                        <span>{section.content}</span>
                                                    </div>
                                                </div>
                                            );

                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        </div>

                        {/* Blog Navigation */}
                        <button
                            type="button"
                            className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2"
                            style={{ lineHeight: 1 }}
                            onClick={() => navigate("/allblogs")}
                        >
                            <FaArrowLeft size={14} style={{ marginTop: 0 }} />
                            <span className="lh-1">View All Blogs</span>
                        </button>
                    </div>

                    {/* Blog Sidebar */}
                    <div className="blog-sidebar">
                        {/* Related Posts Widget */}
                        <div className="sidebar-widget">
                            <div className="widget-header">Related Posts</div>
                            <div className="widget-content">
                                <div className="related-posts">
                                    {getRelatedPosts().map(post => (
                                        <div
                                            key={post._id}
                                            className="related-post"
                                            onClick={() =>
                                                navigate(`/blog/${post.title}`, {
                                                    state: { blogId: post._id }
                                                })
                                            }
                                        >
                                            <div className="related-post-thumb">
                                                <img src={post.thumbnailUrl} alt={post.title} />
                                            </div>
                                            <div className="related-post-content">
                                                <h5>{post.title}</h5>
                                                <div className="related-post-meta">
                                                    <span><FaCalendarAlt /> {formatDate(post.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <FooterTwo />
        </>
    )
}

export default SingleBlog;