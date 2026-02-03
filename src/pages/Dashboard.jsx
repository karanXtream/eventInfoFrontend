import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Filters
  const [filters, setFilters] = useState({
    city: 'Sydney',
    keyword: '',
    startDate: '',
    endDate: '',
    status: ''
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchEvents();
    fetchStats();
  }, [filters.city, filters.status, pagination.page]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      params.append('page', pagination.page);
      params.append('limit', pagination.limit);

      const response = await axios.get(
        `${API_ENDPOINTS.DASHBOARD_EVENTS}?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(response.data.events);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);

      const response = await axios.get(
        `${API_ENDPOINTS.DASHBOARD_STATS}?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchEvents();
  };

  const handleImport = async (eventId) => {
    if (!confirm('Import this event to the platform?')) return;

    try {
      await axios.post(
        API_ENDPOINTS.DASHBOARD_IMPORT(eventId),
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Event imported successfully!');
      fetchEvents();
      fetchStats();
      
      if (selectedEvent && selectedEvent._id === eventId) {
        setSelectedEvent(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to import event');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${status}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <StyledWrapper>
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🎉 EventInfo Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      {stats && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-label">Total Events</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">New</span>
            <span className="stat-value new">{stats.byStatus?.new || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Updated</span>
            <span className="stat-value updated">{stats.byStatus?.updated || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Imported</span>
            <span className="stat-value imported">{stats.byStatus?.imported || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Inactive</span>
            <span className="stat-value inactive">{stats.byStatus?.inactive || 0}</span>
          </div>
        </div>
      )}

      <div className="filters">
        <form onSubmit={handleSearch} className="filter-form">
          <div className="filter-group">
            <label>City</label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">All Cities</option>
              <option value="Sydney">Sydney</option>
              {/* Add more cities as needed */}
            </select>
          </div>

          <div className="filter-group">
            <label>Keyword</label>
            <input
              type="text"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="Search title, venue, description..."
            />
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="updated">Updated</option>
              <option value="inactive">Inactive</option>
              <option value="imported">Imported</option>
            </select>
          </div>

          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </div>

      <div className="content-layout">
        <div className="events-table-container">
          <div className="table-header">
            <h2>Events ({pagination.total})</h2>
          </div>
          
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : (
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    className={selectedEvent?._id === event._id ? 'selected' : ''}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <td className="title-cell">{event.title}</td>
                    <td>{formatDate(event.dateTime)}</td>
                    <td>{event.venue || 'TBA'}</td>
                    <td>
                      <span className={getStatusBadgeClass(event.status)}>
                        {event.status}
                      </span>
                    </td>
                    <td>{event.source?.name}</td>
                    <td>
                      <button
                        className="import-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImport(event._id);
                        }}
                        disabled={event.status === 'imported'}
                      >
                        {event.status === 'imported' ? 'Imported' : 'Import'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </div>

        {selectedEvent && (
          <div className="preview-panel">
            <div className="panel-header">
              <h3>Event Details</h3>
              <button onClick={() => setSelectedEvent(null)}>×</button>
            </div>

            {selectedEvent.imageUrl && (
              <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="event-image" />
            )}

            <div className="panel-content">
              <h2>{selectedEvent.title}</h2>
              
              <div className="detail-row">
                <strong>Status:</strong>
                <span className={getStatusBadgeClass(selectedEvent.status)}>
                  {selectedEvent.status}
                </span>
              </div>

              <div className="detail-row">
                <strong>Date:</strong>
                <span>{formatDate(selectedEvent.dateTime)}</span>
              </div>

              <div className="detail-row">
                <strong>Venue:</strong>
                <span>{selectedEvent.venue || 'TBA'}</span>
              </div>

              {selectedEvent.address && (
                <div className="detail-row">
                  <strong>Address:</strong>
                  <span>{selectedEvent.address}</span>
                </div>
              )}

              <div className="detail-row">
                <strong>Source:</strong>
                <span>{selectedEvent.source?.name}</span>
              </div>

              {selectedEvent.description && (
                <div className="detail-section">
                  <strong>Description:</strong>
                  <p>{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.importedAt && (
                <div className="imported-info">
                  <p><strong>Imported By:</strong> {selectedEvent.importedBy}</p>
                  <p><strong>Imported At:</strong> {formatDate(selectedEvent.importedAt)}</p>
                  {selectedEvent.importNotes && (
                    <p><strong>Notes:</strong> {selectedEvent.importNotes}</p>
                  )}
                </div>
              )}

              <div className="panel-actions">
                <a
                  href={selectedEvent.source?.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-btn"
                >
                  View Original
                </a>
                {selectedEvent.status !== 'imported' && (
                  <button
                    onClick={() => handleImport(selectedEvent._id)}
                    className="import-btn-large"
                  >
                    Import to Platform
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;

  .dashboard-header {
    background: white;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-left h1 {
    margin: 0;
    color: #2d3436;
  }

  .header-left p {
    margin: 5px 0 0;
    color: #636e72;
  }

  .logout-btn {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s ease;
  }

  .logout-btn:hover {
    background: #ee5a52;
  }

  .stats-bar {
    display: flex;
    gap: 20px;
    padding: 20px 40px;
    background: white;
    margin: 20px 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stat-item {
    flex: 1;
    text-align: center;
  }

  .stat-label {
    display: block;
    color: #636e72;
    font-size: 0.9em;
    margin-bottom: 5px;
  }

  .stat-value {
    display: block;
    font-size: 2em;
    font-weight: 700;
    color: #2d3436;
  }

  .stat-value.new { color: #10b981; }
  .stat-value.updated { color: #f59e0b; }
  .stat-value.imported { color: #6366f1; }
  .stat-value.inactive { color: #ef4444; }

  .filters {
    padding: 20px 40px;
  }

  .filter-form {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .filter-group label {
    font-size: 0.9em;
    font-weight: 600;
    color: #2d3436;
  }

  .filter-group input,
  .filter-group select {
    padding: 8px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 0.95em;
  }

  .search-btn {
    background: #667eea;
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.3s ease;
  }

  .search-btn:hover {
    background: #5568d3;
  }

  .content-layout {
    display: flex;
    gap: 20px;
    padding: 0 40px 40px;
  }

  .events-table-container {
    flex: 1;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .table-header {
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
  }

  .table-header h2 {
    margin: 0;
    color: #2d3436;
  }

  .events-table {
    width: 100%;
    border-collapse: collapse;
  }

  .events-table thead {
    background: #f8f9fa;
  }

  .events-table th {
    padding: 15px;
    text-align: left;
    font-weight: 600;
    color: #2d3436;
    border-bottom: 2px solid #e0e0e0;
  }

  .events-table td {
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;
  }

  .events-table tbody tr {
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .events-table tbody tr:hover {
    background: #f8f9fa;
  }

  .events-table tbody tr.selected {
    background: #e3f2fd;
  }

  .title-cell {
    font-weight: 600;
    color: #2d3436;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.85em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-new {
    background: #d1fae5;
    color: #065f46;
  }

  .status-updated {
    background: #fef3c7;
    color: #92400e;
  }

  .status-imported {
    background: #e0e7ff;
    color: #3730a3;
  }

  .status-inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  .import-btn {
    background: #2563eb;
    color: white;
    border: none;
    padding: 6px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9em;
    font-weight: 600;
    transition: background 0.3s ease;
  }

  .import-btn:hover:not(:disabled) {
    background: #1d4ed8;
  }

  .import-btn:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-top: 2px solid #f0f0f0;
  }

  .pagination button {
    padding: 8px 16px;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .pagination button:hover:not(:disabled) {
    border-color: #667eea;
    color: #667eea;
  }

  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .preview-panel {
    width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: calc(100vh - 250px);
    position: sticky;
    top: 20px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 2px solid #f0f0f0;
  }

  .panel-header h3 {
    margin: 0;
    color: #2d3436;
  }

  .panel-header button {
    background: none;
    border: none;
    font-size: 2em;
    cursor: pointer;
    color: #636e72;
  }

  .event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .panel-content {
    padding: 20px;
  }

  .panel-content h2 {
    margin: 0 0 20px;
    color: #2d3436;
  }

  .detail-row {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
  }

  .detail-row strong {
    min-width: 80px;
    color: #636e72;
  }

  .detail-section {
    margin-top: 20px;
  }

  .detail-section p {
    margin-top: 8px;
    line-height: 1.6;
    color: #2d3436;
  }

  .imported-info {
    background: #f0f9ff;
    padding: 15px;
    border-radius: 8px;
    margin-top: 20px;
  }

  .imported-info p {
    margin: 5px 0;
    color: #2d3436;
  }

  .panel-actions {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }

  .view-btn,
  .import-btn-large {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .view-btn {
    background: white;
    border: 2px solid #667eea;
    color: #667eea;
  }

  .view-btn:hover {
    background: #667eea;
    color: white;
  }

  .import-btn-large {
    background: #2563eb;
    color: white;
  }

  .import-btn-large:hover {
    background: #1d4ed8;
  }

  .loading {
    padding: 40px;
    text-align: center;
    color: #636e72;
  }
`;

export default Dashboard;
