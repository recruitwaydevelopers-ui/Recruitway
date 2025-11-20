import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ServiceAreaFour = () => {
  return (
    <>
      {/*=================== service area start ===================*/}
      <div
        className='service-area bg-cover pd-top-60  pd-bottom-60 pd-top-60  pd-bottom-60'
        style={{ backgroundImage: 'url("./assets/img/bg/3.png")',borderRadius:'50px' }}
      >
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-xl-6 col-lg-8' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div className='section-title text-center'>
                <h6 className='sub-title'>Why RecruitWay</h6>
                <h2 className='title'>
                Precision-Driven <span>Solutions</span> for Tech Hiring
                </h2>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
              <div className='single-work-process-inner thumb'>
                <Link className='full-card-link' to='/InterviewOutsourcing'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icon/internet.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Interview Outsourcing</h5>
                  <p className='content mb-3'>
                    Delegate the task of conducting technical interviews to our team of seasoned experts. 
                    We handle everything from scheduling, coordination, assessment, to evaluation and feedback.
                  </p>
                  <span className='read-more-text'>
                    Read More <FaArrowRight />
                  </span>
                </div>
              </Link>
              </div>
            </div>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/RoleFit'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icon/role.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Role Fit</h5>
                  <p className='content mb-3'>
                    We offer specialized assessments to determine a candidate’s suitability for specific roles within your organization. 
                    Our tailored approach ensures the best fit for each position.
                  </p>
                  <span className='read-more-text'>
                    Read More <FaArrowRight />
                  </span>
                </div>
              </Link>
              </div>
            </div>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/RecordedInterviews'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icon/voice-recording.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Recorded Interviews</h5>
                  <p className='content mb-3'>
                    Every interview is recorded and securely stored, enabling you to review the sessions at your convenience. 
                    This feature supports transparent and thorough evaluations.
                  </p>
                  <span className='read-more-text'>
                    Read More <FaArrowRight />
                  </span>
                </div>
              </Link>
              </div>
            </div>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='2000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/RoIanalysis'>
                  <div className='thumb mb-3'>
                    <img src='assets/img/icon/roi.png' alt='img' />
                  </div>
                  <div className='details'>
                    <h5 className='mb-3'>ROI Analysis</h5>
                    <p className='content mb-3'>
                      Receive detailed reports and analytics on the return on investment of your hiring processes. 
                      Our analysis helps you make data-driven decisions to improve hiring efficiency.
                    </p>
                    <span className='read-more-text'>
                      Read More <FaArrowRight />
                    </span>
                  </div>
                </Link>

              </div>
            </div>
          </div>
          <div className='row justify-content-center'>
          <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='3000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/Assessments'>
                <div className='thumb mb-3'>
                  <img src='assets/img/icon/assessment.png' alt='img' />
                </div>
                <div className='details'>
                  <h5 className='mb-3'>Assessments</h5>
                  <p className='content mb-3'>
                    Utilize our comprehensive suite of technical assessments designed to evaluate a candidate's skills, proficiency, 
                    problem-solving, technical knowledge, and experience.
                  </p>
                  <span className='read-more-text'>
                    Read More <FaArrowRight />
                  </span>
                </div>
              </Link>

              </div>
            </div>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='3000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/MockInterviews'>
                  <div className='thumb mb-3'>
                    <img src='assets/img/icon/mocking.png' alt='img' />
                  </div>
                  <div className='details'>
                    <h5 className='mb-3'>Mock Interviews</h5>
                    <p className='content mb-3'>
                      Prepare candidates for the real interview process with our mock interview service. 
                      These practice sessions are conducted by experienced interviewers to simulate the actual interview environment.
                    </p>
                    <span className='read-more-text'>
                      Read More <FaArrowRight />
                    </span>
                  </div>
                </Link>
              </div>
            </div>
            <div className='col-xl-3 col-md-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='3000'>
              <div className='single-work-process-inner'>
                <Link className='full-card-link' to='/SeamlesScheduling'>
              <div className='thumb mb-3'>
                <img src='assets/img/icon/calendar.png' alt='img' />
              </div>
              <div className='details'>
                <h5 className='mb-3'>Seamless Scheduling</h5>
                <p className='content mb-3'>
                  Our platform offers an automated scheduling system that easily integrates with your existing calendar tools, 
                  ensuring a smooth and efficient interview process.
                </p>
                <span className='read-more-text'>
                  Read More <FaArrowRight />
                </span>
              </div>
              </Link>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* =================== service area end ===================*/}
    </>
  );
};

export default ServiceAreaFour;
