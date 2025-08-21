import React from 'react'
import { Link } from "react-router-dom";


export default function Requestdemo() {
  return (
    <>
      <div
              className='counter-area bg-relative bg-cover pd-top-60'
              style={{ backgroundImage: 'url("./assets/img/bg/10.png")' }}
            >
              <div className='container pd-bottom-60'>
                <div className="row ">
                <h2 className="text-center">Ready to streamline your interview process?</h2>
                <p className="text-center mb-40">Discover how our interview-as-a-service can transform your recruitment strategy</p>
                </div>
                <div className="row reques-demo-main">
                < div className="col-lg-3 text-center">
                <Link className='btn btn-border-base' to='/Request'>Request Demo</Link>
                </div>
                </div>
              </div>
            </div>   
    </>
  )
}
