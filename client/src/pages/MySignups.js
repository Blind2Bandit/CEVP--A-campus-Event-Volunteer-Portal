// src/pages/MySignups.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
const MySignups = () => {
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignups = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // This query fetches signups and includes the event name from the Event table
        const { data, error } = await supabase
          .from('Signup')
          .select(`
            signup_id,
            event_id,
            Event ( name ) 
          `)
          .eq('volunteer_id', user.id);

        if (error) console.error('Error fetching signups:', error);
        else setSignups(data);
      }
      setLoading(false);
    };
    fetchSignups();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>My Signed Up Events</h2>
      {signups.length > 0 ? (
        <ul>
          {signups.map(signup => (
            <li key={signup.signup_id}>
              {signup.Event.name} - 
              <Link to={`/feedback/${signup.event_id}/${signup.signup_id}`}> Leave Feedback</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't signed up for any events yet.</p>
      )}
    </div>
  );
};

export default MySignups;