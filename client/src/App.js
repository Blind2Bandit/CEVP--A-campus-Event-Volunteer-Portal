// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom'; // Import Outlet and Navigate
import { supabase } from './supabaseClient';
import Auth from './components/Auth';
import EventList from './components/EventList';
import Navbar from './components/Navbar';
import EventDetails from './pages/EventDetails';
import CreateEvent from './components/CreateEvent';
import OrganizerDashboard from './pages/OrganizerDashboard';
import EditEvent from './pages/EditEvent';
import MySignups from './pages/MySignups';
import FeedbackPage from './pages/FeedbackPages';
import CertificatePage from './pages/CertificatePage';
import { UserProfileProvider } from './context/UserProfileContext';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
// A simple layout component for all protected pages
const AppLayout = () => (
  <>
    <Navbar />
    <main style={{ padding: '20px' }}>
      <Outlet /> {/* Child routes will render here */}
    </main>
  </>
);

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading message while checking for session
  }

  return (
    <UserProfileProvider>
              <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      <div className = "container">
                <Routes>
        {/* Public Routes */}
        <Route path="/certificate/:id" element={<CertificatePage />} />
        <Route path="/login" element={!session ? <Auth /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route 
          path="/*" 
          element={session ? <AppLayout /> : <Navigate to="/login" />}
        >
          <Route path="" element={<EventList />} />
          <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="event/:id/edit" element={<EditEvent />} />
          <Route path="my-signups" element={<MySignups />} />
          <Route path="feedback/:eventId/:signupId" element={<FeedbackPage />} />
        </Route>
      </Routes>
      </div>
    </UserProfileProvider>
  );
}

export default App;