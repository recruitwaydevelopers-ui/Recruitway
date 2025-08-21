import React from "react";
import BlogDetailsArea from "../components/BlogDetailsArea";
import Breadcrumb from "../components/Breadcrumb";
import FooterTwo from "../components/FooterTwo";
import NavbarTwo from "../components/NavbarTwo";

const BlogDetails = () => {
  return (
    <>
      {/* Navigation Bar */}
      <NavbarTwo/>

      {/* Navigation Bar */}
      <Breadcrumb title={"Blog Details"} />

      {/* Blog Details Area */}
      <BlogDetailsArea />

      {/* Footer One */}
      <FooterTwo/>
    </>
  );
};

export default BlogDetails;
