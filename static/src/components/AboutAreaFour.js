import React from "react";

const AboutAreaFour = () => {
  return (
    <>
      {/* =============== About Area Three End ===============*/}
      <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-6'>
              <div
                className='about-thumb-inner p-xl-5 pt-4 ' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
              >
                <img
                  className='animate-main-img' style={{borderRadius: "15px", width:""}}
                  src='assets/img/about/img-20.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6 align-self-center ' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'
            >
              <div className='section-title mt-5 mt-lg-0'>
                <h6 className='sub-title'>Commitment</h6>
                <h2 className='title'>
                Our Commitment
                </h2>
                <p className='content mb-4 mb-xl-5'>
                At RecruitWay, we are committed to transforming technical recruitment by providing specialized interview protocols focused on evaluating candidates' technical skills. Our platform, operated by expert interviewers from top tech companies like FAANG, integrates advanced coding and evaluation tools to ensure precise assessments.<br/>We prioritize fairness and reliability in our processes, using structured formats and scoring systems to reduce bias, while advanced monitoring checks for authenticity during interviews. Our detailed records of each session support informed decision-making, setting new standards in tech hiring for efficiency and integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============== About Area Three End ===============*/}
    </>
  );
};

export default AboutAreaFour;
