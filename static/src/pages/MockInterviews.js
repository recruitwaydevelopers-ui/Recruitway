import React from 'react'
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import { Link } from "react-router-dom";

export default function MockInterviews() {
  return (
    <>
     {/* Navigation Bar Two*/}
     <NavbarTwo />

{/* Banner  */}
 <div className='about-area bg-gradient-gray pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row align-items-center'>
            <div
              className='col-lg-6 wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mb-0'>
                <h2 className='title'>
                Prepare for success with mock interviews
                </h2>
                <p className='content mb-4'>
                Get ready for your next interview with our mock interview service. Practice with industry experts and receive valuable feedback.
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
              <div className='about-thumb-inner mb-4 mb-lg-0'>
                <img
                  className='main-img'
                  src='assets/img/about/mock-img.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Outsourcing Technical Interviews*/}
<div className='about-area pd-top-60 pd-bottom-60'>
  <div className='container'>
    <div className='row'>
    <div className='col-lg-12'>
    <div className='section-title mt-5 mt-lg-0 text-center'>
          <h2 className='title'>Mock Interview Preparation</h2>
          <p className='content mb-4 mb-xl-5'>
          Enhance your interview readiness with realistic practice sessions conducted by industry professionals. This approach offers a comprehensive feedback mechanism and tailored strategies to improve performance in actual tech interviews.
          </p>
        </div>
    </div>
    </div>
    <div className='row align-items-center'>
      <div
        className='col-lg-6 mb-4 mb-lg-0 '
        data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
      >
        <div className='about-thumb-inner'>
          <img
            className='main-img'
            src='assets/img/about/Mock-Interviews-1.png'
            alt='img'
          />
        </div>
      </div>
      <div
        className='col-lg-6 '
       data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
      >
        <div className='section-title mb-0'>
          <h2 className='title'>Who it's for </h2>
          <p className='content mb-4'>
          Geared towards candidates preparing for technical interviews, especially those aiming for positions within high-tech and top-tier tech companies.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
{/* About Area Two */}
<div className='work-process-area pd-top-20 pd-bottom-60'>
  <div className='container'>
    <div className='section-title text-center'>
      <h2 className='title'>
      Key Benefits
      </h2>
      <p>Prepare for Success with Mock Interviews</p>
    </div>
    <div className='row'>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/interview-2.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Realistic Interview Scenarios</h5>
            <p className='content'>
            Engage in mock sessions that replicate FAANG interview conditions, enhancing your preparedness and boosting your confidence for the real scenarios.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/feedback.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Feedback from Industry Insiders</h5>
            <p className='content'>
            Get detailed, actionable feedback from professionals at leading tech companies, offering insights on what is valued and how to stand out.
            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/confidence.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Confidence Building</h5>
            <p className='content'>
            Boost your confidence through realistic practice sessions that reduce anxiety and ensure you are calm, relaxed, focused, and well-prepared during your interviews.            </p>
          </div>
        </div>
      </div>
      <div className='col-xl-3 col-md-6'>
        <div className='single-work-process-inner'>
          <div className='thumb mb-3'>
            <img src='assets/img/icons/performance.png' alt='img' />
          </div>
          <div className='details'>
            <h5 className='mb-3'>Performance Optimization</h5>
            <p className='content'>Sharpen your interviewing skills with continuous practice, improving your responses and enhancing your chances of acing the interview.
              </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/* why choose us  */}
{/* counter request demo  */}
 <div className='about-area  pd-bottom-60'>
          <div className='container '>
            <div className='row align-items-center Ready-to-Transform-one img-radius'>
              <div
                className='col-lg-8 Ready-to-Transform'
                data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
              >
                <div className='section-title mb-0'>
                  <h2 className='title mb-40'>
                  Ready to Transform your Hiring Process?
                  </h2>
                      <p className='mt-10 content-mt-20'>Partner with us to ensure your team grows with only the best tech talent. Get started today and experience the efficiency and precision of expert-driven technical interviews.</p>
                  <div className='text-right'>
                   <Link className='btn btn-border-base' to='/Request'>Request Demo</Link>
                   </div>
                </div>
              </div>
              <div className='col-lg-4'>
                <div
                  className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
                 data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
                >
                  <img className='img-margin img-radius' src='assets/img/about/img101.jpg' alt='img'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
{/* Blog Area Two */}
{/* Footer Two */}
<FooterTwo />
    
    </>
  )
}
