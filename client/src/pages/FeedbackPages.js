// src/pages/FeedbackPage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
const FeedbackPage = () => {
  const { eventId, signupId } = useParams();
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState('');
  const questionText = "What was your overall experience at the event?"; // Hardcoded question for now

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('Feedback').insert([
      {
        event_id: eventId,
        signup_id: signupId,
        question_text: questionText,
        response_text: responseText,
      }
    ]);

    if (error) {
      toast.error(`Error submitting feedback: ${error.message}`);
    } else {
      toast.success('Thank you for your feedback!');
      navigate('/my-signups');
    }
  };

  return (
    <div>
      <h2>Event Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>{questionText}</label>
        <textarea 
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          required
          rows="4"
          cols="50"
        />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackPage;