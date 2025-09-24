// src/pages/CertificatePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import LoadingSpinner from '../components/LoadingSpinner';
const CertificatePage = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      const { data, error } = await supabase
        .from('Certificate')
        .select(`
          issue_date,
          Signup (
            Volunteer ( name ),
            Event ( name )
          )
        `)
        .eq('certificate_id', id)
        .single();

      if (error) console.error('Error fetching certificate:', error);
      else setCertificate(data);

      setLoading(false);
    };
    fetchCertificate();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!certificate) return <p>Certificate not found.</p>;

  const volunteerName = certificate.Signup.Volunteer.name;
  const eventName = certificate.Signup.Event.name;

  return (
    <div style={{ border: '10px solid #ccc', padding: '50px', margin: '20px auto', maxWidth: '800px', textAlign: 'center' }}>
      <h1 style={{ color: '#007bff' }}>Certificate of Participation</h1>
      <p style={{ fontSize: '20px' }}>This is to certify that</p>
      <h2 style={{ fontSize: '36px', margin: '20px 0' }}>____________{volunteerName}</h2>
      <p style={{ fontSize: '20px' }}>has successfully volunteered for the event</p>
      <h3 style={{ fontSize: '28px', margin: '20px 0' }}>{eventName}</h3>
      <p>Issued on: {new Date(certificate.issue_date).toLocaleDateString()}</p>
    </div>
  );
};

export default CertificatePage;