import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import HomePage from "./pages/landingPage/HomePage";
import JobListings from "./pages/joblisting/JobListing";
import JobDescription from "./pages/jobDescription/Description";
import HRDashboard from "./pages/hr/HRDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import ProfilePage from "./pages/profile/ProfilePage";
import AuthPage from "./pages/auth/AuthPage";

import InterviewPage from "./pages/interview/InterviewPage";

import ApplicationForm from "./pages/jobDescription/ApplicationForm";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  const userRole = "candidate"; // Replace with actual role logic
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userData, setUserData] = useState(null);
  // useEffect(() => {
  //   // Fetch user data if authenticated
  //   if (isAuthenticated) {
  //     fetchUserData();
  //   }
  // }, [isAuthenticated]);

  // const fetchUserData = async () => {
  //   // Fetch user data from API
  //   const response = await fetch("/api/user");
  //   const data = await response.json();
  //   setUserData(data);
  // };

  return (
    <div className='bg-gray-900'>
      <AuthProvider>
        {" "}
        <Navbar isAuthenticated={isAuthenticated} />
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/jobs' element={<JobListings />} />
          <Route path='/job/:id' element={<JobDescription />} />
          <Route path='/hr/dashboard' element={<HRDashboard />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/candidate/interview' element={<InterviewPage />} />
          <Route path='/apply' element={<ApplicationForm />} />
          <Route path='/candidate/dashboard' element={<CandidateDashboard />} />
          <Route path='*' element={<div>404 - Page Not Found</div>} />
        </Routes>
      </AuthProvider>

      <Routes></Routes>
    </div>
  );
};

export default App;
