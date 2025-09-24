// src/components/Navbar.js
import React from 'react';
import { supabase } from '../supabaseClient';
// Add this import at the top
import { Link } from 'react-router-dom';
import { useUserProfile } from '../context/UserProfileContext';


const Navbar = () => {
  const { profile } = useUserProfile(); 
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <span className="navbar-brand">CEVP</span>
        <div className="nav-links">
          <Link to="/">Events</Link>
          <Link to="/my-signups">My Signups</Link>
          {profile && profile.role === 'organizer' && (
            <>
              <Link to="/create-event">Create Event</Link>
              <Link to="/dashboard">Dashboard</Link>
            </>
          )}
        </div>
        <button onClick={handleLogout} className="button button-delete">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;