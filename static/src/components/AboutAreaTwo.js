import React from "react";

const AboutAreaTwo = () => {
  return (
    <>
      {/* =============== About Area Two End ===============*/}
      <div className='about-area pd-top-60 pd-bottom-60'>
        <div className='container'>
          <div className="row">
            <div className="col-lg-12">
            <div className='section-title mb-0' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
                <h2 className='title pd-bottom-30'>
                Why choose us for your Technical Interview needs
                </h2>
                </div>
            </div>
          </div>
          <div className='row align-items-center'>
            <div className='col-lg-6 d-flex' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
            <div class="timeline">
           <ul>
            <span class="default-line"></span>
            <span class="draw-line"></span>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            </ul>
           </div>
            <div className='section-title mb-0'>
              <h4 className='title mb-40'>
              Unparalleled expertise
             </h4>
             <p className="text-align-justify">Our interviewers are not just experts; they are leading professionals from top tech companies with years of practical experience. They bring invaluable insights and deep technical understanding to ensure that the evaluation process is nothing short of expert-level.</p> 
              <h4>Rigorous fairness protocols</h4>
              <p className="text-align-justify">We are committed to fairness and transparency in every interview. Our standardized interviewing frameworks and scoring systems are designed to minimize bias, ensuring that every candidate is assessed based on their true abilities, promoting diversity and equality in your hiring process.</p>
              <h4>Cutting-edge monitoring technologies</h4>
              <p className="text-align-justify">We employ advanced monitoring technologies to maintain the integrity of the interview process. From detecting screen changes to analyzing speech patterns, our tools are designed to identify any fraudulent activities, ensuring a genuine assessment of each candidate's skills.</p>
            </div>
            </div>
            <div className='col-lg-6' data-aos='fade-up'data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
              >
                <img className='radius-img' src='assets/img/about/1373.jpg' alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* =============== About Area Two End ===============*/}
    </>
  );
};

export default AboutAreaTwo;
