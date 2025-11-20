import React, { useState, useEffect, useRef } from "react";
import '../Annimationmain.scss'

function Timelinescroll() {
    const [sections, setSections] = useState([]);
    const [barHeight, setBarHeight] = useState(0);
    const timelineRef = useRef(null);
    const containerRef = useRef(null);
  
    useEffect(() => {
      const handleResize = () => {
        setSections(document.querySelectorAll(".ankit"));
        arrangeNodes();
        setBarHeight((window.scrollY / containerRef.current.scrollHeight) * 100);
      };
  
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const sectionHeight = containerRef.current.scrollHeight;
        setBarHeight((scrollTop / sectionHeight) * 100);
      };
  
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll);
  
      handleResize();
  
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
  
    const arrangeNodes = () => {
      const nodes = Array.from(document.querySelectorAll(".node"));
      nodes.forEach((node, i) => {
        const section = sections[i];
        const sectionTop = section.offsetTop;
        const timelineHeight = timelineRef.current.offsetHeight;
        const documentHeight = document.documentElement.scrollHeight;
  
        node.style.top = `${(timelineHeight / documentHeight) * sectionTop}px`;
      });
    };
  
    const handleNodeClick = (i) => {
      const scroll = sections[i].offsetTop;
      window.scrollTo({ top: scroll, behavior: "smooth" });
    };

  return (
    <>
    
    
    <div className="App" ref={containerRef}>
      <ul className="timeline" ref={timelineRef}>
        <li className="bar" style={{ height: `${barHeight}%` }}></li>
        {Array.from(sections).map((section, i) => (
          <li
            key={i}
            className="node"
            onClick={() => handleNodeClick(i)}
            style={{ top: `${(barHeight / 100) * section.offsetTop}px` }}
          >
            <span>{section.getAttribute("data-name")}</span>
          </li>
        ))}
      </ul>
      <div className="containere">
        <div className="ankit" data-name="Home">
          <h1>Home</h1>
          <h2>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate
            porro odit esse ut quidem deleniti dolore doloremque aliquam neque
            ad at optio odio quasi aperiam necessitatibus reiciendis, quaerat
            quod autem.
          </h2>
        </div>
        <div className="ankit" data-name="Profile">
          <h1>Profile</h1>
          <h2>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate
            porro odit esse ut quidem deleniti dolore doloremque aliquam neque
            ad at optio odio quasi aperiam necessitatibus reiciendis, quaerat
            quod autem.
          </h2>
          <img
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=1800&h=600"
            alt=""
          />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
            exercitationem earum beatae assumenda debitis quibusdam
          </p>
          <img
            src="https://placeholdit.imgix.net/~text?txtsize=33&txt=Placeholder&w=1800&h=600"
            alt=""
          />
        </div>
        <div className="ankit" data-name="Works">
          <h1>Works</h1>
          <h2>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate
            porro odit esse ut quidem deleniti dolore doloremque aliquam neque
            ad at optio odio quasi aperiam necessitatibus reiciendis, quaerat
            quod autem.
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima
            exercitationem earum beatae assumenda debitis quibusdam, ducimus
            autem a ab nisi, praesentium et enim numquam consequatur similique
            quis consectetur consequuntur iure!
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
export default Timelinescroll;
