import React from 'react';
import styled from 'styled-components';
import { API_ENDPOINTS } from '../config/api';

const Login = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth
    window.location.href = API_ENDPOINTS.AUTH_GOOGLE;
  };

  return (
    <StyledWrapper>
      <div className="login-container">
        <div className="login-card">
          <h1>🎉 EventInfo Sydney</h1>
          <h2>Dashboard Login</h2>
          <p className="description">
            Sign in with your Google account to access the admin dashboard
          </p>

          <button onClick={handleGoogleLogin} className="google-btn">
            <img src="/signInsvg.svg" alt="Google" />
            <span>Sign in with Google</span>
          </button>

          <p className="info-text">
            Access to event management, import functionality, and analytics
          </p>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .login-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .login-card {
    background: white;
    padding: 60px 40px;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    text-align: center;
    max-width: 450px;
    width: 90%;
  }

  h1 {
    font-size: 2.5em;
    margin-bottom: 10px;
    color: #2d3436;
  }

  h2 {
    font-size: 1.5em;
    color: #667eea;
    margin-bottom: 20px;
  }

  .description {
    color: #636e72;
    margin-bottom: 40px;
    line-height: 1.6;
  }

  .google-btn {
    width: 100%;
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    cursor: pointer;
    font-size: 1.1em;
    font-weight: 600;
    color: #2d3436;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .google-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #667eea;
  }

  .google-btn img {
    width: 24px;
    height: 24px;
  }

  .info-text {
    margin-top: 30px;
    color: #636e72;
    font-size: 0.9em;
  }
`;

export default Login;
