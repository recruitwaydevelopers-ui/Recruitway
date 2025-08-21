import React from "react";
import { FaArrowRight, FaRegFolderOpen, FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
const BlogAreaThree = () => {
  return (
    <>
      {/*===================== Blog Area Three start =====================*/}
      <div className='blog-area pd-top-120 pd-bottom-90'>
        <div className='container'>
          <div className='section-title'>
            <div className='row'>
              <div className='col-lg-12'>
                <h2 className='title'>
                 Our Blog
                </h2>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-4 col-md-6'>
            <Link to='/Harnessing' className='single-blog-list d-block text-decoration-none text-dark'>
              <div className='thumb'>
                <img
                  className='border-radius-5'
                  src='assets/img/blog/blog-1.jpg'
                  alt='img'
                />
                <p className='date'>5 Feb 2025</p>
              </div>
              <div className='details'>
                <h5 className='mb-4'>
                  Harnessing AI to Find Top Talent
                </h5>
                <p>
                  In today’s fast-paced, technology-driven world, finding and retaining top talent is more critical—and more challenging—than ever.
                </p>
                <span className='btn btn-border-base'>
                  Read More 
                </span>
              </div>
            </Link>
          </div>
            <div className='col-lg-4 col-md-6'>
            <Link  to='/Breaking'  className='single-blog-list d-block text-decoration-none text-dark'>
              <div className='thumb'>
                <img
                  className='border-radius-5'
                  src='assets/img/blog/blog-2.jpg'
                  alt='img'
                />
                <p className='date'>5 Feb 2025</p>
              </div>
              <div className='details'>
                <h5 className='mb-4'>
                  Breaking Bias and Boosting Reliability in Technical Hiring
                </h5>
                <p>
                  In the fast-evolving world of technology, hiring the right talent is more critical than ever.
                </p>
                <span className='btn btn-border-base'>Read More</span>
              </div>
            </Link>
          </div>
            <div className='col-lg-4 col-md-6'>
              <Link to='/Growing' className='single-blog-list d-block text-decoration-none text-dark' >
                <div className='thumb'>
                  <img
                    className='border-radius-5'
                    src='assets/img/blog/blog-3.jpg'
                    alt='img'
                  />
                  <p className='date'>5 Feb 2025</p>
                </div>
                <div className='details'>
                  <h5 className='mb-4'>
                    The Growing Threat in Technical Interviews
                  </h5>
                  <p>
                    The job market is becoming increasingly competitive, and with remote hiring
                  </p>
                  <span className='btn btn-border-base'>Read More</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BlogAreaThree End =====================*/}
    </>
  );
};

export default BlogAreaThree;
