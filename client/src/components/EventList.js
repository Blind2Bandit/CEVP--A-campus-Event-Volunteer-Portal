// src/components/EventList.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import your client
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Define an async function to fetch events
    const getEvents = async () => {
      const { data, error } = await supabase.from('Event').select('*');
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };

    getEvents(); // Call the function
  }, []); // The empty array [] means this effect runs once on component mount

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Upcoming Events</h1>
        <p className="page-subtitle">Discover and join exciting campus events</p>
      </div>
      <div className="event-grid">
        {events.map(event => (
          <EventCard key={event.event_id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;