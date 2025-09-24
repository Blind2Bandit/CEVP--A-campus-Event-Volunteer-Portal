// src/components/CreateEvent.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
const CreateEvent = () => {
  const [formData, setFormData] = useState({
    name: '',
    event_date: '',
    location_id: '',
    organizer_id: '',
    capacity: 50,
  });
  const [locations, setLocations] = useState([]);
  const [organizers, setOrganizers] = useState([]);

  // Fetch locations and organizers for dropdowns
  useEffect(() => {
    const fetchData = async () => {
      const { data: locationsData } = await supabase.from('EventLocation').select('*');
      setLocations(locationsData || []);

      const { data: organizersData } = await supabase.from('Organizer').select('*');
      setOrganizers(organizersData || []);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('Event').insert([
    {
      name: formData.name,
      event_date: formData.event_date,
      location_id: formData.location_id,
      organizer_id: formData.organizer_id,
      capacity: formData.capacity,
      creator_id: user.id, // Add the creator's ID here
    },
  ]);

  if (error) {
    toast.error(`Error creating event: ${error.message}`);
  } else {
    toast.success('Event created successfully!');
    // ... (rest of the function)
  }
};

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Create New Event</h1>
        <p className="page-subtitle">Set up your campus event details</p>
      </div>
      
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Event Name</label>
            <input 
              type="text" 
              id="name"
              name="name" 
              placeholder="Enter event name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="event_date">Event Date</label>
            <input 
              type="date" 
              id="event_date"
              name="event_date" 
              value={formData.event_date} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input 
              type="number" 
              id="capacity"
              name="capacity" 
              placeholder="Maximum attendees" 
              value={formData.capacity} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="location_id">Location</label>
            <select id="location_id" name="location_id" value={formData.location_id} onChange={handleChange} required>
              <option value="">Select a Location</option>
              {locations.map(loc => <option key={loc.location_id} value={loc.location_id}>{loc.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="organizer_id">Organizer</label>
            <select id="organizer_id" name="organizer_id" value={formData.organizer_id} onChange={handleChange} required>
              <option value="">Select an Organizer</option>
              {organizers.map(org => <option key={org.organizer_id} value={org.organizer_id}>{org.name}</option>)}
            </select>
          </div>

          <button type="submit" className="button" style={{ width: '100%', marginTop: '1rem' }}>Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;