import React from "react";
import Navbar from "../common/Navbar";

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
