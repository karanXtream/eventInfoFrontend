import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const TicketModal = ({ event, isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setError('Please agree to receive event updates');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        email,
        consent,
        eventId: event._id,
        eventTitle: event.title,
        eventUrl: event.source.eventUrl
      };
      console.log("emial ", email)
      console.log('Sending payload:', payload);
      console.log('API URL:', API_ENDPOINTS.TICKET_REQUESTS);
      
      const response = await axios.post(API_ENDPOINTS.TICKET_REQUESTS, payload);

      console.log('Ticket request successful:', response.data);

      // Show success message
      setSuccess(true);
      setLoading(false);

      // Wait 2 seconds before redirecting
      setTimeout(() => {
        // Redirect to the original event page
        window.open(event.source.eventUrl, '_blank');
        onClose();
        // Reset form
        setEmail('');
        setConsent(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error submitting ticket request:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledWrapper onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        
        <h2>Get Tickets for</h2>
        <h3>{event.title}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <label htmlFor="consent">
              I agree to receive event updates by email
            </label>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          {success && (
            <div className="success-message">
              ✓ Success! Your request has been saved. Redirecting to event page...
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading || success}>
            {loading ? 'Submitting...' : success ? 'Redirecting...' : 'Continue to Event Page'}
          </button>
        </form>

        <p className="privacy-note">
          Your email will only be used for event updates. We respect your privacy.
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .modal-content {
    background: white;
    border-radius: 16px;
    padding: 40px;
    max-width: 500px;
    width: 90%;
    position: relative;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    color: #636e72;
    transition: color 0.3s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: #2d3436;
  }

  h2 {
    color: #2d3436;
    margin-bottom: 10px;
    font-size: 1.5em;
  }

  h3 {
    color: #667eea;
    margin-bottom: 30px;
    font-size: 1.2em;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    display: block;
    color: #2d3436;
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 0.95em;
  }

  input[type="email"] {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1em;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }

  input[type="email"]:focus {
    outline: none;
    border-color: #667eea;
  }

  .checkbox-group {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 20px;
  }

  input[type="checkbox"] {
    margin-top: 4px;
    width: 18px;
    height: 18px;
    cursor: pointer;
  }

  .checkbox-group label {
    margin-bottom: 0;
    font-weight: 400;
    cursor: pointer;
    flex: 1;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.9em;
  }

  .success-message {
    background: #d4edda;
    color: #155724;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 20px;
    font-size: 0.9em;
    font-weight: 600;
    text-align: center;
    animation: slideIn 0.3s ease;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .submit-btn {
    width: 100%;
    background: #2563eb;
    color: white;
    padding: 14px 20px;
    border: none;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  .submit-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  .privacy-note {
    text-align: center;
    color: #636e72;
    font-size: 0.85em;
    margin-top: 20px;
  }
`;

export default TicketModal;
