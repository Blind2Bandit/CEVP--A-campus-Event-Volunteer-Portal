// src/pages/EventDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .eq('event_id', id)
        .single();

      if (error) {
        console.error('Error fetching event details:', error);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  // This is the signup logic we moved here
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

  if (loading) return <LoadingSpinner />;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="card">
      <h2>{event.name}</h2>
      <p><strong>Date:</strong> {new Date(event.event_date).toLocaleDateString()}</p>
      <p><strong>Capacity:</strong> {event.capacity}</p>
      <p><strong>Location ID:</strong> {event.location_id}</p>
      <p><strong>Organizer ID:</strong> {event.organizer_id}</p>
      <hr />
      {/* Add the signup button here */}
      <button onClick={handleSignUp} className="button">
        Sign Up for this Event
      </button>
    </div>
  );
};

export default EventDetails;