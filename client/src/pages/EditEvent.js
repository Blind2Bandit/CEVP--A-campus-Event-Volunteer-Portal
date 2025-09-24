// src/pages/EditEvent.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', event_date: '', capacity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('Event')
        .select('*')
        .eq('event_id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        navigate('/dashboard'); // Go back if event not found
      } else {
        // Format the date correctly for the input field
        const formattedDate = new Date(data.event_date).toISOString().split('T')[0];
        setFormData({ ...data, event_date: formattedDate });
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from('Event')
    .update({ 
      name: formData.name, 
      event_date: formData.event_date, 
      capacity: formData.capacity 
    })
    .eq('event_id', id);

  if (error) {
    toast.error(`Error updating event: ${error.message}`);
  } else {
    toast.success('Event updated successfully!');
    navigate('/dashboard'); // Go back to the dashboard after updating
  }
};

  if (loading) return <LoadingSpinner />;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Event</h2>
      <input type="text" name="name" value={formData.name} onChange={handleChange} />
      <input type="date" name="event_date" value={formData.event_date} onChange={handleChange} />
      <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} />
      <button type="submit">Update Event</button>
    </form>
  );
};

export default EditEvent;