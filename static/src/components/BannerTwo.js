import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ModalVideo from "react-modal-video";
const BannerTwo = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {/* ================== BannerTwo Start ==================*/}
      <div
        className='banner-area bg-relative banner-area-2 bg-cover'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6 align-self-center' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
            <div className="main-btnhome pd-bottom-30">
                <div
                  className='subtitle set-space-top-org ORGANIZATIONS-res'>
                <h6>ORGANIZATIONS</h6>
                </div>
                <div className='subtitle set-space-top-btn'>
             <h6><Link to='/Candidate'>CANDIDATES <svg xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 18 12" fill="none" transform="rotate(-45)"><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></Link></h6>
                </div>
                <div className='subtitle set-space-top-btn'>
               <h6><Link to='/Interviewers'>JOIN AS INTERVIEWER <svg xmlns="http://www.w3.org/2000/svg" width="18" height="10" viewBox="0 0 18 12" fill="none" transform="rotate(-45)"><path d="M1 6H17M17 6L12 1M17 6L12 11" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></Link></h6>
                </div>
                </div>

              <div className='banner-inner pe-xl-5'>
                
                <h2
                  className='title '
                  data-aos='fade-up'
                  data-aos-delay='200'
                  data-aos-duration='1500'
                >
                  {" "}
                  Empower your tech <span>hiring</span> with expert-led interviews
                </h2>
                <p
                  className='content pe-xl-5 '
                  data-aos='fade-up'
                  data-aos-delay='250'
                  data-aos-duration='1500'
                >
                Streamline your hiring process with our exclusive platform dedicated to evaluating the technical skills of potential hires, powered by top industry experts.
                </p>
                <Link
                  className='btn btn-border-base '
                  data-aos='fade-up'
                  data-aos-delay='300'
                  data-aos-duration='1500'
                  to='/Request'
                >
                 Request Demo
                </Link>
                <div
                  className='d-inline-block align-self-center '
                  data-aos='fade-up'
                  data-aos-delay='350'
                  data-aos-duration='1500'
                >
                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-9' data-aos='fade-up' data-aos-delay='100' data-aos-duration='1500'>
                  <div className='banner-thumb-2 mt-4 mt-lg-0'>
              <video
                className="bg-shape"
                autoPlay
                loop
                preload="auto"
                muted
                playsInline
                style={{ width:"100%", maxWidth: "330px", paddingTop: "10px", borderRadius: "15px" }}
              >
                <source src="/assets/video/video2.mp4" type="video/mp4"/>
              </video>
              <img className="banner-animate-img banner-animate-img-1 top_image_bounce" src="assets/img/banner/2.png" alt="img" />
              <div className="text-center">
                <video
                  className="bg-shape"
                  autoPlay
                  loop
                  preload="auto"
                  muted
                  playsInline
                  style={{ width: "100%", maxWidth: "330px", paddingTop: "10px", borderRadius: "15px" }}
                >
                  <source src="/assets/video/video-1.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>

      {/* ================== BannerTwo End ==================*/}
    </>
  );
};

export default BannerTwo;
