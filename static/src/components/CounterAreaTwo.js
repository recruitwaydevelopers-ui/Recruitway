import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
const CounterAreaTwo = () => {
  return (
    <>
      {/*================= counter area start {/*=================*/}
      <div
        className='counter-area bg-relative bg-cover pd-top-60'
        style={{ backgroundImage: 'url("./assets/img/bg/10.png")' }}
      >
        <div className='container pd-bottom-60'>
          <div className="row">
          <h2 className="text-center">Ready to streamline your interview process?</h2>
          <p className="text-center mb-40">Discover how our interview-as-a-service can transform your recruitment strategy</p>
          </div>
          <div className="row justify-content-center">
          < div className="col-md-3">
          <Link className='btn btn-border-base' to='/#'>Request Demo<FaPlus/></Link>
          </div>
          </div>
        </div>
      </div>

      {/*{/*================= counter area end {/*=================*/}
    </>
  );
};

export default CounterAreaTwo;
