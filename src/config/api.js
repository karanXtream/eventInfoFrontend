// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_GOOGLE: `${API_BASE_URL}/api/auth/google`,
  AUTH_ME: `${API_BASE_URL}/api/auth/me`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Events
  EVENTS: `${API_BASE_URL}/api/events`,
  
  // Dashboard
  DASHBOARD_EVENTS: `${API_BASE_URL}/api/dashboard/events`,
  DASHBOARD_STATS: `${API_BASE_URL}/api/dashboard/stats`,
  DASHBOARD_IMPORT: (eventId) => `${API_BASE_URL}/api/dashboard/events/${eventId}/import`,
  
  // Ticket Requests
  TICKET_REQUESTS: `${API_BASE_URL}/api/ticket-requests`,
  
  // Scraping
  SCRAPE_ALL: `${API_BASE_URL}/api/scrape/all`,
};
