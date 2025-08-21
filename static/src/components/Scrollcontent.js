
import React, { useEffect, useRef } from "react";

export default function Scrollcontent() {
  const timelineRef = useRef(null);
  const drawLineRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !drawLineRef.current) return;

      const timeline = timelineRef.current;
      const drawLine = drawLineRef.current;
      const items = itemsRef.current;

      const windowScroll = window.scrollY;
      const windowHeight = window.innerHeight;
      const timelineOffset = timeline.offsetTop;
      const timelineHeight = timeline.scrollHeight;

      // Set the default line height
      drawLine.style.height = `${Math.min(
        windowScroll + windowHeight - timelineOffset,
        timelineHeight
      )}px`;

      // Check for in-view circles
      const drawLineBottom = drawLine.getBoundingClientRect().bottom;
      items.forEach((item) => {
        if (item) {
          const itemTop = item.getBoundingClientRect().top + window.scrollY;
          if (drawLineBottom >= itemTop) {
            item.classList.add("in-view");
          } else {
            item.classList.remove("in-view");
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run on mount in case items are already in view

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className='about-area pd-top-60 pd-bottom-30'>
        <div className='container'>
          <div className="row">
            <div className="col-lg-12">
              <div className='section-title mb-0' data-aos='fade-up' data-aos-delay='100' data-aos-duration='1500'>
                <h6>Getting started</h6>
                <h2 className='title pd-bottom-30'>
                  Effortlessly evaluate your entire applicant pool
                </h2>
              </div>
            </div>
          </div>
          <div className='row align-items-center'>
            <div className='col-lg-12 d-flex'>
              <div className="timeliney margin-top-box" ref={timelineRef}>
                <ul>
                  <span className="default-line"></span>
                  {[...Array(2)].map((_, index) => (
                    <li key={index} ref={(el) => (itemsRef.current[index] = el)}></li>
                  ))}
                </ul>
              </div>
              <div className='section-title recuitway-left'>
                <div className="single-service-inner-3 single-service-inner-3-right">
                  <div className="thumb">
                    <div className="thumb-inner">
                      <img src="assets/img/icons/upload.png" alt="Supercharge Hiring with AI" />
                    </div>
                  </div>
                  <div className="details ml-15">
                    <h5 className="mb-3">Upload Your Job Description</h5>
                    <p className="mb-0">
                      Simply paste or upload your job description, and RecruitWay AI will generate a structured, role-specific interview flow tailored to your needs.
                    </p>
                  </div>
                </div>
                <div className="single-service-inner-3 single-service-inner-3-right">
                  <div className="thumb">
                    <div className="thumb-inner">
                      <img src="assets/img/icons/skill-development.png" alt="Supercharge Hiring with AI" />
                    </div>
                  </div>
                  <div className="details ml-15">
                    <h5 className="mb-3">Define Skills & Requirements</h5>
                    <p className="mb-0">
                      Select key skills, set experience levels, choose designations, and customize evaluation criteria to ensure precise candidate assessment.
                    </p>
                  </div>
                </div>
                <div className="single-service-inner-3 single-service-inner-3-right">
                  <div className="thumb">
                    <div className="thumb-inner">
                      <img src="assets/img/icons/candidate.png" alt="Supercharge Hiring with AI" />
                    </div>
                  </div>
                  <div className="details ml-15">
                    <h5 className="mb-3">Invite Candidates & Gain Actionable Insights</h5>
                    <p className="mb-0">
                      Effortlessly send interview invites, let AI conduct intelligent screenings, and receive in-depth reports with data-driven recommendations to make the best hiring decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
