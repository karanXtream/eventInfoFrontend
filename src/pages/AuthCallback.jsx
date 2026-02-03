import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token && token.trim() !== '' && token !== 'null' && token !== 'undefined') {
      login(token);
      navigate('/dashboard');
    } else {
      console.error('Invalid or missing token in callback');
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div className="spinner"></div>
      <p>Authenticating...</p>
    </div>
  );
};

export default AuthCallback;
