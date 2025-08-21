import React from "react";
import { FaRegFolderOpen, FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const BlogAreaTwo = () => {
  return (
    <>
      {/*===================== Blog Area Two start =====================*/}
      <div className='blog-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-8' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='section-title text-center'>
                <h6 className='sub-title'>Our BLOG</h6>
                <h2 className='title'>
                Latest Blog Posts on Mastering Technical Interviews
                </h2>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-4 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='single-blog-list style-2'>
                <div className='thumb'>
                  <img src='assets/img/blog/blog-1.jpg' alt='img' />
                </div>
                <div className='details'>
                  <ul className='blog-meta'>
                    <li className='date'>15 MAY</li>
                    <li>
                      <FaRegUser /> By Admin
                    </li>
                    <li>
                      <FaRegFolderOpen /> Category
                    </li>
                  </ul>
                  <h5 className='mb-3'>
                    <Link to='/harnessing'>
                    Harnessing AI to Find Top Talent
                    </Link>
                  </h5>
                  <p>In today’s fast-paced, technology-driven world, finding and retaining top talent is more critical—and more challenging—than ever.</p>
                  <Link className='read-more-text' to='/harnessing'>
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='single-blog-list style-2'>
                <div className='thumb'>
                  <img src='assets/img/blog/blog-2.jpg' alt='img' />
                </div>
                <div className='details'>
                  <ul className='blog-meta'>
                    <li className='date'>15 MAY</li>
                    <li>
                      <FaRegUser /> By Admin
                    </li>
                    <li>
                      <FaRegFolderOpen /> Category
                    </li>
                  </ul>
                  <h5 className='mb-3'>
                    <Link to='/breaking'>
                    Breaking Bias and Boosting Reliability in Technical Hiring
                    </Link>
                  </h5>
                  <p>In the fast-evolving world of technology, hiring the right talent is more critical than ever. </p>
                  <Link className='read-more-text' to='/breaking'>
                    Read More
                  </Link>
                </div>
              </div>
            </div>
            <div className='col-lg-4 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='single-blog-list style-2'>
                <div className='thumb'>
                  <img src='assets/img/blog/blog-3.jpg' alt='img' />
                </div>
                <div className='details'>
                  <ul className='blog-meta'>
                    <li className='date'>15 MAY</li>
                    <li>
                      <FaRegUser /> By Admin
                    </li>
                    <li>
                      <FaRegFolderOpen /> Category
                    </li>
                  </ul>
                  <h5 className='mb-3'>
                    <Link to='/growing'>
                    The Growing Threat in Technical Interviews
                    </Link>
                  </h5>
                  <p>The job market is becoming increasingly competitive, and with remote hiring</p>
                  <Link className='read-more-text' to='/growing'>
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== BlogAreaTwo End =====================*/}
    </>
  );
};

export default BlogAreaTwo;
