import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import Requestdemo from "../components/Requestdemo";
import Scrollcontent from "../components/Scrollcontent";
import { Link } from "react-router-dom";


export default function Recruitwayqualify() {
  return (
    <>
     {/* Navigation Bar Two*/}
     <NavbarTwo />

{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Identify Top Talent with AI-Powered Screening
                </h2>
                <p className='content mb-4'>
                 Upgrade your hiring process with an intelligent, bias-free AI-driven screening solution that efficiently identifies and advances the most qualified candidates through your pipeline.
                 </p>
                  <Link className='btn btn-border-base' to='/request'>
                    Request Demo
                   </Link>
              </div>
            </div>
            <div
              className='col-lg-6 '
              data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='about-thumb-inner mb-4 mb-lg-0 text-center'>
                <img
                  className='main-img'
                  src='assets/img/about/Main.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Outsourcing Technical Interviews*/}
<div className='service-area bg-gray bg-relative pd-top-60 pd-bottom-60'>
<div className='container'>
  <div className='row justify-content-center'>
    <div className='col-lg-6'>
      <div className='section-title text-center'>
        <h2 className='title'>
         Reimagine applicant screening
        </h2>
      </div>
    </div>
  </div>
  <div className='row'>
    <div className='col-lg-4 col-md-6'>
      <div className='single-service-inner-2 text-center'>
        <div className='thumb'>
          <img src='assets/img/about/AI-Powered.png' alt='img' />
        </div>
        <div className='details'>
          <div className='icon mb-3'>
            <img src='assets/img/service/8.png' alt='img' />
          </div>
          <h5>
            <Link to='/service-details'>AI-Powered Assessments for Smarter Hiring</Link>
          </h5>
          <p>Streamline screening with innovative, Copilot-enhanced AI assessments to identify top talent efficiently.</p>
        </div>
      </div>
    </div>
    <div className='col-lg-4 col-md-6'>
      <div className='single-service-inner-2 text-center'>
        <div className='thumb'>
          <img src='assets/img/about/AI-Driven,-Fair-Talent-Assessment.png' alt='img' />
        </div>
        <div className='details'>
          <div className='icon mb-3'>
            <img src='assets/img/service/9.png' alt='img' />
          </div>
          <h5>
            <Link to='/service-details'>AI-Driven, Fair Talent Assessment</Link>
          </h5>
          <p>Let AI agents evaluate skills, not resumes—ensuring unbiased hiring and opportunity for every candidate.</p>
        </div>
      </div>
    </div>
    <div className='col-lg-4 col-md-6'>
      <div className='single-service-inner-2 text-center'>
        <div className='thumb'>
          <img src='assets/img/about/Smarter-Hiring-with-AI-Powered-Insights.png' alt='img' />
        </div>
        <div className='details'>
          <div className='icon mb-3'>
            <img src='assets/img/service/10.png' alt='img' />
          </div>
          <h5>
            <Link to='/service-details'>Smarter Hiring with AI-Powered Insights</Link>
          </h5>
          <p>Unlock detailed analytics and actionable reports to make data-driven hiring decisions with confidence.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
{/* About Area Two */}
<Scrollcontent/>
<div className="team-areas bg-relative pd-top-60 pb-bottom-60" style={{ backgroundImage: 'url("./assets/img/bg/11.png")' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
              <div className="section-title">
                <h2 className="title">Full support throughout your hiring process.</h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="row">
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500">
                  <div className="main-box-step  colorone mb-3">
                    <h5 className="main-box-step-main">Screen</h5>
                    <div className="img-box">
                    </div>
                    <h4 className="main-box-step-one">Recruitway Qualify</h4>
                    <p className="mb-0">Recruitway streamlines candidate qualification with expert solutions.</p>
                    <div className="main-bottom">
                     <Link  to='/Recruitwayqualify'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="2200">
                  <div className="main-box-step colortwo mb-3">
                    <h5 className="main-box-step-main">Technical Interviews</h5>
                    <div className="img-box">
                    </div>
                    <h4 className="main-box-step-one">Recruitway Interviews</h4>
                    <p className="mb-0">Recruitway simplifies candidate qualification.</p>
                    <div className="main-bottom">
                    <Link  to='/RecruitwayInterview'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="3000">
                  <div className="main-box-step  colorthree mb-3">
                    <h5 className="main-box-step-main">Insights</h5>
                    <div className="img-box">
                    </div>
                    <h4 className="main-box-step-one">Hiring Insights</h4>
                    <p className="mb-0">Unlock insights for smarter, data-driven recruitment decisions.</p>
                    <div className="main-bottom">
                    <Link  to='/HiringInsights'>
                      <div className="circ__inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="11" viewBox="0 0 10 11" fill="none">
                          <path d="M4.5 1L9 5.5M9 5.5L4.5 10M9 5.5H0" stroke="#06101C"></path>
                        </svg>
                      </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
</div>
{/* why choose us  */}
<div
className='faq-area faq-area-margin-top bg-cover pd-top-90 pd-bottom-90'
style={{ backgroundImage: 'url("./assets/img/bg/3.png")' }}
>
<div className='container'>
  <div className='row pd-top-60 align-items-center'>
    <div
      className='col-xl-5 col-lg-6 col-md-8 order-lg-last'
      data-aos='fade-left'
      data-aos-delay='100'
      data-aos-duration='1500'
    >
    <div className='about-thumb-inner pt-lg-3 text-center'>
    <img
      className='main-img'
      src='assets/img/about/Why-Choose-Only.png'
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
        We connect tech talent with top companies through curated job listings and recruitment support.
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
           What is AI-powered screening?
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse show'
            aria-labelledby='headingOne'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            AI-powered screening uses artificial intelligence and ATS (Applicant Tracking Systems) to quickly evaluate technical candidates by analyzing resumes, coding tests, and key qualifications. It helps identify top talent efficiently, reduces bias, and streamlines the hiring process by focusing on skills that match the role requirements.
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
           Why is AI-powered screening better than traditional ATS or manual screening?
            </button>
          </h2>
          <div
            id='collapseTwo'
            className='accordion-collapse collapse'
            aria-labelledby='headingTwo'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            AI-powered screening goes beyond traditional ATS or manual methods by analyzing not just keywords but also context, skills, and patterns in a candidate’s profile. It can assess coding tests, rank candidates by fit, and learn from hiring outcomes to improve over time. This leads to faster, more accurate shortlisting, reduced bias, and a better match between candidates and technical roles. 
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
            How does Recruitway Qualify help in the hiring process?
            </button>
          </h2>
          <div
            id='collapseThree'
            className='accordion-collapse collapse'
            aria-labelledby='headingThree'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Recruitway Qualify uses AI-powered screening to quickly filter high volumes of technical applications, going beyond keyword matching to assess skills, experience, and coding ability. This ensures a fair, consistent, and efficient way to identify top candidates and speed up your hiring process.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
{/* counter request demo  */}
 <Requestdemo/>
 
{/* Blog Area Two */}
{/* Footer Two */}
<FooterTwo />
    
    </>
  )
}
