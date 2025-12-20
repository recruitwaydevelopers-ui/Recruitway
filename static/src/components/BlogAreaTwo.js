import axios from "axios";
import { useState, useEffect } from "react";
import { FaRegFolderOpen, FaRegUser, FaSearch, FaFilter, FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HashLoader } from "react-spinners";
const server = process.env.REACT_APP_SERVER;

const BlogAreaTwo = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getBlogs = async () => {
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

    getBlogs();
  }, []);

  useEffect(() => {
    let filtered = blogs;

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

    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const getExcerpt = (sections, maxLength = 120) => {
    const para = sections?.find((s) => s.type === "paragraph")?.content || "";
    return para.length > maxLength ? para.slice(0, maxLength) + "..." : para;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/*===================== Blog Area Two start =====================*/}
      <div className="blog-area pd-top-60 pd-bottom-90 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="section-title text-center mb-5">
                <h6 className="sub-title">OUR BLOG</h6>
                <h2 className="title">
                  Latest Insights on Technical Hiring
                </h2>
                <p className="content mt-3">
                  Discover expert advice, industry trends, and innovative solutions to streamline your hiring process
                </p>
                
                {/* View All Blogs Button */}
                <Link to="/allblogs" className="view-all-btn mt-4">
                  View All Blogs
                  <FaArrowRight className="ms-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="row mb-5">
            <div className="col-lg-8 mx-auto">
              <div className="search-container">
                <div className="search-box position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <FaSearch className="position-absolute" style={{ left: "20px", top: "20px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="row justify-content-center">
              <div className="col-lg-12 text-center py-5">
                <HashLoader color="#4a6cf7" size={50} />
                <p className="mt-3">Loading amazing articles...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              {filteredBlogs.length > 0 ? (
                <div className="row">
                  {filteredBlogs.map((blog, index) => (
                    <div
                      className="col-lg-4 col-md-6 mb-4"
                      key={blog._id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      data-aos-duration="1200"
                    >
                      <div className="blog-card h-100">
                        <div className="blog-image-container">
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="blog-image"
                          />
                          <div className="blog-date-badge">
                            <FaCalendarAlt className="me-1" />
                            {formatDate(blog.createdAt)}
                          </div>
                        </div>

                        <div className="blog-content">
                          <div className="blog-meta mb-3">
                            <div className="blog-author">
                              <FaRegUser className="me-1" />
                              Admin
                            </div>
                            <div className="blog-category">
                              <FaRegFolderOpen className="me-1" />
                              Blog
                            </div>
                          </div>

                          <h3 className="blog-title">{blog.title}</h3>

                          <p className="blog-excerpt">{getExcerpt(blog.sections)}</p>

                          {/* <div className="blog-tags mb-3">
                            {extractTags(blog.sections).map((tag, idx) => (
                              <span key={idx} className="blog-tag">
                                <FaTag className="me-1" />
                                {tag}
                              </span>
                            ))}
                          </div> */}

                          <Link
                            className="blog-read-more"
                            to={`/blog/${blog.title}`}
                            state={{ blogId: blog._id }}
                          >
                            Read More
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="row justify-content-center">
                  <div className="col-lg-8 text-center py-5">
                    <div className="no-results">
                      <FaFilter size={50} className="mb-3 text-muted" />
                      <h4>No articles found</h4>
                      <p className="text-muted">
                        Try adjusting your search criteria
                      </p>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          setSearchTerm("");
                        }}
                      >
                        Reset Search
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ===================== BlogAreaTwo End =====================*/}

      <style jsx>{`
        .blog-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .blog-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .blog-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }
        
        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .blog-card:hover .blog-image {
          transform: scale(1.05);
        }
        
        .blog-date-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #333;
          display: flex;
          align-items: center;
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
          font-size: 0.85rem;
          color: #666;
        }
        
        .blog-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 15px;
          line-height: 1.4;
          color: #333;
          transition: color 0.3s ease;
        }
        
        .blog-card:hover .blog-title {
          color: #4a6cf7;
        }
        
        .blog-excerpt {
          color: #666;
          margin-bottom: 20px;
          flex-grow: 1;
          line-height: 1.6;
        }
        
        .blog-read-more {
          display: inline-flex;
          align-items: center;
          font-weight: 600;
          color: #4a6cf7;
          text-decoration: none;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .blog-read-more:after {
          content: "→";
          margin-left: 5px;
          transition: transform 0.3s ease;
        }
        
        .blog-read-more:hover {
          color: #3a5bd9;
        }
        
        .blog-read-more:hover:after {
          transform: translateX(5px);
        }
        
        .search-box input {
          border-radius: 30px;
          border: 1px solid #e0e0e0;
          padding: 12px 20px 12px 50px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .search-box input:focus {
          border-color: #4a6cf7;
          box-shadow: 0 0 0 0.2rem rgba(74, 108, 247, 0.25);
        }
        
        .no-results {
          padding: 40px 20px;
        }
        
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          background: linear-gradient(90deg, #4a6cf7, #6c63ff);
          color: white;
          padding: 12px 24px;
          border-radius: 30px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
          margin-top: 20px;
        }
        
        .view-all-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(74, 108, 247, 0.4);
          color: white;
        }
        
        .view-all-btn svg {
          transition: transform 0.3s ease;
        }
        
        .view-all-btn:hover svg {
          transform: translateX(3px);
        }
      `}</style>
    </>
  );
};

export default BlogAreaTwo;