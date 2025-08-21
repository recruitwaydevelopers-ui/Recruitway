import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import CareerAreaOne from "../components/CareerAreaOne";
import Requestdemo from "../components/Requestdemo";
import { Link } from "react-router-dom";

export const JoinInterview = () => {
  return (
    <>
    {/* Navigation Bar Two*/}
    <NavbarTwo />
    {/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Become an Interview Engineer
                </h2>
                <p className='content mb-4'>
                Get instantly paid for every interview that you take & offer more services to candidates
                 </p>
                  <Link className='btn btn-border-base' to='/#'>
                  Connect with LinkedIn
                   </Link>
              </div>
            </div>
            <div
              className='col-lg-6 '
              data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/banner-5.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    
      {/* How to become an interview engineer? */}
      <CareerAreaOne/>
      <div
        className='team-area bg-relative pd-top-120 pd-bottom-90'
        style={{ backgroundImage: 'url("./assets/img/bg/12.png")' }}
      >
        <div className='container'>
          <div className='section-title text-center'>
            <h6 className='sub-title'>Our Elite Expert Panel</h6>
            <h4 className='title text-white'>
            1000+ qualified interviewers available round the clock
            </h4>
          </div>
          <div className='row'>
            <div className='col-lg-3 col-md-6'>
              <div className='single-team-inner style-2 text-center'>
                <div className='thumb'>
                  <img src='assets/img/team/team.jpg' alt='img' />
                </div>
                <div className='details'>
                  <div className='details-inner'>
                    <h5>
                    <Link to='/team-details'>Devon Lane</Link>
                    </h5>
                    <p>Merketing Department</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='single-team-inner style-2 text-center'>
                <div className='thumb'>
                  <img src='assets/img/team/team.jpg' alt='img' />
                </div>
                <div className='details'>
                  <div className='details-inner'>
                    <h5>
                    <Link to='/team-details'>Falcon Lane</Link>
                    </h5>
                    <p>Merketing Department</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='single-team-inner style-2 text-center'>
                <div className='thumb'>
                  <img src='assets/img/team/team.jpg' alt='img' />
                </div>
                <div className='details'>
                  <div className='details-inner'>
                    <h5>
                    <Link to='/team-details'>Wilson Jac</Link>
                    </h5>
                    <p>Merketing Department</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-3 col-md-6'>
              <div className='single-team-inner style-2 text-center'>
                <div className='thumb'>
                  <img src='assets/img/team/team.jpg' alt='img' />
                </div>
                <div className='details'>
                  <div className='details-inner'>
                    <h5>
                    <Link to='/team-details'>Wilson Jac</Link>
                    </h5>
                    <p>Merketing Department</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* why choose us  */}
      <div className='about-area pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className="row">
            <div className="col-lg-12 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'">
            <div className='section-title mb-0'>
                <h2 className='title pd-bottom-30'>
                Why Intervue?
                </h2>
                </div>
            </div>
          </div>
          <div className='row align-items-center wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
            <div className='col-lg-6 d-flex'>
            <div className='section-title mb-0'>
              <h4 className='title mb-40'>
              Skyrocket your earnings
             </h4>
             <p className="text-align-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p> 
              <h4 >Set your own hours</h4>
              <p className="text-align-justify " >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s unknown printer took a galley of type and scrambled it.</p>
              <h4>Become an industry influencer</h4>
              <p className="text-align-justify">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s when an unknown printer took a galley of type and scrambled it.</p>
            </div>
            </div>
            <div className='col-lg-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
              >
                <img className='radius-img' src='assets/img/about/Why-Choose-Only.png' alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

<div className='faq-area bg-cover pd-top-60 pd-bottom-60' style={{ backgroundImage: 'url("./assets/img/bg/3.png")' }}>
<div className='container'>
  <div className='row pd-top-60'>
    <div
      className='col-xl-5 col-lg-6 col-md-8 order-lg-last'
      data-aos='fade-left'
      data-aos-delay='100'
      data-aos-duration='1500'
    >
    <div className='about-thumb-inner pt-lg-3'>
    <img
      className='main-img'
      src='assets/img/about/4.png'
      alt='img'
    />
    <img
      className='animate-img-bottom-right top_image_bounce'
      src='assets/img/about/5.png'
      alt='img'
    />
  </div>
    </div>
    <div
      className='col-xl-7 col-lg-6'
      data-aos='fade-right'
      data-aos-delay='100'
      data-aos-duration='1500'
    >
      <div className='section-title mb-0 mt-4 mt-lg-0'>
        <h6 className='sub-title'>SOME FAQ'S</h6>
        <h2 className='title'>
        Frequently asked questions
        </h2>
        <p className='content'>
          It is a long established fact that a reader will be distr
          acted bioiiy the end gail designa readable content of a page
          when looking.
        </p>
      </div>
      <div
        className='accordion accordion-inner style-2 accordion-icon-left mt-3'
        id='accordionExample'
      >
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingOne'>
            <button
              className='accordion-button'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseOne'
              aria-expanded='true'
              aria-controls='collapseOne'
            >
            Lorem Ipsum is simply dummy
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse show'
            aria-labelledby='headingOne'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingTwo'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseTwo'
              aria-expanded='false'
              aria-controls='collapseTwo'
            >
            Lorem Ipsum is simply dummy
            </button>
          </h2>
          <div
            id='collapseTwo'
            className='accordion-collapse collapse'
            aria-labelledby='headingTwo'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingThree'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseThree'
              aria-expanded='false'
              aria-controls='collapseThree'
            >
            Lorem Ipsum is simply dummy
            </button>
          </h2>
          <div
            id='collapseThree'
            className='accordion-collapse collapse'
            aria-labelledby='headingThree'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<Requestdemo/>
    {/* Footer Two */}
    <FooterTwo />
    </>
  )
}
export default JoinInterview;
