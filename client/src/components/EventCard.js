// src/components/EventCard.js
import React from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom'; // Import the Link component
import { toast } from 'react-toastify';
const EventCard = ({ event }) => {
  // Add this check: If there's no event prop, render nothing to avoid a crash.
  if (!event) {
    return null;
  }

  const handleSignUp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to sign up for an event.');
      return;
    }
    const isConfirmed = window.confirm(`Are you sure you want to sign up for "${event.name}"?`);
    if (isConfirmed) {
      const { error } = await supabase.rpc('handle_signup', {
        event_id_to_check: event.event_id,
        volunteer_id_to_add: user.id
      });
      if (error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.success('You have successfully signed up!');
      }
    }
  };

  return (
    <div className="card">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ 
          margin: '0 0 0.75rem 0', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, var(--primary-400) 0%, var(--accent-400) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>{event.name}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--dark-200)', fontSize: '0.95rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--gold-400)' }}>📅</span>
            {new Date(event.event_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-400)' }}>📍</span>
            Location: {event.location_id}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={handleSignUp} className="button" style={{ flex: '1' }}>Sign Up</button>
        <Link to={`/event/${event.event_id}`} className="button button-secondary">View Details</Link>
      </div>
    </div>
  );
};

export default EventCard;


