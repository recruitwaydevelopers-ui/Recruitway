import React from "react";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";
import CareerAreaOne from "../components/CareerAreaOne";
import AboutAreaThree from "../components/AboutAreaThree";
import ContactMain from "../components/ContactMain";
import { Link } from "react-router-dom";


export const Candidate = () => {
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
                 Book Your Mock Interview with Top Industry Professionals
                </h2>
                <p className='content mb-4'>
                 Practice with experienced experts and gain valuable insights to sharpen your interview skills and boost your confidence.
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
              <div className='about-thumb-inner mb-4 mb-lg-0 text-center'>
                <img
                  className='main-img'
                  src='assets/img/about/img-bn.png'
                  alt='img'
                />
              </div>
            </div>
          </div>
        </div>
  </div>
    
{/* canditae form satrt */}
<ContactMain/>
      {/* How to become an interview engineer? */}
      <CareerAreaOne/>
      
 {/* why choose us  */}
 <div className='about-area pd-top-60  bg-gradient-gray pd-bottom-60'>
        <div className='container'>
          <div className='row align-items-center wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
            <div className='col-lg-6 d-flex'>
            <div className='section-title mb-0'>
            <h2>Boost Your Placement Success Rate by Up to 80%</h2>
             <p className="text-align-justify">Stand out from the competition with expert-led mock interviews and personalized feedback. Our structured approach helps you identify gaps, refine your responses, and improve both technical and soft skills. With actionable insights tailored to your target roles, you will walk into real interviews feeling confident and well-prepared. Maximize your potential and take a big step toward landing your dream job.</p> 
              <Link className='btn btn-border-base' to='/Request'>Book your interview</Link>
            </div>
            </div>
            <div className='col-lg-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
              >
                <img className='radius-img' src='assets/img/about/405x416_02.png' alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AboutAreaThree/>
      {/* section mock interview section  */}
        <div className='counter-area bg-relative bg-cover pd-top-60' style={{ backgroundImage: 'url("./assets/img/bg/10.png")' }}>
        <div className='container pd-bottom-60'>
          <div className="row">
          <h2 className="text-center">Take the guesswork out of prepping for technical interviews</h2>
          <h4 className="text-center">Start practicing with experts today</h4>
          <p className="text-center mb-40">Discover how our interview-as-a-service can transform your recruitment strategy</p>
          </div>
          <div className="row reques-demo-main">
          < div className="col-lg-3 text-center">
          <Link className='btn btn-border-base' to='/Request'>Take mock interview</Link>
          </div>
          </div>
        </div>
      </div> 
      {/* end section mock interview */}
      <div className='about-area pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className='row align-items-center wow animated 'data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
            <div className='col-lg-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
              >
                <img className='radius-img' src='assets/img/about/530x380.png' alt='img'
                />
              </div>
            </div>
            <div className='col-lg-6 d-flex'>
            <div className='section-title mb-0'>
              <h2>Receive Actionable Feedback and In-Depth Performance Reports</h2>
             <p className="text-align-justify">After each mock interview, you’ll receive a comprehensive report highlighting your strengths and pinpointing areas for improvement. Our expert reviewers provide clear, actionable suggestions to help you refine your skills and avoid common pitfalls. From technical accuracy to communication style, every detail is covered to prepare you for real-world interviews. Use these insights to track progress and build a stronger, more confident interview presence.</p> 
                             <Link className='btn btn-border-base' to='/Request'>
                             Book your interview
                             </Link>
            </div>
            </div>
          </div>
        </div>
      </div>
      <div
className='faq-area  bg-cover pd-top-30 pd-bottom-30'
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
      src='assets/img/about/FAQ-main.png'
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
           What is a mock interview and how does it help?
            </button>
          </h2>
          <div
            id='collapseOne'
            className='accordion-collapse collapse show'
            aria-labelledby='headingOne'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            A mock interview is a simulated interview experience designed to mirror real-world scenarios. It helps you practice responses, receive expert feedback, and build confidence so you're well-prepared for actual job interviews.
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
            Who conducts the mock interviews?
            </button>
          </h2>
          <div
            id='collapseTwo'
            className='accordion-collapse collapse'
            aria-labelledby='headingTwo'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            Our mock interviews are conducted by experienced industry professionals with deep knowledge in hiring practices, technical assessments, and behavioral evaluations. They provide personalized guidance to help you improve.
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
           Will I receive feedback after the interview?
            </button>
          </h2>
          <div
            id='collapseThree'
            className='accordion-collapse collapse'
            aria-labelledby='headingThree'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
             Yes! After your session, you’ll receive a detailed performance report outlining your strengths and areas for improvement, along with actionable tips to help you enhance your interview skills.
            </div>
          </div>
        </div>
        {/* faq 4 start  */}
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingFour'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseFour'
              aria-expanded='false'
              aria-controls='collapseFour'
            >
          What does it mean to be part of the pre-vetted talent pool?
            </button>
          </h2>
          <div
            id='collapseFour'
            className='accordion-collapse collapse'
            aria-labelledby='headingFour'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
             Candidates who successfully complete our mock interviews and evaluations are added to our exclusive, pre-vetted talent network. This means you’ll be showcased to hiring partners as a job-ready professional.
            </div>
          </div>
        </div>
        <div className='accordion-item'>
          <h2 className='accordion-header' id='headingFive'>
            <button
              className='accordion-button collapsed'
              type='button'
              data-bs-toggle='collapse'
              data-bs-target='#collapseFive'
              aria-expanded='false'
              aria-controls='collapseFive'
            >
            What roles or industries do you support?
            </button>
          </h2>
          <div
            id='collapseFive'
            className='accordion-collapse collapse'
            aria-labelledby='headingFive'
            data-bs-parent='#accordionExample'
          >
            <div className='accordion-body'>
            We offer mock interviews across a variety of domains including software engineering, product management, data science, quality assurance, business analysis, and more.
            </div>
          </div>
        </div>
        {/* faq 4 end  */}
      </div>
    </div>
  </div>
</div>
</div>
    {/* Footer Two */}
    <FooterTwo />
    </>
  )
}
export default Candidate;
