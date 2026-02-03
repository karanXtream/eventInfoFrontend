import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'
import Card from './component/card'
import { useAuth } from './context/AuthContext'
import { API_ENDPOINTS } from './config/api'

function App() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const fetchEvents = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Fetching from:', API_ENDPOINTS.EVENTS)
      const response = await axios.get(API_ENDPOINTS.EVENTS)
      console.log('Fetched events:', response.data.events?.length || 0)
      setEvents(response.data.events || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      setError(err.message || 'Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    logout()
    navigate('/')
    setDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🎉 EventInfo Sydney</h1>
            <p className="subtitle">Discover upcoming events in Sydney</p>
          </div>
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <div className="user-profile" onClick={toggleDropdown}>
                <img 
                  src={user?.picture || "/avatar1"} 
                  alt={user?.name} 
                  className="user-avatar"
                />
                <span className="user-name">{user?.name}</span>
                <span className="dropdown-arrow">{dropdownOpen ? '▲' : '▼'}</span>
              </div>
              
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <span className="dropdown-icon">📊</span>
                    <span>Dashboard</span>
                  </Link>
                  <button className="dropdown-item" onClick={handleSignOut}>
                    <span className="dropdown-icon">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="sign-in-btn" aria-label="Sign In" onClick={() => window.location.href = '/login'}>
              <img src="/signInsvg.svg" alt="Sign In" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading events...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>⚠️ Error:</strong> {error}
          <br />
          <small>Make sure the backend server is running on http://localhost:5000</small>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="no-events">
          <p>No events found. The database might be empty.</p>
          <p>Try running the scraper first: POST http://localhost:5000/api/scrape/all</p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="events-container">
          {events.map((event, index) => (
            <Card key={event._id || index} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
