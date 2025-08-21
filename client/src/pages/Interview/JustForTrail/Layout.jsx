import React from "react";
import InterviewHeader from "./InterviewHeader";
import InterviewSidebar from "./InterviewSidebar";

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <InterviewHeader />
            <div className="d-flex flex-grow-1">
                <InterviewSidebar />
                <main className="flex-grow-1 overflow-auto bg-light p-4">
                    {children}
                </main>
            </div>
        </div>
        // <>
        // </>

    );
};

export default Layout;
