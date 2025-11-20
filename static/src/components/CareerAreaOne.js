import React from "react";
import { FaCheckCircle } from "react-icons/fa";
const CareerAreaOne = () => {
  return (
    <>
      {/*career area start*/}
  <div className='career-section pd-top-60 pd-bottom-60 '>
  <div className='container'>
    <div className='row justify-content-center'>
      <div className='col-lg-6'>
        <div className='section-title text-center'>
          <h3 className='title'>How to kick-off your interview prep</h3>
        </div>
      </div>
    </div>
    <div className='career-wrap-area'>
      <nav>
  <div className="nav nav-tabs career-nav-tab" id="nav-tab" role="tablist">
    <button
      className="nav-link active"
      id="nav-mission-tab"
      data-bs-toggle="tab"
      data-bs-target="#nav-mission"
      type="button"
      role="tab"
      aria-controls="nav-mission"
      aria-selected="true"
    >
      Schedule a personalized mock interview with industry professionals.
    </button>

    <button
      className="nav-link"
      id="nav-vision-tab"
      data-bs-toggle="tab"
      data-bs-target="#nav-vision"
      type="button"
      role="tab"
      aria-controls="nav-vision"
      aria-selected="false"
    >
      Experience a structured, step-by-step interview simulation, just like the real thing.
    </button>

    <button
      className="nav-link"
      id="nav-career-tab"
      data-bs-toggle="tab"
      data-bs-target="#nav-career"
      type="button"
      role="tab"
      aria-controls="nav-career"
      aria-selected="false"
    >
      Receive a detailed feedback report and boost your chances of success by up to 80%.
    </button>
  </div>
</nav>
      <div className='tab-content' id='nav-tabContent'>
        <div
          className='tab-pane fade show active'
          id='nav-mission'
          role='tabpanel'
          aria-labelledby='nav-mission-tab'
        >
          <div className='career-wrap'>
            <div className='row'>
              <div className='col-lg-5'>
                <img src='assets/img/about/img103.png' alt='img' />
              </div>
              <div className='col-lg-7'>
                <p className='mb-3'>
                  Prepare for your next big opportunity with confidence. Our mock interviews are conducted by experienced industry experts who provide real-time feedback, actionable insights, and guidance tailored to your career goals. Whether you're aiming for a role in tech, product, data, or management, these sessions help you refine your responses and boost your interview readiness. Book your session today and take a step closer to landing your dream job.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className='tab-pane fade'
          id='nav-vision'
          role='tabpanel'
          aria-labelledby='nav-vision-tab'
        >
          <div className='career-wrap'>
            <div className='row'>
              <div className='col-lg-5'>
                <img src='assets/img/about/img-102.png' alt='img' />
              </div>
              <div className='col-lg-7'>
                <p className='mb-3'>
                  Each mock interview mirrors the format of actual industry interviews—from introductions and technical rounds to behavioural questions and closing feedback. This realistic approach helps you build confidence and improve your performance under real interview conditions.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className='tab-pane fade'
          id='nav-career'
          role='tabpanel'
          aria-labelledby='nav-career-tab'
        >
          <div className='career-wrap'>
            <div className='row'>
              <div className='col-lg-5'>
                <img src='assets/img/about/img-103.png' alt='img' />
              </div>
              <div className='col-lg-7'>
                <p className='mb-3'>
                  After your mock interview, you'll get a comprehensive feedback report highlighting your strengths and areas for improvement. With actionable tips and personalized guidance, you’ll be better equipped to crack real interviews and significantly improve your placement odds.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
      </div>

      {/* career area start */}
    </>
  );
};

export default CareerAreaOne;
