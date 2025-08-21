import React from "react";
import Marquee from "react-fast-marquee";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
const AboutAreaThree = () => {
  return (
    <>
      {/* =============== About Area Three End ===============*/}
      <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row'>
            <div
              className='col-lg-6 '
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/img-101.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 wow animated fadeInRight'
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
               <h2>Join Our Exclusive Pre-Vetted Talent Network</h2>
                <p className="text-align-justify">Stand out to top employers by becoming part of our carefully curated talent pool. After successfully completing our mock interview and evaluation process, you will be showcased as a verified, job-ready candidate. This gives you direct visibility with hiring partners actively seeking skilled professionals. Gain a competitive edge and accelerate your path to exciting career opportunities.</p> 
                <Link className='btn btn-border-base' to='/Request'>Book your interview</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============== About Area Three End ===============*/}
    </>
  );
};

export default AboutAreaThree;
