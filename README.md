# Explore with Genie

Explore with Genie is a web-based tourism platform designed to help travelers explore destinations in Bangladesh, find travel information, communicate with agencies, and manage bookings from one place. The system also provides separate dashboards for tourists, agencies, and administrators.

## Overview

Travel information is often spread across blogs, social media pages, maps, and agency posts. This project brings those services together in a single platform where users can browse tourist spots, check destination details, view tour packages, ask travel-related questions, write reviews, send inquiries, and request bookings. Agencies can manage packages and respond to tourists, while admins can monitor platform activity and moderate content.

## Features

### Tourist features

- Secure signup and login
- Profile management with travel preferences
- Browse tourist spots in Bangladesh by category
- View destination details, budget, visiting time, and safety tips
- Route guidance through maps
- Personalized destination recommendations
- Reviews and ratings
- Tour package browsing and booking requests
- Agency inquiry submission
- Booking status updates and inquiry replies in the profile section
- Bangla and English language support
- Travel chatbot support

### Agency features

- Agency dashboard access
- Add and manage tour packages
- Review booking requests
- Accept or reject bookings
- Receive and reply to tourist inquiries

### Admin features

- Protected admin dashboard
- View users and platform activity
- View available packages
- Moderate reviews and content

## Technology stack

- Frontend: React, React Router, Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- Maps: Google Maps Embed API, Leaflet, React Leaflet, Leaflet Routing Machine
- External service integration: OpenAI-compatible API

## Project structure

```text
ExploreWithGenie/
|-- backend/
|   |-- controllers/
|   |-- data/
|   |-- models/
|   |-- routes/
|   |-- uploads/
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   `-- utils/
|-- index.js
`-- package.json
```

## Important modules

### Frontend

- `frontend/src/pages/Home.jsx` for the landing page
- `frontend/src/pages/Bangladesh.jsx` for browsing tourist spots
- `frontend/src/pages/SpotDetails.jsx` for destination details
- `frontend/src/pages/TourPackages.jsx` for package browsing and booking
- `frontend/src/pages/Profile.jsx` for profile management, booking updates, and inquiry replies
- `frontend/src/pages/AdminDashboard.jsx` for admin operations
- `frontend/src/pages/AgencyDashboard.jsx` for agency operations
- `frontend/src/components/Chatbot.jsx` for chatbot interaction
- `frontend/src/components/MapComponent.jsx` for route display
- `frontend/src/components/Recommendation.jsx` for personalized recommendations

### Backend

- `backend/controllers/authController.js` for authentication, profile updates, and user preferences
- `backend/controllers/packageController.js` for package management
- `backend/controllers/bookingController.js` for booking requests and booking status flow
- `backend/controllers/agencyController.js` for agency actions and inquiry handling
- `backend/controllers/adminController.js` for admin functions
- `backend/controllers/reviewcontroller.js` for review operations
- `backend/server.js` for server setup, route registration, chat, and translation endpoints

## Access control

The application uses role-based access control.

- Public users can access general pages, signup, login, and package browsing
- Tourist-only pages require authentication
- Agency dashboard access is limited to users with the `agency` role
- Admin dashboard access is limited to users with the `admin` role

Frontend route guards protect restricted pages, and backend authorization logic protects sensitive actions.

## Booking flow

1. A tourist selects a package and submits a booking request.
2. The request is stored with the related package and agency information.
3. The agency reviews the request from the dashboard.
4. The agency accepts or rejects the booking.
5. The tourist sees the updated booking status in the profile section.

## Inquiry flow

1. A tourist sends an inquiry related to a package or agency.
2. The inquiry is routed to the correct agency.
3. The agency sends a reply from the dashboard.
4. The tourist can view the reply from the profile page.

## Language and assistant support

The system supports both Bangla and English. It also includes a chatbot for travel-related help and a translation endpoint for Bangla-to-English and English-to-Bangla text conversion. When the external service is unavailable, the backend uses fallback responses so the feature remains usable.

## Environment variables

Create a `backend/.env` file with the following values:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_api_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=gpt-4o-mini
```

Create a `frontend/.env` file if you want to use Google Maps embedded directions:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Installation

Clone the repository and install dependencies for the root, backend, and frontend.

```bash
git clone <repository-url>
cd ExploreWithGenie
npm install
cd backend
npm install
cd ../frontend
npm install
```

## Run locally

Start the backend server:

```bash
cd backend
npm start
```

Backend default URL:

```text
http://localhost:5000
```

Start the frontend in a separate terminal:

```bash
cd frontend
npm start
```

Frontend default URL:

```text
http://localhost:3000
```

## Available scripts

### Backend

```bash
npm start
```

### Frontend

```bash
npm start
npm run build
npm test
```

## API route groups

- `/api/auth`
- `/api/admin`
- `/api/agency`
- `/api/packages`
- `/api/bookings`
- `/api/reviews`
- `/api/chat`
- `/api/translate`

## Team

- Suraiya Rahman Sujan - `0242310005341004`
- Erin Jahan Eshita - `0242310005341074`
- Abidur Rahman Jisan - `0242310005341333`

## Future improvements

- Expand destination coverage beyond Bangladesh
- Add payment integration for package booking
- Improve automated testing coverage
- Add richer notification history
- Improve recommendation quality with more user activity signals

## License

This project was developed for academic use.
