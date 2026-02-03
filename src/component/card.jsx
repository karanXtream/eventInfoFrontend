import React, { useState } from 'react';
import styled from 'styled-components';
import TicketModal from './TicketModal';

const Card = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log("event",event)
  // Sample event data structure if not provided
  const eventData = event || {
    title: 'Sample Event Name',
    dateTime: '2026-03-15T18:00:00',
    venue: 'Sydney Opera House',
    description: 'Join us for an amazing experience featuring live performances, food, and entertainment.',
    source: {
      name: 'Eventbrite',
      eventUrl: '#'
    },
    imageUrl: null
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <StyledWrapper>
        <article className="card">
          {eventData.status && (
            <div className={`status-bar status-${eventData.status.toLowerCase()}`}>
              {eventData.status === 'new' && '🆕 New Event'}
              {eventData.status === 'updated' && '🔄 Updated'}
              {eventData.status === 'unchanged' && '✓ Verified'}
            </div>
          )}
          <div className="card-img">
            {eventData.imageUrl ? (
              <img src={eventData.imageUrl} alt={eventData.title} className="card-imgs" />
            ) : (
              <div className="card-imgs pv delete" />
            )}
          </div>
          <div className="project-info">
            <div className="flex">
              <div className="project-title">{eventData.title}</div>
              <span className="tag">{eventData.source.name}</span>
            </div>
            
            <div className="event-details">
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-text">{formatDate(eventData.dateTime)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <span className="detail-text">{eventData.venue || 'Venue TBA'}</span>
              </div>
            </div>

            <p className="lighter description">
              {eventData.description?.substring(0, 100) || 'No description available'}
              {eventData.description?.length > 100 && '...'}
            </p>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="get-tickets-btn"
            >
              GET TICKETS
            </button>
          </div>
        </article>
      </StyledWrapper>

      <TicketModal 
        event={eventData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

const StyledWrapper = styled.div`
  .status-bar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 6px 12px;
    text-align: center;
    font-size: 0.75em;
    font-weight: 600;
    border-radius: 12px 12px 0 0;
    z-index: 10;
  }

  .status-new {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  }

  .status-updated {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
  }

  .status-unchanged {
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: white;
  }

  .project-info {
    padding: 20px 30px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    top: 0px;
  }

  .project-title {
    font-weight: 600;
    font-size: 1.3em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    color: #2d3436;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .lighter {
    font-size: 0.9em;
    color: #636e72;
    line-height: 1.5;
  }

  .description {
    margin: 5px 0;
  }

  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .tag {
    font-weight: 600;
    color: white;
    background: #667eea;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75em;
  }

  .event-details {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 5px 0;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .detail-icon {
    font-size: 1.1em;
  }

  .detail-text {
    font-size: 0.9em;
    color: #2d3436;
    font-weight: 500;
  }

  .get-tickets-btn {
    background: #2563eb;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    text-align: center;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9em;
    transition: all 0.3s ease;
    margin-top: 10px;
    cursor: pointer;
    border: none;
    display: block;
  }

  .get-tickets-btn:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  /*DELETE THIS TWO LINE*/
  .delete {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .card-img div {
    width: 40%;
  }
  /*IF USING IMAGES*/

  .card {
    background-color: white;
    color: black;
    width: 310px;
    min-height: 350px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    position: relative;
    overflow: hidden;
  }

  .card:hover {
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  }

  .card-img {
    position: relative;
    top: 0px;
    height: 140px;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  /* Change the .card-img div to .card-img img to use img*/
  .card-img img,
  .card-img div {
    height: 140px;
    width: 100%;
    /* Change this width here to change the width of the color/image */
    object-fit: cover;
    border-radius: 0px;
    box-shadow: none;
  }

  .card-imgs {
    transition: all 0.5s;
  }`;

export default Card;
