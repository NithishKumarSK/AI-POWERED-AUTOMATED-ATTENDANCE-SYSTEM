import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Details from './pages/Details';
import TimeTable from './pages/TimeTable';
import Attendance from './pages/Attendance';
import FaceSetup from './pages/FaceSetup';
import SMS from './pages/SMS';

// Advanced ERP View Modules
import NominalRolls from './pages/NominalRolls';
import LecturePlanning from './pages/LecturePlanning';
import MidMarks from './pages/MidMarks';
import Marks from './pages/Marks'; // Student Mid Marks Array

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/details" element={<Details />} />
        <Route path="/timetable" element={<TimeTable />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/face-setup" element={<FaceSetup />} />
        <Route path="/sms" element={<SMS />} />
        <Route path="/marks" element={<Marks />} />
        
        {/* Active ERP Modules */}
        <Route path="/nominal-rolls" element={<NominalRolls />} />
        <Route path="/lecture-planning" element={<LecturePlanning />} />
        <Route path="/mid-marks" element={<MidMarks />} />
        <Route path="/e-mid-marks" element={<MidMarks />} />
        
        {/* Placeholder Stubs */}
        <Route path="/register-academic" element={<Navigate to="/home" />} />
        <Route path="/activity-diary" element={<Navigate to="/home" />} />
        <Route path="/taken-classes" element={<Navigate to="/home" />} />
        <Route path="/class-adjustment" element={<Navigate to="/home" />} />
        <Route path="/mentoring" element={<Navigate to="/home" />} />
        <Route path="/attainments" element={<Navigate to="/home" />} />
        <Route path="/feedback" element={<Navigate to="/home" />} />
        <Route path="/results" element={<Navigate to="/home" />} />
        <Route path="/reports" element={<Navigate to="/home" />} />
        
        {/* New Student Stubs */}
        <Route path="/course-exit" element={<Navigate to="/home" />} />
        <Route path="/voting" element={<Navigate to="/home" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
