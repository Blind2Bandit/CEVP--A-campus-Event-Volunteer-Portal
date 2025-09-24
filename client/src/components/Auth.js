// src/components/Auth.js
import React from 'react';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Welcome to CEVP</h1>
        <p className="page-subtitle">Sign in to manage your campus events</p>
      </div>
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          style: {
            button: {
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              border: 'none',
              borderRadius: '0.75rem',
              fontWeight: '600',
              padding: '1rem 2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease',
              color: '#FFFFFF'
            },
            input: {
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF'
            },
            container: {
              background: 'transparent'
            },
            label: {
              color: '#D1D5DB',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontSize: '0.875rem'
            }
          }
        }}
        providers={['github']}
      />
    </div>
  );
};

export default Auth;