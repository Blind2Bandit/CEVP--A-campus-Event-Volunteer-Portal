// src/pages/OrganizerDashboard.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
const OrganizerDashboard = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(null); // 2. Add state for loading indicator
  const navigate = useNavigate(); // 3. Initialize the navigate function

  useEffect(() => {
    const fetchMyEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('Event')
          .select(`*, Signup (*, Volunteer ( name ))`)
          .eq('creator_id', user.id);
        if (error) console.error('Error fetching events:', error);
        else setMyEvents(data);
      }
      setLoading(false);
    };
    fetchMyEvents();
  }, []);

  const handleGenerateCertificate = async (signup) => {
    try {
      setIsGenerating(signup.signup_id); // 4. Set loading state
      
      // 5. Insert a new row and select it back to get the ID
      const { data, error } = await supabase
        .from('Certificate')
        .insert({ signup_id: signup.signup_id })
        .select()
        .single();

      if (error) throw error;
      
      // 6. Navigate to the new certificate page using its ID
      navigate(`/certificate/${data.certificate_id}`);

    } catch (error) {
      toast.error(`Error creating certificate record: ${error.message}`);
    } finally {
      setIsGenerating(null); // 7. Reset loading state
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2>My Events Dashboard</h2>
      {myEvents.map(event => (
        <div key={event.event_id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3>{event.name}</h3>
            <div>
              <Link to={`/event/${event.event_id}/edit`}><button>Edit</button></Link>
            </div>
          </div>
          <h4>Volunteers Signed Up:</h4>
          {event.Signup.length > 0 ? (
            <ul>
              {event.Signup.map(signup => (
                <li key={signup.signup_id}>
                  {signup.Volunteer.name}
                  <button 
                    onClick={() => handleGenerateCertificate(signup)} 
                    disabled={isGenerating === signup.signup_id}
                    style={{ marginLeft: '10px' }}
                  >
                    {isGenerating === signup.signup_id ? 'Generating...' : 'Generate Certificate'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No volunteers have signed up for this event yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrganizerDashboard;