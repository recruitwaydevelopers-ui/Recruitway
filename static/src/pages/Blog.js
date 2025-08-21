import React from "react";
import BlogAreaThree from "../components/BlogAreaThree";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";

const Blog = () => {
  return (
    <>
      {/* Navigation Bar */}
      <NavbarTwo/>

      {/* Navigation Bar */}
      <Breadcrumb title={"Blog"} />

      {/* Blog Group */}
      <BlogAreaThree/>
      
      {/* Footer One */}
      <FooterTwo/>
    </>
  );
};

export default Blog;
