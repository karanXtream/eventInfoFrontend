# EventInfo Frontend - React + Vite

A modern React application built with Vite for viewing upcoming events in Sydney scraped from multiple sources.

## Features

- ⚛️ Built with React 18
- ⚡ Powered by Vite for fast development
- 🎨 Beautiful gradient UI design
- 📱 Fully responsive layout
- 🔄 Real-time event fetching with Axios
- 🎯 Filter by source (All, Eventbrite, City of Sydney)
- ✨ Smooth animations and transitions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:3000

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

## Running the Application

### Development Mode

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component styles
│   ├── index.css        # Global styles
│   └── main.jsx         # Application entry point
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## API Integration

The frontend connects to the backend API at `http://localhost:3000/api/events`

Endpoints used:
- `/all` - Fetch all events from all sources
- `/eventbrite` - Fetch only Eventbrite events
- `/cityofsydney` - Fetch only City of Sydney events

## Configuration

To change the backend API URL, edit the `API_BASE_URL` constant in `src/App.jsx`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api/events'
```

## Technologies Used

- **React** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Styling with animations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

**Error: Cannot fetch events**
- Ensure the backend server is running on `http://localhost:3000`
- Check CORS is enabled in the backend
- Verify network connectivity

**Port 5173 already in use**
- Stop other Vite instances or change the port in `vite.config.js`

