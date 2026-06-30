import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Maintenance from './pages/Maintenance';
import Notifications from './pages/Notifications';

import StudentDashboard from './pages/student/StudentDashboard';
import StudentJobs from './pages/student/StudentJobs';
import StudentApplications from './pages/student/StudentApplications';
import StudentProfile from './pages/student/StudentProfile';
import StudentInterviews from './pages/student/StudentInterviews';

import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterJobs from './pages/recruiter/RecruiterJobs';
import PostJob from './pages/recruiter/PostJob';
import JobApplicants from './pages/recruiter/JobApplicants';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminJobs from './pages/admin/AdminJobs';
import AdminReports from './pages/admin/AdminReports';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

function App() {
  const { user } = useAuth();
  const [maintenance, setMaintenance] = useState({ enabled: false });

  useEffect(() => {
    let isMounted = true;

    const loadMaintenance = async () => {
      try {
        const { data } = await api.get('/admin/maintenance/status');
        if (isMounted) setMaintenance(data);
      } catch {
        if (isMounted) setMaintenance({ enabled: false });
      }
    };

    loadMaintenance();
    const timer = window.setInterval(loadMaintenance, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  if (maintenance.enabled && user?.role !== 'admin') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Maintenance status={maintenance} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/student/*" element={
        <ProtectedRoute role="student">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="jobs" element={<StudentJobs />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="interviews" element={<StudentInterviews />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<StudentProfile />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/recruiter/*" element={
        <ProtectedRoute role="recruiter">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<RecruiterDashboard />} />
              <Route path="jobs" element={<RecruiterJobs />} />
              <Route path="post-job" element={<PostJob />} />
              <Route path="jobs/:jobId/applicants" element={<JobApplicants />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<RecruiterProfile />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/*" element={
        <ProtectedRoute role="admin">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="recruiters" element={<AdminRecruiters />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="notifications" element={<Notifications />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
