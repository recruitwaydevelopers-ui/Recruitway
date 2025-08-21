import React from "react";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutAreaFive = () => {
  return (
    <>
      {/* =============== About Area Five End ===============*/}
      <div className='about-area pd-top-120 pd-bottom-120'>
        <div className='container'>
          <div className='row'>
          <div
              className='col-lg-6 mb-4 mb-lg-0 '
              data-aos='fade-right'
              data-aos-delay='100'
              data-aos-duration='1500'
            >
              <div className='about-thumb-inner'>
                <img
                  className='main-img'
                  src='assets/img/about/10.png'
                  alt='img'
                />
              </div>
            </div>
            <div
              className='col-lg-6'
              data-aos='fade-left'
              data-aos-delay='200'
              data-aos-duration='1500'
            >
              <div className='section-title mb-0 ps-xl-5'>
                <h6 className='sub-title-sky-blue'>Why Choose Us</h6>
                <h2 className='title'>
                Why choose us for your Technical Interview needs
                </h2>
                <div className='row'>
                  <div className='col-md-12'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle className='sky' /> Unparalleled expertise
                      </li>
                      <p>Our interviewers are not just experts; they are leading professionals from top tech companies with years of practical experience. They bring invaluable insights and deep technical understanding to ensure that the evaluation process is nothing short of expert-level.</p>
                    </ul>
                  </div>
                  <div className='col-md-12'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle className='sky' /> Rigorous fairness protocols
                      </li>
                      <p>We are committed to fairness and transparency in every interview. Our standardized interviewing frameworks and scoring systems are designed to minimize bias, ensuring that every candidate is assessed based on their true abilities, promoting diversity and equality in your hiring process.</p>
                    </ul>
                  </div>
                  <div className='col-md-12'>
                    <ul className='single-list-inner style-check style-heading style-check mb-3'>
                      <li>
                        <FaCheckCircle className='sky' /> Cutting-edge monitoring technologies
                      </li>
                      <p>We employ advanced monitoring technologies to maintain the integrity of the interview process. From detecting screen changes to analyzing speech patterns, our tools are designed to identify any fraudulent activities, ensuring a genuine assessment of each candidate's skills.</p>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =============== About Area Five End ===============*/}
    </>
  );
};

export default AboutAreaFive;
