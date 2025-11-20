import React, { useEffect, useRef } from "react";

export default function ScrollPage() {
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
                <h2 className='title pd-bottom-30'>
                  Why choose us for your Technical Interview needs
                </h2>
              </div>
            </div>
          </div>
          <div className='row align-items-center'>
            <div className='col-lg-6 d-flex'>
              <div className="timeline" ref={timelineRef}>
                {console.log(timelineRef)
                }
                <ul>
                  <span className="default-line"></span>
                  {console.log(drawLineRef)}
                  
                  {[...Array(3)].map((_, index) => (
                    <li key={index} ref={(el) => (itemsRef.current[index] = el)}></li>
                  ))}
                </ul>
              </div>
              <div className='section-title mb-0'>
                <h4 className='title mb-40'>
                  Unparalleled expertise
                </h4>
                <p className="text-align-justify">Our interviewers are not just experts; they are leading professionals from top tech companies with years of practical experience. They bring invaluable insights and deep technical understanding to ensure that the evaluation process is nothing short of expert-level.</p>
                <h4 >Rigorous fairness protocols</h4>
                <p className="text-align-justify" >We are committed to fairness and transparency in every interview.Our standardized interviewing frameworks and scoring systems are designed to minimize bias, ensuring that every candidate is assessed based on their true abilities, promoting diversity and equality in your hiring process.</p>
                <h4>Cutting-edge monitoring technologies</h4>
                <p className="text-align-justify">We employ advanced monitoring technologies to maintain the integrity of the interview process. From detecting screen changes to analyzing speech patterns, our tools are designed to identify any fraudulent activities, ensuring a genuine assessment of each candidate's skills.</p>
              </div>
            </div>
            <div className='col-lg-6' data-aos='fade-up' data-aos-delay='100' data-aos-duration='1500'>
              <div
                className='mt-5 mt-lg-0 ms-4 ms-lg-0 text-center'
              >
                <img className='radius-img' src='assets/img/about/Why-choose-us-2.png' alt='img'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





